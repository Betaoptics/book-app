const Books = require('../../models/book');

// @desc Get a single book 
// @route GET /books
// @access Private
const getSingleBook = async (req, res) => {

    // Get a book from MongoDB
    const book = await Books.findById(req.params?.id).lean();

    // If not the book 
    if (book === null) {
        return res.status(409).json({ message: 'The book was not found.' })
    };

    return res.status(200).json(book);
}

// @desc Update a book
// @route PATCH /book //Previously PUT
// @access Private
const updateBook = async (req, res) => {

    // Check if book with matching ID is found from database
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'Books ID required.' });
    }

    // Get a book from MongoDB
    const book = await Books.findOne({_id: req.params.id}).exec();

    // Check for duplicate titles from database and return error if duplicate title is found
    const duplicate = await Books.findOne({title: req.body?.title}).collation().lean().exec();
 
    if(duplicate && book?.title !== duplicate?.title) {
        return res.status(409).json({ message: 'Duplicate book!' }); // Conflict
    } 

    // If book was not found
    if(!book) {
        return res.status(204).json({"message": `No book matches ID ${req.params.id}.` });
    }

    // Updating book here
    if(req.body?.title) book.title = req.body.title;
    if(req.body?.author) book.author = req.body.author;
    if(req.body?.description) book.description = req.body.description;
    const result = await book.save();

    // Send mesage based on result
    if(result !== null) {
        return res.status(200).json({'message': `Book ${req.params.id} has been modified.`})
    } else {
        return res.status(400).json({ message: 'Invalid book data received' })
    }
}

// @desc Delete a book 
// @route DELETE /book
// @access Private
const deleteBook = async(req, res) => {

    // Check if book is found with a matching ID
    if (!req?.body?._id) return res.status(400).json({ 'message': 'Books ID required.' });

    // Find book with ID.
    const book = await Books.findOne({ _id: req.body._id }).exec();

    // If book was not found
    if (!book) {
        return res.status(204).json({ "message": `No book matches ID ${req.body._id}.` });
    }

    // Delete book
    const result = await book.deleteOne();
    res.json(result);
}

module.exports = {
    getSingleBook,
    updateBook,
    deleteBook
}