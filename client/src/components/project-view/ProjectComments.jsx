import React, { useState, useEffect } from 'react';
import { ThumbsUp, Eye, MessageCircle, UserPlus, Mail, Trash2 } from 'lucide-react';
import projectApi from '../../api/projectApi';
import { useAuth } from '../../context/authContext';

const ProjectComments = ({ project, projectId }) => {
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
      
      // Add new comment to the top
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
      
      // Update comment like state
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comments Section - Left 2/3 */}
        <div className="lg:col-span-2">
          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex gap-4">
              <img
                src={user?.profile?.avatarUrl || 'https://via.placeholder.com/40'}
                alt="Current user"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What are your thoughts on this project?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  rows="3"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!comment.trim() || isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? 'Posting...' : 'Post a Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</div>
          ) : (
            <div className="space-y-6">
              {comments.map((commentItem) => (
                <div key={commentItem._id} className="flex gap-4">
                  <img
                    src={commentItem.author?.profile?.avatarUrl || commentItem.author?.imageUrl || 'https://via.placeholder.com/40'}
                    alt={commentItem.author?.profile?.name || commentItem.author?.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {commentItem.author?.profile?.name || commentItem.author?.userName}
                      </h4>
                      {commentItem.author?.profile?.jobTitle && (
                        <span className="text-sm text-gray-500">· {commentItem.author.profile.jobTitle}</span>
                      )}
                      <span className="text-sm text-gray-500">· {formatDate(commentItem.createdAt)}</span>
                      {user && commentItem.author?._id === user.id && (
                        <button
                          onClick={() => handleDeleteComment(commentItem._id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{commentItem.content}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button
                        onClick={() => handleLikeComment(commentItem._id)}
                        className={`flex items-center gap-1 ${
                          commentItem.likes?.includes(user?.id) 
                            ? 'text-blue-600' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{commentItem.likesCount || commentItem.likes?.length || 0}</span>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Right 1/3 */}
        <div className="lg:col-span-1">
          {/* Owner Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-4">OWNER</h3>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={project.owner?.profile?.avatarUrl || 'https://via.placeholder.com/60'}
                alt={project.owner?.profile?.name || 'User'}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-bold text-gray-900">{project.owner?.profile?.name || 'Unknown User'}</h4>
                <p className="text-sm text-gray-600">{project.owner?.profile?.location || 'Seoul, Korea, Republic of'}</p>
              </div>
            </div>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-2 flex items-center justify-center gap-2 cursor-pointer">
              <UserPlus className="w-4 h-4" />
              Follow
            </button>
            <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Mail className="w-4 h-4" />
              Message
            </button>
          </div>

          {/* Project Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{project.likes?.length || 86}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{project.views || 531}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Published: {project.publishedAt ? new Date(project.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'September 5th 2025'}
            </p>
          </div>

          {/* Creative Fields */}
          {project.category && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-4">CREATIVE FIELDS</h3>
              <div className="space-y-2">
                <div 
                  className="relative h-24 rounded-lg overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: 'url(https://via.placeholder.com/400x100/8B5CF6/FFFFFF?text=Toy+Design)' }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="text-white font-bold">Toy Design</span>
                  </div>
                </div>
                <div 
                  className="relative h-24 rounded-lg overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: 'url(https://via.placeholder.com/400x100/6B7280/FFFFFF?text=Character+Design)' }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="text-white font-bold">Character Design</span>
                  </div>
                </div>
                <div 
                  className="relative h-24 rounded-lg overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: 'url(https://via.placeholder.com/400x100/DC2626/FFFFFF?text=3D+Modeling)' }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="text-white font-bold">3D Modeling</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
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
