npm import React, { useEffect, useState } from "react";
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

const PostHome = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { posts, error, loading } = useSelector((state) => state?.posts);
  const [activeHeroImageIndex, setActiveHeroImageIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
  ];

  useEffect(() => {
    dispatch(fetchPublicPostsAction({ page }));
  }, [dispatch, page]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveHeroImageIndex(
        (prevIndex) => (prevIndex + 1) % heroImages.length
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [heroImages.length]);

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
      <section className='px-4 sm:px-6 lg:px-8 my-10'>
        <div className='relative max-w-7xl mx-auto p-10 rounded-3xl shadow-lg overflow-hidden'>
          <div className='absolute inset-0'>
            {heroImages.map((image, index) => (
              <div
                key={image}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                  index === activeHeroImageIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>

          <div className='absolute inset-0 bg-gradient-to-br from-black/75 via-black/55 to-black/70' />

          <div className='relative z-10 h-[40vh] md:h-[70vh] flex items-center justify-center text-center'>
            <div className='max-w-3xl text-white'>
              <span className='inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] backdrop-blur-sm'>
                Featured Blog
              </span>

              <h1 className='mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
                Insightful writing for builders, creators, and curious minds
              </h1>

              <p className='mt-4 text-sm sm:text-base md:text-lg text-slate-100/90 leading-relaxed'>
                Discover thoughtful stories about design, engineering, and the
                craft of building products that matter.
              </p>

              <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4'>
                <Link
                  to='/posts'
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm sm:text-base font-semibold text-slate-900 transition hover:bg-slate-100'
                >
                  Read Blog
                  <ArrowRightIcon className='h-4 w-4' />
                </Link>

                <Link
                  to='/posts'
                  className='inline-flex items-center justify-center rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20'
                >
                  Explore
                </Link>
              </div>
            </div>
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
            <h3 className='text-red-500 text-center col-span-full'>{error?.message}</h3>
          ) : postList?.length <= 0 ? (
            <h3 className='text-center text-slate-500 col-span-full'>No posts found</h3>
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
                      <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
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
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group/link"
                      >
                        Read Post <ArrowRightIcon className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
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
          <div className="flex justify-center items-center mt-16 gap-4">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all border ${page === 1
                  ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md cursor-pointer"
                }`}
            >
              Previous
            </button>

            <span className="text-slate-500 text-sm font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all border ${page === totalPages
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

export default PostHome;
