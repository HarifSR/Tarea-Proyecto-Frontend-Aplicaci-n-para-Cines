import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          CinePolis
        </div>
        <div className="footer-links">
          <a href="#">Sobre nosotros</a>
          <a href="#">Términos de servicio</a>
          <a href="#">Política de privacidad</a>
        </div>
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CineMatrix. Desarrollado con fines educativos.</p>
      </div>
    </footer>
  );
};

export default Footer;