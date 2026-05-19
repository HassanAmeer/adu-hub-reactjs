export const ROLES = {
  HOMEOWNER: 'homeowner',
  PROFESSIONAL: 'professional',
  INVESTOR: 'investor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superAdmin'
};

export const isAuthorizedAdmin = (role) => {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
};

export default ROLES;
