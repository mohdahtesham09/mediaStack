import React from "react";
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaBirthdayCake,
    FaUsers,
    FaDollarSign,
} from "react-icons/fa";

const UserInfoCards = ({ user }) => {
    const infoCards = [
        { icon: FaEnvelope, label: "Email", value: user?.email || "Not provided" },
        { icon: FaPhone, label: "Phone", value: user?.phone || "Not provided" },
        { icon: FaMapMarkerAlt, label: "Location", value: user?.location || "Not provided" },
        { icon: FaBirthdayCake, label: "Birthday", value: user?.birthday || "Not provided" },
        { icon: FaUsers, label: "Team", value: user?.team || "Not provided" },
        { icon: FaDollarSign, label: "Salary", value: user?.salary || "Not provided" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {infoCards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300 group cursor-default"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f5f6fa] flex items-center justify-center text-[#667eea] group-hover:bg-[#667eea] group-hover:text-white transition-all duration-300 flex-shrink-0">
                            <card.icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                                {card.label}
                            </p>
                            <p className="text-gray-800 font-semibold text-sm truncate">
                                {card.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserInfoCards;
