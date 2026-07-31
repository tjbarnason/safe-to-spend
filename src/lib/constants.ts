export const DEFAULT_WINDOW_DAYS = 14;

/** Minimum balance floor in cents. Members want to stay above this. */
export const DEFAULT_FLOOR_CENTS = 75000; // $750
export const ALERT_LOOKAHEAD_DAYS = 7;
export const MIN_ALERT_LEAD_HOURS = 48;
export const DEBOUNCE_MS = 300;

// Status thresholds
export const COMFORTABLE_THRESHOLD = 0.20; // capacity > 20% of committed
export const TIGHT_SIMULATION_THRESHOLD = 0.10; // min balance within 10% of committed

// Detection thresholds
export const MIN_OCCURRENCES = 3;
export const CONFIRMED_OCCURRENCES = 5;
export const AMOUNT_VARIANCE_THRESHOLD = 0.05; // 5%

// Frequency interval ranges (in days)
export const FREQUENCY_RANGES = {
  weekly: { min: 5, max: 9 },
  biweekly: { min: 12, max: 16 },
  monthly: { min: 27, max: 34 },
  quarterly: { min: 85, max: 95 },
  annual: { min: 355, max: 375 },
} as const;
