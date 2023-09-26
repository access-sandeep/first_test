var express = require('express');
var router = express.Router();
var Category = require('../shared/categories');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let allcategories = await Category.find({});
    res.json(allcategories);
});

module.exports = router;
