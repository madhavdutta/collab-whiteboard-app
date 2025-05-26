import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn">
          Go Home
        </Link>
      </div>
      
      <style jsx>{`
        .not-found {
          display: flex;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 64px); /* Subtract navbar height */
          padding: 2rem;
        }
        
        .not-found-content {
          text-align: center;
          max-width: 500px;
        }
        
        .not-found-title {
          font-size: 6rem;
          font-weight: 700;
          color: var(--primary-color);
          line-height: 1;
          margin-bottom: 1rem;
        }
        
        .not-found-subtitle {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .not-found-message {
          color: var(--gray-color);
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
