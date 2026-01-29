import React, { useState } from "react";
import useFetchAPI from "../hooks/useFetchAPI";

function SideBar() {
    const [isGenresOpen, setIsGenresOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Récupération des genres via l'API TMDB
    const { data, loading, error } = useFetchAPI({
        url: "https://api.themoviedb.org/3/genre/movie/list?language=fr-FR"
    });

    const genres = data?.genres || [];

    return (
        <nav className="w-1/5 min-w-[200px] sticky left-0 top-0 h-screen text-white p-6 overflow-y-auto" style={{ backgroundColor: '#282129' }}>
            {/* Films / Series TV */}
            <ul className="mb-6">
                <li className="py-1">
                    <a href="" className="text-white hover:text-gray-300">Films</a>
                </li>
                <li className="py-1">
                    <a href="" className="text-white hover:text-gray-300">Serie TV</a>
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
                                <a 
                                    href={`#genre-${genre.id}`} 
                                    className="text-white hover:text-gray-300 transition-colors"
                                >
                                    {genre.name}
                                </a>
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
                        <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Popularité</a></li>
                        <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Revenue</a></li>
                        <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Vote</a></li>
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default SideBar;