import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Users,
  MapPin,
  Briefcase,
  Star,
  Clock,
  ChevronDown,
  CheckCircle2,
  Loader2,
  Send
} from 'lucide-react';
import recruitmentApi from '../../api/recruitmentApi';
import applicationApi from '../../api/applicationApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/authContext';

const ProjectRecruitment = ({ project }) => {
  const { user } = useAuth();
  console.log('ProjectRecruitment - Current user:', user);
  
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRole, setExpandedRole] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverNote: '',
    portfolio: ''
  });
  const [applying, setApplying] = useState(false);
  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {
    if (project?.projectHubId) {
      loadRecruitments();
      if (user) {
        loadUserApplications();
      }
    }
  }, [project, user]);

  const loadRecruitments = async () => {
    try {
      setLoading(true);
      const response = await recruitmentApi.getRecruitmentsByProjectHub(
        project.projectHubId,
        'open'
      );
      setRecruitments(response.data.data);
    } catch (error) {
      console.error('Error loading recruitments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserApplications = async () => {
    try {
      const response = await applicationApi.getMyApplications();
      console.log('User applications:', response.data.data);
      setUserApplications(response.data.data);
    } catch (error) {
      console.error('Error loading user applications:', error);
    }
  };

  const hasApplied = (recruitmentId) => {
    if (!userApplications || userApplications.length === 0) {
      return false;
    }
    const applied = userApplications.some(app => {
      const appRecruitmentId = app.recruitment?._id || app.recruitment;
      return appRecruitmentId === recruitmentId;
    });
    console.log('Has applied to', recruitmentId, ':', applied);
    return applied;
  };

  const handleApply = async (recruitmentId) => {
    if (!user) {
      toast.error('Please login to apply');
      return;
    }

    // Validate portfolio URL if provided
    if (applicationData.portfolio && !isValidUrl(applicationData.portfolio)) {
      toast.error('Please enter a valid URL for portfolio');
      return;
    }

    try {
      setApplying(true);
      const data = {
        recruitment: recruitmentId,
        coverNote: applicationData.coverNote,
        portfolio: applicationData.portfolio
      };

      await applicationApi.createApplication(data);
      toast.success('Application submitted successfully!');
      setShowApplyModal(null);
      setApplicationData({ coverNote: '', portfolio: '' });
      loadRecruitments();
      loadUserApplications();
    } catch (error) {
      console.error('Error applying:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    // eslint-disable-next-line no-unused-vars
    } catch (_) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-12">
        <div className="flex items-center justify-center py-8">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (recruitments.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto my-12">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-8 py-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Open Positions</h2>
          </div>
          <p className="text-white/60 ml-[52px]">
            Join our team! We're looking for talented collaborators
          </p>
        </div>

        {/* Roles List */}
        <div className="p-6 space-y-4">
          {recruitments.map((role) => (
            <div
              key={role._id}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} />
                        {role.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {role.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Star size={14} />
                        {role.credits}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        Posted {new Date(role.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      console.log('Apply button clicked for role:', role._id);
                      console.log('User:', user);
                      const applied = hasApplied(role._id);
                      console.log('Has applied:', applied);
                      
                      if (applied) {
                        toast('You have already applied to this position', { icon: 'ℹ️' });
                      } else {
                        console.log('Opening apply modal');
                        setShowApplyModal(role._id);
                      }
                    }}
                    disabled={hasApplied(role._id)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      hasApplied(role._id)
                        ? 'bg-gray-600 text-white cursor-not-allowed opacity-60'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {hasApplied(role._id) ? (
                      <>
                        <CheckCircle2 size={16} />
                        Applied
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Apply
                      </>
                    )}
                  </button>
                </div>

                <p className="text-white/80 mb-4 whitespace-pre-line">{role.description}</p>

                {/* Requirements Toggle */}
                <button
                  onClick={() => setExpandedRole(expandedRole === role._id ? null : role._id)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="text-sm font-medium">View Requirements</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expandedRole === role._id ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Requirements List */}
                {expandedRole === role._id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {role.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                          <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal - Using Portal to render outside component tree */}
      {showApplyModal && createPortal(
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => {
            setShowApplyModal(null);
            setApplicationData({ coverNote: '', portfolio: '' });
          }}
        >
          <div 
            className="bg-gray-900 rounded-2xl w-full max-w-lg border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Apply for Position</h3>
              <p className="text-white/60 text-sm mt-1">
                {recruitments.find(r => r._id === showApplyModal)?.title}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Cover Note <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us why you'd be a great fit..."
                  value={applicationData.coverNote}
                  onChange={(e) => setApplicationData({ ...applicationData, coverNote: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Portfolio/Website (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://your-portfolio.com"
                  value={applicationData.portfolio}
                  onChange={(e) => setApplicationData({ ...applicationData, portfolio: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowApplyModal(null);
                  setApplicationData({ coverNote: '', portfolio: '' });
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                disabled={applying}
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply(showApplyModal)}
                disabled={!applicationData.coverNote || applying}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {applying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectRecruitment;
