import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteProjectModal = ({ isOpen, onClose, project, onConfirm }) => {
  const [confirmName, setConfirmName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Project?</h3>
          <p className="text-gray-500 text-center mb-6">
            This will permanently delete "{project.name}" and all associated data including tasks, files, and devlogs. This action cannot be undone.
          </p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-mono bg-gray-100 px-1">{project.name}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder={project.name}
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={confirmName !== project.name}
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
