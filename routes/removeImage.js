var express = require('express');
var router = express.Router();
var Book = require('../shared/database');

/* GET home page. */
router.post('/', async function(req, res, next) {
    let additional_images_from_db_prior_to_operation;
    let image_to_retain = await Book.findOne({_id: req.body.id}).then((book)=>{
        additional_images_from_db_prior_to_operation = book.additional_images;
        return book.additional_images.filter(function (image) {
            if(!req.body.remove_image.includes(image._id.toString())) {
                return image._id
            } 
        });  
    }).catch((e)=>{
        res.render('pages/bookaddsuccess', {"success":"Failed", "detail":`Failed to delete the book!\nErr: ${e}`, "data": 0});
    });
    let updateData = {'additional_images':image_to_retain}
    await Book.updateOne({ _id: req.body.id }, updateData).then((book)=>{
        let images_to_delete = additional_images_from_db_prior_to_operation.filter(function (image) {
            if(!image_to_retain.includes(image._id.toString())) {
                return image._id
            } 
        });   
        delete_images_physically(images_to_delete, req.body._id);
        res.render('pages/bookaddsuccess', {"success":"Success", "detail":"Successfully Edited the book!", "data": image_to_retain});
    }).catch((e)=>{
        res.render('pages/bookaddsuccess', {"success":"Failed", "detail":`Failed to update the book!\nErr: ${e}`, "data": 0});
    });
});

const delete_images_physically = (images_to_delete, folder_name)=>{
    console.log(`${images_to_delete} are the images to be deleted from the folder ${folder_name}`);
}

module.exports = router;