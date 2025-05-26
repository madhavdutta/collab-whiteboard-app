import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/" className="navbar-logo">
              Whiteboard App
            </Link>
          </div>
          
          <div className="navbar-menu">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="navbar-item">
                  Dashboard
                </Link>
                <div className="navbar-dropdown">
                  <button className="navbar-profile">
                    <div className="avatar">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span>{user?.name || 'User'}</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-item">
                  Login
                </Link>
                <Link to="/register" className="btn">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .navbar {
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }
        
        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .navbar-logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
          text-decoration: none;
        }
        
        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .navbar-item {
          color: var(--dark-color);
          text-decoration: none;
          font-weight: 500;
        }
        
        .navbar-item:hover {
          color: var(--primary-color);
        }
        
        .navbar-dropdown {
          position: relative;
        }
        
        .navbar-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: var(--border-radius);
        }
        
        .navbar-profile:hover {
          background-color: var(--light-color);
        }
        
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          min-width: 180px;
          z-index: 10;
          margin-top: 0.5rem;
          display: none;
        }
        
        .navbar-dropdown:hover .dropdown-menu {
          display: block;
        }
        
        .dropdown-item {
          display: block;
          padding: 0.75rem 1rem;
          color: var(--dark-color);
          text-decoration: none;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .dropdown-item:hover {
          background-color: var(--light-color);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
