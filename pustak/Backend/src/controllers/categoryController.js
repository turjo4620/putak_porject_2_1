const categoryService = require('../services/categoryService');

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await categoryService.getCategoryByID(id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error("Error fetching category:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { 
    getCategories, 
    getCategory
};
