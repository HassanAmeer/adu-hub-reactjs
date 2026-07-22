// ADU Navi Local Persistent Database Service
// Provides CRUD capabilities for Super Admin and User dashboards
// Falls back to localStorage and loads default mock data if not initialized.

import { aduRules as initialRules, buildSteps as initialBuildSteps } from '../data/mockData';
import { ALL_50_STATES } from '../data/statesData';
import { doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { COLLECTIONS } from '../config';
import { SEED_RESOURCES } from '../seed/seedData';

const getDateXDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

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
    joinedDate: getDateXDaysAgo(120),
    subscriptionActivatedDate: getDateXDaysAgo(30),
    subscriptionExpiresDate: getDateXDaysAgo(-30)
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
    joinedDate: getDateXDaysAgo(0) // Today
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
      { id: 'lead-1', name: 'Mark Smith', email: 'mark@gmail.com', phone: '619-555-0129', property: '789 Pine Rd, San Diego, CA', message: 'Interested in building a detached 800 sq ft ADU.', date: getDateXDaysAgo(2) },
      { id: 'lead-2', name: 'Sarah Connor', email: 'sarah@hotmail.com', phone: '858-555-0982', property: '456 Hill Ave, La Jolla, CA', message: 'Looking for a general estimate for garage conversion.', date: getDateXDaysAgo(1) }
    ],
    joinedDate: getDateXDaysAgo(2), // Last 7 days
    subscriptionActivatedDate: getDateXDaysAgo(2),
    subscriptionExpiresDate: getDateXDaysAgo(-28)
  },
  {
    id: 'user-investor-id',
    name: 'Marcus Vance',
    email: 'marcus@vancecapital.com',
    role: 'investor',
    status: 'active',
    subscription: 'pro',
    savedProperties: [],
    savedPros: [],
    joinedDate: getDateXDaysAgo(5) // Last 7 days
  },
  {
    id: 'user-homeowner-2',
    name: 'Emily Watson',
    email: 'emily.watson@gmail.com',
    role: 'homeowner',
    status: 'active',
    subscription: 'free',
    savedProperties: [],
    savedPros: [],
    joinedDate: getDateXDaysAgo(15) // Last 30 days
  },
  {
    id: 'user-pro-2',
    name: 'David Chen',
    email: 'dchen@bayarchitecture.com',
    role: 'professional',
    status: 'active',
    subscription: 'pro',
    savedProperties: [],
    savedPros: [],
    joinedDate: getDateXDaysAgo(25) // Last 30 days
  },
  {
    id: 'user-investor-2',
    name: 'Sophia Patel',
    email: 'spatel@equityadu.com',
    role: 'investor',
    status: 'active',
    subscription: 'free',
    savedProperties: [],
    savedPros: [],
    joinedDate: getDateXDaysAgo(45) // Last 60 days
  },
  {
    id: 'user-homeowner-3',
    name: 'Robert Garcia',
    email: 'rgarcia@yahoo.com',
    role: 'homeowner',
    status: 'suspended',
    subscription: 'free',
    savedProperties: [],
    savedPros: [],
    joinedDate: getDateXDaysAgo(75) // Last 90 days
  }
];

const DEFAULT_DIRECTORY = [
  // --- SAN DIEGO, CA ---
  {
    id: 1,
    name: 'Coastal Design Studio',
    role: 'Architect',
    rating: 4.9,
    reviews: 124,
    reviewSource: 'Google Reviews',
    location: 'San Diego, CA',
    tags: ['Detached', 'Conversion', 'Modern'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$35 / lead',
    leadClickCount: 28,
    websiteClickCount: 64,
    email: 'contact@coastaldesign.com',
    phone: '619-555-1234',
    website: 'https://coastaldesign.com',
    description: 'Top Google-reviewed architecture studio specializing in modern and eco-friendly ADUs in San Diego.'
  },
  {
    id: 2,
    name: 'Pacific ADU Builders',
    role: 'General Contractor',
    rating: 4.8,
    reviews: 96,
    reviewSource: 'Yelp 4.5+',
    location: 'San Diego, CA',
    tags: ['Garage Conversion', 'Turnkey', 'Permitted'],
    images: [
      'https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$40 / lead',
    leadClickCount: 19,
    websiteClickCount: 42,
    email: 'build@pacificadu.com',
    phone: '619-555-9876',
    website: 'https://pacificadu.com',
    description: 'Yelp 4.8-star rated contractor delivering turn-key attached and detached ADUs across San Diego County.'
  },
  {
    id: 3,
    name: 'San Diego Modular Units',
    role: 'ADU Consultant',
    rating: 4.7,
    reviews: 68,
    reviewSource: 'Angi Approved',
    location: 'San Diego, CA',
    tags: ['Modular', 'Prefab', 'Fast Permit'],
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$25 / lead',
    leadClickCount: 14,
    websiteClickCount: 31,
    email: 'info@sdmodular.com',
    phone: '619-555-4321',
    website: 'https://sdmodular.com',
    description: 'Angi-certified prefab ADU specialist reducing site construction timelines by 50%.'
  },

  // --- LOS ANGELES, CA ---
  {
    id: 4,
    name: 'Precision Build ADU',
    role: 'General Contractor',
    rating: 4.8,
    reviews: 189,
    reviewSource: 'Yelp 4.5+',
    location: 'Los Angeles, CA',
    tags: ['Modular', 'Eco-Friendly', 'Hillside Compliant'],
    images: [
      'https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$50 / lead',
    leadClickCount: 35,
    websiteClickCount: 88,
    email: 'info@precisionbuildadu.com',
    phone: '213-555-7890',
    website: 'https://precisionbuildadu.com',
    description: 'Top Yelp 4.8-star rated construction firm for detached and garage conversion ADUs in Los Angeles.'
  },
  {
    id: 5,
    name: 'LA Urban Dwelling Studio',
    role: 'Architect',
    rating: 4.9,
    reviews: 142,
    reviewSource: 'Google Reviews',
    location: 'Los Angeles, CA',
    tags: ['Modern Architectural', 'JADU Specialist'],
    images: [
      'https://images.unsplash.com/photo-1574067769351-34440c836935?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$45 / lead',
    leadClickCount: 22,
    websiteClickCount: 51,
    email: 'hello@laurbandwelling.com',
    phone: '310-555-0199',
    website: 'https://laurbandwelling.com',
    description: 'Google 4.9-star architectural group navigating LA City planning and SB 9 multi-unit provisions.'
  },

  // --- SAN FRANCISCO, CA ---
  {
    id: 6,
    name: 'Urban Dwelling Co.',
    role: 'ADU Consultant',
    rating: 5.0,
    reviews: 82,
    reviewSource: 'Google Reviews',
    location: 'San Francisco, CA',
    tags: ['Feasibility', 'Permitting', 'Historical'],
    images: [
      'https://images.unsplash.com/photo-1574067769351-34440c836935?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$30 / lead',
    leadClickCount: 16,
    websiteClickCount: 39,
    email: 'hello@urbandwelling.co',
    phone: '415-555-4567',
    website: 'https://urbandwelling.co',
    description: 'Google 5.0-star consulting firm aiding SF homeowners through slope feasibility and seismic codes.'
  },

  // --- SACRAMENTO, CA ---
  {
    id: 7,
    name: 'Golden State Architects',
    role: 'Architect',
    rating: 4.8,
    reviews: 215,
    reviewSource: 'Google Reviews',
    location: 'Sacramento, CA',
    tags: ['Luxury', 'Historical', 'Custom'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$40 / lead',
    leadClickCount: 31,
    websiteClickCount: 72,
    email: 'info@goldenstatearch.com',
    phone: '916-555-8833',
    website: 'https://goldenstatearch.com',
    description: 'Award-winning Sacramento architects with 200+ Google 5-star reviews for custom ADU structures.'
  },

  // --- AUSTIN, TX ---
  {
    id: 8,
    name: 'Top Tier Builders Austin',
    role: 'General Contractor',
    rating: 4.9,
    reviews: 310,
    reviewSource: 'Yelp 4.5+',
    location: 'Austin, TX',
    tags: ['Yelp 4.5+', 'Top Rated', 'Detached Suite'],
    images: ['https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop'],
    price: '$$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$50 / lead',
    leadClickCount: 44,
    websiteClickCount: 110,
    email: 'contact@toptier.com',
    phone: '512-555-0000',
    website: 'https://toptier.com',
    description: 'Top-rated Yelp contractor in Austin building detached granny flats and rental suites.'
  },

  // --- SEATTLE, WA ---
  {
    id: 9,
    name: 'Emerald City ADUs',
    role: 'General Contractor',
    rating: 4.9,
    reviews: 145,
    reviewSource: 'Google Reviews',
    location: 'Seattle, WA',
    tags: ['DADU Specialist', 'Rainier Insulation', 'Eco-Friendly'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop'],
    price: '$$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$45 / lead',
    leadClickCount: 26,
    websiteClickCount: 58,
    email: 'info@emeraldcityadus.com',
    phone: '206-555-7788',
    website: 'https://emeraldcityadus.com',
    description: 'Google 4.9-star Seattle DADU builder maximizing lot efficiency under Seattle land use code.'
  },

  // --- PORTLAND, OR ---
  {
    id: 10,
    name: 'Rose City Backyard Homes',
    role: 'ADU Consultant',
    rating: 4.8,
    reviews: 116,
    reviewSource: 'Google Reviews',
    location: 'Portland, OR',
    tags: ['Cottage Cluster', 'Sustainable Wood', 'Permit Ready'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop'],
    price: '$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$35 / lead',
    leadClickCount: 18,
    websiteClickCount: 45,
    email: 'hello@rosecityadus.com',
    phone: '503-555-3344',
    website: 'https://rosecityadus.com',
    description: 'Portland premier advisory and design firm for backyard homes and cottage clusters.'
  },

  // --- PHOENIX, AZ ---
  {
    id: 11,
    name: 'Desert Oasis ADUs',
    role: 'General Contractor',
    rating: 4.9,
    reviews: 108,
    reviewSource: 'Google Reviews',
    location: 'Phoenix, AZ',
    tags: ['Thermal Efficiency', 'Casita Specialist'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop'],
    price: '$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$40 / lead',
    leadClickCount: 21,
    websiteClickCount: 49,
    email: 'build@desertoasisaz.com',
    phone: '602-555-8899',
    website: 'https://desertoasisaz.com',
    description: 'Google 4.9-star casita builder engineered for Arizona climate insulation and solar readiness.'
  },

  // --- DENVER, CO ---
  {
    id: 12,
    name: 'Mile High ADU Studio',
    role: 'Architect',
    rating: 4.9,
    reviews: 134,
    reviewSource: 'Angi Approved',
    location: 'Denver, CO',
    tags: ['Mountain Modern', 'Energy Efficient'],
    images: ['https://images.unsplash.com/photo-1574067769351-34440c836935?q=80&w=400&auto=format&fit=crop'],
    price: '$$$',
    verified: true,
    isReferralEligible: true,
    incentiveRate: '$45 / lead',
    leadClickCount: 23,
    websiteClickCount: 54,
    email: 'contact@milehighadu.com',
    phone: '303-555-2211',
    website: 'https://milehighadu.com',
    description: 'Angi-approved architectural firm specializing in Denver urban accessory dwelling design.'
  }
];

const DEFAULT_ALERTS = [
  {
    id: 'ticket-1',
    date: '2026-07-20',
    state: 'California',
    title: 'Map Loading Error in Property Checker',
    status: 'critical alert',
    impact: 'Critical High',
    desc: 'Users reporting Google Maps JavaScript API key rate limit error when launching Property Checker for San Diego parcel searches.',
    timeline: [
      { status: 'pending', date: '2026-07-20T09:00:00Z', note: 'Issue reported by 4 homeowners in San Diego.' },
      { status: 'critical alert', date: '2026-07-20T09:30:00Z', note: 'System alert dispatched to lead admin & engineering team.' }
    ]
  },
  {
    id: 'ticket-2',
    date: '2026-07-19',
    state: 'Texas',
    title: 'Pending Verification of Austin SB 9 Zoning Ordinance',
    status: 'pending',
    impact: 'Medium',
    desc: 'Awaiting updated municipal zoning PDF confirmation for Austin multi-family residential lot setbacks.',
    timeline: [
      { status: 'pending', date: '2026-07-19T11:15:00Z', note: 'Zoning ticket registered and queued for verification.' }
    ]
  },
  {
    id: 'ticket-3',
    date: '2026-07-18',
    state: 'Washington',
    title: 'Update Zoning Codes for Seattle DADU Height Limits',
    status: 'in progress',
    impact: 'Medium',
    desc: 'Seattle updated maximum ridge heights for detached ADUs from 18ft to 22ft near urban centers. Syncing rules engine.',
    timeline: [
      { status: 'pending', date: '2026-07-18T10:00:00Z', note: 'City ordinance update logged.' },
      { status: 'in progress', date: '2026-07-18T14:20:00Z', note: 'Engineering team currently updating database rulesets.' }
    ]
  },
  {
    id: 'ticket-4',
    date: '2026-07-15',
    state: 'Oregon',
    title: 'Fix Subscription Zelle Transfer Receipt Modal Typo',
    status: 'fixed',
    impact: 'Low',
    desc: 'Resolved routing number label typo on Zelle Bank Wire payment modal during deposit checkout.',
    timeline: [
      { status: 'pending', date: '2026-07-15T08:30:00Z', note: 'Typo reported by admin team.' },
      { status: 'in progress', date: '2026-07-15T09:00:00Z', note: 'Correction pushed to staging.' },
      { status: 'fixed', date: '2026-07-15T10:45:00Z', note: 'Verified fix on production live server.' }
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
  trackProInteraction: (proId, type) => {
    const dir = dbService.getDirectory();
    const idx = dir.findIndex(p => String(p.id) === String(proId));
    if (idx !== -1) {
      if (type === 'lead' || type === 'message' || type === 'phone') {
        dir[idx].leadClickCount = (dir[idx].leadClickCount || 0) + 1;
      } else if (type === 'website') {
        dir[idx].websiteClickCount = (dir[idx].websiteClickCount || 0) + 1;
      }
      dbService.saveDirectory(dir);
      return dir[idx];
    }
    return null;
  },
  getReferralStats: () => {
    const dir = dbService.getDirectory();
    const referralPartners = dir.filter(p => p.isReferralEligible);
    const totalLeads = dir.reduce((acc, p) => acc + (p.leadClickCount || 0), 0);
    const totalWebClicks = dir.reduce((acc, p) => acc + (p.websiteClickCount || 0), 0);
    const estimatedIncentives = (totalLeads * 35) + (totalWebClicks * 5);

    return {
      partnerCount: referralPartners.length,
      totalLeads,
      totalWebClicks,
      estimatedIncentives
    };
  },

  // --- LAW TRACKER & ALERTS ---
  getAlerts: () => loadCollection('adu-db-alerts-v2', DEFAULT_ALERTS),
  saveAlerts: (alerts) => saveCollection('adu-db-alerts-v2', alerts),
  addAlert: (alert) => {
    const alerts = dbService.getAlerts();
    const newAlert = {
      id: 'alert-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      state: alert.state || 'System',
      title: alert.title,
      status: alert.status || 'pending',
      impact: alert.impact || 'Medium',
      desc: alert.desc,
      timeline: [
        { status: alert.status || 'pending', date: new Date().toISOString(), note: 'Ticket logged by administrator.' }
      ]
    };
    alerts.push(newAlert);
    dbService.saveAlerts(alerts);
    dbService.addLog(`Created system ticket alert: "${alert.title}"`);
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
  updateAlertStatus: (alertId, newStatus, note = '') => {
    const alerts = dbService.getAlerts();
    const idx = alerts.findIndex(a => a.id === alertId);
    if (idx !== -1) {
      alerts[idx].status = newStatus;
      if (!alerts[idx].timeline) {
        alerts[idx].timeline = [];
      }
      alerts[idx].timeline.push({
        status: newStatus,
        date: new Date().toISOString(),
        note: note || `Status updated to ${newStatus}`
      });
      dbService.saveAlerts(alerts);
      dbService.addLog(`Updated system ticket "${alerts[idx].title}" status to "${newStatus}"`);
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
    const logs = dbService.getLogs();
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
  },

  // --- ZONING QUERY VOLUME ANALYTICS ---
  getZoningQueryStats: (timeline = '30days', locationFilter = 'all') => {
    const mockQueries = [
      { id: 'q-101', address: '1240 Grand Ave', city: 'San Diego', state: 'California', date: '2026-07-21', status: 'Feasible - 1,200 sq ft Allowed', score: 94 },
      { id: 'q-102', address: '4820 Sunset Blvd', city: 'Los Angeles', state: 'California', date: '2026-07-21', status: 'Feasible - Garage Conversion', score: 88 },
      { id: 'q-103', address: '710 Congress Ave', city: 'Austin', state: 'Texas', date: '2026-07-20', status: 'Feasible - JADU Allowed', score: 91 },
      { id: 'q-104', address: '320 Pine St', city: 'Seattle', state: 'Washington', date: '2026-07-20', status: 'Feasible - DADU Height 22ft', score: 96 },
      { id: 'q-105', address: '1500 Market St', city: 'San Francisco', state: 'California', date: '2026-07-19', status: 'Conditional - Historic Overlay', score: 72 },
      { id: 'q-106', address: '850 NW 23rd Ave', city: 'Portland', state: 'Oregon', date: '2026-07-19', status: 'Feasible - Cottage Cluster', score: 95 },
      { id: 'q-107', address: '240 N Central Ave', city: 'Phoenix', state: 'Arizona', date: '2026-07-18', status: 'Feasible - Detached Casita', score: 90 },
      { id: 'q-108', address: '1700 Broadway', city: 'Denver', state: 'Colorado', date: '2026-07-17', status: 'Feasible - 1,000 sq ft Max', score: 89 },
      { id: 'q-109', address: '950 Ocean Drive', city: 'Miami', state: 'Florida', date: '2026-07-16', status: 'Feasible - Secondary Unit', score: 87 },
      { id: 'q-110', address: '500 Capitol Mall', city: 'Sacramento', state: 'California', date: '2026-07-15', status: 'Feasible - Streamlined Permit', score: 98 }
    ];

    const cityBreakdown = [
      { name: 'San Diego, CA', count: 420, percent: 28 },
      { name: 'Los Angeles, CA', count: 350, percent: 23 },
      { name: 'Austin, TX', count: 240, percent: 16 },
      { name: 'Seattle, WA', count: 190, percent: 13 },
      { name: 'San Francisco, CA', count: 160, percent: 11 },
      { name: 'Portland, OR', count: 140, percent: 9 }
    ];

    const stateBreakdown = [
      { name: 'California', count: 930, percent: 62 },
      { name: 'Texas', count: 240, percent: 16 },
      { name: 'Washington', count: 190, percent: 13 },
      { name: 'Oregon', count: 140, percent: 9 }
    ];

    let totalCount = 1500;
    if (timeline === '60days') totalCount = 2850;
    if (timeline === '90days') totalCount = 4200;
    if (timeline === '1year') totalCount = 16800;
    if (timeline === '2years') totalCount = 31200;

    let filteredQueries = mockQueries;
    if (locationFilter !== 'all' && locationFilter !== 'top_cities' && locationFilter !== 'top_states') {
      const target = locationFilter.toLowerCase();
      filteredQueries = mockQueries.filter(q => 
        q.city.toLowerCase().includes(target) || 
        q.state.toLowerCase().includes(target)
      );
    }

    return {
      totalCount,
      topCity: 'San Diego, CA',
      topState: 'California',
      passRate: '94.2% Feasible',
      cityBreakdown,
      stateBreakdown,
      recentQueries: filteredQueries
    };
  }
};
