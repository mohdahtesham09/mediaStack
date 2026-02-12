import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const heroImages = [
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
];

const PostHomeHero = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className='px-4 sm:px-6 lg:px-8 my-8 md:my-12'>
      <div className='relative max-w-7xl mx-auto rounded-3xl p-10 overflow-hidden shadow-xl'>
        <div className='absolute inset-0'>
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === activeImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>

        <div className='absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-black/65' />

        <div className='relative z-10 h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center text-center'>
          <div className='max-w-3xl text-white'>
            <span className='inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] backdrop-blur-sm'>
              Featured Post
            </span>

            <h1 className='mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
              Stories, ideas, and practical lessons for modern builders
            </h1>

            <p className='mt-4 text-sm sm:text-base md:text-lg text-slate-100/90 leading-relaxed'>
              Explore thoughtful articles on productivity, design, engineering,
              and the craft of shipping meaningful work.
            </p>

            <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4'>
              <Link
                to='/posts'
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm sm:text-base font-semibold text-slate-900 transition hover:bg-slate-100'
              >
                Read Article
                <ArrowRightIcon className='h-4 w-4' />
              </Link>

              <Link
                to='/posts'
                className='inline-flex items-center justify-center rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20'
              >
                Explore Feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostHomeHero;
