import React from 'react';
import './MovieCard.css';

// 1. Recibimos la nueva prop 'onClick'
const MovieCard = ({ movie, onClick }) => {
  const posterSrc = movie.Poster.includes("googleusercontent.com") || movie.Poster === "" 
    ? "https://via.placeholder.com/400x600.png?text=No+Image" 
    : movie.Poster;
  
  const currentYear = new Date().getFullYear();
  const isPreventa = parseInt(movie.Year) > currentYear;

  return (
    // 2. Añadimos el evento onClick al div principal
    <div className="movie-card" onClick={onClick}>
      {isPreventa && <div className="card-tag">PREVENTA</div>}
      
      <div className="card-image-container">
        <img src={posterSrc} alt={`Póster de ${movie.Title}`} onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x600.png?text=No+Image" }}/>
        <div className="card-overlay">
          <p className="overlay-desc">{movie.description}</p>
        </div>
      </div>
      <div className="movie-info">
        <p className="movie-meta">{movie.Year} - {movie.Type}</p>
        <h3>{movie.Title}</h3>
        <span className="movie-ubication"><i className="fa-solid fa-location-dot"></i> {movie.Ubication}</span>
      </div>
    </div>
  );
};

export default MovieCard;