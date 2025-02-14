const dotenv = require('dotenv').config({ path: `env/${process.env.NODE_ENV}.env`})
const express = require('express')
const app = express()
const path = require('path')
const helmet = require('helmet')
const c_main = require('./app/controllers/controller_main')
const configuration = require("./app/module/configuration")

console.log(process.env)
// Enable proxy for get secure https
app.enable("trust proxy")

// Middlewares
// app.use(helmet({
//     frameguard: false
// }))

//Views
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }))
app.use(express.json({limit: '50mb'}))
app.set('views', path.join(__dirname, 'app/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname+'/public')))

const logger = require("./app/module/poly_logger")
//this init for enable logrotate
logger.init()
//add middleware for logging all access log without separate by path
//logger.access(app)

app.use('/', c_main)

app.listen(configuration["APP_PORT"], () => console.log('Example app listening on port ' + configuration["APP_PORT"]))