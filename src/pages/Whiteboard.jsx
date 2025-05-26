import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WhiteboardComponent from '../components/Whiteboard';
import Toolbar from '../components/Toolbar';

const Whiteboard = () => {
  const [whiteboard, setWhiteboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch whiteboard data from localStorage
  useEffect(() => {
    try {
      const storedWhiteboards = localStorage.getItem('whiteboards');
      if (storedWhiteboards) {
        const parsedWhiteboards = JSON.parse(storedWhiteboards);
        const foundWhiteboard = parsedWhiteboards.find((board) => board.id === id);
        
        if (foundWhiteboard) {
          setWhiteboard(foundWhiteboard);
          
          // Check if user has access
          if (foundWhiteboard.userId !== user.id && !foundWhiteboard.collaborators.includes(user.id)) {
            setError('You do not have access to this whiteboard');
          }
        } else {
          setError('Whiteboard not found');
        }
      } else {
        setError('Whiteboard not found');
      }
    } catch (error) {
      setError('Failed to load whiteboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, user]);
  
  // Simulate connected users
  useEffect(() => {
    if (whiteboard) {
      // Create a list of simulated users
      const simulatedUsers = [
        { id: user.id, name: user.name },
        { id: 'user2', name: 'Jane Doe' },
        { id: 'user3', name: 'John Smith' },
        { id: 'user4', name: 'Alex Johnson' }
      ];
      
      setUsers(simulatedUsers);
    }
  }, [whiteboard, user]);
  
  // Simulate socket connection
  useEffect(() => {
    if (whiteboard) {
      // Create a mock socket object
      const mockSocket = {
        emit: (event, data) => {
          console.log(`Emitting ${event}:`, data);
          // Simulate broadcasting to other users
          if (event === 'draw') {
            setTimeout(() => {
              mockSocket.listeners.draw && mockSocket.listeners.draw(data);
            }, 10);
          }
        },
        on: (event, callback) => {
          if (!mockSocket.listeners) {
            mockSocket.listeners = {};
          }
          mockSocket.listeners[event] = callback;
        },
        off: (event) => {
          if (mockSocket.listeners) {
            delete mockSocket.listeners[event];
          }
        }
      };
      
      setSocket(mockSocket);
      
      return () => {
        // Clean up
        mockSocket.listeners = {};
      };
    }
  }, [whiteboard]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading whiteboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button
            className="btn"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="whiteboard-page">
      <Toolbar
        socket={socket}
        roomId={id}
        usersCount={users.length}
      />
      
      <WhiteboardComponent
        socket={socket}
        users={users}
      />
      
      <style jsx>{`
        .whiteboard-page {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 64px); /* Subtract navbar height */
          background-color: #f8fafc;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 64px);
          background-color: #f8fafc;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(79, 70, 229, 0.2);
          border-radius: 50%;
          border-top-color: #4f46e5;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .loading-container p {
          color: #64748b;
          font-size: 16px;
        }
        
        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 64px);
          background-color: #f8fafc;
          padding: 2rem;
        }
        
        .error-message {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          text-align: center;
          max-width: 500px;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .error-message h2 {
          color: #ef4444;
          margin-bottom: 1rem;
          font-size: 24px;
        }
        
        .error-message p {
          margin-bottom: 1.5rem;
          color: #64748b;
        }
        
        .error-message .btn {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .error-message .btn:hover {
          background-color: #4338ca;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default Whiteboard;
