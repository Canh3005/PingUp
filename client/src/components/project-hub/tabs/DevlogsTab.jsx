import React, { useState, useEffect } from 'react';
import {
  Plus,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Music,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Rocket
} from 'lucide-react';
import devlogApi from '../../../api/devlogApi';
import CreateDevlogModal from '../modals/CreateDevlogModal';

const DevlogsTab = ({ project }) => {
  const [devlogs, setDevlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load devlogs when project or page changes
  useEffect(() => {
    if (project?._id) {
      loadDevlogs();
    }
  }, [project, page]);

  const loadDevlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await devlogApi.getDevlogsByProjectHub(project._id, { page, limit: 10 });
      setDevlogs(Array.isArray(data) ? data : data.devlogs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error loading devlogs:', err);
      setError(err.response?.data?.message || 'Failed to load devlogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDevlogCreated = (newDevlog) => {
    setDevlogs([newDevlog, ...devlogs]);
    setShowCreateModal(false);
  };

  const handleReaction = async (devlogId, reactionType) => {
    try {
      await devlogApi.addReaction(devlogId, reactionType);
      // Reload to get updated reactions
      loadDevlogs();
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Group devlogs by date
  const groupedDevlogs = devlogs.reduce((groups, devlog) => {
    const date = formatDate(devlog.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(devlog);
    return groups;
  }, {});

  const DevlogCard = ({ devlog }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 pb-4">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={devlog.author?.avatarUrl || 'https://via.placeholder.com/50'}
            alt={devlog.author?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{devlog.author?.name || 'Unknown'}</h4>
            <p className="text-sm text-gray-500">
              {new Date(devlog.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Title */}
        <h4 className="text-xl font-bold text-gray-900 mt-4">{devlog.title}</h4>

        {/* Content */}
        <div className="mt-3 text-gray-700 whitespace-pre-line">
          {devlog.content}
        </div>
      </div>

      {/* Media */}
      {devlog.media && devlog.media.length > 0 && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {devlog.media.slice(0, 4).map((item, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden bg-gray-100">
                {item.type === 'image' && (
                  <img
                    src={item.url}
                    alt={item.title || 'Media'}
                    className="w-full h-48 object-cover"
                  />
                )}
                {item.type === 'audio' && (
                  <div className="flex items-center justify-center h-24 bg-gradient-to-br from-purple-500 to-pink-500">
                    <Music size={32} className="text-white" />
                  </div>
                )}
                {item.type === 'video' && (
                  <div className="flex items-center justify-center h-48 bg-gray-800">
                    <ImageIcon size={32} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reactions & Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Reactions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleReaction(devlog._id, 'heart')}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart size={18} />
              <span className="text-sm">{devlog.reactions?.heart || 0}</span>
            </button>
            <button
              onClick={() => handleReaction(devlog._id, 'fire')}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <Flame size={18} />
              <span className="text-sm">{devlog.reactions?.fire || 0}</span>
            </button>
            <button
              onClick={() => handleReaction(devlog._id, 'rocket')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Rocket size={18} />
              <span className="text-sm">{devlog.reactions?.rocket || 0}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageSquare size={18} />
              <span className="text-sm">Comment</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Share2 size={18} />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading && devlogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Error state
  if (error && devlogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadDevlogs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Development Updates</h2>
          <p className="text-gray-600 mt-1">Share your progress with the team</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Create Update
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.keys(groupedDevlogs).length > 0 ? (
          Object.entries(groupedDevlogs).map(([date, dateDevlogs]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-medium text-gray-500">{date}</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Devlogs for this date */}
              <div className="space-y-4">
                {dateDevlogs.map((devlog) => (
                  <DevlogCard key={devlog._id} devlog={devlog} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No updates yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your progress!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Update
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Create Devlog Modal */}
      <CreateDevlogModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectHubId={project._id}
        onDevlogCreated={handleDevlogCreated}
      />
    </div>
  );
};

export default DevlogsTab;
