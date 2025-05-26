import express from 'express';
import Room from '../models/Room.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create a new room
router.post('/', async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    
    const room = new Room({
      name,
      roomId: uuidv4().substring(0, 8),
      owner: req.user.id,
      isPublic: isPublic || false
    });
    
    await room.save();
    
    res.status(201).json({
      message: 'Room created successfully',
      room: {
        id: room._id,
        name: room.name,
        roomId: room.roomId,
        isPublic: room.isPublic,
        createdAt: room.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all rooms for current user
router.get('/', async (req, res) => {
  try {
    // Find rooms where user is owner or collaborator
    const rooms = await Room.find({
      $or: [
        { owner: req.user.id },
        { collaborators: req.user.id }
      ]
    }).sort({ lastModified: -1 });
    
    res.json({
      rooms: rooms.map(room => ({
        id: room._id,
        name: room.name,
        roomId: room.roomId,
        isPublic: room.isPublic,
        createdAt: room.createdAt,
        lastModified: room.lastModified,
        isOwner: room.owner.toString() === req.user.id
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findOne({
      roomId: req.params.id
    }).populate('owner', 'name email');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user has access to room
    const isOwner = room.owner._id.toString() === req.user.id;
    const isCollaborator = room.collaborators.some(id => id.toString() === req.user.id);
    
    if (!isOwner && !isCollaborator && !room.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({
      room: {
        id: room._id,
        name: room.name,
        roomId: room.roomId,
        owner: {
          id: room.owner._id,
          name: room.owner.name,
          email: room.owner.email
        },
        isPublic: room.isPublic,
        canvasData: room.canvasData,
        createdAt: room.createdAt,
        lastModified: room.lastModified,
        isOwner
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update room
router.put('/:id', async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    
    // Find room
    const room = await Room.findOne({ roomId: req.params.id });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is owner
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can update the room' });
    }
    
    // Update fields
    if (name) room.name = name;
    if (isPublic !== undefined) room.isPublic = isPublic;
    
    room.lastModified = Date.now();
    await room.save();
    
    res.json({
      message: 'Room updated successfully',
      room: {
        id: room._id,
        name: room.name,
        roomId: room.roomId,
        isPublic: room.isPublic,
        lastModified: room.lastModified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save canvas data
router.put('/:id/canvas', async (req, res) => {
  try {
    const { canvasData } = req.body;
    
    // Find room
    const room = await Room.findOne({ roomId: req.params.id });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user has access to room
    const isOwner = room.owner.toString() === req.user.id;
    const isCollaborator = room.collaborators.some(id => id.toString() === req.user.id);
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update canvas data
    room.canvasData = canvasData;
    room.lastModified = Date.now();
    await room.save();
    
    res.json({ message: 'Canvas saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add collaborator to room
router.post('/:id/collaborators', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find room
    const room = await Room.findOne({ roomId: req.params.id });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is owner
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can add collaborators' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already a collaborator
    if (room.collaborators.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }
    
    // Add collaborator
    room.collaborators.push(user._id);
    await room.save();
    
    res.json({ message: 'Collaborator added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete room
router.delete('/:id', async (req, res) => {
  try {
    // Find room
    const room = await Room.findOne({ roomId: req.params.id });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is owner
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can delete the room' });
    }
    
    await room.remove();
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
