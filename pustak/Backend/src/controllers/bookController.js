const bookService = require('../services/bookService');


const getBooks = async(req, res) =>{
    try {
        const books = await bookService.getAllBooks();
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        console.error("Error fetching authors:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }    
};

module.exports = {
    getBooks
};