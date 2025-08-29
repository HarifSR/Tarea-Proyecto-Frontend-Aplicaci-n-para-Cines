import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// Importamos todos los componentes
import Navbar from './components/Navbar/Navbar';
import HeroCarousel from './components/HeroCarousel/HeroCarousel';
import MovieCard from './components/MovieCard/MovieCard';
import Footer from './components/Footer/Footer';
import MovieDetailsModal from './components/MovieDetailsModal/MovieDetailsModal';
import MegaMenu from './components/MegaMenu/MegaMenu';
import MovieFormModal from './components/MovieFormModal/MovieFormModal';

const API_URL = 'https://movie.azurewebsites.net/api/cartelera?title=&ubication=';

function App() {
  // ... (Todos los estados y funciones se mantienen igual)
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUbication, setFilterUbication] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

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

  const normalizeText = (str) => {
    if (!str) return '';
    return str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const movieTypes = useMemo(() => {
    const uniqueTypes = new Set(movies.map(movie => normalizeText(movie.Type)));
    return ['all', ...Array.from(uniqueTypes).sort()];
  }, [movies]);

  const movieUbications = useMemo(() => {
    const uniqueUbications = new Set(movies.map(movie => normalizeText(movie.Ubication)));
    return ['all', ...Array.from(uniqueUbications).sort()];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearchTerm = movie.Title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || normalizeText(movie.Type) === filterType;
      const matchesUbication = filterUbication === 'all' || normalizeText(movie.Ubication) === filterUbication;
      return matchesSearchTerm && matchesType && matchesUbication;
    });
  }, [movies, searchTerm, filterType, filterUbication]);

  const featuredMovies = useMemo(() => {
    const candidates = movies.filter(movie => movie.Title.toLowerCase() !== 'no' && movie.Title.length > 3);
    return candidates.slice(0, 5);
  }, [movies]);
  
  const preventaMovies = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return movies.filter(movie => parseInt(movie.Year) > currentYear);
  }, [movies]);

  const handleSaveMovie = (movieToSave) => {
    const movieIndex = movies.findIndex(m => m.imdbID === movieToSave.imdbID);
    if (movieIndex > -1) {
      const updatedMovies = [...movies];
      updatedMovies[movieIndex] = movieToSave;
      setMovies(updatedMovies);
    } else {
      setMovies([movieToSave, ...movies]);
    }
  };

  const handleDeleteMovie = (movieId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      setMovies(movies.filter(m => m.imdbID !== movieId));
      handleCloseModal();
    }
  };

  const handleMovieClick = (movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);
  const handleToggleMegaMenu = () => setIsMegaMenuOpen(!isMegaMenuOpen);
  
  const handleOpenFormToAdd = () => {
    setEditingMovie(null);
    setIsFormOpen(true);
  };

  const handleOpenFormToEdit = (movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
    handleCloseModal();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMovie(null);
  };

  return (
    <div className="app">
      {/* 1. Pasamos la función onAddMovieClick como prop */}
      <Navbar 
        onPreventaClick={handleToggleMegaMenu}
        onAddMovieClick={handleOpenFormToAdd}
      />

      {!isLoading && featuredMovies.length > 0 && (
        <HeroCarousel featuredMovies={featuredMovies} />
      )}
      
      <main className="app-container" id="cartelera">
        {/* ... (el resto del JSX de la cartelera se mantiene igual) ... */}
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
        
        {isLoading ? ( <p className="loading-message">Cargando cartelera...</p> ) : (
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <MovieCard 
                key={`${movie.imdbID}-${Math.random()}`} 
                movie={movie}
                onClick={() => handleMovieClick(movie)} 
              />
            ))}
          </div>
        )}
      </main>

      {/* 2. El botón flotante <button className="fab"> ha sido ELIMINADO de aquí */}

      <Footer />

      {/* ... (El resto de los modales se mantienen igual) ... */}
      {selectedMovie && (
        <MovieDetailsModal 
          movie={selectedMovie} 
          onClose={handleCloseModal}
          onEdit={handleOpenFormToEdit}
          onDelete={handleDeleteMovie}
        />
      )}

      {isFormOpen && (
        <MovieFormModal 
          movie={editingMovie}
          onClose={handleCloseForm}
          onSave={handleSaveMovie}
        />
      )}

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
