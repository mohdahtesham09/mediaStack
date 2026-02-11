import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resetErrorAction, resetSuccessAction } from "../globalSlice/globalSlice";
import axios from "axios";
const INITIAL_STATE = {
  loading: false,
  error: null,
  success: false,
  categories: [],
  category: null,
};

// Fetch Public Post Action 
export const fetchCategoriesAction = createAsyncThunk(
  "categories/lists",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // make request 
    try {
      const { data } = await axios.get("http://localhost:3000/api/v1/categories",
        payload
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  });


// ! Categories Slice
const categoriesSlice = createSlice({
  name: "categories",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    // fetchCategories
    builder.addCase(fetchCategoriesAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.categories = action.payload;
    });

    builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    // !Reset error action 
    builder.addCase(resetErrorAction, (state) => {
      state.error = null;
    });
    // !Reset success action
    builder.addCase(resetSuccessAction, (state) => {
      state.success = false;
    })
  },
});
// Genrate reducer 
const categoriesReducer = categoriesSlice.reducer;
export default categoriesReducer;
