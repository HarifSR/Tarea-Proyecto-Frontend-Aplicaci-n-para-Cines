    import React from 'react';
    import './MegaMenu.css';

    // Este componente recibe la lista de películas en preventa y una función para cerrarlo
    const MegaMenu = ({ preventaMovies, onClose }) => {
      
      const handleCardClick = (e) => {
        // Por ahora, solo evitamos que se cierre el menú al hacer clic en una tarjeta
        e.stopPropagation();
      };

      return (
        <div className="megamenu-backdrop" onClick={onClose}>
          <div className="megamenu-content" onClick={(e) => e.stopPropagation()}>
            <div className="megamenu-header">
              <span className="menu-title">Preventas</span>
              <button className="megamenu-close-btn" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i> Cerrar
              </button>
            </div>
            
            <div className="megamenu-grid">
              {preventaMovies.map(movie => (
                <div key={movie.imdbID} className="megamenu-card" onClick={handleCardClick}>
                  <img src={movie.Poster} alt={movie.Title} />
                  <h4>{movie.Title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    export default MegaMenu;
    