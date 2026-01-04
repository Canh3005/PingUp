import React from 'react';
import { X, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const ApplicationDetailsModal = ({ 
  isOpen, 
  onClose, 
  application, 
  onStatusUpdate,
  updatingStatus,
  getApplicantStatusBadge
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Applicant Info */}
          <div className="flex items-start gap-4">
            <img
              src={application.applicant?.avatarUrl || '/default-avatar.png'}
              alt={application.applicant?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {application.applicant?.name || 'Unknown'}
                </h3>
                {getApplicantStatusBadge(application.status)}
              </div>
              <p className="text-gray-600 mb-2">
                {application.applicant?.userId?.email || 'No email provided'}
              </p>
              <p className="text-sm text-gray-500">
                Applied on {new Date(application.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Role Applied For */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Applied for</h4>
            <p className="text-lg font-semibold text-gray-900">
              {application.recruitment?.title || 'Unknown Role'}
            </p>
          </div>

          {/* Cover Note */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Note</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-line">
                {application.coverNote || 'No cover note provided'}
              </p>
            </div>
          </div>

          {/* Portfolio */}
          {application.portfolio && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Portfolio</h4>
              <a
                href={application.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
              >
                <ExternalLink size={16} />
                {application.portfolio}
              </a>
            </div>
          )}

          {/* Review Notes (if any) */}
          {application.reviewNotes && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Review Notes</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-line">
                  {application.reviewNotes}
                </p>
              </div>
            </div>
          )}

          {/* Status History */}
          {application.reviewedAt && (
            <div className="text-sm text-gray-500">
              Last updated: {new Date(application.reviewedAt).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {(application.status === 'pending' || application.status === 'shortlisted') && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={() => onStatusUpdate(application._id, 'rejected')}
              disabled={updatingStatus}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <XCircle size={16} />
              Reject
            </button>
            <button
              onClick={() => onStatusUpdate(application._id, 'accepted')}
              disabled={updatingStatus}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {updatingStatus ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
