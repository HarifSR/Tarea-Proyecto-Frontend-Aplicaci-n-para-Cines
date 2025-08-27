const BASE = "/api/cartelera"; // usando el proxy de Vite

function normalize(item) {
  const first = (k) =>
    item?.[k] ?? item?.[k?.toLowerCase?.()] ?? item?.[k?.toUpperCase?.()];
  return {
    id: first("imdbID") ?? first("id") ?? first("ID") ?? crypto.randomUUID(),
    titulo: first("titulo") ?? first("title") ?? "Sin título",
    poster: first("poster") ?? first("image") ?? first("portada") ?? null,
    genero: first("genero") ?? first("genre") ?? null,
    clasificacion: first("clasificacion") ?? first("rating") ?? null,
    formato: first("formato") ?? first("format") ?? null,
    idioma: first("idioma") ?? first("language") ?? null,
    duracion: first("duracion") ?? first("runtime") ?? null,
    sinopsis: first("sinopsis") ?? first("plot") ?? first("descripcion") ?? null,
    estreno: first("fechaEstreno") ?? first("releaseDate") ?? null,
    cine: first("cine") ?? first("cinema") ?? first("cadena") ?? null,
    funciones: item?.funciones ?? item?.showtimes ?? null,
  };
}

async function fetchJSON(url, init) {
  let res;
  try {
    res = await fetch(url, init);
  } catch (e) {
    throw new Error("Fallo de red/CORS: " + (e?.message ?? e));
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${txt.slice(0,160)}`);
  }
  return res.json();
}

export async function getCartelera() {
  // La API parece requerir POST para la lista
  try {
    const data = await fetchJSON(BASE, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({}), // algunos backends esperan JSON aunque esté vacío
    });
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return list.map(normalize);
  } catch (err) {
    // Si por algún motivo POST falla, probamos GET como respaldo
    if (!String(err.message).includes("HTTP 405")) {
      // si no fue 405, igual intentemos GET por si acaso
      const data = await fetchJSON(BASE);
      const list = Array.isArray(data) ? data : data?.data ?? [];
      return list.map(normalize);
    }
    throw err;
  }
}

export async function getPeliculaById(imdbID) {
  const url = `${BASE}?imdbID=${encodeURIComponent(imdbID)}`;

 // 1) intentar con GET
try {
  const data = await fetchJSON(url);
  const item = Array.isArray(data) ? data[0] : data;
  return normalize(item ?? {});
} catch (err) {
  // 2) fallback a POST si también exigen POST en detalle
  const data = await fetchJSON(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const item = Array.isArray(data) ? data[0] : data;
  return normalize(item ?? {});
}

}
