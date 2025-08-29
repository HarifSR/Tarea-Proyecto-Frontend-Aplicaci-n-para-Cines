    import React from 'react';
    import './MovieDetailsModal.css';

    // El componente recibe la película seleccionada y una función para cerrarlo
    const MovieDetailsModal = ({ movie, onClose }) => {
      // Si no hay película, no renderiza nada
      if (!movie) {
        return null;
      }

      return (
        // El fondo oscuro semi-transparente
        <div className="modal-backdrop" onClick={onClose}>
          {/* El contenedor del modal (evita que el clic se propague al fondo) */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="modal-body">
              <div className="modal-poster">
                <img src={movie.Poster} alt={`Póster de ${movie.Title}`} />
              </div>
              <div className="modal-info">
                <h1>{movie.Title}</h1>
                <div className="info-meta">
                  <span><strong>Año:</strong> {movie.Year}</span>
                  <span><strong>Género:</strong> {movie.Type}</span>
                  <span><strong>Cine:</strong> {movie.Ubication}</span>
                </div>
                <p className="info-description">{movie.description}</p>
                <div className="info-status">
                  {movie.Estado ? 'Disponible' : 'No Disponible'}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default MovieDetailsModal;