import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "../globalSlice/globalSlice";
import { API_V1_URL } from "../../../utils/api";
const INITIAL_STATE = {
  loading: false,
  error: null,
  success: false,
  users: [],
  user: null,
  isUpdated: false,
  isDeleted: false,
  isEmailSent: false,
  isPasswordReset: false,
  profile: null,
  profileLoading: false,
  userAuth: {
    error: null,
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

// Login Action 
export const loginAction = createAsyncThunk("users/login", async (payload, { rejectWithValue, getState, dispatch }) => {
  // make request 
  try {
    const { data } = await axios.post(`${API_V1_URL}/users/login`, payload);
    localStorage.setItem("userInfo", JSON.stringify(data))
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data);
  }
});

// Register Action 

export const registerAction = createAsyncThunk("users/register", async (payload, { rejectWithValue, getState, dispatch }) => {
  // make request 
  try {
    const { data } = await axios.post(`${API_V1_URL}/users/register`, payload);
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data);
  }
});

// !Logout Action 
export const logoutAction = createAsyncThunk("users/logout", async () => {
  localStorage.removeItem("userInfo");
  return true;
})

// Fetch User Profile
export const fetchUserProfileAction = createAsyncThunk(
  "users/fetch-profile",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { userAuth } = getState().users;
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.userInfo?.token}`,
        },
      };
      const { data } = await axios.get(
        `${API_V1_URL}/users/profile`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Follow User
export const followUserAction = createAsyncThunk(
  "users/follow",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    try {
      const { userAuth } = getState().users;
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.userInfo?.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_V1_URL}/users/following/${userId}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Unfollow User
export const unfollowUserAction = createAsyncThunk(
  "users/unfollow",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    try {
      const { userAuth } = getState().users;
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.userInfo?.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_V1_URL}/users/unfollowing/${userId}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Block User
export const blockUserAction = createAsyncThunk(
  "users/block",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    try {
      const { userAuth } = getState().users;
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.userInfo?.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_V1_URL}/users/block/${userId}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Unblock User
export const unblockUserAction = createAsyncThunk(
  "users/unblock",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    try {
      const { userAuth } = getState().users;
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.userInfo?.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_V1_URL}/users/unblock/${userId}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
// Update Profile
export const updateUserProfileAction = createAsyncThunk(
  "users/update-profile",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { userAuth } = getState().users;
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.userInfo?.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_V1_URL}/users/profile`,
        payload,
        config
      );

      // Update Local Storage
      const currentUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      // Merge updated fields but preserve token/id
      const updatedUserInfo = {
        ...currentUserInfo,
        username: data.user.username,
        email: data.user.email,
        bio: data.user.bio,
        profilePicture: data.user.profilePicture,
        coverImage: data.user.coverImage,
      };

      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      return data.user;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: INITIAL_STATE,
  reducers: {
    checkAuthOnLoad: (state) => {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        try {
          state.userAuth.userInfo = JSON.parse(stored);
        } catch {
          localStorage.removeItem("userInfo");
          state.userAuth.userInfo = null;
        }
      } else {
        state.userAuth.userInfo = null;
      }
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(loginAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.userAuth.userInfo = action.payload;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    // register
    builder.addCase(registerAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.user = action.payload;
      state.message = "Registration successful";
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    // Logout
    builder.addCase(logoutAction.fulfilled, (state) => {
      state.userAuth.userInfo = null;
      state.profile = null;
      state.profileLoading = false;
      state.loading = false;
      state.error = null;
      state.success = false;
    });

    // Profile Fetch
    builder.addCase(fetchUserProfileAction.pending, (state) => {
      state.profileLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfileAction.fulfilled, (state, action) => {
      state.profileLoading = false;
      state.profile = action.payload?.user || null;
      state.error = null;
    });
    builder.addCase(fetchUserProfileAction.rejected, (state, action) => {
      state.profileLoading = false;
      state.error = action.payload;
    });

    // Follow
    builder.addCase(followUserAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(followUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(followUserAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Unfollow
    builder.addCase(unfollowUserAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(unfollowUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(unfollowUserAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Block
    builder.addCase(blockUserAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(blockUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(blockUserAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Unblock
    builder.addCase(unblockUserAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(unblockUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(unblockUserAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Profile (Mock)
    builder.addCase(updateUserProfileAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      // Merge updated user info into auth state (preserving token)
      state.userAuth.userInfo = { ...state.userAuth.userInfo, ...action.payload };

      // Update profile view
      if (state.profile?._id === action.payload._id) {
        state.profile = { ...state.profile, ...action.payload };
      }
      state.error = null;
    });
    builder.addCase(updateUserProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Reset error action 
    builder.addCase(resetErrorAction, (state) => {
      state.error = null;
    });
    // Reset success action
    builder.addCase(resetSuccessAction, (state) => {
      state.success = false;
    });
  },
});
export const { checkAuthOnLoad } = usersSlice.actions;
const usersReducer = usersSlice.reducer;
export default usersReducer
