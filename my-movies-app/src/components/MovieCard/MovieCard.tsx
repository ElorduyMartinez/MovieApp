import Config from "@/config";
import Image from "next/image";

export interface MovieCardProps {
  title: string;
  voteAverage: number;
  posterPath: string;
  releaseYear: number;
  description: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  voteAverage,
  posterPath,
  releaseYear,
  description,
}) => {
  const posterUrl = `${Config.IMAGE_SOURCE}${posterPath}`;

  return (
    <article className="relative group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105 transform-gpu">
      {/* Poster with overlay */}
      <div className="relative h-0 pb-[150%] overflow-hidden">
        <Image
          src={posterUrl}
          alt={`Poster of ${title}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 320px"
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300" />
        {/* Release year badge */}
        <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md">
          {releaseYear}
        </span>
        {/* Score badge */}
        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <span>{voteAverage.toFixed(1)}</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.049 2.927z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-44 justify-between bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-800 truncate" title={title}>
            {title}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2 mt-1">
            {description}
          </p>
        </div>
        <button className="mt-3 self-start bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded-full transition-colors duration-200">
          View Details
        </button>
      </div>
    </article>
  );
};

export default MovieCard;
