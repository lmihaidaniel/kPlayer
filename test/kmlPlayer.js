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

    function debounce(fn, delay) {
    	var t;
    	return function () {
    		clearTimeout(t);
    		t = setTimeout(fn, delay);
    	};
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
    		c = c.split(' ');
    		for (var k in c) {
    			elem.classList.add(c[k]);
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
    	class: {
    		has: hasClass,
    		add: addClass,
    		remove: removeClass,
    		toggle: toggleClass
    	},
    	createElement: function createElement(node, props) {
    		var el = document.createElement(node);
    		for (var k in props) {
    			el.setAttribute(k, props[k]);
    		}
    		return el;
    	},
    	// Remove an element
    	remove: function remove(element) {
    		if (!element) {
    			return;
    		}
    		element.parentNode.removeChild(element);
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

    var autoFont = function autoFont(el, _width, font, parent) {
    	var _enabled = false;
    	var _update = function _update() {
    		debounce(function () {
    			scaleFont(font, _width(), el);
    		}, 100)();
    	};
    	this.update = function (v) {
    		if (v !== undefined) {
    			if (!font) {
    				font = { ratio: 1, min: 1, lineHeight: false };
    			}
    			font = deepmerge(font, v);
    			return scaleFont(font, _width(), el);
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

    var adaptiveContainer = function adaptiveContainer(bounds, setttings, parent) {
    	var vault = {
    		x: 0,
    		y: 0,
    		width: '100%',
    		height: '100%',
    		fontSize: null,
    		lineHeight: null
    	};
    	var domElement = null;
    	var settings = deepmerge(defaults$2, setttings);
    	var _active = false;

    	var updateDomElement = function updateDomElement() {
    		if (_active && domElement) {
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
    		var b = bounds();

    		var procentWidth = procentFromString(settings.width);
    		if (procentWidth) {
    			vault.width = b.width * procentWidth / 100;
    		} else {
    			if (settings.width != null) {
    				vault.width = b.width * b.scale;
    			}
    		}

    		var procentHeight = procentFromString(settings.height);
    		if (procentHeight) {
    			vault.height = b.height * procentHeight / 100;
    		} else {
    			if (settings.height != null) {
    				vault.height = b.height * b.scale;
    			}
    		}

    		if (settings.x != null) {
    			var procentX = procentFromString(settings.x);
    			if (procentX) {
    				vault.x = b.width * procentX / 100;
    			} else {
    				vault.x = b.offsetX + settings.x * b.scale;
    			}
    			var transformX = procentFromString(settings.transform.x);
    			if (transformX) vault.x += transformX * vault.width / 100;
    			if (settings.offsetX) vault.x += settings.offsetX;
    		}

    		if (settings.y != null) {
    			var procentY = procentFromString(settings.y);
    			if (procentY) {
    				vault.y = b.height * procentY / 100;
    			} else {
    				vault.y = b.offsetY + settings.y * b.scale;
    			}
    			var transformY = procentFromString(settings.transform.y);
    			if (transformY) vault.y += transformY * vault.width / 100;
    			if (settings.offsetY) vault.y += settings.offsetY;
    		}

    		updateDomElement();
    	};

    	this.domElement = function (element) {
    		if (element) {
    			domElement = element;
    			updateProps();
    		}
    		return domElement;
    	};

    	var applyNewProps = function applyNewProps() {
    		debounce(function () {
    			updateProps();
    		}, 100)();
    	};

    	this.data = function () {
    		return vault;
    	};

    	this.update = function (newSettings) {
    		settings = deepmerge(settings, newSettings);
    		updateProps();
    		return vault;
    	};
    	this.active = function (v) {
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
    //supportsFullScreen = false;

    var Fullscreen = function (_Events) {
        inherits(Fullscreen, _Events);

        function Fullscreen() {
            classCallCheck(this, Fullscreen);

            var _this = possibleConstructorReturn(this, _Events.call(this));

            _this.scrollPosition = new scrollPosition();
            if (!supportsFullScreen) {
                _this._fullscreenElement = null;
                _this.fullscreenElementStyle = {};
            } else {
                var event = prefixFS === '' ? 'fullscreenchange' : prefixFS + (prefixFS == 'ms' ? 'fullscreenchange' : 'fullscreenchange');
                var fnFullscreenChange = function fnFullscreenChange() {
                    if (!_this.isFullScreen()) {
                        setTimeout(_this.scrollPosition.restore, 100);
                    }
                };
                document.addEventListener(event.toLowerCase(), fnFullscreenChange, false);
            }
            return _this;
        }

        Fullscreen.prototype.isFullScreen = function isFullScreen(element) {
            if (supportsFullScreen) {
                if (typeof element === 'undefined') {
                    element = this.wrapperPlayer;
                }
                switch (prefixFS) {
                    case '':
                        return document.fullscreenElement == element;
                    case 'moz':
                        return document.mozFullScreenElement == element;
                    default:
                        return document[prefixFS + 'FullscreenElement'] == element;
                }
            }
            return false;
        };

        Fullscreen.prototype.requestFullScreen = function requestFullScreen(element) {
            if (typeof element === 'undefined') {
                element = this.wrapperPlayer;
            }
            if (supportsFullScreen) {
                this.scrollPosition.save();
                return prefixFS === '' ? element.requestFullScreen() : element[prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
            } else {
                if (!this.isFullScreen()) {
                    this.scrollPosition.save();
                    var style = window.getComputedStyle(element);
                    this.fullscreenElementStyle['position'] = element.style.position || "";
                    this.fullscreenElementStyle['margin'] = element.style.margin || "";
                    this.fullscreenElementStyle['top'] = element.style.top || "";
                    this.fullscreenElementStyle['left'] = element.style.left || "";
                    this.fullscreenElementStyle['width'] = element.style.width || "";
                    this.fullscreenElementStyle['height'] = element.style.height || "";
                    this.fullscreenElementStyle['zIndex'] = element.style.zIndex || "";

                    element.style.position = "absolute";
                    element.style.top = element.style.left = 0;
                    element.style.margin = 0;
                    element.style.width = element.style.height = "100%";
                    element.style.zIndex = 2147483647;

                    this._fullscreenElement = element;
                    this.emit('resize');
                    this.isFullScreen = function () {
                        return true;
                    };
                }
            }
        };

        Fullscreen.prototype.cancelFullScreen = function cancelFullScreen() {
            if (supportsFullScreen) {
                return prefixFS === '' ? document.cancelFullScreen() : document[prefixFS + (prefixFS == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
            } else {
                if (this.isFullScreen()) {
                    for (var k in this.fullscreenElementStyle) {
                        this._fullscreenElement.style[k] = this.fullscreenElementStyle[k];
                    }
                    this._fullscreenElement = null;
                    this.isFullScreen = function () {
                        return false;
                    };
                    this.emit('resize');
                    this.scrollPosition.restore();
                }
            }
        };

        Fullscreen.prototype.toggleFullScreen = function toggleFullScreen(element) {
            var isFullscreen = !this.isFullScreen();
            if (isFullscreen) {
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
    	var sources = media.querySelectorAll('source');
    	for (var i = 0; i < sources.length; i++) {
    		dom.remove(sources[i]);
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

    		_this.media = el;
    		_events.forEach(function (k) {
    			// this.on(k, function(){
    			// 	console.log(k);
    			// });
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


    	Media.prototype.controls = function controls(v) {
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

    var fn_contextmenu = function fn_contextmenu(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	return false;
    };

    var defaults = {
    	defaultWidth: 860,
    	defaultHeight: 540,
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

    	function kmlPlayer(el, settings, _events, app) {
    		classCallCheck(this, kmlPlayer);

    		var _this = possibleConstructorReturn(this, _Media.call(this, el));

    		_this.__settings = deepmerge(defaults, settings);
    		dom.class.add(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
    		_this.wrapperPlayer = dom.wrap(_this.media, dom.createElement('div', {
    			class: 'kmlPlayer'
    		}));
    		dom.triggerWebkitHardwareAcceleration(_this.wrapperPlayer);

    		//initSettings
    		for (var k in _this.__settings) {
    			if (_this[k]) {
    				_this[k](_this.__settings[k]);
    				if (k === 'autoplay' && _this.__settings[k]) _this.play();
    			}
    		}

    		//initPageVisibility
    		_this.pageVisibility = new pageVisibility(el);

    		//initexternalControls
    		_this.externalControls = new externalControls(el);

    		//initAdaptiveContainer;
    		var _bounds = function _bounds() {
    			return {
    				offsetX: _this.offsetX(),
    				offsetY: _this.offsetY(),
    				width: _this.width(),
    				height: _this.height(),
    				scale: _this.width() / _this.defaultWidth(),
    				scaleY: _this.width() / _this.defaultHeight()
    			};
    		};
    		_this.adaptiveContainer = function (opts) {
    			return new adaptiveContainer(_bounds, opts, _this);
    		};

    		//autoFONT
    		var _width = function _width() {
    			return _this.width();
    		};
    		if (typeof _this.__settings.font === "boolean" && _this.__settings.font) _this.__settings.font = defaults.font;
    		_this.autoFont = new autoFont(_this.wrapperPlayer, _width, _this.__settings.font, _this);
    		if (_this.__settings.font) _this.autoFont.enabled(true);

    		//initCallbackEvents
    		for (var evt in _events) {
    			_this.on(evt, _events[evt], _this);
    		}

    		_this.on('loadedmetadata', function () {
    			if (_this.media.width != _this.media.videoWidth) {
    				_this.emit('resize');
    			}
    			if (_this.media.height != _this.media.videoHeight) {
    				_this.emit('resize');
    			}
    		});

    		window.addEventListener('resize', function () {
    			_this.emit('resize');
    		}, false);

    		if (typeof app === 'function') {
    			app.bind(_this)();
    		}
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

    	kmlPlayer.prototype.defaultWidth = function defaultWidth(v) {
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

    	kmlPlayer.prototype.defaultHeight = function defaultHeight(v) {
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
    		return this.defaultWidth() / this.defaultHeight();
    	};

    	kmlPlayer.prototype.bounds = function bounds(v) {
    		var data = containerBounds(this.media);
    		if (data[v] !== undefined) return data[v];
    		return data;
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
    		if (el !== undefined) {
    			dom.class.add(el, v);
    			return;
    		}
    		dom.class.add(this.wrapperPlayer, v);
    	};

    	kmlPlayer.prototype.removeClass = function removeClass(v, el) {
    		if (el !== undefined) {
    			dom.class.remove(el, v);
    			return;
    		}
    		if (v !== 'kmlPlayer') {
    			dom.class.remove(this.wrapperPlayer, v);
    		}
    	};

    	kmlPlayer.prototype.toggleClass = function toggleClass(v, el) {
    		if (el !== undefined) {
    			dom.class.toggle(el, v);
    			return;
    		}
    		if (v !== 'kmlPlayer') {
    			dom.class.toggle(this.wrapperPlayer, v);
    		}
    	};

    	return kmlPlayer;
    }(Media);

    ;

    window.onerror = function (message, scriptUrl, line, column) {
    	console.log(line, column, message);
    	alert(line + ":" + column + "-" + message);
    };

    return kmlPlayer;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzL2RlZXBtZXJnZS5qcyIsIi4uL3NyYy9oZWxwZXJzL3V0aWxzLmpzIiwiLi4vc3JjL2hlbHBlcnMvZG9tLmpzIiwiLi4vc3JjL2NvcmUvYXV0b0ZvbnQuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvYWRhcHRpdmVDb250YWluZXIuanMiLCIuLi9zcmMvY29yZS9tZWRpYS9ldmVudHMvaW5kZXguanMiLCIuLi9zcmMvaGVscGVycy9zY3JvbGxQb3NpdGlvbi5qcyIsIi4uL3NyYy9jb3JlL2Z1bGxzY3JlZW4uanMiLCIuLi9zcmMvaGVscGVycy9jYW5jZWxWaWRlb05ldHdvcmtSZXF1ZXN0LmpzIiwiLi4vc3JjL2hlbHBlcnMvbWltZVR5cGUuanMiLCIuLi9zcmMvY29yZS9tZWRpYS9pbmRleC5qcyIsIi4uL3NyYy9oZWxwZXJzL2NvbnRhaW5lckJvdW5kcy5qcyIsIi4uL3NyYy9oZWxwZXJzL3BhZ2VWaXNpYmlsaXR5LmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvZXZlbnRzL2V4dGVybmFsQ29udHJvbHMuanMiLCIuLi9zcmMvaGVscGVycy9hamF4LmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpe1xuXHRsZXQgZGVlcG1lcmdlID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpIHtcblx0XHRpZihzcmMpe1xuXHRcdCAgICB2YXIgYXJyYXkgPSBBcnJheS5pc0FycmF5KHNyYyk7XG5cdFx0ICAgIHZhciBkc3QgPSBhcnJheSAmJiBbXSB8fCB7fTtcblxuXHRcdCAgICBpZiAoYXJyYXkpIHtcblx0XHQgICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBbXTtcblx0XHQgICAgICAgIGRzdCA9IGRzdC5jb25jYXQodGFyZ2V0KTtcblx0XHQgICAgICAgIHNyYy5mb3JFYWNoKGZ1bmN0aW9uKGUsIGkpIHtcblx0XHQgICAgICAgICAgICBpZiAodHlwZW9mIGRzdFtpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2ldID0gZTtcblx0XHQgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgICAgICBkc3RbaV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2ldLCBlKTtcblx0XHQgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmluZGV4T2YoZSkgPT09IC0xKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3QucHVzaChlKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgIE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gdGFyZ2V0W2tleV07XG5cdFx0ICAgICAgICAgICAgfSlcblx0XHQgICAgICAgIH1cblx0XHQgICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBzcmNba2V5XSAhPT0gJ29iamVjdCcgfHwgIXNyY1trZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG5cdFx0ICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFtrZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2tleV0sIHNyY1trZXldKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9XG5cdFx0ICAgIHJldHVybiBkc3Q7XG5cdCAgICB9ZWxzZXtcblx0ICAgIFx0cmV0dXJuIHRhcmdldCB8fMKgW107XG5cdCAgICB9XG5cdH1cblx0cmV0dXJuIGRlZXBtZXJnZTtcbn0pKCk7IiwiZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJpbShzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZW50RnJvbVN0cmluZyh2KXtcblx0IGlmKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdGxldCB0ID0gZmFsc2U7XG5cdGlmKHYuaW5kZXhPZil7XG5cdFx0aWYodi5pbmRleE9mKCclJykgPiAtMSlcblx0XHR7XG5cdFx0ICB0ID0gcGFyc2VGbG9hdCh2KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmbiwgZGVsYXkpIHtcblx0dmFyIHRcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFyVGltZW91dCh0KVxuXHRcdHQgPSBzZXRUaW1lb3V0KGZuLCBkZWxheSlcblx0fVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcmNlbnRhZ2UoY3VycmVudCwgbWF4KSB7XG5cdGlmIChjdXJyZW50ID09PSAwIHx8IG1heCA9PT0gMCB8fCBpc05hTihjdXJyZW50KSB8fCBpc05hTihtYXgpKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0cmV0dXJuICgoY3VycmVudCAvIG1heCkgKiAxMDApLnRvRml4ZWQoMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kQmluYXJ5ZnVuY3Rpb24oKSB7XG5cdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvU2Vjb25kcyh0KSB7XG5cdHZhciBzID0gMC4wO1xuXHRpZiAodCkge1xuXHRcdHZhciBwID0gdC5zcGxpdCgnOicpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKylcblx0XHRcdHMgPSBzICogNjAgKyBwYXJzZUZsb2F0KHBbaV0ucmVwbGFjZSgnLCcsICcuJykpXG5cdH1cblx0cmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvTGluZUhlaWdodChlbCl7XG5cdGxldCBsID0gZWwub2Zmc2V0SGVpZ2h0ICsgXCJweFwiO1xuXHRlbC5zdHlsZS5saW5lSGVpZ2h0ID0gbDtcblx0cmV0dXJuIGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZUZvbnQoZiwgd2lkdGgsIGVsKSB7XG5cdHZhciByID0gZmFsc2UsIGwgPSBmYWxzZTtcblx0aWYoZi51bml0cyAhPSAncHgnKSBmLnVuaXRzID0gJ2VtJztcblx0aWYgKGYubWluICE9PSBmYWxzZSAmJiBmLnJhdGlvICE9PSBmYWxzZSkge1xuXHRcdHIgPSBmLnJhdGlvICogd2lkdGggLyAxMDAwO1xuXHRcdGlmIChyIDwgZi5taW4pIHIgPSBmLm1pbjtcblx0XHRpZiAoZi51bml0cyA9PSAncHgnKSByID0gTWF0aC5jZWlsKHIpO1xuXHRcdGlmICghaXNOYU4oZi5saW5lSGVpZ2h0KSAmJiBmLmxpbmVIZWlnaHQpIHtcblx0XHRcdGwgPSByICogZi5saW5lSGVpZ2h0O1xuXHRcdFx0aWYgKGwgPCAxKSBsID0gMTtcblx0XHRcdGwgPSArbC50b0ZpeGVkKDMpICsgZi51bml0cztcblx0XHR9XG5cdFx0ciA9ICtyLnRvRml4ZWQoMykgKyBmLnVuaXRzO1xuXHR9XG5cdGlmKGVsKXtcblx0XHRpZihyKSBlbC5zdHlsZS5mb250U2l6ZSA9IHI7XG5cdFx0aWYobCkgZWwuc3R5bGUubGluZUhlaWdodCA9IGw7XG5cdH1cblx0cmV0dXJuIHtmb250U2l6ZTogciwgbGluZUhlaWdodDogbH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7fTsiLCIvKipcbiAqIEBtb2R1bGUgZG9tXG4gKiBNb2R1bGUgZm9yIGVhc2luZyB0aGUgbWFuaXB1bGF0aW9uIG9mIGRvbSBlbGVtZW50c1xuICovXG5cbmxldCBjbGFzc1JlZyA9IGZ1bmN0aW9uKGMpIHtcblx0cmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxccyspXCIgKyBjICsgXCIoXFxcXHMrfCQpXCIpO1xufTtcblxubGV0IGhhc0NsYXNzXG5sZXQgYWRkQ2xhc3NcbmxldCByZW1vdmVDbGFzcztcbmxldCB0b2dnbGVDbGFzcztcblxuaWYgKCdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRoYXNDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRyZXR1cm4gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoYyk7XG5cdH07XG5cdGFkZENsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGMgPSBjLnNwbGl0KCcgJyk7XG5cdFx0Zm9yICh2YXIgayBpbiBjKSBlbGVtLmNsYXNzTGlzdC5hZGQoY1trXSk7XG5cdH07XG5cdHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjKTtcblx0fTtcbn0gZWxzZSB7XG5cdGhhc0NsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdHJldHVybiBjbGFzc1JlZyhjKS50ZXN0KGVsZW0uY2xhc3NOYW1lKTtcblx0fTtcblx0YWRkQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0aWYgKCFoYXNDbGFzcyhlbGVtLCBjKSkge1xuXHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgJyArIGM7XG5cdFx0fVxuXHR9O1xuXHRyZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NSZWcoYyksICcgJyk7XG5cdH07XG59XG5cbnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHR2YXIgZm4gPSBoYXNDbGFzcyhlbGVtLCBjKSA/IHJlbW92ZUNsYXNzIDogYWRkQ2xhc3M7XG5cdGZuKGVsZW0sIGMpO1xufTtcblxubGV0IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSA9IGZ1bmN0aW9uIGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZShwcm9wTmFtZSkge1xuICAgIHZhciBkb21QcmVmaXhlcyA9ICdXZWJraXQgTW96IG1zIE8nLnNwbGl0KCcgJyksXG4gICAgICAgIGVsU3R5bGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGU7XG4gICAgaWYgKGVsU3R5bGVbcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcm9wTmFtZTsgLy8gSXMgc3VwcG9ydGVkIHVucHJlZml4ZWRcbiAgICBwcm9wTmFtZSA9IHByb3BOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcE5hbWUuc3Vic3RyKDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZG9tUHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGVsU3R5bGVbZG9tUHJlZml4ZXNbaV0gKyBwcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbVByZWZpeGVzW2ldICsgcHJvcE5hbWU7IC8vIElzIHN1cHBvcnRlZCB3aXRoIHByZWZpeFxuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRzdHlsZVByZWZpeCA6IHtcblx0XHR0cmFuc2Zvcm06IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgndHJhbnNmb3JtJyksXG5cdCAgICBwZXJzcGVjdGl2ZTogZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKCdwZXJzcGVjdGl2ZScpLFxuXHQgICAgYmFja2ZhY2VWaXNpYmlsaXR5OiBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUoJ2JhY2tmYWNlVmlzaWJpbGl0eScpXG5cdH0sXG5cdHRyaWdnZXJXZWJraXRIYXJkd2FyZUFjY2VsZXJhdGlvbjogZnVuY3Rpb24oZWxlbWVudCl7XG5cdFx0aWYgKHRoaXMuc3R5bGVQcmVmaXguYmFja2ZhY2VWaXNpYmlsaXR5ICYmIHRoaXMuc3R5bGVQcmVmaXgucGVyc3BlY3RpdmUpIHtcblx0ICAgICAgICBlbGVtZW50LnN0eWxlW3RoaXMuc3R5bGVQcmVmaXgucGVyc3BlY3RpdmVdID0gJzEwMDBweCc7XG5cdCAgICAgICAgZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LmJhY2tmYWNlVmlzaWJpbGl0eV0gPSAnaGlkZGVuJztcblx0ICAgIH1cblx0fSxcblx0dHJhbnNmb3JtOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZSl7XG5cdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LnRyYW5zZm9ybV0gPSB2YWx1ZTtcblx0fSxcblx0Y2xhc3M6IHtcblx0XHRoYXM6IGhhc0NsYXNzLFxuXHRcdGFkZDogYWRkQ2xhc3MsXG5cdFx0cmVtb3ZlOiByZW1vdmVDbGFzcyxcblx0XHR0b2dnbGU6IHRvZ2dsZUNsYXNzXG5cdH0sXG5cdGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKG5vZGUsIHByb3BzKSB7XG5cdFx0bGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlKTtcblx0XHRmb3IgKGxldCBrIGluIHByb3BzKSB7XG5cdFx0XHRlbC5zZXRBdHRyaWJ1dGUoaywgcHJvcHNba10pO1xuXHRcdH1cblx0XHRyZXR1cm4gZWw7XG5cdH0sXG5cdC8vIFJlbW92ZSBhbiBlbGVtZW50XG4gICAgcmVtb3ZlOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICB9LFxuXHR3cmFwOiBmdW5jdGlvbihlbGVtZW50cywgd3JhcHBlcikge1xuXHRcdC8vIENvbnZlcnQgYGVsZW1lbnRzYCB0byBhbiBhcnJheSwgaWYgbmVjZXNzYXJ5LlxuXHRcdGlmICghZWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRlbGVtZW50cyA9IFtlbGVtZW50c107XG5cdFx0fVxuXG5cdFx0Ly8gTG9vcHMgYmFja3dhcmRzIHRvIHByZXZlbnQgaGF2aW5nIHRvIGNsb25lIHRoZSB3cmFwcGVyIG9uIHRoZVxuXHRcdC8vIGZpcnN0IGVsZW1lbnQgKHNlZSBgY2hpbGRgIGJlbG93KS5cblx0XHRmb3IgKHZhciBpID0gZWxlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdHZhciBjaGlsZCA9IChpID4gMCkgPyB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKSA6IHdyYXBwZXI7XG5cdFx0XHR2YXIgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuXG5cdFx0XHQvLyBDYWNoZSB0aGUgY3VycmVudCBwYXJlbnQgYW5kIHNpYmxpbmcuXG5cdFx0XHR2YXIgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdFx0dmFyIHNpYmxpbmcgPSBlbGVtZW50Lm5leHRTaWJsaW5nO1xuXG5cdFx0XHQvLyBXcmFwIHRoZSBlbGVtZW50IChpcyBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgZnJvbSBpdHMgY3VycmVudFxuXHRcdFx0Ly8gcGFyZW50KS5cblx0XHRcdGNoaWxkLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuXG5cdFx0XHQvLyBJZiB0aGUgZWxlbWVudCBoYWQgYSBzaWJsaW5nLCBpbnNlcnQgdGhlIHdyYXBwZXIgYmVmb3JlXG5cdFx0XHQvLyB0aGUgc2libGluZyB0byBtYWludGFpbiB0aGUgSFRNTCBzdHJ1Y3R1cmU7IG90aGVyd2lzZSwganVzdFxuXHRcdFx0Ly8gYXBwZW5kIGl0IHRvIHRoZSBwYXJlbnQuXG5cdFx0XHRpZiAoc2libGluZykge1xuXHRcdFx0XHRwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBzaWJsaW5nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjaGlsZDtcblx0XHR9XG5cdH1cbn0iLCJpbXBvcnQge3NjYWxlRm9udCwgZGVib3VuY2V9IGZyb20gJy4uL2hlbHBlcnMvdXRpbHMnO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5sZXQgYXV0b0ZvbnQgPSBmdW5jdGlvbihlbCwgX3dpZHRoLCBmb250LCBwYXJlbnQpIHtcblx0bGV0IF9lbmFibGVkID0gZmFsc2U7XG5cdGxldCBfdXBkYXRlID0gZnVuY3Rpb24oKXtcblx0XHRkZWJvdW5jZShmdW5jdGlvbigpe1xuXHRcdFx0c2NhbGVGb250KGZvbnQsIF93aWR0aCgpLCBlbCk7XG5cdFx0fSwxMDApKCk7XG5cdH1cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbih2KSB7XG5cdFx0aWYodiAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdGlmKCFmb250KXsgZm9udCA9IHtyYXRpbzogMSwgbWluOjEsIGxpbmVIZWlnaHQ6IGZhbHNlfSB9XG5cdFx0XHRmb250ID0gZGVlcG1lcmdlKGZvbnQsIHYpO1xuXHRcdFx0cmV0dXJuIHNjYWxlRm9udChmb250LCBfd2lkdGgoKSwgZWwpO1xuXHRcdH1cblx0fTtcblx0dGhpcy5lbmFibGVkID0gIGZ1bmN0aW9uKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJyAmJiBmb250KSB7XG5cdFx0XHRfZW5hYmxlZCA9IHY7XG5cdFx0XHQvLyB2ID8gKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSksIHNjYWxlRm9udChmb250LCBfd2lkdGgoKSwgZWwpKSA6IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSk7XG5cdFx0fVxuXHRcdHJldHVybiBfZW5hYmxlZDs7XG5cdH07XG5cdGlmKHBhcmVudC5vbil7XG5cdFx0cGFyZW50Lm9uKCdyZXNpemUnLCBfdXBkYXRlKTtcblx0fTtcbn1cbmV4cG9ydCBkZWZhdWx0IGF1dG9Gb250OyIsImltcG9ydCB7XG5cdGF1dG9MaW5lSGVpZ2h0LFxuXHRwcm9jZW50RnJvbVN0cmluZyxcblx0ZGVib3VuY2Vcbn0gZnJvbSAnLi4vLi4vaGVscGVycy91dGlscyc7XG5pbXBvcnQgZG9tIGZyb20gJy4uLy4uL2hlbHBlcnMvZG9tJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi4vLi4vaGVscGVycy9kZWVwbWVyZ2UnO1xuXG5sZXQgZGVmYXVsdHMgPSB7XG5cdHg6IDAsXG5cdHk6IDAsXG5cdHdpZHRoOiAnMTAwJScsXG5cdGhlaWdodDogJzEwMCUnLFxuXHRmb250U2l6ZTogbnVsbCxcblx0bGluZUhlaWdodDogbnVsbCxcblx0b2Zmc2V0WDogMCxcblx0b2Zmc2V0WTogMCxcblx0b3JpZ2luUG9pbnQ6IFwidG9wTGVmdFwiLFxuXHR2aXNpYmxlOiBmYWxzZSxcblx0dHJhbnNmb3JtOiB7XG5cdFx0eDogbnVsbCxcblx0XHR5OiBudWxsXG5cdH0sXG5cdHRyYW5zbGF0ZTogdHJ1ZVxufVxuXG5sZXQgYWRhcHRpdmVDb250YWluZXIgPSBmdW5jdGlvbihib3VuZHMsIHNldHR0aW5ncywgcGFyZW50KSB7XG5cdGxldCB2YXVsdCA9IHtcblx0XHR4OiAwLFxuXHRcdHk6IDAsXG5cdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRoZWlnaHQ6ICcxMDAlJyxcblx0XHRmb250U2l6ZTogbnVsbCxcblx0XHRsaW5lSGVpZ2h0OiBudWxsXG5cdH07XG5cdGxldCBkb21FbGVtZW50ID0gbnVsbDtcblx0bGV0IHNldHRpbmdzID0gZGVlcG1lcmdlKGRlZmF1bHRzLCBzZXR0dGluZ3MpO1xuXHRsZXQgX2FjdGl2ZSA9IGZhbHNlO1xuXG5cdGxldCB1cGRhdGVEb21FbGVtZW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKF9hY3RpdmUgJiYgZG9tRWxlbWVudCkge1xuXHRcdFx0aWYgKHZhdWx0LndpZHRoICE9PSBudWxsKSBkb21FbGVtZW50LnN0eWxlLndpZHRoID0gdmF1bHQud2lkdGggKyBcInB4XCI7XG5cdFx0XHRpZiAodmF1bHQuaGVpZ2h0ICE9PSBudWxsKSBkb21FbGVtZW50LnN0eWxlLmhlaWdodCA9IHZhdWx0LmhlaWdodCArIFwicHhcIjtcblxuXHRcdFx0aWYgKGRvbS5zdHlsZVByZWZpeC50cmFuc2Zvcm0gJiYgc2V0dGluZ3MudHJhbnNsYXRlKSB7XG5cdFx0XHRcdGxldCB0cmFuc2Zvcm0gPSAnJztcblx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCAmJiB2YXVsdC55ICE9IG51bGwpIHtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCcgKyB2YXVsdC54ICsgJ3B4LCcgKyB2YXVsdC55ICsgJ3B4KSc7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5yaWdodCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS50b3AgPSBcImF1dG9cIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxlZnQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUucmlnaHQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdHRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyB2YXVsdC54ICsgJ3B4KSc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh2YXVsdC55ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0dHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoJyArIHZhdWx0LnkgKyAncHgpJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZG9tLnRyYW5zZm9ybShkb21FbGVtZW50LCB0cmFuc2Zvcm0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCAmJiB2YXVsdC55ICE9IG51bGwpIHtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxlZnQgPSB2YXVsdC54ICsgXCJweFwiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUudG9wID0gdmF1bHQueSArIFwicHhcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsKSBkb21FbGVtZW50LnN0eWxlLmxlZnQgPSB2YXVsdC54ICsgXCJweFwiO1xuXHRcdFx0XHRcdGlmICh2YXVsdC55ICE9IG51bGwpIGRvbUVsZW1lbnQuc3R5bGUudG9wID0gdmF1bHQueSArIFwicHhcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2V0dGluZ3MuZm9udFNpemUgIT09IHZhdWx0LmZvbnRTaXplKSB7XG5cdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB2YXVsdC5mb250U2l6ZSA9IHNldHRpbmdzLmZvbnRTaXplO1xuXG5cdFx0XHR9XG5cdFx0XHRpZiAoc2V0dGluZ3MubGluZUhlaWdodCAhPT0gdmF1bHQubGluZUhlaWdodCkge1xuXHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxpbmVIZWlnaHQgPSB2YXVsdC5saW5lSGVpZ2h0ID0gc2V0dGluZ3MubGluZUhlaWdodDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRsZXQgdXBkYXRlUHJvcHMgPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgYiA9IGJvdW5kcygpO1xuXG5cdFx0bGV0IHByb2NlbnRXaWR0aCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLndpZHRoKTtcblx0XHRpZiAocHJvY2VudFdpZHRoKSB7XG5cdFx0XHR2YXVsdC53aWR0aCA9IGIud2lkdGggKiBwcm9jZW50V2lkdGggLyAxMDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChzZXR0aW5ncy53aWR0aCAhPSBudWxsKSB7XG5cdFx0XHRcdHZhdWx0LndpZHRoID0gYi53aWR0aCAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IHByb2NlbnRIZWlnaHQgPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy5oZWlnaHQpO1xuXHRcdGlmIChwcm9jZW50SGVpZ2h0KSB7XG5cdFx0XHR2YXVsdC5oZWlnaHQgPSBiLmhlaWdodCAqIHByb2NlbnRIZWlnaHQgLyAxMDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChzZXR0aW5ncy5oZWlnaHQgIT0gbnVsbCkge1xuXHRcdFx0XHR2YXVsdC5oZWlnaHQgPSBiLmhlaWdodCAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHNldHRpbmdzLnggIT0gbnVsbCkge1xuXHRcdFx0bGV0IHByb2NlbnRYID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MueCk7XG5cdFx0XHRpZihwcm9jZW50WCl7XG5cdFx0XHRcdHZhdWx0LnggPSBiLndpZHRoICogcHJvY2VudFggLyAxMDA7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dmF1bHQueCA9IGIub2Zmc2V0WCArIHNldHRpbmdzLnggKiBiLnNjYWxlO1x0XG5cdFx0XHR9XG5cdFx0XHRsZXQgdHJhbnNmb3JtWCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLnRyYW5zZm9ybS54KTtcblx0XHRcdGlmICh0cmFuc2Zvcm1YKSB2YXVsdC54ICs9IHRyYW5zZm9ybVggKiB2YXVsdC53aWR0aCAvIDEwMDtcblx0XHRcdGlmIChzZXR0aW5ncy5vZmZzZXRYKSB2YXVsdC54ICs9IHNldHRpbmdzLm9mZnNldFg7XG5cdFx0fVxuXG5cdFx0aWYgKHNldHRpbmdzLnkgIT0gbnVsbCkge1xuXHRcdFx0bGV0IHByb2NlbnRZID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MueSk7XG5cdFx0XHRpZihwcm9jZW50WSl7XG5cdFx0XHRcdHZhdWx0LnkgPSBiLmhlaWdodCAqIHByb2NlbnRZIC8gMTAwO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHZhdWx0LnkgPSBiLm9mZnNldFkgKyBzZXR0aW5ncy55ICogYi5zY2FsZTtcblx0XHRcdH1cblx0XHRcdGxldCB0cmFuc2Zvcm1ZID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MudHJhbnNmb3JtLnkpO1xuXHRcdFx0aWYgKHRyYW5zZm9ybVkpIHZhdWx0LnkgKz0gdHJhbnNmb3JtWSAqIHZhdWx0LndpZHRoIC8gMTAwO1xuXHRcdFx0aWYgKHNldHRpbmdzLm9mZnNldFkpIHZhdWx0LnkgKz0gc2V0dGluZ3Mub2Zmc2V0WTtcblx0XHR9XG5cdFx0XG5cdFx0dXBkYXRlRG9tRWxlbWVudCgpO1xuXHR9XG5cblx0dGhpcy5kb21FbGVtZW50ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdGlmKGVsZW1lbnQpe1xuXHRcdFx0ZG9tRWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0XHR1cGRhdGVQcm9wcygpO1xuXHRcdH1cblx0XHRyZXR1cm4gZG9tRWxlbWVudDtcblx0fVxuXG5cdGxldCBhcHBseU5ld1Byb3BzID0gZnVuY3Rpb24oKSB7XG5cdFx0ZGVib3VuY2UoZnVuY3Rpb24oKSB7XG5cdFx0XHR1cGRhdGVQcm9wcygpO1xuXHRcdH0sIDEwMCkoKTtcblx0fVxuXG5cdHRoaXMuZGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB2YXVsdDtcblx0fVxuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24obmV3U2V0dGluZ3MpIHtcblx0XHRzZXR0aW5ncyA9IGRlZXBtZXJnZShzZXR0aW5ncywgbmV3U2V0dGluZ3MpO1xuXHRcdHVwZGF0ZVByb3BzKCk7XG5cdFx0cmV0dXJuIHZhdWx0O1xuXHR9XG5cdHRoaXMuYWN0aXZlID0gZnVuY3Rpb24odikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHRfYWN0aXZlID0gdjtcblx0XHRcdGlmKHYpIGFwcGx5TmV3UHJvcHMoKTtcblx0XHRcdC8vIHYgPyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgYXBwbHlOZXdQcm9wcywgZmFsc2UpIDogd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMsIGZhbHNlKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9hY3RpdmU7XG5cdH07XG5cblx0aWYocGFyZW50Lm9uKXtcblx0XHRwYXJlbnQub24oJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMpO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBhZGFwdGl2ZUNvbnRhaW5lcjsiLCIvL2h0dHBzOi8vZ2l0aHViLmNvbS9wcmltdXMvZXZlbnRlbWl0dGVyM1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHByZWZpeCA9ICd+JztcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgYSBzdG9yYWdlIGZvciBvdXIgYEVFYCBvYmplY3RzLlxuICogQW4gYEV2ZW50c2AgaW5zdGFuY2UgaXMgYSBwbGFpbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhcmUgZXZlbnQgbmFtZXMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRXZlbnRzKCkge31cblxuLy9cbi8vIFdlIHRyeSB0byBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYC4gSW4gc29tZSBlbmdpbmVzIGNyZWF0aW5nIGFuXG4vLyBpbnN0YW5jZSBpbiB0aGlzIHdheSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCBkaXJlY3RseS5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBjaGFyYWN0ZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Rcbi8vIG92ZXJyaWRkZW4gb3IgdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy9cbmlmIChPYmplY3QuY3JlYXRlKSB7XG4gIEV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vXG4gIC8vIFRoaXMgaGFjayBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgYF9fcHJvdG9fX2AgcHJvcGVydHkgaXMgc3RpbGwgaW5oZXJpdGVkIGluXG4gIC8vIHNvbWUgb2xkIGJyb3dzZXJzIGxpa2UgQW5kcm9pZCA0LCBpUGhvbmUgNS4xLCBPcGVyYSAxMSBhbmQgU2FmYXJpIDUuXG4gIC8vXG4gIGlmICghbmV3IEV2ZW50cygpLl9fcHJvdG9fXykgcHJlZml4ID0gZmFsc2U7XG59XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdGhpcy5mbiA9IGZuO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIE1pbmltYWwgYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlIHRoYXQgaXMgbW9sZGVkIGFnYWluc3QgdGhlIE5vZGUuanNcbiAqIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IGxpc3RpbmcgdGhlIGV2ZW50cyBmb3Igd2hpY2ggdGhlIGVtaXR0ZXIgaGFzIHJlZ2lzdGVyZWRcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICB2YXIgbmFtZXMgPSBbXVxuICAgICwgZXZlbnRzXG4gICAgLCBuYW1lO1xuXG4gIGlmICh0aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgcmV0dXJuIG5hbWVzO1xuXG4gIGZvciAobmFtZSBpbiAoZXZlbnRzID0gdGhpcy5fZXZlbnRzKSkge1xuICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgcmV0dXJuIG5hbWVzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGV2ZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGV4aXN0cyBPbmx5IGNoZWNrIGlmIHRoZXJlIGFyZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7QXJyYXl8Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKGV2ZW50LCBleGlzdHMpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnRcbiAgICAsIGF2YWlsYWJsZSA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChleGlzdHMpIHJldHVybiAhIWF2YWlsYWJsZTtcbiAgaWYgKCFhdmFpbGFibGUpIHJldHVybiBbXTtcbiAgaWYgKGF2YWlsYWJsZS5mbikgcmV0dXJuIFthdmFpbGFibGUuZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXZhaWxhYmxlLmxlbmd0aCwgZWUgPSBuZXcgQXJyYXkobCk7IGkgPCBsOyBpKyspIHtcbiAgICBlZVtpXSA9IGF2YWlsYWJsZVtpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogQ2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGV2ZW50IGhhZCBsaXN0ZW5lcnMsIGVsc2UgYGZhbHNlYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVycy5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgNDogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMiwgYTMpOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoIWFyZ3MpIGZvciAoaiA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBhcmdzW2ogLSAxXSA9IGFyZ3VtZW50c1tqXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uYXBwbHkobGlzdGVuZXJzW2ldLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcylcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBvbmUtdGltZSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMsIHRydWUpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIHRoaXMuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbdGhpcy5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsaXN0ZW5lcnMgb2YgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IG1hdGNoIHRoaXMgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBoYXZlIHRoaXMgY29udGV4dC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmUtdGltZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiB0aGlzO1xuICBpZiAoIWZuKSB7XG4gICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKFxuICAgICAgICAgbGlzdGVuZXJzLmZuID09PSBmblxuICAgICAgJiYgKCFvbmNlIHx8IGxpc3RlbmVycy5vbmNlKVxuICAgICAgJiYgKCFjb250ZXh0IHx8IGxpc3RlbmVycy5jb250ZXh0ID09PSBjb250ZXh0KVxuICAgICkge1xuICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgZXZlbnRzID0gW10sIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4gIT09IGZuXG4gICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSlcbiAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgICAvL1xuICAgIGlmIChldmVudHMubGVuZ3RoKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gICAgZWxzZSBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzLCBvciB0aG9zZSBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0O1xuXG4gIGlmIChldmVudCkge1xuICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG4gICAgaWYgKHRoaXMuX2V2ZW50c1tldnRdKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBBbGlhcyBtZXRob2RzIG5hbWVzIGJlY2F1c2UgcGVvcGxlIHJvbGwgbGlrZSB0aGF0LlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4vL1xuLy8gVGhpcyBmdW5jdGlvbiBkb2Vzbid0IGFwcGx5IGFueW1vcmUuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgcHJlZml4LlxuLy9cbkV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RW1pdHRlcjsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblx0bGV0IHggPSAwO1xuXHRsZXQgeSA9IDA7XG5cdHRoaXMuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHggPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgMDtcblx0XHR5ID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IDA7XG5cdH1cblx0dGhpcy5yZXN0b3JlID0gZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LnNjcm9sbFRvKHgsIHkpXG5cdH1cbn0iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4vbWVkaWEvZXZlbnRzL2luZGV4JztcbmltcG9ydCBzY3JvbGxQb3NpdGlvbiBmcm9tICcuLi9oZWxwZXJzL3Njcm9sbFBvc2l0aW9uJztcbi8vIEZ1bGxzY3JlZW4gQVBJXG5sZXQgc3VwcG9ydHNGdWxsU2NyZWVuID0gZmFsc2U7XG5sZXQgYnJvd3NlclByZWZpeGVzID0gJ3dlYmtpdCBtb3ogbyBtcyBraHRtbCcuc3BsaXQoJyAnKTtcbmxldCBwcmVmaXhGUyA9ICcnO1xuLy9DaGVjayBmb3IgbmF0aXZlIHN1cHBvcnRcbmlmICh0eXBlb2YgZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xufSBlbHNlIHtcbiAgICAvLyBDaGVjayBmb3IgZnVsbHNjcmVlbiBzdXBwb3J0IGJ5IHZlbmRvciBwcmVmaXhcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBicm93c2VyUHJlZml4ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBwcmVmaXhGUyA9IGJyb3dzZXJQcmVmaXhlc1tpXTtcblxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50W3ByZWZpeEZTICsgJ0NhbmNlbEZ1bGxTY3JlZW4nXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIE1TICh3aGVuIGlzbid0IGl0PylcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4gIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVuYWJsZWQpIHtcbiAgICAgICAgICAgIHByZWZpeEZTID0gJ21zJztcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vc3VwcG9ydHNGdWxsU2NyZWVuID0gZmFsc2U7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGdWxsc2NyZWVuIGV4dGVuZHMgRXZlbnRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbiA9IG5ldyBzY3JvbGxQb3NpdGlvbigpO1xuICAgICAgICBpZiAoIXN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlID0ge307XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSAocHJlZml4RlMgPT09ICcnKSA/ICdmdWxsc2NyZWVuY2hhbmdlJyA6IHByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnZnVsbHNjcmVlbmNoYW5nZScgOiAnZnVsbHNjcmVlbmNoYW5nZScpO1xuICAgICAgICAgICAgbGV0IGZuRnVsbHNjcmVlbkNoYW5nZSA9ICgpPT57XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNGdWxsU2NyZWVuKCkpe1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc2Nyb2xsUG9zaXRpb24ucmVzdG9yZSwxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQudG9Mb3dlckNhc2UoKSwgZm5GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaXNGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLndyYXBwZXJQbGF5ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKHByZWZpeEZTKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ID09IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnbW96JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50ID09IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50W3ByZWZpeEZTICsgJ0Z1bGxzY3JlZW5FbGVtZW50J10gPT0gZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMud3JhcHBlclBsYXllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4oKSA6IGVsZW1lbnRbcHJlZml4RlMgKyAocHJlZml4RlMgPT0gJ21zJyA/ICdSZXF1ZXN0RnVsbHNjcmVlbicgOiAnUmVxdWVzdEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0Z1bGxTY3JlZW4oKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24uc2F2ZSgpO1xuICAgICAgICAgICAgICAgIGxldCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsncG9zaXRpb24nXSA9IGVsZW1lbnQuc3R5bGUucG9zaXRpb24gfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21hcmdpbiddID0gZWxlbWVudC5zdHlsZS5tYXJnaW4gfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3RvcCddID0gZWxlbWVudC5zdHlsZS50b3AgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ2xlZnQnXSA9IGVsZW1lbnQuc3R5bGUubGVmdCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnd2lkdGgnXSA9IGVsZW1lbnQuc3R5bGUud2lkdGggfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ2hlaWdodCddID0gZWxlbWVudC5zdHlsZS5oZWlnaHQgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3pJbmRleCddID0gZWxlbWVudC5zdHlsZS56SW5kZXggfHwgXCJcIjtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBlbGVtZW50LnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luID0gMDtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IDIxNDc0ODM2NDc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdyZXNpemUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzRnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKSA6IGRvY3VtZW50W3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnRXhpdEZ1bGxzY3JlZW4nIDogJ0NhbmNlbEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRnVsbFNjcmVlbigpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQuc3R5bGVba10gPSB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVba107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmlzRnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24ucmVzdG9yZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHRvZ2dsZUZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBsZXQgaXNGdWxsc2NyZWVuID0gIXRoaXMuaXNGdWxsU2NyZWVuKCk7XG4gICAgICAgIGlmIChpc0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVsbHNjcmVlbkVsZW1lbnQoKSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IDogZG9jdW1lbnRbcHJlZml4RlMgKyAnRnVsbHNjcmVlbkVsZW1lbnQnXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudDtcbiAgICAgICAgfVxuICAgIH1cbn07IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtZWRpYSkge1xuXHQvLyBSZW1vdmUgY2hpbGQgc291cmNlc1xuXHR2YXIgc291cmNlcyA9IG1lZGlhLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NvdXJjZScpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZXMubGVuZ3RoOyBpKyspIHtcblx0XHRkb20ucmVtb3ZlKHNvdXJjZXNbaV0pO1xuXHR9XG5cblx0Ly8gU2V0IGJsYW5rIHZpZGVvIHNyYyBhdHRyaWJ1dGVcblx0Ly8gVGhpcyBpcyB0byBwcmV2ZW50IGEgTUVESUFfRVJSX1NSQ19OT1RfU1VQUE9SVEVEIGVycm9yXG5cdC8vIFNtYWxsIG1wNDogaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvc21hbGwvYmxvYi9tYXN0ZXIvbXA0Lm1wNFxuXHQvLyBJbmZvOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyMjMxNTc5L2hvdy10by1wcm9wZXJseS1kaXNwb3NlLW9mLWFuLWh0bWw1LXZpZGVvLWFuZC1jbG9zZS1zb2NrZXQtb3ItY29ubmVjdGlvblxuXHRtZWRpYS5zZXRBdHRyaWJ1dGUoJ3NyYycsICdkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUhHWjBlWEJwYzI5dEFBQUNBR2x6YjIxcGMyOHliWEEwTVFBQUFBaG1jbVZsQUFBQUdtMWtZWFFBQUFHekFCQUhBQUFCdGhCZ1VZSTl0KzhBQUFNTmJXOXZkZ0FBQUd4dGRtaGtBQUFBQU1YTXZ2ckZ6TDc2QUFBRDZBQUFBQ29BQVFBQUFRQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FBQUJocGIyUnpBQUFBQUJDQWdJQUhBRS8vLy8vKy93QUFBaUYwY21GckFBQUFYSFJyYUdRQUFBQVB4Y3krK3NYTXZ2b0FBQUFCQUFBQUFBQUFBQ29BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQWdBQUFBSUFBQUFBQUc5YldScFlRQUFBQ0J0Wkdoa0FBQUFBTVhNdnZyRnpMNzZBQUFBR0FBQUFBRVZ4d0FBQUFBQUxXaGtiSElBQUFBQUFBQUFBSFpwWkdVQUFBQUFBQUFBQUFBQUFBQldhV1JsYjBoaGJtUnNaWElBQUFBQmFHMXBibVlBQUFBVWRtMW9aQUFBQUFFQUFBQUFBQUFBQUFBQUFDUmthVzVtQUFBQUhHUnlaV1lBQUFBQUFBQUFBUUFBQUF4MWNtd2dBQUFBQVFBQUFTaHpkR0pzQUFBQXhITjBjMlFBQUFBQUFBQUFBUUFBQUxSdGNEUjJBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FDQUJJQUFBQVNBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR1AvL0FBQUFYbVZ6WkhNQUFBQUFBNENBZ0UwQUFRQUVnSUNBUHlBUkFBQUFBQU1OUUFBQUFBQUZnSUNBTFFBQUFiQUJBQUFCdFlrVEFBQUJBQUFBQVNBQXhJMklBTVVBUkFFVVF3QUFBYkpNWVhaak5UTXVNelV1TUFhQWdJQUJBZ0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUFVYzNSemVnQUFBQUFBQUFBU0FBQUFBUUFBQUJSemRHTnZBQUFBQUFBQUFBRUFBQUFzQUFBQVlIVmtkR0VBQUFCWWJXVjBZUUFBQUFBQUFBQWhhR1JzY2dBQUFBQUFBQUFBYldScGNtRndjR3dBQUFBQUFBQUFBQUFBQUFBcmFXeHpkQUFBQUNPcGRHOXZBQUFBRzJSaGRHRUFBQUFCQUFBQUFFeGhkbVkxTXk0eU1TNHgnKTtcblxuXHQvLyBMb2FkIHRoZSBuZXcgZW1wdHkgc291cmNlXG5cdC8vIFRoaXMgd2lsbCBjYW5jZWwgZXhpc3RpbmcgcmVxdWVzdHNcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TZWx6L3BseXIvaXNzdWVzLzE3NFxuXHRtZWRpYS5sb2FkKCk7XG5cblx0Ly8gRGVidWdnaW5nXG5cdGNvbnNvbGUubG9nKFwiQ2FuY2VsbGVkIG5ldHdvcmsgcmVxdWVzdHMgZm9yIG9sZCBtZWRpYVwiKTtcbn0iLCJleHBvcnQgZnVuY3Rpb24gbWltZUF1ZGlvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wNCc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wZWcnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vd2F2JzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2OyBjb2RlY3M9XCIxXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWltZVZpZGVvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL3dlYm0nOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby93ZWJtOyBjb2RlY3M9XCJ2cDgsIHZvcmJpc1wiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICd2aWRlby9tcDQnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFLCBtcDRhLjQwLjJcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAndmlkZW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHt9IiwiaW1wb3J0IEZ1bGxzY3JlZW4gZnJvbSAnLi4vZnVsbHNjcmVlbic7XG5pbXBvcnQgX2NhbmNlbFJlcXVlc3RzIGZyb20gJy4uLy4uL2hlbHBlcnMvY2FuY2VsVmlkZW9OZXR3b3JrUmVxdWVzdCc7XG5pbXBvcnQge21pbWVWaWRlb30gZnJvbSAnLi4vLi4vaGVscGVycy9taW1lVHlwZSc7XG5cbi8vaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxubGV0IF9ldmVudHMgPSBbJ2VuZGVkJywgJ3Byb2dyZXNzJywgJ3N0YWxsZWQnLCAncGxheWluZycsICd3YWl0aW5nJywgJ2NhbnBsYXknLCAnY2FucGxheXRocm91Z2gnLCAnbG9hZHN0YXJ0JywgJ2xvYWRlZGRhdGEnLCAnbG9hZGVkbWV0YWRhdGEnLCAndGltZXVwZGF0ZScsICd2b2x1bWVjaGFuZ2UnLCAncGxheScsICdwbGF5aW5nJywgJ3BhdXNlJywgJ2Vycm9yJywgJ3NlZWtpbmcnLCAnZW1wdGllZCcsICdzZWVrZWQnLCAncmF0ZWNoYW5nZScsICdzdXNwZW5kJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lZGlhIGV4dGVuZHMgRnVsbHNjcmVlbiB7XG5cdGNvbnN0cnVjdG9yKGVsKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLm1lZGlhID0gZWw7XG5cdFx0X2V2ZW50cy5mb3JFYWNoKChrKSA9PiB7XG5cdFx0XHQvLyB0aGlzLm9uKGssIGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKGspO1xuXHRcdFx0Ly8gfSk7XG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGssICgpID0+IHtcblx0XHRcdFx0dGhpcy5lbWl0KGspO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmNhblBsYXkgPSB7XG5cdFx0XHRtcDQ6IG1pbWVWaWRlbyhlbCwndmlkZW8vbXA0JyksXG5cdFx0XHR3ZWJtOiBtaW1lVmlkZW8oZWwsJ3ZpZGVvL3dlYm0nKSxcblx0XHRcdG9nZzogbWltZVZpZGVvKGVsLCd2aWRlby9vZ2cnKVxuXHRcdH1cblx0fVxuXG5cdC8qKiogR2xvYmFsIGF0dHJpYnV0ZXMgKi9cblxuXHQvKiBBIEJvb2xlYW4gYXR0cmlidXRlOyBpZiBzcGVjaWZpZWQsIHRoZSB2aWRlbyBhdXRvbWF0aWNhbGx5IGJlZ2lucyB0byBwbGF5IGJhY2sgYXMgc29vbiBhcyBpdCBjYW4gZG8gc28gd2l0aG91dCBzdG9wcGluZyB0byBmaW5pc2ggbG9hZGluZyB0aGUgZGF0YS4gSWYgbm90IHJldHVybiB0aGUgYXVvcGxheSBhdHRyaWJ1dGUuICovXG5cdGF1dG9wbGF5KHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5hdXRvcGxheSA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmF1dG9wbGF5O1xuXHR9XG5cblx0LyogUmV0dXJucyB0aGUgdGltZSByYW5nZXMgb2YgdGhlIGJ1ZmZlcmVkIG1lZGlhLiBUaGlzIGF0dHJpYnV0ZSBjb250YWlucyBhIFRpbWVSYW5nZXMgb2JqZWN0ICovXG5cdGJ1ZmZlcmVkKCnCoCB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuYnVmZmVyZWQ7XG5cdH1cblxuXHQvKiBJZiB0aGlzIGF0dHJpYnV0ZSBpcyBwcmVzZW50LCB0aGUgYnJvd3NlciB3aWxsIG9mZmVyIGNvbnRyb2xzIHRvIGFsbG93IHRoZSB1c2VyIHRvIGNvbnRyb2wgdmlkZW8gcGxheWJhY2ssIGluY2x1ZGluZyB2b2x1bWUsIHNlZWtpbmcsIGFuZCBwYXVzZS9yZXN1bWUgcGxheWJhY2suIFdoZW4gbm90IHNldCByZXR1cm5zIGlmIHRoZSBjb250cm9scyBhcmUgcHJlc2VudCAqL1xuXHRjb250cm9scyh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEuY29udHJvbHMgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jb250cm9scztcblx0fVxuXG5cdC8qIGFub255bW91cywgdXNlLWNyZWRlbnRpYWxzLCBmYWxzZSAqL1xuXHRjcm9zc29yaWdpbih2KSB7XG5cdFx0aWYgKHYgPT09ICd1c2UtY3JlZGVudGlhbHMnKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmNyb3NzT3JpZ2luID0gJ3VzZS1jcmVkZW50aWFscyc7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9XG5cdFx0aWYgKHYpIHtcblx0XHRcdHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcblx0XHRcdHJldHVybiAnYW5vbnltb3VzJztcblx0XHR9XG5cdFx0aWYgKHYgPT09IGZhbHNlKSB0aGlzLm1lZGlhLmNyb3NzT3JpZ2luID0gbnVsbDtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jcm9zc09yaWdpbjtcblx0fVxuXG5cdC8qIEEgQm9vbGVhbiBhdHRyaWJ1dGU7IGlmIHNwZWNpZmllZCwgd2Ugd2lsbCwgdXBvbiByZWFjaGluZyB0aGUgZW5kIG9mIHRoZSB2aWRlbywgYXV0b21hdGljYWxseSBzZWVrIGJhY2sgdG8gdGhlIHN0YXJ0LiAqL1xuXHRsb29wKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5sb29wID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEubG9vcDtcblx0fVxuXG5cdC8qQSBCb29sZWFuIGF0dHJpYnV0ZSB3aGljaCBpbmRpY2F0ZXMgdGhlIGRlZmF1bHQgc2V0dGluZyBvZiB0aGUgYXVkaW8gY29udGFpbmVkIGluIHRoZSB2aWRlby4gSWYgc2V0LCB0aGUgYXVkaW8gd2lsbCBiZSBpbml0aWFsbHkgc2lsZW5jZWQuIEl0cyBkZWZhdWx0IHZhbHVlIGlzIGZhbHNlLCBtZWFuaW5nIHRoYXQgdGhlIGF1ZGlvIHdpbGwgYmUgcGxheWVkIHdoZW4gdGhlIHZpZGVvIGlzIHBsYXllZCovXG5cdG11dGVkKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5tdXRlZCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLm11dGVkO1xuXHR9XG5cblx0LyogTXV0ZSB0aGUgdmlkZW8gKi9cblx0bXV0ZSgpIHtcblx0XHR0aGlzLm11dGVkKHRydWUpO1xuXHR9XG5cblx0LyogVW5NdXRlIHRoZSB2aWRlbyAqL1xuXHR1bm11dGUoKSB7XG5cdFx0dGhpcy5tdXRlZChmYWxzZSk7XG5cdH1cblxuXHQvKiBUb2dnbGUgdGhlIG11dGVkIHN0YW5jZSBvZiB0aGUgdmlkZW8gKi9cblx0dG9nZ2xlTXV0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5tdXRlZCghdGhpcy5tdXRlZCgpKTtcblx0fVxuXG5cdC8qIFJldHVybnMgQSBUaW1lUmFuZ2VzIG9iamVjdCBpbmRpY2F0aW5nIGFsbCB0aGUgcmFuZ2VzIG9mIHRoZSB2aWRlbyB0aGF0IGhhdmUgYmVlbiBwbGF5ZWQuKi9cblx0cGxheWVkKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLnBsYXllZDtcblx0fVxuXG5cdC8qXG5cdFRoaXMgZW51bWVyYXRlZCBhdHRyaWJ1dGUgaXMgaW50ZW5kZWQgdG8gcHJvdmlkZSBhIGhpbnQgdG8gdGhlIGJyb3dzZXIgYWJvdXQgd2hhdCB0aGUgYXV0aG9yIHRoaW5rcyB3aWxsIGxlYWQgdG8gdGhlIGJlc3QgdXNlciBleHBlcmllbmNlLiBJdCBtYXkgaGF2ZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6XG5cdFx0bm9uZTogaW5kaWNhdGVzIHRoYXQgdGhlIHZpZGVvIHNob3VsZCBub3QgYmUgcHJlbG9hZGVkLlxuXHRcdG1ldGFkYXRhOiBpbmRpY2F0ZXMgdGhhdCBvbmx5IHZpZGVvIG1ldGFkYXRhIChlLmcuIGxlbmd0aCkgaXMgZmV0Y2hlZC5cblx0XHRhdXRvOiBpbmRpY2F0ZXMgdGhhdCB0aGUgd2hvbGUgdmlkZW8gZmlsZSBjb3VsZCBiZSBkb3dubG9hZGVkLCBldmVuIGlmIHRoZSB1c2VyIGlzIG5vdCBleHBlY3RlZCB0byB1c2UgaXQuXG5cdHRoZSBlbXB0eSBzdHJpbmc6IHN5bm9ueW0gb2YgdGhlIGF1dG8gdmFsdWUuXG5cdCovXG5cdHByZWxvYWQodikge1xuXHRcdGlmICh2ID09PSAnbWV0YWRhdGEnIHx8IHYgPT09IFwibWV0YVwiKSB7XG5cdFx0XHR0aGlzLm1lZGlhLnByZWxvYWQgPSAnbWV0YWRhdGEnO1xuXHRcdFx0cmV0dXJuICdtZXRhZGF0YSc7XG5cdFx0fVxuXHRcdGlmICh2KSB7XG5cdFx0XHR0aGlzLm1lZGlhLnByZWxvYWQgPSAnYXV0byc7XG5cdFx0XHRyZXR1cm4gJ2F1dG8nO1xuXHRcdH1cblx0XHRpZiAodiA9PT0gZmFsc2UpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdub25lJztcblx0XHRcdHJldHVybiAnbm9uZSc7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLnByZWxvYWQ7XG5cdH1cblxuXHQvKiBHaXZlcyBvciByZXR1cm5zIHRoZSBhZGRyZXNzIG9mIGFuIGltYWdlIGZpbGUgdGhhdCB0aGUgdXNlciBhZ2VudCBjYW4gc2hvdyB3aGlsZSBubyB2aWRlbyBkYXRhIGlzIGF2YWlsYWJsZS4gVGhlIGF0dHJpYnV0ZSwgaWYgcHJlc2VudCwgbXVzdCBjb250YWluIGEgdmFsaWQgbm9uLWVtcHR5IFVSTCBwb3RlbnRpYWxseSBzdXJyb3VuZGVkIGJ5IHNwYWNlcyAqL1xuXHRwb3N0ZXIodikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMubWVkaWEucG9zdGVyID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucG9zdGVyO1xuXHR9XG5cblx0LyogVGhlIHNyYyBwcm9wZXJ0eSBzZXRzIG9yIHJldHVybnMgdGhlIGN1cnJlbnQgc291cmNlIG9mIHRoZSBhdWRpby92aWRlbywgVGhlIHNvdXJjZSBpcyB0aGUgYWN0dWFsIGxvY2F0aW9uIChVUkwpIG9mIHRoZSBhdWRpby92aWRlbyBmaWxlICovXG5cdHNyYyh2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0X2NhbmNlbFJlcXVlc3RzKHRoaXMubWVkaWEpO1xuXHRcdFx0aWYodiBpbnN0YW5jZW9mIEFycmF5KXtcblx0XHRcdFx0Zm9yKHZhciBpID0gMCwgbiA9IHYubGVuZ3RoOyBpKz0xOyl7XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL21wNFwiICYmIHRoaXMuY2FuUGxheS5tcDQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHZbaV1bJ3R5cGUnXSA9PT0gXCJ2aWRlby93ZWJtXCIgJiYgdGhpcy5jYW5QbGF5LndlYm0pe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHZbaV1bJ3R5cGUnXSA9PT0gXCJ2aWRlby9vZ2dcIiAmJiB0aGlzLmNhblBsYXkub2dnKXtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnNyYyA9IHZbaV1bJ3NyYyddO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fWVsc2UgaWYodi5zcmMgJiYgdi50eXBlKXtcblx0XHRcdFx0dGhpcy5tZWRpYS5zcmMgPSB2LnNyYztcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0aGlzLm1lZGlhLnNyYyA9IHY7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuY3VycmVudFNyYztcblx0fVxuXG5cdC8qKiogR2xvYmFsIEV2ZW50cyAqL1xuXG5cdC8qIFN0YXJ0cyBwbGF5aW5nIHRoZSBhdWRpby92aWRlbyAqL1xuXHRwbGF5KCkge1xuXHRcdHRoaXMubWVkaWEucGxheSgpO1xuXHR9XG5cblx0LyogUGF1c2VzIHRoZSBjdXJyZW50bHkgcGxheWluZyBhdWRpby92aWRlbyAqL1xuXHRwYXVzZSgpIHtcblx0XHR0aGlzLm1lZGlhLnBhdXNlKCk7XG5cdH1cblxuXHQvKiBUb2dnbGUgcGxheS9wYXVzZSBmb3IgdGhlIGF1ZGlvL3ZpZGVvICovXG5cdHRvZ2dsZVBsYXkoKSB7XG5cdFx0dGhpcy5tZWRpYS5wYXVzZWQgPyB0aGlzLnBsYXkoKSA6IHRoaXMucGF1c2UoKTtcblx0fVxuXG5cdGN1cnJlbnRUaW1lKHYpIHtcblx0XHRpZiAodiA9PT0gbnVsbCB8fCBpc05hTih2KSkge1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuY3VycmVudFRpbWU7XG5cdFx0fVxuXHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdGlmICh2ID4gdGhpcy5tZWRpYS5kdXJhdGlvbikge1xuXHRcdFx0diA9IHRoaXMubWVkaWEuZHVyYXRpb247XG5cdFx0fVxuXHRcdGlmICh2IDwgMCkge1xuXHRcdFx0diA9IDA7XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEuY3VycmVudFRpbWUgPSB2O1xuXHRcdHJldHVybiB2O1xuXHR9XG5cblx0c2Vlayh2KSB7XG5cdFx0cmV0dXJuIHRoaXMuY3VycmVudFRpbWUodik7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBbUmUtbG9hZHMgdGhlIGF1ZGlvL3ZpZGVvIGVsZW1lbnQsIHVwZGF0ZSB0aGUgYXVkaW8vdmlkZW8gZWxlbWVudCBhZnRlciBjaGFuZ2luZyB0aGUgc291cmNlIG9yIG90aGVyIHNldHRpbmdzXVxuXHQgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGxvYWQodikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuc3JjKHYpO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhLmxvYWQoKTtcblx0fVxuXG5cdGR1cmF0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmR1cmF0aW9uO1xuXHR9XG5cblx0dm9sdW1lKHYpIHtcblx0XHQvLyBSZXR1cm4gY3VycmVudCB2b2x1bWUgaWYgdmFsdWUgXG5cdFx0aWYgKHYgPT09IG51bGwgfHwgaXNOYU4odikpIHtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZvbHVtZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiAxKSB7XG5cdFx0XHR2ID0gMTtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS52b2x1bWUgPSB2O1xuXHRcdHJldHVybiB2O1xuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCl7XG5cdGxldCBzY2FsZSA9IDA7XG5cdGxldCBib3VuZHMgPSBmdW5jdGlvbihlbCwgdXBkYXRlU2NhbGUpIHtcblx0XHRpZiggdXBkYXRlU2NhbGUgIT09IHVuZGVmaW5lZCkgc2NhbGUgPSB1cGRhdGVTY2FsZTtcblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdHdyYXBwZXJXaWR0aDogZWwub2Zmc2V0V2lkdGgsXG5cdFx0XHR3cmFwcGVySGVpZ2h0OiBlbC5vZmZzZXRIZWlnaHQsXG5cdFx0XHRzY2FsZTogc2NhbGUgfHwgKGVsLndpZHRoL2VsLmhlaWdodCksXG5cdFx0XHR3aWR0aDogMCxcblx0XHRcdGhlaWdodDogMCxcblx0XHRcdG9mZnNldFg6IDAsXG5cdFx0XHRvZmZzZXRZOiAwXG5cdFx0fVxuXHRcdGRhdGFbJ3dyYXBwZXJTY2FsZSddID0gZGF0YS53cmFwcGVyV2lkdGggLyBkYXRhLndyYXBwZXJIZWlnaHQ7XG5cdFx0aWYgKGRhdGEud3JhcHBlclNjYWxlID4gZGF0YS5zY2FsZSkge1xuXHRcdFx0ZGF0YS5oZWlnaHQgPSBkYXRhLndyYXBwZXJIZWlnaHQ7XG5cdFx0XHRkYXRhLndpZHRoID0gZGF0YS5zY2FsZSAqIGRhdGEuaGVpZ2h0O1xuXHRcdFx0ZGF0YS5vZmZzZXRYID0gKGRhdGEud3JhcHBlcldpZHRoIC0gZGF0YS53aWR0aCkgLyAyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkYXRhLndpZHRoID0gZGF0YS53cmFwcGVyV2lkdGg7XG5cdFx0XHRkYXRhLmhlaWdodCA9IGRhdGEud2lkdGggLyBkYXRhLnNjYWxlO1xuXHRcdFx0ZGF0YS5vZmZzZXRZID0gKGRhdGEud3JhcHBlckhlaWdodCAtIGRhdGEuaGVpZ2h0KSAvIDI7XG5cdFx0fVxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cdHJldHVybiBib3VuZHM7XG59KSgpOyIsInZhciBfZG9jID0gZG9jdW1lbnQgfHwge307XG4vLyBTZXQgdGhlIG5hbWUgb2YgdGhlIGhpZGRlbiBwcm9wZXJ0eSBhbmQgdGhlIGNoYW5nZSBldmVudCBmb3IgdmlzaWJpbGl0eVxudmFyIGhpZGRlbiwgdmlzaWJpbGl0eUNoYW5nZTtcbmlmICh0eXBlb2YgX2RvYy5oaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gT3BlcmEgMTIuMTAgYW5kIEZpcmVmb3ggMTggYW5kIGxhdGVyIHN1cHBvcnQgXG5cdGhpZGRlbiA9IFwiaGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcInZpc2liaWxpdHljaGFuZ2VcIjtcbn0gZWxzZSBpZiAodHlwZW9mIF9kb2MubW96SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwibW96SGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1venZpc2liaWxpdHljaGFuZ2VcIjtcbn0gZWxzZSBpZiAodHlwZW9mIF9kb2MubXNIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aGlkZGVuID0gXCJtc0hpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJtc3Zpc2liaWxpdHljaGFuZ2VcIjtcbn0gZWxzZSBpZiAodHlwZW9mIF9kb2Mud2Via2l0SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwid2Via2l0SGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIjtcbn1cblxuY29uc3QgaXNBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICEodHlwZW9mIF9kb2NbaGlkZGVuXSA9PT0gXCJ1bmRlZmluZWRcIik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhZ2VWaXNpYmlsaXR5KF9tZWRpYSwgc2V0dGluZ3MgPSB7fSkge1xuXHRsZXQgX2F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlKCk7XG5cdGlmIChfYXZhaWxhYmxlKSB7XG5cdFx0bGV0IF9lbmFibGVkID0gZmFsc2U7XG5cdFx0bGV0IF9wbGF5aW5nID0gZmFsc2U7XG5cdFx0bGV0IHBhdXNlZCA9IGZhbHNlO1xuXHRcdGxldCBzZXRGbGFnUGxheWluZyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0X3BsYXlpbmcgPSB0cnVlO1xuXHRcdH07XG5cdFx0bGV0IGV2ZW50cyA9IHtcblx0XHRcdHZpc2libGU6IGZ1bmN0aW9uKCl7fSxcblx0XHRcdGhpZGRlbjogZnVuY3Rpb24oKXt9XG5cdFx0fTtcblx0XHRsZXQgZGVzdHJveVZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcblx0XHRcdGV2ZW50cyA9IHtcblx0XHRcdFx0dmlzaWJsZTogZnVuY3Rpb24oKXt9LFxuXHRcdFx0XHRoaWRkZW46IGZ1bmN0aW9uKCl7fVxuXHRcdFx0fTtcblx0XHRcdF9lbmFibGVkID0gZmFsc2U7XG5cdFx0XHRfcGxheWluZyA9IGZhbHNlO1xuXHRcdFx0X2RvYy5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdF9tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdH1cblx0XHRsZXQgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKF9lbmFibGVkKSB7XG5cdFx0XHRcdGlmIChfZG9jW2hpZGRlbl0pIHtcblx0XHRcdFx0XHRpZiAoX3BsYXlpbmcgJiYgIV9tZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdF9tZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnRzLmhpZGRlbigpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChwYXVzZWQgJiYgX21lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0X21lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudHMudmlzaWJsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBpbml0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uIGluaXRWaXNpYmlsaXR5KHNldHRpbmdzKSB7XG5cdFx0XHRpZiAoX2F2YWlsYWJsZSkge1xuXHRcdFx0XHRfZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdFx0XHRfbWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHRcdFx0XG5cdFx0XHRcdGV2ZW50cy52aXNpYmxlID0gc2V0dGluZ3Mub25WaXNpYmxlIHx8IGV2ZW50cy52aXNpYmxlO1xuXHRcdFx0XHRldmVudHMuaGlkZGVuID0gc2V0dGluZ3Mub25IaWRkZW4gfHwgZXZlbnRzLmhpZGRlbjtcblx0XHRcdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHRfZG9jLmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdFx0XHRfbWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZXZlbnRzLnZpc2libGUgPSBzZXR0aW5ncy5vblZpc2libGUgfHwgZXZlbnRzLnZpc2libGU7XG5cdFx0ZXZlbnRzLmhpZGRlbiA9IHNldHRpbmdzLm9uSGlkZGVuIHx8IGV2ZW50cy5oaWRkZW47XG5cdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdF9kb2MuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0X21lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cblx0XHR0aGlzLmluaXQgPSBpbml0VmlzaWJpbGl0eTtcblx0XHR0aGlzLmRlc3Ryb3kgPSBkZXN0cm95VmlzaWJpbGl0eTtcblx0XHR0aGlzLm9uID0gZnVuY3Rpb24oZXZlbnQsZm4pIHtcblx0XHRcdGlmIChldmVudCBpbiBldmVudHMpIGV2ZW50c1tldmVudF0gPSBmbjtcblx0XHR9O1xuXHRcdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSBfZW5hYmxlZCA9IHY7XG5cdFx0XHRyZXR1cm4gX2VuYWJsZWQ7XG5cdFx0fVxuXHR9O1xufTsiLCJsZXQgX2RvYyA9IGRvY3VtZW50IHx8IHt9O1xubGV0IGV4dGVybmFsQ29udHJvbHMgPSBmdW5jdGlvbihlbCkge1xuXHRsZXQgX2VuYWJsZWQgPSB0cnVlO1xuXHRsZXQgX3NlZWsgPSB0cnVlO1xuXHRsZXQgX3RJZCA9IG51bGw7XG5cdGxldCBtZWRpYSA9IGVsO1xuXHRsZXQga2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoX2VuYWJsZWQpIHtcblx0XHRcdC8vYnlwYXNzIGRlZmF1bHQgbmF0aXZlIGV4dGVybmFsIGNvbnRyb2xzIHdoZW4gbWVkaWEgaXMgZm9jdXNlZFxuXHRcdFx0bWVkaWEucGFyZW50Tm9kZS5mb2N1cygpO1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzMikgeyAvL3NwYWNlXG5cdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKF9zZWVrKSB7XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzcpIHsgLy9sZWZ0XG5cdFx0XHRcdFx0bWVkaWEuY3VycmVudFRpbWUgPSBtZWRpYS5jdXJyZW50VGltZSAtIDU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzkpIHsgLy9yaWdodFxuXHRcdFx0XHRcdG1lZGlhLmN1cnJlbnRUaW1lID0gbWVkaWEuY3VycmVudFRpbWUgKyA1O1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOCkgeyAvL3VwXG5cdFx0XHRcdGxldCB2ID0gbWVkaWEudm9sdW1lO1xuXHRcdFx0XHR2ICs9IC4xO1xuXHRcdFx0XHRpZiAodiA+IDEpIHYgPSAxO1xuXHRcdFx0XHRtZWRpYS52b2x1bWUgPSB2O1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNDApIHsgLy9kb3duXG5cdFx0XHRcdGxldCB2ID0gbWVkaWEudm9sdW1lO1xuXHRcdFx0XHR2IC09IC4xO1xuXHRcdFx0XHRpZiAodiA8IDApIHYgPSAwO1xuXHRcdFx0XHRtZWRpYS52b2x1bWUgPSB2O1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvKmlmIChzZWxmLmNvbnRyb2xCYXIpIHtcblx0XHRcdFx0aWYgKHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uKSB7XG5cdFx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzgpIHtcblxuXHRcdFx0XHRcdFx0c2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24ubWVudUNvbnRlbnQuZWxfLmNsYXNzTmFtZSA9IFwidmpzLW1lbnUgc2hvd1wiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSovXG5cdFx0fVxuXHR9O1xuXG5cdC8vIHRoaXMub25TcGFjZSA9IGZ1bmN0aW9uKCkge1xuXG5cdC8vIH07XG5cblx0bGV0IGtleXVwID0gZnVuY3Rpb24oZSkge1xuXHRcdGlmIChfZW5hYmxlZCkge1x0XHRcdFxuXHRcdFx0Ly8gaWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzgpIHtcblx0XHRcdC8vIFx0Y2xlYXJJbnRlcnZhbChfdElkKTtcblx0XHRcdC8vIFx0aWYgKHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uKSB7XG5cdFx0XHQvLyBcdFx0X3RJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBcdFx0XHRzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbi5tZW51Q29udGVudC5lbF8uY2xhc3NOYW1lID0gXCJ2anMtbWVudVwiO1xuXHRcdFx0Ly8gXHRcdH0sIDUwMCk7XG5cdFx0XHQvLyBcdH1cblx0XHRcdC8vIH1cblx0XHR9XG5cdH07XG5cdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKGIpIHtcblx0XHRpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gX2VuYWJsZWQ7XG5cdFx0X2VuYWJsZWQgPSBiO1xuXG5cdH07XG5cdHRoaXMuc2Vla0VuYWJsZWQgPSBmdW5jdGlvbihiKSB7XG5cdFx0aWYgKGIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIF9zZWVrO1xuXHRcdF9zZWVrID0gYjtcblx0fTtcblx0dGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdF90SWQgPSBudWxsO1xuXHRcdF9zZWVrID0gdHJ1ZTtcblx0XHRfZG9jLmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdF9kb2MuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwLmJpbmQodGhpcyksIGZhbHNlKTtcblx0fTtcblx0dGhpcy5kZXN0cm95ID0gIGZ1bmN0aW9uKCkge1xuXHRcdF9lbmFibGVkID0gZmFsc2U7XG5cdFx0X3RJZCA9IG51bGw7XG5cdFx0X3NlZWsgPSB0cnVlO1xuXHRcdF9kb2MuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bik7XG5cdFx0X2RvYy5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXApO1xuXHR9XG5cdHRoaXMuaW5pdCgpO1xufVxuZXhwb3J0IGRlZmF1bHQgZXh0ZXJuYWxDb250cm9sczsiLCIvL2h0dHBzOi8vZ2l0aHViLmNvbS9mZGFjaXVrL2FqYXhcbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcbiAgICB2YXIgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZSddXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBvcHRpb25zLmJhc2VVcmwgPSBvcHRpb25zLmJhc2VVcmwgfHwgJydcbiAgICBpZiAob3B0aW9ucy5tZXRob2QgJiYgb3B0aW9ucy51cmwpIHtcbiAgICAgIHJldHVybiB4aHJDb25uZWN0aW9uKFxuICAgICAgICBvcHRpb25zLm1ldGhvZCxcbiAgICAgICAgb3B0aW9ucy5iYXNlVXJsICsgb3B0aW9ucy51cmwsXG4gICAgICAgIG1heWJlRGF0YShvcHRpb25zLmRhdGEpLFxuICAgICAgICBvcHRpb25zXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBtZXRob2RzLnJlZHVjZShmdW5jdGlvbihhY2MsIG1ldGhvZCkge1xuICAgICAgYWNjW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHhockNvbm5lY3Rpb24oXG4gICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgIG9wdGlvbnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICBtYXliZURhdGEoZGF0YSksXG4gICAgICAgICAgb3B0aW9uc1xuICAgICAgICApXG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwge30pXG4gIH1cblxuICBmdW5jdGlvbiBtYXliZURhdGEoZGF0YSkge1xuICAgIHJldHVybiBkYXRhIHx8IG51bGxcbiAgfVxuXG4gIGZ1bmN0aW9uIHhockNvbm5lY3Rpb24odHlwZSwgdXJsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgdmFyIHJldHVybk1ldGhvZHMgPSBbJ3RoZW4nLCAnY2F0Y2gnLCAnYWx3YXlzJ11cbiAgICB2YXIgcHJvbWlzZU1ldGhvZHMgPSByZXR1cm5NZXRob2RzLnJlZHVjZShmdW5jdGlvbihwcm9taXNlLCBtZXRob2QpIHtcbiAgICAgIHByb21pc2VbbWV0aG9kXSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHByb21pc2VbbWV0aG9kXSA9IGNhbGxiYWNrXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH0sIHt9KVxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHhoci5vcGVuKHR5cGUsIHVybCwgdHJ1ZSlcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnd2l0aENyZWRlbnRpYWxzJylcbiAgICBzZXRIZWFkZXJzKHhociwgb3B0aW9ucy5oZWFkZXJzKVxuICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgcmVhZHkocHJvbWlzZU1ldGhvZHMsIHhociksIGZhbHNlKVxuICAgIHhoci5zZW5kKG9iamVjdFRvUXVlcnlTdHJpbmcoZGF0YSkpXG4gICAgcHJvbWlzZU1ldGhvZHMuYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB4aHIuYWJvcnQoKVxuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZU1ldGhvZHNcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhlYWRlcnMoeGhyLCBoZWFkZXJzKSB7XG4gICAgaGVhZGVycyA9IGhlYWRlcnMgfHwge31cbiAgICBpZiAoIWhhc0NvbnRlbnRUeXBlKGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgfVxuICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgKGhlYWRlcnNbbmFtZV0gJiYgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgaGVhZGVyc1tuYW1lXSkpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc0NvbnRlbnRUeXBlKGhlYWRlcnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoaGVhZGVycykuc29tZShmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJ1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkeShwcm9taXNlTWV0aG9kcywgeGhyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZVJlYWR5KCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSB4aHIuRE9ORSkge1xuICAgICAgICB4aHIucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGhhbmRsZVJlYWR5LCBmYWxzZSlcbiAgICAgICAgcHJvbWlzZU1ldGhvZHMuYWx3YXlzLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpXG5cbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICBwcm9taXNlTWV0aG9kcy50aGVuLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvbWlzZU1ldGhvZHMuY2F0Y2guYXBwbHkocHJvbWlzZU1ldGhvZHMsIHBhcnNlUmVzcG9uc2UoeGhyKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UoeGhyKSB7XG4gICAgdmFyIHJlc3VsdFxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzdWx0ID0geGhyLnJlc3BvbnNlVGV4dFxuICAgIH1cbiAgICByZXR1cm4gW3Jlc3VsdCwgeGhyXVxuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0VG9RdWVyeVN0cmluZyhkYXRhKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGRhdGEpID8gZ2V0UXVlcnlTdHJpbmcoZGF0YSkgOiBkYXRhXG4gIH1cblxuICBmdW5jdGlvbiBpc09iamVjdChkYXRhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRhKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nKG9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLnJlZHVjZShmdW5jdGlvbihhY2MsIGl0ZW0pIHtcbiAgICAgIHZhciBwcmVmaXggPSAhYWNjID8gJycgOiBhY2MgKyAnJidcbiAgICAgIHJldHVybiBwcmVmaXggKyBlbmNvZGUoaXRlbSkgKyAnPScgKyBlbmNvZGUob2JqZWN0W2l0ZW1dKVxuICAgIH0sICcnKVxuICB9XG5cbiAgZnVuY3Rpb24gZW5jb2RlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSlcbiAgfVxuXG4gIHJldHVybiBhamF4XG59KSgpOyIsImltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQgeyBjYXBpdGFsaXplRmlyc3RMZXR0ZXIsIHNjYWxlRm9udCwgZGVib3VuY2UgfSBmcm9tICcuL2hlbHBlcnMvdXRpbHMnO1xuaW1wb3J0IGRvbSBmcm9tICcuL2hlbHBlcnMvZG9tJztcbmltcG9ydCBhdXRvRm9udCBmcm9tICcuL2NvcmUvYXV0b0ZvbnQnO1xuaW1wb3J0IGFkYXB0aXZlQ29udGFpbmVyIGZyb20gJy4vY29yZS9jb250YWluZXIvYWRhcHRpdmVDb250YWluZXInO1xuaW1wb3J0IE1lZGlhIGZyb20gJy4vY29yZS9tZWRpYS9pbmRleCc7XG5pbXBvcnQgY29udGFpbmVyQm91bmRzIGZyb20gJy4vaGVscGVycy9jb250YWluZXJCb3VuZHMnO1xuaW1wb3J0IHBhZ2VWaXNpYmlsaXR5IGZyb20gJy4vaGVscGVycy9wYWdlVmlzaWJpbGl0eSc7XG5pbXBvcnQgZXh0ZXJuYWxDb250cm9scyBmcm9tICcuL2NvcmUvbWVkaWEvZXZlbnRzL2V4dGVybmFsQ29udHJvbHMnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi9oZWxwZXJzL2FqYXgnO1xuXG5jb25zdCBmbl9jb250ZXh0bWVudSA9IGZ1bmN0aW9uKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuXHRkZWZhdWx0V2lkdGg6IDg2MCxcblx0ZGVmYXVsdEhlaWdodDogNTQwLFxuXHRhdXRvcGxheTogZmFsc2UsXG5cdGxvb3A6IGZhbHNlLFxuXHRjb250cm9sczogZmFsc2UsXG5cdGZvbnQ6IHtcblx0XHRyYXRpbzogMSxcblx0XHRtaW46IC41LFxuXHRcdHVuaXRzOiBcImVtXCJcblx0fVxufTtcblxuY2xhc3Mga21sUGxheWVyIGV4dGVuZHMgTWVkaWEge1xuXHRjb25zdHJ1Y3RvcihlbCwgc2V0dGluZ3MsIF9ldmVudHMsIGFwcCkge1xuXHRcdHN1cGVyKGVsKTtcblx0XHR0aGlzLl9fc2V0dGluZ3MgPSBkZWVwbWVyZ2UoZGVmYXVsdHMsIHNldHRpbmdzKTtcblx0XHRkb20uY2xhc3MuYWRkKGVsLCBcImttbFwiICsgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpKTtcblx0XHR0aGlzLndyYXBwZXJQbGF5ZXIgPSBkb20ud3JhcCh0aGlzLm1lZGlhLCBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdFx0Y2xhc3M6ICdrbWxQbGF5ZXInXG5cdFx0fSkpO1xuXHRcdGRvbS50cmlnZ2VyV2Via2l0SGFyZHdhcmVBY2NlbGVyYXRpb24odGhpcy53cmFwcGVyUGxheWVyKTtcblxuXHRcdC8vaW5pdFNldHRpbmdzXG5cdFx0Zm9yKHZhciBrIGluIHRoaXMuX19zZXR0aW5ncyl7XG5cdFx0XHRpZih0aGlzW2tdKXtcblx0XHRcdFx0dGhpc1trXSh0aGlzLl9fc2V0dGluZ3Nba10pO1xuXHRcdFx0XHRpZihrPT09J2F1dG9wbGF5JyAmJiB0aGlzLl9fc2V0dGluZ3Nba10pIHRoaXMucGxheSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vaW5pdFBhZ2VWaXNpYmlsaXR5XG5cdFx0dGhpcy5wYWdlVmlzaWJpbGl0eSA9IG5ldyBwYWdlVmlzaWJpbGl0eShlbCk7XG5cblx0XHQvL2luaXRleHRlcm5hbENvbnRyb2xzXG5cdFx0dGhpcy5leHRlcm5hbENvbnRyb2xzID0gbmV3IGV4dGVybmFsQ29udHJvbHMoZWwpO1xuXG5cblx0XHQvL2luaXRBZGFwdGl2ZUNvbnRhaW5lcjtcblx0XHRsZXQgX2JvdW5kcyA9ICgpPT57IFxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0b2Zmc2V0WDogdGhpcy5vZmZzZXRYKCksXG5cdFx0XHRcdG9mZnNldFk6IHRoaXMub2Zmc2V0WSgpLFxuXHRcdFx0XHR3aWR0aDogdGhpcy53aWR0aCgpLFxuXHRcdFx0XHRoZWlnaHQ6IHRoaXMuaGVpZ2h0KCksXG5cdFx0XHRcdHNjYWxlOiB0aGlzLndpZHRoKCkvdGhpcy5kZWZhdWx0V2lkdGgoKSxcblx0XHRcdFx0c2NhbGVZOiB0aGlzLndpZHRoKCkvdGhpcy5kZWZhdWx0SGVpZ2h0KClcblx0XHRcdH07IFxuXHRcdH07XG5cdFx0dGhpcy5hZGFwdGl2ZUNvbnRhaW5lciA9IChvcHRzKT0+e1xuXHRcdFx0cmV0dXJuIG5ldyBhZGFwdGl2ZUNvbnRhaW5lcihfYm91bmRzLCBvcHRzLCB0aGlzKTtcblx0XHR9XG5cblx0XHQvL2F1dG9GT05UXG5cdFx0bGV0IF93aWR0aCA9ICgpPT57IHJldHVybiB0aGlzLndpZHRoKCkgfTtcblx0XHRpZih0eXBlb2YgdGhpcy5fX3NldHRpbmdzLmZvbnQgPT09IFwiYm9vbGVhblwiICYmIHRoaXMuX19zZXR0aW5ncy5mb250KSB0aGlzLl9fc2V0dGluZ3MuZm9udCA9IGRlZmF1bHRzLmZvbnQ7XG5cdFx0dGhpcy5hdXRvRm9udCA9IG5ldyBhdXRvRm9udCh0aGlzLndyYXBwZXJQbGF5ZXIsIF93aWR0aCwgdGhpcy5fX3NldHRpbmdzLmZvbnQsIHRoaXMpO1xuXHRcdGlmKHRoaXMuX19zZXR0aW5ncy5mb250KSB0aGlzLmF1dG9Gb250LmVuYWJsZWQodHJ1ZSk7XG5cblx0XHQvL2luaXRDYWxsYmFja0V2ZW50c1xuXHRcdGZvciAodmFyIGV2dCBpbiBfZXZlbnRzKSB7XG5cdFx0XHR0aGlzLm9uKGV2dCwgX2V2ZW50c1tldnRdLCB0aGlzKTtcblx0XHR9XG5cblx0XHR0aGlzLm9uKCdsb2FkZWRtZXRhZGF0YScsICgpPT57XG5cdFx0XHRpZih0aGlzLm1lZGlhLndpZHRoICE9IHRoaXMubWVkaWEudmlkZW9XaWR0aCl7XG5cdFx0XHRcdHRoaXMuZW1pdCgncmVzaXplJyk7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLm1lZGlhLmhlaWdodCAhPSB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0KXtcblx0XHRcdFx0dGhpcy5lbWl0KCdyZXNpemUnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKT0+eyB0aGlzLmVtaXQoJ3Jlc2l6ZScpOyB9LCBmYWxzZSk7XG5cblx0XHRpZih0eXBlb2YgYXBwID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdGFwcC5iaW5kKHRoaXMpKCk7XG5cdFx0fVxuXHR9XG5cblx0Y29udGV4dE1lbnUodil7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHYgPyB0aGlzLm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUpIDogdGhpcy5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZuX2NvbnRleHRtZW51KTtcblx0XHR9XG5cdH1cblxuXHRhamF4KG9wdGlvbnMpIHtcblx0XHRyZXR1cm4gYWpheChvcHRpb25zKTtcblx0fVxuXG5cdGRlZmF1bHRXaWR0aCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9XaWR0aCkge1xuXHRcdFx0dGhpcy5tZWRpYS53aWR0aCA9IHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvV2lkdGg7XG5cdFx0fVxuXHRcdGlmICghaXNOYU4odikpIHtcblx0XHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdFx0dGhpcy5tZWRpYS53aWR0aCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLndpZHRoO1xuXHR9XG5cblx0ZGVmYXVsdEhlaWdodCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9IZWlnaHQpIHtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdGhpcy5tZWRpYS52aWRlb0hlaWdodDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdH1cblx0XHRpZiAoIWlzTmFOKHYpKSB7XG5cdFx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuaGVpZ2h0O1xuXHR9XG5cblx0c2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGVmYXVsdFdpZHRoKCkgLyB0aGlzLmRlZmF1bHRIZWlnaHQoKTtcblx0fVxuXG5cdGJvdW5kcyh2KSB7XG5cdFx0bGV0IGRhdGEgPSBjb250YWluZXJCb3VuZHModGhpcy5tZWRpYSk7XG5cdFx0aWYgKGRhdGFbdl0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGRhdGFbdl07XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHR3aWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ3dpZHRoJyk7XG5cdH1cblxuXHRoZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdoZWlnaHQnKTtcblx0fVxuXG5cdG9mZnNldFgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRYJyk7XG5cdH1cblxuXHRvZmZzZXRZKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnb2Zmc2V0WScpO1xuXHR9XG5cblx0d3JhcHBlckhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHR3cmFwcGVyV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGg7XG5cdH1cblxuXHR3cmFwcGVyU2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGggLyB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdGFkZENsYXNzKHYsIGVsKSB7XG5cdFx0aWYoZWwgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRkb20uY2xhc3MuYWRkKGVsLCB2KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZG9tLmNsYXNzLmFkZCh0aGlzLndyYXBwZXJQbGF5ZXIsIHYpO1xuXHR9XG5cdHJlbW92ZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYoZWwgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRkb20uY2xhc3MucmVtb3ZlKGVsLCB2KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHYgIT09ICdrbWxQbGF5ZXInKSB7XG5cdFx0XHRkb20uY2xhc3MucmVtb3ZlKHRoaXMud3JhcHBlclBsYXllciwgdik7XG5cdFx0fVxuXHR9XG5cdHRvZ2dsZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYoZWwgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRkb20uY2xhc3MudG9nZ2xlKGVsLCB2KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHYgIT09ICdrbWxQbGF5ZXInKSB7XG5cdFx0XHRkb20uY2xhc3MudG9nZ2xlKHRoaXMud3JhcHBlclBsYXllciwgdik7XG5cdFx0fVxuXHR9XG59O1xuXG53aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHNjcmlwdFVybCwgbGluZSwgY29sdW1uKSB7XG4gICAgY29uc29sZS5sb2cobGluZSwgY29sdW1uLCBtZXNzYWdlKTtcbiAgICBhbGVydChsaW5lICsgXCI6XCIgK2NvbHVtbiArXCItXCIrIG1lc3NhZ2UpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQga21sUGxheWVyOyJdLCJuYW1lcyI6WyJiYWJlbEhlbHBlcnMudHlwZW9mIiwiZGVmYXVsdHMiLCJFdmVudHMiLCJfZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0JBQWUsQ0FBQyxZQUFVO0FBQ3pCLElBQUEsS0FBSSxZQUFZLFNBQVosU0FBWSxDQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0I7QUFDckMsSUFBQSxNQUFHLEdBQUgsRUFBTztBQUNILElBQUEsT0FBSSxRQUFRLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBWjtBQUNBLElBQUEsT0FBSSxNQUFNLFNBQVMsRUFBVCxJQUFlLEVBQXpCOztBQUVBLElBQUEsT0FBSSxLQUFKLEVBQVc7QUFDUCxJQUFBLGFBQVMsVUFBVSxFQUFuQjtBQUNBLElBQUEsVUFBTSxJQUFJLE1BQUosQ0FBVyxNQUFYLENBQU47QUFDQSxJQUFBLFFBQUksT0FBSixDQUFZLFVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZTtBQUN2QixJQUFBLFNBQUksT0FBTyxJQUFJLENBQUosQ0FBUCxLQUFrQixXQUF0QixFQUFtQztBQUMvQixJQUFBLFVBQUksQ0FBSixJQUFTLENBQVQ7QUFDSCxJQUFBLE1BRkQsTUFFTyxJQUFJLFFBQU8sQ0FBUCx5Q0FBTyxDQUFQLE9BQWEsUUFBakIsRUFBMkI7QUFDOUIsSUFBQSxVQUFJLENBQUosSUFBUyxVQUFVLE9BQU8sQ0FBUCxDQUFWLEVBQXFC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