/**
 * Retrieves a typically nested value safely, without throwing an error.
 * Returns undefined or defaultValue if path cannot be found or value found is undefined
 * @param {object} o Object we are looking in
 * @param {string[]} keyPath Key path to the value
 * @param {*} defaultValue The default value if the result is undefined
 */
function getIn<Type>(o: {}, keyPath: string[] = [], defaultValue: Type | undefined): Type | undefined {
  // check basic validity of obj
  if (!o) return defaultValue;

  let i = 0;

  // cycle through each key in array of keys, unless the result is null/undefined
  // obj != null returns false for undefined != null && null != null

  // DO NOT USE `in` operator, such as if(key in obj), since `in` searches the entire prototype chain, and we don't care about that
  while (o != null && i < keyPath.length) {
    // @ts-ignore we are reassigning 'o' (breaking the original ref to 'obj') until we've drilled down to the desired field so the type of 'o' can/will change per loop and that makes ts unhappy
    o = o[keyPath[i++]];
  }

  // index is greater than 0 and we have finished looping, then return the output
  const result = i && i === keyPath.length ? (o as Type) : undefined;

  return result !== undefined ? (o as Type) : defaultValue;
}

export { getIn };
