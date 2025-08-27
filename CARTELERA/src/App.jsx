import React, { useEffect, useMemo, useState } from "react";
import { getCartelera, getPeliculaById } from "../src/Api.js";
import MovieCard from "./components/MovieCard.jsx";
import Filters from "./components/Filters.jsx";

export default function App() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [q, setQ] = useState(""); // búsqueda por título
  const [filters, setFilters] = useState({
    genero: "",
    clasificacion: "",
    formato: "",
    idioma: "",
  });

  const [detail, setDetail] = useState({ open: false, data: null, loading: false });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getCartelera();
        setRaw(data);
      } catch (e) {
        setErr(e.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Opciones únicas por campo (se construyen con lo que haya)
  const filterOptions = useMemo(() => {
    const pickSet = (key) =>
      Array.from(new Set(raw.map((m) => (m[key] ?? "").trim()).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b, "es")
      );
    return {
      genero: pickSet("genero"),
      clasificacion: pickSet("clasificacion"),
      formato: pickSet("formato"),
      idioma: pickSet("idioma"),
    };
  }, [raw]);

  // Aplicar búsqueda + filtros
  const list = useMemo(() => {
    const qn = q.trim().toLowerCase();
    return raw.filter((m) => {
      const matchTitle = !qn || m.titulo?.toLowerCase().includes(qn);
      const matchGenero = !filters.genero || m.genero === filters.genero;
      const matchClas = !filters.clasificacion || m.clasificacion === filters.clasificacion;
      const matchFormato = !filters.formato || m.formato === filters.formato;
      const matchIdioma = !filters.idioma || m.idioma === filters.idioma;
      return matchTitle && matchGenero && matchClas && matchFormato && matchIdioma;
    });
  }, [raw, q, filters]);

  const onChangeFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const clearFilters = () =>
    setFilters({ genero: "", clasificacion: "", formato: "", idioma: "" });

  const openDetails = async (movie) => {
    setDetail({ open: true, data: movie, loading: true });
    try {
      // Si la API soporta imdbID, intenta traer más datos
      const enriched = await getPeliculaById(movie.id);
      setDetail({ open: true, data: { ...movie, ...enriched }, loading: false });
    } catch {
      // si falla, mostramos lo que ya teníamos
      setDetail((d) => ({ ...d, loading: false }));
    }
  };

  const closeDetails = () => setDetail({ open: false, data: null, loading: false });

  return (
    <div className="app">
      <header className="topbar">
        <h1>🎬 Cartelera</h1>

        <div className="searchbar">
          <input
            type="search"
            placeholder="Buscar por título…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button className="btn btn-ghost" onClick={() => setQ("")} title="Limpiar">
              ✕
            </button>
          )}
        </div>
      </header>

      {err && (
        <div className="alert error">
          <strong>Error:</strong> {err}
        </div>
      )}

      <main>
        <Filters
          options={filterOptions}
          values={filters}
          onChange={onChangeFilter}
          onClear={clearFilters}
          total={list.length}
        />

        {loading ? (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card skeleton" />
            ))}
          </div>
        ) : list.length ? (
          <div className="grid">
            {list.map((m) => (
              <MovieCard key={m.id} movie={m} onDetails={() => openDetails(m)} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>No se encontraron resultados.</p>
          </div>
        )}
      </main>

      {detail.open && (
        <div className="modal-backdrop" onClick={closeDetails}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {detail.loading ? (
              <div className="modal-loading">Cargando…</div>
            ) : (
              <>
                <button className="modal-close" onClick={closeDetails} aria-label="Cerrar">✕</button>
                <div className="modal-content">
                  {detail.data?.poster ? (
                    <img
                      className="modal-poster"
                      src={detail.data.poster}
                      alt={detail.data.titulo}
                    />
                  ) : (
                    <div className="poster-fallback modal-poster" />
                  )}

                  <div className="modal-info">
                    <h2>{detail.data?.titulo}</h2>

                    <div className="chips">
                      {detail.data?.genero && <span className="chip">{detail.data.genero}</span>}
                      {detail.data?.clasificacion && (
                        <span className="chip">{detail.data.clasificacion}</span>
                      )}
                      {detail.data?.formato && <span className="chip">{detail.data.formato}</span>}
                      {detail.data?.idioma && <span className="chip">{detail.data.idioma}</span>}
                      {detail.data?.duracion && <span className="chip">{detail.data.duracion}</span>}
                    </div>

                    {detail.data?.sinopsis && (
                      <>
                        <h3>Sinopsis</h3>
                        <p>{detail.data.sinopsis}</p>
                      </>
                    )}

                    {detail.data?.estreno && (
                      <p className="muted">Estreno: {detail.data.estreno}</p>
                    )}
                    {detail.data?.cine && <p className="muted">Cine: {detail.data.cine}</p>}

                    {/* Si la API entrega funciones/horarios en algún array */}
                    {Array.isArray(detail.data?.funciones) && detail.data.funciones.length > 0 && (
                      <>
                        <h3>Funciones</h3>
                        <ul className="showtimes">
                          {detail.data.funciones.map((f, i) => (
                            <li key={i}>{String(f)}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
