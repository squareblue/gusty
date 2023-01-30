/**
 * Super-simple, not-secure generator for quasi-random values
 * @param prefix
 * @returns {string}
 */
export function randomId(prefix = 'i') {
  return prefix + Math.random().toString(36).substring(2, 12).toLowerCase();
}
