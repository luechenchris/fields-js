/**
 * Checks if the supplied variable contains a value.
 * @param {*} value
 * @returns
 */
export function isDefined(value: any) {
  if (
    typeof value !== 'undefined' &&
    value !== null &&
    value !== '' &&
    value !== {}
  ) {
    return true;
  } else {
    return false;
  }
}
