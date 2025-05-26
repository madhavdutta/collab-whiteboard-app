import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaChalkboard } from 'react-icons/fa';
import RoomCard from '../components/RoomCard';
import CreateRoomModal from '../components/CreateRoomModal';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/rooms`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        
        const data = await response.json();
        setRooms(data.rooms || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, [token]);
  
  // Create room
  const handleCreateRoom = async (roomData) => {
    try {
      const response = await fetch(`${apiUrl}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roomData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
      
      const data = await response.json();
      
      // Add new room to state
      setRooms([data.room, ...rooms]);
      
      // Close modal
      setShowCreateModal(false);
      
      // Navigate to new room
      navigate(`/whiteboard/${data.room.roomId}`);
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Update room
  const handleUpdateRoom = async (roomData) => {
    try {
      const response = await fetch(`${apiUrl}/api/rooms/${editingRoom.roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roomData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update room');
      }
      
      const data = await response.json();
      
      // Update room in state
      setRooms(rooms.map(room => 
        room.id === editingRoom.id ? { ...room, ...data.room } : room
      ));
      
      // Reset editing state
      setEditingRoom(null);
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Delete room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }
    
    try {
      const roomToDelete = rooms.find(room => room.id === roomId);
      
      const response = await fetch(`${apiUrl}/api/rooms/${roomToDelete.roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete room');
      }
      
      // Remove room from state
      setRooms(rooms.filter(room => room.id !== roomId));
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Handle room edit
  const handleEditRoom = (room) => {
    setEditingRoom(room);
  };
  
  // Handle modal submit
  const handleModalSubmit = (roomData) => {
    if (editingRoom) {
      handleUpdateRoom(roomData);
    } else {
      handleCreateRoom(roomData);
    }
  };
  
  // Close modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingRoom(null);
  };
  
  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Whiteboards</h1>
        <button
          className="btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="mr-2" /> New Whiteboard
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="text-xl">Loading your whiteboards...</div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaChalkboard />
          </div>
          <h2 className="empty-state-title">No Whiteboards Yet</h2>
          <p className="empty-state-description">
            Create your first whiteboard to start collaborating with others.
          </p>
          <button
            className="btn"
            onClick={() => setShowCreateModal(true)}
          >
            Create Whiteboard
          </button>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onDelete={handleDeleteRoom}
              onEdit={handleEditRoom}
            />
          ))}
        </div>
      )}
      
      <CreateRoomModal
        isOpen={showCreateModal || !!editingRoom}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialData={editingRoom}
      />
    </div>
  );
};

export default Dashboard;
