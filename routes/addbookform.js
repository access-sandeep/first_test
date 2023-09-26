var express = require('express');
var router = express.Router();
var Category = require('../shared/categories');
var Book = require('../shared/database');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let action = req.query.action!==undefined?req.query.action:"create";
  let q = req.query.q!==undefined?req.query.q:0;
  let data = await Category.find({});
  let book = [{"name":"","price":"","discount":"", "description":"", "additional_images":[]}]
  if(q) {
    book = await Book.find({_id:q})
  }
  
  res.render('pages/addbookform', {"categories": data, "action":action, "id":q, "book":book[0]});
});

module.exports = router;
