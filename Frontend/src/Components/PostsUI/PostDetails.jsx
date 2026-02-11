import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostDetailsAction } from "../../Redux/slices/posts/postSlice";
import LoadingComponent from "../Alert/LoadingComponent";
import PostStats from "./PostStats";
import {
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import AddComment from "../Comments/AddComment";
import CommentsList from "../Comments/CommentsList";

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { post, error, loading } = useSelector((state) => state?.posts);

  useEffect(() => {
    dispatch(fetchPostDetailsAction(id));
  }, [id, dispatch]);

  const postData = post?.post;
  const authorName =
    postData?.user?.name ||
    postData?.user?.username ||
    postData?.author?.name ||
    postData?.author?.username ||
    "Author";

  if (loading) return <LoadingComponent />;
  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen bg-slate-50'>
        <h3 className='text-red-500 text-xl font-semibold'>
          {error?.message || "Something went wrong"}
        </h3>
      </div>
    );

  return (
    <div className='bg-slate-50 min-h-screen py-10'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Back Button */}
        <Link
          to='/posts'
          className='inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors group'
        >
          <ArrowLeftIcon className='w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform' />
          Back to Posts
        </Link>

        {postData && (
          <article className='bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100'>
            {/* Hero Image */}
            <div className='relative h-[400px] w-full'>
              <img
                src={
                  postData?.image ||
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000"
                }
                alt={postData?.title}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>

              {/* Category Badge overlay */}
              <div className='absolute bottom-6 left-6 md:bottom-10 md:left-10'>
                <span className='inline-block px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-semibold tracking-wide shadow-lg mb-3'>
                  {postData?.category?.name || "Uncategorized"}
                </span>
                <h1 className='text-3xl md:text-5xl font-extrabold text-white leading-tight shadow-sm'>
                  {postData?.title}
                </h1>
              </div>
            </div>

            {/* Content Container */}
            <div className='p-8 md:p-12'>
              {/* Meta Data */}
              <div className='flex items-center gap-6 text-slate-500 text-sm mb-10 pb-8 border-b border-slate-100'>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-500'>
                    <UserIcon className='w-5 h-5' />
                  </div>
                  <span className='font-medium text-slate-700'>
                    {authorName}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <CalendarIcon className='w-5 h-5 text-slate-400' />
                  <span>
                    {new Date(postData?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className='space-y-10 p-6 bg-gray-100/70 rounded-2xl '>
                <PostStats
                  views={post?.post.views}
                  likes={post?.post?.likes.length}
                  dislikes={post?.post?.dislikes.length}
                  comments={post?.post?.comments.length}
                  createdAt={post?.post?.createdAt}
                />
              </div>

              {/* Main Content */}
              <div
                className='prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-2xl mt-5'
                dangerouslySetInnerHTML={{ __html: postData?.content }}
              />

              {/* Comments Section */}
              <div className='mt-16 border-t border-slate-100 pt-10'>
                <h2 className='text-2xl font-bold text-slate-900 mb-8'>
                  Discussion
                </h2>
                <AddComment postId={postData?._id} />
                <CommentsList postId={postData?._id} />
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
