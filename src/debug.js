// Do we want to log every dispatch
export const logging = true;

export const log = function(...args) {
  if(logging === true) {
    console.log(...args);
  }
};
