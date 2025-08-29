import React from 'react';
import './MovieDetailsModal.css';

const MovieDetailsModal = ({ movie, onClose, onEdit, onDelete }) => {
  if (!movie) return null;

  const posterSrc = movie.Poster && !movie.Poster.includes("googleusercontent.com") && movie.Poster !== "" 
    ? movie.Poster 
    : "https://via.placeholder.com/400x600.png?text=No+Image";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{movie.Title}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="modal-body">
          <div className="modal-poster">
            <img src={posterSrc} alt={`Póster de ${movie.Title}`} onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x600.png?text=No+Image" }}/>
          </div>
          <div className="modal-info">
            <p><strong>Año:</strong> {movie.Year}</p>
            <p><strong>Género:</strong> {movie.Type}</p>
            <p><strong>Cine:</strong> {movie.Ubication}</p>
            <p className="description">{movie.description}</p>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-edit" onClick={() => onEdit(movie)}>
            <i className="fa-solid fa-pencil"></i> Editar
          </button>
          <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
            <i className="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
