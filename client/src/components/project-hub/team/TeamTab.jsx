import React, { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  MoreHorizontal,
  Star,
  UserPlus,
  X,
  CheckCircle2,
  Clock,
  TrendingUp,
  ExternalLink,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import RoleBadge from './RoleBadge';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';
import useProjectHubPermissions from '../../../hooks/useProjectHubPermissions';
import Loading from '../../Loading';

const TeamTab = ({ project }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get current user's permissions
  const permissions = useProjectHubPermissions(project);
  const { role: currentUserRole, canAddMember, canManageMembers } = permissions;
  // Filter members based on search
  const filteredMembers = (project?.members || []).filter(member => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      member.user?.name?.toLowerCase().includes(searchLower) ||
      member.jobPosition?.toLowerCase().includes(searchLower) ||
      member.permissionRole?.toLowerCase().includes(searchLower)
    );
  });
  console.log('Filtered Members:', filteredMembers);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleEditMember = (member, e) => {
    e.stopPropagation();
    console.log('Member data:', member); // Debug: check member structure
    console.log('Member user:', member.user); // Debug: check user data
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleRefresh = () => {
    // Trigger parent component to reload project data
    window.location.reload(); // Simple approach, or use a callback prop
  };

  if (!project) {
    return <Loading />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-500 mt-1">
            {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} collaborating on this project
          </p>
        </div>
        {canAddMember && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={18} />
            Add Member
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search team members by name, role, or position..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No members found' : 'No team members yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search criteria' 
              : 'Start building your team by adding members'}
          </p>
          {canAddMember && !searchQuery && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus size={18} />
              Add First Member
            </button>
          )}
        </div>
      )}

      {/* Team Grid */}
      {filteredMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member._id || member.user?._id}
              onClick={() => handleMemberClick(member)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={member.user?.avatarUrl || member.user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user?.name || 'User')}&background=random`}
                    alt={member.user?.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user?.name || 'User')}&background=random`;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {member.user?.name || 'Unknown User'}
                    </h3>
                    <RoleBadge role={member.permissionRole} size="sm" />
                  </div>
                  
                  {member.jobPosition && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <Briefcase size={14} />
                      <span className="truncate">{member.jobPosition}</span>
                    </div>
                  )}

                  {member.user?.email && (
                    <p className="text-xs text-gray-500 truncate">{member.user.email}</p>
                  )}
                </div>

                {/* Actions */}
                {canManageMembers && (
                  <button
                    onClick={(e) => handleEditMember(member, e)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && !showEditModal && (
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
                  src={selectedMember.user?.avatarUrl || selectedMember.user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.user?.name || 'User')}&background=random`}
                  alt={selectedMember.user?.name}
                  className="w-24 h-24 rounded-xl border-4 border-white object-cover shadow-lg"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.user?.name || 'User')}&background=random`;
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="pt-16 px-6 pb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedMember.user?.name || 'Unknown User'}
                    </h2>
                    <RoleBadge role={selectedMember.permissionRole} />
                  </div>
                  {selectedMember.jobPosition && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase size={16} />
                      <span>{selectedMember.jobPosition}</span>
                    </div>
                  )}
                </div>
                {canManageMembers && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Edit Member
                  </button>
                )}
              </div>

              {/* Bio/About */}
              {selectedMember.user?.bio && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                  <p className="text-gray-700">{selectedMember.user.bio}</p>
                </div>
              )}

              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Contact</h3>
                <div className="space-y-2">
                  {selectedMember.user?.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail size={16} className="text-gray-400" />
                      <a href={`mailto:${selectedMember.user.email}`} className="hover:text-blue-600">
                        {selectedMember.user.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                <span>Member since {new Date(selectedMember.createdAt || project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        projectId={project._id}
        onSuccess={handleRefresh}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        projectId={project._id}
        currentUserRole={currentUserRole}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default TeamTab;
