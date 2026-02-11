const express = require('express');
const cors = require("cors")
const dotenv = require('dotenv')
const usersRouter = require("./routes/Users/users.router.js")
const ConnectDB = require("./Config/database.js");
const { notFound, globalErrorHandler } = require('./middleware/globalErrorhandler.js');
const  createCategory  = require('./routes/categories/categoriesRoutes.js');
const postsRouter = require('./routes/posts/postsRouter.js');
const commentRouter = require('./routes/comments/commentRouter.js');
const sendEmail = require("./utils/sendEmail.js");

// ? Create an express App
// sendEmail("skillsquids8@gmail.com", "HelloWelcome123")
const app = express();

// ! Load The enviremnet Variable
dotenv.config();
// ! Establish connection to MongoDB
ConnectDB();
//! setup middleware 
app.use(express.json());

// ! Cors middleware
app.use(cors());

//?Setup the User Router
app.use("/api/v1/users", usersRouter);
//?Setup the Category Router
app.use("/api/v1/categories", createCategory)
//?Setup the Posts Router
app.use("/api/v1/posts", postsRouter)
// ?Setup the Comment Router
app.use("/api/v1/comments", commentRouter)

//?Not found error handler
app.use(notFound)

//?Setup the global error handler
app.use(globalErrorHandler)


/**
 * ! Launch Server 
 */
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server are running on port : ${PORT}`)
});
