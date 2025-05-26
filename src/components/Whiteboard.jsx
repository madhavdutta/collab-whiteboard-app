import { useRef, useState, useEffect } from 'react';
import { useStore } from '../store';
import Cursor from './Cursor';

const Whiteboard = ({ socket, users }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [cursors, setCursors] = useState({});
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const { 
    userId, 
    tool, 
    color, 
    lineWidth, 
    isDrawing, 
    setIsDrawing,
    mousePosition,
    setMousePosition
  } = useStore();

  // Initialize canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Initialize canvas context
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
  }, [canvasSize]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Listen for drawing events
    socket.on('draw', (data) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.lineWidth;
      
      ctx.beginPath();
      ctx.moveTo(data.prevX, data.prevY);
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });
    
    // Listen for cursor movement
    socket.on('cursor-move', (data) => {
      setCursors(prev => ({
        ...prev,
        [data.userId]: {
          x: data.x,
          y: data.y,
          color: data.color,
          userName: data.userName
        }
      }));
    });
    
    // Listen for clear canvas
    socket.on('clear-canvas', () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    
    // Listen for user disconnect
    socket.on('user-disconnected', (disconnectedUserId) => {
      setCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[disconnectedUserId];
        return newCursors;
      });
    });
    
    return () => {
      socket.off('draw');
      socket.off('cursor-move');
      socket.off('clear-canvas');
      socket.off('user-disconnected');
    };
  }, [socket]);

  // Drawing functions
  const startDrawing = (e) => {
    if (!canvasRef.current || !socket) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse position relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set drawing state
    setIsDrawing(true);
    setMousePosition({ x, y });
    
    // Set canvas drawing styles
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    // Start path
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current || !socket) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse position relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Draw line
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Emit drawing event
    socket.emit('draw', {
      x,
      y,
      prevX: mousePosition.x,
      prevY: mousePosition.y,
      color,
      lineWidth,
      tool
    });
    
    // Update mouse position
    setMousePosition({ x, y });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
    }
  };

  const handleMouseMove = (e) => {
    if (!socket) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse position relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Emit cursor position
    socket.emit('cursor-move', {
      x,
      y,
      color,
      userId,
      userName: localStorage.getItem('userName') || 'Anonymous'
    });
    
    // Draw if mouse is down
    if (isDrawing) {
      draw(e);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="whiteboard-container"
      onMouseDown={startDrawing}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    >
      <canvas
        ref={canvasRef}
        className="whiteboard"
        width={canvasSize.width}
        height={canvasSize.height}
      />
      
      {/* Render other users' cursors */}
      {Object.entries(cursors).map(([cursorUserId, cursorData]) => {
        if (cursorUserId === userId) return null;
        
        return (
          <Cursor
            key={cursorUserId}
            x={cursorData.x}
            y={cursorData.y}
            color={cursorData.color}
            userName={cursorData.userName}
          />
        );
      })}
    </div>
  );
};

export default Whiteboard;
