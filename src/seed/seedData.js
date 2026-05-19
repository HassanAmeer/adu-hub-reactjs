// Firestore Seed Data
// Centralized mock data containing realistic configurations and stable relationship mapping.

import { ROLES } from '../config/roles';

export const SEED_USERS = [
  {
    id: 'admin@gmail.com',
    name: 'Super Administrator',
    email: 'admin@gmail.com',
    password: '12345678',
    role: ROLES.SUPER_ADMIN,
    status: 'active',
    subscription: 'expert',
    savedProperties: [],
    savedPros: [],
    joinedDate: '2026-01-01'
  },
  {
    id: 'user1@gmail.com',
    name: 'Jane Smith',
    email: 'user1@gmail.com',
    password: '12345678',
    role: ROLES.HOMEOWNER,
    status: 'active',
    subscription: 'free',
    savedProperties: [
      { id: 'check-ca-1', address: '123 Ocean Blvd, San Diego, CA 92109', status: 'Feasible' },
      { id: 'check-tx-1', address: '456 Austin Way, Austin, TX 78704', status: 'Restricted' }
    ],
    savedPros: ['pro-coastal-design'],
    joinedDate: '2026-02-15'
  },
  {
    id: 'user2@gmail.com',
    name: 'Robert Davis',
    email: 'user2@gmail.com',
    password: '12345678',
    role: ROLES.INVESTOR,
    status: 'active',
    subscription: 'expert',
    savedProperties: [],
    savedPros: ['pro-precision-build'],
    joinedDate: '2026-03-10'
  },
  {
    id: 'pro1@gmail.com',
    name: 'Sarah Connor',
    email: 'pro1@gmail.com',
    password: '12345678',
    role: ROLES.PROFESSIONAL,
    status: 'active',
    subscription: 'pro',
    savedProperties: [],
    savedPros: [],
    proListingId: 'pro-coastal-design',
    leads: [
      { id: 'lead-1', name: 'John Doe', email: 'johndoe@gmail.com', phone: '619-555-0987', property: '789 Pacific St, San Diego, CA', message: 'Looking to build a 2-bedroom detached ADU.', date: '2026-05-18' }
    ],
    joinedDate: '2026-04-01'
  }
];

export const SEED_STATES = [
  { id: 'ca', name: 'California', status: 'Allowed', cities: ['San Diego', 'Los Angeles', 'San Francisco', 'Sacramento'] },
  { id: 'wa', name: 'Washington', status: 'Allowed', cities: ['Seattle', 'Tacoma', 'Spokane'] },
  { id: 'or', name: 'Oregon', status: 'Allowed', cities: ['Portland', 'Eugene', 'Salem'] },
  { id: 'tx', name: 'Texas', status: 'Restricted', cities: ['Austin', 'Dallas', 'Houston'] },
  { id: 'fl', name: 'Florida', status: 'Restricted', cities: ['Miami', 'Tampa', 'Orlando'] }
];

export const SEED_CITIES = [
  // California Cities
  { id: 'san-diego', stateId: 'ca', name: 'San Diego', status: 'Allowed', img: 'https://images.unsplash.com/photo-1513366208864-87536b8bd7b4?q=80&w=800&auto=format&fit=crop' },
  { id: 'los-angeles', stateId: 'ca', name: 'Los Angeles', status: 'Allowed', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop' },
  { id: 'san-francisco', stateId: 'ca', name: 'San Francisco', status: 'Allowed', img: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=800&auto=format&fit=crop' },
  { id: 'sacramento', stateId: 'ca', name: 'Sacramento', status: 'Allowed', img: 'https://images.unsplash.com/photo-1595113340742-650772242137?q=80&w=800&auto=format&fit=crop' },

  // Washington Cities
  { id: 'seattle', stateId: 'wa', name: 'Seattle', status: 'Allowed', img: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?q=80&w=800&auto=format&fit=crop' },
  { id: 'tacoma', stateId: 'wa', name: 'Tacoma', status: 'Allowed', img: 'https://images.unsplash.com/photo-1563290264-ebbe3c51ef6f?q=80&w=800&auto=format&fit=crop' },

  // Oregon Cities
  { id: 'portland', stateId: 'or', name: 'Portland', status: 'Allowed', img: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=800&auto=format&fit=crop' },
  { id: 'eugene', stateId: 'or', name: 'Eugene', status: 'Allowed', img: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop' },

  // Texas Cities
  { id: 'austin', stateId: 'tx', name: 'Austin', status: 'Allowed', img: 'https://images.unsplash.com/photo-1531219572328-a0171b4448a3?q=80&w=800&auto=format&fit=crop' },
  { id: 'houston', stateId: 'tx', name: 'Houston', status: 'Restricted', img: 'https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?q=80&w=800&auto=format&fit=crop' },

  // Florida Cities
  { id: 'miami', stateId: 'fl', name: 'Miami', status: 'Restricted', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop' },
  { id: 'tampa', stateId: 'fl', name: 'Tampa', status: 'Restricted', img: 'https://images.unsplash.com/photo-1597176116047-876a32798fcc?q=80&w=800&auto=format&fit=crop' }
];

export const SEED_ADU_LAWS = [
  // State-wide California Laws
  {
    id: 'law-state-ca',
    stateId: 'ca',
    level: 'state',
    title: 'California Statewide ADU Mandate',
    sizeLimit: 'Up to 1,200 sq ft for detached ADUs; attached ADUs limited to 50% of primary home size or 800 sq ft minimum.',
    heightLimit: 'Detached ADUs: 16-18 ft; Attached ADUs: 25 ft or matching primary height constraints.',
    setbackReq: '4 feet minimum side and rear setbacks; no setback required for existing conversions.',
    parkingReq: 'No parking spaces required if the ADU is located within 0.5 miles of public transit.',
    ownerOccupancy: 'Not required for ADUs permitted between 2020 and 2025; extended indefinitely for most lots.',
    fireSafety: 'Fire sprinklers only required in the ADU if they are required in the primary house.',
    utilityConnection: 'No local impact fees for ADUs under 750 sq ft; connection fees must be proportional.'
  },
  // San Diego Local Law Details
  {
    id: 'law-city-san-diego',
    stateId: 'ca',
    cityId: 'san-diego',
    level: 'city',
    title: 'San Diego ADU Bonus Program',
    sizeLimit: 'Max 1,200 sq ft. Allows multiple ADUs on multi-family lots, and 1 bonus ADU for every affordable ADU deed-restricted.',
    heightLimit: 'Up to 16 ft for single story, or 30 ft for multi-story in Transit Priority Areas.',
    setbackReq: '0 ft setbacks for conversions and new detached ADUs up to 16 ft high; 4 ft rear/side otherwise.',
    parkingReq: 'Zero parking required in Transit Priority Areas (TPAs).',
    ownerOccupancy: 'Completely waived.',
    fireSafety: 'Waived for conversions unless primary home requires it.',
    utilityConnection: 'Local permit fee waivers apply to all ADUs under 750 sq ft.'
  },
  // Washington State Laws
  {
    id: 'law-state-wa',
    stateId: 'wa',
    level: 'state',
    title: 'Washington State Middle Housing Laws',
    sizeLimit: 'Max 1,000 sq ft or 75% of primary house area, whichever is smaller.',
    heightLimit: 'Max height of 16-24 ft depending on zoning and primary dwelling height.',
    setbackReq: '5 ft side and rear setbacks.',
    parkingReq: 'No parking required within 0.5 miles of transit; max 1 space per ADU elsewhere.',
    ownerOccupancy: 'Cities are encouraged to waive owner-occupancy requirements.',
    fireSafety: 'Standard safety checks. Sprinklers only if primary home has them.',
    utilityConnection: 'Separate connections required in most counties; utility fees must be proportional.'
  },
  // Austin Texas Laws
  {
    id: 'law-city-austin',
    stateId: 'tx',
    cityId: 'austin',
    level: 'city',
    title: 'Austin HOME Initiative ADU Rules',
    sizeLimit: 'Allows up to 1,100 sq ft or 0.15 lot area ratio, whichever is smaller. Multi-family lots allowed.',
    heightLimit: 'Max height of 30 ft; limited to two stories.',
    setbackReq: '5 ft rear and side setbacks; front setback matches zoning.',
    parkingReq: 'Waived for ADUs under Austin\'s new HOME initiative.',
    ownerOccupancy: 'Not required.',
    fireSafety: 'Waived for minor conversion units.',
    utilityConnection: 'Proportional fees; smart metering encouraged.'
  }
];

export const SEED_PROPERTY_CHECKS = [
  {
    id: 'check-ca-1',
    address: '123 Ocean Blvd, San Diego, CA 92109',
    stateId: 'ca',
    cityId: 'san-diego',
    lotSize: 7500,
    zone: 'RS-1-7 (Single-Family Residential)',
    feasibilityRating: 'Excellent',
    notes: 'Lot size is large enough to support a detached 1,200 sq ft ADU. Excellent access and proximity to public transit removes all parking requirements.',
    timestamp: '2026-05-18T10:00:00Z',
    checkedBy: 'user1@gmail.com'
  },
  {
    id: 'check-tx-1',
    address: '456 Austin Way, Austin, TX 78704',
    stateId: 'tx',
    cityId: 'austin',
    lotSize: 5200,
    zone: 'SF-3 (Family Residence)',
    feasibilityRating: 'Good',
    notes: 'Lot supports an attached or detached ADU up to 1,100 sq ft. Minor setback check needed on western lot line.',
    timestamp: '2026-05-19T11:30:00Z',
    checkedBy: 'user1@gmail.com'
  }
];

export const SEED_PROFESSIONALS = [
  {
    id: 'pro-coastal-design',
    name: 'Coastal Design Studio',
    role: 'Architect',
    rating: 4.9,
    reviews: 124,
    location: 'San Diego, CA',
    tags: ['Detached', 'Conversion', 'Modern', 'Permitting'],
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
    id: 'pro-precision-build',
    name: 'Precision Build ADU',
    role: 'General Contractor',
    rating: 4.7,
    reviews: 89,
    location: 'Austin, TX',
    tags: ['Modular', 'Eco-Friendly', 'Garage Conversion'],
    images: [
      'https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$',
    verified: true,
    email: 'info@precisionbuildadu.com',
    phone: '213-555-7890',
    website: 'https://precisionbuildadu.com',
    description: 'Precision construction company building high-quality detached, attached, and garage conversion ADUs in Los Angeles and Austin.'
  },
  {
    id: 'pro-urban-dwelling',
    name: 'Urban Dwelling Co.',
    role: 'ADU Consultant',
    rating: 5.0,
    reviews: 42,
    location: 'Seattle, WA',
    tags: ['Feasibility', 'Permitting', 'Soil Test'],
    images: [
      'https://images.unsplash.com/photo-1574067769351-34440c836935?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$',
    verified: false,
    email: 'hello@urbandwelling.co',
    phone: '415-555-4567',
    website: 'https://urbandwelling.co',
    description: 'Consulting agency helping homeowners identify lot feasibility, complete soil tests, and navigate city zoning permits.'
  }
];

export const SEED_COSTS = [
  { id: 'cost-ca-detached', stateId: 'ca', type: 'Detached', minSize: 500, maxSize: 800, avgCost: 245000, pricePerSqFt: 385, designCost: 18000, permitCost: 8000, constructionCost: 219000 },
  { id: 'cost-wa-detached', stateId: 'wa', type: 'Detached', minSize: 500, maxSize: 800, avgCost: 220000, pricePerSqFt: 340, designCost: 15000, permitCost: 6000, constructionCost: 199000 },
  { id: 'cost-tx-conversion', stateId: 'tx', type: 'Garage Conversion', minSize: 300, maxSize: 500, avgCost: 120000, pricePerSqFt: 280, designCost: 8000, permitCost: 3000, constructionCost: 109000 },
  { id: 'cost-or-attached', stateId: 'or', type: 'Attached', minSize: 400, maxSize: 700, avgCost: 175000, pricePerSqFt: 310, designCost: 12000, permitCost: 5000, constructionCost: 158000 }
];

export const SEED_LAW_UPDATES = [
  {
    id: 'update-1',
    date: '2026-05-12',
    stateId: 'ca',
    title: 'SB 1211: Parking & Coverage Relief',
    status: 'Passed',
    impact: 'High',
    desc: 'This bill removes local authority to require replacement parking when a garage is converted to an ADU, and clarifies lot coverage limits.',
    before: 'Cities could require up to 1 parking space per bedroom for any ADU project, making many conversions unfeasible.',
    after: 'No replacement parking required for conversions or projects near transit. Lot coverage exemptions expanded.'
  },
  {
    id: 'update-2',
    date: '2026-04-15',
    stateId: 'wa',
    title: 'HB 1110: Middle Housing Act',
    status: 'Implementation Phase',
    impact: 'Very High',
    desc: 'Mandates cities to allow at least two ADUs per lot in all residential zones. Cities have until 2025 to update local codes.',
    before: 'Most cities limited single-family lots to a maximum of one attached or detached ADU.',
    after: 'Cities must allow at least two ADUs per lot in all residential zones, drastically increasing housing density options.'
  },
  {
    id: 'update-3',
    date: '2026-03-28',
    stateId: 'or',
    title: 'SB 1537: Housing Infrastructure',
    status: 'Signed by Governor',
    impact: 'Medium',
    desc: 'Expands the use of revolving loan funds for ADU construction and infrastructure upgrades.',
    before: 'Limited state funding available specifically for homeowner-driven ADU projects.',
    after: 'Expands a $3M revolving loan fund to provide targeted financing for ADU construction.'
  }
];

export const SEED_NOTIFICATIONS = [
  {
    id: 'template-default',
    title: 'Zoning Change Log',
    body: 'Zoning regulations in {{location}} have changed. Review updated setback and size limitations in the Law Tracker.',
    type: 'system',
    createdAt: '2026-05-19T00:00:00Z'
  }
];

export const SEED_SUBSCRIPTIONS = [
  {
    id: 'sub-package-free',
    name: 'Free Starter Plan',
    price: 0,
    period: 'lifetime',
    features: ['1 Zoning Property Check', 'Basic Law Tracker Access', 'Directory Searches']
  },
  {
    id: 'sub-package-pro',
    name: 'Professional Tier',
    price: 49,
    period: 'monthly',
    features: ['Unlimited Zoning Property Checks', 'Detailed Cost Estimation Breakdown', 'Full Pro Partner Directory Listing']
  },
  {
    id: 'sub-package-expert',
    name: 'Enterprise Builder',
    price: 199,
    period: 'annual',
    features: ['Unlimited Access', 'Priority Lead Notifications', 'Deed Restriction Compliance Helper', 'API Property Zoning Access']
  }
];

export const SEED_ALERTS = [
  {
    id: 'alert-general-1',
    title: 'System Launch Success',
    message: 'Welcome to ADU Navi Admin and Seeding Dashboard. Populate your database in one click.',
    severity: 'info',
    timestamp: '2026-05-19T10:00:00Z'
  }
];

export const SEED_LOGS = [
  {
    id: 'log-seed-1',
    admin: 'System System Seeder',
    action: 'Database initialized and seeded defaults successfully.',
    timestamp: '2026-05-19T18:45:00Z'
  }
];

export const SEED_INQUIRIES = [
  {
    id: 'inq-sample-1',
    name: 'Michael Peterson',
    email: 'michael.p@gmail.com',
    message: 'Hello, I have a single-family house in San Diego (zoning RS-1-7) and wanted to know if I can convert my garage into a 450 sq ft ADU. Do I need to provide a replacement parking space?',
    timestamp: '2026-05-19T14:30:00Z',
    status: 'unread'
  },
  {
    id: 'inq-sample-2',
    name: 'Amanda Clark',
    email: 'aclark@contracting.com',
    message: 'I am a general contractor in Austin and am interested in listing my firm in your Professional Directory. What are the requirements for Verification badges?',
    timestamp: '2026-05-19T12:15:00Z',
    status: 'read'
  }
];

export const SEED_SETTINGS = [
  {
    id: 'global',
    notificationEmailTemplate: 'Hello {{name}},\n\nWe would like to notify you that there has been an update to the ADU laws in {{location}}.\n\nUpdate Details:\n{{details}}\n\nBest regards,\nADU Navi Team',
    notificationSmsTemplate: 'ADU Navi Law Change Alert: Laws in {{location}} have changed. Details: {{details}}',
    siteTitle: 'ADU Navi - All-in-One ADU Platform',
    metaDescription: 'Find state-by-state ADU laws, property checkers, cost estimation libraries, and professional directory lists for building ADUs.',
    enableEmailAlerts: true,
    enableSmsAlerts: false,
    backupSchedule: 'weekly',
    themeColor: '#059669',
    siteName: 'ADU Navi',
    contactEmail: 'support@adunavi.com',
    contactPhone: '+1 (800) 555-0142',
    logoUrl: '',
    maintenanceMode: false,
    signupAllowed: true,
    darkMode: false,
    sidebarStyle: 'solid',
    metaKeywords: 'adu, accessory dwelling unit, zoning, permitting',
    robotsTxt: 'Index, Follow',
    mailProvider: 'smtp',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    fromEmail: 'noreply@adunavi.com',
    fromName: 'ADU Navi Alerts'
  }
];

