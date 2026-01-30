import { useState, useEffect, useRef } from 'react';

// Cache global pour stocker les réponses API (durée: 5 minutes)
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

function useFetchAPI({ url, enabled = true }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        // Si le fetch n'est pas activé, ne pas charger
        if (!enabled || !url) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            // Vérifier le cache d'abord
            const cached = apiCache.get(url);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                setData(cached.data);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            // Annuler la requête précédente si elle existe
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            try {
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const result = await response.json();
                
                // Stocker dans le cache
                apiCache.set(url, {
                    data: result,
                    timestamp: Date.now()
                });
                
                setData(result);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup: annuler la requête si le composant se démonte
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [url, enabled]);

    return { data, loading, error };
}

export default useFetchAPI;