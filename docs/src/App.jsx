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

const API_URL_BASE = 'https://movie.azurewebsites.net/api/cartelera';

function App() {
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
        const response = await fetch(`${API_URL_BASE}?title=&ubication=`);
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

  // --- LÓGICA DE NORMALIZACIÓN Y FILTROS (Sin cambios) ---
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

  // --- FUNCIONES CRUD CONECTADAS A LA API Y CON DEPURACIÓN ---
  const handleSaveMovie = async (movieToSave) => {
    // PASO 1 DE DEPURACIÓN: Ver el objeto que llega del formulario.
    console.log("Intentando guardar esta película:", movieToSave);

    const isUpdating = movies.some(m => m.imdbID === movieToSave.imdbID);

    if (isUpdating) {
      // PASO 2 DE DEPURACIÓN: Confirmar que entra en la lógica de ACTUALIZAR.
      console.log("Modo: ACTUALIZAR (PUT)");
      try {
        const response = await fetch(`${API_URL_BASE}?imdbID=${movieToSave.imdbID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieToSave),
        });
        if (!response.ok) {
            console.error('Error de la API al actualizar:', response.status, await response.text());
            throw new Error('Error al actualizar la película.');
        }
        setMovies(movies.map(m => m.imdbID === movieToSave.imdbID ? movieToSave : m));
        handleCloseForm(); // Mejora: Cerrar el formulario después de guardar
      } catch (error) {
        console.error("Error en PUT:", error);
      }
    } else {
      // PASO 2 DE DEPURACIÓN: Confirmar que entra en la lógica de AÑADIR.
      console.log("Modo: AÑADIR (POST)");
      try {
        const response = await fetch(API_URL_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieToSave),
        });
        if (!response.ok) {
            // PASO 3 DE DEPURACIÓN: Ver el error de la API si falla.
            console.error('Error de la API al añadir:', response.status, await response.text());
            throw new Error('Error al añadir la película.');
        }
        setMovies([movieToSave, ...movies]);
        handleCloseForm(); // Mejora: Cerrar el formulario después de guardar
      } catch (error) {
        console.error("Error en POST:", error);
      }
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta película? Esta acción es permanente.')) {
      try {
        const response = await fetch(`${API_URL_BASE}?imdbID=${movieId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar la película.');
        setMovies(movies.filter(m => m.imdbID !== movieId));
        handleCloseModal();
      } catch (error) {
        console.error("Error en DELETE:", error);
      }
    }
  };

  // --- MANEJADORES DE MODALES (Sin cambios) ---
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
      <Navbar onPreventaClick={handleToggleMegaMenu} onAddMovieClick={handleOpenFormToAdd} />
      {!isLoading && featuredMovies.length > 0 && <HeroCarousel featuredMovies={featuredMovies} />}
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
                  {movieTypes.map(type => <option key={type} value={type}>{type === 'all' ? 'Todos los géneros' : type}</option>)}
                </select>
              </div>
              <div className="select-wrapper">
                <select className="filter-select" value={filterUbication} onChange={(e) => setFilterUbication(e.target.value)}>
                  {movieUbications.map(ubication => <option key={ubication} value={ubication}>{ubication === 'all' ? 'Todas las ubicaciones' : ubication}</option>)}
                </select>
              </div>
            </div>
        </div>
        {isLoading ? <p className="loading-message">Cargando cartelera...</p> : (
          <div className="movies-grid">
            {filteredMovies.map((movie) => <MovieCard key={`${movie.imdbID}-${Math.random()}`} movie={movie} onClick={() => handleMovieClick(movie)} />)}
          </div>
        )}
      </main>
      <Footer />
      <MovieDetailsModal movie={selectedMovie} onClose={handleCloseModal} onEdit={handleOpenFormToEdit} onDelete={handleDeleteMovie} />
      {isFormOpen && <MovieFormModal movie={editingMovie} onClose={handleCloseForm} onSave={handleSaveMovie} />}
      {isMegaMenuOpen && <MegaMenu preventaMovies={preventaMovies} onClose={handleToggleMegaMenu} />}
    </div>
  );
}

export default App;