import React, { useState, useEffect } from 'react';

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);

  // Fetch favorite articles from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  return (
    <div>
      <h2>Your Favorite Articles</h2>
      {favorites && favorites.length > 0 ? (
        <div className="cardContainer">
          {favorites.map((article, index) => (
            <div className="card" key={index}>
              <img src={article.urlToImage} alt="news thumbnail" />
              <div className="content">
                <a onClick={() => window.open(article.url)} className="title">
                  {article.title}
                </a>
                <p>{article.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorite articles saved yet.</p>
      )}
    </div>
  );
};

export default Favorite;
