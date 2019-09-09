/**
 * 
 * returns true if the given array contains an element
 * 
 * @export
 * @param {*} array 
 * @param {*} element 
 * @returns 
 */
export function arrayContains(array: any, element: any) {
  var found = false;
  for (var i = 0; i < array.length; i++) {
    if (JSON.stringify(array[i]) == JSON.stringify(element)) {
      found = true;
      break;
    }
  }
  return found;
}
