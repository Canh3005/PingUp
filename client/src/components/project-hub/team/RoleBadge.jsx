import React from 'react';
import { Crown, Shield, User, Eye } from 'lucide-react';
import { PROJECT_HUB_ROLES, ROLE_COLORS, ROLE_LABELS } from '../../../constants/projectHubRoles';

const RoleBadge = ({ role, size = 'md' }) => {
  const colors = ROLE_COLORS[role] || ROLE_COLORS[PROJECT_HUB_ROLES.MEMBER];
  const label = ROLE_LABELS[role] || 'Member';

  const getIcon = () => {
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;
    
    switch (role) {
      case PROJECT_HUB_ROLES.OWNER:
        return <Crown size={iconSize} />;
      case PROJECT_HUB_ROLES.ADMIN:
        return <Shield size={iconSize} />;
      case PROJECT_HUB_ROLES.VIEWER:
        return <Eye size={iconSize} />;
      default:
        return <User size={iconSize} />;
    }
  };

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded font-medium
        ${colors.bg} ${colors.text} ${sizeClasses[size]}
      `}
    >
      {getIcon()}
      {label}
    </span>
  );
};

export default RoleBadge;
