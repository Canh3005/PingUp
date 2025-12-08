import React, { useState } from 'react';
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
  Mail,
  MoreHorizontal,
  Search,
  Filter,
  X,
  Send,
  ChevronDown,
  UserPlus
} from 'lucide-react';

const RecruitmentTab = ({ project }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock roles data
  const roles = [
    {
      id: 1,
      title: '3D Character Artist',
      description: 'Looking for a skilled 3D artist to create and animate character models for our space exploration game. Experience with stylized art and game-ready optimization is a plus.',
      requirements: [
        'Proficient in Blender or Maya',
        '3+ years of character modeling experience',
        'Strong portfolio showcasing game-ready models',
        'Understanding of rigging and basic animation'
      ],
      type: 'Part-time',
      location: 'Remote',
      credits: '500-800 credits/month',
      status: 'open',
      applicants: [
        {
          id: 1,
          name: 'David Park',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
          portfolio: 'https://portfolio.example.com',
          coverNote: 'I have 5 years of experience in character modeling for indie games. Would love to contribute to this amazing project!',
          appliedAt: '2024-02-10',
          status: 'pending'
        },
        {
          id: 2,
          name: 'Lisa Chen',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop',
          portfolio: 'https://portfolio.example.com',
          coverNote: 'Excited about the art style of Cosmic Explorer! My experience includes work on similar sci-fi projects.',
          appliedAt: '2024-02-11',
          status: 'shortlisted'
        },
        {
          id: 3,
          name: 'Tom Wilson',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
          portfolio: 'https://portfolio.example.com',
          coverNote: 'I specialize in stylized characters and have worked on several space-themed games.',
          appliedAt: '2024-02-12',
          status: 'pending'
        }
      ],
      postedAt: '2024-02-05'
    },
    {
      id: 2,
      title: 'Level Designer',
      description: 'We need a creative level designer to craft engaging space environments and mission layouts. You\'ll work closely with our art and gameplay teams.',
      requirements: [
        'Experience with Unity level design',
        'Understanding of game pacing and flow',
        'Portfolio with completed levels or environments',
        'Good communication skills'
      ],
      type: 'Full-time',
      location: 'Remote',
      credits: '1000-1500 credits/month',
      status: 'open',
      applicants: [
        {
          id: 4,
          name: 'Marcus Brown',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
          portfolio: 'https://portfolio.example.com',
          coverNote: 'Level design is my passion! I\'ve designed over 50 levels for various indie projects.',
          appliedAt: '2024-02-08',
          status: 'pending'
        }
      ],
      postedAt: '2024-02-08'
    },
    {
      id: 3,
      title: 'Voice Actor',
      description: 'Seeking voice actors for main character roles and NPC dialogue. Multiple roles available.',
      requirements: [
        'Professional recording setup',
        'Demo reel required',
        'Availability for recording sessions',
        'Sci-fi or gaming experience preferred'
      ],
      type: 'Contract',
      location: 'Remote',
      credits: '200-400 credits/session',
      status: 'filled',
      applicants: [],
      postedAt: '2024-01-20',
      filledBy: {
        name: 'Jennifer Adams',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop'
      }
    },
    {
      id: 4,
      title: 'QA Tester',
      description: 'Help us find and document bugs before release. Ideal for someone who loves breaking games!',
      requirements: [
        'Detail-oriented mindset',
        'Experience writing bug reports',
        'Available for regular testing sessions',
        'Gaming experience required'
      ],
      type: 'Part-time',
      location: 'Remote',
      credits: '300-500 credits/month',
      status: 'open',
      applicants: [],
      postedAt: '2024-02-12'
    }
  ];

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

  const filteredRoles = activeFilter === 'all'
    ? roles
    : roles.filter(role => role.status === activeFilter);

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
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                      <Star size={14} />
                      {role.credits}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Posted {new Date(role.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="text-gray-700 mb-4">{role.description}</p>

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
                    src={role.filledBy.avatar}
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
                  onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {role.applicants.length} Applicant{role.applicants.length !== 1 ? 's' : ''}
                    </span>
                    {role.applicants.filter(a => a.status === 'pending').length > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {role.applicants.filter(a => a.status === 'pending').length} new
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${selectedRole === role.id ? 'rotate-180' : ''}`}
                  />
                </button>

                {selectedRole === role.id && role.applicants.length > 0 && (
                  <div className="px-6 pb-4 space-y-3">
                    {role.applicants.map((applicant) => (
                      <div key={applicant.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={applicant.avatar}
                          alt={applicant.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">{applicant.name}</p>
                            {getApplicantStatusBadge(applicant.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{applicant.coverNote}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <a
                              href={applicant.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink size={14} />
                              Portfolio
                            </a>
                            <span className="text-gray-400">
                              Applied {new Date(applicant.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Message">
                            <Mail size={18} />
                          </button>
                          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                            Shortlist
                          </button>
                          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedRole === role.id && role.applicants.length === 0 && (
                  <div className="px-6 pb-6 text-center">
                    <UserPlus size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No applications yet</p>
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
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Post New Role</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g., 3D Character Artist"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the role and what you're looking for..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>One-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Remote</option>
                    <option>On-site</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credits/Compensation</label>
                <input
                  type="text"
                  placeholder="e.g., 500-800 credits/month"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (one per line)</label>
                <textarea
                  rows={4}
                  placeholder="Enter each requirement on a new line..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Post Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentTab;
