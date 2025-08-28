import { useState, useEffect, useMemo } from 'react';
import './App.css';

// Importamos los componentes
import Navbar from './components/Navbar/Navbar';
import HeroCarousel from './components/HeroCarousel/HeroCarousel';
import MovieCard from './components/MovieCard/MovieCard';
import Footer from './components/Footer/Footer';

const API_URL = 'https://movie.azurewebsites.net/api/cartelera?title=&ubication=';

function App() {
  // --- ESTADOS ---
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para los controles
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUbication, setFilterUbication] = useState('all');

  // --- EFECTO PARA OBTENER DATOS ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL);
        let data = await response.json();
        // Limpieza de datos: unificamos el formato de las ubicaciones
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
    const matchesSearchTerm = movie.Title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || movie.Type === filterType;
    const matchesUbication = filterUbication === 'all' || movie.Ubication === filterUbication;
    return matchesSearchTerm && matchesType && matchesUbication;
  });

  // --- SELECCIÓN DE PELÍCULAS DESTACADAS MEJORADA ---
  const featuredMovies = useMemo(() => {
    const candidates = movies.filter(movie => movie.Title.toLowerCase() !== 'no' && movie.Title.length > 3);
    return candidates.slice(0, 5);
  }, [movies]);

  // --- RENDERIZADO ---
  return (
    <div className="app">
      <Navbar />

      {!isLoading && featuredMovies.length > 0 && (
        <HeroCarousel featuredMovies={featuredMovies} />
      )}
      
      <main className="app-container" id="cartelera">
        
        {/* --- ESTRUCTURA DE ENCABEZADO Y CONTROLES INTEGRADA --- */}
        <div className="cartelera-header">
          <h1 className="section-title">CARTELERA</h1>
          
          <div className="controls-container">
            <div className="search-bar">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                placeholder="Busca por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="select-wrapper">
              <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                {movieTypes.map(type => (
                  <option key={type} value={type}>{type === 'all' ? 'Todos los géneros' : type}</option>
                ))}
              </select>
            </div>

            <div className="select-wrapper">
              <select className="filter-select" value={filterUbication} onChange={(e) => setFilterUbication(e.target.value)}>
                {movieUbications.map(ubication => (
                  <option key={ubication} value={ubication}>{ubication === 'all' ? 'Todas las ubicaciones' : ubication}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* --- CUADRÍCULA DE PELÍCULAS --- */}
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

      <Footer />
    </div>
  );
}

export default App;
