import {
  LayoutDashboard,
  Globe,
  FileText,
  Compass,
  CreditCard,
  Building,
  Bell,
  Users,
  BookOpen,
  Settings,
  Activity,
  User,
  Briefcase,
  MapPin,
  Download,
  Building2,
  Database,
  Mail,
  Hammer
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { to: '/super/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { 
    label: 'Users', 
    icon: Users,
    children: [
      { to: '/super/users', label: 'Accounts' },
      { to: '/super/projects', label: 'ADU Projects' },
      { to: '/super/subscriptions', label: 'Plans' },
      { to: '/super/deposits', label: 'Deposits' }
    ]
  },
  {
    label: 'ADU Laws',
    icon: FileText,
    children: [
      { to: '/super/states', label: 'States & Cities' },
      { to: '/super/laws', label: 'ADU Laws DB' }
    ]
  },
  {
    label: 'Resources',
    icon: Download,
    children: [
      { to: '/super/costs', label: 'Cost Library' },
      { to: '/super/checker', label: 'Property Checker' },
      { to: '/super/steps', label: 'How to Build' },
      { to: '/super/resources', label: 'Resources Manager' }
    ]
  },
  { to: '/super/directory', icon: Building, label: 'Professionals' },
  { divider: true },
  { to: '/super/settings', icon: Settings, label: 'Settings' },
  { to: '/super/blogs', icon: BookOpen, label: 'Blog / News' },
  { to: '/super/logs', icon: Activity, label: 'System Logs' },
  { to: '/super/contactus', icon: Mail, label: 'Contact Messages' },
  { to: '/seed', icon: Database, label: 'Database Seeder' },
];


export const getUserNavItems = (isProfessional) => [
  { to: '/userpanel/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  ...(isProfessional ? [
    { to: '/userpanel/professionals', icon: Building2, label: 'Pro Partner Portal' }
  ] : []),
  { to: '/userpanel/projects', icon: Briefcase, label: 'My ADU Projects' },
  { to: '/userpanel/checks', icon: MapPin, label: 'Property Checks' },
  { to: '/userpanel/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/userpanel/resources', icon: Download, label: 'Resources' },
  { to: '/userpanel/profile', icon: User, label: 'My Profile' }
];

export const PUBLIC_NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'States', path: '/states' },
  { name: 'Property Checker', path: '/property-checker' },
  { name: 'How to Build', path: '/how-to-build' },
  { name: 'Directory', path: '/directory' },
  { name: 'Costs', path: '/costs' },
];
