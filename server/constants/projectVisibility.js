/**
 * Project Hub Visibility Constants
 * Defines visibility levels for project hubs
 */

export const PROJECT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

/**
 * Check if a visibility value is valid
 * @param {string} visibility - The visibility value to check
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidVisibility = (visibility) => {
  return Object.values(PROJECT_VISIBILITY).includes(visibility);
};

/**
 * Get visibility display name
 * @param {string} visibility - The visibility value
 * @returns {string} - Display name for the visibility
 */
export const getVisibilityDisplayName = (visibility) => {
  const displayNames = {
    [PROJECT_VISIBILITY.PUBLIC]: 'Public',
    [PROJECT_VISIBILITY.PRIVATE]: 'Private',
  };
  return displayNames[visibility] || 'Unknown';
};

/**
 * Get visibility description
 * @param {string} visibility - The visibility value
 * @returns {string} - Description for the visibility
 */
export const getVisibilityDescription = (visibility) => {
  const descriptions = {
    [PROJECT_VISIBILITY.PUBLIC]: 'Anyone can view this project. It will appear in search results and on your profile.',
    [PROJECT_VISIBILITY.PRIVATE]: 'Only you and invited team members can view this project.',
  };
  return descriptions[visibility] || '';
};

export default PROJECT_VISIBILITY;
