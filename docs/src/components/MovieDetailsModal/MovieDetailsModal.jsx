import React from 'react';
import './MovieDetailsModal.css';

// 1. Recibimos las nuevas props: onEdit y onDelete
const MovieDetailsModal = ({ movie, onClose, onEdit, onDelete }) => {
  // Si no hay película, no renderizamos nada.
  if (!movie) {
    return null;
  }
  
  const posterSrc = movie.Poster && movie.Poster.startsWith('http') 
    ? movie.Poster 
    : "https://via.placeholder.com/400x600.png?text=No+Image";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content details-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{movie.Title}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="details-body">
          <div className="details-poster">
            <img src={posterSrc} alt={`Póster de ${movie.Title}`} />
          </div>
          <div className="details-info">
            <p><strong>Año:</strong> {movie.Year}</p>
            <p><strong>Género:</strong> {movie.Type}</p>
            <p><strong>Ubicación:</strong> {movie.Ubication}</p>
            <h3>Sinopsis</h3>
            <p>{movie.description}</p>
            
            {/* 2. Añadimos el contenedor para los nuevos botones */}
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
      </div>
    </div>
  );
};

export default MovieDetailsModal;
