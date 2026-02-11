const User = require('../../models/Users/user.model.js')
const bcrypt = require('bcryptjs')
const genrateToken = require('../../utils/generateToken.js')
const asyncHandler = require('express-async-handler')
const sendEmail = require("../../utils/sendEmail.js")
const crypto = require("crypto")
const sendAccountVerificationEmail = require('../../utils/sendAccountverification.js')

//@desc Register new user
//@route Post /api/v1/users/register
//@access public

exports.register = asyncHandler(async (req, resp, next) => {

  const { username, password, email } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    throw new Error("User Already Existing");
  }
  const newUser = new User({ username, email, password });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  await newUser.save();
  resp.json({
    status: "Success",
    message: "User register Successfully",
    _id: newUser?.id,
    username: newUser?.username,
    email: newUser?.email,
    role: newUser?.role,
  })
});

//@desc login user
//@route Post /api/v1/users/login
//@access public

exports.login = asyncHandler(async (req, resp, next) => {

  const { username, password } = req.body;
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('Invalid crenditials');
  }
  let isMatched = await bcrypt.compare(password, user?.password);
  if (!isMatched) {
    throw new Error("Invalid crenditials")
  }
  user.lastLogin = new Date();
  await user.save();
  resp.json({
    status: "success",
    email: user?.email,
    _id: user?._id,
    username: user?.username,
    role: user?.role,
    token: genrateToken(user)
  });
});

//@desc Profile Viwe
//@route get /api/v1/users/profile/:id
//@access private

exports.getProfile = asyncHandler(async (req, resp, next) => {
  const user = await User.findById(req.userAuth.id).populate({
    path: "posts",
    model: "Post",
    populate: [
      { path: "author", model: "User", select: "name username email role _id" },
      { path: "category", model: "Category" },
    ],
  })
    .populate({ path: "following", model: "User" })
    .populate({ path: "followers", model: "User" })
    .populate({ path: "blockedUsers", model: "User" })
    .populate({ path: "profileViewers", model: "User" })
  resp.json({
    status: "success",
    message: "Profile fetched",
    user,
  })
});

// @desc Block User
// @router PUT /api/v1/users/block/userblockId
// @access private 
exports.blockUser = asyncHandler(async (req, resp, next) => {
  // !Find the userid to be blocked
  const userIdToBlock = req.params.userIdToBlock;
  // !Check whether the user is present in DB or not
  const userToBlock = await User.findById(userIdToBlock);
  if (!userToBlock) {
    let error = new Error("User to block not found !");
    next(error);
    return;
  }
  // !Get the current user id
  const userBlocking = req?.userAuth?._id

  // !Check if it is self blocking
  if (userIdToBlock.toString() === userBlocking.toString()) {
    let error = new Error("User block yourself!");
    next(error);
    return;
  }
  // !Get the error user object from DB
  const currentUser = await User.findById(userBlocking);

  //!Check whether the userIdToBlock is already blocked
  if (currentUser.blockedUsers.includes(userIdToBlock)) {
    let error = new Error("This user already been blocked!");
    next(error);
    return;
  }

  // !push the user tto be blocked in the blockedUsers array
  currentUser.blockedUsers.push(userIdToBlock);
  await currentUser.save();
  resp.json({
    status: "success",
    message: "User blocked successfully!",
  });
});

// @desc UnBlock User
// @router PUT /api/v1/users/unblock/userIdToUnBlock
// @access Private

exports.unblockUser = asyncHandler(async (req, resp, next) => {
  // Find the user to unblock
  const userIdToUnBlock = req.params.userIdToUnBlock;
  const userToUnBlock = await User.findById(userIdToUnBlock)
  if (!userToUnBlock) {
    let error = new Error("User block not found!");
    next(error);
    return;
  }
  // Find the current user
  const userUnBlocking = req?.userAuth?._id;
  const currentUser = await User.findById(userUnBlocking);

  // Check if the the user to unblock is already block
  if (!currentUser.blockedUsers.includes(userIdToUnBlock)) {
    let error = new Error("User not blocked!");
    next(error);
    return;
  }
  // Remove the user from the current user blockedUser array
  currentUser.blockedUsers = currentUser.blockedUsers.filter((id) => {
    return id.toString() !== userIdToUnBlock;
  });
  // update the DB
  await currentUser.save();

  // return the response
  resp.json({
    status: "success",
    message: "User Unblocked successfully",
  });
});

// @desc View another user profile
// @router GET /api/v1/users/view-another-profile/:userProfileId
// @access Private

exports.viewOtherProfile = asyncHandler(async (req, resp, next) => {
  // Get the userId whose profile is to viewed
  const userProfileId = req.params.userProfileId;
  const userProfile = await User.findById(userProfileId)
  if (!userProfile) {
    let error = new Error("User whose profile is to be viewed not present!");
    next(error);
    return;
  }
  const currentUserId = req?.userAuth?._id;
  // Check if we have already viewed the profile of userProfileId
  if (userProfile.profileViewers.includes(currentUserId)) {
    let error = new Error("you have already viewed the profile");
    next(error);
    return;
  }
  // push the currentUserId into array of userProfile
  userProfile.profileViewers.push(currentUserId);
  // update the DB
  await userProfile.save();
  resp.json({
    status: "success",
    message: "Profile successfully viewed"
  });
});

// @desc Follow User
// @router PUT /api/v1/users/following/:userIdFollow
// @access Private

exports.followingUser = asyncHandler(async (req, resp, next) => {
  // Find the current user id
  const currentUserId = req?.userAuth?._id;
  // Find the user to be followed
  const userIdToFollow = req.params.userIdToFollow;
  const userProfile = await User.findById(userIdToFollow)
  if (!userProfile) {
    let error = new Error("User to be followed not present!");
    next(error);
    return;
  }
  // Avoid current user following himself
  if (currentUserId.toString() === userIdToFollow.toString()) {
    let error = new Error("You cannot follow your self!");
    next(error);
    return;
  }


  // Push the Id to of userToFollow inside following array of current user
  await User.findByIdAndUpdate(
    currentUserId,
    { $addToSet: { following: userIdToFollow } },
    { new: true }
  );

  // Push the current user id into the follwers array of userToFollow
  await User.findByIdAndUpdate(
    userIdToFollow,
    { $addToSet: { followers: currentUserId } },
    { new: true }
  );

  // send the response
  resp.json({
    status: "success",
    message: "You have followed the user successfully",
  });
});


// @desc UnFollow User
// @router PUT /api/v1/users/unfollowing/:userIdunFollow
// @access Private

exports.unFollowingUser = asyncHandler(async (req, resp, next) => {
  // Find the current user id
  const currentUserId = req?.userAuth?._id;
  // Find the user to be followed
  const userIdToUnFollow = req.params.userIdToUnFollow;

  // Avoid current user following himself
  if (currentUserId.toString() === userIdToUnFollow.toString()) {
    let error = new Error("You cannot follow your self!");
    next(error);
    return;
  }
  // Check whether the user exists
  const userProfile = await User.findById(userIdToUnFollow)
  if (!userProfile) {
    let error = new Error("User to be unfollowed not present!");
    next(error);
    return;
  }
  // Get the current user object
  const currentUser = await User.findById(currentUserId);

  // Check whether the current user has followed userIdUnfollow or not
  if (!currentUser.following.includes(userIdToUnFollow)) {
    let error = new Error("You cannot unfollow the user you did not follow!");
    next(error);
    return;
  }

  // Remove the userIdToUnfollow from the following array
  await User.findByIdAndUpdate(
    currentUserId,
    { $pull: { following: userIdToUnFollow } },
    { new: true }
  )
  // Remove the currentUserId from the followers array of userToUnFollow
  await User.findByIdAndUpdate(
    userIdToUnFollow,
    { $pull: { followers: currentUserId } },
    { new: true }
  )

  // send the response
  resp.json({
    status: "success",
    message: "You have unfollowed the user successfully",
  });

});

// @desc Forgot Password
// @router Post /api/v1/users/forgot-password
// @access Public

exports.forgotPassword = asyncHandler(async (req, resp, next) => {
  // !Fetch the email
  const { email } = req.body;

  // !Find email in the DB
  const userfound = await User.findOne({ email })
  if (!userfound) {
    let error = new Error("this email id is not registerd with us!");
    next(error);
    return;
  }
  // ! Get the reset token
  const resetToken = await userfound.genratePasswordResetToken();
  // ! save the change (resetToken and expiryTime to the DB)
  await userfound.save();
  sendEmail(email, resetToken);
  // send the response
  resp.json({
    status: "success",
    message: "Password reset token sent to your email successfully",
  });
})

// @desc Reset Password
// @router Post /api/v1/users/reset-password/reset:token
// @access Public

exports.resetPassword = asyncHandler(async (req, resp, next) => {
  // Get the token from parmas
  const { resetToken } = req.params;
  // Get the password 
  const { password } = req.body;

  // Convert resetToken into hashed token
  const hasedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Verify the token with DB
  const userfound = await User.findOne({
    passwordResetToken: hasedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // If user is not found 
  if (!userfound) {
    let error = new Error("Password reset token is invalid or expired");
    next(error);
    return;
  }
  // Update the new password 
  const salt = await bcrypt.genSalt(10);
  userfound.password = await bcrypt.hash(password, salt);
  userfound.PasswordResetToken = null;
  userfound.passwordResetExpires = null;

  // Resave the user
  await userfound.save();
  // send the response
  resp.json({
    status: "success",
    message: "Password reset successfully",
  });
});

// @desc Send Account verification mail 
// @router Post /api/v1/users/account-verification-email
// @access private

exports.accountVerificationEmail = asyncHandler(async (req, resp, next) => {
  //!find the current email 
  const currentUser = await User.findById(req?.userAuth?._id);
  if (!currentUser) {
    let error = new Error("User not found!");
    next(error);
    return;
  }
  // Get the token from 
  const verifyToken = await currentUser.generateAccountVerificationToken();

  // resave the user 
  await currentUser.save()

  // send the verification Email 
  sendAccountVerificationEmail(currentUser.email, verifyToken);

  // send the response
  resp.json({
    status: "success",
    message: `Account verification email has ben sent to your email ${currentUser.email}`,
  });
});

// @desc Send Account Token Verification 
// @router PUT /api/v1/users/verify-account/:verifyToken
// @access private

exports.verifyAccount = asyncHandler(async (req, resp, next) => {
  // Get the verify from param
  const { verifyToken } = req.params;

  // Convert the token into hashed from
  let cryptoToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  const userFound = await User.findOne({
    accountVerificationToken: cryptoToken,
    accountVerificationExpires: { $gt: Date.now() },
  });
  if (!userFound) {
    let error = new Error("Account token invalid or expired")
    next(error);
    return;
  }
  // Update the user 
  userFound.isVerified = true;
  userFound.accountVerificationEmail = undefined
  userFound.accountVerificationExpires = undefined
  // resave the user 
  await userFound.save();
  // send the response
  resp.json({
    status: "success",
    message: `Account successfully verified`,
  });

});


// @desc Update user profile
// @router PUT /api/v1/users/profile
// @access Private
exports.updateUserProfile = asyncHandler(async (req, resp) => {
  // Check if user exists
  // The userAuth comes from isLoggedIn middleware
  const user = await User.findById(req.userAuth._id);
  if (!user) {
    throw new Error("User not found");
  }

  // Update fields
  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;
  if (req.body.bio) user.bio = req.body.bio;
  if (req.body.location) user.location = req.body.location;
  if (req.body.gender) user.gender = req.body.gender;

  // Handle files (profilePicture and coverImage)
  if (req.files) {
    if (req.files['profilePicture']) {
      user.profilePicture = req.files['profilePicture'][0].path;
    }
    if (req.files['coverImage']) {
      user.coverImage = req.files['coverImage'][0].path;
    }
  }

  const updatedUser = await user.save();

  resp.json({
    status: "success",
    message: "Profile updated successfully",
    user: updatedUser,
  });
});




