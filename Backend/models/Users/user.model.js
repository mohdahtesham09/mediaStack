const mongoose = require('mongoose');
const crypto = require("crypto")
const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    email:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum:["user", "admin"],
        default: "user",
    },
    password:{
        type: String,
        required: true,
    },
    lastlogin:{
        type: Date,
        default: Date.now(),
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    accountLevel:{
        type: String,
        enum: ["bronze", "silver", "gold"],
        default: "bronze",
    }, 
    profilePicture: {
        type: String,
        default: "",
    },
    coverImage:{
        type: String,
        default: "",
    },
    bio:{
        type: String
    },
    location: {
        type: String,  
    },
    notificationType:{
        email:{type: String}

    },
    gender:{
        type:String,
        enum:["male", "female", "prefer not to say", "non-binary"]
    },
    profileViewers: [{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    followers: [{type:mongoose.Schema.Types.ObjectId, ref: "User"}],
    following: [{type:mongoose.Schema.Types.ObjectId, ref: "User"}],
    blockedUsers: [{type:mongoose.Schema.Types.ObjectId, ref: "User"}],
    posts: [{type:mongoose.Schema.Types.ObjectId, ref: "Post"}],
    likedPosts:[{type:mongoose.Schema.Types.ObjectId, ref: "Post"}],
    passwordResetToken:{
        type: String,
    },
    passwordResetExpires:{type: Date},
    accountVerificationToken:{
        type: String,
    },
    accountVerificationExpires:{
        type: Date,
    },

}, 
{
    timestamps:true,
    toJSON:{
        virtuals: true,
    },
    toObject:{
        virtuals: true,
    },
}
);
userSchema.methods.genratePasswordResetToken = function(){
    // !genrateToken 
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    // ! Set the expiry time to 10 min
    this.passwordResetExpires=Date.now() + 10 * 60 * 1000;
    return resetToken;
}

// ! Account Verification 
userSchema.methods.generateAccountVerificationToken = function(){
    // !genrateToken 
    const VerificationToken = crypto.randomBytes(20).toString("hex");
    this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(VerificationToken)
    .digest("hex");
    // ! Set the expiry time to 10 min
    this.accountVerificationExpires=Date.now() + 10 * 60 * 1000;
    return VerificationToken;
}

// ! Convert schema to model 
const User = mongoose.model("User", userSchema);
module.exports = User;
