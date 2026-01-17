import React, { useState } from 'react';
import {
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import projectHubApi from '../../../api/projectHubApi';
import GeneralSettings from './GeneralSettings';
import VisibilitySettings from './VisibilitySettings';
import IntegrationSettings from './IntegrationSettings';
import DangerZoneSettings from './DangerZoneSettings';
import DeleteProjectModal from './DeleteProjectModal';
import ArchiveProjectModal from './ArchiveProjectModal';

const SettingsTab = ({ project, setProject }) => {
  const navigate = useNavigate();
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

  const handleDeleteProject = async () => {
    try {
      await projectHubApi.deleteProjectHub(project._id);
      toast.success('Project deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleArchiveProject = async () => {
    toast.error('Archive functionality not implemented yet');
    setShowArchiveModal(false);
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
      <DeleteProjectModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        project={project}
        onConfirm={handleDeleteProject}
      />

      {/* Archive Confirmation Modal */}
      <ArchiveProjectModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        project={project}
        onConfirm={handleArchiveProject}
      />
    </div>
  );
};

export default SettingsTab;
