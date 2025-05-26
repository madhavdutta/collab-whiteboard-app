import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';
import Whiteboard from '../components/Whiteboard';
import Toolbar from '../components/Toolbar';
import { useStore } from '../store';

const WhiteboardPage = () => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { roomId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        // For demo purposes, simulate a successful room fetch
        setRoom({ id: roomId, name: `Room ${roomId}` });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchRoom();
  }, [roomId]);
  
  // Connect to socket
  useEffect(() => {
    if (!room) return;
    
    // Get user ID from auth or generate one
    const userId = user?.id || localStorage.getItem('userId') || uuidv4();
    
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId);
    }
    
    // Create a mock socket for demo purposes
    const mockSocket = {
      emit: (event, data) => {
        console.log(`Emitting ${event}:`, data);
        
        // Handle different events
        if (event === 'toolChange') {
          mockSocket.listeners.toolChange && mockSocket.listeners.toolChange(data);
        } else if (event === 'colorChange') {
          mockSocket.listeners.colorChange && mockSocket.listeners.colorChange(data);
        } else if (event === 'lineWidthChange') {
          mockSocket.listeners.lineWidthChange && mockSocket.listeners.lineWidthChange(data);
        } else if (event === 'draw') {
          mockSocket.listeners.draw && mockSocket.listeners.draw(data);
        } else if (event === 'clear') {
          mockSocket.listeners.clear && mockSocket.listeners.clear();
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
      },
      listeners: {}
    };
    
    setSocket(mockSocket);
    
    // Simulate connected users
    setUsers([
      { id: userId, name: user?.name || 'You' },
      { id: 'user2', name: 'Jane Doe' },
      { id: 'user3', name: 'John Smith' }
    ]);
    
    return () => {
      // Clean up
      mockSocket.listeners = {};
    };
  }, [room, user]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Loading Whiteboard...</div>
          <p className="text-gray">Please wait while we set things up for you.</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Error</div>
          <p className="text-danger mb-4">{error}</p>
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
    <div className="app">
      <Toolbar
        socket={socket}
        roomId={roomId}
        usersCount={users.length}
      />
      
      <Whiteboard
        socket={socket}
        users={users}
      />
      
      <style jsx>{`
        .app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default WhiteboardPage;
