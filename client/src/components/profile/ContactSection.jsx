import React from 'react';
import { Globe, MapPin, Mail } from 'lucide-react';

const ContactSection = ({ website, location }) => {
  if (!website && !location) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Mail className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Contact</h2>
      </div>
      <div className="space-y-3">
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
          >
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700 font-medium truncate group-hover:text-blue-600 transition-colors">{website}</span>
          </a>
        )}
        {location && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <MapPin className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-sm text-gray-700 font-medium">{location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
