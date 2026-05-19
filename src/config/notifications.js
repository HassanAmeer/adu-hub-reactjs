export const NOTIFICATION_SETTINGS = {
  types: {
    LEGISLATIVE: 'legislative_alerts',
    NEWSLETTER: 'newsletter_digests',
    LEAD_INQUIRY: 'contractor_leads'
  },
  defaultState: {
    legislativeAlerts: true,
    newsletter: false,
    leadInquiries: true
  }
};

export default NOTIFICATION_SETTINGS;
