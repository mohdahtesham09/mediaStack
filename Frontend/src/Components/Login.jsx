import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { fetchUserProfileAction, loginAction } from "../Redux/slices/users/userSlices";
import AnimationLogo from "./AnimationLogo";
import LoadingComponent from "./Alert/LoadingComponent";
import ErrorMsg from "./Alert/ErrorMsg";
import SuccessMsg from "./Alert/SuccessMsg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { userAuth, loading, error, success } = useSelector((state) => state.users);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAction({ username: formData.username, password: formData.password }));
    setFormData({ username: "", password: "" });
  };

  useEffect(() => {
    if (userAuth?.userInfo?.token) {
      dispatch(fetchUserProfileAction()).then(() => {
        navigate("/user-profile");
      });
    }
  }, [dispatch, navigate, userAuth?.userInfo?.token]);

  return (
    <div className='min-h-screen bg-slate-100'>
      <div className='mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 md:grid-cols-2'>
        <aside className='hidden md:flex flex-col justify-center bg-gray-50 px-8 lg:px-12 py-12'>
          <h1 className='text-gray-900 text-left font-bold text-3xl lg:text-4xl leading-tight'>
            A Simple and <span className='text-[#555E70]'>Modern</span> Platform to Share
            <br />
            Blogs, Thoughts, and <span className='text-[#555E70]'>Creative Ideas</span>.
          </h1>
          <div className='mt-10 flex flex-col gap-4 text-base lg:text-lg font-medium text-gray-600'>
            <p className='flex items-center gap-2'>
              <VscActivateBreakpoints /> Write. Share. Inspire.
            </p>
            <p className='flex items-center gap-2'>
              <VscActivateBreakpoints /> Connect through content.
            </p>
            <p className='flex items-center gap-2'>
              <VscActivateBreakpoints /> Your ideas matter.
            </p>
          </div>
        </aside>

        <section className='flex items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-10'>
          <div className='w-full max-w-md rounded-2xl bg-white/70 p-6 sm:p-8 shadow-xl backdrop-blur-md'>
            <form className='w-full space-y-5' onSubmit={handleSubmit}>
              <div className='text-center mb-4'>
                <div className='flex items-center justify-center'>
                  <AnimationLogo />
                </div>
                <h2 className='text-2xl font-bold mt-2'>Login</h2>
                <h4 className='text-sm sm:text-base mt-1 text-slate-600'>Enter your details below.</h4>
              </div>

              {error && <ErrorMsg message={error?.message} />}
              {success && <SuccessMsg message='Login Successful' />}

              <div>
                <label className='block mb-1 text-sm font-medium'>Username</label>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  placeholder='Enter username'
                  onChange={handleChange}
                  className='w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
              </div>

              <div>
                <label className='block mb-1 text-sm font-medium'>Password</label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  placeholder='Enter password'
                  onChange={handleChange}
                  className='w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
              </div>

              {loading ? (
                <LoadingComponent />
              ) : (
                <button
                  type='submit'
                  className='w-full bg-[#A6D6E6] hover:bg-[#8FC7DB] text-black px-4 py-3 rounded-lg font-semibold transition shadow-2xl'
                >
                  Login
                </button>
              )}

              <p className='text-sm text-center text-slate-600'>
                Don't have an account?{" "}
                <Link to='/register' className='text-blue-600 hover:underline'>
                  Register
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
