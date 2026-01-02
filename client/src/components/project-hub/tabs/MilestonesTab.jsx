import React, { useState, useEffect } from 'react';
import {
  Plus,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  MoreVertical,
  Loader2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import milestoneApi from '../../../api/milestoneApi';
import CreateMilestoneModal from '../modals/CreateMilestoneModal';

const MilestonesTab = ({ project }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneMenuOpen, setMilestoneMenuOpen] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Load milestones when project changes
  useEffect(() => {
    if (project?._id) {
      loadMilestones();
    }
  }, [project]);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await milestoneApi.getMilestonesByProject(project._id);
      // API returns { success: true, data: [...] }
      const milestonesData = response.data || response;
      console.log('Milestones data:', response);
      setMilestones(Array.isArray(milestonesData) ? milestonesData : []);
    } catch (err) {
      console.error('Error loading milestones:', err);
      setError(err.response?.data?.message || 'Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneCreated = (newMilestone) => {
    if (editingMilestone) {
      // Update existing
      setMilestones(milestones.map(m => m._id === newMilestone._id ? newMilestone : m));
    } else {
      // Add new
      setMilestones([...milestones, newMilestone]);
    }
    setShowCreateModal(false);
    setEditingMilestone(null);
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setShowCreateModal(true);
    setMilestoneMenuOpen(null);
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (!window.confirm('Are you sure you want to delete this milestone? All associated tasks will remain but will be unlinked.')) return;
    
    try {
      await milestoneApi.deleteMilestone(milestoneId);
      setMilestones(milestones.filter(m => m._id !== milestoneId));
      setMilestoneMenuOpen(null);
    } catch (err) {
      console.error('Error deleting milestone:', err);
      alert('Failed to delete milestone');
    }
  };

  const handleStatusChange = async (milestoneId, newStatus) => {
    try {
      await milestoneApi.updateMilestoneStatus(milestoneId, newStatus);
      setMilestones(milestones.map(m => 
        m._id === milestoneId ? { ...m, status: newStatus } : m
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  // Filter milestones
  const filteredMilestones = milestones.filter(m => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  // Calculate statistics
  const stats = {
    total: milestones.length,
    notStarted: milestones.filter(m => m.status === 'Not Started').length,
    inProgress: milestones.filter(m => m.status === 'In Progress').length,
    completed: milestones.filter(m => m.status === 'Completed').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString() && status !== 'Completed';
  };

  const MilestoneCard = ({ milestone }) => (
    <div className={`bg-white border rounded-xl p-6 hover:shadow-md transition-all ${getStatusColor(milestone.status)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${getStatusDotColor(milestone.status)}`} />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{milestone.title}</h3>
            {milestone.description && (
              <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
            )}
            
            {/* Progress Bar */}
            {milestone.totalTasks > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>{milestone.completedTasks} of {milestone.totalTasks} tasks completed</span>
                  <span className="font-medium">{milestone.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      milestone.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm">
              {milestone.fromDate && milestone.dueDate && (
                <span className={`flex items-center gap-1 ${
                  isOverdue(milestone.dueDate, milestone.status) ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  <Calendar size={14} />
                  {new Date(milestone.fromDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })} - {new Date(milestone.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              )}
              {!milestone.fromDate && milestone.dueDate && (
                <span className={`flex items-center gap-1 ${
                  isOverdue(milestone.dueDate, milestone.status) ? 'text-yellow-600 font-medium' : 'text-gray-500'
                }`}>
                  <Calendar size={14} />
                  Due {new Date(milestone.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              )}
              <span className={`flex items-center gap-1 ${getStatusColor(milestone.status)}`}>
                <Target size={14} />
                {milestone.status}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setMilestoneMenuOpen(milestoneMenuOpen === milestone._id ? null : milestone._id)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-gray-400" />
          </button>
          
          {milestoneMenuOpen === milestone._id && (
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
              <button
                onClick={() => handleEditMilestone(milestone)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 size={14} />
                Edit
              </button>
              {milestone.status !== 'Completed' && (
                <button
                  onClick={() => handleStatusChange(milestone._id, 'Completed')}
                  className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                >
                  <CheckCircle2 size={14} />
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => handleDeleteMilestone(milestone._id)}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
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
          onClick={loadMilestones}
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
          <h2 className="text-2xl font-bold text-gray-900">Milestones</h2>
          <p className="text-gray-600 mt-1">Track major goals and deliverables</p>
        </div>
        <button
          onClick={() => {
            setEditingMilestone(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Create Milestone
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Target size={24} className="text-gray-400" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Not Started</p>
              <p className="text-2xl font-bold text-gray-700">{stats.notStarted}</p>
            </div>
            <Clock size={24} className="text-gray-400" />
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
            </div>
            <TrendingUp size={24} className="text-blue-400" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <CheckCircle2 size={24} className="text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-600">Filter:</span>
        {['all', 'Not Started', 'In Progress', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Milestones List */}
      {filteredMilestones.length > 0 ? (
        <div className="grid gap-4">
          {filteredMilestones.map((milestone) => (
            <MilestoneCard key={milestone._id} milestone={milestone} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterStatus === 'all' ? 'No milestones yet' : `No ${filterStatus.toLowerCase()} milestones`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filterStatus === 'all' 
              ? 'Create your first milestone to start tracking progress'
              : 'Try changing the filter or create a new milestone'}
          </p>
          {filterStatus === 'all' && (
            <button
              onClick={() => {
                setEditingMilestone(null);
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Milestone
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Milestone Modal */}
      <CreateMilestoneModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingMilestone(null);
        }}
        projectHubId={project._id}
        onMilestoneCreated={handleMilestoneCreated}
        editMilestone={editingMilestone}
      />
    </div>
  );
};

export default MilestonesTab;
