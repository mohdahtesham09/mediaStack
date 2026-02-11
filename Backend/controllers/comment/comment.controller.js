const asyncHandler = require('express-async-handler');
const Post = require('../../models/Posts/posts.model');
const Comment = require('../../models/Comments/comment.model');

exports.createComment = asyncHandler(async(req, resp)=>{
    // Get the plyload
    const {message} = req.body;
    // Get the post id
    const postId = req.params.postId;
    // Create the comment
    const comment = await Comment.create({
        message,
        author: req?.userAuth?._id,
        postId,
    });

    // Associate comment with post 
    await Post.findByIdAndUpdate(
    postId,
    {
        $push: {comments: comment._id},
    },
    {new:true},
    );
    resp.status(201).json({
        status: "success",
        message: "Comment successfully created!",
        comment,
    });
});

// @desc Delete comment
// @router Delete /api/v1//comment/:commentId
// @access Private

exports.deleteComment = asyncHandler(async (req, resp) => {
    // ! Get the comment id to be deleted 
    const commentId = req.params.commentId;
    await Comment.findByIdAndDelete(commentId);
     resp.status(201).json({
        status: "success",
        message: "Comment successfully Deleted!",
    });
});

// @desc Update comment
// @router PUT /api/v1//comment/:commentId
// @access Private

exports.updateComment = asyncHandler(async (req, resp) => {
    // ! Get the comment id to be deleted 
    const commentId = req.params.commentId;
    // ! Get the message 
    const message = req.body.message;
    const updatedComment = await Comment.findByIdAndUpdate(commentId, 
        {message},
        {new:true, runValidators: true}
    );
     resp.status(201).json({
        status: "success",
        message: "Comment successfully updated!",
        updatedComment,
    });
});



