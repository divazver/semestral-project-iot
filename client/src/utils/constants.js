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
  "1 day": 1440,
  "3 hours": 180,
  "1 hour": 60,
  "30 minutes": 30,
  "10 minutes": 10,
  "5 minutes": 5,
  "1 minute": 1,
};

export const GRANULARITY_RANGES = {
  1440: {from: 2880, to: 43200},
  180: {from: 360, to: 5400},
  60: {from: 120, to: 1800},
  30: {from: 60, to: 900},
  10: {from: 20, to: 300},
  5: {from: 10, to: 150},
  1: {from: 2, to: 29},
};

export const GRANULARITY_TO_TIME = {
  hourly: "HH:mm",
  day: "dd.LL",
  month: "LLL",
}

export const TIME_OUT_RESPONSE = '2000';
