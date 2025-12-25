import React, { useState, useEffect, useRef } from 'react';
import { MapPin, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi';
import chatApi from '../../api/chatApi';
import HireBanner from './HireBanner';

const PeopleGrid = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const navigate = useNavigate();

  // Handle message button click
  const handleMessageClick = async (userId, e) => {
    e.stopPropagation(); // Prevent triggering other clicks
    try {
      const data = await chatApi.createConversation({
        type: 'direct',
        memberIds: [userId],
        title: '',
        avatar: '',
      });
      navigate(`/message/${data.conversation._id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  // Fetch users
  const fetchUsers = async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await userApi.discoverUsers(pageNum, 12);
      
      if (pageNum === 1) {
        setUsers(response.data);
      } else {
        setUsers(prev => [...prev, ...response.data]);
      }

      setHasMore(response.pagination.page < response.pagination.pages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Navigate to user profile
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Initial load
  useEffect(() => {
    fetchUsers(1);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadingMore]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchUsers(page);
    }
  }, [page]);

  return (
    <div className="w-full px-6 py-8">
      {/* Hire Banner - Always visible */}
      <HireBanner />

      {/* Loading state or Users Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div 
                key={user._id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Project Thumbnails */}
                <div className="grid grid-cols-4 gap-0.5 bg-gray-100">
                  {user.projects.length > 0 ? (
                    user.projects.slice(0, 4).map((project, idx) => (
                      <div key={idx} className="aspect-square overflow-hidden">
                        <img 
                          src={project || 'https://via.placeholder.com/200'} 
                          alt={`Project ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))
                  ) : (
                    // Placeholder if no projects
                    [1, 2, 3, 4].map((idx) => (
                      <div key={idx} className="aspect-square bg-gray-200"></div>
                    ))
                  )}
                </div>

                {/* User Info */}
                <div className="p-6">
                  {/* Avatar & Name - Clickable */}
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={user.profile.avatarUrl || 'https://via.placeholder.com/64'} 
                      alt={user.profile.name}
                      onClick={() => handleUserClick(user._id)}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 cursor-pointer hover:ring-blue-500 transition-all"
                    />
                    <div className="flex-1">
                      <h3 
                        onClick={() => handleUserClick(user._id)}
                        className="font-bold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        {user.profile.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{user.profile.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.tags.map((tag, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{user.stats.appreciations}</div>
                      <div className="text-xs text-gray-500">Appreciations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{user.stats.followers}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{user.stats.projectViews}</div>
                      <div className="text-xs text-gray-500">Project Views</div>
                    </div>
                  </div>

                  {/* Message Button */}
                  <button 
                    onClick={(e) => handleMessageClick(user._id, e)}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message {user.profile.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite scroll observer target */}
          <div ref={observerTarget} className="h-20 flex items-center justify-center">
            {loadingMore && (
              <div className="text-gray-500">Loading more people...</div>
            )}
            {!hasMore && users.length > 0 && (
              <div className="text-gray-400">No more people to load</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PeopleGrid;


