const Category = require("../models/Category");
const createError = require("../utils/createError");

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return next(createError("Name is required", 400));
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(
        createError("Category with the same name already exists", 400)
      );
    }

    const newCategory = new Category({
      name,
    });
    if (req.files?.image?.length > 0) {
      newCategory.icon = req.files?.image[0]?.filename;
    }

    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.id;

    if (!name) {
      return next(createError("Name is required", 400));
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return next(createError("Category not found", 404));
    }
    if (req.files?.image?.length > 0) {
      updatedCategory.icon = req.files?.image[0]?.filename;
    }
    await updatedCategory.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return next(createError("Category not found", 404));
    }

    res.status(200).send(deletedCategory);
  } catch (error) {
    next(error);
  }
};
const dropCategories = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const categories = await Category.deleteMany();

    if (!categories) {
      return next(createError("Category not found", 404));
    }

    res.status(200).send(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  dropCategories
};
