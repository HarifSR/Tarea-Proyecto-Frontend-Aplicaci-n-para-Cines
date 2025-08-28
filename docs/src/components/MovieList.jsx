import React from 'react';
import MovieCard from './MovieCard/MovieCard';

// Recibe el array de películas como prop
function MovieList({ movies }) {
  // Si no hay películas, muestra un mensaje
  if (!movies || movies.length === 0) {
    return <p className="no-movies">No se encontraron películas con esos criterios.</p>;
  }

  return (
    <div className="movie-list">
      {/* Mapeamos el array y renderizamos un MovieCard por cada película */}
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieList;