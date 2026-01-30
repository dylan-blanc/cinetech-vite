import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour la recherche TMDB
 * @returns {object} - { query, setQuery, results, loading, error, search, clearResults }
 */
function useSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = useCallback(async (searchQuery) => {
        if (!searchQuery || searchQuery.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:3500/api/tmdb/search/multi?query=${encodeURIComponent(searchQuery)}`
            );

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            // Filtrer uniquement les films et séries TV
            const filteredResults = data.results?.filter(
                item => item.media_type === 'movie' || item.media_type === 'tv'
            ) || [];
            setResults(filteredResults);
        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        setResults([]);
        setQuery('');
    }, []);

    return { 
        query, 
        setQuery, 
        results, 
        loading, 
        error, 
        search, 
        clearResults 
    };
}

export default useSearch;
