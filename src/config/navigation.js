import { 
  LayoutDashboard, 
  Globe, 
  FileText, 
  Compass, 
  CreditCard, 
  Building, 
  Bell, 
  Users, 
  PieChart, 
  BookOpen, 
  Settings, 
  Activity,
  User,
  Briefcase,
  MapPin,
  Heart,
  Download,
  Building2,
  Database
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { to: '/super/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/super/states', icon: Globe, label: 'States & Cities' },
  { to: '/super/laws', icon: FileText, label: 'ADU Laws DB' },
  { to: '/super/checker', icon: Compass, label: 'Property Checker' },
  { to: '/super/costs', icon: CreditCard, label: 'Cost Library' },
  { to: '/super/directory', icon: Building, label: 'Professionals' },
  { to: '/super/alerts', icon: Bell, label: 'Law Changes & Alerts' },
  { to: '/super/users', icon: Users, label: 'Users Management' },
  { to: '/super/subscriptions', icon: PieChart, label: 'Subscriptions' },
  { to: '/super/blogs', icon: BookOpen, label: 'Blog / News' },
  { to: '/super/settings', icon: Settings, label: 'Settings' },
  { to: '/super/logs', icon: Activity, label: 'System Logs' },
  { to: '/seed', icon: Database, label: 'Database Seeder' },
];

export const getUserNavItems = (isProfessional) => [
  { to: '/userpanel/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/userpanel/profile', icon: User, label: 'My Profile' },
  ...(isProfessional ? [
    { to: '/userpanel/professionals', icon: Building2, label: 'Pro Partner Portal' }
  ] : []),
  { to: '/userpanel/projects', icon: Briefcase, label: 'My ADU Projects' },
  { to: '/userpanel/checks', icon: MapPin, label: 'Property Checks' },
  { to: '/userpanel/favorites', icon: Heart, label: 'Saved & Favorites' },
  { to: '/userpanel/notifications', icon: Bell, label: 'Notifications', badge: true },
  { to: '/userpanel/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/userpanel/resources', icon: Download, label: 'Resources' },
  { to: '/userpanel/settings', icon: Settings, label: 'Settings' }
];

export const PUBLIC_NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'States', path: '/states' },
  { name: 'Property Checker', path: '/property-checker' },
  { name: 'How to Build', path: '/how-to-build' },
  { name: 'Directory', path: '/directory' },
  { name: 'Costs', path: '/costs' },
  { name: 'Law Tracker', path: '/law-tracker' },
];
