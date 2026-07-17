export const API_CONFIG = {
  DEV_URL: "http://localhost:3000/api/v1",
  PROD_URL: "https://api.lifesync.app/api/v1",
  DEFAULT_TIMEOUT: 10000,
};

export const THEME_CONFIG = {
  LIGHT: "light",
  DARK: "dark",
  AMOLED: "amoled",
} as const;

export const DEFAULT_SETTINGS = {
  theme: "dark" as const,
  currency: "USD",
  language: "en",
  timezone: "UTC",
};

export const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "JPY", symbol: "¥" },
];

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "hi", label: "हिन्दी" },
];
