const asyncHandler = require('express-async-handler');
const Post = require('../../models/Posts/posts.model');
const User = require('../../models/Users/user.model');
const Category = require('../../models/Categories/category.model');

const postPopulateConfig = [
    { path: "author", model: "User", select: "name username email role _id" },
    { path: "category", model: "Category" },
];

const formatPostWithUser = (postDoc) => {
    if (!postDoc) return postDoc;
    const post = typeof postDoc.toObject === "function" ? postDoc.toObject() : postDoc;
    return {
        ...post,
        user: post.author || null,
    };
};

const formatPostListWithUser = (posts = []) => posts.map((post) => formatPostWithUser(post));

//@desc Create a new post 
//@route POST /api/v1/post
//@access private

exports.createPost = asyncHandler(async (req, resp, next) => {
    // Get the payload
    const { title, content, categoryId } = req.body;

    // Check if the post is present
    const postFound = await Post.findOne({ title });
    if (postFound) {
        let error = new Error("Post already existing");
        next(error);
        return;
    }
    // Cretae post object
    const post = await Post.create({
        title,
        content,
        category: categoryId,
        author: req?.userAuth?._id,
        image: req.file?.path,
    });
    // Update user by adding post in it
    const user = await User.findByIdAndUpdate(
        req?.userAuth?._id,
        { $push: { posts: post._id } },
        { new: true },
    );

    // Update category by adding post in it
    const catg = await Category.findByIdAndUpdate(
        categoryId,
        { $push: { posts: post._id } },
        { new: true },
    );
    // send the response 
    resp.json({
        status: "success",
        message: "Post successfully created",
        post,
        user,
        catg,
    });
    console.log("File Uploded: ", req.file);
    // response already sent above

});

// @desc Get All Posts 
// @route GET /api/v1/posts
// @access Private

exports.getAllPosts = asyncHandler(async (req, resp) => {
    // Get The current user
    const currentUserId = req.userAuth._id;
    // Get the current time
    const currentDateTime = new Date();
    // Get all those users who have blocked the currnet user
    const userBlockingCurrentUser = await User.find({
        blockedUsers: currentUserId,
    });
    // Extract the id of the users who have blocked the current user
    const blockingUsersIds = userBlockingCurrentUser.map(
        (userObj) => userObj._id
    );
    const query = {
        author: { $nin: blockingUsersIds },
        $or: [
            { scheduledPublished: { $lte: currentDateTime }, scheduledPublished: null }
        ],
    }
    // Fetch those posts whose author is not blockingIds
    const allPostsDocs = await Post.find(query).populate(postPopulateConfig);
    const allPosts = formatPostListWithUser(allPostsDocs);
    resp.json({
        status: "success",
        message: "All post fetched successfully",
        allPosts,
    });
});

// @desc Get single Posts 
// @route GET /api/v1/posts/:id
// @access Public

exports.getPost = asyncHandler(async (req, resp) => {
    // get the id
    const postId = req.params.id;
    // Fetched the post corresponding to the id
    const postDoc = await Post.findById(postId).populate(postPopulateConfig);
    const post = formatPostWithUser(postDoc);
    if (post) {
        resp.json({
            status: "success",
            message: "post fetched successfully",
            post,
        });
    } else {
        resp.json({
            status: "success",
            message: "No post available for given id",
            post,
        });
    }
})

// @desc Get Only 4 Post
// @route Get /api/v1/posts
// @access public

exports.getPublicPost = asyncHandler(async (req, resp) => {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalPosts = await Post.countDocuments();

    // Fetch posts with pagination
    const postDocs = await Post.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(postPopulateConfig);

    const post = formatPostListWithUser(postDocs);

    resp.status(200).json({
        status: "success",
        message: "Posts fetched successfully",
        post,
        totalPosts,
        page,
        pages: Math.ceil(totalPosts / limit),
    });
});

// @desc delete Posts 
// @route delete /api/v1/posts/:id
// @access private

exports.deletePost = asyncHandler(async (req, resp) => {
    // get id
    const postId = req.params.id;
    const currentUserId = req.userAuth?._id;
    const post = await Post.findById(postId);

    if (!post) {
        resp.status(404).json({
            status: "failed",
            message: "Post not found",
        });
        return;
    }

    // Only post owner can delete
    if (post.author.toString() !== currentUserId.toString()) {
        resp.status(403).json({
            status: "failed",
            message: "You are not authorized to delete this post",
        });
        return;
    }

    // Delete post from DB
    await Post.findByIdAndDelete(postId);

    // Remove post reference from user and category
    await User.findByIdAndUpdate(post.author, { $pull: { posts: post._id } });
    await Category.findByIdAndUpdate(post.category, { $pull: { posts: post._id } });

    // send the response 
    resp.json({
        status: "success",
        message: "post successfully deleted",
    });

})


// @desc Update Posts 
// @route Put /api/v1/posts/:id
// @access private

exports.updatePost = asyncHandler(async (req, resp) => {
    // Get id
    const postId = req.params.id;
    const currentUserId = req.userAuth?._id;
    const post = await Post.findById(postId);

    if (!post) {
        resp.status(404).json({
            status: "failed",
            message: "Post not found",
        });
        return;
    }

    // Only post owner can update
    if (post.author.toString() !== currentUserId.toString()) {
        resp.status(403).json({
            status: "failed",
            message: "You are not authorized to update this post",
        });
        return;
    }

    // Allow only editable fields
    const updateData = {};
    if (typeof req.body.title !== "undefined") updateData.title = req.body.title;
    if (typeof req.body.content !== "undefined") updateData.content = req.body.content;
    if (typeof req.body.category !== "undefined") updateData.category = req.body.category;
    if (req.file?.path) updateData.image = req.file.path;

    // Update this post in the DB 
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        updateData,
        { new: true, runValidators: true }
    );
    // send the response 
    resp.json({
        status: "success",
        message: "post successfully updated",
        updatedPost,
    });
});
// @desc Like POST 
// @router PUT /api/v1/post/like/:postId
// @access private 

exports.likePost = asyncHandler(async (req, resp, next) => {
    // Get the id of the post 
    const { postId } = req.params;
    // Get the current user
    const currentUserId = req.userAuth._id;
    // search the post
    const post = await Post.findById(postId);
    if (!post) {
        let error = new Error("Post not found");
        next(error);
        return;
    }
    // Add the currentUserId to likes array
    await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: currentUserId } },
        { new: true }
    )
    // remove the currentUserId to dislikes array
    post.dislikes = post.dislikes.filter(
        (userId) => userId.toString() !== currentUserId.toString()
    );
    // resave the post
    await post.save();
    // send the response 
    resp.json({
        status: "success",
        message: "liked successfully",
    });
});

// @desc Like POST 
// @router PUT /api/v1/post/like/:postId
// @access private 

exports.disLikePost = asyncHandler(async (req, resp, next) => {
    // Get the id of the post 
    const { postId } = req.params;
    // Get the current user
    const currentUserId = req.userAuth._id;
    // search the post
    const post = await Post.findById(postId);
    if (!post) {
        let error = new Error("Post not found");
        next(error);
        return;
    }
    // Add the currentUserId to likes array
    await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { dislikes: currentUserId } },
        { new: true }
    )
    // remove the currentUserId to dislikes array
    post.likes = post.likes.filter(
        (userId) => userId.toString() !== currentUserId.toString()
    );
    // resave the post
    await post.save();
    // send the response 
    resp.json({
        status: "success",
        message: "disliked successfully",
    });
});

// @desc Claps POST 
// @router PUT /api/v1/post/claps/:postId
// @access private

exports.clapsPost = asyncHandler(async (req, resp, next) => {
    // Get the id of the post 
    const { postId } = req.params;
    // search the post
    const post = await Post.findById(postId);
    if (!post) {
        let error = new Error("Post not found");
        next(error);
        return;
    }
    // impliment claps
    const updatedPost = await Post.findByIdAndUpdate(
        postId, {
        $inc: { claps: 1 }
    },
        { new: true }
    );
    // send the response 
    resp.json({
        status: "success",
        message: "Post Claped successfully",
        updatedPost,
    });
});

// @desc Schedule a POST 
// @router PUT /api/v1/post/schedule/:postId
// @access private

exports.schedulePost = asyncHandler(async (req, resp, next) => {
    // Get the data
    const { postId } = req.params;
    const scheduledPublished = req.body?.scheduledPublished;
    // Check if postId and schedulePublish are present 
    if (!postId || !scheduledPublished) {
        let error = new Error("PostId and Schedule Date are required")
        next(error)
        return;
    }
    // Find the post from DB
    const post = await Post.findById(postId);
    if (!post) {
        let error = new Error("Post not found");
        next(error);
        return;
    }
    // Check if the currentUser is the author
    if (post.author.toString() !== req.userAuth._id.toString()) {
        let error = new Error("You can schedule only your posts");
        next(error);
        return;
    }
    const scheduleDate = new Date(scheduledPublished);
    const currentDate = new Date();

    if (scheduleDate < currentDate) {
        let error = new Error("Schedule date can not be previous date");
        next(error);
        return;
    }
    post.scheduledPublished = scheduleDate;
    await post.save();
    // send the response 
    resp.json({
        status: "success",
        message: "Post schedule successfully",
        post,
    });
})
