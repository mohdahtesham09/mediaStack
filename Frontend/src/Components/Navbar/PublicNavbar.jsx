import React from "react";
import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import MediaStackLogo from "../MediaStackLogo";

const PublicNavbar = () => {
  return (
    <Disclosure
      as='nav'
      className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'
    >
      {({ open }) => (
        <>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
              <div className='flex items-center'>
                <Link to='/' className='flex-shrink-0 flex items-center'>
                  <MediaStackLogo size='small' />
                </Link>
              </div>

              {/* Desktop View */}
              <div className='hidden sm:flex sm:items-center sm:space-x-4'>
                <Link
                  to='/login'
                  className='px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='px-5 py-2 text-sm font-medium bg-[#A6D6E6] hover:bg-[#8FC7DB] text-black rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200'
                >
                  Register
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className='flex items-center sm:hidden'>
                <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#667eea]'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className='sm:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-200'>
            <div className='px-4 pt-2 pb-6 space-y-3'>
              <Link
                to='/login'
                className='block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all'
              >
                Login
              </Link>
              <Link
                to='/register'
                className='block px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl shadow-sm text-center'
              >
                Register
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default PublicNavbar;
