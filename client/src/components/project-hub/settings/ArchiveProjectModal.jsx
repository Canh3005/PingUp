import React from 'react';
import { Archive } from 'lucide-react';

const ArchiveProjectModal = ({ isOpen, onClose, project, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive size={24} className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Archive Project?</h3>
          <p className="text-gray-500 text-center">
            Archiving will make "{project.name}" read-only. Team members will still be able to view content but won't be able to make changes. You can unarchive at any time.
          </p>
        </div>
        <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Archive Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveProjectModal;
