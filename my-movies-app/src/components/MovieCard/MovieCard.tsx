import Config from "@/config";
import Image from "next/image";

interface IMovieCard {
    title: string;
    voteAverage: number;
    posterPath: string;
    releaseYear: number;
    description: string;
}

const MovieCard: React.FC<IMovieCard> = ({
    title,
    voteAverage,
    posterPath,
    releaseYear,
    description,
}) => {
    const poster = Config.IMAGE_SOURCE + posterPath;
    
    return (
        <div className="h-full">
            {/* Restauramos el fondo blanco con bordes redondeados y sombra */}
            <div className="h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg">
                {/* Imagen del póster */}
                <img
                    src={poster}
                    alt={title}
                    className="w-full h-auto object-cover"
                />
                
                {/* Contenido con padding */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Título */}
                    <h2 className="text-lg font-bold mb-1">{title}</h2>
                    
                    {/* Año */}
                    <p className="text-gray-600 mb-2">
                        {releaseYear}
                    </p>
                    
                    {/* Descripción */}
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {description}
                    </p>
                    
                    {/* Score */}
                    <div className="mt-auto">
                        <div className="flex items-center">
                            <span className="font-bold text-yellow-500 mr-2">SCORE</span>
                            <span className="text-2xl font-bold">
                                {voteAverage.toFixed(1)}
                            </span>
                            <span className="text-yellow-500 ml-1">★</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;