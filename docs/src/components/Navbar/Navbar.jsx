import React from 'react';
import './Navbar.css';

// 1. Recibimos la nueva prop 'onAddMovieClick'
const Navbar = ({ onPreventaClick, onAddMovieClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">CinePolis</a>
        </div>
        <div className="navbar-menu">
          <a href="#cartelera" className="navbar-link">Cartelera</a>
          <a href="#preventas" className="navbar-link" onClick={(e) => { e.preventDefault(); onPreventaClick(); }}>
            Preventas
          </a>
          <a href="#cines" className="navbar-link">Cines</a>
        </div>
        <div className="navbar-actions">
          {/* 2. Añadimos el nuevo botón y le asignamos el onClick */}
          <button className="add-movie-btn" onClick={onAddMovieClick}>
            <i className="fa-solid fa-plus"></i> Formulario
          </button>
          <button className="ver-cartelera-btn">VER CARTELERA</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;