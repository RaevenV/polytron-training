const express = require("express");
const router = express.Router();
const model_company = require("../../models/model_company");
const c_employee = require("./controller_employee");
const validator = require("validator");

router.use("/employee", c_employee);

//function untuk men-sanitize input dari user sehingga tidak mencakup REGEXP, serta mereplace simbol-simbol menjadi
//entity html, dan menghindari SQL injection.
function sanitizeInput(data) {
  return {
    company_name: validator.escape(data.company_name || ""),
    company_phone: validator.escape(data.company_phone || ""),
    company_address: validator.escape(data.company_address || ""),
  };
}

//function untuk melakukan validasi terhadap input user yang sudah di sanitize menggunakan library validator
function validateCompanyData(data) {
  const errors = [];

  if (!data.company_name) {
    errors.push("Company name is required");
  } else if (!validator.isLength(data.company_name, { min: 1, max: 100 })) {
    errors.push("Company name must be between 1 and 100 characters");
  }

  if (!data.company_address) {
    errors.push("Company address is required");
  } else if (!validator.isLength(data.company_address, { min: 1, max: 255 })) {
    errors.push("Company address must be between 1 and 255 characters");
  }

  if (!data.company_phone) {
    errors.push("Company phone is required");
  } else if (!validator.isMobilePhone(data.company_phone)) {
    errors.push("Please enter a valid phone number");
  }

  return errors;
}

// route untuk menjalankan function insert di model, tetapi terdapat validasi data melalui sanitation dan validation logic
// terlebih dahulu
router.post("/addEdit/insert", async (req, res) => {
  try {
    const data = sanitizeInput({
      company_name: req.body.company_name,
      company_address: req.body.company_address,
      company_phone: req.body.company_phone,
    });

    const validationErrors = validateCompanyData(data);
    if (validationErrors.length > 0) {
      return res.status(400).render("pages/add_edit_company_page", {
        addOrEdit: "add",
        errors: validationErrors,
        company: data,
      });
    }

    await model_company.insert(data);
    return res.redirect("/company");
  } catch (error) {
    return res.status(500).render("pages/add_edit_company_page", {
      addOrEdit: "add",
      errors: ["An error occurred while saving the company. Please try again."],
      company: req.body,
    });
  }
});

// Karena add dan edit employee saya satukan menjadi satu page, maka ada extra logic untuk memastikan
// user ingin melakukan operasi add/edit. Dilakukan pengecekan menggunakan hidden input
// dengan value tableAction yang berisi "add" / "edit".
// jika edit, maka akan menggunakan company_id untuk mengambil data company dan menampilkan pada page edit
router.post("/addEdit", async (req, res) => {
  try {
    const action = req.body.tableAction;
    const id = req.body.company_id;
    const errors = req.body.errors || [];

    if (action === "add") {
      return res.status(200).render("pages/add_edit_company_page", {
        addOrEdit: action,
        errors,
        company: null,
      });
    } else if (action === "edit") {
      const [company, error] = await model_company.getById(id);

      if (error) {
        throw new Error("Failed to fetch company data");
      }

      return res.status(200).render("pages/add_edit_company_page", {
        addOrEdit: action,
        company,
        errors,
      });
    }
  } catch (error) {
    return res.status(500).render("pages/add_edit_company_page", {
      addOrEdit: req.body.tableAction || "add",
      errors: [error.message],
      company: null,
    });
  }
});

// Route post untuk melakukan edit, dilakukan juga validation dan sanitation sebelum mengirim data
router.post("/addEdit/edit", async (req, res) => {
  try {
    const id = req.body.company_id;
    const data = sanitizeInput({
      company_name: req.body.company_name,
      company_address: req.body.company_address,
      company_phone: req.body.company_phone,
    });

    const validationErrors = validateCompanyData(data);
    if (validationErrors.length > 0) {
      const [company, error] = await model_company.getById(id);

      return res.status(400).render("pages/add_edit_company_page", {
        addOrEdit: "edit",
        errors: validationErrors,
        company,
      });
    }

    await model_company.edit(
      id,
      data.company_name,
      data.company_address,
      data.company_phone
    );
    return res.redirect("/company");
  } catch (error) {
    const companyData = {
      company_id: req.body.company_id,
      company_name: req.body.company_name,
      company_address: req.body.company_address,
      company_phone: req.body.company_phone,
    };

    return res.status(500).render("pages/add_edit_company_page", {
      addOrEdit: "edit",
      errors: [
        "An error occurred while updating the company. Please try again.",
      ],
      company: companyData,
    });
  }
});

//deletion function seperti biasa, dilakukan menggunakan id
router.put("/delete", async (req, res) => {
  try {
    const id = req.body.company_id;
    await model_company.delete(id);
    return res.redirect("/company");
  } catch (error) {
    return res.status(500).json({
      error: "Error deleting company",
      message: error.message,
    });
  }
});

//function halaman utama untuk mengambil data seluruh company yang ada untuk ditampilkan
router.get("/", async (req, res) => {
  try {
    const [companies, error] = await model_company.get();

    if (error) {
      throw error;
    }

    return res.status(200).render("pages/company_list_page", {
      companies,
      errors: [],
    });
  } catch (error) {
    return res.status(500).render("pages/company_list_page", {
      companies: [],
      errors: ["Error loading companies. Please try again."],
    });
  }
});

module.exports = router;
