// Deep extend/merge destination object with N more objects
// http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
// Removed call to arguments.callee (used explicit function name instead)
export default (function() {
	let _extend = function() {
		// Get arguments
		var objects = arguments;

		// Bail if nothing to merge
		if (!objects.length) {
			return;
		}

		// Return first if specified but nothing to merge
		if (objects.lenth == 1) {
			return objects[0];
		}

		// First object is the destination
		var destination = Array.prototype.shift.call(objects),
			length = objects.length;

		// Loop through all objects to merge
		for (var i = 0; i < length; i++) {
			var source = objects[i];

			for (var property in source) {
				if (source[property] && source[property].constructor && source[property].constructor === Object) {
					destination[property] = destination[property] || {};
					_extend(destination[property], source[property]);
				} else {
					destination[property] = source[property];
				}
			}
		}

		return destination;
	}
	return _extend;
})();