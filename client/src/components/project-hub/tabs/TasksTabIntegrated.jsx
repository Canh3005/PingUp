import React, { useState, useEffect } from 'react';
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
  User,
  Loader2
} from 'lucide-react';
import taskApi from '../../../api/taskApi';

const TasksTabIntegrated = ({ project }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Column configuration
  const columnConfig = {
    backlog: { title: 'Backlog', color: 'bg-gray-400' },
    todo: { title: 'To Do', color: 'bg-blue-500' },
    doing: { title: 'In Progress', color: 'bg-yellow-500' },
    review: { title: 'Review', color: 'bg-purple-500' },
    done: { title: 'Done', color: 'bg-green-500' },
  };

  // Load tasks
  useEffect(() => {
    if (project?._id) {
      loadTasks();
    }
  }, [project]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await taskApi.getTasksByProjectHub(project._id);
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Group tasks by column
  const groupedTasks = Object.keys(columnConfig).reduce((acc, columnKey) => {
    acc[columnKey] = tasks.filter((task) => task.column === columnKey);
    return acc;
  }, {});

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
      {task.labels && task.labels.length > 0 && (
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
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee, idx) => (
                <img
                  key={assignee._id || idx}
                  src={assignee.avatarUrl || 'https://via.placeholder.com/50'}
                  alt={assignee.name}
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

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <Paperclip size={12} />
              {task.attachments.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadTasks}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

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
        {Object.entries(columnConfig).map(([columnId, column]) => (
          <div key={columnId} className="flex-shrink-0 w-72">
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {groupedTasks[columnId]?.length || 0}
              </span>
              <button className="ml-auto text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
              {groupedTasks[columnId]?.map((task) => (
                <TaskCard key={task._id} task={task} />
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

      {/* Task Detail Modal - Simplified for now */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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

            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                <p className="text-gray-700">{selectedTask.description || 'No description'}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                <p className="text-gray-700">{selectedTask.status}</p>
              </div>

              {selectedTask.dueDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Due Date</h4>
                  <p className="text-gray-700">
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTabIntegrated;
