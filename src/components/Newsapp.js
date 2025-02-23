import React, { useState, useEffect } from 'react';
import Card from './Card'; 

const Newsapp = () => {
    const [search, setSearch] = useState('world'); // Default search query
    const [newsData, setNewsData] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State for loader
    const [viewMode, setViewMode] = useState('all'); // State for view mode
    const API_KEY = '';

    // Debounce delay for user input
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Fetch data with debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500); // Wait for 500ms before updating the search term

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [search]);

    const getData = async () => {
        setIsLoading(true); // Show loader
        try {
            if (viewMode === 'favorites') {
                const favorites = getFavoritesFromLocalStorage();
                setNewsData(favorites);
            } else {
                const response = await fetch(`https://newsapi.org/v2/everything?q=${debouncedSearch}&apikey=${API_KEY}`);
                const jsonData = await response.json();
                setNewsData(jsonData.articles);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false); // Hide loader
        }
    };

    useEffect(() => {
        getData();
    }, [debouncedSearch, viewMode]);

    const handleInput = (e) => {
        setSearch(e.target.value); // Update search term as user types
    };

    // Helper function to get favorites from localStorage
    const getFavoritesFromLocalStorage = () => {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    };

    return (
        <div>
            <nav>
                <div>
                    <h1>Headliner!</h1>
                </div>
                <div className='SearchBar'>
                    <input
                        type='text'
                        placeholder='Search News'
                        value={search}
                        onChange={handleInput}
                        style={{ marginRight: '8px', borderRadius: '4px' }}
                    />
                    <button onClick={() => setViewMode('all')}>Search</button>
                </div>
            </nav>

            <div>
                <p className='head'>
                    Stay Up To Date with <span style={{ color: '#189ab4' }}>Headliner!</span>
                </p>
            </div>

            <div className='categoryBtn'>
                <button onClick={() => setSearch('sports')} style={{ backgroundColor: '#b99095' }}>Sports</button>
                <button onClick={() => setSearch('politics')} style={{ backgroundColor: '#274472' }}>Politics</button>
                <button onClick={() => setSearch('entertainment')} style={{ backgroundColor: '#fbc740' }}>Entertainment</button>
                <button onClick={() => setSearch('health')} style={{ backgroundColor: '#189ab4' }}>Health</button>
                <button onClick={() => setSearch('fitness')} style={{ backgroundColor: '#ef7c8e' }}>Fitness</button>
                <button onClick={() => setSearch('business')} style={{ backgroundColor: '#81b622' }}>Business</button>
                <button onClick={() => setViewMode('favorites')} style={{ backgroundColor: '#e37120' }}>Favorite</button>
            </div>

            <div>
                {isLoading ? (
                    <div className='spinner'>Loading...</div> // Loading spinner
                ) : (
                    newsData ? <Card data={newsData} /> : <p>No data available</p>
                )}
            </div>
        </div>
    );
};

export default Newsapp;
