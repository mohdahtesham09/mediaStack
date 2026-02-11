const express = require('express');
const { register,
    login,
    getProfile,
    blockUser,
    unblockUser,
    viewOtherProfile,
    followingUser,
    unFollowingUser,
    forgotPassword,
    resetPassword,
    accountVerificationEmail,
    verifyAccount,
    updateUserProfile } = require("../../controllers/users/user.controller");
const isLoggedIn = require('../../middleware/isLoggedIn');
const multer = require("multer");
const storage = require("../../utils/fileUploads");
const upload = multer({ storage });

const usersRouter = express.Router();
// ! Register Route
usersRouter.post("/register", register)

// ! Login Route
usersRouter.post("/login", login)

// ! Profile Route
usersRouter.get("/profile", isLoggedIn, getProfile)

// ! Update Profile Route
// Accepts profilePicture and coverImage
usersRouter.put("/profile", isLoggedIn, upload.fields([{ name: 'profilePicture' }, { name: 'coverImage' }]), updateUserProfile)

// ! Block User Route
usersRouter.put("/block/:userIdToBlock", isLoggedIn, blockUser)

// ! UnBlock User Route
usersRouter.put("/unblock/:userIdToUnBlock", isLoggedIn, unblockUser)

// ! View another profile user Route
usersRouter.get("/view-other-profile/:userProfileId", isLoggedIn, viewOtherProfile)

// !  Follow Route
usersRouter.put("/following/:userIdToFollow", isLoggedIn, followingUser)

// !  UnFollow Route
usersRouter.put("/unfollowing/:userIdToUnFollow", isLoggedIn, unFollowingUser)

// ! Forgot password route
usersRouter.put("/forgot-password", forgotPassword)

// ! Forgot password route
usersRouter.put("/reset-password/:resetToken", resetPassword)

// ! Send Account verification email route
usersRouter.put("/account-verification-email", isLoggedIn, accountVerificationEmail)

// ! Account token verification 
usersRouter.put("/verify-account/:verifyToken", isLoggedIn, verifyAccount)

module.exports = usersRouter;