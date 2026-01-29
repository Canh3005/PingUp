import React, { useRef, useEffect } from 'react';
import { Check, User } from 'lucide-react';

const AssignMemberDropdown = ({ 
  task, 
  projectMembers, 
  onAssign, 
  onUnassign, 
  isOpen, 
  onClose 
}) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAssigned = (memberId) => {
    return task.assignees?.some(assignee => 
      (assignee._id || assignee).toString() === memberId.toString()
    );
  };

  const handleMemberClick = (member) => {
    const memberId = member.user._id || member.user;
    
    if (isAssigned(memberId)) {
      onUnassign(task._id, memberId);
    } else {
      onAssign(task._id, memberId);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-72 max-h-80 overflow-y-auto"
    >
      <div className="p-2">
        <p className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">
          Select members to assign
        </p>
        
        {projectMembers && projectMembers.length > 0 ? (
          <div className="space-y-1">
            {projectMembers.map((member) => {
              const memberUser = member.user;
              const memberId = memberUser._id || memberUser;
              const assigned = isAssigned(memberId);
              
              return (
                <button
                  key={memberId}
                  onClick={() => handleMemberClick(member)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    assigned 
                      ? 'bg-blue-50 hover:bg-blue-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={memberUser.avatarUrl || 'https://via.placeholder.com/40'}
                      alt={memberUser.name || 'Member'}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    {assigned && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      assigned ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {memberUser.name || 'Unknown'}
                    </p>
                    {member.jobPosition && (
                      <p className="text-xs text-gray-500 truncate">
                        {member.jobPosition}
                      </p>
                    )}
                  </div>

                  {/* Checkmark indicator */}
                  {assigned && (
                    <Check size={16} className="text-blue-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-3 py-4 text-center">
            <User size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No members found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignMemberDropdown;
