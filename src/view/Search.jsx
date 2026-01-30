import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import Pagination from '../components/Pagination';

function Search() {
    const [searchParams] = useSearchParams();
    const [mediaType, setMediaType] = useState('movie'); // 'movie' ou 'tv'
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMovies, setTotalMovies] = useState(0);
    const [totalTvShows, setTotalTvShows] = useState(0);

    // Récupérer la query depuis l'URL
    const query = searchParams.get('q') || '';

    // Reset page quand la recherche ou le type change
    useEffect(() => {
        setCurrentPage(1);
    }, [query, mediaType]);

    // Récupérer le total de films et séries au chargement
    useEffect(() => {
        const fetchTotals = async () => {
            if (!query || query.trim().length < 2) {
                setTotalMovies(0);
                setTotalTvShows(0);
                return;
            }

            try {
                const [movieRes, tvRes] = await Promise.all([
                    fetch(`http://localhost:3500/api/tmdb/search/movie?query=${encodeURIComponent(query)}&page=1`),
                    fetch(`http://localhost:3500/api/tmdb/search/tv?query=${encodeURIComponent(query)}&page=1`)
                ]);

                const movieData = await movieRes.json();
                const tvData = await tvRes.json();

                setTotalMovies(movieData.total_results || 0);
                setTotalTvShows(tvData.total_results || 0);
            } catch (err) {
                console.error('Erreur récupération totaux:', err);
            }
        };

        fetchTotals();
    }, [query]);

    // Effectuer la recherche selon le type sélectionné
    useEffect(() => {
        const fetchResults = async () => {
            if (!query || query.trim().length < 2) {
                setResults([]);
                setTotalPages(1);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const endpoint = mediaType === 'movie' ? 'search/movie' : 'search/tv';
                const response = await fetch(
                    `http://localhost:3500/api/tmdb/${endpoint}?query=${encodeURIComponent(query)}&page=${currentPage}`
                );

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                setResults(data.results || []);
                setTotalPages(Math.min(data.total_pages || 1, 500)); // Limite TMDB
            } catch (err) {
                setError(err.message);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, currentPage, mediaType]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // État sans recherche
    if (!query || query.trim().length < 2) {
        return (
            <div className="flex flex-col items-center justify-center min-h-96">
                <span className="text-6xl mb-4">🔍</span>
                <h2 className="text-2xl font-bold text-white mb-2">Rechercher</h2>
                <p className="text-slate-400 text-center">
                    Entrez au moins 2 caractères pour rechercher des films ou séries
                </p>
            </div>
        );
    }

    // État de chargement
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Recherche en cours pour "{query}"...</p>
                </div>
            </div>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center text-red-500">
                    <p className="text-xl">Erreur</p>
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            {/* Titre et résumé */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    <span className="text-white">Résultats pour </span>
                    <span className="text-purple-500">"{query}"</span>
                </h1>
                <p className="text-slate-400 mt-2">
                    {totalMovies + totalTvShows} résultat{totalMovies + totalTvShows > 1 ? 's' : ''} trouvé{totalMovies + totalTvShows > 1 ? 's' : ''} au total
                </p>
            </div>

            {/* Boutons Radio Films / Séries */}
            <div className="flex items-center mb-6" style={{ gap: '5px' }}>
                <button
                    onClick={() => setMediaType('movie')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        mediaType === 'movie'
                            ? 'bg-[#282129] text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    <span>🎬</span>
                    <span>Films</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        mediaType === 'movie' ? 'bg-gray-700' : 'bg-[#282129]'
                    }`}>
                        {totalMovies}
                    </span>
                </button>

                <button
                    onClick={() => setMediaType('tv')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        mediaType === 'tv'
                            ? 'bg-[#282129] text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    <span>📺</span>
                    <span>Séries</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        mediaType === 'tv' ? 'bg-gray-700' : 'bg-[#282129]'
                    }`}>
                        {totalTvShows}
                    </span>
                </button>
            </div>

            {/* Aucun résultat pour ce type */}
            {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-64">
                    <span className="text-5xl mb-4">😕</span>
                    <h2 className="text-xl font-bold text-white mb-2">Aucun résultat</h2>
                    <p className="text-slate-400 text-center">
                        Aucun{mediaType === 'movie' ? ' film' : 'e série'} trouvé{mediaType === 'tv' ? 'e' : ''} pour "<span className="text-purple-400">{query}</span>"
                    </p>
                </div>
            ) : (
                <>
                    {/* Grille de médias */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-x-[13px] gap-y-[12px]">
                        {results.map((item) => (
                            <MediaCard key={`${mediaType}-${item.id}`} media={item} type={mediaType} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={handlePageChange} 
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default Search;
