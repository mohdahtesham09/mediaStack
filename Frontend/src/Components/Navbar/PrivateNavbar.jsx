import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import AddPost from "../PostsUI/AddPost";
import {
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import MediaStackLogo from "../MediaStackLogo";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../Redux/slices/users/userSlices";

const PrivateNavbar = () => {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Add Posts", href: "/add-post" },
  ];

  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logoutAction());
    window.location.reload();
  };
  return (
    <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link to='/' className='flex-shrink-0 flex items-center'>
              <MediaStackLogo size='small' />
            </Link>
            <div className='hidden sm:ml-8 sm:flex sm:space-x-1'>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className='px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200'
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className='flex items-center'>
            {/* Integrated Profile Dropdown */}
            <Menu as='div' className='relative ml-3'>
              <div>
                <Menu.Button className='flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 hover:scale-105 transition-transform'>
                  <span className='sr-only'>Open user menu</span>
                  <div className='w-9 h-9 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-medium text-sm'>
                    A
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100'>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to='/user-profile'
                        className={`${
                          active ? "bg-gray-50" : ""
                        } flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors`}
                      >
                        <UserIcon className='w-4 h-4 text-gray-400' />
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logoutHandler}
                        className={`${
                          active ? "bg-red-50 text-red-600" : "text-gray-700"
                        } flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors`}
                      >
                        <ArrowRightOnRectangleIcon
                          className={`w-4 h-4 ${active ? "text-red-400" : "text-gray-400"}`}
                        />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PrivateNavbar;
