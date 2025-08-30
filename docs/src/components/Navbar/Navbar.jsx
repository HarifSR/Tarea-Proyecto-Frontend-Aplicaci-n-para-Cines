import React from 'react';
import './Navbar.css';

// 1. Añadimos 'onAddMovieClick' a la lista de props que el componente recibe.
const Navbar = ({ onPreventaClick, onAddMovieClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">CineMatrix</a>
        </div>
        <div className="navbar-menu">
          <a href="#cartelera" className="navbar-link">Cartelera</a>
          <a href="#preventas" className="navbar-link" onClick={(e) => {
              e.preventDefault(); // Evita que el link '#' salte la página
              onPreventaClick();
            }}>
            Preventas
          </a>
          <a href="#cines" className="navbar-link">Cines</a>
        </div>
        <div className="navbar-actions">
           {/* 2. Usamos la nueva prop en el evento onClick de este botón. */}
          <button className="add-movie-btn" onClick={onAddMovieClick}>
            <i className="fa-solid fa-plus"></i> Añadir Película
          </button>
          <button className="ver-cartelera-btn">VER CARTELERA</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
