const ParentCategory = require('../models/ParentCategory');

// @desc    Get all parent categories
// @route   GET /api/parent-categories
// @access  Public
const getParentCategories = async (req, res) => {
  try {
    const parentCategories = await ParentCategory.find({});
    res.json(parentCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single parent category by ID
// @route   GET /api/parent-categories/:id
// @access  Public
const getParentCategoryById = async (req, res) => {
  try {
    const parentCategory = await ParentCategory.findById(req.params.id);
    if (parentCategory) {
      res.json(parentCategory);
    } else {
      res.status(404).json({ message: 'Parent category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a parent category
// @route   POST /api/parent-categories
// @access  Admin
const createParentCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const parentCategory = new ParentCategory({
      name,
      description,
    });

    const createdParentCategory = await parentCategory.save();
    res.status(201).json(createdParentCategory);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// @desc    Update a parent category
// @route   PUT /api/parent-categories/:id
// @access  Admin
const updateParentCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const parentCategory = await ParentCategory.findById(req.params.id);

    if (parentCategory) {
      parentCategory.name = name || parentCategory.name;
      parentCategory.description = description || parentCategory.description;

      const updatedParentCategory = await parentCategory.save();
      res.json(updatedParentCategory);
    } else {
      res.status(404).json({ message: 'Parent category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// @desc    Delete a parent category
// @route   DELETE /api/parent-categories/:id
// @access  Admin
const deleteParentCategory = async (req, res) => {
  try {
    const parentCategory = await ParentCategory.findById(req.params.id);

    if (parentCategory) {
      await parentCategory.remove();
      res.json({ message: 'Parent category removed' });
    } else {
      res.status(404).json({ message: 'Parent category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getParentCategories, getParentCategoryById, createParentCategory, updateParentCategory, deleteParentCategory };
