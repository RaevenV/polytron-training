const express = require("express");
const router = express.Router();
const model_migration = require("../models/model_migration");
const c_test = require("./test/controller_test");
const c_panel = require("./panel/controller_panel");
const c_company = require("./panel/controller_company");
//Hapus jika sudah tidak digunakan
const c_sse = require("./panel/controller_SSE_usage_tutorial");
const model_company = require("../models/model_company");
const poly_logger = require("../module/poly_logger");
const configuration = require("../module/configuration");

router.use("/public", express.static("public"));

router.get("/", async (req, res) => {
  //
  let configs = {
    NODE_ENV: configuration["NODE_ENV"],
    APP_PORT: configuration["APP_PORT"],
    DB_HOST: configuration["DB_HOST"],
    DB_PORT: configuration["DB_PORT"],
    DATABASE: configuration["DATABASE"],

    REDIS_HOST: configuration["REDIS_HOST"],
    REDIS_PORT: configuration["REDIS_PORT"],
    REDIS_PASS: configuration["REDIS_PASS"],

    NPM_SCRIPT: configuration["npm_lifecycle_script"],
  };

  return res.status(200).render("pages/example_page", {
    configs,
  });
});

router.use("/company", c_company);

router.get("/app-status", async (req, res) => {
  var status = "";
  var version = "";
  var updated = "";
  try {
    status = "OK";
    version = data.version;
    updated = data.updated;
  } catch (error) {
    status = error;
  }
  var response = {
    server_date: Date(),
    db_status: status,
    db_version: version,
    db_last_updated: updated,
  };
  //this log for adding response to log, first parameter is for file name
  poly_logger.access_response("access", req, res, true, response);
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(response));
});

// uncomment this for testings
// router.use("/test", c_test);
// router.use("/panel", c_panel);

// //Hapus jika sudah tidak digunakan
// router.use("/sse", c_sse);

router.use(function (req, res) {
  res.status(404).render("pages/page_404", {});
  return;
});

module.exports = router;
