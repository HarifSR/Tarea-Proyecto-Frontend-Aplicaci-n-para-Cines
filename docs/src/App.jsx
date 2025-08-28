// src/App.jsx
import { useState, useEffect, useMemo } from 'react';
import './App.css';
import MovieCard from './components/MovieCard';

const API_URL = 'https://movie.azurewebsites.net/api/cartelera?title=&ubication=';

function App() {
  // --- ESTADOS ---
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para los controles
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' significa sin filtro
  const [filterUbication, setFilterUbication] = useState('all');

  // --- EFECTO PARA OBTENER DATOS ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL);
        let data = await response.json();
        // Limpieza de datos: algunas ubicaciones vienen en mayúsculas
        data = data.map(movie => ({
            ...movie,
            Ubication: movie.Ubication.charAt(0).toUpperCase() + movie.Ubication.slice(1).toLowerCase()
        }));
        setMovies(data);
      } catch (error) {
        console.error("Error al obtener las películas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // --- GENERACIÓN DINÁMICA DE OPCIONES PARA FILTROS ---
  // useMemo evita que estas listas se recalculen en cada render, solo si 'movies' cambia.
  const movieTypes = useMemo(() => {
    const types = new Set(movies.map(movie => movie.Type));
    return ['all', ...Array.from(types)];
  }, [movies]);

  const movieUbications = useMemo(() => {
    const ubications = new Set(movies.map(movie => movie.Ubication));
    return ['all', ...Array.from(ubications)];
  }, [movies]);

  // --- LÓGICA COMBINADA DE FILTRADO Y BÚSQUEDA ---
  const filteredMovies = movies.filter(movie => {
    // Condición 1: Búsqueda por título
    const matchesSearchTerm = movie.Title.toLowerCase().includes(searchTerm.toLowerCase());

    // Condición 2: Filtro por tipo/género
    const matchesType = filterType === 'all' || movie.Type === filterType;

    // Condición 3: Filtro por ubicación
    const matchesUbication = filterUbication === 'all' || movie.Ubication === filterUbication;

    return matchesSearchTerm && matchesType && matchesUbication;
  });

  // --- RENDERIZADO ---
  return (
    <div className="app-container">
      <header>
        <h1>CineMatrix</h1> {/* Un nombre más atractivo ;) */}
      </header>

      <div className="controls-container">
        {/* --- Barra de Búsqueda con Icono --- */}
        <div className="search-bar">
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Busca por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* --- Filtro por Género --- */}
        <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          {movieTypes.map(type => (
            <option key={type} value={type}>{type === 'all' ? 'Todos los géneros' : type}</option>
          ))}
        </select>

        {/* --- Filtro por Ubicación --- */}
        <select className="filter-select" value={filterUbication} onChange={(e) => setFilterUbication(e.target.value)}>
          {movieUbications.map(ubication => (
            <option key={ubication} value={ubication}>{ubication === 'all' ? 'Todas las ubicaciones' : ubication}</option>
          ))}
        </select>
      </div>

      <main>
        {isLoading ? (
          <p className="loading-message">Cargando cartelera...</p>
        ) : (
          <div className="movies-grid">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <MovieCard key={`${movie.imdbID}-${Math.random()}`} movie={movie} />
              ))
            ) : (
              <p className="no-results-message">No se encontraron películas con estos criterios.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;