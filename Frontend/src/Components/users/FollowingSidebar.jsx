import React from "react";
import { FaEye, FaLockOpen, FaLock, FaUserPlus } from "react-icons/fa";

// Dummy following data
const followingData = [
    { id: 1, name: "Sarah Wilson", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "James Chen", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Emily Davis", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Michael Brown", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Olivia Martinez", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 6, name: "Daniel Kim", avatar: "https://i.pravatar.cc/150?img=6" },
    { id: 7, name: "Sophia Lee", avatar: "https://i.pravatar.cc/150?img=7" },
    { id: 8, name: "Lucas Taylor", avatar: "https://i.pravatar.cc/150?img=8" },
    { id: 9, name: "Anna Scott", avatar: "https://i.pravatar.cc/150?img=9" },
    { id: 10, name: "Robert White", avatar: "https://i.pravatar.cc/150?img=10" },
    { id: 11, name: "Chloe Adams", avatar: "https://i.pravatar.cc/150?img=11" },
];

const FollowingSidebar = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
            <h3 className="text-base font-semibold text-gray-800 mb-3 flex-shrink-0">
                Following
            </h3>

            {/* Following List */}
            <div className="flex-1 overflow-y-auto max-h-96 space-y-2 pr-1 custom-scrollbar">
                {followingData.map((person) => (
                    <div
                        key={person.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                        <img
                            src={person.avatar}
                            alt={person.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#A6D6E6] transition-all flex-shrink-0"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors truncate">
                            {person.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Action Buttons Section */}
            <div className="mt-5 pt-5 border-t border-gray-50 flex flex-wrap items-center justify-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg shadow-sm transition-all duration-200 cursor-pointer text-xs font-medium border border-transparent hover:border-gray-200">
                    <FaEye size={14} className="text-gray-400" />
                    <span>Views (1.2k)</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transition-all duration-200 cursor-pointer text-xs font-medium border border-gray-100 hover:border-gray-200">
                    <FaLockOpen size={13} className="text-gray-400" />
                    <span>Unblock</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transition-all duration-200 cursor-pointer text-xs font-medium border border-gray-100 hover:border-gray-200">
                    <FaLock size={13} className="text-gray-400" />
                    <span>Block</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#A6D6E6]/10 hover:bg-[#A6D6E6]/20 text-gray-800 rounded-lg shadow-sm transition-all duration-200 cursor-pointer text-xs font-semibold border border-[#A6D6E6]/20 hover:border-[#A6D6E6]/40">
                    <FaUserPlus size={14} className="text-[#667eea]" />
                    <span>Follow</span>
                </button>
            </div>
        </div>
    );
};

export default FollowingSidebar;
