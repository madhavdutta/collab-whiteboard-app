import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './server/routes/auth.js';
import userRoutes from './server/routes/users.js';
import roomRoutes from './server/routes/rooms.js';

// Middleware
import { authenticateToken } from './server/middleware/auth.js';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whiteboard-saas')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : '*',
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/rooms', authenticateToken, roomRoutes);

// Store active rooms and users
const rooms = new Map();

// Socket.io middleware for authentication
io.use((socket, next) => {
  const { roomId, userId, userName, token } = socket.handshake.query;
  
  // For now, we'll allow connections without token validation
  // In production, you should validate the token here
  socket.userData = { roomId, userId, userName };
  next();
});

io.on('connection', (socket) => {
  const { roomId, userId, userName } = socket.userData;
  
  // Join the specified room
  socket.join(roomId);
  
  // Initialize room if it doesn't exist
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }
  
  // Add user to room
  const room = rooms.get(roomId);
  room.set(userId, {
    id: userId,
    name: userName || 'Anonymous',
    socketId: socket.id
  });
  
  // Broadcast updated users list
  io.to(roomId).emit('users', Array.from(room.values()));
  
  console.log(`User ${userName} (${userId}) joined room ${roomId}`);
  
  // Handle drawing events
  socket.on('draw', (data) => {
    socket.to(roomId).emit('draw', data);
  });
  
  // Handle cursor movement
  socket.on('cursor-move', (data) => {
    socket.to(roomId).emit('cursor-move', data);
  });
  
  // Handle clear canvas
  socket.on('clear-canvas', () => {
    socket.to(roomId).emit('clear-canvas');
  });
  
  // Handle save whiteboard
  socket.on('save-whiteboard', (data) => {
    // In a production app, you would save this to the database
    console.log(`Whiteboard saved for room ${roomId}`);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      
      // Remove user from room
      room.delete(userId);
      
      // Broadcast user disconnection
      socket.to(roomId).emit('user-disconnected', userId);
      
      // Broadcast updated users list
      io.to(roomId).emit('users', Array.from(room.values()));
      
      // Remove room if empty
      if (room.size === 0) {
        rooms.delete(roomId);
      }
      
      console.log(`User ${userName} (${userId}) left room ${roomId}`);
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
