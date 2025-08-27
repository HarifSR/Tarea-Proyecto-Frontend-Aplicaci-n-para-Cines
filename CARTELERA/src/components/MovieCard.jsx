import React from "react";

export default function MovieCard({ movie, onDetails }) {
  const {
    titulo,
    poster,
    genero,
    clasificacion,
    formato,
    idioma,
    duracion,
  } = movie;

  return (
    <article className="card">
      <div className="card-poster">
        {poster ? (
          <img src={poster} alt={titulo} loading="lazy" />
        ) : (
          <div className="poster-fallback" aria-label="Sin imagen"></div>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title" title={titulo}>{titulo}</h3>

        <div className="chips">
          {genero && <span className="chip">{genero}</span>}
          {clasificacion && <span className="chip">{clasificacion}</span>}
          {formato && <span className="chip">{formato}</span>}
          {idioma && <span className="chip">{idioma}</span>}
          {duracion && <span className="chip">{duracion}</span>}
        </div>

        <button className="btn btn-primary" onClick={onDetails}>
          Ver detalles
        </button>
      </div>
    </article>
  );
}
