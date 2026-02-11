const express = require('express');
const isLoggedIn = require('../../middleware/isLoggedIn');
const { createComment, deleteComment, updateComment } = require('../../controllers/comment/comment.controller');

const commentRouter = express.Router();

// ! Create Comment Router
commentRouter.post("/:postId", isLoggedIn, createComment);

// ! Delete Comment Router
commentRouter.delete("/:commentId", isLoggedIn, deleteComment);

// ! Update Comment Router
commentRouter.put("/:commentId", isLoggedIn, updateComment);

module.exports = commentRouter