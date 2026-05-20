export const ROUTES = {
  // Public Client Side Routes
  HOME: '/',
  STATES: '/states',
  STATE_DETAIL: '/state/:stateName',
  CITY_DETAIL: '/state/:state/city/:cityName',
  PROPERTY_CHECKER: '/property-checker',
  HOW_TO_BUILD: '/how-to-build',
  DIRECTORY: '/directory',
  COSTS: '/costs',
  LAW_TRACKER: '/law-tracker',
  ALERTS: '/alerts',
  BLOG: '/blog',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  SEED: '/seed',

  // Redirection aliases
  LOGIN_REDIRECT: '/login',
  SIGNUP_REDIRECT: '/signup',
  DASHBOARD_REDIRECT: '/dashboard',

  // Super Admin Gates
  SUPER_GATEWAY: '/super',
  SUPER_APP_WILDCARD: '/super/*',
  SUPER_DASHBOARD: '/super/dashboard',
  SUPER_STATES: '/super/states',
  SUPER_LAWS: '/super/laws',
  SUPER_CHECKER: '/super/checker',
  SUPER_COSTS: '/super/costs',
  SUPER_DIRECTORY: '/super/directory',
  SUPER_ALERTS: '/super/alerts',
  SUPER_USERS: '/super/users',
  SUPER_SUBSCRIPTIONS: '/super/subscriptions',
  SUPER_BLOGS: '/super/blogs',
  SUPER_SETTINGS: '/super/settings',
  SUPER_LOGS: '/super/logs',
  SUPER_CONTACT_US: '/super/contactus',

  // User Panel Gates
  USER_PANEL_WILDCARD: '/userpanel/*',
  USER_LOGIN: '/login',
  USER_REGISTER: '/register',
  USER_FORGOT_PASSWORD: '/forgot-password',
  USER_DASHBOARD: '/userpanel/dashboard',
  USER_PROFILE: '/userpanel/profile',
  USER_PROJECTS: '/userpanel/projects',
  USER_CHECKS: '/userpanel/checks',
  USER_FAVORITES: '/userpanel/favorites',
  USER_NOTIFICATIONS: '/userpanel/notifications',
  USER_SUBSCRIPTIONS: '/userpanel/subscriptions',
  USER_RESOURCES: '/userpanel/resources',
  USER_PROFESSIONALS: '/userpanel/professionals',
  USER_SETTINGS: '/userpanel/settings'
};

export default ROUTES;
