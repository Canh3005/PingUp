import React, { useState, useEffect, useRef } from 'react';
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
import milestoneApi from '../../../api/milestoneApi';
import CreateTaskModal from '../modals/CreateTaskModal';
import { getAllLabelTypes, getLabelColor as getConstantLabelColor } from '../../../constants/labelTypes';

const TasksTab = ({ project }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);
  const labelDropdownRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Column configuration
  const columnConfig = {
    backlog: { title: 'Backlog', color: 'bg-gray-400' },
    todo: { title: 'To Do', color: 'bg-blue-500' },
    doing: { title: 'In Progress', color: 'bg-yellow-500' },
    review: { title: 'Review', color: 'bg-purple-500' },
    done: { title: 'Done', color: 'bg-green-500' },
  };

  // Load tasks when project changes
  useEffect(() => {
    if (project?._id) {
      loadTasks();
      loadMilestones();
      loadAvailableLabels();
    }
  }, [project]);

  // Handle click outside to close label dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (labelDropdownRef.current && !labelDropdownRef.current.contains(event.target)) {
        setShowLabelDropdown(false);
      }
    };

    if (showLabelDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLabelDropdown]);

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

  const loadMilestones = async () => {
    try {
      const response = await milestoneApi.getMilestonesByProject(project._id);
      const milestonesData = response.data || response;
      setMilestones(Array.isArray(milestonesData) ? milestonesData : []);
    } catch (err) {
      console.error('Error loading milestones:', err);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    loadTasks(); // Reload to get fresh data
  };

  const loadAvailableLabels = () => {
    const labels = getAllLabelTypes();
    setAvailableLabels(labels);
  };

  const handleAddLabel = async (label) => {
    try {
      await taskApi.addLabel(selectedTask._id, { label });
      // Update local state
      setSelectedTask({
        ...selectedTask,
        labels: [...selectedTask.labels, label]
      });
      // Update tasks list
      setTasks(tasks.map(t => 
        t._id === selectedTask._id 
          ? { ...t, labels: [...t.labels, label] }
          : t
      ));
      setShowLabelDropdown(false);
    } catch (err) {
      console.error('Error adding label:', err);
      alert(err.response?.data?.message || 'Failed to add label');
    }
  };

  const handleRemoveLabel = async (label) => {
    try {
      await taskApi.removeLabel(selectedTask._id, { label });
      // Update local state
      setSelectedTask({
        ...selectedTask,
        labels: selectedTask.labels.filter(l => l !== label)
      });
      // Update tasks list
      setTasks(tasks.map(t => 
        t._id === selectedTask._id 
          ? { ...t, labels: t.labels.filter(l => l !== label) }
          : t
      ));
    } catch (err) {
      console.error('Error removing label:', err);
      alert(err.response?.data?.message || 'Failed to remove label');
    }
  };

  const handleEditTask = () => {
    setIsEditMode(true);
    setEditedTask({ ...selectedTask });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedTask(null);
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const updateData = {
        title: editedTask.title,
        description: editedTask.description,
        priority: editedTask.priority,
        column: editedTask.column,
        dueDate: editedTask.dueDate,
      };
      
      const updatedTask = await taskApi.updateTask(selectedTask._id, updateData);
      
      // Update local state
      setSelectedTask(updatedTask);
      setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
      setIsEditMode(false);
      setEditedTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      alert(err.response?.data?.message || 'Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  // Group tasks by column
  const columns = Object.keys(columnConfig).reduce((acc, columnKey) => {
    acc[columnKey] = {
      ...columnConfig[columnKey],
      tasks: tasks.filter((task) => task.column === columnKey),
    };
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
    return getConstantLabelColor(label);
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
          {task.labels.slice(0, 2).map((label, idx) => (
            <span key={idx} className={`text-xs px-2 py-0.5 rounded-full ${getLabelColor(label)}`}>
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
                  src={assignee.avatarUrl || assignee.avatar || 'https://via.placeholder.com/50'}
                  alt={assignee.name || ''}
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

          {/* Comments - placeholder for now */}
          {task.comments > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <MessageSquare size={12} />
              {task.comments}
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Error state
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

        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
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
                <TaskCard key={task._id} task={task} />
              ))}

              {/* Add Task Button */}
              <button 
                onClick={() => setShowCreateModal(true)}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 text-sm"
              >
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
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                {getPriorityIcon(selectedTask.priority)}
                {isEditMode ? (
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900">{selectedTask.title}</h2>
                )}
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Labels */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.labels && selectedTask.labels.length > 0 ? (
                    selectedTask.labels.map((label) => (
                      <span key={label} className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full ${getLabelColor(label)}`}>
                        {label}
                        <button
                          onClick={() => handleRemoveLabel(label)}
                          className="hover:text-red-600 transition-colors"
                          title="Remove label"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">No labels</span>
                  )}
                  <div className="relative" ref={labelDropdownRef}>
                    <button 
                      onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                      className="text-sm px-3 py-1 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
                    >
                      + Add
                    </button>
                    
                    {/* Label Dropdown */}
                    {showLabelDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-48 max-h-64 overflow-y-auto">
                        <div className="p-2">
                          <p className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">Select a label</p>
                          {availableLabels
                            .filter(label => !selectedTask.labels.includes(label))
                            .map((label) => (
                              <button
                                key={label}
                                onClick={() => handleAddLabel(label)}
                                className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded transition-colors flex items-center gap-2"
                              >
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${getLabelColor(label)}`}>
                                  {label}
                                </span>
                              </button>
                            ))}
                          {availableLabels.filter(label => !selectedTask.labels.includes(label)).length === 0 && (
                            <p className="text-xs text-gray-400 italic px-2 py-2">All labels are already added</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                {isEditMode ? (
                  <textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Add a description..."
                  />
                ) : selectedTask.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTask.description}</p>
                ) : (
                  <p className="text-gray-400 italic">No description provided</p>
                )}
              </div>

              {/* Assignees */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Assignees</h4>
                <div className="flex items-center gap-2">
                  {selectedTask.assignees && selectedTask.assignees.length > 0 ? (
                    selectedTask.assignees.map((assignee) => (
                      <div key={assignee._id} className="flex items-center gap-2">
                        <img
                          src={assignee.avatarUrl || assignee.avatar || 'https://via.placeholder.com/50'}
                          alt={assignee.name || 'User'}
                          className="w-8 h-8 rounded-full border-2 border-white shadow"
                          title={assignee.name}
                        />
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No assignees yet</span>
                  )}
                  <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Due Date</h4>
                {isEditMode ? (
                  <input
                    type="date"
                    value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
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
                )}
              </div>

              {/* Milestone */}
              {selectedTask.mileStoneId && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Milestone</h4>
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg">
                    <span className="font-medium">
                      {typeof selectedTask.mileStoneId === 'object' 
                        ? selectedTask.mileStoneId.title 
                        : 'Milestone'}
                    </span>
                  </div>
                </div>
              )}

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                  {isEditMode ? (
                    <select
                      value={editedTask.column}
                      onChange={(e) => setEditedTask({ ...editedTask, column: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="doing">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
                      {selectedTask.column === 'backlog' && 'Backlog'}
                      {selectedTask.column === 'todo' && 'To Do'}
                      {selectedTask.column === 'doing' && 'In Progress'}
                      {selectedTask.column === 'review' && 'Review'}
                      {selectedTask.column === 'done' && 'Done'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Priority</h4>
                  {isEditMode ? (
                    <select
                      value={editedTask.priority}
                      onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                      selectedTask.priority === 'high' ? 'bg-red-50 text-red-700' :
                      selectedTask.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {getPriorityIcon(selectedTask.priority)}
                      <span className="capitalize">{selectedTask.priority}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Activity</h4>
                <div className="space-y-3">
                  {/* Task Created */}
                  {selectedTask.createdBy && (
                    <div className="flex gap-3">
                      <img
                        src={selectedTask.createdBy.avatarUrl || selectedTask.createdBy.avatar || 'https://via.placeholder.com/50'}
                        alt={selectedTask.createdBy.name || 'User'}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <p className="text-sm">
                          <span className="font-medium">{selectedTask.createdBy.name || 'Unknown User'}</span>
                          <span className="text-gray-500"> created this task</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {selectedTask.createdAt 
                            ? new Date(selectedTask.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Recently'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setIsEditMode(false);
                  setEditedTask(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {isEditMode ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleEditTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Task
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectHubId={project?._id}
        milestones={milestones}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default TasksTab;
