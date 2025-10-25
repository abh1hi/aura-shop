const express = require('express');
const router = express.Router();
const { getParentCategories, getParentCategoryById, createParentCategory, updateParentCategory, deleteParentCategory } = require('../controllers/parentCategoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getParentCategories).post(protect, admin, createParentCategory);
router.route('/:id').get(getParentCategoryById).put(protect, admin, updateParentCategory).delete(protect, admin, deleteParentCategory);

module.exports = router;
