import { useState } from 'react';
import useFetchAPI from '../hooks/useFetchAPI';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MediaCard({ media, type = 'movie' }) {
    const [isFavorite, setIsFavorite] = useState(false);
    
    const title = type === 'movie' ? media.title : media.name;
    const date = type === 'movie' ? media.release_date : media.first_air_date;
    const genreIds = media.genre_ids || [];
    
    // Formatage de la date en DD/MM/YYYY
    const formattedDate = date 
        ? new Date(date).toLocaleDateString('fr-FR') 
        : 'N/A';
    
    // Récupération des genres via l'API TMDB
    const genreUrl = type === 'movie' 
        ? 'https://api.themoviedb.org/3/genre/movie/list?language=fr-FR'
        : 'https://api.themoviedb.org/3/genre/tv/list?language=fr-FR';
    
    const { data: genreData } = useFetchAPI({ url: genreUrl });
    const genres = genreData?.genres || [];
    
    // Convertir les genre_ids en noms de genres
    const genreNames = genreIds
        .map(id => genres.find(g => g.id === id)?.name)
        .filter(Boolean);

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    return (
        <div 
            className="relative rounded-lg overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all duration-300 hover:scale-105 group cursor-pointer"
            style={{ width: '150px', height: '275px' }}
        >
            {/* Poster */}
            {media.poster_path ? (
                <img
                    src={`${IMG_BASE_URL}${media.poster_path}`}
                    alt={title}
                    className="object-cover"
                    style={{ width: '137px', height: '261px' }}
                />
            ) : (
                <div 
                    className="bg-slate-700 flex items-center justify-center"
                    style={{ width: '137px', height: '261px' }}
                >
                    <span className="text-slate-500 text-xs text-center">Pas d'image</span>
                </div>
            )}

            {/* Overlay des infos au hover */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
                {/* Top: Genres + Favoris */}
                <div className="flex justify-between items-start">
                    {/* Genres */}
                    <div className="flex flex-col gap-0.5">
                        {genreNames.slice(0, 3).map((name, index) => (
                            <span 
                                key={index} 
                                className="text-yellow-400 text-xs font-medium"
                            >
                                {name}{index < Math.min(genreNames.length, 3) - 1 ? ',' : ''}
                            </span>
                        ))}
                    </div>
                    
                    {/* Bouton Favoris */}
                    <button 
                        onClick={handleFavoriteClick}
                        className="text-2xl transition-transform hover:scale-110"
                        title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>

                {/* Bottom: Date + Note */}
                <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-medium">
                        {formattedDate}
                    </span>
                    <span className="text-orange-400 text-xs font-bold">
                        {media.vote_average?.toFixed(1)}/10
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MediaCard;
