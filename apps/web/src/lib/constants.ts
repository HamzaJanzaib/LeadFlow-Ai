// App-wide constants
export const APP_NAME = "LeadFlow AI";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Subscription plans
export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    leads: 10,
    campaigns: 1,
    aiRuns: 5,
  },
  STARTER: {
    name: "Starter",
    price: 49,
    leads: 500,
    campaigns: 5,
    aiRuns: 100,
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 149,
    leads: 2500,
    campaigns: 25,
    aiRuns: 500,
  },
  BUSINESS: {
    name: "Business",
    price: 399,
    leads: 10000,
    campaigns: 100,
    aiRuns: 2000,
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: null,
    leads: -1, // Unlimited
    campaigns: -1,
    aiRuns: -1,
  },
} as const;

// Lead sources display names
export const LEAD_SOURCE_LABELS: Record<string, string> = {
  GOOGLE_MAPS: "Google Maps",
  APOLLO: "Apollo",
  LINKEDIN: "LinkedIn",
  CSV_IMPORT: "CSV Import",
  WEBSITE_FORM: "Website Form",
  API: "API",
  MANUAL: "Manual",
  AI_DISCOVERED: "AI Discovered",
};

// Lead status display names
export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  ENRICHING: "Enriching",
  ENRICHED: "Enriched",
  QUALIFIED: "Qualified",
  DISQUALIFIED: "Disqualified",
  ARCHIVED: "Archived",
};

// Deal stage display names
export const DEAL_STAGE_LABELS: Record<string, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  CONTACTED: "Contacted",
  MEETING_SCHEDULED: "Meeting Scheduled",
  PROPOSAL_SENT: "Proposal Sent",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

// User roles
export const USER_ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEMBER: "Member",
  VIEWER: "Viewer",
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

// Date format strings
export const DATE_FORMAT = "MMM d, yyyy";
export const DATETIME_FORMAT = "MMM d, yyyy h:mm a";
