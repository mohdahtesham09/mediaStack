import React from "react";
import { FaTwitter, FaInstagram, FaFacebookF } from "react-icons/fa";

const ProfileHeader = ({ user }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Cover Banner */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#A6D6E6] relative">
                {user?.coverImage && (
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Profile Info Section */}
            <div className="relative px-5 pb-5">
                {/* Avatar */}
                <div className="absolute -top-12 left-5">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                        <img
                            src={user?.avatar || "https://i.pravatar.cc/300?img=12"}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Name, Title & Social Icons */}
                <div className="pt-14 sm:pt-4 sm:pl-28 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {user?.name || "User Name"}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {user?.title || "Title not set"}
                        </p>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-2">
                        <a
                            href="#"
                            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 hover:scale-110"
                            aria-label="Twitter"
                        >
                            <FaTwitter size={16} />
                        </a>
                        <a
                            href="#"
                            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all duration-300 hover:scale-110"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={16} />
                        </a>
                        <a
                            href="#"
                            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:scale-110"
                            aria-label="Facebook"
                        >
                            <FaFacebookF size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
