import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useFetchAPI from "../hooks/useFetchAPI";
import "./SideBar.css";

function SideBar({ isOpen, onClose }) {
    const [searchParams] = useSearchParams();
    const [isGenresOpen, setIsGenresOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Lire le type actuel depuis l'URL (movie par défaut)
    const currentType = searchParams.get('type') || 'movie';

    // Récupération des genres via l'API TMDB selon le type
    const genreEndpoint = currentType === 'tv' 
        ? "http://localhost:3500/api/tmdb/genre/tv/list"
        : "http://localhost:3500/api/tmdb/genre/movie/list";

    const { data, loading, error } = useFetchAPI({
        url: genreEndpoint
    });

    const genres = data?.genres || [];

    // Fonction pour construire les URLs avec le type actuel
    const buildUrl = (params = {}) => {
        const urlParams = new URLSearchParams();
        urlParams.set('type', params.type || currentType);
        if (params.genre) urlParams.set('genre', params.genre);
        if (params.sort_by) urlParams.set('sort_by', params.sort_by);
        return `/?${urlParams.toString()}`;
    };

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {/* Overlay sombre (mobile) */}
            <div 
                className={`sidebar-overlay ${!isOpen ? 'hidden' : ''}`}
                onClick={onClose}
            />
            
            {/* Sidebar */}
            <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Bouton fermeture (mobile) */}
                <button 
                    onClick={onClose}
                    className="sidebar-close-btn"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                {/* Films / Series TV */}
                <ul className="mb-6">
                    <li className="py-1">
                        <Link 
                            to="/?type=movie" 
                            className={`hover:text-gray-300 transition-colors ${currentType === 'movie' ? 'text-orange-500 font-bold' : 'text-white'}`}
                            onClick={handleLinkClick}
                        >
                            Films
                        </Link>
                    </li>
                    <li className="py-1">
                        <Link 
                            to="/?type=tv" 
                            className={`hover:text-gray-300 transition-colors ${currentType === 'tv' ? 'text-orange-500 font-bold' : 'text-white'}`}
                            onClick={handleLinkClick}
                        >
                            Séries TV
                        </Link>
                    </li>
                </ul>

                {/* Genres Section avec Dropdown */}
                <div className="mb-6">
                    <button 
                        onClick={() => setIsGenresOpen(!isGenresOpen)}
                        className="w-full flex items-center justify-between mb-2 hover:bg-gray-700 p-2 rounded transition-colors cursor-pointer"
                    >
                        <span className="text-gray-400">Genres</span>
                        <span 
                            className={`text-gray-400 transition-transform duration-300 ${isGenresOpen ? 'rotate-90' : ''}`}
                        >
                            ≫
                        </span>
                    </button>
                    
                    {isGenresOpen && (
                        <ul className="ml-2 border-l border-gray-600 pl-3 animate-fadeIn">
                            {loading && (
                                <li className="py-1 text-gray-500">Chargement...</li>
                            )}
                            {error && (
                                <li className="py-1 text-red-400">Erreur: {error}</li>
                            )}
                            {genres.map((genre) => (
                                <li key={genre.id} className="py-1">
                                    <Link 
                                        to={buildUrl({ genre: genre.id })} 
                                        className="text-white hover:text-gray-300 transition-colors"
                                        onClick={handleLinkClick}
                                    >
                                        {genre.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Filtrer Par Section avec Dropdown */}
                <div>
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full flex items-center justify-between mb-2 hover:bg-gray-700 p-2 rounded transition-colors cursor-pointer"
                    >
                        <span className="text-gray-400">Filtrer Par</span>
                        <span 
                            className={`text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-90' : ''}`}
                        >
                            ≫
                        </span>
                    </button>
                    
                    {isFilterOpen && (
                        <ul className="ml-2 border-l border-gray-600 pl-3 animate-fadeIn">
                            <li className="py-1">
                                <Link to={buildUrl({ sort_by: 'popularity' })} className="text-white hover:text-gray-300" onClick={handleLinkClick}>Popularité</Link>
                            </li>
                            <li className="py-1">
                                <Link to={buildUrl({ sort_by: 'revenue' })} className="text-white hover:text-gray-300" onClick={handleLinkClick}>Revenue</Link>
                            </li>
                            <li className="py-1">
                                <Link to={buildUrl({ sort_by: 'vote_average' })} className="text-white hover:text-gray-300" onClick={handleLinkClick}>Vote</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </>
    );
}

export default SideBar;