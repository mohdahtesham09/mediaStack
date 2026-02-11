import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentAction } from "../../Redux/slices/comments/commentSlice";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const AddComment = ({ postId }) => {
    const [description, setDescription] = useState("");
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.comment);
    const { userAuth } = useSelector((state) => state.users);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description.trim()) return;
        dispatch(createCommentAction({ description, postId }));
        setDescription("");
    };

    if (!userAuth?.userInfo) return null;

    return (
        <div className='flex gap-4 mb-8'>
            {/* Avatar */}
            <div className='flex-shrink-0'>
                {userAuth?.userInfo?.profileImage ? (
                    <img src={userAuth?.userInfo?.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <UserCircleIcon className="w-10 h-10 text-slate-300" />
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='flex-grow'>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-transparent border-b border-slate-200 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        disabled={loading}
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error?.message}</p>}
                </div>

                <div className={`flex justify-end mt-2 gap-2 transition-opacity duration-200 ${description.trim() ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button
                        type="button"
                        onClick={() => setDescription("")}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!description.trim() || loading}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Posting..." : "Comment"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddComment;
