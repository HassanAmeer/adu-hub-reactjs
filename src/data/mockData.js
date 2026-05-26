export const states = [
  { id: 'ca', name: 'California', status: 'Allowed', cities: ['San Diego', 'Los Angeles', 'San Francisco'] },
  { id: 'wa', name: 'Washington', status: 'Allowed', cities: ['Seattle', 'Tacoma', 'Spokane'] },
  { id: 'or', name: 'Oregon', status: 'Restricted', cities: ['Portland', 'Salem', 'Eugene'] },
  { id: 'tx', name: 'Texas', status: 'Restricted', cities: ['Austin', 'Dallas', 'Houston'] },
];

export const featuredCities = [
  { name: 'San Diego', state: 'California', img: 'https://images.unsplash.com/photo-1513366208864-87536b8bd7b4?q=80&w=800&auto=format&fit=crop' },
  { name: 'Los Angeles', state: 'California', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop' },
  { name: 'Seattle', state: 'Washington', img: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?q=80&w=800&auto=format&fit=crop' },
];

export const aduRules = [
  { title: 'Maximum Size', value: '1,200 sq ft', description: 'Depending on lot size and existing primary dwelling size.' },
  { title: 'Maximum Height', value: '16-25 ft', description: 'Generally 16ft for detached ADUs, higher for attached.' },
  { title: 'Parking', value: 'None required', description: 'In most areas near transit or if replacing existing parking.' },
  { title: 'Owner Occupancy', value: 'Not Required', description: 'Recent state laws have removed this requirement for most ADUs.' },
  { title: 'Setbacks', value: '4 ft Rear/Side', description: 'Most states now limit side and rear setbacks to a maximum of 4 feet.' },
  { title: 'Utility Connection', value: 'Direct or Separate', description: 'Connection to primary utilities allowed; separate meters optional in most cases.' },
  { title: 'Fire & Safety', value: 'Sprinklers if Primary', description: 'Fire sprinklers only required if they are required in the primary dwelling.' },
];

export const buildSteps = [
  {
    id: 1,
    title: 'Feasibility Check',
    description: 'Check your lot size, zoning, and local setbacks to see what you can build.',
    typicalTimeline: '1-2 weeks',
    checklist: [
      'Verify property zoning classification',
      'Check minimum lot size requirements',
      'Confirm front, side, and rear setbacks',
      'Review HOA covenants if applicable'
    ],
    commonRejectionReasons: [
      'Lot too small for proposed ADU size',
      'Insufficient setback distance',
      'Property in a protected overlay zone',
      'Utility connection not feasible'
    ]
  },
  {
    id: 2,
    title: 'Survey & Site Constraints',
    description: 'Conduct a detailed site survey to identify physical constraints and utility access points.',
    typicalTimeline: '2-3 weeks',
    checklist: [
      'Hire a licensed land surveyor',
      'Identify property boundary lines and easements',
      'Locate existing utility connections',
      'Assess soil conditions and drainage'
    ],
    commonRejectionReasons: [
      'Easement restrictions limit buildable area',
      'Unstable soil conditions found',
      'Flood zone or environmental constraints',
      'Utility connection too far from site'
    ]
  },
  {
    id: 3,
    title: 'Design Options',
    description: 'Work with an architect to create ADU designs that meet your needs and local codes.',
    typicalTimeline: '4-8 weeks',
    checklist: [
      'Research local design guidelines and style requirements',
      'Hire a licensed architect or ADU designer',
      'Review multiple floor plan options',
      'Finalize design for permit submission'
    ],
    commonRejectionReasons: [
      'Design exceeds maximum height limit',
      'Proposed unit exceeds max square footage',
      'Incompatible with neighborhood character',
      'Missing required egress windows'
    ]
  },
  {
    id: 4,
    title: 'Plan Submittal',
    description: 'Submit your completed plans to the building and planning department for review.',
    typicalTimeline: '2-4 weeks',
    checklist: [
      'Prepare complete plan set with structural calculations',
      'Complete energy compliance documentation',
      'Pay applicable permit and plan check fees',
      'Submit digital and physical copies'
    ],
    commonRejectionReasons: [
      'Incomplete application package',
      'Structural calculations not provided',
      'Missing energy compliance documentation',
      'Improper parcel map or legal description'
    ]
  },
  {
    id: 5,
    title: 'Permit Review',
    description: 'City reviewers evaluate your plans for code compliance and issue the building permit.',
    typicalTimeline: '4-12 weeks',
    checklist: [
      'Respond to plan review comments promptly',
      'Submit revised drawings if requested',
      'Coordinate with structural, mechanical, and plumbing reviewers',
      'Receive and post approved permit'
    ],
    commonRejectionReasons: [
      'Life safety code violations found',
      'Structural calculations do not meet code',
      'Fire access requirements not satisfied',
      'Multiple review cycles exhausted'
    ]
  },
  {
    id: 6,
    title: 'Construction',
    description: 'Build your ADU with a licensed contractor following approved plans.',
    typicalTimeline: '4-9 months',
    checklist: [
      'Hire licensed general contractor',
      'Obtain required trade permits (electrical, plumbing, mechanical)',
      'Schedule rough-in and final inspections',
      'Coordinate utility connections and meters'
    ],
    commonRejectionReasons: [
      'Work without permit discovered',
      'Contractor not properly licensed or insured',
      'Deviations from approved plans',
      'Failed rough-in inspection'
    ]
  },
  {
    id: 7,
    title: 'Final Inspection & Occupancy',
    description: 'Final sign-off from the city before you can move in or rent your ADU.',
    typicalTimeline: '2-4 weeks',
    checklist: [
      'Schedule final building inspection',
      'Complete all trade inspections (electrical, plumbing, mechanical)',
      'Obtain certificate of occupancy',
      'Record ADU with county assessor'
    ],
    commonRejectionReasons: [
      'Life safety issues unresolved',
      'Occupancy attempted without final approval',
      'Unpermitted changes discovered during final walkthrough',
      'Fire safety systems not operational'
    ]
  },
];
