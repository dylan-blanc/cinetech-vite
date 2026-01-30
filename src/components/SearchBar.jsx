import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../hooks/useSearch';

function SearchBar() {
    const { query, setQuery, results, loading, search, clearResults } = useSearch();
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Debounce la recherche (attendre 300ms après la dernière frappe)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim().length >= 2) {
                search(query);
                setIsOpen(true);
            } else {
                clearResults();
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, search, clearResults]);

    // Fermer les résultats si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleResultClick = (item) => {
        // Naviguer vers la page de détail selon le type de média
        const type = item.media_type === 'movie' ? 'film' : 'serie';
        navigate(`/${type}/${item.id}`);
        setIsOpen(false);
        clearResults();
    };

    // Naviguer vers la page de résultats de recherche
    const handleSearchSubmit = () => {
        if (query.trim().length >= 2) {
            navigate(`/recherche?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            clearResults();
        }
        // Validation avec la touche Entrée
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSubmit();
        }
    };

    // Obtenir le titre selon le type de média
    const getTitle = (item) => {
        return item.media_type === 'movie' ? item.title : item.name;
    };

    // Obtenir l'année de sortie
    const getYear = (item) => {
        const date = item.media_type === 'movie' ? item.release_date : item.first_air_date;
        return date ? new Date(date).getFullYear() : '';
    };

    return (
        <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <div className="relative flex">
                <input 
                    type="text" 
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    placeholder="Rechercher un film ou une série..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-l-lg px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
                />
                {/* Bouton de recherche à droite */}
                <button
                    onClick={handleSearchSubmit}
                    disabled={query.trim().length < 2}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-2 rounded-r-lg border border-purple-600 disabled:border-gray-600 transition-colors duration-200 flex items-center justify-center"
                    title="Rechercher"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <span className="text-white text-lg">🔍</span>
                    )}
                </button>
            </div>

            {/* Menu déroulant des résultats */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    {results.slice(0, 8).map((item) => (
                        <div
                            key={`${item.media_type}-${item.id}`}
                            onClick={() => handleResultClick(item)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition-colors duration-150 border-b border-gray-800 last:border-b-0"
                        >
                            {/* Poster */}
                            <div className="flex-shrink-0 w-12 h-18">
                                {item.poster_path ? (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                        alt={getTitle(item)}
                                        className="w-12 h-18 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-12 h-18 bg-gray-700 rounded flex items-center justify-center">
                                        <span className="text-gray-500 text-xs">N/A</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Informations */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">
                                    {getTitle(item)}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span className={`px-2 py-0.5 rounded text-xs ${
                                        item.media_type === 'movie' 
                                            ? 'bg-purple-500/20 text-purple-400' 
                                            : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                        {item.media_type === 'movie' ? 'Film' : 'Série'}
                                    </span>
                                    {getYear(item) && <span>{getYear(item)}</span>}
                                    {item.vote_average > 0 && (
                                        <span className="flex items-center gap-1">
                                            ⭐ {item.vote_average.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {results.length > 8 && (
                        <div className="p-3 text-center text-gray-400 text-sm border-t border-gray-800">
                            + {results.length - 8} autres résultats
                        </div>
                    )}
                </div>
            )}

            {/* Message si aucun résultat */}
            {isOpen && query.length >= 2 && results.length === 0 && !loading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 p-4 text-center text-gray-400">
                    Aucun résultat pour "{query}"
                </div>
            )}
        </div>
    );
}

export default SearchBar;
