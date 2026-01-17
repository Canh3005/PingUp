import React from 'react';
import { Lock, Home, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = ({ projectName }) => {
  const navigate = useNavigate();

  const handleRequestAccess = () => {
    // TODO: Implement request access functionality
    // This could open a modal or send a notification to project owner
    console.log('Request access clicked');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={32} className="text-red-600" />
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Private Project
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-6">
          {projectName ? (
            <>
              <span className="font-semibold">{projectName}</span> is a private project. 
              Only the owner and invited team members can access it.
            </>
          ) : (
            'This project is private. Only the owner and invited team members can access it.'
          )}
        </p>
        
        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home size={20} />
            Go to Home
          </button>
          
          <button
            onClick={handleRequestAccess}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Mail size={20} />
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
