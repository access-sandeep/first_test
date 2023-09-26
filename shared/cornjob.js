const mongoose = require('./db');

const CornSchema = mongoose.Schema({
    time:String
});

const Corn = mongoose.model('Corn', CornSchema);

module.exports = Corn;

