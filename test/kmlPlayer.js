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
    	class: {
    		has: hasClass,
    		add: addClass,
    		remove: removeClass,
    		toggle: toggleClass
    	},
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

    var adaptiveContainer = function adaptiveContainer(bounds, setttings, parent) {
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
    			parentWidth = _w;parentHeight = _h;
    			parentX = _x;parentY = _y;
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
    				vault.x = b.offsetX + b.width * procentX / 100;
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
    				vault.y = b.offsetY + b.height * procentY / 100;
    			} else {
    				vault.y = b.offsetY + settings.y * b.scale;
    			}
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
    		updateProps();
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

    var defaults$2 = {
    	x: 0,
    	y: 0,
    	width: 0,
    	height: 0
    };

    var Container = function Container(ctx) {
    	classCallCheck(this, Container);

    	var _bounds = function _bounds() {
    		return {
    			offsetX: ctx.offsetX(),
    			offsetY: ctx.offsetY(),
    			width: ctx.width(),
    			height: ctx.height(),
    			scale: ctx.width() / ctx.defaultWidth(),
    			scaleY: ctx.width() / ctx.defaultHeight()
    		};
    	};
    	this.el = dom.createElement('div', {
    		style: 'position:absolute; pointer-events: none;'
    	});
    	var ac = new adaptiveContainer(_bounds, {}, ctx);
    	ac.applyTo(this.el);
    	ac.enabled(true);

    	ctx.wrapper.appendChild(this.el);

    	this.add = function (opts) {
    		var el = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    		if (!el.nodeType) el = dom.createElement('div');
    		var o = deepmerge(defaults$2, opts);
    		el.style.position = "absolute";
    		el.style.pointerEvents = "all";
    		var elDimension = function elDimension() {
    			var _w = procentFromString(o.width);
    			if (!_w) _w = o.width / ctx.defaultWidth() * 100;
    			var _h = procentFromString(o.height);
    			if (!_h) _h = o.height / ctx.defaultHeight() * 100;
    			var _x = procentFromString(o.x);
    			if (!_x) _x = o.x / ctx.defaultWidth() * 100;
    			var _y = procentFromString(o.y);
    			if (!_y) _y = o.y / ctx.defaultHeight() * 100;

    			el.style.width = _w + "%";
    			el.style.height = _h + "%";
    			if (dom.stylePrefix.transform) {
    				dom.transform(el, 'translate(' + 100 / _w * _x + '%,' + 100 / _h * _y + '%)');
    			} else {
    				el.style.top = _x + "%";
    				el.style.left = _y + "%";
    			}
    		};
    		elDimension();
    		this.el.appendChild(el);
    		ctx.on('resize', elDimension);
    	};
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
    var eventChange = prefixFS === '' ? 'fullscreenchange' : prefixFS + (prefixFS == 'ms' ? 'fullscreenchange' : 'fullscreenchange');
    eventChange = eventChange.toLowerCase();
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
                var fnFullscreenChange = function fnFullscreenChange() {
                    if (!_this.isFullScreen()) {
                        setTimeout(_this.scrollPosition.restore, 100);
                    }
                };
                document.addEventListener(eventChange, fnFullscreenChange, false);
            }
            return _this;
        }

        Fullscreen.prototype.onFullscreenChange = function onFullscreenChange(evt) {
            console.log(this.wrapper);
            this.media.addEventListener(eventChange, function (e) {
                console.log(e);
                e.preventDefault();
                e.stopPropagation;
                return false;
            }, true);
        };

        Fullscreen.prototype.isFullScreen = function isFullScreen(element) {
            if (supportsFullScreen) {
                if (typeof element === 'undefined') {
                    element = this.wrapper;
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
                element = this.wrapper;
            }
            if (supportsFullScreen) {
                this.scrollPosition.save();
                return prefixFS === '' ? element.requestFullScreen() : element[prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
            } else {
                if (!this.isFullScreen()) {
                    this.scrollPosition.save();
                    var style = window.getComputedStyle(element);
                    this.fullscreenElementStyle['position'] = style.position || "";
                    this.fullscreenElementStyle['margin'] = style.margin || "";
                    this.fullscreenElementStyle['top'] = style.top || "";
                    this.fullscreenElementStyle['left'] = style.left || "";
                    this.fullscreenElementStyle['width'] = style.width || "";
                    this.fullscreenElementStyle['height'] = style.height || "";
                    this.fullscreenElementStyle['zIndex'] = style.zIndex || "";
                    this.fullscreenElementStyle['maxWidth'] = style.maxWidth || "";
                    this.fullscreenElementStyle['maxHeight'] = style.maxHeight || "";

                    element.style.position = "absolute";
                    element.style.top = element.style.left = 0;
                    element.style.margin = 0;
                    element.style.maxWidth = element.style.maxHeight = element.style.width = element.style.height = "100%";
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
    	defaultWidth: 920,
    	defaultHeight: 520,
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
    		_this.wrapper = dom.wrap(_this.media, dom.createElement('div', {
    			class: 'kmlPlayer'
    		}));
    		dom.triggerWebkitHardwareAcceleration(_this.wrapper);

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

    		//initContainers
    		_this.containers = new Container(_this);

    		//autoFONT
    		var _width = function _width() {
    			return _this.width();
    		};
    		if (typeof _this.__settings.font === "boolean" && _this.__settings.font) _this.__settings.font = defaults.font;
    		_this.autoFont = new autoFont(_this.wrapper, _width, _this.__settings.font, _this);
    		if (_this.__settings.font) _this.autoFont.enabled(true);

    		//initCallbackEvents
    		for (var evt in _events) {
    			_this.on(evt, _events[evt], _this);
    		}

    		_this.on('loadedmetadata', function () {
    			if (_this.media.width != _this.media.videoWidth || _this.media.height != _this.media.videoHeight) {
    				_this.defaultWidth();
    				_this.defaultHeight();
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
    		dom.class.add(this.wrapper, v);
    	};

    	kmlPlayer.prototype.removeClass = function removeClass(v, el) {
    		if (el !== undefined) {
    			dom.class.remove(el, v);
    			return;
    		}
    		if (v !== 'kmlPlayer') {
    			dom.class.remove(this.wrapper, v);
    		}
    	};

    	kmlPlayer.prototype.toggleClass = function toggleClass(v, el) {
    		if (el !== undefined) {
    			dom.class.toggle(el, v);
    			return;
    		}
    		if (v !== 'kmlPlayer') {
    			dom.class.toggle(this.wrapper, v);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzL2RlZXBtZXJnZS5qcyIsIi4uL3NyYy9oZWxwZXJzL3V0aWxzLmpzIiwiLi4vc3JjL2hlbHBlcnMvZG9tLmpzIiwiLi4vc3JjL2NvcmUvYXV0b0ZvbnQuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvYWRhcHRpdmVDb250YWluZXIuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvY29udGFpbmVyLmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvZXZlbnRzL2luZGV4LmpzIiwiLi4vc3JjL2hlbHBlcnMvc2Nyb2xsUG9zaXRpb24uanMiLCIuLi9zcmMvY29yZS9mdWxsc2NyZWVuLmpzIiwiLi4vc3JjL2hlbHBlcnMvY2FuY2VsVmlkZW9OZXR3b3JrUmVxdWVzdC5qcyIsIi4uL3NyYy9oZWxwZXJzL21pbWVUeXBlLmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvaW5kZXguanMiLCIuLi9zcmMvaGVscGVycy9jb250YWluZXJCb3VuZHMuanMiLCIuLi9zcmMvaGVscGVycy9wYWdlVmlzaWJpbGl0eS5qcyIsIi4uL3NyYy9jb3JlL21lZGlhL2V2ZW50cy9leHRlcm5hbENvbnRyb2xzLmpzIiwiLi4vc3JjL2hlbHBlcnMvYWpheC5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKXtcblx0bGV0IGRlZXBtZXJnZSA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjKSB7XG5cdFx0aWYoc3JjKXtcblx0XHQgICAgdmFyIGFycmF5ID0gQXJyYXkuaXNBcnJheShzcmMpO1xuXHRcdCAgICB2YXIgZHN0ID0gYXJyYXkgJiYgW10gfHwge307XG5cblx0XHQgICAgaWYgKGFycmF5KSB7XG5cdFx0ICAgICAgICB0YXJnZXQgPSB0YXJnZXQgfHwgW107XG5cdFx0ICAgICAgICBkc3QgPSBkc3QuY29uY2F0KHRhcmdldCk7XG5cdFx0ICAgICAgICBzcmMuZm9yRWFjaChmdW5jdGlvbihlLCBpKSB7XG5cdFx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBkc3RbaV0gPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtpXSA9IGU7XG5cdFx0ICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZSA9PT0gJ29iamVjdCcpIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2ldID0gZGVlcG1lcmdlKHRhcmdldFtpXSwgZSk7XG5cdFx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0XHQgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5pbmRleE9mKGUpID09PSAtMSkge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0LnB1c2goZSk7XG5cdFx0ICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICB9XG5cdFx0ICAgICAgICB9KTtcblx0XHQgICAgfSBlbHNlIHtcblx0XHQgICAgICAgIGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpIHtcblx0XHQgICAgICAgICAgICBPYmplY3Qua2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHRhcmdldFtrZXldO1xuXHRcdCAgICAgICAgICAgIH0pXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgICBPYmplY3Qua2V5cyhzcmMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICAgICAgICAgIGlmICh0eXBlb2Ygc3JjW2tleV0gIT09ICdvYmplY3QnIHx8ICFzcmNba2V5XSkge1xuXHRcdCAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICBlbHNlIHtcblx0XHQgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRba2V5XSkge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcblx0XHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0XHQgICAgICAgICAgICAgICAgICAgIGRzdFtrZXldID0gZGVlcG1lcmdlKHRhcmdldFtrZXldLCBzcmNba2V5XSk7XG5cdFx0ICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICB9XG5cdFx0ICAgICAgICB9KTtcblx0XHQgICAgfVxuXHRcdCAgICByZXR1cm4gZHN0O1xuXHQgICAgfWVsc2V7XG5cdCAgICBcdHJldHVybiB0YXJnZXQgfHzCoFtdO1xuXHQgICAgfVxuXHR9XG5cdHJldHVybiBkZWVwbWVyZ2U7XG59KSgpOyIsImV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW0oc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmcucmVwbGFjZSgvXlxccyt8XFxzKyQvZ20sICcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2VudEZyb21TdHJpbmcodil7XG5cdCBpZih2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRsZXQgdCA9IGZhbHNlO1xuXHRpZih2LmluZGV4T2Ype1xuXHRcdGlmKHYuaW5kZXhPZignJScpID4gLTEpXG5cdFx0e1xuXHRcdCAgdCA9IHBhcnNlRmxvYXQodik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZm4sIGRlbGF5KSB7XG5cdHZhciB0XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRjbGVhclRpbWVvdXQodClcblx0XHR0ID0gc2V0VGltZW91dChmbiwgZGVsYXkpXG5cdH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXJjZW50YWdlKGN1cnJlbnQsIG1heCkge1xuXHRpZiAoY3VycmVudCA9PT0gMCB8fCBtYXggPT09IDAgfHwgaXNOYU4oY3VycmVudCkgfHwgaXNOYU4obWF4KSkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cdHJldHVybiAoKGN1cnJlbnQgLyBtYXgpICogMTAwKS50b0ZpeGVkKDIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZEJpbmFyeWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1NlY29uZHModCkge1xuXHR2YXIgcyA9IDAuMDtcblx0aWYgKHQpIHtcblx0XHR2YXIgcCA9IHQuc3BsaXQoJzonKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspXG5cdFx0XHRzID0gcyAqIDYwICsgcGFyc2VGbG9hdChwW2ldLnJlcGxhY2UoJywnLCAnLicpKVxuXHR9XG5cdHJldHVybiBzO1xufVxuXG4vKipcbiAqIEZhc3RlciBTdHJpbmcgc3RhcnRzV2l0aCBhbHRlcm5hdGl2ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzcmMgLSBzb3VyY2Ugc3RyaW5nXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHN0ciAtIHRlc3Qgc3RyaW5nXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFydHNXaXRoKHNyYywgc3RyKSB7XG4gIHJldHVybiBzcmMuc2xpY2UoMCwgc3RyLmxlbmd0aCkgPT09IHN0clxufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgc3RyaW5nXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyh2KSB7XG4gIHJldHVybiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIG51bWVyaWNcbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyh2KXtcbiAgcmV0dXJuICFpc05hTih2KTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIHN0cmljdCBudW1lcmljXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmljdE51bWVyaWModil7XG4gIHJldHVybiAoaXNOYU4odikgJiYgdHlwZW9mIHYgPT09ICdudW1iZXInKVxufVxuXG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBib29sZWFuXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Jvb2xlYW4odil7XG4gIHJldHVybiAodHlwZW9mIHYgPT09ICdib29sZWFuJyk7XG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBmdW5jdGlvblxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZSAgIC8vIGF2b2lkIElFIHByb2JsZW1zXG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYW4gb2JqZWN0LCBleGNsdWRlIG51bGwuXG4gKiBOT1RFOiBVc2UgaXNPYmplY3QoeCkgJiYgIWlzQXJyYXkoeCkgdG8gZXhjbHVkZXMgYXJyYXlzLlxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qodikge1xuICByZXR1cm4gdiAmJiB0eXBlb2YgdiA9PT0gJ29iamVjdCcgICAgICAgICAvLyB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0J1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEga2luZCBvZiBhcnJheVxuICogQHBhcmFtICAgeyAqIH0gYSAtIGFueXRoaW5nXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaXMgJ2EnIGFuIGFycmF5P1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShhKSB7IHJldHVybiBBcnJheS5pc0FycmF5KGEpIHx8IGEgaW5zdGFuY2VvZiBBcnJheSB9XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBhcnJheSBjb250YWlucyBhbiBpdGVtXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gYXJyIC0gdGFyZ2V0IGFycmF5XG4gKiBAcGFyYW0gICB7ICogfSBpdGVtIC0gaXRlbSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSBEb2VzICdhcnInIGNvbnRhaW4gJ2l0ZW0nP1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnMoYXJyLCBpdGVtKSB7XG4gIHJldHVybiBhcnIuaW5kZXhPZihpdGVtKSA+IC0xO1xufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBzZXQgYW4gaW1tdXRhYmxlIHByb3BlcnR5XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGVsIC0gb2JqZWN0IHdoZXJlIHRoZSBuZXcgcHJvcGVydHkgd2lsbCBiZSBzZXRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0ga2V5IC0gb2JqZWN0IGtleSB3aGVyZSB0aGUgbmV3IHByb3BlcnR5IHdpbGwgYmUgc3RvcmVkXG4gKiBAcGFyYW0gICB7ICogfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBuZXcgcHJvcGVydHlcbiogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRpb25zIC0gc2V0IHRoZSBwcm9wZXJ5IG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgb3B0aW9uc1xuICogQHJldHVybnMgeyBPYmplY3QgfSAtIHRoZSBpbml0aWFsIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoZWwsIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsLCBrZXksIGV4dGVuZCh7XG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSwgb3B0aW9ucykpXG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIERldGVjdCB3aGV0aGVyIGEgcHJvcGVydHkgb2YgYW4gb2JqZWN0IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gIG9iaiAtIHNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gIGtleSAtIG9iamVjdCBwcm9wZXJ0eVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gaXMgdGhpcyBwcm9wZXJ0eSB3cml0YWJsZT9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV3JpdGFibGUob2JqLCBrZXkpIHtcbiAgdmFyIHByb3BzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSlcbiAgcmV0dXJuIHR5cGVvZiBvYmpba2V5XSA9PT0gVF9VTkRFRiB8fCBwcm9wcyAmJiBwcm9wcy53cml0YWJsZVxufVxuXG4vKipcbiAqIEV4dGVuZCBhbnkgb2JqZWN0IHdpdGggb3RoZXIgcHJvcGVydGllc1xuICogQHBhcmFtICAgeyBPYmplY3QgfSBzcmMgLSBzb3VyY2Ugb2JqZWN0XG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IHRoZSByZXN1bHRpbmcgZXh0ZW5kZWQgb2JqZWN0XG4gKlxuICogdmFyIG9iaiA9IHsgZm9vOiAnYmF6JyB9XG4gKiBleHRlbmQob2JqLCB7YmFyOiAnYmFyJywgZm9vOiAnYmFyJ30pXG4gKiBjb25zb2xlLmxvZyhvYmopID0+IHtiYXI6ICdiYXInLCBmb286ICdiYXInfVxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChzcmMpIHtcbiAgdmFyIG9iaiwgYXJncyA9IGFyZ3VtZW50c1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAob2JqID0gYXJnc1tpXSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGlzIHByb3BlcnR5IG9mIHRoZSBzb3VyY2Ugb2JqZWN0IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAgICAgICAgaWYgKGlzV3JpdGFibGUoc3JjLCBrZXkpKVxuICAgICAgICAgIHNyY1trZXldID0gb2JqW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNyY1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVGb250KGYsIHdpZHRoLCBlbCkge1xuXHR2YXIgciA9IGZhbHNlLCBsID0gZmFsc2U7XG5cdGlmKGYudW5pdHMgIT0gJ3B4JykgZi51bml0cyA9ICdlbSc7XG5cdGlmIChmLm1pbiAhPT0gZmFsc2UgJiYgZi5yYXRpbyAhPT0gZmFsc2UpIHtcblx0XHRyID0gZi5yYXRpbyAqIHdpZHRoIC8gMTAwMDtcblx0XHRpZiAociA8IGYubWluKSByID0gZi5taW47XG5cdFx0aWYgKGYudW5pdHMgPT0gJ3B4JykgciA9IE1hdGguY2VpbChyKTtcblx0XHRpZiAoIWlzTmFOKGYubGluZUhlaWdodCkgJiYgZi5saW5lSGVpZ2h0KSB7XG5cdFx0XHRsID0gciAqIGYubGluZUhlaWdodDtcblx0XHRcdGlmIChsIDwgMSkgbCA9IDE7XG5cdFx0XHRsID0gK2wudG9GaXhlZCgzKSArIGYudW5pdHM7XG5cdFx0fVxuXHRcdHIgPSArci50b0ZpeGVkKDMpICsgZi51bml0cztcblx0fVxuXHRpZihlbCl7XG5cdFx0aWYocikgZWwuc3R5bGUuZm9udFNpemUgPSByO1xuXHRcdGlmKGwpIGVsLnN0eWxlLmxpbmVIZWlnaHQgPSBsO1xuXHR9XG5cdHJldHVybiB7Zm9udFNpemU6IHIsIGxpbmVIZWlnaHQ6IGx9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQge307IiwiLyoqXG4gKiBAbW9kdWxlIGRvbVxuICogTW9kdWxlIGZvciBlYXNpbmcgdGhlIG1hbmlwdWxhdGlvbiBvZiBkb20gZWxlbWVudHNcbiAqL1xuXG5sZXQgY2xhc3NSZWcgPSBmdW5jdGlvbihjKSB7XG5cdHJldHVybiBuZXcgUmVnRXhwKFwiKF58XFxcXHMrKVwiICsgYyArIFwiKFxcXFxzK3wkKVwiKTtcbn07XG5cbmxldCBoYXNDbGFzc1xubGV0IGFkZENsYXNzXG5sZXQgcmVtb3ZlQ2xhc3M7XG5sZXQgdG9nZ2xlQ2xhc3M7XG5cbmlmICgnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcblx0aGFzQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0cmV0dXJuIGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGMpO1xuXHR9O1xuXHRhZGRDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRjID0gYy5zcGxpdCgnICcpO1xuXHRcdGZvciAodmFyIGsgaW4gYykgZWxlbS5jbGFzc0xpc3QuYWRkKGNba10pO1xuXHR9O1xuXHRyZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRlbGVtLmNsYXNzTGlzdC5yZW1vdmUoYyk7XG5cdH07XG59IGVsc2Uge1xuXHRoYXNDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRyZXR1cm4gY2xhc3NSZWcoYykudGVzdChlbGVtLmNsYXNzTmFtZSk7XG5cdH07XG5cdGFkZENsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGlmICghaGFzQ2xhc3MoZWxlbSwgYykpIHtcblx0XHRcdGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUgKyAnICcgKyBjO1xuXHRcdH1cblx0fTtcblx0cmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0ZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzUmVnKGMpLCAnICcpO1xuXHR9O1xufVxuXG50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0dmFyIGZuID0gaGFzQ2xhc3MoZWxlbSwgYykgPyByZW1vdmVDbGFzcyA6IGFkZENsYXNzO1xuXHRmbihlbGVtLCBjKTtcbn07XG5cbmxldCBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUgPSBmdW5jdGlvbiBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUocHJvcE5hbWUpIHtcblx0dmFyIGRvbVByZWZpeGVzID0gJ1dlYmtpdCBNb3ogbXMgTycuc3BsaXQoJyAnKSxcblx0XHRlbFN0eWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlO1xuXHRpZiAoZWxTdHlsZVtwcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHByb3BOYW1lOyAvLyBJcyBzdXBwb3J0ZWQgdW5wcmVmaXhlZFxuXHRwcm9wTmFtZSA9IHByb3BOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcE5hbWUuc3Vic3RyKDEpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRvbVByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKGVsU3R5bGVbZG9tUHJlZml4ZXNbaV0gKyBwcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIGRvbVByZWZpeGVzW2ldICsgcHJvcE5hbWU7IC8vIElzIHN1cHBvcnRlZCB3aXRoIHByZWZpeFxuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRzdHlsZVByZWZpeDoge1xuXHRcdHRyYW5zZm9ybTogZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKCd0cmFuc2Zvcm0nKSxcblx0XHRwZXJzcGVjdGl2ZTogZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKCdwZXJzcGVjdGl2ZScpLFxuXHRcdGJhY2tmYWNlVmlzaWJpbGl0eTogZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKCdiYWNrZmFjZVZpc2liaWxpdHknKVxuXHR9LFxuXHR0cmlnZ2VyV2Via2l0SGFyZHdhcmVBY2NlbGVyYXRpb246IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRpZiAodGhpcy5zdHlsZVByZWZpeC5iYWNrZmFjZVZpc2liaWxpdHkgJiYgdGhpcy5zdHlsZVByZWZpeC5wZXJzcGVjdGl2ZSkge1xuXHRcdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LnBlcnNwZWN0aXZlXSA9ICcxMDAwcHgnO1xuXHRcdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LmJhY2tmYWNlVmlzaWJpbGl0eV0gPSAnaGlkZGVuJztcblx0XHR9XG5cdH0sXG5cdHRyYW5zZm9ybTogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWUpIHtcblx0XHRlbGVtZW50LnN0eWxlW3RoaXMuc3R5bGVQcmVmaXgudHJhbnNmb3JtXSA9IHZhbHVlO1xuXHR9LFxuXHQvKipcblx0ICogU2hvcnRlciBhbmQgZmFzdCB3YXkgdG8gc2VsZWN0IG11bHRpcGxlIG5vZGVzIGluIHRoZSBET01cblx0ICogQHBhcmFtICAgeyBTdHJpbmcgfSBzZWxlY3RvciAtIERPTSBzZWxlY3RvclxuXHQgKiBAcGFyYW0gICB7IE9iamVjdCB9IGN0eCAtIERPTSBub2RlIHdoZXJlIHRoZSB0YXJnZXRzIG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXG5cdCAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZG9tIG5vZGVzIGZvdW5kXG5cdCAqL1xuXHRzZWxlY3RBbGw6IGZ1bmN0aW9uKHNlbGVjdG9yLCBjdHgpIHtcblx0XHRyZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcilcblx0fSxcblx0LyoqXG5cdCAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBhIHNpbmdsZSBub2RlIGluIHRoZSBET01cblx0ICogQHBhcmFtICAgeyBTdHJpbmcgfSBzZWxlY3RvciAtIHVuaXF1ZSBkb20gc2VsZWN0b3Jcblx0ICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0IG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXG5cdCAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZG9tIG5vZGUgZm91bmRcblx0ICovXG5cdHNlbGVjdDogZnVuY3Rpb24oc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuXHR9LFxuXHRjbGFzczoge1xuXHRcdGhhczogaGFzQ2xhc3MsXG5cdFx0XHRhZGQ6IGFkZENsYXNzLFxuXHRcdFx0cmVtb3ZlOiByZW1vdmVDbGFzcyxcblx0XHRcdHRvZ2dsZTogdG9nZ2xlQ2xhc3Ncblx0fSxcblx0YXV0b0xpbmVIZWlnaHQ6IGZ1bmN0aW9uKGVsKSB7XG5cdFx0bGV0IGwgPSBlbC5vZmZzZXRIZWlnaHQgKyBcInB4XCI7XG5cdFx0ZWwuc3R5bGUubGluZUhlaWdodCA9IGw7XG5cdFx0cmV0dXJuIGw7XG5cdH0sXG5cdGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsbSwgcHJvcHMpIHtcblx0XHRsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsbSk7XG5cdFx0Zm9yIChsZXQgayBpbiBwcm9wcykge1xuXHRcdFx0ZWwuc2V0QXR0cmlidXRlKGssIHByb3BzW2tdKTtcblx0XHR9XG5cdFx0cmV0dXJuIGVsO1xuXHR9LFxuXHRlbXB0eUVsZW1lbnQ6IGZ1bmN0aW9uKGVsbSkge1xuXHRcdHdoaWxlIChlbG0uZmlyc3RDaGlsZCkge1xuXHRcdFx0ZWxtLnJlbW92ZUNoaWxkKGVsbS5maXJzdENoaWxkKTtcblx0XHR9XG5cdH0sXG5cdHJlcGxhY2VFbGVtZW50OiBmdW5jdGlvbih0YXJnZXQsIGVsbSkge1xuXHRcdHRhcmdldC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChlbG0sIHRhcmdldCk7XG5cdH0sXG5cdHJlbW92ZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cdH0sXG5cdGluc2VydEFmdGVyOiBmdW5jdGlvbihlbCwgcmVmZXJlbmNlTm9kZSkge1xuXHRcdHJlZmVyZW5jZU5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHJlZmVyZW5jZU5vZGUubmV4dFNpYmxpbmcpO1xuXHR9LFxuXHRpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKGVsLCByZWZlcmVuY2VOb2RlKSB7XG5cdFx0cmVmZXJlbmNlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlTm9kZSk7XG5cdH0sXG5cdGdldFRleHRDb250ZW50OiBmdW5jdGlvbihlbCkge1xuXHRcdHJldHVybiBlbC50ZXh0Q29udGVudCB8fCBlbC5pbm5lclRleHQ7XG5cdH0sXG5cdHdyYXA6IGZ1bmN0aW9uKGVsZW1lbnRzLCB3cmFwcGVyKSB7XG5cdFx0Ly8gQ29udmVydCBgZWxlbWVudHNgIHRvIGFuIGFycmF5LCBpZiBuZWNlc3NhcnkuXG5cdFx0aWYgKCFlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdGVsZW1lbnRzID0gW2VsZW1lbnRzXTtcblx0XHR9XG5cblx0XHQvLyBMb29wcyBiYWNrd2FyZHMgdG8gcHJldmVudCBoYXZpbmcgdG8gY2xvbmUgdGhlIHdyYXBwZXIgb24gdGhlXG5cdFx0Ly8gZmlyc3QgZWxlbWVudCAoc2VlIGBjaGlsZGAgYmVsb3cpLlxuXHRcdGZvciAodmFyIGkgPSBlbGVtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0dmFyIGNoaWxkID0gKGkgPiAwKSA/IHdyYXBwZXIuY2xvbmVOb2RlKHRydWUpIDogd3JhcHBlcjtcblx0XHRcdHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV07XG5cblx0XHRcdC8vIENhY2hlIHRoZSBjdXJyZW50IHBhcmVudCBhbmQgc2libGluZy5cblx0XHRcdHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR2YXIgc2libGluZyA9IGVsZW1lbnQubmV4dFNpYmxpbmc7XG5cblx0XHRcdC8vIFdyYXAgdGhlIGVsZW1lbnQgKGlzIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBjdXJyZW50XG5cdFx0XHQvLyBwYXJlbnQpLlxuXHRcdFx0Y2hpbGQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cblx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGhhZCBhIHNpYmxpbmcsIGluc2VydCB0aGUgd3JhcHBlciBiZWZvcmVcblx0XHRcdC8vIHRoZSBzaWJsaW5nIHRvIG1haW50YWluIHRoZSBIVE1MIHN0cnVjdHVyZTsgb3RoZXJ3aXNlLCBqdXN0XG5cdFx0XHQvLyBhcHBlbmQgaXQgdG8gdGhlIHBhcmVudC5cblx0XHRcdGlmIChzaWJsaW5nKSB7XG5cdFx0XHRcdHBhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHNpYmxpbmcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNoaWxkO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7c2NhbGVGb250LCBkZWJvdW5jZX0gZnJvbSAnLi4vaGVscGVycy91dGlscyc7XG5pbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4uL2hlbHBlcnMvZGVlcG1lcmdlJztcbmxldCBhdXRvRm9udCA9IGZ1bmN0aW9uKGVsLCBfd2lkdGgsIGZvbnQsIHBhcmVudCkge1xuXHRsZXQgX2VuYWJsZWQgPSBmYWxzZTtcblx0bGV0IF91cGRhdGUgPSBmdW5jdGlvbigpe1xuXHRcdGRlYm91bmNlKGZ1bmN0aW9uKCl7XG5cdFx0XHRzY2FsZUZvbnQoZm9udCwgX3dpZHRoKCksIGVsKTtcblx0XHR9LDEwMCkoKTtcblx0fVxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKHYpIHtcblx0XHRpZih2ICE9PSB1bmRlZmluZWQpe1xuXHRcdFx0aWYoIWZvbnQpeyBmb250ID0ge3JhdGlvOiAxLCBtaW46MSwgbGluZUhlaWdodDogZmFsc2V9IH1cblx0XHRcdGZvbnQgPSBkZWVwbWVyZ2UoZm9udCwgdik7XG5cdFx0XHRyZXR1cm4gc2NhbGVGb250KGZvbnQsIF93aWR0aCgpLCBlbCk7XG5cdFx0fVxuXHR9O1xuXHR0aGlzLmVuYWJsZWQgPSAgZnVuY3Rpb24odikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nICYmIGZvbnQpIHtcblx0XHRcdF9lbmFibGVkID0gdjtcblx0XHRcdC8vIHYgPyAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF91cGRhdGUsIGZhbHNlKSwgc2NhbGVGb250KGZvbnQsIF93aWR0aCgpLCBlbCkpIDogd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF91cGRhdGUsIGZhbHNlKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9lbmFibGVkOztcblx0fTtcblx0aWYocGFyZW50Lm9uKXtcblx0XHRwYXJlbnQub24oJ3Jlc2l6ZScsIF91cGRhdGUpO1xuXHR9O1xufVxuZXhwb3J0IGRlZmF1bHQgYXV0b0ZvbnQ7IiwiaW1wb3J0IHtcblx0cHJvY2VudEZyb21TdHJpbmcsXG5cdGRlYm91bmNlXG59IGZyb20gJy4uLy4uL2hlbHBlcnMvdXRpbHMnO1xuaW1wb3J0IGRvbSBmcm9tICcuLi8uLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4uLy4uL2hlbHBlcnMvZGVlcG1lcmdlJztcblxubGV0IGRlZmF1bHRzID0ge1xuXHR4OiAwLFxuXHR5OiAwLFxuXHR3aWR0aDogJzEwMCUnLFxuXHRoZWlnaHQ6ICcxMDAlJyxcblx0Zm9udFNpemU6IG51bGwsXG5cdGxpbmVIZWlnaHQ6IG51bGwsXG5cdG9mZnNldFg6IDAsXG5cdG9mZnNldFk6IDAsXG5cdG9yaWdpblBvaW50OiBcInRvcExlZnRcIixcblx0dmlzaWJsZTogZmFsc2UsXG5cdHRyYW5zZm9ybToge1xuXHRcdHg6IG51bGwsXG5cdFx0eTogbnVsbFxuXHR9LFxuXHR0cmFuc2xhdGU6IHRydWVcbn1cblxubGV0IGFkYXB0aXZlQ29udGFpbmVyID0gZnVuY3Rpb24oYm91bmRzLCBzZXR0dGluZ3MsIHBhcmVudCkge1xuXHRsZXQgdmF1bHQgPSB7XG5cdFx0eDogMCxcblx0XHR5OiAwLFxuXHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0aGVpZ2h0OiAnMTAwJScsXG5cdFx0Zm9udFNpemU6IG51bGwsXG5cdFx0bGluZUhlaWdodDogbnVsbFxuXHR9O1xuXHRsZXQgcGFyZW50V2lkdGggPSAwO1xuXHRsZXQgcGFyZW50SGVpZ2h0ID0gMDtcblx0bGV0IHBhcmVudFggPSAwO1xuXHRsZXQgcGFyZW50WSA9IDA7XG5cdGxldCBkb21FbGVtZW50ID0gbnVsbDtcblx0bGV0IHNldHRpbmdzID0gZGVlcG1lcmdlKGRlZmF1bHRzLCBzZXR0dGluZ3MpO1xuXHRsZXQgX2FjdGl2ZSA9IGZhbHNlO1xuXG5cdGxldCB1cGRhdGVEb21FbGVtZW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKF9hY3RpdmUgJiYgZG9tRWxlbWVudCAmJiBkb21FbGVtZW50Lm5vZGVUeXBlKSB7XG5cdFx0XHRpZiAodmF1bHQud2lkdGggIT09IG51bGwpIGRvbUVsZW1lbnQuc3R5bGUud2lkdGggPSB2YXVsdC53aWR0aCArIFwicHhcIjtcblx0XHRcdGlmICh2YXVsdC5oZWlnaHQgIT09IG51bGwpIGRvbUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdmF1bHQuaGVpZ2h0ICsgXCJweFwiO1xuXG5cdFx0XHRpZiAoZG9tLnN0eWxlUHJlZml4LnRyYW5zZm9ybSAmJiBzZXR0aW5ncy50cmFuc2xhdGUpIHtcblx0XHRcdFx0bGV0IHRyYW5zZm9ybSA9ICcnO1xuXHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsICYmIHZhdWx0LnkgIT0gbnVsbCkge1xuXHRcdFx0XHRcdHRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoJyArIHZhdWx0LnggKyAncHgsJyArIHZhdWx0LnkgKyAncHgpJztcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxlZnQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnJpZ2h0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5ib3R0b20gPSBcImF1dG9cIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9IFwiYXV0b1wiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5yaWdodCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0dHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHZhdWx0LnggKyAncHgpJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnkgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5ib3R0b20gPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUudG9wID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgnICsgdmF1bHQueSArICdweCknO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRkb20udHJhbnNmb3JtKGRvbUVsZW1lbnQsIHRyYW5zZm9ybSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsICYmIHZhdWx0LnkgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IHZhdWx0LnggKyBcInB4XCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS50b3AgPSB2YXVsdC55ICsgXCJweFwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwpIGRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IHZhdWx0LnggKyBcInB4XCI7XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnkgIT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS50b3AgPSB2YXVsdC55ICsgXCJweFwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzZXR0aW5ncy5mb250U2l6ZSAhPT0gdmF1bHQuZm9udFNpemUpIHtcblx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IHZhdWx0LmZvbnRTaXplID0gc2V0dGluZ3MuZm9udFNpemU7XG5cblx0XHRcdH1cblx0XHRcdGlmIChzZXR0aW5ncy5saW5lSGVpZ2h0ICE9PSB2YXVsdC5saW5lSGVpZ2h0KSB7XG5cdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGluZUhlaWdodCA9IHZhdWx0LmxpbmVIZWlnaHQgPSBzZXR0aW5ncy5saW5lSGVpZ2h0O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGxldCB1cGRhdGVQcm9wcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCBfdyA9IHBhcmVudC53aWR0aCgpO1xuXHRcdGxldCBfaCA9IHBhcmVudC5oZWlnaHQoKTtcblx0XHRsZXQgX3ggPSBwYXJlbnQub2Zmc2V0WCgpO1xuXHRcdGxldCBfeSA9IHBhcmVudC5vZmZzZXRZKCk7XG5cdFx0aWYocGFyZW50V2lkdGggIT0gX3cgfHwgcGFyZW50SGVpZ2h0ICE9IF9oIHx8IF94ICE9IHBhcmVudFggfHwgX3kgIT0gcGFyZW50WSl7XG5cdFx0XHRwYXJlbnRXaWR0aCA9IF93OyBwYXJlbnRIZWlnaHQgPSBfaDtcblx0XHRcdHBhcmVudFggPSBfeDsgcGFyZW50WSA9IF95O1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBiID0gYm91bmRzKCk7XG5cblx0XHRsZXQgcHJvY2VudFdpZHRoID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3Mud2lkdGgpO1xuXHRcdGlmIChwcm9jZW50V2lkdGgpIHtcblx0XHRcdHZhdWx0LndpZHRoID0gYi53aWR0aCAqIHByb2NlbnRXaWR0aCAvIDEwMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHNldHRpbmdzLndpZHRoICE9IG51bGwpIHtcblx0XHRcdFx0dmF1bHQud2lkdGggPSBiLndpZHRoICogYi5zY2FsZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRsZXQgcHJvY2VudEhlaWdodCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLmhlaWdodCk7XG5cdFx0aWYgKHByb2NlbnRIZWlnaHQpIHtcblx0XHRcdHZhdWx0LmhlaWdodCA9IGIuaGVpZ2h0ICogcHJvY2VudEhlaWdodCAvIDEwMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHNldHRpbmdzLmhlaWdodCAhPSBudWxsKSB7XG5cdFx0XHRcdHZhdWx0LmhlaWdodCA9IGIuaGVpZ2h0ICogYi5zY2FsZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoc2V0dGluZ3MueCAhPSBudWxsKSB7XG5cdFx0XHRsZXQgcHJvY2VudFggPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy54KTtcblx0XHRcdGlmKHByb2NlbnRYKXtcblx0XHRcdFx0dmF1bHQueCA9IGIub2Zmc2V0WCArIGIud2lkdGggKiBwcm9jZW50WCAvIDEwMDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR2YXVsdC54ID0gYi5vZmZzZXRYICsgc2V0dGluZ3MueCAqIGIuc2NhbGU7XHRcblx0XHRcdH1cblx0XHRcdGxldCB0cmFuc2Zvcm1YID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MudHJhbnNmb3JtLngpO1xuXHRcdFx0aWYgKHRyYW5zZm9ybVgpIHZhdWx0LnggKz0gdHJhbnNmb3JtWCAqIHZhdWx0LndpZHRoIC8gMTAwO1xuXHRcdFx0aWYgKHNldHRpbmdzLm9mZnNldFgpIHZhdWx0LnggKz0gc2V0dGluZ3Mub2Zmc2V0WDtcblx0XHR9XG5cblx0XHRpZiAoc2V0dGluZ3MueSAhPSBudWxsKSB7XG5cdFx0XHRsZXQgcHJvY2VudFkgPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy55KTtcblx0XHRcdGlmKHByb2NlbnRZKXtcblx0XHRcdFx0dmF1bHQueSA9IGIub2Zmc2V0WSArIGIuaGVpZ2h0ICogcHJvY2VudFkgLyAxMDA7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dmF1bHQueSA9IGIub2Zmc2V0WSArIHNldHRpbmdzLnkgKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdFx0bGV0IHRyYW5zZm9ybVkgPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy50cmFuc2Zvcm0ueSk7XG5cdFx0XHRpZiAodHJhbnNmb3JtWSkgdmF1bHQueSArPSB0cmFuc2Zvcm1ZICogdmF1bHQud2lkdGggLyAxMDA7XG5cdFx0XHRpZiAoc2V0dGluZ3Mub2Zmc2V0WSkgdmF1bHQueSArPSBzZXR0aW5ncy5vZmZzZXRZO1xuXHRcdH1cblx0XHRcblx0XHR1cGRhdGVEb21FbGVtZW50KCk7XG5cdH1cblxuXHR0aGlzLmFwcGx5VG8gPSBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0aWYoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlKXtcblx0XHRcdGRvbUVsZW1lbnQgPSBlbGVtZW50O1xuXHRcdFx0dXBkYXRlUHJvcHMoKTtcblx0XHR9XG5cdFx0cmV0dXJuIGRvbUVsZW1lbnQ7XG5cdH1cblxuXHRsZXQgYXBwbHlOZXdQcm9wcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHVwZGF0ZVByb3BzKCk7XG5cdH1cblxuXHR0aGlzLmRhdGEgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdmF1bHQ7XG5cdH1cblxuXHR0aGlzLnNldHRpbmdzID0gZnVuY3Rpb24obmV3U2V0dGluZ3MpIHtcblx0XHRzZXR0aW5ncyA9IGRlZXBtZXJnZShzZXR0aW5ncywgbmV3U2V0dGluZ3MpO1xuXHRcdHVwZGF0ZVByb3BzKCk7XG5cdFx0cmV0dXJuIHNldHRpbmdzO1xuXHR9XG5cdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0X2FjdGl2ZSA9IHY7XG5cdFx0XHRpZih2KSBhcHBseU5ld1Byb3BzKCk7XG5cdFx0XHQvLyB2ID8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMsIGZhbHNlKSA6IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBhcHBseU5ld1Byb3BzLCBmYWxzZSk7XG5cdFx0fVxuXHRcdHJldHVybiBfYWN0aXZlO1xuXHR9O1xuXG5cdGlmKHBhcmVudC5vbil7XG5cdFx0cGFyZW50Lm9uKCdyZXNpemUnLCBhcHBseU5ld1Byb3BzKTtcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgYWRhcHRpdmVDb250YWluZXI7IiwiaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi8uLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQge1xuXHRwcm9jZW50RnJvbVN0cmluZ1xufSBmcm9tICcuLi8uLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkb20gZnJvbSAnLi4vLi4vaGVscGVycy9kb20nO1xuaW1wb3J0IGFkYXB0aXZlQ29udGFpbmVyIGZyb20gJy4vYWRhcHRpdmVDb250YWluZXInO1xubGV0IGRlZmF1bHRzID0ge1xuXHR4OiAwLFxuXHR5OiAwLFxuXHR3aWR0aDogMCxcblx0aGVpZ2h0OiAwXG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWluZXIge1xuXHRjb25zdHJ1Y3RvcihjdHgpIHtcblx0XHR2YXIgX2JvdW5kcyA9ICgpID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG9mZnNldFg6IGN0eC5vZmZzZXRYKCksXG5cdFx0XHRcdG9mZnNldFk6IGN0eC5vZmZzZXRZKCksXG5cdFx0XHRcdHdpZHRoOiBjdHgud2lkdGgoKSxcblx0XHRcdFx0aGVpZ2h0OiBjdHguaGVpZ2h0KCksXG5cdFx0XHRcdHNjYWxlOiBjdHgud2lkdGgoKSAvIGN0eC5kZWZhdWx0V2lkdGgoKSxcblx0XHRcdFx0c2NhbGVZOiBjdHgud2lkdGgoKSAvIGN0eC5kZWZhdWx0SGVpZ2h0KClcblx0XHRcdH07XG5cdFx0fTtcblx0XHR0aGlzLmVsID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdHN0eWxlOiAncG9zaXRpb246YWJzb2x1dGU7IHBvaW50ZXItZXZlbnRzOiBub25lOydcblx0XHR9KTtcblx0XHRsZXQgYWMgPSBuZXcgYWRhcHRpdmVDb250YWluZXIoX2JvdW5kcywge30sIGN0eCk7XG5cdFx0YWMuYXBwbHlUbyh0aGlzLmVsKTtcblx0XHRhYy5lbmFibGVkKHRydWUpO1xuXG5cdFx0Y3R4LndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG5cblx0XHR0aGlzLmFkZCA9IGZ1bmN0aW9uKG9wdHMsZWwgPSB7fSkge1xuXHRcdFx0aWYoIWVsLm5vZGVUeXBlKSBlbCA9IGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGxldCBvID0gZGVlcG1lcmdlKGRlZmF1bHRzLCBvcHRzKTtcblx0XHRcdGVsLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHRcdFx0ZWwuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYWxsXCI7XG5cdFx0XHRsZXQgZWxEaW1lbnNpb24gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0bGV0IF93ID0gcHJvY2VudEZyb21TdHJpbmcoby53aWR0aCk7IFxuXHRcdFx0XHRpZighX3cpIF93ID0gby53aWR0aCAvIGN0eC5kZWZhdWx0V2lkdGgoKSAqIDEwMDtcblx0XHRcdFx0bGV0IF9oID0gcHJvY2VudEZyb21TdHJpbmcoby5oZWlnaHQpOyBcblx0XHRcdFx0aWYoIV9oKSBfaCA9IG8uaGVpZ2h0IC8gY3R4LmRlZmF1bHRIZWlnaHQoKSAqIDEwMDtcblx0XHRcdFx0bGV0IF94ID0gcHJvY2VudEZyb21TdHJpbmcoby54KTtcblx0XHRcdFx0aWYoIV94KSBfeCA9IG8ueCAvIGN0eC5kZWZhdWx0V2lkdGgoKSAqIDEwMDtcblx0XHRcdFx0bGV0IF95ID0gcHJvY2VudEZyb21TdHJpbmcoby55KTtcblx0XHRcdFx0aWYoIV95KSBfeSA9IG8ueSAvIGN0eC5kZWZhdWx0SGVpZ2h0KCkgKiAxMDA7XG5cblx0XHRcdFx0ZWwuc3R5bGUud2lkdGggPSBfdyArIFwiJVwiO1xuXHRcdFx0XHRlbC5zdHlsZS5oZWlnaHQgPSBfaCArIFwiJVwiO1xuXHRcdFx0XHRpZiAoZG9tLnN0eWxlUHJlZml4LnRyYW5zZm9ybSkge1xuXHRcdFx0XHRcdGRvbS50cmFuc2Zvcm0oZWwsICd0cmFuc2xhdGUoJyArIDEwMC9fdypfeCArICclLCcgKyAxMDAvX2gqX3kgKyAnJSknKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbC5zdHlsZS50b3AgPSBfeCArIFwiJVwiO1xuXHRcdFx0XHRcdGVsLnN0eWxlLmxlZnQgPSBfeSArIFwiJVwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbERpbWVuc2lvbigpO1xuXHRcdFx0dGhpcy5lbC5hcHBlbmRDaGlsZChlbCk7XG5cdFx0XHRjdHgub24oJ3Jlc2l6ZScsIGVsRGltZW5zaW9uKTtcblx0XHR9XG5cdH1cbn0iLCIvL2h0dHBzOi8vZ2l0aHViLmNvbS9wcmltdXMvZXZlbnRlbWl0dGVyM1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHByZWZpeCA9ICd+JztcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgYSBzdG9yYWdlIGZvciBvdXIgYEVFYCBvYmplY3RzLlxuICogQW4gYEV2ZW50c2AgaW5zdGFuY2UgaXMgYSBwbGFpbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhcmUgZXZlbnQgbmFtZXMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRXZlbnRzKCkge31cblxuLy9cbi8vIFdlIHRyeSB0byBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYC4gSW4gc29tZSBlbmdpbmVzIGNyZWF0aW5nIGFuXG4vLyBpbnN0YW5jZSBpbiB0aGlzIHdheSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCBkaXJlY3RseS5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBjaGFyYWN0ZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Rcbi8vIG92ZXJyaWRkZW4gb3IgdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy9cbmlmIChPYmplY3QuY3JlYXRlKSB7XG4gIEV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vXG4gIC8vIFRoaXMgaGFjayBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgYF9fcHJvdG9fX2AgcHJvcGVydHkgaXMgc3RpbGwgaW5oZXJpdGVkIGluXG4gIC8vIHNvbWUgb2xkIGJyb3dzZXJzIGxpa2UgQW5kcm9pZCA0LCBpUGhvbmUgNS4xLCBPcGVyYSAxMSBhbmQgU2FmYXJpIDUuXG4gIC8vXG4gIGlmICghbmV3IEV2ZW50cygpLl9fcHJvdG9fXykgcHJlZml4ID0gZmFsc2U7XG59XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdGhpcy5mbiA9IGZuO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIE1pbmltYWwgYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlIHRoYXQgaXMgbW9sZGVkIGFnYWluc3QgdGhlIE5vZGUuanNcbiAqIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IGxpc3RpbmcgdGhlIGV2ZW50cyBmb3Igd2hpY2ggdGhlIGVtaXR0ZXIgaGFzIHJlZ2lzdGVyZWRcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICB2YXIgbmFtZXMgPSBbXVxuICAgICwgZXZlbnRzXG4gICAgLCBuYW1lO1xuXG4gIGlmICh0aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgcmV0dXJuIG5hbWVzO1xuXG4gIGZvciAobmFtZSBpbiAoZXZlbnRzID0gdGhpcy5fZXZlbnRzKSkge1xuICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgcmV0dXJuIG5hbWVzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGV2ZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGV4aXN0cyBPbmx5IGNoZWNrIGlmIHRoZXJlIGFyZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7QXJyYXl8Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKGV2ZW50LCBleGlzdHMpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnRcbiAgICAsIGF2YWlsYWJsZSA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChleGlzdHMpIHJldHVybiAhIWF2YWlsYWJsZTtcbiAgaWYgKCFhdmFpbGFibGUpIHJldHVybiBbXTtcbiAgaWYgKGF2YWlsYWJsZS5mbikgcmV0dXJuIFthdmFpbGFibGUuZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXZhaWxhYmxlLmxlbmd0aCwgZWUgPSBuZXcgQXJyYXkobCk7IGkgPCBsOyBpKyspIHtcbiAgICBlZVtpXSA9IGF2YWlsYWJsZVtpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogQ2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGV2ZW50IGhhZCBsaXN0ZW5lcnMsIGVsc2UgYGZhbHNlYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVycy5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgNDogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMiwgYTMpOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoIWFyZ3MpIGZvciAoaiA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBhcmdzW2ogLSAxXSA9IGFyZ3VtZW50c1tqXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uYXBwbHkobGlzdGVuZXJzW2ldLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcylcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBvbmUtdGltZSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMsIHRydWUpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIHRoaXMuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbdGhpcy5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsaXN0ZW5lcnMgb2YgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IG1hdGNoIHRoaXMgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBoYXZlIHRoaXMgY29udGV4dC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmUtdGltZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiB0aGlzO1xuICBpZiAoIWZuKSB7XG4gICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKFxuICAgICAgICAgbGlzdGVuZXJzLmZuID09PSBmblxuICAgICAgJiYgKCFvbmNlIHx8IGxpc3RlbmVycy5vbmNlKVxuICAgICAgJiYgKCFjb250ZXh0IHx8IGxpc3RlbmVycy5jb250ZXh0ID09PSBjb250ZXh0KVxuICAgICkge1xuICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgZXZlbnRzID0gW10sIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4gIT09IGZuXG4gICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSlcbiAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgICAvL1xuICAgIGlmIChldmVudHMubGVuZ3RoKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gICAgZWxzZSBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzLCBvciB0aG9zZSBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0O1xuXG4gIGlmIChldmVudCkge1xuICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG4gICAgaWYgKHRoaXMuX2V2ZW50c1tldnRdKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBBbGlhcyBtZXRob2RzIG5hbWVzIGJlY2F1c2UgcGVvcGxlIHJvbGwgbGlrZSB0aGF0LlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4vL1xuLy8gVGhpcyBmdW5jdGlvbiBkb2Vzbid0IGFwcGx5IGFueW1vcmUuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgcHJlZml4LlxuLy9cbkV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RW1pdHRlcjsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblx0bGV0IHggPSAwO1xuXHRsZXQgeSA9IDA7XG5cdHRoaXMuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHggPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgMDtcblx0XHR5ID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IDA7XG5cdH1cblx0dGhpcy5yZXN0b3JlID0gZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LnNjcm9sbFRvKHgsIHkpXG5cdH1cbn0iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4vbWVkaWEvZXZlbnRzL2luZGV4JztcbmltcG9ydCBzY3JvbGxQb3NpdGlvbiBmcm9tICcuLi9oZWxwZXJzL3Njcm9sbFBvc2l0aW9uJztcbi8vIEZ1bGxzY3JlZW4gQVBJXG5sZXQgc3VwcG9ydHNGdWxsU2NyZWVuID0gZmFsc2U7XG5sZXQgYnJvd3NlclByZWZpeGVzID0gJ3dlYmtpdCBtb3ogbyBtcyBraHRtbCcuc3BsaXQoJyAnKTtcbmxldCBwcmVmaXhGUyA9ICcnO1xuLy9DaGVjayBmb3IgbmF0aXZlIHN1cHBvcnRcbmlmICh0eXBlb2YgZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xufSBlbHNlIHtcbiAgICAvLyBDaGVjayBmb3IgZnVsbHNjcmVlbiBzdXBwb3J0IGJ5IHZlbmRvciBwcmVmaXhcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBicm93c2VyUHJlZml4ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBwcmVmaXhGUyA9IGJyb3dzZXJQcmVmaXhlc1tpXTtcblxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50W3ByZWZpeEZTICsgJ0NhbmNlbEZ1bGxTY3JlZW4nXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIE1TICh3aGVuIGlzbid0IGl0PylcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4gIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVuYWJsZWQpIHtcbiAgICAgICAgICAgIHByZWZpeEZTID0gJ21zJztcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbmxldCBldmVudENoYW5nZSA9IChwcmVmaXhGUyA9PT0gJycpID8gJ2Z1bGxzY3JlZW5jaGFuZ2UnIDogcHJlZml4RlMgKyAocHJlZml4RlMgPT0gJ21zJyA/ICdmdWxsc2NyZWVuY2hhbmdlJyA6ICdmdWxsc2NyZWVuY2hhbmdlJyk7XG5ldmVudENoYW5nZSA9IGV2ZW50Q2hhbmdlLnRvTG93ZXJDYXNlKCk7XG4vL3N1cHBvcnRzRnVsbFNjcmVlbiA9IGZhbHNlO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVsbHNjcmVlbiBleHRlbmRzIEV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24gPSBuZXcgc2Nyb2xsUG9zaXRpb24oKTtcbiAgICAgICAgaWYgKCFzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZSA9IHt9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZuRnVsbHNjcmVlbkNoYW5nZSA9ICgpPT57XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNGdWxsU2NyZWVuKCkpe1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc2Nyb2xsUG9zaXRpb24ucmVzdG9yZSwxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRDaGFuZ2UsIGZuRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIG9uRnVsbHNjcmVlbkNoYW5nZShldnQpe1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLndyYXBwZXIpO1xuICAgICAgICB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRDaGFuZ2UsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIH0sIHRydWUpO1xuICAgIH1cbiAgICBpc0Z1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMud3JhcHBlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAocHJlZml4RlMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICcnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgPT0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICBjYXNlICdtb3onOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgPT0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnRbcHJlZml4RlMgKyAnRnVsbHNjcmVlbkVsZW1lbnQnXSA9PSBlbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy53cmFwcGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24uc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIChwcmVmaXhGUyA9PT0gJycpID8gZWxlbWVudC5yZXF1ZXN0RnVsbFNjcmVlbigpIDogZWxlbWVudFtwcmVmaXhGUyArIChwcmVmaXhGUyA9PSAnbXMnID8gJ1JlcXVlc3RGdWxsc2NyZWVuJyA6ICdSZXF1ZXN0RnVsbFNjcmVlbicpXSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzRnVsbFNjcmVlbigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbi5zYXZlKCk7XG4gICAgICAgICAgICAgICAgbGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydwb3NpdGlvbiddID0gc3R5bGUucG9zaXRpb24gfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21hcmdpbiddID0gc3R5bGUubWFyZ2luIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd0b3AnXSA9IHN0eWxlLnRvcCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbGVmdCddID0gc3R5bGUubGVmdCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnd2lkdGgnXSA9IHN0eWxlLndpZHRoIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydoZWlnaHQnXSA9IHN0eWxlLmhlaWdodCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnekluZGV4J10gPSBzdHlsZS56SW5kZXggfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21heFdpZHRoJ10gPSBzdHlsZS5tYXhXaWR0aCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWF4SGVpZ2h0J10gPSBzdHlsZS5tYXhIZWlnaHQgfHwgXCJcIjtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBlbGVtZW50LnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luID0gMDtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1heFdpZHRoID0gZWxlbWVudC5zdHlsZS5tYXhIZWlnaHQgPSBlbGVtZW50LnN0eWxlLndpZHRoID0gZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IDIxNDc0ODM2NDc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdyZXNpemUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzRnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKSA6IGRvY3VtZW50W3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnRXhpdEZ1bGxzY3JlZW4nIDogJ0NhbmNlbEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRnVsbFNjcmVlbigpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQuc3R5bGVba10gPSB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVba107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmlzRnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24ucmVzdG9yZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHRvZ2dsZUZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBsZXQgaXNGdWxsc2NyZWVuID0gIXRoaXMuaXNGdWxsU2NyZWVuKCk7XG4gICAgICAgIGlmIChpc0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVsbHNjcmVlbkVsZW1lbnQoKSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IDogZG9jdW1lbnRbcHJlZml4RlMgKyAnRnVsbHNjcmVlbkVsZW1lbnQnXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudDtcbiAgICAgICAgfVxuICAgIH1cbn07IiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtZWRpYSkge1xuXHQvLyBSZW1vdmUgY2hpbGQgc291cmNlc1xuXHR2YXIgc291cmNlcyA9IGRvbS5zZWxlY3RBbGwoJ3NvdXJjZScsIG1lZGlhKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0ZG9tLnJlbW92ZUVsZW1lbnQoc291cmNlc1tpXSk7XG5cdH1cblxuXHQvLyBTZXQgYmxhbmsgdmlkZW8gc3JjIGF0dHJpYnV0ZVxuXHQvLyBUaGlzIGlzIHRvIHByZXZlbnQgYSBNRURJQV9FUlJfU1JDX05PVF9TVVBQT1JURUQgZXJyb3Jcblx0Ly8gU21hbGwgbXA0OiBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9zbWFsbC9ibG9iL21hc3Rlci9tcDQubXA0XG5cdC8vIEluZm86IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzIyMzE1NzkvaG93LXRvLXByb3Blcmx5LWRpc3Bvc2Utb2YtYW4taHRtbDUtdmlkZW8tYW5kLWNsb3NlLXNvY2tldC1vci1jb25uZWN0aW9uXG5cdG1lZGlhLnNldEF0dHJpYnV0ZSgnc3JjJywgJ2RhdGE6dmlkZW8vbXA0O2Jhc2U2NCxBQUFBSEdaMGVYQnBjMjl0QUFBQ0FHbHpiMjFwYzI4eWJYQTBNUUFBQUFobWNtVmxBQUFBR20xa1lYUUFBQUd6QUJBSEFBQUJ0aEJnVVlJOXQrOEFBQU1OYlc5dmRnQUFBR3h0ZG1oa0FBQUFBTVhNdnZyRnpMNzZBQUFENkFBQUFDb0FBUUFBQVFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFnQUFBQmhwYjJSekFBQUFBQkNBZ0lBSEFFLy8vLy8rL3dBQUFpRjBjbUZyQUFBQVhIUnJhR1FBQUFBUHhjeSsrc1hNdnZvQUFBQUJBQUFBQUFBQUFDb0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBZ0FBQUFJQUFBQUFBRzliV1JwWVFBQUFDQnRaR2hrQUFBQUFNWE12dnJGekw3NkFBQUFHQUFBQUFFVnh3QUFBQUFBTFdoa2JISUFBQUFBQUFBQUFIWnBaR1VBQUFBQUFBQUFBQUFBQUFCV2FXUmxiMGhoYm1Sc1pYSUFBQUFCYUcxcGJtWUFBQUFVZG0xb1pBQUFBQUVBQUFBQUFBQUFBQUFBQUNSa2FXNW1BQUFBSEdSeVpXWUFBQUFBQUFBQUFRQUFBQXgxY213Z0FBQUFBUUFBQVNoemRHSnNBQUFBeEhOMGMyUUFBQUFBQUFBQUFRQUFBTFJ0Y0RSMkFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFnQUNBQklBQUFBU0FBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFHUC8vQUFBQVhtVnpaSE1BQUFBQUE0Q0FnRTBBQVFBRWdJQ0FQeUFSQUFBQUFBTU5RQUFBQUFBRmdJQ0FMUUFBQWJBQkFBQUJ0WWtUQUFBQkFBQUFBU0FBeEkySUFNVUFSQUVVUXdBQUFiSk1ZWFpqTlRNdU16VXVNQWFBZ0lBQkFnQUFBQmh6ZEhSekFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFCeHpkSE5qQUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUFFQUFBQVVjM1J6ZWdBQUFBQUFBQUFTQUFBQUFRQUFBQlJ6ZEdOdkFBQUFBQUFBQUFFQUFBQXNBQUFBWUhWa2RHRUFBQUJZYldWMFlRQUFBQUFBQUFBaGFHUnNjZ0FBQUFBQUFBQUFiV1JwY21Gd2NHd0FBQUFBQUFBQUFBQUFBQUFyYVd4emRBQUFBQ09wZEc5dkFBQUFHMlJoZEdFQUFBQUJBQUFBQUV4aGRtWTFNeTR5TVM0eCcpO1xuXG5cdC8vIExvYWQgdGhlIG5ldyBlbXB0eSBzb3VyY2Vcblx0Ly8gVGhpcyB3aWxsIGNhbmNlbCBleGlzdGluZyByZXF1ZXN0c1xuXHQvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1NlbHovcGx5ci9pc3N1ZXMvMTc0XG5cdG1lZGlhLmxvYWQoKTtcblxuXHQvLyBEZWJ1Z2dpbmdcblx0Y29uc29sZS5sb2coXCJDYW5jZWxsZWQgbmV0d29yayByZXF1ZXN0cyBmb3Igb2xkIG1lZGlhXCIpO1xufSIsImV4cG9ydCBmdW5jdGlvbiBtaW1lQXVkaW8obWVkaWEsIHR5cGUpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnYXVkaW8vbXA0JzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0OyBjb2RlY3M9XCJtcDRhLjQwLjVcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vbXBlZyc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICdhdWRpby9vZ2cnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICdhdWRpby93YXYnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby93YXY7IGNvZGVjcz1cIjFcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaW1lVmlkZW8obWVkaWEsIHR5cGUpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAndmlkZW8vd2VibSc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ3ZpZGVvL3dlYm07IGNvZGVjcz1cInZwOCwgdm9yYmlzXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL21wNCc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ3ZpZGVvL21wNDsgY29kZWNzPVwiYXZjMS40MkUwMUUsIG1wNGEuNDAuMlwiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICd2aWRlby9vZ2cnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby9vZ2c7IGNvZGVjcz1cInRoZW9yYVwiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge30iLCJpbXBvcnQgRnVsbHNjcmVlbiBmcm9tICcuLi9mdWxsc2NyZWVuJztcbmltcG9ydCBfY2FuY2VsUmVxdWVzdHMgZnJvbSAnLi4vLi4vaGVscGVycy9jYW5jZWxWaWRlb05ldHdvcmtSZXF1ZXN0JztcbmltcG9ydCB7bWltZVZpZGVvfSBmcm9tICcuLi8uLi9oZWxwZXJzL21pbWVUeXBlJztcblxuLy9odHRwczovL3d3dy53My5vcmcvMjAxMC8wNS92aWRlby9tZWRpYWV2ZW50cy5odG1sXG5sZXQgX2V2ZW50cyA9IFsnZW5kZWQnLCAncHJvZ3Jlc3MnLCAnc3RhbGxlZCcsICdwbGF5aW5nJywgJ3dhaXRpbmcnLCAnY2FucGxheScsICdjYW5wbGF5dGhyb3VnaCcsICdsb2Fkc3RhcnQnLCAnbG9hZGVkZGF0YScsICdsb2FkZWRtZXRhZGF0YScsICd0aW1ldXBkYXRlJywgJ3ZvbHVtZWNoYW5nZScsICdwbGF5JywgJ3BsYXlpbmcnLCAncGF1c2UnLCAnZXJyb3InLCAnc2Vla2luZycsICdlbXB0aWVkJywgJ3NlZWtlZCcsICdyYXRlY2hhbmdlJywgJ3N1c3BlbmQnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVkaWEgZXh0ZW5kcyBGdWxsc2NyZWVuIHtcblx0Y29uc3RydWN0b3IoZWwpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMubWVkaWEgPSBlbDtcblx0XHRfZXZlbnRzLmZvckVhY2goKGspID0+IHtcblx0XHRcdC8vIHRoaXMub24oaywgZnVuY3Rpb24oKXtcblx0XHRcdC8vIFx0Y29uc29sZS5sb2coayk7XG5cdFx0XHQvLyB9KTtcblx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoaywgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmVtaXQoayk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuY2FuUGxheSA9IHtcblx0XHRcdG1wNDogbWltZVZpZGVvKGVsLCd2aWRlby9tcDQnKSxcblx0XHRcdHdlYm06IG1pbWVWaWRlbyhlbCwndmlkZW8vd2VibScpLFxuXHRcdFx0b2dnOiBtaW1lVmlkZW8oZWwsJ3ZpZGVvL29nZycpXG5cdFx0fVxuXHR9XG5cblx0LyoqKiBHbG9iYWwgYXR0cmlidXRlcyAqL1xuXG5cdC8qIEEgQm9vbGVhbiBhdHRyaWJ1dGU7IGlmIHNwZWNpZmllZCwgdGhlIHZpZGVvIGF1dG9tYXRpY2FsbHkgYmVnaW5zIHRvIHBsYXkgYmFjayBhcyBzb29uIGFzIGl0IGNhbiBkbyBzbyB3aXRob3V0IHN0b3BwaW5nIHRvIGZpbmlzaCBsb2FkaW5nIHRoZSBkYXRhLiBJZiBub3QgcmV0dXJuIHRoZSBhdW9wbGF5IGF0dHJpYnV0ZS4gKi9cblx0YXV0b3BsYXkodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmF1dG9wbGF5ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuYXV0b3BsYXk7XG5cdH1cblxuXHQvKiBSZXR1cm5zIHRoZSB0aW1lIHJhbmdlcyBvZiB0aGUgYnVmZmVyZWQgbWVkaWEuIFRoaXMgYXR0cmlidXRlIGNvbnRhaW5zIGEgVGltZVJhbmdlcyBvYmplY3QgKi9cblx0YnVmZmVyZWQoKcKgIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5idWZmZXJlZDtcblx0fVxuXG5cdC8qIElmIHRoaXMgYXR0cmlidXRlIGlzIHByZXNlbnQsIHRoZSBicm93c2VyIHdpbGwgb2ZmZXIgY29udHJvbHMgdG8gYWxsb3cgdGhlIHVzZXIgdG8gY29udHJvbCB2aWRlbyBwbGF5YmFjaywgaW5jbHVkaW5nIHZvbHVtZSwgc2Vla2luZywgYW5kIHBhdXNlL3Jlc3VtZSBwbGF5YmFjay4gV2hlbiBub3Qgc2V0IHJldHVybnMgaWYgdGhlIGNvbnRyb2xzIGFyZSBwcmVzZW50ICovXG5cdGNvbnRyb2xzKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5jb250cm9scyA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNvbnRyb2xzO1xuXHR9XG5cblx0LyogYW5vbnltb3VzLCB1c2UtY3JlZGVudGlhbHMsIGZhbHNlICovXG5cdGNyb3Nzb3JpZ2luKHYpIHtcblx0XHRpZiAodiA9PT0gJ3VzZS1jcmVkZW50aWFscycpIHtcblx0XHRcdHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSAndXNlLWNyZWRlbnRpYWxzJztcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRpZiAodikge1xuXHRcdFx0dGhpcy5tZWRpYS5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuXHRcdFx0cmV0dXJuICdhbm9ueW1vdXMnO1xuXHRcdH1cblx0XHRpZiAodiA9PT0gZmFsc2UpIHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSBudWxsO1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNyb3NzT3JpZ2luO1xuXHR9XG5cblx0LyogQSBCb29sZWFuIGF0dHJpYnV0ZTsgaWYgc3BlY2lmaWVkLCB3ZSB3aWxsLCB1cG9uIHJlYWNoaW5nIHRoZSBlbmQgb2YgdGhlIHZpZGVvLCBhdXRvbWF0aWNhbGx5IHNlZWsgYmFjayB0byB0aGUgc3RhcnQuICovXG5cdGxvb3Aodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmxvb3AgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5sb29wO1xuXHR9XG5cblx0LypBIEJvb2xlYW4gYXR0cmlidXRlIHdoaWNoIGluZGljYXRlcyB0aGUgZGVmYXVsdCBzZXR0aW5nIG9mIHRoZSBhdWRpbyBjb250YWluZWQgaW4gdGhlIHZpZGVvLiBJZiBzZXQsIHRoZSBhdWRpbyB3aWxsIGJlIGluaXRpYWxseSBzaWxlbmNlZC4gSXRzIGRlZmF1bHQgdmFsdWUgaXMgZmFsc2UsIG1lYW5pbmcgdGhhdCB0aGUgYXVkaW8gd2lsbCBiZSBwbGF5ZWQgd2hlbiB0aGUgdmlkZW8gaXMgcGxheWVkKi9cblx0bXV0ZWQodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLm11dGVkID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEubXV0ZWQ7XG5cdH1cblxuXHQvKiBNdXRlIHRoZSB2aWRlbyAqL1xuXHRtdXRlKCkge1xuXHRcdHRoaXMubXV0ZWQodHJ1ZSk7XG5cdH1cblxuXHQvKiBVbk11dGUgdGhlIHZpZGVvICovXG5cdHVubXV0ZSgpIHtcblx0XHR0aGlzLm11dGVkKGZhbHNlKTtcblx0fVxuXG5cdC8qIFRvZ2dsZSB0aGUgbXV0ZWQgc3RhbmNlIG9mIHRoZSB2aWRlbyAqL1xuXHR0b2dnbGVNdXRlKCkge1xuXHRcdHJldHVybiB0aGlzLm11dGVkKCF0aGlzLm11dGVkKCkpO1xuXHR9XG5cblx0LyogUmV0dXJucyBBIFRpbWVSYW5nZXMgb2JqZWN0IGluZGljYXRpbmcgYWxsIHRoZSByYW5nZXMgb2YgdGhlIHZpZGVvIHRoYXQgaGF2ZSBiZWVuIHBsYXllZC4qL1xuXHRwbGF5ZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucGxheWVkO1xuXHR9XG5cblx0Lypcblx0VGhpcyBlbnVtZXJhdGVkIGF0dHJpYnV0ZSBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgaGludCB0byB0aGUgYnJvd3NlciBhYm91dCB3aGF0IHRoZSBhdXRob3IgdGhpbmtzIHdpbGwgbGVhZCB0byB0aGUgYmVzdCB1c2VyIGV4cGVyaWVuY2UuIEl0IG1heSBoYXZlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczpcblx0XHRub25lOiBpbmRpY2F0ZXMgdGhhdCB0aGUgdmlkZW8gc2hvdWxkIG5vdCBiZSBwcmVsb2FkZWQuXG5cdFx0bWV0YWRhdGE6IGluZGljYXRlcyB0aGF0IG9ubHkgdmlkZW8gbWV0YWRhdGEgKGUuZy4gbGVuZ3RoKSBpcyBmZXRjaGVkLlxuXHRcdGF1dG86IGluZGljYXRlcyB0aGF0IHRoZSB3aG9sZSB2aWRlbyBmaWxlIGNvdWxkIGJlIGRvd25sb2FkZWQsIGV2ZW4gaWYgdGhlIHVzZXIgaXMgbm90IGV4cGVjdGVkIHRvIHVzZSBpdC5cblx0dGhlIGVtcHR5IHN0cmluZzogc3lub255bSBvZiB0aGUgYXV0byB2YWx1ZS5cblx0Ki9cblx0cHJlbG9hZCh2KSB7XG5cdFx0aWYgKHYgPT09ICdtZXRhZGF0YScgfHwgdiA9PT0gXCJtZXRhXCIpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdtZXRhZGF0YSc7XG5cdFx0XHRyZXR1cm4gJ21ldGFkYXRhJztcblx0XHR9XG5cdFx0aWYgKHYpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdhdXRvJztcblx0XHRcdHJldHVybiAnYXV0byc7XG5cdFx0fVxuXHRcdGlmICh2ID09PSBmYWxzZSkge1xuXHRcdFx0dGhpcy5tZWRpYS5wcmVsb2FkID0gJ25vbmUnO1xuXHRcdFx0cmV0dXJuICdub25lJztcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucHJlbG9hZDtcblx0fVxuXG5cdC8qIEdpdmVzIG9yIHJldHVybnMgdGhlIGFkZHJlc3Mgb2YgYW4gaW1hZ2UgZmlsZSB0aGF0IHRoZSB1c2VyIGFnZW50IGNhbiBzaG93IHdoaWxlIG5vIHZpZGVvIGRhdGEgaXMgYXZhaWxhYmxlLiBUaGUgYXR0cmlidXRlLCBpZiBwcmVzZW50LCBtdXN0IGNvbnRhaW4gYSB2YWxpZCBub24tZW1wdHkgVVJMIHBvdGVudGlhbGx5IHN1cnJvdW5kZWQgYnkgc3BhY2VzICovXG5cdHBvc3Rlcih2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5tZWRpYS5wb3N0ZXIgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wb3N0ZXI7XG5cdH1cblxuXHQvKiBUaGUgc3JjIHByb3BlcnR5IHNldHMgb3IgcmV0dXJucyB0aGUgY3VycmVudCBzb3VyY2Ugb2YgdGhlIGF1ZGlvL3ZpZGVvLCBUaGUgc291cmNlIGlzIHRoZSBhY3R1YWwgbG9jYXRpb24gKFVSTCkgb2YgdGhlIGF1ZGlvL3ZpZGVvIGZpbGUgKi9cblx0c3JjKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRfY2FuY2VsUmVxdWVzdHModGhpcy5tZWRpYSk7XG5cdFx0XHRpZih2IGluc3RhbmNlb2YgQXJyYXkpe1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwLCBuID0gdi5sZW5ndGg7IGkrPTE7KXtcblx0XHRcdFx0XHRpZih2W2ldWyd0eXBlJ10gPT09IFwidmlkZW8vbXA0XCIgJiYgdGhpcy5jYW5QbGF5Lm1wNCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL3dlYm1cIiAmJiB0aGlzLmNhblBsYXkud2VibSl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL29nZ1wiICYmIHRoaXMuY2FuUGxheS5vZ2cpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZSBpZih2LnNyYyAmJiB2LnR5cGUpe1xuXHRcdFx0XHR0aGlzLm1lZGlhLnNyYyA9IHYuc3JjO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHRoaXMubWVkaWEuc3JjID0gdjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50U3JjO1xuXHR9XG5cblx0LyoqKiBHbG9iYWwgRXZlbnRzICovXG5cblx0LyogU3RhcnRzIHBsYXlpbmcgdGhlIGF1ZGlvL3ZpZGVvICovXG5cdHBsYXkoKSB7XG5cdFx0dGhpcy5tZWRpYS5wbGF5KCk7XG5cdH1cblxuXHQvKiBQYXVzZXMgdGhlIGN1cnJlbnRseSBwbGF5aW5nIGF1ZGlvL3ZpZGVvICovXG5cdHBhdXNlKCkge1xuXHRcdHRoaXMubWVkaWEucGF1c2UoKTtcblx0fVxuXG5cdC8qIFRvZ2dsZSBwbGF5L3BhdXNlIGZvciB0aGUgYXVkaW8vdmlkZW8gKi9cblx0dG9nZ2xlUGxheSgpIHtcblx0XHR0aGlzLm1lZGlhLnBhdXNlZCA/IHRoaXMucGxheSgpIDogdGhpcy5wYXVzZSgpO1xuXHR9XG5cblx0Y3VycmVudFRpbWUodikge1xuXHRcdGlmICh2ID09PSBudWxsIHx8IGlzTmFOKHYpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50VGltZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiB0aGlzLm1lZGlhLmR1cmF0aW9uKSB7XG5cdFx0XHR2ID0gdGhpcy5tZWRpYS5kdXJhdGlvbjtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS5jdXJyZW50VGltZSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH1cblxuXHRzZWVrKHYpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50VGltZSh2KTtcblx0fVxuXG5cblx0LyoqXG5cdCAqIFtSZS1sb2FkcyB0aGUgYXVkaW8vdmlkZW8gZWxlbWVudCwgdXBkYXRlIHRoZSBhdWRpby92aWRlbyBlbGVtZW50IGFmdGVyIGNoYW5naW5nIHRoZSBzb3VyY2Ugb3Igb3RoZXIgc2V0dGluZ3NdXG5cdCAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0bG9hZCh2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5zcmModik7XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEubG9hZCgpO1xuXHR9XG5cblx0ZHVyYXRpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuZHVyYXRpb247XG5cdH1cblxuXHR2b2x1bWUodikge1xuXHRcdC8vIFJldHVybiBjdXJyZW50IHZvbHVtZSBpZiB2YWx1ZSBcblx0XHRpZiAodiA9PT0gbnVsbCB8fCBpc05hTih2KSkge1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudm9sdW1lO1xuXHRcdH1cblx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRpZiAodiA+IDEpIHtcblx0XHRcdHYgPSAxO1xuXHRcdH1cblx0XHRpZiAodiA8IDApIHtcblx0XHRcdHYgPSAwO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhLnZvbHVtZSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH1cbn0iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKXtcblx0bGV0IHNjYWxlID0gMDtcblx0bGV0IGJvdW5kcyA9IGZ1bmN0aW9uKGVsLCB1cGRhdGVTY2FsZSkge1xuXHRcdGlmKCB1cGRhdGVTY2FsZSAhPT0gdW5kZWZpbmVkKSBzY2FsZSA9IHVwZGF0ZVNjYWxlO1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0d3JhcHBlcldpZHRoOiBlbC5vZmZzZXRXaWR0aCxcblx0XHRcdHdyYXBwZXJIZWlnaHQ6IGVsLm9mZnNldEhlaWdodCxcblx0XHRcdHNjYWxlOiBzY2FsZSB8fCAoZWwud2lkdGgvZWwuaGVpZ2h0KSxcblx0XHRcdHdpZHRoOiAwLFxuXHRcdFx0aGVpZ2h0OiAwLFxuXHRcdFx0b2Zmc2V0WDogMCxcblx0XHRcdG9mZnNldFk6IDBcblx0XHR9XG5cdFx0ZGF0YVsnd3JhcHBlclNjYWxlJ10gPSBkYXRhLndyYXBwZXJXaWR0aCAvIGRhdGEud3JhcHBlckhlaWdodDtcblx0XHRpZiAoZGF0YS53cmFwcGVyU2NhbGUgPiBkYXRhLnNjYWxlKSB7XG5cdFx0XHRkYXRhLmhlaWdodCA9IGRhdGEud3JhcHBlckhlaWdodDtcblx0XHRcdGRhdGEud2lkdGggPSBkYXRhLnNjYWxlICogZGF0YS5oZWlnaHQ7XG5cdFx0XHRkYXRhLm9mZnNldFggPSAoZGF0YS53cmFwcGVyV2lkdGggLSBkYXRhLndpZHRoKSAvIDI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRhdGEud2lkdGggPSBkYXRhLndyYXBwZXJXaWR0aDtcblx0XHRcdGRhdGEuaGVpZ2h0ID0gZGF0YS53aWR0aCAvIGRhdGEuc2NhbGU7XG5cdFx0XHRkYXRhLm9mZnNldFkgPSAoZGF0YS53cmFwcGVySGVpZ2h0IC0gZGF0YS5oZWlnaHQpIC8gMjtcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblx0cmV0dXJuIGJvdW5kcztcbn0pKCk7IiwidmFyIF9kb2MgPSBkb2N1bWVudCB8fCB7fTtcbi8vIFNldCB0aGUgbmFtZSBvZiB0aGUgaGlkZGVuIHByb3BlcnR5IGFuZCB0aGUgY2hhbmdlIGV2ZW50IGZvciB2aXNpYmlsaXR5XG52YXIgaGlkZGVuLCB2aXNpYmlsaXR5Q2hhbmdlO1xuaWYgKHR5cGVvZiBfZG9jLmhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyBPcGVyYSAxMi4xMCBhbmQgRmlyZWZveCAxOCBhbmQgbGF0ZXIgc3VwcG9ydCBcblx0aGlkZGVuID0gXCJoaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwidmlzaWJpbGl0eWNoYW5nZVwiO1xufSBlbHNlIGlmICh0eXBlb2YgX2RvYy5tb3pIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aGlkZGVuID0gXCJtb3pIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwibW96dmlzaWJpbGl0eWNoYW5nZVwiO1xufSBlbHNlIGlmICh0eXBlb2YgX2RvYy5tc0hpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIm1zSGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1zdmlzaWJpbGl0eWNoYW5nZVwiO1xufSBlbHNlIGlmICh0eXBlb2YgX2RvYy53ZWJraXRIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aGlkZGVuID0gXCJ3ZWJraXRIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiO1xufVxuXG5jb25zdCBpc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gISh0eXBlb2YgX2RvY1toaWRkZW5dID09PSBcInVuZGVmaW5lZFwiKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFnZVZpc2liaWxpdHkoX21lZGlhLCBzZXR0aW5ncyA9IHt9KSB7XG5cdGxldCBfYXZhaWxhYmxlID0gaXNBdmFpbGFibGUoKTtcblx0aWYgKF9hdmFpbGFibGUpIHtcblx0XHRsZXQgX2VuYWJsZWQgPSBmYWxzZTtcblx0XHRsZXQgX3BsYXlpbmcgPSBmYWxzZTtcblx0XHRsZXQgcGF1c2VkID0gZmFsc2U7XG5cdFx0bGV0IHNldEZsYWdQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRfcGxheWluZyA9IHRydWU7XG5cdFx0fTtcblx0XHRsZXQgZXZlbnRzID0ge1xuXHRcdFx0dmlzaWJsZTogZnVuY3Rpb24oKXt9LFxuXHRcdFx0aGlkZGVuOiBmdW5jdGlvbigpe31cblx0XHR9O1xuXHRcdGxldCBkZXN0cm95VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZXZlbnRzID0ge1xuXHRcdFx0XHR2aXNpYmxlOiBmdW5jdGlvbigpe30sXG5cdFx0XHRcdGhpZGRlbjogZnVuY3Rpb24oKXt9XG5cdFx0XHR9O1xuXHRcdFx0X2VuYWJsZWQgPSBmYWxzZTtcblx0XHRcdF9wbGF5aW5nID0gZmFsc2U7XG5cdFx0XHRfZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdFx0X21lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cdFx0fVxuXHRcdGxldCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoX2VuYWJsZWQpIHtcblx0XHRcdFx0aWYgKF9kb2NbaGlkZGVuXSkge1xuXHRcdFx0XHRcdGlmIChfcGxheWluZyAmJiAhX21lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0X21lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudHMuaGlkZGVuKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHBhdXNlZCAmJiBfbWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRfbWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50cy52aXNpYmxlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0bGV0IGluaXRWaXNpYmlsaXR5ID0gZnVuY3Rpb24gaW5pdFZpc2liaWxpdHkoc2V0dGluZ3MpIHtcblx0XHRcdGlmIChfYXZhaWxhYmxlKSB7XG5cdFx0XHRcdF9kb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRcdF9tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdFx0XHRcblx0XHRcdFx0ZXZlbnRzLnZpc2libGUgPSBzZXR0aW5ncy5vblZpc2libGUgfHwgZXZlbnRzLnZpc2libGU7XG5cdFx0XHRcdGV2ZW50cy5oaWRkZW4gPSBzZXR0aW5ncy5vbkhpZGRlbiB8fCBldmVudHMuaGlkZGVuO1xuXHRcdFx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdF9kb2MuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRcdF9tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRldmVudHMudmlzaWJsZSA9IHNldHRpbmdzLm9uVmlzaWJsZSB8fCBldmVudHMudmlzaWJsZTtcblx0XHRldmVudHMuaGlkZGVuID0gc2V0dGluZ3Mub25IaWRkZW4gfHwgZXZlbnRzLmhpZGRlbjtcblx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0X2RvYy5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRfbWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblxuXHRcdHRoaXMuaW5pdCA9IGluaXRWaXNpYmlsaXR5O1xuXHRcdHRoaXMuZGVzdHJveSA9IGRlc3Ryb3lWaXNpYmlsaXR5O1xuXHRcdHRoaXMub24gPSBmdW5jdGlvbihldmVudCxmbikge1xuXHRcdFx0aWYgKGV2ZW50IGluIGV2ZW50cykgZXZlbnRzW2V2ZW50XSA9IGZuO1xuXHRcdH07XG5cdFx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24odikge1xuXHRcdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIF9lbmFibGVkID0gdjtcblx0XHRcdHJldHVybiBfZW5hYmxlZDtcblx0XHR9XG5cdH07XG59OyIsImxldCBfZG9jID0gZG9jdW1lbnQgfHwge307XG5sZXQgZXh0ZXJuYWxDb250cm9scyA9IGZ1bmN0aW9uKGVsKSB7XG5cdGxldCBfZW5hYmxlZCA9IHRydWU7XG5cdGxldCBfc2VlayA9IHRydWU7XG5cdGxldCBfdElkID0gbnVsbDtcblx0bGV0IG1lZGlhID0gZWw7XG5cdGxldCBrZXlkb3duID0gZnVuY3Rpb24oZSkge1xuXHRcdGlmIChfZW5hYmxlZCkge1xuXHRcdFx0Ly9ieXBhc3MgZGVmYXVsdCBuYXRpdmUgZXh0ZXJuYWwgY29udHJvbHMgd2hlbiBtZWRpYSBpcyBmb2N1c2VkXG5cdFx0XHRtZWRpYS5wYXJlbnROb2RlLmZvY3VzKCk7XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDMyKSB7IC8vc3BhY2Vcblx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoX3NlZWspIHtcblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzNykgeyAvL2xlZnRcblx0XHRcdFx0XHRtZWRpYS5jdXJyZW50VGltZSA9IG1lZGlhLmN1cnJlbnRUaW1lIC0gNTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOSkgeyAvL3JpZ2h0XG5cdFx0XHRcdFx0bWVkaWEuY3VycmVudFRpbWUgPSBtZWRpYS5jdXJyZW50VGltZSArIDU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDM4KSB7IC8vdXBcblx0XHRcdFx0bGV0IHYgPSBtZWRpYS52b2x1bWU7XG5cdFx0XHRcdHYgKz0gLjE7XG5cdFx0XHRcdGlmICh2ID4gMSkgdiA9IDE7XG5cdFx0XHRcdG1lZGlhLnZvbHVtZSA9IHY7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCkgeyAvL2Rvd25cblx0XHRcdFx0bGV0IHYgPSBtZWRpYS52b2x1bWU7XG5cdFx0XHRcdHYgLT0gLjE7XG5cdFx0XHRcdGlmICh2IDwgMCkgdiA9IDA7XG5cdFx0XHRcdG1lZGlhLnZvbHVtZSA9IHY7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8qaWYgKHNlbGYuY29udHJvbEJhcikge1xuXHRcdFx0XHRpZiAoc2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24pIHtcblx0XHRcdFx0XHRpZiAoZS5rZXlDb2RlID09IDQwIHx8IGUua2V5Q29kZSA9PSAzOCkge1xuXG5cdFx0XHRcdFx0XHRzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbi5tZW51Q29udGVudC5lbF8uY2xhc3NOYW1lID0gXCJ2anMtbWVudSBzaG93XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9Ki9cblx0XHR9XG5cdH07XG5cblx0Ly8gdGhpcy5vblNwYWNlID0gZnVuY3Rpb24oKSB7XG5cblx0Ly8gfTtcblxuXHRsZXQga2V5dXAgPSBmdW5jdGlvbihlKSB7XG5cdFx0aWYgKF9lbmFibGVkKSB7XHRcdFx0XG5cdFx0XHQvLyBpZiAoZS5rZXlDb2RlID09IDQwIHx8IGUua2V5Q29kZSA9PSAzOCkge1xuXHRcdFx0Ly8gXHRjbGVhckludGVydmFsKF90SWQpO1xuXHRcdFx0Ly8gXHRpZiAoc2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24pIHtcblx0XHRcdC8vIFx0XHRfdElkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdC8vIFx0XHRcdHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uLm1lbnVDb250ZW50LmVsXy5jbGFzc05hbWUgPSBcInZqcy1tZW51XCI7XG5cdFx0XHQvLyBcdFx0fSwgNTAwKTtcblx0XHRcdC8vIFx0fVxuXHRcdFx0Ly8gfVxuXHRcdH1cblx0fTtcblx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24oYikge1xuXHRcdGlmIChiID09PSB1bmRlZmluZWQpIHJldHVybiBfZW5hYmxlZDtcblx0XHRfZW5hYmxlZCA9IGI7XG5cblx0fTtcblx0dGhpcy5zZWVrRW5hYmxlZCA9IGZ1bmN0aW9uKGIpIHtcblx0XHRpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gX3NlZWs7XG5cdFx0X3NlZWsgPSBiO1xuXHR9O1xuXHR0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0X3RJZCA9IG51bGw7XG5cdFx0X3NlZWsgPSB0cnVlO1xuXHRcdF9kb2MuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bi5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdFx0X2RvYy5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXAuYmluZCh0aGlzKSwgZmFsc2UpO1xuXHR9O1xuXHR0aGlzLmRlc3Ryb3kgPSAgZnVuY3Rpb24oKSB7XG5cdFx0X2VuYWJsZWQgPSBmYWxzZTtcblx0XHRfdElkID0gbnVsbDtcblx0XHRfc2VlayA9IHRydWU7XG5cdFx0X2RvYy5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duKTtcblx0XHRfZG9jLmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cCk7XG5cdH1cblx0dGhpcy5pbml0KCk7XG59XG5leHBvcnQgZGVmYXVsdCBleHRlcm5hbENvbnRyb2xzOyIsIi8vaHR0cHM6Ly9naXRodWIuY29tL2ZkYWNpdWsvYWpheFxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIGFqYXgob3B0aW9ucykge1xuICAgIHZhciBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJ11cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIG9wdGlvbnMuYmFzZVVybCA9IG9wdGlvbnMuYmFzZVVybCB8fCAnJ1xuICAgIGlmIChvcHRpb25zLm1ldGhvZCAmJiBvcHRpb25zLnVybCkge1xuICAgICAgcmV0dXJuIHhockNvbm5lY3Rpb24oXG4gICAgICAgIG9wdGlvbnMubWV0aG9kLFxuICAgICAgICBvcHRpb25zLmJhc2VVcmwgKyBvcHRpb25zLnVybCxcbiAgICAgICAgbWF5YmVEYXRhKG9wdGlvbnMuZGF0YSksXG4gICAgICAgIG9wdGlvbnNcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKGFjYywgbWV0aG9kKSB7XG4gICAgICBhY2NbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSkge1xuICAgICAgICByZXR1cm4geGhyQ29ubmVjdGlvbihcbiAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgb3B0aW9ucy5iYXNlVXJsICsgdXJsLFxuICAgICAgICAgIG1heWJlRGF0YShkYXRhKSxcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCB7fSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG1heWJlRGF0YShkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEgfHwgbnVsbFxuICB9XG5cbiAgZnVuY3Rpb24geGhyQ29ubmVjdGlvbih0eXBlLCB1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICB2YXIgcmV0dXJuTWV0aG9kcyA9IFsndGhlbicsICdjYXRjaCcsICdhbHdheXMnXVxuICAgIHZhciBwcm9taXNlTWV0aG9kcyA9IHJldHVybk1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKHByb21pc2UsIG1ldGhvZCkge1xuICAgICAgcHJvbWlzZVttZXRob2RdID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgcHJvbWlzZVttZXRob2RdID0gY2FsbGJhY2tcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfSwge30pXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgeGhyLm9wZW4odHlwZSwgdXJsLCB0cnVlKVxuICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLmhhc093blByb3BlcnR5KCd3aXRoQ3JlZGVudGlhbHMnKVxuICAgIHNldEhlYWRlcnMoeGhyLCBvcHRpb25zLmhlYWRlcnMpXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCByZWFkeShwcm9taXNlTWV0aG9kcywgeGhyKSwgZmFsc2UpXG4gICAgeGhyLnNlbmQob2JqZWN0VG9RdWVyeVN0cmluZyhkYXRhKSlcbiAgICBwcm9taXNlTWV0aG9kcy5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHhoci5hYm9ydCgpXG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlTWV0aG9kc1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SGVhZGVycyh4aHIsIGhlYWRlcnMpIHtcbiAgICBoZWFkZXJzID0gaGVhZGVycyB8fCB7fVxuICAgIGlmICghaGFzQ29udGVudFR5cGUoaGVhZGVycykpIHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICB9XG4gICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAoaGVhZGVyc1tuYW1lXSAmJiB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCBoZWFkZXJzW25hbWVdKSlcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gaGFzQ29udGVudFR5cGUoaGVhZGVycykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhoZWFkZXJzKS5zb21lKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWR5KHByb21pc2VNZXRob2RzLCB4aHIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlUmVhZHkoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IHhoci5ET05FKSB7XG4gICAgICAgIHhoci5yZW1vdmVFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgaGFuZGxlUmVhZHksIGZhbHNlKVxuICAgICAgICBwcm9taXNlTWV0aG9kcy5hbHdheXMuYXBwbHkocHJvbWlzZU1ldGhvZHMsIHBhcnNlUmVzcG9uc2UoeGhyKSlcblxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgIHByb21pc2VNZXRob2RzLnRoZW4uYXBwbHkocHJvbWlzZU1ldGhvZHMsIHBhcnNlUmVzcG9uc2UoeGhyKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlTWV0aG9kcy5jYXRjaC5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VSZXNwb25zZSh4aHIpIHtcbiAgICB2YXIgcmVzdWx0XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSB4aHIucmVzcG9uc2VUZXh0XG4gICAgfVxuICAgIHJldHVybiBbcmVzdWx0LCB4aHJdXG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RUb1F1ZXJ5U3RyaW5nKGRhdGEpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoZGF0YSkgPyBnZXRRdWVyeVN0cmluZyhkYXRhKSA6IGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KGRhdGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGEpID09PSAnW29iamVjdCBPYmplY3RdJ1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmcob2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCkucmVkdWNlKGZ1bmN0aW9uKGFjYywgaXRlbSkge1xuICAgICAgdmFyIHByZWZpeCA9ICFhY2MgPyAnJyA6IGFjYyArICcmJ1xuICAgICAgcmV0dXJuIHByZWZpeCArIGVuY29kZShpdGVtKSArICc9JyArIGVuY29kZShvYmplY3RbaXRlbV0pXG4gICAgfSwgJycpXG4gIH1cblxuICBmdW5jdGlvbiBlbmNvZGUodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKVxuICB9XG5cbiAgcmV0dXJuIGFqYXhcbn0pKCk7IiwiaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuL2hlbHBlcnMvZGVlcG1lcmdlJztcbmltcG9ydCB7IGNhcGl0YWxpemVGaXJzdExldHRlciwgc2NhbGVGb250LCBkZWJvdW5jZSB9IGZyb20gJy4vaGVscGVycy91dGlscyc7XG5pbXBvcnQgZG9tIGZyb20gJy4vaGVscGVycy9kb20nO1xuaW1wb3J0IGF1dG9Gb250IGZyb20gJy4vY29yZS9hdXRvRm9udCc7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vY29yZS9jb250YWluZXIvY29udGFpbmVyJztcbmltcG9ydCBNZWRpYSBmcm9tICcuL2NvcmUvbWVkaWEvaW5kZXgnO1xuaW1wb3J0IGNvbnRhaW5lckJvdW5kcyBmcm9tICcuL2hlbHBlcnMvY29udGFpbmVyQm91bmRzJztcbmltcG9ydCBwYWdlVmlzaWJpbGl0eSBmcm9tICcuL2hlbHBlcnMvcGFnZVZpc2liaWxpdHknO1xuaW1wb3J0IGV4dGVybmFsQ29udHJvbHMgZnJvbSAnLi9jb3JlL21lZGlhL2V2ZW50cy9leHRlcm5hbENvbnRyb2xzJztcbmltcG9ydCBhamF4IGZyb20gJy4vaGVscGVycy9hamF4JztcblxuY29uc3QgZm5fY29udGV4dG1lbnUgPSBmdW5jdGlvbihlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0cmV0dXJuIGZhbHNlO1xufVxuXG5jb25zdCBkZWZhdWx0cyA9IHtcblx0ZGVmYXVsdFdpZHRoOiA5MjAsXG5cdGRlZmF1bHRIZWlnaHQ6IDUyMCxcblx0YXV0b3BsYXk6IGZhbHNlLFxuXHRsb29wOiBmYWxzZSxcblx0Y29udHJvbHM6IGZhbHNlLFxuXHRmb250OiB7XG5cdFx0cmF0aW86IDEsXG5cdFx0bWluOiAuNSxcblx0XHR1bml0czogXCJlbVwiXG5cdH1cbn07XG5cbmNsYXNzIGttbFBsYXllciBleHRlbmRzIE1lZGlhIHtcblx0Y29uc3RydWN0b3IoZWwsIHNldHRpbmdzLCBfZXZlbnRzLCBhcHApIHtcblx0XHRzdXBlcihlbCk7XG5cdFx0dGhpcy5fX3NldHRpbmdzID0gZGVlcG1lcmdlKGRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cdFx0ZG9tLmNsYXNzLmFkZChlbCwgXCJrbWxcIiArIGNhcGl0YWxpemVGaXJzdExldHRlcihlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSk7XG5cdFx0dGhpcy53cmFwcGVyID0gZG9tLndyYXAodGhpcy5tZWRpYSwgZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdGNsYXNzOiAna21sUGxheWVyJ1xuXHRcdH0pKTtcblx0XHRkb20udHJpZ2dlcldlYmtpdEhhcmR3YXJlQWNjZWxlcmF0aW9uKHRoaXMud3JhcHBlcik7XG5cblx0XHQvL2luaXRTZXR0aW5nc1xuXHRcdGZvcih2YXIgayBpbiB0aGlzLl9fc2V0dGluZ3Mpe1xuXHRcdFx0aWYodGhpc1trXSl7XG5cdFx0XHRcdHRoaXNba10odGhpcy5fX3NldHRpbmdzW2tdKTtcblx0XHRcdFx0aWYoaz09PSdhdXRvcGxheScgJiYgdGhpcy5fX3NldHRpbmdzW2tdKSB0aGlzLnBsYXkoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL2luaXRQYWdlVmlzaWJpbGl0eVxuXHRcdHRoaXMucGFnZVZpc2liaWxpdHkgPSBuZXcgcGFnZVZpc2liaWxpdHkoZWwpO1xuXG5cdFx0Ly9pbml0ZXh0ZXJuYWxDb250cm9sc1xuXHRcdHRoaXMuZXh0ZXJuYWxDb250cm9scyA9IG5ldyBleHRlcm5hbENvbnRyb2xzKGVsKTtcblxuXHRcdC8vaW5pdENvbnRhaW5lcnNcblx0XHR0aGlzLmNvbnRhaW5lcnMgPSBuZXcgQ29udGFpbmVyKHRoaXMpO1xuXG5cdFx0Ly9hdXRvRk9OVFxuXHRcdGxldCBfd2lkdGggPSAoKT0+eyByZXR1cm4gdGhpcy53aWR0aCgpIH07XG5cdFx0aWYodHlwZW9mIHRoaXMuX19zZXR0aW5ncy5mb250ID09PSBcImJvb2xlYW5cIiAmJiB0aGlzLl9fc2V0dGluZ3MuZm9udCkgdGhpcy5fX3NldHRpbmdzLmZvbnQgPSBkZWZhdWx0cy5mb250O1xuXHRcdHRoaXMuYXV0b0ZvbnQgPSBuZXcgYXV0b0ZvbnQodGhpcy53cmFwcGVyLCBfd2lkdGgsIHRoaXMuX19zZXR0aW5ncy5mb250LCB0aGlzKTtcblx0XHRpZih0aGlzLl9fc2V0dGluZ3MuZm9udCkgdGhpcy5hdXRvRm9udC5lbmFibGVkKHRydWUpO1xuXG5cdFx0Ly9pbml0Q2FsbGJhY2tFdmVudHNcblx0XHRmb3IgKHZhciBldnQgaW4gX2V2ZW50cykge1xuXHRcdFx0dGhpcy5vbihldnQsIF9ldmVudHNbZXZ0XSwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5vbignbG9hZGVkbWV0YWRhdGEnLCAoKT0+e1xuXHRcdFx0aWYodGhpcy5tZWRpYS53aWR0aCAhPSB0aGlzLm1lZGlhLnZpZGVvV2lkdGggfHwgdGhpcy5tZWRpYS5oZWlnaHQgIT0gdGhpcy5tZWRpYS52aWRlb0hlaWdodCl7XG5cdFx0XHRcdHRoaXMuZGVmYXVsdFdpZHRoKCk7XG5cdFx0XHRcdHRoaXMuZGVmYXVsdEhlaWdodCgpO1xuXHRcdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpPT57IHRoaXMuZW1pdCgncmVzaXplJyk7IH0sIGZhbHNlKTtcblxuXHRcdGlmKHR5cGVvZiBhcHAgPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0YXBwLmJpbmQodGhpcykoKTtcblx0XHR9XG5cdH1cblxuXHRjb250ZXh0TWVudSh2KXtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0diA/IHRoaXMubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmbl9jb250ZXh0bWVudSkgOiB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUpO1xuXHRcdH1cblx0fVxuXG5cdGFqYXgob3B0aW9ucykge1xuXHRcdHJldHVybiBhamF4KG9wdGlvbnMpO1xuXHR9XG5cblx0ZGVmYXVsdFdpZHRoKHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb1dpZHRoKSB7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdGhpcy5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEud2lkdGg7XG5cdH1cblxuXHRkZWZhdWx0SGVpZ2h0KHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb0hlaWdodCkge1xuXHRcdFx0dGhpcy5tZWRpYS5oZWlnaHQgPSB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9IZWlnaHQ7XG5cdFx0fVxuXHRcdGlmICghaXNOYU4odikpIHtcblx0XHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdFx0dGhpcy5tZWRpYS5oZWlnaHQgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5oZWlnaHQ7XG5cdH1cblxuXHRzY2FsZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5kZWZhdWx0V2lkdGgoKSAvIHRoaXMuZGVmYXVsdEhlaWdodCgpO1xuXHR9XG5cblx0Ym91bmRzKHYpIHtcblx0XHRsZXQgZGF0YSA9IGNvbnRhaW5lckJvdW5kcyh0aGlzLm1lZGlhKTtcblx0XHRpZiAoZGF0YVt2XSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZGF0YVt2XTtcblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG5cdHdpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnd2lkdGgnKTtcblx0fVxuXG5cdGhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ2hlaWdodCcpO1xuXHR9XG5cblx0b2Zmc2V0WCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ29mZnNldFgnKTtcblx0fVxuXG5cdG9mZnNldFkoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRZJyk7XG5cdH1cblxuXHR3cmFwcGVySGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdHdyYXBwZXJXaWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRXaWR0aDtcblx0fVxuXG5cdHdyYXBwZXJTY2FsZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRXaWR0aCAvIHRoaXMubWVkaWEub2Zmc2V0SGVpZ2h0O1xuXHR9XG5cblx0YWRkQ2xhc3ModiwgZWwpIHtcblx0XHRpZihlbCAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdGRvbS5jbGFzcy5hZGQoZWwsIHYpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRkb20uY2xhc3MuYWRkKHRoaXMud3JhcHBlciwgdik7XG5cdH1cblx0cmVtb3ZlQ2xhc3ModiwgZWwpIHtcblx0XHRpZihlbCAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdGRvbS5jbGFzcy5yZW1vdmUoZWwsIHYpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodiAhPT0gJ2ttbFBsYXllcicpIHtcblx0XHRcdGRvbS5jbGFzcy5yZW1vdmUodGhpcy53cmFwcGVyLCB2KTtcblx0XHR9XG5cdH1cblx0dG9nZ2xlQ2xhc3ModiwgZWwpIHtcblx0XHRpZihlbCAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdGRvbS5jbGFzcy50b2dnbGUoZWwsIHYpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodiAhPT0gJ2ttbFBsYXllcicpIHtcblx0XHRcdGRvbS5jbGFzcy50b2dnbGUodGhpcy53cmFwcGVyLCB2KTtcblx0XHR9XG5cdH1cbn07XG5cbndpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obWVzc2FnZSwgc2NyaXB0VXJsLCBsaW5lLCBjb2x1bW4pIHtcbiAgICBjb25zb2xlLmxvZyhsaW5lLCBjb2x1bW4sIG1lc3NhZ2UpO1xuICAgIGFsZXJ0KGxpbmUgKyBcIjpcIiArY29sdW1uICtcIi1cIisgbWVzc2FnZSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBrbWxQbGF5ZXI7Il0sIm5hbWVzIjpbImJhYmVsSGVscGVycy50eXBlb2YiLCJkZWZhdWx0cyIsIkV2ZW50cyIsIl9kb2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQkFBZSxDQUFDLFlBQVU7QUFDekIsSUFBQSxLQUFJLFlBQVksU0FBWixTQUFZLENBQVMsTUFBVCxFQUFpQixHQUFqQixFQUFzQjtBQUNyQyxJQUFBLE1BQUcsR0FBSCxFQUFPO0FBQ0gsSUFBQSxPQUFJLFFBQVEsTUFBTSxPQUFOLENBQWMsR0FBZCxDQUFaO0FBQ0EsSUFBQSxPQUFJLE1BQU0sU0FBUyxFQUFULElBQWUsRUFBekI7O0FBRUEsSUFBQSxPQUFJLEtBQUosRUFBVztBQUNQLElBQUEsYUFBUyxVQUFVLEVBQW5CO0FBQ0EsSUFBQSxVQUFNLElBQUksTUFBSixDQUFXLE1BQVgsQ0FBTjtB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