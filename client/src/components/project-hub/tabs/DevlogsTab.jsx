import React, { useState } from 'react';
import {
  Plus,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Image,
  Video,
  FileText,
  Bold,
  Italic,
  List,
  Link2,
  X,
  Send,
  Smile
} from 'lucide-react';

const DevlogsTab = ({ project }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState(null);

  // Mock devlog data
  const devlogs = [
    {
      id: 1,
      title: 'Major Update: New Particle System & Visual Effects',
      content: `We're excited to share our latest progress on the visual effects system! After weeks of development, we've implemented a stunning particle system that brings our space environments to life.

Key highlights:
• Dynamic nebula effects with real-time color blending
• Optimized particle rendering for 60fps on mobile devices
• New asteroid field generation with collision particles
• Improved lighting for ship engines and weapons

The team has been working incredibly hard on this, and we can't wait to show you more in the upcoming beta!`,
      author: {
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
        role: 'Project Lead'
      },
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=400&fit=crop' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=400&fit=crop' },
      ],
      date: '2024-02-12',
      time: '14:30',
      reactions: { heart: 24, fire: 12, rocket: 8 },
      comments: [
        {
          id: 1,
          author: { name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop' },
          content: 'This looks absolutely stunning! Can\'t wait to see it in action.',
          time: '2 hours ago'
        },
        {
          id: 2,
          author: { name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop' },
          content: 'Great work on the optimization. Mobile performance was a big concern.',
          time: '1 hour ago'
        }
      ]
    },
    {
      id: 2,
      title: 'UI/UX Overhaul: Main Menu Redesign',
      content: `The user interface has received a complete makeover! Our goal was to create a more immersive and intuitive experience that matches the game's sci-fi aesthetic.

Changes include:
• New holographic-style menu animations
• Improved navigation flow
• Dynamic background scenes
• Accessibility improvements (color contrast, font sizes)

Check out the before/after comparison below!`,
      author: {
        name: 'Sarah Kim',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
        role: 'UI Designer'
      },
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=400&fit=crop' },
      ],
      date: '2024-02-10',
      time: '16:45',
      reactions: { heart: 32, fire: 18, rocket: 5 },
      comments: [
        {
          id: 1,
          author: { name: 'Emily Wang', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop' },
          content: 'Love the new animations! They feel so smooth.',
          time: '1 day ago'
        }
      ]
    },
    {
      id: 3,
      title: 'Sound Design Update: Ambient Tracks Complete',
      content: `Exciting news from the audio department! We've completed the ambient soundtrack for the exploration segments of the game.

What's new:
• 5 unique ambient tracks for different space regions
• Dynamic music system that responds to gameplay
• New engine sound effects with spatial audio
• Environmental audio (asteroid impacts, station ambience)

Here's a sneak peek of the main exploration theme:`,
      author: {
        name: 'Emily Wang',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
        role: 'Sound Designer'
      },
      media: [
        { type: 'audio', url: '#', title: 'Exploration Theme - Preview' },
      ],
      date: '2024-02-08',
      time: '11:20',
      reactions: { heart: 18, fire: 8, rocket: 15 },
      comments: []
    },
    {
      id: 4,
      title: 'Weekly Progress Report #12',
      content: `Here's our weekly summary of development progress:

Completed:
✅ Save/Load system implementation
✅ Tutorial mission scripting
✅ Bug fixes for level transitions

In Progress:
🔄 Multiplayer networking prototype
🔄 Character customization system
🔄 Achievement system

Upcoming:
📋 Beta testing preparation
📋 Marketing materials
📋 Steam page setup

Thanks for your continued support! See you next week.`,
      author: {
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
        role: 'Project Lead'
      },
      media: [],
      date: '2024-02-05',
      time: '18:00',
      reactions: { heart: 45, fire: 22, rocket: 30 },
      comments: [
        {
          id: 1,
          author: { name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop' },
          content: 'Multiplayer hype! This is going to be amazing.',
          time: '3 days ago'
        }
      ]
    }
  ];

  // Group devlogs by date
  const groupedDevlogs = devlogs.reduce((groups, devlog) => {
    const date = devlog.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(devlog);
    return groups;
  }, {});

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };

  const getTotalReactions = (reactions) => {
    return Object.values(reactions).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Development Timeline</h2>
          <p className="text-gray-500 mt-1">Track progress and share updates with your team</p>
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
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {Object.entries(groupedDevlogs).map(([date, logs]) => (
          <div key={date} className="mb-8">
            {/* Date Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center z-10">
                <FileText size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{formatDate(date)}</h3>
            </div>

            {/* Devlog Cards */}
            <div className="ml-16 space-y-6">
              {logs.map((devlog) => (
                <div key={devlog.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={devlog.author.avatar}
                          alt={devlog.author.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{devlog.author.name}</p>
                          <p className="text-sm text-gray-500">{devlog.author.role} • {devlog.time}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mt-4">{devlog.title}</h4>
                    <div className="mt-3 text-gray-700 whitespace-pre-line">{devlog.content}</div>
                  </div>

                  {/* Media */}
                  {devlog.media.length > 0 && (
                    <div className={`px-6 pb-4 ${devlog.media.length > 1 ? 'grid grid-cols-2 gap-2' : ''}`}>
                      {devlog.media.map((media, idx) => (
                        media.type === 'image' ? (
                          <img
                            key={idx}
                            src={media.url}
                            alt=""
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : media.type === 'audio' ? (
                          <div key={idx} className="bg-gray-100 rounded-lg p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                              <Video size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{media.title}</p>
                              <p className="text-sm text-gray-500">Audio Preview</p>
                            </div>
                          </div>
                        ) : null
                      ))}
                    </div>
                  )}

                  {/* Reactions & Actions */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors">
                            <Heart size={18} />
                            <span className="text-sm">{devlog.reactions.heart}</span>
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors">
                            <span>🔥</span>
                            <span className="text-sm">{devlog.reactions.fire}</span>
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-500 transition-colors">
                            <span>🚀</span>
                            <span className="text-sm">{devlog.reactions.rocket}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedComments(expandedComments === devlog.id ? null : devlog.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <MessageSquare size={18} />
                          <span className="text-sm">{devlog.comments.length} Comments</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {expandedComments === devlog.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {devlog.comments.length > 0 ? (
                          <div className="space-y-4 mb-4">
                            {devlog.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <img
                                  src={comment.author.avatar}
                                  alt={comment.author.name}
                                  className="w-8 h-8 rounded-full flex-shrink-0"
                                />
                                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium text-sm text-gray-900">{comment.author.name}</p>
                                    <p className="text-xs text-gray-400">{comment.time}</p>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                        )}

                        {/* Add Comment */}
                        <div className="flex gap-3">
                          <img
                            src={project.members[0].avatar}
                            alt=""
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              className="flex-1 bg-transparent text-sm focus:outline-none"
                            />
                            <button className="text-gray-400 hover:text-gray-600">
                              <Smile size={18} />
                            </button>
                            <button className="text-blue-600 hover:text-blue-700">
                              <Send size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Devlog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Development Update</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="What did you work on?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                {/* Simple Editor Toolbar */}
                <div className="flex items-center gap-1 p-2 border border-gray-300 border-b-0 rounded-t-lg bg-gray-50">
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Bold size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Italic size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <List size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Link2 size={16} />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Image size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Video size={16} />
                  </button>
                </div>
                <textarea
                  rows={8}
                  placeholder="Share your progress, challenges, or achievements..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Media Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media (optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <div className="flex justify-center gap-4 mb-3">
                    <Image size={24} className="text-gray-400" />
                    <Video size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600">Drag and drop files here, or click to browse</p>
                  <p className="text-sm text-gray-400 mt-1">Supports images, videos, and audio files</p>
                </div>
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
                Publish Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevlogsTab;
