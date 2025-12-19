import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { useAuth } from '../context/authContext';
import projectHubApi from '../api/projectHubApi';
import projectApi from '../api/projectApi';
import uploadApi from '../api/uploadApi';
import Loading from '../components/Loading';

const CreateProjectHub = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const projectId = location.state?.projectId;

  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [],
    integrations: {
      github: '',
      figma: '',
      discord: '',
    },
    visibility: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  // Load project data if projectId is provided
  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const response = await projectApi.getProject(projectId);
      const projectData = response.data;
      setProject(projectData);
      
      // Pre-fill form with project data
      setFormData(prev => ({
        ...prev,
        name: projectData.title || '',
        description: projectData.description || '',
        invisibility: projectData.visibility || ''
      }));
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      let logoUrl = '';
      
      // Upload logo if provided
      if (logoFile) {
        const uploadResponse = await uploadApi.uploadImage(logoFile);
        logoUrl = uploadResponse.url;
      }

      // Create project hub
      const hubData = {
        ...formData,
        logo: logoUrl,
        showcaseProjectId: projectId || null,
      };

      const response = await projectHubApi.createProjectHub(hubData);
      const newHub = response.data;

      // Update project with projectHubId if this hub is created from a project
      if (projectId && newHub._id) {
        try {
          await projectApi.updateProject(projectId, {
            projectHubId: newHub._id,
          });
        } catch (updateError) {
          console.error('Error updating project with hub ID:', updateError);
          // Continue anyway, hub is created successfully
        }
      }

      // Navigate to the new project hub
      navigate(`/project-hub/${newHub._id}`);
    } catch (error) {
      console.error('Error creating project hub:', error);
      setError(error.response?.data?.message || 'Failed to create project hub');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.name) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              <div className="h-8 w-px bg-gray-200"></div>

              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>Project Hub</span>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">Create New</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Create Project Hub</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Project Information</h2>
            <p className="text-gray-600 text-sm">
              {projectId 
                ? 'Set up a collaborative hub for your project' 
                : 'Create a new project hub to manage your team and workflow'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Logo Upload */}
            <div>
              <label className="block text-gray-900 font-medium mb-3">Project Logo</label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors overflow-hidden group cursor-pointer">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-500 transition-colors" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Upload a square image</p>
                  <p>Recommended: 400x400px</p>
                </div>
              </div>
            </div>

            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-gray-900 font-medium mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-gray-900 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project..."
                rows={4}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-gray-900 font-medium mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200 font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Integrations */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <h3 className="text-gray-900 font-semibold mb-1">Integrations</h3>
                <p className="text-sm text-gray-600">Connect your external tools (optional)</p>
              </div>
              
              <div>
                <label htmlFor="github" className="block text-gray-700 font-medium text-sm mb-2">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  id="github"
                  name="integrations.github"
                  value={formData.integrations.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="figma" className="block text-gray-700 font-medium text-sm mb-2">
                  Figma Project
                </label>
                <input
                  type="url"
                  id="figma"
                  name="integrations.figma"
                  value={formData.integrations.figma}
                  onChange={handleInputChange}
                  placeholder="https://figma.com/file/..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="discord" className="block text-gray-700 font-medium text-sm mb-2">
                  Discord Server
                </label>
                <input
                  type="url"
                  id="discord"
                  name="integrations.discord"
                  value={formData.integrations.discord}
                  onChange={handleInputChange}
                  placeholder="https://discord.gg/..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Project Hub'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectHub;
