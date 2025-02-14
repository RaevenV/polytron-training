const express = require('express')
const router = express.Router()
const logger = require("../../module/poly_logger")

//this log for separate log by using path of url
logger.access(router, "panel", true)

router.get("/page", async function(req, res){
    var error= ""
    res.render("auth/login", {error: error})
})

router.post("/post_test", async function(req, res){
    var response = {
        var1: "OK",
        var2: "NOT OK",
        var3: "OK"
    }
    //this log for adding response to log, first parameter is for file name
    logger.access_response("panel", req, res, true, response)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(response))
})

router.get("/logfile", async function(req, res){
    var response = logger.list_all()
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(response))
})

module.exports = router