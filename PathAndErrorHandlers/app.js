const express = require('express')
const app = express();
const {getCategories} = require('../controllers/controller');
const {handle404s, handle500s} = require('./errorHandles');


app.get("/api/categories", getCategories);

app.use('/*', handle404s)
app.use(handle500s)




    
module.exports = app;