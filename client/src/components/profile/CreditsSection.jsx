import React from 'react';
import { Award, TrendingUp } from 'lucide-react';

const CreditsSection = () => {
  const credits = 450;
  const maxCredits = 1000;
  const level = 'Intermediate';
  const progress = (credits / maxCredits) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
          <Award className="w-5 h-5 text-yellow-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Credits</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{credits}</span>
            <span className="text-sm text-gray-400">/ {maxCredits}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-medium text-green-600">+25 this week</span>
          </div>
        </div>

        <div className="relative">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{level}</span>
          <span className="text-xs text-gray-400">{maxCredits - credits} to next level</span>
        </div>
      </div>
    </div>
  );
};

export default CreditsSection;
