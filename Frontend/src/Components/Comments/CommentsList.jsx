import React from "react";
import { useSelector } from "react-redux";
import CommentItem from "./CommentItem";

const CommentsList = ({ postId }) => {
    const { comments } = useSelector((state) => state.comment);

    // Filter comments for this specific post (Frontend Session Logic)
    const postComments = comments.filter(comment => comment.postId === postId);

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
                Comments ({postComments?.length || 0})
            </h3>

            <div className="space-y-6">
                {postComments?.length > 0 ? (
                    postComments.map((comment, index) => (
                        <CommentItem key={comment._id || index} comment={comment} />
                    ))
                ) : (
                    <p className="text-slate-500 text-sm italic">
                        No comments yet. Be the first to start the conversation! (Note: Comments are session-based)
                    </p>
                )}
            </div>
        </div>
    );
};

export default CommentsList;
