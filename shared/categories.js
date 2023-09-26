const mongoose = require('./db');

const CategorySchema = mongoose.Schema({
    id:Number,
    name:String,
    description:String
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;

