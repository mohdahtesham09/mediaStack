import React from "react";
import moment from "moment";
import {
  FiEye,
  FiThumbsUp,
  FiThumbsDown,
  FiMessageCircle,
  FiClock,
} from "react-icons/fi";

const PostStats = ({ views, likes, dislikes, comments, createdAt }) => {
  const createdAtMoment = createdAt ? moment(createdAt) : null;
  const relativeCreatedAt = createdAtMoment?.isValid()
    ? createdAtMoment.fromNow()
    : "Date unavailable";

  const stats = [
    { icon: FiEye, value: views, label: "views" },
    { icon: FiThumbsUp, value: likes, label: "likes" },
    { icon: FiThumbsDown, value: dislikes, label: "dislikes" },
    { icon: FiMessageCircle, value: comments, label: "comments" },
    { icon: FiClock, value: relativeCreatedAt, label: "createdAt" },
  ];

  return (
    <div className='w-full overflow-x-auto'>
      <div className='flex min-w-max items-center gap-4 text-xs text-gray-500 sm:text-sm'>
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className='inline-flex items-center gap-1.5 whitespace-nowrap'
          >
            <Icon className='h-4 w-4' aria-hidden='true' />
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostStats;
