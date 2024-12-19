import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareAlt } from '@fortawesome/free-solid-svg-icons';

// Helper function to truncate text
const truncateText = (text, wordLimit) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

// Helper function to get favorites from localStorage
const getFavoritesFromLocalStorage = () => {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
};

// Helper function to save favorites to localStorage
const saveFavoritesToLocalStorage = (favorites) => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

const Card = ({ data }) => {
  const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage());

  // Add or remove an article from favorites
  const toggleFavorite = (article) => {
    const isFavorited = favorites.some(fav => fav.url === article.url);
    const updatedFavorites = isFavorited 
      ? favorites.filter(fav => fav.url !== article.url) // Remove if already favorited
      : [...favorites, article]; // Add if not favorited

    setFavorites(updatedFavorites);
    saveFavoritesToLocalStorage(updatedFavorites);
  };

  // Check if an article is a favorite
  const isFavorited = (article) => {
    return favorites.some(fav => fav.url === article.url);
  };

  // Share function
  const shareArticle = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      })
      .then(() => console.log('Article shared successfully'))
      .catch((error) => console.error('Error sharing article:', error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      alert('Web Share API is not supported in your browser.');
    }
  };

  return (
    <div className="cardContainer">
      {data && data.length > 0 ? (
        data.map((currentItem, index) => {
          if (!currentItem.urlToImage) {
            return null;
          }

          const truncatedTitle = truncateText(currentItem.title, 10);
          const truncatedDescription = truncateText(currentItem.description, 20);

          return (
            <div className="card" key={index}>
              <img src={currentItem.urlToImage} alt="news thumbnail" />
              <div className="content">
                <a onClick={() => window.open(currentItem.url)} className="title">
                  {truncatedTitle}
                </a>
                <p>{truncatedDescription}</p>
                <div className="card-footer">
                  <button onClick={() => window.open(currentItem.url)}>Read More</button>
                  <div className="social-icons">
                    <FontAwesomeIcon 
                      icon={faShareAlt} 
                      onClick={() => shareArticle(currentItem)} 
                      style={{ cursor: 'pointer' }} 
                    />
                    <FontAwesomeIcon 
                      icon={faHeart} 
                      onClick={() => toggleFavorite(currentItem)} 
                      style={{ color: isFavorited(currentItem) ? 'red' : '#189ab4', cursor: 'pointer' }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Card;
