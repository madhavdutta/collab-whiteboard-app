import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaCheck, FaTimes, FaCrown } from 'react-icons/fa';

const Subscription = () => {
  const { user, updateSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        { text: 'Up to 3 whiteboards', included: true },
        { text: 'Basic drawing tools', included: true },
        { text: 'Up to 5 collaborators per board', included: true },
        { text: 'Export as PNG', included: true },
        { text: 'Save whiteboard history', included: false },
        { text: 'Advanced drawing tools', included: false },
        { text: 'Priority support', included: false }
      ],
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      period: 'per month',
      features: [
        { text: 'Up to 20 whiteboards', included: true },
        { text: 'Advanced drawing tools', included: true },
        { text: 'Up to 20 collaborators per board', included: true },
        { text: 'Export as PNG, JPG, PDF', included: true },
        { text: 'Save whiteboard history', included: true },
        { text: 'Templates library', included: false },
        { text: 'Priority support', included: false }
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      features: [
        { text: 'Unlimited whiteboards', included: true },
        { text: 'All drawing tools', included: true },
        { text: 'Unlimited collaborators', included: true },
        { text: 'Export in all formats', included: true },
        { text: 'Advanced whiteboard history', included: true },
        { text: 'Templates library', included: true },
        { text: 'Priority support', included: true }
      ],
      popular: false
    }
  ];
  
  const handleSubscriptionChange = async (planId) => {
    if (planId === user.subscription) {
      return;
    }
    
    if (!window.confirm(`Are you sure you want to switch to the ${planId} plan?`)) {
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      await updateSubscription(planId);
      
      setSuccess(`Successfully switched to the ${planId} plan`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Subscription Plans</h1>
      
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`subscription-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && (
              <div className="badge badge-primary mb-2">
                <FaCrown className="mr-1" /> Most Popular
              </div>
            )}
            
            <div className="subscription-name">{plan.name}</div>
            <div className="subscription-price">{plan.price}</div>
            <div className="subscription-period">{plan.period}</div>
            
            <ul className="subscription-features">
              {plan.features.map((feature, index) => (
                <li key={index} className="subscription-feature">
                  <span className="feature-icon">
                    {feature.included ? (
                      <FaCheck className="text-success" />
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </span>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            
            <button
              className={`w-full ${
                user?.subscription === plan.id
                  ? 'btn-secondary'
                  : 'btn'
              }`}
              onClick={() => handleSubscriptionChange(plan.id)}
              disabled={loading || user?.subscription === plan.id}
            >
              {user?.subscription === plan.id
                ? 'Current Plan'
                : loading
                ? 'Updating...'
                : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Subscription FAQs</h2>
        
        <div className="card mb-4">
          <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
          <p>
            Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
          </p>
        </div>
        
        <div className="card mb-4">
          <h3 className="font-semibold mb-2">How do I cancel my subscription?</h3>
          <p>
            You can downgrade to the free plan at any time. If you wish to completely delete your account,
            please contact our support team.
          </p>
        </div>
        
        <div className="card mb-4">
          <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
          <p>
            We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service,
            contact our support team within 14 days of your purchase for a full refund.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
