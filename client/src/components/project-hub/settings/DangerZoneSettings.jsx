import React from 'react';
import { Archive, Trash2 } from 'lucide-react';

const DangerZoneSettings = ({ setShowArchiveModal, setShowDeleteModal }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
      <h2 className="text-xl font-bold text-red-600 mb-6">Danger Zone</h2>

      <div className="space-y-4">
        {/* Archive Project */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Archive this project</p>
            <p className="text-sm text-gray-500 mt-1">
              Archive the project and make it read-only. You can unarchive later.
            </p>
          </div>
          <button
            onClick={() => setShowArchiveModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Archive size={18} />
            Archive
          </button>
        </div>

        {/* Delete Project */}
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div>
            <p className="font-medium text-red-700">Delete this project</p>
            <p className="text-sm text-red-600 mt-1">
              Permanently delete this project and all its data. This cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangerZoneSettings;
