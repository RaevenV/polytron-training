const express = require('express')
const router = express.Router()
const model_loadtest = require('../../models/model_loadtest')
const logger = require("../../module/poly_logger")

logger.access(router, "test", true)

router.get('/execute', async (req, res) =>{
    var start = new Date()
    try{
        for(var i=0; i<1000;i++){
            for(var j=0; j<1000;j++){
                for(var k=0; k<1000;k++){
                }
            }
        }
        // throw "Error too long recursive"
    }catch(exception){
        //this log for error
        logger.error(exception)
    }
    var end = (new Date() - start)
    //this log for debug
    logger.debug('Execution time: '+end+' ms')
    res.status(200).json({"elapsed": end+" ms"})
})

router.get('/insert', async (req, res) =>{
    var start = new Date()
    var [data, err] = await model_loadtest.select()
    //this log for debug
    logger.debug(data)
    await model_loadtest.insert(data)
    var end = (new Date() - start)
    //this log for debug
    logger.debug({executionTime: end})
    res.status(200).json({"elapsed": end+" ms"})
})

router.get("/page", async function(req, res){
    var error= ""
    res.render("auth/login", {error: error})
})

module.exports = router