export const states = [
  { id: 'ca', name: 'California', status: 'Allowed', cities: ['San Diego', 'Los Angeles', 'San Francisco'] },
  { id: 'wa', name: 'Washington', status: 'Allowed', cities: ['Seattle', 'Tacoma', 'Spokane'] },
  { id: 'or', name: 'Oregon', status: 'Conditional', cities: ['Portland', 'Salem', 'Eugene'] },
  { id: 'tx', name: 'Texas', status: 'Conditional', cities: ['Austin', 'Dallas', 'Houston'] },
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
];

export const buildSteps = [
  { id: 1, title: 'Feasibility', description: 'Check your lot size, zoning, and local setbacks to see what you can build.' },
  { id: 2, title: 'Design', description: 'Hire an architect or designer to create plans that meet local codes.' },
  { id: 3, title: 'Permit', description: 'Submit your plans to the city for review and approval.' },
  { id: 4, title: 'Construction', description: 'Build your ADU with a licensed contractor.' },
  { id: 5, title: 'Inspection', description: 'Final sign-off from the city before you can move in.' },
];
