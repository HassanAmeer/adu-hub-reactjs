// ADU Navi Local Persistent Database Service
// Provides CRUD capabilities for Super Admin and User dashboards
// Falls back to localStorage and loads default mock data if not initialized.

import { aduRules as initialRules, buildSteps as initialBuildSteps } from '../data/mockData';
import { ALL_50_STATES } from '../data/statesData';
import { doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { COLLECTIONS } from '../config';
import { SEED_RESOURCES } from '../seed/seedData';

const DEFAULT_USERS = [
  {
    id: 'admin-id',
    name: 'Super Admin',
    email: 'admin@adunavi.com',
    role: 'admin',
    status: 'active',
    subscription: 'pro',
    savedProperties: [],
    savedPros: [],
    joinedDate: '2025-01-10',
    subscriptionActivatedDate: '2026-05-10',
    subscriptionExpiresDate: '2026-06-09'
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
    joinedDate: '2025-04-20',
    subscriptionActivatedDate: '2026-05-25',
    subscriptionExpiresDate: '2026-06-24'
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
    isReferralEligible: false,
    email: 'info@goldenstatearch.com',
    phone: '916-555-8833',
    website: 'https://goldenstatearch.com',
    description: 'Award-winning architectural studio focused on high-end custom accessory units and historic overlays compliance.'
  },
  {
    id: 5,
    name: 'Top Tier Builders Yelp',
    role: 'General Contractor',
    rating: 4.8,
    reviews: 310,
    location: 'Austin, TX',
    tags: ['Yelp 4.5+', 'Top Rated'],
    images: ['https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop'],
    price: '$$$',
    verified: true,
    isReferralEligible: true,
    email: 'contact@toptier.com',
    phone: '512-555-0000',
    website: 'https://toptier.com',
    description: 'Top rated Yelp contractor in Austin.'
  }
];

const DEFAULT_ALERTS = [
  {
    id: 'ticket-1',
    date: '2026-07-08',
    state: 'California',
    title: 'Map Loading Error in Property Checker',
    status: 'critical alert',
    impact: 'High',
    desc: 'Users reporting that the Google Maps API is failing to load on the property checker page for San Diego addresses.',
    timeline: [
      { status: 'pending', date: '2026-07-08T09:00:00Z', note: 'Issue reported by 3 users.' },
      { status: 'critical alert', date: '2026-07-08T09:30:00Z', note: 'Escalated to engineering team.' }
    ]
  },
  {
    id: 'ticket-2',
    date: '2026-07-07',
    state: 'Washington',
    title: 'Update Zoning Codes for Seattle',
    status: 'in progress',
    impact: 'Medium',
    desc: 'New middle housing legislation requires updating the backend rules for Seattle.',
    timeline: [
      { status: 'pending', date: '2026-07-07T10:00:00Z', note: 'Task created.' },
      { status: 'in progress', date: '2026-07-07T14:00:00Z', note: 'Data team is reviewing city ordinances.' }
    ]
  },
  {
    id: 'ticket-3',
    date: '2026-07-05',
    state: 'Oregon',
    title: 'Fix Payment Gateway Typo',
    status: 'fixed',
    impact: 'Low',
    desc: 'Typo on the subscriptions page "Zelle Transfer" text.',
    timeline: [
      { status: 'pending', date: '2026-07-05T11:00:00Z', note: 'Reported by admin.' },
      { status: 'fixed', date: '2026-07-06T09:00:00Z', note: 'Typo corrected and pushed to production.' }
    ]
  }
];

const DEFAULT_COSTS = [
  { id: 'cost-1', state: 'California', type: 'Detached', minSize: 500, maxSize: 800, avgCost: 245000, pricePerSqFt: 385, designCost: 18000, permitCost: 8000, constructionCost: 219000, utilityCost: 7500, impactCost: 4500 },
  { id: 'cost-2', state: 'Washington', type: 'Detached', minSize: 500, maxSize: 800, avgCost: 220000, pricePerSqFt: 340, designCost: 15000, permitCost: 6000, constructionCost: 199000, utilityCost: 6000, impactCost: 3500 },
  { id: 'cost-3', state: 'Texas', type: 'Garage Conversion', minSize: 300, maxSize: 500, avgCost: 120000, pricePerSqFt: 280, designCost: 8000, permitCost: 3000, constructionCost: 109000, utilityCost: 4000, impactCost: 2000 },
  { id: 'cost-4', state: 'Oregon', type: 'Attached', minSize: 400, maxSize: 700, avgCost: 175000, pricePerSqFt: 310, designCost: 12000, permitCost: 5000, constructionCost: 158000, utilityCost: 5000, impactCost: 2500 }
];

const DEFAULT_SETTINGS = {
  notificationEmailTemplate: 'Hello {{name}},\n\nWe would like to notify you that there has been an update to the ADU laws in {{location}}.\n\nUpdate Details:\n{{details}}\n\nBest regards,\nADU Navi Team',
  notificationSmsTemplate: 'ADU Navi Law Change Alert: Laws in {{location}} have changed. Details: {{details}}',
  siteTitle: 'ADU Navi - All-in-One ADU Platform',
  metaDescription: 'Find state-by-state ADU laws, property checkers, cost estimation libraries, and professional directory lists for building ADUs.',
  enableEmailAlerts: true,
  enableSmsAlerts: false,
  backupSchedule: 'weekly',
  paymentTitle: 'Zelle & Bank Wire Transfer Details',
  paymentAddress: 'Zelle: pay@adunavi.com | Bank: Wells Fargo A/C 987654321, Routing: 122000247',
  paymentDescription: 'Please transfer the exact plan pricing amount to the address coordinates above. Once completed, upload a screenshot of your transaction confirmation. Our administrators will review the deposit and activate your subscription.'
};

const DEFAULT_DEPOSITS = [
  {
    id: 'dep-101',
    userId: 'user1@gmail.com',
    userName: 'Jane Smith',
    userEmail: 'user1@gmail.com',
    planId: 'pro',
    planName: 'Standard Pro Tier',
    price: '$49',
    status: 'approved',
    screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-20T14:35:00Z'
  },
  {
    id: 'dep-102',
    userId: 'user2@gmail.com',
    userName: 'Robert Davis',
    userEmail: 'user2@gmail.com',
    planId: 'expert',
    planName: 'Expert Builder Tier',
    price: '$99',
    status: 'pending',
    screenshot: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-25T09:15:00Z'
  }
];

const DEFAULT_LOGS = [
  { id: 'log-1', admin: 'Super Admin', action: 'Created California ADU Law ruleset', timestamp: '2026-05-19T09:30:00Z' },
  { id: 'log-2', admin: 'Super Admin', action: 'Approved listing "Coastal Design Studio"', timestamp: '2026-05-19T10:15:00Z' },
  { id: 'log-3', admin: 'Super Admin', action: 'Updated SMS delivery template settings', timestamp: '2026-05-19T11:00:00Z' }
];

const DEFAULT_PLANS = [
  { id: 'free', name: 'Free Basic Tier', price: '$0', desc: 'Allows basic setback checking and laws queries for homeowners.', features: ['3 Property Checker run limit', 'Access to State level laws', 'Read directory reviews'] },
  { id: 'pro', name: 'Standard Pro Tier', price: '$49', desc: 'Designed for professional contractors, consultants, and builders.', features: ['Direct lead acquisition queries', 'Featured directory placement badge', 'Comprehensive municipal details access'] }
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
    let fieldsToUpdate = { ...updatedFields };

    const oldSubscription = index !== -1 ? users[index].subscription : 'free';

    // Calculate activation and expiration dates if subscription tier changes
    if (updatedFields.subscription && updatedFields.subscription !== oldSubscription) {
      if (updatedFields.subscription === 'free') {
        fieldsToUpdate.subscriptionActivatedDate = null;
        fieldsToUpdate.subscriptionExpiresDate = null;
      } else {
        const activatedDate = new Date().toISOString().split('T')[0];
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        const expiresDate = expires.toISOString().split('T')[0];
        fieldsToUpdate.subscriptionActivatedDate = activatedDate;
        fieldsToUpdate.subscriptionExpiresDate = expiresDate;
      }
    }

    if (index !== -1) {
      users[index] = { ...users[index], ...fieldsToUpdate };
    } else {
      // Syncing new user locally
      users.push({
        id: userId,
        email: userId,
        name: userId.split('@')[0],
        subscription: 'free',
        savedProperties: [],
        savedPros: [],
        joinedDate: new Date().toISOString().split('T')[0],
        ...fieldsToUpdate
      });
    }
    dbService.saveUsers(users);

    // Persist changes to Firestore user document
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      updateDoc(userRef, fieldsToUpdate);
    } catch (err) {
      console.error("Firestore sync failed:", err);
    }

    const updatedUsers = dbService.getUsers();
    return updatedUsers.find(u => u.id === userId) || null;
  },
  deleteUser: (userId) => {
    const users = dbService.getUsers().filter(u => u.id !== userId);
    dbService.saveUsers(users);
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      deleteDoc(userRef);
    } catch (err) {
      console.error("Firestore user delete error:", err);
    }
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
    try {
      const userRef = doc(db, COLLECTIONS.USERS, newUser.id);
      setDoc(userRef, newUser);
    } catch (err) {
      console.error("Firestore user add error:", err);
    }
    return newUser;
  },

  // --- STATES & CITIES ---
  getStates: () => {
    const states = loadCollection('adu-db-states', ALL_50_STATES.map(s => ({
      avgCost: '$180,000 - $250,000',
      typicalRoi: '8% - 12%',
      permitTime: '2 - 6 Months',
      pdfUrl: '',
      timeline: [
        { year: '2024', title: 'Statewide ADU Legislation Updates', desc: 'Various laws introduced to ease ADU construction.' },
        { year: '2023', title: 'Local Zoning Revisions', desc: 'Many municipalities updating codes to reflect state law.' },
        { year: '2020', title: 'The ADU Revolution', desc: 'Major changes removing strict parking and owner-occupancy requirements.' }
      ],
      ...s,
      rules: s.rules || initialRules,
      grants: s.grants && s.grants.length > 0 ? s.grants : [
        { id: 'grant-1', name: s.name + ' ADU Development Grant', value: '$35,000', status: 'Active', desc: 'Financial support for qualifying middle-income and low-income homeowners to cover pre-development plans.' }
      ],
      cityDetails: s.cityDetails || {}
    })));

    let modified = false;
    const verified = states.map(s => {
      if (!s.cityDetails) {
        s.cityDetails = {};
        modified = true;
      }
      if (s.id === 'ca' && Object.keys(s.cityDetails).length === 0) {
        s.cityDetails = {
          'san-diego': {
            name: 'San Diego',
            permitTime: '60-90 Days',
            impactFees: '$0 - $5k',
            alerts: [
              { title: 'Coastal & Historic Overlays', desc: 'Properties within 1,000 yards of the coast or in designated historic districts require additional permits, adding 4-6 months to timelines.', type: 'amber' },
              { title: 'Fee Waiver Active', desc: 'San Diego is currently waiving development impact fees for ADUs under 750 sq ft until December 2024.', type: 'emerald' },
              { title: 'HOA Overlays', desc: 'State law restricts HOAs from banning ADUs, but they can impose "reasonable" aesthetic guidelines in San Diego.', type: 'blue' }
            ],
            amendments: [
              { title: 'Height Increases', desc: 'Allows up to 18 ft (instead of 16 ft) for detached ADUs near transit.', type: 'success' },
              { title: 'Front Yard ADUs', desc: 'Permitted only if rear yard is completely constrained.', type: 'success' },
              { title: 'Owner Occupancy', desc: 'Suspended until 2025, but may be reinstated locally afterwards.', type: 'warning' }
            ],
            zoningStandards: [
              { category: 'Setbacks', standard: '4 ft Side / Rear', notes: 'Reduced from standard 15ft' },
              { category: 'Lot Coverage', standard: 'No maximum', notes: 'State law overrides local limit' },
              { category: 'Min Lot Size', standard: 'None', notes: 'Any residentially zoned lot' },
              { category: 'Fire Sprinklers', standard: 'Required', notes: 'Only if primary has them' },
              { category: 'Architecture', standard: 'Must match primary', notes: 'Roof pitch and siding' }
            ],
            permitTimeline: [
              { step: 'Intake', time: '1-2 Weeks' },
              { step: 'Plan Review', time: '4-6 Weeks' },
              { step: 'Corrections', time: '2-4 Weeks' }
            ],
            zoningChips: ['Single Family', 'Multi-Family', 'Transit Priority', 'Historic District', 'Wildfire Zone', 'HOA Zones']
          },
          'los-angeles': {
            name: 'Los Angeles',
            permitTime: '30-60 Days',
            impactFees: '$1k - $8k',
            alerts: [
              { title: 'Hillside Regulations', desc: 'ADUs in Hillside areas have stricter height and grading limits.', type: 'amber' }
            ],
            amendments: [
              { title: 'Size Exemptions', desc: 'Allows up to 1,200 sq ft regardless of primary home size.', type: 'success' }
            ],
            zoningStandards: [
              { category: 'Setbacks', standard: '4 ft Side / Rear', notes: 'Standard for detached' }
            ],
            permitTimeline: [
              { step: 'Intake', time: '1 Week' },
              { step: 'Review', time: '3-5 Weeks' }
            ],
            zoningChips: ['Single Family', 'Multi-Family', 'Hillside Area']
          }
        };
        modified = true;
      }
      return s;
    });

    if (modified) {
      saveCollection('adu-db-states', verified);
    }
    return verified;
  },
  saveStates: (states) => saveCollection('adu-db-states', states),
  addState: (state) => {
    const states = dbService.getStates();
    const newState = {
      id: state.name.toLowerCase().substring(0, 2),
      name: state.name,
      status: state.status || 'Allowed',
      cities: state.cities || [],
      rules: state.rules || initialRules,
      avgCost: state.avgCost || '$180,000 - $250,000',
      typicalRoi: state.typicalRoi || '8% - 12%',
      permitTime: state.permitTime || '2 - 6 Months',
      pdfUrl: state.pdfUrl || '',
      grants: state.grants || [
        { id: 'grant-custom', name: state.name + ' Local Incentive Program', value: '$20,000', status: 'Active', desc: 'Direct cost incentives or development fee waivers.' }
      ],
      timeline: state.timeline || [
        { year: new Date().getFullYear().toString(), title: 'Ordinance Created', desc: 'Baseline local ADU ordinance finalized.' }
      ],
      cityDetails: state.cityDetails || {}
    };
    states.push(newState);
    dbService.saveStates(states);
    try {
      const stateRef = doc(db, COLLECTIONS.STATES, newState.id);
      setDoc(stateRef, newState);
    } catch (err) {
      console.error("Firestore state add error:", err);
    }
    return newState;
  },
  updateState: (stateId, updatedState) => {
    const states = dbService.getStates();
    const idx = states.findIndex(s => s.id === stateId);
    if (idx !== -1) {
      states[idx] = { ...states[idx], ...updatedState };
      dbService.saveStates(states);
      try {
        const stateRef = doc(db, COLLECTIONS.STATES, stateId);
        setDoc(stateRef, updatedState, { merge: true });
      } catch (err) {
        console.error("Firestore state update error:", err);
      }
      return states[idx];
    }
    return null;
  },
  deleteState: (stateId) => {
    const states = dbService.getStates().filter(s => s.id !== stateId);
    dbService.saveStates(states);
    try {
      const stateRef = doc(db, COLLECTIONS.STATES, stateId);
      deleteDoc(stateRef);
    } catch (err) {
      console.error("Firestore state delete error:", err);
    }
  },

  // --- PROFESSIONAL DIRECTORY ---
  getDirectory: () => loadCollection('adu-db-directory-v2', DEFAULT_DIRECTORY),
  saveDirectory: (dir) => saveCollection('adu-db-directory-v2', dir),
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
    try {
      const proRef = doc(db, COLLECTIONS.PROFESSIONALS, String(newPro.id));
      setDoc(proRef, newPro);
    } catch (err) {
      console.error("Firestore pro add error:", err);
    }
    return newPro;
  },
  updatePro: (proId, updatedFields) => {
    const dir = dbService.getDirectory();
    const idx = dir.findIndex(p => String(p.id) === String(proId));
    if (idx !== -1) {
      dir[idx] = { ...dir[idx], ...updatedFields };
      dbService.saveDirectory(dir);
      try {
        const proRef = doc(db, COLLECTIONS.PROFESSIONALS, String(proId));
        setDoc(proRef, updatedFields, { merge: true });
      } catch (err) {
        console.error("Firestore pro update error:", err);
      }
      return dir[idx];
    }
    return null;
  },
  deletePro: (proId) => {
    const dir = dbService.getDirectory().filter(p => String(p.id) !== String(proId));
    dbService.saveDirectory(dir);
    try {
      const proRef = doc(db, COLLECTIONS.PROFESSIONALS, String(proId));
      deleteDoc(proRef);
    } catch (err) {
      console.error("Firestore pro delete error:", err);
    }
  },

  // --- LAW TRACKER & ALERTS ---
  getAlerts: () => loadCollection('adu-db-alerts-v2', DEFAULT_ALERTS),
  saveAlerts: (alerts) => saveCollection('adu-db-alerts-v2', alerts),
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
      constructionCost: Number(cost.constructionCost) || 183000,
      utilityCost: Number(cost.utilityCost) || 5000,
      impactCost: Number(cost.impactCost) || 2500
    };
    costs.push(newCost);
    dbService.saveCosts(costs);
    try {
      const costRef = doc(db, COLLECTIONS.COSTS, newCost.id);
      setDoc(costRef, newCost);
    } catch (err) {
      console.error("Firestore cost add error:", err);
    }
    return newCost;
  },
  updateCost: (costId, updatedFields) => {
    const costs = dbService.getCosts();
    const idx = costs.findIndex(c => c.id === costId);
    if (idx !== -1) {
      costs[idx] = { ...costs[idx], ...updatedFields };
      dbService.saveCosts(costs);
      try {
        const costRef = doc(db, COLLECTIONS.COSTS, costId);
        setDoc(costRef, updatedFields, { merge: true });
      } catch (err) {
        console.error("Firestore cost update error:", err);
      }
      return costs[idx];
    }
    return null;
  },
  deleteCost: (costId) => {
    const costs = dbService.getCosts().filter(c => c.id !== costId);
    dbService.saveCosts(costs);
    try {
      const costRef = doc(db, COLLECTIONS.COSTS, costId);
      deleteDoc(costRef);
    } catch (err) {
      console.error("Firestore cost delete error:", err);
    }
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
  },
  getPlans: () => {
    const plans = loadCollection('adu-db-plans', DEFAULT_PLANS);
    // Limit to Free and Pro plans only, filtering out legacy expert tiers
    const filtered = plans.filter(p => p.id === 'free' || p.id === 'pro');
    if (filtered.length !== plans.length) {
      dbService.savePlans(filtered);
      return filtered;
    }
    return plans;
  },
  savePlans: (plans) => {
    saveCollection('adu-db-plans', plans);
    plans.forEach(async (plan) => {
      try {
        const planRef = doc(db, COLLECTIONS.SUBSCRIPTIONS, plan.id);
        await setDoc(planRef, plan, { merge: true });
      } catch (err) {
        console.error(`Firestore plans sync failed for ${plan.id}:`, err);
      }
    });
  },
  getDeposits: () => loadCollection('adu-db-deposits', DEFAULT_DEPOSITS),
  saveDeposits: (deposits) => {
    saveCollection('adu-db-deposits', deposits);
    deposits.forEach(async (dep) => {
      try {
        const depRef = doc(db, COLLECTIONS.DEPOSITS, dep.id);
        await setDoc(depRef, dep, { merge: true });
      } catch (err) {
        console.error(`Firestore deposits sync failed for ${dep.id}:`, err);
      }
    });
  },
  addDeposit: (deposit) => {
    const deposits = dbService.getDeposits();
    const newDep = {
      id: deposit.id || 'dep-' + Date.now(),
      userId: deposit.userId,
      userName: deposit.userName || 'User',
      userEmail: deposit.userEmail,
      planId: deposit.planId,
      planName: deposit.planName,
      price: deposit.price,
      screenshot: deposit.screenshot || '',
      status: deposit.status || 'pending',
      timestamp: deposit.timestamp || new Date().toISOString()
    };
    deposits.unshift(newDep);
    dbService.saveDeposits(deposits);
    dbService.addLog(`Submitted payment deposit of ${newDep.price} for plan ${newDep.planId.toUpperCase()} by user ${newDep.userEmail}`);
    return newDep;
  },
  updateDeposit: (depositId, updatedFields) => {
    const deposits = dbService.getDeposits();
    const idx = deposits.findIndex(d => d.id === depositId);
    if (idx !== -1) {
      const oldDeposit = deposits[idx];
      const updatedDeposit = { ...oldDeposit, ...updatedFields };
      deposits[idx] = updatedDeposit;
      dbService.saveDeposits(deposits);

      // Status transition logic to automatically activate subscriptions
      if (updatedFields.status === 'approved' && oldDeposit.status !== 'approved') {
        dbService.updateUser(oldDeposit.userId, { subscription: oldDeposit.planId });
        dbService.addLog(`Approved payment deposit for user ${oldDeposit.userEmail}. Subscription set to ${oldDeposit.planId.toUpperCase()}.`);
      } else if (updatedFields.status === 'rejected' && oldDeposit.status === 'approved') {
        dbService.updateUser(oldDeposit.userId, { subscription: 'free' });
        dbService.addLog(`Reverted/Rejected payment deposit for user ${oldDeposit.userEmail}. Subscription reset to FREE.`);
      } else if (updatedFields.status === 'pending' && oldDeposit.status === 'approved') {
        dbService.updateUser(oldDeposit.userId, { subscription: 'free' });
        dbService.addLog(`Set payment deposit for user ${oldDeposit.userEmail} back to pending. Subscription reset to FREE.`);
      } else if (updatedFields.status === 'rejected' && oldDeposit.status !== 'rejected') {
        dbService.updateUser(oldDeposit.userId, { subscription: 'free' });
        dbService.addLog(`Rejected payment deposit for user ${oldDeposit.userEmail}. Subscription reset/kept as FREE.`);
      }
      return updatedDeposit;
    }
    return null;
  },
  deleteDeposit: (depositId) => {
    const deposits = dbService.getDeposits();
    const depositToDelete = deposits.find(d => d.id === depositId);
    const filtered = deposits.filter(d => d.id !== depositId);
    dbService.saveDeposits(filtered);
    
    // Delete from Firestore
    try {
      const depRef = doc(db, COLLECTIONS.DEPOSITS, depositId);
      deleteDoc(depRef);
    } catch (err) {
      console.error("Firestore deposit delete error:", err);
    }

    if (depositToDelete) {
      dbService.addLog(`Deleted deposit transaction receipt for user ${depositToDelete.userEmail}`);
    }
  },
  // --- BUILD STEPS ---
  getBuildSteps: () => {
    const steps = loadCollection('adu-db-steps', initialBuildSteps);
    // Auto-migrate old data: if steps don't match current default titles, reset
    if (steps.length > 0 && steps[0].title === 'Feasibility') {
      saveCollection('adu-db-steps', initialBuildSteps);
      return initialBuildSteps;
    }
    return steps;
  },
  saveBuildSteps: (steps) => saveCollection('adu-db-steps', steps),
  addBuildStep: (step) => {
    const steps = dbService.getBuildSteps();
    const newStep = {
      id: step.id || Date.now(),
      title: step.title,
      description: step.description || '',
      typicalTimeline: step.typicalTimeline || '',
      checklist: step.checklist || [],
      commonRejectionReasons: step.commonRejectionReasons || []
    };
    steps.push(newStep);
    dbService.saveBuildSteps(steps);
    dbService.addLog(`Created build step: "${newStep.title}"`);
    return newStep;
  },
  updateBuildStep: (stepId, updatedFields) => {
    const steps = dbService.getBuildSteps();
    const idx = steps.findIndex(s => s.id === Number(stepId));
    if (idx !== -1) {
      const updated = { ...steps[idx], ...updatedFields };
      steps[idx] = updated;
      dbService.saveBuildSteps(steps);
      dbService.addLog(`Updated build step: "${updated.title}"`);
      return updated;
    }
    return null;
  },
  deleteBuildStep: (stepId) => {
    const steps = dbService.getBuildSteps();
    const stepToDelete = steps.find(s => s.id === Number(stepId));
    const filtered = steps.filter(s => s.id !== Number(stepId));
    dbService.saveBuildSteps(filtered);
    if (stepToDelete) {
      dbService.addLog(`Deleted build step: "${stepToDelete.title}"`);
    }
  },

  // --- RESOURCES ---
  getResources: () => loadCollection('adu-db-resources', SEED_RESOURCES),
  saveResources: (resources) => {
    saveCollection('adu-db-resources', resources);
    resources.forEach(async (res) => {
      try {
        const resRef = doc(db, COLLECTIONS.RESOURCES, res.id);
        await setDoc(resRef, res, { merge: true });
      } catch (err) {
        console.error(`Firestore resources sync failed for ${res.id}:`, err);
      }
    });
  },
  addResource: (res) => {
    const resources = dbService.getResources();
    const newRes = {
      id: res.id || 'res-' + Date.now(),
      title: res.title,
      type: res.type || 'PDF Document',
      size: res.size || '1.0 MB',
      desc: res.desc || '',
      fileUrl: res.fileUrl || '',
      access: res.access || 'all'
    };
    resources.unshift(newRes);
    dbService.saveResources(resources);
    dbService.addLog(`Created new download resource: "${newRes.title}"`);
    return newRes;
  },
  updateResource: (resId, updatedFields) => {
    const resources = dbService.getResources();
    const idx = resources.findIndex(r => r.id === resId);
    if (idx !== -1) {
      const updated = { ...resources[idx], ...updatedFields };
      resources[idx] = updated;
      dbService.saveResources(resources);
      dbService.addLog(`Updated download resource: "${updated.title}"`);
      return updated;
    }
    return null;
  },
  deleteResource: (resId) => {
    const resources = dbService.getResources();
    const resToDelete = resources.find(r => r.id === resId);
    const filtered = resources.filter(r => r.id !== resId);
    dbService.saveResources(filtered);
    
    // Delete from Firestore
    try {
      const resRef = doc(db, COLLECTIONS.RESOURCES, resId);
      deleteDoc(resRef);
    } catch (err) {
      console.error("Firestore resource delete error:", err);
    }

    if (resToDelete) {
      dbService.addLog(`Deleted download resource: "${resToDelete.title}"`);
    }
  }
};
