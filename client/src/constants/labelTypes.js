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
  [LABEL_TYPES.BUG]: 'bg-red-100 text-red-700',
  [LABEL_TYPES.FEATURE]: 'bg-blue-100 text-blue-700',
  [LABEL_TYPES.DESIGN]: 'bg-purple-100 text-purple-700',
  [LABEL_TYPES.UI]: 'bg-pink-100 text-pink-700',
  [LABEL_TYPES.UX]: 'bg-indigo-100 text-indigo-700',
  [LABEL_TYPES.CORE]: 'bg-orange-100 text-orange-700',
  [LABEL_TYPES.RESEARCH]: 'bg-cyan-100 text-cyan-700',
  [LABEL_TYPES.AUDIO]: 'bg-violet-100 text-violet-700',
  [LABEL_TYPES.MUSIC]: 'bg-fuchsia-100 text-fuchsia-700',
  [LABEL_TYPES.MOBILE]: 'bg-teal-100 text-teal-700',
  [LABEL_TYPES.CAMERA]: 'bg-amber-100 text-amber-700',
  [LABEL_TYPES.GAMEPLAY]: 'bg-lime-100 text-lime-700',
  [LABEL_TYPES.BALANCE]: 'bg-emerald-100 text-emerald-700',
  [LABEL_TYPES.ANIMATION]: 'bg-rose-100 text-rose-700',
  [LABEL_TYPES.NETWORKING]: 'bg-sky-100 text-sky-700',
  [LABEL_TYPES.TESTING]: 'bg-yellow-100 text-yellow-700',
  [LABEL_TYPES.DOCUMENTATION]: 'bg-slate-100 text-slate-700',
  [LABEL_TYPES.PERFORMANCE]: 'bg-green-100 text-green-700',
  [LABEL_TYPES.SECURITY]: 'bg-red-100 text-red-700',
  [LABEL_TYPES.DATABASE]: 'bg-blue-100 text-blue-700',
  [LABEL_TYPES.API]: 'bg-purple-100 text-purple-700',
  [LABEL_TYPES.FRONTEND]: 'bg-pink-100 text-pink-700',
  [LABEL_TYPES.BACKEND]: 'bg-indigo-100 text-indigo-700',
  [LABEL_TYPES.DEVOPS]: 'bg-orange-100 text-orange-700',
  [LABEL_TYPES.HOTFIX]: 'bg-red-100 text-red-700',
  [LABEL_TYPES.ENHANCEMENT]: 'bg-blue-100 text-blue-700',
  [LABEL_TYPES.REFACTOR]: 'bg-purple-100 text-purple-700',
  [LABEL_TYPES.MAINTENANCE]: 'bg-gray-100 text-gray-700',
};

// Get all label types as array
export const getAllLabelTypes = () => {
  return Object.values(LABEL_TYPES);
};

// Get label color
export const getLabelColor = (label) => {
  return LABEL_COLORS[label] || 'bg-gray-100 text-gray-700';
};
