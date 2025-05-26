import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';
import Whiteboard from '../components/Whiteboard';
import Toolbar from '../components/Toolbar';

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
        const response = await fetch(`${apiUrl}/api/rooms/${roomId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Room not found');
          } else if (response.status === 403) {
            throw new Error('You do not have access to this room');
          } else {
            throw new Error('Failed to fetch room');
          }
        }
        
        const data = await response.json();
        setRoom(data.room);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoom();
  }, [roomId, token]);
  
  // Connect to socket
  useEffect(() => {
    if (!room) return;
    
    // Get user ID from auth or generate one
    const userId = user?.id || localStorage.getItem('userId') || uuidv4();
    
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId);
    }
    
    // Connect to socket
    const newSocket = io(apiUrl, {
      transports: ['websocket'],
      query: {
        roomId,
        userId,
        userName: user?.name || localStorage.getItem('userName') || 'Anonymous',
        token
      }
    });
    
    setSocket(newSocket);
    
    // Listen for users update
    newSocket.on('users', (connectedUsers) => {
      setUsers(connectedUsers);
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, [room, roomId, user, token]);
  
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
    </div>
  );
};

export default WhiteboardPage;
