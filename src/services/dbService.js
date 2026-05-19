// ADU Navi Local Persistent Database Service
// Provides CRUD capabilities for Super Admin and User dashboards
// Falls back to localStorage and loads default mock data if not initialized.

import { states as initialStates, aduRules as initialRules } from '../data/mockData';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { COLLECTIONS } from '../config';

const DEFAULT_USERS = [
  {
    id: 'admin-id',
    name: 'Super Admin',
    email: 'admin@adunavi.com',
    role: 'admin',
    status: 'active',
    subscription: 'expert',
    savedProperties: [],
    savedPros: [],
    joinedDate: '2025-01-10'
  },
  {
    id: 'user-homeowner-id',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'homeowner',
    status: 'active',
    subscription: 'free',
    savedProperties: [
      { id: 'prop-1', address: '123 Main St, San Diego, CA 92101', status: 'Feasible', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop', tags: ['Detached', 'Solar'] },
      { id: 'prop-2', address: '456 Oak Ln, Austin, TX 78701', status: 'In Review', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop', tags: ['Garage Conversion'] }
    ],
    savedPros: [1],
    joinedDate: '2025-03-15'
  },
  {
    id: 'user-pro-id',
    name: 'Alex Rivera',
    email: 'alex@coastaldesign.com',
    role: 'professional',
    status: 'active',
    subscription: 'pro',
    savedProperties: [],
    savedPros: [],
    proListingId: 1,
    leads: [
      { id: 'lead-1', name: 'Mark Smith', email: 'mark@gmail.com', phone: '619-555-0129', property: '789 Pine Rd, San Diego, CA', message: 'Interested in building a detached 800 sq ft ADU.', date: '2026-05-18' },
      { id: 'lead-2', name: 'Sarah Connor', email: 'sarah@hotmail.com', phone: '858-555-0982', property: '456 Hill Ave, La Jolla, CA', message: 'Looking for a general estimate for garage conversion.', date: '2026-05-19' }
    ],
    joinedDate: '2025-04-20'
  }
];

const DEFAULT_DIRECTORY = [
  {
    id: 1,
    name: 'Coastal Design Studio',
    role: 'Architect',
    rating: 4.9,
    reviews: 124,
    location: 'San Diego, CA',
    tags: ['Detached', 'Conversion', 'Modern'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$$',
    verified: true,
    email: 'contact@coastaldesign.com',
    phone: '619-555-1234',
    website: 'https://coastaldesign.com',
    description: 'We specialize in modern and eco-friendly ADU designs tailored to Southern California coastal regulations.'
  },
  {
    id: 2,
    name: 'Precision Build ADU',
    role: 'General Contractor',
    rating: 4.7,
    reviews: 89,
    location: 'Los Angeles, CA',
    tags: ['Modular', 'Eco-Friendly'],
    images: [
      'https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$',
    verified: true,
    email: 'info@precisionbuildadu.com',
    phone: '213-555-7890',
    website: 'https://precisionbuildadu.com',
    description: 'Precision construction company building high-quality detached, attached, and garage conversion ADUs in Los Angeles.'
  },
  {
    id: 3,
    name: 'Urban Dwelling Co.',
    role: 'ADU Consultant',
    rating: 5.0,
    reviews: 42,
    location: 'San Francisco, CA',
    tags: ['Feasibility', 'Permitting'],
    images: [
      'https://images.unsplash.com/photo-1574067769351-34440c836935?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$',
    verified: false,
    email: 'hello@urbandwelling.co',
    phone: '415-555-4567',
    website: 'https://urbandwelling.co',
    description: 'Consulting agency helping homeowners identify lot feasibility, complete soil tests, and navigate city zoning permits.'
  },
  {
    id: 4,
    name: 'Golden State Architects',
    role: 'Architect',
    rating: 4.8,
    reviews: 215,
    location: 'Sacramento, CA',
    tags: ['Luxury', 'Historical'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$$$',
    verified: true,
    email: 'info@goldenstatearch.com',
    phone: '916-555-8833',
    website: 'https://goldenstatearch.com',
    description: 'Award-winning architectural studio focused on high-end custom accessory units and historic overlays compliance.'
  }
];

const DEFAULT_ALERTS = [
  {
    id: 'alert-1',
    date: '2026-05-12',
    state: 'California',
    title: 'SB 1211: Parking & Coverage Relief',
    status: 'Passed',
    impact: 'High',
    desc: 'This bill removes local authority to require replacement parking when a garage is converted to an ADU, and clarifies lot coverage limits.',
    before: 'Cities could require up to 1 parking space per bedroom for any ADU project, making many conversions unfeasible.',
    after: 'No replacement parking required for conversions or projects near transit. Lot coverage exemptions expanded.'
  },
  {
    id: 'alert-2',
    date: '2026-04-15',
    state: 'Washington',
    title: 'HB 1110: Middle Housing Act',
    status: 'Implementation Phase',
    impact: 'Very High',
    desc: 'Mandates cities to allow at least two ADUs per lot in all residential zones. Cities have until 2025 to update local codes.',
    before: 'Most cities limited single-family lots to a maximum of one attached or detached ADU.',
    after: 'Cities must allow at least two ADUs per lot in all residential zones, drastically increasing housing density options.'
  },
  {
    id: 'alert-3',
    date: '2026-03-28',
    state: 'Oregon',
    title: 'SB 1537: Housing Infrastructure',
    status: 'Signed by Governor',
    impact: 'Medium',
    desc: 'Expands the use of revolving loan funds for ADU construction and infrastructure upgrades.',
    before: 'Limited state funding available specifically for homeowner-driven ADU projects.',
    after: 'Expands a $3M revolving loan fund to provide targeted financing for ADU construction.'
  }
];

const DEFAULT_COSTS = [
  { id: 'cost-1', state: 'California', type: 'Detached', minSize: 500, maxSize: 800, avgCost: 245000, pricePerSqFt: 385, designCost: 18000, permitCost: 8000, constructionCost: 219000 },
  { id: 'cost-2', state: 'Washington', type: 'Detached', minSize: 500, maxSize: 800, avgCost: 220000, pricePerSqFt: 340, designCost: 15000, permitCost: 6000, constructionCost: 199000 },
  { id: 'cost-3', state: 'Texas', type: 'Garage Conversion', minSize: 300, maxSize: 500, avgCost: 120000, pricePerSqFt: 280, designCost: 8000, permitCost: 3000, constructionCost: 109000 },
  { id: 'cost-4', state: 'Oregon', type: 'Attached', minSize: 400, maxSize: 700, avgCost: 175000, pricePerSqFt: 310, designCost: 12000, permitCost: 5000, constructionCost: 158000 }
];

const DEFAULT_SETTINGS = {
  notificationEmailTemplate: 'Hello {{name}},\n\nWe would like to notify you that there has been an update to the ADU laws in {{location}}.\n\nUpdate Details:\n{{details}}\n\nBest regards,\nADU Navi Team',
  notificationSmsTemplate: 'ADU Navi Law Change Alert: Laws in {{location}} have changed. Details: {{details}}',
  siteTitle: 'ADU Navi - All-in-One ADU Platform',
  metaDescription: 'Find state-by-state ADU laws, property checkers, cost estimation libraries, and professional directory lists for building ADUs.',
  enableEmailAlerts: true,
  enableSmsAlerts: false,
  backupSchedule: 'weekly'
};

const DEFAULT_LOGS = [
  { id: 'log-1', admin: 'Super Admin', action: 'Created California ADU Law ruleset', timestamp: '2026-05-19T09:30:00Z' },
  { id: 'log-2', admin: 'Super Admin', action: 'Approved listing "Coastal Design Studio"', timestamp: '2026-05-19T10:15:00Z' },
  { id: 'log-3', admin: 'Super Admin', action: 'Updated SMS delivery template settings', timestamp: '2026-05-19T11:00:00Z' }
];

// Helper to load/save JSON from local storage
const loadCollection = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const saveCollection = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const dbService = {
  // --- USERS ---
  getUsers: () => loadCollection('adu-db-users', DEFAULT_USERS),
  saveUsers: (users) => saveCollection('adu-db-users', users),
  updateUser: (userId, updatedFields) => {
    const users = dbService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedFields };
      dbService.saveUsers(users);

      // Persist changes to Firestore user document
      try {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        updateDoc(userRef, updatedFields);
      } catch (err) {
        console.error("Firestore sync failed:", err);
      }
      return users[index];
    }
    return null;
  },
  deleteUser: (userId) => {
    const users = dbService.getUsers().filter(u => u.id !== userId);
    dbService.saveUsers(users);
  },
  addUser: (user) => {
    const users = dbService.getUsers();
    const newUser = {
      id: user.id || 'user-' + Date.now(),
      name: user.name || 'Anonymous User',
      email: user.email,
      role: user.role || 'homeowner',
      status: user.status || 'active',
      subscription: user.subscription || 'free',
      savedProperties: user.savedProperties || [],
      savedPros: user.savedPros || [],
      joinedDate: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    dbService.saveUsers(users);
    return newUser;
  },

  // --- STATES & CITIES ---
  getStates: () => loadCollection('adu-db-states', initialStates.map(s => ({
    ...s,
    rules: initialRules,
    grants: [
      { id: 'grant-1', name: s.name + ' ADU Development Grant', value: '$35,000', status: 'Active', desc: 'Financial support for qualifying middle-income and low-income homeowners to cover pre-development plans.' }
    ]
  }))),
  saveStates: (states) => saveCollection('adu-db-states', states),
  addState: (state) => {
    const states = dbService.getStates();
    const newState = {
      id: state.name.toLowerCase().substring(0, 2),
      name: state.name,
      status: state.status || 'Allowed',
      cities: state.cities || [],
      rules: state.rules || initialRules,
      grants: state.grants || [
        { id: 'grant-custom', name: state.name + ' Local Incentive Program', value: '$20,000', status: 'Active', desc: 'Direct cost incentives or development fee waivers.' }
      ]
    };
    states.push(newState);
    dbService.saveStates(states);
    return newState;
  },
  updateState: (stateId, updatedState) => {
    const states = dbService.getStates();
    const idx = states.findIndex(s => s.id === stateId);
    if (idx !== -1) {
      states[idx] = { ...states[idx], ...updatedState };
      dbService.saveStates(states);
      return states[idx];
    }
    return null;
  },
  deleteState: (stateId) => {
    const states = dbService.getStates().filter(s => s.id !== stateId);
    dbService.saveStates(states);
  },

  // --- PROFESSIONAL DIRECTORY ---
  getDirectory: () => loadCollection('adu-db-directory', DEFAULT_DIRECTORY),
  saveDirectory: (dir) => saveCollection('adu-db-directory', dir),
  addPro: (pro) => {
    const dir = dbService.getDirectory();
    const newPro = {
      id: Date.now(),
      name: pro.name,
      role: pro.role,
      rating: 5.0,
      reviews: 0,
      location: pro.location,
      tags: pro.tags || ['ADU Builder'],
      images: pro.images || ['https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop'],
      price: pro.price || '$$',
      verified: pro.verified || false,
      email: pro.email || '',
      phone: pro.phone || '',
      website: pro.website || '',
      description: pro.description || ''
    };
    dir.push(newPro);
    dbService.saveDirectory(dir);
    return newPro;
  },
  updatePro: (proId, updatedFields) => {
    const dir = dbService.getDirectory();
    const idx = dir.findIndex(p => p.id === Number(proId));
    if (idx !== -1) {
      dir[idx] = { ...dir[idx], ...updatedFields };
      dbService.saveDirectory(dir);
      return dir[idx];
    }
    return null;
  },
  deletePro: (proId) => {
    const dir = dbService.getDirectory().filter(p => p.id !== Number(proId));
    dbService.saveDirectory(dir);
  },

  // --- LAW TRACKER & ALERTS ---
  getAlerts: () => loadCollection('adu-db-alerts', DEFAULT_ALERTS),
  saveAlerts: (alerts) => saveCollection('adu-db-alerts', alerts),
  addAlert: (alert) => {
    const alerts = dbService.getAlerts();
    const newAlert = {
      id: 'alert-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      state: alert.state,
      title: alert.title,
      status: alert.status || 'Passed',
      impact: alert.impact || 'High',
      desc: alert.desc,
      before: alert.before || 'Not specified',
      after: alert.after || 'Not specified'
    };
    alerts.push(newAlert);
    dbService.saveAlerts(alerts);
    dbService.addLog(`Created law tracker alert: "${alert.title}"`);
    return newAlert;
  },
  updateAlert: (alertId, updatedFields) => {
    const alerts = dbService.getAlerts();
    const idx = alerts.findIndex(a => a.id === alertId);
    if (idx !== -1) {
      alerts[idx] = { ...alerts[idx], ...updatedFields };
      dbService.saveAlerts(alerts);
      return alerts[idx];
    }
    return null;
  },
  deleteAlert: (alertId) => {
    const alerts = dbService.getAlerts().filter(a => a.id !== alertId);
    dbService.saveAlerts(alerts);
  },

  // --- COST LIBRARY ---
  getCosts: () => loadCollection('adu-db-costs', DEFAULT_COSTS),
  saveCosts: (costs) => saveCollection('adu-db-costs', costs),
  addCost: (cost) => {
    const costs = dbService.getCosts();
    const newCost = {
      id: 'cost-' + Date.now(),
      state: cost.state,
      type: cost.type || 'Detached',
      minSize: Number(cost.minSize) || 400,
      maxSize: Number(cost.maxSize) || 800,
      avgCost: Number(cost.avgCost) || 200000,
      pricePerSqFt: Number(cost.pricePerSqFt) || 300,
      designCost: Number(cost.designCost) || 12000,
      permitCost: Number(cost.permitCost) || 5000,
      constructionCost: Number(cost.constructionCost) || 183000
    };
    costs.push(newCost);
    dbService.saveCosts(costs);
    return newCost;
  },
  updateCost: (costId, updatedFields) => {
    const costs = dbService.getCosts();
    const idx = costs.findIndex(c => c.id === costId);
    if (idx !== -1) {
      costs[idx] = { ...costs[idx], ...updatedFields };
      dbService.saveCosts(costs);
      return costs[idx];
    }
    return null;
  },
  deleteCost: (costId) => {
    const costs = dbService.getCosts().filter(c => c.id !== costId);
    dbService.saveCosts(costs);
  },

  // --- SETTINGS ---
  getSettings: () => loadCollection('adu-db-settings', DEFAULT_SETTINGS),
  saveSettings: (settings) => {
    saveCollection('adu-db-settings', settings);
    try {
      const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'global');
      setDoc(settingsRef, settings, { merge: true });
    } catch (err) {
      console.error("Firestore settings sync error:", err);
    }
  },

  // --- ACTIVITY LOGS ---
  getLogs: () => loadCollection('adu-db-logs', DEFAULT_LOGS),
  addLog: (action) => {
    const logs = loadCollection('adu-db-logs', DEFAULT_LOGS);
    const newLog = {
      id: 'log-' + Date.now(),
      admin: 'Super Admin',
      action,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    // limit to 100 logs
    saveCollection('adu-db-logs', logs.slice(0, 100));
    return newLog;
  },
  clearLogs: () => {
    saveCollection('adu-db-logs', []);
  }
};
