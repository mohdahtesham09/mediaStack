import React from "react";
import { useDispatch } from "react-redux";
import { unfollowUserAction, unblockUserAction, fetchUserProfileAction } from "../../Redux/slices/users/userSlices";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const UserList = ({ users, type }) => {
    const dispatch = useDispatch();

    // Filter unique users to prevent duplicates from backend
    const uniqueUsers = users?.filter(
        (user, index, self) => index === self.findIndex((u) => u?._id === user?._id)
    );

    const handleUnfollow = (id) => {
        if (window.confirm("Are you sure you want to unfollow this user?")) {
            dispatch(unfollowUserAction(id)).then(() => {
                dispatch(fetchUserProfileAction()); // Refresh profile to update lists
            });
        }
    };

    const handleUnblock = (id) => {
        if (window.confirm("Are you sure you want to unblock this user?")) {
            dispatch(unblockUserAction(id)).then(() => {
                dispatch(fetchUserProfileAction());
            });
        }
    };

    if (!uniqueUsers?.length) {
        return (
            <div className="text-center py-10 text-slate-500 italic">
                No users found in this list.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {uniqueUsers.map((user) => (
                <div
                    key={user?._id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        {user?.profilePhoto ? (
                            <img
                                src={user?.profilePhoto}
                                alt={user?.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <UserCircleIcon className="w-10 h-10 text-slate-300" />
                        )}
                        <div>
                            <h4 className="font-semibold text-slate-900 text-sm">
                                {user?.username}
                            </h4>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                    </div>

                    {type === "following" && (
                        <button
                            onClick={() => handleUnfollow(user?._id)}
                            className="text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors border border-red-100"
                        >
                            Unfollow
                        </button>
                    )}

                    {type === "blocked" && (
                        <button
                            onClick={() => handleUnblock(user?._id)}
                            className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors border border-slate-200"
                        >
                            Unblock
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UserList;
