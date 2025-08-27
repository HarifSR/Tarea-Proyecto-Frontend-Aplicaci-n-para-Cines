// src/App.jsx
import { useEffect, useMemo, useState } from 'react';
import { getCartelera } from './components/Api';
import './styles.css';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import MovieList from './components/MovieList';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState('');              // búsqueda por título
  const [ubication, setUbication] = useState(''); // filtro por sede/ciudad
  const [estado, setEstado] = useState('');    // filtro por Estado (opcional)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar al inicio
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getCartelera({ title: '', ubication: '' });
        setMovies(data);
      } catch (e) {
        setError(e.message || 'Error cargando cartelera');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handlers de búsqueda/filtrado (disparan nueva consulta o filtran en cliente)
  async function handleSearch(title) {
    try {
      setLoading(true);
      setError('');
      setQ(title);
      // Puedes elegir buscar al backend cada vez:
      const data = await getCartelera({ title, ubication });
      setMovies(data);
    } catch (e) {
      setError(e.message || 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  }

  async function handleUbicationChange(value) {
    try {
      setLoading(true);
      setError('');
      setUbication(value);
      // re-consulta al backend combinando búsqueda y ubicación
      const data = await getCartelera({ title: q, ubication: value });
      setMovies(data);
    } catch (e) {
      setError(e.message || 'Error al filtrar por ubicación');
    } finally {
      setLoading(false);
    }
  }

  // Filtro por Estado se puede hacer en cliente si el backend no lo tiene:
  const filtered = useMemo(() => {
    if (!estado) return movies;
    return movies.filter(m => (m.Estado || '').toLowerCase() === estado.toLowerCase());
  }, [movies, estado]);

  return (
    <div className="container">
      <header className="topbar">
        <h1>🎬 Cartelera</h1>
        <p className="subtitle">Búsqueda, filtros y detalles en tiempo real</p>
      </header>

      <section className="controls">
        <SearchBar defaultValue={q} onSearch={handleSearch} />
        <Filters
          movies={movies}
          ubication={ubication}
          onUbicationChange={handleUbicationChange}
          estado={estado}
          onEstadoChange={setEstado}
        />
      </section>

      {loading && <div className="status">Cargando…</div>}
      {error && <div className="status error">⚠ {error}</div>}

      {!loading && !error && <MovieList movies={filtered} />}
      <footer className="footer">Hecho con React + Vite • Diseño responsivo</footer>
    </div>
  );
}
