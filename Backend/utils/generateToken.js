const jwt = require('jsonwebtoken');

const genrateToken = (user) => {
    const payLoad ={
        user:{
            id: user._id,
        },
    };
    const token = jwt.sign(payLoad, process.env.JWT_KEY, {expiresIn: "7d"})
    return token;

}

module.exports = genrateToken;