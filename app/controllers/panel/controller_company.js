const express = require("express");
const router = express.Router();
const model_company = require("../../models/model_company");
const logger = require("../../module/poly_logger");
const c_employee = require("./controller_employee");
logger.access(router, "company", true);

router.use('/employee', c_employee)
router.post("/insert", async (req, res) => {
  var start = new Date();
  try {
    const company_name = req.body.company_name;
    const company_address = req.body.company_address;
    const company_phone = req.body.company_phone;
    const data = {
      company_name,
      company_address,
      company_phone,
    };

    await model_company.insert(data);
  } catch (error) {
    logger.error(error);
  }
  var end = new Date() - start;
  logger.debug("Execution time: " + end + " ms");
  res
    .status(200)
    .json({ message: "Company added successfully", elapsed: end + " ms" });
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

      const end = new Date() - start;
      logger.debug("Execution time: " + end + " ms");

      return res.status(200).render("pages/add_edit_company_page", {
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

      return res.status(200).render("pages/add_edit_company_page", {
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

router.put("/delete", async (req, res) => {
  const id = req.body.company_id;
  const start = new Date();

  try {
    const [company, error] = await model_company.delete(id);
    console.log("Company Data:", company);

    const end = new Date() - start;
    logger.debug("Execution time: " + end + " ms");
    const [companies, err] = await model_company.get();
    return res.redirect("/company");
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

router.get("/", async (req, res) => {
  const start = new Date();
  try {
    const [companies, error] = await model_company.get();

    if (error) {
      throw error;
    }

    const end = new Date() - start;
    logger.debug("Execution time: " + end + " ms");

    return res.status(200).render("pages/company_list_page", {
      companies,
    });
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

module.exports = router;
