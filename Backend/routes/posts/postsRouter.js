const express = require("express");
const multer = require("multer");
const storage = require("../../utils/fileUploads");
const { createPost, getAllPosts, getPost, deletePost, updatePost, likePost, disLikePost, clapsPost, schedulePost, getPublicPost } = require('../../controllers/posts/post.controller');
const isLoggedIn = require('../../middleware/isLoggedIn');
const isAccountVerified = require('../../middleware/isAccountVerified');
const postsRouter = express.Router();

const upload = multer({ storage }); 

//? Cretae Post route
postsRouter.post("/", isLoggedIn, upload.single("file"), createPost);  //isAccountVerified
//? Get All Post route
postsRouter.get("/", isLoggedIn, getAllPosts);

//? Get Only 4 Post
postsRouter.get("/public", getPublicPost)
//? Get Single Post route
postsRouter.get("/:id", getPost);

//? delete Post route
postsRouter.delete("/:id", isLoggedIn, deletePost);

//? update Post route
postsRouter.put("/:id", isLoggedIn, upload.single("file"), updatePost);

//? Like A POST
postsRouter.put("/like/:postId", isLoggedIn, likePost);

//? DisLike A POST
postsRouter.put("/dislike/:postId", isLoggedIn, disLikePost);

//? Claps A POST
postsRouter.put("/claps/:postId", isLoggedIn, clapsPost);

//? Schedule A POST
postsRouter.put("/schedule/:postId", isLoggedIn, schedulePost);

module.exports = postsRouter

