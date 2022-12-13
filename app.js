const express = require('express')
const app = express();
const {getCategories, getReviews} = require('./controllers/controller');
const {handle404s, handle500s} = require('./PathAndErrorHandlers/errorHandles');


app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)

app.use('/*', handle404s)
app.use(handle500s)




    
module.exports = app;