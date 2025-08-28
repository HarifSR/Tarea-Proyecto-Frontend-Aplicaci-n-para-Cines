import React from 'react';

// Recibe como props las funciones para cambiar el estado en App.jsx
function SearchBar({ onTitleChange, onUbicationChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar por título..."
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <input
        type="text"
        placeholder="Buscar por ubicación..."
        onChange={(e) => onUbicationChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;