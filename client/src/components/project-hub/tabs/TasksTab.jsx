import React, { useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Paperclip,
  MessageSquare,
  Filter,
  Search,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  User
} from 'lucide-react';

const TasksTab = ({ project }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Mock task data
  const [columns, setColumns] = useState({
    backlog: {
      title: 'Backlog',
      color: 'bg-gray-400',
      tasks: [
        {
          id: 1,
          title: 'Research multiplayer networking solutions',
          description: 'Evaluate different networking libraries for multiplayer support',
          priority: 'medium',
          assignees: [{ id: 1, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop' }],
          dueDate: '2024-02-20',
          comments: 3,
          attachments: 1,
          labels: ['Research', 'Networking']
        },
        {
          id: 2,
          title: 'Add localization support',
          description: 'Implement i18n for multiple languages',
          priority: 'low',
          assignees: [],
          dueDate: null,
          comments: 0,
          attachments: 0,
          labels: ['Feature']
        }
      ]
    },
    todo: {
      title: 'To Do',
      color: 'bg-blue-500',
      tasks: [
        {
          id: 3,
          title: 'Design achievement badges',
          description: 'Create visual designs for in-game achievements',
          priority: 'medium',
          assignees: [{ id: 2, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop' }],
          dueDate: '2024-02-18',
          comments: 5,
          attachments: 3,
          labels: ['Design', 'UI']
        },
        {
          id: 4,
          title: 'Implement player inventory system',
          description: 'Create inventory management with drag and drop',
          priority: 'high',
          assignees: [
            { id: 3, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop' },
            { id: 1, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop' }
          ],
          dueDate: '2024-02-15',
          comments: 8,
          attachments: 2,
          labels: ['Feature', 'Core']
        },
        {
          id: 5,
          title: 'Add haptic feedback for mobile',
          description: 'Implement vibration patterns for game events',
          priority: 'low',
          assignees: [{ id: 3, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop' }],
          dueDate: '2024-02-25',
          comments: 2,
          attachments: 0,
          labels: ['Mobile', 'UX']
        }
      ]
    },
    doing: {
      title: 'In Progress',
      color: 'bg-yellow-500',
      tasks: [
        {
          id: 6,
          title: 'Fix camera collision detection',
          description: 'Camera clips through walls in tight spaces',
          priority: 'high',
          assignees: [{ id: 3, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop' }],
          dueDate: '2024-02-14',
          comments: 12,
          attachments: 4,
          labels: ['Bug', 'Camera']
        },
        {
          id: 7,
          title: 'Create ambient music tracks',
          description: 'Compose 3 ambient tracks for exploration',
          priority: 'medium',
          assignees: [{ id: 4, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop' }],
          dueDate: '2024-02-16',
          comments: 6,
          attachments: 8,
          labels: ['Audio', 'Music']
        }
      ]
    },
    review: {
      title: 'Review',
      color: 'bg-purple-500',
      tasks: [
        {
          id: 8,
          title: 'Level 2 boss mechanics',
          description: 'Review and balance boss fight difficulty',
          priority: 'high',
          assignees: [
            { id: 1, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop' },
            { id: 2, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop' }
          ],
          dueDate: '2024-02-13',
          comments: 15,
          attachments: 5,
          labels: ['Gameplay', 'Balance']
        }
      ]
    },
    done: {
      title: 'Done',
      color: 'bg-green-500',
      tasks: [
        {
          id: 9,
          title: 'Implement save/load system',
          description: 'Auto-save and manual save functionality',
          priority: 'high',
          assignees: [{ id: 1, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop' }],
          dueDate: '2024-02-10',
          comments: 20,
          attachments: 3,
          labels: ['Core', 'Feature']
        },
        {
          id: 10,
          title: 'Main menu animations',
          description: 'Add smooth transitions to menu',
          priority: 'medium',
          assignees: [{ id: 2, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop' }],
          dueDate: '2024-02-08',
          comments: 7,
          attachments: 2,
          labels: ['UI', 'Animation']
        }
      ]
    }
  });

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={14} className="text-red-500" />;
      case 'medium':
        return <Clock size={14} className="text-yellow-500" />;
      case 'low':
        return <CheckCircle2 size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getLabelColor = (label) => {
    const colors = {
      'Bug': 'bg-red-100 text-red-700',
      'Feature': 'bg-blue-100 text-blue-700',
      'Design': 'bg-purple-100 text-purple-700',
      'UI': 'bg-pink-100 text-pink-700',
      'UX': 'bg-indigo-100 text-indigo-700',
      'Core': 'bg-orange-100 text-orange-700',
      'Research': 'bg-cyan-100 text-cyan-700',
      'Audio': 'bg-violet-100 text-violet-700',
      'Music': 'bg-fuchsia-100 text-fuchsia-700',
      'Mobile': 'bg-teal-100 text-teal-700',
      'Camera': 'bg-amber-100 text-amber-700',
      'Gameplay': 'bg-lime-100 text-lime-700',
      'Balance': 'bg-emerald-100 text-emerald-700',
      'Animation': 'bg-rose-100 text-rose-700',
      'Networking': 'bg-sky-100 text-sky-700',
    };
    return colors[label] || 'bg-gray-100 text-gray-700';
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  const TaskCard = ({ task }) => (
    <div
      onClick={() => setSelectedTask(task)}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
    >
      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.slice(0, 2).map((label) => (
            <span key={label} className={`text-xs px-2 py-0.5 rounded-full ${getLabelColor(label)}`}>
              {label}
            </span>
          ))}
          {task.labels.length > 2 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              +{task.labels.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h4 className="font-medium text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">
        {task.title}
      </h4>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {/* Assignees */}
          {task.assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee, idx) => (
                <img
                  key={assignee.id}
                  src={assignee.avatar}
                  alt=""
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              ))}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={12} className="text-gray-400" />
            </div>
          )}

          {/* Priority */}
          {getPriorityIcon(task.priority)}
        </div>

        <div className="flex items-center gap-3 text-gray-400">
          {/* Due Date */}
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${
              isOverdue(task.dueDate) ? 'text-red-500' : ''
            }`}>
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}

          {/* Comments */}
          {task.comments > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <MessageSquare size={12} />
              {task.comments}
            </span>
          )}

          {/* Attachments */}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <Paperclip size={12} />
              {task.attachments}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
              filterOpen ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="flex-shrink-0 w-72">
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {column.tasks.length}
              </span>
              <button className="ml-auto text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}

              {/* Add Task Button */}
              <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 text-sm">
                <Plus size={16} />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPriorityIcon(selectedTask.priority)}
                <h2 className="text-xl font-bold text-gray-900">{selectedTask.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Labels */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.labels.map((label) => (
                    <span key={label} className={`text-sm px-3 py-1 rounded-full ${getLabelColor(label)}`}>
                      {label}
                    </span>
                  ))}
                  <button className="text-sm px-3 py-1 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500">
                    + Add
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                <p className="text-gray-700">{selectedTask.description}</p>
              </div>

              {/* Assignees */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Assignees</h4>
                <div className="flex items-center gap-2">
                  {selectedTask.assignees.map((assignee) => (
                    <img
                      key={assignee.id}
                      src={assignee.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                    />
                  ))}
                  <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Due Date</h4>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                  selectedTask.dueDate && isOverdue(selectedTask.dueDate)
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <Calendar size={16} />
                  {selectedTask.dueDate
                    ? new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'No due date'}
                </div>
              </div>

              {/* Checklist placeholder */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Checklist</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" defaultChecked />
                    <span className="text-gray-600 line-through">Setup development environment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" defaultChecked />
                    <span className="text-gray-600 line-through">Write initial code structure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                    <span className="text-gray-700">Implement core functionality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                    <span className="text-gray-700">Write unit tests</span>
                  </div>
                </div>
              </div>

              {/* Activity placeholder */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Activity</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop"
                      alt=""
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm">
                        <span className="font-medium">Alex Chen</span>
                        <span className="text-gray-500"> added this task</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTab;
