import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
