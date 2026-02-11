import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Redux/slices/users/userSlices"
import postsReducer from "../Redux/slices/posts/postSlice";
import categoriesReducer from "../Redux/slices/categorySlice/categorySlice";
import { commentReducer } from "../Redux/slices/comments/commentSlice";

// !Store 
const store = configureStore({
    reducer: {
        users: userReducer,
        posts: postsReducer,
        categories: categoriesReducer,
        comment: commentReducer,


    },
})
export default store