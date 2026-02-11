import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resetErrorAction, resetSuccessAction } from "../globalSlice/globalSlice";
import axios from "axios";

const INITIAL_STATE = {
  loading: false,
  error: null,
  success: false,
  posts: [],
  post: null,
  deleteLoading: false,
  updateLoading: false,
  postDeleted: false,
  postUpdated: false,
};

const getAuthConfig = (getState) => {
  const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const token =
    getState().users?.userAuth?.userInfo?.token || userInfoFromStorage?.token;

  if (!token) {
    throw new Error("No auth token found. Please log in again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch Public Post Action
export const fetchPublicPostsAction = createAsyncThunk(
  "posts/fetch-public-posts",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/posts/public?page=${payload?.page || 1}&limit=6`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch Single Post Action
export const fetchPostDetailsAction = createAsyncThunk(
  "posts/fetch-single-post",
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/v1/posts/${postId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Create Post Action
export const addPostAction = createAsyncThunk(
  "posts/create",
  async (payload, { rejectWithValue, getState }) => {
    try {
      if (!payload?.title || !payload?.content || !payload?.image) {
        throw new Error("Title, content, and image are required.");
      }

      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      formData.append("categoryId", payload.category);
      formData.append("file", payload.image);

      const config = getAuthConfig(getState);
      const { data } = await axios.post("http://localhost:3000/api/v1/posts", formData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

// Update Post Action
export const updatePostAction = createAsyncThunk(
  "posts/update",
  async ({ postId, payload }, { rejectWithValue, getState }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await axios.put(
        `http://localhost:3000/api/v1/posts/${postId}`,
        payload,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

// Delete Post Action
export const deletePostAction = createAsyncThunk(
  "posts/delete",
  async (postId, { rejectWithValue, getState }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await axios.delete(`http://localhost:3000/api/v1/posts/${postId}`, config);
      return { ...data, postId };
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: INITIAL_STATE,
  reducers: {
    resetPostMutationState: (state) => {
      state.postDeleted = false;
      state.postUpdated = false;
      state.deleteLoading = false;
      state.updateLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPublicPostsAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchPublicPostsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.posts = action.payload;
    });

    builder.addCase(fetchPublicPostsAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    builder.addCase(addPostAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.post = action.payload;
    });

    builder.addCase(addPostAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    builder.addCase(fetchPostDetailsAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchPostDetailsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.post = action.payload;
    });

    builder.addCase(fetchPostDetailsAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    builder.addCase(updatePostAction.pending, (state) => {
      state.updateLoading = true;
      state.error = null;
      state.postUpdated = false;
    });

    builder.addCase(updatePostAction.fulfilled, (state, action) => {
      state.updateLoading = false;
      state.error = null;
      state.postUpdated = true;
      state.post = { post: action.payload?.updatedPost };
    });

    builder.addCase(updatePostAction.rejected, (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
      state.postUpdated = false;
    });

    builder.addCase(deletePostAction.pending, (state) => {
      state.deleteLoading = true;
      state.error = null;
      state.postDeleted = false;
    });

    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      state.deleteLoading = false;
      state.error = null;
      state.postDeleted = true;
      state.posts = {
        ...state.posts,
        post: (state.posts?.post || []).filter((p) => p._id !== action.payload.postId),
      };
    });

    builder.addCase(deletePostAction.rejected, (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
      state.postDeleted = false;
    });

    builder.addCase(resetErrorAction, (state) => {
      state.error = null;
    });

    builder.addCase(resetSuccessAction, (state) => {
      state.success = false;
      state.postDeleted = false;
      state.postUpdated = false;
    });
  },
});

export const { resetPostMutationState } = postsSlice.actions;
const postsReducer = postsSlice.reducer;
export default postsReducer;
