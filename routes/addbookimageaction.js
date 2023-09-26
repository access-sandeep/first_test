const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const imageProcessor = require('./image_processing/img_preprocessor');
let books_images = [];
function unit_dimention_calculation(dimention, seed) {
    // Image size should be min-width:370px; min-height:233px; aspect_ratio: 1:0.62972972972972972972972972972973
    const aspect_ratio = 0.62972972972972972972972972972973;
    let min_width = parseInt(seed);
    let min_height = parseInt(min_width*aspect_ratio);    
    // let min_left = parseInt((dimention.width - min_width)/2);  
    // let min_top = parseInt((dimention.height - min_height)/2);
    let calculated_dimentions = [min_width,  min_height, 0, 0];
    return calculated_dimentions;
}

function propose_dimentions(dimention) {  
    let [min_width, min_height, min_left, min_top] = unit_dimention_calculation(dimention, dimention.height);
    let [large_width, large_height, large_left, large_top] = unit_dimention_calculation(dimention, min_width);
    let [mid_width, mid_height, mid_left, mid_top] = unit_dimention_calculation(dimention, large_width*.6);
    let [thumb_width, thumb_height, thumb_left, thumb_top] = unit_dimention_calculation(dimention, large_width*.37);
    let [small_width, small_height, small_left, small_top] = unit_dimention_calculation(dimention, large_width*.15);

    if(dimention.width > dimention.height) {
        [min_width, min_height, min_left, min_top] = unit_dimention_calculation(dimention, dimention.height);
        [large_width, large_height, large_left, large_top] = unit_dimention_calculation(dimention, min_width);
        [mid_width, mid_height, mid_left, mid_top] = unit_dimention_calculation(dimention, large_width*.6);
        [thumb_width, thumb_height, thumb_left, thumb_top] = unit_dimention_calculation(dimention, large_width*.37);
        [small_width, small_height, small_left, small_top] = unit_dimention_calculation(dimention, large_width*.15);  

    } else if (dimention.width < dimention.height) {
        [min_height, min_width,  min_left, min_top] = unit_dimention_calculation(dimention, dimention.width);
        [large_height, large_width, large_left, large_top] = unit_dimention_calculation(dimention, min_width);
        [mid_height, mid_width, mid_left, mid_top] = unit_dimention_calculation(dimention, large_width*.6);
        [thumb_height, thumb_width, thumb_left, thumb_top] = unit_dimention_calculation(dimention, large_width*.37);
        [small_height, small_width, small_left, small_top] = unit_dimention_calculation(dimention, large_width*.15);   

    } else {
        [min_width, min_height, min_left, min_top] = unit_dimention_calculation(dimention, dimention.height);
        [large_width, large_height, large_left, large_top] = unit_dimention_calculation(dimention, min_width);
        [mid_width, mid_height, mid_left, mid_top] = unit_dimention_calculation(dimention, large_width*.6);
        [thumb_width, thumb_height, thumb_left, thumb_top] = unit_dimention_calculation(dimention, large_width*.37);
        [small_width, small_height, small_left, small_top] = unit_dimention_calculation(dimention, large_width*.15);
    }

    let calculated_dimentions = {
        min: {
            width: min_width,
            height: min_height,
            left: min_left,
            top: min_top
        },
        large: {
            width: large_width,
            height: large_height,
            left: large_left,
            top: large_top
        },
        mid: {
            width: mid_width,
            height: mid_height,
            left: mid_left,
            top: mid_top
        },
        thumb: {
            width: thumb_width,
            height: thumb_height,
            left: thumb_left,
            top: thumb_top
        },
        small: {
            width: small_width,
            height: small_height,
            left: small_left,
            top: small_top
        }
    };
    console.log("Calculated Dimentions", calculated_dimentions);

    return  calculated_dimentions;
}

async function mkdir(folder) {
    try {
        if (!fs.existsSync(folder)) {
            await fs.mkdirSync(folder);
        }
    } catch (err) {
            console.error(err);
    }
}

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let folder  = 'uploads/'+req.body.id+'/';
        await mkdir(folder);
        cb(null, folder);
    },
    filename: async function (req, file, cb) {
        const current_book_result = await Book.find({ _id: req.body.id });
        const current_book = current_book_result[0];        
        const uniqueSuffix = Date.now();
        const filename = file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname);
        let additional_images = current_book.additional_images !==undefined && current_book.additional_images.length>0?current_book.additional_images:[];
        additional_images.push({
            "thumb":filename,
            "mid":filename,
            "large":filename
        });
        let updateData = {
            additional_images:additional_images
        };
        await Book.updateOne({ _id: req.body.id }, updateData);
        cb(null, filename)
    }
});

const upload = multer({ storage: storage });

var router = express.Router();

const mongoose = require('mongoose');
var Book = require('../shared/database');

/* GET users listing. */
router.post('/', upload.array('books_images'), async function(req, res, next) {
    let allbooks = await Book.find({});
    let updatedBook = await Book.find({ _id: req.body.id });
    let stored_images = readStoredImages(req.body.id)
    for(i=0; i<req.files.length; i++) {
        await crop(updatedBook, req, i);
    }  
    res.render('pages/bookslibrary', {"books": allbooks});
});

async function crop(updatedBook, req, index) {
    let last_image_index = updatedBook[0].additional_images.length-(index+1);

    try {
        await store(req, updatedBook, last_image_index, 'min');
    } catch (error) {
        console.log(error);
    }

    // try {
    //     await store(req, updatedBook, last_image_index, 'large');
    // } catch (error) {
    //     console.log(error);
    // }

    // try {
    //     await store(req, updatedBook, last_image_index, 'mid');
    // } catch (error) {
    //     console.log(error);
    // }
    
    // try {
    //     await store(req, updatedBook, last_image_index, 'thumb');
    // } catch (error) {
    //     console.log(error);
    // }
    
    // try {
    //     await store(req, updatedBook, last_image_index, 'small');
    // } catch (error) {
    //     console.log(error);
    // }
}

async function store(req, updatedBook, last_image_index, size) {
    let image_metadata = {};
    try{
        image_metadata = await imageProcessor.getMetadata(`uploads/${req.body.id}/${updatedBook[0].additional_images[last_image_index].thumb}`);
        console.log("Image Metadata", image_metadata);
    } catch (e) {
        console.log(`Err: ${e}`, updatedBook[last_image_index].additional_images);
    }

    let dimentions = propose_dimentions({width: image_metadata.width, height: image_metadata.height});

    await mkdir(`uploads/${req.body.id}/${size}/`);
    image_metadata = await imageProcessor.cropImage(
        `uploads/${req.body.id}/${updatedBook[0].additional_images[last_image_index][size]}`,
        dimentions,
        size,
        `uploads/${req.body.id}/${size}/${updatedBook[0].additional_images[last_image_index][size]}`
    );
}

module.exports = router;
