const mongoose = require('./db');

const Category = new mongoose.Schema({
    id:Number,
    name:String,
    description:String
});

const Image = new mongoose.Schema({
    thumb:String,
    mid:String,
    large:String
});

const Ratings = new mongoose.Schema({
    star_5:Number,
    star_4:Number,
    star_3:Number,
    star_2:Number,
    star_1:Number
});

const Review = new mongoose.Schema({
    stars:Number,
    comment:String
});

const BookSchema = new mongoose.Schema({
    id: Number,
    categories:[Number],
    categories_details: [Category],
    additional_images:[Image],
    cover_image_index: {type: Number, default:0},
    name:String, 
    price: Number, 
    discount: Number, 
    description:String,
    rating_total: Number,
    star_ratings: Ratings,
    reviews:[Review]
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;

