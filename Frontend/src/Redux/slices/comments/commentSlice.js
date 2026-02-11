import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "../globalSlice/globalSlice";

// Initial State
const INITIAL_STATE = {
    loading: false,
    error: null,
    success: false,
    comments: [],
    comment: null,
};

// Create Comment Action
export const createCommentAction = createAsyncThunk(
    "comment/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { description, postId } = payload;
            const { userAuth } = getState().users;
            const config = {
                headers: {
                    Authorization: `Bearer ${userAuth?.userInfo?.token}`,
                },
            };

            const { data } = await axios.post(
                `http://localhost:3000/api/v1/comments/${postId}`,
                { message: description },
                config
            );
            return {
                ...data,
                comment: {
                    ...data.comment,
                    author: userAuth?.userInfo
                }
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

// Delete Comment Action
export const deleteCommentAction = createAsyncThunk(
    "comment/delete",
    async (commentId, { rejectWithValue, getState, dispatch }) => {
        try {
            const { userAuth } = getState().users;
            const config = {
                headers: {
                    Authorization: `Bearer ${userAuth?.userInfo?.token}`,
                },
            };
            await axios.delete(
                `http://localhost:3000/api/v1/comments/${commentId}`,
                config
            );
            return commentId; // Return ID to filter local state
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

// Update Comment Action
export const updateCommentAction = createAsyncThunk(
    "comment/update",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { id, description } = payload;
            const { userAuth } = getState().users;
            const config = {
                headers: {
                    Authorization: `Bearer ${userAuth?.userInfo?.token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:3000/api/v1/comments/${id}`,
                { message: description },
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

const commentSlice = createSlice({
    name: "comment",
    initialState: INITIAL_STATE,
    extraReducers: (builder) => {
        // Create
        builder.addCase(createCommentAction.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createCommentAction.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.comment = action.payload;
            // Add new comment to top of list
            state.comments.unshift(action.payload.comment);
            state.error = null;
        });
        builder.addCase(createCommentAction.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        });

        // Delete
        builder.addCase(deleteCommentAction.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            // Filter out deleted comment
            state.comments = state.comments.filter(
                (comment) => comment._id !== action.payload
            );
            state.error = null;
        });
        builder.addCase(deleteCommentAction.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        });

        // Update
        builder.addCase(updateCommentAction.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateCommentAction.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            // Update comment in list
            const index = state.comments.findIndex(
                (c) => c._id === action.payload.updatedComment?._id
            );
            if (index !== -1) {
                state.comments[index] = action.payload.updatedComment;
            }
            state.error = null;
        });
        builder.addCase(updateCommentAction.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        });

        // Reset Error
        builder.addCase(resetErrorAction, (state) => {
            state.error = null;
        });
        // Reset Success
        builder.addCase(resetSuccessAction, (state) => {
            state.success = false;
        });
    },
});

export const commentReducer = commentSlice.reducer;
