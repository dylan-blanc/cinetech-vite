import { useState, useEffect } from 'react';

const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;


 function useFetchAPI({url}){
     const [data, setData] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
    
     useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                setError(null);
    
                try {
                    const response = await fetch(url, {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`);
                    }
    
                    const data = await response.json();
                    setData(data.results);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchData();
        }, []);

        return { data, loading, error };
}

export default useFetchAPI;