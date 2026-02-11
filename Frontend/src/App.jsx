import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import UserProfile from "./Components/users/UserProfile";
import EditProfile from "./Components/users/EditProfile";
import PrivateNavbar from "./Components/Navbar/PrivateNavbar";
import PublicNavbar from "./Components/Navbar/PublicNavbar";
import { useSelector, useDispatch } from "react-redux";
import ProtectedRoute from "./Components/AuthRoute/ProtectedRoute";
import PostHome from "./Components/PostsUI/PostHome";
import AddPost from "./Components/PostsUI/AddPost";
import PostDetails from "./Components/PostsUI/PostDetails";
import EditPost from "./Components/PostsUI/EditPost";
import Footer from "./Components/Footer/Footer";
import { checkAuthOnLoad, fetchUserProfileAction } from "./Redux/slices/users/userSlices";

function App() {
  const dispatch = useDispatch();
  const { userAuth } = useSelector((state) => state.users);
  const isLoggedIn = userAuth?.userInfo?.token;

  // Restore auth state from localStorage on app load / refresh
  useEffect(() => {
    dispatch(checkAuthOnLoad());
  }, [dispatch]);

  // Fetch full profile from backend whenever auth is available
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserProfileAction());
    }
  }, [isLoggedIn, dispatch]);
  return (
    <BrowserRouter>
      {isLoggedIn ? <PrivateNavbar /> : <PublicNavbar />}
      <Routes>
        <Route path='/' element={<PostHome />} />
        <Route path='/posts' element={<PostHome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/user-profile'
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/edit-profile'
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/add-post'
          element={
            <ProtectedRoute>
              <AddPost />
            </ProtectedRoute>
          }
        />
        <Route
          path='/posts/:id'
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path='/posts/edit/:id'
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
