import { useState } from 'react';

const WelcomeModal = ({ onJoinRoom, onCreateRoom, initialName = '' }) => {
  const [name, setName] = useState(initialName);
  const [roomId, setRoomId] = useState('');
  const [activeTab, setActiveTab] = useState('join');
  
  const handleJoinRoom = (e) => {
    e.preventDefault();
    onJoinRoom(roomId, name);
  };
  
  const handleCreateRoom = (e) => {
    e.preventDefault();
    onCreateRoom(name);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Welcome to Collaborative Whiteboard</h2>
        </div>
        
        <div className="modal-body">
          <div className="flex mb-4">
            <button
              className={`btn ${activeTab === 'join' ? '' : 'btn-outline'} w-full`}
              onClick={() => setActiveTab('join')}
            >
              Join Room
            </button>
            <button
              className={`btn ${activeTab === 'create' ? '' : 'btn-outline'} w-full`}
              onClick={() => setActiveTab('create')}
            >
              Create Room
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="user-name">Your Name</label>
            <input
              type="text"
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          {activeTab === 'join' ? (
            <form onSubmit={handleJoinRoom}>
              <div className="form-group">
                <label htmlFor="room-id">Room ID</label>
                <input
                  type="text"
                  id="room-id"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn w-full"
                disabled={!name || !roomId}
              >
                Join Room
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateRoom}>
              <p className="mb-4">
                Create a new room and share the room ID with others to collaborate.
              </p>
              
              <button
                type="submit"
                className="btn w-full"
                disabled={!name}
              >
                Create New Room
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
