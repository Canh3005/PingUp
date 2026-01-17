/**
 * Project Hub Visibility Constants
 * Defines visibility levels for project hubs
 */

export const PROJECT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

/**
 * Visibility options for UI components
 */
export const VISIBILITY_OPTIONS = [
  {
    value: PROJECT_VISIBILITY.PUBLIC,
    label: 'Public',
    description: 'Anyone can view this project. It will appear in search results and on your profile.',
    icon: 'Globe',
  },
  {
    value: PROJECT_VISIBILITY.PRIVATE,
    label: 'Private',
    description: 'Only you and invited team members can view this project.',
    icon: 'Lock',
  },
];

/**
 * Check if a visibility value is valid
 * @param {string} visibility - The visibility value to check
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidVisibility = (visibility) => {
  return Object.values(PROJECT_VISIBILITY).includes(visibility);
};

/**
 * Get visibility option by value
 * @param {string} visibility - The visibility value
 * @returns {object|null} - Visibility option object or null
 */
export const getVisibilityOption = (visibility) => {
  return VISIBILITY_OPTIONS.find(option => option.value === visibility) || null;
};

export default PROJECT_VISIBILITY;
