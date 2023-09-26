var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
var Book = require('../shared/database');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let allbooks = await Book.find({});
    res.json(allbooks);
});

module.exports = router;
