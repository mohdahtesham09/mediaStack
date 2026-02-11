import React from "react";
import MediaStackLogo from "../MediaStackLogo";
import { Link } from "react-router-dom";
import {
  CurrencyDollarIcon, // Placeholder for logo icon if needed
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className='bg-white border-t border-slate-100 mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Column */}
          <MediaStackLogo />

          {/* Quick Links */}
          <div>
            <h3 className='text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  to='/'
                  className='text-slate-500 hover:text-blue-600 text-sm transition-colors'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/add-post'
                  className='text-slate-500 hover:text-blue-600 text-sm transition-colors'
                >
                  Create Post
                </Link>
              </li>
              <li>
                <Link
                  to='/user-profile'
                  className='text-slate-500 hover:text-blue-600 text-sm transition-colors'
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div>
            <h3 className='text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4'>
              Connect
            </h3>
            <ul className='space-y-3'>
              <li>
                <a
                  href='#'
                  className='text-slate-500 hover:text-blue-600 text-sm transition-colors flex items-center gap-2'
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-500 hover:text-blue-600 text-sm transition-colors flex items-center gap-2'
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-500 hover:text-blue-600 text-sm transition-colors flex items-center gap-2'
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-slate-400 text-sm'>
            &copy; {new Date().getFullYear()} BloggyTech. All rights reserved.
          </p>
          <div className='flex gap-6 text-sm text-slate-400'>
            <a href='#' className='hover:text-slate-600 transition-colors'>
              Privacy Policy
            </a>
            <a href='#' className='hover:text-slate-600 transition-colors'>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
