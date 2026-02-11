const express = require('express');
const cors = require("cors")
const dotenv = require('dotenv')
const ConnectDB = require("./Config/database.js");
const usersRouter = require("./routes/Users/users.router.js")
const { notFound, globalErrorHandler } = require('./middleware/globalErrorhandler.js');
const  createCategory  = require('./routes/categories/categoriesRoutes.js');
const postsRouter = require('./routes/posts/postsRouter.js');
const commentRouter = require('./routes/comments/commentRouter.js');
const path = require("path")

// ? Create an express App
const app = express();

const _dirname = path.resolve();

// ! Load The enviremnet Variable
dotenv.config();
//! setup middleware 
app.use(express.json());

// ! Cors middleware
const parseOrigins = (origins = "") =>
    origins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

const allowedOrigins = [
    process.env.CLIENT_URL || "https://mediastack.in",
    ...parseOrigins(process.env.LOCAL_CLIENT_URLS),
    ...parseOrigins(process.env.CORS_ORIGINS),
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser requests (e.g., curl, server-to-server)
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

const ensureDatabaseConnection = (req, resp, next) => {
    if (ConnectDB.isDbConnected()) {
        return next();
    }

    return resp.status(503).json({
        status: "failed",
        message: "Database is temporarily unavailable. Please try again shortly.",
    });
};

app.use("/api/v1", ensureDatabaseConnection);

//?Setup the User Router
app.use("/api/v1/users", usersRouter);
//?Setup the Category Router
app.use("/api/v1/categories", createCategory)
//?Setup the Posts Router
app.use("/api/v1/posts", postsRouter)
// ?Setup the Comment Router
app.use("/api/v1/comments", commentRouter)

app.use(express.static(path.join(_dirname, "/Frontend/dist")));
app.get("/{*splat}", (req, resp, next) => {
    // Keep API 404s handled by backend error middleware
    if (req.path.startsWith("/api/")) return next();
    resp.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
});

//?Not found error handler
app.use(notFound)

//?Setup the global error handler
app.use(globalErrorHandler)

/**
 * ! Launch Server 
 */
const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        await ConnectDB();
        app.listen(PORT);
    } catch (error) {
        console.error("Server startup failed: unable to connect to MongoDB.");
        console.error(error.message);
        process.exit(1);
    }
};

startServer();
