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
const upload = multer({ storage: storage });
const validator = require("validator");

function validateEmployeeData(data) {
  const errors = [];

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

router.post("/", async (req, res) => {
  const id = req.body.company_id;
  let employee = null;

  try {
    let [employees, error] = await model_employee.get(id);

    if (req.body.employee_id != null) {
      const employee_id = req.body.employee_id;
      console.log(employee_id == null ? "null" : employee_id);
      employee = employees.find((emp) => emp.employee_id == employee_id);
      console.log(employee);
    }

    if (error) {
      throw error;
    }

    console.log("Rendering with employee:", employee);

    if (req.xhr) {
      return res.status(200).json({ id, employee, employees });
    } else {
      return res
        .status(200)
        .render("pages/employee_list_page", { id, employee, employees });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error loading companies",
      message: error.message,
    });
  }
});

router.put("/delete", async (req, res) => {
  const id = req.body.employee_id;

  try {
    const [employee, error] = await model_employee.delete(id);
    console.log("employee Data:", employee);

    return res;
  } catch (error) {
    return res.status(500).json({
      error: "Error deleting!",
      message: error.message,
    });
  }
});

router.post("/addEdit", async (req, res) => {
  const action = req.body.tableAction;
  const employee_id = req.body.employee_id;
  const company_id = req.body.company_id;

  console.log("this is employee id before going to add page : ", employee_id);
  if (action === "add") {
    return res.status(200).render("pages/add_edit_employee_page", {
      addOrEdit: action,
      company_id: company_id,
    });
  } else if (action === "edit") {
    try {
      const [employee, error] = await model_employee.getById(employee_id);
      console.log("employee Data:", employee);

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
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error finding the employee",
        message: error.message,
      });
    }
  }
});

router.post(
  "/addEdit/edit",
  upload.single("employee_picture"),
  async (req, res) => {
    const id = req.body.employee_id;
    console.log("Id pas ngeclick submit ", id);
    const name = req.body.employee_name;
    console.log("Id pas ngeclick submit ", name);

    const gender = req.body.employee_gender;
    const birthday = req.body.employee_birthday;
    const picture = req.file ? req.file.path : req.body.old_picture;
    const phone = req.body.employee_phone;

    const data = {
      employee_name: name,
      employee_birthday: birthday,
      employee_gender: gender,
      employee_phone: phone,
      employee_picture: picture,
    };

    // Validate the data
    const validationErrors = validateEmployeeData(data);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", messages: validationErrors });
    }

    try {
      const [employee, error] = await model_employee.edit(
        id,
        name,
        gender,
        birthday,
        picture,
        phone
      );

      const [employees] = await model_employee.get();
      console.log("success");
      return res.redirect("/company");
    } catch (error) {
      return res.status(500).json({
        error: "Error editing the employee",
        message: error.message,
      });
    }
  }
);

router.post("/insert", upload.single("employee_picture"), async (req, res) => {
  try {
    const company_id = req.body.company_id;
    console.log(company_id);
    const employee_name = req.body.employee_name;
    const employee_birthday = req.body.employee_birthday;
    const employee_gender = req.body.employee_gender;
    const employee_phone = req.body.employee_phone;
    const employee_picture = req.file.path.replace("public/", "");

    const data = {
      company_id,
      employee_name,
      employee_birthday,
      employee_gender,
      employee_picture,
      employee_phone,
    };

    const validationErrors = validateEmployeeData(data);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", messages: validationErrors });
    }

    await model_employee.insert(data);
    return res.redirect("/company");
  } catch (error) {}
});

module.exports = router;
