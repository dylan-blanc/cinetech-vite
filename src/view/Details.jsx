import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetchAPI from '../hooks/useFetchAPI';
import './Details.css';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

function Details() {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Fetch media details
    const detailsUrl = `http://localhost:3500/api/tmdb/${type}/${id}`;
    const { data: details, loading: loadingDetails, error: errorDetails } = useFetchAPI({ url: detailsUrl });

    // Fetch images
    const imagesUrl = `http://localhost:3500/api/tmdb/${type}/${id}/images`;
    const { data: imagesData } = useFetchAPI({ url: imagesUrl });

    // Get title based on type
    const title = type === 'movie' ? details?.title : details?.name;
    const releaseDate = type === 'movie' ? details?.release_date : details?.first_air_date;
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';

    // Format runtime (minutes to hours and minutes)
    const formatRuntime = (minutes) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}H${mins.toString().padStart(2, '0')}`;
    };

    // For TV shows, use episode_run_time
    const runtime = type === 'movie' 
        ? details?.runtime 
        : details?.episode_run_time?.[0];

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get random posters for carousel (5 images)
    const posters = imagesData?.posters || [];
    const carouselImages = posters.slice(0, 10); // Get more for navigation
    const visibleImages = carouselImages.slice(carouselIndex, carouselIndex + 5);

    const handlePrevCarousel = () => {
        setCarouselIndex(prev => Math.max(0, prev - 1));
    };

    const handleNextCarousel = () => {
        setCarouselIndex(prev => Math.min(carouselImages.length - 5, prev + 1));
    };

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
    };

    const handleGalleryClick = (tab) => {
        navigate(`/gallerie/${type}/${id}?tab=${tab}`);
    };

    if (loadingDetails) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (errorDetails) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center text-red-500">
                    <p className="text-xl">Erreur</p>
                    <p className="mt-2">{errorDetails}</p>
                </div>
            </div>
        );
    }

    if (!details) return null;

    return (
        <div className="details-container relative">
            {/* Bouton Favoris en haut à droite */}
            <button
                onClick={handleFavoriteClick}
                className="details-favorite-btn transition-transform hover:scale-110"
                title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
                {isFavorite ? '❤️' : '🤍'}
            </button>

            {/* Section principale */}
            <div className="details-main-section flex gap-8 mb-8">
                {/* Poster */}
                <div className="details-poster-container flex-shrink-0">
                    {details.poster_path ? (
                        <img
                            src={`${IMG_BASE_URL}${details.poster_path}`}
                            alt={title}
                            className="details-poster-img rounded-lg shadow-lg"
                        />
                    ) : (
                        <div className="details-poster-placeholder bg-slate-700 rounded-lg flex items-center justify-center">
                            <span className="text-slate-500">Pas d'image</span>
                        </div>
                    )}

                    {/* Note et votes sous le poster */}
                    <div className="details-vote-section">
                        <span className="details-vote-average">
                            {details.vote_average?.toFixed(1)}/10
                        </span>
                        <p className="details-vote-count">
                            {details.vote_count?.toLocaleString()} Votes
                        </p>
                    </div>
                </div>

                {/* Informations */}
                <div className="details-info-container flex-1">
                    {/* Titre et année */}
                    <h1 className="details-title">
                        {title} 
                        <span className="details-title-year">({releaseYear})</span>
                    </h1>

                    {/* Durée et date de sortie */}
                    <div className="details-meta-row">
                        {runtime && (
                            <span className="details-runtime">
                                {formatRuntime(runtime)}
                            </span>
                        )}
                        {releaseDate && (
                            <span className="details-release-date">
                                Date de sortie : {new Date(releaseDate).toLocaleDateString('fr-FR')}
                            </span>
                        )}
                    </div>

                    {/* Genres */}
                    <div className="details-genres-container">
                        {details.genres?.map((genre, index) => (
                            <span 
                                key={genre.id}
                                className="details-genre"
                            >
                                {genre.name}{index < details.genres.length - 1 ? ' ' : ''}
                            </span>
                        ))}
                    </div>

                    {/* Description / Overview */}
                    <div className="details-overview-section">
                        <p className="details-overview-text">
                            "{details.overview || 'Aucune description disponible.'}"
                        </p>
                    </div>

                    {/* Budget et Recette (films uniquement) */}
                    {type === 'movie' && (
                        <div className="details-financial-section">
                            <div className="details-financial-item">
                                <h3>Budget</h3>
                                <p>{formatCurrency(details.budget)}</p>
                            </div>
                            <div className="details-financial-item">
                                <h3>Recette</h3>
                                <p>{formatCurrency(details.revenue)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Section Carousel - Images de tournage/Casting */}
            <div className="details-carousel-section">
                <div className="details-carousel-container">
                    {/* Flèche gauche */}
                    <button
                        onClick={handlePrevCarousel}
                        disabled={carouselIndex === 0}
                        className="details-carousel-btn details-carousel-btn-left"
                    >
                        ◀
                    </button>

                    {/* Images */}
                    <div className="details-carousel-images">
                        {visibleImages.length > 0 ? (
                            visibleImages.map((image, index) => (
                                <div 
                                    key={index}
                                    className="details-carousel-image-item"
                                >
                                    <img
                                        src={`${IMG_BASE_URL}${image.file_path}`}
                                        alt={`Image ${carouselIndex + index + 1}`}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="details-carousel-placeholder">
                                Images de tournage/Casting etc
                            </p>
                        )}
                    </div>

                    {/* Flèche droite */}
                    <button
                        onClick={handleNextCarousel}
                        disabled={carouselIndex >= carouselImages.length - 5}
                        className="details-carousel-btn details-carousel-btn-right"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {/* Section Gallerie */}
            <div className="details-gallery-section">
                <h2 className="details-gallery-title">Gallerie</h2>
                
                <div className="details-gallery-buttons">
                    {/* Bouton Images */}
                    <button
                        onClick={() => handleGalleryClick('poster')}
                        className="details-gallery-btn"
                    >
                        <span>IMAGES</span>
                    </button>

                    {/* Bouton Videos */}
                    <button
                        onClick={() => handleGalleryClick('videos')}
                        className="details-gallery-btn"
                    >
                        <span>VIDEOS</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Details;
