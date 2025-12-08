import React from 'react';
import { Globe, MapPin } from 'lucide-react';

const ContactSection = ({ website, location }) => {
  if (!website && !location) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 mt-0 lg:mt-0">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Contact</h2>
      <div className="space-y-3">
        {website && (
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Globe className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700">{website}</span>
          </a>
        )}
        {location && (
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700">{location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
