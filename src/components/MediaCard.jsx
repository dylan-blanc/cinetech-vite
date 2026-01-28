const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MediaCard({ media, type = 'movie' }) {
    const title = type === 'movie' ? media.title : media.name;
    const date = type === 'movie' ? media.release_date : media.first_air_date;
    const year = date ? new Date(date).getFullYear() : 'N/A';

    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all duration-300 hover:scale-105">
            {/* Poster */}
            {media.poster_path ? (
                <img
                    src={`${IMG_BASE_URL}${media.poster_path}`}
                    alt={title}
                    className="w-full h-64 object-cover"
                />
            ) : (
                <div className="w-full h-64 bg-slate-700 flex items-center justify-center">
                    <span className="text-slate-500">Pas d'image</span>
                </div>
            )}

            {/* Infos */}
            <div className="p-4">
                <h3 className="font-semibold text-white truncate" title={title}>
                    {title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-400 text-sm">{year}</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {media.vote_average?.toFixed(1)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MediaCard;
