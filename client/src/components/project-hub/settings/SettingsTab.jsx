import React, { useState } from 'react';
import {
  Save,
  Globe,
  Lock,
  Tag,
  Link2,
  Github,
  Figma,
  Trash2,
  Archive,
  AlertTriangle,
  Camera,
  ExternalLink,
  Check,
  Copy
} from 'lucide-react';

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

  const handleSave = () => {
    // Save logic here
    setHasChanges(false);
    console.log('Saving settings:', formData);
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>

              {/* Project Logo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Logo</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                      <Camera size={24} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Change Logo
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="relative aspect-[3/1] bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                    <Camera size={32} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Project Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <span className="sr-only">Remove</span>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Visibility Settings */}
          {activeSection === 'visibility' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Visibility & Access</h2>

              {/* Visibility Options */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-4">Project Visibility</label>

                <div
                  onClick={() => handleInputChange('visibility', 'public')}
                  className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                    formData.visibility === 'public'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${formData.visibility === 'public' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Globe size={24} className={formData.visibility === 'public' ? 'text-blue-600' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">Public</p>
                      {formData.visibility === 'public' && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Anyone can view this project. It will appear in search results and on your profile.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => handleInputChange('visibility', 'private')}
                  className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                    formData.visibility === 'private'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${formData.visibility === 'private' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Lock size={24} className={formData.visibility === 'private' ? 'text-blue-600' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">Private</p>
                      {formData.visibility === 'private' && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Only you and invited team members can view this project.
                    </p>
                  </div>
                </div>
              </div>

              {/* Share Link */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://ping.app/project/${project.id}`}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                  />
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Copy size={18} />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Integrations</h2>
              <p className="text-gray-500 mb-6">Connect external tools and services to your project.</p>

              <div className="space-y-6">
                {/* GitHub */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Github size={18} />
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Figma */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Figma size={18} />
                    Figma Project
                  </label>
                  <input
                    type="url"
                    value={formData.figma}
                    onChange={(e) => handleInputChange('figma', e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Discord */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    Discord Server
                  </label>
                  <input
                    type="url"
                    value={formData.discord}
                    onChange={(e) => handleInputChange('discord', e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Link2 size={18} />
                    Project Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourproject.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
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
