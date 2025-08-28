import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './HeroCarousel.css';

// Este componente recibirá las películas destacadas como props
const HeroCarousel = ({ featuredMovies }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: 'linear'
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