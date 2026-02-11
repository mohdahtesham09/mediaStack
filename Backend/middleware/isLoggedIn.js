const jwt = require("jsonwebtoken");
const User = require("../models/Users/user.model")
const isLoggedIn = (req, resp, next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) =>{
        if(err){
            const error = new Error(err?.message);
            next(err)
        }else{
            const userId = decoded?.user?.id;
            const user = await User.findById(userId).select("username email role _id");
            req.userAuth = user;
            next()
        }
    });
};
module.exports = isLoggedIn;