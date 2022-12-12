const errorRouter = require('express').Router();


errorRouter.all('/*', (req, res) => {
    res.status(404).send({msg: 'Path not found'})
});



module.exports = errorRouter;