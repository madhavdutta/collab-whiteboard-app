import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaPencilAlt, FaUsers, FaSave, FaLock } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Collaborative Whiteboard</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          A real-time collaborative whiteboard for teams, educators, and creatives.
          Draw, sketch, and collaborate with anyone, anywhere, anytime.
        </p>
        
        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline">
                Log In
              </Link>
            </>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-light">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="text-center mb-4">
                <FaPencilAlt className="text-4xl text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Real-time Drawing</h3>
              <p>
                Draw and see others' drawings in real-time. Perfect for brainstorming
                and collaborative work.
              </p>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <FaUsers className="text-4xl text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Multi-user Collaboration</h3>
              <p>
                Invite team members, students, or friends to join your whiteboard
                and collaborate together.
              </p>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <FaSave className="text-4xl text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Save & Export</h3>
              <p>
                Save your whiteboards for later or export them as images to share
                with others.
              </p>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <FaLock className="text-4xl text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Secure & Private</h3>
              <p>
                Your whiteboards are secure and private. Only share with those you
                want to collaborate with.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">Pricing Plans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="subscription-card">
              <div className="subscription-name">Free</div>
              <div className="subscription-price">$0</div>
              <div className="subscription-period">forever</div>
              
              <ul className="subscription-features">
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Up to 3 whiteboards</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Basic drawing tools</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Up to 5 collaborators per board</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Export as PNG</span>
                </li>
              </ul>
              
              <Link to="/register" className="btn btn-outline w-full">
                Get Started
              </Link>
            </div>
            
            <div className="subscription-card popular">
              <div className="badge badge-primary mb-2">Most Popular</div>
              <div className="subscription-name">Basic</div>
              <div className="subscription-price">$9.99</div>
              <div className="subscription-period">per month</div>
              
              <ul className="subscription-features">
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Up to 20 whiteboards</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Advanced drawing tools</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Up to 20 collaborators per board</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Export as PNG, JPG, PDF</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Save whiteboard history</span>
                </li>
              </ul>
              
              <Link to="/register" className="btn w-full">
                Get Started
              </Link>
            </div>
            
            <div className="subscription-card">
              <div className="subscription-name">Pro</div>
              <div className="subscription-price">$19.99</div>
              <div className="subscription-period">per month</div>
              
              <ul className="subscription-features">
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Unlimited whiteboards</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>All drawing tools</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Unlimited collaborators</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Export in all formats</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Advanced whiteboard history</span>
                </li>
                <li className="subscription-feature">
                  <span className="feature-icon">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link to="/register" className="btn btn-outline w-full">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-light text-center">
        <div className="container">
          <h2 className="text-2xl font-bold mb-4">Ready to Collaborate?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of teams, educators, and creatives who use our
            collaborative whiteboard to bring their ideas to life.
          </p>
          
          <Link to="/register" className="btn">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
