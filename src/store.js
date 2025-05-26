import { create } from 'zustand';

export const useStore = create((set) => ({
  // User info
  userId: null,
  setUserId: (userId) => set({ userId }),
  
  // Drawing tool settings
  tool: 'pen',
  setTool: (tool) => set({ tool }),
  
  color: '#000000',
  setColor: (color) => set({ color }),
  
  lineWidth: 3,
  setLineWidth: (lineWidth) => set({ lineWidth }),
  
  // Canvas state
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  
  // Mouse position
  mousePosition: { x: 0, y: 0 },
  setMousePosition: (mousePosition) => set({ mousePosition }),
}));
