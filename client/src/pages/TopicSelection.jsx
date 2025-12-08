import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import topics from '../constants/topics.js';
import { toast } from 'react-hot-toast';
import authApi from '../api/authApi.js';
import { useAuth } from '../context/authContext';

const TopicSelection = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedTopics, setSelectedTopics] = useState([]);

  const toggleTopic = (topicKey) => {
    setSelectedTopics(prev => 
      prev.includes(topicKey) 
        ? prev.filter(key => key !== topicKey)
        : [...prev, topicKey]
    );
  };

  const handleContinue = async () => {
    if (selectedTopics.length > 0) {
      try {
        const data = await authApi.updateUserTopics(selectedTopics);
        console.log("User topics updated successfully:", data);
        toast.success("User topics updated successfully");
        // Update user in context
        if (data.user) {
          login(data.user);
        }
        navigate('/');
      } catch (error) {
        console.error("Error updating user topics:", error);
        toast.error("Failed to update user topics");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 overflow-hidden -mt-16 bg-gradient-to-b">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full h-[85vh] flex flex-col mt-15">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pick one or more topics
          </h1>
          <p className="text-gray-600">
            This will help us recommend creative work you'll love
          </p>
        </div>

        {/* Topics Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic) => {
              const isSelected = selectedTopics.includes(topic.key);
              const Icon = topic.icon;
              
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.key)}
                  className={`group relative overflow-hidden rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'border-gray-900 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-900'
                  }`}
                >
                  {/* Images Grid */}
                  <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
                    {topic.images.map((img, idx) => (
                      <div 
                        key={idx}
                        className="aspect-square overflow-hidden"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Topic Name */}
                  <div className="p-4 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-gray-900' : 'text-gray-600'}`} />
                      <span className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
                        {topic.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end flex-shrink-0">
          <button
            onClick={() => handleContinue()}
            disabled={selectedTopics.length === 0}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              selectedTopics.length > 0
                ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedTopics.length > 0 
              ? `Continue with ${selectedTopics.length} ${selectedTopics.length === 1 ? 'topic' : 'topics'}`
              : 'Follow at least 1 category to continue'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;
