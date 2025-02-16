const express = require("express");
const router = express.Router();
const model_company = require("../../models/model_company");
const c_employee = require("./controller_employee");
const validator = require("validator");

router.use("/employee", c_employee);


function validateCompanyData(data) {
  const errors = [];

  if (
    !data.company_name ||
    !validator.isLength(data.company_name, { min: 1, max: 100 })
  ) {
    errors.push(
      "Company name is required and must be between 1 and 100 characters."
    );
  }

  if (
    !data.company_address ||
    !validator.isLength(data.company_address, { min: 1, max: 255 })
  ) {
    errors.push(
      "Company address is required and must be between 1 and 255 characters."
    );
  }

  if (!data.company_phone || !validator.isMobilePhone(data.company_phone)) {
    errors.push("Company phone is required and must be a valid phone number.");
  }

  return errors;
}



router.post("/insert", async (req, res) => {
  try {
    const company_name = req.body.company_name;
    const company_address = req.body.company_address;
    const company_phone = req.body.company_phone;
    const data = {
      company_name,
      company_address,
      company_phone,
    };

    const validationErrors = validateCompanyData(data);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", messages: validationErrors });
    }

    await model_company.insert(data);
    return res.redirect("/company");
  } catch (error) {}
  var end = new Date() - start;
  res.status(200);
});

router.post("/addEdit", async (req, res) => {
  const action = req.body.tableAction;
  const id = req.body.company_id;

  if (action === "add") {
    return res.status(200).render("pages/add_edit_company_page", {
      addOrEdit: action,
    });
  } else if (action === "edit") {
    const start = new Date();
    try {
      const [company, error] = await model_company.getById(id);
      console.log("Company Data:", company);

      return res.status(200).render("pages/add_edit_company_page", {
        addOrEdit: action,
        company,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error finding the company",
        message: error.message,
      });
    }
  }
});

router.post("/addEdit/edit", async (req, res) => {
  try {
    const id = req.body.company_id;
    const name = req.body.company_name;
    const address = req.body.company_address;
    const phone = req.body.company_phone;

    // Prepare data for validation
    const data = {
      company_name: name,
      company_address: address,
      company_phone: phone,
    };

    const validationErrors = validateCompanyData(data);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", messages: validationErrors });
    }
    
    const [company, error] = await model_company.edit(id, name, address, phone);
    const [companies] = await model_company.get();

    return res.status(200).render("pages/company_list_page", {
      companies,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error editing the company",
      message: error.message,
    });
  }
});

router.put("/delete", async (req, res) => {
  const id = req.body.company_id;
  const start = new Date();

  try {
    const [company, error] = await model_company.delete(id);
    console.log("Company Data:", company);

    const [companies, err] = await model_company.get();
    return res.redirect("/company");
  } catch (error) {
    return res.status(500).json({
      error: "Error deleting!",
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  const start = new Date();
  try {
    const [companies, error] = await model_company.get();

    if (error) {
      throw error;
    }

    return res.status(200).render("pages/company_list_page", {
      companies,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error loading companies",
      message: error.message,
    });
  }
});

module.exports = router;
