import React, { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IMovieDetail } from '@/types/movie';
import { isFutureDate, formatDate } from '@/utils/dateUtils';
import Link from 'next/link';
import Config from '@/config';

export interface MovieCarouselProps {
  title: string;
  movies: IMovieDetail[];
  icon: React.ReactNode;
  filterType?: string;
  onFilterChange?: (filter: string) => void;
  currentFilter?: string;
  showFutureIndicator?: boolean;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  icon,
  filterType,
  onFilterChange,
  currentFilter,
  showFutureIndicator = false,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const offset = dir === 'left' ? -400 : 400;
    carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl text-indigo-600">{icon}</span>
          <h2 className="text-3xl font-extrabold text-gray-900 border-b-4 border-indigo-600 pb-1">
            {title}
          </h2>
        </div>

        {/* Trending filters */}
        {filterType === 'trending' && onFilterChange && (
          <div className="flex space-x-3">
            {['day', 'week'].map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`px-5 py-1 rounded-full font-medium transition-colors duration-200 ${
                  currentFilter === f
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f === 'day' ? 'Today' : 'This Week'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative group overflow-visible">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20"
          aria-label="Scroll left"
        >
          <ChevronLeft size={28} className="text-gray-700" />
        </button>

        {/* Items */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scroll-smooth hide-scrollbar space-x-8 py-4 px-4"
        >
          {movies.map((m, idx) => (
            <div key={m.id} className="relative flex-shrink-0 w-52 group">
              <Link
                href={`/movie/${m.id}`}
                className="block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition duration-300 group-hover:scale-105"
              >
                <div className="aspect-[2/3] bg-gray-200 relative">
                  {m.poster_path ? (
                    <Image
                      src={`${Config.IMAGE_SOURCE}${m.poster_path}`}
                      alt={m.title}
                      fill
                      className="object-cover"
                      unoptimized
                      priority={idx === 0}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Image
                    </div>
                  )}
                  {showFutureIndicator &&
                    m.release_date &&
                    isFutureDate(
                      typeof m.release_date === 'string'
                        ? m.release_date
                        : m.release_date.toString()
                    ) && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        Coming Soon
                      </span>
                    )}
                </div>
                <div className="p-4 bg-white">
                  <h3
                    className="text-sm font-bold text-gray-900 truncate"
                    title={m.title}
                  >
                    {m.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {m.release_date &&
                      formatDate(
                        typeof m.release_date === 'string'
                          ? m.release_date
                          : m.release_date.toString()
                      )}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-yellow-400 font-semibold text-sm mr-1">
                      ★
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {m.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Overlay eliminado */}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20"
          aria-label="Scroll right"
        >
          <ChevronRight size={28} className="text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default MovieCarousel;
