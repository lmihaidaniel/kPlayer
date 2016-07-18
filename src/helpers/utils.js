/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
export function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
export function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export function trim(string) {
	return string.replace(/^\s+|\s+$/gm, '')
}

export function procentFromString(v){
	 if(v === undefined || v === null) return false;
	let t = false;
	if(v.indexOf){
		if(v.indexOf('%') > -1)
		{
		  t = parseFloat(v);
		}
	}
	return t;
}

export function debounce(fn, delay) {
	var t
	return function() {
		clearTimeout(t)
		t = setTimeout(fn, delay)
	}
}
export function getPercentage(current, max) {
	if (current === 0 || max === 0 || isNaN(current) || isNaN(max)) {
		return 0;
	}
	return ((current / max) * 100).toFixed(2);
}

export function getRandBinaryfunction() {
	return Math.floor(Math.random() * 2);
}

export function toSeconds(t) {
	var s = 0.0;
	if (t) {
		var p = t.split(':');
		for (var i = 0; i < p.length; i++)
			s = s * 60 + parseFloat(p[i].replace(',', '.'))
	}
	return s;
}

/**
 * Faster String startsWith alternative
 * @param   { String } src - source string
 * @param   { String } str - test string
 * @returns { Boolean } -
 */
export function startsWith(src, str) {
  return src.slice(0, str.length) === str
}

/**
 * Detect if the argument passed is a string
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
export function isString(v) {
  return (typeof v === 'string');
}

/**
 * Detect if the argument passed is a numeric
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
export function isNumeric(v){
  return !isNaN(v);
}

/**
 * Detect if the argument passed is a strict numeric
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
export function isStrictNumeric(v){
  return (isNaN(v) && typeof v === 'number')
}


/**
 * Detect if the argument passed is a boolean
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
export function isBoolean(v){
  return (typeof v === 'boolean');
}

/**
 * Detect if the argument passed is a function
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
export function isFunction(v) {
  return typeof v === 'function' || false   // avoid IE problems
}

/**
 * Detect if the argument passed is an object, exclude null.
 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
export function isObject(v) {
  return v && typeof v === 'object'         // typeof null is 'object'
}

/**
 * Check whether an object is a kind of array
 * @param   { * } a - anything
 * @returns {Boolean} is 'a' an array?
 */
export function isArray(a) { return Array.isArray(a) || a instanceof Array }

/**
 * Check whether an array contains an item
 * @param   { Array } arr - target array
 * @param   { * } item - item to test
 * @returns { Boolean } Does 'arr' contain 'item'?
 */
export function contains(arr, item) {
  return arr.indexOf(item) > -1;
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
* @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
export function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options))
  return el
}

/**
 * Detect whether a property of an object could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } is this property writable?
 */
export function isWritable(obj, key) {
  var props = Object.getOwnPropertyDescriptor(obj, key)
  return typeof obj[key] === T_UNDEF || props && props.writable
}

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
export function extend(src) {
  var obj, args = arguments
  for (var i = 1; i < args.length; ++i) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          src[key] = obj[key]
      }
    }
  }
  return src
}

export function scaleFont(f, width, el) {
	var r = false, l = false;
	if(f.units != 'px') f.units = 'em';
	if (f.min !== false && f.ratio !== false) {
		r = f.ratio * width / 1000;
		if (r < f.min) r = f.min;
		if (f.units == 'px') r = Math.ceil(r);
		if (!isNaN(f.lineHeight) && f.lineHeight) {
			l = r * f.lineHeight;
			if (l < 1) l = 1;
			l = +l.toFixed(3) + f.units;
		}
		r = +r.toFixed(3) + f.units;
	}
	if(el){
		if(r) el.style.fontSize = r;
		if(l) el.style.lineHeight = l;
	}
	return {fontSize: r, lineHeight: l};
};

export default {};