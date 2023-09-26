var express = require('express');
var router = express.Router();
var Book = require('../shared/database');
var Category = require('../shared/categories');



function allAvailableIds(allbooks) {
    let usedIds = allbooks.map(element=>{
        return  element.id==undefined?0:element.id
    });
    return 1+Math.max(...usedIds);
}

/* GET home page. */
router.post('/', async (req, res)=>{
    let allbooks = await Book.find({});
    let nextId = allAvailableIds(allbooks);
     
    let id_returned = validate("id", nextId, res);
    let categories_returned = validate("categories", req.body.categories, res);
    let name_returned = validate("name", req.body.name, res);
    let price_returned = validate("price", req.body.price, res);
    let discount_returned = validate("discount", req.body.discount, res);
    let description_returned = validate("description", req.body.description, res);

    
    
    let id = id_returned.returned?id_returned.refined_value:undefined;
    let categories = categories_returned.returned?categories_returned.refined_value:undefined;
    let name = name_returned.returned?name_returned.refined_value:undefined;
    let price = price_returned.returned?price_returned.refined_value:undefined;
    let discount = discount_returned.returned?discount_returned.refined_value:undefined;
    let description = description_returned.returned?description_returned.refined_value:undefined;

    let action = req.body.action;
    let existing_id = req.body.id;

    let isAllDefined = id_returned.returned && categories_returned.returned && name_returned.returned && price_returned.returned && discount_returned.returned && description_returned.returned;

    if(!isAllDefined) {
        if(action=='delete') {
            const detleted = await Book.deleteOne({ _id: existing_id }).then((response)=>{
                res.render('pages/bookaddsuccess', {"success":"Success", "detail":"Successfully deleted the book!", "data": "deleted"});
            }).catch((e)=>{
                res.render('pages/bookaddsuccess', {"success":"Failed", "detail":`Failed to delete the book!\nErr: ${e}`, "data": 0});
            });
        } else if(action=='multidelete') {
            await Book.deleteMany({ _id: req.body.dbid }).then((response)=>{
                res.render('pages/bookaddsuccess', {"success":"Success", "detail":"Successfully deleted the book!", "data": "deleted all"});
            }).catch((e)=>{
                res.render('pages/bookaddsuccess', {"success":"Failed", "detail":`Failed to delete the book!\nErr: ${e}`, "data": 0});
            });
        } else {
            res.render('pages/bookaddsuccess', {"success":"Failed", "detail":`Err: Failed to create the book!`, "data": 0});
        }
        return;
    }

    let categories_details = await Category.find({"id":categories}); 
    
    let data = {
        "id": id,
        "categories": categories,
        "categories_details": categories_details,
        "name": name,
        "price": price,
        "discount": discount,
        "description": description
    };

    let updateData = {
        "categories": categories,
        "categories_details": categories_details,
        "name": name,
        "price": price,
        "discount": discount,
        "description": description
    };

    if(action=='create') {
        await Book.create(data).then((response)=>{
            res.render('pages/bookaddsuccess', {"success":"Success", "detail":"Successfully created the book!", "data": response._id});
        }).catch((e)=>{
            res.render('pages/bookaddsuccess', {"success":"Failed", "detail":`Failed to create the book!\nErr: ${e}`, "data": 0});
        });
    } else if (action=='edit') {
        const updated = await Book.updateOne({ _id: existing_id }, updateData).then((response)=>{
            res.render('pages/bookaddsuccess', {"success":"Success", "detail":"Successfully Edited the book!", "data": existing_id});
        }).catch((e)=>{
            res.render('pages/bookaddsuccess', {"success":"Failed", "detail":`Failed to update the book!\nErr: ${e}`, "data": 0});
        });
    }
    
});

function validate(type, value, res) {
    let returnValue;
    const type_regex = {
        "id": {"regex":new RegExp("^[0-9]+$"), "datatype":"number"},
        "categories": {"regex":new RegExp("^[0-9]+$"), "datatype":"array"},
        "name": {"regex":new RegExp("[a-zA-Z0-9\s\-]+"), "datatype":"string"},
        "price": {"regex":new RegExp("^[0-9\.]+$"), "datatype":"number"},
        "discount": {"regex":new RegExp("^[0-9\.]+$"), "datatype":"number"},
        "description": {"regex":new RegExp("[a-zA-Z0-9\s\-]+"), "datatype":"string"}
    };
    try {
        if("description"==type) {
            returnValueString = value.trim();
            if(!returnValueString) {
                returnValue = {"returned":false, "refined_value":null, "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
            } else {
                returnValue = {"returned":true, "refined_value":returnValueString, "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
            }
        } else if("array"==type_regex[type].datatype) {
            if(typeof value == "string") {
                returnValue = 0;
                if(type_regex[type].regex.test(value)) {
                    returnValue = {"returned":true, "refined_value":Number(value), "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
                } else{
                    returnValue = {"returned":false, "refined_value":null, "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
                }
            } else {
                returnValue = [];
                returnValueArr = value.map(element => {
                    if(type_regex[type].regex.test(element)) {
                        return Number(element);
                    } else{
                        return "NoNumber";
                    }
                });

                if(returnValueArr.indexOf("NoNumber")==-1) {
                    returnValue = {"returned":true, "refined_value":returnValueArr, "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
                } else {
                    returnValue = {"returned":false, "refined_value":null, "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
                }
            }
        } else if ("string"==type_regex[type].datatype) {
            returnValue = "";
            if(type_regex[type].regex.test(value)) {
                returnValue = {"returned":true, "refined_value":String(value), "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
            } else{
                returnValue = {"returned":false, "refined_value":null, "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
            }
        } else {
            returnValue = 0;
            if(type_regex[type].regex.test(value)) {
                returnValue = {"returned":true, "refined_value":Number(value), "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
            } else{ 
                returnValue = {"returned":false, "refined_value":null, "field":type, "value":value, "type": type_regex[type], "regex":type_regex[type].regex};
            }
        }
    } catch (e) {
        returnValue = {"returned":false, "refined_value":null, "field":"", "value":"", "type": "", "regex":""};
    }
    return returnValue;
}
module.exports = router;

// {"id":"0","categories":["1","2"],"name":"Mobile redme","price":"232423","discount":"33","description":"qqrqqrqr","submit":""}

// [{"_id":"64ac2a2de9f274e1c0ea8a62","id":1,"categories":[0,1,2,3],"categories_details":[],"name":"One Plus  +","price":200001,"discount":10,"description":"along desc 1","rating_total":11,"star_ratings":{"star_5":4,"star_4":3,"star_3":2,"star_2":1,"star_1":1,"_id":"64ac2a2de9f274e1c0ea8a69"},"reviews":[{"stars":5,"comment":"This is a review comment","_id":"64ac2a2de9f274e1c0ea8a6a"},{"stars":4,"comment":"This is another review comment","_id":"64ac2a2de9f274e1c0ea8a6b"}],"__v":0},{"_id":"64ac2a4c23264f20caeae26e","id":2,"categories":[0,1,2,3],"categories_details":[{"id":0,"name":"books","description":"All books","_id":"64ac2a4c23264f20caeae26f"},{"id":2,"name":"gift_items","description":"All gift items","_id":"64ac2a4c23264f20caeae270"},{"id":3,"name":"baby","description":"All baby products","_id":"64ac2a4c23264f20caeae271"},{"id":4,"name":"for_him","description":"All mens items","_id":"64ac2a4c23264f20caeae272"}],"cover_images":{"thumb":"","mid":"","large":"","_id":"64ac2a4c23264f20caeae273"},"additional_images":[{"thumb":"","mid":"","large":"","_id":"64ac2a4c23264f20caeae274"}],"name":"One Plus 2  +","price":200001,"discount":10,"description":"along desc 1","rating_total":11,"star_ratings":{"star_5":4,"star_4":3,"star_3":2,"star_2":1,"star_1":1,"_id":"64ac2a4c23264f20caeae275"},"reviews":[{"stars":5,"comment":"This is a review comment","_id":"64ac2a4c23264f20caeae276"},{"stars":4,"comment":"This is another review comment","_id":"64ac2a4c23264f20caeae277"}],"__v":0}]