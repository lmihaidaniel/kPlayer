/**
 * @module dom
 * Module for easing the manipulation of dom elements
 */

let classReg = function(c) {
	return new RegExp("(^|\\s+)" + c + "(\\s+|$)");
};

let hasClass
let addClass
let removeClass;
let toggleClass;

if ('classList' in document.documentElement) {
	hasClass = function(elem, c) {
		return elem.classList.contains(c);
	};
	addClass = function(elem, c) {
		c = c.split(' ');
		for (var k in c) elem.classList.add(c[k]);
	};
	removeClass = function(elem, c) {
		elem.classList.remove(c);
	};
} else {
	hasClass = function(elem, c) {
		return classReg(c).test(elem.className);
	};
	addClass = function(elem, c) {
		if (!hasClass(elem, c)) {
			elem.className = elem.className + ' ' + c;
		}
	};
	removeClass = function(elem, c) {
		elem.className = elem.className.replace(classReg(c), ' ');
	};
}

toggleClass = function(elem, c) {
	var fn = hasClass(elem, c) ? removeClass : addClass;
	fn(elem, c);
};

export default {
	class: {
		has: hasClass,
		add: addClass,
		remove: removeClass,
		toggle: toggleClass
	},
	createElement: function(node, props) {
		let el = document.createElement(node);
		for (let k in props) {
			el.setAttribute(k, props[k]);
		}
		return el;
	},
	// Remove an element
    remove: function(element) {
        if (!element) {
            return;
        }
        element.parentNode.removeChild(element);
    },
	wrap: function(elements, wrapper) {
		// Convert `elements` to an array, if necessary.
		if (!elements.length) {
			elements = [elements];
		}

		// Loops backwards to prevent having to clone the wrapper on the
		// first element (see `child` below).
		for (var i = elements.length - 1; i >= 0; i--) {
			var child = (i > 0) ? wrapper.cloneNode(true) : wrapper;
			var element = elements[i];

			// Cache the current parent and sibling.
			var parent = element.parentNode;
			var sibling = element.nextSibling;

			// Wrap the element (is automatically removed from its current
			// parent).
			child.appendChild(element);

			// If the element had a sibling, insert the wrapper before
			// the sibling to maintain the HTML structure; otherwise, just
			// append it to the parent.
			if (sibling) {
				parent.insertBefore(child, sibling);
			} else {
				parent.appendChild(child);
			}

			return child;
		}
	}
}