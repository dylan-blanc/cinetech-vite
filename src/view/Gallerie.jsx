import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import useFetchAPI from '../hooks/useFetchAPI';
import Pagination from '../components/Pagination';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const YOUTUBE_THUMB_URL = 'https://img.youtube.com/vi';

// Définition des onglets
const TABS = [
    { id: 'poster', label: 'Poster', dataKey: 'posters' },
    { id: 'logos', label: 'Logos', dataKey: 'logos' },
    { id: 'backdrop', label: "Fond d'ecran", dataKey: 'backdrops' },
    { id: 'videos', label: 'Videos', dataKey: 'videos' }
];

const ITEMS_PER_PAGE = 40;

function Gallerie() {
    const { type, id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);

    // Get active tab from URL or default to 'poster'
    const activeTab = searchParams.get('tab') || 'poster';

    // Déterminer si on a besoin des images ou des vidéos
    const needsImages = activeTab !== 'videos';
    const needsVideos = activeTab === 'videos';

    // Fetch images - Seulement si onglet images actif
    const imagesUrl = `http://localhost:3500/api/tmdb/${type}/${id}/images`;
    const { data: imagesData, loading: loadingImages } = useFetchAPI({ 
        url: imagesUrl, 
        enabled: needsImages 
    });

    // Fetch videos - Seulement si onglet vidéos actif
    const videosUrl = `http://localhost:3500/api/tmdb/${type}/${id}/videos`;
    const { data: videosData, loading: loadingVideos } = useFetchAPI({ 
        url: videosUrl, 
        enabled: needsVideos 
    });

    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get current data based on active tab
    const getCurrentData = () => {
        if (activeTab === 'videos') {
            return videosData?.results || [];
        }
        const tabConfig = TABS.find(t => t.id === activeTab);
        return imagesData?.[tabConfig?.dataKey] || [];
    };

    const allItems = getCurrentData();
    const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
    const paginatedItems = allItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const isLoading = activeTab === 'videos' ? loadingVideos : loadingImages;

    // Render video item
    const renderVideoItem = (video) => {
        const thumbnailUrl = video.site === 'YouTube' 
            ? `${YOUTUBE_THUMB_URL}/${video.key}/mqdefault.jpg`
            : null;

        return (
            <a
                key={video.id}
                href={video.site === 'YouTube' 
                    ? `https://www.youtube.com/watch?v=${video.key}` 
                    : `https://vimeo.com/${video.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group rounded-lg overflow-hidden bg-slate-800 hover:ring-2 hover:ring-purple-500 transition-all"
            >
                <div className="relative aspect-video">
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt={video.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                            <span className="text-slate-500">🎬</span>
                        </div>
                    )}
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl ml-1">▶</span>
                        </div>
                    </div>
                </div>
                <div className="p-2">
                    <p className="text-white text-sm truncate">{video.name}</p>
                    <p className="text-slate-400 text-xs">{video.type}</p>
                </div>
            </a>
        );
    };

    // Render image item
    const renderImageItem = (image, index) => {
        return (
            <div
                key={`${image.file_path}-${index}`}
                className="rounded-lg overflow-hidden bg-slate-800 hover:ring-2 hover:ring-purple-500 transition-all"
            >
                <img
                    src={`${IMG_BASE_URL}${image.file_path}`}
                    alt={`${activeTab} ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ 
                        aspectRatio: activeTab === 'backdrop' ? '16/9' : activeTab === 'logos' ? '2/1' : '2/3'
                    }}
                />
            </div>
        );
    };

    return (
        <div>
            {/* Onglets Radio */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-slate-800 rounded-lg p-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-[#282129] text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="flex justify-center items-center min-h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="mt-4 text-slate-400">Chargement...</p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && paginatedItems.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-64">
                    <span className="text-5xl mb-4">😕</span>
                    <h2 className="text-xl font-bold text-white mb-2">Aucun contenu</h2>
                    <p className="text-slate-400 text-center">
                        Aucun {activeTab === 'videos' ? 'vidéo' : activeTab} disponible pour ce média
                    </p>
                </div>
            )}

            {/* Grid */}
            {!isLoading && paginatedItems.length > 0 && (
                <>
                    <div className={`grid gap-4 ${
                        activeTab === 'videos' 
                            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                            : activeTab === 'backdrop'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : activeTab === 'logos'
                            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                            : 'grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9'
                    }`}>
                        {paginatedItems.map((item, index) => 
                            activeTab === 'videos' 
                                ? renderVideoItem(item) 
                                : renderImageItem(item, index)
                        )}
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

export default Gallerie;
