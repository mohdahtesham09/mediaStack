const express = require('express');
const { createCategory, getAllCategories, deleteCategory, updateCategory } = require('../../controllers/category/category.controller');
const isLoggedIn = require('../../middleware/isLoggedIn');

const categoriesRouter = express.Router();
// ! Category Route
categoriesRouter.post("/", isLoggedIn, createCategory)

// ! Fetched All Categories route
categoriesRouter.get("/", getAllCategories)

// ! Delete Categories route
categoriesRouter.delete("/:id", isLoggedIn, deleteCategory) 

// ! Update a Categories route
categoriesRouter.put("/:id", isLoggedIn, updateCategory)

module.exports = categoriesRouter;
