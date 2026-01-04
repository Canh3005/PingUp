import React, { useState, useEffect } from 'react';
import {
  Plus,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Briefcase,
  Star,
  ExternalLink,
  ChevronDown,
  UserPlus,
  Loader2,
  Edit2,
  Trash2,
  MoreHorizontal,
  Search
} from 'lucide-react';
import recruitmentApi from '../../../api/recruitmentApi';
import applicationApi from '../../../api/applicationApi';
import { toast } from 'react-hot-toast';
import CreateRoleModal from './CreateRoleModal';
import EditRoleModal from './EditRoleModal';
import ApplicationDetailsModal from './ApplicationDetailsModal';

const RecruitmentTab = ({ project }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [applications, setApplications] = useState({});
  const [loadingApplications, setLoadingApplications] = useState({});
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Form state for creating recruitment
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Full-time',
    location: 'Remote',
    credits: '',
    positions: 1,
    requirements: '',
  });

  // Load recruitments
  useEffect(() => {
    if (project?._id) {
      loadRecruitments();
    }
  }, [project, activeFilter]);

  const loadRecruitments = async () => {
    try {
      setLoading(true);
      const response = await recruitmentApi.getRecruitmentsByProjectHub(
        project._id,
        activeFilter
      );
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error loading recruitments:', error);
      toast.error('Failed to load recruitments');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async (recruitmentId) => {
    if (applications[recruitmentId]) {
      return; // Already loaded
    }

    try {
      setLoadingApplications(prev => ({ ...prev, [recruitmentId]: true }));
      const response = await applicationApi.getApplicationsByRecruitment(recruitmentId);
      setApplications(prev => ({ 
        ...prev, 
        [recruitmentId]: response.data.data 
      }));
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoadingApplications(prev => ({ ...prev, [recruitmentId]: false }));
    }
  };

  const handleApplicationStatusUpdate = async (applicationId, newStatus, reviewNotes = '') => {
    try {
      setUpdatingStatus(true);
      await applicationApi.updateApplicationStatus(applicationId, newStatus, reviewNotes);
      
      toast.success(`Application ${newStatus}!`);
      
      // Reload applications for the current recruitment
      const app = selectedApplication;
      if (app) {
        const recruitmentId = app.recruitment._id || app.recruitment;
        setApplications(prev => ({ ...prev, [recruitmentId]: undefined }));
        await loadApplications(recruitmentId);
      }
      
      handleCloseApplicationModal();
      loadRecruitments(); // Refresh recruitment data
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCloseApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedApplication(null);
  };

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleCreateRecruitment = async () => {
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.requirements) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Parse requirements (split by newline and filter empty)
      const requirementsArray = formData.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const recruitmentData = {
        projectHub: project._id,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        location: formData.location,
        credits: formData.credits,
        requirements: requirementsArray,
      };

      await recruitmentApi.createRecruitment(recruitmentData);
      toast.success('Role posted successfully!');
      handleCloseCreateModal();
      loadRecruitments();
    } catch (error) {
      console.error('Error creating recruitment:', error);
      toast.error(error.response?.data?.message || 'Failed to create recruitment');
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      type: 'Full-time',
      location: 'Remote',
      credits: '',
      positions: 1,
      requirements: '',
    });
  };

  const handleEditRecruitment = async () => {
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.requirements) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Parse requirements (split by newline and filter empty)
      const requirementsArray = formData.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const updateData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        location: formData.location,
        credits: formData.credits,
        requirements: requirementsArray,
      };

      await recruitmentApi.updateRecruitment(editingRole._id, updateData);
      toast.success('Role updated successfully!');
      handleCloseEditModal();
      loadRecruitments();
    } catch (error) {
      console.error('Error updating recruitment:', error);
      toast.error(error.response?.data?.message || 'Failed to update recruitment');
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingRole(null);
    setFormData({
      title: '',
      description: '',
      type: 'Full-time',
      location: 'Remote',
      credits: '',
      positions: 1,
      requirements: '',
    });
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setFormData({
      title: role.title,
      description: role.description,
      type: role.type,
      location: role.location,
      credits: role.credits,
      positions: role.positions || 1,
      requirements: role.requirements.join('\n'),
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleCloseRecruitment = async (recruitmentId, filledBy = null) => {
    try {
      await recruitmentApi.closeRecruitment(recruitmentId, filledBy);
      toast.success(filledBy ? 'Recruitment filled!' : 'Recruitment closed');
      loadRecruitments();
    } catch (error) {
      console.error('Error closing recruitment:', error);
      toast.error('Failed to close recruitment');
    }
  };

  const handleDeleteRecruitment = async (recruitmentId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      await recruitmentApi.deleteRecruitment(recruitmentId);
      toast.success('Role deleted successfully');
      setOpenMenuId(null);
      loadRecruitments();
    } catch (error) {
      console.error('Error deleting recruitment:', error);
      toast.error('Failed to delete role');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium"><CheckCircle2 size={14} /> Open</span>;
      case 'filled':
        return <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium"><XCircle size={14} /> Filled</span>;
      default:
        return null;
    }
  };

  const getApplicantStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-xs font-medium">Pending</span>;
      case 'shortlisted':
        return <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">Shortlisted</span>;
      case 'accepted':
        return <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">Accepted</span>;
      case 'rejected':
        return <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-medium">Rejected</span>;
      default:
        return null;
    }
  };

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          role.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={32} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recruitment</h2>
          <p className="text-gray-500 mt-1">Find talented collaborators for your project</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Post New Role
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'open', label: 'Open' },
            { id: 'filled', label: 'Filled' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs ml-auto">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {filteredRoles.map((role) => (
          <div key={role._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Role Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                    {getStatusBadge(role.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {role.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {role.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {role.positions || 1} {role.positions === 1 ? 'position' : 'positions'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} />
                      {role.credits}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Posted {new Date(role.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === role._id ? null : role._id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {openMenuId === role._id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={() => openEditModal(role)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 size={16} />
                          Edit Role
                        </button>
                        <button
                          onClick={() => handleDeleteRecruitment(role._id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete Role
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4 whitespace-pre-line">{role.description}</p>

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {role.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filled By (if filled) */}
              {role.status === 'filled' && role.filledBy && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={role.filledBy.avatarUrl || '/default-avatar.png'}
                    alt={role.filledBy.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{role.filledBy.name}</p>
                    <p className="text-sm text-gray-500">Position filled</p>
                  </div>
                </div>
              )}
            </div>

            {/* Applicants Section */}
            {role.status === 'open' && (
              <div className="border-t border-gray-100">
                <button
                  onClick={() => {
                    const isExpanding = selectedRole !== role._id;
                    setSelectedRole(isExpanding ? role._id : null);
                    if (isExpanding) {
                      loadApplications(role._id);
                    }
                  }}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {role.applicantCount || 0} Applicant{role.applicantCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${selectedRole === role._id ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Applications List */}
                {selectedRole === role._id && (
                  <div className="px-6 pb-6">
                    {loadingApplications[role._id] ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 size={24} className="text-blue-600 animate-spin" />
                      </div>
                    ) : applications[role._id]?.length > 0 ? (
                      <div className="space-y-3">
                        {applications[role._id].map((app) => (
                          <div
                            key={app._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <img
                                src={app.applicant?.avatarUrl || '/default-avatar.png'}
                                alt={app.applicant?.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-gray-900">
                                    {app.applicant?.name || 'Unknown'}
                                  </h4>
                                  {getApplicantStatusBadge(app.status)}
                                </div>
                                <p className="text-sm text-gray-500">
                                  Applied {new Date(app.createdAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => viewApplicationDetails(app)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <ExternalLink size={16} />
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <UserPlus size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">No applications yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
          <p className="text-gray-500 mb-4">
            {activeFilter === 'all'
              ? 'Create your first role to start recruiting'
              : `No ${activeFilter} roles at the moment`}
          </p>
          {activeFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Post New Role
            </button>
          )}
        </div>
      )}

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateRecruitment}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditRecruitment}
      />

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        isOpen={showApplicationModal}
        onClose={handleCloseApplicationModal}
        application={selectedApplication}
        onStatusUpdate={handleApplicationStatusUpdate}
        updatingStatus={updatingStatus}
        getApplicantStatusBadge={getApplicantStatusBadge}
      />
    </div>
  );
};

export default RecruitmentTab;
