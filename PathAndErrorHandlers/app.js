const express = require('express')
const app = express();
const {getCategories} = require('../controllers/controller');
const errorRouter = require('./errorHandles');


app.get("/api/categories", getCategories);

app.use('/*', errorRouter)




    
module.exports = app;