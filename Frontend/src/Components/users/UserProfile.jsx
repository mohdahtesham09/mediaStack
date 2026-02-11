import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfileAction } from "../../Redux/slices/users/userSlices";
import { deletePostAction } from "../../Redux/slices/posts/postSlice";
import UserList from "./UserList";
import { UserCircleIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { CalendarIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const SOCIAL_LINKS_STORAGE_KEY = "userProfileSocialLinks";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, profileLoading, error } = useSelector(
    (state) => state.users,
  );
  const userAuth = useSelector(
    (state) => state.auth?.userAuth || state.users?.userAuth || null,
  );
  const { deleteLoading } = useSelector((state) => state.posts);
  const [activeTab, setActiveTab] = useState("posts");
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [profileActionError, setProfileActionError] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    linkedin: "",
    github: "",
    website: "",
  });

  useEffect(() => {
    dispatch(fetchUserProfileAction());
  }, [dispatch]);

  useEffect(() => {
    if (!profile?._id) {
      setSocialLinks({ twitter: "", linkedin: "", github: "", website: "" });
      return;
    }
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
  }, [profile?._id]);

  // Use profile data from backend ONLY
  const user = profile;
  const authUserId = userAuth?._id || userAuth?.userInfo?._id;
  const isMe =
    profile?._id && authUserId && String(profile._id) === String(authUserId);
  const hasSocialLinks = Object.values(socialLinks).some((link) =>
    link?.trim(),
  );
  const normalizeUrl = (url) =>
    /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const canManagePost = (post) =>
    Boolean(
      post &&
        authUserId &&
        String(post?.author?._id || post?.author) === String(authUserId),
    );
  const getAuthorName = (post) =>
    post?.user?.name ||
    post?.user?.username ||
    post?.author?.name ||
    post?.author?.username ||
    user?.username ||
    "Author";

  const handleDeletePost = async (postId) => {
    setProfileActionError("");
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!isConfirmed) return;

    setDeletingPostId(postId);
    try {
      await dispatch(deletePostAction(postId)).unwrap();
      await dispatch(fetchUserProfileAction()).unwrap();
    } catch (err) {
      setProfileActionError(err?.message || "Failed to delete post");
    } finally {
      setDeletingPostId(null);
    }
  };

  // Stats
  const postsCount = user?.posts?.length || 0;
  const followersCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;
  const blockedCount = user?.blockedUsers?.length || 0;
  const viewersCount = user?.profileViewers?.length || 0;

  if (profileLoading)
    return (
      <div className='text-center py-20 font-medium text-slate-500'>
        Loading profile data...
      </div>
    );
  if (error)
    return (
      <div className='text-center py-20 text-red-500 font-medium'>
        Error loading profile: {error?.message}
      </div>
    );
  if (!profile) return null;

  return (
    <div className='bg-slate-50 min-h-screen pb-20'>
      {/* Header Section */}
      <div className='bg-white shadow-sm border-b border-slate-200'>
        {/* Cover Image */}
        <div className='h-48 md:h-64 w-full bg-slate-200 relative overflow-hidden'>
          {user?.coverImage ? (
            <img
              src={user?.coverImage}
              alt='Cover'
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full bg-slate-100 flex items-center justify-center text-slate-400'>
              {/* Placeholder or empty */}
            </div>
          )}
        </div>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8'>
          <div className='flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 md:-mt-16 mb-6'>
            {/* Avatar */}
            <div className='flex-shrink-0 relative group z-10'>
              {user?.profilePicture ? (
                <img
                  src={user?.profilePicture}
                  alt={user?.username}
                  className='w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white'
                />
              ) : (
                <div className='w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center'>
                  <UserCircleIcon className='w-full h-full text-slate-300' />
                </div>
              )}
            </div>

            {/* Info */}
            <div className='flex-grow w-full'>
              <div className='flex justify-between items-start'>
                <div>
                  <h1 className='text-3xl font-bold text-slate-900 mb-2'>
                    {user?.username}
                  </h1>
                  <p className='text-slate-600 mb-2 max-w-lg leading-relaxed'>
                    {user?.bio || "No bio added"}
                  </p>
                  {hasSocialLinks && (
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {socialLinks.twitter?.trim() && (
                        <a
                          href={normalizeUrl(socialLinks.twitter.trim())}
                          target='_blank'
                          rel='noreferrer'
                          className='text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors'
                        >
                          Twitter
                        </a>
                      )}
                      {socialLinks.linkedin?.trim() && (
                        <a
                          href={normalizeUrl(socialLinks.linkedin.trim())}
                          target='_blank'
                          rel='noreferrer'
                          className='text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors'
                        >
                          LinkedIn
                        </a>
                      )}
                      {socialLinks.github?.trim() && (
                        <a
                          href={normalizeUrl(socialLinks.github.trim())}
                          target='_blank'
                          rel='noreferrer'
                          className='text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors'
                        >
                          GitHub
                        </a>
                      )}
                      {socialLinks.website?.trim() && (
                        <a
                          href={normalizeUrl(socialLinks.website.trim())}
                          target='_blank'
                          rel='noreferrer'
                          className='text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors'
                        >
                          Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
                {/* Edit Profile Button */}
                {isMe && (
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className='bg-blue-600 text-white px-4 py-2 rounded-md'
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <div className='flex flex-wrap gap-4 text-sm text-slate-500 mb-6 font-medium'>
                {user?.location && (
                  <div className='flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full'>
                    <MapPinIcon className='w-4 h-4' />
                    {user?.location}
                  </div>
                )}
                <div className='flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full'>
                  <EnvelopeIcon className='w-4 h-4' />
                  {user?.email}
                </div>
                <div className='flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full'>
                  <CalendarIcon className='w-4 h-4' />
                  Joined{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Recently"}
                </div>
                <div className='flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full'>
                  <span>👀</span>
                  {viewersCount} Viewers
                </div>
              </div>

              {/* Stats Row */}
              <div className='flex gap-1 md:gap-4 border-t border-slate-100 pt-6'>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-center transition-colors ${activeTab === "posts" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  <span className='block font-bold text-xl'>{postsCount}</span>
                  <span className='text-xs uppercase tracking-wide font-semibold'>
                    Posts
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("followers")}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-center transition-colors ${activeTab === "followers" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  <span className='block font-bold text-xl'>
                    {followersCount}
                  </span>
                  <span className='text-xs uppercase tracking-wide font-semibold'>
                    Followers
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-center transition-colors ${activeTab === "following" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  <span className='block font-bold text-xl'>
                    {followingCount}
                  </span>
                  <span className='text-xs uppercase tracking-wide font-semibold'>
                    Following
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("blocked")}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-center transition-colors ${activeTab === "blocked" ? "bg-red-50 text-red-600" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  <span className='block font-bold text-xl'>
                    {blockedCount}
                  </span>
                  <span className='text-xs uppercase tracking-wide font-semibold'>
                    Blocked
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Tabs Indicator (Mobile Scroller) */}
        <div className='flex overflow-x-auto border-b border-slate-200 mb-8 scrollbar-hide'>
          {["posts", "followers", "following", "blocked"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-medium text-sm transition-all border-b-2 whitespace-nowrap capitalize ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='min-h-[300px]'>
          {activeTab === "posts" && (
            <>
              {profileActionError && (
                <div className='mb-4 rounded-md bg-red-50 text-red-600 px-4 py-2 text-sm'>
                  {profileActionError}
                </div>
              )}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {user?.posts?.length > 0 ? (
                  user.posts.map((post) => (
                    <div
                      key={post._id}
                      className='bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'
                    >
                      <Link to={`/posts/${post._id}`} className='block'>
                        <div className='h-48 bg-slate-200 overflow-hidden'>
                          <img
                            src={post.image}
                            alt={post.title}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                          />
                        </div>
                      </Link>
                      <div className='p-5'>
                        <Link to={`/posts/${post._id}`}>
                          <h3 className='font-bold text-slate-900 line-clamp-1 mb-2'>
                            {post.title}
                          </h3>
                        </Link>
                        <p className='text-xs text-slate-500 mb-2'>
                          By {getAuthorName(post)}
                        </p>
                        <div className='flex justify-between items-center text-xs text-slate-500'>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span className='bg-slate-100 px-2 py-1 rounded-full'>
                            {post?.category?.name || "Blog"}
                          </span>
                        </div>
                        {canManagePost(post) && (
                          <div className='mt-4 flex gap-2'>
                            <button
                              type='button'
                              onClick={() => navigate(`/posts/edit/${post._id}`)}
                              className='flex-1 px-3 py-2 text-sm rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50'
                            >
                              Edit
                            </button>
                            <button
                              type='button'
                              onClick={() => handleDeletePost(post._id)}
                              disabled={deleteLoading && deletingPostId === post._id}
                              className='flex-1 px-3 py-2 text-sm rounded-md border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-60'
                            >
                              {deleteLoading && deletingPostId === post._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='col-span-full flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-xl border border-dashed border-slate-200'>
                    <CalendarIcon className='w-12 h-12 mb-3 text-slate-300' />
                    <p>No posts published yet.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "followers" && (
            <UserList users={user?.followers} type='followers' />
          )}
          {activeTab === "following" && (
            <UserList users={user?.following} type='following' />
          )}
        {activeTab === "blocked" && (
          <UserList users={user?.blockedUsers} type='blocked' />
        )}
      </div>
      </div>
    </div>
  );
};

export default UserProfile;
