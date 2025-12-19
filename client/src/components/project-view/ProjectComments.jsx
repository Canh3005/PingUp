import React, { useState, useEffect } from 'react';
import { Heart, Eye, MessageCircle, UserPlus, Mail, Trash2, Send, MapPin, Calendar, Tag } from 'lucide-react';
import projectApi from '../../api/projectApi';
import { useAuth } from '../../context/authContext';

const ProjectComments = ({ project, projectId, isOwnProject, isFollowing, isFollowLoading, onFollowToggle }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await projectApi.getComments(projectId);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await projectApi.addComment(projectId, comment);
      console.log('Posted comment response:', response);

      setComments([response.data, ...comments]);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await projectApi.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await projectApi.toggleCommentLike(commentId);

      setComments(comments.map(c =>
        c._id === commentId
          ? {
              ...c,
              likes: response.data.isLiked
                ? [...c.likes, user.id]
                : c.likes.filter(id => id !== user.id),
              likesCount: response.data.likesCount
            }
          : c
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleViewProfile = (author) => {
    if (author?._id) {
      window.open(`/profile/${author._id}`, '_blank');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return 'a day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const tagColors = [
    'bg-blue-50 text-blue-700 border-blue-100',
    'bg-purple-50 text-purple-700 border-purple-100',
    'bg-green-50 text-green-700 border-green-100',
    'bg-orange-50 text-orange-700 border-orange-100',
    'bg-pink-50 text-pink-700 border-pink-100',
  ];

  return (
    <div id="project-comments" className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-b from-slate-50 to-white rounded-t-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comments Section - Left 2/3 */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Comments</h2>
            <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-sm text-gray-600 font-medium">
              {comments.length}
            </span>
          </div>

          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex gap-4">
              <img
                src={user?.profile?.avatarUrl || user?.imageUrl || 'https://via.placeholder.com/40'}
                alt="Current user"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-gray-100"
              />
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts on this project..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
                  rows="3"
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={!comment.trim() || isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none font-medium"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageCircle className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No comments yet</p>
              <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((commentItem) => (
                <div key={commentItem._id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all group">
                  <img
                    src={commentItem.author?.profile?.avatarUrl || commentItem.author?.imageUrl || 'https://via.placeholder.com/40'}
                    alt={commentItem.author?.profile?.name || commentItem.author?.userName}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors" onClick={() => handleViewProfile(commentItem.author)}>
                        {commentItem.author?.profile?.name || commentItem.author?.userName}
                      </h4>
                      {commentItem.author?.profile?.jobTitle && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg">
                          {commentItem.author.profile.jobTitle}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{formatDate(commentItem.createdAt)}</span>
                      {user && commentItem.author?._id === user.id && (
                        <button
                          onClick={() => handleDeleteComment(commentItem._id)}
                          className="ml-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">{commentItem.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(commentItem._id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                          commentItem.likes?.includes(user?.id)
                            ? 'bg-red-50 text-red-600'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${commentItem.likes?.includes(user?.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{commentItem.likesCount || commentItem.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-lg transition-all text-sm font-medium">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Right 1/3 */}
        <div className="lg:col-span-1 space-y-6">
          {/* Owner Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Owner</span>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <img
                  src={project.owner?.profile?.avatarUrl || project.owner?.imageUrl || 'https://via.placeholder.com/60'}
                  alt={project.owner?.profile?.name || 'User'}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-lg border-2 border-white"></div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{project.owner?.profile?.name || project.owner?.userName || 'Unknown User'}</h4>
                {project.owner?.profile?.location && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {project.owner.profile.location}
                  </p>
                )}
              </div>
            </div>
            {!isOwnProject && (<div className="flex gap-2">
              <button 
                onClick={onFollowToggle}
                disabled={isFollowLoading}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFollowing
                    ? 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="p-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                <Mail className="w-4 h-4" />
              </button>
            </div>)}
          </div>

          {/* Project Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 mb-4 line-clamp-2">{project.title}</h3>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <span className="block font-bold text-gray-900">{project.likes?.length || 0}</span>
                <span className="text-xs text-gray-500">Likes</span>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <Eye className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="block font-bold text-gray-900">{project.views || 0}</span>
                <span className="text-xs text-gray-500">Views</span>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <MessageCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <span className="block font-bold text-gray-900">{comments.length}</span>
                <span className="text-xs text-gray-500">Comments</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                Published {project.publishedAt ? new Date(project.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Not published'}
              </span>
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium border cursor-pointer hover:scale-105 transition-transform ${tagColors[index % tagColors.length]}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectComments;
