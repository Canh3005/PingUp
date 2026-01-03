// Task Label Types Constants
// Predefined labels for task categorization

export const LABEL_TYPES = {
  BUG: 'Bug',
  FEATURE: 'Feature',
  DESIGN: 'Design',
  UI: 'UI',
  UX: 'UX',
  CORE: 'Core',
  RESEARCH: 'Research',
  AUDIO: 'Audio',
  MUSIC: 'Music',
  MOBILE: 'Mobile',
  CAMERA: 'Camera',
  GAMEPLAY: 'Gameplay',
  BALANCE: 'Balance',
  ANIMATION: 'Animation',
  NETWORKING: 'Networking',
  TESTING: 'Testing',
  DOCUMENTATION: 'Documentation',
  PERFORMANCE: 'Performance',
  SECURITY: 'Security',
  DATABASE: 'Database',
  API: 'API',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DEVOPS: 'DevOps',
  HOTFIX: 'Hotfix',
  ENHANCEMENT: 'Enhancement',
  REFACTOR: 'Refactor',
  MAINTENANCE: 'Maintenance',
};

// Label colors for UI display
export const LABEL_COLORS = {
  [LABEL_TYPES.BUG]: { bg: 'bg-red-100', text: 'text-red-700', hex: '#fee2e2' },
  [LABEL_TYPES.FEATURE]: { bg: 'bg-blue-100', text: 'text-blue-700', hex: '#dbeafe' },
  [LABEL_TYPES.DESIGN]: { bg: 'bg-purple-100', text: 'text-purple-700', hex: '#f3e8ff' },
  [LABEL_TYPES.UI]: { bg: 'bg-pink-100', text: 'text-pink-700', hex: '#fce7f3' },
  [LABEL_TYPES.UX]: { bg: 'bg-indigo-100', text: 'text-indigo-700', hex: '#e0e7ff' },
  [LABEL_TYPES.CORE]: { bg: 'bg-orange-100', text: 'text-orange-700', hex: '#ffedd5' },
  [LABEL_TYPES.RESEARCH]: { bg: 'bg-cyan-100', text: 'text-cyan-700', hex: '#cffafe' },
  [LABEL_TYPES.AUDIO]: { bg: 'bg-violet-100', text: 'text-violet-700', hex: '#ede9fe' },
  [LABEL_TYPES.MUSIC]: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', hex: '#fae8ff' },
  [LABEL_TYPES.MOBILE]: { bg: 'bg-teal-100', text: 'text-teal-700', hex: '#ccfbf1' },
  [LABEL_TYPES.CAMERA]: { bg: 'bg-amber-100', text: 'text-amber-700', hex: '#fef3c7' },
  [LABEL_TYPES.GAMEPLAY]: { bg: 'bg-lime-100', text: 'text-lime-700', hex: '#ecfccb' },
  [LABEL_TYPES.BALANCE]: { bg: 'bg-emerald-100', text: 'text-emerald-700', hex: '#d1fae5' },
  [LABEL_TYPES.ANIMATION]: { bg: 'bg-rose-100', text: 'text-rose-700', hex: '#ffe4e6' },
  [LABEL_TYPES.NETWORKING]: { bg: 'bg-sky-100', text: 'text-sky-700', hex: '#e0f2fe' },
  [LABEL_TYPES.TESTING]: { bg: 'bg-yellow-100', text: 'text-yellow-700', hex: '#fef9c3' },
  [LABEL_TYPES.DOCUMENTATION]: { bg: 'bg-slate-100', text: 'text-slate-700', hex: '#f1f5f9' },
  [LABEL_TYPES.PERFORMANCE]: { bg: 'bg-green-100', text: 'text-green-700', hex: '#dcfce7' },
  [LABEL_TYPES.SECURITY]: { bg: 'bg-red-100', text: 'text-red-700', hex: '#fee2e2' },
  [LABEL_TYPES.DATABASE]: { bg: 'bg-blue-100', text: 'text-blue-700', hex: '#dbeafe' },
  [LABEL_TYPES.API]: { bg: 'bg-purple-100', text: 'text-purple-700', hex: '#f3e8ff' },
  [LABEL_TYPES.FRONTEND]: { bg: 'bg-pink-100', text: 'text-pink-700', hex: '#fce7f3' },
  [LABEL_TYPES.BACKEND]: { bg: 'bg-indigo-100', text: 'text-indigo-700', hex: '#e0e7ff' },
  [LABEL_TYPES.DEVOPS]: { bg: 'bg-orange-100', text: 'text-orange-700', hex: '#ffedd5' },
  [LABEL_TYPES.HOTFIX]: { bg: 'bg-red-100', text: 'text-red-700', hex: '#fee2e2' },
  [LABEL_TYPES.ENHANCEMENT]: { bg: 'bg-blue-100', text: 'text-blue-700', hex: '#dbeafe' },
  [LABEL_TYPES.REFACTOR]: { bg: 'bg-purple-100', text: 'text-purple-700', hex: '#f3e8ff' },
  [LABEL_TYPES.MAINTENANCE]: { bg: 'bg-gray-100', text: 'text-gray-700', hex: '#f3f4f6' },
};

// Get all label types as array
export const getAllLabelTypes = () => {
  return Object.values(LABEL_TYPES);
};

// Get label color
export const getLabelColor = (label) => {
  return LABEL_COLORS[label] || { bg: 'bg-gray-100', text: 'text-gray-700', hex: '#f3f4f6' };
};

// Validate if label exists in predefined types
export const isValidLabel = (label) => {
  return Object.values(LABEL_TYPES).includes(label);
};
