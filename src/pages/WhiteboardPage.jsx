import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { io } from 'socket.io-client';
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
    const userName = user?.name || localStorage.getItem('userName') || 'Guest';
    
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId);
    }
    
    if (!localStorage.getItem('userName') && !user?.name) {
      localStorage.setItem('userName', userName);
    }
    
    // Connect to Socket.io server
    const socketInstance = io(apiUrl, {
      query: {
        roomId,
        userId,
        userName,
        token: token || ''
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    // Socket event handlers
    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
    });
    
    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to the server. Please try again later.');
    });
    
    socketInstance.on('users', (roomUsers) => {
      setUsers(roomUsers);
    });
    
    socketInstance.on('user-disconnected', (disconnectedUserId) => {
      console.log(`User disconnected: ${disconnectedUserId}`);
    });
    
    setSocket(socketInstance);
    
    return () => {
      // Clean up socket connection
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [room, user, token, roomId, apiUrl]);
  
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
