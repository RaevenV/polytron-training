const express = require("express");
const router = express.Router();
const model_employee = require("../../models/model_employee");
const logger = require("../../module/poly_logger");

logger.access(router, "employee", true);

router.post("/", async (req, res) => {
  const start = new Date();
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

    const end = new Date() - start;
    logger.debug("Execution time: " + end + " ms");

    console.log("Rendering with employee:", employee);

    if (req.xhr) {
      return res.status(200).json({ employee, employees });
    } else {
      return res
        .status(200)
        .render("pages/employee_list_page", { employee, employees });
    }
  } catch (error) {
    logger.error(error);
    const end = new Date() - start;
    logger.debug("Execution time: " + end + " ms");

    return res.status(500).json({
      error: "Error loading companies",
      message: error.message,
    });
  }
});

router.put("/delete", async (req, res) => {
  const id = req.body.employee_id;
  const start = new Date();

  try {
    const [employee, error] = await model_employee.delete(id);
    console.log("employee Data:", employee);

    const end = new Date() - start;
    logger.debug("Execution time: " + end + " ms");
    return res;
  } catch (error) {
    logger.error(error);
    const end = new Date() - start;
    logger.debug("Execution time: " + end + " ms");

    return res.status(500).json({
      error: "Error deleting!",
      message: error.message,
    });
  }
});

router.post("/addEdit", async (req, res) => {
  const action = req.body.tableAction;
  const id = req.body.company_id;

  if (action === "add") {
    return res.status(200).render("pages/add_edit_employee_page", {
      addOrEdit: action,
    });
  } else if (action === "edit") {
    const start = new Date();
    try {
      const [company, error] = await model_company.getById(id);
      console.log("Company Data:", company);

      const end = new Date() - start;
      logger.debug("Execution time: " + end + " ms");

      return res.status(200).render("pages/add_edit_employee_page", {
        addOrEdit: action,
        company,
      });
    } catch (error) {
      logger.error(error);
      const end = new Date() - start;
      logger.debug("Execution time: " + end + " ms");

      return res.status(500).json({
        error: "Error finding the company",
        message: error.message,
      });
    }
  }
});


router.post("/addEdit", async (req, res) => {
  const action = req.body.tableAction;
  const id = req.body.company_id;
  if (action === "edit") {
    const start = new Date();
    try {
      const [company, error] = await model_company.getById(id);
      console.log("Company Data:", company);

      const end = new Date() - start;
      logger.debug("Execution time: " + end + " ms");

      return res.status(200).render("pages/add_edit_employee_page", {
        addOrEdit: action,
        company,
      });
    } catch (error) {
      logger.error(error);
      const end = new Date() - start;
      logger.debug("Execution time: " + end + " ms");

      return res.status(500).json({
        error: "Error finding the company",
        message: error.message,
      });
    }
  }
});

module.exports = router;
