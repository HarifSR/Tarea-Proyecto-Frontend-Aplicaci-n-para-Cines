import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './HeroCarousel.css';

// --- NUEVO: Componente para la flecha "Siguiente" ---
// Recibe props como className, style y onClick de la librería react-slick
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style }}
      onClick={onClick}
    >
      <i className="fa-solid fa-chevron-right"></i>
    </div>
  );
}

// --- NUEVO: Componente para la flecha "Anterior" ---
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style }}
      onClick={onClick}
    >
      <i className="fa-solid fa-chevron-left"></i>
    </div>
  );
}


const HeroCarousel = ({ featuredMovies }) => {
  // --- CONFIGURACIÓN DEL SLIDER ACTUALIZADA ---
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    cssEase: 'linear',
    // Aquí integramos nuestros componentes de flecha personalizados
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className="hero-carousel-container">
      <Slider {...settings}>
        {featuredMovies.map(movie => (
          <div key={movie.imdbID} className="carousel-slide">
            <img className="carousel-image" src={movie.Poster} alt={movie.Title} />
            <div className="carousel-overlay"></div>
            <div className="carousel-caption">
              <h2>YA EN CINES</h2>
              <h1>{movie.Title}</h1>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;
