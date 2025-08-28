import React from 'react';
import './Navbar.css';
// 1. Eliminamos la línea que importa el logo.

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          {/* 2. Reemplazamos la etiqueta <img> por un enlace de texto. */}
          <a href="/">CinePolis</a>
        </div>
        <div className="navbar-menu">
          <a href="#cartelera" className="navbar-link">Cartelera</a>
          <a href="#preventas" className="navbar-link">Preventas</a>
          <a href="#cines" className="navbar-link">Cines</a>
        </div>
        <div className="navbar-actions">
          <button className="ver-cartelera-btn">VER CARTELERA</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;