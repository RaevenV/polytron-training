const express = require("express");
const router = express.Router();
const model_employee = require("../../models/model_employee");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      req.fileValidationError =
        "Only .png, .jpg and .jpeg format allowed for Employee picture!";
      cb(null, false);
    }
  },
});

const validator = require("validator");

//function untuk men-sanitize input dari user sehingga tidak mencakup REGEXP, serta mereplace simbol-simbol menjadi
//entity html, dan menghindari SQL injection.
function sanitizeInput(data) {
  return {
    employee_name: validator.escape(data.employee_name || ""),
    employee_birthday: validator.escape(data.employee_birthday || ""),
    employee_gender: validator.escape(data.employee_gender || ""),
    employee_phone: validator.escape(data.employee_phone || ""),
  };
}

// function ini buat menyimpan logic validation agar bisa dipake di bagian-bagian lain
// validation menggunakan library validator, dengan fungsi-fungsi seperti pengecekan length dan format-format lainnya
function validateEmployeeData(data) {
  const errors = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (
    !data.employee_name ||
    !validator.isLength(data.employee_name, { min: 1, max: 100 })
  ) {
    errors.push(
      "Employee name is required and must be between 1 and 100 characters."
    );
  }

  if (!data.employee_birthday || !validator.isDate(data.employee_birthday)) {
    errors.push("Employee birthday is required and must be a valid date.");
  } else {
    const birthdayDate = new Date(data.employee_birthday);

    if (isNaN(birthdayDate.getTime())) {
      errors.push(
        "Employee birthday must be a valid date format (YYYY-MM-DD)."
      );
    } else if (birthdayDate >= today) {
      errors.push("Employee birthday must be a date before today.");
    }
  }

  if (
    !data.employee_gender ||
    !["male", "female", "other"].includes(data.employee_gender.toLowerCase())
  ) {
    errors.push(
      "Employee gender is required and must be 'male', 'female', or 'other'."
    );
  }

  if (!data.employee_phone || !validator.isMobilePhone(data.employee_phone)) {
    errors.push("Employee phone is required and must be a valid phone number.");
  }

  return errors;
}

//di rute ini, ada fungsi pengambilan employee secara normal
//tapi karena kita mau display employee details di page yang sama, maka ada extra logic
//Logic :
//kalau misal employee_id tidak ada isinya, maka akan mengembalikan employee berisi null
//kalau employee_id yang specific ada, maka akan ada pencarian data employee yang specific
//untuk dikembalikan ke page dan di display
router
  .route("/")
  .get(async (req, res) => {
    let employee = null;
    const company_id = req.query.id;

    if (!company_id) {
      return res.status(400).json({
        error: "Missing company_id",
        message: "Please provide a valid company_id in the query string.",
      });
    }

    try {
      let [employees, error] = await model_employee.get(company_id);
      if (req.body.employee_id != null) {
        const employee_id = req.body.employee_id;
        employee = employees.find((emp) => emp.employee_id == employee_id);
      }
      if (error) {
        throw error;
      }
      if (req.xhr) {
        return res.status(200).json({ id: company_id, employee, employees });
      } else {
        return res.status(200).render("pages/employee_list_page", {
          id: company_id,
          employee,
          employees,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Error loading employees",
        message: error.message,
      });
    }
  })
  .post(async (req, res) => {
    const company_id = req.body.company_id;
    let employee = null;

    if (!company_id) {
      return res.status(400).json({
        error: "Missing company_id",
        message: "Please provide a valid company_id in the request body.",
      });
    }
    try {
      let [employees, error] = await model_employee.get(company_id);
      if (req.body.employee_id != null) {
        const employee_id = req.body.employee_id;
        employee = employees.find((emp) => emp.employee_id == employee_id);
      }
      if (error) {
        throw error;
      }
      if (req.xhr) {
        return res.status(200).json({ id: company_id, employee, employees });
      } else {
        return res.status(200).render("pages/employee_list_page", {
          id: company_id,
          employee,
          employees,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Error loading employees",
        message: error.message,
      });
    }
  });

//deletion function seperti biasa, dilakukan menggunakan id
router.put("/delete", async (req, res) => {
  const id = req.body.employee_id;

  try {
    const [employee, error] = await model_employee.delete(id);
    return res;
  } catch (error) {
    return res.status(500).json({
      error: "Error deleting!",
      message: error.message,
    });
  }
});

// Karena add dan edit employee saya satukan menjadi satu page, maka ada extra logic untuk memastikan
// user ingin melakukan operasi add/edit. Dilakukan pengecekan menggunakan hidden input
// dengan value tableAction yang berisi "add" / "edit".
// Kalau actionnya edit, maka akan dilakukan pencarian employee menggunakan id dan akan
// dikembalikan data employee ke page untuk menampilkan data sebelumnya
router.post("/addEdit", async (req, res) => {
  const action = req.body.tableAction;
  const employee_id = req.body.employee_id;
  const company_id = req.body.company_id;
  let errors = null;

  if (action === "add") {
    return res.status(200).render("pages/add_edit_employee_page", {
      addOrEdit: action,
      company_id: company_id,
      errors,
    });
  } else if (action === "edit") {
    try {
      const [employee, error] = await model_employee.getById(employee_id);

      if (employee && employee[0] && employee[0].employee_birthday) {
        if (employee[0].employee_birthday instanceof Date) {
          const date = employee[0].employee_birthday;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          employee[0].employee_birthday = `${year}-${month}-${day}`;
        }
      }

      return res.status(200).render("pages/add_edit_employee_page", {
        addOrEdit: action,
        company_id: company_id,
        employee: employee,
        errors,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error finding the employee",
        message: error.message,
      });
    }
  }
});

// Route post untuk melakukan edit, termasuk penggunaan multer library untuk penyimpanan file berbentuk image
// Dilakukan juga validation sebelum mengirim data
router.post(
  "/addEdit/edit",
  upload.single("employee_picture"),
  async (req, res) => {
    const id = req.body.employee_id;
    const name = req.body.employee_name;
    const gender = req.body.employee_gender;
    const birthday = req.body.employee_birthday;
    const picture = req.file ? req.file.path.replace("public/", "") : null;
    const phone = req.body.employee_phone;

    const data = sanitizeInput({
      employee_id: id,
      employee_name: name,
      employee_birthday: birthday,
      employee_gender: gender,
      employee_phone: phone,
      employee_picture: picture,
    });

    const validationErrors = validateEmployeeData(data);
    if (req.fileValidationError) {
      validationErrors.push(req.fileValidationError);
    }
    if (validationErrors.length > 0) {
      return res.status(400).render("pages/add_edit_employee_page", {
        addOrEdit: "add",
        company_id: company_id,
        errors: validationErrors,
        employee: data,
      });
    }

    try {
      const [] = await model_employee.edit(
        id,
        name,
        gender,
        birthday,
        picture,
        phone
      );

      const company_id = req.body.company_id;
      return res.redirect(`/company/employee?id=${company_id}&success=true`);
    } catch (error) {
      return res.status(500).json({
        error: "Error editing the employee",
        message: error.message,
      });
    }
  }
);

// sama seperti function edit, route ini menggunakan library multer untuk file uploads
// lalu juga dilakukan validation untuk inputs
router.post(
  "/addEdit/insert",
  upload.single("employee_picture"),
  async (req, res) => {
    try {
      const company_id = req.body.company_id;
      if (!company_id) throw new Error("Company ID is missing");

      const employee_name = req.body.employee_name;
      const employee_birthday = req.body.employee_birthday;
      const employee_gender = req.body.employee_gender;
      const employee_phone = req.body.employee_phone;
      const employee_picture = req.file
        ? req.file.path.replace("public/", "")
        : null;
        
      const data = sanitizeInput({
        employee_name,
        employee_birthday,
        employee_gender,
        employee_phone,
      });

      const validationErrors = validateEmployeeData(data);
      if (req.fileValidationError) {
        validationErrors.push(req.fileValidationError);
      }
      if (validationErrors.length > 0) {
        return res.status(400).render("pages/add_edit_employee_page", {
          addOrEdit: "add",
          company_id: company_id,
          errors: validationErrors,
        });
      }

      await model_employee.insert({ ...data, company_id, employee_picture });
      return res.redirect(`/company/employee?id=${company_id}&success=true`);
    } catch (error) {
      console.error("Insert Error:", error.message);
      return res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  }
);

module.exports = router;
