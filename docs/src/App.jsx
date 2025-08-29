import { useState, useEffect, useMemo } from 'react';
import './App.css';

// Importamos los componentes
import Navbar from './components/Navbar/Navbar';
import HeroCarousel from './components/HeroCarousel/HeroCarousel';
import MovieCard from './components/MovieCard/MovieCard';
import Footer from './components/Footer/Footer';
import MovieDetailsModal from './components/MovieDetailsModal/MovieDetailsModal'; // 1. Importa el nuevo componente

const API_URL = 'https://movie.azurewebsites.net/api/cartelera?title=&ubication=';

function App() {
  // --- ESTADOS ---
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // 2. Nuevo estado para la película seleccionada

  // ... (otros estados como searchTerm, filterType, etc. se mantienen igual)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUbication, setFilterUbication] = useState('all');

  // ... (useEffect y la lógica de filtros se mantienen igual)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL);
        let data = await response.json();
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

  const movieTypes = useMemo(() => {
    const types = new Set(movies.map(movie => movie.Type));
    return ['all', ...Array.from(types)];
  }, [movies]);

  const movieUbications = useMemo(() => {
    const ubications = new Set(movies.map(movie => movie.Ubication));
    return ['all', ...Array.from(ubications)];
  }, [movies]);
  
  const filteredMovies = movies.filter(movie => {
    const matchesSearchTerm = movie.Title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || movie.Type === filterType;
    const matchesUbication = filterUbication === 'all' || movie.Ubication === filterUbication;
    return matchesSearchTerm && matchesType && matchesUbication;
  });

  const featuredMovies = useMemo(() => {
    const candidates = movies.filter(movie => movie.Title.toLowerCase() !== 'no' && movie.Title.length > 3);
    return candidates.slice(0, 5);
  }, [movies]);

  // --- 3. Funciones para manejar el modal ---
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="app">
      <Navbar />

      {!isLoading && featuredMovies.length > 0 && (
        <HeroCarousel featuredMovies={featuredMovies} />
      )}
      
      <main className="app-container" id="cartelera">
        {/* ... (código del cartelera-header se mantiene igual) ... */}
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
                // 4. Pasamos la función a cada MovieCard
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

      {/* 5. Renderizamos el modal aquí. Solo se mostrará si selectedMovie no es null */}
      <MovieDetailsModal movie={selectedMovie} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
