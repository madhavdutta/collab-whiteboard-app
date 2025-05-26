import { useState } from 'react';

const CreateRoomModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, isPublic });
    resetForm();
  };
  
  const resetForm = () => {
    setName('');
    setIsPublic(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? 'Edit Room' : 'Create New Room'}
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="room-name">Room Name</label>
              <input
                type="text"
                id="room-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter room name"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                Make room public (anyone with the link can join)
              </label>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn">
              {initialData ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
