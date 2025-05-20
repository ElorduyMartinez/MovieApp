import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IMovieDetail } from '@/types/MovieDetail';
import { isFutureDate } from '@/utils/dateUtils';
import Link from 'next/link';
import Config from '@/config';
import { formatDate } from '@/utils/dateUtils';

export interface UpcomingMoviesSectionProps {
  movies: IMovieDetail[];
}

const UpcomingMoviesSection: React.FC<UpcomingMoviesSectionProps> = ({ movies }) => {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800">Upcoming movies</h2>
        </div>
      </div>
      
      <div className="relative group">
        <button 
          onClick={() => {
            const carousel = document.getElementById('upcoming-carousel');
            if (carousel) carousel.scrollBy({ left: -300, behavior: 'smooth' });
          }} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="text-gray-600" size={20} />
        </button>
        
        <div id="upcoming-carousel" className="overflow-x-auto hide-scrollbar">
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
                      {movie.release_date && 
                        isFutureDate(typeof movie.release_date === 'string' ? 
                          movie.release_date : 
                          movie.release_date.toString()
                        ) && (
                        <span className="ml-1 text-blue-500 font-semibold">(Coming soon)</span>
                      )}
                    </p>
                  </div>
                </Link>
                
                {/* SCORE */}
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
          onClick={() => {
            const carousel = document.getElementById('upcoming-carousel');
            if (carousel) carousel.scrollBy({ left: 300, behavior: 'smooth' });
          }} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="text-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
};

export default UpcomingMoviesSection;