import { useState, useEffect } from 'react';
import { 
  FaPen, 
  FaEraser, 
  FaFont, 
  FaShapes, 
  FaImage, 
  FaTrash, 
  FaUndo, 
  FaRedo,
  FaDownload,
  FaShareAlt,
  FaLayerGroup,
  FaEye,
  FaLock,
  FaTable
} from 'react-icons/fa';
import { useStore } from '../store';

const Toolbar = ({ socket, roomId, usersCount }) => {
  const { tool, setTool, color, setColor, lineWidth, setLineWidth } = useStore();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLineWidthPicker, setShowLineWidthPicker] = useState(false);
  
  // Predefined colors
  const colors = [
    '#000000', // Black
    '#ffffff', // White
    '#4f46e5', // Indigo
    '#0ea5e9', // Sky
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
  ];
  
  // Handle tool change
  const handleToolChange = (newTool) => {
    setTool(newTool);
    
    // Emit tool change to server
    if (socket) {
      socket.emit('toolChange', { tool: newTool });
    }
  };
  
  // Handle color change
  const handleColorChange = (newColor) => {
    setColor(newColor);
    setShowColorPicker(false);
    
    // Emit color change to server
    if (socket) {
      socket.emit('colorChange', { color: newColor });
    }
  };
  
  // Handle custom color change
  const handleCustomColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    
    // Emit color change to server
    if (socket) {
      socket.emit('colorChange', { color: newColor });
    }
  };
  
  // Handle line width change
  const handleLineWidthChange = (newWidth) => {
    setLineWidth(newWidth);
    setShowLineWidthPicker(false);
    
    // Emit line width change to server
    if (socket) {
      socket.emit('lineWidthChange', { lineWidth: newWidth });
    }
  };
  
  // Handle clear canvas
  const handleClearCanvas = () => {
    // Confirm before clearing
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      // Emit clear canvas event to server
      if (socket) {
        socket.emit('clear');
      }
    }
  };
  
  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowColorPicker(false);
      setShowLineWidthPicker(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Prevent closing pickers when clicking inside
  const handlePickerClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <div className="toolbar">
      <div className="toolbar-section tools">
        <button
          className={`toolbar-btn ${tool === 'pen' ? 'active' : ''}`}
          onClick={() => handleToolChange('pen')}
          title="Pen"
        >
          <FaPen />
        </button>
        <button
          className={`toolbar-btn ${tool === 'eraser' ? 'active' : ''}`}
          onClick={() => handleToolChange('eraser')}
          title="Eraser"
        >
          <FaEraser />
        </button>
        <button
          className={`toolbar-btn ${tool === 'text' ? 'active' : ''}`}
          onClick={() => handleToolChange('text')}
          title="Text"
        >
          <FaFont />
        </button>
        <button
          className={`toolbar-btn ${tool === 'shapes' ? 'active' : ''}`}
          onClick={() => handleToolChange('shapes')}
          title="Shapes"
        >
          <FaShapes />
        </button>
        <button
          className={`toolbar-btn ${tool === 'image' ? 'active' : ''}`}
          onClick={() => handleToolChange('image')}
          title="Insert Image"
        >
          <FaImage />
        </button>
      </div>
      
      <div className="toolbar-section properties">
        <div className="color-picker-container">
          <button
            className="toolbar-btn color-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
              setShowLineWidthPicker(false);
            }}
            style={{ backgroundColor: color }}
            title="Color"
          >
            <span className="sr-only">Select Color</span>
          </button>
          
          {showColorPicker && (
            <div className="picker-dropdown" onClick={handlePickerClick}>
              <div className="color-grid">
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`color-option ${c === color ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => handleColorChange(c)}
                  />
                ))}
              </div>
              <div className="custom-color">
                <input
                  type="color"
                  value={color}
                  onChange={handleCustomColorChange}
                  title="Custom Color"
                />
                <span>Custom</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="line-width-container">
          <button
            className="toolbar-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowLineWidthPicker(!showLineWidthPicker);
              setShowColorPicker(false);
            }}
            title="Line Width"
          >
            <div className="line-width-preview" style={{ height: `${lineWidth}px` }}></div>
          </button>
          
          {showLineWidthPicker && (
            <div className="picker-dropdown width-dropdown" onClick={handlePickerClick}>
              <div className="width-options">
                {[1, 2, 3, 5, 8, 12].map((width) => (
                  <button
                    key={width}
                    className={`width-option ${width === lineWidth ? 'active' : ''}`}
                    onClick={() => handleLineWidthChange(width)}
                  >
                    <div className="width-preview" style={{ height: `${width}px` }}></div>
                    <span>{width}px</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="toolbar-section actions">
        <button
          className="toolbar-btn"
          onClick={handleClearCanvas}
          title="Clear Canvas"
        >
          <FaTrash />
        </button>
        <button
          className="toolbar-btn"
          title="Share"
        >
          <FaShareAlt />
        </button>
        <button
          className="toolbar-btn"
          title="Layers"
        >
          <FaLayerGroup />
        </button>
      </div>
      
      <div className="toolbar-section view">
        <button
          className="toolbar-btn"
          title="Toggle Grid"
        >
          <FaTable />
        </button>
        <button
          className="toolbar-btn"
          title="Preview Mode"
        >
          <FaEye />
        </button>
        <button
          className="toolbar-btn"
          title="Lock Canvas"
        >
          <FaLock />
        </button>
      </div>
      
      <div className="toolbar-section room-info">
        <div className="room-id">
          <span className="room-label">Room:</span>
          <span className="room-value">{roomId}</span>
        </div>
        <div className="users-count">
          <span className="users-dot"></span>
          <span>{usersCount} online</span>
        </div>
      </div>
      
      <style jsx>{`
        .toolbar {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          background-color: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 100;
        }
        
        .toolbar-section {
          display: flex;
          align-items: center;
          margin-right: 24px;
          position: relative;
        }
        
        .toolbar-section:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -12px;
          top: 50%;
          transform: translateY(-50%);
          height: 24px;
          width: 1px;
          background-color: #e2e8f0;
        }
        
        .toolbar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          color: #64748b;
          margin-right: 4px;
          transition: all 0.2s;
        }
        
        .toolbar-btn:hover {
          background-color: #f1f5f9;
          color: #1e293b;
        }
        
        .toolbar-btn.active {
          background-color: #4f46e5;
          color: white;
        }
        
        .color-btn {
          border: 2px solid #e2e8f0;
          overflow: hidden;
        }
        
        .color-picker-container, .line-width-container {
          position: relative;
        }
        
        .picker-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          padding: 12px;
          z-index: 10;
          min-width: 200px;
        }
        
        .color-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .color-option {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .color-option:hover {
          transform: scale(1.1);
        }
        
        .color-option.active {
          border-color: #1e293b;
          transform: scale(1.1);
        }
        
        .custom-color {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .custom-color input {
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .custom-color span {
          font-size: 12px;
          color: #64748b;
        }
        
        .line-width-preview {
          width: 20px;
          background-color: currentColor;
          border-radius: 4px;
        }
        
        .width-dropdown {
          min-width: 120px;
        }
        
        .width-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .width-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border: none;
          background: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .width-option:hover {
          background-color: #f1f5f9;
        }
        
        .width-option.active {
          background-color: #f1f5f9;
          font-weight: 500;
        }
        
        .width-preview {
          width: 20px;
          background-color: currentColor;
          border-radius: 4px;
        }
        
        .width-option span {
          font-size: 12px;
          color: #64748b;
        }
        
        .room-info {
          margin-left: auto;
          margin-right: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .room-id {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 2px;
        }
        
        .room-label {
          font-weight: 500;
        }
        
        .room-value {
          background-color: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .users-count {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;
        }
        
        .users-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        
        @media (max-width: 768px) {
          .toolbar {
            flex-wrap: wrap;
            gap: 8px;
            padding: 8px;
          }
          
          .toolbar-section {
            margin-right: 12px;
          }
          
          .toolbar-section:not(:last-child)::after {
            display: none;
          }
          
          .toolbar-btn {
            width: 36px;
            height: 36px;
          }
          
          .view, .room-info {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Toolbar;
