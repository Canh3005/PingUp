import React, { useState } from 'react';
import {
  Save,
  Archive,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import projectHubApi from '../../../api/projectHubApi';
import GeneralSettings from './GeneralSettings';
import VisibilitySettings from './VisibilitySettings';
import IntegrationSettings from './IntegrationSettings';
import DangerZoneSettings from './DangerZoneSettings';

const SettingsTab = ({ project, setProject }) => {
  const [activeSection, setActiveSection] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    visibility: project.visibility,
    tags: project.tags,
    github: project.integrations?.github || '',
    figma: project.integrations?.figma || '',
    discord: project.integrations?.discord || '',
    website: '',
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
      setHasChanges(true);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
        tags: formData.tags,
        website: formData.website,
        integrations: {
          github: formData.github,
          figma: formData.figma,
          discord: formData.discord,
        }
      };

      const response = await projectHubApi.updateProjectHub(project._id, updateData);
      
      if (response.success) {
        setProject(response.data);
        setHasChanges(false);
        toast.success('Settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const sections = [
    { id: 'general', label: 'General' },
    { id: 'visibility', label: 'Visibility & Access' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'danger', label: 'Danger Zone' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1 sticky top-24">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <GeneralSettings
              project={project}
              formData={formData}
              handleInputChange={handleInputChange}
              newTag={newTag}
              setNewTag={setNewTag}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
            />
          )}

          {/* Visibility Settings */}
          {activeSection === 'visibility' && (
            <VisibilitySettings
              project={project}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <IntegrationSettings
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <DangerZoneSettings
              setShowArchiveModal={setShowArchiveModal}
              setShowDeleteModal={setShowDeleteModal}
            />
          )}

          {/* Save Button */}
          {hasChanges && (
            <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <span className="text-sm text-gray-600">You have unsaved changes</span>
              <button
                onClick={() => setHasChanges(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={project.name}
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveModal && (
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
                onClick={() => setShowArchiveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Archive Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
