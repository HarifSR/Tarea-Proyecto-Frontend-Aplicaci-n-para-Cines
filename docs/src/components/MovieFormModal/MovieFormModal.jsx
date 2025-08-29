import React, { useState, useEffect } from 'react';
import './MovieFormModal.css';

const MovieFormModal = ({ movie, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    imdbID: '', Title: '', Year: '', Type: '', Poster: '', description: '', Ubication: '',
  });
  const isEditMode = Boolean(movie);

  useEffect(() => {
    if (isEditMode) {
      setFormData(movie);
    } else {
      setFormData({
        imdbID: `IMDB${Date.now()}`,
        Title: '', Year: '', Type: '', Poster: '', description: '', Ubication: '',
      });
    }
  }, [movie, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes añadir validación si lo deseas
    onSave(formData);
    onClose();
  };
  
  const posterPreview = formData.Poster && formData.Poster.startsWith('http') 
    ? formData.Poster 
    : "https://via.placeholder.com/400x600.png?text=Vista+Previa";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content form-modal-content redesigned" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Editar Película' : 'Añadir Nueva Película'}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="movie-form" noValidate>
          <div className="form-body">
            {/* --- Columna Izquierda: Vista Previa del Póster --- */}
            <div className="form-poster-preview">
                <img 
                  src={posterPreview} 
                  alt="Vista previa del póster" 
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x600.png?text=URL+inválida" }}
                />
            </div>

            {/* --- Columna Derecha: Campos del Formulario --- */}
            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="Title">Título</label>
                <input type="text" id="Title" name="Title" value={formData.Title} onChange={handleChange} required />
              </div>
              <div className="form-group-inline">
                <div className="form-group">
                  <label htmlFor="Year">Año</label>
                  <input type="text" id="Year" name="Year" value={formData.Year} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="Type">Género</label>
                  <input type="text" id="Type" name="Type" value={formData.Type} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="Ubication">Ubicación</label>
                <input type="text" id="Ubication" name="Ubication" value={formData.Ubication} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="Poster">URL del Póster</label>
                <input type="text" id="Poster" name="Poster" value={formData.Poster} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" required />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">
              <i className="fa-solid fa-save"></i>
              {isEditMode ? 'Guardar Cambios' : 'Añadir Película'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieFormModal;