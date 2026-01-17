import React from 'react';
import { TrendingUp, Users, Clock, Github, Figma, Target, FileText } from 'lucide-react';
import { PROJECT_VISIBILITY } from '../../constants/projectVisibility';

const ProjectHubInfo = ({ hubData }) => {
  if (!hubData || !hubData.visibility) {
    return null;
  }

  // Don't show anything for private hubs (only visibility field is returned)
  if (hubData.visibility === PROJECT_VISIBILITY.PRIVATE && !hubData.progress) {
    return null;
  }

  const formatTimeAgo = (date) => {
    const now = new Date();
    const updated = new Date(date);
    const diffInMs = now - updated;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const hasIntegrations = hubData.integrations?.github || hubData.integrations?.figma;
  const milestoneStats = hubData.milestoneStats || { completed: 0, total: 0 };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden my-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Project Hub</h2>
        </div>
        <p className="text-white/60 ml-[52px]">
          Track progress, team, and activity
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white/70">Progress</span>
                </div>
                
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-bold text-white">{hubData.progress || (milestoneStats.completed/milestoneStats.total)*100 || 0 }%</span>
                  <span className="text-white/50 text-sm mb-1">completed</span>
                </div>

                <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${hubData.progress || (milestoneStats.completed/milestoneStats.total)*100 || 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{hubData.completedTasks || milestoneStats.completed} completed</span>
                  <span>{hubData.totalTasks || milestoneStats.total} total tasks</span>
                </div>

                {/* Milestone Stats */}
                {milestoneStats.total > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Milestones</span>
                      <span className="text-white font-medium">
                        {milestoneStats.completed}/{milestoneStats.total}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Team Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white/70">Team</span>
                </div>

                {hubData.members && hubData.members.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {hubData.members.slice(0, 6).map((member, index) => (
                        <div key={member._id || index} className="group relative">
                          <img
                            src={member.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user?.name || 'User')}`}
                            alt={member.user?.name || 'Team member'}
                            className="w-10 h-10 rounded-full border-2 border-white/20 group-hover:border-blue-400/50 transition-all cursor-pointer"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user?.name || 'User')}`;
                            }}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {member.user?.name || 'Team member'}
                            {member.jobPosition && (
                              <div className="text-white/60">{member.jobPosition}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-white/60">
                      {hubData.members.length} member{hubData.members.length !== 1 ? 's' : ''}
                      {hubData.hasMoreMembers && ' +'}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-white/50">No team members yet</p>
                )}
              </div>
            </div>

            {/* Activity & Links Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white/70">Activity</span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Last updated</span>
                    <span className="text-sm text-white font-medium">
                      {hubData.updatedAt ? formatTimeAgo(hubData.updatedAt) : 'N/A'}
                    </span>
                  </div>
                  
                  {hubData.devlogCount !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Updates
                      </span>
                      <span className="text-sm text-white font-medium">
                        {hubData.devlogCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Integrations */}
                {hasIntegrations && (
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <p className="text-xs text-white/60 mb-2">Links</p>
                    <div className="flex gap-2">
                      {hubData.integrations?.github && (
                        <a
                          href={hubData.integrations.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm text-white"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {hubData.integrations?.figma && (
                        <a
                          href={hubData.integrations.figma}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm text-white"
                        >
                          <Figma className="w-4 h-4" />
                          Figma
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProjectHubInfo;
