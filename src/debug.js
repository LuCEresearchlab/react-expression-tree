// Do we want to log every dispatch
export const logging = false;

export const log = function (...args) {
  if (logging === true) {
    console.log(...args);
  }
};
