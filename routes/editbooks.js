var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
var Book = require('../shared/database');
var Category = require('../shared/categories');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let allbooks = await Book.find({});
    res.render('pages/bookslibrary', {"books": allbooks});
});

router.get('/edit', async function(req, res, next) {
  let data = await Category.find({});
  let editbook = await Book.find({_id:req.query.q});
  res.render('pages/addbookform', {"categories": data, "book": editbook});
});

router.get('/delete', async function(req, res, next) {
  let data = await Category.find({});
  let editbook = await Book.find({_id:req.query.q});
  res.render('pages/addbookform', {"categories": data,"book": editbook});
});

module.exports = router;
