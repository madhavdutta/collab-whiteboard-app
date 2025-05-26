import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);
  
  // Modified to use localStorage instead of API calls
  const register = async (name, email, password) => {
    try {
      // Generate a simple token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Create user object
      const user = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        subscription: 'free',
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setToken(token);
      setUser(user);
      
      toast.success('Registration successful!');
      return { user, token };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };
  
  // Modified to use localStorage instead of API calls
  const login = async (email, password) => {
    try {
      // In a real app, we would validate credentials
      // For now, just create a dummy user if email contains "test"
      // Otherwise, throw an error to simulate authentication
      
      if (!email.includes('test')) {
        // Check if we have any users in localStorage that match
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.email === email) {
            // Generate a simple token
            const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            
            // Save to localStorage
            localStorage.setItem('token', token);
            
            // Update state
            setToken(token);
            setUser(user);
            
            toast.success('Login successful!');
            return { user, token };
          }
        }
        throw new Error('Invalid email or password');
      }
      
      // Create dummy user for testing
      const user = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role: 'user',
        subscription: 'free',
        createdAt: new Date().toISOString()
      };
      
      // Generate a simple token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setToken(token);
      setUser(user);
      
      toast.success('Login successful!');
      return { user, token };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };
  
  // Modified to use localStorage instead of API calls
  const logout = async () => {
    try {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setToken(null);
      setUser(null);
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear local auth data even if something fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setToken(null);
      setUser(null);
    }
  };
  
  // Modified to use localStorage instead of API calls
  const updateProfile = async (userData) => {
    try {
      // Get current user data
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User not found');
      }
      
      // Update user data
      const currentUser = JSON.parse(storedUser);
      const updatedUser = { ...currentUser, ...userData };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
      return { user: updatedUser };
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };
  
  // Modified to use localStorage instead of API calls
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      // In a real app, we would validate the current password
      // For now, just simulate success
      
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
      throw error;
    }
  };
  
  // Modified to use localStorage instead of API calls
  const updateSubscription = async (subscription) => {
    try {
      // Get current user data
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User not found');
      }
      
      // Update subscription
      const currentUser = JSON.parse(storedUser);
      const updatedUser = { ...currentUser, subscription };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      toast.success('Subscription updated successfully');
      return { subscription, user: updatedUser };
    } catch (error) {
      toast.error(error.message || 'Failed to update subscription');
      throw error;
    }
  };
  
  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    updateSubscription,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
