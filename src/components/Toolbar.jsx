import { useState } from 'react';
import { FaPen, FaEraser, FaShareAlt } from 'react-icons/fa';
import { useStore } from '../store';

const Toolbar = ({ socket, roomId, usersCount }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  
  const { tool, setTool, color, setColor, lineWidth, setLineWidth } = useStore();
  
  const handleToolChange = (newTool) => {
    setTool(newTool);
    
    // Emit tool change to server
    if (socket) {
      socket.emit('toolChange', { tool: newTool });
    }
  };
  
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    
    // Emit color change to server
    if (socket) {
      socket.emit('colorChange', { color: newColor });
    }
  };
  
  const handleLineWidthChange = (e) => {
    const newLineWidth = parseInt(e.target.value);
    setLineWidth(newLineWidth);
    
    // Emit line width change to server
    if (socket) {
      socket.emit('lineWidthChange', { lineWidth: newLineWidth });
    }
  };
  
  const handleShare = () => {
    setShowShareModal(true);
  };
  
  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/whiteboard/${roomId}`;
    navigator.clipboard.writeText(roomLink);
    
    // Show copied notification
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Link';
      }, 2000);
    }
  };
  
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="logo">
          <span className="logo-text">Whiteboard</span>
        </div>
        
        <div className="room-info">
          <span className="room-id">Room: {roomId}</span>
          <span className="users-count">{usersCount} {usersCount === 1 ? 'user' : 'users'}</span>
        </div>
      </div>
      
      <div className="toolbar-center">
        <div className="tools">
          <button
            className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => handleToolChange('pen')}
            title="Pen"
          >
            <FaPen />
          </button>
          <button
            className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => handleToolChange('eraser')}
            title="Eraser"
          >
            <FaEraser />
          </button>
        </div>
        
        <div className="color-picker">
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="color-input"
            title="Select Color"
            disabled={tool === 'eraser'}
          />
          <div
            className="color-preview"
            style={{ backgroundColor: color }}
          ></div>
        </div>
        
        <div className="line-width">
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={handleLineWidthChange}
            className="line-width-input"
            title="Line Width"
          />
          <div
            className="line-width-preview"
            style={{
              width: `${lineWidth * 2}px`,
              height: `${lineWidth * 2}px`,
              backgroundColor: tool === 'eraser' ? '#e2e8f0' : color
            }}
          ></div>
        </div>
      </div>
      
      <div className="toolbar-right">
        <button
          className="share-btn"
          onClick={handleShare}
          title="Share"
        >
          <FaShareAlt />
          <span>Share</span>
        </button>
      </div>
      
      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Share Whiteboard</h3>
              <button
                className="close-btn"
                onClick={() => setShowShareModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Share this link with others to collaborate:</p>
              <div className="share-link">
                <input
                  type="text"
                  value={`${window.location.origin}/whiteboard/${roomId}`}
                  readOnly
                  className="link-input"
                />
                <button
                  id="copy-btn"
                  className="copy-btn"
                  onClick={copyRoomLink}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background-color: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          z-index: 100;
        }
        
        .toolbar-left {
          display: flex;
          align-items: center;
        }
        
        .logo {
          margin-right: 24px;
        }
        
        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: #4f46e5;
        }
        
        .room-info {
          display: flex;
          flex-direction: column;
        }
        
        .room-id {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .users-count {
          font-size: 12px;
          color: #64748b;
        }
        
        .toolbar-center {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .tools {
          display: flex;
          gap: 8px;
        }
        
        .tool-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: white;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .tool-btn:hover {
          background-color: #f8fafc;
          color: #1e293b;
        }
        
        .tool-btn.active {
          background-color: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }
        
        .color-picker {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .color-input {
          position: absolute;
          width: 40px;
          height: 40px;
          opacity: 0;
          cursor: pointer;
        }
        
        .color-preview {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          pointer-events: none;
        }
        
        .line-width {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .line-width-input {
          width: 100px;
          cursor: pointer;
        }
        
        .line-width-preview {
          border-radius: 50%;
        }
        
        .toolbar-right {
          display: flex;
          align-items: center;
        }
        
        .share-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background-color: #4f46e5;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .share-btn:hover {
          background-color: #4338ca;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal {
          width: 90%;
          max-width: 500px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .modal-body p {
          margin-top: 0;
          margin-bottom: 16px;
          color: #64748b;
        }
        
        .share-link {
          display: flex;
          gap: 8px;
        }
        
        .link-input {
          flex: 1;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          color: #1e293b;
          background-color: #f8fafc;
        }
        
        .copy-btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          background-color: #4f46e5;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .copy-btn:hover {
          background-color: #4338ca;
        }
        
        @media (max-width: 768px) {
          .toolbar {
            flex-direction: column;
            gap: 16px;
            padding: 12px;
          }
          
          .toolbar-left,
          .toolbar-center,
          .toolbar-right {
            width: 100%;
          }
          
          .toolbar-left {
            justify-content: space-between;
          }
          
          .toolbar-center {
            justify-content: center;
          }
          
          .toolbar-right {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Toolbar;
