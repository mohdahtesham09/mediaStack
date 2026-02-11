import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfileAction, fetchUserProfileAction } from "../../Redux/slices/users/userSlices";
import { PhotoIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const SOCIAL_LINKS_STORAGE_KEY = "userProfileSocialLinks";

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, profile } = useSelector((state) => state.users);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        bio: "",
        location: "",
        gender: "",
    });

    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [socialLinks, setSocialLinks] = useState({
        twitter: "",
        linkedin: "",
        github: "",
        website: "",
    });

    useEffect(() => {
        if (!profile) {
            dispatch(fetchUserProfileAction());
        }
    }, [dispatch, profile]);

    // Populate form when profile data is available
    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || "",
                email: profile.email || "",
                bio: profile.bio || "",
                location: profile.location || "",
                gender: profile.gender || "",
            });
            setProfilePreview(profile.profilePicture);
            setCoverPreview(profile.coverImage);

            try {
                const stored = localStorage.getItem(SOCIAL_LINKS_STORAGE_KEY);
                if (!stored) {
                    setSocialLinks({ twitter: "", linkedin: "", github: "", website: "" });
                    return;
                }
                const parsed = JSON.parse(stored);
                const profileSocialLinks = parsed?.[profile._id];
                if (profileSocialLinks) {
                    setSocialLinks({
                        twitter: profileSocialLinks.twitter || "",
                        linkedin: profileSocialLinks.linkedin || "",
                        github: profileSocialLinks.github || "",
                        website: profileSocialLinks.website || "",
                    });
                } else {
                    setSocialLinks({ twitter: "", linkedin: "", github: "", website: "" });
                }
            } catch {
                setSocialLinks({ twitter: "", linkedin: "", github: "", website: "" });
            }
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (e) => {
        setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, type) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (type === 'profile') {
                setProfileFile(selectedFile);
                setProfilePreview(URL.createObjectURL(selectedFile));
            } else {
                setCoverFile(selectedFile);
                setCoverPreview(URL.createObjectURL(selectedFile));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData
        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("bio", formData.bio);
        data.append("location", formData.location);
        data.append("gender", formData.gender);

        if (profileFile) data.append("profilePicture", profileFile);
        if (coverFile) data.append("coverImage", coverFile);

        dispatch(updateUserProfileAction(data)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                const updatedProfileId = result?.payload?._id || profile?._id;
                if (updatedProfileId) {
                    try {
                        const stored = localStorage.getItem(SOCIAL_LINKS_STORAGE_KEY);
                        const parsed = stored ? JSON.parse(stored) : {};
                        parsed[updatedProfileId] = socialLinks;
                        localStorage.setItem(SOCIAL_LINKS_STORAGE_KEY, JSON.stringify(parsed));
                    } catch {
                        // Ignore localStorage write errors
                    }
                }
                dispatch(fetchUserProfileAction()); // Refresh data
                navigate("/user-profile");
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 animate-fade-in">
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-4 p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-800">Edit Profile</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Images Section */}
                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Image</label>
                            <div className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 hover:border-blue-300 transition-all group cursor-pointer">
                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />

                                {coverPreview ? (
                                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <PhotoIcon className="w-10 h-10 mb-2 opacity-50" />
                                        <span className="text-sm font-medium">Click to upload cover</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">Change Cover</span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Picture */}
                        <div className="flex items-center gap-5">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 shrink-0">
                                {profilePreview ? (
                                    <img src={profilePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                        <PhotoIcon className="w-10 h-10 text-slate-300" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-slate-900 mb-1">Profile Picture</h3>
                                <p className="text-xs text-slate-500 mb-3">JPG, PNG or GIF. Max 2MB.</p>
                                <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all inline-flex items-center shadow-sm">
                                    Change Photo
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Inputs Section */}
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400" placeholder="e.g. New York, USA" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email (Read Only)</label>
                                <input type="email" name="email" value={formData.email} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 cursor-pointer appearance-none">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
                            <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400" placeholder="Tell the world about yourself..." />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Social Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Twitter</label>
                                    <input type="text" name="twitter" value={socialLinks.twitter} onChange={handleSocialChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400" placeholder="https://twitter.com/yourname" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">LinkedIn</label>
                                    <input type="text" name="linkedin" value={socialLinks.linkedin} onChange={handleSocialChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400" placeholder="https://linkedin.com/in/yourname" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">GitHub</label>
                                    <input type="text" name="github" value={socialLinks.github} onChange={handleSocialChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400" placeholder="https://github.com/yourname" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website</label>
                                    <input type="text" name="website" value={socialLinks.website} onChange={handleSocialChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400" placeholder="https://yourwebsite.com" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 px-4 py-3.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-[2] px-4 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
                            {loading ? (
                                <React.Fragment>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Saving Changes...
                                </React.Fragment>
                            ) : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
