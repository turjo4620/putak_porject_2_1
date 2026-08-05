const authorService = require('../services/authorService');

const getAuthors = async (req, res) => {
    try {
        const authors = await authorService.getAllAuthors();
        res.status(200).json({ success: true, data: authors });
    } catch (error) {
        console.error("Error fetching authors:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAuthor = async (req, res) => {
    try {
        const {id} = req.params;
        
        const author = await authorService.getAuthorByID(id);        

        if(!author){
            return res.status(404).json({success: false, message : "Author not found"});
        }
        return res.status(200).json({success : true, data : author});
    } catch (error) {
        console.error("Error fetching author:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



module.exports = { 
    getAuthors, 
    getAuthor
};