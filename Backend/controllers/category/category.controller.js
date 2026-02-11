const Category = require('../../models/Categories/category.model');
const asyncHandler = require('express-async-handler');

//@desc Create new Category
//@route Post /api/v1/categories
//@access private

exports.createCategory = asyncHandler(async (req, resp, next) =>{
   const {name} = req.body;
   const isCategoryPresent = await Category.findOne({name});
   if(isCategoryPresent){
    throw new Error("Category Already Existing")
   }
   const category = await Category.create({
    name:name, 
    author: req?.userAuth?._id,
   });
   resp.json({
    status: "success",
    message: "Category created successfully",
    category,
   });
});


//@desc Get All Category
//@route Get /api/v1/categories
//@access public

exports.getAllCategories = asyncHandler(async(req, resp)=>{
    const allCategories = await Category.find({}).populate({path:"posts", model:"Post"});
    resp.status(201).json({
        status: "success",
        message: "All categories successfully fetched",
        allCategories,
    });
});

//@desc Delete Single Category
//@route Get /api/v1/categories/:id
//@access private

exports.deleteCategory = asyncHandler(async(req, resp)=>{
   const catId = req.params.id;
   await Category.findByIdAndDelete(catId);
    resp.status(201).json({
        status: "success",
        message: "Category successfully deleted",
    }); 
});

//@desc Update Single Category
//@route Put /api/v1/categories/:id
//@access private

exports.updateCategory = asyncHandler(async(req, resp)=>{
   const catId = req.params.id;
   const name = req.body.name;
   const updatedCategory = await Category.findByIdAndUpdate(catId, {name:name}, {new:true, runValidators:true});
    resp.status(201).json({
        status: "success",
        message: "Category successfully updated",
        updatedCategory,
    }); 
});
