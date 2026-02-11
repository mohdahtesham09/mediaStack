const User = require("../models/Users/user.model")
const isAccountVerified = async (req, resp, next)=>{
    try {
        // Find user id
        const currentUser = await User.findById(req.userAuth._id);
        // Check whether the user is verified
        if(currentUser.isVerified){
            next();
        }else{
            resp.status(401).json({message:"Account not verified"})
        }
    } catch (error) {
         resp.status(500).json({message:"=server error", error })
    }
};
module.exports = isAccountVerified;
