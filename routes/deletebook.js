var express = require('express');
var router = express.Router();
var Book = require('../shared/database');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let data = await Category.find({});
  res.render('pages/addbookform', {"categories": data});
});

module.exports = router;
