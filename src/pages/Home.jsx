import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Collaborate in Real-Time with Our Whiteboard App</h1>
            <p className="hero-subtitle">
              Create, share, and collaborate on digital whiteboards with your team from anywhere in the world.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-lg">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="features">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🖌️</div>
              <h3 className="feature-title">Real-Time Collaboration</h3>
              <p className="feature-description">
                Work together with your team in real-time, seeing changes as they happen.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Infinite Canvas</h3>
              <p className="feature-description">
                Never run out of space with our infinite canvas technology.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Cross-Platform</h3>
              <p className="feature-description">
                Access your whiteboards from any device, anywhere, anytime.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Sharing</h3>
              <p className="feature-description">
                Control who can view and edit your whiteboards with secure sharing options.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pricing">
        <div className="container">
          <h2 className="section-title">Pricing Plans</h2>
          <div className="pricing-grid">
            <div className="subscription-card">
              <div className="subscription-name">Free</div>
              <div className="subscription-price">$0</div>
              <div className="subscription-period">forever</div>
              <div className="subscription-features">
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Up to 3 whiteboards</span>
                </div>
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Basic drawing tools</span>
                </div>
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Up to 3 collaborators</span>
                </div>
              </div>
              <Link to="/register" className="btn w-full">
                Get Started
              </Link>
            </div>
            
            <div className="subscription-card popular">
              <div className="badge badge-primary" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                Popular
              </div>
              <div className="subscription-name">Pro</div>
              <div className="subscription-price">$9.99</div>
              <div className="subscription-period">per month</div>
              <div className="subscription-features">
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Unlimited whiteboards</span>
                </div>
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Advanced drawing tools</span>
                </div>
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Up to 10 collaborators</span>
                </div>
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Export to PDF/PNG</span>
                </div>
              </div>
              <Link to="/register" className="btn w-full">
                Start Free Trial
              </Link>
            </div>
            
            <div className="subscription-card">
              <div className="subscription-name">Team</div>
              <div className="subscription-price">$29.99</div>
              <div className="subscription-period">per month</div>
              <div className="subscription-features">
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Everything in Pro</span>
                </div>
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Unlimited collaborators</span>
                </div>
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Team management</span>
                </div>
                <div className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Priority support</span>
                </div>
              </div>
              <Link to="/register" className="btn w-full">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .home {
          padding-bottom: 4rem;
        }
        
        .hero {
          background-color: var(--light-color);
          padding: 4rem 0;
          margin-bottom: 4rem;
        }
        
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        
        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--dark-color);
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--gray-color);
          margin-bottom: 2rem;
        }
        
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .btn-lg {
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
        }
        
        .section-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .features {
          margin-bottom: 4rem;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
        }
        
        @media (min-width: 640px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .feature {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .feature-description {
          color: var(--gray-color);
        }
        
        .pricing {
          margin-bottom: 4rem;
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
        }
        
        @media (min-width: 768px) {
          .pricing-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
