// Reference: https://github.com/billjs/query-string/blob/master/src/index.ts

const defaultStringifyFunction = (key, value) => value;
const defaultEq = '=';
const defaultSep = '&';
const defaultConfig = {
  eq: defaultEq,
  sep: defaultSep,
  prefix: '',
  fn: defaultStringifyFunction,
};

/**
 * Given a query object, return the query string
 * See qs-stringify.test.ts for examples
 * stringify({a: 1, b: 2}) // returns 'a=1&b=s'
 */
function stringify(obj, config = defaultConfig) {
  const {eq, sep, fn, prefix} = {...defaultConfig, ...config};
  if (obj == null || !isObject(obj)) {
    return '';
  }

  return Object.entries(obj)
    .filter(([, value]) => value !== null) // filter out null values
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return encode(key, value.join(','), {eq, fn, prefix});
      }

      if (isObject(value)) {
        return stringify(value, {eq, sep, fn, prefix: getKey(key, prefix)});
      }
      return encode(key, value, {eq, fn, prefix});
    })
    .join(sep);
}

// encode the key and add prefix if necessary
const getKey = (key, prefix = '') => {
  const encodedKey = encodeURIComponent(key);
  if (prefix) return `${prefix}[${encodedKey}]`;
  return encodedKey;
};

// encode the key and value of a query object
const encode = (
  key,
  value,
  {eq = defaultEq, fn = defaultStringifyFunction, prefix = ''},
) => {
  const newValue = encodeURIComponent(fn(key, value));
  const newKey = getKey(key, prefix);

  return [newKey, newValue].join(eq);
};

// check if the given value is an object
function isObject(obj) {
  const type = typeof obj;
  return (obj && (type === 'object' || type === 'function')) || false;
}

export default stringify;
