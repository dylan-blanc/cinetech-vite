import useFetchAPI from '../hooks/useFetchAPI';
import MediaCard from '../components/MediaCard';

function Home() {

    const { data, loading, error } = useFetchAPI({ url: 
        'https://api.themoviedb.org/3/movie/popular?language=fr-FR' 
    });

    const movies = data?.results || [];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Chargement des films...</p>
                </div>
            </div>
        );
    }

    // Affichage de l'erreur
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
            {/* Titre */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    <span className="text-blue-500">Films</span>{' '}
                    <span className="text-orange-500">Populaires</span>
                </h1>
                <p className="text-slate-400 mt-2">
                    Decouvrez les films les plus populaires du moment
                </p>
            </div>

            {/* Grille de films */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie) => (
                    <MediaCard key={movie.id} media={movie} type="movie" />
                ))}
            </div>
        </div>
    );
}

export default Home;
