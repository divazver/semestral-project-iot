export const API_TIMEOUT = 6000;

export const EXPIRATION = {
  oneWeek: 60 * 60 * 24 * 7,
};

export const COOKIES_TOKEN = {
  name: 'token-uuWetApp',
  domain: '.brodec.sk',
};

export const ROLES = {
  admin: 'admin',
  user: 'user',
};

export const GRANULARITY_OPTIONS = {
  "daily": 1440,
  "hourly": 60,
  "5 minutes": 5,
  "1 minute": 1,
};

export const GRANULARITY_RANGES = {
  1440: {from: 1440, to: 43200},
  60: {from: 60, to: 1440},
  5: {from: 5, to: 90},
  1: {from: 1, to: 30},
};

export const GRANULARITY_TO_TIME = {
  hourly: "HH:mm",
  day: "dd.LL",
  month: "LLL",
}

export const TIME_OUT_RESPONSE = '2000';
