import { useEffect, useRef, useState } from 'react';
import { FaUndo, FaRedo, FaDownload } from 'react-icons/fa';
import { useStore } from '../store';

const Whiteboard = ({ socket, users }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Get tool settings from store
  const { tool, color, lineWidth } = useStore();
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveCanvasState();
    
    // Handle window resize
    const handleResize = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.putImageData(imageData, 0, 0);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update canvas when tool, color, or lineWidth changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (tool === 'eraser') {
      ctx.strokeStyle = 'white';
    } else {
      ctx.strokeStyle = color;
    }
    
    ctx.lineWidth = lineWidth;
  }, [tool, color, lineWidth]);
  
  // Handle socket events
  useEffect(() => {
    if (!socket) return;
    
    // Listen for drawing events from other users
    socket.on('draw', (data) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      ctx.beginPath();
      ctx.moveTo(data.prevX, data.prevY);
      ctx.lineTo(data.currX, data.currY);
      ctx.strokeStyle = data.tool === 'eraser' ? 'white' : data.color;
      ctx.lineWidth = data.lineWidth;
      ctx.stroke();
      ctx.closePath();
    });
    
    // Listen for clear canvas event
    socket.on('clear', () => {
      clearCanvas();
    });
    
    return () => {
      socket.off('draw');
      socket.off('clear');
    };
  }, [socket]);
  
  // Save canvas state for undo/redo
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Save current state to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  // Handle drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Store the last position
    canvas.lastX = x;
    canvas.lastY = y;
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(canvas.lastX, canvas.lastY);
    ctx.lineTo(x, y);
    
    // Set stroke style based on tool
    if (tool === 'eraser') {
      ctx.strokeStyle = 'white';
    } else {
      ctx.strokeStyle = color;
    }
    
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
    
    // Emit drawing event to server
    if (socket) {
      socket.emit('draw', {
        prevX: canvas.lastX,
        prevY: canvas.lastY,
        currX: x,
        currY: y,
        color,
        lineWidth,
        tool
      });
    }
    
    // Update last position
    canvas.lastX = x;
    canvas.lastY = y;
  };
  
  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveCanvasState();
    }
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save cleared state
    saveCanvasState();
    
    // Emit clear event to server
    if (socket) {
      socket.emit('clear');
    }
  };
  
  const undo = () => {
    if (historyIndex <= 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const newIndex = historyIndex - 1;
    
    // Load previous state
    const img = new Image();
    img.src = history[newIndex];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryIndex(newIndex);
    };
    
    // Emit undo event to server
    if (socket) {
      socket.emit('undo');
    }
  };
  
  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const newIndex = historyIndex + 1;
    
    // Load next state
    const img = new Image();
    img.src = history[newIndex];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryIndex(newIndex);
    };
    
    // Emit redo event to server
    if (socket) {
      socket.emit('redo');
    }
  };
  
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'whiteboard.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrawing(mouseEvent);
  };
  
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    draw(mouseEvent);
  };
  
  const handleTouchEnd = () => {
    stopDrawing();
  };
  
  return (
    <div className="whiteboard">
      <div className="whiteboard-container">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="whiteboard-canvas"
        />
        
        <div className="whiteboard-controls">
          <div className="control-group">
            <button
              className="control-btn"
              onClick={undo}
              title="Undo"
              disabled={historyIndex <= 0}
            >
              <FaUndo />
            </button>
            <button
              className="control-btn"
              onClick={redo}
              title="Redo"
              disabled={historyIndex >= history.length - 1}
            >
              <FaRedo />
            </button>
          </div>
          
          <div className="control-group">
            <button
              className="control-btn"
              onClick={downloadCanvas}
              title="Download"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>
      
      <div className="whiteboard-users">
        <h3>Connected Users ({users.length})</h3>
        <ul className="users-list">
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <div className="user-avatar" style={{ backgroundColor: generateColor(user.name) }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.name}</span>
              <span className="user-status"></span>
            </li>
          ))}
        </ul>
      </div>
      
      <style jsx>{`
        .whiteboard {
          position: relative;
          height: 100%;
          display: flex;
          overflow: hidden;
          background-color: #f8fafc;
        }
        
        .whiteboard-container {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        
        .whiteboard-canvas {
          width: 100%;
          height: 100%;
          background-color: white;
          cursor: crosshair;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border-radius: 8px;
        }
        
        .whiteboard-controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 16px;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }
        
        .control-group {
          display: flex;
          gap: 8px;
        }
        
        .control-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background-color: white;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .control-btn:hover {
          background-color: #f1f5f9;
          transform: translateY(-2px);
        }
        
        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .whiteboard-users {
          width: 240px;
          background-color: white;
          border-left: 1px solid #e2e8f0;
          padding: 16px;
          overflow-y: auto;
        }
        
        .whiteboard-users h3 {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .users-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .user-item {
          display: flex;
          align-items: center;
          padding: 8px 0;
          position: relative;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
          margin-right: 12px;
        }
        
        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
        }
        
        .user-status {
          position: absolute;
          right: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
        }
        
        @media (max-width: 768px) {
          .whiteboard {
            flex-direction: column;
          }
          
          .whiteboard-users {
            width: 100%;
            height: 120px;
            border-left: none;
            border-top: 1px solid #e2e8f0;
          }
          
          .users-list {
            display: flex;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          
          .user-item {
            flex-direction: column;
            align-items: center;
            margin-right: 16px;
            padding: 8px;
          }
          
          .user-avatar {
            margin-right: 0;
            margin-bottom: 4px;
          }
          
          .user-status {
            position: absolute;
            top: 4px;
            right: 4px;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to generate consistent colors from names
const generateColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#4f46e5', // Indigo
    '#0ea5e9', // Sky
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

export default Whiteboard;
