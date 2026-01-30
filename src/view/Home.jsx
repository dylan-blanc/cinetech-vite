import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetchAPI from '../hooks/useFetchAPI';
import MediaCard from '../components/MediaCard';
import Pagination from '../components/Pagination';

// Mapping des noms de filtres pour l'affichage
const FILTER_LABELS = {
    popularity: 'Populaires',
    revenue: 'Top Revenue',
    vote_average: 'Mieux Notés'
};

function Home() {
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc');
    const [genreName, setGenreName] = useState('');

    // Lire les query params
    const genre = searchParams.get('genre');
    const sortBy = searchParams.get('sort_by') || 'popularity';
    const contentType = searchParams.get('type') || 'movie'; // movie ou tv

    // Reset page quand les filtres changent
    useEffect(() => {
        setCurrentPage(1);
    }, [genre, sortBy, contentType]);

    // Récupérer le nom du genre selon le type (movie ou tv)
    const genreEndpoint = contentType === 'tv' 
        ? "http://localhost:3500/api/tmdb/genre/tv/list"
        : "http://localhost:3500/api/tmdb/genre/movie/list";

    const { data: genresData } = useFetchAPI({
        url: genreEndpoint
    });

    useEffect(() => {
        if (genre && genresData?.genres) {
            const foundGenre = genresData.genres.find(g => g.id === parseInt(genre));
            setGenreName(foundGenre?.name || '');
        } else {
            setGenreName('');
        }
    }, [genre, genresData]);

    // Construire l'URL API dynamiquement selon le type
    const discoverEndpoint = contentType === 'tv' ? 'discover/tv' : 'discover/movie';
    let apiUrl = `http://localhost:3500/api/tmdb/${discoverEndpoint}?sort_by=${sortBy}&order=${sortOrder}&page=${currentPage}`;
    if (genre) {
        apiUrl += `&with_genres=${genre}`;
    }

    const { data, loading, error } = useFetchAPI({ url: apiUrl });

    const mediaItems = data?.results || [];
    const totalPages = data?.total_pages || 1;

    // Limiter à 500 pages max (limite de TMDB)
    const maxPages = Math.min(totalPages, 500);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Toggle ASC/DESC
    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    // Labels selon le type
    const typeLabel = contentType === 'tv' ? 'Séries TV' : 'Films';
    const typeLabelSingular = contentType === 'tv' ? 'séries' : 'films';

    // Générer le titre dynamique
    const generateTitle = () => {
        const filterLabel = FILTER_LABELS[sortBy] || 'Populaires';
        const orderLabel = sortOrder === 'desc' ? '↓' : '↑';
        
        if (genreName) {
            return (
                <>
                    <span className="text-blue-500">{genreName}</span>{' '}
                    <span className="text-orange-500">- {filterLabel}</span>{' '}
                    <span className="text-gray-400 text-xl">{orderLabel}</span>
                </>
            );
        }
        return (
            <>
                <span className="text-blue-500">{typeLabel}</span>{' '}
                <span className="text-orange-500">{filterLabel}</span>{' '}
                <span className="text-gray-400 text-xl">{orderLabel}</span>
            </>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Chargement des {typeLabelSingular}...</p>
                </div>
            </div>
        );
    }

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
            {/* Titre et bouton ASC/DESC */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        {generateTitle()}
                    </h1>
                    <p className="text-slate-400 mt-2">
                        {genreName 
                            ? `${typeLabel} ${genreName.toLowerCase()} triés par ${FILTER_LABELS[sortBy]?.toLowerCase() || 'popularité'}`
                            : `Découvrez les ${typeLabelSingular} les plus ${FILTER_LABELS[sortBy]?.toLowerCase() || 'populaires'} du moment`
                        }
                    </p>
                </div>
                
                {/* Bouton ASC/DESC */}
                <button
                    onClick={toggleSortOrder}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
                    title={sortOrder === 'desc' ? 'Ordre décroissant' : 'Ordre croissant'}
                >
                    <span className="text-white text-sm font-medium">
                        {sortOrder === 'desc' ? 'DESC' : 'ASC'}
                    </span>
                    <span className="text-orange-500 text-lg">
                        {sortOrder === 'desc' ? '↓' : '↑'}
                    </span>
                </button>
            </div>

            {/* Grille de médias */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-x-[13px] gap-y-[12px]">
                {mediaItems.map((item) => (
                    <MediaCard key={item.id} media={item} type={contentType} />
                ))}
            </div>

            {/* Pagination */}
            <Pagination 
                currentPage={currentPage} 
                totalPages={maxPages} 
                onPageChange={handlePageChange} 
            />
        </div>
    );
}

export default Home;
