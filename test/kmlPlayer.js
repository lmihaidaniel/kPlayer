/*! kmlplayer.js - v0.3.1 */
var kmlPlayer = (function () {
    'use strict';

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

    var deepmerge = (function () {
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
    })();

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

    var defaults$3 = {
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
    	var settings = deepmerge(defaults$3, setttings);
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

    var has = Object.prototype.hasOwnProperty;
    var prefix = '~';
    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @api private
     */
    function Events() {}

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
      Events.prototype = Object.create(null);

      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new Events().__proto__) prefix = false;
    }

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {Mixed} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @api private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @api public
     */
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @api public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = [],
          events,
          name;

      if (this._eventsCount === 0) return names;

      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {String|Symbol} event The event name.
     * @param {Boolean} exists Only check if there are listeners.
     * @returns {Array|Boolean}
     * @api public
     */
    EventEmitter.prototype.listeners = function listeners(event, exists) {
      var evt = prefix ? prefix + event : event,
          available = this._events[evt];

      if (exists) return !!available;
      if (!available) return [];
      if (available.fn) return [available.fn];

      for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
        ee[i] = available[i].fn;
      }

      return ee;
    };

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {String|Symbol} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @api public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return false;

      var listeners = this._events[evt],
          len = arguments.length,
          args,
          i;

      if (listeners.fn) {
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
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);break;
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
     * Add a listener for a given event.
     *
     * @param {String|Symbol} event The event name.
     * @param {Function} fn The listener function.
     * @param {Mixed} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @api public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      var listener = new EE(fn, context || this),
          evt = prefix ? prefix + event : event;

      if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;else if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];

      return this;
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {String|Symbol} event The event name.
     * @param {Function} fn The listener function.
     * @param {Mixed} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @api public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      var listener = new EE(fn, context || this, true),
          evt = prefix ? prefix + event : event;

      if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;else if (!this._events[evt].fn) this._events[evt].push(listener);else this._events[evt] = [this._events[evt], listener];

      return this;
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {String|Symbol} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {Mixed} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @api public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return this;
      if (!fn) {
        if (--this._eventsCount === 0) this._events = new Events();else delete this._events[evt];
        return this;
      }

      var listeners = this._events[evt];

      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          if (--this._eventsCount === 0) this._events = new Events();else delete this._events[evt];
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else if (--this._eventsCount === 0) this._events = new Events();else delete this._events[evt];
      }

      return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {String|Symbol} event The event name.
     * @returns {EventEmitter} `this`.
     * @api public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;

      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) {
          if (--this._eventsCount === 0) this._events = new Events();else delete this._events[evt];
        }
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }

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

    var defaults$4 = {
    	x: 0,
    	y: 0,
    	width: 0,
    	height: 0
    };
    var relativeSizePos = function relativeSizePos(ctx, settings) {
    	var parentWidth = ctx.videoWidth() || ctx.width || 1;
    	var parentHeight = ctx.videoHeight() || ctx.height || 1;
    	var o = deepmerge(defaults$4, settings);
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
    }(EventEmitter);

    var Popup = function (_Container) {
    	inherits(Popup, _Container);

    	function Popup(el, opts, ctx, parentPlayer) {
    		classCallCheck(this, Popup);

    		var _this = possibleConstructorReturn(this, _Container.call(this, el, opts, ctx, parentPlayer));

    		var overlay = dom.createElement('div');
    		dom.addClass(overlay, 'overlay triggerClose');
    		dom.insertBefore(overlay, _this.body);
    		//header
    		var header = document.createElement('h1');
    		dom.addClass(header, 'header');
    		_this._title = document.createElement('span');
    		header.appendChild(_this._title);
    		_this._closeBtn = document.createElement('a');
    		_this._closeBtn.innerHTML = "<img src='svg/ic_close.svg'/>";
    		dom.addClass(_this._closeBtn, 'closeBtn');
    		_this._closeBtn.addEventListener('click', _this.hide);
    		header.appendChild(_this._closeBtn);
    		_this.body.appendChild(header);
    		//end header

    		_this.backgroundColor = function (v) {
    			if (v != null) {
    				overlay.style.backgroundColor = v;
    			}
    			return overlay.style.backgroundColor;
    		};

    		_this.scaleSize = function (s) {
    			this.config({ x: (100 - s) / 2 + "%", y: (100 - s) / 2 + "%", width: s + "%", height: s + "%" });
    		};

    		//EVENTS
    		parentPlayer.on('resize', function () {
    			_this.emit('resize');
    		});

    		['resize', 'config', 'beforeShow'].map(function (evt) {
    			_this.on(evt, function () {
    				console.log(evt);
    				_this.autoLineHeight();
    			});
    		});

    		var clsElements = dom.selectAll('.triggerClose', el);
    		for (var i = 0, n = clsElements.length; i < n; i += 1) {
    			clsElements[i].addEventListener('click', _this.hide);
    		}
    		return _this;
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

    function scrollPosition () {
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

    var Fullscreen = function (_Events) {
        inherits(Fullscreen, _Events);

        function Fullscreen() {
            classCallCheck(this, Fullscreen);

            var _this = possibleConstructorReturn(this, _Events.call(this));

            _this.iframe = null;
            _this.scrollPosition = new scrollPosition();
            _this._fullscreenElement = null;
            _this.fullscreenElementStyle = {};
            if (supportsFullScreen) {
                var fnFullscreenChange = function fnFullscreenChange() {
                    if (!_this.isFullScreen()) {
                        setTimeout(_this.scrollPosition.restore, 100);
                    }
                };
                document.addEventListener(eventChange, fnFullscreenChange, false);
            }
            return _this;
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
    }(EventEmitter);

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
    var _events = ['ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'playing', 'pause', 'error', 'seeking', 'emptied', 'seeked', 'ratechange', 'suspend'];

    var Media = function (_Fullscreen) {
    	inherits(Media, _Fullscreen);

    	function Media(el) {
    		classCallCheck(this, Media);

    		var _this = possibleConstructorReturn(this, _Fullscreen.call(this));

    		if (el == null) {
    			ErrorFormatException("You need to supply a HTMLVideoElement to instantiate the player");
    			return possibleConstructorReturn(_this);
    		}
    		_this.media = el;
    		_events.forEach(function (k) {
    			el.addEventListener(k, function () {
    				_this.emit(k);
    			});
    		});

    		_this.canPlay = {
    			mp4: mimeVideo(el, 'video/mp4'),
    			webm: mimeVideo(el, 'video/webm'),
    			ogg: mimeVideo(el, 'video/ogg')
    		};
    		return _this;
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

    var containerBounds = (function () {
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

    var isAvailable = function isAvailable() {
    	return !(typeof _doc[hidden] === "undefined");
    };

    function pageVisibility(_media) {
    	var _this = this;

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

    			_this.init = initVisibility;
    			_this.destroy = destroyVisibility;
    			_this.on = function (event, fn) {
    				if (event in events) events[event] = fn;
    			};
    			_this.enabled = function (v) {
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
    var _ajax = (function () {

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

    var fn_contextmenu$1 = function fn_contextmenu(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	return false;
    };

    var defaults$5 = {
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

    		var _this = possibleConstructorReturn(this, _Media.call(this, el));

    		if (el == null) return possibleConstructorReturn(_this);
    		_this.device = device;
    		_this.__settings = {};
    		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
    		_this.wrapper = dom.wrap(_this.media, dom.createElement('div', {
    			class: 'kmlPlayer'
    		}));
    		dom.triggerWebkitHardwareAcceleration(_this.wrapper);

    		//initSettings
    		_this.settings(deepmerge(defaults$5, settings));

    		//initPageVisibility
    		_this.pageVisibility = new pageVisibility(el);

    		//initexternalControls
    		_this.externalControls = new externalControls(el);

    		//initCallbackEvents
    		for (var evt in _events) {
    			_this.on(evt, _events[evt], _this);
    		}

    		_this.on('loadedmetadata', function () {
    			if (_this.media.width != _this.media.videoWidth || _this.media.height != _this.media.videoHeight) {
    				_this.videoWidth();
    				_this.videoHeight();
    				_this.emit('resize');
    			}
    		});

    		return _this;
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

    var videoContainer = function (_Popup) {
    	inherits(videoContainer, _Popup);

    	function videoContainer(el, opts, ctx, parentPlayer) {
    		classCallCheck(this, videoContainer);

    		var _this = possibleConstructorReturn(this, _Popup.call(this, el, opts, ctx, parentPlayer));

    		var domVideo = document.createElement('video');
    		_this.body.appendChild(domVideo);
    		_this.player = new Player({ video: domVideo });
    		_this.player.container;
    		var paused = false;
    		_this.on('beforeHide', function () {
    			paused = _this.player.paused();
    			_this.player.pause();
    		});
    		_this.on('show', function () {
    			if (!paused) {
    				_this.player.play();
    			}
    		});
    		_this.on('ended', function () {
    			if (isFunction(opts.onEnded)) opts.onEnded();
    		});
    		opts.sizeRatio = opts.sizeRatio || 80;
    		_this.scaleSize = function (s) {
    			opts.sizeRatio = s;
    			this.emit('resize');
    		};
    		_this.player.on('ended', function () {
    			_this.emit('ended');
    		});
    		_this.on('resize', function () {
    			var y = 0;
    			var x = 0;
    			var w = parentPlayer.width();
    			var h = parentPlayer.height();
    			var r = _this.player.scale();
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
    			_this._title.parentNode.style.height = headerHeight + '%';
    			_this.config({
    				x: x / w * ww + '%',
    				y: 5 + y / h * hh + '%',
    				width: fw + "%",
    				height: fh + "%"
    			});
    			_this.autoLineHeight();
    		});

    		parentPlayer.on('loadedmetadata', function () {
    			_this.emit('resize');
    		});
    		_this.player.on('loadedmetadata', function () {
    			_this.emit('resize');
    		});
    		_this.player.load(opts.url);
    		return _this;
    	}

    	return videoContainer;
    }(Popup);

    var defaults$2 = {
    	backgroundColor: '',
    	onHide: null,
    	onShow: null,
    	externalControls: true,
    	visible: false,
    	pause: true
    };

    var Containers = function () {
    	function Containers(ctx) {
    		var _this = this;

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
    			var settings = deepmerge(defaults$2, opts);
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
    			for (var i = 0, n = _this._els.length; i < n; i += 1) {
    				var c = _this._els[i];
    				if (c.body === container) {
    					_this._els.splice(i, 1);
    					if (_this._els.length == 0) _this.enabled(false);
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

    var kmlPlayer = function (_Media) {
    	inherits(kmlPlayer, _Media);

    	function kmlPlayer(settings, _events, app) {
    		classCallCheck(this, kmlPlayer);

    		var el = settings.video;

    		var _this = possibleConstructorReturn(this, _Media.call(this, el));

    		_this.iframe = inIframe();
    		if (el == null) return possibleConstructorReturn(_this);
    		_this._bounds = {};
    		_this.device = device;
    		_this.__settings = deepmerge(defaults, settings);
    		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
    		_this.wrapper = dom.wrap(_this.media, dom.createElement('div', {
    			class: 'kmlPlayer'
    		}));
    		dom.triggerWebkitHardwareAcceleration(_this.wrapper);
    		if (_this.inIframe) {
    			dom.addClass(_this.wrapper, "inFrame");
    		}
    		//initSettings
    		for (var k in _this.__settings) {
    			if (_this[k]) {
    				if (k === 'autoplay' && _this.__settings[k] && !_this.inIframe) {
    					_this.play();
    					continue;
    				}
    				_this[k](_this.__settings[k]);
    			}
    			if (k === 'controls' && _this.__settings[k] === "native") {
    				_this.nativeControls(true);
    			}
    		}

    		//initPageVisibility
    		_this.pageVisibility = new pageVisibility(el);

    		//initexternalControls
    		_this.externalControls = new externalControls(el);

    		//initContainers
    		_this.containers = new Containers(_this);

    		_this.container = function (stg, el) {
    			return this.containers.add(stg, el, 'container');
    		};

    		_this.videoContainer = function (stg) {
    			return this.containers.add(stg, null, 'video');
    		};

    		_this.popupContainer = function (stg) {
    			return this.containers.add(stg, null, 'popup');
    		};

    		//autoFONT
    		if (typeof _this.__settings.font === "boolean" && _this.__settings.font) _this.__settings.font = defaults.font;
    		_this.autoFont = new autoFont(_this.wrapper, _this.__settings.font, _this);
    		if (_this.__settings.font) _this.autoFont.enabled(true);

    		//initCallbackEvents
    		for (var evt in _events) {
    			_this.on(evt, _events[evt], _this);
    		}

    		if (typeof app === 'function') {
    			app.bind(_this);
    		}

    		_this.on('loadedmetadata', function () {
    			if (_this.media.width != _this.media.videoWidth || _this.media.height != _this.media.videoHeight) {
    				_this.videoWidth();
    				_this.videoHeight();
    				_this.emit('resize');
    			}
    			if (!_this._app) {
    				app.bind(_this)();
    				_this._app = true;
    			}
    		});

    		el.addEventListener('dbltap', function () {
    			_this.toggleFullScreen();
    		});

    		var videoSizeCache = {
    			w: _this.width(),
    			x: _this.offsetX(),
    			y: _this.offsetY(),
    			h: _this.height()
    		};
    		var checkVideoResize = function checkVideoResize() {
    			_this._bounds = containerBounds(_this.media);
    			var w = _this.width();
    			var h = _this.width();
    			var x = _this.offsetX();
    			var y = _this.offsetY();
    			if (videoSizeCache.w != w || videoSizeCache.h != h || videoSizeCache.x != x || videoSizeCache.y != y) {
    				videoSizeCache.w = w;
    				videoSizeCache.h = h;
    				videoSizeCache.x = x;
    				videoSizeCache.y = y;
    				_this.emit('resize');
    			}
    			window.requestAnimationFrame(checkVideoResize);
    		};

    		checkVideoResize();
    		return _this;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy9wb2x5ZmlsbHMvcmVxdWVzdEFuaW1hdGlvbkZyYW1lLmpzIiwiLi4vc3JjL3BvbHlmaWxscy90b2NjYS5qcyIsIi4uL3NyYy9oZWxwZXJzL2luRnJhbWUuanMiLCIuLi9zcmMvaGVscGVycy9kZWVwbWVyZ2UuanMiLCIuLi9zcmMvaGVscGVycy91dGlscy5qcyIsIi4uL3NyYy9oZWxwZXJzL2RvbS5qcyIsIi4uL3NyYy9oZWxwZXJzL2RldmljZS5qcyIsIi4uL3NyYy9jb3JlL2F1dG9Gb250LmpzIiwiLi4vc3JjL2NvcmUvY29udGFpbmVyL2FkYXB0aXZlU2l6ZVBvcy5qcyIsIi4uL3NyYy9jb3JlL21lZGlhL2V2ZW50cy9pbmRleC5qcyIsIi4uL3NyYy9jb3JlL2NvbnRhaW5lci9yZWxhdGl2ZVNpemVQb3MuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvY29udGFpbmVyLmpzIiwiLi4vc3JjL2NvcmUvY29udGFpbmVyL3BvcHVwLmpzIiwiLi4vc3JjL2hlbHBlcnMvZXJyb3IuanMiLCIuLi9zcmMvaGVscGVycy9zY3JvbGxQb3NpdGlvbi5qcyIsIi4uL3NyYy9jb3JlL2Z1bGxzY3JlZW4uanMiLCIuLi9zcmMvaGVscGVycy9jYW5jZWxWaWRlb05ldHdvcmtSZXF1ZXN0LmpzIiwiLi4vc3JjL2hlbHBlcnMvbWltZVR5cGUuanMiLCIuLi9zcmMvY29yZS9tZWRpYS9pbmRleC5qcyIsIi4uL3NyYy9oZWxwZXJzL2NvbnRhaW5lckJvdW5kcy5qcyIsIi4uL3NyYy9oZWxwZXJzL3BhZ2VWaXNpYmlsaXR5LmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvZXZlbnRzL2V4dGVybmFsQ29udHJvbHMuanMiLCIuLi9zcmMvaGVscGVycy9hamF4LmpzIiwiLi4vc3JjL2NvcmUvcGxheWVyLmpzIiwiLi4vc3JjL2NvcmUvY29udGFpbmVyL3ZpZGVvQ29udGFpbmVyLmpzIiwiLi4vc3JjL2NvcmUvY29udGFpbmVyL2NvbnRhaW5lcnMuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuICAgIGZvcih2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxBbmltYXRpb25GcmFtZSddIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgfVxuIFxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCAvaVAoYWR8aG9uZXxvZCkuKk9TIDYvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpKVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSwgXG4gICAgICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH07XG4gXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xufSgpKTsiLCIvKipcbiAqXG4gKiBWZXJzaW9uOiAxLjAuMFxuICogQXV0aG9yOiBHaWFubHVjYSBHdWFyaW5pXG4gKiBDb250YWN0OiBnaWFubHVjYS5ndWFyaW5pQGdtYWlsLmNvbVxuICogV2Vic2l0ZTogaHR0cDovL3d3dy5naWFubHVjYWd1YXJpbmkuY29tL1xuICogVHdpdHRlcjogQGdpYW5sdWNhZ3VhcmluaVxuICpcbiAqIENvcHlyaWdodCAoYykgR2lhbmx1Y2EgR3VhcmluaVxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0XG4gKiByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSxcbiAqIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4gKiBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFRcbiAqIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLFxuICogV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG4gKiBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiovXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oZG9jLCB3aW4pIHtcbiAgJ3VzZSBzdHJpY3QnXG4gIGlmICh0eXBlb2YgZG9jLmNyZWF0ZUV2ZW50ICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gZmFsc2UgLy8gbm8gdGFwIGV2ZW50cyBoZXJlXG4gIC8vIGhlbHBlcnNcbiAgdmFyIHVzZUpxdWVyeSA9IHR5cGVvZiBqUXVlcnkgIT09ICd1bmRlZmluZWQnLFxuICAgIG1zRXZlbnRUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgdmFyIGxvID0gdHlwZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBtcyA9ICdNUycgKyB0eXBlXG4gICAgICByZXR1cm4gbmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgPyBtcyA6IGxvXG4gICAgfSxcbiAgICAvLyB3YXMgaW5pdGlhbGx5IHRyaWdnZXJlZCBhIFwidG91Y2hzdGFydFwiIGV2ZW50P1xuICAgIHdhc1RvdWNoID0gZmFsc2UsXG4gICAgdG91Y2hldmVudHMgPSB7XG4gICAgICB0b3VjaHN0YXJ0OiBtc0V2ZW50VHlwZSgnUG9pbnRlckRvd24nKSArICcgdG91Y2hzdGFydCcsXG4gICAgICB0b3VjaGVuZDogbXNFdmVudFR5cGUoJ1BvaW50ZXJVcCcpICsgJyB0b3VjaGVuZCcsXG4gICAgICB0b3VjaG1vdmU6IG1zRXZlbnRUeXBlKCdQb2ludGVyTW92ZScpICsgJyB0b3VjaG1vdmUnXG4gICAgfSxcbiAgICBzZXRMaXN0ZW5lciA9IGZ1bmN0aW9uKGVsbSwgZXZlbnRzLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGV2ZW50c0FycmF5ID0gZXZlbnRzLnNwbGl0KCcgJyksXG4gICAgICAgIGkgPSBldmVudHNBcnJheS5sZW5ndGhcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNBcnJheVtpXSwgY2FsbGJhY2ssIGZhbHNlKVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0UG9pbnRlckV2ZW50ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiBldmVudC50YXJnZXRUb3VjaGVzID8gZXZlbnQudGFyZ2V0VG91Y2hlc1swXSA6IGV2ZW50XG4gICAgfSxcbiAgICBnZXRUaW1lc3RhbXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICB9LFxuICAgIHNlbmRFdmVudCA9IGZ1bmN0aW9uKGVsbSwgZXZlbnROYW1lLCBvcmlnaW5hbEV2ZW50LCBkYXRhKSB7XG4gICAgICB2YXIgY3VzdG9tRXZlbnQgPSBkb2MuY3JlYXRlRXZlbnQoJ0V2ZW50JylcbiAgICAgIGN1c3RvbUV2ZW50Lm9yaWdpbmFsRXZlbnQgPSBvcmlnaW5hbEV2ZW50XG4gICAgICBkYXRhID0gZGF0YSB8fCB7fVxuICAgICAgZGF0YS54ID0gY3VyclhcbiAgICAgIGRhdGEueSA9IGN1cnJZXG4gICAgICBkYXRhLmRpc3RhbmNlID0gZGF0YS5kaXN0YW5jZVxuXG4gICAgICAvLyBqcXVlcnlcbiAgICAgIGlmICh1c2VKcXVlcnkpIHtcbiAgICAgICAgY3VzdG9tRXZlbnQgPSBqUXVlcnkuRXZlbnQoZXZlbnROYW1lLCB7b3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudH0pXG4gICAgICAgIGpRdWVyeShlbG0pLnRyaWdnZXIoY3VzdG9tRXZlbnQsIGRhdGEpXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZEV2ZW50TGlzdGVuZXJcbiAgICAgIGlmIChjdXN0b21FdmVudC5pbml0RXZlbnQpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICBjdXN0b21FdmVudFtrZXldID0gZGF0YVtrZXldXG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tRXZlbnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgdHJ1ZSwgdHJ1ZSlcbiAgICAgICAgZWxtLmRpc3BhdGNoRXZlbnQoY3VzdG9tRXZlbnQpXG4gICAgICB9XG5cbiAgICAgIC8vIGRldGVjdCBhbGwgdGhlIGlubGluZSBldmVudHNcbiAgICAgIC8vIGFsc28gb24gdGhlIHBhcmVudCBub2Rlc1xuICAgICAgd2hpbGUgKGVsbSkge1xuICAgICAgICAvLyBpbmxpbmVcbiAgICAgICAgaWYgKGVsbVsnb24nICsgZXZlbnROYW1lXSlcbiAgICAgICAgICBlbG1bJ29uJyArIGV2ZW50TmFtZV0oY3VzdG9tRXZlbnQpXG4gICAgICAgIGVsbSA9IGVsbS5wYXJlbnROb2RlXG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgb25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgLyoqXG4gICAgICAgKiBTa2lwIGFsbCB0aGUgbW91c2UgZXZlbnRzXG4gICAgICAgKiBldmVudHMgb3JkZXI6XG4gICAgICAgKiBDaHJvbWU6XG4gICAgICAgKiAgIHRvdWNoc3RhcnRcbiAgICAgICAqICAgdG91Y2htb3ZlXG4gICAgICAgKiAgIHRvdWNoZW5kXG4gICAgICAgKiAgIG1vdXNlZG93blxuICAgICAgICogICBtb3VzZW1vdmVcbiAgICAgICAqICAgbW91c2V1cCA8LSB0aGlzIG11c3QgY29tZSBhbHdheXMgYWZ0ZXIgYSBcInRvdWNoc3RhcnRcIlxuICAgICAgICpcbiAgICAgICAqIFNhZmFyaVxuICAgICAgICogICB0b3VjaHN0YXJ0XG4gICAgICAgKiAgIG1vdXNlZG93blxuICAgICAgICogICB0b3VjaG1vdmVcbiAgICAgICAqICAgbW91c2Vtb3ZlXG4gICAgICAgKiAgIHRvdWNoZW5kXG4gICAgICAgKiAgIG1vdXNldXAgPC0gdGhpcyBtdXN0IGNvbWUgYWx3YXlzIGFmdGVyIGEgXCJ0b3VjaHN0YXJ0XCJcbiAgICAgICAqL1xuXG4gICAgICAvLyBpdCBsb29rcyBsaWtlIGl0IHdhcyBhIHRvdWNoIGV2ZW50IVxuICAgICAgaWYgKGUudHlwZSAhPT0gJ21vdXNlZG93bicpXG4gICAgICAgIHdhc1RvdWNoID0gdHJ1ZVxuXG4gICAgICAvLyBza2lwIHRoaXMgZXZlbnQgd2UgZG9uJ3QgbmVlZCB0byB0cmFjayBpdCBub3dcbiAgICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZWRvd24nICYmIHdhc1RvdWNoKSByZXR1cm5cblxuICAgICAgdmFyIHBvaW50ZXIgPSBnZXRQb2ludGVyRXZlbnQoZSlcblxuICAgICAgLy8gY2FjaGluZyB0aGUgY3VycmVudCB4XG4gICAgICBjYWNoZWRYID0gY3VyclggPSBwb2ludGVyLnBhZ2VYXG4gICAgICAvLyBjYWNoaW5nIHRoZSBjdXJyZW50IHlcbiAgICAgIGNhY2hlZFkgPSBjdXJyWSA9IHBvaW50ZXIucGFnZVlcblxuICAgICAgbG9uZ3RhcFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgc2VuZEV2ZW50KGUudGFyZ2V0LCAnbG9uZ3RhcCcsIGUpXG4gICAgICAgIHRhcmdldCA9IGUudGFyZ2V0XG4gICAgICB9LCBsb25ndGFwVGhyZXNob2xkKVxuXG4gICAgICAvLyB3ZSB3aWxsIHVzZSB0aGVzZSB2YXJpYWJsZXMgb24gdGhlIHRvdWNoZW5kIGV2ZW50c1xuICAgICAgdGltZXN0YW1wID0gZ2V0VGltZXN0YW1wKClcblxuICAgICAgdGFwTnVtKytcblxuICAgIH0sXG4gICAgb25Ub3VjaEVuZCA9IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgLy8gc2tpcCB0aGUgbW91c2UgZXZlbnRzIGlmIHByZXZpb3VzbHkgYSB0b3VjaCBldmVudCB3YXMgZGlzcGF0Y2hlZFxuICAgICAgLy8gYW5kIHJlc2V0IHRoZSB0b3VjaCBmbGFnXG4gICAgICBpZiAoZS50eXBlID09PSAnbW91c2V1cCcgJiYgd2FzVG91Y2gpIHtcbiAgICAgICAgd2FzVG91Y2ggPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdmFyIGV2ZW50c0FyciA9IFtdLFxuICAgICAgICBub3cgPSBnZXRUaW1lc3RhbXAoKSxcbiAgICAgICAgZGVsdGFZID0gY2FjaGVkWSAtIGN1cnJZLFxuICAgICAgICBkZWx0YVggPSBjYWNoZWRYIC0gY3VyclhcblxuICAgICAgIC8vIGNsZWFyIHRoZSBwcmV2aW91cyB0aW1lciBpZiBpdCB3YXMgc2V0XG4gICAgICBjbGVhclRpbWVvdXQoZGJsVGFwVGltZXIpXG4gICAgICAvLyBraWxsIHRoZSBsb25nIHRhcCB0aW1lclxuICAgICAgY2xlYXJUaW1lb3V0KGxvbmd0YXBUaW1lcilcblxuICAgICAgaWYgKGRlbHRhWCA8PSAtc3dpcGVUaHJlc2hvbGQpXG4gICAgICAgIGV2ZW50c0Fyci5wdXNoKCdzd2lwZXJpZ2h0JylcblxuICAgICAgaWYgKGRlbHRhWCA+PSBzd2lwZVRocmVzaG9sZClcbiAgICAgICAgZXZlbnRzQXJyLnB1c2goJ3N3aXBlbGVmdCcpXG5cbiAgICAgIGlmIChkZWx0YVkgPD0gLXN3aXBlVGhyZXNob2xkKVxuICAgICAgICBldmVudHNBcnIucHVzaCgnc3dpcGVkb3duJylcblxuICAgICAgaWYgKGRlbHRhWSA+PSBzd2lwZVRocmVzaG9sZClcbiAgICAgICAgZXZlbnRzQXJyLnB1c2goJ3N3aXBldXAnKVxuXG4gICAgICBpZiAoZXZlbnRzQXJyLmxlbmd0aCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50c0Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBldmVudE5hbWUgPSBldmVudHNBcnJbaV1cbiAgICAgICAgICBzZW5kRXZlbnQoZS50YXJnZXQsIGV2ZW50TmFtZSwgZSwge1xuICAgICAgICAgICAgZGlzdGFuY2U6IHtcbiAgICAgICAgICAgICAgeDogTWF0aC5hYnMoZGVsdGFYKSxcbiAgICAgICAgICAgICAgeTogTWF0aC5hYnMoZGVsdGFZKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVzZXQgdGhlIHRhcCBjb3VudGVyXG4gICAgICAgIHRhcE51bSA9IDBcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNhY2hlZFggPj0gY3VyclggLSB0YXBQcmVjaXNpb24gJiZcbiAgICAgICAgICBjYWNoZWRYIDw9IGN1cnJYICsgdGFwUHJlY2lzaW9uICYmXG4gICAgICAgICAgY2FjaGVkWSA+PSBjdXJyWSAtIHRhcFByZWNpc2lvbiAmJlxuICAgICAgICAgIGNhY2hlZFkgPD0gY3VyclkgKyB0YXBQcmVjaXNpb25cbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKHRpbWVzdGFtcCArIHRhcFRocmVzaG9sZCAtIG5vdyA+PSAwKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIEhlcmUgeW91IGdldCB0aGUgVGFwIGV2ZW50XG4gICAgICAgICAgICBzZW5kRXZlbnQoZS50YXJnZXQsIHRhcE51bSA+PSAyICYmIHRhcmdldCA9PT0gZS50YXJnZXQgPyAnZGJsdGFwJyA6ICd0YXAnLCBlKVxuICAgICAgICAgICAgdGFyZ2V0PSBlLnRhcmdldFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlc2V0IHRoZSB0YXAgY291bnRlclxuICAgICAgICBkYmxUYXBUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGFwTnVtID0gMFxuICAgICAgICB9LCBkYmx0YXBUaHJlc2hvbGQpXG5cbiAgICAgIH1cbiAgICB9LFxuICAgIG9uVG91Y2hNb3ZlID0gZnVuY3Rpb24oZSkge1xuICAgICAgLy8gc2tpcCB0aGUgbW91c2UgbW92ZSBldmVudHMgaWYgdGhlIHRvdWNoIGV2ZW50cyB3ZXJlIHByZXZpb3VzbHkgZGV0ZWN0ZWRcbiAgICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZW1vdmUnICYmIHdhc1RvdWNoKSByZXR1cm5cblxuICAgICAgdmFyIHBvaW50ZXIgPSBnZXRQb2ludGVyRXZlbnQoZSlcbiAgICAgIGN1cnJYID0gcG9pbnRlci5wYWdlWFxuICAgICAgY3VyclkgPSBwb2ludGVyLnBhZ2VZXG4gICAgfSxcbiAgICBzd2lwZVRocmVzaG9sZCA9IHdpbi5TV0lQRV9USFJFU0hPTEQgfHwgMTAwLFxuICAgIHRhcFRocmVzaG9sZCA9IHdpbi5UQVBfVEhSRVNIT0xEIHx8IDE1MCwgLy8gcmFuZ2Ugb2YgdGltZSB3aGVyZSBhIHRhcCBldmVudCBjb3VsZCBiZSBkZXRlY3RlZFxuICAgIGRibHRhcFRocmVzaG9sZCA9IHdpbi5EQkxfVEFQX1RIUkVTSE9MRCB8fCAyMDAsIC8vIGRlbGF5IG5lZWRlZCB0byBkZXRlY3QgYSBkb3VibGUgdGFwXG4gICAgbG9uZ3RhcFRocmVzaG9sZCA9IHdpbi5MT05HX1RBUF9USFJFU0hPTEQgfHwgMTAwMCwgLy8gZGVsYXkgbmVlZGVkIHRvIGRldGVjdCBhIGxvbmcgdGFwXG4gICAgdGFwUHJlY2lzaW9uID0gd2luLlRBUF9QUkVDSVNJT04gLyAyIHx8IDYwIC8gMiwgLy8gdG91Y2ggZXZlbnRzIGJvdW5kYXJpZXMgKCA2MHB4IGJ5IGRlZmF1bHQgKVxuICAgIGp1c3RUb3VjaEV2ZW50cyA9IHdpbi5KVVNUX09OX1RPVUNIX0RFVklDRVMsXG4gICAgdGFwTnVtID0gMCxcbiAgICBjdXJyWCwgY3VyclksIGNhY2hlZFgsIGNhY2hlZFksIHRpbWVzdGFtcCwgdGFyZ2V0LCBkYmxUYXBUaW1lciwgbG9uZ3RhcFRpbWVyXG5cbiAgLy9zZXR0aW5nIHRoZSBldmVudHMgbGlzdGVuZXJzXG4gIC8vIHdlIG5lZWQgdG8gZGVib3VuY2UgdGhlIGNhbGxiYWNrcyBiZWNhdXNlIHNvbWUgZGV2aWNlcyBtdWx0aXBsZSBldmVudHMgYXJlIHRyaWdnZXJlZCBhdCBzYW1lIHRpbWVcbiAgc2V0TGlzdGVuZXIoZG9jLCB0b3VjaGV2ZW50cy50b3VjaHN0YXJ0ICsgKGp1c3RUb3VjaEV2ZW50cyA/ICcnIDogJyBtb3VzZWRvd24nKSwgb25Ub3VjaFN0YXJ0KVxuICBzZXRMaXN0ZW5lcihkb2MsIHRvdWNoZXZlbnRzLnRvdWNoZW5kICsgKGp1c3RUb3VjaEV2ZW50cyA/ICcnIDogJyBtb3VzZXVwJyksIG9uVG91Y2hFbmQpXG4gIHNldExpc3RlbmVyKGRvYywgdG91Y2hldmVudHMudG91Y2htb3ZlICsgKGp1c3RUb3VjaEV2ZW50cyA/ICcnIDogJyBtb3VzZW1vdmUnKSwgb25Ub3VjaE1vdmUpXG5cbn0oZG9jdW1lbnQsIHdpbmRvdykpOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluSWZyYW1lKCkge1xuXHR0cnkge1xuXHRcdGxldCBpcyA9ICh3aW5kb3cuc2VsZiAhPT0gd2luZG93LnRvcCk7XG5cdFx0aWYgKGlzKSB7XG5cdFx0XHR2YXIgYXJyRnJhbWVzID0gcGFyZW50LmRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiSUZSQU1FXCIpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJGcmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGV0IGZyYW1lID0gYXJyRnJhbWVzW2ldO1xuXHRcdFx0XHRpZiAoZnJhbWUuY29udGVudFdpbmRvdyA9PT0gd2luZG93KSB7XG5cdFx0XHRcdFx0aXMgPSBmcmFtZTtcblx0XHRcdFx0XHRmcmFtZS5zZXRBdHRyaWJ1dGUoJ2FsbG93ZnVsbHNjcmVlbicsICd0cnVlJyk7XG5cdFx0XHRcdFx0ZnJhbWUuc2V0QXR0cmlidXRlKCdtb3phbGxvd2Z1bGxzY3JlZW4nLCAndHJ1ZScpO1xuXHRcdFx0XHRcdGZyYW1lLnNldEF0dHJpYnV0ZSgnd2Via2l0YWxsb3dmdWxsc2NyZWVuJywgJ3RydWUnKTtcblx0XHRcdFx0XHRmcmFtZS5zZXRBdHRyaWJ1dGUoJ2ZyYW1lYm9yZGVyJywgJzAnKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGlzO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKXtcblx0bGV0IGRlZXBtZXJnZSA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjKSB7XG5cdFx0aWYoc3JjKXtcblx0XHQgICAgdmFyIGFycmF5ID0gQXJyYXkuaXNBcnJheShzcmMpO1xuXHRcdCAgICB2YXIgZHN0ID0gYXJyYXkgJiYgW10gfHwge307XG5cblx0XHQgICAgaWYgKGFycmF5KSB7XG5cdFx0ICAgICAgICB0YXJnZXQgPSB0YXJnZXQgfHwgW107XG5cdFx0ICAgICAgICBkc3QgPSBkc3QuY29uY2F0KHRhcmdldCk7XG5cdFx0ICAgICAgICBzcmMuZm9yRWFjaChmdW5jdGlvbihlLCBpKSB7XG5cdFx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBkc3RbaV0gPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtpXSA9IGU7XG5cdFx0ICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZSA9PT0gJ29iamVjdCcpIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2ldID0gZGVlcG1lcmdlKHRhcmdldFtpXSwgZSk7XG5cdFx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0XHQgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5pbmRleE9mKGUpID09PSAtMSkge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0LnB1c2goZSk7XG5cdFx0ICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICB9XG5cdFx0ICAgICAgICB9KTtcblx0XHQgICAgfSBlbHNlIHtcblx0XHQgICAgICAgIGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpIHtcblx0XHQgICAgICAgICAgICBPYmplY3Qua2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHRhcmdldFtrZXldO1xuXHRcdCAgICAgICAgICAgIH0pXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgICBPYmplY3Qua2V5cyhzcmMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICAgICAgICAgIGlmICh0eXBlb2Ygc3JjW2tleV0gIT09ICdvYmplY3QnIHx8ICFzcmNba2V5XSkge1xuXHRcdCAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICBlbHNlIHtcblx0XHQgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRba2V5XSkge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcblx0XHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0XHQgICAgICAgICAgICAgICAgICAgIGRzdFtrZXldID0gZGVlcG1lcmdlKHRhcmdldFtrZXldLCBzcmNba2V5XSk7XG5cdFx0ICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICB9XG5cdFx0ICAgICAgICB9KTtcblx0XHQgICAgfVxuXHRcdCAgICByZXR1cm4gZHN0O1xuXHQgICAgfWVsc2V7XG5cdCAgICBcdHJldHVybiB0YXJnZXQgfHzCoFtdO1xuXHQgICAgfVxuXHR9XG5cdHJldHVybiBkZWVwbWVyZ2U7XG59KSgpOyIsImV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW0oc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmcucmVwbGFjZSgvXlxccyt8XFxzKyQvZ20sICcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2VudEZyb21TdHJpbmcodil7XG5cdCBpZih2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRsZXQgdCA9IGZhbHNlO1xuXHRpZih2LmluZGV4T2Ype1xuXHRcdGlmKHYuaW5kZXhPZignJScpID4gLTEpXG5cdFx0e1xuXHRcdCAgdCA9IHBhcnNlRmxvYXQodik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZm4sIGRlbGF5KSB7XG5cdHZhciB0XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRjbGVhclRpbWVvdXQodClcblx0XHR0ID0gc2V0VGltZW91dChmbiwgZGVsYXkpXG5cdH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXJjZW50YWdlKGN1cnJlbnQsIG1heCkge1xuXHRpZiAoY3VycmVudCA9PT0gMCB8fCBtYXggPT09IDAgfHwgaXNOYU4oY3VycmVudCkgfHwgaXNOYU4obWF4KSkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cdHJldHVybiAoKGN1cnJlbnQgLyBtYXgpICogMTAwKS50b0ZpeGVkKDIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZEJpbmFyeWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1NlY29uZHModCkge1xuXHR2YXIgcyA9IDAuMDtcblx0aWYgKHQpIHtcblx0XHR2YXIgcCA9IHQuc3BsaXQoJzonKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspXG5cdFx0XHRzID0gcyAqIDYwICsgcGFyc2VGbG9hdChwW2ldLnJlcGxhY2UoJywnLCAnLicpKVxuXHR9XG5cdHJldHVybiBzO1xufVxuXG4vKipcbiAqIEZhc3RlciBTdHJpbmcgc3RhcnRzV2l0aCBhbHRlcm5hdGl2ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzcmMgLSBzb3VyY2Ugc3RyaW5nXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHN0ciAtIHRlc3Qgc3RyaW5nXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFydHNXaXRoKHNyYywgc3RyKSB7XG4gIHJldHVybiBzcmMuc2xpY2UoMCwgc3RyLmxlbmd0aCkgPT09IHN0clxufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgc3RyaW5nXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyh2KSB7XG4gIHJldHVybiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIG51bWVyaWNcbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyh2KXtcbiAgcmV0dXJuICFpc05hTih2KTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIHN0cmljdCBudW1lcmljXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmljdE51bWVyaWModil7XG4gIHJldHVybiAoaXNOYU4odikgJiYgdHlwZW9mIHYgPT09ICdudW1iZXInKVxufVxuXG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBib29sZWFuXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Jvb2xlYW4odil7XG4gIHJldHVybiAodHlwZW9mIHYgPT09ICdib29sZWFuJyk7XG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBmdW5jdGlvblxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZSAgIC8vIGF2b2lkIElFIHByb2JsZW1zXG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYW4gb2JqZWN0LCBleGNsdWRlIG51bGwuXG4gKiBOT1RFOiBVc2UgaXNPYmplY3QoeCkgJiYgIWlzQXJyYXkoeCkgdG8gZXhjbHVkZXMgYXJyYXlzLlxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qodikge1xuICByZXR1cm4gdiAmJiB0eXBlb2YgdiA9PT0gJ29iamVjdCcgICAgICAgICAvLyB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0J1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEga2luZCBvZiBhcnJheVxuICogQHBhcmFtICAgeyAqIH0gYSAtIGFueXRoaW5nXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaXMgJ2EnIGFuIGFycmF5P1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShhKSB7IHJldHVybiBBcnJheS5pc0FycmF5KGEpIHx8IGEgaW5zdGFuY2VvZiBBcnJheSB9XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBhcnJheSBjb250YWlucyBhbiBpdGVtXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gYXJyIC0gdGFyZ2V0IGFycmF5XG4gKiBAcGFyYW0gICB7ICogfSBpdGVtIC0gaXRlbSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSBEb2VzICdhcnInIGNvbnRhaW4gJ2l0ZW0nP1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnMoYXJyLCBpdGVtKSB7XG4gIHJldHVybiBhcnIuaW5kZXhPZihpdGVtKSA+IC0xO1xufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBzZXQgYW4gaW1tdXRhYmxlIHByb3BlcnR5XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGVsIC0gb2JqZWN0IHdoZXJlIHRoZSBuZXcgcHJvcGVydHkgd2lsbCBiZSBzZXRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0ga2V5IC0gb2JqZWN0IGtleSB3aGVyZSB0aGUgbmV3IHByb3BlcnR5IHdpbGwgYmUgc3RvcmVkXG4gKiBAcGFyYW0gICB7ICogfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBuZXcgcHJvcGVydHlcbiogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRpb25zIC0gc2V0IHRoZSBwcm9wZXJ5IG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgb3B0aW9uc1xuICogQHJldHVybnMgeyBPYmplY3QgfSAtIHRoZSBpbml0aWFsIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoZWwsIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsLCBrZXksIGV4dGVuZCh7XG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSwgb3B0aW9ucykpXG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIERldGVjdCB3aGV0aGVyIGEgcHJvcGVydHkgb2YgYW4gb2JqZWN0IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gIG9iaiAtIHNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gIGtleSAtIG9iamVjdCBwcm9wZXJ0eVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gaXMgdGhpcyBwcm9wZXJ0eSB3cml0YWJsZT9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV3JpdGFibGUob2JqLCBrZXkpIHtcbiAgdmFyIHByb3BzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSlcbiAgcmV0dXJuIHR5cGVvZiBvYmpba2V5XSA9PT0gVF9VTkRFRiB8fCBwcm9wcyAmJiBwcm9wcy53cml0YWJsZVxufVxuXG4vKipcbiAqIEV4dGVuZCBhbnkgb2JqZWN0IHdpdGggb3RoZXIgcHJvcGVydGllc1xuICogQHBhcmFtICAgeyBPYmplY3QgfSBzcmMgLSBzb3VyY2Ugb2JqZWN0XG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IHRoZSByZXN1bHRpbmcgZXh0ZW5kZWQgb2JqZWN0XG4gKlxuICogdmFyIG9iaiA9IHsgZm9vOiAnYmF6JyB9XG4gKiBleHRlbmQob2JqLCB7YmFyOiAnYmFyJywgZm9vOiAnYmFyJ30pXG4gKiBjb25zb2xlLmxvZyhvYmopID0+IHtiYXI6ICdiYXInLCBmb286ICdiYXInfVxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChzcmMpIHtcbiAgdmFyIG9iaiwgYXJncyA9IGFyZ3VtZW50c1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAob2JqID0gYXJnc1tpXSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGlzIHByb3BlcnR5IG9mIHRoZSBzb3VyY2Ugb2JqZWN0IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAgICAgICAgaWYgKGlzV3JpdGFibGUoc3JjLCBrZXkpKVxuICAgICAgICAgIHNyY1trZXldID0gb2JqW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNyY1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVGb250KGYsIHdpZHRoLCBlbCkge1xuXHR2YXIgciA9IGZhbHNlLCBsID0gZmFsc2U7XG5cdGlmKGYudW5pdHMgIT0gJ3B4JykgZi51bml0cyA9ICdlbSc7XG5cdGlmIChmLm1pbiAhPT0gZmFsc2UgJiYgZi5yYXRpbyAhPT0gZmFsc2UpIHtcblx0XHRyID0gZi5yYXRpbyAqIHdpZHRoIC8gMTAwMDtcblx0XHRpZiAociA8IGYubWluKSByID0gZi5taW47XG5cdFx0aWYgKGYudW5pdHMgPT0gJ3B4JykgciA9IE1hdGguY2VpbChyKTtcblx0XHRpZiAoIWlzTmFOKGYubGluZUhlaWdodCkgJiYgZi5saW5lSGVpZ2h0KSB7XG5cdFx0XHRsID0gciAqIGYubGluZUhlaWdodDtcblx0XHRcdGlmIChsIDwgMSkgbCA9IDE7XG5cdFx0XHRsID0gK2wudG9GaXhlZCgzKSArIGYudW5pdHM7XG5cdFx0fVxuXHRcdHIgPSArci50b0ZpeGVkKDMpICsgZi51bml0cztcblx0fVxuXHRpZihlbCl7XG5cdFx0aWYocikgZWwuc3R5bGUuZm9udFNpemUgPSByO1xuXHRcdGlmKGwpIGVsLnN0eWxlLmxpbmVIZWlnaHQgPSBsO1xuXHR9XG5cdHJldHVybiB7Zm9udFNpemU6IHIsIGxpbmVIZWlnaHQ6IGx9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQge307IiwiLyoqXG4gKiBAbW9kdWxlIGRvbVxuICogTW9kdWxlIGZvciBlYXNpbmcgdGhlIG1hbmlwdWxhdGlvbiBvZiBkb20gZWxlbWVudHNcbiAqL1xuXG5sZXQgY2xhc3NSZWcgPSBmdW5jdGlvbihjKSB7XG5cdHJldHVybiBuZXcgUmVnRXhwKFwiKF58XFxcXHMrKVwiICsgYyArIFwiKFxcXFxzK3wkKVwiKTtcbn07XG5cbmxldCBoYXNDbGFzc1xubGV0IGFkZENsYXNzXG5sZXQgcmVtb3ZlQ2xhc3M7XG5sZXQgdG9nZ2xlQ2xhc3M7XG5cbmlmICgnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcblx0aGFzQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0cmV0dXJuIGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGMpO1xuXHR9O1xuXHRhZGRDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRpZihjICE9IG51bGwpe1xuXHRcdFx0YyA9IGMuc3BsaXQoJyAnKTtcblx0XHRcdGZvciAodmFyIGsgaW4gYykgZWxlbS5jbGFzc0xpc3QuYWRkKGNba10pO1xuXHRcdH1cblx0fTtcblx0cmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0ZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuXHR9O1xufSBlbHNlIHtcblx0aGFzQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0cmV0dXJuIGNsYXNzUmVnKGMpLnRlc3QoZWxlbS5jbGFzc05hbWUpO1xuXHR9O1xuXHRhZGRDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRpZiAoIWhhc0NsYXNzKGVsZW0sIGMpKSB7XG5cdFx0XHRlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lICsgJyAnICsgYztcblx0XHR9XG5cdH07XG5cdHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUucmVwbGFjZShjbGFzc1JlZyhjKSwgJyAnKTtcblx0fTtcbn1cblxudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdHZhciBmbiA9IGhhc0NsYXNzKGVsZW0sIGMpID8gcmVtb3ZlQ2xhc3MgOiBhZGRDbGFzcztcblx0Zm4oZWxlbSwgYyk7XG59O1xuXG5sZXQgZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lID0gZnVuY3Rpb24gZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKHByb3BOYW1lKSB7XG5cdHZhciBkb21QcmVmaXhlcyA9ICdXZWJraXQgTW96IG1zIE8nLnNwbGl0KCcgJyksXG5cdFx0ZWxTdHlsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZTtcblx0aWYgKGVsU3R5bGVbcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcm9wTmFtZTsgLy8gSXMgc3VwcG9ydGVkIHVucHJlZml4ZWRcblx0cHJvcE5hbWUgPSBwcm9wTmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BOYW1lLnN1YnN0cigxKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkb21QcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChlbFN0eWxlW2RvbVByZWZpeGVzW2ldICsgcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBkb21QcmVmaXhlc1tpXSArIHByb3BOYW1lOyAvLyBJcyBzdXBwb3J0ZWQgd2l0aCBwcmVmaXhcblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0c3R5bGVQcmVmaXg6IHtcblx0XHR0cmFuc2Zvcm06IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgndHJhbnNmb3JtJyksXG5cdFx0cGVyc3BlY3RpdmU6IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgncGVyc3BlY3RpdmUnKSxcblx0XHRiYWNrZmFjZVZpc2liaWxpdHk6IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgnYmFja2ZhY2VWaXNpYmlsaXR5Jylcblx0fSxcblx0dHJpZ2dlcldlYmtpdEhhcmR3YXJlQWNjZWxlcmF0aW9uOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0aWYgKHRoaXMuc3R5bGVQcmVmaXguYmFja2ZhY2VWaXNpYmlsaXR5ICYmIHRoaXMuc3R5bGVQcmVmaXgucGVyc3BlY3RpdmUpIHtcblx0XHRcdGVsZW1lbnQuc3R5bGVbdGhpcy5zdHlsZVByZWZpeC5wZXJzcGVjdGl2ZV0gPSAnMTAwMHB4Jztcblx0XHRcdGVsZW1lbnQuc3R5bGVbdGhpcy5zdHlsZVByZWZpeC5iYWNrZmFjZVZpc2liaWxpdHldID0gJ2hpZGRlbic7XG5cdFx0fVxuXHR9LFxuXHR0cmFuc2Zvcm06IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XG5cdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LnRyYW5zZm9ybV0gPSB2YWx1ZTtcblx0fSxcblx0LyoqXG5cdCAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBtdWx0aXBsZSBub2RlcyBpbiB0aGUgRE9NXG5cdCAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSBET00gc2VsZWN0b3Jcblx0ICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0cyBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuXHQgKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlcyBmb3VuZFxuXHQgKi9cblx0c2VsZWN0QWxsOiBmdW5jdGlvbihzZWxlY3RvciwgY3R4KSB7XG5cdFx0cmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG5cdH0sXG5cdC8qKlxuXHQgKiBTaG9ydGVyIGFuZCBmYXN0IHdheSB0byBzZWxlY3QgYSBzaW5nbGUgbm9kZSBpbiB0aGUgRE9NXG5cdCAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSB1bmlxdWUgZG9tIHNlbGVjdG9yXG5cdCAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY3R4IC0gRE9NIG5vZGUgd2hlcmUgdGhlIHRhcmdldCBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuXHQgKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlIGZvdW5kXG5cdCAqL1xuXHRzZWxlY3Q6IGZ1bmN0aW9uKHNlbGVjdG9yLCBjdHgpIHtcblx0XHRyZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcilcblx0fSxcblx0aGFzQ2xhc3M6IGhhc0NsYXNzLFxuXHRhZGRDbGFzczogYWRkQ2xhc3MsXG5cdHJlbW92ZUNsYXNzOiByZW1vdmVDbGFzcyxcblx0dG9nZ2xlQ2xhc3M6IHRvZ2dsZUNsYXNzLFxuXHRhdXRvTGluZUhlaWdodDogZnVuY3Rpb24oZWwpIHtcblx0XHRsZXQgbCA9IGVsLm9mZnNldEhlaWdodCArIFwicHhcIjtcblx0XHRlbC5zdHlsZS5saW5lSGVpZ2h0ID0gbDtcblx0XHRyZXR1cm4gbDtcblx0fSxcblx0Y3JlYXRlRWxlbWVudDogZnVuY3Rpb24oZWxtLCBwcm9wcykge1xuXHRcdGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxtKTtcblx0XHRmb3IgKGxldCBrIGluIHByb3BzKSB7XG5cdFx0XHRlbC5zZXRBdHRyaWJ1dGUoaywgcHJvcHNba10pO1xuXHRcdH1cblx0XHRyZXR1cm4gZWw7XG5cdH0sXG5cdGVtcHR5RWxlbWVudDogZnVuY3Rpb24oZWxtKSB7XG5cdFx0d2hpbGUgKGVsbS5maXJzdENoaWxkKSB7XG5cdFx0XHRlbG0ucmVtb3ZlQ2hpbGQoZWxtLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0fSxcblx0cmVwbGFjZUVsZW1lbnQ6IGZ1bmN0aW9uKHRhcmdldCwgZWxtKSB7XG5cdFx0dGFyZ2V0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGVsbSwgdGFyZ2V0KTtcblx0fSxcblx0cmVtb3ZlRWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcblx0fSxcblx0aW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uKGVsLCByZWZlcmVuY2VOb2RlKSB7XG5cdFx0cmVmZXJlbmNlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZyk7XG5cdH0sXG5cdGluc2VydEJlZm9yZTogZnVuY3Rpb24oZWwsIHJlZmVyZW5jZU5vZGUpIHtcblx0XHRyZWZlcmVuY2VOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VOb2RlKTtcblx0fSxcblx0Z2V0VGV4dENvbnRlbnQ6IGZ1bmN0aW9uKGVsKSB7XG5cdFx0cmV0dXJuIGVsLnRleHRDb250ZW50IHx8IGVsLmlubmVyVGV4dDtcblx0fSxcblx0d3JhcDogZnVuY3Rpb24oZWxlbWVudHMsIHdyYXBwZXIpIHtcblx0XHQvLyBDb252ZXJ0IGBlbGVtZW50c2AgdG8gYW4gYXJyYXksIGlmIG5lY2Vzc2FyeS5cblx0XHRpZiAoIWVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0ZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuXHRcdH1cblxuXHRcdC8vIExvb3BzIGJhY2t3YXJkcyB0byBwcmV2ZW50IGhhdmluZyB0byBjbG9uZSB0aGUgd3JhcHBlciBvbiB0aGVcblx0XHQvLyBmaXJzdCBlbGVtZW50IChzZWUgYGNoaWxkYCBiZWxvdykuXG5cdFx0Zm9yICh2YXIgaSA9IGVsZW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHR2YXIgY2hpbGQgPSAoaSA+IDApID8gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSkgOiB3cmFwcGVyO1xuXHRcdFx0dmFyIGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcblxuXHRcdFx0Ly8gQ2FjaGUgdGhlIGN1cnJlbnQgcGFyZW50IGFuZCBzaWJsaW5nLlxuXHRcdFx0dmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0XHRcdHZhciBzaWJsaW5nID0gZWxlbWVudC5uZXh0U2libGluZztcblxuXHRcdFx0Ly8gV3JhcCB0aGUgZWxlbWVudCAoaXMgYXV0b21hdGljYWxseSByZW1vdmVkIGZyb20gaXRzIGN1cnJlbnRcblx0XHRcdC8vIHBhcmVudCkuXG5cdFx0XHRjaGlsZC5hcHBlbmRDaGlsZChlbGVtZW50KTtcblxuXHRcdFx0Ly8gSWYgdGhlIGVsZW1lbnQgaGFkIGEgc2libGluZywgaW5zZXJ0IHRoZSB3cmFwcGVyIGJlZm9yZVxuXHRcdFx0Ly8gdGhlIHNpYmxpbmcgdG8gbWFpbnRhaW4gdGhlIEhUTUwgc3RydWN0dXJlOyBvdGhlcndpc2UsIGp1c3Rcblx0XHRcdC8vIGFwcGVuZCBpdCB0byB0aGUgcGFyZW50LlxuXHRcdFx0aWYgKHNpYmxpbmcpIHtcblx0XHRcdFx0cGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgc2libGluZyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY2hpbGQ7XG5cdFx0fVxuXHR9XG59IiwibGV0IGJyb3dzZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5WZXIgPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbixcbiAgICAgIG5BZ3QgPSBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgYnJvd3Nlck5hbWUgPSBuYXZpZ2F0b3IuYXBwTmFtZSxcbiAgICAgIGZ1bGxWZXJzaW9uID0gJycgKyBwYXJzZUZsb2F0KG5hdmlnYXRvci5hcHBWZXJzaW9uKSxcbiAgICAgIG1ham9yVmVyc2lvbiA9IHBhcnNlSW50KG5hdmlnYXRvci5hcHBWZXJzaW9uLCAxMCksXG4gICAgICBuYW1lT2Zmc2V0LFxuICAgICAgdmVyT2Zmc2V0LFxuICAgICAgaXg7XG5cbiAgICAvLyBFREdFXG4gICAgaWYgKGJyb3dzZXJOYW1lID09IFwiTmV0c2NhcGVcIiAmJiBuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKCdUcmlkZW50JykgPiAtMSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIklFXCI7XG4gICAgICB2YXIgZWRnZSA9IG5BZ3QuaW5kZXhPZignRWRnZS8nKTtcbiAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcoZWRnZSArIDUsIG5BZ3QuaW5kZXhPZignLicsIGVkZ2UpKTtcbiAgICB9XG4gICAgLy8gTVNJRSAxMVxuICAgIGVsc2UgaWYgKChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiV2luZG93cyBOVFwiKSAhPT0gLTEpICYmIChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwicnY6MTFcIikgIT09IC0xKSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIklFXCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IFwiMTE7XCI7XG4gICAgfVxuICAgIC8vIE1TSUVcbiAgICBlbHNlIGlmICgodmVyT2Zmc2V0ID0gbkFndC5pbmRleE9mKFwiTVNJRVwiKSkgIT09IC0xKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiSUVcIjtcbiAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG4gICAgfVxuICAgIC8vIENocm9tZVxuICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJDaHJvbWVcIikpICE9PSAtMSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIkNocm9tZVwiO1xuICAgICAgZnVsbFZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcbiAgICB9XG4gICAgLy8gU2FmYXJpXG4gICAgZWxzZSBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZihcIlNhZmFyaVwiKSkgIT09IC0xKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiU2FmYXJpXCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuICAgICAgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJWZXJzaW9uXCIpKSAhPT0gLTEpIHtcbiAgICAgICAgZnVsbFZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRmlyZWZveFxuICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJGaXJlZm94XCIpKSAhPT0gLTEpIHtcbiAgICAgIGJyb3dzZXJOYW1lID0gXCJGaXJlZm94XCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuICAgIH1cbiAgICAvLyBJbiBtb3N0IG90aGVyIGJyb3dzZXJzLCBcIm5hbWUvdmVyc2lvblwiIGlzIGF0IHRoZSBlbmQgb2YgdXNlckFnZW50XG4gICAgZWxzZSBpZiAoKG5hbWVPZmZzZXQgPSBuQWd0Lmxhc3RJbmRleE9mKCcgJykgKyAxKSA8ICh2ZXJPZmZzZXQgPSBuQWd0Lmxhc3RJbmRleE9mKCcvJykpKSB7XG4gICAgICBicm93c2VyTmFtZSA9IG5BZ3Quc3Vic3RyaW5nKG5hbWVPZmZzZXQsIHZlck9mZnNldCk7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDEpO1xuICAgICAgaWYgKGJyb3dzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT0gYnJvd3Nlck5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgICBicm93c2VyTmFtZSA9IG5hdmlnYXRvci5hcHBOYW1lO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUcmltIHRoZSBmdWxsVmVyc2lvbiBzdHJpbmcgYXQgc2VtaWNvbG9uL3NwYWNlIGlmIHByZXNlbnRcbiAgICBpZiAoKGl4ID0gZnVsbFZlcnNpb24uaW5kZXhPZihcIjtcIikpICE9PSAtMSkge1xuICAgICAgZnVsbFZlcnNpb24gPSBmdWxsVmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICAgIH1cbiAgICBpZiAoKGl4ID0gZnVsbFZlcnNpb24uaW5kZXhPZihcIiBcIikpICE9PSAtMSkge1xuICAgICAgZnVsbFZlcnNpb24gPSBmdWxsVmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICAgIH1cbiAgICAvLyBHZXQgbWFqb3IgdmVyc2lvblxuICAgIG1ham9yVmVyc2lvbiA9IHBhcnNlSW50KCcnICsgZnVsbFZlcnNpb24sIDEwKTtcbiAgICBpZiAoaXNOYU4obWFqb3JWZXJzaW9uKSkge1xuICAgICAgZnVsbFZlcnNpb24gPSAnJyArIHBhcnNlRmxvYXQobmF2aWdhdG9yLmFwcFZlcnNpb24pO1xuICAgICAgbWFqb3JWZXJzaW9uID0gcGFyc2VJbnQobmF2aWdhdG9yLmFwcFZlcnNpb24sIDEwKTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGRhdGFcbiAgICByZXR1cm4gW2Jyb3dzZXJOYW1lLCBtYWpvclZlcnNpb25dO1xuICB9KSgpO1xuZXhwb3J0IGRlZmF1bHQge1xuICBicm93c2VyOiBicm93c2VyLFxuICBpc0lFOiAoZnVuY3Rpb24oKSB7XG4gICAgaWYgKGJyb3dzZXJbMF0gPT09ICdJRScpIHtcbiAgICAgIHJldHVybiBicm93c2VyWzFdO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pKCksXG4gIGlzRmlyZWZveDogKGZ1bmN0aW9uKCl7XG4gICAgaWYgKGJyb3dzZXJbMF0gPT09ICdGaXJlZm94Jykge1xuICAgICAgcmV0dXJuIGJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKSxcbiAgaXNDaHJvbWU6IChmdW5jdGlvbigpe1xuICAgIGlmIChicm93c2VyWzBdID09PSAnQ2hyb21lJykge1xuICAgICAgcmV0dXJuIGJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKSxcbiAgaXNTYWZhcmk6IChmdW5jdGlvbigpe1xuICAgIGlmIChicm93c2VyWzBdID09PSAnU2FmYXJpJykge1xuICAgICAgcmV0dXJuIGJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKSxcbiAgaXNUb3VjaDogJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICBpc0lvczogLyhpUGFkfGlQaG9uZXxpUG9kKS9nLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKVxufSIsImltcG9ydCB7c2NhbGVGb250fSBmcm9tICcuLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi4vaGVscGVycy9kZWVwbWVyZ2UnO1xubGV0IGF1dG9Gb250ID0gZnVuY3Rpb24oZWwsIGZvbnQsIHBhcmVudCkge1xuXHRsZXQgX2VuYWJsZWQgPSBmYWxzZTtcblx0bGV0IF91cGRhdGUgPSBmdW5jdGlvbigpe1xuXHRcdHNjYWxlRm9udChmb250LCBwYXJlbnQud2lkdGgoKSwgZWwpO1xuXHR9XG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24odikge1xuXHRcdGlmKHYgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRpZighZm9udCl7IGZvbnQgPSB7cmF0aW86IDEsIG1pbjoxLCBsaW5lSGVpZ2h0OiBmYWxzZX0gfVxuXHRcdFx0Zm9udCA9IGRlZXBtZXJnZShmb250LCB2KTtcblx0XHRcdHJldHVybiBzY2FsZUZvbnQoZm9udCwgcGFyZW50LndpZHRoKCksIGVsKTtcblx0XHR9XG5cdH07XG5cdHRoaXMuZW5hYmxlZCA9ICBmdW5jdGlvbih2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicgJiYgZm9udCkge1xuXHRcdFx0X2VuYWJsZWQgPSB2O1xuXHRcdFx0Ly8gdiA/ICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgX3VwZGF0ZSwgZmFsc2UpLCBzY2FsZUZvbnQoZm9udCwgX3dpZHRoKCksIGVsKSkgOiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgX3VwZGF0ZSwgZmFsc2UpO1xuXHRcdH1cblx0XHRyZXR1cm4gX2VuYWJsZWQ7O1xuXHR9O1xuXHRpZihwYXJlbnQub24pe1xuXHRcdHBhcmVudC5vbigncmVzaXplJywgX3VwZGF0ZSk7XG5cdH07XG59XG5leHBvcnQgZGVmYXVsdCBhdXRvRm9udDsiLCJpbXBvcnQge1xuXHRwcm9jZW50RnJvbVN0cmluZyxcblx0ZGVib3VuY2Vcbn0gZnJvbSAnLi4vLi4vaGVscGVycy91dGlscyc7XG5pbXBvcnQgZG9tIGZyb20gJy4uLy4uL2hlbHBlcnMvZG9tJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi4vLi4vaGVscGVycy9kZWVwbWVyZ2UnO1xuXG5sZXQgZGVmYXVsdHMgPSB7XG5cdHg6IDAsXG5cdHk6IDAsXG5cdHdpZHRoOiAnMTAwJScsXG5cdGhlaWdodDogJzEwMCUnLFxuXHRmb250U2l6ZTogbnVsbCxcblx0bGluZUhlaWdodDogbnVsbCxcblx0b2Zmc2V0WDogMCxcblx0b2Zmc2V0WTogMCxcblx0b3JpZ2luUG9pbnQ6IFwidG9wTGVmdFwiLFxuXHR2aXNpYmxlOiBmYWxzZSxcblx0dHJhbnNmb3JtOiB7XG5cdFx0eDogbnVsbCxcblx0XHR5OiBudWxsXG5cdH0sXG5cdHRyYW5zbGF0ZTogdHJ1ZVxufVxuXG5sZXQgYWRhcHRpdmVTaXplUG9zID0gZnVuY3Rpb24oc2V0dHRpbmdzLCBwYXJlbnQpIHtcblx0bGV0IGJvdW5kcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRvZmZzZXRYOiBwYXJlbnQub2Zmc2V0WCgpLFxuXHRcdFx0b2Zmc2V0WTogcGFyZW50Lm9mZnNldFkoKSxcblx0XHRcdHdpZHRoOiBwYXJlbnQud2lkdGgoKSxcblx0XHRcdGhlaWdodDogcGFyZW50LmhlaWdodCgpLFxuXHRcdFx0c2NhbGU6IHBhcmVudC53aWR0aCgpIC8gcGFyZW50LnZpZGVvV2lkdGgoKSxcblx0XHRcdHNjYWxlWTogcGFyZW50LndpZHRoKCkgLyBwYXJlbnQudmlkZW9IZWlnaHQoKVxuXHRcdH1cblx0fTtcblx0bGV0IHZhdWx0ID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMCxcblx0XHR3aWR0aDogJzEwMCUnLFxuXHRcdGhlaWdodDogJzEwMCUnLFxuXHRcdGZvbnRTaXplOiBudWxsLFxuXHRcdGxpbmVIZWlnaHQ6IG51bGxcblx0fTtcblx0bGV0IHBhcmVudFdpZHRoID0gMDtcblx0bGV0IHBhcmVudEhlaWdodCA9IDA7XG5cdGxldCBwYXJlbnRYID0gMDtcblx0bGV0IHBhcmVudFkgPSAwO1xuXHRsZXQgZG9tRWxlbWVudCA9IG51bGw7XG5cdGxldCBzZXR0aW5ncyA9IGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dHRpbmdzKTtcblx0bGV0IF9hY3RpdmUgPSBmYWxzZTtcblxuXHRsZXQgdXBkYXRlRG9tRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChfYWN0aXZlICYmIGRvbUVsZW1lbnQgJiYgZG9tRWxlbWVudC5ub2RlVHlwZSkge1xuXHRcdFx0aWYgKHZhdWx0LndpZHRoICE9PSBudWxsKSBkb21FbGVtZW50LnN0eWxlLndpZHRoID0gdmF1bHQud2lkdGggKyBcInB4XCI7XG5cdFx0XHRpZiAodmF1bHQuaGVpZ2h0ICE9PSBudWxsKSBkb21FbGVtZW50LnN0eWxlLmhlaWdodCA9IHZhdWx0LmhlaWdodCArIFwicHhcIjtcblxuXHRcdFx0aWYgKGRvbS5zdHlsZVByZWZpeC50cmFuc2Zvcm0gJiYgc2V0dGluZ3MudHJhbnNsYXRlKSB7XG5cdFx0XHRcdGxldCB0cmFuc2Zvcm0gPSAnJztcblx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCAmJiB2YXVsdC55ICE9IG51bGwpIHtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCcgKyB2YXVsdC54ICsgJ3B4LCcgKyB2YXVsdC55ICsgJ3B4KSc7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5yaWdodCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS50b3AgPSBcImF1dG9cIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxlZnQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUucmlnaHQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdHRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyB2YXVsdC54ICsgJ3B4KSc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh2YXVsdC55ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0dHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoJyArIHZhdWx0LnkgKyAncHgpJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZG9tLnRyYW5zZm9ybShkb21FbGVtZW50LCB0cmFuc2Zvcm0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCAmJiB2YXVsdC55ICE9IG51bGwpIHtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxlZnQgPSB2YXVsdC54ICsgXCJweFwiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUudG9wID0gdmF1bHQueSArIFwicHhcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsKSBkb21FbGVtZW50LnN0eWxlLmxlZnQgPSB2YXVsdC54ICsgXCJweFwiO1xuXHRcdFx0XHRcdGlmICh2YXVsdC55ICE9IG51bGwpIGRvbUVsZW1lbnQuc3R5bGUudG9wID0gdmF1bHQueSArIFwicHhcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2V0dGluZ3MuZm9udFNpemUgIT09IHZhdWx0LmZvbnRTaXplKSB7XG5cdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB2YXVsdC5mb250U2l6ZSA9IHNldHRpbmdzLmZvbnRTaXplO1xuXG5cdFx0XHR9XG5cdFx0XHRpZiAoc2V0dGluZ3MubGluZUhlaWdodCAhPT0gdmF1bHQubGluZUhlaWdodCkge1xuXHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxpbmVIZWlnaHQgPSB2YXVsdC5saW5lSGVpZ2h0ID0gc2V0dGluZ3MubGluZUhlaWdodDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRsZXQgdXBkYXRlUHJvcHMgPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgX3cgPSBwYXJlbnQud2lkdGgoKTtcblx0XHRsZXQgX2ggPSBwYXJlbnQuaGVpZ2h0KCk7XG5cdFx0bGV0IF94ID0gcGFyZW50Lm9mZnNldFgoKTtcblx0XHRsZXQgX3kgPSBwYXJlbnQub2Zmc2V0WSgpO1xuXHRcdGlmIChwYXJlbnRXaWR0aCAhPSBfdyB8fCBwYXJlbnRIZWlnaHQgIT0gX2ggfHwgX3ggIT0gcGFyZW50WCB8fCBfeSAhPSBwYXJlbnRZKSB7XG5cdFx0XHRwYXJlbnRXaWR0aCA9IF93O1xuXHRcdFx0cGFyZW50SGVpZ2h0ID0gX2g7XG5cdFx0XHRwYXJlbnRYID0gX3g7XG5cdFx0XHRwYXJlbnRZID0gX3k7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgYiA9IGJvdW5kcygpO1xuXG5cdFx0bGV0IHByb2NlbnRXaWR0aCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLndpZHRoKTtcblx0XHRpZiAocHJvY2VudFdpZHRoKSB7XG5cdFx0XHR2YXVsdC53aWR0aCA9IGIud2lkdGggKiBwcm9jZW50V2lkdGggLyAxMDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChzZXR0aW5ncy53aWR0aCAhPSBudWxsKSB7XG5cdFx0XHRcdHZhdWx0LndpZHRoID0gYi53aWR0aCAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhdWx0LndpZHRoID0gTWF0aC5jZWlsKHZhdWx0LndpZHRoKTtcblxuXHRcdGxldCBwcm9jZW50SGVpZ2h0ID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MuaGVpZ2h0KTtcblx0XHRpZiAocHJvY2VudEhlaWdodCkge1xuXHRcdFx0dmF1bHQuaGVpZ2h0ID0gYi5oZWlnaHQgKiBwcm9jZW50SGVpZ2h0IC8gMTAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoc2V0dGluZ3MuaGVpZ2h0ICE9IG51bGwpIHtcblx0XHRcdFx0dmF1bHQuaGVpZ2h0ID0gYi5oZWlnaHQgKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXVsdC5oZWlnaHQgPSBNYXRoLmNlaWwodmF1bHQuaGVpZ2h0KTtcblxuXHRcdGlmIChzZXR0aW5ncy54ICE9IG51bGwpIHtcblx0XHRcdGxldCBwcm9jZW50WCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLngpO1xuXHRcdFx0aWYgKHByb2NlbnRYKSB7XG5cdFx0XHRcdHZhdWx0LnggPSBiLm9mZnNldFggKyBiLndpZHRoICogcHJvY2VudFggLyAxMDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXVsdC54ID0gYi5vZmZzZXRYICsgc2V0dGluZ3MueCAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0XHR2YXVsdC54ID0gTWF0aC5mbG9vcih2YXVsdC54KTtcblx0XHRcdGxldCB0cmFuc2Zvcm1YID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MudHJhbnNmb3JtLngpO1xuXHRcdFx0aWYgKHRyYW5zZm9ybVgpIHZhdWx0LnggKz0gdHJhbnNmb3JtWCAqIHZhdWx0LndpZHRoIC8gMTAwO1xuXHRcdFx0aWYgKHNldHRpbmdzLm9mZnNldFgpIHZhdWx0LnggKz0gc2V0dGluZ3Mub2Zmc2V0WDtcblx0XHR9XG5cblx0XHRpZiAoc2V0dGluZ3MueSAhPSBudWxsKSB7XG5cdFx0XHRsZXQgcHJvY2VudFkgPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy55KTtcblx0XHRcdGlmIChwcm9jZW50WSkge1xuXHRcdFx0XHR2YXVsdC55ID0gYi5vZmZzZXRZICsgYi5oZWlnaHQgKiBwcm9jZW50WSAvIDEwMDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhdWx0LnkgPSBiLm9mZnNldFkgKyBzZXR0aW5ncy55ICogYi5zY2FsZTtcblx0XHRcdH1cblx0XHRcdHZhdWx0LnkgPSBNYXRoLmZsb29yKHZhdWx0LnkpO1xuXHRcdFx0bGV0IHRyYW5zZm9ybVkgPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy50cmFuc2Zvcm0ueSk7XG5cdFx0XHRpZiAodHJhbnNmb3JtWSkgdmF1bHQueSArPSB0cmFuc2Zvcm1ZICogdmF1bHQud2lkdGggLyAxMDA7XG5cdFx0XHRpZiAoc2V0dGluZ3Mub2Zmc2V0WSkgdmF1bHQueSArPSBzZXR0aW5ncy5vZmZzZXRZO1xuXHRcdH1cblxuXHRcdHVwZGF0ZURvbUVsZW1lbnQoKTtcblx0fVxuXG5cdHRoaXMuYXBwbHlUbyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlKSB7XG5cdFx0XHRkb21FbGVtZW50ID0gZWxlbWVudDtcblx0XHRcdHVwZGF0ZVByb3BzKCk7XG5cdFx0fVxuXHRcdHJldHVybiBkb21FbGVtZW50O1xuXHR9XG5cblx0bGV0IGFwcGx5TmV3UHJvcHMgPSBmdW5jdGlvbigpIHtcblx0XHRpZihfYWN0aXZlKXtcblx0XHRcdHVwZGF0ZVByb3BzKCk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5kYXRhID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHZhdWx0O1xuXHR9XG5cblx0dGhpcy5zZXR0aW5ncyA9IGZ1bmN0aW9uKG5ld1NldHRpbmdzKSB7XG5cdFx0c2V0dGluZ3MgPSBkZWVwbWVyZ2Uoc2V0dGluZ3MsIG5ld1NldHRpbmdzKTtcblx0XHR1cGRhdGVQcm9wcygpO1xuXHRcdHJldHVybiBzZXR0aW5ncztcblx0fVxuXHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbih2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdF9hY3RpdmUgPSB2O1xuXHRcdFx0aWYgKHYpIGFwcGx5TmV3UHJvcHMoKTtcblx0XHRcdC8vIHYgPyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgYXBwbHlOZXdQcm9wcywgZmFsc2UpIDogd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMsIGZhbHNlKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9hY3RpdmU7XG5cdH07XG5cblx0aWYgKHBhcmVudC5vbikge1xuXHRcdHBhcmVudC5vbigncmVzaXplJywgYXBwbHlOZXdQcm9wcyk7XG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGFkYXB0aXZlU2l6ZVBvczsiLCIvL2h0dHBzOi8vZ2l0aHViLmNvbS9wcmltdXMvZXZlbnRlbWl0dGVyM1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHByZWZpeCA9ICd+JztcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgYSBzdG9yYWdlIGZvciBvdXIgYEVFYCBvYmplY3RzLlxuICogQW4gYEV2ZW50c2AgaW5zdGFuY2UgaXMgYSBwbGFpbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhcmUgZXZlbnQgbmFtZXMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRXZlbnRzKCkge31cblxuLy9cbi8vIFdlIHRyeSB0byBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYC4gSW4gc29tZSBlbmdpbmVzIGNyZWF0aW5nIGFuXG4vLyBpbnN0YW5jZSBpbiB0aGlzIHdheSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCBkaXJlY3RseS5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBjaGFyYWN0ZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Rcbi8vIG92ZXJyaWRkZW4gb3IgdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy9cbmlmIChPYmplY3QuY3JlYXRlKSB7XG4gIEV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vXG4gIC8vIFRoaXMgaGFjayBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgYF9fcHJvdG9fX2AgcHJvcGVydHkgaXMgc3RpbGwgaW5oZXJpdGVkIGluXG4gIC8vIHNvbWUgb2xkIGJyb3dzZXJzIGxpa2UgQW5kcm9pZCA0LCBpUGhvbmUgNS4xLCBPcGVyYSAxMSBhbmQgU2FmYXJpIDUuXG4gIC8vXG4gIGlmICghbmV3IEV2ZW50cygpLl9fcHJvdG9fXykgcHJlZml4ID0gZmFsc2U7XG59XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdGhpcy5mbiA9IGZuO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIE1pbmltYWwgYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlIHRoYXQgaXMgbW9sZGVkIGFnYWluc3QgdGhlIE5vZGUuanNcbiAqIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IGxpc3RpbmcgdGhlIGV2ZW50cyBmb3Igd2hpY2ggdGhlIGVtaXR0ZXIgaGFzIHJlZ2lzdGVyZWRcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICB2YXIgbmFtZXMgPSBbXVxuICAgICwgZXZlbnRzXG4gICAgLCBuYW1lO1xuXG4gIGlmICh0aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgcmV0dXJuIG5hbWVzO1xuXG4gIGZvciAobmFtZSBpbiAoZXZlbnRzID0gdGhpcy5fZXZlbnRzKSkge1xuICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgcmV0dXJuIG5hbWVzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGV2ZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGV4aXN0cyBPbmx5IGNoZWNrIGlmIHRoZXJlIGFyZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7QXJyYXl8Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKGV2ZW50LCBleGlzdHMpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnRcbiAgICAsIGF2YWlsYWJsZSA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChleGlzdHMpIHJldHVybiAhIWF2YWlsYWJsZTtcbiAgaWYgKCFhdmFpbGFibGUpIHJldHVybiBbXTtcbiAgaWYgKGF2YWlsYWJsZS5mbikgcmV0dXJuIFthdmFpbGFibGUuZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXZhaWxhYmxlLmxlbmd0aCwgZWUgPSBuZXcgQXJyYXkobCk7IGkgPCBsOyBpKyspIHtcbiAgICBlZVtpXSA9IGF2YWlsYWJsZVtpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogQ2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGV2ZW50IGhhZCBsaXN0ZW5lcnMsIGVsc2UgYGZhbHNlYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVycy5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgNDogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMiwgYTMpOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoIWFyZ3MpIGZvciAoaiA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBhcmdzW2ogLSAxXSA9IGFyZ3VtZW50c1tqXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uYXBwbHkobGlzdGVuZXJzW2ldLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcylcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBvbmUtdGltZSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMsIHRydWUpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIHRoaXMuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbdGhpcy5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsaXN0ZW5lcnMgb2YgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IG1hdGNoIHRoaXMgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBoYXZlIHRoaXMgY29udGV4dC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmUtdGltZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiB0aGlzO1xuICBpZiAoIWZuKSB7XG4gICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKFxuICAgICAgICAgbGlzdGVuZXJzLmZuID09PSBmblxuICAgICAgJiYgKCFvbmNlIHx8IGxpc3RlbmVycy5vbmNlKVxuICAgICAgJiYgKCFjb250ZXh0IHx8IGxpc3RlbmVycy5jb250ZXh0ID09PSBjb250ZXh0KVxuICAgICkge1xuICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgZXZlbnRzID0gW10sIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4gIT09IGZuXG4gICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSlcbiAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgICAvL1xuICAgIGlmIChldmVudHMubGVuZ3RoKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gICAgZWxzZSBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzLCBvciB0aG9zZSBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0O1xuXG4gIGlmIChldmVudCkge1xuICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG4gICAgaWYgKHRoaXMuX2V2ZW50c1tldnRdKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBBbGlhcyBtZXRob2RzIG5hbWVzIGJlY2F1c2UgcGVvcGxlIHJvbGwgbGlrZSB0aGF0LlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4vL1xuLy8gVGhpcyBmdW5jdGlvbiBkb2Vzbid0IGFwcGx5IGFueW1vcmUuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgcHJlZml4LlxuLy9cbkV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RW1pdHRlcjsiLCJpbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4uLy4uL2hlbHBlcnMvZGVlcG1lcmdlJztcbmltcG9ydCB7XG5cdHByb2NlbnRGcm9tU3RyaW5nXG59IGZyb20gJy4uLy4uL2hlbHBlcnMvdXRpbHMnO1xubGV0IGRlZmF1bHRzID0ge1xuXHR4OiAwLFxuXHR5OiAwLFxuXHR3aWR0aDogMCxcblx0aGVpZ2h0OiAwXG59XG5sZXQgcmVsYXRpdmVTaXplUG9zID0gZnVuY3Rpb24oY3R4LCBzZXR0aW5ncykge1xuXHRsZXQgcGFyZW50V2lkdGggPSBjdHgudmlkZW9XaWR0aCgpIHx8IGN0eC53aWR0aCB8fCAxO1xuXHRsZXQgcGFyZW50SGVpZ2h0ID0gY3R4LnZpZGVvSGVpZ2h0KCkgfHwgY3R4LmhlaWdodCB8fCAxO1xuXHRsZXQgbyA9IGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRsZXQgX3cgPSBwcm9jZW50RnJvbVN0cmluZyhvLndpZHRoKTtcblx0aWYgKF93ID09PSBmYWxzZSkgX3cgPSBvLndpZHRoIC8gcGFyZW50V2lkdGggKiAxMDA7XG5cdGxldCBfaCA9IHByb2NlbnRGcm9tU3RyaW5nKG8uaGVpZ2h0KTtcblx0aWYgKF9oID09PSBmYWxzZSkgX2ggPSBvLmhlaWdodCAvIHBhcmVudEhlaWdodCAqIDEwMDtcblx0bGV0IF94ID0gcHJvY2VudEZyb21TdHJpbmcoby54KTtcblx0aWYgKF94ID09PSBmYWxzZSkgX3ggPSBvLnggLyBwYXJlbnRXaWR0aCAqIDEwMDtcblx0bGV0IF95ID0gcHJvY2VudEZyb21TdHJpbmcoby55KTtcblx0aWYgKF95ID09PSBmYWxzZSkgX3kgPSBvLnkgLyBwYXJlbnRIZWlnaHQgKiAxMDA7XG5cdHJldHVybiB7XG5cdFx0eDogX3gsXG5cdFx0eTogX3ksXG5cdFx0d2lkdGg6IF93LFxuXHRcdGhlaWdodDogX2ggXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IHJlbGF0aXZlU2l6ZVBvczsiLCJpbXBvcnQgZG9tIGZyb20gJy4uLy4uL2hlbHBlcnMvZG9tJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi4vLi4vaGVscGVycy9kZWVwbWVyZ2UnO1xuaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9tZWRpYS9ldmVudHMvaW5kZXgnO1xuaW1wb3J0IHJlbGF0aXZlU2l6ZVBvcyBmcm9tICcuL3JlbGF0aXZlU2l6ZVBvcyc7XG5pbXBvcnQge1xuXHRpc0Z1bmN0aW9uXG59IGZyb20gJy4uLy4uL2hlbHBlcnMvdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWluZXIgZXh0ZW5kcyBFdmVudHN7XG5cdGNvbnN0cnVjdG9yKGVsLCBvcHRzLCBjdHgsIHBsYXllcikge1xuXHRcdGxldCBwbGF5ZXJQYXVzZWQgPSBmYWxzZTtcblx0XHRsZXQgaXNWaXNpYmxlID0gZmFsc2U7XG5cdFx0bGV0IGV4dGVybmFsQ29udHJvbHMgPSBmYWxzZTtcblx0XHRsZXQgYm9keSA9IGRvbS5zZWxlY3QoJy5ib2R5JywgZWwpO1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5jdHggPSBjdHg7XG5cdFx0dGhpcy5ib2R5ID0gYm9keTtcblx0XHR0aGlzLmNvbmZpZyA9IGZ1bmN0aW9uKGZvcHRzKSB7XG5cdFx0XHRpZihmb3B0cykgb3B0cyA9IGRlZXBtZXJnZShvcHRzLCBmb3B0cyk7XG5cdFx0XHRsZXQgZCA9IG5ldyByZWxhdGl2ZVNpemVQb3MocGxheWVyLCBvcHRzKTtcblx0XHRcdGJvZHkuc3R5bGUud2lkdGggPSBkLndpZHRoICsgXCIlXCI7XG5cdFx0XHRib2R5LnN0eWxlLmhlaWdodCA9IGQuaGVpZ2h0ICsgXCIlXCI7XG5cdFx0XHRpZiAoZG9tLnN0eWxlUHJlZml4LnRyYW5zZm9ybSkge1xuXHRcdFx0XHRkb20udHJhbnNmb3JtKGJvZHksICd0cmFuc2xhdGUoJyArIDEwMCAvIGQud2lkdGggKiBkLnggKyAnJSwnICsgMTAwIC8gZC5oZWlnaHQgKiBkLnkgKyAnJSknKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGJvZHkuc3R5bGUudG9wID0gZC54ICsgXCIlXCI7XG5cdFx0XHRcdGJvZHkuc3R5bGUubGVmdCA9IGQueSArIFwiJVwiO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5lbWl0KCdjb25maWcnKTtcblx0XHR9XG5cdFx0dGhpcy5jb25maWcoKTtcblx0XHRwbGF5ZXIub24oJ3Jlc2l6ZScsIHRoaXMuY29uZmlnKTtcblxuXHRcdHRoaXMuaGlkZSA9ICgpPT57XG5cdFx0XHRpZiAoaXNWaXNpYmxlKSB7XG5cdFx0XHRcdHRoaXMuZW1pdCgnYmVmb3JlSGlkZScpO1xuXHRcdFx0XHRkb20uYWRkQ2xhc3MoZWwsICdoaWRkZW4nKTtcblx0XHRcdFx0aXNWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdGlmIChvcHRzLnBhdXNlKSB7XG5cdFx0XHRcdFx0aWYgKCFwbGF5ZXJQYXVzZWQpIHtcblx0XHRcdFx0XHRcdHBsYXllci5wbGF5KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChleHRlcm5hbENvbnRyb2xzICYmIG9wdHMuZXh0ZXJuYWxDb250cm9scykge1xuXHRcdFx0XHRcdFx0cGxheWVyLmV4dGVybmFsQ29udHJvbHMuZW5hYmxlZCh0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0ZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRcdGlmIChpc0Z1bmN0aW9uKG9wdHMub25IaWRlKSkgb3B0cy5vbkhpZGUoKTtcblx0XHRcdFx0XHRjdHguY2hlY2tWaXNpYmxlRWxlbWVudHMoKTtcblx0XHRcdFx0XHR0aGlzLmVtaXQoJ2hpZGUnKTtcblx0XHRcdFx0fSwgMjUwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5zaG93ID0gKCk9Pntcblx0XHRcdGlmICghaXNWaXNpYmxlKSB7XG5cdFx0XHRcdGlzVmlzaWJsZSA9IHRydWU7XG5cdFx0XHRcdHRoaXMuZW1pdCgnYmVmb3JlU2hvdycpO1xuXHRcdFx0XHRjdHguZW5hYmxlZCh0cnVlKTtcblx0XHRcdFx0ZWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKGVsLCAnaGlkZGVuJyk7XG5cdFx0XHRcdFx0aWYgKGlzRnVuY3Rpb24ob3B0cy5vbkhpZGUpKSBvcHRzLm9uU2hvdygpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdCgnc2hvdycpO1xuXHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdGlmIChvcHRzLnBhdXNlKSB7XG5cdFx0XHRcdFx0aWYgKCFwbGF5ZXIucGF1c2VkKCkpIHtcblx0XHRcdFx0XHRcdHBsYXllclBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cGxheWVyLnBhdXNlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllclBhdXNlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvcHRzLmV4dGVybmFsQ29udHJvbHMpIHtcblx0XHRcdFx0XHRpZiAocGxheWVyLmV4dGVybmFsQ29udHJvbHMuZW5hYmxlZCgpKSB7XG5cdFx0XHRcdFx0XHRleHRlcm5hbENvbnRyb2xzID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHBsYXllci5leHRlcm5hbENvbnRyb2xzLmVuYWJsZWQoZmFsc2UpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRleHRlcm5hbENvbnRyb2xzID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAob3B0cy52aXNpYmxlKSB7XG5cdFx0XHR0aGlzLnNob3coKTtcblx0XHR9XG5cblx0XHR0aGlzLnZpc2libGUgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykgaXNWaXNpYmxlID0gdjtcblx0XHRcdHJldHVybiBpc1Zpc2libGU7XG5cdFx0fVxuXHR9XG5cdGRlc3Ryb3koKXtcblx0XHRjb25zb2xlLmxvZyhcImNvbnRhaW5lclwiKTtcblx0XHR0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuXHRcdHRoaXMuY3R4LnJlbW92ZSh0aGlzLmJvZHkpO1xuXHR9XG59IiwiaW1wb3J0IGRvbSBmcm9tICcuLi8uLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vY29udGFpbmVyJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvcHVwIGV4dGVuZHMgQ29udGFpbmVyIHtcblx0Y29uc3RydWN0b3IoZWwsIG9wdHMsIGN0eCwgcGFyZW50UGxheWVyKSB7XG5cdFx0c3VwZXIoZWwsIG9wdHMsIGN0eCwgcGFyZW50UGxheWVyKTtcblx0XHRsZXQgb3ZlcmxheSA9IGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRkb20uYWRkQ2xhc3Mob3ZlcmxheSwgJ292ZXJsYXkgdHJpZ2dlckNsb3NlJyk7XG5cdFx0ZG9tLmluc2VydEJlZm9yZShvdmVybGF5LCB0aGlzLmJvZHkpO1xuXHRcdC8vaGVhZGVyXG5cdFx0bGV0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG5cdFx0ZG9tLmFkZENsYXNzKGhlYWRlciwgJ2hlYWRlcicpO1xuXHRcdHRoaXMuX3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdGhlYWRlci5hcHBlbmRDaGlsZCh0aGlzLl90aXRsZSk7XG5cdFx0dGhpcy5fY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0dGhpcy5fY2xvc2VCdG4uaW5uZXJIVE1MID0gXCI8aW1nIHNyYz0nc3ZnL2ljX2Nsb3NlLnN2ZycvPlwiO1xuXHRcdGRvbS5hZGRDbGFzcyh0aGlzLl9jbG9zZUJ0biwgJ2Nsb3NlQnRuJyk7XG5cdFx0dGhpcy5fY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUpO1xuXHRcdGhlYWRlci5hcHBlbmRDaGlsZCh0aGlzLl9jbG9zZUJ0bik7XG5cdFx0dGhpcy5ib2R5LmFwcGVuZENoaWxkKGhlYWRlcik7XG5cdFx0Ly9lbmQgaGVhZGVyXG5cblxuXHRcdHRoaXMuYmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24odikge1xuXHRcdFx0aWYgKHYgIT0gbnVsbCkge1xuXHRcdFx0XHRvdmVybGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHY7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb3ZlcmxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG5cdFx0fVxuXG5cdFx0dGhpcy5zY2FsZVNpemUgPSBmdW5jdGlvbihzKXtcblx0XHRcdHRoaXMuY29uZmlnKHt4OiAoMTAwLXMpLzIrXCIlXCIsIHk6ICgxMDAtcykvMitcIiVcIiwgd2lkdGg6IHMrXCIlXCIsIGhlaWdodDogcytcIiVcIn0pO1xuXHRcdH1cblxuXHRcdC8vRVZFTlRTXG5cdFx0cGFyZW50UGxheWVyLm9uKCdyZXNpemUnLCAoKSA9PiB7XG5cdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdH0pO1xuXG5cdFx0WydyZXNpemUnLCdjb25maWcnLCAnYmVmb3JlU2hvdyddLm1hcCgoZXZ0KT0+e1xuXHRcdFx0dGhpcy5vbihldnQsICgpID0+IHtcblx0XHRcdFx0Y29uc29sZS5sb2coZXZ0KTtcblx0XHRcdFx0dGhpcy5hdXRvTGluZUhlaWdodCgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRsZXQgY2xzRWxlbWVudHMgPSBkb20uc2VsZWN0QWxsKCcudHJpZ2dlckNsb3NlJywgZWwpO1xuXHRcdGZvciAodmFyIGkgPSAwLCBuID0gY2xzRWxlbWVudHMubGVuZ3RoOyBpIDwgbjsgaSArPSAxKSB7XG5cdFx0XHRjbHNFbGVtZW50c1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZSk7XG5cdFx0fVxuXHR9XG5cdGRlc3Ryb3koKXtcblx0XHRjb25zb2xlLmxvZygncG9wdXAnKTtcblx0XHR0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuXHRcdHRoaXMuY3R4LnJlbW92ZSh0aGlzLmJvZHkpO1xuXHRcdGRvbS5yZW1vdmVFbGVtZW50KHRoaXMuYm9keS5wYXJlbnROb2RlKTtcblx0fVxuXHRcblx0YXV0b0xpbmVIZWlnaHQoZWwpIHtcblx0XHRpZih0aGlzLnZpc2libGUoKSl7XG5cdFx0XHRpZiAoZWwpIHtcblx0XHRcdFx0ZG9tLmF1dG9MaW5lSGVpZ2h0KGVsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRvbS5hdXRvTGluZUhlaWdodCh0aGlzLl90aXRsZS5wYXJlbnROb2RlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0dGl0bGUodikge1xuXHRcdGlmICh2ICE9IG51bGwpIHtcblx0XHRcdHRoaXMuX3RpdGxlLmlubmVySFRNTCA9IHY7XG5cdFx0XHR0aGlzLmF1dG9MaW5lSGVpZ2h0KCk7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3RpdGxlLmlubmVySFRNTDtcblx0fVxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEVycm9yRm9ybWF0RXhjZXB0aW9uKG1zZykge1xuICAgdHJ5IHtcblx0ICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcblx0fSBjYXRjaCAoZSkge1xuXHQgIGNvbnNvbGUubG9nKGUubmFtZSArICc6ICcgKyBlLm1lc3NhZ2UpO1xuXHQgIHJldHVybjtcblx0fVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cdGxldCB4ID0gMDtcblx0bGV0IHkgPSAwO1xuXHR0aGlzLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR4ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IDA7XG5cdFx0eSA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCAwO1xuXHR9XG5cdHRoaXMucmVzdG9yZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5zY3JvbGxUbyh4LCB5KVxuXHR9XG59IiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuL21lZGlhL2V2ZW50cy9pbmRleCc7XG5pbXBvcnQgc2Nyb2xsUG9zaXRpb24gZnJvbSAnLi4vaGVscGVycy9zY3JvbGxQb3NpdGlvbic7XG4vLyBGdWxsc2NyZWVuIEFQSVxubGV0IHN1cHBvcnRzRnVsbFNjcmVlbiA9IGZhbHNlO1xubGV0IGJyb3dzZXJQcmVmaXhlcyA9ICd3ZWJraXQgbW96IG8gbXMga2h0bWwnLnNwbGl0KCcgJyk7XG5sZXQgcHJlZml4RlMgPSAnJztcbi8vQ2hlY2sgZm9yIG5hdGl2ZSBzdXBwb3J0XG5pZiAodHlwZW9mIGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgc3VwcG9ydHNGdWxsU2NyZWVuID0gdHJ1ZTtcbn0gZWxzZSB7XG4gICAgLy8gQ2hlY2sgZm9yIGZ1bGxzY3JlZW4gc3VwcG9ydCBieSB2ZW5kb3IgcHJlZml4XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYnJvd3NlclByZWZpeGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgcHJlZml4RlMgPSBicm93c2VyUHJlZml4ZXNbaV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudFtwcmVmaXhGUyArICdDYW5jZWxGdWxsU2NyZWVuJ10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBNUyAod2hlbiBpc24ndCBpdD8pXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbmFibGVkKSB7XG4gICAgICAgICAgICBwcmVmaXhGUyA9ICdtcyc7XG4gICAgICAgICAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5sZXQgZXZlbnRDaGFuZ2UgPSAocHJlZml4RlMgPT09ICcnKSA/ICdmdWxsc2NyZWVuY2hhbmdlJyA6IHByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnZnVsbHNjcmVlbmNoYW5nZScgOiAnZnVsbHNjcmVlbmNoYW5nZScpO1xuZXZlbnRDaGFuZ2UgPSBldmVudENoYW5nZS50b0xvd2VyQ2FzZSgpO1xuLy9zdXBwb3J0c0Z1bGxTY3JlZW4gPSBmYWxzZTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1bGxzY3JlZW4gZXh0ZW5kcyBFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlmcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24gPSBuZXcgc2Nyb2xsUG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUgPSB7fTtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGZuRnVsbHNjcmVlbkNoYW5nZSA9ICgpPT57XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNGdWxsU2NyZWVuKCkpe1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc2Nyb2xsUG9zaXRpb24ucmVzdG9yZSwxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRDaGFuZ2UsIGZuRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRlZnVhbHRGdWxsU2NyZWVuRWxlbWVudChlbGVtZW50KXtcbiAgICAgICAgbGV0IGVsID0gZWxlbWVudDtcbiAgICAgICAgaWYgKGVsID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaWZyYW1lKXtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMuaWZyYW1lO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZWwgPSB0aGlzLndyYXBwZXI7ICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9XG4gICAgb25GdWxsc2NyZWVuQ2hhbmdlKGV2dCl7XG4gICAgICAgIC8vaW52ZXN0aWdhdGUgaWYgbmF0aXZlIHZpZGVvIGZ1bGxzY3JlZW4gY2FuIGJlIG92ZXJ3cml0dGVuXG4gICAgICAgIHRoaXMubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcihldmVudENoYW5nZSwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbjtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgfVxuICAgIGlzRnVsbFdpbmRvdygpe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlzRnVsbFNjcmVlbihlbGVtZW50KSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIGxldCBlbCA9IHRoaXMuZGVmdWFsdEZ1bGxTY3JlZW5FbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgc3dpdGNoIChwcmVmaXhGUykge1xuICAgICAgICAgICAgICAgIGNhc2UgJyc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA9PSBlbDtcbiAgICAgICAgICAgICAgICBjYXNlICdtb3onOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgPT0gZWw7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50W3ByZWZpeEZTICsgJ0Z1bGxzY3JlZW5FbGVtZW50J10gPT0gZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNGdWxsV2luZG93KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVxdWVzdEZ1bGxXaW5kb3coZWxlbWVudCl7XG4gICAgICAgIGlmICh0aGlzLmlzRnVsbFdpbmRvdygpKSByZXR1cm47XG4gICAgICAgIGlmKHN1cHBvcnRzRnVsbFNjcmVlbiAmJiB0aGlzLmlzRnVsbFNjcmVlbigpKSByZXR1cm47XG4gICAgICAgIGxldCBlbCA9IHRoaXMuZGVmdWFsdEZ1bGxTY3JlZW5FbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uLnNhdmUoKTtcbiAgICAgICAgLy8gbGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgICAgIGxldCBzdHlsZSA9IGVsLnN0eWxlO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3Bvc2l0aW9uJ10gPSBzdHlsZS5wb3NpdGlvbiB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21hcmdpbiddID0gc3R5bGUubWFyZ2luIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsndG9wJ10gPSBzdHlsZS50b3AgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydsZWZ0J10gPSBzdHlsZS5sZWZ0IHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnd2lkdGgnXSA9IHN0eWxlLndpZHRoIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnaGVpZ2h0J10gPSBzdHlsZS5oZWlnaHQgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd6SW5kZXgnXSA9IHN0eWxlLnpJbmRleCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21heFdpZHRoJ10gPSBzdHlsZS5tYXhXaWR0aCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21heEhlaWdodCddID0gc3R5bGUubWF4SGVpZ2h0IHx8IFwiXCI7XG5cbiAgICAgICAgZWwuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIGVsLnN0eWxlLnRvcCA9IGVsLnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICBlbC5zdHlsZS5tYXJnaW4gPSAwO1xuICAgICAgICBlbC5zdHlsZS5tYXhXaWR0aCA9IGVsLnN0eWxlLm1heEhlaWdodCA9IGVsLnN0eWxlLndpZHRoID0gZWwuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IDIxNDc0ODM2NDc7XG5cbiAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQgPSBlbDtcbiAgICAgICAgdGhpcy5pc0Z1bGxXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXF1ZXN0RnVsbFNjcmVlbihlbGVtZW50KSB7XG4gICAgICAgbGV0IGVsID0gdGhpcy5kZWZ1YWx0RnVsbFNjcmVlbkVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24uc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIChwcmVmaXhGUyA9PT0gJycpID8gZWwucmVxdWVzdEZ1bGxTY3JlZW4oKSA6IGVsW3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnUmVxdWVzdEZ1bGxzY3JlZW4nIDogJ1JlcXVlc3RGdWxsU2NyZWVuJyldKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RGdWxsV2luZG93KGVsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYW5jZWxGdWxsV2luZG93KCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNGdWxsV2luZG93KCkpIHJldHVybjtcbiAgICAgICAgaWYoc3VwcG9ydHNGdWxsU2NyZWVuICYmIHRoaXMuaXNGdWxsU2NyZWVuKCkpIHJldHVybjtcbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50LnN0eWxlW2tdID0gdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlW2tdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc0Z1bGxXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbi5yZXN0b3JlKCk7XG4gICAgfVxuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKSA6IGRvY3VtZW50W3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnRXhpdEZ1bGxzY3JlZW4nIDogJ0NhbmNlbEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRnVsbFdpbmRvdygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZ2dsZUZ1bGxXaW5kb3coZWxlbWVudCl7XG4gICAgICAgIGxldCBpc0Z1bGxzY3JlZW4gPSAhdGhpcy5pc0Z1bGxXaW5kb3coKTtcbiAgICAgICAgaWYgKGlzRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RnVsbFdpbmRvdyhlbGVtZW50KTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWxGdWxsV2luZG93KCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2dnbGVGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGlzRnVsbHNjcmVlbiA9IHRoaXMuaXNGdWxsU2NyZWVuKCk7XG4gICAgICAgIGlmICghaXNGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQpO1xuICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bGxzY3JlZW5FbGVtZW50KCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA6IGRvY3VtZW50W3ByZWZpeEZTICsgJ0Z1bGxzY3JlZW5FbGVtZW50J107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG59OyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWVkaWEpIHtcblx0Ly8gUmVtb3ZlIGNoaWxkIHNvdXJjZXNcblx0dmFyIHNvdXJjZXMgPSBkb20uc2VsZWN0QWxsKCdzb3VyY2UnLCBtZWRpYSk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGRvbS5yZW1vdmVFbGVtZW50KHNvdXJjZXNbaV0pO1xuXHR9XG5cblx0Ly8gU2V0IGJsYW5rIHZpZGVvIHNyYyBhdHRyaWJ1dGVcblx0Ly8gVGhpcyBpcyB0byBwcmV2ZW50IGEgTUVESUFfRVJSX1NSQ19OT1RfU1VQUE9SVEVEIGVycm9yXG5cdC8vIFNtYWxsIG1wNDogaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvc21hbGwvYmxvYi9tYXN0ZXIvbXA0Lm1wNFxuXHQvLyBJbmZvOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyMjMxNTc5L2hvdy10by1wcm9wZXJseS1kaXNwb3NlLW9mLWFuLWh0bWw1LXZpZGVvLWFuZC1jbG9zZS1zb2NrZXQtb3ItY29ubmVjdGlvblxuXHRtZWRpYS5zZXRBdHRyaWJ1dGUoJ3NyYycsICdkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUhHWjBlWEJwYzI5dEFBQUNBR2x6YjIxcGMyOHliWEEwTVFBQUFBaG1jbVZsQUFBQUdtMWtZWFFBQUFHekFCQUhBQUFCdGhCZ1VZSTl0KzhBQUFNTmJXOXZkZ0FBQUd4dGRtaGtBQUFBQU1YTXZ2ckZ6TDc2QUFBRDZBQUFBQ29BQVFBQUFRQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FBQUJocGIyUnpBQUFBQUJDQWdJQUhBRS8vLy8vKy93QUFBaUYwY21GckFBQUFYSFJyYUdRQUFBQVB4Y3krK3NYTXZ2b0FBQUFCQUFBQUFBQUFBQ29BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQWdBQUFBSUFBQUFBQUc5YldScFlRQUFBQ0J0Wkdoa0FBQUFBTVhNdnZyRnpMNzZBQUFBR0FBQUFBRVZ4d0FBQUFBQUxXaGtiSElBQUFBQUFBQUFBSFpwWkdVQUFBQUFBQUFBQUFBQUFBQldhV1JsYjBoaGJtUnNaWElBQUFBQmFHMXBibVlBQUFBVWRtMW9aQUFBQUFFQUFBQUFBQUFBQUFBQUFDUmthVzVtQUFBQUhHUnlaV1lBQUFBQUFBQUFBUUFBQUF4MWNtd2dBQUFBQVFBQUFTaHpkR0pzQUFBQXhITjBjMlFBQUFBQUFBQUFBUUFBQUxSdGNEUjJBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FDQUJJQUFBQVNBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR1AvL0FBQUFYbVZ6WkhNQUFBQUFBNENBZ0UwQUFRQUVnSUNBUHlBUkFBQUFBQU1OUUFBQUFBQUZnSUNBTFFBQUFiQUJBQUFCdFlrVEFBQUJBQUFBQVNBQXhJMklBTVVBUkFFVVF3QUFBYkpNWVhaak5UTXVNelV1TUFhQWdJQUJBZ0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUFVYzNSemVnQUFBQUFBQUFBU0FBQUFBUUFBQUJSemRHTnZBQUFBQUFBQUFBRUFBQUFzQUFBQVlIVmtkR0VBQUFCWWJXVjBZUUFBQUFBQUFBQWhhR1JzY2dBQUFBQUFBQUFBYldScGNtRndjR3dBQUFBQUFBQUFBQUFBQUFBcmFXeHpkQUFBQUNPcGRHOXZBQUFBRzJSaGRHRUFBQUFCQUFBQUFFeGhkbVkxTXk0eU1TNHgnKTtcblxuXHQvLyBMb2FkIHRoZSBuZXcgZW1wdHkgc291cmNlXG5cdC8vIFRoaXMgd2lsbCBjYW5jZWwgZXhpc3RpbmcgcmVxdWVzdHNcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TZWx6L3BseXIvaXNzdWVzLzE3NFxuXHRtZWRpYS5sb2FkKCk7XG5cblx0Ly8gRGVidWdnaW5nXG5cdGNvbnNvbGUubG9nKFwiQ2FuY2VsbGVkIG5ldHdvcmsgcmVxdWVzdHMgZm9yIG9sZCBtZWRpYVwiKTtcbn0iLCJleHBvcnQgZnVuY3Rpb24gbWltZUF1ZGlvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wNCc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wZWcnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vd2F2JzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2OyBjb2RlY3M9XCIxXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWltZVZpZGVvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL3dlYm0nOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby93ZWJtOyBjb2RlY3M9XCJ2cDgsIHZvcmJpc1wiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICd2aWRlby9tcDQnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFLCBtcDRhLjQwLjJcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAndmlkZW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHt9IiwiaW1wb3J0IGVycm9yIGZyb20gJy4uLy4uL2hlbHBlcnMvZXJyb3InO1xuaW1wb3J0IEZ1bGxzY3JlZW4gZnJvbSAnLi4vZnVsbHNjcmVlbic7XG5pbXBvcnQgX2NhbmNlbFJlcXVlc3RzIGZyb20gJy4uLy4uL2hlbHBlcnMvY2FuY2VsVmlkZW9OZXR3b3JrUmVxdWVzdCc7XG5pbXBvcnQge21pbWVWaWRlb30gZnJvbSAnLi4vLi4vaGVscGVycy9taW1lVHlwZSc7XG5cbi8vaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxubGV0IF9ldmVudHMgPSBbJ2VuZGVkJywgJ3Byb2dyZXNzJywgJ3N0YWxsZWQnLCAncGxheWluZycsICd3YWl0aW5nJywgJ2NhbnBsYXknLCAnY2FucGxheXRocm91Z2gnLCAnbG9hZHN0YXJ0JywgJ2xvYWRlZGRhdGEnLCAnbG9hZGVkbWV0YWRhdGEnLCAndGltZXVwZGF0ZScsICd2b2x1bWVjaGFuZ2UnLCAncGxheScsICdwbGF5aW5nJywgJ3BhdXNlJywgJ2Vycm9yJywgJ3NlZWtpbmcnLCAnZW1wdGllZCcsICdzZWVrZWQnLCAncmF0ZWNoYW5nZScsICdzdXNwZW5kJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lZGlhIGV4dGVuZHMgRnVsbHNjcmVlbiB7XG5cdGNvbnN0cnVjdG9yKGVsKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRpZihlbCA9PSBudWxsKXtcblx0XHRcdGVycm9yKFwiWW91IG5lZWQgdG8gc3VwcGx5IGEgSFRNTFZpZGVvRWxlbWVudCB0byBpbnN0YW50aWF0ZSB0aGUgcGxheWVyXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhID0gZWw7XG5cdFx0X2V2ZW50cy5mb3JFYWNoKChrKSA9PiB7XG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGssICgpID0+IHtcblx0XHRcdFx0dGhpcy5lbWl0KGspO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmNhblBsYXkgPSB7XG5cdFx0XHRtcDQ6IG1pbWVWaWRlbyhlbCwndmlkZW8vbXA0JyksXG5cdFx0XHR3ZWJtOiBtaW1lVmlkZW8oZWwsJ3ZpZGVvL3dlYm0nKSxcblx0XHRcdG9nZzogbWltZVZpZGVvKGVsLCd2aWRlby9vZ2cnKVxuXHRcdH1cblx0fVxuXG5cdC8qKiogR2xvYmFsIGF0dHJpYnV0ZXMgKi9cblxuXHQvKiBBIEJvb2xlYW4gYXR0cmlidXRlOyBpZiBzcGVjaWZpZWQsIHRoZSB2aWRlbyBhdXRvbWF0aWNhbGx5IGJlZ2lucyB0byBwbGF5IGJhY2sgYXMgc29vbiBhcyBpdCBjYW4gZG8gc28gd2l0aG91dCBzdG9wcGluZyB0byBmaW5pc2ggbG9hZGluZyB0aGUgZGF0YS4gSWYgbm90IHJldHVybiB0aGUgYXVvcGxheSBhdHRyaWJ1dGUuICovXG5cdGF1dG9wbGF5KHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5hdXRvcGxheSA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmF1dG9wbGF5O1xuXHR9XG5cblx0LyogUmV0dXJucyB0aGUgdGltZSByYW5nZXMgb2YgdGhlIGJ1ZmZlcmVkIG1lZGlhLiBUaGlzIGF0dHJpYnV0ZSBjb250YWlucyBhIFRpbWVSYW5nZXMgb2JqZWN0ICovXG5cdGJ1ZmZlcmVkKCnCoCB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuYnVmZmVyZWQ7XG5cdH1cblxuXHQvKiBJZiB0aGlzIGF0dHJpYnV0ZSBpcyBwcmVzZW50LCB0aGUgYnJvd3NlciB3aWxsIG9mZmVyIGNvbnRyb2xzIHRvIGFsbG93IHRoZSB1c2VyIHRvIGNvbnRyb2wgdmlkZW8gcGxheWJhY2ssIGluY2x1ZGluZyB2b2x1bWUsIHNlZWtpbmcsIGFuZCBwYXVzZS9yZXN1bWUgcGxheWJhY2suIFdoZW4gbm90IHNldCByZXR1cm5zIGlmIHRoZSBjb250cm9scyBhcmUgcHJlc2VudCAqL1xuXHRuYXRpdmVDb250cm9scyh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEuY29udHJvbHMgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jb250cm9scztcblx0fVxuXG5cdC8qIGFub255bW91cywgdXNlLWNyZWRlbnRpYWxzLCBmYWxzZSAqL1xuXHRjcm9zc29yaWdpbih2KSB7XG5cdFx0aWYgKHYgPT09ICd1c2UtY3JlZGVudGlhbHMnKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmNyb3NzT3JpZ2luID0gJ3VzZS1jcmVkZW50aWFscyc7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9XG5cdFx0aWYgKHYpIHtcblx0XHRcdHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcblx0XHRcdHJldHVybiAnYW5vbnltb3VzJztcblx0XHR9XG5cdFx0aWYgKHYgPT09IGZhbHNlKSB0aGlzLm1lZGlhLmNyb3NzT3JpZ2luID0gbnVsbDtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jcm9zc09yaWdpbjtcblx0fVxuXG5cdC8qIEEgQm9vbGVhbiBhdHRyaWJ1dGU7IGlmIHNwZWNpZmllZCwgd2Ugd2lsbCwgdXBvbiByZWFjaGluZyB0aGUgZW5kIG9mIHRoZSB2aWRlbywgYXV0b21hdGljYWxseSBzZWVrIGJhY2sgdG8gdGhlIHN0YXJ0LiAqL1xuXHRsb29wKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5sb29wID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEubG9vcDtcblx0fVxuXG5cdC8qQSBCb29sZWFuIGF0dHJpYnV0ZSB3aGljaCBpbmRpY2F0ZXMgdGhlIGRlZmF1bHQgc2V0dGluZyBvZiB0aGUgYXVkaW8gY29udGFpbmVkIGluIHRoZSB2aWRlby4gSWYgc2V0LCB0aGUgYXVkaW8gd2lsbCBiZSBpbml0aWFsbHkgc2lsZW5jZWQuIEl0cyBkZWZhdWx0IHZhbHVlIGlzIGZhbHNlLCBtZWFuaW5nIHRoYXQgdGhlIGF1ZGlvIHdpbGwgYmUgcGxheWVkIHdoZW4gdGhlIHZpZGVvIGlzIHBsYXllZCovXG5cdG11dGVkKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5tdXRlZCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLm11dGVkO1xuXHR9XG5cblx0LyogTXV0ZSB0aGUgdmlkZW8gKi9cblx0bXV0ZSgpIHtcblx0XHR0aGlzLm11dGVkKHRydWUpO1xuXHR9XG5cblx0LyogVW5NdXRlIHRoZSB2aWRlbyAqL1xuXHR1bm11dGUoKSB7XG5cdFx0dGhpcy5tdXRlZChmYWxzZSk7XG5cdH1cblxuXHQvKiBUb2dnbGUgdGhlIG11dGVkIHN0YW5jZSBvZiB0aGUgdmlkZW8gKi9cblx0dG9nZ2xlTXV0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5tdXRlZCghdGhpcy5tdXRlZCgpKTtcblx0fVxuXG5cdC8qIFJldHVybnMgQSBUaW1lUmFuZ2VzIG9iamVjdCBpbmRpY2F0aW5nIGFsbCB0aGUgcmFuZ2VzIG9mIHRoZSB2aWRlbyB0aGF0IGhhdmUgYmVlbiBwbGF5ZWQuKi9cblx0cGxheWVkKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLnBsYXllZDtcblx0fVxuXG5cdC8qXG5cdFRoaXMgZW51bWVyYXRlZCBhdHRyaWJ1dGUgaXMgaW50ZW5kZWQgdG8gcHJvdmlkZSBhIGhpbnQgdG8gdGhlIGJyb3dzZXIgYWJvdXQgd2hhdCB0aGUgYXV0aG9yIHRoaW5rcyB3aWxsIGxlYWQgdG8gdGhlIGJlc3QgdXNlciBleHBlcmllbmNlLiBJdCBtYXkgaGF2ZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6XG5cdFx0bm9uZTogaW5kaWNhdGVzIHRoYXQgdGhlIHZpZGVvIHNob3VsZCBub3QgYmUgcHJlbG9hZGVkLlxuXHRcdG1ldGFkYXRhOiBpbmRpY2F0ZXMgdGhhdCBvbmx5IHZpZGVvIG1ldGFkYXRhIChlLmcuIGxlbmd0aCkgaXMgZmV0Y2hlZC5cblx0XHRhdXRvOiBpbmRpY2F0ZXMgdGhhdCB0aGUgd2hvbGUgdmlkZW8gZmlsZSBjb3VsZCBiZSBkb3dubG9hZGVkLCBldmVuIGlmIHRoZSB1c2VyIGlzIG5vdCBleHBlY3RlZCB0byB1c2UgaXQuXG5cdHRoZSBlbXB0eSBzdHJpbmc6IHN5bm9ueW0gb2YgdGhlIGF1dG8gdmFsdWUuXG5cdCovXG5cdHByZWxvYWQodikge1xuXHRcdGlmICh2ID09PSAnbWV0YWRhdGEnIHx8IHYgPT09IFwibWV0YVwiKSB7XG5cdFx0XHR0aGlzLm1lZGlhLnByZWxvYWQgPSAnbWV0YWRhdGEnO1xuXHRcdFx0cmV0dXJuICdtZXRhZGF0YSc7XG5cdFx0fVxuXHRcdGlmICh2KSB7XG5cdFx0XHR0aGlzLm1lZGlhLnByZWxvYWQgPSAnYXV0byc7XG5cdFx0XHRyZXR1cm4gJ2F1dG8nO1xuXHRcdH1cblx0XHRpZiAodiA9PT0gZmFsc2UpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdub25lJztcblx0XHRcdHJldHVybiAnbm9uZSc7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLnByZWxvYWQ7XG5cdH1cblxuXHQvKiBHaXZlcyBvciByZXR1cm5zIHRoZSBhZGRyZXNzIG9mIGFuIGltYWdlIGZpbGUgdGhhdCB0aGUgdXNlciBhZ2VudCBjYW4gc2hvdyB3aGlsZSBubyB2aWRlbyBkYXRhIGlzIGF2YWlsYWJsZS4gVGhlIGF0dHJpYnV0ZSwgaWYgcHJlc2VudCwgbXVzdCBjb250YWluIGEgdmFsaWQgbm9uLWVtcHR5IFVSTCBwb3RlbnRpYWxseSBzdXJyb3VuZGVkIGJ5IHNwYWNlcyAqL1xuXHRwb3N0ZXIodikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMubWVkaWEucG9zdGVyID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucG9zdGVyO1xuXHR9XG5cblx0LyogVGhlIHNyYyBwcm9wZXJ0eSBzZXRzIG9yIHJldHVybnMgdGhlIGN1cnJlbnQgc291cmNlIG9mIHRoZSBhdWRpby92aWRlbywgVGhlIHNvdXJjZSBpcyB0aGUgYWN0dWFsIGxvY2F0aW9uIChVUkwpIG9mIHRoZSBhdWRpby92aWRlbyBmaWxlICovXG5cdHNyYyh2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0X2NhbmNlbFJlcXVlc3RzKHRoaXMubWVkaWEpO1xuXHRcdFx0aWYodiBpbnN0YW5jZW9mIEFycmF5KXtcblx0XHRcdFx0Zm9yKHZhciBpID0gMCwgbiA9IHYubGVuZ3RoOyBpKz0xOyl7XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL21wNFwiICYmIHRoaXMuY2FuUGxheS5tcDQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHZbaV1bJ3R5cGUnXSA9PT0gXCJ2aWRlby93ZWJtXCIgJiYgdGhpcy5jYW5QbGF5LndlYm0pe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHZbaV1bJ3R5cGUnXSA9PT0gXCJ2aWRlby9vZ2dcIiAmJiB0aGlzLmNhblBsYXkub2dnKXtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnNyYyA9IHZbaV1bJ3NyYyddO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fWVsc2UgaWYodi5zcmMgJiYgdi50eXBlKXtcblx0XHRcdFx0dGhpcy5tZWRpYS5zcmMgPSB2LnNyYztcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0aGlzLm1lZGlhLnNyYyA9IHY7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuY3VycmVudFNyYztcblx0fVxuXG5cdC8qKiogR2xvYmFsIEV2ZW50cyAqL1xuXG5cdC8qIFN0YXJ0cyBwbGF5aW5nIHRoZSBhdWRpby92aWRlbyAqL1xuXHRwbGF5KCkge1xuXHRcdHRoaXMubWVkaWEucGxheSgpO1xuXHR9XG5cblx0LyogUGF1c2VzIHRoZSBjdXJyZW50bHkgcGxheWluZyBhdWRpby92aWRlbyAqL1xuXHRwYXVzZSgpIHtcblx0XHR0aGlzLm1lZGlhLnBhdXNlKCk7XG5cdH1cblxuXHQvKiBSZXR1cm4gdGhlIGN1cnJlbnRseSBwbGF5aW5nIHN0YXR1cyBvZiBhdWRpby92aWRlbyAqL1xuXHRwYXVzZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucGF1c2VkO1xuXHR9XG5cblx0LyogUmV0dXJuIHRoZSBjdXJyZW50bHkgcGxheWluZyBzdGF0dXMgb2YgYXVkaW8vdmlkZW8gKi9cblx0cGxheWluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wYXVzZWQ7XG5cdH1cblxuXHQvKiBUb2dnbGUgcGxheS9wYXVzZSBmb3IgdGhlIGF1ZGlvL3ZpZGVvICovXG5cdHRvZ2dsZVBsYXkoKSB7XG5cdFx0dGhpcy5tZWRpYS5wYXVzZWQgPyB0aGlzLnBsYXkoKSA6IHRoaXMucGF1c2UoKTtcblx0fVxuXG5cdGN1cnJlbnRUaW1lKHYpIHtcblx0XHRpZiAodiA9PT0gbnVsbCB8fCBpc05hTih2KSkge1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuY3VycmVudFRpbWU7XG5cdFx0fVxuXHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdGlmICh2ID4gdGhpcy5tZWRpYS5kdXJhdGlvbikge1xuXHRcdFx0diA9IHRoaXMubWVkaWEuZHVyYXRpb247XG5cdFx0fVxuXHRcdGlmICh2IDwgMCkge1xuXHRcdFx0diA9IDA7XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEuY3VycmVudFRpbWUgPSB2O1xuXHRcdHJldHVybiB2O1xuXHR9XG5cblx0c2Vlayh2KSB7XG5cdFx0cmV0dXJuIHRoaXMuY3VycmVudFRpbWUodik7XG5cdH1cblxuXHQvKipcblx0ICogW1JlLWxvYWRzIHRoZSBhdWRpby92aWRlbyBlbGVtZW50LCB1cGRhdGUgdGhlIGF1ZGlvL3ZpZGVvIGVsZW1lbnQgYWZ0ZXIgY2hhbmdpbmcgdGhlIHNvdXJjZSBvciBvdGhlciBzZXR0aW5nc11cblx0ICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXHRsb2FkKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLnNyYyh2KTtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS5sb2FkKCk7XG5cdH1cblxuXHRkdXJhdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5kdXJhdGlvbjtcblx0fVxuXG5cdHZvbHVtZSh2KSB7XG5cdFx0Ly8gUmV0dXJuIGN1cnJlbnQgdm9sdW1lIGlmIHZhbHVlIFxuXHRcdGlmICh2ID09PSBudWxsIHx8IGlzTmFOKHYpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS52b2x1bWU7XG5cdFx0fVxuXHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdGlmICh2ID4gMSkge1xuXHRcdFx0diA9IDE7XG5cdFx0fVxuXHRcdGlmICh2IDwgMCkge1xuXHRcdFx0diA9IDA7XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEudm9sdW1lID0gdjtcblx0XHRyZXR1cm4gdjtcblx0fVxufSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpe1xuXHRsZXQgc2NhbGUgPSAwO1xuXHRsZXQgYm91bmRzID0gZnVuY3Rpb24oZWwsIHVwZGF0ZVNjYWxlKSB7XG5cdFx0aWYoIHVwZGF0ZVNjYWxlICE9PSB1bmRlZmluZWQpIHNjYWxlID0gdXBkYXRlU2NhbGU7XG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHR3cmFwcGVyV2lkdGg6IGVsLm9mZnNldFdpZHRoLFxuXHRcdFx0d3JhcHBlckhlaWdodDogZWwub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0c2NhbGU6IHNjYWxlIHx8IChlbC53aWR0aC9lbC5oZWlnaHQpLFxuXHRcdFx0d2lkdGg6IDAsXG5cdFx0XHRoZWlnaHQ6IDAsXG5cdFx0XHRvZmZzZXRYOiAwLFxuXHRcdFx0b2Zmc2V0WTogMFxuXHRcdH1cblx0XHRkYXRhWyd3cmFwcGVyU2NhbGUnXSA9IGRhdGEud3JhcHBlcldpZHRoIC8gZGF0YS53cmFwcGVySGVpZ2h0O1xuXHRcdGlmIChkYXRhLndyYXBwZXJTY2FsZSA+IGRhdGEuc2NhbGUpIHtcblx0XHRcdGRhdGEuaGVpZ2h0ID0gZGF0YS53cmFwcGVySGVpZ2h0O1xuXHRcdFx0ZGF0YS53aWR0aCA9IGRhdGEuc2NhbGUgKiBkYXRhLmhlaWdodDtcblx0XHRcdGRhdGEub2Zmc2V0WCA9IChkYXRhLndyYXBwZXJXaWR0aCAtIGRhdGEud2lkdGgpIC8gMjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGF0YS53aWR0aCA9IGRhdGEud3JhcHBlcldpZHRoO1xuXHRcdFx0ZGF0YS5oZWlnaHQgPSBkYXRhLndpZHRoIC8gZGF0YS5zY2FsZTtcblx0XHRcdGRhdGEub2Zmc2V0WSA9IChkYXRhLndyYXBwZXJIZWlnaHQgLSBkYXRhLmhlaWdodCkgLyAyO1xuXHRcdH1cblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXHRyZXR1cm4gYm91bmRzO1xufSkoKTsiLCJ2YXIgX2RvYyA9IGRvY3VtZW50IHx8IHt9O1xuLy8gU2V0IHRoZSBuYW1lIG9mIHRoZSBoaWRkZW4gcHJvcGVydHkgYW5kIHRoZSBjaGFuZ2UgZXZlbnQgZm9yIHZpc2liaWxpdHlcbnZhciBoaWRkZW4sIHZpc2liaWxpdHlDaGFuZ2U7XG5pZiAodHlwZW9mIF9kb2MuaGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7IC8vIE9wZXJhIDEyLjEwIGFuZCBGaXJlZm94IDE4IGFuZCBsYXRlciBzdXBwb3J0IFxuXHRoaWRkZW4gPSBcImhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJ2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLm1vekhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIm1vekhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLm1zSGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwibXNIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwibXN2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLndlYmtpdEhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIndlYmtpdEhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCI7XG59XG5cbmNvbnN0IGlzQXZhaWxhYmxlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiAhKHR5cGVvZiBfZG9jW2hpZGRlbl0gPT09IFwidW5kZWZpbmVkXCIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYWdlVmlzaWJpbGl0eShfbWVkaWEsIHNldHRpbmdzID0ge30pIHtcblx0bGV0IF9hdmFpbGFibGUgPSBpc0F2YWlsYWJsZSgpO1xuXHRpZiAoX2F2YWlsYWJsZSkge1xuXHRcdGxldCBfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdGxldCBfcGxheWluZyA9IGZhbHNlO1xuXHRcdGxldCBwYXVzZWQgPSBmYWxzZTtcblx0XHRsZXQgc2V0RmxhZ1BsYXlpbmcgPSBmdW5jdGlvbigpIHtcblx0XHRcdF9wbGF5aW5nID0gdHJ1ZTtcblx0XHR9O1xuXHRcdGxldCBldmVudHMgPSB7XG5cdFx0XHR2aXNpYmxlOiBmdW5jdGlvbigpe30sXG5cdFx0XHRoaWRkZW46IGZ1bmN0aW9uKCl7fVxuXHRcdH07XG5cdFx0bGV0IGRlc3Ryb3lWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRldmVudHMgPSB7XG5cdFx0XHRcdHZpc2libGU6IGZ1bmN0aW9uKCl7fSxcblx0XHRcdFx0aGlkZGVuOiBmdW5jdGlvbigpe31cblx0XHRcdH07XG5cdFx0XHRfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0X3BsYXlpbmcgPSBmYWxzZTtcblx0XHRcdF9kb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRfbWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHR9XG5cdFx0bGV0IGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChfZW5hYmxlZCkge1xuXHRcdFx0XHRpZiAoX2RvY1toaWRkZW5dKSB7XG5cdFx0XHRcdFx0aWYgKF9wbGF5aW5nICYmICFfbWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRfbWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHRcdHBhdXNlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50cy5oaWRkZW4oKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAocGF1c2VkICYmIF9tZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdF9tZWRpYS5wbGF5KCk7XG5cdFx0XHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnRzLnZpc2libGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRsZXQgaW5pdFZpc2liaWxpdHkgPSBmdW5jdGlvbiBpbml0VmlzaWJpbGl0eShzZXR0aW5ncykge1xuXHRcdFx0aWYgKF9hdmFpbGFibGUpIHtcblx0XHRcdFx0X2RvYy5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdFx0X21lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRldmVudHMudmlzaWJsZSA9IHNldHRpbmdzLm9uVmlzaWJsZSB8fCBldmVudHMudmlzaWJsZTtcblx0XHRcdFx0ZXZlbnRzLmhpZGRlbiA9IHNldHRpbmdzLm9uSGlkZGVuIHx8IGV2ZW50cy5oaWRkZW47XG5cdFx0XHRcdF9lbmFibGVkID0gdHJ1ZTtcblx0XHRcdFx0X2RvYy5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdFx0X21lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGV2ZW50cy52aXNpYmxlID0gc2V0dGluZ3Mub25WaXNpYmxlIHx8IGV2ZW50cy52aXNpYmxlO1xuXHRcdGV2ZW50cy5oaWRkZW4gPSBzZXR0aW5ncy5vbkhpZGRlbiB8fCBldmVudHMuaGlkZGVuO1xuXHRcdF9lbmFibGVkID0gdHJ1ZTtcblx0XHRfZG9jLmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdF9tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXG5cdFx0dGhpcy5pbml0ID0gaW5pdFZpc2liaWxpdHk7XG5cdFx0dGhpcy5kZXN0cm95ID0gZGVzdHJveVZpc2liaWxpdHk7XG5cdFx0dGhpcy5vbiA9IGZ1bmN0aW9uKGV2ZW50LGZuKSB7XG5cdFx0XHRpZiAoZXZlbnQgaW4gZXZlbnRzKSBldmVudHNbZXZlbnRdID0gZm47XG5cdFx0fTtcblx0XHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykgX2VuYWJsZWQgPSB2O1xuXHRcdFx0cmV0dXJuIF9lbmFibGVkO1xuXHRcdH1cblx0fTtcbn07IiwibGV0IF9kb2MgPSBkb2N1bWVudCB8fCB7fTtcbmxldCBleHRlcm5hbENvbnRyb2xzID0gZnVuY3Rpb24oZWwpIHtcblx0bGV0IF9lbmFibGVkID0gdHJ1ZTtcblx0bGV0IF9zZWVrID0gdHJ1ZTtcblx0bGV0IF90SWQgPSBudWxsO1xuXHRsZXQgbWVkaWEgPSBlbDtcblx0bGV0IGtleWRvd24gPSBmdW5jdGlvbihlKSB7XG5cdFx0aWYgKF9lbmFibGVkKSB7XG5cdFx0XHQvL2J5cGFzcyBkZWZhdWx0IG5hdGl2ZSBleHRlcm5hbCBjb250cm9scyB3aGVuIG1lZGlhIGlzIGZvY3VzZWRcblx0XHRcdG1lZGlhLnBhcmVudE5vZGUuZm9jdXMoKTtcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzIpIHsgLy9zcGFjZVxuXHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChfc2Vlaykge1xuXHRcdFx0XHRpZiAoZS5rZXlDb2RlID09IDM3KSB7IC8vbGVmdFxuXHRcdFx0XHRcdG1lZGlhLmN1cnJlbnRUaW1lID0gbWVkaWEuY3VycmVudFRpbWUgLSA1O1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZS5rZXlDb2RlID09IDM5KSB7IC8vcmlnaHRcblx0XHRcdFx0XHRtZWRpYS5jdXJyZW50VGltZSA9IG1lZGlhLmN1cnJlbnRUaW1lICsgNTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzgpIHsgLy91cFxuXHRcdFx0XHRsZXQgdiA9IG1lZGlhLnZvbHVtZTtcblx0XHRcdFx0diArPSAuMTtcblx0XHRcdFx0aWYgKHYgPiAxKSB2ID0gMTtcblx0XHRcdFx0bWVkaWEudm9sdW1lID0gdjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDQwKSB7IC8vZG93blxuXHRcdFx0XHRsZXQgdiA9IG1lZGlhLnZvbHVtZTtcblx0XHRcdFx0diAtPSAuMTtcblx0XHRcdFx0aWYgKHYgPCAwKSB2ID0gMDtcblx0XHRcdFx0bWVkaWEudm9sdW1lID0gdjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0LyppZiAoc2VsZi5jb250cm9sQmFyKSB7XG5cdFx0XHRcdGlmIChzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbikge1xuXHRcdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gNDAgfHwgZS5rZXlDb2RlID09IDM4KSB7XG5cblx0XHRcdFx0XHRcdHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uLm1lbnVDb250ZW50LmVsXy5jbGFzc05hbWUgPSBcInZqcy1tZW51IHNob3dcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0qL1xuXHRcdH1cblx0fTtcblxuXHQvLyB0aGlzLm9uU3BhY2UgPSBmdW5jdGlvbigpIHtcblxuXHQvLyB9O1xuXG5cdGxldCBrZXl1cCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoX2VuYWJsZWQpIHtcdFx0XHRcblx0XHRcdC8vIGlmIChlLmtleUNvZGUgPT0gNDAgfHwgZS5rZXlDb2RlID09IDM4KSB7XG5cdFx0XHQvLyBcdGNsZWFySW50ZXJ2YWwoX3RJZCk7XG5cdFx0XHQvLyBcdGlmIChzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbikge1xuXHRcdFx0Ly8gXHRcdF90SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gXHRcdFx0c2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24ubWVudUNvbnRlbnQuZWxfLmNsYXNzTmFtZSA9IFwidmpzLW1lbnVcIjtcblx0XHRcdC8vIFx0XHR9LCA1MDApO1xuXHRcdFx0Ly8gXHR9XG5cdFx0XHQvLyB9XG5cdFx0fVxuXHR9O1xuXHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbihiKSB7XG5cdFx0aWYgKGIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIF9lbmFibGVkO1xuXHRcdF9lbmFibGVkID0gYjtcblxuXHR9O1xuXHR0aGlzLnNlZWtFbmFibGVkID0gZnVuY3Rpb24oYikge1xuXHRcdGlmIChiID09PSB1bmRlZmluZWQpIHJldHVybiBfc2Vlaztcblx0XHRfc2VlayA9IGI7XG5cdH07XG5cdHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdF9lbmFibGVkID0gdHJ1ZTtcblx0XHRfdElkID0gbnVsbDtcblx0XHRfc2VlayA9IHRydWU7XG5cdFx0X2RvYy5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duLmJpbmQodGhpcyksIGZhbHNlKTtcblx0XHRfZG9jLmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cC5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdH07XG5cdHRoaXMuZGVzdHJveSA9ICBmdW5jdGlvbigpIHtcblx0XHRfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdF90SWQgPSBudWxsO1xuXHRcdF9zZWVrID0gdHJ1ZTtcblx0XHRfZG9jLmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24pO1xuXHRcdF9kb2MuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwKTtcblx0fVxuXHR0aGlzLmluaXQoKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGV4dGVybmFsQ29udHJvbHM7IiwiLy9odHRwczovL2dpdGh1Yi5jb20vZmRhY2l1ay9hamF4XG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XG4gICAgdmFyIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnXVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgb3B0aW9ucy5iYXNlVXJsID0gb3B0aW9ucy5iYXNlVXJsIHx8ICcnXG4gICAgaWYgKG9wdGlvbnMubWV0aG9kICYmIG9wdGlvbnMudXJsKSB7XG4gICAgICByZXR1cm4geGhyQ29ubmVjdGlvbihcbiAgICAgICAgb3B0aW9ucy5tZXRob2QsXG4gICAgICAgIG9wdGlvbnMuYmFzZVVybCArIG9wdGlvbnMudXJsLFxuICAgICAgICBtYXliZURhdGEob3B0aW9ucy5kYXRhKSxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kcy5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBtZXRob2QpIHtcbiAgICAgIGFjY1ttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiB4aHJDb25uZWN0aW9uKFxuICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICBvcHRpb25zLmJhc2VVcmwgKyB1cmwsXG4gICAgICAgICAgbWF5YmVEYXRhKGRhdGEpLFxuICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY1xuICAgIH0sIHt9KVxuICB9XG5cbiAgZnVuY3Rpb24gbWF5YmVEYXRhKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YSB8fCBudWxsXG4gIH1cblxuICBmdW5jdGlvbiB4aHJDb25uZWN0aW9uKHR5cGUsIHVybCwgZGF0YSwgb3B0aW9ucykge1xuICAgIHZhciByZXR1cm5NZXRob2RzID0gWyd0aGVuJywgJ2NhdGNoJywgJ2Fsd2F5cyddXG4gICAgdmFyIHByb21pc2VNZXRob2RzID0gcmV0dXJuTWV0aG9kcy5yZWR1Y2UoZnVuY3Rpb24ocHJvbWlzZSwgbWV0aG9kKSB7XG4gICAgICBwcm9taXNlW21ldGhvZF0gPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBwcm9taXNlW21ldGhvZF0gPSBjYWxsYmFja1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9LCB7fSlcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICB4aHIub3Blbih0eXBlLCB1cmwsIHRydWUpXG4gICAgeGhyLndpdGhDcmVkZW50aWFscyA9IG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3dpdGhDcmVkZW50aWFscycpXG4gICAgc2V0SGVhZGVycyh4aHIsIG9wdGlvbnMuaGVhZGVycylcbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIHJlYWR5KHByb21pc2VNZXRob2RzLCB4aHIpLCBmYWxzZSlcbiAgICB4aHIuc2VuZChvYmplY3RUb1F1ZXJ5U3RyaW5nKGRhdGEpKVxuICAgIHByb21pc2VNZXRob2RzLmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geGhyLmFib3J0KClcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2VNZXRob2RzXG4gIH1cblxuICBmdW5jdGlvbiBzZXRIZWFkZXJzKHhociwgaGVhZGVycykge1xuICAgIGhlYWRlcnMgPSBoZWFkZXJzIHx8IHt9XG4gICAgaWYgKCFoYXNDb250ZW50VHlwZShoZWFkZXJzKSkge1xuICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIChoZWFkZXJzW25hbWVdICYmIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIGhlYWRlcnNbbmFtZV0pKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBoYXNDb250ZW50VHlwZShoZWFkZXJzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGhlYWRlcnMpLnNvbWUoZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZSdcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZHkocHJvbWlzZU1ldGhvZHMsIHhocikge1xuICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVSZWFkeSgpIHtcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0geGhyLkRPTkUpIHtcbiAgICAgICAgeGhyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBoYW5kbGVSZWFkeSwgZmFsc2UpXG4gICAgICAgIHByb21pc2VNZXRob2RzLmFsd2F5cy5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKVxuXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgcHJvbWlzZU1ldGhvZHMudGhlbi5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2VNZXRob2RzLmNhdGNoLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlKHhocikge1xuICAgIHZhciByZXN1bHRcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVRleHRcbiAgICB9XG4gICAgcmV0dXJuIFtyZXN1bHQsIHhocl1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9iamVjdFRvUXVlcnlTdHJpbmcoZGF0YSkge1xuICAgIHJldHVybiBpc09iamVjdChkYXRhKSA/IGdldFF1ZXJ5U3RyaW5nKGRhdGEpIDogZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gaXNPYmplY3QoZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgPT09ICdbb2JqZWN0IE9iamVjdF0nXG4gIH1cblxuICBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZyhvYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpdGVtKSB7XG4gICAgICB2YXIgcHJlZml4ID0gIWFjYyA/ICcnIDogYWNjICsgJyYnXG4gICAgICByZXR1cm4gcHJlZml4ICsgZW5jb2RlKGl0ZW0pICsgJz0nICsgZW5jb2RlKG9iamVjdFtpdGVtXSlcbiAgICB9LCAnJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuY29kZSh2YWx1ZSkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpXG4gIH1cblxuICByZXR1cm4gYWpheFxufSkoKTsiLCJpbXBvcnQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGZyb20gJy4uL3BvbHlmaWxscy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUnO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQge1xuXHRjYXBpdGFsaXplRmlyc3RMZXR0ZXIsXG5cdHNjYWxlRm9udCxcblx0ZGVib3VuY2Vcbn0gZnJvbSAnLi4vaGVscGVycy91dGlscyc7XG5pbXBvcnQgZG9tIGZyb20gJy4uL2hlbHBlcnMvZG9tJztcbmltcG9ydCBkZXZpY2UgZnJvbSAnLi4vaGVscGVycy9kZXZpY2UnO1xuaW1wb3J0IE1lZGlhIGZyb20gJy4vbWVkaWEvaW5kZXgnO1xuaW1wb3J0IGNvbnRhaW5lckJvdW5kcyBmcm9tICcuLi9oZWxwZXJzL2NvbnRhaW5lckJvdW5kcyc7XG5pbXBvcnQgcGFnZVZpc2liaWxpdHkgZnJvbSAnLi4vaGVscGVycy9wYWdlVmlzaWJpbGl0eSc7XG5pbXBvcnQgZXh0ZXJuYWxDb250cm9scyBmcm9tICcuL21lZGlhL2V2ZW50cy9leHRlcm5hbENvbnRyb2xzJztcbmltcG9ydCBhamF4IGZyb20gJy4uL2hlbHBlcnMvYWpheCc7XG5cbmNvbnN0IGZuX2NvbnRleHRtZW51ID0gZnVuY3Rpb24oZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgZGVmYXVsdHMgPSB7XG5cdHZpZGVvV2lkdGg6IDkyMCxcblx0dmlkZW9IZWlnaHQ6IDUyMCxcblx0YXV0b3BsYXk6IGZhbHNlLFxuXHRsb29wOiBmYWxzZSxcblx0Y29udHJvbHM6IGZhbHNlLFxuXHRmb250OiB7XG5cdFx0cmF0aW86IDEsXG5cdFx0bWluOiAuNSxcblx0XHR1bml0czogXCJlbVwiXG5cdH0sXG5cdGNvbnRleHRNZW51OiBmYWxzZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIGV4dGVuZHMgTWVkaWEge1xuXHRjb25zdHJ1Y3RvcihzZXR0aW5ncywgX2V2ZW50cykge1xuXHRcdGxldCBlbCA9IHNldHRpbmdzLnZpZGVvO1xuXHRcdHN1cGVyKGVsKTtcblx0XHRpZiAoZWwgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdHRoaXMuZGV2aWNlID0gZGV2aWNlO1xuXHRcdHRoaXMuX19zZXR0aW5ncyA9IHt9O1xuXHRcdGRvbS5hZGRDbGFzcyhlbCwgXCJrbWxcIiArIGNhcGl0YWxpemVGaXJzdExldHRlcihlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSk7XG5cdFx0dGhpcy53cmFwcGVyID0gZG9tLndyYXAodGhpcy5tZWRpYSwgZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdGNsYXNzOiAna21sUGxheWVyJ1xuXHRcdH0pKTtcblx0XHRkb20udHJpZ2dlcldlYmtpdEhhcmR3YXJlQWNjZWxlcmF0aW9uKHRoaXMud3JhcHBlcik7XG5cdFx0XG5cdFx0Ly9pbml0U2V0dGluZ3Ncblx0XHR0aGlzLnNldHRpbmdzKGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dGluZ3MpKVxuXG5cdFx0Ly9pbml0UGFnZVZpc2liaWxpdHlcblx0XHR0aGlzLnBhZ2VWaXNpYmlsaXR5ID0gbmV3IHBhZ2VWaXNpYmlsaXR5KGVsKTtcblxuXHRcdC8vaW5pdGV4dGVybmFsQ29udHJvbHNcblx0XHR0aGlzLmV4dGVybmFsQ29udHJvbHMgPSBuZXcgZXh0ZXJuYWxDb250cm9scyhlbCk7XG5cblx0XHQvL2luaXRDYWxsYmFja0V2ZW50c1xuXHRcdGZvciAodmFyIGV2dCBpbiBfZXZlbnRzKSB7XG5cdFx0XHR0aGlzLm9uKGV2dCwgX2V2ZW50c1tldnRdLCB0aGlzKTtcblx0XHR9XG5cblx0XHR0aGlzLm9uKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcblx0XHRcdGlmICh0aGlzLm1lZGlhLndpZHRoICE9IHRoaXMubWVkaWEudmlkZW9XaWR0aCB8fCB0aGlzLm1lZGlhLmhlaWdodCAhPSB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0KSB7XG5cdFx0XHRcdHRoaXMudmlkZW9XaWR0aCgpO1xuXHRcdFx0XHR0aGlzLnZpZGVvSGVpZ2h0KCk7XG5cdFx0XHRcdHRoaXMuZW1pdCgncmVzaXplJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fVxuXG5cdHNldHRpbmdzKHNldHRpbmdzKXtcblx0XHRpZihzZXR0aW5ncyA9PSBudWxsKSByZXR1cm4gdGhpcy5fX3NldHRpbmdzO1xuXHRcdHRoaXMuX19zZXR0aW5ncyA9IGRlZXBtZXJnZSh0aGlzLl9fc2V0dGluZ3MsIHNldHRpbmdzKTtcblx0XHQvL2luaXRTZXR0aW5nc1xuXHRcdGZvciAodmFyIGsgaW4gdGhpcy5fX3NldHRpbmdzKSB7XG5cdFx0XHRpZiAodGhpc1trXSkge1xuXHRcdFx0XHRpZiAoayA9PT0gJ2F1dG9wbGF5JyAmJiB0aGlzLl9fc2V0dGluZ3Nba10pIHtcblx0XHRcdFx0XHR0aGlzLnBsYXkoKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzW2tdKHRoaXMuX19zZXR0aW5nc1trXSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoayA9PT0gJ2NvbnRyb2xzJyAmJiB0aGlzLl9fc2V0dGluZ3Nba10gPT09IFwibmF0aXZlXCIpIHtcblx0XHRcdFx0dGhpcy5uYXRpdmVDb250cm9scyh0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX19zZXR0aW5ncztcblx0fVxuXG5cdGNvbnRleHRNZW51KHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0diA/IHRoaXMubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmbl9jb250ZXh0bWVudSkgOiB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUpO1xuXHRcdH1cblx0fVxuXG5cdGFqYXgob3B0aW9ucykge1xuXHRcdHJldHVybiBhamF4KG9wdGlvbnMpO1xuXHR9XG5cblx0dmlkZW9XaWR0aCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9XaWR0aCkge1xuXHRcdFx0dGhpcy5tZWRpYS53aWR0aCA9IHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvV2lkdGg7XG5cdFx0fVxuXHRcdGlmICghaXNOYU4odikpIHtcblx0XHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdFx0dGhpcy5tZWRpYS53aWR0aCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLndpZHRoO1xuXHR9XG5cblx0dmlkZW9IZWlnaHQodikge1xuXHRcdGlmICh0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0KSB7XG5cdFx0XHR0aGlzLm1lZGlhLmhlaWdodCA9IHRoaXMubWVkaWEudmlkZW9IZWlnaHQ7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS52aWRlb0hlaWdodDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLmhlaWdodCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmhlaWdodDtcblx0fVxuXG5cdHNjYWxlKCkge1xuXHRcdHJldHVybiB0aGlzLnZpZGVvV2lkdGgoKSAvIHRoaXMudmlkZW9IZWlnaHQoKTtcblx0fVxuXG5cdGJvdW5kcyh2KSB7XG5cdFx0bGV0IGRhdGEgPSBjb250YWluZXJCb3VuZHModGhpcy5tZWRpYSk7XG5cdFx0aWYgKGRhdGFbdl0gIT09IG51bGwpIHJldHVybiBkYXRhW3ZdO1xuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0d2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCd3aWR0aCcpO1xuXHR9XG5cblx0aGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnaGVpZ2h0Jyk7XG5cdH1cblxuXHRvZmZzZXRYKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnb2Zmc2V0WCcpO1xuXHR9XG5cblx0b2Zmc2V0WSgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ29mZnNldFknKTtcblx0fVxuXG5cdHdyYXBwZXJIZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0SGVpZ2h0O1xuXHR9XG5cblx0d3JhcHBlcldpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLm9mZnNldFdpZHRoO1xuXHR9XG5cblx0d3JhcHBlclNjYWxlKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLm9mZnNldFdpZHRoIC8gdGhpcy5tZWRpYS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHRhZGRDbGFzcyh2LCBlbCkge1xuXHRcdGlmIChlbCAhPSBudWxsKSB7XG5cdFx0XHRkb20uYWRkQ2xhc3ModiwgZWwpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRkb20uYWRkQ2xhc3ModGhpcy53cmFwcGVyLCB2KTtcblx0fVxuXHRyZW1vdmVDbGFzcyh2LCBlbCkge1xuXHRcdGlmIChlbCAhPSBudWxsKSB7XG5cdFx0XHRkb20ucmVtb3ZlQ2xhc3ModiwgZWwpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodiAhPT0gJ2ttbFBsYXllcicpIHtcblx0XHRcdGRvbS5yZW1vdmVDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHRcdH1cblx0fVxuXHR0b2dnbGVDbGFzcyh2LCBlbCkge1xuXHRcdGlmIChlbCAhPSBudWxsKSB7XG5cdFx0XHRkb20udG9nZ2xlQ2xhc3ModiwgZWwpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodiAhPT0gJ2ttbFBsYXllcicpIHtcblx0XHRcdGRvbS50b2dnbGVDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHRcdH1cblx0fVxufTsiLCJpbXBvcnQgZG9tIGZyb20gJy4uLy4uL2hlbHBlcnMvZG9tJztcbmltcG9ydCBQb3B1cCBmcm9tICcuL3BvcHVwJztcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCB7XG5cdGlzRnVuY3Rpb25cbn0gZnJvbSAnLi4vLi4vaGVscGVycy91dGlscyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyB2aWRlb0NvbnRhaW5lciBleHRlbmRzIFBvcHVwe1xuXHRjb25zdHJ1Y3RvcihlbCwgb3B0cywgY3R4LCBwYXJlbnRQbGF5ZXIpe1xuXHRcdHN1cGVyKGVsLCBvcHRzLCBjdHgsIHBhcmVudFBsYXllcik7XG5cdFx0bGV0IGRvbVZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblx0XHR0aGlzLmJvZHkuYXBwZW5kQ2hpbGQoZG9tVmlkZW8pO1xuXHRcdHRoaXMucGxheWVyID0gbmV3IFBsYXllcih7dmlkZW86ZG9tVmlkZW99KTtcblx0XHR0aGlzLnBsYXllci5jb250YWluZXJcblx0XHRsZXQgcGF1c2VkID0gZmFsc2U7XG5cdFx0dGhpcy5vbignYmVmb3JlSGlkZScsICgpPT57XG5cdFx0XHRwYXVzZWQgPSB0aGlzLnBsYXllci5wYXVzZWQoKTtcblx0XHRcdHRoaXMucGxheWVyLnBhdXNlKCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5vbignc2hvdycsICgpPT57XG5cdFx0XHRpZighcGF1c2VkKXtcblx0XHRcdFx0dGhpcy5wbGF5ZXIucGxheSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMub24oJ2VuZGVkJywgKCk9Pntcblx0XHRcdGlmIChpc0Z1bmN0aW9uKG9wdHMub25FbmRlZCkpIG9wdHMub25FbmRlZCgpO1xuXHRcdH0pO1xuXHRcdG9wdHMuc2l6ZVJhdGlvID0gb3B0cy5zaXplUmF0aW8gfHwgODA7XG5cdFx0dGhpcy5zY2FsZVNpemUgPSBmdW5jdGlvbihzKXtcblx0XHRcdG9wdHMuc2l6ZVJhdGlvID0gcztcblx0XHRcdHRoaXMuZW1pdCgncmVzaXplJyk7XG5cdFx0fVxuXHRcdHRoaXMucGxheWVyLm9uKCdlbmRlZCcsICgpPT57dGhpcy5lbWl0KCdlbmRlZCcpO30pO1xuXHRcdHRoaXMub24oJ3Jlc2l6ZScsICgpPT57XG5cdFx0XHRsZXQgeSA9IDA7XG5cdFx0XHRsZXQgeCA9IDA7XG5cdFx0XHRsZXQgdyA9IHBhcmVudFBsYXllci53aWR0aCgpO1xuXHRcdFx0bGV0IGggPSBwYXJlbnRQbGF5ZXIuaGVpZ2h0KCk7XG5cdFx0XHRsZXQgciA9IHRoaXMucGxheWVyLnNjYWxlKCk7XG5cdFx0XHRsZXQgZncgPSB3OyBsZXQgZmggPSBoO1xuXHRcdFx0bGV0IHd3ID0gdzsgbGV0IGhoID0gaDtcblx0XHRcdGxldCBoZWFkZXJIZWlnaHQgPSAxMDtcblx0XHRcdGlmICh3ID4gcipoKSB7XG5cdFx0XHRcdGZ3ID0gcipoO1xuXHRcdFx0XHRmaCA9IGg7XG5cdFx0XHRcdHd3ID0gZnc7XG5cdFx0XHRcdGhlYWRlckhlaWdodCA9IChoLzEwKS9maCoxMDA7XG5cdFx0XHRcdGZ3ID0gb3B0cy5zaXplUmF0aW8qKGZ3L3cqMTAwKS8xMDA7XG5cdFx0XHRcdGZoID0gb3B0cy5zaXplUmF0aW87XG5cdFx0XHR9IGVsc2UgaWYgKGggPiB3L3IpIHtcblx0XHRcdFx0ZmggPSB3L3I7XG5cdFx0XHRcdGZ3ID0gdztcblx0XHRcdFx0aGggPSBmaDtcblx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gKGgvMTApL2ZoKjEwMDtcblx0XHRcdFx0ZmggPSBvcHRzLnNpemVSYXRpbyooZmgvaCoxMDApLzEwMDtcblx0XHRcdFx0ZncgPSBvcHRzLnNpemVSYXRpbztcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRmdyA9IG9wdHMuc2l6ZVJhdGlvO1xuXHRcdFx0XHRmaCA9IG9wdHMuc2l6ZVJhdGlvO1xuXHRcdFx0fTtcblx0XHRcdHggPSAoMTAwIC0gZncpLzI7XG5cdFx0XHR5ID0gKDEwMCAtIGZoKS8yO1xuXHRcdFx0Ly90aGlzLl90aXRsZS5wYXJlbnROb2RlLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKC0xMDAlKSc7XHRcblx0XHRcdHRoaXMuX3RpdGxlLnBhcmVudE5vZGUuc3R5bGUuaGVpZ2h0ID0gaGVhZGVySGVpZ2h0KyclJztcblx0XHRcdHRoaXMuY29uZmlnKHtcblx0XHRcdFx0eDogeC93Knd3KyclJyxcblx0XHRcdFx0eTogNSt5L2gqaGgrJyUnLFxuXHRcdFx0XHR3aWR0aCA6IGZ3K1wiJVwiLFxuXHRcdFx0XHRoZWlnaHQ6IGZoK1wiJVwiXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuYXV0b0xpbmVIZWlnaHQoKTtcblx0XHR9KTtcblxuXG5cdFx0cGFyZW50UGxheWVyLm9uKCdsb2FkZWRtZXRhZGF0YScsICgpPT57XG5cdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGxheWVyLm9uKCdsb2FkZWRtZXRhZGF0YScsICgpPT57XG5cdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdH0pO1xuXHRcdHRoaXMucGxheWVyLmxvYWQob3B0cy51cmwpO1xuXHR9XG59IiwiaW1wb3J0IGRvbSBmcm9tICcuLi8uLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4uLy4uL2hlbHBlcnMvZGVlcG1lcmdlJztcbmltcG9ydCBhZGFwdGl2ZVNpemVQb3MgZnJvbSAnLi9hZGFwdGl2ZVNpemVQb3MnO1xuaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL2NvbnRhaW5lcidcbmltcG9ydCBwb3B1cCBmcm9tICcuL3BvcHVwJ1xuaW1wb3J0IHZpZGVvQ29udGFpbmVyIGZyb20gJy4vdmlkZW9Db250YWluZXInXG5cbmxldCBkZWZhdWx0cyA9IHtcblx0YmFja2dyb3VuZENvbG9yOiAnJyxcblx0b25IaWRlOiBudWxsLFxuXHRvblNob3c6IG51bGwsXG5cdGV4dGVybmFsQ29udHJvbHM6IHRydWUsXG5cdHZpc2libGU6IGZhbHNlLFxuXHRwYXVzZTogdHJ1ZVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWluZXJzIHtcblx0Y29uc3RydWN0b3IoY3R4KSB7XG5cdFx0dGhpcy53cmFwcGVyID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdGNsYXNzOiAna21sQ29udGFpbmVycydcblx0XHR9KTtcblx0XHR0aGlzLl9lbHMgPSBbXTtcblx0XHRsZXQgYWMgPSBuZXcgYWRhcHRpdmVTaXplUG9zKHt9LCBjdHgpO1xuXHRcdGFjLmFwcGx5VG8odGhpcy53cmFwcGVyKTtcblxuXHRcdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdGlmICh2ICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKHYgPT0gMCkge1xuXHRcdFx0XHRcdHYgPSBmYWxzZTtcblx0XHRcdFx0XHR0aGlzLndyYXBwZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHYpe1xuXHRcdFx0XHRcdHRoaXMud3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFjLmVuYWJsZWQodik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYWMuZW5hYmxlZCgpO1xuXHRcdH1cblxuXHRcdHRoaXMuY2hlY2tWaXNpYmxlRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGxldCBubyA9IDA7XG5cdFx0XHRmb3IgKHZhciBrIGluIHRoaXMuX2Vscykge1xuXHRcdFx0XHRpZiAodGhpcy5fZWxzW2tdLnZpc2libGUoKSkge1xuXHRcdFx0XHRcdG5vICs9IDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuZW5hYmxlZChubyk7XG5cdFx0fVxuXG5cdFx0Y3R4LndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy53cmFwcGVyKTtcblxuXG5cdFx0bGV0IGN1cnJlbnRWaXNpYmxlcyA9IFtdO1xuXHRcdHRoaXMuaGlkZSA9IGZ1bmN0aW9uKGN1cnJlbnQpIHtcblx0XHRcdGZvciAodmFyIGsgaW4gdGhpcy5fZWxzKSB7XG5cdFx0XHRcdGxldCBjdXJyZW50Q29udGFpbmVyID0gdGhpcy5fZWxzW2tdO1xuXHRcdFx0XHRpZiAodGhpcy5fZWxzW2tdICE9PSBjdXJyZW50KSB7XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRDb250YWluZXIudmlzaWJsZSgpKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50Q29udGFpbmVyLmhpZGUoKTtcblx0XHRcdFx0XHRcdGN1cnJlbnRWaXNpYmxlcy5wdXNoKGN1cnJlbnRDb250YWluZXIpO1xuXHRcdFx0XHRcdFx0Y3VycmVudENvbnRhaW5lci52aXNpYmxlKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRcdGZvciAodmFyIGsgaW4gY3VycmVudFZpc2libGVzKSB7XG5cdFx0XHRcdGN1cnJlbnRWaXNpYmxlc1trXS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHRjdXJyZW50VmlzaWJsZXMgPSBbXTtcblx0XHR9XG5cblx0XHR0aGlzLmFkZCA9IGZ1bmN0aW9uKG9wdHMsIGVsID0ge30sIHR5cGUpIHtcblx0XHRcdGxldCBjbHMgPSAnQ29udGFpbmVyJztcblx0XHRcdGlmKHR5cGUgIT0gJ2NvbnRhaW5lcicpIGNscyA9ICdQb3B1cCc7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSBkZWVwbWVyZ2UoZGVmYXVsdHMsIG9wdHMpO1xuXHRcdFx0bGV0IGNvbnRhaW5lckhvbGRlciA9IGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGN0eC5hZGRDbGFzcyhjb250YWluZXJIb2xkZXIsICdrbWwnK2NscysnIGhpZGRlbicpO1xuXHRcdFx0bGV0IGttbENvbnRhaW5lckJvZHkgPSBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRpZiAoZWwpIHtcblx0XHRcdFx0aWYgKCFlbC5ub2RlVHlwZSkge1xuXHRcdFx0XHRcdGVsID0ga21sQ29udGFpbmVyQm9keTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWwgPSBrbWxDb250YWluZXJCb2R5O1xuXHRcdFx0fVxuXHRcdFx0ZG9tLmFkZENsYXNzKGVsLCAnYm9keScpO1xuXHRcdFx0XG5cdFx0XHRjb250YWluZXJIb2xkZXIuYXBwZW5kQ2hpbGQoZWwpO1xuXHRcdFx0bGV0IGNvbnRhaW5lciA9IG51bGw7XG5cdFx0XHRzd2l0Y2godHlwZSl7XG5cdFx0XHRcdGNhc2UgJ3ZpZGVvJzpcblx0XHRcdFx0XHRjb250YWluZXIgPSBuZXcgdmlkZW9Db250YWluZXIoY29udGFpbmVySG9sZGVyLCBzZXR0aW5ncywgdGhpcywgY3R4KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAncG9wdXAnOlxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IG5ldyBwb3B1cChjb250YWluZXJIb2xkZXIsIHNldHRpbmdzLCB0aGlzLCBjdHgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IG5ldyBDb250YWluZXIoY29udGFpbmVySG9sZGVyLCBzZXR0aW5ncywgdGhpcywgY3R4KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMuX2Vscy5wdXNoKGNvbnRhaW5lcik7XG5cdFx0XHR0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVySG9sZGVyKTtcblx0XHRcdHJldHVybiBjb250YWluZXI7XG5cdFx0fVxuXG5cdFx0dGhpcy5yZW1vdmUgPSAoY29udGFpbmVyKT0+e1xuXHRcdFx0Zm9yKHZhciBpID0gMCwgbiA9IHRoaXMuX2Vscy5sZW5ndGg7IGk8bjsgaSs9MSl7XG5cdFx0XHRcdGxldCBjID0gdGhpcy5fZWxzW2ldO1xuXHRcdFx0XHRpZihjLmJvZHkgPT09IGNvbnRhaW5lcil7XG5cdFx0XHRcdFx0dGhpcy5fZWxzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRpZih0aGlzLl9lbHMubGVuZ3RoID09IDApIHRoaXMuZW5hYmxlZChmYWxzZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZWxzKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2Vsc1tpZF0gfHwgdGhpcy5fZWxzO1xuXHR9XG59IiwiaW1wb3J0IHJlcXVlc3RBbmltYXRpb25GcmFtZSBmcm9tICcuL3BvbHlmaWxscy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUnO1xuaW1wb3J0IHRvY2NhIGZyb20gJy4vcG9seWZpbGxzL3RvY2NhJztcbmltcG9ydCBpbkZyYW1lIGZyb20gJy4vaGVscGVycy9pbkZyYW1lJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQge1xuXHRjYXBpdGFsaXplRmlyc3RMZXR0ZXIsXG5cdHNjYWxlRm9udCxcblx0ZGVib3VuY2Vcbn0gZnJvbSAnLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkb20gZnJvbSAnLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgZGV2aWNlIGZyb20gJy4vaGVscGVycy9kZXZpY2UnO1xuaW1wb3J0IGF1dG9Gb250IGZyb20gJy4vY29yZS9hdXRvRm9udCc7XG5pbXBvcnQgQ29udGFpbmVycyBmcm9tICcuL2NvcmUvY29udGFpbmVyL2NvbnRhaW5lcnMnO1xuaW1wb3J0IE1lZGlhIGZyb20gJy4vY29yZS9tZWRpYS9pbmRleCc7XG5pbXBvcnQgY29udGFpbmVyQm91bmRzIGZyb20gJy4vaGVscGVycy9jb250YWluZXJCb3VuZHMnO1xuaW1wb3J0IHBhZ2VWaXNpYmlsaXR5IGZyb20gJy4vaGVscGVycy9wYWdlVmlzaWJpbGl0eSc7XG5pbXBvcnQgZXh0ZXJuYWxDb250cm9scyBmcm9tICcuL2NvcmUvbWVkaWEvZXZlbnRzL2V4dGVybmFsQ29udHJvbHMnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi9oZWxwZXJzL2FqYXgnO1xuXG5jb25zdCBmbl9jb250ZXh0bWVudSA9IGZ1bmN0aW9uKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuXHR2aWRlb1dpZHRoOiA5MjAsXG5cdHZpZGVvSGVpZ2h0OiA1MjAsXG5cdGF1dG9wbGF5OiBmYWxzZSxcblx0bG9vcDogZmFsc2UsXG5cdGNvbnRyb2xzOiBmYWxzZSxcblx0Zm9udDoge1xuXHRcdHJhdGlvOiAxLFxuXHRcdG1pbjogLjUsXG5cdFx0dW5pdHM6IFwiZW1cIlxuXHR9XG59O1xuXG5jbGFzcyBrbWxQbGF5ZXIgZXh0ZW5kcyBNZWRpYSB7XG5cdGNvbnN0cnVjdG9yKHNldHRpbmdzLCBfZXZlbnRzLCBhcHApIHtcblx0XHRsZXQgZWwgPSBzZXR0aW5ncy52aWRlbztcblx0XHRzdXBlcihlbCk7XG5cdFx0dGhpcy5pZnJhbWUgPSBpbkZyYW1lKCk7XG5cdFx0aWYgKGVsID09IG51bGwpIHJldHVybjtcblx0XHR0aGlzLl9ib3VuZHMgPSB7fTtcblx0XHR0aGlzLmRldmljZSA9IGRldmljZTtcblx0XHR0aGlzLl9fc2V0dGluZ3MgPSBkZWVwbWVyZ2UoZGVmYXVsdHMsIHNldHRpbmdzKTtcblx0XHRkb20uYWRkQ2xhc3MoZWwsIFwia21sXCIgKyBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkpO1xuXHRcdHRoaXMud3JhcHBlciA9IGRvbS53cmFwKHRoaXMubWVkaWEsIGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG5cdFx0XHRjbGFzczogJ2ttbFBsYXllcidcblx0XHR9KSk7XG5cdFx0ZG9tLnRyaWdnZXJXZWJraXRIYXJkd2FyZUFjY2VsZXJhdGlvbih0aGlzLndyYXBwZXIpO1xuXHRcdGlmICh0aGlzLmluSWZyYW1lKSB7XG5cdFx0XHRkb20uYWRkQ2xhc3ModGhpcy53cmFwcGVyLCBcImluRnJhbWVcIik7XG5cdFx0fVxuXHRcdC8vaW5pdFNldHRpbmdzXG5cdFx0Zm9yICh2YXIgayBpbiB0aGlzLl9fc2V0dGluZ3MpIHtcblx0XHRcdGlmICh0aGlzW2tdKSB7XG5cdFx0XHRcdGlmIChrID09PSAnYXV0b3BsYXknICYmIHRoaXMuX19zZXR0aW5nc1trXSAmJiAhdGhpcy5pbklmcmFtZSkge1xuXHRcdFx0XHRcdHRoaXMucGxheSgpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXNba10odGhpcy5fX3NldHRpbmdzW2tdKTtcblx0XHRcdH1cblx0XHRcdGlmIChrID09PSAnY29udHJvbHMnICYmIHRoaXMuX19zZXR0aW5nc1trXSA9PT0gXCJuYXRpdmVcIikge1xuXHRcdFx0XHR0aGlzLm5hdGl2ZUNvbnRyb2xzKHRydWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vaW5pdFBhZ2VWaXNpYmlsaXR5XG5cdFx0dGhpcy5wYWdlVmlzaWJpbGl0eSA9IG5ldyBwYWdlVmlzaWJpbGl0eShlbCk7XG5cblx0XHQvL2luaXRleHRlcm5hbENvbnRyb2xzXG5cdFx0dGhpcy5leHRlcm5hbENvbnRyb2xzID0gbmV3IGV4dGVybmFsQ29udHJvbHMoZWwpO1xuXG5cdFx0Ly9pbml0Q29udGFpbmVyc1xuXHRcdHRoaXMuY29udGFpbmVycyA9IG5ldyBDb250YWluZXJzKHRoaXMpO1xuXG5cdFx0dGhpcy5jb250YWluZXIgPSBmdW5jdGlvbihzdGcsIGVsKXtcblx0XHRcdHJldHVybiB0aGlzLmNvbnRhaW5lcnMuYWRkKHN0ZywgZWwsICdjb250YWluZXInKTtcblx0XHR9XG5cblx0XHR0aGlzLnZpZGVvQ29udGFpbmVyID0gZnVuY3Rpb24oc3RnKXtcblx0XHRcdHJldHVybiB0aGlzLmNvbnRhaW5lcnMuYWRkKHN0ZywgbnVsbCwgJ3ZpZGVvJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5wb3B1cENvbnRhaW5lciA9IGZ1bmN0aW9uKHN0Zyl7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb250YWluZXJzLmFkZChzdGcsIG51bGwsICdwb3B1cCcpO1xuXHRcdH1cblxuXHRcdC8vYXV0b0ZPTlRcblx0XHRpZiAodHlwZW9mIHRoaXMuX19zZXR0aW5ncy5mb250ID09PSBcImJvb2xlYW5cIiAmJiB0aGlzLl9fc2V0dGluZ3MuZm9udCkgdGhpcy5fX3NldHRpbmdzLmZvbnQgPSBkZWZhdWx0cy5mb250O1xuXHRcdHRoaXMuYXV0b0ZvbnQgPSBuZXcgYXV0b0ZvbnQodGhpcy53cmFwcGVyLCB0aGlzLl9fc2V0dGluZ3MuZm9udCwgdGhpcyk7XG5cdFx0aWYgKHRoaXMuX19zZXR0aW5ncy5mb250KSB0aGlzLmF1dG9Gb250LmVuYWJsZWQodHJ1ZSk7XG5cblx0XHQvL2luaXRDYWxsYmFja0V2ZW50c1xuXHRcdGZvciAodmFyIGV2dCBpbiBfZXZlbnRzKSB7XG5cdFx0XHR0aGlzLm9uKGV2dCwgX2V2ZW50c1tldnRdLCB0aGlzKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGFwcCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0YXBwLmJpbmQodGhpcyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5vbignbG9hZGVkbWV0YWRhdGEnLCAoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5tZWRpYS53aWR0aCAhPSB0aGlzLm1lZGlhLnZpZGVvV2lkdGggfHwgdGhpcy5tZWRpYS5oZWlnaHQgIT0gdGhpcy5tZWRpYS52aWRlb0hlaWdodCkge1xuXHRcdFx0XHR0aGlzLnZpZGVvV2lkdGgoKTtcblx0XHRcdFx0dGhpcy52aWRlb0hlaWdodCgpO1xuXHRcdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXRoaXMuX2FwcCl7XG5cdFx0XHRcdGFwcC5iaW5kKHRoaXMpKCk7XG5cdFx0XHRcdHRoaXMuX2FwcCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9KTtcblxuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RibHRhcCcsICgpPT57dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7fSk7XG5cblx0XHRsZXQgdmlkZW9TaXplQ2FjaGUgPSB7XG5cdFx0XHR3OiB0aGlzLndpZHRoKCksXG5cdFx0XHR4OiB0aGlzLm9mZnNldFgoKSxcblx0XHRcdHk6IHRoaXMub2Zmc2V0WSgpLFxuXHRcdFx0aDogdGhpcy5oZWlnaHQoKVxuXHRcdH1cblx0XHRsZXQgY2hlY2tWaWRlb1Jlc2l6ZSA9ICgpID0+IHtcblx0XHRcdHRoaXMuX2JvdW5kcyA9IGNvbnRhaW5lckJvdW5kcyh0aGlzLm1lZGlhKTtcblx0XHRcdGxldCB3ID0gdGhpcy53aWR0aCgpO1xuXHRcdFx0bGV0IGggPSB0aGlzLndpZHRoKCk7XG5cdFx0XHRsZXQgeCA9IHRoaXMub2Zmc2V0WCgpO1xuXHRcdFx0bGV0IHkgPSB0aGlzLm9mZnNldFkoKTtcblx0XHRcdGlmICh2aWRlb1NpemVDYWNoZS53ICE9IHcgfHwgdmlkZW9TaXplQ2FjaGUuaCAhPSBoIHx8IHZpZGVvU2l6ZUNhY2hlLnggIT0geCB8fCB2aWRlb1NpemVDYWNoZS55ICE9IHkpIHtcblx0XHRcdFx0dmlkZW9TaXplQ2FjaGUudyA9IHc7XG5cdFx0XHRcdHZpZGVvU2l6ZUNhY2hlLmggPSBoO1xuXHRcdFx0XHR2aWRlb1NpemVDYWNoZS54ID0geDtcblx0XHRcdFx0dmlkZW9TaXplQ2FjaGUueSA9IHk7XG5cdFx0XHRcdHRoaXMuZW1pdCgncmVzaXplJyk7XG5cdFx0XHR9XG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoZWNrVmlkZW9SZXNpemUpO1xuXHRcdH1cblxuXHRcdGNoZWNrVmlkZW9SZXNpemUoKTtcblx0fVxuXG5cdGNvbnRleHRNZW51KHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0diA/IHRoaXMubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmbl9jb250ZXh0bWVudSkgOiB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUpO1xuXHRcdH1cblx0fVxuXG5cdGFqYXgob3B0aW9ucykge1xuXHRcdHJldHVybiBhamF4KG9wdGlvbnMpO1xuXHR9XG5cblx0dmlkZW9XaWR0aCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9XaWR0aCkge1xuXHRcdFx0dGhpcy5tZWRpYS53aWR0aCA9IHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvV2lkdGg7XG5cdFx0fVxuXHRcdGlmICghaXNOYU4odikpIHtcblx0XHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdFx0dGhpcy5tZWRpYS53aWR0aCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLndpZHRoO1xuXHR9XG5cblx0dmlkZW9IZWlnaHQodikge1xuXHRcdGlmICh0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0KSB7XG5cdFx0XHR0aGlzLm1lZGlhLmhlaWdodCA9IHRoaXMubWVkaWEudmlkZW9IZWlnaHQ7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS52aWRlb0hlaWdodDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLmhlaWdodCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmhlaWdodDtcblx0fVxuXG5cdHNjYWxlKCkge1xuXHRcdHJldHVybiB0aGlzLnZpZGVvV2lkdGgoKSAvIHRoaXMudmlkZW9IZWlnaHQoKTtcblx0fVxuXG5cdGJvdW5kcyh2KSB7XG5cdFx0aWYgKHRoaXMuX2JvdW5kc1t2XSAhPT0gbnVsbCkgcmV0dXJuIHRoaXMuX2JvdW5kc1t2XTtcblx0XHRyZXR1cm4gdGhpcy5fYm91bmRzO1xuXHR9XG5cblx0d2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCd3aWR0aCcpO1xuXHR9XG5cblx0aGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnaGVpZ2h0Jyk7XG5cdH1cblxuXHRvZmZzZXRYKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnb2Zmc2V0WCcpO1xuXHR9XG5cblx0b2Zmc2V0WSgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ29mZnNldFknKTtcblx0fVxuXG5cdHdyYXBwZXJIZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0SGVpZ2h0O1xuXHR9XG5cblx0d3JhcHBlcldpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLm9mZnNldFdpZHRoO1xuXHR9XG5cblx0d3JhcHBlclNjYWxlKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLm9mZnNldFdpZHRoIC8gdGhpcy5tZWRpYS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHRhZGRDbGFzcyh2LCBlbCkge1xuXHRcdGlmIChlbCAhPSBudWxsKSB7XG5cdFx0XHRkb20uYWRkQ2xhc3ModiwgZWwpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRkb20uYWRkQ2xhc3ModGhpcy53cmFwcGVyLCB2KTtcblx0fVxuXHRyZW1vdmVDbGFzcyh2LCBlbCkge1xuXHRcdGlmIChlbCAhPSBudWxsKSB7XG5cdFx0XHRkb20ucmVtb3ZlQ2xhc3ModiwgZWwpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodiAhPT0gJ2ttbFBsYXllcicpIHtcblx0XHRcdGRvbS5yZW1vdmVDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHRcdH1cblx0fVxuXHR0b2dnbGVDbGFzcyh2LCBlbCkge1xuXHRcdGlmIChlbCAhPSBudWxsKSB7XG5cdFx0XHRkb20udG9nZ2xlQ2xhc3ModiwgZWwpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodiAhPT0gJ2ttbFBsYXllcicpIHtcblx0XHRcdGRvbS50b2dnbGVDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHRcdH1cblx0fVxufTtcblxuLy9kaXNhYmxlIG9uIHByb2R1Y3Rpb25cbmlmIChkZXZpY2UuaXNUb3VjaCkge1xuXHR3aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHNjcmlwdFVybCwgbGluZSwgY29sdW1uKSB7XG5cdFx0Y29uc29sZS5sb2cobGluZSwgY29sdW1uLCBtZXNzYWdlKTtcblx0XHRhbGVydChsaW5lICsgXCI6XCIgKyBjb2x1bW4gKyBcIi1cIiArIG1lc3NhZ2UpO1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBrbWxQbGF5ZXI7Il0sIm5hbWVzIjpbImJhYmVsSGVscGVycy50eXBlb2YiLCJkZWZhdWx0cyIsIkV2ZW50cyIsIl9kb2MiLCJmbl9jb250ZXh0bWVudSIsInBvcHVwIiwiaW5GcmFtZSJdLCJtYXBwaW5ncyI6Ijs7OztJQUFnQixhQUFXO0FBQ3ZCLElBQUEsUUFBSSxX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