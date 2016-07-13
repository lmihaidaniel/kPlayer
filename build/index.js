(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame || /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
})();

(function (doc, win) {
  'use strict';

  if (typeof doc.createEvent !== 'function') return false; // no tap events here
  // helpers
  var useJquery = typeof jQuery !== 'undefined',
      msEventType = function (type) {
    var lo = type.toLowerCase(),
        ms = 'MS' + type;
    return navigator.msPointerEnabled ? ms : lo;
  },

  // was initially triggered a "touchstart" event?
  wasTouch = false,
      touchevents = {
    touchstart: msEventType('PointerDown') + ' touchstart',
    touchend: msEventType('PointerUp') + ' touchend',
    touchmove: msEventType('PointerMove') + ' touchmove'
  },
      setListener = function (elm, events, callback) {
    var eventsArray = events.split(' '),
        i = eventsArray.length;

    while (i--) {
      elm.addEventListener(eventsArray[i], callback, false);
    }
  },
      getPointerEvent = function (event) {
    return event.targetTouches ? event.targetTouches[0] : event;
  },
      getTimestamp = function () {
    return new Date().getTime();
  },
      sendEvent = function (elm, eventName, originalEvent, data) {
    var customEvent = doc.createEvent('Event');
    customEvent.originalEvent = originalEvent;
    data = data || {};
    data.x = currX;
    data.y = currY;
    data.distance = data.distance;

    // jquery
    if (useJquery) {
      customEvent = jQuery.Event(eventName, { originalEvent: originalEvent });
      jQuery(elm).trigger(customEvent, data);
    }

    // addEventListener
    if (customEvent.initEvent) {
      for (var key in data) {
        customEvent[key] = data[key];
      }
      customEvent.initEvent(eventName, true, true);
      elm.dispatchEvent(customEvent);
    }

    // detect all the inline events
    // also on the parent nodes
    while (elm) {
      // inline
      if (elm['on' + eventName]) elm['on' + eventName](customEvent);
      elm = elm.parentNode;
    }
  },
      onTouchStart = function (e) {
    /**
     * Skip all the mouse events
     * events order:
     * Chrome:
     *   touchstart
     *   touchmove
     *   touchend
     *   mousedown
     *   mousemove
     *   mouseup <- this must come always after a "touchstart"
     *
     * Safari
     *   touchstart
     *   mousedown
     *   touchmove
     *   mousemove
     *   touchend
     *   mouseup <- this must come always after a "touchstart"
     */

    // it looks like it was a touch event!
    if (e.type !== 'mousedown') wasTouch = true;

    // skip this event we don't need to track it now
    if (e.type === 'mousedown' && wasTouch) return;

    var pointer = getPointerEvent(e);

    // caching the current x
    cachedX = currX = pointer.pageX;
    // caching the current y
    cachedY = currY = pointer.pageY;

    longtapTimer = setTimeout(function () {
      sendEvent(e.target, 'longtap', e);
      target = e.target;
    }, longtapThreshold);

    // we will use these variables on the touchend events
    timestamp = getTimestamp();

    tapNum++;
  },
      onTouchEnd = function (e) {

    // skip the mouse events if previously a touch event was dispatched
    // and reset the touch flag
    if (e.type === 'mouseup' && wasTouch) {
      wasTouch = false;
      return;
    }

    var eventsArr = [],
        now = getTimestamp(),
        deltaY = cachedY - currY,
        deltaX = cachedX - currX;

    // clear the previous timer if it was set
    clearTimeout(dblTapTimer);
    // kill the long tap timer
    clearTimeout(longtapTimer);

    if (deltaX <= -swipeThreshold) eventsArr.push('swiperight');

    if (deltaX >= swipeThreshold) eventsArr.push('swipeleft');

    if (deltaY <= -swipeThreshold) eventsArr.push('swipedown');

    if (deltaY >= swipeThreshold) eventsArr.push('swipeup');

    if (eventsArr.length) {
      for (var i = 0; i < eventsArr.length; i++) {
        var eventName = eventsArr[i];
        sendEvent(e.target, eventName, e, {
          distance: {
            x: Math.abs(deltaX),
            y: Math.abs(deltaY)
          }
        });
      }
      // reset the tap counter
      tapNum = 0;
    } else {

      if (cachedX >= currX - tapPrecision && cachedX <= currX + tapPrecision && cachedY >= currY - tapPrecision && cachedY <= currY + tapPrecision) {
        if (timestamp + tapThreshold - now >= 0) {
          // Here you get the Tap event
          sendEvent(e.target, tapNum >= 2 && target === e.target ? 'dbltap' : 'tap', e);
          target = e.target;
        }
      }

      // reset the tap counter
      dblTapTimer = setTimeout(function () {
        tapNum = 0;
      }, dbltapThreshold);
    }
  },
      onTouchMove = function (e) {
    // skip the mouse move events if the touch events were previously detected
    if (e.type === 'mousemove' && wasTouch) return;

    var pointer = getPointerEvent(e);
    currX = pointer.pageX;
    currY = pointer.pageY;
  },
      swipeThreshold = win.SWIPE_THRESHOLD || 100,
      tapThreshold = win.TAP_THRESHOLD || 150,
      // range of time where a tap event could be detected
  dbltapThreshold = win.DBL_TAP_THRESHOLD || 200,
      // delay needed to detect a double tap
  longtapThreshold = win.LONG_TAP_THRESHOLD || 1000,
      // delay needed to detect a long tap
  tapPrecision = win.TAP_PRECISION / 2 || 60 / 2,
      // touch events boundaries ( 60px by default )
  justTouchEvents = win.JUST_ON_TOUCH_DEVICES,
      tapNum = 0,
      currX,
      currY,
      cachedX,
      cachedY,
      timestamp,
      target,
      dblTapTimer,
      longtapTimer;

  //setting the events listeners
  // we need to debounce the callbacks because some devices multiple events are triggered at same time
  setListener(doc, touchevents.touchstart + (justTouchEvents ? '' : ' mousedown'), onTouchStart);
  setListener(doc, touchevents.touchend + (justTouchEvents ? '' : ' mouseup'), onTouchEnd);
  setListener(doc, touchevents.touchmove + (justTouchEvents ? '' : ' mousemove'), onTouchMove);
})(document, window);

function inIframe() {
	try {
		let is = window.self !== window.top;
		if (is) {
			var arrFrames = parent.document.getElementsByTagName("IFRAME");
			for (var i = 0; i < arrFrames.length; i++) {
				let frame = arrFrames[i];
				if (frame.contentWindow === window) {
					is = frame;
					frame.setAttribute('allowfullscreen', 'true');
					frame.setAttribute('mozallowfullscreen', 'true');
					frame.setAttribute('webkitallowfullscreen', 'true');
					frame.setAttribute('frameborder', '0');
				};
			}
		}
		return is;
	} catch (e) {
		return true;
	}
}

var deepmerge = (function () {
	let deepmerge = function (target, src) {
		if (src) {
			var array = Array.isArray(src);
			var dst = array && [] || {};

			if (array) {
				target = target || [];
				dst = dst.concat(target);
				src.forEach(function (e, i) {
					if (typeof dst[i] === 'undefined') {
						dst[i] = e;
					} else if (typeof e === 'object') {
						dst[i] = deepmerge(target[i], e);
					} else {
						if (target.indexOf(e) === -1) {
							dst.push(e);
						}
					}
				});
			} else {
				if (target && typeof target === 'object') {
					Object.keys(target).forEach(function (key) {
						dst[key] = target[key];
					});
				}
				Object.keys(src).forEach(function (key) {
					if (typeof src[key] !== 'object' || !src[key]) {
						dst[key] = src[key];
					} else {
						if (!target[key]) {
							dst[key] = src[key];
						} else {
							dst[key] = deepmerge(target[key], src[key]);
						}
					}
				});
			}
			return dst;
		} else {
			return target || [];
		}
	};
	return deepmerge;
})();

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function procentFromString(v) {
  if (v === undefined || v === null) return false;
  let t = false;
  if (v.indexOf) {
    if (v.indexOf('%') > -1) {
      t = parseFloat(v);
    }
  }
  return t;
}

/**
 * Detect if the argument passed is a function
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isFunction(v) {
  return typeof v === 'function' || false; // avoid IE problems
}

function scaleFont(f, width, el) {
  var r = false,
      l = false;
  if (f.units != 'px') f.units = 'em';
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
  if (el) {
    if (r) el.style.fontSize = r;
    if (l) el.style.lineHeight = l;
  }
  return { fontSize: r, lineHeight: l };
};

/**
 * @module dom
 * Module for easing the manipulation of dom elements
 */

let classReg = function (c) {
	return new RegExp("(^|\\s+)" + c + "(\\s+|$)");
};

let hasClass;
let addClass;
let removeClass;
let toggleClass;

if ('classList' in document.documentElement) {
	hasClass = function (elem, c) {
		return elem.classList.contains(c);
	};
	addClass = function (elem, c) {
		if (c != null) {
			c = c.split(' ');
			for (var k in c) elem.classList.add(c[k]);
		}
	};
	removeClass = function (elem, c) {
		elem.classList.remove(c);
	};
} else {
	hasClass = function (elem, c) {
		return classReg(c).test(elem.className);
	};
	addClass = function (elem, c) {
		if (!hasClass(elem, c)) {
			elem.className = elem.className + ' ' + c;
		}
	};
	removeClass = function (elem, c) {
		elem.className = elem.className.replace(classReg(c), ' ');
	};
}

toggleClass = function (elem, c) {
	var fn = hasClass(elem, c) ? removeClass : addClass;
	fn(elem, c);
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

var dom = {
	stylePrefix: {
		transform: getPrefixedStylePropName('transform'),
		perspective: getPrefixedStylePropName('perspective'),
		backfaceVisibility: getPrefixedStylePropName('backfaceVisibility')
	},
	triggerWebkitHardwareAcceleration: function (element) {
		if (this.stylePrefix.backfaceVisibility && this.stylePrefix.perspective) {
			element.style[this.stylePrefix.perspective] = '1000px';
			element.style[this.stylePrefix.backfaceVisibility] = 'hidden';
		}
	},
	transform: function (element, value) {
		element.style[this.stylePrefix.transform] = value;
	},
	/**
  * Shorter and fast way to select multiple nodes in the DOM
  * @param   { String } selector - DOM selector
  * @param   { Object } ctx - DOM node where the targets of our search will is located
  * @returns { Object } dom nodes found
  */
	selectAll: function (selector, ctx) {
		return (ctx || document).querySelectorAll(selector);
	},
	/**
  * Shorter and fast way to select a single node in the DOM
  * @param   { String } selector - unique dom selector
  * @param   { Object } ctx - DOM node where the target of our search will is located
  * @returns { Object } dom node found
  */
	select: function (selector, ctx) {
		return (ctx || document).querySelector(selector);
	},
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	toggleClass: toggleClass,
	autoLineHeight: function (el) {
		let l = el.offsetHeight + "px";
		el.style.lineHeight = l;
		return l;
	},
	createElement: function (elm, props) {
		let el = document.createElement(elm);
		for (let k in props) {
			el.setAttribute(k, props[k]);
		}
		return el;
	},
	emptyElement: function (elm) {
		while (elm.firstChild) {
			elm.removeChild(elm.firstChild);
		}
	},
	replaceElement: function (target, elm) {
		target.parentNode.replaceChild(elm, target);
	},
	removeElement: function (element) {
		element.parentNode.removeChild(element);
	},
	insertAfter: function (el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
	},
	insertBefore: function (el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode);
	},
	getTextContent: function (el) {
		return el.textContent || el.innerText;
	},
	wrap: function (elements, wrapper) {
		// Convert `elements` to an array, if necessary.
		if (!elements.length) {
			elements = [elements];
		}

		// Loops backwards to prevent having to clone the wrapper on the
		// first element (see `child` below).
		for (var i = elements.length - 1; i >= 0; i--) {
			var child = i > 0 ? wrapper.cloneNode(true) : wrapper;
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
};

let browser = function () {
  var nVer = navigator.appVersion,
      nAgt = navigator.userAgent,
      browserName = navigator.appName,
      fullVersion = '' + parseFloat(navigator.appVersion),
      majorVersion = parseInt(navigator.appVersion, 10),
      nameOffset,
      verOffset,
      ix;

  // EDGE
  if (browserName == "Netscape" && navigator.appVersion.indexOf('Trident') > -1) {
    browserName = "IE";
    var edge = nAgt.indexOf('Edge/');
    fullVersion = nAgt.substring(edge + 5, nAgt.indexOf('.', edge));
  }
  // MSIE 11
  else if (navigator.appVersion.indexOf("Windows NT") !== -1 && navigator.appVersion.indexOf("rv:11") !== -1) {
      browserName = "IE";
      fullVersion = "11;";
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
        browserName = "IE";
        fullVersion = nAgt.substring(verOffset + 5);
      }
      // Chrome
      else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
          browserName = "Chrome";
          fullVersion = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) !== -1) {
              fullVersion = nAgt.substring(verOffset + 8);
            }
          }
          // Firefox
          else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
              browserName = "Firefox";
              fullVersion = nAgt.substring(verOffset + 8);
            }
            // In most other browsers, "name/version" is at the end of userAgent
            else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                browserName = nAgt.substring(nameOffset, verOffset);
                fullVersion = nAgt.substring(verOffset + 1);
                if (browserName.toLowerCase() == browserName.toUpperCase()) {
                  browserName = navigator.appName;
                }
              }
  // Trim the fullVersion string at semicolon/space if present
  if ((ix = fullVersion.indexOf(";")) !== -1) {
    fullVersion = fullVersion.substring(0, ix);
  }
  if ((ix = fullVersion.indexOf(" ")) !== -1) {
    fullVersion = fullVersion.substring(0, ix);
  }
  // Get major version
  majorVersion = parseInt('' + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }
  // Return data
  return [browserName, majorVersion];
}();
var device = {
  browser: browser,
  isIE: function () {
    if (browser[0] === 'IE') {
      return browser[1];
    }
    return false;
  }(),
  isFirefox: function () {
    if (browser[0] === 'Firefox') {
      return browser[1];
    }
    return false;
  }(),
  isChrome: function () {
    if (browser[0] === 'Chrome') {
      return browser[1];
    }
    return false;
  }(),
  isSafari: function () {
    if (browser[0] === 'Safari') {
      return browser[1];
    }
    return false;
  }(),
  isTouch: 'ontouchstart' in document.documentElement,
  isIos: /(iPad|iPhone|iPod)/g.test(navigator.platform)
};

let autoFont = function (el, font, parent) {
	let _enabled = false;
	let _update = function () {
		scaleFont(font, parent.width(), el);
	};
	this.update = function (v) {
		if (v !== undefined) {
			if (!font) {
				font = { ratio: 1, min: 1, lineHeight: false };
			}
			font = deepmerge(font, v);
			return scaleFont(font, parent.width(), el);
		}
	};
	this.enabled = function (v) {
		if (typeof v === 'boolean' && font) {
			_enabled = v;
			// v ? (window.addEventListener('resize', _update, false), scaleFont(font, _width(), el)) : window.removeEventListener('resize', _update, false);
		}
		return _enabled;;
	};
	if (parent.on) {
		parent.on('resize', _update);
	};
};

let defaults$2 = {
	x: 0,
	y: 0,
	width: '100%',
	height: '100%',
	fontSize: null,
	lineHeight: null,
	offsetX: 0,
	offsetY: 0,
	originPoint: "topLeft",
	visible: false,
	transform: {
		x: null,
		y: null
	},
	translate: true
};

let adaptiveSizePos = function (setttings, parent) {
	let bounds = function () {
		return {
			offsetX: parent.offsetX(),
			offsetY: parent.offsetY(),
			width: parent.width(),
			height: parent.height(),
			scale: parent.width() / parent.videoWidth(),
			scaleY: parent.width() / parent.videoHeight()
		};
	};
	let vault = {
		x: 0,
		y: 0,
		width: '100%',
		height: '100%',
		fontSize: null,
		lineHeight: null
	};
	let parentWidth = 0;
	let parentHeight = 0;
	let parentX = 0;
	let parentY = 0;
	let domElement = null;
	let settings = deepmerge(defaults$2, setttings);
	let _active = false;

	let updateDomElement = function () {
		if (_active && domElement && domElement.nodeType) {
			if (vault.width !== null) domElement.style.width = vault.width + "px";
			if (vault.height !== null) domElement.style.height = vault.height + "px";

			if (dom.stylePrefix.transform && settings.translate) {
				let transform = '';
				if (vault.x != null && vault.y != null) {
					transform = 'translate(' + vault.x + 'px,' + vault.y + 'px)';
					domElement.style.left = "auto";
					domElement.style.right = "auto";
					domElement.style.bottom = "auto";
					domElement.style.top = "auto";
				} else {
					if (vault.x != null) {
						domElement.style.left = "auto";
						domElement.style.right = "auto";
						transform = 'translateX(' + vault.x + 'px)';
					}
					if (vault.y != null) {
						domElement.style.bottom = "auto";
						domElement.style.top = "auto";
						transform = 'translateY(' + vault.y + 'px)';
					}
				}
				dom.transform(domElement, transform);
			} else {
				if (vault.x != null && vault.y != null) {
					domElement.style.left = vault.x + "px";
					domElement.style.top = vault.y + "px";
				} else {
					if (vault.x != null) domElement.style.left = vault.x + "px";
					if (vault.y != null) domElement.style.top = vault.y + "px";
				}
			}

			if (settings.fontSize !== vault.fontSize) {
				domElement.style.fontSize = vault.fontSize = settings.fontSize;
			}
			if (settings.lineHeight !== vault.lineHeight) {
				domElement.style.lineHeight = vault.lineHeight = settings.lineHeight;
			}
		}
	};

	let updateProps = function () {
		let _w = parent.width();
		let _h = parent.height();
		let _x = parent.offsetX();
		let _y = parent.offsetY();
		if (parentWidth != _w || parentHeight != _h || _x != parentX || _y != parentY) {
			parentWidth = _w;
			parentHeight = _h;
			parentX = _x;
			parentY = _y;
		} else {
			return;
		}

		let b = bounds();

		let procentWidth = procentFromString(settings.width);
		if (procentWidth) {
			vault.width = b.width * procentWidth / 100;
		} else {
			if (settings.width != null) {
				vault.width = b.width * b.scale;
			}
		}
		vault.width = Math.ceil(vault.width);

		let procentHeight = procentFromString(settings.height);
		if (procentHeight) {
			vault.height = b.height * procentHeight / 100;
		} else {
			if (settings.height != null) {
				vault.height = b.height * b.scale;
			}
		}
		vault.height = Math.ceil(vault.height);

		if (settings.x != null) {
			let procentX = procentFromString(settings.x);
			if (procentX) {
				vault.x = b.offsetX + b.width * procentX / 100;
			} else {
				vault.x = b.offsetX + settings.x * b.scale;
			}
			vault.x = Math.floor(vault.x);
			let transformX = procentFromString(settings.transform.x);
			if (transformX) vault.x += transformX * vault.width / 100;
			if (settings.offsetX) vault.x += settings.offsetX;
		}

		if (settings.y != null) {
			let procentY = procentFromString(settings.y);
			if (procentY) {
				vault.y = b.offsetY + b.height * procentY / 100;
			} else {
				vault.y = b.offsetY + settings.y * b.scale;
			}
			vault.y = Math.floor(vault.y);
			let transformY = procentFromString(settings.transform.y);
			if (transformY) vault.y += transformY * vault.width / 100;
			if (settings.offsetY) vault.y += settings.offsetY;
		}

		updateDomElement();
	};

	this.applyTo = function (element) {
		if (element && element.nodeType) {
			domElement = element;
			updateProps();
		}
		return domElement;
	};

	let applyNewProps = function () {
		if (_active) {
			updateProps();
		}
	};

	this.data = function () {
		return vault;
	};

	this.settings = function (newSettings) {
		settings = deepmerge(settings, newSettings);
		updateProps();
		return settings;
	};
	this.enabled = function (v) {
		if (typeof v === 'boolean') {
			_active = v;
			if (v) applyNewProps();
			// v ? window.addEventListener('resize', applyNewProps, false) : window.removeEventListener('resize', applyNewProps, false);
		}
		return _active;
	};

	if (parent.on) {
		parent.on('resize', applyNewProps);
	}
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module) {
'use strict';

var has = Object.prototype.hasOwnProperty;

//
// We store our EE objects in a plain object whose properties are event names.
// If `Object.create(null)` is not supported we prefix the event names with a
// `~` to make sure that the built-in object properties are not overridden or
// used as an attack vector.
// We also assume that `Object.create(null)` is available when the event name
// is an ES6 Symbol.
//
var prefix = typeof Object.create !== 'function' ? '~' : false;

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} [once=false] Only emit once
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Hold the assigned EventEmitters by name.
 *
 * @type {Object}
 * @private
 */
EventEmitter.prototype._events = undefined;

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var events = this._events
    , names = []
    , name;

  if (!events) return names;

  for (name in events) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @param {Boolean} exists We only need to know if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events && this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} [context=this] The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} [context=this] The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return this;

  var listeners = this._events[evt]
    , events = [];

  if (fn) {
    if (listeners.fn) {
      if (
           listeners.fn !== fn
        || (once && !listeners.once)
        || (context && listeners.context !== context)
      ) {
        events.push(listeners);
      }
    } else {
      for (var i = 0, length = listeners.length; i < length; i++) {
        if (
             listeners[i].fn !== fn
          || (once && !listeners[i].once)
          || (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) {
    this._events[evt] = events.length === 1 ? events[0] : events;
  } else {
    delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[prefix ? prefix + event : event];
  else this._events = prefix ? {} : Object.create(null);

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}
});

var Events = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

let defaults$3 = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
};
let relativeSizePos = function (ctx, settings) {
	let parentWidth = ctx.videoWidth() || ctx.width || 1;
	let parentHeight = ctx.videoHeight() || ctx.height || 1;
	let o = deepmerge(defaults$3, settings);
	let _w = procentFromString(o.width);
	if (_w === false) _w = o.width / parentWidth * 100;
	let _h = procentFromString(o.height);
	if (_h === false) _h = o.height / parentHeight * 100;
	let _x = procentFromString(o.x);
	if (_x === false) _x = o.x / parentWidth * 100;
	let _y = procentFromString(o.y);
	if (_y === false) _y = o.y / parentHeight * 100;
	return {
		x: _x,
		y: _y,
		width: _w,
		height: _h
	};
};

class Container extends Events {
	constructor(el, opts, ctx, player) {
		let playerPaused = false;
		let isVisible = false;
		let externalControls = false;
		let body = dom.select('.body', el);
		super();
		this.ctx = ctx;
		this.body = body;
		this.config = function (fopts) {
			if (fopts) opts = deepmerge(opts, fopts);
			let d = new relativeSizePos(player, opts);
			body.style.width = d.width + "%";
			body.style.height = d.height + "%";
			if (dom.stylePrefix.transform) {
				dom.transform(body, 'translate(' + 100 / d.width * d.x + '%,' + 100 / d.height * d.y + '%)');
			} else {
				body.style.top = d.x + "%";
				body.style.left = d.y + "%";
			}
			this.emit('config');
		};
		this.config();
		player.on('resize', this.config);

		this.hide = () => {
			if (isVisible) {
				this.emit('beforeHide');
				dom.addClass(el, 'hidden');
				isVisible = false;
				if (opts.pause) {
					if (!playerPaused) {
						player.play();
					}
					if (externalControls && opts.externalControls) {
						player.externalControls.enabled(true);
					}
				}
				setTimeout(() => {
					el.style.display = "none";
					if (isFunction(opts.onHide)) opts.onHide();
					ctx.checkVisibleElements();
					this.emit('hide');
				}, 250);
			}
		};
		this.show = () => {
			if (!isVisible) {
				isVisible = true;
				this.emit('beforeShow');
				ctx.enabled(true);
				el.style.display = "block";
				setTimeout(() => {
					dom.removeClass(el, 'hidden');
					if (isFunction(opts.onHide)) opts.onShow();
					this.emit('show');
				}, 50);
				if (opts.pause) {
					if (!player.paused()) {
						playerPaused = false;
						player.pause();
					} else {
						playerPaused = true;
					}
				}
				if (opts.externalControls) {
					if (player.externalControls.enabled()) {
						externalControls = true;
						player.externalControls.enabled(false);
					} else {
						externalControls = true;
					}
				}
			}
		};

		if (opts.visible) {
			this.show();
		}

		this.visible = function (v) {
			if (typeof v === 'boolean') isVisible = v;
			return isVisible;
		};
	}
	destroy() {
		console.log("container");
		this.removeAllListeners();
		this.ctx.remove(this.body);
	}
}

class Popup extends Container {
	constructor(el, opts, ctx, parentPlayer) {
		super(el, opts, ctx, parentPlayer);
		let overlay = dom.createElement('div');
		dom.addClass(overlay, 'overlay triggerClose');
		dom.insertBefore(overlay, this.body);
		//header
		let header = document.createElement('h1');
		dom.addClass(header, 'header');
		this._title = document.createElement('span');
		header.appendChild(this._title);
		this._closeBtn = document.createElement('a');
		this._closeBtn.innerHTML = "<img src='svg/ic_close.svg'/>";
		dom.addClass(this._closeBtn, 'closeBtn');
		this._closeBtn.addEventListener('click', this.hide);
		header.appendChild(this._closeBtn);
		this.body.appendChild(header);
		//end header

		this.backgroundColor = function (v) {
			if (v != null) {
				overlay.style.backgroundColor = v;
			}
			return overlay.style.backgroundColor;
		};

		this.scaleSize = function (s) {
			this.config({ x: (100 - s) / 2 + "%", y: (100 - s) / 2 + "%", width: s + "%", height: s + "%" });
		};

		//EVENTS
		parentPlayer.on('resize', () => {
			this.emit('resize');
		});

		['resize', 'config', 'beforeShow'].map(evt => {
			this.on(evt, () => {
				console.log(evt);
				this.autoLineHeight();
			});
		});

		let clsElements = dom.selectAll('.triggerClose', el);
		for (var i = 0, n = clsElements.length; i < n; i += 1) {
			clsElements[i].addEventListener('click', this.hide);
		}
	}
	destroy() {
		console.log('popup');
		this.removeAllListeners();
		this.ctx.remove(this.body);
		dom.removeElement(this.body.parentNode);
	}

	autoLineHeight(el) {
		if (this.visible()) {
			if (el) {
				dom.autoLineHeight(el);
			} else {
				dom.autoLineHeight(this._title.parentNode);
			}
		}
	}
	title(v) {
		if (v != null) {
			this._title.innerHTML = v;
			this.autoLineHeight();
			return v;
		}
		return this._title.innerHTML;
	}
}

function ErrorFormatException(msg) {
			try {
						throw new Error(msg);
			} catch (e) {
						console.log(e.name + ': ' + e.message);
						return;
			}
}

function scrollPosition () {
	let x = 0;
	let y = 0;
	this.save = function () {
		x = window.pageXOffset || 0;
		y = window.pageYOffset || 0;
	};
	this.restore = function () {
		window.scrollTo(x, y);
	};
}

// Fullscreen API
let supportsFullScreen = false;
let browserPrefixes = 'webkit moz o ms khtml'.split(' ');
let prefixFS = '';
//Check for native support
if (typeof document.cancelFullScreen !== 'undefined') {
    supportsFullScreen = true;
} else {
    // Check for fullscreen support by vendor prefix
    for (var i = 0, il = browserPrefixes.length; i < il; i++) {
        prefixFS = browserPrefixes[i];

        if (typeof document[prefixFS + 'CancelFullScreen'] !== 'undefined') {
            supportsFullScreen = true;
            break;
        }
        // Special case for MS (when isn't it?)
        else if (typeof document.msExitFullscreen !== 'undefined' && document.msFullscreenEnabled) {
                prefixFS = 'ms';
                supportsFullScreen = true;
                break;
            }
    }
}
let eventChange = prefixFS === '' ? 'fullscreenchange' : prefixFS + (prefixFS == 'ms' ? 'fullscreenchange' : 'fullscreenchange');
eventChange = eventChange.toLowerCase();
//supportsFullScreen = false;
class Fullscreen extends Events {
    constructor() {
        super();
        this.iframe = null;
        this.scrollPosition = new scrollPosition();
        this._fullscreenElement = null;
        this.fullscreenElementStyle = {};
        if (supportsFullScreen) {
            let fnFullscreenChange = () => {
                if (!this.isFullScreen()) {
                    setTimeout(this.scrollPosition.restore, 100);
                }
            };
            document.addEventListener(eventChange, fnFullscreenChange, false);
        }
    }
    defualtFullScreenElement(element) {
        let el = element;
        if (el == null) {
            if (this.iframe) {
                el = this.iframe;
            } else {
                el = this.wrapper;
            }
        }
        return el;
    }
    onFullscreenChange(evt) {
        //investigate if native video fullscreen can be overwritten
        this.media.addEventListener(eventChange, function (e) {
            e.preventDefault();
            e.stopPropagation;
            return false;
        }, true);
    }
    isFullWindow() {
        return false;
    }
    isFullScreen(element) {
        if (supportsFullScreen) {
            let el = this.defualtFullScreenElement(element);
            switch (prefixFS) {
                case '':
                    return document.fullscreenElement == el;
                case 'moz':
                    return document.mozFullScreenElement == el;
                default:
                    return document[prefixFS + 'FullscreenElement'] == el;
            }
        } else {
            return this.isFullWindow();
        }
    }
    requestFullWindow(element) {
        if (this.isFullWindow()) return;
        if (supportsFullScreen && this.isFullScreen()) return;
        let el = this.defualtFullScreenElement(element);
        this.scrollPosition.save();
        // let style = window.getComputedStyle(element);
        let style = el.style;
        this.fullscreenElementStyle['position'] = style.position || "";
        this.fullscreenElementStyle['margin'] = style.margin || "";
        this.fullscreenElementStyle['top'] = style.top || "";
        this.fullscreenElementStyle['left'] = style.left || "";
        this.fullscreenElementStyle['width'] = style.width || "";
        this.fullscreenElementStyle['height'] = style.height || "";
        this.fullscreenElementStyle['zIndex'] = style.zIndex || "";
        this.fullscreenElementStyle['maxWidth'] = style.maxWidth || "";
        this.fullscreenElementStyle['maxHeight'] = style.maxHeight || "";

        el.style.position = "absolute";
        el.style.top = el.style.left = 0;
        el.style.margin = 0;
        el.style.maxWidth = el.style.maxHeight = el.style.width = el.style.height = "100%";
        el.style.zIndex = 2147483647;

        this._fullscreenElement = el;
        this.isFullWindow = function () {
            return true;
        };
    }
    requestFullScreen(element) {
        let el = this.defualtFullScreenElement(element);
        if (supportsFullScreen) {
            this.scrollPosition.save();
            return prefixFS === '' ? el.requestFullScreen() : el[prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
        } else {
            this.requestFullWindow(el);
        }
    }
    cancelFullWindow() {
        if (!this.isFullWindow()) return;
        if (supportsFullScreen && this.isFullScreen()) return;
        for (let k in this.fullscreenElementStyle) {
            this._fullscreenElement.style[k] = this.fullscreenElementStyle[k];
        }
        this._fullscreenElement = null;
        this.isFullWindow = function () {
            return false;
        };
        this.scrollPosition.restore();
    }
    cancelFullScreen() {
        if (supportsFullScreen) {
            return prefixFS === '' ? document.cancelFullScreen() : document[prefixFS + (prefixFS == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
        } else {
            this.cancelFullWindow();
        }
    }
    toggleFullWindow(element) {
        let isFullscreen = !this.isFullWindow();
        if (isFullscreen) {
            this.requestFullWindow(element);
            //document.body.style.overflow = 'hidden';
        } else {
            this.cancelFullWindow();
            //document.body.style.overflow = '';
        }
    }
    toggleFullScreen(element) {
        let isFullscreen = this.isFullScreen();
        if (!isFullscreen) {
            this.requestFullScreen(element);
            //document.body.style.overflow = 'hidden';
        } else {
            this.cancelFullScreen();
            //document.body.style.overflow = '';
        }
    }
    fullscreenElement() {
        if (supportsFullScreen) {
            return prefixFS === '' ? document.fullscreenElement : document[prefixFS + 'FullscreenElement'];
        } else {
            return this._fullscreenElement;
        }
    }
};

function _cancelRequests (media) {
	// Remove child sources
	var sources = dom.selectAll('source', media);
	for (var i = 0; i < sources.length; i++) {
		dom.removeElement(sources[i]);
	}

	// Set blank video src attribute
	// This is to prevent a MEDIA_ERR_SRC_NOT_SUPPORTED error
	// Small mp4: https://github.com/mathiasbynens/small/blob/master/mp4.mp4
	// Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection
	media.setAttribute('src', 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAGm1kYXQAAAGzABAHAAABthBgUYI9t+8AAAMNbW9vdgAAAGxtdmhkAAAAAMXMvvrFzL76AAAD6AAAACoAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAABhpb2RzAAAAABCAgIAHAE/////+/wAAAiF0cmFrAAAAXHRraGQAAAAPxcy++sXMvvoAAAABAAAAAAAAACoAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAgAAAAIAAAAAAG9bWRpYQAAACBtZGhkAAAAAMXMvvrFzL76AAAAGAAAAAEVxwAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABaG1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAShzdGJsAAAAxHN0c2QAAAAAAAAAAQAAALRtcDR2AAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAgACABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAXmVzZHMAAAAAA4CAgE0AAQAEgICAPyARAAAAAAMNQAAAAAAFgICALQAAAbABAAABtYkTAAABAAAAASAAxI2IAMUARAEUQwAAAbJMYXZjNTMuMzUuMAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAASAAAAAQAAABRzdGNvAAAAAAAAAAEAAAAsAAAAYHVkdGEAAABYbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAraWxzdAAAACOpdG9vAAAAG2RhdGEAAAABAAAAAExhdmY1My4yMS4x');

	// Load the new empty source
	// This will cancel existing requests
	// See https://github.com/Selz/plyr/issues/174
	media.load();

	// Debugging
	console.log("Cancelled network requests for old media");
}

function mimeVideo(media, type) {
    switch (type) {
        case 'video/webm':
            return !!(media.canPlayType && media.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, ''));
        case 'video/mp4':
            return !!(media.canPlayType && media.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));
        case 'video/ogg':
            return !!(media.canPlayType && media.canPlayType('video/ogg; codecs="theora"').replace(/no/, ''));
    }
}

//https://www.w3.org/2010/05/video/mediaevents.html
let _events = ['ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'playing', 'pause', 'error', 'seeking', 'emptied', 'seeked', 'ratechange', 'suspend'];

class Media extends Fullscreen {
	constructor(el) {
		super();
		if (el == null) {
			ErrorFormatException("You need to supply a HTMLVideoElement to instantiate the player");
			return;
		}
		this.media = el;
		_events.forEach(k => {
			el.addEventListener(k, () => {
				this.emit(k);
			});
		});

		this.canPlay = {
			mp4: mimeVideo(el, 'video/mp4'),
			webm: mimeVideo(el, 'video/webm'),
			ogg: mimeVideo(el, 'video/ogg')
		};
	}

	/*** Global attributes */

	/* A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data. If not return the auoplay attribute. */
	autoplay(v) {
		if (typeof v === 'boolean') {
			this.media.autoplay = v;
		}
		return this.media.autoplay;
	}

	/* Returns the time ranges of the buffered media. This attribute contains a TimeRanges object */
	buffered() {
		return this.media.buffered;
	}

	/* If this attribute is present, the browser will offer controls to allow the user to control video playback, including volume, seeking, and pause/resume playback. When not set returns if the controls are present */
	nativeControls(v) {
		if (typeof v === 'boolean') {
			this.media.controls = v;
		}
		return this.media.controls;
	}

	/* anonymous, use-credentials, false */
	crossorigin(v) {
		if (v === 'use-credentials') {
			this.media.crossOrigin = 'use-credentials';
			return v;
		}
		if (v) {
			this.media.crossOrigin = 'anonymous';
			return 'anonymous';
		}
		if (v === false) this.media.crossOrigin = null;
		return this.media.crossOrigin;
	}

	/* A Boolean attribute; if specified, we will, upon reaching the end of the video, automatically seek back to the start. */
	loop(v) {
		if (typeof v === 'boolean') {
			this.media.loop = v;
		}
		return this.media.loop;
	}

	/*A Boolean attribute which indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced. Its default value is false, meaning that the audio will be played when the video is played*/
	muted(v) {
		if (typeof v === 'boolean') {
			this.media.muted = v;
		}
		return this.media.muted;
	}

	/* Mute the video */
	mute() {
		this.muted(true);
	}

	/* UnMute the video */
	unmute() {
		this.muted(false);
	}

	/* Toggle the muted stance of the video */
	toggleMute() {
		return this.muted(!this.muted());
	}

	/* Returns A TimeRanges object indicating all the ranges of the video that have been played.*/
	played() {
		return this.media.played;
	}

	/*
 This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:
 	none: indicates that the video should not be preloaded.
 	metadata: indicates that only video metadata (e.g. length) is fetched.
 	auto: indicates that the whole video file could be downloaded, even if the user is not expected to use it.
 the empty string: synonym of the auto value.
 */
	preload(v) {
		if (v === 'metadata' || v === "meta") {
			this.media.preload = 'metadata';
			return 'metadata';
		}
		if (v) {
			this.media.preload = 'auto';
			return 'auto';
		}
		if (v === false) {
			this.media.preload = 'none';
			return 'none';
		}
		return this.media.preload;
	}

	/* Gives or returns the address of an image file that the user agent can show while no video data is available. The attribute, if present, must contain a valid non-empty URL potentially surrounded by spaces */
	poster(v) {
		if (v !== undefined) {
			this.media.poster = v;
		}
		return this.media.poster;
	}

	/* The src property sets or returns the current source of the audio/video, The source is the actual location (URL) of the audio/video file */
	src(v) {
		if (v !== undefined) {
			_cancelRequests(this.media);
			if (v instanceof Array) {
				for (var i = 0, n = v.length; i += 1;) {
					if (v[i]['type'] === "video/mp4" && this.canPlay.mp4) {
						return this.media.src = v[i]['src'];
					}
					if (v[i]['type'] === "video/webm" && this.canPlay.webm) {
						return this.media.src = v[i]['src'];
					}
					if (v[i]['type'] === "video/ogg" && this.canPlay.ogg) {
						return this.media.src = v[i]['src'];
					}
				}
			} else if (v.src && v.type) {
				this.media.src = v.src;
			} else {
				this.media.src = v;
			}
		}
		return this.media.currentSrc;
	}

	/*** Global Events */

	/* Starts playing the audio/video */
	play() {
		this.media.play();
	}

	/* Pauses the currently playing audio/video */
	pause() {
		this.media.pause();
	}

	/* Return the currently playing status of audio/video */
	paused() {
		return this.media.paused;
	}

	/* Return the currently playing status of audio/video */
	playing() {
		return this.media.paused;
	}

	/* Toggle play/pause for the audio/video */
	togglePlay() {
		this.media.paused ? this.play() : this.pause();
	}

	currentTime(v) {
		if (v === null || isNaN(v)) {
			return this.media.currentTime;
		}
		v = parseFloat(v);
		if (v > this.media.duration) {
			v = this.media.duration;
		}
		if (v < 0) {
			v = 0;
		}
		this.media.currentTime = v;
		return v;
	}

	seek(v) {
		return this.currentTime(v);
	}

	/**
  * [Re-loads the audio/video element, update the audio/video element after changing the source or other settings]
  * @return {[type]} [description]
  */
	load(v) {
		if (v !== undefined) {
			this.src(v);
		}
		this.media.load();
	}

	duration() {
		return this.media.duration;
	}

	volume(v) {
		// Return current volume if value 
		if (v === null || isNaN(v)) {
			return this.media.volume;
		}
		v = parseFloat(v);
		if (v > 1) {
			v = 1;
		}
		if (v < 0) {
			v = 0;
		}
		this.media.volume = v;
		return v;
	}
}

var containerBounds = (function () {
	let scale = 0;
	let bounds = function (el, updateScale) {
		if (updateScale !== undefined) scale = updateScale;
		var data = {
			wrapperWidth: el.offsetWidth,
			wrapperHeight: el.offsetHeight,
			scale: scale || el.width / el.height,
			width: 0,
			height: 0,
			offsetX: 0,
			offsetY: 0
		};
		data['wrapperScale'] = data.wrapperWidth / data.wrapperHeight;
		if (data.wrapperScale > data.scale) {
			data.height = data.wrapperHeight;
			data.width = data.scale * data.height;
			data.offsetX = (data.wrapperWidth - data.width) / 2;
		} else {
			data.width = data.wrapperWidth;
			data.height = data.width / data.scale;
			data.offsetY = (data.wrapperHeight - data.height) / 2;
		}
		return data;
	};
	return bounds;
})();

var _doc = document || {};
// Set the name of the hidden property and the change event for visibility
var hidden;
var visibilityChange;
if (typeof _doc.hidden !== "undefined") {
	// Opera 12.10 and Firefox 18 and later support 
	hidden = "hidden";
	visibilityChange = "visibilitychange";
} else if (typeof _doc.mozHidden !== "undefined") {
	hidden = "mozHidden";
	visibilityChange = "mozvisibilitychange";
} else if (typeof _doc.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
} else if (typeof _doc.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
}

const isAvailable = function () {
	return !(typeof _doc[hidden] === "undefined");
};

function pageVisibility(_media, settings = {}) {
	let _available = isAvailable();
	if (_available) {
		let _enabled = false;
		let _playing = false;
		let paused = false;
		let setFlagPlaying = function () {
			_playing = true;
		};
		let events = {
			visible: function () {},
			hidden: function () {}
		};
		let destroyVisibility = function () {
			events = {
				visible: function () {},
				hidden: function () {}
			};
			_enabled = false;
			_playing = false;
			_doc.removeEventListener(visibilityChange, handleVisibilityChange, false);
			_media.removeEventListener('playing', setFlagPlaying);
		};
		let handleVisibilityChange = function () {
			if (_enabled) {
				if (_doc[hidden]) {
					if (_playing && !_media.paused) {
						_media.pause();
						paused = true;
					}
					events.hidden();
				} else {
					if (paused && _media.paused) {
						_media.play();
						paused = false;
					}
					events.visible();
				}
			}
		};
		let initVisibility = function initVisibility(settings) {
			if (_available) {
				_doc.removeEventListener(visibilityChange, handleVisibilityChange, false);
				_media.removeEventListener('playing', setFlagPlaying);

				events.visible = settings.onVisible || events.visible;
				events.hidden = settings.onHidden || events.hidden;
				_enabled = true;
				_doc.addEventListener(visibilityChange, handleVisibilityChange, false);
				_media.addEventListener('playing', setFlagPlaying);
			}
		};
		events.visible = settings.onVisible || events.visible;
		events.hidden = settings.onHidden || events.hidden;
		_enabled = true;
		_doc.addEventListener(visibilityChange, handleVisibilityChange, false);
		_media.addEventListener('playing', setFlagPlaying);

		this.init = initVisibility;
		this.destroy = destroyVisibility;
		this.on = function (event, fn) {
			if (event in events) events[event] = fn;
		};
		this.enabled = function (v) {
			if (typeof v === 'boolean') _enabled = v;
			return _enabled;
		};
	};
};

let _doc$1 = document || {};
let externalControls = function (el) {
	let _enabled = true;
	let _seek = true;
	let _tId = null;
	let media = el;
	let keydown = function (e) {
		if (_enabled) {
			//bypass default native external controls when media is focused
			media.parentNode.focus();
			if (e.keyCode == 32) {
				//space
				if (media.paused) {
					media.play();
				} else {
					media.pause();
				}
			}
			if (_seek) {
				if (e.keyCode == 37) {
					//left
					media.currentTime = media.currentTime - 5;
					return;
				}
				if (e.keyCode == 39) {
					//right
					media.currentTime = media.currentTime + 5;
					return;
				}
			}
			if (e.keyCode == 38) {
				//up
				let v = media.volume;
				v += .1;
				if (v > 1) v = 1;
				media.volume = v;
				return;
			}

			if (e.keyCode == 40) {
				//down
				let v = media.volume;
				v -= .1;
				if (v < 0) v = 0;
				media.volume = v;
				return;
			}
			/*if (self.controlBar) {
   	if (self.controlBar.volumeMenuButton) {
   		if (e.keyCode == 40 || e.keyCode == 38) {
   				self.controlBar.volumeMenuButton.menuContent.el_.className = "vjs-menu show";
   		}
   	}
   }*/
		}
	};

	// this.onSpace = function() {

	// };

	let keyup = function (e) {
		if (_enabled) {
			// if (e.keyCode == 40 || e.keyCode == 38) {
			// 	clearInterval(_tId);
			// 	if (self.controlBar.volumeMenuButton) {
			// 		_tId = setTimeout(function() {
			// 			self.controlBar.volumeMenuButton.menuContent.el_.className = "vjs-menu";
			// 		}, 500);
			// 	}
			// }
		}
	};
	this.enabled = function (b) {
		if (b === undefined) return _enabled;
		_enabled = b;
	};
	this.seekEnabled = function (b) {
		if (b === undefined) return _seek;
		_seek = b;
	};
	this.init = function () {
		_enabled = true;
		_tId = null;
		_seek = true;
		_doc$1.body.addEventListener('keydown', keydown.bind(this), false);
		_doc$1.body.addEventListener('keyup', keyup.bind(this), false);
	};
	this.destroy = function () {
		_enabled = false;
		_tId = null;
		_seek = true;
		_doc$1.body.removeEventListener('keydown', keydown);
		_doc$1.body.removeEventListener('keyup', keyup);
	};
	this.init();
};

//https://github.com/fdaciuk/ajax
var ajax = (function () {

  function ajax(options) {
    var methods = ['get', 'post', 'put', 'delete'];
    options = options || {};
    options.baseUrl = options.baseUrl || '';
    if (options.method && options.url) {
      return xhrConnection(options.method, options.baseUrl + options.url, maybeData(options.data), options);
    }
    return methods.reduce(function (acc, method) {
      acc[method] = function (url, data) {
        return xhrConnection(method, options.baseUrl + url, maybeData(data), options);
      };
      return acc;
    }, {});
  }

  function maybeData(data) {
    return data || null;
  }

  function xhrConnection(type, url, data, options) {
    var returnMethods = ['then', 'catch', 'always'];
    var promiseMethods = returnMethods.reduce(function (promise, method) {
      promise[method] = function (callback) {
        promise[method] = callback;
        return promise;
      };
      return promise;
    }, {});
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.withCredentials = options.hasOwnProperty('withCredentials');
    setHeaders(xhr, options.headers);
    xhr.addEventListener('readystatechange', ready(promiseMethods, xhr), false);
    xhr.send(objectToQueryString(data));
    promiseMethods.abort = function () {
      return xhr.abort();
    };
    return promiseMethods;
  }

  function setHeaders(xhr, headers) {
    headers = headers || {};
    if (!hasContentType(headers)) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    Object.keys(headers).forEach(function (name) {
      headers[name] && xhr.setRequestHeader(name, headers[name]);
    });
  }

  function hasContentType(headers) {
    return Object.keys(headers).some(function (name) {
      return name.toLowerCase() === 'content-type';
    });
  }

  function ready(promiseMethods, xhr) {
    return function handleReady() {
      if (xhr.readyState === xhr.DONE) {
        xhr.removeEventListener('readystatechange', handleReady, false);
        promiseMethods.always.apply(promiseMethods, parseResponse(xhr));

        if (xhr.status >= 200 && xhr.status < 300) {
          promiseMethods.then.apply(promiseMethods, parseResponse(xhr));
        } else {
          promiseMethods.catch.apply(promiseMethods, parseResponse(xhr));
        }
      }
    };
  }

  function parseResponse(xhr) {
    var result;
    try {
      result = JSON.parse(xhr.responseText);
    } catch (e) {
      result = xhr.responseText;
    }
    return [result, xhr];
  }

  function objectToQueryString(data) {
    return isObject(data) ? getQueryString(data) : data;
  }

  function isObject(data) {
    return Object.prototype.toString.call(data) === '[object Object]';
  }

  function getQueryString(object) {
    return Object.keys(object).reduce(function (acc, item) {
      var prefix = !acc ? '' : acc + '&';
      return prefix + encode(item) + '=' + encode(object[item]);
    }, '');
  }

  function encode(value) {
    return encodeURIComponent(value);
  }

  return ajax;
})();

const fn_contextmenu$1 = function (e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
};

const defaults$4 = {
	videoWidth: 920,
	videoHeight: 520,
	autoplay: false,
	loop: false,
	controls: false,
	font: {
		ratio: 1,
		min: .5,
		units: "em"
	},
	contextMenu: false
};

class Player extends Media {
	constructor(settings, _events) {
		let el = settings.video;
		super(el);
		if (el == null) return;
		this.device = device;
		this.__settings = {};
		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
		this.wrapper = dom.wrap(this.media, dom.createElement('div', {
			class: 'kmlPlayer'
		}));
		dom.triggerWebkitHardwareAcceleration(this.wrapper);

		//initSettings
		this.settings(deepmerge(defaults$4, settings));

		//initPageVisibility
		this.pageVisibility = new pageVisibility(el);

		//initexternalControls
		this.externalControls = new externalControls(el);

		//initCallbackEvents
		for (var evt in _events) {
			this.on(evt, _events[evt], this);
		}

		this.on('loadedmetadata', () => {
			if (this.media.width != this.media.videoWidth || this.media.height != this.media.videoHeight) {
				this.videoWidth();
				this.videoHeight();
				this.emit('resize');
			}
		});
	}

	settings(settings) {
		if (settings == null) return this.__settings;
		this.__settings = deepmerge(this.__settings, settings);
		//initSettings
		for (var k in this.__settings) {
			if (this[k]) {
				if (k === 'autoplay' && this.__settings[k]) {
					this.play();
					continue;
				}
				this[k](this.__settings[k]);
			}
			if (k === 'controls' && this.__settings[k] === "native") {
				this.nativeControls(true);
			}
		}
		return this.__settings;
	}

	contextMenu(v) {
		if (typeof v === 'boolean') {
			v ? this.media.removeEventListener('contextmenu', fn_contextmenu$1) : this.media.addEventListener('contextmenu', fn_contextmenu$1);
		}
	}

	ajax(options) {
		return ajax(options);
	}

	videoWidth(v) {
		if (this.media.videoWidth) {
			this.media.width = this.media.videoWidth;
			return this.media.videoWidth;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.width = v;
		}
		return this.media.width;
	}

	videoHeight(v) {
		if (this.media.videoHeight) {
			this.media.height = this.media.videoHeight;
			return this.media.videoHeight;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.height = v;
		}
		return this.media.height;
	}

	scale() {
		return this.videoWidth() / this.videoHeight();
	}

	bounds(v) {
		let data = containerBounds(this.media);
		if (data[v] !== null) return data[v];
		return data;
	}

	width() {
		return this.bounds('width');
	}

	height() {
		return this.bounds('height');
	}

	offsetX() {
		return this.bounds('offsetX');
	}

	offsetY() {
		return this.bounds('offsetY');
	}

	wrapperHeight() {
		return this.media.offsetHeight;
	}

	wrapperWidth() {
		return this.media.offsetWidth;
	}

	wrapperScale() {
		return this.media.offsetWidth / this.media.offsetHeight;
	}

	addClass(v, el) {
		if (el != null) {
			dom.addClass(v, el);
			return;
		}
		dom.addClass(this.wrapper, v);
	}
	removeClass(v, el) {
		if (el != null) {
			dom.removeClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			dom.removeClass(this.wrapper, v);
		}
	}
	toggleClass(v, el) {
		if (el != null) {
			dom.toggleClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			dom.toggleClass(this.wrapper, v);
		}
	}
};

class videoContainer extends Popup {
	constructor(el, opts, ctx, parentPlayer) {
		super(el, opts, ctx, parentPlayer);
		let domVideo = document.createElement('video');
		this.body.appendChild(domVideo);
		this.player = new Player({ video: domVideo });
		this.player.container;
		let paused = false;
		this.on('beforeHide', () => {
			paused = this.player.paused();
			this.player.pause();
		});
		this.on('show', () => {
			if (!paused) {
				this.player.play();
			}
		});
		this.on('ended', () => {
			if (isFunction(opts.onEnded)) opts.onEnded();
		});
		opts.sizeRatio = opts.sizeRatio || 80;
		this.scaleSize = function (s) {
			opts.sizeRatio = s;
			this.emit('resize');
		};
		this.player.on('ended', () => {
			this.emit('ended');
		});
		this.on('resize', () => {
			let y = 0;
			let x = 0;
			let w = parentPlayer.width();
			let h = parentPlayer.height();
			let r = this.player.scale();
			let fw = w;let fh = h;
			let ww = w;let hh = h;
			let headerHeight = 10;
			if (w > r * h) {
				fw = r * h;
				fh = h;
				ww = fw;
				headerHeight = h / 10 / fh * 100;
				fw = opts.sizeRatio * (fw / w * 100) / 100;
				fh = opts.sizeRatio;
			} else if (h > w / r) {
				fh = w / r;
				fw = w;
				hh = fh;
				headerHeight = h / 10 / fh * 100;
				fh = opts.sizeRatio * (fh / h * 100) / 100;
				fw = opts.sizeRatio;
			} else {
				fw = opts.sizeRatio;
				fh = opts.sizeRatio;
			};
			x = (100 - fw) / 2;
			y = (100 - fh) / 2;
			//this._title.parentNode.style.transform = 'translateY(-100%)';	
			this._title.parentNode.style.height = headerHeight + '%';
			this.config({
				x: x / w * ww + '%',
				y: 5 + y / h * hh + '%',
				width: fw + "%",
				height: fh + "%"
			});
			this.autoLineHeight();
		});

		parentPlayer.on('loadedmetadata', () => {
			this.emit('resize');
		});
		this.player.on('loadedmetadata', () => {
			this.emit('resize');
		});
		this.player.load(opts.url);
	}
}

let defaults$1 = {
	backgroundColor: '',
	onHide: null,
	onShow: null,
	externalControls: true,
	visible: false,
	pause: true
};

class Containers {
	constructor(ctx) {
		this.wrapper = dom.createElement('div', {
			class: 'kmlContainers'
		});
		this._els = [];
		let ac = new adaptiveSizePos({}, ctx);
		ac.applyTo(this.wrapper);

		this.enabled = function (v) {
			if (v != null) {
				if (v == 0) {
					v = false;
					this.wrapper.style.display = "none";
				}
				if (v) {
					this.wrapper.style.display = "block";
				}
				ac.enabled(v);
			}
			return ac.enabled();
		};

		this.checkVisibleElements = function () {
			let no = 0;
			for (var k in this._els) {
				if (this._els[k].visible()) {
					no += 1;
				}
			}
			this.enabled(no);
		};

		ctx.wrapper.appendChild(this.wrapper);

		let currentVisibles = [];
		this.hide = function (current) {
			for (var k in this._els) {
				let currentContainer = this._els[k];
				if (this._els[k] !== current) {
					if (currentContainer.visible()) {
						currentContainer.hide();
						currentVisibles.push(currentContainer);
						currentContainer.visible(false);
					}
				}
			}
		};

		this.show = function () {
			for (var k in currentVisibles) {
				currentVisibles[k].show();
			}
			currentVisibles = [];
		};

		this.add = function (opts, el = {}, type) {
			let cls = 'Container';
			if (type != 'container') cls = 'Popup';
			let settings = deepmerge(defaults$1, opts);
			let containerHolder = dom.createElement('div');
			ctx.addClass(containerHolder, 'kml' + cls + ' hidden');
			let kmlContainerBody = dom.createElement('div');
			if (el) {
				if (!el.nodeType) {
					el = kmlContainerBody;
				}
			} else {
				el = kmlContainerBody;
			}
			dom.addClass(el, 'body');

			containerHolder.appendChild(el);
			let container = null;
			switch (type) {
				case 'video':
					container = new videoContainer(containerHolder, settings, this, ctx);
					break;
				case 'popup':
					container = new Popup(containerHolder, settings, this, ctx);
					break;
				default:
					container = new Container(containerHolder, settings, this, ctx);
					break;
			}

			this._els.push(container);
			this.wrapper.appendChild(containerHolder);
			return container;
		};

		this.remove = container => {
			for (var i = 0, n = this._els.length; i < n; i += 1) {
				let c = this._els[i];
				if (c.body === container) {
					this._els.splice(i, 1);
					if (this._els.length == 0) this.enabled(false);
					break;
				}
			}
		};
	}
	els(id) {
		return this._els[id] || this._els;
	}
}

/** Virtual DOM Node */
function VNode(nodeName, attributes, children) {
	/** @type {string|function} */
	this.nodeName = nodeName;

	/** @type {object<string>|undefined} */
	this.attributes = attributes;

	/** @type {array<VNode>|undefined} */
	this.children = children;
}

// render modes
const NO_RENDER = { render: false };
const SYNC_RENDER = { renderSync: true };
const DOM_RENDER = { build: true };

const EMPTY = {};
const EMPTY_BASE = '';

// is this a DOM environment
const HAS_DOM = typeof document!=='undefined';
const TEXT_CONTENT = !HAS_DOM || 'textContent' in document ? 'textContent' : 'nodeValue';

const ATTR_KEY = typeof Symbol!=='undefined' ? Symbol.for('preactattr') : '__preactattr_';

const UNDEFINED_ELEMENT = 'undefined';

// DOM properties that should NOT have "px" added when numeric
const NON_DIMENSION_PROPS = {
	boxFlex:1, boxFlexGroup:1, columnCount:1, fillOpacity:1, flex:1, flexGrow:1,
	flexPositive:1, flexShrink:1, flexNegative:1, fontWeight:1, lineClamp:1, lineHeight:1,
	opacity:1, order:1, orphans:1, strokeOpacity:1, widows:1, zIndex:1, zoom:1
};

/** Copy own-properties from `props` onto `obj`.
 *	@returns obj
 *	@private
 */
function extend$1(obj, props) {
	for (let i in props) if (hasOwnProperty.call(props, i)) {
		obj[i] = props[i];
	}
	return obj;
}


/** Fast clone. Note: does not filter out non-own properties. */
function clone(obj) {
	let out = {};
	/*eslint guard-for-in:0*/
	for (let i in obj) out[i] = obj[i];
	return out;
}


/** Create a caching wrapper for the given function.
 *	@private
 */
function memoize(fn, mem) {
	mem = mem || {};
	return k => hasOwnProperty.call(mem, k) ? mem[k] : (mem[k] = fn(k));
}


/** Get a deep property value from the given object, expressed in dot-notation.
 *	@private
 */
function delve(obj, key) {
	for (let p=key.split('.'), i=0; i<p.length && obj; i++) {
		obj = obj[p[i]];
	}
	return obj;
}


/** Convert an Array-like object to an Array
 *	@private
 */
function toArray(obj) {
	let arr = [],
		i = obj.length;
	while (i--) arr[i] = obj[i];
	return arr;
}


/** @private is the given object a Function? */
const isFunction$1 = obj => 'function'===typeof obj;


/** @private is the given object a String? */
const isString$1 = obj => 'string'===typeof obj;


/** @private Safe reference to builtin hasOwnProperty */
const hasOwnProperty = {}.hasOwnProperty;


/** Check if a value is `null` or `undefined`.
 *	@private
 */
const empty = x => x==null;


/** Check if a value is `null`, `undefined`, or explicitly `false`. */
const falsey = value => value===false || value==null;


/** Convert a hashmap of styles to CSSText
 *	@private
 */
function styleObjToCss(s) {
	let str = '';
	for (let prop in s) {
		let val = s[prop];
		if (!empty(val)) {
			if (str) str += ' ';
			str += jsToCss(prop);
			str += ': ';
			str += val;
			if (typeof val==='number' && !NON_DIMENSION_PROPS[prop]) {
				str += 'px';
			}
			str += ';';
		}
	}
	return str;
}



/** Convert a hashmap of CSS classes to a space-delimited className string
 *	@private
 */
function hashToClassName(c) {
	let str = '';
	for (let prop in c) {
		if (c[prop]) {
			if (str) str += ' ';
			str += prop;
		}
	}
	return str;
}



/** Convert a JavaScript camel-case CSS property name to a CSS property name
 *	@private
 *	@function
 */
const jsToCss = memoize( s => s.replace(/([A-Z])/g,'-$1').toLowerCase() );


/** Just a memoized String.prototype.toLowerCase */
const toLowerCase = memoize( s => s.toLowerCase() );


// For animations, rAF is vastly superior. However, it scores poorly on benchmarks :(
// export const setImmediate = typeof requestAnimationFrame==='function' ? requestAnimationFrame : setTimeout;

let ch;
try { ch = new MessageChannel(); } catch (e) {}

/** Call a function asynchronously, as soon as possible.
 *	@param {Function} callback
 */
const setImmediate = ch ? ( f => {
	ch.port1.onmessage = f;
	ch.port2.postMessage('');
}) : setTimeout;

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
	 *	@name syncComponentUpdates
	 *	@type Boolean
	 *	@default true
	 */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
	 *	@param {VNode} vnode	A newly-created VNode to normalize/process
	 */
	vnode(n) {
		let attrs = n.attributes;
		if (!attrs || isFunction$1(n.nodeName)) return;

		// normalize className to class.
		let p = attrs.className;
		if (p) {
			attrs['class'] = p;
			delete attrs.className;
		}

		if (attrs['class']) normalize(attrs, 'class', hashToClassName);
		if (attrs.style) normalize(attrs, 'style', styleObjToCss);
	}
};


function normalize(obj, prop, fn) {
	let v = obj[prop];
	if (v && !isString$1(v)) {
		obj[prop] = fn(v);
	}
}

/** Invoke a hook on the `options` export. */
function optionsHook(name, a, b) {
	return hook(options, name, a, b);
}


/** Invoke a "hook" method with arguments if it exists.
 *	@private
 */
function hook(obj, name, a, b, c) {
	if (obj[name]) return obj[name](a, b, c);
}


/** Invoke hook() on a component and child components (recursively)
 *	@private
 */
function deepHook(obj, type) {
	do {
		hook(obj, type);
	} while ((obj=obj._component));
}

const SHARED_TEMP_ARRAY = [];


/** JSX/hyperscript reviver
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 *  @example
 *  /** @jsx h *\/
 *  import { render, h } from 'preact';
 *  render(<span>foo</span>, document.body);
 */
function h(nodeName, attributes) {
	let len = arguments.length,
		attributeChildren = attributes && attributes.children,
		children, arr, lastSimple;

	if (attributeChildren) {
		delete attributes.children;

		// if (len<3) {
		// 	unfilteredChildren = attributeChildren;
		// 	start = 0;
		// }
		if (len<3) return h(nodeName, attributes, attributeChildren);
	}

	for (let i=2; i<len; i++) {
		let p = arguments[i];
		if (falsey(p)) continue;
		if (!children) children = [];
		if (p.join) {
			arr = p;
		}
		else {
			arr = SHARED_TEMP_ARRAY;
			arr[0] = p;
		}
		for (let j=0; j<arr.length; j++) {
			let child = arr[j],
				simple = !falsey(child) && !(child instanceof VNode);
			if (simple) child = String(child);
			if (simple && lastSimple) {
				children[children.length-1] += child;
			}
			else if (!falsey(child)) {
				children.push(child);
			}
			lastSimple = simple;
		}
	}

	let p = new VNode(nodeName, attributes || undefined, children || undefined);
	optionsHook('vnode', p);
	return p;
}

/** Create an Event handler function that sets a given state property.
 *	@param {Component} component	The component whose state should be updated
 *	@param {string} key				A dot-notated key path to update in the component's state
 *	@param {string} eventPath		A dot-notated key path to the value that should be retrieved from the Event or component
 *	@returns {function} linkedStateHandler
 *	@private
 */
function createLinkedState(component, key, eventPath) {
	let path = key.split('.'),
		p0 = path[0],
		len = path.length;
	return function(e) {
		let t = this,
			s = component.state,
			obj = s,
			v, i;
		if (isString$1(eventPath)) {
			v = delve(e, eventPath);
			if (empty(v) && (t=t._component)) {
				v = delve(t, eventPath);
			}
		}
		else {
			v = (t.nodeName+t.type).match(/^input(check|rad)/i) ? t.checked : t.value;
		}
		if (isFunction$1(v)) v = v.call(t);
		if (len>1) {
			for (i=0; i<len-1; i++) {
				obj = obj[path[i]] || (obj[path[i]] = {});
			}
			obj[path[i]] = v;
			v = s[p0];
		}
		component.setState({ [p0]: v });
	};
}

let items = [];
let itemsOffline = [];
function enqueueRender(component) {
	if (items.push(component)!==1) return;

	(options.debounceRendering || setImmediate)(rerender);
}


function rerender() {
	if (!items.length) return;

	let currentItems = items,
		p;

	// swap online & offline
	items = itemsOffline;
	itemsOffline = currentItems;

	while ( (p = currentItems.pop()) ) {
		if (p._dirty) renderComponent(p);
	}
}

/** Check if a VNode is a reference to a stateless functional component.
 *	A function component is represented as a VNode whose `nodeName` property is a reference to a function.
 *	If that function is not a Component (ie, has no `.render()` method on a prototype), it is considered a stateless functional component.
 *	@param {VNode} vnode	A VNode
 *	@private
 */
function isFunctionalComponent({ nodeName }) {
	return isFunction$1(nodeName) && !(nodeName.prototype && nodeName.prototype.render);
}



/** Construct a resultant VNode from a VNode referencing a stateless functional component.
 *	@param {VNode} vnode	A VNode with a `nodeName` property that is a reference to a function.
 *	@private
 */
function buildFunctionalComponent(vnode, context) {
	return vnode.nodeName(getNodeProps(vnode), context || EMPTY) || EMPTY_BASE;
}

function ensureNodeData(node) {
	return node[ATTR_KEY] || (node[ATTR_KEY] = {});
}


function getNodeType(node) {
	return node.nodeType;
}


/** Append multiple children to a Node.
 *	Uses a Document Fragment to batch when appending 2 or more children
 *	@private
 */
function appendChildren(parent, children) {
	let len = children.length,
		many = len>2,
		into = many ? document.createDocumentFragment() : parent;
	for (let i=0; i<len; i++) into.appendChild(children[i]);
	if (many) parent.appendChild(into);
}


/** Removes a given DOM Node from its parent. */
function removeNode(node) {
	let p = node.parentNode;
	if (p) p.removeChild(node);
}


/** Retrieve the value of a rendered attribute
 *	@private
 */
function getAccessor(node, name, value, cache) {
	if (name!=='type' && name!=='style' && name in node) return node[name];
	let attrs = node[ATTR_KEY];
	if (cache!==false && attrs && hasOwnProperty.call(attrs, name)) return attrs[name];
	if (name==='class') return node.className;
	if (name==='style') return node.style.cssText;
	return value;
}



/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} value		An attribute value, such as a function to be used as an event handler
 *	@param {any} previousValue	The last value that was set for this name/node pair
 *	@private
 */
function setAccessor(node, name, value) {
	if (name==='class') {
		node.className = value || '';
	}
	else if (name==='style') {
		node.style.cssText = value || '';
	}
	else if (name==='dangerouslySetInnerHTML') {
		if (value && value.__html) node.innerHTML = value.__html;
	}
	else if (name==='key' || (name in node && name!=='type')) {
		node[name] = value;
		if (falsey(value)) node.removeAttribute(name);
	}
	else {
		setComplexAccessor(node, name, value);
	}

	ensureNodeData(node)[name] = value;
}


/** For props without explicit behavior, apply to a Node as event handlers or attributes.
 *	@private
 */
function setComplexAccessor(node, name, value) {
	if (name.substring(0,2)==='on') {
		let type = normalizeEventName(name),
			l = node._listeners || (node._listeners = {}),
			fn = !l[type] ? 'add' : !value ? 'remove' : null;
		if (fn) node[fn+'EventListener'](type, eventProxy);
		l[type] = value;
		return;
	}

	let type = typeof value;
	if (falsey(value)) {
		node.removeAttribute(name);
	}
	else if (type!=='function' && type!=='object') {
		node.setAttribute(name, value);
	}
}



/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	let fn = this._listeners[normalizeEventName(e.type)];
	if (fn) return fn.call(this, optionsHook('event', e) || e);
}



/** Convert an Event name/type to lowercase and strip any "on*" prefix.
 *	@function
 *	@private
 */
let normalizeEventName = memoize(t => t.replace(/^on/i,'').toLowerCase());



/** Get a hashmap of node properties, preferring preact's cached property values over the DOM's
 *	@private
 */
function getNodeAttributes(node) {
	return node[ATTR_KEY] || getRawNodeAttributes(node) || EMPTY;
	// let list = getRawNodeAttributes(node),
	// 	l = node[ATTR_KEY];
	// return l && list ? extend(list, l) : (l || list || EMPTY);
}


/** Get a node's attributes as a hashmap, regardless of type.
 *	@private
 */
function getRawNodeAttributes(node) {
	let list = node.attributes;
	if (!list || !list.getNamedItem) return list;
	return getAttributesAsObject(list);
}


/** Convert a DOM `.attributes` NamedNodeMap to a hashmap.
 *	@private
 */
function getAttributesAsObject(list) {
	let attrs;
	for (let i=list.length; i--; ) {
		let item = list[i];
		if (!attrs) attrs = {};
		attrs[item.name] = item.value;
	}
	return attrs;
}

/** Check if two nodes are equivalent.
 *	@param {Element} node
 *	@param {VNode} vnode
 *	@private
 */
function isSameNodeType(node, vnode) {
	if (isFunctionalComponent(vnode)) return true;
	let nodeName = vnode.nodeName;
	if (isFunction$1(nodeName)) return node._componentConstructor===nodeName;
	if (getNodeType(node)===3) return isString$1(vnode);
	return toLowerCase(node.nodeName)===nodeName;
}


/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
	let props = clone(vnode.attributes),
		c = vnode.children;
	if (c) props.children = c;

	let defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps) {
		for (let i in defaultProps) {
			if (hasOwnProperty.call(defaultProps, i) && !(i in props)) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

/** DOM node pool, keyed on nodeName. */

let nodes = {};

let normalizeName = memoize(name => name.toUpperCase());


function collectNode(node) {
	cleanNode(node);
	let name = normalizeName(node.nodeName),
		list = nodes[name];
	if (list) list.push(node);
	else nodes[name] = [node];
}


function createNode(nodeName) {
	let name = normalizeName(nodeName),
		list = nodes[name],
		node = list && list.pop() || document.createElement(nodeName);
	ensureNodeData(node);
	return node;
}


function cleanNode(node) {
	removeNode(node);

	if (getNodeType(node)===3) return;

	// When reclaiming externally created nodes, seed the attribute cache: (Issue #97)
	if (!node[ATTR_KEY]) {
		node[ATTR_KEY] = getRawNodeAttributes(node);
	}

	node._component = node._componentConstructor = null;

	// if (node.childNodes.length>0) {
	// 	console.trace(`Warning: Recycler collecting <${node.nodeName}> with ${node.childNodes.length} children.`);
	// 	for (let i=node.childNodes.length; i--; ) collectNode(node.childNodes[i]);
	// }
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context) {
	let originalAttributes = vnode.attributes;

	while (isFunctionalComponent(vnode)) {
		vnode = buildFunctionalComponent(vnode, context);
	}

	if (isFunction$1(vnode.nodeName)) {
		return buildComponentFromVNode(dom, vnode, context);
	}

	if (isString$1(vnode)) {
		if (dom) {
			let type = getNodeType(dom);
			if (type===3) {
				dom[TEXT_CONTENT] = vnode;
				return dom;
			}
			else if (type===1) {
				collectNode(dom);
			}
		}
		return document.createTextNode(vnode);
	}

	// return diffNode(dom, vnode, context);
// }


/** Morph a DOM node to look like the given VNode. Creates DOM if it doesn't exist. */
// function diffNode(dom, vnode, context) {
	let out = dom,
		nodeName = vnode.nodeName || UNDEFINED_ELEMENT;

	if (!dom) {
		out = createNode(nodeName);
	}
	else if (toLowerCase(dom.nodeName)!==nodeName) {
		out = createNode(nodeName);
		// move children into the replacement node
		appendChildren(out, toArray(dom.childNodes));
		// reclaim element nodes
		recollectNodeTree(dom);
	}

	innerDiffNode(out, vnode, context);
	diffAttributes(out, vnode);

	if (originalAttributes && originalAttributes.ref) {
		(out[ATTR_KEY].ref = originalAttributes.ref)(out);
	}

	return out;
}


/** Apply child and attribute changes between a VNode and a DOM Node to the DOM. */
function innerDiffNode(dom, vnode, context) {
	let children,
		keyed,
		keyedLen = 0,
		len = dom.childNodes.length,
		childrenLen = 0;
	if (len) {
		children = [];
		for (let i=0; i<len; i++) {
			let child = dom.childNodes[i],
				key = child._component ? child._component.__key : getAccessor(child, 'key');
			if (!empty(key)) {
				if (!keyed) keyed = {};
				keyed[key] = child;
				keyedLen++;
			}
			else {
				children[childrenLen++] = child;
			}
		}
	}


	let vchildren = vnode.children,
		vlen = vchildren && vchildren.length,
		min = 0;
	if (vlen) {
		for (let i=0; i<vlen; i++) {
			let vchild = vchildren[i],
				child;

			// if (isFunctionalComponent(vchild)) {
			// 	vchild = buildFunctionalComponent(vchild);
			// }

			// attempt to find a node based on key matching
			if (keyedLen) {
				let attrs = vchild.attributes,
					key = attrs && attrs.key;
				if (!empty(key) && hasOwnProperty.call(keyed, key)) {
					child = keyed[key];
					keyed[key] = null;
					keyedLen--;
				}
			}

			// attempt to pluck a node of the same type from the existing children
			if (!child && min<childrenLen) {
				for (let j=min; j<childrenLen; j++) {
					let c = children[j];
					if (c && isSameNodeType(c, vchild)) {
						child = c;
						children[j] = null;
						if (j===childrenLen-1) childrenLen--;
						if (j===min) min++;
						break;
					}
				}
			}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = diff(child, vchild, context);

			if (dom.childNodes[i]!==child) {
				let c = child.parentNode!==dom && child._component,
					next = dom.childNodes[i+1];
				if (c) deepHook(c, 'componentWillMount');
				if (next) {
					dom.insertBefore(child, next);
				}
				else {
					dom.appendChild(child);
				}
				if (c) deepHook(c, 'componentDidMount');
			}
		}
	}


	if (keyedLen) {
		/*eslint guard-for-in:0*/
		for (let i in keyed) if (hasOwnProperty.call(keyed, i) && keyed[i]) {
			children[min=childrenLen++] = keyed[i];
		}
	}

	// remove orphaned children
	if (min<childrenLen) {
		removeOrphanedChildren(children);
	}
}


/** Reclaim children that were unreferenced in the desired VTree */
function removeOrphanedChildren(children, unmountOnly) {
	for (let i=children.length; i--; ) {
		let child = children[i];
		if (child) {
			recollectNodeTree(child, unmountOnly);
		}
	}
}


/** Reclaim an entire tree of nodes, starting at the root. */
function recollectNodeTree(node, unmountOnly) {
	// @TODO: Need to make a call on whether Preact should remove nodes not created by itself.
	// Currently it *does* remove them. Discussion: https://github.com/developit/preact/issues/39
	//if (!node[ATTR_KEY]) return;

	let attrs = node[ATTR_KEY];
	if (attrs) hook(attrs, 'ref', null);

	let component = node._component;
	if (component) {
		unmountComponent(component, !unmountOnly);
	}
	else {
		if (!unmountOnly) {
			if (getNodeType(node)!==1) {
				removeNode(node);
				return;
			}

			collectNode(node);
		}

		let c = node.childNodes;
		if (c && c.length) {
			removeOrphanedChildren(c, unmountOnly);
		}
	}
}


/** Apply differences in attributes from a VNode to the given DOM Node. */
function diffAttributes(dom, vnode) {
	let old = getNodeAttributes(dom) || EMPTY,
		attrs = vnode.attributes || EMPTY,
		name, value;

	// removed
	for (name in old) {
		if (empty(attrs[name])) {
			setAccessor(dom, name, null);
		}
	}

	// new & updated
	if (attrs!==EMPTY) {
		for (name in attrs) {
			if (hasOwnProperty.call(attrs, name)) {
				value = attrs[name];
				if (!empty(value) && value!=getAccessor(dom, name)) {
					setAccessor(dom, name, value);
				}
			}
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
const components = {};


function collectComponent(component) {
	let name = component.constructor.name,
		list = components[name];
	if (list) list.push(component);
	else components[name] = [component];
}


function createComponent(Ctor, props, context) {
	let list = components[Ctor.name],
		len = list && list.length,
		c;
	for (let i=0; i<len; i++) {
		c = list[i];
		if (c.constructor===Ctor) {
			list.splice(i, 1);
			let inst = new Ctor(props, context);
			inst.nextBase = c.base;
			return inst;
		}
	}
	return new Ctor(props, context);
}

/** Mark component as dirty and queue up a render.
 *	@param {Component} component
 *	@private
 */
function triggerComponentRender(component) {
	if (!component._dirty) {
		component._dirty = true;
		enqueueRender(component);
	}
}



/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context) {
	let d = component._disableRendering;

	component.__ref = props.ref;
	component.__key = props.key;
	delete props.ref;
	delete props.key;

	component._disableRendering = true;

	if (context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (component.base) {
		hook(component, 'componentWillReceiveProps', props, component.context);
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disableRendering = d;

	if (!opts || opts.render!==false) {
		if ((opts && opts.renderSync) || options.syncComponentUpdates!==false) {
			renderComponent(component);
		}
		else {
			triggerComponentRender(component);
		}
	}

	hook(component, '__ref', component);
}



/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts) {
	if (component._disableRendering) return;

	let skip, rendered,
		props = component.props,
		state = component.state,
		context = component.context,
		previousProps = component.prevProps || props,
		previousState = component.prevState || state,
		previousContext = component.prevContext || context,
		isUpdate = component.base,
		initialBase = isUpdate || component.nextBase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (hook(component, 'shouldComponentUpdate', props, state, context)===false) {
			skip = true;
		}
		else {
			hook(component, 'componentWillUpdate', props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = hook(component, 'render', props, state, context);

		let childComponent = rendered && rendered.nodeName,
			childContext = component.getChildContext ? component.getChildContext() : context,	// @TODO might want to clone() new context obj
			toUnmount, base;

		if (isFunction$1(childComponent) && childComponent.prototype.render) {
			// set up high order component link

			let inst = component._component;
			if (inst && inst.constructor!==childComponent) {
				toUnmount = inst;
				inst = null;
			}

			let childProps = getNodeProps(rendered);

			if (inst) {
				setComponentProps(inst, childProps, SYNC_RENDER, childContext);
			}
			else {
				inst = createComponent(childComponent, childProps, childContext);
				inst._parentComponent = component;
				component._component = inst;
				if (isUpdate) deepHook(inst, 'componentWillMount');
				setComponentProps(inst, childProps, NO_RENDER, childContext);
				renderComponent(inst, DOM_RENDER);
				if (isUpdate) deepHook(inst, 'componentDidMount');
			}

			base = inst.base;
		}
		else {
			let cbase = initialBase;

			// destroy high order component link
			toUnmount = component._component;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || (opts && opts.build)) {
				base = diff(cbase, rendered || EMPTY_BASE, childContext);
			}
		}

		if (initialBase && base!==initialBase) {
			let p = initialBase.parentNode;
			if (p && base!==p) p.replaceChild(base, initialBase);
		}

		if (toUnmount) {
			unmountComponent(toUnmount, true);
		}

		component.base = base;
		if (base) {
			let componentRef = component,
				t = component;
			while ((t=t._parentComponent)) { componentRef = t; }
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}

		if (isUpdate) {
			hook(component, 'componentDidUpdate', previousProps, previousState, previousContext);
		}
	}

	let cb = component._renderCallbacks, fn;
	if (cb) while ( (fn = cb.pop()) ) fn.call(component);

	return rendered;
}



/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context) {
	let c = dom && dom._component,
		oldDom = dom;

	let isOwner = c && dom._componentConstructor===vnode.nodeName;
	while (c && !isOwner && (c=c._parentComponent)) {
		isOwner = c.constructor===vnode.nodeName;
	}

	if (isOwner) {
		setComponentProps(c, getNodeProps(vnode), SYNC_RENDER, context);
		dom = c.base;
	}
	else {
		if (c) {
			unmountComponent(c, true);
			dom = oldDom = null;
		}
		dom = createComponentFromVNode(vnode, dom, context);
		if (oldDom && dom!==oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom);
		}
	}

	return dom;
}



/** Instantiate and render a Component, given a VNode whose nodeName is a constructor.
 *	@param {VNode} vnode
 *	@private
 */
function createComponentFromVNode(vnode, dom, context) {
	let props = getNodeProps(vnode);
	let component = createComponent(vnode.nodeName, props, context);

	if (dom && !component.base) component.base = dom;

	setComponentProps(component, props, NO_RENDER, context);
	renderComponent(component, DOM_RENDER);

	// let node = component.base;
	//if (!node._component) {
	//	node._component = component;
	//	node._componentConstructor = vnode.nodeName;
	//}

	return component.base;
}



/** Remove a component from the DOM and recycle it.
 *	@param {Element} dom			A DOM node from which to unmount the given Component
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component, remove) {
	// console.log(`${remove?'Removing':'Unmounting'} component: ${component.constructor.name}`, component);

	hook(component, '__ref', null);
	hook(component, 'componentWillUnmount');

	// recursively tear down & recollect high-order component children:
	let inner = component._component;
	if (inner) {
		unmountComponent(inner, remove);
		remove = false;
	}

	let base = component.base;
	if (base) {
		if (remove!==false) removeNode(base);
		removeOrphanedChildren(base.childNodes, true);
	}

	if (remove) {
		component._parentComponent = null;
		collectComponent(component);
	}

	hook(component, 'componentDidUnmount');
}

/** Base Component class, for he ES6 Class method of creating Components
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	/** @private */
	this._dirty = this._disableRendering = false;
	/** @public */
	this.prevState = this.prevProps = this.prevContext = this.base = this.nextBase = this._parentComponent = this._component = this.__ref = this.__key = this._linkedStates = this._renderCallbacks = null;
	/** @public */
	this.context = context || {};
	/** @type {object} */
	this.props = props;
	/** @type {object} */
	this.state = hook(this, 'getInitialState') || {};
}


extend$1(Component.prototype, {

	/** Returns a `boolean` value indicating if the component should re-render when receiving the given `props` and `state`.
	 *	@param {object} nextProps
	 *	@param {object} nextState
	 *	@param {object} nextContext
	 *	@returns {Boolean} should the component re-render
	 *	@name shouldComponentUpdate
	 *	@function
	 */
	// shouldComponentUpdate() {
	// 	return true;
	// },


	/** Returns a function that sets a state property when called.
	 *	Calling linkState() repeatedly with the same arguments returns a cached link function.
	 *
	 *	Provides some built-in special cases:
	 *		- Checkboxes and radio buttons link their boolean `checked` value
	 *		- Inputs automatically link their `value` property
	 *		- Event paths fall back to any associated Component if not found on an element
	 *		- If linked value is a function, will invoke it and use the result
	 *
	 *	@param {string} key				The path to set - can be a dot-notated deep key
	 *	@param {string} [eventPath]		If set, attempts to find the new state value at a given dot-notated path within the object passed to the linkedState setter.
	 *	@returns {function} linkStateSetter(e)
	 *
	 *	@example Update a "text" state value when an input changes:
	 *		<input onChange={ this.linkState('text') } />
	 *
	 *	@example Set a deep state value on click
	 *		<button onClick={ this.linkState('touch.coords', 'touches.0') }>Tap</button
	 */
	linkState(key, eventPath) {
		let c = this._linkedStates || (this._linkedStates = {}),
			cacheKey = key + '|' + (eventPath || '');
		return c[cacheKey] || (c[cacheKey] = createLinkedState(this, key, eventPath));
	},


	/** Update component state by copying properties from `state` to `this.state`.
	 *	@param {object} state		A hash of state properties to update with new values
	 */
	setState(state, callback) {
		let s = this.state;
		if (!this.prevState) this.prevState = clone(s);
		extend$1(s, isFunction$1(state) ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = (this._renderCallbacks || [])).push(callback);
		triggerComponentRender(this);
	},


	/** Immediately perform a synchronous re-render of the component.
	 *	@private
	 */
	forceUpdate() {
		renderComponent(this);
	},


	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
	 *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
	 *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
	 *	@param {object} state		The component's current state
	 *	@param {object} context		Context object (if a parent component has provided context)
	 *	@returns VNode
	 */
	render() {
		return null;
	}

});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */
function render(vnode, parent, merge) {
	let existing = merge && merge._component && merge._componentConstructor===vnode.nodeName,
		built = diff(merge, vnode),
		c = !existing && built._component;

	if (c) deepHook(c, 'componentWillMount');

	if (built.parentNode!==parent) {
		parent.appendChild(built);
	}

	if (c) deepHook(c, 'componentDidMount');

	return built;
}

class Clock extends Component {
    constructor() {
        super();
        // set initial time:
        this.state.time = Date.now();
    }

    componentDidMount() {
        // update time every second
        this.timer = setInterval(() => {
            this.setState({ time: Date.now() });
        }, 1000);
    }

    componentWillUnmount() {
        // stop when not renderable
        clearInterval(this.timer);
    }

    render(props, state) {
        let time = new Date(state.time).toLocaleTimeString();
        return h(
            'span',
            null,
            time
        );
    }
}
function clock (el) {
    render(h(Clock, null), el || document.body);
}

const fn_contextmenu = function (e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
};

const defaults = {
	videoWidth: 920,
	videoHeight: 520,
	autoplay: false,
	loop: false,
	controls: false,
	font: {
		ratio: 1,
		min: .5,
		units: "em"
	}
};

class kmlPlayer extends Media {
	constructor(settings, _events, app) {
		let el = settings.video;
		super(el);
		this.iframe = inIframe();
		if (el == null) return;
		this._bounds = {};
		this.device = device;
		this.__settings = deepmerge(defaults, settings);
		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
		this.wrapper = dom.wrap(this.media, dom.createElement('div', {
			class: 'kmlPlayer'
		}));
		dom.triggerWebkitHardwareAcceleration(this.wrapper);
		if (this.inIframe) {
			dom.addClass(this.wrapper, "inFrame");
		}
		//initSettings
		for (var k in this.__settings) {
			if (this[k]) {
				if (k === 'autoplay' && this.__settings[k] && !this.inIframe) {
					this.play();
					continue;
				}
				this[k](this.__settings[k]);
			}
			if (k === 'controls' && this.__settings[k] === "native") {
				this.nativeControls(true);
			}
		}

		//initPageVisibility
		this.pageVisibility = new pageVisibility(el);

		//initexternalControls
		this.externalControls = new externalControls(el);

		//initContainers
		this.containers = new Containers(this);

		this.container = function (stg, el) {
			return this.containers.add(stg, el, 'container');
		};

		this.videoContainer = function (stg) {
			return this.containers.add(stg, null, 'video');
		};

		this.popupContainer = function (stg) {
			return this.containers.add(stg, null, 'popup');
		};

		//autoFONT
		if (typeof this.__settings.font === "boolean" && this.__settings.font) this.__settings.font = defaults.font;
		this.autoFont = new autoFont(this.wrapper, this.__settings.font, this);
		if (this.__settings.font) this.autoFont.enabled(true);

		//initCallbackEvents
		for (var evt in _events) {
			this.on(evt, _events[evt], this);
		}

		if (typeof app === 'function') {
			app.bind(this);
		}

		this.on('loadedmetadata', () => {
			if (this.media.width != this.media.videoWidth || this.media.height != this.media.videoHeight) {
				this.videoWidth();
				this.videoHeight();
				this.emit('resize');
			}
			if (!this._app) {
				app.bind(this)();
				this._app = true;
			}
		});

		el.addEventListener('dbltap', () => {
			this.toggleFullScreen();
		});

		let videoSizeCache = {
			w: this.width(),
			x: this.offsetX(),
			y: this.offsetY(),
			h: this.height()
		};
		let checkVideoResize = () => {
			this._bounds = containerBounds(this.media);
			let w = this.width();
			let h = this.width();
			let x = this.offsetX();
			let y = this.offsetY();
			if (videoSizeCache.w != w || videoSizeCache.h != h || videoSizeCache.x != x || videoSizeCache.y != y) {
				videoSizeCache.w = w;
				videoSizeCache.h = h;
				videoSizeCache.x = x;
				videoSizeCache.y = y;
				this.emit('resize');
			}
			window.requestAnimationFrame(checkVideoResize);
		};

		checkVideoResize();
	}

	contextMenu(v) {
		if (typeof v === 'boolean') {
			v ? this.media.removeEventListener('contextmenu', fn_contextmenu) : this.media.addEventListener('contextmenu', fn_contextmenu);
		}
	}

	ajax(options) {
		return ajax(options);
	}

	videoWidth(v) {
		if (this.media.videoWidth) {
			this.media.width = this.media.videoWidth;
			return this.media.videoWidth;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.width = v;
		}
		return this.media.width;
	}

	videoHeight(v) {
		if (this.media.videoHeight) {
			this.media.height = this.media.videoHeight;
			return this.media.videoHeight;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.height = v;
		}
		return this.media.height;
	}

	scale() {
		return this.videoWidth() / this.videoHeight();
	}

	bounds(v) {
		if (this._bounds[v] !== null) return this._bounds[v];
		return this._bounds;
	}

	width() {
		return this.bounds('width');
	}

	height() {
		return this.bounds('height');
	}

	offsetX() {
		return this.bounds('offsetX');
	}

	offsetY() {
		return this.bounds('offsetY');
	}

	wrapperHeight() {
		return this.media.offsetHeight;
	}

	wrapperWidth() {
		return this.media.offsetWidth;
	}

	wrapperScale() {
		return this.media.offsetWidth / this.media.offsetHeight;
	}

	addClass(v, el) {
		if (el != null) {
			dom.addClass(v, el);
			return;
		}
		dom.addClass(this.wrapper, v);
	}
	removeClass(v, el) {
		if (el != null) {
			dom.removeClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			dom.removeClass(this.wrapper, v);
		}
	}
	toggleClass(v, el) {
		if (el != null) {
			dom.toggleClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			dom.toggleClass(this.wrapper, v);
		}
	}

	clock() {
		return clock;
	}
};

//disable on production
if (device.isTouch) {
	window.onerror = function (message, scriptUrl, line, column) {
		console.log(line, column, message);
		alert(line + ":" + column + "-" + message);
	};
}

export default kmlPlayer;