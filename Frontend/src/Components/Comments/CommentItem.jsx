import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentAction, updateCommentAction } from "../../Redux/slices/comments/commentSlice";
import { UserCircleIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const CommentItem = ({ comment }) => {
    const dispatch = useDispatch();
    const { userAuth } = useSelector((state) => state.users);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment?.message);
    const [showMenu, setShowMenu] = useState(false);

    // Check if current user is owner
    // comment.author is object with _id (from formatting) or direct ID
    const authorId = comment?.author?._id || comment?.author;
    const isOwner = userAuth?.userInfo?._id === authorId;

    const handleDelete = () => {
        if (window.confirm("Delete this comment?")) {
            dispatch(deleteCommentAction(comment?._id));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!editText.trim()) return;
        dispatch(updateCommentAction({ id: comment?._id, description: editText }));
        setIsEditing(false);
        setShowMenu(false);
    };

    return (
        <div className="flex gap-4 mb-6 group">
            <div className="flex-shrink-0">
                {comment?.author?.profileImage ? (
                    <img src={comment?.author?.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <UserCircleIcon className="w-10 h-10 text-slate-300" />
                )}
            </div>

            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900">
                        {comment?.author?.username || "User"}
                    </span>
                    <span className="text-xs text-slate-500">
                        {comment?.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                    </span>
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full border-b-2 border-slate-300 focus:border-blue-600 outline-none py-1 bg-transparent"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-medium text-slate-500 hover:text-slate-700">Cancel</button>
                            <button type="submit" className="text-sm font-medium text-blue-600 hover:text-blue-700">Save</button>
                        </div>
                    </form>
                ) : (
                    <p className="text-slate-700 text-sm leading-relaxed">
                        {comment?.message}
                    </p>
                )}
            </div>

            {isOwner && (
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-slate-100"
                    >
                        <EllipsisVerticalIcon className="w-5 h-5 text-slate-500" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg py-1 w-32 border border-slate-100 z-10">
                            <button
                                onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <PencilIcon className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <TrashIcon className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
