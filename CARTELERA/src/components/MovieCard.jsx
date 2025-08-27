// src/components/MovieCard.jsx
import { useState } from 'react';
import { getPeliculaPorId } from './Api';

const FALLBACK =
  'https://via.placeholder.com/300x450.png?text=Sin+poster';

export default function MovieCard({ movie }) {
  const { imdbID, Title, Year, Type, Poster, Estado, Ubication, description } = movie;
  const [details, setDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const poster = Poster || FALLBACK;

  async function verDetalles() {
    try {
      setLoading(true);
      // si no existe endpoint por ID en ese momento, podrías simplemente mostrar `movie`
      const data = imdbID ? await getPeliculaPorId(imdbID) : movie;
      setDetails(data || movie);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="card">
      <img src={poster} alt={`Poster de ${Title}`} onError={(e)=>{e.currentTarget.src = FALLBACK;}} />
      <div className="card-body">
        <h3 title={Title}>{Title}</h3>
        <p className="meta">
          <span>{Year}</span> · <span>{Type}</span>
        </p>
        <p className="tags">
          {Ubication && <span className="tag">{Ubication}</span>}
          {Estado && <span className={`tag ${Estado.toLowerCase()}`}>{Estado}</span>}
        </p>
        <p className="desc">{description || 'Sin descripción.'}</p>

        <button onClick={verDetalles} disabled={loading}>
          {loading ? 'Cargando…' : 'Ver detalles'}
        </button>
      </div>

      {open && details && (
        <dialog open className="modal" onClose={()=>setOpen(false)}>
          <h4>{details.Title}</h4>
          <p><b>Año:</b> {details.Year}</p>
          <p><b>Tipo:</b> {details.Type}</p>
          <p><b>Ubicación:</b> {details.Ubication || '—'}</p>
          <p><b>Estado:</b> {details.Estado || '—'}</p>
          <p>{details.description || 'Sin descripción adicional.'}</p>
          <button onClick={()=>setOpen(false)}>Cerrar</button>
        </dialog>
      )}
    </article>
  );
}
