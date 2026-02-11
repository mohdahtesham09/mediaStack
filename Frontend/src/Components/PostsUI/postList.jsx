import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchPublicPostsAction } from "../../Redux/slices/posts/postSlice";
import LoadingComponent from "../Alert/LoadingComponent";

import {
  CalendarIcon,
  UserIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const PostList = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { posts, error, loading } = useSelector((state) => state?.posts);

  useEffect(() => {
    dispatch(fetchPublicPostsAction({ page }));
  }, [dispatch, page]);

  // Handle data structure (initial array vs paginated object)
  const postList = Array.isArray(posts) ? posts : posts?.post || [];
  const totalPages = posts?.pages || 1;

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const getAuthorName = (post) => {
    return (
      post?.user?.name ||
      post?.user?.username ||
      post?.author?.name ||
      post?.author?.username ||
      "Author"
    );
  };

  return (
    <div className='bg-slate-50 min-h-screen'>
      {/* Hero Section */}
      <section className='relative h-[600px] flex items-center justify-center overflow-hidden'>
        {/* Background Overlay */}
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000'
            alt='Hero Banner'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-[#667eea]/90 to-[#764ba2]/90 mix-blend-multiply'></div>
        </div>

        {/* Hero Content */}
        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in'>
            <span className='w-2 h-2 rounded-full bg-blue-400'></span>
            Featured Post
          </div>
          <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-slide-up'>
            UI Text Placeholder
          </h1>
          <p className='text-lg md:text-xl text-blue-50/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-slide-up [animation-delay:200ms]'>
            UI Text Placeholder
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:400ms]'>
            {/* {loading} */}

            {/* {error} */}

            {/* {data-placeholder} */}

            <Link
              to='/posts'
              className='px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2'
            >
              Read Article <ArrowRightIcon className='w-4 h-4' />
            </Link>
            <Link
              to='/posts'
              className='px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center'
            >
              Explore Feed
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='flex flex-col md:flex-row justify-between items-end mb-12 gap-6'>
          <div className='max-w-xl'>
            <h2 className='text-3xl font-bold text-slate-900 mb-4'>
              Latest Insights
            </h2>
            <p className='text-slate-500 text-lg'>
              Stay updated with our latest trends and stories.
            </p>
          </div>
        </div>

        {/* Loading State Placeholder */}
        {/* {loading} */}

        {/* Error State Placeholder */}
        {/* {error} */}

        {/* Responsive Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {loading ? (
            <div className='col-span-full flex justify-center'>
              <LoadingComponent />
            </div>
          ) : error ? (
            <h3 className='text-red-500 text-center col-span-full'>
              {error?.message}
            </h3>
          ) : postList?.length <= 0 ? (
            <h3 className='text-center text-slate-500 col-span-full'>
              No posts found
            </h3>
          ) : (
            postList?.map((post) => {
              return (
                <div
                  key={post?._id}
                  className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col h-full transform hover:-translate-y-2'
                >
                  {/* Card Image */}
                  <div className='relative h-56 overflow-hidden'>
                    <img
                      src={
                        post?.image ||
                        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={post?.title}
                      className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    <div className='absolute top-4 left-4'>
                      <span className='bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-widest shadow-sm'>
                        {post?.category?.name || "General"}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className='p-6 flex flex-col flex-1'>
                    <div className='flex items-center gap-2 text-slate-400 text-xs mb-3 font-medium'>
                      <CalendarIcon className='w-4 h-4' />
                      <span>
                        {new Date(post?.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className='text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2'>
                      {post?.title}
                    </h3>

                    {/* Short Description */}
                    <div
                      className='text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed'
                      dangerouslySetInnerHTML={{ __html: post?.content }}
                    />

                    {/* Card Footer */}
                    <div className='mt-auto flex items-center justify-between pt-6 border-t border-slate-50'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                          <UserIcon className='w-4 h-4' />
                        </div>
                        <span className='font-medium text-slate-700 text-xs'>
                          {getAuthorName(post)}
                        </span>
                      </div>
                      <Link
                        to={`/posts/${post?._id}`}
                        className='text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group/link'
                      >
                        Read Post{" "}
                        <ArrowRightIcon className='w-3 h-3 group-hover/link:translate-x-1 transition-transform' />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className='flex justify-center items-center mt-16 gap-4'>
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                page === 1
                  ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md cursor-pointer"
              }`}
            >
              Previous
            </button>

            <span className='text-slate-500 text-sm font-medium'>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                page === totalPages
                  ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State Placeholder */}
        {/* {data-placeholder} */}
      </section>
    </div>
  );
};

export default PostList;
