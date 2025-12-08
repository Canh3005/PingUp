import React, { useState } from 'react';
import {
  Search,
  Mail,
  MoreHorizontal,
  Star,
  Shield,
  Crown,
  UserPlus,
  X,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

const TeamTab = ({ project }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Mock team data with extended info
  const teamMembers = [
    {
      id: 1,
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      role: 'Project Lead',
      roleType: 'owner',
      email: 'alex.chen@example.com',
      joinedAt: '2024-01-10',
      credits: 2450,
      tasksCompleted: 28,
      lastActive: '5 minutes ago',
      skills: ['Unity', 'C#', 'Game Design', 'Project Management'],
      bio: 'Passionate game developer with 8 years of experience. Previously worked at Indie Studio X.',
      socialLinks: {
        portfolio: 'https://alexchen.dev',
        github: 'https://github.com/alexchen',
        twitter: 'https://twitter.com/alexchen'
      },
      activityScore: 95
    },
    {
      id: 2,
      name: 'Sarah Kim',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      role: 'UI Designer',
      roleType: 'admin',
      email: 'sarah.kim@example.com',
      joinedAt: '2024-01-15',
      credits: 1820,
      tasksCompleted: 24,
      lastActive: '2 hours ago',
      skills: ['Figma', 'UI/UX', 'Adobe Suite', 'Animation'],
      bio: 'UI/UX designer specializing in game interfaces and interactive experiences.',
      socialLinks: {
        portfolio: 'https://sarahkim.design',
        dribbble: 'https://dribbble.com/sarahkim'
      },
      activityScore: 88
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      role: 'Developer',
      roleType: 'member',
      email: 'mike.johnson@example.com',
      joinedAt: '2024-01-20',
      credits: 1560,
      tasksCompleted: 32,
      lastActive: '1 day ago',
      skills: ['Unity', 'C#', 'Shader Programming', 'Optimization'],
      bio: 'Full-stack game developer focused on performance and graphics programming.',
      socialLinks: {
        github: 'https://github.com/mikejohnson',
        linkedin: 'https://linkedin.com/in/mikejohnson'
      },
      activityScore: 72
    },
    {
      id: 4,
      name: 'Emily Wang',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      role: 'Sound Designer',
      roleType: 'member',
      email: 'emily.wang@example.com',
      joinedAt: '2024-02-01',
      credits: 980,
      tasksCompleted: 15,
      lastActive: '3 hours ago',
      skills: ['FMOD', 'Logic Pro', 'Sound Design', 'Music Composition'],
      bio: 'Audio engineer and composer creating immersive soundscapes for games.',
      socialLinks: {
        portfolio: 'https://emilywang.audio',
        soundcloud: 'https://soundcloud.com/emilywang'
      },
      activityScore: 81
    }
  ];

  const getRoleBadge = (roleType) => {
    switch (roleType) {
      case 'owner':
        return (
          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-xs font-medium">
            <Crown size={12} />
            Owner
          </span>
        );
      case 'admin':
        return (
          <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs font-medium">
            <Shield size={12} />
            Admin
          </span>
        );
      default:
        return null;
    }
  };

  const getActivityColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-500 mt-1">{teamMembers.length} members collaborating on this project</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={18} />
          Invite Member
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search team members..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  member.lastActive.includes('minute') ? 'bg-green-500' :
                  member.lastActive.includes('hour') ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  {getRoleBadge(member.roleType)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-yellow-500" />
                <span className="text-sm text-gray-600">{member.credits} credits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-500" />
                <span className="text-sm text-gray-600">{member.tasksCompleted} tasks</span>
              </div>
              <div className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded ${getActivityColor(member.activityScore)}`}>
                <TrendingUp size={12} />
                <span className="text-xs font-medium">{member.activityScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="absolute -bottom-12 left-6">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-24 h-24 rounded-xl border-4 border-white object-cover shadow-lg"
                />
              </div>
            </div>

            {/* Content */}
            <div className="pt-16 px-6 pb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h2>
                    {getRoleBadge(selectedMember.roleType)}
                  </div>
                  <p className="text-gray-600">{selectedMember.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Mail size={18} />
                    Message
                  </button>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                <p className="text-gray-700">{selectedMember.bio}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                    <Star size={18} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedMember.credits}</p>
                  <p className="text-sm text-gray-500">Credits</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedMember.tasksCompleted}</p>
                  <p className="text-sm text-gray-500">Tasks Done</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                    <TrendingUp size={18} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedMember.activityScore}</p>
                  <p className="text-sm text-gray-500">Activity</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-500 mb-1">
                    <Clock size={18} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.floor((new Date() - new Date(selectedMember.joinedAt)) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-gray-500">Days Active</p>
                </div>
              </div>

              {/* Social Links */}
              {selectedMember.socialLinks && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Links</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedMember.socialLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        <ExternalLink size={14} />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                <span>Joined {new Date(selectedMember.joinedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>Last active: {selectedMember.lastActive}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email or Username</label>
                <input
                  type="text"
                  placeholder="Enter email or username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Member</option>
                  <option>Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Add a personal message to the invite..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTab;
