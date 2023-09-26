var express = require('express');
var router = express.Router();
var Corn = require('../shared/cornjob');


/* Add corn. */
router.post('/', async (req, res)=>{
    let time = new Date().toString();
    await Corn.create({"time":time}).then((response)=>{
        res.send(`Time saved ${time}`);
    });    
});