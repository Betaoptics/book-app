const Books = require('../../models/book');

// @desc Get a single book 
// @route GET /book
// @access Private
const getAllBooks = async (req, res) => {

    // Get all books from MongoDB
    const books = await Books.find().select('_id title').lean();

    // If no books 
    if (!books?.length) {
        return res.status(204).json({ message: 'No books found.' })
    };
    
    res.json(books);

}

// @desc Create a book 
// @route POST /books
// @access Private
const createBook = async (req, res) => {
    
    const { 
        title, 
        author,
        description
    } = req.body;

    // Check if all fields exist
    if (!title || !author || !description) {
        return res.status(400).json({ message: 'All book fields are required' });
    }

    // Check for duplicate titles from database and return error if duplicate title is found
    const duplicate = await Books.findOne({title: title}).collation().lean().exec();
    
    if(duplicate) {
        return res.status(409).json({ message: 'Duplicate book!' }); // Conflict
    } 

    // Create and store the new book 
    const book = await Books.create({ 
        title, 
        author,
        description
    })

    if (book) { // Created 
        return res.status(201).json({ message: 'New book created' })
    } else {
        return res.status(400).json({ message: 'Invalid book data received' })
    }

}

module.exports = {
    getAllBooks,
    createBook
}