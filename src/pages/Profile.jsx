import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaKey } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setProfileError('');
      setProfileSuccess('');
      setProfileLoading(true);
      
      await updateProfile(profileData);
      setProfileSuccess('Profile updated successfully');
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setProfileLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordError('New passwords do not match');
    }
    
    try {
      setPasswordError('');
      setPasswordSuccess('');
      setPasswordLoading(true);
      
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordSuccess('Password updated successfully');
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setPasswordLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="card">
          <div className="flex items-center mb-4">
            <FaUser className="text-xl mr-2" />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          
          {profileError && (
            <div className="alert alert-danger">
              {profileError}
            </div>
          )}
          
          {profileSuccess && (
            <div className="alert alert-success">
              {profileSuccess}
            </div>
          )}
          
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn"
              disabled={profileLoading}
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
        
        {/* Change Password */}
        <div className="card">
          <div className="flex items-center mb-4">
            <FaKey className="text-xl mr-2" />
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>
          
          {passwordError && (
            <div className="alert alert-danger">
              {passwordError}
            </div>
          )}
          
          {passwordSuccess && (
            <div className="alert alert-success">
              {passwordSuccess}
            </div>
          )}
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn"
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Account Information */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray mb-1">Subscription Plan</p>
            <p className="font-semibold">
              {user?.subscription === 'free' ? 'Free' : 
               user?.subscription === 'basic' ? 'Basic' : 
               user?.subscription === 'pro' ? 'Pro' : 'Unknown'}
            </p>
          </div>
          
          <div>
            <p className="text-gray mb-1">Member Since</p>
            <p className="font-semibold">
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
