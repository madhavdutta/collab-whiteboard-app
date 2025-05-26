import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  
  const { user } = useAuth();
  
  // Fetch whiteboards from localStorage
  useEffect(() => {
    try {
      const storedWhiteboards = localStorage.getItem('whiteboards');
      if (storedWhiteboards) {
        const parsedWhiteboards = JSON.parse(storedWhiteboards);
        // Filter whiteboards for current user
        const userWhiteboards = parsedWhiteboards.filter(
          (board) => board.userId === user.id
        );
        setWhiteboards(userWhiteboards);
      } else {
        setWhiteboards([]);
      }
    } catch (error) {
      setError('Failed to load whiteboards');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Create new whiteboard
  const handleCreateWhiteboard = (e) => {
    e.preventDefault();
    
    if (!newBoardName.trim()) {
      return;
    }
    
    try {
      const newWhiteboard = {
        id: uuidv4(),
        name: newBoardName,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collaborators: []
      };
      
      // Add to state
      setWhiteboards((prev) => [...prev, newWhiteboard]);
      
      // Save to localStorage
      const storedWhiteboards = localStorage.getItem('whiteboards');
      const parsedWhiteboards = storedWhiteboards ? JSON.parse(storedWhiteboards) : [];
      localStorage.setItem(
        'whiteboards',
        JSON.stringify([...parsedWhiteboards, newWhiteboard])
      );
      
      // Reset form
      setNewBoardName('');
      setShowCreateModal(false);
    } catch (error) {
      setError('Failed to create whiteboard');
      console.error(error);
    }
  };
  
  // Delete whiteboard
  const handleDeleteWhiteboard = (id) => {
    try {
      // Remove from state
      setWhiteboards((prev) => prev.filter((board) => board.id !== id));
      
      // Remove from localStorage
      const storedWhiteboards = localStorage.getItem('whiteboards');
      if (storedWhiteboards) {
        const parsedWhiteboards = JSON.parse(storedWhiteboards);
        localStorage.setItem(
          'whiteboards',
          JSON.stringify(parsedWhiteboards.filter((board) => board.id !== id))
        );
      }
    } catch (error) {
      setError('Failed to delete whiteboard');
      console.error(error);
    }
  };
  
  if (loading) {
    return (
      <div className="loading">
        Loading whiteboards...
      </div>
    );
  }
  
  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Whiteboards</h1>
          <button
            className="btn"
            onClick={() => setShowCreateModal(true)}
          >
            Create New Whiteboard
          </button>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        {whiteboards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No Whiteboards Yet</h2>
            <p>Create your first whiteboard to get started!</p>
            <button
              className="btn"
              onClick={() => setShowCreateModal(true)}
            >
              Create Whiteboard
            </button>
          </div>
        ) : (
          <div className="whiteboards-grid">
            {whiteboards.map((board) => (
              <div key={board.id} className="whiteboard-card">
                <div className="whiteboard-card-header">
                  <h3 className="whiteboard-name">{board.name}</h3>
                  <div className="whiteboard-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteWhiteboard(board.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="whiteboard-card-body">
                  <div className="whiteboard-preview">
                    <div className="preview-placeholder">
                      Preview not available
                    </div>
                  </div>
                  <div className="whiteboard-meta">
                    <div className="whiteboard-date">
                      Created: {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                    <div className="whiteboard-collaborators">
                      Collaborators: {board.collaborators.length}
                    </div>
                  </div>
                </div>
                <div className="whiteboard-card-footer">
                  <Link
                    to={`/whiteboard/${board.id}`}
                    className="btn btn-block"
                  >
                    Open Whiteboard
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Create Whiteboard Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create New Whiteboard</h2>
                <button
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreateWhiteboard}>
                <div className="form-group">
                  <label htmlFor="board-name">Whiteboard Name</label>
                  <input
                    type="text"
                    id="board-name"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .dashboard {
          padding: 2rem 0;
        }
        
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        
        .dashboard-title {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .whiteboards-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }
        
        @media (min-width: 640px) {
          .whiteboards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .whiteboards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .whiteboard-card {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
        }
        
        .whiteboard-card-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
        }
        
        .whiteboard-name {
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .whiteboard-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }
        
        .whiteboard-card-body {
          padding: 1rem;
        }
        
        .whiteboard-preview {
          height: 120px;
          background-color: var(--light-color);
          border-radius: var(--border-radius);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .preview-placeholder {
          color: var(--gray-color);
          font-size: 0.875rem;
        }
        
        .whiteboard-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--gray-color);
        }
        
        .whiteboard-card-footer {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
        }
        
        .btn-block {
          display: block;
          width: 100%;
          text-align: center;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal {
          background-color: white;
          border-radius: var(--border-radius);
          width: 100%;
          max-width: 500px;
          box-shadow: var(--box-shadow);
        }
        
        .modal-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .modal form {
          padding: 1rem;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
