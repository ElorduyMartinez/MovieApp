import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IMovieDetail } from '@/types/movie';
import { isFutureDate } from '@/utils/dateUtils';
import Link from 'next/link';
import Config from '@/config';
import { formatDate } from '@/utils/dateUtils';

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
  showFutureIndicator = false
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {icon}
          <h2 className="text-2xl font-bold ml-2 text-gray-800">{title}</h2>
        </div>
        
        {filterType === 'trending' && onFilterChange && (
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-1 rounded-full text-sm font-medium ${currentFilter === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => onFilterChange('day')}
            >
              Today
            </button>
            <button 
              className={`px-4 py-1 rounded-full text-sm font-medium ${currentFilter === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => onFilterChange('week')}
            >
              This Week
            </button>
          </div>
        )}
      </div>
      
      <div className="relative group">
        <button 
          onClick={scrollLeft} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="text-gray-600" size={20} />
        </button>
        
        <div className="overflow-x-auto hide-scrollbar" ref={carouselRef}>
          <div className="flex space-x-6 pb-4" style={{ width: `${Math.max(100, movies.length * 15)}%` }}>
            {movies.map(movie => (
              <div key={movie.id} className="w-48 flex-shrink-0">
                <Link href={`/movie/${movie.id}`} className="block">
                  <div className="relative">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white shadow-md">
                      {movie.poster_path ? (
                        <img 
                          src={`${Config.IMAGE_SOURCE}${movie.poster_path}`} 
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 px-1">
                    <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">{movie.title}</h3>
                    <p className="text-gray-500 text-xs">
                      {movie.release_date ? 
                        (typeof movie.release_date === 'string' ?
                          formatDate(movie.release_date) :
                          formatDate(movie.release_date.toString())
                        ) : ""}
                      {showFutureIndicator && 
                        movie.release_date && 
                        isFutureDate(typeof movie.release_date === 'string' ? 
                          movie.release_date : 
                          movie.release_date.toString()
                        ) && (
                        <span className="ml-1 text-blue-500 font-semibold">(Coming soon)</span>
                      )}
                    </p>
                  </div>
                </Link>
                
                {/* Formato SCORE */}
                <div className="mt-1 px-1">
                  <div className="flex items-baseline">
                    <span className="text-yellow-500 font-bold text-sm mr-1">SCORE</span>
                    <span className="text-2xl font-bold text-gray-800">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-yellow-500 ml-1">★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={scrollRight} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="text-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;