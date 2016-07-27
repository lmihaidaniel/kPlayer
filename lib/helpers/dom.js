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
		if (c != null) {
			c = c.split(' ');
			for (var k in c) {
				if (c[k] != '') elem.classList.add(c[k]);
			}
		}
	};
	removeClass = function(elem, c) {
		if (c != null) {
			c = c.split(' ');
			for (var k in c) {
				if (c[k] != '') elem.classList.remove(c[k]);
			}
		}
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
	if (c != null) {
		var fn = hasClass(elem, c) ? removeClass : addClass;
		fn(elem, c);
	}
};

let getPrefixedStylePropName = function getPrefixedStylePropName(propName) {
	var domPrefixes = 'Webkit Moz ms O'.split(' '),
		elStyle = document.documentElement.style;
	if (elStyle[propName] !== undefined) return propName; // Is supported unprefixed
	propName = propName.charAt(0).toUpperCase() + propName.substr(1);
	for (var i = 0; i < domPrefixes.length; i++) {
		if (elStyle[domPrefixes[i] + propName] !== undefined) {
			return domPrefixes[i] + propName; // Is supported with prefix
		}
	}
};

/**
 * Offset Left
 * getBoundingClientRect technique from
 * John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
 *
 * @function findElPosition
 * @param {Element} el Element from which to get offset
 * @return {Object}
 */

let findElPosition = function(el) {
	let box;

	if (el.getBoundingClientRect && el.parentNode) {
		box = el.getBoundingClientRect();
	}

	if (!box) {
		return {
			left: 0,
			top: 0
		};
	}

	const docEl = document.documentElement;
	const body = document.body;

	const clientLeft = docEl.clientLeft || body.clientLeft || 0;
	const scrollLeft = window.pageXOffset || body.scrollLeft;
	const left = box.left + scrollLeft - clientLeft;

	const clientTop = docEl.clientTop || body.clientTop || 0;
	const scrollTop = window.pageYOffset || body.scrollTop;
	const top = box.top + scrollTop - clientTop;

	// Android sometimes returns slightly off decimal values, so need to round
	return {
		left: Math.round(left),
		top: Math.round(top)
	};
};

export default {
	stylePrefix: {
		transform: getPrefixedStylePropName('transform'),
		perspective: getPrefixedStylePropName('perspective'),
		backfaceVisibility: getPrefixedStylePropName('backfaceVisibility')
	},
	triggerWebkitHardwareAcceleration: function(element) {
		if (this.stylePrefix.backfaceVisibility && this.stylePrefix.perspective) {
			element.style[this.stylePrefix.perspective] = '1000px';
			element.style[this.stylePrefix.backfaceVisibility] = 'hidden';
		}
	},
	transform: function(element, value) {
		element.style[this.stylePrefix.transform] = value;
	},
	/**
	 * Shorter and fast way to select multiple nodes in the DOM
	 * @param   { String } selector - DOM selector
	 * @param   { Object } ctx - DOM node where the targets of our search will is located
	 * @returns { Object } dom nodes found
	 */
	selectAll: function(selector, ctx) {
		return (ctx || document).querySelectorAll(selector)
	},
	/**
	 * Shorter and fast way to select a single node in the DOM
	 * @param   { String } selector - unique dom selector
	 * @param   { Object } ctx - DOM node where the target of our search will is located
	 * @returns { Object } dom node found
	 */
	select: function(selector, ctx) {
		return (ctx || document).querySelector(selector)
	},
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	toggleClass: toggleClass,
	autoLineHeight: function(el) {
		let l = el.offsetHeight + "px";
		el.style.lineHeight = l;
		return l;
	},
	/**
	 * Determines, via duck typing, whether or not a value is a DOM element.
	 *
	 * @function isEl
	 * @param    {Mixed} value
	 * @return   {Boolean}
	 */
	isEl: function(value) {
		return !!value && typeof value === 'object' && value.nodeType === 1;
	},
	/**
	 * Determines, via duck typing, whether or not a value is a text node.
	 *
	 * @param  {Mixed} value
	 * @return {Boolean}
	 */
	isTextNode: function(value) {
		return !!value && typeof value === 'object' && value.nodeType === 3;
	},
	setElAttributes: function(el, attributes) {
		Object.getOwnPropertyNames(attributes).forEach(function(attrName) {
			let attrValue = attributes[attrName];

			if (attrValue === null || typeof attrValue === 'undefined' || attrValue === false) {
				el.removeAttribute(attrName);
			} else {
				el.setAttribute(attrName, (attrValue === true ? '' : attrValue));
			}
		});
	},
	getElAttributes: function(tag) {
		var obj, knownBooleans, attrs, attrName, attrVal;

		obj = {};

		// known boolean attributes
		// we can check for matching boolean properties, but older browsers
		// won't know about HTML5 boolean attributes that we still read from
		knownBooleans = ',' + 'autoplay,controls,loop,muted,default' + ',';

		if (tag && tag.attributes && tag.attributes.length > 0) {
			attrs = tag.attributes;

			for (var i = attrs.length - 1; i >= 0; i--) {
				attrName = attrs[i].name;
				attrVal = attrs[i].value;

				// check for known booleans
				// the matching element property will return a value for typeof
				if (typeof tag[attrName] === 'boolean' || knownBooleans.indexOf(',' + attrName + ',') !== -1) {
					// the value of an included boolean attribute is typically an empty
					// string ('') which would equal false if we just check for a false value.
					// we also don't want support bad code like autoplay='false'
					attrVal = (attrVal !== null) ? true : false;
				}

				obj[attrName] = attrVal;
			}
		}

		return obj;
	},
	createElement: function(elm, props) {
		let el = document.createElement(elm);
		for(var k in props){
			el.setAttribute(k, props[k]);
		};
		return el;
	},
	emptyElement: function(elm) {
		while (elm.firstChild) {
			elm.removeChild(elm.firstChild);
		}
		return elm;
	},
	replaceElement: function(target, elm) {
		target.parentNode.replaceChild(elm, target);
	},
	addElement: function(target, elm)  {
		target.appendChild(elm);
	},
	removeElement: function(element) {
		element.parentNode.removeChild(element);
	},
	insertElAfter: function(el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
	},
	insertElBefore: function(el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode);
	},
	insertElFirst: function(el, referenceNode) {
		if (referenceNode.firstChild) {
			parent.insertBefore(el, referenceNode.firstChild);
		} else {
			referenceNode.appendChild(el);
		}
	},
	getTextContent: function(el) {
		return el.textContent || el.innerText;
	},
	/**
	 * Offset Left
	 * getBoundingClientRect technique from
	 * John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
	 *
	 * @function findElPosition
	 * @param {Element} el Element from which to get offset
	 * @return {Object}
	 */
	findElPosition: findElPosition,
	/**
	 * Get pointer position in element
	 * Returns an object with x and y coordinates.
	 * The base on the coordinates are the bottom left of the element.
	 *
	 * @function getPointerPosition
	 * @param {Element} el Element on which to get the pointer position on
	 * @param {Event} event Event object
	 * @return {Object} This object will have x and y coordinates corresponding to the mouse position
	 */
	getPointerPosition: function(el, event) {
		let position = {};
		let box = findElPosition(el);
		let boxW = el.offsetWidth;
		let boxH = el.offsetHeight;

		let boxY = box.top;
		let boxX = box.left;
		let pageY = event.pageY;
		let pageX = event.pageX;

		if (event.changedTouches) {
			pageX = event.changedTouches[0].pageX;
			pageY = event.changedTouches[0].pageY;
		}

		position.y = Math.max(0, Math.min(1, ((boxY - pageY) + boxH) / boxH));
		position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));

		return position;
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