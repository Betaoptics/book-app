const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// See docs at: https://mongoosejs.com/docs/schematypes.html

const bookSchema = new Schema({
    id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false
    },
});

module.exports = mongoose.model('Book', bookSchema);