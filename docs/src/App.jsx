import { useState, useEffect, useMemo } from 'react';
import './App.css';

// Importamos los componentes
import Navbar from './components/Navbar/Navbar';
import HeroCarousel from './components/HeroCarousel/HeroCarousel';
import MovieCard from './components/MovieCard/MovieCard';
import Footer from './components/Footer/Footer';
import MovieDetailsModal from './components/MovieDetailsModal/MovieDetailsModal';
import MegaMenu from './components/MegaMenu/MegaMenu';

const API_URL = 'https://movie.azurewebsites.net/api/cartelera?title=&ubication=';

function App() {
  // --- ESTADOS ---
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUbication, setFilterUbication] = useState('all');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error al obtener las películas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // --- LÓGICA DE NORMALIZACIÓN AVANZADA ---

  // Función para limpiar y estandarizar texto: quita tildes, ajusta mayúsculas, etc.
  const normalizeText = (str) => {
    if (!str) return '';
    return str
      .toLowerCase() // 1. Poner todo en minúsculas
      .trim() // 2. Quitar espacios al inicio y final
      .normalize('NFD') // 3. Separar tildes de las letras (ej: 'ó' -> 'o' + '´')
      .replace(/[\u0300-\u036f]/g, '') // 4. Quitar las tildes y acentos
      .split(' ') // 5. Separar en palabras
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // 6. Poner mayúscula a cada palabra
      .join(' '); // 7. Unir de nuevo
  };

  // Generamos la lista de géneros, ahora normalizada
  const movieTypes = useMemo(() => {
    const uniqueTypes = new Set(
      movies.map(movie => normalizeText(movie.Type))
    );
    return ['all', ...Array.from(uniqueTypes).sort()];
  }, [movies]);

  // Generamos la lista de ubicaciones, también normalizada
  const movieUbications = useMemo(() => {
    const uniqueUbications = new Set(
      movies.map(movie => normalizeText(movie.Ubication))
    );
    return ['all', ...Array.from(uniqueUbications).sort()];
  }, [movies]);

  const filteredMovies = movies.filter(movie => {
    const matchesSearchTerm = movie.Title.toLowerCase().includes(searchTerm.toLowerCase());
    // Al filtrar, también normalizamos el dato de la película para que coincida
    const matchesType = filterType === 'all' || normalizeText(movie.Type) === filterType;
    const matchesUbication = filterUbication === 'all' || normalizeText(movie.Ubication) === filterUbication;
    return matchesSearchTerm && matchesType && matchesUbication;
  });

  const featuredMovies = useMemo(() => {
    const candidates = movies.filter(movie => movie.Title.toLowerCase() !== 'no' && movie.Title.length > 3);
    return candidates.slice(0, 5);
  }, [movies]);

  const preventaMovies = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return movies.filter(movie => parseInt(movie.Year) > currentYear);
  }, [movies]);

  // --- MANEJADORES DE EVENTOS ---
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleToggleMegaMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen);
  };
  
  return (
    <div className="app">
      <Navbar onPreventaClick={handleToggleMegaMenu} />

      {!isLoading && featuredMovies.length > 0 && (
        <HeroCarousel featuredMovies={featuredMovies} />
      )}
      
      <main className="app-container" id="cartelera">
        <div className="cartelera-header">
          <h1 className="section-title">CARTELERA</h1>
          <div className="controls-container">
            <div className="search-bar">
              <i className="fa-solid fa-search"></i>
              <input type="text" placeholder="Busca por título..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="select-wrapper">
              <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                {movieTypes.map(type => (<option key={type} value={type}>{type === 'all' ? 'Todos los géneros' : type}</option>))}
              </select>
            </div>
            <div className="select-wrapper">
              <select className="filter-select" value={filterUbication} onChange={(e) => setFilterUbication(e.target.value)}>
                {movieUbications.map(ubication => (<option key={ubication} value={ubication}>{ubication === 'all' ? 'Todas las ubicaciones' : ubication}</option>))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="loading-message">Cargando cartelera...</p>
        ) : (
          <div className="movies-grid">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <MovieCard 
                  key={`${movie.imdbID}-${Math.random()}`} 
                  movie={movie}
                  onClick={() => handleMovieClick(movie)} 
                />
              ))
            ) : (
              <p className="no-results-message">No se encontraron películas con estos criterios.</p>
            )}
          </div>
        )}
      </main>

      <Footer />

      <MovieDetailsModal movie={selectedMovie} onClose={handleCloseModal} />

      {isMegaMenuOpen && (
        <MegaMenu 
          preventaMovies={preventaMovies}
          onClose={handleToggleMegaMenu} 
        />
      )}
    </div>
  );
}

export default App;
