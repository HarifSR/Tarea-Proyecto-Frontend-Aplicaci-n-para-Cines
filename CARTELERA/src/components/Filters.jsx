import React from "react";

export default function Filters({
  options,
  values,
  onChange,
  onClear,
  total,
}) {
  const makeSelect = (label, key) => {
    const opts = options[key] ?? [];
    if (!opts.length) return null;
    return (
      <label className="filter">
        <span>{label}</span>
        <select
          value={values[key] ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
        >
          <option value="">Todos</option>
          {opts.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
    );
  };

  return (
    <div className="filters">
      {makeSelect("Género", "genero")}
      {makeSelect("Clasificación", "clasificacion")}
      {makeSelect("Formato", "formato")}
      {makeSelect("Idioma", "idioma")}

      <button className="btn btn-ghost" onClick={onClear}>
        Limpiar filtros
      </button>

      <span className="results-count">
        {total} {total === 1 ? "resultado" : "resultados"}
      </span>
    </div>
  );
}
