const db = require('../db/connection')

exports.selectCategories = (req, res) => {

    return db.query('SELECT * FROM categories;')
    .then(({rows}) => {return rows})
}