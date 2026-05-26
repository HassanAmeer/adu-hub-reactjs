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
    subscription: 'pro',
    savedProperties: [],
    savedPros: [],
    joinedDate: '2026-01-01',
    subscriptionActivatedDate: '2026-05-10',
    subscriptionExpiresDate: '2026-06-09'
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
    subscription: 'pro',
    savedProperties: [],
    savedPros: ['pro-precision-build'],
    projects: [
      {
        id: 'proj-1',
        name: 'San Diego Rental ADU',
        type: 'Detached',
        status: 'Design Phase',
        budget: 200000,
        progress: 40,
        stateId: 'ca',
        city: 'San Diego',
        size: 750,
        location: '123 Ocean Blvd, San Diego, CA 92109',
        purpose: 'Rental Income',
        zoningStatus: 'Allowed',
        tasks: [
          { id: 't-1', text: 'Site setback feasibility check', completed: true },
          { id: 't-2', text: 'Finalize blueprint architectural design', completed: true },
          { id: 't-3', text: 'Submit zoning application to municipal board', completed: false },
          { id: 't-4', text: 'Hire verified general contractor', completed: false },
          { id: 't-5', text: 'Excavation and foundation concrete pour', completed: false }
        ],
        expenses: [
          { id: 'exp-1', title: 'Surveyor and Soil Analysis', amount: 3500, date: '2026-05-21' },
          { id: 'exp-2', title: 'Architectural Blueprint Design', amount: 5000, date: '2026-05-24' }
        ],
        logs: [
          { id: 'log-1', note: 'Project conceptualized and soil tests ordered.', date: '2026-05-20' },
          { id: 'log-2', note: 'Initial design drawings finished by Coastal Design.', date: '2026-05-24' }
        ]
      },
      {
        id: 'proj-2',
        name: 'Garage Conversion Studio',
        type: 'Garage Conversion',
        status: 'Construction',
        budget: 95000,
        progress: 80,
        stateId: 'ca',
        city: 'Los Angeles',
        size: 450,
        location: '789 Sunset Blvd, Los Angeles, CA 90028',
        purpose: 'Home Office',
        zoningStatus: 'Allowed',
        tasks: [
          { id: 't-1', text: 'Clear garage and run checks', completed: true },
          { id: 't-2', text: 'Permit application approval', completed: true },
          { id: 't-3', text: 'Utility and sewer connection line hookup', completed: true },
          { id: 't-4', text: 'Drywall framing and insulation', completed: true },
          { id: 't-5', text: 'Install plumbing fixtures and painting', completed: false }
        ],
        expenses: [
          { id: 'exp-1', title: 'Permit Fees', amount: 2800, date: '2026-05-15' },
          { id: 'exp-2', title: 'Framing & Lumber Material', amount: 15400, date: '2026-05-18' },
          { id: 'exp-3', title: 'Plumbing Rough-in', amount: 6200, date: '2026-05-22' }
        ],
        logs: [
          { id: 'log-1', note: 'Garage cleanout completed.', date: '2026-05-10' },
          { id: 'log-2', note: 'City permits approved under HOME initiative!', date: '2026-05-15' },
          { id: 'log-3', note: 'Drywall and insulation passed rough inspection.', date: '2026-05-23' }
        ]
      }
    ],
    joinedDate: '2026-03-10',
    subscriptionActivatedDate: '2026-05-20',
    subscriptionExpiresDate: '2026-06-19'
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
    joinedDate: '2026-04-01',
    subscriptionActivatedDate: '2026-05-25',
    subscriptionExpiresDate: '2026-06-24'
  },
  {
    id: 'user3@gmail.com',
    name: 'Emily Nguyen',
    email: 'user3@gmail.com',
    password: '12345678',
    role: ROLES.HOMEOWNER,
    status: 'active',
    subscription: 'free',
    savedProperties: [],
    savedPros: [],
    joinedDate: '2026-04-12'
  },
  {
    id: 'user4@gmail.com',
    name: 'Carlos Mendez',
    email: 'user4@gmail.com',
    password: '12345678',
    role: ROLES.INVESTOR,
    status: 'active',
    subscription: 'pro',
    savedProperties: [],
    savedPros: ['pro-urban-dwelling'],
    joinedDate: '2026-04-18',
    subscriptionActivatedDate: '2026-05-01',
    subscriptionExpiresDate: '2026-05-31'
  },
  {
    id: 'user5@gmail.com',
    name: 'Priya Patel',
    email: 'user5@gmail.com',
    password: '12345678',
    role: ROLES.HOMEOWNER,
    status: 'active',
    subscription: 'free',
    savedProperties: [],
    savedPros: [],
    joinedDate: '2026-05-05'
  },
  {
    id: 'user6@gmail.com',
    name: 'Mark Thompson',
    email: 'user6@gmail.com',
    password: '12345678',
    role: ROLES.INVESTOR,
    status: 'suspended',
    subscription: 'free',
    savedProperties: [],
    savedPros: [],
    joinedDate: '2026-05-12'
  },
  {
    id: 'user7@gmail.com',
    name: 'Lisa Hernandez',
    email: 'user7@gmail.com',
    password: '12345678',
    role: ROLES.PROFESSIONAL,
    status: 'active',
    subscription: 'pro',
    savedProperties: [],
    savedPros: [],
    proListingId: 'pro-precision-build',
    leads: [],
    joinedDate: '2026-05-15',
    subscriptionActivatedDate: '2026-05-22',
    subscriptionExpiresDate: '2026-06-21'
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
    body: 'Zoning regulations in {{location}} have changed. Review updated setback and size limitations in the State Laws.',
    type: 'system',
    createdAt: '2026-05-19T00:00:00Z'
  }
];

export const SEED_SUBSCRIPTIONS = [
  {
    id: 'free',
    name: 'Free Basic Tier',
    price: '$0',
    desc: 'Get started with core ADU tools at no cost. Perfect for homeowners exploring options.',
    features: [
      '3 Property Checker runs per month',
      'Access to state-level ADU laws',
      'Browse professional directory',
      'Basic cost estimator access'
    ]
  },
  {
    id: 'pro',
    name: 'Standard Pro Tier',
    price: '$49',
    desc: 'Full-access plan for contractors, consultants, and serious investors.',
    features: [
      'Unlimited Property Checker runs',
      'Full municipal & city-level law access',
      'Direct lead acquisition queries',
      'Featured directory placement badge',
      'Priority admin support',
      'Download cost reports as PDF'
    ]
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
    contactEmail: 'contact@adunavi.com',
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
    fromName: 'ADU Navi Alerts',
    paymentTitle: 'Zelle & Bank Wire Transfer Details',
    paymentAddress: 'Zelle: pay@adunavi.com | Bank: Wells Fargo A/C 987654321, Routing: 122000247',
    paymentDescription: 'Please transfer the exact plan pricing amount to the address coordinates above. Once completed, upload a screenshot of your transaction confirmation. Our administrators will review the deposit and activate your subscription.'
  }
];

export const SEED_DEPOSITS = [
  {
    id: 'dep-101',
    userId: 'user2@gmail.com',
    userName: 'Robert Davis',
    userEmail: 'user2@gmail.com',
    planId: 'pro',
    planName: 'Standard Pro Tier',
    price: '$49',
    status: 'approved',
    screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-20T14:35:00Z'
  },
  {
    id: 'dep-102',
    userId: 'pro1@gmail.com',
    userName: 'Sarah Connor',
    userEmail: 'pro1@gmail.com',
    planId: 'pro',
    planName: 'Standard Pro Tier',
    price: '$49',
    status: 'approved',
    screenshot: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-25T09:15:00Z'
  },
  {
    id: 'dep-103',
    userId: 'user4@gmail.com',
    userName: 'Carlos Mendez',
    userEmail: 'user4@gmail.com',
    planId: 'pro',
    planName: 'Standard Pro Tier',
    price: '$49',
    status: 'approved',
    screenshot: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-01T11:00:00Z'
  },
  {
    id: 'dep-104',
    userId: 'user7@gmail.com',
    userName: 'Lisa Hernandez',
    userEmail: 'user7@gmail.com',
    planId: 'pro',
    planName: 'Standard Pro Tier',
    price: '$49',
    status: 'approved',
    screenshot: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-22T08:45:00Z'
  },
  {
    id: 'dep-105',
    userId: 'user1@gmail.com',
    userName: 'Jane Smith',
    userEmail: 'user1@gmail.com',
    planId: 'pro',
    planName: 'Standard Pro Tier',
    price: '$49',
    status: 'pending',
    screenshot: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-26T10:20:00Z'
  },
  {
    id: 'dep-106',
    userId: 'user5@gmail.com',
    userName: 'Priya Patel',
    userEmail: 'user5@gmail.com',
    planId: 'pro',
    planName: 'Standard Pro Tier',
    price: '$49',
    status: 'pending',
    screenshot: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-26T13:55:00Z'
  },
  {
    id: 'dep-107',
    userId: 'user3@gmail.com',
    userName: 'Emily Nguyen',
    userEmail: 'user3@gmail.com',
    planId: 'pro',
    planName: 'Standard Pro Tier',
    price: '$49',
    status: 'rejected',
    screenshot: 'https://images.unsplash.com/photo-1565336163952-84958cbaddd0?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-18T16:30:00Z'
  },
  {
    id: 'dep-108',
    userId: 'user6@gmail.com',
    userName: 'Mark Thompson',
    userEmail: 'user6@gmail.com',
    planId: 'pro',
    planName: 'Standard Pro Tier',
    price: '$49',
    status: 'rejected',
    screenshot: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=400&auto=format&fit=crop',
    timestamp: '2026-05-14T09:00:00Z'
  }
];


export const SEED_PLAN_LIMITS = {
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

export const SEED_RESOURCES = [
  {
    id: 'res-1',
    title: 'ADU Planning & Feasibility Guidebook',
    type: 'PDF Document',
    size: '4.8 MB',
    desc: 'A step-by-step primer covering site setbacks, utilities, floorplan optimization, and cost modeling.',
    fileUrl: 'https://example.com/adu-planning-guide.pdf',
    access: 'all'
  },
  {
    id: 'res-2',
    title: 'Standard Detached ADU Blueprint Template',
    type: 'CAD / PDF Drawing',
    size: '12.4 MB',
    desc: 'Sample pre-approved structural layout drawings for a 2-bedroom detached accessory unit.',
    fileUrl: 'https://example.com/adu-detached-blueprint.zip',
    access: 'pro'
  },
  {
    id: 'res-3',
    title: 'Municipal Permit Checklist & Ordinance Tracker',
    type: 'Excel Spreadsheet',
    size: '1.2 MB',
    desc: 'Excel tracker sheet to compute structural fee items, impact fees, and fire hazard zone variables.',
    fileUrl: 'https://example.com/adu-permit-checklist.xlsx',
    access: 'all'
  },
  {
    id: 'res-4',
    title: 'Builder & General Contractor Agreement Template',
    type: 'Word Template',
    size: '250 KB',
    desc: 'A vetted standard contract structure to manage build phases, milestones, and payment schedule.',
    fileUrl: 'https://example.com/builder-agreement-template.docx',
    access: 'pro'
  }
];
