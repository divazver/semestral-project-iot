export const isValidEmail = (email) => /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email); // eslint-disable-line

export const isEmptyValue = (value) => !value;

export const getRoundedDate = (minutes, d=new Date()) => {
  let ms = 1000 * 60 * minutes;

  return new Date(Math.floor(d.getTime() / ms) * ms);
}
