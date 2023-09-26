var express = require('express');
var router = express.Router();
var Category = require('../shared/categories');

/* GET home page. */
router.get('/', async(req, res)=>{
    let data = [
        // {"id":0,"name":"all","description":"All atricles"},
        // {"id":1,"name":"books","description":"Books"},
        // {"id":2,"name":"gift_items","description":"gift_items"},
        // {"id":3,"name":"baby","description":"baby"},
        // {"id":4,"name":"for_him","description":"for_him"},
        // {"id":5,"name":"for_her","description":"for_her"},
        // {"id":6,"name":"laptops","description":"laptops"},
        // {"id":7,"name":"groceries","description":"groceries"},
        // {"id":8,"name":"fitness","description":"fitness"},
        // {"id":9,"name":"kitchen","description":"kitchen"},
        // {"id":10,"name":"household","description":"household"},
        // {"id":11,"name":"bathroom","description":"bathroom"},
        // {"id":12,"name":"electronics","description":"electronics"}
    ];
    let newCategory = await Category.create(data);
    res.json(newCategory);
});

router.get('/show', async(req, res)=>{
    let data = await Category.find({});
    res.json(data);
});

module.exports = router;
// {"id":0,"name":"books","description":"All books","_id":"64ac2a2de9f274e1c0ea8a63"}

