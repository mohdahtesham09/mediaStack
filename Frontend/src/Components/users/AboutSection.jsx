import React from "react";

const AboutSection = ({ about }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-base font-semibold text-gray-800 mb-2">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                {about || "No bio available. Add some information about yourself!"}
            </p>
        </div>
    );
};

export default AboutSection;
