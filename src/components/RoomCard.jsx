import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { FaLock, FaLockOpen, FaTrash, FaEdit } from 'react-icons/fa';

const RoomCard = ({ room, onDelete, onEdit }) => {
  const formattedDate = format(new Date(room.lastModified), 'MMM d, yyyy h:mm a');
  
  return (
    <div className="room-card">
      <div className="room-card-header">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{room.name}</h3>
          <div className="badge badge-primary">
            {room.isPublic ? <FaLockOpen /> : <FaLock />}
          </div>
        </div>
      </div>
      
      <div className="room-card-body">
        <p className="text-sm text-gray mb-2">Room ID: {room.roomId}</p>
        <p className="text-sm text-gray">Last modified: {formattedDate}</p>
      </div>
      
      <div className="room-card-footer">
        <Link to={`/whiteboard/${room.roomId}`} className="btn">
          Open
        </Link>
        
        {room.isOwner && (
          <div className="flex gap-2">
            <button
              className="tool-button"
              onClick={() => onEdit(room)}
              title="Edit Room"
            >
              <FaEdit />
            </button>
            <button
              className="tool-button"
              onClick={() => onDelete(room.id)}
              title="Delete Room"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
