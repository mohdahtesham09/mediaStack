import React from "react";
import { useSelector } from "react-redux";
import { FaTwitter, FaInstagram, FaFacebookF, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaUsers, FaDollarSign } from "react-icons/fa";

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
];

// Default user data (fallback/placeholder)
const defaultUser = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    title: "Senior Product Designer",
    location: "San Francisco, CA",
    salary: "$120,000",
    team: "Design Team",
    birthday: "March 15, 1992",
    about: "Passionate designer with 8+ years of experience creating beautiful, user-centered digital experiences. I love collaborating with cross-functional teams to bring innovative ideas to life. When I'm not designing, you can find me hiking, reading, or experimenting with new coffee brewing methods.",
    avatar: "https://i.pravatar.cc/300?img=12",
    coverImage: null,
};

const Profile = ({ userData }) => {
    // Try to get user from Redux store, fallback to props, then to default
    const { userAuth } = useSelector((state) => state.users);
    const user = userData || userAuth?.userInfo || defaultUser;

    // Info cards data
    const infoCards = [
        { icon: FaEnvelope, label: "Email", value: user.email || "Not provided" },
        { icon: FaPhone, label: "Phone", value: user.phone || "Not provided" },
        { icon: FaMapMarkerAlt, label: "Location", value: user.location || "Not provided" },
        { icon: FaBirthdayCake, label: "Birthday", value: user.birthday || "Not provided" },
        { icon: FaUsers, label: "Team", value: user.team || "Not provided" },
        { icon: FaDollarSign, label: "Salary", value: user.salary || "Not provided" },
    ];

    return (
        <div className="min-h-screen bg-[#f5f6fa] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Following Sidebar */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-md p-5 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Following</h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                {followingData.map((person) => (
                                    <div
                                        key={person.id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                                    >
                                        <img
                                            src={person.avatar}
                                            alt={person.name}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#A6D6E6] transition-all"
                                        />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                            {person.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-6">

                        {/* Profile Header Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Cover Banner */}
                            <div className="h-40 sm:h-52 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#A6D6E6] relative">
                                {user.coverImage && (
                                    <img
                                        src={user.coverImage}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Profile Info Section */}
                            <div className="relative px-6 pb-6">
                                {/* Avatar */}
                                <div className="absolute -top-16 left-6">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                        <img
                                            src={user.avatar || defaultUser.avatar}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Name, Title & Social Icons */}
                                <div className="pt-20 sm:pt-6 sm:pl-40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {user.name || "User Name"}
                                        </h1>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {user.title || "Title not set"}
                                        </p>
                                    </div>

                                    {/* Social Icons */}
                                    <div className="flex items-center gap-3">
                                        <a
                                            href="#"
                                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 hover:scale-110"
                                            aria-label="Twitter"
                                        >
                                            <FaTwitter size={18} />
                                        </a>
                                        <a
                                            href="#"
                                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all duration-300 hover:scale-110"
                                            aria-label="Instagram"
                                        >
                                            <FaInstagram size={18} />
                                        </a>
                                        <a
                                            href="#"
                                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:scale-110"
                                            aria-label="Facebook"
                                        >
                                            <FaFacebookF size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats/Info Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {infoCards.map((card, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300 group cursor-default"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#f5f6fa] flex items-center justify-center text-[#667eea] group-hover:bg-[#667eea] group-hover:text-white transition-all duration-300">
                                            <card.icon size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                                                {card.label}
                                            </p>
                                            <p className="text-gray-800 font-semibold truncate mt-0.5">
                                                {card.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* About Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {user.about || "No bio available. Add some information about yourself!"}
                            </p>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;
