import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './style.css'; 
import cinemaLogo from '../components/cinema.png';// Import the stylesheet
import './style.css';
const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      <nav>
      <div className="logo-container">
          <Link to="/">
            <img src={cinemaLogo} alt="MovieHub Logo" className="logo-img" />
          </Link>
          <span className="site-title">MovieHub</span> {/* Title added next to the logo */}
        </div>
        
        <ul>
          <li><Link to="/" className="nav-link">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/add-movie" className="nav-link">Add Movie</Link></li>
              <li><button onClick={logout} className="btn-logout">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-link">Login</Link></li>
              <li><Link to="/register" className="nav-link btn-register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
