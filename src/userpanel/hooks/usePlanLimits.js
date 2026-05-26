/**
 * usePlanLimits
 * Reads the plan limits set by admin (stored in adu-plan-limits)
 * and returns the limits that apply to the current user's subscription.
 */

const DEFAULT_LIMITS = {
  free: {
    propertyCheckerLimit: 3,
    directoryPlacementBadge: false,
    technicalSupport: false,
    canUploadDirectory: false,
    canUploadADUProjects: false
  },
  pro: {
    propertyCheckerLimit: -1,
    directoryPlacementBadge: true,
    technicalSupport: true,
    canUploadDirectory: true,
    canUploadADUProjects: true
  }
};

export const getPlanLimits = (planId = 'free') => {
  try {
    const raw = localStorage.getItem('adu-plan-limits');
    const stored = raw ? JSON.parse(raw) : {};
    // Merge stored with defaults so missing keys always have a fallback
    return {
      ...(DEFAULT_LIMITS[planId] || DEFAULT_LIMITS.free),
      ...(stored[planId] || {})
    };
  } catch {
    return DEFAULT_LIMITS[planId] || DEFAULT_LIMITS.free;
  }
};

export const usePlanLimits = (currentUser) => {
  const planId = currentUser?.subscription || 'free';
  return getPlanLimits(planId);
};

export default usePlanLimits;
