const MediaStackLogo = ({ className = "", size = "default" }) => {
  const sizes = {
    small: { icon: 28, text: "text-lg" },
    default: { icon: 36, text: "text-xl" },
    large: { icon: 48, text: "text-2xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={icon}
        height={icon}
        viewBox='0 0 48 48'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='flex-shrink-0'
      >
        <circle
          cx='24'
          cy='24'
          r='20'
          stroke='url(#gradient1)'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeDasharray='40 20'
          className='animate-[spin_12s_linear_infinite] origin-center'
          style={{ transformBox: "fill-box" }}
        />

        <path
          d='M14 24C14 18.477 18.477 14 24 14'
          stroke='url(#gradient2)'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M34 24C34 29.523 29.523 34 24 34'
          stroke='url(#gradient2)'
          strokeWidth='3'
          strokeLinecap='round'
        />

        <circle cx='24' cy='24' r='6' fill='url(#gradient3)' />
        <circle cx='24' cy='10' r='2' fill='hsl(195 62% 85%)' />
        <circle cx='38' cy='24' r='2' fill='hsl(230 52% 86%)' />

        <defs>
          <linearGradient id='gradient1' x1='4' y1='24' x2='44' y2='24'>
            <stop stopColor='hsl(195 62% 85%)' />
            <stop offset='1' stopColor='hsl(230 52% 86%)' />
          </linearGradient>
          <linearGradient id='gradient2' x1='14' y1='14' x2='34' y2='34'>
            <stop stopColor='hsl(198 67% 91%)' />
            <stop offset='1' stopColor='hsl(230 52% 92%)' />
          </linearGradient>
          <linearGradient id='gradient3' x1='18' y1='18' x2='30' y2='30'>
            <stop stopColor='hsl(195 62% 85%)' />
            <stop offset='1' stopColor='hsl(230 52% 86%)' />
          </linearGradient>
        </defs>
      </svg>

      <span className={`${text} font-semibold tracking-tight text-slate-900`}>
        media<span className='text-slate-500'>Stack</span>
      </span>
    </div>
  );
};

export default MediaStackLogo;
