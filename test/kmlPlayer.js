/*! kmlplayer.js - v0.3.1 */
var kmlPlayer = (function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

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
  	    msEventType = function msEventType(type) {
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
  	    setListener = function setListener(elm, events, callback) {
  		var eventsArray = events.split(' '),
  		    i = eventsArray.length;

  		while (i--) {
  			elm.addEventListener(eventsArray[i], callback, false);
  		}
  	},
  	    getPointerEvent = function getPointerEvent(event) {
  		return event.targetTouches ? event.targetTouches[0] : event;
  	},
  	    getTimestamp = function getTimestamp() {
  		return new Date().getTime();
  	},
  	    sendEvent = function sendEvent(elm, eventName, originalEvent, data) {
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
  	    onTouchStart = function onTouchStart(e) {
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
  	    onTouchEnd = function onTouchEnd(e) {

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
  	    onTouchMove = function onTouchMove(e) {
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
  		var is = window.self !== window.top;
  		if (is) {
  			var arrFrames = parent.document.getElementsByTagName("IFRAME");
  			for (var i = 0; i < arrFrames.length; i++) {
  				var frame = arrFrames[i];
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

  var deepmerge = function () {
  	var deepmerge = function deepmerge(target, src) {
  		if (src) {
  			var array = Array.isArray(src);
  			var dst = array && [] || {};

  			if (array) {
  				target = target || [];
  				dst = dst.concat(target);
  				src.forEach(function (e, i) {
  					if (typeof dst[i] === 'undefined') {
  						dst[i] = e;
  					} else if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object') {
  						dst[i] = deepmerge(target[i], e);
  					} else {
  						if (target.indexOf(e) === -1) {
  							dst.push(e);
  						}
  					}
  				});
  			} else {
  				if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
  					Object.keys(target).forEach(function (key) {
  						dst[key] = target[key];
  					});
  				}
  				Object.keys(src).forEach(function (key) {
  					if (_typeof(src[key]) !== 'object' || !src[key]) {
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
  }();

  function capitalizeFirstLetter(string) {
  	return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function procentFromString(v) {
  	if (v === undefined || v === null) return false;
  	var t = false;
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

  var classReg = function classReg(c) {
  	return new RegExp("(^|\\s+)" + c + "(\\s+|$)");
  };

  var hasClass = void 0;
  var addClass = void 0;
  var removeClass = void 0;
  var toggleClass = void 0;

  if ('classList' in document.documentElement) {
  	hasClass = function hasClass(elem, c) {
  		return elem.classList.contains(c);
  	};
  	addClass = function addClass(elem, c) {
  		if (c != null) {
  			c = c.split(' ');
  			for (var k in c) {
  				elem.classList.add(c[k]);
  			}
  		}
  	};
  	removeClass = function removeClass(elem, c) {
  		elem.classList.remove(c);
  	};
  } else {
  	hasClass = function hasClass(elem, c) {
  		return classReg(c).test(elem.className);
  	};
  	addClass = function addClass(elem, c) {
  		if (!hasClass(elem, c)) {
  			elem.className = elem.className + ' ' + c;
  		}
  	};
  	removeClass = function removeClass(elem, c) {
  		elem.className = elem.className.replace(classReg(c), ' ');
  	};
  }

  toggleClass = function toggleClass(elem, c) {
  	var fn = hasClass(elem, c) ? removeClass : addClass;
  	fn(elem, c);
  };

  var getPrefixedStylePropName = function getPrefixedStylePropName(propName) {
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
  	triggerWebkitHardwareAcceleration: function triggerWebkitHardwareAcceleration(element) {
  		if (this.stylePrefix.backfaceVisibility && this.stylePrefix.perspective) {
  			element.style[this.stylePrefix.perspective] = '1000px';
  			element.style[this.stylePrefix.backfaceVisibility] = 'hidden';
  		}
  	},
  	transform: function transform(element, value) {
  		element.style[this.stylePrefix.transform] = value;
  	},
  	/**
    * Shorter and fast way to select multiple nodes in the DOM
    * @param   { String } selector - DOM selector
    * @param   { Object } ctx - DOM node where the targets of our search will is located
    * @returns { Object } dom nodes found
    */
  	selectAll: function selectAll(selector, ctx) {
  		return (ctx || document).querySelectorAll(selector);
  	},
  	/**
    * Shorter and fast way to select a single node in the DOM
    * @param   { String } selector - unique dom selector
    * @param   { Object } ctx - DOM node where the target of our search will is located
    * @returns { Object } dom node found
    */
  	select: function select(selector, ctx) {
  		return (ctx || document).querySelector(selector);
  	},
  	hasClass: hasClass,
  	addClass: addClass,
  	removeClass: removeClass,
  	toggleClass: toggleClass,
  	autoLineHeight: function autoLineHeight(el) {
  		var l = el.offsetHeight + "px";
  		el.style.lineHeight = l;
  		return l;
  	},
  	createElement: function createElement(elm, props) {
  		var el = document.createElement(elm);
  		for (var k in props) {
  			el.setAttribute(k, props[k]);
  		}
  		return el;
  	},
  	emptyElement: function emptyElement(elm) {
  		while (elm.firstChild) {
  			elm.removeChild(elm.firstChild);
  		}
  	},
  	replaceElement: function replaceElement(target, elm) {
  		target.parentNode.replaceChild(elm, target);
  	},
  	removeElement: function removeElement(element) {
  		element.parentNode.removeChild(element);
  	},
  	insertAfter: function insertAfter(el, referenceNode) {
  		referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
  	},
  	insertBefore: function insertBefore(el, referenceNode) {
  		referenceNode.parentNode.insertBefore(el, referenceNode);
  	},
  	getTextContent: function getTextContent(el) {
  		return el.textContent || el.innerText;
  	},
  	wrap: function wrap(elements, wrapper) {
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

  var browser = function () {
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

  var autoFont = function autoFont(el, font, parent) {
  	var _enabled = false;
  	var _update = function _update() {
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

  var defaults$2 = {
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

  var adaptiveSizePos = function adaptiveSizePos(setttings, parent) {
  	var bounds = function bounds() {
  		return {
  			offsetX: parent.offsetX(),
  			offsetY: parent.offsetY(),
  			width: parent.width(),
  			height: parent.height(),
  			scale: parent.width() / parent.videoWidth(),
  			scaleY: parent.width() / parent.videoHeight()
  		};
  	};
  	var vault = {
  		x: 0,
  		y: 0,
  		width: '100%',
  		height: '100%',
  		fontSize: null,
  		lineHeight: null
  	};
  	var parentWidth = 0;
  	var parentHeight = 0;
  	var parentX = 0;
  	var parentY = 0;
  	var domElement = null;
  	var settings = deepmerge(defaults$2, setttings);
  	var _active = false;

  	var updateDomElement = function updateDomElement() {
  		if (_active && domElement && domElement.nodeType) {
  			if (vault.width !== null) domElement.style.width = vault.width + "px";
  			if (vault.height !== null) domElement.style.height = vault.height + "px";

  			if (dom.stylePrefix.transform && settings.translate) {
  				var transform = '';
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

  	var updateProps = function updateProps() {
  		var _w = parent.width();
  		var _h = parent.height();
  		var _x = parent.offsetX();
  		var _y = parent.offsetY();
  		if (parentWidth != _w || parentHeight != _h || _x != parentX || _y != parentY) {
  			parentWidth = _w;
  			parentHeight = _h;
  			parentX = _x;
  			parentY = _y;
  		} else {
  			return;
  		}

  		var b = bounds();

  		var procentWidth = procentFromString(settings.width);
  		if (procentWidth) {
  			vault.width = b.width * procentWidth / 100;
  		} else {
  			if (settings.width != null) {
  				vault.width = b.width * b.scale;
  			}
  		}
  		vault.width = Math.ceil(vault.width);

  		var procentHeight = procentFromString(settings.height);
  		if (procentHeight) {
  			vault.height = b.height * procentHeight / 100;
  		} else {
  			if (settings.height != null) {
  				vault.height = b.height * b.scale;
  			}
  		}
  		vault.height = Math.ceil(vault.height);

  		if (settings.x != null) {
  			var procentX = procentFromString(settings.x);
  			if (procentX) {
  				vault.x = b.offsetX + b.width * procentX / 100;
  			} else {
  				vault.x = b.offsetX + settings.x * b.scale;
  			}
  			vault.x = Math.floor(vault.x);
  			var transformX = procentFromString(settings.transform.x);
  			if (transformX) vault.x += transformX * vault.width / 100;
  			if (settings.offsetX) vault.x += settings.offsetX;
  		}

  		if (settings.y != null) {
  			var procentY = procentFromString(settings.y);
  			if (procentY) {
  				vault.y = b.offsetY + b.height * procentY / 100;
  			} else {
  				vault.y = b.offsetY + settings.y * b.scale;
  			}
  			vault.y = Math.floor(vault.y);
  			var transformY = procentFromString(settings.transform.y);
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

  	var applyNewProps = function applyNewProps() {
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
  	function EventEmitter() {} /* Nothing to set */

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
  		var events = this._events,
  		    names = [],
  		    name;

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
  		var evt = prefix ? prefix + event : event,
  		    available = this._events && this._events[evt];

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

  		var listeners = this._events[evt],
  		    len = arguments.length,
  		    args,
  		    i;

  		if ('function' === typeof listeners.fn) {
  			if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

  			switch (len) {
  				case 1:
  					return listeners.fn.call(listeners.context), true;
  				case 2:
  					return listeners.fn.call(listeners.context, a1), true;
  				case 3:
  					return listeners.fn.call(listeners.context, a1, a2), true;
  				case 4:
  					return listeners.fn.call(listeners.context, a1, a2, a3), true;
  				case 5:
  					return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
  				case 6:
  					return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
  			}

  			for (i = 1, args = new Array(len - 1); i < len; i++) {
  				args[i - 1] = arguments[i];
  			}

  			listeners.fn.apply(listeners.context, args);
  		} else {
  			var length = listeners.length,
  			    j;

  			for (i = 0; i < length; i++) {
  				if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

  				switch (len) {
  					case 1:
  						listeners[i].fn.call(listeners[i].context);break;
  					case 2:
  						listeners[i].fn.call(listeners[i].context, a1);break;
  					case 3:
  						listeners[i].fn.call(listeners[i].context, a1, a2);break;
  					default:
  						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
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
  		var listener = new EE(fn, context || this),
  		    evt = prefix ? prefix + event : event;

  		if (!this._events) this._events = prefix ? {} : Object.create(null);
  		if (!this._events[evt]) this._events[evt] = listener;else {
  			if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];
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
  		var listener = new EE(fn, context || this, true),
  		    evt = prefix ? prefix + event : event;

  		if (!this._events) this._events = prefix ? {} : Object.create(null);
  		if (!this._events[evt]) this._events[evt] = listener;else {
  			if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];
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

  		var listeners = this._events[evt],
  		    events = [];

  		if (fn) {
  			if (listeners.fn) {
  				if (listeners.fn !== fn || once && !listeners.once || context && listeners.context !== context) {
  					events.push(listeners);
  				}
  			} else {
  				for (var i = 0, length = listeners.length; i < length; i++) {
  					if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
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

  		if (event) delete this._events[prefix ? prefix + event : event];else this._events = prefix ? {} : Object.create(null);

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

  var Events = index && (typeof index === 'undefined' ? 'undefined' : _typeof(index)) === 'object' && 'default' in index ? index['default'] : index;

  var defaults$3 = {
  	x: 0,
  	y: 0,
  	width: 0,
  	height: 0
  };
  var relativeSizePos = function relativeSizePos(ctx, settings) {
  	var parentWidth = ctx.videoWidth() || ctx.width || 1;
  	var parentHeight = ctx.videoHeight() || ctx.height || 1;
  	var o = deepmerge(defaults$3, settings);
  	var _w = procentFromString(o.width);
  	if (_w === false) _w = o.width / parentWidth * 100;
  	var _h = procentFromString(o.height);
  	if (_h === false) _h = o.height / parentHeight * 100;
  	var _x = procentFromString(o.x);
  	if (_x === false) _x = o.x / parentWidth * 100;
  	var _y = procentFromString(o.y);
  	if (_y === false) _y = o.y / parentHeight * 100;
  	return {
  		x: _x,
  		y: _y,
  		width: _w,
  		height: _h
  	};
  };

  var Container = function (_Events) {
  	inherits(Container, _Events);

  	function Container(el, opts, ctx, player) {
  		classCallCheck(this, Container);

  		var playerPaused = false;
  		var isVisible = false;
  		var externalControls = false;
  		var body = dom.select('.body', el);

  		var _this = possibleConstructorReturn(this, _Events.call(this));

  		_this.ctx = ctx;
  		_this.body = body;
  		_this.config = function (fopts) {
  			if (fopts) opts = deepmerge(opts, fopts);
  			var d = new relativeSizePos(player, opts);
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
  		_this.config();
  		player.on('resize', _this.config);

  		_this.hide = function () {
  			if (isVisible) {
  				_this.emit('beforeHide');
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
  				setTimeout(function () {
  					el.style.display = "none";
  					if (isFunction(opts.onHide)) opts.onHide();
  					ctx.checkVisibleElements();
  					_this.emit('hide');
  				}, 250);
  			}
  		};
  		_this.show = function () {
  			if (!isVisible) {
  				isVisible = true;
  				_this.emit('beforeShow');
  				ctx.enabled(true);
  				el.style.display = "block";
  				setTimeout(function () {
  					dom.removeClass(el, 'hidden');
  					if (isFunction(opts.onHide)) opts.onShow();
  					_this.emit('show');
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
  			_this.show();
  		}

  		_this.visible = function (v) {
  			if (typeof v === 'boolean') isVisible = v;
  			return isVisible;
  		};
  		return _this;
  	}

  	Container.prototype.destroy = function destroy() {
  		console.log("container");
  		this.removeAllListeners();
  		this.ctx.remove(this.body);
  	};

  	return Container;
  }(Events);

  var Popup = function (_Container) {
  	inherits(Popup, _Container);

  	function Popup(el, opts, ctx, parentPlayer) {
  		classCallCheck(this, Popup);

  		var _this2 = possibleConstructorReturn(this, _Container.call(this, el, opts, ctx, parentPlayer));

  		var overlay = dom.createElement('div');
  		dom.addClass(overlay, 'overlay triggerClose');
  		dom.insertBefore(overlay, _this2.body);
  		//header
  		var header = document.createElement('h1');
  		dom.addClass(header, 'header');
  		_this2._title = document.createElement('span');
  		header.appendChild(_this2._title);
  		_this2._closeBtn = document.createElement('a');
  		_this2._closeBtn.innerHTML = "<img src='svg/ic_close.svg'/>";
  		dom.addClass(_this2._closeBtn, 'closeBtn');
  		_this2._closeBtn.addEventListener('click', _this2.hide);
  		header.appendChild(_this2._closeBtn);
  		_this2.body.appendChild(header);
  		//end header

  		_this2.backgroundColor = function (v) {
  			if (v != null) {
  				overlay.style.backgroundColor = v;
  			}
  			return overlay.style.backgroundColor;
  		};

  		_this2.scaleSize = function (s) {
  			this.config({ x: (100 - s) / 2 + "%", y: (100 - s) / 2 + "%", width: s + "%", height: s + "%" });
  		};

  		//EVENTS
  		parentPlayer.on('resize', function () {
  			_this2.emit('resize');
  		});

  		['resize', 'config', 'beforeShow'].map(function (evt) {
  			_this2.on(evt, function () {
  				console.log(evt);
  				_this2.autoLineHeight();
  			});
  		});

  		var clsElements = dom.selectAll('.triggerClose', el);
  		for (var i = 0, n = clsElements.length; i < n; i += 1) {
  			clsElements[i].addEventListener('click', _this2.hide);
  		}
  		return _this2;
  	}

  	Popup.prototype.destroy = function destroy() {
  		console.log('popup');
  		this.removeAllListeners();
  		this.ctx.remove(this.body);
  		dom.removeElement(this.body.parentNode);
  	};

  	Popup.prototype.autoLineHeight = function autoLineHeight(el) {
  		if (this.visible()) {
  			if (el) {
  				dom.autoLineHeight(el);
  			} else {
  				dom.autoLineHeight(this._title.parentNode);
  			}
  		}
  	};

  	Popup.prototype.title = function title(v) {
  		if (v != null) {
  			this._title.innerHTML = v;
  			this.autoLineHeight();
  			return v;
  		}
  		return this._title.innerHTML;
  	};

  	return Popup;
  }(Container);

  function ErrorFormatException(msg) {
  	try {
  		throw new Error(msg);
  	} catch (e) {
  		console.log(e.name + ': ' + e.message);
  		return;
  	}
  }

  function scrollPosition() {
  	var x = 0;
  	var y = 0;
  	this.save = function () {
  		x = window.pageXOffset || 0;
  		y = window.pageYOffset || 0;
  	};
  	this.restore = function () {
  		window.scrollTo(x, y);
  	};
  }

  // Fullscreen API
  var supportsFullScreen = false;
  var browserPrefixes = 'webkit moz o ms khtml'.split(' ');
  var prefixFS = '';
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
  var eventChange = prefixFS === '' ? 'fullscreenchange' : prefixFS + (prefixFS == 'ms' ? 'fullscreenchange' : 'fullscreenchange');
  eventChange = eventChange.toLowerCase();
  //supportsFullScreen = false;

  var Fullscreen = function (_Events2) {
  	inherits(Fullscreen, _Events2);

  	function Fullscreen() {
  		classCallCheck(this, Fullscreen);

  		var _this3 = possibleConstructorReturn(this, _Events2.call(this));

  		_this3.iframe = null;
  		_this3.scrollPosition = new scrollPosition();
  		_this3._fullscreenElement = null;
  		_this3.fullscreenElementStyle = {};
  		if (supportsFullScreen) {
  			var fnFullscreenChange = function fnFullscreenChange() {
  				if (!_this3.isFullScreen()) {
  					setTimeout(_this3.scrollPosition.restore, 100);
  				}
  			};
  			document.addEventListener(eventChange, fnFullscreenChange, false);
  		}
  		return _this3;
  	}

  	Fullscreen.prototype.defualtFullScreenElement = function defualtFullScreenElement(element) {
  		var el = element;
  		if (el == null) {
  			if (this.iframe) {
  				el = this.iframe;
  			} else {
  				el = this.wrapper;
  			}
  		}
  		return el;
  	};

  	Fullscreen.prototype.onFullscreenChange = function onFullscreenChange(evt) {
  		//investigate if native video fullscreen can be overwritten
  		this.media.addEventListener(eventChange, function (e) {
  			e.preventDefault();
  			e.stopPropagation;
  			return false;
  		}, true);
  	};

  	Fullscreen.prototype.isFullWindow = function isFullWindow() {
  		return false;
  	};

  	Fullscreen.prototype.isFullScreen = function isFullScreen(element) {
  		if (supportsFullScreen) {
  			var el = this.defualtFullScreenElement(element);
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
  	};

  	Fullscreen.prototype.requestFullWindow = function requestFullWindow(element) {
  		if (this.isFullWindow()) return;
  		if (supportsFullScreen && this.isFullScreen()) return;
  		var el = this.defualtFullScreenElement(element);
  		this.scrollPosition.save();
  		// let style = window.getComputedStyle(element);
  		var style = el.style;
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
  	};

  	Fullscreen.prototype.requestFullScreen = function requestFullScreen(element) {
  		var el = this.defualtFullScreenElement(element);
  		if (supportsFullScreen) {
  			this.scrollPosition.save();
  			return prefixFS === '' ? el.requestFullScreen() : el[prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
  		} else {
  			this.requestFullWindow(el);
  		}
  	};

  	Fullscreen.prototype.cancelFullWindow = function cancelFullWindow() {
  		if (!this.isFullWindow()) return;
  		if (supportsFullScreen && this.isFullScreen()) return;
  		for (var k in this.fullscreenElementStyle) {
  			this._fullscreenElement.style[k] = this.fullscreenElementStyle[k];
  		}
  		this._fullscreenElement = null;
  		this.isFullWindow = function () {
  			return false;
  		};
  		this.scrollPosition.restore();
  	};

  	Fullscreen.prototype.cancelFullScreen = function cancelFullScreen() {
  		if (supportsFullScreen) {
  			return prefixFS === '' ? document.cancelFullScreen() : document[prefixFS + (prefixFS == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
  		} else {
  			this.cancelFullWindow();
  		}
  	};

  	Fullscreen.prototype.toggleFullWindow = function toggleFullWindow(element) {
  		var isFullscreen = !this.isFullWindow();
  		if (isFullscreen) {
  			this.requestFullWindow(element);
  			//document.body.style.overflow = 'hidden';
  		} else {
  			this.cancelFullWindow();
  			//document.body.style.overflow = '';
  		}
  	};

  	Fullscreen.prototype.toggleFullScreen = function toggleFullScreen(element) {
  		var isFullscreen = this.isFullScreen();
  		if (!isFullscreen) {
  			this.requestFullScreen(element);
  			//document.body.style.overflow = 'hidden';
  		} else {
  			this.cancelFullScreen();
  			//document.body.style.overflow = '';
  		}
  	};

  	Fullscreen.prototype.fullscreenElement = function fullscreenElement() {
  		if (supportsFullScreen) {
  			return prefixFS === '' ? document.fullscreenElement : document[prefixFS + 'FullscreenElement'];
  		} else {
  			return this._fullscreenElement;
  		}
  	};

  	return Fullscreen;
  }(Events);

  ;

  function _cancelRequests(media) {
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
  var _events = ['ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'playing', 'pause', 'error', 'seeking', 'emptied', 'seeked', 'ratechange', 'suspend'];

  var Media = function (_Fullscreen) {
  	inherits(Media, _Fullscreen);

  	function Media(el) {
  		classCallCheck(this, Media);

  		var _this4 = possibleConstructorReturn(this, _Fullscreen.call(this));

  		if (el == null) {
  			ErrorFormatException("You need to supply a HTMLVideoElement to instantiate the player");
  			return possibleConstructorReturn(_this4);
  		}
  		_this4.media = el;
  		_events.forEach(function (k) {
  			el.addEventListener(k, function () {
  				_this4.emit(k);
  			});
  		});

  		_this4.canPlay = {
  			mp4: mimeVideo(el, 'video/mp4'),
  			webm: mimeVideo(el, 'video/webm'),
  			ogg: mimeVideo(el, 'video/ogg')
  		};
  		return _this4;
  	}

  	/*** Global attributes */

  	/* A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data. If not return the auoplay attribute. */


  	Media.prototype.autoplay = function autoplay(v) {
  		if (typeof v === 'boolean') {
  			this.media.autoplay = v;
  		}
  		return this.media.autoplay;
  	};

  	/* Returns the time ranges of the buffered media. This attribute contains a TimeRanges object */


  	Media.prototype.buffered = function buffered() {
  		return this.media.buffered;
  	};

  	/* If this attribute is present, the browser will offer controls to allow the user to control video playback, including volume, seeking, and pause/resume playback. When not set returns if the controls are present */


  	Media.prototype.nativeControls = function nativeControls(v) {
  		if (typeof v === 'boolean') {
  			this.media.controls = v;
  		}
  		return this.media.controls;
  	};

  	/* anonymous, use-credentials, false */


  	Media.prototype.crossorigin = function crossorigin(v) {
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
  	};

  	/* A Boolean attribute; if specified, we will, upon reaching the end of the video, automatically seek back to the start. */


  	Media.prototype.loop = function loop(v) {
  		if (typeof v === 'boolean') {
  			this.media.loop = v;
  		}
  		return this.media.loop;
  	};

  	/*A Boolean attribute which indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced. Its default value is false, meaning that the audio will be played when the video is played*/


  	Media.prototype.muted = function muted(v) {
  		if (typeof v === 'boolean') {
  			this.media.muted = v;
  		}
  		return this.media.muted;
  	};

  	/* Mute the video */


  	Media.prototype.mute = function mute() {
  		this.muted(true);
  	};

  	/* UnMute the video */


  	Media.prototype.unmute = function unmute() {
  		this.muted(false);
  	};

  	/* Toggle the muted stance of the video */


  	Media.prototype.toggleMute = function toggleMute() {
  		return this.muted(!this.muted());
  	};

  	/* Returns A TimeRanges object indicating all the ranges of the video that have been played.*/


  	Media.prototype.played = function played() {
  		return this.media.played;
  	};

  	/*
   This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:
   	none: indicates that the video should not be preloaded.
   	metadata: indicates that only video metadata (e.g. length) is fetched.
   	auto: indicates that the whole video file could be downloaded, even if the user is not expected to use it.
   the empty string: synonym of the auto value.
   */


  	Media.prototype.preload = function preload(v) {
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
  	};

  	/* Gives or returns the address of an image file that the user agent can show while no video data is available. The attribute, if present, must contain a valid non-empty URL potentially surrounded by spaces */


  	Media.prototype.poster = function poster(v) {
  		if (v !== undefined) {
  			this.media.poster = v;
  		}
  		return this.media.poster;
  	};

  	/* The src property sets or returns the current source of the audio/video, The source is the actual location (URL) of the audio/video file */


  	Media.prototype.src = function src(v) {
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
  	};

  	/*** Global Events */

  	/* Starts playing the audio/video */


  	Media.prototype.play = function play() {
  		this.media.play();
  	};

  	/* Pauses the currently playing audio/video */


  	Media.prototype.pause = function pause() {
  		this.media.pause();
  	};

  	/* Return the currently playing status of audio/video */


  	Media.prototype.paused = function paused() {
  		return this.media.paused;
  	};

  	/* Return the currently playing status of audio/video */


  	Media.prototype.playing = function playing() {
  		return this.media.paused;
  	};

  	/* Toggle play/pause for the audio/video */


  	Media.prototype.togglePlay = function togglePlay() {
  		this.media.paused ? this.play() : this.pause();
  	};

  	Media.prototype.currentTime = function currentTime(v) {
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
  	};

  	Media.prototype.seek = function seek(v) {
  		return this.currentTime(v);
  	};

  	/**
    * [Re-loads the audio/video element, update the audio/video element after changing the source or other settings]
    * @return {[type]} [description]
    */


  	Media.prototype.load = function load(v) {
  		if (v !== undefined) {
  			this.src(v);
  		}
  		this.media.load();
  	};

  	Media.prototype.duration = function duration() {
  		return this.media.duration;
  	};

  	Media.prototype.volume = function volume(v) {
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
  	};

  	return Media;
  }(Fullscreen);

  var containerBounds = function () {
  	var scale = 0;
  	var bounds = function bounds(el, updateScale) {
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
  }();

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

  var isAvailable = function isAvailable() {
  	return !(typeof _doc[hidden] === "undefined");
  };

  function pageVisibility(_media) {
  	var _this5 = this;

  	var settings = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  	var _available = isAvailable();
  	if (_available) {
  		(function () {
  			var _enabled = false;
  			var _playing = false;
  			var paused = false;
  			var setFlagPlaying = function setFlagPlaying() {
  				_playing = true;
  			};
  			var events = {
  				visible: function visible() {},
  				hidden: function hidden() {}
  			};
  			var destroyVisibility = function destroyVisibility() {
  				events = {
  					visible: function visible() {},
  					hidden: function hidden() {}
  				};
  				_enabled = false;
  				_playing = false;
  				_doc.removeEventListener(visibilityChange, handleVisibilityChange, false);
  				_media.removeEventListener('playing', setFlagPlaying);
  			};
  			var handleVisibilityChange = function handleVisibilityChange() {
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
  			var initVisibility = function initVisibility(settings) {
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

  			_this5.init = initVisibility;
  			_this5.destroy = destroyVisibility;
  			_this5.on = function (event, fn) {
  				if (event in events) events[event] = fn;
  			};
  			_this5.enabled = function (v) {
  				if (typeof v === 'boolean') _enabled = v;
  				return _enabled;
  			};
  		})();
  	};
  };

  var _doc$1 = document || {};
  var externalControls = function externalControls(el) {
  	var _enabled = true;
  	var _seek = true;
  	var _tId = null;
  	var media = el;
  	var keydown = function keydown(e) {
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
  				var v = media.volume;
  				v += .1;
  				if (v > 1) v = 1;
  				media.volume = v;
  				return;
  			}

  			if (e.keyCode == 40) {
  				//down
  				var _v = media.volume;
  				_v -= .1;
  				if (_v < 0) _v = 0;
  				media.volume = _v;
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

  	var keyup = function keyup(e) {
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
  var _ajax = function () {

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
  }();

  var fn_contextmenu$1 = function fn_contextmenu$1(e) {
  	e.stopPropagation();
  	e.preventDefault();
  	return false;
  };

  var defaults$4 = {
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

  var Player = function (_Media) {
  	inherits(Player, _Media);

  	function Player(settings, _events) {
  		classCallCheck(this, Player);

  		var el = settings.video;

  		var _this6 = possibleConstructorReturn(this, _Media.call(this, el));

  		if (el == null) return possibleConstructorReturn(_this6);
  		_this6.device = device;
  		_this6.__settings = {};
  		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
  		_this6.wrapper = dom.wrap(_this6.media, dom.createElement('div', {
  			class: 'kmlPlayer'
  		}));
  		dom.triggerWebkitHardwareAcceleration(_this6.wrapper);

  		//initSettings
  		_this6.settings(deepmerge(defaults$4, settings));

  		//initPageVisibility
  		_this6.pageVisibility = new pageVisibility(el);

  		//initexternalControls
  		_this6.externalControls = new externalControls(el);

  		//initCallbackEvents
  		for (var evt in _events) {
  			_this6.on(evt, _events[evt], _this6);
  		}

  		_this6.on('loadedmetadata', function () {
  			if (_this6.media.width != _this6.media.videoWidth || _this6.media.height != _this6.media.videoHeight) {
  				_this6.videoWidth();
  				_this6.videoHeight();
  				_this6.emit('resize');
  			}
  		});
  		return _this6;
  	}

  	Player.prototype.settings = function settings(_settings) {
  		if (_settings == null) return this.__settings;
  		this.__settings = deepmerge(this.__settings, _settings);
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
  	};

  	Player.prototype.contextMenu = function contextMenu(v) {
  		if (typeof v === 'boolean') {
  			v ? this.media.removeEventListener('contextmenu', fn_contextmenu$1) : this.media.addEventListener('contextmenu', fn_contextmenu$1);
  		}
  	};

  	Player.prototype.ajax = function ajax(options) {
  		return _ajax(options);
  	};

  	Player.prototype.videoWidth = function videoWidth(v) {
  		if (this.media.videoWidth) {
  			this.media.width = this.media.videoWidth;
  			return this.media.videoWidth;
  		}
  		if (!isNaN(v)) {
  			v = parseFloat(v);
  			this.media.width = v;
  		}
  		return this.media.width;
  	};

  	Player.prototype.videoHeight = function videoHeight(v) {
  		if (this.media.videoHeight) {
  			this.media.height = this.media.videoHeight;
  			return this.media.videoHeight;
  		}
  		if (!isNaN(v)) {
  			v = parseFloat(v);
  			this.media.height = v;
  		}
  		return this.media.height;
  	};

  	Player.prototype.scale = function scale() {
  		return this.videoWidth() / this.videoHeight();
  	};

  	Player.prototype.bounds = function bounds(v) {
  		var data = containerBounds(this.media);
  		if (data[v] !== null) return data[v];
  		return data;
  	};

  	Player.prototype.width = function width() {
  		return this.bounds('width');
  	};

  	Player.prototype.height = function height() {
  		return this.bounds('height');
  	};

  	Player.prototype.offsetX = function offsetX() {
  		return this.bounds('offsetX');
  	};

  	Player.prototype.offsetY = function offsetY() {
  		return this.bounds('offsetY');
  	};

  	Player.prototype.wrapperHeight = function wrapperHeight() {
  		return this.media.offsetHeight;
  	};

  	Player.prototype.wrapperWidth = function wrapperWidth() {
  		return this.media.offsetWidth;
  	};

  	Player.prototype.wrapperScale = function wrapperScale() {
  		return this.media.offsetWidth / this.media.offsetHeight;
  	};

  	Player.prototype.addClass = function addClass(v, el) {
  		if (el != null) {
  			dom.addClass(v, el);
  			return;
  		}
  		dom.addClass(this.wrapper, v);
  	};

  	Player.prototype.removeClass = function removeClass(v, el) {
  		if (el != null) {
  			dom.removeClass(v, el);
  			return;
  		}
  		if (v !== 'kmlPlayer') {
  			dom.removeClass(this.wrapper, v);
  		}
  	};

  	Player.prototype.toggleClass = function toggleClass(v, el) {
  		if (el != null) {
  			dom.toggleClass(v, el);
  			return;
  		}
  		if (v !== 'kmlPlayer') {
  			dom.toggleClass(this.wrapper, v);
  		}
  	};

  	return Player;
  }(Media);

  ;

  var videoContainer = function (_Popup) {
  	inherits(videoContainer, _Popup);

  	function videoContainer(el, opts, ctx, parentPlayer) {
  		classCallCheck(this, videoContainer);

  		var _this7 = possibleConstructorReturn(this, _Popup.call(this, el, opts, ctx, parentPlayer));

  		var domVideo = document.createElement('video');
  		_this7.body.appendChild(domVideo);
  		_this7.player = new Player({ video: domVideo });
  		_this7.player.container;
  		var paused = false;
  		_this7.on('beforeHide', function () {
  			paused = _this7.player.paused();
  			_this7.player.pause();
  		});
  		_this7.on('show', function () {
  			if (!paused) {
  				_this7.player.play();
  			}
  		});
  		_this7.on('ended', function () {
  			if (isFunction(opts.onEnded)) opts.onEnded();
  		});
  		opts.sizeRatio = opts.sizeRatio || 80;
  		_this7.scaleSize = function (s) {
  			opts.sizeRatio = s;
  			this.emit('resize');
  		};
  		_this7.player.on('ended', function () {
  			_this7.emit('ended');
  		});
  		_this7.on('resize', function () {
  			var y = 0;
  			var x = 0;
  			var w = parentPlayer.width();
  			var h = parentPlayer.height();
  			var r = _this7.player.scale();
  			var fw = w;var fh = h;
  			var ww = w;var hh = h;
  			var headerHeight = 10;
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
  			_this7._title.parentNode.style.height = headerHeight + '%';
  			_this7.config({
  				x: x / w * ww + '%',
  				y: 5 + y / h * hh + '%',
  				width: fw + "%",
  				height: fh + "%"
  			});
  			_this7.autoLineHeight();
  		});

  		parentPlayer.on('loadedmetadata', function () {
  			_this7.emit('resize');
  		});
  		_this7.player.on('loadedmetadata', function () {
  			_this7.emit('resize');
  		});
  		_this7.player.load(opts.url);
  		return _this7;
  	}

  	return videoContainer;
  }(Popup);

  var defaults$1 = {
  	backgroundColor: '',
  	onHide: null,
  	onShow: null,
  	externalControls: true,
  	visible: false,
  	pause: true
  };

  var Containers = function () {
  	function Containers(ctx) {
  		var _this8 = this;

  		classCallCheck(this, Containers);

  		this.wrapper = dom.createElement('div', {
  			class: 'kmlContainers'
  		});
  		this._els = [];
  		var ac = new adaptiveSizePos({}, ctx);
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
  			var no = 0;
  			for (var k in this._els) {
  				if (this._els[k].visible()) {
  					no += 1;
  				}
  			}
  			this.enabled(no);
  		};

  		ctx.wrapper.appendChild(this.wrapper);

  		var currentVisibles = [];
  		this.hide = function (current) {
  			for (var k in this._els) {
  				var currentContainer = this._els[k];
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

  		this.add = function (opts) {
  			var el = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  			var type = arguments[2];

  			var cls = 'Container';
  			if (type != 'container') cls = 'Popup';
  			var settings = deepmerge(defaults$1, opts);
  			var containerHolder = dom.createElement('div');
  			ctx.addClass(containerHolder, 'kml' + cls + ' hidden');
  			var kmlContainerBody = dom.createElement('div');
  			if (el) {
  				if (!el.nodeType) {
  					el = kmlContainerBody;
  				}
  			} else {
  				el = kmlContainerBody;
  			}
  			dom.addClass(el, 'body');

  			containerHolder.appendChild(el);
  			var container = null;
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

  		this.remove = function (container) {
  			for (var i = 0, n = _this8._els.length; i < n; i += 1) {
  				var c = _this8._els[i];
  				if (c.body === container) {
  					_this8._els.splice(i, 1);
  					if (_this8._els.length == 0) _this8.enabled(false);
  					break;
  				}
  			}
  		};
  	}

  	Containers.prototype.els = function els(id) {
  		return this._els[id] || this._els;
  	};

  	return Containers;
  }();

  var fn_contextmenu = function fn_contextmenu(e) {
  	e.stopPropagation();
  	e.preventDefault();
  	return false;
  };

  var defaults = {
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

  var kmlPlayer = function (_Media2) {
  	inherits(kmlPlayer, _Media2);

  	function kmlPlayer(settings, _events, app) {
  		classCallCheck(this, kmlPlayer);

  		var el = settings.video;

  		var _this9 = possibleConstructorReturn(this, _Media2.call(this, el));

  		_this9.iframe = inIframe();
  		if (el == null) return possibleConstructorReturn(_this9);
  		_this9._bounds = {};
  		_this9.device = device;
  		_this9.__settings = deepmerge(defaults, settings);
  		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
  		_this9.wrapper = dom.wrap(_this9.media, dom.createElement('div', {
  			class: 'kmlPlayer'
  		}));
  		dom.triggerWebkitHardwareAcceleration(_this9.wrapper);
  		if (_this9.inIframe) {
  			dom.addClass(_this9.wrapper, "inFrame");
  		}
  		//initSettings
  		for (var k in _this9.__settings) {
  			if (_this9[k]) {
  				if (k === 'autoplay' && _this9.__settings[k] && !_this9.inIframe) {
  					_this9.play();
  					continue;
  				}
  				_this9[k](_this9.__settings[k]);
  			}
  			if (k === 'controls' && _this9.__settings[k] === "native") {
  				_this9.nativeControls(true);
  			}
  		}

  		//initPageVisibility
  		_this9.pageVisibility = new pageVisibility(el);

  		//initexternalControls
  		_this9.externalControls = new externalControls(el);

  		//initContainers
  		_this9.containers = new Containers(_this9);

  		_this9.container = function (stg, el) {
  			return this.containers.add(stg, el, 'container');
  		};

  		_this9.videoContainer = function (stg) {
  			return this.containers.add(stg, null, 'video');
  		};

  		_this9.popupContainer = function (stg) {
  			return this.containers.add(stg, null, 'popup');
  		};

  		//autoFONT
  		if (typeof _this9.__settings.font === "boolean" && _this9.__settings.font) _this9.__settings.font = defaults.font;
  		_this9.autoFont = new autoFont(_this9.wrapper, _this9.__settings.font, _this9);
  		if (_this9.__settings.font) _this9.autoFont.enabled(true);

  		//initCallbackEvents
  		for (var evt in _events) {
  			_this9.on(evt, _events[evt], _this9);
  		}

  		if (typeof app === 'function') {
  			app.bind(_this9);
  		}

  		_this9.on('loadedmetadata', function () {
  			if (_this9.media.width != _this9.media.videoWidth || _this9.media.height != _this9.media.videoHeight) {
  				_this9.videoWidth();
  				_this9.videoHeight();
  				_this9.emit('resize');
  			}
  			if (!_this9._app) {
  				app.bind(_this9)();
  				_this9._app = true;
  			}
  		});

  		el.addEventListener('dbltap', function () {
  			_this9.toggleFullScreen();
  		});

  		var videoSizeCache = {
  			w: _this9.width(),
  			x: _this9.offsetX(),
  			y: _this9.offsetY(),
  			h: _this9.height()
  		};
  		var checkVideoResize = function checkVideoResize() {
  			_this9._bounds = containerBounds(_this9.media);
  			var w = _this9.width();
  			var h = _this9.width();
  			var x = _this9.offsetX();
  			var y = _this9.offsetY();
  			if (videoSizeCache.w != w || videoSizeCache.h != h || videoSizeCache.x != x || videoSizeCache.y != y) {
  				videoSizeCache.w = w;
  				videoSizeCache.h = h;
  				videoSizeCache.x = x;
  				videoSizeCache.y = y;
  				_this9.emit('resize');
  			}
  			window.requestAnimationFrame(checkVideoResize);
  		};

  		checkVideoResize();
  		return _this9;
  	}

  	kmlPlayer.prototype.contextMenu = function contextMenu(v) {
  		if (typeof v === 'boolean') {
  			v ? this.media.removeEventListener('contextmenu', fn_contextmenu) : this.media.addEventListener('contextmenu', fn_contextmenu);
  		}
  	};

  	kmlPlayer.prototype.ajax = function ajax(options) {
  		return _ajax(options);
  	};

  	kmlPlayer.prototype.videoWidth = function videoWidth(v) {
  		if (this.media.videoWidth) {
  			this.media.width = this.media.videoWidth;
  			return this.media.videoWidth;
  		}
  		if (!isNaN(v)) {
  			v = parseFloat(v);
  			this.media.width = v;
  		}
  		return this.media.width;
  	};

  	kmlPlayer.prototype.videoHeight = function videoHeight(v) {
  		if (this.media.videoHeight) {
  			this.media.height = this.media.videoHeight;
  			return this.media.videoHeight;
  		}
  		if (!isNaN(v)) {
  			v = parseFloat(v);
  			this.media.height = v;
  		}
  		return this.media.height;
  	};

  	kmlPlayer.prototype.scale = function scale() {
  		return this.videoWidth() / this.videoHeight();
  	};

  	kmlPlayer.prototype.bounds = function bounds(v) {
  		if (this._bounds[v] !== null) return this._bounds[v];
  		return this._bounds;
  	};

  	kmlPlayer.prototype.width = function width() {
  		return this.bounds('width');
  	};

  	kmlPlayer.prototype.height = function height() {
  		return this.bounds('height');
  	};

  	kmlPlayer.prototype.offsetX = function offsetX() {
  		return this.bounds('offsetX');
  	};

  	kmlPlayer.prototype.offsetY = function offsetY() {
  		return this.bounds('offsetY');
  	};

  	kmlPlayer.prototype.wrapperHeight = function wrapperHeight() {
  		return this.media.offsetHeight;
  	};

  	kmlPlayer.prototype.wrapperWidth = function wrapperWidth() {
  		return this.media.offsetWidth;
  	};

  	kmlPlayer.prototype.wrapperScale = function wrapperScale() {
  		return this.media.offsetWidth / this.media.offsetHeight;
  	};

  	kmlPlayer.prototype.addClass = function addClass(v, el) {
  		if (el != null) {
  			dom.addClass(v, el);
  			return;
  		}
  		dom.addClass(this.wrapper, v);
  	};

  	kmlPlayer.prototype.removeClass = function removeClass(v, el) {
  		if (el != null) {
  			dom.removeClass(v, el);
  			return;
  		}
  		if (v !== 'kmlPlayer') {
  			dom.removeClass(this.wrapper, v);
  		}
  	};

  	kmlPlayer.prototype.toggleClass = function toggleClass(v, el) {
  		if (el != null) {
  			dom.toggleClass(v, el);
  			return;
  		}
  		if (v !== 'kmlPlayer') {
  			dom.toggleClass(this.wrapper, v);
  		}
  	};

  	return kmlPlayer;
  }(Media);

  ;

  //disable on production
  if (device.isTouch) {
  	window.onerror = function (message, scriptUrl, line, column) {
  		console.log(line, column, message);
  		alert(line + ":" + column + "-" + message);
  	};
  }

  return kmlPlayer;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL2J1aWxkL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG5cbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgL2lQKGFkfGhvbmV8b2QpLipPUyA2Ly50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSkgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICAgIH0sIHRpbWVUb0NhbGwpO1xuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG5cbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgfTtcbn0pKCk7XG5cbihmdW5jdGlvbiAoZG9jLCB3aW4pIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmICh0eXBlb2YgZG9jLmNyZWF0ZUV2ZW50ICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gZmFsc2U7IC8vIG5vIHRhcCBldmVudHMgaGVyZVxuICAvLyBoZWxwZXJzXG4gIHZhciB1c2VKcXVlcnkgPSB0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJyxcbiAgICAgIG1zRXZlbnRUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgbG8gPSB0eXBlLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIG1zID0gJ01TJyArIHR5cGU7XG4gICAgcmV0dXJuIG5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkID8gbXMgOiBsbztcbiAgfSxcblxuICAvLyB3YXMgaW5pdGlhbGx5IHRyaWdnZXJlZCBhIFwidG91Y2hzdGFydFwiIGV2ZW50P1xuICB3YXNUb3VjaCA9IGZhbHNlLFxuICAgICAgdG91Y2hldmVudHMgPSB7XG4gICAgdG91Y2hzdGFydDogbXNFdmVudFR5cGUoJ1BvaW50ZXJEb3duJykgKyAnIHRvdWNoc3RhcnQnLFxuICAgIHRvdWNoZW5kOiBtc0V2ZW50VHlwZSgnUG9pbnRlclVwJykgKyAnIHRvdWNoZW5kJyxcbiAgICB0b3VjaG1vdmU6IG1zRXZlbnRUeXBlKCdQb2ludGVyTW92ZScpICsgJyB0b3VjaG1vdmUnXG4gIH0sXG4gICAgICBzZXRMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbG0sIGV2ZW50cywgY2FsbGJhY2spIHtcbiAgICB2YXIgZXZlbnRzQXJyYXkgPSBldmVudHMuc3BsaXQoJyAnKSxcbiAgICAgICAgaSA9IGV2ZW50c0FycmF5Lmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGVsbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c0FycmF5W2ldLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH1cbiAgfSxcbiAgICAgIGdldFBvaW50ZXJFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHJldHVybiBldmVudC50YXJnZXRUb3VjaGVzID8gZXZlbnQudGFyZ2V0VG91Y2hlc1swXSA6IGV2ZW50O1xuICB9LFxuICAgICAgZ2V0VGltZXN0YW1wID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfSxcbiAgICAgIHNlbmRFdmVudCA9IGZ1bmN0aW9uIChlbG0sIGV2ZW50TmFtZSwgb3JpZ2luYWxFdmVudCwgZGF0YSkge1xuICAgIHZhciBjdXN0b21FdmVudCA9IGRvYy5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBjdXN0b21FdmVudC5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDtcbiAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICBkYXRhLnggPSBjdXJyWDtcbiAgICBkYXRhLnkgPSBjdXJyWTtcbiAgICBkYXRhLmRpc3RhbmNlID0gZGF0YS5kaXN0YW5jZTtcblxuICAgIC8vIGpxdWVyeVxuICAgIGlmICh1c2VKcXVlcnkpIHtcbiAgICAgIGN1c3RvbUV2ZW50ID0galF1ZXJ5LkV2ZW50KGV2ZW50TmFtZSwgeyBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50IH0pO1xuICAgICAgalF1ZXJ5KGVsbSkudHJpZ2dlcihjdXN0b21FdmVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gYWRkRXZlbnRMaXN0ZW5lclxuICAgIGlmIChjdXN0b21FdmVudC5pbml0RXZlbnQpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICAgIGN1c3RvbUV2ZW50W2tleV0gPSBkYXRhW2tleV07XG4gICAgICB9XG4gICAgICBjdXN0b21FdmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCB0cnVlKTtcbiAgICAgIGVsbS5kaXNwYXRjaEV2ZW50KGN1c3RvbUV2ZW50KTtcbiAgICB9XG5cbiAgICAvLyBkZXRlY3QgYWxsIHRoZSBpbmxpbmUgZXZlbnRzXG4gICAgLy8gYWxzbyBvbiB0aGUgcGFyZW50IG5vZGVzXG4gICAgd2hpbGUgKGVsbSkge1xuICAgICAgLy8gaW5saW5lXG4gICAgICBpZiAoZWxtWydvbicgKyBldmVudE5hbWVdKSBlbG1bJ29uJyArIGV2ZW50TmFtZV0oY3VzdG9tRXZlbnQpO1xuICAgICAgZWxtID0gZWxtLnBhcmVudE5vZGU7XG4gICAgfVxuICB9LFxuICAgICAgb25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAvKipcbiAgICAgKiBTa2lwIGFsbCB0aGUgbW91c2UgZXZlbnRzXG4gICAgICogZXZlbnRzIG9yZGVyOlxuICAgICAqIENocm9tZTpcbiAgICAgKiAgIHRvdWNoc3RhcnRcbiAgICAgKiAgIHRvdWNobW92ZVxuICAgICAqICAgdG91Y2hlbmRcbiAgICAgKiAgIG1vdXNlZG93blxuICAgICAqICAgbW91c2Vtb3ZlXG4gICAgICogICBtb3VzZXVwIDwtIHRoaXMgbXVzdCBjb21lIGFsd2F5cyBhZnRlciBhIFwidG91Y2hzdGFydFwiXG4gICAgICpcbiAgICAgKiBTYWZhcmlcbiAgICAgKiAgIHRvdWNoc3RhcnRcbiAgICAgKiAgIG1vdXNlZG93blxuICAgICAqICAgdG91Y2htb3ZlXG4gICAgICogICBtb3VzZW1vdmVcbiAgICAgKiAgIHRvdWNoZW5kXG4gICAgICogICBtb3VzZXVwIDwtIHRoaXMgbXVzdCBjb21lIGFsd2F5cyBhZnRlciBhIFwidG91Y2hzdGFydFwiXG4gICAgICovXG5cbiAgICAvLyBpdCBsb29rcyBsaWtlIGl0IHdhcyBhIHRvdWNoIGV2ZW50IVxuICAgIGlmIChlLnR5cGUgIT09ICdtb3VzZWRvd24nKSB3YXNUb3VjaCA9IHRydWU7XG5cbiAgICAvLyBza2lwIHRoaXMgZXZlbnQgd2UgZG9uJ3QgbmVlZCB0byB0cmFjayBpdCBub3dcbiAgICBpZiAoZS50eXBlID09PSAnbW91c2Vkb3duJyAmJiB3YXNUb3VjaCkgcmV0dXJuO1xuXG4gICAgdmFyIHBvaW50ZXIgPSBnZXRQb2ludGVyRXZlbnQoZSk7XG5cbiAgICAvLyBjYWNoaW5nIHRoZSBjdXJyZW50IHhcbiAgICBjYWNoZWRYID0gY3VyclggPSBwb2ludGVyLnBhZ2VYO1xuICAgIC8vIGNhY2hpbmcgdGhlIGN1cnJlbnQgeVxuICAgIGNhY2hlZFkgPSBjdXJyWSA9IHBvaW50ZXIucGFnZVk7XG5cbiAgICBsb25ndGFwVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbmRFdmVudChlLnRhcmdldCwgJ2xvbmd0YXAnLCBlKTtcbiAgICAgIHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIH0sIGxvbmd0YXBUaHJlc2hvbGQpO1xuXG4gICAgLy8gd2Ugd2lsbCB1c2UgdGhlc2UgdmFyaWFibGVzIG9uIHRoZSB0b3VjaGVuZCBldmVudHNcbiAgICB0aW1lc3RhbXAgPSBnZXRUaW1lc3RhbXAoKTtcblxuICAgIHRhcE51bSsrO1xuICB9LFxuICAgICAgb25Ub3VjaEVuZCA9IGZ1bmN0aW9uIChlKSB7XG5cbiAgICAvLyBza2lwIHRoZSBtb3VzZSBldmVudHMgaWYgcHJldmlvdXNseSBhIHRvdWNoIGV2ZW50IHdhcyBkaXNwYXRjaGVkXG4gICAgLy8gYW5kIHJlc2V0IHRoZSB0b3VjaCBmbGFnXG4gICAgaWYgKGUudHlwZSA9PT0gJ21vdXNldXAnICYmIHdhc1RvdWNoKSB7XG4gICAgICB3YXNUb3VjaCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBldmVudHNBcnIgPSBbXSxcbiAgICAgICAgbm93ID0gZ2V0VGltZXN0YW1wKCksXG4gICAgICAgIGRlbHRhWSA9IGNhY2hlZFkgLSBjdXJyWSxcbiAgICAgICAgZGVsdGFYID0gY2FjaGVkWCAtIGN1cnJYO1xuXG4gICAgLy8gY2xlYXIgdGhlIHByZXZpb3VzIHRpbWVyIGlmIGl0IHdhcyBzZXRcbiAgICBjbGVhclRpbWVvdXQoZGJsVGFwVGltZXIpO1xuICAgIC8vIGtpbGwgdGhlIGxvbmcgdGFwIHRpbWVyXG4gICAgY2xlYXJUaW1lb3V0KGxvbmd0YXBUaW1lcik7XG5cbiAgICBpZiAoZGVsdGFYIDw9IC1zd2lwZVRocmVzaG9sZCkgZXZlbnRzQXJyLnB1c2goJ3N3aXBlcmlnaHQnKTtcblxuICAgIGlmIChkZWx0YVggPj0gc3dpcGVUaHJlc2hvbGQpIGV2ZW50c0Fyci5wdXNoKCdzd2lwZWxlZnQnKTtcblxuICAgIGlmIChkZWx0YVkgPD0gLXN3aXBlVGhyZXNob2xkKSBldmVudHNBcnIucHVzaCgnc3dpcGVkb3duJyk7XG5cbiAgICBpZiAoZGVsdGFZID49IHN3aXBlVGhyZXNob2xkKSBldmVudHNBcnIucHVzaCgnc3dpcGV1cCcpO1xuXG4gICAgaWYgKGV2ZW50c0Fyci5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSBldmVudHNBcnJbaV07XG4gICAgICAgIHNlbmRFdmVudChlLnRhcmdldCwgZXZlbnROYW1lLCBlLCB7XG4gICAgICAgICAgZGlzdGFuY2U6IHtcbiAgICAgICAgICAgIHg6IE1hdGguYWJzKGRlbHRhWCksXG4gICAgICAgICAgICB5OiBNYXRoLmFicyhkZWx0YVkpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIHJlc2V0IHRoZSB0YXAgY291bnRlclxuICAgICAgdGFwTnVtID0gMDtcbiAgICB9IGVsc2Uge1xuXG4gICAgICBpZiAoY2FjaGVkWCA+PSBjdXJyWCAtIHRhcFByZWNpc2lvbiAmJiBjYWNoZWRYIDw9IGN1cnJYICsgdGFwUHJlY2lzaW9uICYmIGNhY2hlZFkgPj0gY3VyclkgLSB0YXBQcmVjaXNpb24gJiYgY2FjaGVkWSA8PSBjdXJyWSArIHRhcFByZWNpc2lvbikge1xuICAgICAgICBpZiAodGltZXN0YW1wICsgdGFwVGhyZXNob2xkIC0gbm93ID49IDApIHtcbiAgICAgICAgICAvLyBIZXJlIHlvdSBnZXQgdGhlIFRhcCBldmVudFxuICAgICAgICAgIHNlbmRFdmVudChlLnRhcmdldCwgdGFwTnVtID49IDIgJiYgdGFyZ2V0ID09PSBlLnRhcmdldCA/ICdkYmx0YXAnIDogJ3RhcCcsIGUpO1xuICAgICAgICAgIHRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHJlc2V0IHRoZSB0YXAgY291bnRlclxuICAgICAgZGJsVGFwVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGFwTnVtID0gMDtcbiAgICAgIH0sIGRibHRhcFRocmVzaG9sZCk7XG4gICAgfVxuICB9LFxuICAgICAgb25Ub3VjaE1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgIC8vIHNraXAgdGhlIG1vdXNlIG1vdmUgZXZlbnRzIGlmIHRoZSB0b3VjaCBldmVudHMgd2VyZSBwcmV2aW91c2x5IGRldGVjdGVkXG4gICAgaWYgKGUudHlwZSA9PT0gJ21vdXNlbW92ZScgJiYgd2FzVG91Y2gpIHJldHVybjtcblxuICAgIHZhciBwb2ludGVyID0gZ2V0UG9pbnRlckV2ZW50KGUpO1xuICAgIGN1cnJYID0gcG9pbnRlci5wYWdlWDtcbiAgICBjdXJyWSA9IHBvaW50ZXIucGFnZVk7XG4gIH0sXG4gICAgICBzd2lwZVRocmVzaG9sZCA9IHdpbi5TV0lQRV9USFJFU0hPTEQgfHwgMTAwLFxuICAgICAgdGFwVGhyZXNob2xkID0gd2luLlRBUF9USFJFU0hPTEQgfHwgMTUwLFxuICAgICAgLy8gcmFuZ2Ugb2YgdGltZSB3aGVyZSBhIHRhcCBldmVudCBjb3VsZCBiZSBkZXRlY3RlZFxuICBkYmx0YXBUaHJlc2hvbGQgPSB3aW4uREJMX1RBUF9USFJFU0hPTEQgfHwgMjAwLFxuICAgICAgLy8gZGVsYXkgbmVlZGVkIHRvIGRldGVjdCBhIGRvdWJsZSB0YXBcbiAgbG9uZ3RhcFRocmVzaG9sZCA9IHdpbi5MT05HX1RBUF9USFJFU0hPTEQgfHwgMTAwMCxcbiAgICAgIC8vIGRlbGF5IG5lZWRlZCB0byBkZXRlY3QgYSBsb25nIHRhcFxuICB0YXBQcmVjaXNpb24gPSB3aW4uVEFQX1BSRUNJU0lPTiAvIDIgfHwgNjAgLyAyLFxuICAgICAgLy8gdG91Y2ggZXZlbnRzIGJvdW5kYXJpZXMgKCA2MHB4IGJ5IGRlZmF1bHQgKVxuICBqdXN0VG91Y2hFdmVudHMgPSB3aW4uSlVTVF9PTl9UT1VDSF9ERVZJQ0VTLFxuICAgICAgdGFwTnVtID0gMCxcbiAgICAgIGN1cnJYLFxuICAgICAgY3VyclksXG4gICAgICBjYWNoZWRYLFxuICAgICAgY2FjaGVkWSxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICAgIHRhcmdldCxcbiAgICAgIGRibFRhcFRpbWVyLFxuICAgICAgbG9uZ3RhcFRpbWVyO1xuXG4gIC8vc2V0dGluZyB0aGUgZXZlbnRzIGxpc3RlbmVyc1xuICAvLyB3ZSBuZWVkIHRvIGRlYm91bmNlIHRoZSBjYWxsYmFja3MgYmVjYXVzZSBzb21lIGRldmljZXMgbXVsdGlwbGUgZXZlbnRzIGFyZSB0cmlnZ2VyZWQgYXQgc2FtZSB0aW1lXG4gIHNldExpc3RlbmVyKGRvYywgdG91Y2hldmVudHMudG91Y2hzdGFydCArIChqdXN0VG91Y2hFdmVudHMgPyAnJyA6ICcgbW91c2Vkb3duJyksIG9uVG91Y2hTdGFydCk7XG4gIHNldExpc3RlbmVyKGRvYywgdG91Y2hldmVudHMudG91Y2hlbmQgKyAoanVzdFRvdWNoRXZlbnRzID8gJycgOiAnIG1vdXNldXAnKSwgb25Ub3VjaEVuZCk7XG4gIHNldExpc3RlbmVyKGRvYywgdG91Y2hldmVudHMudG91Y2htb3ZlICsgKGp1c3RUb3VjaEV2ZW50cyA/ICcnIDogJyBtb3VzZW1vdmUnKSwgb25Ub3VjaE1vdmUpO1xufSkoZG9jdW1lbnQsIHdpbmRvdyk7XG5cbmZ1bmN0aW9uIGluSWZyYW1lKCkge1xuXHR0cnkge1xuXHRcdGxldCBpcyA9IHdpbmRvdy5zZWxmICE9PSB3aW5kb3cudG9wO1xuXHRcdGlmIChpcykge1xuXHRcdFx0dmFyIGFyckZyYW1lcyA9IHBhcmVudC5kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIklGUkFNRVwiKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRnJhbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGxldCBmcmFtZSA9IGFyckZyYW1lc1tpXTtcblx0XHRcdFx0aWYgKGZyYW1lLmNvbnRlbnRXaW5kb3cgPT09IHdpbmRvdykge1xuXHRcdFx0XHRcdGlzID0gZnJhbWU7XG5cdFx0XHRcdFx0ZnJhbWUuc2V0QXR0cmlidXRlKCdhbGxvd2Z1bGxzY3JlZW4nLCAndHJ1ZScpO1xuXHRcdFx0XHRcdGZyYW1lLnNldEF0dHJpYnV0ZSgnbW96YWxsb3dmdWxsc2NyZWVuJywgJ3RydWUnKTtcblx0XHRcdFx0XHRmcmFtZS5zZXRBdHRyaWJ1dGUoJ3dlYmtpdGFsbG93ZnVsbHNjcmVlbicsICd0cnVlJyk7XG5cdFx0XHRcdFx0ZnJhbWUuc2V0QXR0cmlidXRlKCdmcmFtZWJvcmRlcicsICcwJyk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBpcztcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59XG5cbnZhciBkZWVwbWVyZ2UgPSAoZnVuY3Rpb24gKCkge1xuXHRsZXQgZGVlcG1lcmdlID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjKSB7XG5cdFx0aWYgKHNyYykge1xuXHRcdFx0dmFyIGFycmF5ID0gQXJyYXkuaXNBcnJheShzcmMpO1xuXHRcdFx0dmFyIGRzdCA9IGFycmF5ICYmIFtdIHx8IHt9O1xuXG5cdFx0XHRpZiAoYXJyYXkpIHtcblx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0IHx8IFtdO1xuXHRcdFx0XHRkc3QgPSBkc3QuY29uY2F0KHRhcmdldCk7XG5cdFx0XHRcdHNyYy5mb3JFYWNoKGZ1bmN0aW9uIChlLCBpKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBkc3RbaV0gPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRkc3RbaV0gPSBlO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRkc3RbaV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2ldLCBlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKHRhcmdldC5pbmRleE9mKGUpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRkc3QucHVzaChlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0XHRkc3Rba2V5XSA9IHRhcmdldFtrZXldO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBzcmNba2V5XSAhPT0gJ29iamVjdCcgfHwgIXNyY1trZXldKSB7XG5cdFx0XHRcdFx0XHRkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoIXRhcmdldFtrZXldKSB7XG5cdFx0XHRcdFx0XHRcdGRzdFtrZXldID0gc3JjW2tleV07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRkc3Rba2V5XSA9IGRlZXBtZXJnZSh0YXJnZXRba2V5XSwgc3JjW2tleV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZHN0O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0IHx8IFtdO1xuXHRcdH1cblx0fTtcblx0cmV0dXJuIGRlZXBtZXJnZTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbn1cblxuZnVuY3Rpb24gcHJvY2VudEZyb21TdHJpbmcodikge1xuICBpZiAodiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgbGV0IHQgPSBmYWxzZTtcbiAgaWYgKHYuaW5kZXhPZikge1xuICAgIGlmICh2LmluZGV4T2YoJyUnKSA+IC0xKSB7XG4gICAgICB0ID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHQ7XG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBmdW5jdGlvblxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nIHx8IGZhbHNlOyAvLyBhdm9pZCBJRSBwcm9ibGVtc1xufVxuXG5mdW5jdGlvbiBzY2FsZUZvbnQoZiwgd2lkdGgsIGVsKSB7XG4gIHZhciByID0gZmFsc2UsXG4gICAgICBsID0gZmFsc2U7XG4gIGlmIChmLnVuaXRzICE9ICdweCcpIGYudW5pdHMgPSAnZW0nO1xuICBpZiAoZi5taW4gIT09IGZhbHNlICYmIGYucmF0aW8gIT09IGZhbHNlKSB7XG4gICAgciA9IGYucmF0aW8gKiB3aWR0aCAvIDEwMDA7XG4gICAgaWYgKHIgPCBmLm1pbikgciA9IGYubWluO1xuICAgIGlmIChmLnVuaXRzID09ICdweCcpIHIgPSBNYXRoLmNlaWwocik7XG4gICAgaWYgKCFpc05hTihmLmxpbmVIZWlnaHQpICYmIGYubGluZUhlaWdodCkge1xuICAgICAgbCA9IHIgKiBmLmxpbmVIZWlnaHQ7XG4gICAgICBpZiAobCA8IDEpIGwgPSAxO1xuICAgICAgbCA9ICtsLnRvRml4ZWQoMykgKyBmLnVuaXRzO1xuICAgIH1cbiAgICByID0gK3IudG9GaXhlZCgzKSArIGYudW5pdHM7XG4gIH1cbiAgaWYgKGVsKSB7XG4gICAgaWYgKHIpIGVsLnN0eWxlLmZvbnRTaXplID0gcjtcbiAgICBpZiAobCkgZWwuc3R5bGUubGluZUhlaWdodCA9IGw7XG4gIH1cbiAgcmV0dXJuIHsgZm9udFNpemU6IHIsIGxpbmVIZWlnaHQ6IGwgfTtcbn07XG5cbi8qKlxuICogQG1vZHVsZSBkb21cbiAqIE1vZHVsZSBmb3IgZWFzaW5nIHRoZSBtYW5pcHVsYXRpb24gb2YgZG9tIGVsZW1lbnRzXG4gKi9cblxubGV0IGNsYXNzUmVnID0gZnVuY3Rpb24gKGMpIHtcblx0cmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxccyspXCIgKyBjICsgXCIoXFxcXHMrfCQpXCIpO1xufTtcblxubGV0IGhhc0NsYXNzO1xubGV0IGFkZENsYXNzO1xubGV0IHJlbW92ZUNsYXNzO1xubGV0IHRvZ2dsZUNsYXNzO1xuXG5pZiAoJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG5cdGhhc0NsYXNzID0gZnVuY3Rpb24gKGVsZW0sIGMpIHtcblx0XHRyZXR1cm4gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoYyk7XG5cdH07XG5cdGFkZENsYXNzID0gZnVuY3Rpb24gKGVsZW0sIGMpIHtcblx0XHRpZiAoYyAhPSBudWxsKSB7XG5cdFx0XHRjID0gYy5zcGxpdCgnICcpO1xuXHRcdFx0Zm9yICh2YXIgayBpbiBjKSBlbGVtLmNsYXNzTGlzdC5hZGQoY1trXSk7XG5cdFx0fVxuXHR9O1xuXHRyZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbGVtLCBjKSB7XG5cdFx0ZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuXHR9O1xufSBlbHNlIHtcblx0aGFzQ2xhc3MgPSBmdW5jdGlvbiAoZWxlbSwgYykge1xuXHRcdHJldHVybiBjbGFzc1JlZyhjKS50ZXN0KGVsZW0uY2xhc3NOYW1lKTtcblx0fTtcblx0YWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWxlbSwgYykge1xuXHRcdGlmICghaGFzQ2xhc3MoZWxlbSwgYykpIHtcblx0XHRcdGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUgKyAnICcgKyBjO1xuXHRcdH1cblx0fTtcblx0cmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWxlbSwgYykge1xuXHRcdGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUucmVwbGFjZShjbGFzc1JlZyhjKSwgJyAnKTtcblx0fTtcbn1cblxudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbiAoZWxlbSwgYykge1xuXHR2YXIgZm4gPSBoYXNDbGFzcyhlbGVtLCBjKSA/IHJlbW92ZUNsYXNzIDogYWRkQ2xhc3M7XG5cdGZuKGVsZW0sIGMpO1xufTtcblxubGV0IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSA9IGZ1bmN0aW9uIGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZShwcm9wTmFtZSkge1xuXHR2YXIgZG9tUHJlZml4ZXMgPSAnV2Via2l0IE1veiBtcyBPJy5zcGxpdCgnICcpLFxuXHQgICAgZWxTdHlsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZTtcblx0aWYgKGVsU3R5bGVbcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcm9wTmFtZTsgLy8gSXMgc3VwcG9ydGVkIHVucHJlZml4ZWRcblx0cHJvcE5hbWUgPSBwcm9wTmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BOYW1lLnN1YnN0cigxKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkb21QcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChlbFN0eWxlW2RvbVByZWZpeGVzW2ldICsgcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBkb21QcmVmaXhlc1tpXSArIHByb3BOYW1lOyAvLyBJcyBzdXBwb3J0ZWQgd2l0aCBwcmVmaXhcblx0XHR9XG5cdH1cbn07XG5cbnZhciBkb20gPSB7XG5cdHN0eWxlUHJlZml4OiB7XG5cdFx0dHJhbnNmb3JtOiBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUoJ3RyYW5zZm9ybScpLFxuXHRcdHBlcnNwZWN0aXZlOiBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUoJ3BlcnNwZWN0aXZlJyksXG5cdFx0YmFja2ZhY2VWaXNpYmlsaXR5OiBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUoJ2JhY2tmYWNlVmlzaWJpbGl0eScpXG5cdH0sXG5cdHRyaWdnZXJXZWJraXRIYXJkd2FyZUFjY2VsZXJhdGlvbjogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRpZiAodGhpcy5zdHlsZVByZWZpeC5iYWNrZmFjZVZpc2liaWxpdHkgJiYgdGhpcy5zdHlsZVByZWZpeC5wZXJzcGVjdGl2ZSkge1xuXHRcdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LnBlcnNwZWN0aXZlXSA9ICcxMDAwcHgnO1xuXHRcdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LmJhY2tmYWNlVmlzaWJpbGl0eV0gPSAnaGlkZGVuJztcblx0XHR9XG5cdH0sXG5cdHRyYW5zZm9ybTogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlKSB7XG5cdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LnRyYW5zZm9ybV0gPSB2YWx1ZTtcblx0fSxcblx0LyoqXG4gICogU2hvcnRlciBhbmQgZmFzdCB3YXkgdG8gc2VsZWN0IG11bHRpcGxlIG5vZGVzIGluIHRoZSBET01cbiAgKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gRE9NIHNlbGVjdG9yXG4gICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0cyBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZG9tIG5vZGVzIGZvdW5kXG4gICovXG5cdHNlbGVjdEFsbDogZnVuY3Rpb24gKHNlbGVjdG9yLCBjdHgpIHtcblx0XHRyZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdH0sXG5cdC8qKlxuICAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBhIHNpbmdsZSBub2RlIGluIHRoZSBET01cbiAgKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gdW5pcXVlIGRvbSBzZWxlY3RvclxuICAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY3R4IC0gRE9NIG5vZGUgd2hlcmUgdGhlIHRhcmdldCBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZG9tIG5vZGUgZm91bmRcbiAgKi9cblx0c2VsZWN0OiBmdW5jdGlvbiAoc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fSxcblx0aGFzQ2xhc3M6IGhhc0NsYXNzLFxuXHRhZGRDbGFzczogYWRkQ2xhc3MsXG5cdHJlbW92ZUNsYXNzOiByZW1vdmVDbGFzcyxcblx0dG9nZ2xlQ2xhc3M6IHRvZ2dsZUNsYXNzLFxuXHRhdXRvTGluZUhlaWdodDogZnVuY3Rpb24gKGVsKSB7XG5cdFx0bGV0IGwgPSBlbC5vZmZzZXRIZWlnaHQgKyBcInB4XCI7XG5cdFx0ZWwuc3R5bGUubGluZUhlaWdodCA9IGw7XG5cdFx0cmV0dXJuIGw7XG5cdH0sXG5cdGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uIChlbG0sIHByb3BzKSB7XG5cdFx0bGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbG0pO1xuXHRcdGZvciAobGV0IGsgaW4gcHJvcHMpIHtcblx0XHRcdGVsLnNldEF0dHJpYnV0ZShrLCBwcm9wc1trXSk7XG5cdFx0fVxuXHRcdHJldHVybiBlbDtcblx0fSxcblx0ZW1wdHlFbGVtZW50OiBmdW5jdGlvbiAoZWxtKSB7XG5cdFx0d2hpbGUgKGVsbS5maXJzdENoaWxkKSB7XG5cdFx0XHRlbG0ucmVtb3ZlQ2hpbGQoZWxtLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0fSxcblx0cmVwbGFjZUVsZW1lbnQ6IGZ1bmN0aW9uICh0YXJnZXQsIGVsbSkge1xuXHRcdHRhcmdldC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChlbG0sIHRhcmdldCk7XG5cdH0sXG5cdHJlbW92ZUVsZW1lbnQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0ZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuXHR9LFxuXHRpbnNlcnRBZnRlcjogZnVuY3Rpb24gKGVsLCByZWZlcmVuY2VOb2RlKSB7XG5cdFx0cmVmZXJlbmNlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZyk7XG5cdH0sXG5cdGluc2VydEJlZm9yZTogZnVuY3Rpb24gKGVsLCByZWZlcmVuY2VOb2RlKSB7XG5cdFx0cmVmZXJlbmNlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlTm9kZSk7XG5cdH0sXG5cdGdldFRleHRDb250ZW50OiBmdW5jdGlvbiAoZWwpIHtcblx0XHRyZXR1cm4gZWwudGV4dENvbnRlbnQgfHwgZWwuaW5uZXJUZXh0O1xuXHR9LFxuXHR3cmFwOiBmdW5jdGlvbiAoZWxlbWVudHMsIHdyYXBwZXIpIHtcblx0XHQvLyBDb252ZXJ0IGBlbGVtZW50c2AgdG8gYW4gYXJyYXksIGlmIG5lY2Vzc2FyeS5cblx0XHRpZiAoIWVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0ZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuXHRcdH1cblxuXHRcdC8vIExvb3BzIGJhY2t3YXJkcyB0byBwcmV2ZW50IGhhdmluZyB0byBjbG9uZSB0aGUgd3JhcHBlciBvbiB0aGVcblx0XHQvLyBmaXJzdCBlbGVtZW50IChzZWUgYGNoaWxkYCBiZWxvdykuXG5cdFx0Zm9yICh2YXIgaSA9IGVsZW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHR2YXIgY2hpbGQgPSBpID4gMCA/IHdyYXBwZXIuY2xvbmVOb2RlKHRydWUpIDogd3JhcHBlcjtcblx0XHRcdHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV07XG5cblx0XHRcdC8vIENhY2hlIHRoZSBjdXJyZW50IHBhcmVudCBhbmQgc2libGluZy5cblx0XHRcdHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR2YXIgc2libGluZyA9IGVsZW1lbnQubmV4dFNpYmxpbmc7XG5cblx0XHRcdC8vIFdyYXAgdGhlIGVsZW1lbnQgKGlzIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBjdXJyZW50XG5cdFx0XHQvLyBwYXJlbnQpLlxuXHRcdFx0Y2hpbGQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cblx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGhhZCBhIHNpYmxpbmcsIGluc2VydCB0aGUgd3JhcHBlciBiZWZvcmVcblx0XHRcdC8vIHRoZSBzaWJsaW5nIHRvIG1haW50YWluIHRoZSBIVE1MIHN0cnVjdHVyZTsgb3RoZXJ3aXNlLCBqdXN0XG5cdFx0XHQvLyBhcHBlbmQgaXQgdG8gdGhlIHBhcmVudC5cblx0XHRcdGlmIChzaWJsaW5nKSB7XG5cdFx0XHRcdHBhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHNpYmxpbmcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNoaWxkO1xuXHRcdH1cblx0fVxufTtcblxubGV0IGJyb3dzZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBuVmVyID0gbmF2aWdhdG9yLmFwcFZlcnNpb24sXG4gICAgICBuQWd0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudCxcbiAgICAgIGJyb3dzZXJOYW1lID0gbmF2aWdhdG9yLmFwcE5hbWUsXG4gICAgICBmdWxsVmVyc2lvbiA9ICcnICsgcGFyc2VGbG9hdChuYXZpZ2F0b3IuYXBwVmVyc2lvbiksXG4gICAgICBtYWpvclZlcnNpb24gPSBwYXJzZUludChuYXZpZ2F0b3IuYXBwVmVyc2lvbiwgMTApLFxuICAgICAgbmFtZU9mZnNldCxcbiAgICAgIHZlck9mZnNldCxcbiAgICAgIGl4O1xuXG4gIC8vIEVER0VcbiAgaWYgKGJyb3dzZXJOYW1lID09IFwiTmV0c2NhcGVcIiAmJiBuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKCdUcmlkZW50JykgPiAtMSkge1xuICAgIGJyb3dzZXJOYW1lID0gXCJJRVwiO1xuICAgIHZhciBlZGdlID0gbkFndC5pbmRleE9mKCdFZGdlLycpO1xuICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcoZWRnZSArIDUsIG5BZ3QuaW5kZXhPZignLicsIGVkZ2UpKTtcbiAgfVxuICAvLyBNU0lFIDExXG4gIGVsc2UgaWYgKG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJXaW5kb3dzIE5UXCIpICE9PSAtMSAmJiBuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwicnY6MTFcIikgIT09IC0xKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiSUVcIjtcbiAgICAgIGZ1bGxWZXJzaW9uID0gXCIxMTtcIjtcbiAgICB9XG4gICAgLy8gTVNJRVxuICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJNU0lFXCIpKSAhPT0gLTEpIHtcbiAgICAgICAgYnJvd3Nlck5hbWUgPSBcIklFXCI7XG4gICAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG4gICAgICB9XG4gICAgICAvLyBDaHJvbWVcbiAgICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJDaHJvbWVcIikpICE9PSAtMSkge1xuICAgICAgICAgIGJyb3dzZXJOYW1lID0gXCJDaHJvbWVcIjtcbiAgICAgICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNhZmFyaVxuICAgICAgICBlbHNlIGlmICgodmVyT2Zmc2V0ID0gbkFndC5pbmRleE9mKFwiU2FmYXJpXCIpKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGJyb3dzZXJOYW1lID0gXCJTYWZhcmlcIjtcbiAgICAgICAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNyk7XG4gICAgICAgICAgICBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZihcIlZlcnNpb25cIikpICE9PSAtMSkge1xuICAgICAgICAgICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBGaXJlZm94XG4gICAgICAgICAgZWxzZSBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZihcIkZpcmVmb3hcIikpICE9PSAtMSkge1xuICAgICAgICAgICAgICBicm93c2VyTmFtZSA9IFwiRmlyZWZveFwiO1xuICAgICAgICAgICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSW4gbW9zdCBvdGhlciBicm93c2VycywgXCJuYW1lL3ZlcnNpb25cIiBpcyBhdCB0aGUgZW5kIG9mIHVzZXJBZ2VudFxuICAgICAgICAgICAgZWxzZSBpZiAoKG5hbWVPZmZzZXQgPSBuQWd0Lmxhc3RJbmRleE9mKCcgJykgKyAxKSA8ICh2ZXJPZmZzZXQgPSBuQWd0Lmxhc3RJbmRleE9mKCcvJykpKSB7XG4gICAgICAgICAgICAgICAgYnJvd3Nlck5hbWUgPSBuQWd0LnN1YnN0cmluZyhuYW1lT2Zmc2V0LCB2ZXJPZmZzZXQpO1xuICAgICAgICAgICAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGJyb3dzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT0gYnJvd3Nlck5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgYnJvd3Nlck5hbWUgPSBuYXZpZ2F0b3IuYXBwTmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgLy8gVHJpbSB0aGUgZnVsbFZlcnNpb24gc3RyaW5nIGF0IHNlbWljb2xvbi9zcGFjZSBpZiBwcmVzZW50XG4gIGlmICgoaXggPSBmdWxsVmVyc2lvbi5pbmRleE9mKFwiO1wiKSkgIT09IC0xKSB7XG4gICAgZnVsbFZlcnNpb24gPSBmdWxsVmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICB9XG4gIGlmICgoaXggPSBmdWxsVmVyc2lvbi5pbmRleE9mKFwiIFwiKSkgIT09IC0xKSB7XG4gICAgZnVsbFZlcnNpb24gPSBmdWxsVmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICB9XG4gIC8vIEdldCBtYWpvciB2ZXJzaW9uXG4gIG1ham9yVmVyc2lvbiA9IHBhcnNlSW50KCcnICsgZnVsbFZlcnNpb24sIDEwKTtcbiAgaWYgKGlzTmFOKG1ham9yVmVyc2lvbikpIHtcbiAgICBmdWxsVmVyc2lvbiA9ICcnICsgcGFyc2VGbG9hdChuYXZpZ2F0b3IuYXBwVmVyc2lvbik7XG4gICAgbWFqb3JWZXJzaW9uID0gcGFyc2VJbnQobmF2aWdhdG9yLmFwcFZlcnNpb24sIDEwKTtcbiAgfVxuICAvLyBSZXR1cm4gZGF0YVxuICByZXR1cm4gW2Jyb3dzZXJOYW1lLCBtYWpvclZlcnNpb25dO1xufSgpO1xudmFyIGRldmljZSA9IHtcbiAgYnJvd3NlcjogYnJvd3NlcixcbiAgaXNJRTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChicm93c2VyWzBdID09PSAnSUUnKSB7XG4gICAgICByZXR1cm4gYnJvd3NlclsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KCksXG4gIGlzRmlyZWZveDogZnVuY3Rpb24gKCkge1xuICAgIGlmIChicm93c2VyWzBdID09PSAnRmlyZWZveCcpIHtcbiAgICAgIHJldHVybiBicm93c2VyWzFdO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0oKSxcbiAgaXNDaHJvbWU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoYnJvd3NlclswXSA9PT0gJ0Nocm9tZScpIHtcbiAgICAgIHJldHVybiBicm93c2VyWzFdO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0oKSxcbiAgaXNTYWZhcmk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoYnJvd3NlclswXSA9PT0gJ1NhZmFyaScpIHtcbiAgICAgIHJldHVybiBicm93c2VyWzFdO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0oKSxcbiAgaXNUb3VjaDogJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICBpc0lvczogLyhpUGFkfGlQaG9uZXxpUG9kKS9nLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKVxufTtcblxubGV0IGF1dG9Gb250ID0gZnVuY3Rpb24gKGVsLCBmb250LCBwYXJlbnQpIHtcblx0bGV0IF9lbmFibGVkID0gZmFsc2U7XG5cdGxldCBfdXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXHRcdHNjYWxlRm9udChmb250LCBwYXJlbnQud2lkdGgoKSwgZWwpO1xuXHR9O1xuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICh2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0aWYgKCFmb250KSB7XG5cdFx0XHRcdGZvbnQgPSB7IHJhdGlvOiAxLCBtaW46IDEsIGxpbmVIZWlnaHQ6IGZhbHNlIH07XG5cdFx0XHR9XG5cdFx0XHRmb250ID0gZGVlcG1lcmdlKGZvbnQsIHYpO1xuXHRcdFx0cmV0dXJuIHNjYWxlRm9udChmb250LCBwYXJlbnQud2lkdGgoKSwgZWwpO1xuXHRcdH1cblx0fTtcblx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24gKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJyAmJiBmb250KSB7XG5cdFx0XHRfZW5hYmxlZCA9IHY7XG5cdFx0XHQvLyB2ID8gKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSksIHNjYWxlRm9udChmb250LCBfd2lkdGgoKSwgZWwpKSA6IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSk7XG5cdFx0fVxuXHRcdHJldHVybiBfZW5hYmxlZDs7XG5cdH07XG5cdGlmIChwYXJlbnQub24pIHtcblx0XHRwYXJlbnQub24oJ3Jlc2l6ZScsIF91cGRhdGUpO1xuXHR9O1xufTtcblxubGV0IGRlZmF1bHRzJDIgPSB7XG5cdHg6IDAsXG5cdHk6IDAsXG5cdHdpZHRoOiAnMTAwJScsXG5cdGhlaWdodDogJzEwMCUnLFxuXHRmb250U2l6ZTogbnVsbCxcblx0bGluZUhlaWdodDogbnVsbCxcblx0b2Zmc2V0WDogMCxcblx0b2Zmc2V0WTogMCxcblx0b3JpZ2luUG9pbnQ6IFwidG9wTGVmdFwiLFxuXHR2aXNpYmxlOiBmYWxzZSxcblx0dHJhbnNmb3JtOiB7XG5cdFx0eDogbnVsbCxcblx0XHR5OiBudWxsXG5cdH0sXG5cdHRyYW5zbGF0ZTogdHJ1ZVxufTtcblxubGV0IGFkYXB0aXZlU2l6ZVBvcyA9IGZ1bmN0aW9uIChzZXR0dGluZ3MsIHBhcmVudCkge1xuXHRsZXQgYm91bmRzID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRvZmZzZXRYOiBwYXJlbnQub2Zmc2V0WCgpLFxuXHRcdFx0b2Zmc2V0WTogcGFyZW50Lm9mZnNldFkoKSxcblx0XHRcdHdpZHRoOiBwYXJlbnQud2lkdGgoKSxcblx0XHRcdGhlaWdodDogcGFyZW50LmhlaWdodCgpLFxuXHRcdFx0c2NhbGU6IHBhcmVudC53aWR0aCgpIC8gcGFyZW50LnZpZGVvV2lkdGgoKSxcblx0XHRcdHNjYWxlWTogcGFyZW50LndpZHRoKCkgLyBwYXJlbnQudmlkZW9IZWlnaHQoKVxuXHRcdH07XG5cdH07XG5cdGxldCB2YXVsdCA9IHtcblx0XHR4OiAwLFxuXHRcdHk6IDAsXG5cdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRoZWlnaHQ6ICcxMDAlJyxcblx0XHRmb250U2l6ZTogbnVsbCxcblx0XHRsaW5lSGVpZ2h0OiBudWxsXG5cdH07XG5cdGxldCBwYXJlbnRXaWR0aCA9IDA7XG5cdGxldCBwYXJlbnRIZWlnaHQgPSAwO1xuXHRsZXQgcGFyZW50WCA9IDA7XG5cdGxldCBwYXJlbnRZID0gMDtcblx0bGV0IGRvbUVsZW1lbnQgPSBudWxsO1xuXHRsZXQgc2V0dGluZ3MgPSBkZWVwbWVyZ2UoZGVmYXVsdHMkMiwgc2V0dHRpbmdzKTtcblx0bGV0IF9hY3RpdmUgPSBmYWxzZTtcblxuXHRsZXQgdXBkYXRlRG9tRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoX2FjdGl2ZSAmJiBkb21FbGVtZW50ICYmIGRvbUVsZW1lbnQubm9kZVR5cGUpIHtcblx0XHRcdGlmICh2YXVsdC53aWR0aCAhPT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9IHZhdWx0LndpZHRoICsgXCJweFwiO1xuXHRcdFx0aWYgKHZhdWx0LmhlaWdodCAhPT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB2YXVsdC5oZWlnaHQgKyBcInB4XCI7XG5cblx0XHRcdGlmIChkb20uc3R5bGVQcmVmaXgudHJhbnNmb3JtICYmIHNldHRpbmdzLnRyYW5zbGF0ZSkge1xuXHRcdFx0XHRsZXQgdHJhbnNmb3JtID0gJyc7XG5cdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwgJiYgdmF1bHQueSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0dHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnICsgdmF1bHQueCArICdweCwnICsgdmF1bHQueSArICdweCknO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUucmlnaHQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmJvdHRvbSA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUudG9wID0gXCJhdXRvXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnJpZ2h0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgdmF1bHQueCArICdweCknO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodmF1bHQueSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmJvdHRvbSA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS50b3AgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdHRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKCcgKyB2YXVsdC55ICsgJ3B4KSc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGRvbS50cmFuc2Zvcm0oZG9tRWxlbWVudCwgdHJhbnNmb3JtKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwgJiYgdmF1bHQueSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gdmF1bHQueCArIFwicHhcIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9IHZhdWx0LnkgKyBcInB4XCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gdmF1bHQueCArIFwicHhcIjtcblx0XHRcdFx0XHRpZiAodmF1bHQueSAhPSBudWxsKSBkb21FbGVtZW50LnN0eWxlLnRvcCA9IHZhdWx0LnkgKyBcInB4XCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHNldHRpbmdzLmZvbnRTaXplICE9PSB2YXVsdC5mb250U2l6ZSkge1xuXHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdmF1bHQuZm9udFNpemUgPSBzZXR0aW5ncy5mb250U2l6ZTtcblx0XHRcdH1cblx0XHRcdGlmIChzZXR0aW5ncy5saW5lSGVpZ2h0ICE9PSB2YXVsdC5saW5lSGVpZ2h0KSB7XG5cdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGluZUhlaWdodCA9IHZhdWx0LmxpbmVIZWlnaHQgPSBzZXR0aW5ncy5saW5lSGVpZ2h0O1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRsZXQgdXBkYXRlUHJvcHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IF93ID0gcGFyZW50LndpZHRoKCk7XG5cdFx0bGV0IF9oID0gcGFyZW50LmhlaWdodCgpO1xuXHRcdGxldCBfeCA9IHBhcmVudC5vZmZzZXRYKCk7XG5cdFx0bGV0IF95ID0gcGFyZW50Lm9mZnNldFkoKTtcblx0XHRpZiAocGFyZW50V2lkdGggIT0gX3cgfHwgcGFyZW50SGVpZ2h0ICE9IF9oIHx8IF94ICE9IHBhcmVudFggfHwgX3kgIT0gcGFyZW50WSkge1xuXHRcdFx0cGFyZW50V2lkdGggPSBfdztcblx0XHRcdHBhcmVudEhlaWdodCA9IF9oO1xuXHRcdFx0cGFyZW50WCA9IF94O1xuXHRcdFx0cGFyZW50WSA9IF95O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IGIgPSBib3VuZHMoKTtcblxuXHRcdGxldCBwcm9jZW50V2lkdGggPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy53aWR0aCk7XG5cdFx0aWYgKHByb2NlbnRXaWR0aCkge1xuXHRcdFx0dmF1bHQud2lkdGggPSBiLndpZHRoICogcHJvY2VudFdpZHRoIC8gMTAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoc2V0dGluZ3Mud2lkdGggIT0gbnVsbCkge1xuXHRcdFx0XHR2YXVsdC53aWR0aCA9IGIud2lkdGggKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXVsdC53aWR0aCA9IE1hdGguY2VpbCh2YXVsdC53aWR0aCk7XG5cblx0XHRsZXQgcHJvY2VudEhlaWdodCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLmhlaWdodCk7XG5cdFx0aWYgKHByb2NlbnRIZWlnaHQpIHtcblx0XHRcdHZhdWx0LmhlaWdodCA9IGIuaGVpZ2h0ICogcHJvY2VudEhlaWdodCAvIDEwMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHNldHRpbmdzLmhlaWdodCAhPSBudWxsKSB7XG5cdFx0XHRcdHZhdWx0LmhlaWdodCA9IGIuaGVpZ2h0ICogYi5zY2FsZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmF1bHQuaGVpZ2h0ID0gTWF0aC5jZWlsKHZhdWx0LmhlaWdodCk7XG5cblx0XHRpZiAoc2V0dGluZ3MueCAhPSBudWxsKSB7XG5cdFx0XHRsZXQgcHJvY2VudFggPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy54KTtcblx0XHRcdGlmIChwcm9jZW50WCkge1xuXHRcdFx0XHR2YXVsdC54ID0gYi5vZmZzZXRYICsgYi53aWR0aCAqIHByb2NlbnRYIC8gMTAwO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmF1bHQueCA9IGIub2Zmc2V0WCArIHNldHRpbmdzLnggKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdFx0dmF1bHQueCA9IE1hdGguZmxvb3IodmF1bHQueCk7XG5cdFx0XHRsZXQgdHJhbnNmb3JtWCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLnRyYW5zZm9ybS54KTtcblx0XHRcdGlmICh0cmFuc2Zvcm1YKSB2YXVsdC54ICs9IHRyYW5zZm9ybVggKiB2YXVsdC53aWR0aCAvIDEwMDtcblx0XHRcdGlmIChzZXR0aW5ncy5vZmZzZXRYKSB2YXVsdC54ICs9IHNldHRpbmdzLm9mZnNldFg7XG5cdFx0fVxuXG5cdFx0aWYgKHNldHRpbmdzLnkgIT0gbnVsbCkge1xuXHRcdFx0bGV0IHByb2NlbnRZID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MueSk7XG5cdFx0XHRpZiAocHJvY2VudFkpIHtcblx0XHRcdFx0dmF1bHQueSA9IGIub2Zmc2V0WSArIGIuaGVpZ2h0ICogcHJvY2VudFkgLyAxMDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXVsdC55ID0gYi5vZmZzZXRZICsgc2V0dGluZ3MueSAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0XHR2YXVsdC55ID0gTWF0aC5mbG9vcih2YXVsdC55KTtcblx0XHRcdGxldCB0cmFuc2Zvcm1ZID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MudHJhbnNmb3JtLnkpO1xuXHRcdFx0aWYgKHRyYW5zZm9ybVkpIHZhdWx0LnkgKz0gdHJhbnNmb3JtWSAqIHZhdWx0LndpZHRoIC8gMTAwO1xuXHRcdFx0aWYgKHNldHRpbmdzLm9mZnNldFkpIHZhdWx0LnkgKz0gc2V0dGluZ3Mub2Zmc2V0WTtcblx0XHR9XG5cblx0XHR1cGRhdGVEb21FbGVtZW50KCk7XG5cdH07XG5cblx0dGhpcy5hcHBseVRvID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlKSB7XG5cdFx0XHRkb21FbGVtZW50ID0gZWxlbWVudDtcblx0XHRcdHVwZGF0ZVByb3BzKCk7XG5cdFx0fVxuXHRcdHJldHVybiBkb21FbGVtZW50O1xuXHR9O1xuXG5cdGxldCBhcHBseU5ld1Byb3BzID0gZnVuY3Rpb24gKCkge1xuXHRcdGlmIChfYWN0aXZlKSB7XG5cdFx0XHR1cGRhdGVQcm9wcygpO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLmRhdGEgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHZhdWx0O1xuXHR9O1xuXG5cdHRoaXMuc2V0dGluZ3MgPSBmdW5jdGlvbiAobmV3U2V0dGluZ3MpIHtcblx0XHRzZXR0aW5ncyA9IGRlZXBtZXJnZShzZXR0aW5ncywgbmV3U2V0dGluZ3MpO1xuXHRcdHVwZGF0ZVByb3BzKCk7XG5cdFx0cmV0dXJuIHNldHRpbmdzO1xuXHR9O1xuXHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbiAodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHRfYWN0aXZlID0gdjtcblx0XHRcdGlmICh2KSBhcHBseU5ld1Byb3BzKCk7XG5cdFx0XHQvLyB2ID8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMsIGZhbHNlKSA6IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBhcHBseU5ld1Byb3BzLCBmYWxzZSk7XG5cdFx0fVxuXHRcdHJldHVybiBfYWN0aXZlO1xuXHR9O1xuXG5cdGlmIChwYXJlbnQub24pIHtcblx0XHRwYXJlbnQub24oJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMpO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVDb21tb25qc01vZHVsZShmbiwgbW9kdWxlKSB7XG5cdHJldHVybiBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH0sIGZuKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMpLCBtb2R1bGUuZXhwb3J0cztcbn1cblxudmFyIGluZGV4ID0gY3JlYXRlQ29tbW9uanNNb2R1bGUoZnVuY3Rpb24gKG1vZHVsZSkge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy9cbi8vIFdlIHN0b3JlIG91ciBFRSBvYmplY3RzIGluIGEgcGxhaW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYXJlIGV2ZW50IG5hbWVzLlxuLy8gSWYgYE9iamVjdC5jcmVhdGUobnVsbClgIGlzIG5vdCBzdXBwb3J0ZWQgd2UgcHJlZml4IHRoZSBldmVudCBuYW1lcyB3aXRoIGFcbi8vIGB+YCB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYnVpbHQtaW4gb2JqZWN0IHByb3BlcnRpZXMgYXJlIG5vdCBvdmVycmlkZGVuIG9yXG4vLyB1c2VkIGFzIGFuIGF0dGFjayB2ZWN0b3IuXG4vLyBXZSBhbHNvIGFzc3VtZSB0aGF0IGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBhdmFpbGFibGUgd2hlbiB0aGUgZXZlbnQgbmFtZVxuLy8gaXMgYW4gRVM2IFN5bWJvbC5cbi8vXG52YXIgcHJlZml4ID0gdHlwZW9mIE9iamVjdC5jcmVhdGUgIT09ICdmdW5jdGlvbicgPyAnficgOiBmYWxzZTtcblxuLyoqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBFdmVudEVtaXR0ZXIgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQuXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IENvbnRleHQgZm9yIGZ1bmN0aW9uIGV4ZWN1dGlvbi5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uY2U9ZmFsc2VdIE9ubHkgZW1pdCBvbmNlXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdGhpcy5mbiA9IGZuO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIE1pbmltYWwgRXZlbnRFbWl0dGVyIGludGVyZmFjZSB0aGF0IGlzIG1vbGRlZCBhZ2FpbnN0IHRoZSBOb2RlLmpzXG4gKiBFdmVudEVtaXR0ZXIgaW50ZXJmYWNlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkgeyAvKiBOb3RoaW5nIHRvIHNldCAqLyB9XG5cbi8qKlxuICogSG9sZCB0aGUgYXNzaWduZWQgRXZlbnRFbWl0dGVycyBieSBuYW1lLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAcHJpdmF0ZVxuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IGxpc3RpbmcgdGhlIGV2ZW50cyBmb3Igd2hpY2ggdGhlIGVtaXR0ZXIgaGFzIHJlZ2lzdGVyZWRcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzXG4gICAgLCBuYW1lcyA9IFtdXG4gICAgLCBuYW1lO1xuXG4gIGlmICghZXZlbnRzKSByZXR1cm4gbmFtZXM7XG5cbiAgZm9yIChuYW1lIGluIGV2ZW50cykge1xuICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgcmV0dXJuIG5hbWVzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGV2ZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBsaXN0IG9mIGFzc2lnbmVkIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50cyB0aGF0IHNob3VsZCBiZSBsaXN0ZWQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGV4aXN0cyBXZSBvbmx5IG5lZWQgdG8ga25vdyBpZiB0aGVyZSBhcmUgbGlzdGVuZXJzLlxuICogQHJldHVybnMge0FycmF5fEJvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyhldmVudCwgZXhpc3RzKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50XG4gICAgLCBhdmFpbGFibGUgPSB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKGV4aXN0cykgcmV0dXJuICEhYXZhaWxhYmxlO1xuICBpZiAoIWF2YWlsYWJsZSkgcmV0dXJuIFtdO1xuICBpZiAoYXZhaWxhYmxlLmZuKSByZXR1cm4gW2F2YWlsYWJsZS5mbl07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdmFpbGFibGUubGVuZ3RoLCBlZSA9IG5ldyBBcnJheShsKTsgaSA8IGw7IGkrKykge1xuICAgIGVlW2ldID0gYXZhaWxhYmxlW2ldLmZuO1xuICB9XG5cbiAgcmV0dXJuIGVlO1xufTtcblxuLyoqXG4gKiBFbWl0IGFuIGV2ZW50IHRvIGFsbCByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuICogQHJldHVybnMge0Jvb2xlYW59IEluZGljYXRpb24gaWYgd2UndmUgZW1pdHRlZCBhbiBldmVudC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiBmYWxzZTtcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF1cbiAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGFyZ3NcbiAgICAsIGk7XG5cbiAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVycy5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFhcmdzKSBmb3IgKGogPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYXJnc1tqIC0gMV0gPSBhcmd1bWVudHNbal07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGlzdGVuZXJzW2ldLmZuLmFwcGx5KGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBuZXcgRXZlbnRMaXN0ZW5lciBmb3IgdGhlIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBOYW1lIG9mIHRoZSBldmVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgb2YgdGhlIGZ1bmN0aW9uLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcylcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHByZWZpeCA/IHt9IDogT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lcjtcbiAgZWxzZSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gICAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFtcbiAgICAgIHRoaXMuX2V2ZW50c1tldnRdLCBsaXN0ZW5lclxuICAgIF07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkIGFuIEV2ZW50TGlzdGVuZXIgdGhhdCdzIG9ubHkgY2FsbGVkIG9uY2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IE5hbWUgb2YgdGhlIGV2ZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gQ2FsbGJhY2sgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcywgdHJ1ZSlcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHByZWZpeCA/IHt9IDogT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lcjtcbiAgZWxzZSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gICAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFtcbiAgICAgIHRoaXMuX2V2ZW50c1tldnRdLCBsaXN0ZW5lclxuICAgIF07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IHdlIHdhbnQgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIHRoYXQgd2UgbmVlZCB0byBmaW5kLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBPbmx5IHJlbW92ZSBsaXN0ZW5lcnMgbWF0Y2hpbmcgdGhpcyBjb250ZXh0LlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgcmVtb3ZlIG9uY2UgbGlzdGVuZXJzLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiB0aGlzO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XVxuICAgICwgZXZlbnRzID0gW107XG5cbiAgaWYgKGZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgICAgaWYgKFxuICAgICAgICAgICBsaXN0ZW5lcnMuZm4gIT09IGZuXG4gICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnMub25jZSlcbiAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAgbGlzdGVuZXJzW2ldLmZuICE9PSBmblxuICAgICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSlcbiAgICAgICAgICB8fCAoY29udGV4dCAmJiBsaXN0ZW5lcnNbaV0uY29udGV4dCAhPT0gY29udGV4dClcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vXG4gIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgLy9cbiAgaWYgKGV2ZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzIG9yIG9ubHkgdGhlIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IHdhbnQgdG8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiB0aGlzO1xuXG4gIGlmIChldmVudCkgZGVsZXRlIHRoaXMuX2V2ZW50c1twcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50XTtcbiAgZWxzZSB0aGlzLl9ldmVudHMgPSBwcmVmaXggPyB7fSA6IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gQWxpYXMgbWV0aG9kcyBuYW1lcyBiZWNhdXNlIHBlb3BsZSByb2xsIGxpa2UgdGhhdC5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuLy9cbi8vIFRoaXMgZnVuY3Rpb24gZG9lc24ndCBhcHBseSBhbnltb3JlLlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIHByZWZpeC5cbi8vXG5FdmVudEVtaXR0ZXIucHJlZml4ZWQgPSBwcmVmaXg7XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5pZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtb2R1bGUpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG59XG59KTtcblxudmFyIEV2ZW50cyA9IChpbmRleCAmJiB0eXBlb2YgaW5kZXggPT09ICdvYmplY3QnICYmICdkZWZhdWx0JyBpbiBpbmRleCA/IGluZGV4WydkZWZhdWx0J10gOiBpbmRleCk7XG5cbmxldCBkZWZhdWx0cyQzID0ge1xuXHR4OiAwLFxuXHR5OiAwLFxuXHR3aWR0aDogMCxcblx0aGVpZ2h0OiAwXG59O1xubGV0IHJlbGF0aXZlU2l6ZVBvcyA9IGZ1bmN0aW9uIChjdHgsIHNldHRpbmdzKSB7XG5cdGxldCBwYXJlbnRXaWR0aCA9IGN0eC52aWRlb1dpZHRoKCkgfHwgY3R4LndpZHRoIHx8IDE7XG5cdGxldCBwYXJlbnRIZWlnaHQgPSBjdHgudmlkZW9IZWlnaHQoKSB8fCBjdHguaGVpZ2h0IHx8IDE7XG5cdGxldCBvID0gZGVlcG1lcmdlKGRlZmF1bHRzJDMsIHNldHRpbmdzKTtcblx0bGV0IF93ID0gcHJvY2VudEZyb21TdHJpbmcoby53aWR0aCk7XG5cdGlmIChfdyA9PT0gZmFsc2UpIF93ID0gby53aWR0aCAvIHBhcmVudFdpZHRoICogMTAwO1xuXHRsZXQgX2ggPSBwcm9jZW50RnJvbVN0cmluZyhvLmhlaWdodCk7XG5cdGlmIChfaCA9PT0gZmFsc2UpIF9oID0gby5oZWlnaHQgLyBwYXJlbnRIZWlnaHQgKiAxMDA7XG5cdGxldCBfeCA9IHByb2NlbnRGcm9tU3RyaW5nKG8ueCk7XG5cdGlmIChfeCA9PT0gZmFsc2UpIF94ID0gby54IC8gcGFyZW50V2lkdGggKiAxMDA7XG5cdGxldCBfeSA9IHByb2NlbnRGcm9tU3RyaW5nKG8ueSk7XG5cdGlmIChfeSA9PT0gZmFsc2UpIF95ID0gby55IC8gcGFyZW50SGVpZ2h0ICogMTAwO1xuXHRyZXR1cm4ge1xuXHRcdHg6IF94LFxuXHRcdHk6IF95LFxuXHRcdHdpZHRoOiBfdyxcblx0XHRoZWlnaHQ6IF9oXG5cdH07XG59O1xuXG5jbGFzcyBDb250YWluZXIgZXh0ZW5kcyBFdmVudHMge1xuXHRjb25zdHJ1Y3RvcihlbCwgb3B0cywgY3R4LCBwbGF5ZXIpIHtcblx0XHRsZXQgcGxheWVyUGF1c2VkID0gZmFsc2U7XG5cdFx0bGV0IGlzVmlzaWJsZSA9IGZhbHNlO1xuXHRcdGxldCBleHRlcm5hbENvbnRyb2xzID0gZmFsc2U7XG5cdFx0bGV0IGJvZHkgPSBkb20uc2VsZWN0KCcuYm9keScsIGVsKTtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuY3R4ID0gY3R4O1xuXHRcdHRoaXMuYm9keSA9IGJvZHk7XG5cdFx0dGhpcy5jb25maWcgPSBmdW5jdGlvbiAoZm9wdHMpIHtcblx0XHRcdGlmIChmb3B0cykgb3B0cyA9IGRlZXBtZXJnZShvcHRzLCBmb3B0cyk7XG5cdFx0XHRsZXQgZCA9IG5ldyByZWxhdGl2ZVNpemVQb3MocGxheWVyLCBvcHRzKTtcblx0XHRcdGJvZHkuc3R5bGUud2lkdGggPSBkLndpZHRoICsgXCIlXCI7XG5cdFx0XHRib2R5LnN0eWxlLmhlaWdodCA9IGQuaGVpZ2h0ICsgXCIlXCI7XG5cdFx0XHRpZiAoZG9tLnN0eWxlUHJlZml4LnRyYW5zZm9ybSkge1xuXHRcdFx0XHRkb20udHJhbnNmb3JtKGJvZHksICd0cmFuc2xhdGUoJyArIDEwMCAvIGQud2lkdGggKiBkLnggKyAnJSwnICsgMTAwIC8gZC5oZWlnaHQgKiBkLnkgKyAnJSknKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGJvZHkuc3R5bGUudG9wID0gZC54ICsgXCIlXCI7XG5cdFx0XHRcdGJvZHkuc3R5bGUubGVmdCA9IGQueSArIFwiJVwiO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5lbWl0KCdjb25maWcnKTtcblx0XHR9O1xuXHRcdHRoaXMuY29uZmlnKCk7XG5cdFx0cGxheWVyLm9uKCdyZXNpemUnLCB0aGlzLmNvbmZpZyk7XG5cblx0XHR0aGlzLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRpZiAoaXNWaXNpYmxlKSB7XG5cdFx0XHRcdHRoaXMuZW1pdCgnYmVmb3JlSGlkZScpO1xuXHRcdFx0XHRkb20uYWRkQ2xhc3MoZWwsICdoaWRkZW4nKTtcblx0XHRcdFx0aXNWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdGlmIChvcHRzLnBhdXNlKSB7XG5cdFx0XHRcdFx0aWYgKCFwbGF5ZXJQYXVzZWQpIHtcblx0XHRcdFx0XHRcdHBsYXllci5wbGF5KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChleHRlcm5hbENvbnRyb2xzICYmIG9wdHMuZXh0ZXJuYWxDb250cm9scykge1xuXHRcdFx0XHRcdFx0cGxheWVyLmV4dGVybmFsQ29udHJvbHMuZW5hYmxlZCh0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0ZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRcdGlmIChpc0Z1bmN0aW9uKG9wdHMub25IaWRlKSkgb3B0cy5vbkhpZGUoKTtcblx0XHRcdFx0XHRjdHguY2hlY2tWaXNpYmxlRWxlbWVudHMoKTtcblx0XHRcdFx0XHR0aGlzLmVtaXQoJ2hpZGUnKTtcblx0XHRcdFx0fSwgMjUwKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHRoaXMuc2hvdyA9ICgpID0+IHtcblx0XHRcdGlmICghaXNWaXNpYmxlKSB7XG5cdFx0XHRcdGlzVmlzaWJsZSA9IHRydWU7XG5cdFx0XHRcdHRoaXMuZW1pdCgnYmVmb3JlU2hvdycpO1xuXHRcdFx0XHRjdHguZW5hYmxlZCh0cnVlKTtcblx0XHRcdFx0ZWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKGVsLCAnaGlkZGVuJyk7XG5cdFx0XHRcdFx0aWYgKGlzRnVuY3Rpb24ob3B0cy5vbkhpZGUpKSBvcHRzLm9uU2hvdygpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdCgnc2hvdycpO1xuXHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdGlmIChvcHRzLnBhdXNlKSB7XG5cdFx0XHRcdFx0aWYgKCFwbGF5ZXIucGF1c2VkKCkpIHtcblx0XHRcdFx0XHRcdHBsYXllclBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cGxheWVyLnBhdXNlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllclBhdXNlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvcHRzLmV4dGVybmFsQ29udHJvbHMpIHtcblx0XHRcdFx0XHRpZiAocGxheWVyLmV4dGVybmFsQ29udHJvbHMuZW5hYmxlZCgpKSB7XG5cdFx0XHRcdFx0XHRleHRlcm5hbENvbnRyb2xzID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHBsYXllci5leHRlcm5hbENvbnRyb2xzLmVuYWJsZWQoZmFsc2UpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRleHRlcm5hbENvbnRyb2xzID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aWYgKG9wdHMudmlzaWJsZSkge1xuXHRcdFx0dGhpcy5zaG93KCk7XG5cdFx0fVxuXG5cdFx0dGhpcy52aXNpYmxlID0gZnVuY3Rpb24gKHYpIHtcblx0XHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSBpc1Zpc2libGUgPSB2O1xuXHRcdFx0cmV0dXJuIGlzVmlzaWJsZTtcblx0XHR9O1xuXHR9XG5cdGRlc3Ryb3koKSB7XG5cdFx0Y29uc29sZS5sb2coXCJjb250YWluZXJcIik7XG5cdFx0dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcblx0XHR0aGlzLmN0eC5yZW1vdmUodGhpcy5ib2R5KTtcblx0fVxufVxuXG5jbGFzcyBQb3B1cCBleHRlbmRzIENvbnRhaW5lciB7XG5cdGNvbnN0cnVjdG9yKGVsLCBvcHRzLCBjdHgsIHBhcmVudFBsYXllcikge1xuXHRcdHN1cGVyKGVsLCBvcHRzLCBjdHgsIHBhcmVudFBsYXllcik7XG5cdFx0bGV0IG92ZXJsYXkgPSBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0ZG9tLmFkZENsYXNzKG92ZXJsYXksICdvdmVybGF5IHRyaWdnZXJDbG9zZScpO1xuXHRcdGRvbS5pbnNlcnRCZWZvcmUob3ZlcmxheSwgdGhpcy5ib2R5KTtcblx0XHQvL2hlYWRlclxuXHRcdGxldCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuXHRcdGRvbS5hZGRDbGFzcyhoZWFkZXIsICdoZWFkZXInKTtcblx0XHR0aGlzLl90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRoZWFkZXIuYXBwZW5kQ2hpbGQodGhpcy5fdGl0bGUpO1xuXHRcdHRoaXMuX2Nsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdHRoaXMuX2Nsb3NlQnRuLmlubmVySFRNTCA9IFwiPGltZyBzcmM9J3N2Zy9pY19jbG9zZS5zdmcnLz5cIjtcblx0XHRkb20uYWRkQ2xhc3ModGhpcy5fY2xvc2VCdG4sICdjbG9zZUJ0bicpO1xuXHRcdHRoaXMuX2Nsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlKTtcblx0XHRoZWFkZXIuYXBwZW5kQ2hpbGQodGhpcy5fY2xvc2VCdG4pO1xuXHRcdHRoaXMuYm9keS5hcHBlbmRDaGlsZChoZWFkZXIpO1xuXHRcdC8vZW5kIGhlYWRlclxuXG5cdFx0dGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBmdW5jdGlvbiAodikge1xuXHRcdFx0aWYgKHYgIT0gbnVsbCkge1xuXHRcdFx0XHRvdmVybGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHY7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb3ZlcmxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG5cdFx0fTtcblxuXHRcdHRoaXMuc2NhbGVTaXplID0gZnVuY3Rpb24gKHMpIHtcblx0XHRcdHRoaXMuY29uZmlnKHsgeDogKDEwMCAtIHMpIC8gMiArIFwiJVwiLCB5OiAoMTAwIC0gcykgLyAyICsgXCIlXCIsIHdpZHRoOiBzICsgXCIlXCIsIGhlaWdodDogcyArIFwiJVwiIH0pO1xuXHRcdH07XG5cblx0XHQvL0VWRU5UU1xuXHRcdHBhcmVudFBsYXllci5vbigncmVzaXplJywgKCkgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdyZXNpemUnKTtcblx0XHR9KTtcblxuXHRcdFsncmVzaXplJywgJ2NvbmZpZycsICdiZWZvcmVTaG93J10ubWFwKGV2dCA9PiB7XG5cdFx0XHR0aGlzLm9uKGV2dCwgKCkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhldnQpO1xuXHRcdFx0XHR0aGlzLmF1dG9MaW5lSGVpZ2h0KCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdGxldCBjbHNFbGVtZW50cyA9IGRvbS5zZWxlY3RBbGwoJy50cmlnZ2VyQ2xvc2UnLCBlbCk7XG5cdFx0Zm9yICh2YXIgaSA9IDAsIG4gPSBjbHNFbGVtZW50cy5sZW5ndGg7IGkgPCBuOyBpICs9IDEpIHtcblx0XHRcdGNsc0VsZW1lbnRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlKTtcblx0XHR9XG5cdH1cblx0ZGVzdHJveSgpIHtcblx0XHRjb25zb2xlLmxvZygncG9wdXAnKTtcblx0XHR0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuXHRcdHRoaXMuY3R4LnJlbW92ZSh0aGlzLmJvZHkpO1xuXHRcdGRvbS5yZW1vdmVFbGVtZW50KHRoaXMuYm9keS5wYXJlbnROb2RlKTtcblx0fVxuXG5cdGF1dG9MaW5lSGVpZ2h0KGVsKSB7XG5cdFx0aWYgKHRoaXMudmlzaWJsZSgpKSB7XG5cdFx0XHRpZiAoZWwpIHtcblx0XHRcdFx0ZG9tLmF1dG9MaW5lSGVpZ2h0KGVsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRvbS5hdXRvTGluZUhlaWdodCh0aGlzLl90aXRsZS5wYXJlbnROb2RlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0dGl0bGUodikge1xuXHRcdGlmICh2ICE9IG51bGwpIHtcblx0XHRcdHRoaXMuX3RpdGxlLmlubmVySFRNTCA9IHY7XG5cdFx0XHR0aGlzLmF1dG9MaW5lSGVpZ2h0KCk7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3RpdGxlLmlubmVySFRNTDtcblx0fVxufVxuXG5mdW5jdGlvbiBFcnJvckZvcm1hdEV4Y2VwdGlvbihtc2cpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IobXNnKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGUubmFtZSArICc6ICcgKyBlLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxufVxuXG5mdW5jdGlvbiBzY3JvbGxQb3NpdGlvbiAoKSB7XG5cdGxldCB4ID0gMDtcblx0bGV0IHkgPSAwO1xuXHR0aGlzLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0eCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCAwO1xuXHRcdHkgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgMDtcblx0fTtcblx0dGhpcy5yZXN0b3JlID0gZnVuY3Rpb24gKCkge1xuXHRcdHdpbmRvdy5zY3JvbGxUbyh4LCB5KTtcblx0fTtcbn1cblxuLy8gRnVsbHNjcmVlbiBBUElcbmxldCBzdXBwb3J0c0Z1bGxTY3JlZW4gPSBmYWxzZTtcbmxldCBicm93c2VyUHJlZml4ZXMgPSAnd2Via2l0IG1veiBvIG1zIGtodG1sJy5zcGxpdCgnICcpO1xubGV0IHByZWZpeEZTID0gJyc7XG4vL0NoZWNrIGZvciBuYXRpdmUgc3VwcG9ydFxuaWYgKHR5cGVvZiBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuICE9PSAndW5kZWZpbmVkJykge1xuICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG59IGVsc2Uge1xuICAgIC8vIENoZWNrIGZvciBmdWxsc2NyZWVuIHN1cHBvcnQgYnkgdmVuZG9yIHByZWZpeFxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGJyb3dzZXJQcmVmaXhlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIHByZWZpeEZTID0gYnJvd3NlclByZWZpeGVzW2ldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnRbcHJlZml4RlMgKyAnQ2FuY2VsRnVsbFNjcmVlbiddICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc3VwcG9ydHNGdWxsU2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgTVMgKHdoZW4gaXNuJ3QgaXQ/KVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQubXNGdWxsc2NyZWVuRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIHByZWZpeEZTID0gJ21zJztcbiAgICAgICAgICAgICAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgIH1cbn1cbmxldCBldmVudENoYW5nZSA9IHByZWZpeEZTID09PSAnJyA/ICdmdWxsc2NyZWVuY2hhbmdlJyA6IHByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnZnVsbHNjcmVlbmNoYW5nZScgOiAnZnVsbHNjcmVlbmNoYW5nZScpO1xuZXZlbnRDaGFuZ2UgPSBldmVudENoYW5nZS50b0xvd2VyQ2FzZSgpO1xuLy9zdXBwb3J0c0Z1bGxTY3JlZW4gPSBmYWxzZTtcbmNsYXNzIEZ1bGxzY3JlZW4gZXh0ZW5kcyBFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlmcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24gPSBuZXcgc2Nyb2xsUG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUgPSB7fTtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGZuRnVsbHNjcmVlbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNGdWxsU2NyZWVuKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLnNjcm9sbFBvc2l0aW9uLnJlc3RvcmUsIDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRDaGFuZ2UsIGZuRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRlZnVhbHRGdWxsU2NyZWVuRWxlbWVudChlbGVtZW50KSB7XG4gICAgICAgIGxldCBlbCA9IGVsZW1lbnQ7XG4gICAgICAgIGlmIChlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pZnJhbWUpIHtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMuaWZyYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMud3JhcHBlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWw7XG4gICAgfVxuICAgIG9uRnVsbHNjcmVlbkNoYW5nZShldnQpIHtcbiAgICAgICAgLy9pbnZlc3RpZ2F0ZSBpZiBuYXRpdmUgdmlkZW8gZnVsbHNjcmVlbiBjYW4gYmUgb3ZlcndyaXR0ZW5cbiAgICAgICAgdGhpcy5tZWRpYS5hZGRFdmVudExpc3RlbmVyKGV2ZW50Q2hhbmdlLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb247XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sIHRydWUpO1xuICAgIH1cbiAgICBpc0Z1bGxXaW5kb3coKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaXNGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGVsID0gdGhpcy5kZWZ1YWx0RnVsbFNjcmVlbkVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICBzd2l0Y2ggKHByZWZpeEZTKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ID09IGVsO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21veic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCA9PSBlbDtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnRbcHJlZml4RlMgKyAnRnVsbHNjcmVlbkVsZW1lbnQnXSA9PSBlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRnVsbFdpbmRvdygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlcXVlc3RGdWxsV2luZG93KGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNGdWxsV2luZG93KCkpIHJldHVybjtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbiAmJiB0aGlzLmlzRnVsbFNjcmVlbigpKSByZXR1cm47XG4gICAgICAgIGxldCBlbCA9IHRoaXMuZGVmdWFsdEZ1bGxTY3JlZW5FbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uLnNhdmUoKTtcbiAgICAgICAgLy8gbGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgICAgIGxldCBzdHlsZSA9IGVsLnN0eWxlO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3Bvc2l0aW9uJ10gPSBzdHlsZS5wb3NpdGlvbiB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21hcmdpbiddID0gc3R5bGUubWFyZ2luIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsndG9wJ10gPSBzdHlsZS50b3AgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydsZWZ0J10gPSBzdHlsZS5sZWZ0IHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnd2lkdGgnXSA9IHN0eWxlLndpZHRoIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnaGVpZ2h0J10gPSBzdHlsZS5oZWlnaHQgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd6SW5kZXgnXSA9IHN0eWxlLnpJbmRleCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21heFdpZHRoJ10gPSBzdHlsZS5tYXhXaWR0aCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21heEhlaWdodCddID0gc3R5bGUubWF4SGVpZ2h0IHx8IFwiXCI7XG5cbiAgICAgICAgZWwuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIGVsLnN0eWxlLnRvcCA9IGVsLnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICBlbC5zdHlsZS5tYXJnaW4gPSAwO1xuICAgICAgICBlbC5zdHlsZS5tYXhXaWR0aCA9IGVsLnN0eWxlLm1heEhlaWdodCA9IGVsLnN0eWxlLndpZHRoID0gZWwuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IDIxNDc0ODM2NDc7XG5cbiAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQgPSBlbDtcbiAgICAgICAgdGhpcy5pc0Z1bGxXaW5kb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBsZXQgZWwgPSB0aGlzLmRlZnVhbHRGdWxsU2NyZWVuRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbi5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gcHJlZml4RlMgPT09ICcnID8gZWwucmVxdWVzdEZ1bGxTY3JlZW4oKSA6IGVsW3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnUmVxdWVzdEZ1bGxzY3JlZW4nIDogJ1JlcXVlc3RGdWxsU2NyZWVuJyldKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RGdWxsV2luZG93KGVsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYW5jZWxGdWxsV2luZG93KCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNGdWxsV2luZG93KCkpIHJldHVybjtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbiAmJiB0aGlzLmlzRnVsbFNjcmVlbigpKSByZXR1cm47XG4gICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudC5zdHlsZVtrXSA9IHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVtrXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNGdWxsV2luZG93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uLnJlc3RvcmUoKTtcbiAgICB9XG4gICAgY2FuY2VsRnVsbFNjcmVlbigpIHtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgcmV0dXJuIHByZWZpeEZTID09PSAnJyA/IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKSA6IGRvY3VtZW50W3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnRXhpdEZ1bGxzY3JlZW4nIDogJ0NhbmNlbEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRnVsbFdpbmRvdygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZ2dsZUZ1bGxXaW5kb3coZWxlbWVudCkge1xuICAgICAgICBsZXQgaXNGdWxsc2NyZWVuID0gIXRoaXMuaXNGdWxsV2luZG93KCk7XG4gICAgICAgIGlmIChpc0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEZ1bGxXaW5kb3coZWxlbWVudCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRnVsbFdpbmRvdygpO1xuICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdG9nZ2xlRnVsbFNjcmVlbihlbGVtZW50KSB7XG4gICAgICAgIGxldCBpc0Z1bGxzY3JlZW4gPSB0aGlzLmlzRnVsbFNjcmVlbigpO1xuICAgICAgICBpZiAoIWlzRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RnVsbFNjcmVlbihlbGVtZW50KTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdWxsc2NyZWVuRWxlbWVudCgpIHtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgcmV0dXJuIHByZWZpeEZTID09PSAnJyA/IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IDogZG9jdW1lbnRbcHJlZml4RlMgKyAnRnVsbHNjcmVlbkVsZW1lbnQnXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIF9jYW5jZWxSZXF1ZXN0cyAobWVkaWEpIHtcblx0Ly8gUmVtb3ZlIGNoaWxkIHNvdXJjZXNcblx0dmFyIHNvdXJjZXMgPSBkb20uc2VsZWN0QWxsKCdzb3VyY2UnLCBtZWRpYSk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGRvbS5yZW1vdmVFbGVtZW50KHNvdXJjZXNbaV0pO1xuXHR9XG5cblx0Ly8gU2V0IGJsYW5rIHZpZGVvIHNyYyBhdHRyaWJ1dGVcblx0Ly8gVGhpcyBpcyB0byBwcmV2ZW50IGEgTUVESUFfRVJSX1NSQ19OT1RfU1VQUE9SVEVEIGVycm9yXG5cdC8vIFNtYWxsIG1wNDogaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvc21hbGwvYmxvYi9tYXN0ZXIvbXA0Lm1wNFxuXHQvLyBJbmZvOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyMjMxNTc5L2hvdy10by1wcm9wZXJseS1kaXNwb3NlLW9mLWFuLWh0bWw1LXZpZGVvLWFuZC1jbG9zZS1zb2NrZXQtb3ItY29ubmVjdGlvblxuXHRtZWRpYS5zZXRBdHRyaWJ1dGUoJ3NyYycsICdkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUhHWjBlWEJwYzI5dEFBQUNBR2x6YjIxcGMyOHliWEEwTVFBQUFBaG1jbVZsQUFBQUdtMWtZWFFBQUFHekFCQUhBQUFCdGhCZ1VZSTl0KzhBQUFNTmJXOXZkZ0FBQUd4dGRtaGtBQUFBQU1YTXZ2ckZ6TDc2QUFBRDZBQUFBQ29BQVFBQUFRQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FBQUJocGIyUnpBQUFBQUJDQWdJQUhBRS8vLy8vKy93QUFBaUYwY21GckFBQUFYSFJyYUdRQUFBQVB4Y3krK3NYTXZ2b0FBQUFCQUFBQUFBQUFBQ29BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQWdBQUFBSUFBQUFBQUc5YldScFlRQUFBQ0J0Wkdoa0FBQUFBTVhNdnZyRnpMNzZBQUFBR0FBQUFBRVZ4d0FBQUFBQUxXaGtiSElBQUFBQUFBQUFBSFpwWkdVQUFBQUFBQUFBQUFBQUFBQldhV1JsYjBoaGJtUnNaWElBQUFBQmFHMXBibVlBQUFBVWRtMW9aQUFBQUFFQUFBQUFBQUFBQUFBQUFDUmthVzVtQUFBQUhHUnlaV1lBQUFBQUFBQUFBUUFBQUF4MWNtd2dBQUFBQVFBQUFTaHpkR0pzQUFBQXhITjBjMlFBQUFBQUFBQUFBUUFBQUxSdGNEUjJBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FDQUJJQUFBQVNBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR1AvL0FBQUFYbVZ6WkhNQUFBQUFBNENBZ0UwQUFRQUVnSUNBUHlBUkFBQUFBQU1OUUFBQUFBQUZnSUNBTFFBQUFiQUJBQUFCdFlrVEFBQUJBQUFBQVNBQXhJMklBTVVBUkFFVVF3QUFBYkpNWVhaak5UTXVNelV1TUFhQWdJQUJBZ0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUFVYzNSemVnQUFBQUFBQUFBU0FBQUFBUUFBQUJSemRHTnZBQUFBQUFBQUFBRUFBQUFzQUFBQVlIVmtkR0VBQUFCWWJXVjBZUUFBQUFBQUFBQWhhR1JzY2dBQUFBQUFBQUFBYldScGNtRndjR3dBQUFBQUFBQUFBQUFBQUFBcmFXeHpkQUFBQUNPcGRHOXZBQUFBRzJSaGRHRUFBQUFCQUFBQUFFeGhkbVkxTXk0eU1TNHgnKTtcblxuXHQvLyBMb2FkIHRoZSBuZXcgZW1wdHkgc291cmNlXG5cdC8vIFRoaXMgd2lsbCBjYW5jZWwgZXhpc3RpbmcgcmVxdWVzdHNcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TZWx6L3BseXIvaXNzdWVzLzE3NFxuXHRtZWRpYS5sb2FkKCk7XG5cblx0Ly8gRGVidWdnaW5nXG5cdGNvbnNvbGUubG9nKFwiQ2FuY2VsbGVkIG5ldHdvcmsgcmVxdWVzdHMgZm9yIG9sZCBtZWRpYVwiKTtcbn1cblxuZnVuY3Rpb24gbWltZVZpZGVvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL3dlYm0nOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby93ZWJtOyBjb2RlY3M9XCJ2cDgsIHZvcmJpc1wiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICd2aWRlby9tcDQnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFLCBtcDRhLjQwLjJcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAndmlkZW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICB9XG59XG5cbi8vaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxubGV0IF9ldmVudHMgPSBbJ2VuZGVkJywgJ3Byb2dyZXNzJywgJ3N0YWxsZWQnLCAncGxheWluZycsICd3YWl0aW5nJywgJ2NhbnBsYXknLCAnY2FucGxheXRocm91Z2gnLCAnbG9hZHN0YXJ0JywgJ2xvYWRlZGRhdGEnLCAnbG9hZGVkbWV0YWRhdGEnLCAndGltZXVwZGF0ZScsICd2b2x1bWVjaGFuZ2UnLCAncGxheScsICdwbGF5aW5nJywgJ3BhdXNlJywgJ2Vycm9yJywgJ3NlZWtpbmcnLCAnZW1wdGllZCcsICdzZWVrZWQnLCAncmF0ZWNoYW5nZScsICdzdXNwZW5kJ107XG5cbmNsYXNzIE1lZGlhIGV4dGVuZHMgRnVsbHNjcmVlbiB7XG5cdGNvbnN0cnVjdG9yKGVsKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRpZiAoZWwgPT0gbnVsbCkge1xuXHRcdFx0RXJyb3JGb3JtYXRFeGNlcHRpb24oXCJZb3UgbmVlZCB0byBzdXBwbHkgYSBIVE1MVmlkZW9FbGVtZW50IHRvIGluc3RhbnRpYXRlIHRoZSBwbGF5ZXJcIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEgPSBlbDtcblx0XHRfZXZlbnRzLmZvckVhY2goayA9PiB7XG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGssICgpID0+IHtcblx0XHRcdFx0dGhpcy5lbWl0KGspO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmNhblBsYXkgPSB7XG5cdFx0XHRtcDQ6IG1pbWVWaWRlbyhlbCwgJ3ZpZGVvL21wNCcpLFxuXHRcdFx0d2VibTogbWltZVZpZGVvKGVsLCAndmlkZW8vd2VibScpLFxuXHRcdFx0b2dnOiBtaW1lVmlkZW8oZWwsICd2aWRlby9vZ2cnKVxuXHRcdH07XG5cdH1cblxuXHQvKioqIEdsb2JhbCBhdHRyaWJ1dGVzICovXG5cblx0LyogQSBCb29sZWFuIGF0dHJpYnV0ZTsgaWYgc3BlY2lmaWVkLCB0aGUgdmlkZW8gYXV0b21hdGljYWxseSBiZWdpbnMgdG8gcGxheSBiYWNrIGFzIHNvb24gYXMgaXQgY2FuIGRvIHNvIHdpdGhvdXQgc3RvcHBpbmcgdG8gZmluaXNoIGxvYWRpbmcgdGhlIGRhdGEuIElmIG5vdCByZXR1cm4gdGhlIGF1b3BsYXkgYXR0cmlidXRlLiAqL1xuXHRhdXRvcGxheSh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEuYXV0b3BsYXkgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5hdXRvcGxheTtcblx0fVxuXG5cdC8qIFJldHVybnMgdGhlIHRpbWUgcmFuZ2VzIG9mIHRoZSBidWZmZXJlZCBtZWRpYS4gVGhpcyBhdHRyaWJ1dGUgY29udGFpbnMgYSBUaW1lUmFuZ2VzIG9iamVjdCAqL1xuXHRidWZmZXJlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5idWZmZXJlZDtcblx0fVxuXG5cdC8qIElmIHRoaXMgYXR0cmlidXRlIGlzIHByZXNlbnQsIHRoZSBicm93c2VyIHdpbGwgb2ZmZXIgY29udHJvbHMgdG8gYWxsb3cgdGhlIHVzZXIgdG8gY29udHJvbCB2aWRlbyBwbGF5YmFjaywgaW5jbHVkaW5nIHZvbHVtZSwgc2Vla2luZywgYW5kIHBhdXNlL3Jlc3VtZSBwbGF5YmFjay4gV2hlbiBub3Qgc2V0IHJldHVybnMgaWYgdGhlIGNvbnRyb2xzIGFyZSBwcmVzZW50ICovXG5cdG5hdGl2ZUNvbnRyb2xzKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5jb250cm9scyA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNvbnRyb2xzO1xuXHR9XG5cblx0LyogYW5vbnltb3VzLCB1c2UtY3JlZGVudGlhbHMsIGZhbHNlICovXG5cdGNyb3Nzb3JpZ2luKHYpIHtcblx0XHRpZiAodiA9PT0gJ3VzZS1jcmVkZW50aWFscycpIHtcblx0XHRcdHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSAndXNlLWNyZWRlbnRpYWxzJztcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRpZiAodikge1xuXHRcdFx0dGhpcy5tZWRpYS5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuXHRcdFx0cmV0dXJuICdhbm9ueW1vdXMnO1xuXHRcdH1cblx0XHRpZiAodiA9PT0gZmFsc2UpIHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSBudWxsO1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNyb3NzT3JpZ2luO1xuXHR9XG5cblx0LyogQSBCb29sZWFuIGF0dHJpYnV0ZTsgaWYgc3BlY2lmaWVkLCB3ZSB3aWxsLCB1cG9uIHJlYWNoaW5nIHRoZSBlbmQgb2YgdGhlIHZpZGVvLCBhdXRvbWF0aWNhbGx5IHNlZWsgYmFjayB0byB0aGUgc3RhcnQuICovXG5cdGxvb3Aodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmxvb3AgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5sb29wO1xuXHR9XG5cblx0LypBIEJvb2xlYW4gYXR0cmlidXRlIHdoaWNoIGluZGljYXRlcyB0aGUgZGVmYXVsdCBzZXR0aW5nIG9mIHRoZSBhdWRpbyBjb250YWluZWQgaW4gdGhlIHZpZGVvLiBJZiBzZXQsIHRoZSBhdWRpbyB3aWxsIGJlIGluaXRpYWxseSBzaWxlbmNlZC4gSXRzIGRlZmF1bHQgdmFsdWUgaXMgZmFsc2UsIG1lYW5pbmcgdGhhdCB0aGUgYXVkaW8gd2lsbCBiZSBwbGF5ZWQgd2hlbiB0aGUgdmlkZW8gaXMgcGxheWVkKi9cblx0bXV0ZWQodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLm11dGVkID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEubXV0ZWQ7XG5cdH1cblxuXHQvKiBNdXRlIHRoZSB2aWRlbyAqL1xuXHRtdXRlKCkge1xuXHRcdHRoaXMubXV0ZWQodHJ1ZSk7XG5cdH1cblxuXHQvKiBVbk11dGUgdGhlIHZpZGVvICovXG5cdHVubXV0ZSgpIHtcblx0XHR0aGlzLm11dGVkKGZhbHNlKTtcblx0fVxuXG5cdC8qIFRvZ2dsZSB0aGUgbXV0ZWQgc3RhbmNlIG9mIHRoZSB2aWRlbyAqL1xuXHR0b2dnbGVNdXRlKCkge1xuXHRcdHJldHVybiB0aGlzLm11dGVkKCF0aGlzLm11dGVkKCkpO1xuXHR9XG5cblx0LyogUmV0dXJucyBBIFRpbWVSYW5nZXMgb2JqZWN0IGluZGljYXRpbmcgYWxsIHRoZSByYW5nZXMgb2YgdGhlIHZpZGVvIHRoYXQgaGF2ZSBiZWVuIHBsYXllZC4qL1xuXHRwbGF5ZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucGxheWVkO1xuXHR9XG5cblx0LypcbiBUaGlzIGVudW1lcmF0ZWQgYXR0cmlidXRlIGlzIGludGVuZGVkIHRvIHByb3ZpZGUgYSBoaW50IHRvIHRoZSBicm93c2VyIGFib3V0IHdoYXQgdGhlIGF1dGhvciB0aGlua3Mgd2lsbCBsZWFkIHRvIHRoZSBiZXN0IHVzZXIgZXhwZXJpZW5jZS4gSXQgbWF5IGhhdmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuIFx0bm9uZTogaW5kaWNhdGVzIHRoYXQgdGhlIHZpZGVvIHNob3VsZCBub3QgYmUgcHJlbG9hZGVkLlxuIFx0bWV0YWRhdGE6IGluZGljYXRlcyB0aGF0IG9ubHkgdmlkZW8gbWV0YWRhdGEgKGUuZy4gbGVuZ3RoKSBpcyBmZXRjaGVkLlxuIFx0YXV0bzogaW5kaWNhdGVzIHRoYXQgdGhlIHdob2xlIHZpZGVvIGZpbGUgY291bGQgYmUgZG93bmxvYWRlZCwgZXZlbiBpZiB0aGUgdXNlciBpcyBub3QgZXhwZWN0ZWQgdG8gdXNlIGl0LlxuIHRoZSBlbXB0eSBzdHJpbmc6IHN5bm9ueW0gb2YgdGhlIGF1dG8gdmFsdWUuXG4gKi9cblx0cHJlbG9hZCh2KSB7XG5cdFx0aWYgKHYgPT09ICdtZXRhZGF0YScgfHwgdiA9PT0gXCJtZXRhXCIpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdtZXRhZGF0YSc7XG5cdFx0XHRyZXR1cm4gJ21ldGFkYXRhJztcblx0XHR9XG5cdFx0aWYgKHYpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdhdXRvJztcblx0XHRcdHJldHVybiAnYXV0byc7XG5cdFx0fVxuXHRcdGlmICh2ID09PSBmYWxzZSkge1xuXHRcdFx0dGhpcy5tZWRpYS5wcmVsb2FkID0gJ25vbmUnO1xuXHRcdFx0cmV0dXJuICdub25lJztcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucHJlbG9hZDtcblx0fVxuXG5cdC8qIEdpdmVzIG9yIHJldHVybnMgdGhlIGFkZHJlc3Mgb2YgYW4gaW1hZ2UgZmlsZSB0aGF0IHRoZSB1c2VyIGFnZW50IGNhbiBzaG93IHdoaWxlIG5vIHZpZGVvIGRhdGEgaXMgYXZhaWxhYmxlLiBUaGUgYXR0cmlidXRlLCBpZiBwcmVzZW50LCBtdXN0IGNvbnRhaW4gYSB2YWxpZCBub24tZW1wdHkgVVJMIHBvdGVudGlhbGx5IHN1cnJvdW5kZWQgYnkgc3BhY2VzICovXG5cdHBvc3Rlcih2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5tZWRpYS5wb3N0ZXIgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wb3N0ZXI7XG5cdH1cblxuXHQvKiBUaGUgc3JjIHByb3BlcnR5IHNldHMgb3IgcmV0dXJucyB0aGUgY3VycmVudCBzb3VyY2Ugb2YgdGhlIGF1ZGlvL3ZpZGVvLCBUaGUgc291cmNlIGlzIHRoZSBhY3R1YWwgbG9jYXRpb24gKFVSTCkgb2YgdGhlIGF1ZGlvL3ZpZGVvIGZpbGUgKi9cblx0c3JjKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRfY2FuY2VsUmVxdWVzdHModGhpcy5tZWRpYSk7XG5cdFx0XHRpZiAodiBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBuID0gdi5sZW5ndGg7IGkgKz0gMTspIHtcblx0XHRcdFx0XHRpZiAodltpXVsndHlwZSddID09PSBcInZpZGVvL21wNFwiICYmIHRoaXMuY2FuUGxheS5tcDQpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnNyYyA9IHZbaV1bJ3NyYyddO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodltpXVsndHlwZSddID09PSBcInZpZGVvL3dlYm1cIiAmJiB0aGlzLmNhblBsYXkud2VibSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh2W2ldWyd0eXBlJ10gPT09IFwidmlkZW8vb2dnXCIgJiYgdGhpcy5jYW5QbGF5Lm9nZykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHYuc3JjICYmIHYudHlwZSkge1xuXHRcdFx0XHR0aGlzLm1lZGlhLnNyYyA9IHYuc3JjO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5tZWRpYS5zcmMgPSB2O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50U3JjO1xuXHR9XG5cblx0LyoqKiBHbG9iYWwgRXZlbnRzICovXG5cblx0LyogU3RhcnRzIHBsYXlpbmcgdGhlIGF1ZGlvL3ZpZGVvICovXG5cdHBsYXkoKSB7XG5cdFx0dGhpcy5tZWRpYS5wbGF5KCk7XG5cdH1cblxuXHQvKiBQYXVzZXMgdGhlIGN1cnJlbnRseSBwbGF5aW5nIGF1ZGlvL3ZpZGVvICovXG5cdHBhdXNlKCkge1xuXHRcdHRoaXMubWVkaWEucGF1c2UoKTtcblx0fVxuXG5cdC8qIFJldHVybiB0aGUgY3VycmVudGx5IHBsYXlpbmcgc3RhdHVzIG9mIGF1ZGlvL3ZpZGVvICovXG5cdHBhdXNlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wYXVzZWQ7XG5cdH1cblxuXHQvKiBSZXR1cm4gdGhlIGN1cnJlbnRseSBwbGF5aW5nIHN0YXR1cyBvZiBhdWRpby92aWRlbyAqL1xuXHRwbGF5aW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLnBhdXNlZDtcblx0fVxuXG5cdC8qIFRvZ2dsZSBwbGF5L3BhdXNlIGZvciB0aGUgYXVkaW8vdmlkZW8gKi9cblx0dG9nZ2xlUGxheSgpIHtcblx0XHR0aGlzLm1lZGlhLnBhdXNlZCA/IHRoaXMucGxheSgpIDogdGhpcy5wYXVzZSgpO1xuXHR9XG5cblx0Y3VycmVudFRpbWUodikge1xuXHRcdGlmICh2ID09PSBudWxsIHx8IGlzTmFOKHYpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50VGltZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiB0aGlzLm1lZGlhLmR1cmF0aW9uKSB7XG5cdFx0XHR2ID0gdGhpcy5tZWRpYS5kdXJhdGlvbjtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS5jdXJyZW50VGltZSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH1cblxuXHRzZWVrKHYpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50VGltZSh2KTtcblx0fVxuXG5cdC8qKlxuICAqIFtSZS1sb2FkcyB0aGUgYXVkaW8vdmlkZW8gZWxlbWVudCwgdXBkYXRlIHRoZSBhdWRpby92aWRlbyBlbGVtZW50IGFmdGVyIGNoYW5naW5nIHRoZSBzb3VyY2Ugb3Igb3RoZXIgc2V0dGluZ3NdXG4gICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICovXG5cdGxvYWQodikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuc3JjKHYpO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhLmxvYWQoKTtcblx0fVxuXG5cdGR1cmF0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmR1cmF0aW9uO1xuXHR9XG5cblx0dm9sdW1lKHYpIHtcblx0XHQvLyBSZXR1cm4gY3VycmVudCB2b2x1bWUgaWYgdmFsdWUgXG5cdFx0aWYgKHYgPT09IG51bGwgfHwgaXNOYU4odikpIHtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZvbHVtZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiAxKSB7XG5cdFx0XHR2ID0gMTtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS52b2x1bWUgPSB2O1xuXHRcdHJldHVybiB2O1xuXHR9XG59XG5cbnZhciBjb250YWluZXJCb3VuZHMgPSAoZnVuY3Rpb24gKCkge1xuXHRsZXQgc2NhbGUgPSAwO1xuXHRsZXQgYm91bmRzID0gZnVuY3Rpb24gKGVsLCB1cGRhdGVTY2FsZSkge1xuXHRcdGlmICh1cGRhdGVTY2FsZSAhPT0gdW5kZWZpbmVkKSBzY2FsZSA9IHVwZGF0ZVNjYWxlO1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0d3JhcHBlcldpZHRoOiBlbC5vZmZzZXRXaWR0aCxcblx0XHRcdHdyYXBwZXJIZWlnaHQ6IGVsLm9mZnNldEhlaWdodCxcblx0XHRcdHNjYWxlOiBzY2FsZSB8fCBlbC53aWR0aCAvIGVsLmhlaWdodCxcblx0XHRcdHdpZHRoOiAwLFxuXHRcdFx0aGVpZ2h0OiAwLFxuXHRcdFx0b2Zmc2V0WDogMCxcblx0XHRcdG9mZnNldFk6IDBcblx0XHR9O1xuXHRcdGRhdGFbJ3dyYXBwZXJTY2FsZSddID0gZGF0YS53cmFwcGVyV2lkdGggLyBkYXRhLndyYXBwZXJIZWlnaHQ7XG5cdFx0aWYgKGRhdGEud3JhcHBlclNjYWxlID4gZGF0YS5zY2FsZSkge1xuXHRcdFx0ZGF0YS5oZWlnaHQgPSBkYXRhLndyYXBwZXJIZWlnaHQ7XG5cdFx0XHRkYXRhLndpZHRoID0gZGF0YS5zY2FsZSAqIGRhdGEuaGVpZ2h0O1xuXHRcdFx0ZGF0YS5vZmZzZXRYID0gKGRhdGEud3JhcHBlcldpZHRoIC0gZGF0YS53aWR0aCkgLyAyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkYXRhLndpZHRoID0gZGF0YS53cmFwcGVyV2lkdGg7XG5cdFx0XHRkYXRhLmhlaWdodCA9IGRhdGEud2lkdGggLyBkYXRhLnNjYWxlO1xuXHRcdFx0ZGF0YS5vZmZzZXRZID0gKGRhdGEud3JhcHBlckhlaWdodCAtIGRhdGEuaGVpZ2h0KSAvIDI7XG5cdFx0fVxuXHRcdHJldHVybiBkYXRhO1xuXHR9O1xuXHRyZXR1cm4gYm91bmRzO1xufSkoKTtcblxudmFyIF9kb2MgPSBkb2N1bWVudCB8fCB7fTtcbi8vIFNldCB0aGUgbmFtZSBvZiB0aGUgaGlkZGVuIHByb3BlcnR5IGFuZCB0aGUgY2hhbmdlIGV2ZW50IGZvciB2aXNpYmlsaXR5XG52YXIgaGlkZGVuO1xudmFyIHZpc2liaWxpdHlDaGFuZ2U7XG5pZiAodHlwZW9mIF9kb2MuaGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdC8vIE9wZXJhIDEyLjEwIGFuZCBGaXJlZm94IDE4IGFuZCBsYXRlciBzdXBwb3J0IFxuXHRoaWRkZW4gPSBcImhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJ2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLm1vekhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIm1vekhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLm1zSGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwibXNIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwibXN2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLndlYmtpdEhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIndlYmtpdEhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCI7XG59XG5cbmNvbnN0IGlzQXZhaWxhYmxlID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gISh0eXBlb2YgX2RvY1toaWRkZW5dID09PSBcInVuZGVmaW5lZFwiKTtcbn07XG5cbmZ1bmN0aW9uIHBhZ2VWaXNpYmlsaXR5KF9tZWRpYSwgc2V0dGluZ3MgPSB7fSkge1xuXHRsZXQgX2F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlKCk7XG5cdGlmIChfYXZhaWxhYmxlKSB7XG5cdFx0bGV0IF9lbmFibGVkID0gZmFsc2U7XG5cdFx0bGV0IF9wbGF5aW5nID0gZmFsc2U7XG5cdFx0bGV0IHBhdXNlZCA9IGZhbHNlO1xuXHRcdGxldCBzZXRGbGFnUGxheWluZyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdF9wbGF5aW5nID0gdHJ1ZTtcblx0XHR9O1xuXHRcdGxldCBldmVudHMgPSB7XG5cdFx0XHR2aXNpYmxlOiBmdW5jdGlvbiAoKSB7fSxcblx0XHRcdGhpZGRlbjogZnVuY3Rpb24gKCkge31cblx0XHR9O1xuXHRcdGxldCBkZXN0cm95VmlzaWJpbGl0eSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGV2ZW50cyA9IHtcblx0XHRcdFx0dmlzaWJsZTogZnVuY3Rpb24gKCkge30sXG5cdFx0XHRcdGhpZGRlbjogZnVuY3Rpb24gKCkge31cblx0XHRcdH07XG5cdFx0XHRfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0X3BsYXlpbmcgPSBmYWxzZTtcblx0XHRcdF9kb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRfbWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHR9O1xuXHRcdGxldCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKF9lbmFibGVkKSB7XG5cdFx0XHRcdGlmIChfZG9jW2hpZGRlbl0pIHtcblx0XHRcdFx0XHRpZiAoX3BsYXlpbmcgJiYgIV9tZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdF9tZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnRzLmhpZGRlbigpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChwYXVzZWQgJiYgX21lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0X21lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudHMudmlzaWJsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRsZXQgaW5pdFZpc2liaWxpdHkgPSBmdW5jdGlvbiBpbml0VmlzaWJpbGl0eShzZXR0aW5ncykge1xuXHRcdFx0aWYgKF9hdmFpbGFibGUpIHtcblx0XHRcdFx0X2RvYy5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdFx0X21lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cblx0XHRcdFx0ZXZlbnRzLnZpc2libGUgPSBzZXR0aW5ncy5vblZpc2libGUgfHwgZXZlbnRzLnZpc2libGU7XG5cdFx0XHRcdGV2ZW50cy5oaWRkZW4gPSBzZXR0aW5ncy5vbkhpZGRlbiB8fCBldmVudHMuaGlkZGVuO1xuXHRcdFx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdF9kb2MuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRcdF9tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZXZlbnRzLnZpc2libGUgPSBzZXR0aW5ncy5vblZpc2libGUgfHwgZXZlbnRzLnZpc2libGU7XG5cdFx0ZXZlbnRzLmhpZGRlbiA9IHNldHRpbmdzLm9uSGlkZGVuIHx8IGV2ZW50cy5oaWRkZW47XG5cdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdF9kb2MuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0X21lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cblx0XHR0aGlzLmluaXQgPSBpbml0VmlzaWJpbGl0eTtcblx0XHR0aGlzLmRlc3Ryb3kgPSBkZXN0cm95VmlzaWJpbGl0eTtcblx0XHR0aGlzLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuXHRcdFx0aWYgKGV2ZW50IGluIGV2ZW50cykgZXZlbnRzW2V2ZW50XSA9IGZuO1xuXHRcdH07XG5cdFx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24gKHYpIHtcblx0XHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSBfZW5hYmxlZCA9IHY7XG5cdFx0XHRyZXR1cm4gX2VuYWJsZWQ7XG5cdFx0fTtcblx0fTtcbn07XG5cbmxldCBfZG9jJDEgPSBkb2N1bWVudCB8fCB7fTtcbmxldCBleHRlcm5hbENvbnRyb2xzID0gZnVuY3Rpb24gKGVsKSB7XG5cdGxldCBfZW5hYmxlZCA9IHRydWU7XG5cdGxldCBfc2VlayA9IHRydWU7XG5cdGxldCBfdElkID0gbnVsbDtcblx0bGV0IG1lZGlhID0gZWw7XG5cdGxldCBrZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcblx0XHRpZiAoX2VuYWJsZWQpIHtcblx0XHRcdC8vYnlwYXNzIGRlZmF1bHQgbmF0aXZlIGV4dGVybmFsIGNvbnRyb2xzIHdoZW4gbWVkaWEgaXMgZm9jdXNlZFxuXHRcdFx0bWVkaWEucGFyZW50Tm9kZS5mb2N1cygpO1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzMikge1xuXHRcdFx0XHQvL3NwYWNlXG5cdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKF9zZWVrKSB7XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzcpIHtcblx0XHRcdFx0XHQvL2xlZnRcblx0XHRcdFx0XHRtZWRpYS5jdXJyZW50VGltZSA9IG1lZGlhLmN1cnJlbnRUaW1lIC0gNTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOSkge1xuXHRcdFx0XHRcdC8vcmlnaHRcblx0XHRcdFx0XHRtZWRpYS5jdXJyZW50VGltZSA9IG1lZGlhLmN1cnJlbnRUaW1lICsgNTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzgpIHtcblx0XHRcdFx0Ly91cFxuXHRcdFx0XHRsZXQgdiA9IG1lZGlhLnZvbHVtZTtcblx0XHRcdFx0diArPSAuMTtcblx0XHRcdFx0aWYgKHYgPiAxKSB2ID0gMTtcblx0XHRcdFx0bWVkaWEudm9sdW1lID0gdjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDQwKSB7XG5cdFx0XHRcdC8vZG93blxuXHRcdFx0XHRsZXQgdiA9IG1lZGlhLnZvbHVtZTtcblx0XHRcdFx0diAtPSAuMTtcblx0XHRcdFx0aWYgKHYgPCAwKSB2ID0gMDtcblx0XHRcdFx0bWVkaWEudm9sdW1lID0gdjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0LyppZiAoc2VsZi5jb250cm9sQmFyKSB7XG4gICBcdGlmIChzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbikge1xuICAgXHRcdGlmIChlLmtleUNvZGUgPT0gNDAgfHwgZS5rZXlDb2RlID09IDM4KSB7XG4gICBcdFx0XHRcdHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uLm1lbnVDb250ZW50LmVsXy5jbGFzc05hbWUgPSBcInZqcy1tZW51IHNob3dcIjtcbiAgIFx0XHR9XG4gICBcdH1cbiAgIH0qL1xuXHRcdH1cblx0fTtcblxuXHQvLyB0aGlzLm9uU3BhY2UgPSBmdW5jdGlvbigpIHtcblxuXHQvLyB9O1xuXG5cdGxldCBrZXl1cCA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0aWYgKF9lbmFibGVkKSB7XG5cdFx0XHQvLyBpZiAoZS5rZXlDb2RlID09IDQwIHx8IGUua2V5Q29kZSA9PSAzOCkge1xuXHRcdFx0Ly8gXHRjbGVhckludGVydmFsKF90SWQpO1xuXHRcdFx0Ly8gXHRpZiAoc2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24pIHtcblx0XHRcdC8vIFx0XHRfdElkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdC8vIFx0XHRcdHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uLm1lbnVDb250ZW50LmVsXy5jbGFzc05hbWUgPSBcInZqcy1tZW51XCI7XG5cdFx0XHQvLyBcdFx0fSwgNTAwKTtcblx0XHRcdC8vIFx0fVxuXHRcdFx0Ly8gfVxuXHRcdH1cblx0fTtcblx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24gKGIpIHtcblx0XHRpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gX2VuYWJsZWQ7XG5cdFx0X2VuYWJsZWQgPSBiO1xuXHR9O1xuXHR0aGlzLnNlZWtFbmFibGVkID0gZnVuY3Rpb24gKGIpIHtcblx0XHRpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gX3NlZWs7XG5cdFx0X3NlZWsgPSBiO1xuXHR9O1xuXHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdF90SWQgPSBudWxsO1xuXHRcdF9zZWVrID0gdHJ1ZTtcblx0XHRfZG9jJDEuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bi5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdFx0X2RvYyQxLmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cC5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdH07XG5cdHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcblx0XHRfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdF90SWQgPSBudWxsO1xuXHRcdF9zZWVrID0gdHJ1ZTtcblx0XHRfZG9jJDEuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bik7XG5cdFx0X2RvYyQxLmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cCk7XG5cdH07XG5cdHRoaXMuaW5pdCgpO1xufTtcblxuLy9odHRwczovL2dpdGh1Yi5jb20vZmRhY2l1ay9hamF4XG52YXIgYWpheCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XG4gICAgdmFyIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnXTtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLmJhc2VVcmwgPSBvcHRpb25zLmJhc2VVcmwgfHwgJyc7XG4gICAgaWYgKG9wdGlvbnMubWV0aG9kICYmIG9wdGlvbnMudXJsKSB7XG4gICAgICByZXR1cm4geGhyQ29ubmVjdGlvbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy5iYXNlVXJsICsgb3B0aW9ucy51cmwsIG1heWJlRGF0YShvcHRpb25zLmRhdGEpLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIG1ldGhvZCkge1xuICAgICAgYWNjW21ldGhvZF0gPSBmdW5jdGlvbiAodXJsLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiB4aHJDb25uZWN0aW9uKG1ldGhvZCwgb3B0aW9ucy5iYXNlVXJsICsgdXJsLCBtYXliZURhdGEoZGF0YSksIG9wdGlvbnMpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9XG5cbiAgZnVuY3Rpb24gbWF5YmVEYXRhKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YSB8fCBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24geGhyQ29ubmVjdGlvbih0eXBlLCB1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICB2YXIgcmV0dXJuTWV0aG9kcyA9IFsndGhlbicsICdjYXRjaCcsICdhbHdheXMnXTtcbiAgICB2YXIgcHJvbWlzZU1ldGhvZHMgPSByZXR1cm5NZXRob2RzLnJlZHVjZShmdW5jdGlvbiAocHJvbWlzZSwgbWV0aG9kKSB7XG4gICAgICBwcm9taXNlW21ldGhvZF0gPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgcHJvbWlzZVttZXRob2RdID0gY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sIHt9KTtcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4odHlwZSwgdXJsLCB0cnVlKTtcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnd2l0aENyZWRlbnRpYWxzJyk7XG4gICAgc2V0SGVhZGVycyh4aHIsIG9wdGlvbnMuaGVhZGVycyk7XG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCByZWFkeShwcm9taXNlTWV0aG9kcywgeGhyKSwgZmFsc2UpO1xuICAgIHhoci5zZW5kKG9iamVjdFRvUXVlcnlTdHJpbmcoZGF0YSkpO1xuICAgIHByb21pc2VNZXRob2RzLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHhoci5hYm9ydCgpO1xuICAgIH07XG4gICAgcmV0dXJuIHByb21pc2VNZXRob2RzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SGVhZGVycyh4aHIsIGhlYWRlcnMpIHtcbiAgICBoZWFkZXJzID0gaGVhZGVycyB8fCB7fTtcbiAgICBpZiAoIWhhc0NvbnRlbnRUeXBlKGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnO1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBoZWFkZXJzW25hbWVdICYmIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIGhlYWRlcnNbbmFtZV0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzQ29udGVudFR5cGUoaGVhZGVycykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhoZWFkZXJzKS5zb21lKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJztcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWR5KHByb21pc2VNZXRob2RzLCB4aHIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlUmVhZHkoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IHhoci5ET05FKSB7XG4gICAgICAgIHhoci5yZW1vdmVFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgaGFuZGxlUmVhZHksIGZhbHNlKTtcbiAgICAgICAgcHJvbWlzZU1ldGhvZHMuYWx3YXlzLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpO1xuXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgcHJvbWlzZU1ldGhvZHMudGhlbi5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlTWV0aG9kcy5jYXRjaC5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlKHhocikge1xuICAgIHZhciByZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzdWx0ID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIFtyZXN1bHQsIHhocl07XG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RUb1F1ZXJ5U3RyaW5nKGRhdGEpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoZGF0YSkgPyBnZXRRdWVyeVN0cmluZyhkYXRhKSA6IGRhdGE7XG4gIH1cblxuICBmdW5jdGlvbiBpc09iamVjdChkYXRhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRhKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZyhvYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgaXRlbSkge1xuICAgICAgdmFyIHByZWZpeCA9ICFhY2MgPyAnJyA6IGFjYyArICcmJztcbiAgICAgIHJldHVybiBwcmVmaXggKyBlbmNvZGUoaXRlbSkgKyAnPScgKyBlbmNvZGUob2JqZWN0W2l0ZW1dKTtcbiAgICB9LCAnJyk7XG4gIH1cblxuICBmdW5jdGlvbiBlbmNvZGUodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiBhamF4O1xufSkoKTtcblxuY29uc3QgZm5fY29udGV4dG1lbnUkMSA9IGZ1bmN0aW9uIChlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0cmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgZGVmYXVsdHMkNCA9IHtcblx0dmlkZW9XaWR0aDogOTIwLFxuXHR2aWRlb0hlaWdodDogNTIwLFxuXHRhdXRvcGxheTogZmFsc2UsXG5cdGxvb3A6IGZhbHNlLFxuXHRjb250cm9sczogZmFsc2UsXG5cdGZvbnQ6IHtcblx0XHRyYXRpbzogMSxcblx0XHRtaW46IC41LFxuXHRcdHVuaXRzOiBcImVtXCJcblx0fSxcblx0Y29udGV4dE1lbnU6IGZhbHNlXG59O1xuXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBNZWRpYSB7XG5cdGNvbnN0cnVjdG9yKHNldHRpbmdzLCBfZXZlbnRzKSB7XG5cdFx0bGV0IGVsID0gc2V0dGluZ3MudmlkZW87XG5cdFx0c3VwZXIoZWwpO1xuXHRcdGlmIChlbCA9PSBudWxsKSByZXR1cm47XG5cdFx0dGhpcy5kZXZpY2UgPSBkZXZpY2U7XG5cdFx0dGhpcy5fX3NldHRpbmdzID0ge307XG5cdFx0ZG9tLmFkZENsYXNzKGVsLCBcImttbFwiICsgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpKTtcblx0XHR0aGlzLndyYXBwZXIgPSBkb20ud3JhcCh0aGlzLm1lZGlhLCBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdFx0Y2xhc3M6ICdrbWxQbGF5ZXInXG5cdFx0fSkpO1xuXHRcdGRvbS50cmlnZ2VyV2Via2l0SGFyZHdhcmVBY2NlbGVyYXRpb24odGhpcy53cmFwcGVyKTtcblxuXHRcdC8vaW5pdFNldHRpbmdzXG5cdFx0dGhpcy5zZXR0aW5ncyhkZWVwbWVyZ2UoZGVmYXVsdHMkNCwgc2V0dGluZ3MpKTtcblxuXHRcdC8vaW5pdFBhZ2VWaXNpYmlsaXR5XG5cdFx0dGhpcy5wYWdlVmlzaWJpbGl0eSA9IG5ldyBwYWdlVmlzaWJpbGl0eShlbCk7XG5cblx0XHQvL2luaXRleHRlcm5hbENvbnRyb2xzXG5cdFx0dGhpcy5leHRlcm5hbENvbnRyb2xzID0gbmV3IGV4dGVybmFsQ29udHJvbHMoZWwpO1xuXG5cdFx0Ly9pbml0Q2FsbGJhY2tFdmVudHNcblx0XHRmb3IgKHZhciBldnQgaW4gX2V2ZW50cykge1xuXHRcdFx0dGhpcy5vbihldnQsIF9ldmVudHNbZXZ0XSwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5vbignbG9hZGVkbWV0YWRhdGEnLCAoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5tZWRpYS53aWR0aCAhPSB0aGlzLm1lZGlhLnZpZGVvV2lkdGggfHwgdGhpcy5tZWRpYS5oZWlnaHQgIT0gdGhpcy5tZWRpYS52aWRlb0hlaWdodCkge1xuXHRcdFx0XHR0aGlzLnZpZGVvV2lkdGgoKTtcblx0XHRcdFx0dGhpcy52aWRlb0hlaWdodCgpO1xuXHRcdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0c2V0dGluZ3Moc2V0dGluZ3MpIHtcblx0XHRpZiAoc2V0dGluZ3MgPT0gbnVsbCkgcmV0dXJuIHRoaXMuX19zZXR0aW5ncztcblx0XHR0aGlzLl9fc2V0dGluZ3MgPSBkZWVwbWVyZ2UodGhpcy5fX3NldHRpbmdzLCBzZXR0aW5ncyk7XG5cdFx0Ly9pbml0U2V0dGluZ3Ncblx0XHRmb3IgKHZhciBrIGluIHRoaXMuX19zZXR0aW5ncykge1xuXHRcdFx0aWYgKHRoaXNba10pIHtcblx0XHRcdFx0aWYgKGsgPT09ICdhdXRvcGxheScgJiYgdGhpcy5fX3NldHRpbmdzW2tdKSB7XG5cdFx0XHRcdFx0dGhpcy5wbGF5KCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpc1trXSh0aGlzLl9fc2V0dGluZ3Nba10pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGsgPT09ICdjb250cm9scycgJiYgdGhpcy5fX3NldHRpbmdzW2tdID09PSBcIm5hdGl2ZVwiKSB7XG5cdFx0XHRcdHRoaXMubmF0aXZlQ29udHJvbHModHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9fc2V0dGluZ3M7XG5cdH1cblxuXHRjb250ZXh0TWVudSh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHYgPyB0aGlzLm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUkMSkgOiB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUkMSk7XG5cdFx0fVxuXHR9XG5cblx0YWpheChvcHRpb25zKSB7XG5cdFx0cmV0dXJuIGFqYXgob3B0aW9ucyk7XG5cdH1cblxuXHR2aWRlb1dpZHRoKHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb1dpZHRoKSB7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdGhpcy5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEud2lkdGg7XG5cdH1cblxuXHR2aWRlb0hlaWdodCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9IZWlnaHQpIHtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdGhpcy5tZWRpYS52aWRlb0hlaWdodDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdH1cblx0XHRpZiAoIWlzTmFOKHYpKSB7XG5cdFx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuaGVpZ2h0O1xuXHR9XG5cblx0c2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMudmlkZW9XaWR0aCgpIC8gdGhpcy52aWRlb0hlaWdodCgpO1xuXHR9XG5cblx0Ym91bmRzKHYpIHtcblx0XHRsZXQgZGF0YSA9IGNvbnRhaW5lckJvdW5kcyh0aGlzLm1lZGlhKTtcblx0XHRpZiAoZGF0YVt2XSAhPT0gbnVsbCkgcmV0dXJuIGRhdGFbdl07XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHR3aWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ3dpZHRoJyk7XG5cdH1cblxuXHRoZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdoZWlnaHQnKTtcblx0fVxuXG5cdG9mZnNldFgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRYJyk7XG5cdH1cblxuXHRvZmZzZXRZKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnb2Zmc2V0WScpO1xuXHR9XG5cblx0d3JhcHBlckhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHR3cmFwcGVyV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGg7XG5cdH1cblxuXHR3cmFwcGVyU2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGggLyB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdGFkZENsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS5hZGRDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGRvbS5hZGRDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHR9XG5cdHJlbW92ZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS5yZW1vdmVDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLnJlbW92ZUNsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG5cdHRvZ2dsZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS50b2dnbGVDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLnRvZ2dsZUNsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG59O1xuXG5jbGFzcyB2aWRlb0NvbnRhaW5lciBleHRlbmRzIFBvcHVwIHtcblx0Y29uc3RydWN0b3IoZWwsIG9wdHMsIGN0eCwgcGFyZW50UGxheWVyKSB7XG5cdFx0c3VwZXIoZWwsIG9wdHMsIGN0eCwgcGFyZW50UGxheWVyKTtcblx0XHRsZXQgZG9tVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXHRcdHRoaXMuYm9keS5hcHBlbmRDaGlsZChkb21WaWRlbyk7XG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHsgdmlkZW86IGRvbVZpZGVvIH0pO1xuXHRcdHRoaXMucGxheWVyLmNvbnRhaW5lcjtcblx0XHRsZXQgcGF1c2VkID0gZmFsc2U7XG5cdFx0dGhpcy5vbignYmVmb3JlSGlkZScsICgpID0+IHtcblx0XHRcdHBhdXNlZCA9IHRoaXMucGxheWVyLnBhdXNlZCgpO1xuXHRcdFx0dGhpcy5wbGF5ZXIucGF1c2UoKTtcblx0XHR9KTtcblx0XHR0aGlzLm9uKCdzaG93JywgKCkgPT4ge1xuXHRcdFx0aWYgKCFwYXVzZWQpIHtcblx0XHRcdFx0dGhpcy5wbGF5ZXIucGxheSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMub24oJ2VuZGVkJywgKCkgPT4ge1xuXHRcdFx0aWYgKGlzRnVuY3Rpb24ob3B0cy5vbkVuZGVkKSkgb3B0cy5vbkVuZGVkKCk7XG5cdFx0fSk7XG5cdFx0b3B0cy5zaXplUmF0aW8gPSBvcHRzLnNpemVSYXRpbyB8fCA4MDtcblx0XHR0aGlzLnNjYWxlU2l6ZSA9IGZ1bmN0aW9uIChzKSB7XG5cdFx0XHRvcHRzLnNpemVSYXRpbyA9IHM7XG5cdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdH07XG5cdFx0dGhpcy5wbGF5ZXIub24oJ2VuZGVkJywgKCkgPT4ge1xuXHRcdFx0dGhpcy5lbWl0KCdlbmRlZCcpO1xuXHRcdH0pO1xuXHRcdHRoaXMub24oJ3Jlc2l6ZScsICgpID0+IHtcblx0XHRcdGxldCB5ID0gMDtcblx0XHRcdGxldCB4ID0gMDtcblx0XHRcdGxldCB3ID0gcGFyZW50UGxheWVyLndpZHRoKCk7XG5cdFx0XHRsZXQgaCA9IHBhcmVudFBsYXllci5oZWlnaHQoKTtcblx0XHRcdGxldCByID0gdGhpcy5wbGF5ZXIuc2NhbGUoKTtcblx0XHRcdGxldCBmdyA9IHc7bGV0IGZoID0gaDtcblx0XHRcdGxldCB3dyA9IHc7bGV0IGhoID0gaDtcblx0XHRcdGxldCBoZWFkZXJIZWlnaHQgPSAxMDtcblx0XHRcdGlmICh3ID4gciAqIGgpIHtcblx0XHRcdFx0ZncgPSByICogaDtcblx0XHRcdFx0ZmggPSBoO1xuXHRcdFx0XHR3dyA9IGZ3O1xuXHRcdFx0XHRoZWFkZXJIZWlnaHQgPSBoIC8gMTAgLyBmaCAqIDEwMDtcblx0XHRcdFx0ZncgPSBvcHRzLnNpemVSYXRpbyAqIChmdyAvIHcgKiAxMDApIC8gMTAwO1xuXHRcdFx0XHRmaCA9IG9wdHMuc2l6ZVJhdGlvO1xuXHRcdFx0fSBlbHNlIGlmIChoID4gdyAvIHIpIHtcblx0XHRcdFx0ZmggPSB3IC8gcjtcblx0XHRcdFx0ZncgPSB3O1xuXHRcdFx0XHRoaCA9IGZoO1xuXHRcdFx0XHRoZWFkZXJIZWlnaHQgPSBoIC8gMTAgLyBmaCAqIDEwMDtcblx0XHRcdFx0ZmggPSBvcHRzLnNpemVSYXRpbyAqIChmaCAvIGggKiAxMDApIC8gMTAwO1xuXHRcdFx0XHRmdyA9IG9wdHMuc2l6ZVJhdGlvO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZncgPSBvcHRzLnNpemVSYXRpbztcblx0XHRcdFx0ZmggPSBvcHRzLnNpemVSYXRpbztcblx0XHRcdH07XG5cdFx0XHR4ID0gKDEwMCAtIGZ3KSAvIDI7XG5cdFx0XHR5ID0gKDEwMCAtIGZoKSAvIDI7XG5cdFx0XHQvL3RoaXMuX3RpdGxlLnBhcmVudE5vZGUuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTEwMCUpJztcdFxuXHRcdFx0dGhpcy5fdGl0bGUucGFyZW50Tm9kZS5zdHlsZS5oZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyAnJSc7XG5cdFx0XHR0aGlzLmNvbmZpZyh7XG5cdFx0XHRcdHg6IHggLyB3ICogd3cgKyAnJScsXG5cdFx0XHRcdHk6IDUgKyB5IC8gaCAqIGhoICsgJyUnLFxuXHRcdFx0XHR3aWR0aDogZncgKyBcIiVcIixcblx0XHRcdFx0aGVpZ2h0OiBmaCArIFwiJVwiXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuYXV0b0xpbmVIZWlnaHQoKTtcblx0XHR9KTtcblxuXHRcdHBhcmVudFBsYXllci5vbignbG9hZGVkbWV0YWRhdGEnLCAoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGxheWVyLm9uKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcblx0XHRcdHRoaXMuZW1pdCgncmVzaXplJyk7XG5cdFx0fSk7XG5cdFx0dGhpcy5wbGF5ZXIubG9hZChvcHRzLnVybCk7XG5cdH1cbn1cblxubGV0IGRlZmF1bHRzJDEgPSB7XG5cdGJhY2tncm91bmRDb2xvcjogJycsXG5cdG9uSGlkZTogbnVsbCxcblx0b25TaG93OiBudWxsLFxuXHRleHRlcm5hbENvbnRyb2xzOiB0cnVlLFxuXHR2aXNpYmxlOiBmYWxzZSxcblx0cGF1c2U6IHRydWVcbn07XG5cbmNsYXNzIENvbnRhaW5lcnMge1xuXHRjb25zdHJ1Y3RvcihjdHgpIHtcblx0XHR0aGlzLndyYXBwZXIgPSBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdFx0Y2xhc3M6ICdrbWxDb250YWluZXJzJ1xuXHRcdH0pO1xuXHRcdHRoaXMuX2VscyA9IFtdO1xuXHRcdGxldCBhYyA9IG5ldyBhZGFwdGl2ZVNpemVQb3Moe30sIGN0eCk7XG5cdFx0YWMuYXBwbHlUbyh0aGlzLndyYXBwZXIpO1xuXG5cdFx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24gKHYpIHtcblx0XHRcdGlmICh2ICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKHYgPT0gMCkge1xuXHRcdFx0XHRcdHYgPSBmYWxzZTtcblx0XHRcdFx0XHR0aGlzLndyYXBwZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2KSB7XG5cdFx0XHRcdFx0dGhpcy53cmFwcGVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0YWMuZW5hYmxlZCh2KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhYy5lbmFibGVkKCk7XG5cdFx0fTtcblxuXHRcdHRoaXMuY2hlY2tWaXNpYmxlRWxlbWVudHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRsZXQgbm8gPSAwO1xuXHRcdFx0Zm9yICh2YXIgayBpbiB0aGlzLl9lbHMpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2Vsc1trXS52aXNpYmxlKCkpIHtcblx0XHRcdFx0XHRubyArPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmVuYWJsZWQobm8pO1xuXHRcdH07XG5cblx0XHRjdHgud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLndyYXBwZXIpO1xuXG5cdFx0bGV0IGN1cnJlbnRWaXNpYmxlcyA9IFtdO1xuXHRcdHRoaXMuaGlkZSA9IGZ1bmN0aW9uIChjdXJyZW50KSB7XG5cdFx0XHRmb3IgKHZhciBrIGluIHRoaXMuX2Vscykge1xuXHRcdFx0XHRsZXQgY3VycmVudENvbnRhaW5lciA9IHRoaXMuX2Vsc1trXTtcblx0XHRcdFx0aWYgKHRoaXMuX2Vsc1trXSAhPT0gY3VycmVudCkge1xuXHRcdFx0XHRcdGlmIChjdXJyZW50Q29udGFpbmVyLnZpc2libGUoKSkge1xuXHRcdFx0XHRcdFx0Y3VycmVudENvbnRhaW5lci5oaWRlKCk7XG5cdFx0XHRcdFx0XHRjdXJyZW50VmlzaWJsZXMucHVzaChjdXJyZW50Q29udGFpbmVyKTtcblx0XHRcdFx0XHRcdGN1cnJlbnRDb250YWluZXIudmlzaWJsZShmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHRoaXMuc2hvdyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGZvciAodmFyIGsgaW4gY3VycmVudFZpc2libGVzKSB7XG5cdFx0XHRcdGN1cnJlbnRWaXNpYmxlc1trXS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHRjdXJyZW50VmlzaWJsZXMgPSBbXTtcblx0XHR9O1xuXG5cdFx0dGhpcy5hZGQgPSBmdW5jdGlvbiAob3B0cywgZWwgPSB7fSwgdHlwZSkge1xuXHRcdFx0bGV0IGNscyA9ICdDb250YWluZXInO1xuXHRcdFx0aWYgKHR5cGUgIT0gJ2NvbnRhaW5lcicpIGNscyA9ICdQb3B1cCc7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSBkZWVwbWVyZ2UoZGVmYXVsdHMkMSwgb3B0cyk7XG5cdFx0XHRsZXQgY29udGFpbmVySG9sZGVyID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Y3R4LmFkZENsYXNzKGNvbnRhaW5lckhvbGRlciwgJ2ttbCcgKyBjbHMgKyAnIGhpZGRlbicpO1xuXHRcdFx0bGV0IGttbENvbnRhaW5lckJvZHkgPSBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRpZiAoZWwpIHtcblx0XHRcdFx0aWYgKCFlbC5ub2RlVHlwZSkge1xuXHRcdFx0XHRcdGVsID0ga21sQ29udGFpbmVyQm9keTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWwgPSBrbWxDb250YWluZXJCb2R5O1xuXHRcdFx0fVxuXHRcdFx0ZG9tLmFkZENsYXNzKGVsLCAnYm9keScpO1xuXG5cdFx0XHRjb250YWluZXJIb2xkZXIuYXBwZW5kQ2hpbGQoZWwpO1xuXHRcdFx0bGV0IGNvbnRhaW5lciA9IG51bGw7XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAndmlkZW8nOlxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IG5ldyB2aWRlb0NvbnRhaW5lcihjb250YWluZXJIb2xkZXIsIHNldHRpbmdzLCB0aGlzLCBjdHgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdwb3B1cCc6XG5cdFx0XHRcdFx0Y29udGFpbmVyID0gbmV3IFBvcHVwKGNvbnRhaW5lckhvbGRlciwgc2V0dGluZ3MsIHRoaXMsIGN0eCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Y29udGFpbmVyID0gbmV3IENvbnRhaW5lcihjb250YWluZXJIb2xkZXIsIHNldHRpbmdzLCB0aGlzLCBjdHgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9lbHMucHVzaChjb250YWluZXIpO1xuXHRcdFx0dGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKGNvbnRhaW5lckhvbGRlcik7XG5cdFx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHRcdH07XG5cblx0XHR0aGlzLnJlbW92ZSA9IGNvbnRhaW5lciA9PiB7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbiA9IHRoaXMuX2Vscy5sZW5ndGg7IGkgPCBuOyBpICs9IDEpIHtcblx0XHRcdFx0bGV0IGMgPSB0aGlzLl9lbHNbaV07XG5cdFx0XHRcdGlmIChjLmJvZHkgPT09IGNvbnRhaW5lcikge1xuXHRcdFx0XHRcdHRoaXMuX2Vscy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2Vscy5sZW5ndGggPT0gMCkgdGhpcy5lbmFibGVkKGZhbHNlKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblx0ZWxzKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2Vsc1tpZF0gfHwgdGhpcy5fZWxzO1xuXHR9XG59XG5cbmNvbnN0IGZuX2NvbnRleHRtZW51ID0gZnVuY3Rpb24gKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcblx0dmlkZW9XaWR0aDogOTIwLFxuXHR2aWRlb0hlaWdodDogNTIwLFxuXHRhdXRvcGxheTogZmFsc2UsXG5cdGxvb3A6IGZhbHNlLFxuXHRjb250cm9sczogZmFsc2UsXG5cdGZvbnQ6IHtcblx0XHRyYXRpbzogMSxcblx0XHRtaW46IC41LFxuXHRcdHVuaXRzOiBcImVtXCJcblx0fVxufTtcblxuY2xhc3Mga21sUGxheWVyIGV4dGVuZHMgTWVkaWEge1xuXHRjb25zdHJ1Y3RvcihzZXR0aW5ncywgX2V2ZW50cywgYXBwKSB7XG5cdFx0bGV0IGVsID0gc2V0dGluZ3MudmlkZW87XG5cdFx0c3VwZXIoZWwpO1xuXHRcdHRoaXMuaWZyYW1lID0gaW5JZnJhbWUoKTtcblx0XHRpZiAoZWwgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdHRoaXMuX2JvdW5kcyA9IHt9O1xuXHRcdHRoaXMuZGV2aWNlID0gZGV2aWNlO1xuXHRcdHRoaXMuX19zZXR0aW5ncyA9IGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRcdGRvbS5hZGRDbGFzcyhlbCwgXCJrbWxcIiArIGNhcGl0YWxpemVGaXJzdExldHRlcihlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSk7XG5cdFx0dGhpcy53cmFwcGVyID0gZG9tLndyYXAodGhpcy5tZWRpYSwgZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdGNsYXNzOiAna21sUGxheWVyJ1xuXHRcdH0pKTtcblx0XHRkb20udHJpZ2dlcldlYmtpdEhhcmR3YXJlQWNjZWxlcmF0aW9uKHRoaXMud3JhcHBlcik7XG5cdFx0aWYgKHRoaXMuaW5JZnJhbWUpIHtcblx0XHRcdGRvbS5hZGRDbGFzcyh0aGlzLndyYXBwZXIsIFwiaW5GcmFtZVwiKTtcblx0XHR9XG5cdFx0Ly9pbml0U2V0dGluZ3Ncblx0XHRmb3IgKHZhciBrIGluIHRoaXMuX19zZXR0aW5ncykge1xuXHRcdFx0aWYgKHRoaXNba10pIHtcblx0XHRcdFx0aWYgKGsgPT09ICdhdXRvcGxheScgJiYgdGhpcy5fX3NldHRpbmdzW2tdICYmICF0aGlzLmluSWZyYW1lKSB7XG5cdFx0XHRcdFx0dGhpcy5wbGF5KCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpc1trXSh0aGlzLl9fc2V0dGluZ3Nba10pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGsgPT09ICdjb250cm9scycgJiYgdGhpcy5fX3NldHRpbmdzW2tdID09PSBcIm5hdGl2ZVwiKSB7XG5cdFx0XHRcdHRoaXMubmF0aXZlQ29udHJvbHModHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly9pbml0UGFnZVZpc2liaWxpdHlcblx0XHR0aGlzLnBhZ2VWaXNpYmlsaXR5ID0gbmV3IHBhZ2VWaXNpYmlsaXR5KGVsKTtcblxuXHRcdC8vaW5pdGV4dGVybmFsQ29udHJvbHNcblx0XHR0aGlzLmV4dGVybmFsQ29udHJvbHMgPSBuZXcgZXh0ZXJuYWxDb250cm9scyhlbCk7XG5cblx0XHQvL2luaXRDb250YWluZXJzXG5cdFx0dGhpcy5jb250YWluZXJzID0gbmV3IENvbnRhaW5lcnModGhpcyk7XG5cblx0XHR0aGlzLmNvbnRhaW5lciA9IGZ1bmN0aW9uIChzdGcsIGVsKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb250YWluZXJzLmFkZChzdGcsIGVsLCAnY29udGFpbmVyJyk7XG5cdFx0fTtcblxuXHRcdHRoaXMudmlkZW9Db250YWluZXIgPSBmdW5jdGlvbiAoc3RnKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb250YWluZXJzLmFkZChzdGcsIG51bGwsICd2aWRlbycpO1xuXHRcdH07XG5cblx0XHR0aGlzLnBvcHVwQ29udGFpbmVyID0gZnVuY3Rpb24gKHN0Zykge1xuXHRcdFx0cmV0dXJuIHRoaXMuY29udGFpbmVycy5hZGQoc3RnLCBudWxsLCAncG9wdXAnKTtcblx0XHR9O1xuXG5cdFx0Ly9hdXRvRk9OVFxuXHRcdGlmICh0eXBlb2YgdGhpcy5fX3NldHRpbmdzLmZvbnQgPT09IFwiYm9vbGVhblwiICYmIHRoaXMuX19zZXR0aW5ncy5mb250KSB0aGlzLl9fc2V0dGluZ3MuZm9udCA9IGRlZmF1bHRzLmZvbnQ7XG5cdFx0dGhpcy5hdXRvRm9udCA9IG5ldyBhdXRvRm9udCh0aGlzLndyYXBwZXIsIHRoaXMuX19zZXR0aW5ncy5mb250LCB0aGlzKTtcblx0XHRpZiAodGhpcy5fX3NldHRpbmdzLmZvbnQpIHRoaXMuYXV0b0ZvbnQuZW5hYmxlZCh0cnVlKTtcblxuXHRcdC8vaW5pdENhbGxiYWNrRXZlbnRzXG5cdFx0Zm9yICh2YXIgZXZ0IGluIF9ldmVudHMpIHtcblx0XHRcdHRoaXMub24oZXZ0LCBfZXZlbnRzW2V2dF0sIHRoaXMpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgYXBwID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRhcHAuYmluZCh0aGlzKTtcblx0XHR9XG5cblx0XHR0aGlzLm9uKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcblx0XHRcdGlmICh0aGlzLm1lZGlhLndpZHRoICE9IHRoaXMubWVkaWEudmlkZW9XaWR0aCB8fCB0aGlzLm1lZGlhLmhlaWdodCAhPSB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0KSB7XG5cdFx0XHRcdHRoaXMudmlkZW9XaWR0aCgpO1xuXHRcdFx0XHR0aGlzLnZpZGVvSGVpZ2h0KCk7XG5cdFx0XHRcdHRoaXMuZW1pdCgncmVzaXplJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXRoaXMuX2FwcCkge1xuXHRcdFx0XHRhcHAuYmluZCh0aGlzKSgpO1xuXHRcdFx0XHR0aGlzLl9hcHAgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignZGJsdGFwJywgKCkgPT4ge1xuXHRcdFx0dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XG5cdFx0fSk7XG5cblx0XHRsZXQgdmlkZW9TaXplQ2FjaGUgPSB7XG5cdFx0XHR3OiB0aGlzLndpZHRoKCksXG5cdFx0XHR4OiB0aGlzLm9mZnNldFgoKSxcblx0XHRcdHk6IHRoaXMub2Zmc2V0WSgpLFxuXHRcdFx0aDogdGhpcy5oZWlnaHQoKVxuXHRcdH07XG5cdFx0bGV0IGNoZWNrVmlkZW9SZXNpemUgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLl9ib3VuZHMgPSBjb250YWluZXJCb3VuZHModGhpcy5tZWRpYSk7XG5cdFx0XHRsZXQgdyA9IHRoaXMud2lkdGgoKTtcblx0XHRcdGxldCBoID0gdGhpcy53aWR0aCgpO1xuXHRcdFx0bGV0IHggPSB0aGlzLm9mZnNldFgoKTtcblx0XHRcdGxldCB5ID0gdGhpcy5vZmZzZXRZKCk7XG5cdFx0XHRpZiAodmlkZW9TaXplQ2FjaGUudyAhPSB3IHx8IHZpZGVvU2l6ZUNhY2hlLmggIT0gaCB8fCB2aWRlb1NpemVDYWNoZS54ICE9IHggfHwgdmlkZW9TaXplQ2FjaGUueSAhPSB5KSB7XG5cdFx0XHRcdHZpZGVvU2l6ZUNhY2hlLncgPSB3O1xuXHRcdFx0XHR2aWRlb1NpemVDYWNoZS5oID0gaDtcblx0XHRcdFx0dmlkZW9TaXplQ2FjaGUueCA9IHg7XG5cdFx0XHRcdHZpZGVvU2l6ZUNhY2hlLnkgPSB5O1xuXHRcdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjaGVja1ZpZGVvUmVzaXplKTtcblx0XHR9O1xuXG5cdFx0Y2hlY2tWaWRlb1Jlc2l6ZSgpO1xuXHR9XG5cblx0Y29udGV4dE1lbnUodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR2ID8gdGhpcy5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZuX2NvbnRleHRtZW51KSA6IHRoaXMubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmbl9jb250ZXh0bWVudSk7XG5cdFx0fVxuXHR9XG5cblx0YWpheChvcHRpb25zKSB7XG5cdFx0cmV0dXJuIGFqYXgob3B0aW9ucyk7XG5cdH1cblxuXHR2aWRlb1dpZHRoKHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb1dpZHRoKSB7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdGhpcy5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEud2lkdGg7XG5cdH1cblxuXHR2aWRlb0hlaWdodCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9IZWlnaHQpIHtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdGhpcy5tZWRpYS52aWRlb0hlaWdodDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdH1cblx0XHRpZiAoIWlzTmFOKHYpKSB7XG5cdFx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuaGVpZ2h0O1xuXHR9XG5cblx0c2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMudmlkZW9XaWR0aCgpIC8gdGhpcy52aWRlb0hlaWdodCgpO1xuXHR9XG5cblx0Ym91bmRzKHYpIHtcblx0XHRpZiAodGhpcy5fYm91bmRzW3ZdICE9PSBudWxsKSByZXR1cm4gdGhpcy5fYm91bmRzW3ZdO1xuXHRcdHJldHVybiB0aGlzLl9ib3VuZHM7XG5cdH1cblxuXHR3aWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ3dpZHRoJyk7XG5cdH1cblxuXHRoZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdoZWlnaHQnKTtcblx0fVxuXG5cdG9mZnNldFgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRYJyk7XG5cdH1cblxuXHRvZmZzZXRZKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnb2Zmc2V0WScpO1xuXHR9XG5cblx0d3JhcHBlckhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHR3cmFwcGVyV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGg7XG5cdH1cblxuXHR3cmFwcGVyU2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGggLyB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdGFkZENsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS5hZGRDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGRvbS5hZGRDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHR9XG5cdHJlbW92ZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS5yZW1vdmVDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLnJlbW92ZUNsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG5cdHRvZ2dsZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS50b2dnbGVDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLnRvZ2dsZUNsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG59O1xuXG4vL2Rpc2FibGUgb24gcHJvZHVjdGlvblxuaWYgKGRldmljZS5pc1RvdWNoKSB7XG5cdHdpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UsIHNjcmlwdFVybCwgbGluZSwgY29sdW1uKSB7XG5cdFx0Y29uc29sZS5sb2cobGluZSwgY29sdW1uLCBtZXNzYWdlKTtcblx0XHRhbGVydChsaW5lICsgXCI6XCIgKyBjb2x1bW4gKyBcIi1cIiArIG1lc3NhZ2UpO1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBrbWxQbGF5ZXI7Il0sIm5hbWVzIjpbImJhYmVsSGVscGVycy50eXBlb2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQSxDQUFDLFlBQVk7QUFDVCxFQUFBLEtBQUksV0FBVyxDQUFmO0FBQ0EsRUFBQSxLQUFJLFVBQVUsQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLFFBQWQsRUFBd0IsR0FBeEIsQ0FBZDtBQUNBLEVBQUEsTUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFFBQVEsTUFBWixJQUFzQixDQUFDLE9BQU8scUJBQTlDLEVBQXFFLEVBQUUsQ0FBdkUsRUFBMEU7QUFDdEUsRUFBQSxTQUFPLHFCQUFQLEdBQStCLE9BQU8sUUFBUSxDQUFSLElBQWEsdUJBQXBCLENBQS9CO0FBQ0EsRUFBQSxTQUFPLG9CQUFQLEdBQThCLE9BQU8sUUFBUSxDQUFSLElBQWEsc0JBQXBCLEtBQStDLE9BQU8sUUFBUSxDQUFSLElBQWEsNkJBQXBCLENBQTdFO0FBQ0gsRUFBQTs7QUFFRCxFQUFBLEtBQUksQ0FBQyxPQUFPLHFCQUFSLElBQWlDLHVCQUF1QixJQUF2QixDQUE0QixPQUFPLFNBQVAsQ0FBaUIsU0FBN0MsQ0FBckMsRUFBOEYsT0FBTyxxQkFBUCxHQUErQixVQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkI7QUFDdEosRUFBQSxNQUFJLFdBQVcsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUFmO0FBQ0EsRUFBQSxNQUFJLGFBQWEsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU0sV0FBVyxRQUFqQixDQUFaLENBQWpCO0FBQ0EsRUFBQSxNQUFJLEtBQUssT0FBTyxVQUFQLENBQWtCLFlBQVk7QUFDbkMsRUFBQSxZQUFTLFdBQVcsVUFBcEI7QUFDSCxFQUFBLEdBRlEsRUFFTixVQUZNLENBQVQ7QUFHQSxFQUFBLGFBQVcsV0FBVyxVQUF0QjtBQUNBLEVBQUEsU0FBTyxF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
