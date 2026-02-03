import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MediaCard({ media, type = 'movie', genres = [] }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    
    const title = type === 'movie' ? media.title : media.name;
    const date = type === 'movie' ? media.release_date : media.first_air_date;
    const genreIds = media.genre_ids || [];
    
    // Formatage de la date en DD/MM/YYYY
    const formattedDate = date 
        ? new Date(date).toLocaleDateString('fr-FR') 
        : 'N/A';
    
    // Les genres sont maintenant passés en props, plus besoin d'appel API !
    
    // Convertir les genre_ids en noms de genres
    const genreNames = genreIds
        .map(id => genres.find(g => g.id === id)?.name)
        .filter(Boolean);

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    const handleCardClick = () => {
        navigate(`/details/${type}/${media.id}`);
    };

    return (
        <div 
            onClick={handleCardClick}
            className="media-card relative rounded-lg overflow-hidden hover:
             group cursor-pointer"
            style={{ width: '137px', height: '261px' }}
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
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
                {/* Top: Genres + Favoris */}
                <div className="flex justify-between items-start">
                    {/* Genres */}
                    <div className="flex flex-col gap-0.5">
                        {genreNames.slice(0, 3).map((name, index) => (
                            <span 
                                key={index} 
                                className="text-white text-xs font-medium"
                            >
                                {name}{index < Math.min(genreNames.length, 3) - 1 ? ',' : ''}
                            </span>
                        ))}
                    </div>
                    
                    {/* Bouton Favoris - qui ne sert a rien, juste pour faire jolie pour l'instant */}
                    <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                        <button 
                            onClick={handleFavoriteClick}
                            className="text-sm transition-transform hover:scale-110"
                            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                            {isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>

                {/* Bottom: Titre + Date + Note */}
                <div className="flex flex-col gap-1">
                    {/* Titre du média */}
                    <span className="text-white text-sm font-semibold line-clamp-2">
                        {title}
                    </span>
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
        </div>
    );
}

export default MediaCard;

