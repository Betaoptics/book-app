const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

router.route('/:id')
    .get(catalogController.getSingleBook)
    .patch(catalogController.updateBook) //put previously
    .delete(catalogController.deleteBook);

module.exports = router;