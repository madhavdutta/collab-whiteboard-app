import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useStore } from '../store';
import { FaPen, FaEraser, FaTrash, FaSave, FaShare, FaUsers } from 'react-icons/fa';

const Toolbar = ({ socket, roomId, usersCount }) => {
  const { tool, setTool, color, setColor, lineWidth, setLineWidth } = useStore();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  const handleToolChange = (newTool) => {
    setTool(newTool);
  };
  
  const handleColorChange = (newColor) => {
    setColor(newColor);
  };
  
  const handleLineWidthChange = (e) => {
    setLineWidth(parseInt(e.target.value));
  };
  
  const handleClearCanvas = () => {
    if (socket && window.confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
      socket.emit('clear-canvas');
      
      // Clear local canvas
      const canvas = document.querySelector('.whiteboard');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };
  
  const handleSaveCanvas = () => {
    const canvas = document.querySelector('.whiteboard');
    
    // Create a temporary link
    const link = document.createElement('a');
    link.download = `whiteboard-${roomId}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    // Save to server if socket exists
    if (socket) {
      socket.emit('save-whiteboard', {
        roomId,
        imageData: canvas.toDataURL('image/png')
      });
    }
  };
  
  const toggleShareModal = () => {
    setShareModalOpen(!shareModalOpen);
  };
  
  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/whiteboard/${roomId}`;
    navigator.clipboard.writeText(roomLink);
    alert('Room link copied to clipboard!');
  };
  
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <button
          className={`tool-button ${tool === 'pen' ? 'active' : ''}`}
          onClick={() => handleToolChange('pen')}
          title="Pen"
        >
          <FaPen />
        </button>
        <button
          className={`tool-button ${tool === 'eraser' ? 'active' : ''}`}
          onClick={() => handleToolChange('eraser')}
          title="Eraser"
        >
          <FaEraser />
        </button>
      </div>
      
      <div className="toolbar-divider"></div>
      
      <div className="toolbar-section">
        <div className="color-picker-wrapper">
          <div
            className="color-picker-trigger"
            style={{ backgroundColor: color }}
            onClick={() => setColorPickerOpen(!colorPickerOpen)}
          ></div>
          
          {colorPickerOpen && (
            <div className="color-picker-popover">
              <HexColorPicker color={color} onChange={handleColorChange} />
            </div>
          )}
        </div>
        
        <div>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={handleLineWidthChange}
            className="line-width-slider"
          />
          <span>{lineWidth}px</span>
        </div>
      </div>
      
      <div className="toolbar-divider"></div>
      
      <div className="toolbar-section">
        <button
          className="tool-button"
          onClick={handleClearCanvas}
          title="Clear Canvas"
        >
          <FaTrash />
        </button>
        <button
          className="tool-button"
          onClick={handleSaveCanvas}
          title="Save Canvas"
        >
          <FaSave />
        </button>
        <button
          className="tool-button"
          onClick={toggleShareModal}
          title="Share"
        >
          <FaShare />
        </button>
      </div>
      
      <div className="toolbar-divider"></div>
      
      <div className="toolbar-section">
        <div className="flex items-center gap-2">
          <FaUsers />
          <span>{usersCount} online</span>
        </div>
        <div>
          Room: <strong>{roomId}</strong>
        </div>
      </div>
      
      {shareModalOpen && (
        <div className="modal-overlay" onClick={toggleShareModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Share Whiteboard</h2>
              <button className="modal-close" onClick={toggleShareModal}>×</button>
            </div>
            <div className="modal-body">
              <p className="mb-4">Share this link with others to collaborate:</p>
              <div className="flex">
                <input
                  type="text"
                  value={`${window.location.origin}/whiteboard/${roomId}`}
                  readOnly
                  className="w-full"
                />
                <button className="btn" onClick={copyRoomLink}>Copy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
