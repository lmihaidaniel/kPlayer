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

    var autoFont = function autoFont(el, font, parent) {
    	var _enabled = false;
    	var _update = function _update() {
    		debounce(function () {
    			scaleFont(font, parent.width(), el);
    		}, 100)();
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

    var adaptiveSizePos = function adaptiveSizePos(bounds, setttings, parent) {
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

    var defaults$3 = {
    	x: 0,
    	y: 0,
    	width: 0,
    	height: 0
    };
    var relativeSizePos = function relativeSizePos(ctx, settings) {
    	var parentWidth = ctx.defaultWidth() || ctx.width || 0;
    	var parentHeight = ctx.defaultHeight() || ctx.height || 0;
    	var o = deepmerge(defaults$3, settings);
    	var _w = procentFromString(o.width);
    	if (!_w) _w = o.width / parentWidth * 100;
    	var _h = procentFromString(o.height);
    	if (!_h) _h = o.height / parentHeight * 100;
    	var _x = procentFromString(o.x);
    	if (!_x) _x = o.x / parentWidth * 100;
    	var _y = procentFromString(o.y);
    	if (!_y) _y = o.y / parentHeight * 100;
    	return {
    		x: _x,
    		y: _y,
    		width: _w,
    		height: _h
    	};
    };

    var Container = function Container(ctx) {
    	classCallCheck(this, Container);

    	this.el = dom.createElement('div', {
    		style: 'position:absolute; pointer-events: none;'
    	});
    	var ac = new adaptiveSizePos(function () {
    		return {
    			offsetX: ctx.offsetX(),
    			offsetY: ctx.offsetY(),
    			width: ctx.width(),
    			height: ctx.height(),
    			scale: ctx.width() / ctx.defaultWidth(),
    			scaleY: ctx.width() / ctx.defaultHeight()
    		};
    	}, {}, ctx);
    	ac.applyTo(this.el);
    	ac.enabled(true);

    	ctx.wrapper.appendChild(this.el);

    	this.add = function (opts) {
    		var el = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    		if (!el.nodeType) el = dom.createElement('div');
    		dom.addClass(el, 'kmlContainer');
    		el.style.position = "absolute";
    		el.style.pointerEvents = "all";
    		var elDimension = function elDimension() {
    			var d = new relativeSizePos(ctx, opts);
    			el.style.width = d.width + "%";
    			el.style.height = d.height + "%";
    			if (dom.stylePrefix.transform) {
    				dom.transform(el, 'translate(' + 100 / d.width * d.x + '%,' + 100 / d.height * d.y + '%)');
    			} else {
    				el.style.top = d.x + "%";
    				el.style.left = d.y + "%";
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
    		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
    		_this.wrapper = dom.wrap(_this.media, dom.createElement('div', {
    			class: 'kmlPlayer'
    		}));
    		dom.triggerWebkitHardwareAcceleration(_this.wrapper);

    		//initSettings
    		for (var k in _this.__settings) {
    			if (_this[k]) {
    				if (k === 'autoplay' && _this.__settings[k]) {
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
    		_this.containers = new Container(_this);

    		//autoFONT
    		if (typeof _this.__settings.font === "boolean" && _this.__settings.font) _this.__settings.font = defaults.font;
    		_this.autoFont = new autoFont(_this.wrapper, _this.__settings.font, _this);
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
    			dom.addClass(el, v);
    			return;
    		}
    		dom.addClass(this.wrapper, v);
    	};

    	kmlPlayer.prototype.removeClass = function removeClass(v, el) {
    		if (el !== undefined) {
    			dom.removeClass(el, v);
    			return;
    		}
    		if (v !== 'kmlPlayer') {
    			dom.removeClass(this.wrapper, v);
    		}
    	};

    	kmlPlayer.prototype.toggleClass = function toggleClass(v, el) {
    		if (el !== undefined) {
    			dom.toggleClass(el, v);
    			return;
    		}
    		if (v !== 'kmlPlayer') {
    			dom.toggleClass(this.wrapper, v);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzL2RlZXBtZXJnZS5qcyIsIi4uL3NyYy9oZWxwZXJzL3V0aWxzLmpzIiwiLi4vc3JjL2hlbHBlcnMvZG9tLmpzIiwiLi4vc3JjL2NvcmUvYXV0b0ZvbnQuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvYWRhcHRpdmVTaXplUG9zLmpzIiwiLi4vc3JjL2NvcmUvY29udGFpbmVyL3JlbGF0aXZlU2l6ZVBvcy5qcyIsIi4uL3NyYy9jb3JlL2NvbnRhaW5lci9jb250YWluZXIuanMiLCIuLi9zcmMvY29yZS9tZWRpYS9ldmVudHMvaW5kZXguanMiLCIuLi9zcmMvaGVscGVycy9zY3JvbGxQb3NpdGlvbi5qcyIsIi4uL3NyYy9jb3JlL2Z1bGxzY3JlZW4uanMiLCIuLi9zcmMvaGVscGVycy9jYW5jZWxWaWRlb05ldHdvcmtSZXF1ZXN0LmpzIiwiLi4vc3JjL2hlbHBlcnMvbWltZVR5cGUuanMiLCIuLi9zcmMvY29yZS9tZWRpYS9pbmRleC5qcyIsIi4uL3NyYy9oZWxwZXJzL2NvbnRhaW5lckJvdW5kcy5qcyIsIi4uL3NyYy9oZWxwZXJzL3BhZ2VWaXNpYmlsaXR5LmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvZXZlbnRzL2V4dGVybmFsQ29udHJvbHMuanMiLCIuLi9zcmMvaGVscGVycy9hamF4LmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpe1xuXHRsZXQgZGVlcG1lcmdlID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpIHtcblx0XHRpZihzcmMpe1xuXHRcdCAgICB2YXIgYXJyYXkgPSBBcnJheS5pc0FycmF5KHNyYyk7XG5cdFx0ICAgIHZhciBkc3QgPSBhcnJheSAmJiBbXSB8fCB7fTtcblxuXHRcdCAgICBpZiAoYXJyYXkpIHtcblx0XHQgICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBbXTtcblx0XHQgICAgICAgIGRzdCA9IGRzdC5jb25jYXQodGFyZ2V0KTtcblx0XHQgICAgICAgIHNyYy5mb3JFYWNoKGZ1bmN0aW9uKGUsIGkpIHtcblx0XHQgICAgICAgICAgICBpZiAodHlwZW9mIGRzdFtpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2ldID0gZTtcblx0XHQgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgICAgICBkc3RbaV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2ldLCBlKTtcblx0XHQgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmluZGV4T2YoZSkgPT09IC0xKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3QucHVzaChlKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgIE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gdGFyZ2V0W2tleV07XG5cdFx0ICAgICAgICAgICAgfSlcblx0XHQgICAgICAgIH1cblx0XHQgICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBzcmNba2V5XSAhPT0gJ29iamVjdCcgfHwgIXNyY1trZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG5cdFx0ICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFtrZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2tleV0sIHNyY1trZXldKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9XG5cdFx0ICAgIHJldHVybiBkc3Q7XG5cdCAgICB9ZWxzZXtcblx0ICAgIFx0cmV0dXJuIHRhcmdldCB8fMKgW107XG5cdCAgICB9XG5cdH1cblx0cmV0dXJuIGRlZXBtZXJnZTtcbn0pKCk7IiwiZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJpbShzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZW50RnJvbVN0cmluZyh2KXtcblx0IGlmKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdGxldCB0ID0gZmFsc2U7XG5cdGlmKHYuaW5kZXhPZil7XG5cdFx0aWYodi5pbmRleE9mKCclJykgPiAtMSlcblx0XHR7XG5cdFx0ICB0ID0gcGFyc2VGbG9hdCh2KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmbiwgZGVsYXkpIHtcblx0dmFyIHRcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFyVGltZW91dCh0KVxuXHRcdHQgPSBzZXRUaW1lb3V0KGZuLCBkZWxheSlcblx0fVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcmNlbnRhZ2UoY3VycmVudCwgbWF4KSB7XG5cdGlmIChjdXJyZW50ID09PSAwIHx8IG1heCA9PT0gMCB8fCBpc05hTihjdXJyZW50KSB8fCBpc05hTihtYXgpKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0cmV0dXJuICgoY3VycmVudCAvIG1heCkgKiAxMDApLnRvRml4ZWQoMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kQmluYXJ5ZnVuY3Rpb24oKSB7XG5cdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvU2Vjb25kcyh0KSB7XG5cdHZhciBzID0gMC4wO1xuXHRpZiAodCkge1xuXHRcdHZhciBwID0gdC5zcGxpdCgnOicpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKylcblx0XHRcdHMgPSBzICogNjAgKyBwYXJzZUZsb2F0KHBbaV0ucmVwbGFjZSgnLCcsICcuJykpXG5cdH1cblx0cmV0dXJuIHM7XG59XG5cbi8qKlxuICogRmFzdGVyIFN0cmluZyBzdGFydHNXaXRoIGFsdGVybmF0aXZlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHNyYyAtIHNvdXJjZSBzdHJpbmdcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc3RyIC0gdGVzdCBzdHJpbmdcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc3JjLCBzdHIpIHtcbiAgcmV0dXJuIHNyYy5zbGljZSgwLCBzdHIubGVuZ3RoKSA9PT0gc3RyXG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBzdHJpbmdcbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHYpIHtcbiAgcmV0dXJuICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpO1xufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgbnVtZXJpY1xuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljKHYpe1xuICByZXR1cm4gIWlzTmFOKHYpO1xufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgc3RyaWN0IG51bWVyaWNcbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaWN0TnVtZXJpYyh2KXtcbiAgcmV0dXJuIChpc05hTih2KSAmJiB0eXBlb2YgdiA9PT0gJ251bWJlcicpXG59XG5cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIGJvb2xlYW5cbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQm9vbGVhbih2KXtcbiAgcmV0dXJuICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIGZ1bmN0aW9uXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nIHx8IGZhbHNlICAgLy8gYXZvaWQgSUUgcHJvYmxlbXNcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhbiBvYmplY3QsIGV4Y2x1ZGUgbnVsbC5cbiAqIE5PVEU6IFVzZSBpc09iamVjdCh4KSAmJiAhaXNBcnJheSh4KSB0byBleGNsdWRlcyBhcnJheXMuXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2KSB7XG4gIHJldHVybiB2ICYmIHR5cGVvZiB2ID09PSAnb2JqZWN0JyAgICAgICAgIC8vIHR5cGVvZiBudWxsIGlzICdvYmplY3QnXG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBvYmplY3QgaXMgYSBraW5kIG9mIGFycmF5XG4gKiBAcGFyYW0gICB7ICogfSBhIC0gYW55dGhpbmdcbiAqIEByZXR1cm5zIHtCb29sZWFufSBpcyAnYScgYW4gYXJyYXk/XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KGEpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgfHwgYSBpbnN0YW5jZW9mIEFycmF5IH1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIGFycmF5IGNvbnRhaW5zIGFuIGl0ZW1cbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSBhcnIgLSB0YXJnZXQgYXJyYXlcbiAqIEBwYXJhbSAgIHsgKiB9IGl0ZW0gLSBpdGVtIHRvIHRlc3RcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IERvZXMgJ2FycicgY29udGFpbiAnaXRlbSc/XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb250YWlucyhhcnIsIGl0ZW0pIHtcbiAgcmV0dXJuIGFyci5pbmRleE9mKGl0ZW0pID4gLTE7XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIHNldCBhbiBpbW11dGFibGUgcHJvcGVydHlcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZWwgLSBvYmplY3Qgd2hlcmUgdGhlIG5ldyBwcm9wZXJ0eSB3aWxsIGJlIHNldFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBrZXkgLSBvYmplY3Qga2V5IHdoZXJlIHRoZSBuZXcgcHJvcGVydHkgd2lsbCBiZSBzdG9yZWRcbiAqIEBwYXJhbSAgIHsgKiB9IHZhbHVlIC0gdmFsdWUgb2YgdGhlIG5ldyBwcm9wZXJ0eVxuKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdGlvbnMgLSBzZXQgdGhlIHByb3Blcnkgb3ZlcnJpZGluZyB0aGUgZGVmYXVsdCBvcHRpb25zXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IC0gdGhlIGluaXRpYWwgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShlbCwga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsIGtleSwgZXh0ZW5kKHtcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LCBvcHRpb25zKSlcbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogRGV0ZWN0IHdoZXRoZXIgYSBwcm9wZXJ0eSBvZiBhbiBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxuICogQHBhcmFtICAgeyBPYmplY3QgfSAgb2JqIC0gc291cmNlIG9iamVjdFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAga2V5IC0gb2JqZWN0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSBpcyB0aGlzIHByb3BlcnR5IHdyaXRhYmxlP1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXcml0YWJsZShvYmosIGtleSkge1xuICB2YXIgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KVxuICByZXR1cm4gdHlwZW9mIG9ialtrZXldID09PSBUX1VOREVGIHx8IHByb3BzICYmIHByb3BzLndyaXRhYmxlXG59XG5cbi8qKlxuICogRXh0ZW5kIGFueSBvYmplY3Qgd2l0aCBvdGhlciBwcm9wZXJ0aWVzXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHNyYyAtIHNvdXJjZSBvYmplY3RcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gdGhlIHJlc3VsdGluZyBleHRlbmRlZCBvYmplY3RcbiAqXG4gKiB2YXIgb2JqID0geyBmb286ICdiYXonIH1cbiAqIGV4dGVuZChvYmosIHtiYXI6ICdiYXInLCBmb286ICdiYXInfSlcbiAqIGNvbnNvbGUubG9nKG9iaikgPT4ge2JhcjogJ2JhcicsIGZvbzogJ2Jhcid9XG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHNyYykge1xuICB2YXIgb2JqLCBhcmdzID0gYXJndW1lbnRzXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgIGlmIChvYmogPSBhcmdzW2ldKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgcHJvcGVydHkgb2YgdGhlIHNvdXJjZSBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxuICAgICAgICBpZiAoaXNXcml0YWJsZShzcmMsIGtleSkpXG4gICAgICAgICAgc3JjW2tleV0gPSBvYmpba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3JjXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZUZvbnQoZiwgd2lkdGgsIGVsKSB7XG5cdHZhciByID0gZmFsc2UsIGwgPSBmYWxzZTtcblx0aWYoZi51bml0cyAhPSAncHgnKSBmLnVuaXRzID0gJ2VtJztcblx0aWYgKGYubWluICE9PSBmYWxzZSAmJiBmLnJhdGlvICE9PSBmYWxzZSkge1xuXHRcdHIgPSBmLnJhdGlvICogd2lkdGggLyAxMDAwO1xuXHRcdGlmIChyIDwgZi5taW4pIHIgPSBmLm1pbjtcblx0XHRpZiAoZi51bml0cyA9PSAncHgnKSByID0gTWF0aC5jZWlsKHIpO1xuXHRcdGlmICghaXNOYU4oZi5saW5lSGVpZ2h0KSAmJiBmLmxpbmVIZWlnaHQpIHtcblx0XHRcdGwgPSByICogZi5saW5lSGVpZ2h0O1xuXHRcdFx0aWYgKGwgPCAxKSBsID0gMTtcblx0XHRcdGwgPSArbC50b0ZpeGVkKDMpICsgZi51bml0cztcblx0XHR9XG5cdFx0ciA9ICtyLnRvRml4ZWQoMykgKyBmLnVuaXRzO1xuXHR9XG5cdGlmKGVsKXtcblx0XHRpZihyKSBlbC5zdHlsZS5mb250U2l6ZSA9IHI7XG5cdFx0aWYobCkgZWwuc3R5bGUubGluZUhlaWdodCA9IGw7XG5cdH1cblx0cmV0dXJuIHtmb250U2l6ZTogciwgbGluZUhlaWdodDogbH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7fTsiLCIvKipcbiAqIEBtb2R1bGUgZG9tXG4gKiBNb2R1bGUgZm9yIGVhc2luZyB0aGUgbWFuaXB1bGF0aW9uIG9mIGRvbSBlbGVtZW50c1xuICovXG5cbmxldCBjbGFzc1JlZyA9IGZ1bmN0aW9uKGMpIHtcblx0cmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxccyspXCIgKyBjICsgXCIoXFxcXHMrfCQpXCIpO1xufTtcblxubGV0IGhhc0NsYXNzXG5sZXQgYWRkQ2xhc3NcbmxldCByZW1vdmVDbGFzcztcbmxldCB0b2dnbGVDbGFzcztcblxuaWYgKCdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRoYXNDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRyZXR1cm4gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoYyk7XG5cdH07XG5cdGFkZENsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGMgPSBjLnNwbGl0KCcgJyk7XG5cdFx0Zm9yICh2YXIgayBpbiBjKSBlbGVtLmNsYXNzTGlzdC5hZGQoY1trXSk7XG5cdH07XG5cdHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjKTtcblx0fTtcbn0gZWxzZSB7XG5cdGhhc0NsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdHJldHVybiBjbGFzc1JlZyhjKS50ZXN0KGVsZW0uY2xhc3NOYW1lKTtcblx0fTtcblx0YWRkQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0aWYgKCFoYXNDbGFzcyhlbGVtLCBjKSkge1xuXHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgJyArIGM7XG5cdFx0fVxuXHR9O1xuXHRyZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NSZWcoYyksICcgJyk7XG5cdH07XG59XG5cbnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHR2YXIgZm4gPSBoYXNDbGFzcyhlbGVtLCBjKSA/IHJlbW92ZUNsYXNzIDogYWRkQ2xhc3M7XG5cdGZuKGVsZW0sIGMpO1xufTtcblxubGV0IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSA9IGZ1bmN0aW9uIGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZShwcm9wTmFtZSkge1xuXHR2YXIgZG9tUHJlZml4ZXMgPSAnV2Via2l0IE1veiBtcyBPJy5zcGxpdCgnICcpLFxuXHRcdGVsU3R5bGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGU7XG5cdGlmIChlbFN0eWxlW3Byb3BOYW1lXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gcHJvcE5hbWU7IC8vIElzIHN1cHBvcnRlZCB1bnByZWZpeGVkXG5cdHByb3BOYW1lID0gcHJvcE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wTmFtZS5zdWJzdHIoMSk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZG9tUHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoZWxTdHlsZVtkb21QcmVmaXhlc1tpXSArIHByb3BOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gZG9tUHJlZml4ZXNbaV0gKyBwcm9wTmFtZTsgLy8gSXMgc3VwcG9ydGVkIHdpdGggcHJlZml4XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdHN0eWxlUHJlZml4OiB7XG5cdFx0dHJhbnNmb3JtOiBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUoJ3RyYW5zZm9ybScpLFxuXHRcdHBlcnNwZWN0aXZlOiBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUoJ3BlcnNwZWN0aXZlJyksXG5cdFx0YmFja2ZhY2VWaXNpYmlsaXR5OiBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUoJ2JhY2tmYWNlVmlzaWJpbGl0eScpXG5cdH0sXG5cdHRyaWdnZXJXZWJraXRIYXJkd2FyZUFjY2VsZXJhdGlvbjogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdGlmICh0aGlzLnN0eWxlUHJlZml4LmJhY2tmYWNlVmlzaWJpbGl0eSAmJiB0aGlzLnN0eWxlUHJlZml4LnBlcnNwZWN0aXZlKSB7XG5cdFx0XHRlbGVtZW50LnN0eWxlW3RoaXMuc3R5bGVQcmVmaXgucGVyc3BlY3RpdmVdID0gJzEwMDBweCc7XG5cdFx0XHRlbGVtZW50LnN0eWxlW3RoaXMuc3R5bGVQcmVmaXguYmFja2ZhY2VWaXNpYmlsaXR5XSA9ICdoaWRkZW4nO1xuXHRcdH1cblx0fSxcblx0dHJhbnNmb3JtOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZSkge1xuXHRcdGVsZW1lbnQuc3R5bGVbdGhpcy5zdHlsZVByZWZpeC50cmFuc2Zvcm1dID0gdmFsdWU7XG5cdH0sXG5cdC8qKlxuXHQgKiBTaG9ydGVyIGFuZCBmYXN0IHdheSB0byBzZWxlY3QgbXVsdGlwbGUgbm9kZXMgaW4gdGhlIERPTVxuXHQgKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gRE9NIHNlbGVjdG9yXG5cdCAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY3R4IC0gRE9NIG5vZGUgd2hlcmUgdGhlIHRhcmdldHMgb2Ygb3VyIHNlYXJjaCB3aWxsIGlzIGxvY2F0ZWRcblx0ICogQHJldHVybnMgeyBPYmplY3QgfSBkb20gbm9kZXMgZm91bmRcblx0ICovXG5cdHNlbGVjdEFsbDogZnVuY3Rpb24oc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuXHR9LFxuXHQvKipcblx0ICogU2hvcnRlciBhbmQgZmFzdCB3YXkgdG8gc2VsZWN0IGEgc2luZ2xlIG5vZGUgaW4gdGhlIERPTVxuXHQgKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gdW5pcXVlIGRvbSBzZWxlY3RvclxuXHQgKiBAcGFyYW0gICB7IE9iamVjdCB9IGN0eCAtIERPTSBub2RlIHdoZXJlIHRoZSB0YXJnZXQgb2Ygb3VyIHNlYXJjaCB3aWxsIGlzIGxvY2F0ZWRcblx0ICogQHJldHVybnMgeyBPYmplY3QgfSBkb20gbm9kZSBmb3VuZFxuXHQgKi9cblx0c2VsZWN0OiBmdW5jdGlvbihzZWxlY3RvciwgY3R4KSB7XG5cdFx0cmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG5cdH0sXG5cdGhhc0NsYXNzOiBoYXNDbGFzcyxcblx0YWRkQ2xhc3M6IGFkZENsYXNzLFxuXHRyZW1vdmVDbGFzczogcmVtb3ZlQ2xhc3MsXG5cdHRvZ2dsZUNsYXNzOiB0b2dnbGVDbGFzcyxcblx0YXV0b0xpbmVIZWlnaHQ6IGZ1bmN0aW9uKGVsKSB7XG5cdFx0bGV0IGwgPSBlbC5vZmZzZXRIZWlnaHQgKyBcInB4XCI7XG5cdFx0ZWwuc3R5bGUubGluZUhlaWdodCA9IGw7XG5cdFx0cmV0dXJuIGw7XG5cdH0sXG5cdGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsbSwgcHJvcHMpIHtcblx0XHRsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsbSk7XG5cdFx0Zm9yIChsZXQgayBpbiBwcm9wcykge1xuXHRcdFx0ZWwuc2V0QXR0cmlidXRlKGssIHByb3BzW2tdKTtcblx0XHR9XG5cdFx0cmV0dXJuIGVsO1xuXHR9LFxuXHRlbXB0eUVsZW1lbnQ6IGZ1bmN0aW9uKGVsbSkge1xuXHRcdHdoaWxlIChlbG0uZmlyc3RDaGlsZCkge1xuXHRcdFx0ZWxtLnJlbW92ZUNoaWxkKGVsbS5maXJzdENoaWxkKTtcblx0XHR9XG5cdH0sXG5cdHJlcGxhY2VFbGVtZW50OiBmdW5jdGlvbih0YXJnZXQsIGVsbSkge1xuXHRcdHRhcmdldC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChlbG0sIHRhcmdldCk7XG5cdH0sXG5cdHJlbW92ZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cdH0sXG5cdGluc2VydEFmdGVyOiBmdW5jdGlvbihlbCwgcmVmZXJlbmNlTm9kZSkge1xuXHRcdHJlZmVyZW5jZU5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHJlZmVyZW5jZU5vZGUubmV4dFNpYmxpbmcpO1xuXHR9LFxuXHRpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKGVsLCByZWZlcmVuY2VOb2RlKSB7XG5cdFx0cmVmZXJlbmNlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlTm9kZSk7XG5cdH0sXG5cdGdldFRleHRDb250ZW50OiBmdW5jdGlvbihlbCkge1xuXHRcdHJldHVybiBlbC50ZXh0Q29udGVudCB8fCBlbC5pbm5lclRleHQ7XG5cdH0sXG5cdHdyYXA6IGZ1bmN0aW9uKGVsZW1lbnRzLCB3cmFwcGVyKSB7XG5cdFx0Ly8gQ29udmVydCBgZWxlbWVudHNgIHRvIGFuIGFycmF5LCBpZiBuZWNlc3NhcnkuXG5cdFx0aWYgKCFlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdGVsZW1lbnRzID0gW2VsZW1lbnRzXTtcblx0XHR9XG5cblx0XHQvLyBMb29wcyBiYWNrd2FyZHMgdG8gcHJldmVudCBoYXZpbmcgdG8gY2xvbmUgdGhlIHdyYXBwZXIgb24gdGhlXG5cdFx0Ly8gZmlyc3QgZWxlbWVudCAoc2VlIGBjaGlsZGAgYmVsb3cpLlxuXHRcdGZvciAodmFyIGkgPSBlbGVtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0dmFyIGNoaWxkID0gKGkgPiAwKSA/IHdyYXBwZXIuY2xvbmVOb2RlKHRydWUpIDogd3JhcHBlcjtcblx0XHRcdHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV07XG5cblx0XHRcdC8vIENhY2hlIHRoZSBjdXJyZW50IHBhcmVudCBhbmQgc2libGluZy5cblx0XHRcdHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR2YXIgc2libGluZyA9IGVsZW1lbnQubmV4dFNpYmxpbmc7XG5cblx0XHRcdC8vIFdyYXAgdGhlIGVsZW1lbnQgKGlzIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBjdXJyZW50XG5cdFx0XHQvLyBwYXJlbnQpLlxuXHRcdFx0Y2hpbGQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cblx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGhhZCBhIHNpYmxpbmcsIGluc2VydCB0aGUgd3JhcHBlciBiZWZvcmVcblx0XHRcdC8vIHRoZSBzaWJsaW5nIHRvIG1haW50YWluIHRoZSBIVE1MIHN0cnVjdHVyZTsgb3RoZXJ3aXNlLCBqdXN0XG5cdFx0XHQvLyBhcHBlbmQgaXQgdG8gdGhlIHBhcmVudC5cblx0XHRcdGlmIChzaWJsaW5nKSB7XG5cdFx0XHRcdHBhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHNpYmxpbmcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNoaWxkO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7c2NhbGVGb250LCBkZWJvdW5jZX0gZnJvbSAnLi4vaGVscGVycy91dGlscyc7XG5pbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4uL2hlbHBlcnMvZGVlcG1lcmdlJztcbmxldCBhdXRvRm9udCA9IGZ1bmN0aW9uKGVsLCBmb250LCBwYXJlbnQpIHtcblx0bGV0IF9lbmFibGVkID0gZmFsc2U7XG5cdGxldCBfdXBkYXRlID0gZnVuY3Rpb24oKXtcblx0XHRkZWJvdW5jZShmdW5jdGlvbigpe1xuXHRcdFx0c2NhbGVGb250KGZvbnQsIHBhcmVudC53aWR0aCgpLCBlbCk7XG5cdFx0fSwxMDApKCk7XG5cdH1cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbih2KSB7XG5cdFx0aWYodiAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdGlmKCFmb250KXsgZm9udCA9IHtyYXRpbzogMSwgbWluOjEsIGxpbmVIZWlnaHQ6IGZhbHNlfSB9XG5cdFx0XHRmb250ID0gZGVlcG1lcmdlKGZvbnQsIHYpO1xuXHRcdFx0cmV0dXJuIHNjYWxlRm9udChmb250LCBwYXJlbnQud2lkdGgoKSwgZWwpO1xuXHRcdH1cblx0fTtcblx0dGhpcy5lbmFibGVkID0gIGZ1bmN0aW9uKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJyAmJiBmb250KSB7XG5cdFx0XHRfZW5hYmxlZCA9IHY7XG5cdFx0XHQvLyB2ID8gKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSksIHNjYWxlRm9udChmb250LCBfd2lkdGgoKSwgZWwpKSA6IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSk7XG5cdFx0fVxuXHRcdHJldHVybiBfZW5hYmxlZDs7XG5cdH07XG5cdGlmKHBhcmVudC5vbil7XG5cdFx0cGFyZW50Lm9uKCdyZXNpemUnLCBfdXBkYXRlKTtcblx0fTtcbn1cbmV4cG9ydCBkZWZhdWx0IGF1dG9Gb250OyIsImltcG9ydCB7XG5cdHByb2NlbnRGcm9tU3RyaW5nLFxuXHRkZWJvdW5jZVxufSBmcm9tICcuLi8uLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkb20gZnJvbSAnLi4vLi4vaGVscGVycy9kb20nO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi8uLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5cbmxldCBkZWZhdWx0cyA9IHtcblx0eDogMCxcblx0eTogMCxcblx0d2lkdGg6ICcxMDAlJyxcblx0aGVpZ2h0OiAnMTAwJScsXG5cdGZvbnRTaXplOiBudWxsLFxuXHRsaW5lSGVpZ2h0OiBudWxsLFxuXHRvZmZzZXRYOiAwLFxuXHRvZmZzZXRZOiAwLFxuXHRvcmlnaW5Qb2ludDogXCJ0b3BMZWZ0XCIsXG5cdHZpc2libGU6IGZhbHNlLFxuXHR0cmFuc2Zvcm06IHtcblx0XHR4OiBudWxsLFxuXHRcdHk6IG51bGxcblx0fSxcblx0dHJhbnNsYXRlOiB0cnVlXG59XG5cbmxldCBhZGFwdGl2ZVNpemVQb3MgPSBmdW5jdGlvbihib3VuZHMsIHNldHR0aW5ncywgcGFyZW50KSB7XG5cdGxldCB2YXVsdCA9IHtcblx0XHR4OiAwLFxuXHRcdHk6IDAsXG5cdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRoZWlnaHQ6ICcxMDAlJyxcblx0XHRmb250U2l6ZTogbnVsbCxcblx0XHRsaW5lSGVpZ2h0OiBudWxsXG5cdH07XG5cdGxldCBwYXJlbnRXaWR0aCA9IDA7XG5cdGxldCBwYXJlbnRIZWlnaHQgPSAwO1xuXHRsZXQgcGFyZW50WCA9IDA7XG5cdGxldCBwYXJlbnRZID0gMDtcblx0bGV0IGRvbUVsZW1lbnQgPSBudWxsO1xuXHRsZXQgc2V0dGluZ3MgPSBkZWVwbWVyZ2UoZGVmYXVsdHMsIHNldHR0aW5ncyk7XG5cdGxldCBfYWN0aXZlID0gZmFsc2U7XG5cblx0bGV0IHVwZGF0ZURvbUVsZW1lbnQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoX2FjdGl2ZSAmJiBkb21FbGVtZW50ICYmIGRvbUVsZW1lbnQubm9kZVR5cGUpIHtcblx0XHRcdGlmICh2YXVsdC53aWR0aCAhPT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9IHZhdWx0LndpZHRoICsgXCJweFwiO1xuXHRcdFx0aWYgKHZhdWx0LmhlaWdodCAhPT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB2YXVsdC5oZWlnaHQgKyBcInB4XCI7XG5cblx0XHRcdGlmIChkb20uc3R5bGVQcmVmaXgudHJhbnNmb3JtICYmIHNldHRpbmdzLnRyYW5zbGF0ZSkge1xuXHRcdFx0XHRsZXQgdHJhbnNmb3JtID0gJyc7XG5cdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwgJiYgdmF1bHQueSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0dHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnICsgdmF1bHQueCArICdweCwnICsgdmF1bHQueSArICdweCknO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUucmlnaHQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmJvdHRvbSA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUudG9wID0gXCJhdXRvXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnJpZ2h0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgdmF1bHQueCArICdweCknO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodmF1bHQueSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmJvdHRvbSA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS50b3AgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdHRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKCcgKyB2YXVsdC55ICsgJ3B4KSc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGRvbS50cmFuc2Zvcm0oZG9tRWxlbWVudCwgdHJhbnNmb3JtKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwgJiYgdmF1bHQueSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gdmF1bHQueCArIFwicHhcIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9IHZhdWx0LnkgKyBcInB4XCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gdmF1bHQueCArIFwicHhcIjtcblx0XHRcdFx0XHRpZiAodmF1bHQueSAhPSBudWxsKSBkb21FbGVtZW50LnN0eWxlLnRvcCA9IHZhdWx0LnkgKyBcInB4XCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHNldHRpbmdzLmZvbnRTaXplICE9PSB2YXVsdC5mb250U2l6ZSkge1xuXHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdmF1bHQuZm9udFNpemUgPSBzZXR0aW5ncy5mb250U2l6ZTtcblxuXHRcdFx0fVxuXHRcdFx0aWYgKHNldHRpbmdzLmxpbmVIZWlnaHQgIT09IHZhdWx0LmxpbmVIZWlnaHQpIHtcblx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5saW5lSGVpZ2h0ID0gdmF1bHQubGluZUhlaWdodCA9IHNldHRpbmdzLmxpbmVIZWlnaHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0bGV0IHVwZGF0ZVByb3BzID0gZnVuY3Rpb24oKSB7XG5cdFx0bGV0IF93ID0gcGFyZW50LndpZHRoKCk7XG5cdFx0bGV0IF9oID0gcGFyZW50LmhlaWdodCgpO1xuXHRcdGxldCBfeCA9IHBhcmVudC5vZmZzZXRYKCk7XG5cdFx0bGV0IF95ID0gcGFyZW50Lm9mZnNldFkoKTtcblx0XHRpZihwYXJlbnRXaWR0aCAhPSBfdyB8fCBwYXJlbnRIZWlnaHQgIT0gX2ggfHwgX3ggIT0gcGFyZW50WCB8fCBfeSAhPSBwYXJlbnRZKXtcblx0XHRcdHBhcmVudFdpZHRoID0gX3c7IHBhcmVudEhlaWdodCA9IF9oO1xuXHRcdFx0cGFyZW50WCA9IF94OyBwYXJlbnRZID0gX3k7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IGIgPSBib3VuZHMoKTtcblxuXHRcdGxldCBwcm9jZW50V2lkdGggPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy53aWR0aCk7XG5cdFx0aWYgKHByb2NlbnRXaWR0aCkge1xuXHRcdFx0dmF1bHQud2lkdGggPSBiLndpZHRoICogcHJvY2VudFdpZHRoIC8gMTAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoc2V0dGluZ3Mud2lkdGggIT0gbnVsbCkge1xuXHRcdFx0XHR2YXVsdC53aWR0aCA9IGIud2lkdGggKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBwcm9jZW50SGVpZ2h0ID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MuaGVpZ2h0KTtcblx0XHRpZiAocHJvY2VudEhlaWdodCkge1xuXHRcdFx0dmF1bHQuaGVpZ2h0ID0gYi5oZWlnaHQgKiBwcm9jZW50SGVpZ2h0IC8gMTAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoc2V0dGluZ3MuaGVpZ2h0ICE9IG51bGwpIHtcblx0XHRcdFx0dmF1bHQuaGVpZ2h0ID0gYi5oZWlnaHQgKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChzZXR0aW5ncy54ICE9IG51bGwpIHtcblx0XHRcdGxldCBwcm9jZW50WCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLngpO1xuXHRcdFx0aWYocHJvY2VudFgpe1xuXHRcdFx0XHR2YXVsdC54ID0gYi5vZmZzZXRYICsgYi53aWR0aCAqIHByb2NlbnRYIC8gMTAwO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHZhdWx0LnggPSBiLm9mZnNldFggKyBzZXR0aW5ncy54ICogYi5zY2FsZTtcdFxuXHRcdFx0fVxuXHRcdFx0bGV0IHRyYW5zZm9ybVggPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy50cmFuc2Zvcm0ueCk7XG5cdFx0XHRpZiAodHJhbnNmb3JtWCkgdmF1bHQueCArPSB0cmFuc2Zvcm1YICogdmF1bHQud2lkdGggLyAxMDA7XG5cdFx0XHRpZiAoc2V0dGluZ3Mub2Zmc2V0WCkgdmF1bHQueCArPSBzZXR0aW5ncy5vZmZzZXRYO1xuXHRcdH1cblxuXHRcdGlmIChzZXR0aW5ncy55ICE9IG51bGwpIHtcblx0XHRcdGxldCBwcm9jZW50WSA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLnkpO1xuXHRcdFx0aWYocHJvY2VudFkpe1xuXHRcdFx0XHR2YXVsdC55ID0gYi5vZmZzZXRZICsgYi5oZWlnaHQgKiBwcm9jZW50WSAvIDEwMDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR2YXVsdC55ID0gYi5vZmZzZXRZICsgc2V0dGluZ3MueSAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0XHRsZXQgdHJhbnNmb3JtWSA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLnRyYW5zZm9ybS55KTtcblx0XHRcdGlmICh0cmFuc2Zvcm1ZKSB2YXVsdC55ICs9IHRyYW5zZm9ybVkgKiB2YXVsdC53aWR0aCAvIDEwMDtcblx0XHRcdGlmIChzZXR0aW5ncy5vZmZzZXRZKSB2YXVsdC55ICs9IHNldHRpbmdzLm9mZnNldFk7XG5cdFx0fVxuXHRcdFxuXHRcdHVwZGF0ZURvbUVsZW1lbnQoKTtcblx0fVxuXG5cdHRoaXMuYXBwbHlUbyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRpZihlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUpe1xuXHRcdFx0ZG9tRWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0XHR1cGRhdGVQcm9wcygpO1xuXHRcdH1cblx0XHRyZXR1cm4gZG9tRWxlbWVudDtcblx0fVxuXG5cdGxldCBhcHBseU5ld1Byb3BzID0gZnVuY3Rpb24oKSB7XG5cdFx0dXBkYXRlUHJvcHMoKTtcblx0fVxuXG5cdHRoaXMuZGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB2YXVsdDtcblx0fVxuXG5cdHRoaXMuc2V0dGluZ3MgPSBmdW5jdGlvbihuZXdTZXR0aW5ncykge1xuXHRcdHNldHRpbmdzID0gZGVlcG1lcmdlKHNldHRpbmdzLCBuZXdTZXR0aW5ncyk7XG5cdFx0dXBkYXRlUHJvcHMoKTtcblx0XHRyZXR1cm4gc2V0dGluZ3M7XG5cdH1cblx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24odikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHRfYWN0aXZlID0gdjtcblx0XHRcdGlmKHYpIGFwcGx5TmV3UHJvcHMoKTtcblx0XHRcdC8vIHYgPyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgYXBwbHlOZXdQcm9wcywgZmFsc2UpIDogd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMsIGZhbHNlKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9hY3RpdmU7XG5cdH07XG5cblx0aWYocGFyZW50Lm9uKXtcblx0XHRwYXJlbnQub24oJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMpO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBhZGFwdGl2ZVNpemVQb3M7IiwiaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi8uLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQge1xuXHRwcm9jZW50RnJvbVN0cmluZ1xufSBmcm9tICcuLi8uLi9oZWxwZXJzL3V0aWxzJztcbmxldCBkZWZhdWx0cyA9IHtcblx0eDogMCxcblx0eTogMCxcblx0d2lkdGg6IDAsXG5cdGhlaWdodDogMFxufVxubGV0IHJlbGF0aXZlU2l6ZVBvcyA9IGZ1bmN0aW9uKGN0eCwgc2V0dGluZ3MpIHtcblx0bGV0IHBhcmVudFdpZHRoID0gY3R4LmRlZmF1bHRXaWR0aCgpIHx8IGN0eC53aWR0aCB8fCAwO1xuXHRsZXQgcGFyZW50SGVpZ2h0ID0gY3R4LmRlZmF1bHRIZWlnaHQoKSB8fCBjdHguaGVpZ2h0IHx8IDA7XG5cdGxldCBvID0gZGVlcG1lcmdlKGRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cdGxldCBfdyA9IHByb2NlbnRGcm9tU3RyaW5nKG8ud2lkdGgpO1xuXHRpZiAoIV93KSBfdyA9IG8ud2lkdGggLyBwYXJlbnRXaWR0aCAqIDEwMDtcblx0bGV0IF9oID0gcHJvY2VudEZyb21TdHJpbmcoby5oZWlnaHQpO1xuXHRpZiAoIV9oKSBfaCA9IG8uaGVpZ2h0IC8gcGFyZW50SGVpZ2h0ICogMTAwO1xuXHRsZXQgX3ggPSBwcm9jZW50RnJvbVN0cmluZyhvLngpO1xuXHRpZiAoIV94KSBfeCA9IG8ueCAvIHBhcmVudFdpZHRoICogMTAwO1xuXHRsZXQgX3kgPSBwcm9jZW50RnJvbVN0cmluZyhvLnkpO1xuXHRpZiAoIV95KSBfeSA9IG8ueSAvIHBhcmVudEhlaWdodCAqIDEwMDtcblx0cmV0dXJuIHtcblx0XHR4OiBfeCxcblx0XHR5OiBfeSxcblx0XHR3aWR0aDogX3csXG5cdFx0aGVpZ2h0OiBfaCBcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgcmVsYXRpdmVTaXplUG9zOyIsImltcG9ydCBkb20gZnJvbSAnLi4vLi4vaGVscGVycy9kb20nO1xuaW1wb3J0IGFkYXB0aXZlU2l6ZVBvcyBmcm9tICcuL2FkYXB0aXZlU2l6ZVBvcyc7XG5pbXBvcnQgcmVsYXRpdmVTaXplUG9zIGZyb20gJy4vcmVsYXRpdmVTaXplUG9zJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRhaW5lciB7XG5cdGNvbnN0cnVjdG9yKGN0eCkge1xuXHRcdHRoaXMuZWwgPSBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdFx0c3R5bGU6ICdwb3NpdGlvbjphYnNvbHV0ZTsgcG9pbnRlci1ldmVudHM6IG5vbmU7J1xuXHRcdH0pO1xuXHRcdGxldCBhYyA9IG5ldyBhZGFwdGl2ZVNpemVQb3MoZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG9mZnNldFg6IGN0eC5vZmZzZXRYKCksXG5cdFx0XHRcdG9mZnNldFk6IGN0eC5vZmZzZXRZKCksXG5cdFx0XHRcdHdpZHRoOiBjdHgud2lkdGgoKSxcblx0XHRcdFx0aGVpZ2h0OiBjdHguaGVpZ2h0KCksXG5cdFx0XHRcdHNjYWxlOiBjdHgud2lkdGgoKSAvIGN0eC5kZWZhdWx0V2lkdGgoKSxcblx0XHRcdFx0c2NhbGVZOiBjdHgud2lkdGgoKSAvIGN0eC5kZWZhdWx0SGVpZ2h0KClcblx0XHRcdH07XG5cdFx0fSwge30sIGN0eCk7XG5cdFx0YWMuYXBwbHlUbyh0aGlzLmVsKTtcblx0XHRhYy5lbmFibGVkKHRydWUpO1xuXG5cdFx0Y3R4LndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG5cblx0XHR0aGlzLmFkZCA9IGZ1bmN0aW9uKG9wdHMsZWwgPSB7fSkge1xuXHRcdFx0aWYoIWVsLm5vZGVUeXBlKSBlbCA9IGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGRvbS5hZGRDbGFzcyhlbCwgJ2ttbENvbnRhaW5lcicpO1xuXHRcdFx0ZWwuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdFx0XHRlbC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIjtcblx0XHRcdGxldCBlbERpbWVuc2lvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZXQgZCA9IG5ldyByZWxhdGl2ZVNpemVQb3MoY3R4LG9wdHMpO1xuXHRcdFx0XHRlbC5zdHlsZS53aWR0aCA9IGQud2lkdGggKyBcIiVcIjtcblx0XHRcdFx0ZWwuc3R5bGUuaGVpZ2h0ID0gZC5oZWlnaHQgKyBcIiVcIjtcblx0XHRcdFx0aWYgKGRvbS5zdHlsZVByZWZpeC50cmFuc2Zvcm0pIHtcblx0XHRcdFx0XHRkb20udHJhbnNmb3JtKGVsLCAndHJhbnNsYXRlKCcgKyAxMDAvZC53aWR0aCpkLnggKyAnJSwnICsgMTAwL2QuaGVpZ2h0KmQueSArICclKScpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVsLnN0eWxlLnRvcCA9IGQueCArIFwiJVwiO1xuXHRcdFx0XHRcdGVsLnN0eWxlLmxlZnQgPSBkLnkgKyBcIiVcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxEaW1lbnNpb24oKTtcblx0XHRcdHRoaXMuZWwuYXBwZW5kQ2hpbGQoZWwpO1xuXHRcdFx0Y3R4Lm9uKCdyZXNpemUnLCBlbERpbWVuc2lvbik7XG5cdFx0fVxuXHR9XG59IiwiLy9odHRwczovL2dpdGh1Yi5jb20vcHJpbXVzL2V2ZW50ZW1pdHRlcjNcbid1c2Ugc3RyaWN0JztcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbiAgLCBwcmVmaXggPSAnfic7XG5cbi8qKlxuICogQ29uc3RydWN0b3IgdG8gY3JlYXRlIGEgc3RvcmFnZSBmb3Igb3VyIGBFRWAgb2JqZWN0cy5cbiAqIEFuIGBFdmVudHNgIGluc3RhbmNlIGlzIGEgcGxhaW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYXJlIGV2ZW50IG5hbWVzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEV2ZW50cygpIHt9XG5cbi8vXG4vLyBXZSB0cnkgdG8gbm90IGluaGVyaXQgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAuIEluIHNvbWUgZW5naW5lcyBjcmVhdGluZyBhblxuLy8gaW5zdGFuY2UgaW4gdGhpcyB3YXkgaXMgZmFzdGVyIHRoYW4gY2FsbGluZyBgT2JqZWN0LmNyZWF0ZShudWxsKWAgZGlyZWN0bHkuXG4vLyBJZiBgT2JqZWN0LmNyZWF0ZShudWxsKWAgaXMgbm90IHN1cHBvcnRlZCB3ZSBwcmVmaXggdGhlIGV2ZW50IG5hbWVzIHdpdGggYVxuLy8gY2hhcmFjdGVyIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBidWlsdC1pbiBvYmplY3QgcHJvcGVydGllcyBhcmUgbm90XG4vLyBvdmVycmlkZGVuIG9yIHVzZWQgYXMgYW4gYXR0YWNrIHZlY3Rvci5cbi8vXG5pZiAoT2JqZWN0LmNyZWF0ZSkge1xuICBFdmVudHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAvL1xuICAvLyBUaGlzIGhhY2sgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGBfX3Byb3RvX19gIHByb3BlcnR5IGlzIHN0aWxsIGluaGVyaXRlZCBpblxuICAvLyBzb21lIG9sZCBicm93c2VycyBsaWtlIEFuZHJvaWQgNCwgaVBob25lIDUuMSwgT3BlcmEgMTEgYW5kIFNhZmFyaSA1LlxuICAvL1xuICBpZiAoIW5ldyBFdmVudHMoKS5fX3Byb3RvX18pIHByZWZpeCA9IGZhbHNlO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudGF0aW9uIG9mIGEgc2luZ2xlIGV2ZW50IGxpc3RlbmVyLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHBhcmFtIHtCb29sZWFufSBbb25jZT1mYWxzZV0gU3BlY2lmeSBpZiB0aGUgbGlzdGVuZXIgaXMgYSBvbmUtdGltZSBsaXN0ZW5lci5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEVFKGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHRoaXMuZm4gPSBmbjtcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5vbmNlID0gb25jZSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBNaW5pbWFsIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZSB0aGF0IGlzIG1vbGRlZCBhZ2FpbnN0IHRoZSBOb2RlLmpzXG4gKiBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xufVxuXG4vKipcbiAqIFJldHVybiBhbiBhcnJheSBsaXN0aW5nIHRoZSBldmVudHMgZm9yIHdoaWNoIHRoZSBlbWl0dGVyIGhhcyByZWdpc3RlcmVkXG4gKiBsaXN0ZW5lcnMuXG4gKlxuICogQHJldHVybnMge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgdmFyIG5hbWVzID0gW11cbiAgICAsIGV2ZW50c1xuICAgICwgbmFtZTtcblxuICBpZiAodGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHJldHVybiBuYW1lcztcblxuICBmb3IgKG5hbWUgaW4gKGV2ZW50cyA9IHRoaXMuX2V2ZW50cykpIHtcbiAgICBpZiAoaGFzLmNhbGwoZXZlbnRzLCBuYW1lKSkgbmFtZXMucHVzaChwcmVmaXggPyBuYW1lLnNsaWNlKDEpIDogbmFtZSk7XG4gIH1cblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHJldHVybiBuYW1lcy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhldmVudHMpKTtcbiAgfVxuXG4gIHJldHVybiBuYW1lcztcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtCb29sZWFufSBleGlzdHMgT25seSBjaGVjayBpZiB0aGVyZSBhcmUgbGlzdGVuZXJzLlxuICogQHJldHVybnMge0FycmF5fEJvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyhldmVudCwgZXhpc3RzKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50XG4gICAgLCBhdmFpbGFibGUgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAoZXhpc3RzKSByZXR1cm4gISFhdmFpbGFibGU7XG4gIGlmICghYXZhaWxhYmxlKSByZXR1cm4gW107XG4gIGlmIChhdmFpbGFibGUuZm4pIHJldHVybiBbYXZhaWxhYmxlLmZuXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGF2YWlsYWJsZS5sZW5ndGgsIGVlID0gbmV3IEFycmF5KGwpOyBpIDwgbDsgaSsrKSB7XG4gICAgZWVbaV0gPSBhdmFpbGFibGVbaV0uZm47XG4gIH1cblxuICByZXR1cm4gZWU7XG59O1xuXG4vKipcbiAqIENhbGxzIGVhY2ggb2YgdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBldmVudCBoYWQgbGlzdGVuZXJzLCBlbHNlIGBmYWxzZWAuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2ZW50LCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XVxuICAgICwgbGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgYXJnc1xuICAgICwgaTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnMuZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgY2FzZSAxOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQpLCB0cnVlO1xuICAgICAgY2FzZSAyOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExKSwgdHJ1ZTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIpLCB0cnVlO1xuICAgICAgY2FzZSA0OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMpLCB0cnVlO1xuICAgICAgY2FzZSA1OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgNjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCwgYTUpLCB0cnVlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMuZm4uYXBwbHkobGlzdGVuZXJzLmNvbnRleHQsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoXG4gICAgICAsIGo7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsaXN0ZW5lcnNbaV0ub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzW2ldLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgICBjYXNlIDE6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0KTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMzogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMik7IGJyZWFrO1xuICAgICAgICBjYXNlIDQ6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIsIGEzKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFhcmdzKSBmb3IgKGogPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYXJnc1tqIC0gMV0gPSBhcmd1bWVudHNbal07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGlzdGVuZXJzW2ldLmZuLmFwcGx5KGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogQWRkIGEgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IFtjb250ZXh0PXRoaXNdIFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbihldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIHRoaXMuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbdGhpcy5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkIGEgb25lLXRpbWUgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IFtjb250ZXh0PXRoaXNdIFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UoZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCB0aGlzLCB0cnVlKVxuICAgICwgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGxpc3RlbmVyLCB0aGlzLl9ldmVudHNDb3VudCsrO1xuICBlbHNlIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlIHRoaXMuX2V2ZW50c1tldnRdID0gW3RoaXMuX2V2ZW50c1tldnRdLCBsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbGlzdGVuZXJzIG9mIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBtYXRjaCB0aGlzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBPbmx5IHJlbW92ZSB0aGUgbGlzdGVuZXJzIHRoYXQgaGF2ZSB0aGlzIGNvbnRleHQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9uY2UgT25seSByZW1vdmUgb25lLXRpbWUgbGlzdGVuZXJzLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gdGhpcztcbiAgaWYgKCFmbikge1xuICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgIGlmIChcbiAgICAgICAgIGxpc3RlbmVycy5mbiA9PT0gZm5cbiAgICAgICYmICghb25jZSB8fCBsaXN0ZW5lcnMub25jZSlcbiAgICAgICYmICghY29udGV4dCB8fCBsaXN0ZW5lcnMuY29udGV4dCA9PT0gY29udGV4dClcbiAgICApIHtcbiAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGV2ZW50cyA9IFtdLCBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChcbiAgICAgICAgICAgbGlzdGVuZXJzW2ldLmZuICE9PSBmblxuICAgICAgICB8fCAob25jZSAmJiAhbGlzdGVuZXJzW2ldLm9uY2UpXG4gICAgICAgIHx8IChjb250ZXh0ICYmIGxpc3RlbmVyc1tpXS5jb250ZXh0ICE9PSBjb250ZXh0KVxuICAgICAgKSB7XG4gICAgICAgIGV2ZW50cy5wdXNoKGxpc3RlbmVyc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBSZXNldCB0aGUgYXJyYXksIG9yIHJlbW92ZSBpdCBjb21wbGV0ZWx5IGlmIHdlIGhhdmUgbm8gbW9yZSBsaXN0ZW5lcnMuXG4gICAgLy9cbiAgICBpZiAoZXZlbnRzLmxlbmd0aCkgdGhpcy5fZXZlbnRzW2V2dF0gPSBldmVudHMubGVuZ3RoID09PSAxID8gZXZlbnRzWzBdIDogZXZlbnRzO1xuICAgIGVsc2UgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIGxpc3RlbmVycywgb3IgdGhvc2Ugb2YgdGhlIHNwZWNpZmllZCBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpIHtcbiAgdmFyIGV2dDtcblxuICBpZiAoZXZlbnQpIHtcbiAgICBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuICAgIGlmICh0aGlzLl9ldmVudHNbZXZ0XSkge1xuICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gQWxpYXMgbWV0aG9kcyBuYW1lcyBiZWNhdXNlIHBlb3BsZSByb2xsIGxpa2UgdGhhdC5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuLy9cbi8vIFRoaXMgZnVuY3Rpb24gZG9lc24ndCBhcHBseSBhbnltb3JlLlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIHByZWZpeC5cbi8vXG5FdmVudEVtaXR0ZXIucHJlZml4ZWQgPSBwcmVmaXg7XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5leHBvcnQgZGVmYXVsdCBFdmVudEVtaXR0ZXI7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cdGxldCB4ID0gMDtcblx0bGV0IHkgPSAwO1xuXHR0aGlzLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR4ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IDA7XG5cdFx0eSA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCAwO1xuXHR9XG5cdHRoaXMucmVzdG9yZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5zY3JvbGxUbyh4LCB5KVxuXHR9XG59IiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuL21lZGlhL2V2ZW50cy9pbmRleCc7XG5pbXBvcnQgc2Nyb2xsUG9zaXRpb24gZnJvbSAnLi4vaGVscGVycy9zY3JvbGxQb3NpdGlvbic7XG4vLyBGdWxsc2NyZWVuIEFQSVxubGV0IHN1cHBvcnRzRnVsbFNjcmVlbiA9IGZhbHNlO1xubGV0IGJyb3dzZXJQcmVmaXhlcyA9ICd3ZWJraXQgbW96IG8gbXMga2h0bWwnLnNwbGl0KCcgJyk7XG5sZXQgcHJlZml4RlMgPSAnJztcbi8vQ2hlY2sgZm9yIG5hdGl2ZSBzdXBwb3J0XG5pZiAodHlwZW9mIGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgc3VwcG9ydHNGdWxsU2NyZWVuID0gdHJ1ZTtcbn0gZWxzZSB7XG4gICAgLy8gQ2hlY2sgZm9yIGZ1bGxzY3JlZW4gc3VwcG9ydCBieSB2ZW5kb3IgcHJlZml4XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYnJvd3NlclByZWZpeGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgcHJlZml4RlMgPSBicm93c2VyUHJlZml4ZXNbaV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudFtwcmVmaXhGUyArICdDYW5jZWxGdWxsU2NyZWVuJ10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBNUyAod2hlbiBpc24ndCBpdD8pXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbmFibGVkKSB7XG4gICAgICAgICAgICBwcmVmaXhGUyA9ICdtcyc7XG4gICAgICAgICAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5sZXQgZXZlbnRDaGFuZ2UgPSAocHJlZml4RlMgPT09ICcnKSA/ICdmdWxsc2NyZWVuY2hhbmdlJyA6IHByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnZnVsbHNjcmVlbmNoYW5nZScgOiAnZnVsbHNjcmVlbmNoYW5nZScpO1xuZXZlbnRDaGFuZ2UgPSBldmVudENoYW5nZS50b0xvd2VyQ2FzZSgpO1xuLy9zdXBwb3J0c0Z1bGxTY3JlZW4gPSBmYWxzZTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1bGxzY3JlZW4gZXh0ZW5kcyBFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uID0gbmV3IHNjcm9sbFBvc2l0aW9uKCk7XG4gICAgICAgIGlmICghc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUgPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmbkZ1bGxzY3JlZW5DaGFuZ2UgPSAoKT0+e1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzRnVsbFNjcmVlbigpKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLnNjcm9sbFBvc2l0aW9uLnJlc3RvcmUsMTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50Q2hhbmdlLCBmbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvbkZ1bGxzY3JlZW5DaGFuZ2UoZXZ0KXtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy53cmFwcGVyKTtcbiAgICAgICAgdGhpcy5tZWRpYS5hZGRFdmVudExpc3RlbmVyKGV2ZW50Q2hhbmdlLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb25cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9LCB0cnVlKTtcbiAgICB9XG4gICAgaXNGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLndyYXBwZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKHByZWZpeEZTKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ID09IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnbW96JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50ID09IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50W3ByZWZpeEZTICsgJ0Z1bGxzY3JlZW5FbGVtZW50J10gPT0gZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMud3JhcHBlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4oKSA6IGVsZW1lbnRbcHJlZml4RlMgKyAocHJlZml4RlMgPT0gJ21zJyA/ICdSZXF1ZXN0RnVsbHNjcmVlbicgOiAnUmVxdWVzdEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0Z1bGxTY3JlZW4oKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24uc2F2ZSgpO1xuICAgICAgICAgICAgICAgIGxldCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsncG9zaXRpb24nXSA9IHN0eWxlLnBvc2l0aW9uIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydtYXJnaW4nXSA9IHN0eWxlLm1hcmdpbiB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsndG9wJ10gPSBzdHlsZS50b3AgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ2xlZnQnXSA9IHN0eWxlLmxlZnQgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3dpZHRoJ10gPSBzdHlsZS53aWR0aCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnaGVpZ2h0J10gPSBzdHlsZS5oZWlnaHQgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3pJbmRleCddID0gc3R5bGUuekluZGV4IHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydtYXhXaWR0aCddID0gc3R5bGUubWF4V2lkdGggfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21heEhlaWdodCddID0gc3R5bGUubWF4SGVpZ2h0IHx8IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gZWxlbWVudC5zdHlsZS5sZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1hcmdpbiA9IDA7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5tYXhXaWR0aCA9IGVsZW1lbnQuc3R5bGUubWF4SGVpZ2h0ID0gZWxlbWVudC5zdHlsZS53aWR0aCA9IGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS56SW5kZXggPSAyMTQ3NDgzNjQ3O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncmVzaXplJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Z1bGxTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjYW5jZWxGdWxsU2NyZWVuKCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKCkgOiBkb2N1bWVudFtwcmVmaXhGUyArIChwcmVmaXhGUyA9PSAnbXMnID8gJ0V4aXRGdWxsc2NyZWVuJyA6ICdDYW5jZWxGdWxsU2NyZWVuJyldKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0Z1bGxTY3JlZW4oKSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50LnN0eWxlW2tdID0gdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Z1bGxTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdyZXNpemUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uLnJlc3RvcmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2dnbGVGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGlzRnVsbHNjcmVlbiA9ICF0aGlzLmlzRnVsbFNjcmVlbigpO1xuICAgICAgICBpZiAoaXNGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQpO1xuICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bGxzY3JlZW5FbGVtZW50KCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA6IGRvY3VtZW50W3ByZWZpeEZTICsgJ0Z1bGxzY3JlZW5FbGVtZW50J107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG59OyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWVkaWEpIHtcblx0Ly8gUmVtb3ZlIGNoaWxkIHNvdXJjZXNcblx0dmFyIHNvdXJjZXMgPSBkb20uc2VsZWN0QWxsKCdzb3VyY2UnLCBtZWRpYSk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGRvbS5yZW1vdmVFbGVtZW50KHNvdXJjZXNbaV0pO1xuXHR9XG5cblx0Ly8gU2V0IGJsYW5rIHZpZGVvIHNyYyBhdHRyaWJ1dGVcblx0Ly8gVGhpcyBpcyB0byBwcmV2ZW50IGEgTUVESUFfRVJSX1NSQ19OT1RfU1VQUE9SVEVEIGVycm9yXG5cdC8vIFNtYWxsIG1wNDogaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvc21hbGwvYmxvYi9tYXN0ZXIvbXA0Lm1wNFxuXHQvLyBJbmZvOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyMjMxNTc5L2hvdy10by1wcm9wZXJseS1kaXNwb3NlLW9mLWFuLWh0bWw1LXZpZGVvLWFuZC1jbG9zZS1zb2NrZXQtb3ItY29ubmVjdGlvblxuXHRtZWRpYS5zZXRBdHRyaWJ1dGUoJ3NyYycsICdkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUhHWjBlWEJwYzI5dEFBQUNBR2x6YjIxcGMyOHliWEEwTVFBQUFBaG1jbVZsQUFBQUdtMWtZWFFBQUFHekFCQUhBQUFCdGhCZ1VZSTl0KzhBQUFNTmJXOXZkZ0FBQUd4dGRtaGtBQUFBQU1YTXZ2ckZ6TDc2QUFBRDZBQUFBQ29BQVFBQUFRQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FBQUJocGIyUnpBQUFBQUJDQWdJQUhBRS8vLy8vKy93QUFBaUYwY21GckFBQUFYSFJyYUdRQUFBQVB4Y3krK3NYTXZ2b0FBQUFCQUFBQUFBQUFBQ29BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQWdBQUFBSUFBQUFBQUc5YldScFlRQUFBQ0J0Wkdoa0FBQUFBTVhNdnZyRnpMNzZBQUFBR0FBQUFBRVZ4d0FBQUFBQUxXaGtiSElBQUFBQUFBQUFBSFpwWkdVQUFBQUFBQUFBQUFBQUFBQldhV1JsYjBoaGJtUnNaWElBQUFBQmFHMXBibVlBQUFBVWRtMW9aQUFBQUFFQUFBQUFBQUFBQUFBQUFDUmthVzVtQUFBQUhHUnlaV1lBQUFBQUFBQUFBUUFBQUF4MWNtd2dBQUFBQVFBQUFTaHpkR0pzQUFBQXhITjBjMlFBQUFBQUFBQUFBUUFBQUxSdGNEUjJBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FDQUJJQUFBQVNBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR1AvL0FBQUFYbVZ6WkhNQUFBQUFBNENBZ0UwQUFRQUVnSUNBUHlBUkFBQUFBQU1OUUFBQUFBQUZnSUNBTFFBQUFiQUJBQUFCdFlrVEFBQUJBQUFBQVNBQXhJMklBTVVBUkFFVVF3QUFBYkpNWVhaak5UTXVNelV1TUFhQWdJQUJBZ0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUFVYzNSemVnQUFBQUFBQUFBU0FBQUFBUUFBQUJSemRHTnZBQUFBQUFBQUFBRUFBQUFzQUFBQVlIVmtkR0VBQUFCWWJXVjBZUUFBQUFBQUFBQWhhR1JzY2dBQUFBQUFBQUFBYldScGNtRndjR3dBQUFBQUFBQUFBQUFBQUFBcmFXeHpkQUFBQUNPcGRHOXZBQUFBRzJSaGRHRUFBQUFCQUFBQUFFeGhkbVkxTXk0eU1TNHgnKTtcblxuXHQvLyBMb2FkIHRoZSBuZXcgZW1wdHkgc291cmNlXG5cdC8vIFRoaXMgd2lsbCBjYW5jZWwgZXhpc3RpbmcgcmVxdWVzdHNcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TZWx6L3BseXIvaXNzdWVzLzE3NFxuXHRtZWRpYS5sb2FkKCk7XG5cblx0Ly8gRGVidWdnaW5nXG5cdGNvbnNvbGUubG9nKFwiQ2FuY2VsbGVkIG5ldHdvcmsgcmVxdWVzdHMgZm9yIG9sZCBtZWRpYVwiKTtcbn0iLCJleHBvcnQgZnVuY3Rpb24gbWltZUF1ZGlvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wNCc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wZWcnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vd2F2JzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2OyBjb2RlY3M9XCIxXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWltZVZpZGVvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL3dlYm0nOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby93ZWJtOyBjb2RlY3M9XCJ2cDgsIHZvcmJpc1wiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICd2aWRlby9tcDQnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFLCBtcDRhLjQwLjJcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAndmlkZW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHt9IiwiaW1wb3J0IEZ1bGxzY3JlZW4gZnJvbSAnLi4vZnVsbHNjcmVlbic7XG5pbXBvcnQgX2NhbmNlbFJlcXVlc3RzIGZyb20gJy4uLy4uL2hlbHBlcnMvY2FuY2VsVmlkZW9OZXR3b3JrUmVxdWVzdCc7XG5pbXBvcnQge21pbWVWaWRlb30gZnJvbSAnLi4vLi4vaGVscGVycy9taW1lVHlwZSc7XG5cbi8vaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxubGV0IF9ldmVudHMgPSBbJ2VuZGVkJywgJ3Byb2dyZXNzJywgJ3N0YWxsZWQnLCAncGxheWluZycsICd3YWl0aW5nJywgJ2NhbnBsYXknLCAnY2FucGxheXRocm91Z2gnLCAnbG9hZHN0YXJ0JywgJ2xvYWRlZGRhdGEnLCAnbG9hZGVkbWV0YWRhdGEnLCAndGltZXVwZGF0ZScsICd2b2x1bWVjaGFuZ2UnLCAncGxheScsICdwbGF5aW5nJywgJ3BhdXNlJywgJ2Vycm9yJywgJ3NlZWtpbmcnLCAnZW1wdGllZCcsICdzZWVrZWQnLCAncmF0ZWNoYW5nZScsICdzdXNwZW5kJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lZGlhIGV4dGVuZHMgRnVsbHNjcmVlbiB7XG5cdGNvbnN0cnVjdG9yKGVsKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLm1lZGlhID0gZWw7XG5cdFx0X2V2ZW50cy5mb3JFYWNoKChrKSA9PiB7XG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGssICgpID0+IHtcblx0XHRcdFx0dGhpcy5lbWl0KGspO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmNhblBsYXkgPSB7XG5cdFx0XHRtcDQ6IG1pbWVWaWRlbyhlbCwndmlkZW8vbXA0JyksXG5cdFx0XHR3ZWJtOiBtaW1lVmlkZW8oZWwsJ3ZpZGVvL3dlYm0nKSxcblx0XHRcdG9nZzogbWltZVZpZGVvKGVsLCd2aWRlby9vZ2cnKVxuXHRcdH1cblx0fVxuXG5cdC8qKiogR2xvYmFsIGF0dHJpYnV0ZXMgKi9cblxuXHQvKiBBIEJvb2xlYW4gYXR0cmlidXRlOyBpZiBzcGVjaWZpZWQsIHRoZSB2aWRlbyBhdXRvbWF0aWNhbGx5IGJlZ2lucyB0byBwbGF5IGJhY2sgYXMgc29vbiBhcyBpdCBjYW4gZG8gc28gd2l0aG91dCBzdG9wcGluZyB0byBmaW5pc2ggbG9hZGluZyB0aGUgZGF0YS4gSWYgbm90IHJldHVybiB0aGUgYXVvcGxheSBhdHRyaWJ1dGUuICovXG5cdGF1dG9wbGF5KHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5hdXRvcGxheSA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmF1dG9wbGF5O1xuXHR9XG5cblx0LyogUmV0dXJucyB0aGUgdGltZSByYW5nZXMgb2YgdGhlIGJ1ZmZlcmVkIG1lZGlhLiBUaGlzIGF0dHJpYnV0ZSBjb250YWlucyBhIFRpbWVSYW5nZXMgb2JqZWN0ICovXG5cdGJ1ZmZlcmVkKCnCoCB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuYnVmZmVyZWQ7XG5cdH1cblxuXHQvKiBJZiB0aGlzIGF0dHJpYnV0ZSBpcyBwcmVzZW50LCB0aGUgYnJvd3NlciB3aWxsIG9mZmVyIGNvbnRyb2xzIHRvIGFsbG93IHRoZSB1c2VyIHRvIGNvbnRyb2wgdmlkZW8gcGxheWJhY2ssIGluY2x1ZGluZyB2b2x1bWUsIHNlZWtpbmcsIGFuZCBwYXVzZS9yZXN1bWUgcGxheWJhY2suIFdoZW4gbm90IHNldCByZXR1cm5zIGlmIHRoZSBjb250cm9scyBhcmUgcHJlc2VudCAqL1xuXHRuYXRpdmVDb250cm9scyh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEuY29udHJvbHMgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jb250cm9scztcblx0fVxuXG5cdC8qIGFub255bW91cywgdXNlLWNyZWRlbnRpYWxzLCBmYWxzZSAqL1xuXHRjcm9zc29yaWdpbih2KSB7XG5cdFx0aWYgKHYgPT09ICd1c2UtY3JlZGVudGlhbHMnKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmNyb3NzT3JpZ2luID0gJ3VzZS1jcmVkZW50aWFscyc7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9XG5cdFx0aWYgKHYpIHtcblx0XHRcdHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcblx0XHRcdHJldHVybiAnYW5vbnltb3VzJztcblx0XHR9XG5cdFx0aWYgKHYgPT09IGZhbHNlKSB0aGlzLm1lZGlhLmNyb3NzT3JpZ2luID0gbnVsbDtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jcm9zc09yaWdpbjtcblx0fVxuXG5cdC8qIEEgQm9vbGVhbiBhdHRyaWJ1dGU7IGlmIHNwZWNpZmllZCwgd2Ugd2lsbCwgdXBvbiByZWFjaGluZyB0aGUgZW5kIG9mIHRoZSB2aWRlbywgYXV0b21hdGljYWxseSBzZWVrIGJhY2sgdG8gdGhlIHN0YXJ0LiAqL1xuXHRsb29wKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5sb29wID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEubG9vcDtcblx0fVxuXG5cdC8qQSBCb29sZWFuIGF0dHJpYnV0ZSB3aGljaCBpbmRpY2F0ZXMgdGhlIGRlZmF1bHQgc2V0dGluZyBvZiB0aGUgYXVkaW8gY29udGFpbmVkIGluIHRoZSB2aWRlby4gSWYgc2V0LCB0aGUgYXVkaW8gd2lsbCBiZSBpbml0aWFsbHkgc2lsZW5jZWQuIEl0cyBkZWZhdWx0IHZhbHVlIGlzIGZhbHNlLCBtZWFuaW5nIHRoYXQgdGhlIGF1ZGlvIHdpbGwgYmUgcGxheWVkIHdoZW4gdGhlIHZpZGVvIGlzIHBsYXllZCovXG5cdG11dGVkKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5tdXRlZCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLm11dGVkO1xuXHR9XG5cblx0LyogTXV0ZSB0aGUgdmlkZW8gKi9cblx0bXV0ZSgpIHtcblx0XHR0aGlzLm11dGVkKHRydWUpO1xuXHR9XG5cblx0LyogVW5NdXRlIHRoZSB2aWRlbyAqL1xuXHR1bm11dGUoKSB7XG5cdFx0dGhpcy5tdXRlZChmYWxzZSk7XG5cdH1cblxuXHQvKiBUb2dnbGUgdGhlIG11dGVkIHN0YW5jZSBvZiB0aGUgdmlkZW8gKi9cblx0dG9nZ2xlTXV0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5tdXRlZCghdGhpcy5tdXRlZCgpKTtcblx0fVxuXG5cdC8qIFJldHVybnMgQSBUaW1lUmFuZ2VzIG9iamVjdCBpbmRpY2F0aW5nIGFsbCB0aGUgcmFuZ2VzIG9mIHRoZSB2aWRlbyB0aGF0IGhhdmUgYmVlbiBwbGF5ZWQuKi9cblx0cGxheWVkKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLnBsYXllZDtcblx0fVxuXG5cdC8qXG5cdFRoaXMgZW51bWVyYXRlZCBhdHRyaWJ1dGUgaXMgaW50ZW5kZWQgdG8gcHJvdmlkZSBhIGhpbnQgdG8gdGhlIGJyb3dzZXIgYWJvdXQgd2hhdCB0aGUgYXV0aG9yIHRoaW5rcyB3aWxsIGxlYWQgdG8gdGhlIGJlc3QgdXNlciBleHBlcmllbmNlLiBJdCBtYXkgaGF2ZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6XG5cdFx0bm9uZTogaW5kaWNhdGVzIHRoYXQgdGhlIHZpZGVvIHNob3VsZCBub3QgYmUgcHJlbG9hZGVkLlxuXHRcdG1ldGFkYXRhOiBpbmRpY2F0ZXMgdGhhdCBvbmx5IHZpZGVvIG1ldGFkYXRhIChlLmcuIGxlbmd0aCkgaXMgZmV0Y2hlZC5cblx0XHRhdXRvOiBpbmRpY2F0ZXMgdGhhdCB0aGUgd2hvbGUgdmlkZW8gZmlsZSBjb3VsZCBiZSBkb3dubG9hZGVkLCBldmVuIGlmIHRoZSB1c2VyIGlzIG5vdCBleHBlY3RlZCB0byB1c2UgaXQuXG5cdHRoZSBlbXB0eSBzdHJpbmc6IHN5bm9ueW0gb2YgdGhlIGF1dG8gdmFsdWUuXG5cdCovXG5cdHByZWxvYWQodikge1xuXHRcdGlmICh2ID09PSAnbWV0YWRhdGEnIHx8IHYgPT09IFwibWV0YVwiKSB7XG5cdFx0XHR0aGlzLm1lZGlhLnByZWxvYWQgPSAnbWV0YWRhdGEnO1xuXHRcdFx0cmV0dXJuICdtZXRhZGF0YSc7XG5cdFx0fVxuXHRcdGlmICh2KSB7XG5cdFx0XHR0aGlzLm1lZGlhLnByZWxvYWQgPSAnYXV0byc7XG5cdFx0XHRyZXR1cm4gJ2F1dG8nO1xuXHRcdH1cblx0XHRpZiAodiA9PT0gZmFsc2UpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdub25lJztcblx0XHRcdHJldHVybiAnbm9uZSc7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLnByZWxvYWQ7XG5cdH1cblxuXHQvKiBHaXZlcyBvciByZXR1cm5zIHRoZSBhZGRyZXNzIG9mIGFuIGltYWdlIGZpbGUgdGhhdCB0aGUgdXNlciBhZ2VudCBjYW4gc2hvdyB3aGlsZSBubyB2aWRlbyBkYXRhIGlzIGF2YWlsYWJsZS4gVGhlIGF0dHJpYnV0ZSwgaWYgcHJlc2VudCwgbXVzdCBjb250YWluIGEgdmFsaWQgbm9uLWVtcHR5IFVSTCBwb3RlbnRpYWxseSBzdXJyb3VuZGVkIGJ5IHNwYWNlcyAqL1xuXHRwb3N0ZXIodikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMubWVkaWEucG9zdGVyID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucG9zdGVyO1xuXHR9XG5cblx0LyogVGhlIHNyYyBwcm9wZXJ0eSBzZXRzIG9yIHJldHVybnMgdGhlIGN1cnJlbnQgc291cmNlIG9mIHRoZSBhdWRpby92aWRlbywgVGhlIHNvdXJjZSBpcyB0aGUgYWN0dWFsIGxvY2F0aW9uIChVUkwpIG9mIHRoZSBhdWRpby92aWRlbyBmaWxlICovXG5cdHNyYyh2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0X2NhbmNlbFJlcXVlc3RzKHRoaXMubWVkaWEpO1xuXHRcdFx0aWYodiBpbnN0YW5jZW9mIEFycmF5KXtcblx0XHRcdFx0Zm9yKHZhciBpID0gMCwgbiA9IHYubGVuZ3RoOyBpKz0xOyl7XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL21wNFwiICYmIHRoaXMuY2FuUGxheS5tcDQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHZbaV1bJ3R5cGUnXSA9PT0gXCJ2aWRlby93ZWJtXCIgJiYgdGhpcy5jYW5QbGF5LndlYm0pe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHZbaV1bJ3R5cGUnXSA9PT0gXCJ2aWRlby9vZ2dcIiAmJiB0aGlzLmNhblBsYXkub2dnKXtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnNyYyA9IHZbaV1bJ3NyYyddO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fWVsc2UgaWYodi5zcmMgJiYgdi50eXBlKXtcblx0XHRcdFx0dGhpcy5tZWRpYS5zcmMgPSB2LnNyYztcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0aGlzLm1lZGlhLnNyYyA9IHY7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuY3VycmVudFNyYztcblx0fVxuXG5cdC8qKiogR2xvYmFsIEV2ZW50cyAqL1xuXG5cdC8qIFN0YXJ0cyBwbGF5aW5nIHRoZSBhdWRpby92aWRlbyAqL1xuXHRwbGF5KCkge1xuXHRcdHRoaXMubWVkaWEucGxheSgpO1xuXHR9XG5cblx0LyogUGF1c2VzIHRoZSBjdXJyZW50bHkgcGxheWluZyBhdWRpby92aWRlbyAqL1xuXHRwYXVzZSgpIHtcblx0XHR0aGlzLm1lZGlhLnBhdXNlKCk7XG5cdH1cblxuXHQvKiBUb2dnbGUgcGxheS9wYXVzZSBmb3IgdGhlIGF1ZGlvL3ZpZGVvICovXG5cdHRvZ2dsZVBsYXkoKSB7XG5cdFx0dGhpcy5tZWRpYS5wYXVzZWQgPyB0aGlzLnBsYXkoKSA6IHRoaXMucGF1c2UoKTtcblx0fVxuXG5cdGN1cnJlbnRUaW1lKHYpIHtcblx0XHRpZiAodiA9PT0gbnVsbCB8fCBpc05hTih2KSkge1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuY3VycmVudFRpbWU7XG5cdFx0fVxuXHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdGlmICh2ID4gdGhpcy5tZWRpYS5kdXJhdGlvbikge1xuXHRcdFx0diA9IHRoaXMubWVkaWEuZHVyYXRpb247XG5cdFx0fVxuXHRcdGlmICh2IDwgMCkge1xuXHRcdFx0diA9IDA7XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEuY3VycmVudFRpbWUgPSB2O1xuXHRcdHJldHVybiB2O1xuXHR9XG5cblx0c2Vlayh2KSB7XG5cdFx0cmV0dXJuIHRoaXMuY3VycmVudFRpbWUodik7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBbUmUtbG9hZHMgdGhlIGF1ZGlvL3ZpZGVvIGVsZW1lbnQsIHVwZGF0ZSB0aGUgYXVkaW8vdmlkZW8gZWxlbWVudCBhZnRlciBjaGFuZ2luZyB0aGUgc291cmNlIG9yIG90aGVyIHNldHRpbmdzXVxuXHQgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGxvYWQodikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuc3JjKHYpO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhLmxvYWQoKTtcblx0fVxuXG5cdGR1cmF0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmR1cmF0aW9uO1xuXHR9XG5cblx0dm9sdW1lKHYpIHtcblx0XHQvLyBSZXR1cm4gY3VycmVudCB2b2x1bWUgaWYgdmFsdWUgXG5cdFx0aWYgKHYgPT09IG51bGwgfHwgaXNOYU4odikpIHtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZvbHVtZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiAxKSB7XG5cdFx0XHR2ID0gMTtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS52b2x1bWUgPSB2O1xuXHRcdHJldHVybiB2O1xuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCl7XG5cdGxldCBzY2FsZSA9IDA7XG5cdGxldCBib3VuZHMgPSBmdW5jdGlvbihlbCwgdXBkYXRlU2NhbGUpIHtcblx0XHRpZiggdXBkYXRlU2NhbGUgIT09IHVuZGVmaW5lZCkgc2NhbGUgPSB1cGRhdGVTY2FsZTtcblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdHdyYXBwZXJXaWR0aDogZWwub2Zmc2V0V2lkdGgsXG5cdFx0XHR3cmFwcGVySGVpZ2h0OiBlbC5vZmZzZXRIZWlnaHQsXG5cdFx0XHRzY2FsZTogc2NhbGUgfHwgKGVsLndpZHRoL2VsLmhlaWdodCksXG5cdFx0XHR3aWR0aDogMCxcblx0XHRcdGhlaWdodDogMCxcblx0XHRcdG9mZnNldFg6IDAsXG5cdFx0XHRvZmZzZXRZOiAwXG5cdFx0fVxuXHRcdGRhdGFbJ3dyYXBwZXJTY2FsZSddID0gZGF0YS53cmFwcGVyV2lkdGggLyBkYXRhLndyYXBwZXJIZWlnaHQ7XG5cdFx0aWYgKGRhdGEud3JhcHBlclNjYWxlID4gZGF0YS5zY2FsZSkge1xuXHRcdFx0ZGF0YS5oZWlnaHQgPSBkYXRhLndyYXBwZXJIZWlnaHQ7XG5cdFx0XHRkYXRhLndpZHRoID0gZGF0YS5zY2FsZSAqIGRhdGEuaGVpZ2h0O1xuXHRcdFx0ZGF0YS5vZmZzZXRYID0gKGRhdGEud3JhcHBlcldpZHRoIC0gZGF0YS53aWR0aCkgLyAyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkYXRhLndpZHRoID0gZGF0YS53cmFwcGVyV2lkdGg7XG5cdFx0XHRkYXRhLmhlaWdodCA9IGRhdGEud2lkdGggLyBkYXRhLnNjYWxlO1xuXHRcdFx0ZGF0YS5vZmZzZXRZID0gKGRhdGEud3JhcHBlckhlaWdodCAtIGRhdGEuaGVpZ2h0KSAvIDI7XG5cdFx0fVxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cdHJldHVybiBib3VuZHM7XG59KSgpOyIsInZhciBfZG9jID0gZG9jdW1lbnQgfHwge307XG4vLyBTZXQgdGhlIG5hbWUgb2YgdGhlIGhpZGRlbiBwcm9wZXJ0eSBhbmQgdGhlIGNoYW5nZSBldmVudCBmb3IgdmlzaWJpbGl0eVxudmFyIGhpZGRlbiwgdmlzaWJpbGl0eUNoYW5nZTtcbmlmICh0eXBlb2YgX2RvYy5oaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gT3BlcmEgMTIuMTAgYW5kIEZpcmVmb3ggMTggYW5kIGxhdGVyIHN1cHBvcnQgXG5cdGhpZGRlbiA9IFwiaGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcInZpc2liaWxpdHljaGFuZ2VcIjtcbn0gZWxzZSBpZiAodHlwZW9mIF9kb2MubW96SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwibW96SGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1venZpc2liaWxpdHljaGFuZ2VcIjtcbn0gZWxzZSBpZiAodHlwZW9mIF9kb2MubXNIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aGlkZGVuID0gXCJtc0hpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJtc3Zpc2liaWxpdHljaGFuZ2VcIjtcbn0gZWxzZSBpZiAodHlwZW9mIF9kb2Mud2Via2l0SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwid2Via2l0SGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIjtcbn1cblxuY29uc3QgaXNBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICEodHlwZW9mIF9kb2NbaGlkZGVuXSA9PT0gXCJ1bmRlZmluZWRcIik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhZ2VWaXNpYmlsaXR5KF9tZWRpYSwgc2V0dGluZ3MgPSB7fSkge1xuXHRsZXQgX2F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlKCk7XG5cdGlmIChfYXZhaWxhYmxlKSB7XG5cdFx0bGV0IF9lbmFibGVkID0gZmFsc2U7XG5cdFx0bGV0IF9wbGF5aW5nID0gZmFsc2U7XG5cdFx0bGV0IHBhdXNlZCA9IGZhbHNlO1xuXHRcdGxldCBzZXRGbGFnUGxheWluZyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0X3BsYXlpbmcgPSB0cnVlO1xuXHRcdH07XG5cdFx0bGV0IGV2ZW50cyA9IHtcblx0XHRcdHZpc2libGU6IGZ1bmN0aW9uKCl7fSxcblx0XHRcdGhpZGRlbjogZnVuY3Rpb24oKXt9XG5cdFx0fTtcblx0XHRsZXQgZGVzdHJveVZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcblx0XHRcdGV2ZW50cyA9IHtcblx0XHRcdFx0dmlzaWJsZTogZnVuY3Rpb24oKXt9LFxuXHRcdFx0XHRoaWRkZW46IGZ1bmN0aW9uKCl7fVxuXHRcdFx0fTtcblx0XHRcdF9lbmFibGVkID0gZmFsc2U7XG5cdFx0XHRfcGxheWluZyA9IGZhbHNlO1xuXHRcdFx0X2RvYy5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdF9tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdH1cblx0XHRsZXQgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKF9lbmFibGVkKSB7XG5cdFx0XHRcdGlmIChfZG9jW2hpZGRlbl0pIHtcblx0XHRcdFx0XHRpZiAoX3BsYXlpbmcgJiYgIV9tZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdF9tZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnRzLmhpZGRlbigpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChwYXVzZWQgJiYgX21lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0X21lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudHMudmlzaWJsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBpbml0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uIGluaXRWaXNpYmlsaXR5KHNldHRpbmdzKSB7XG5cdFx0XHRpZiAoX2F2YWlsYWJsZSkge1xuXHRcdFx0XHRfZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdFx0XHRfbWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHRcdFx0XG5cdFx0XHRcdGV2ZW50cy52aXNpYmxlID0gc2V0dGluZ3Mub25WaXNpYmxlIHx8IGV2ZW50cy52aXNpYmxlO1xuXHRcdFx0XHRldmVudHMuaGlkZGVuID0gc2V0dGluZ3Mub25IaWRkZW4gfHwgZXZlbnRzLmhpZGRlbjtcblx0XHRcdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHRfZG9jLmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdFx0XHRfbWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZXZlbnRzLnZpc2libGUgPSBzZXR0aW5ncy5vblZpc2libGUgfHwgZXZlbnRzLnZpc2libGU7XG5cdFx0ZXZlbnRzLmhpZGRlbiA9IHNldHRpbmdzLm9uSGlkZGVuIHx8IGV2ZW50cy5oaWRkZW47XG5cdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdF9kb2MuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0X21lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cblx0XHR0aGlzLmluaXQgPSBpbml0VmlzaWJpbGl0eTtcblx0XHR0aGlzLmRlc3Ryb3kgPSBkZXN0cm95VmlzaWJpbGl0eTtcblx0XHR0aGlzLm9uID0gZnVuY3Rpb24oZXZlbnQsZm4pIHtcblx0XHRcdGlmIChldmVudCBpbiBldmVudHMpIGV2ZW50c1tldmVudF0gPSBmbjtcblx0XHR9O1xuXHRcdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSBfZW5hYmxlZCA9IHY7XG5cdFx0XHRyZXR1cm4gX2VuYWJsZWQ7XG5cdFx0fVxuXHR9O1xufTsiLCJsZXQgX2RvYyA9IGRvY3VtZW50IHx8IHt9O1xubGV0IGV4dGVybmFsQ29udHJvbHMgPSBmdW5jdGlvbihlbCkge1xuXHRsZXQgX2VuYWJsZWQgPSB0cnVlO1xuXHRsZXQgX3NlZWsgPSB0cnVlO1xuXHRsZXQgX3RJZCA9IG51bGw7XG5cdGxldCBtZWRpYSA9IGVsO1xuXHRsZXQga2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoX2VuYWJsZWQpIHtcblx0XHRcdC8vYnlwYXNzIGRlZmF1bHQgbmF0aXZlIGV4dGVybmFsIGNvbnRyb2xzIHdoZW4gbWVkaWEgaXMgZm9jdXNlZFxuXHRcdFx0bWVkaWEucGFyZW50Tm9kZS5mb2N1cygpO1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzMikgeyAvL3NwYWNlXG5cdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKF9zZWVrKSB7XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzcpIHsgLy9sZWZ0XG5cdFx0XHRcdFx0bWVkaWEuY3VycmVudFRpbWUgPSBtZWRpYS5jdXJyZW50VGltZSAtIDU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzkpIHsgLy9yaWdodFxuXHRcdFx0XHRcdG1lZGlhLmN1cnJlbnRUaW1lID0gbWVkaWEuY3VycmVudFRpbWUgKyA1O1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOCkgeyAvL3VwXG5cdFx0XHRcdGxldCB2ID0gbWVkaWEudm9sdW1lO1xuXHRcdFx0XHR2ICs9IC4xO1xuXHRcdFx0XHRpZiAodiA+IDEpIHYgPSAxO1xuXHRcdFx0XHRtZWRpYS52b2x1bWUgPSB2O1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNDApIHsgLy9kb3duXG5cdFx0XHRcdGxldCB2ID0gbWVkaWEudm9sdW1lO1xuXHRcdFx0XHR2IC09IC4xO1xuXHRcdFx0XHRpZiAodiA8IDApIHYgPSAwO1xuXHRcdFx0XHRtZWRpYS52b2x1bWUgPSB2O1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvKmlmIChzZWxmLmNvbnRyb2xCYXIpIHtcblx0XHRcdFx0aWYgKHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uKSB7XG5cdFx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzgpIHtcblxuXHRcdFx0XHRcdFx0c2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24ubWVudUNvbnRlbnQuZWxfLmNsYXNzTmFtZSA9IFwidmpzLW1lbnUgc2hvd1wiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSovXG5cdFx0fVxuXHR9O1xuXG5cdC8vIHRoaXMub25TcGFjZSA9IGZ1bmN0aW9uKCkge1xuXG5cdC8vIH07XG5cblx0bGV0IGtleXVwID0gZnVuY3Rpb24oZSkge1xuXHRcdGlmIChfZW5hYmxlZCkge1x0XHRcdFxuXHRcdFx0Ly8gaWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzgpIHtcblx0XHRcdC8vIFx0Y2xlYXJJbnRlcnZhbChfdElkKTtcblx0XHRcdC8vIFx0aWYgKHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uKSB7XG5cdFx0XHQvLyBcdFx0X3RJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBcdFx0XHRzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbi5tZW51Q29udGVudC5lbF8uY2xhc3NOYW1lID0gXCJ2anMtbWVudVwiO1xuXHRcdFx0Ly8gXHRcdH0sIDUwMCk7XG5cdFx0XHQvLyBcdH1cblx0XHRcdC8vIH1cblx0XHR9XG5cdH07XG5cdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKGIpIHtcblx0XHRpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gX2VuYWJsZWQ7XG5cdFx0X2VuYWJsZWQgPSBiO1xuXG5cdH07XG5cdHRoaXMuc2Vla0VuYWJsZWQgPSBmdW5jdGlvbihiKSB7XG5cdFx0aWYgKGIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIF9zZWVrO1xuXHRcdF9zZWVrID0gYjtcblx0fTtcblx0dGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdF90SWQgPSBudWxsO1xuXHRcdF9zZWVrID0gdHJ1ZTtcblx0XHRfZG9jLmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdF9kb2MuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwLmJpbmQodGhpcyksIGZhbHNlKTtcblx0fTtcblx0dGhpcy5kZXN0cm95ID0gIGZ1bmN0aW9uKCkge1xuXHRcdF9lbmFibGVkID0gZmFsc2U7XG5cdFx0X3RJZCA9IG51bGw7XG5cdFx0X3NlZWsgPSB0cnVlO1xuXHRcdF9kb2MuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bik7XG5cdFx0X2RvYy5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXApO1xuXHR9XG5cdHRoaXMuaW5pdCgpO1xufVxuZXhwb3J0IGRlZmF1bHQgZXh0ZXJuYWxDb250cm9sczsiLCIvL2h0dHBzOi8vZ2l0aHViLmNvbS9mZGFjaXVrL2FqYXhcbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcbiAgICB2YXIgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZSddXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBvcHRpb25zLmJhc2VVcmwgPSBvcHRpb25zLmJhc2VVcmwgfHwgJydcbiAgICBpZiAob3B0aW9ucy5tZXRob2QgJiYgb3B0aW9ucy51cmwpIHtcbiAgICAgIHJldHVybiB4aHJDb25uZWN0aW9uKFxuICAgICAgICBvcHRpb25zLm1ldGhvZCxcbiAgICAgICAgb3B0aW9ucy5iYXNlVXJsICsgb3B0aW9ucy51cmwsXG4gICAgICAgIG1heWJlRGF0YShvcHRpb25zLmRhdGEpLFxuICAgICAgICBvcHRpb25zXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBtZXRob2RzLnJlZHVjZShmdW5jdGlvbihhY2MsIG1ldGhvZCkge1xuICAgICAgYWNjW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHhockNvbm5lY3Rpb24oXG4gICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgIG9wdGlvbnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICBtYXliZURhdGEoZGF0YSksXG4gICAgICAgICAgb3B0aW9uc1xuICAgICAgICApXG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwge30pXG4gIH1cblxuICBmdW5jdGlvbiBtYXliZURhdGEoZGF0YSkge1xuICAgIHJldHVybiBkYXRhIHx8IG51bGxcbiAgfVxuXG4gIGZ1bmN0aW9uIHhockNvbm5lY3Rpb24odHlwZSwgdXJsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgdmFyIHJldHVybk1ldGhvZHMgPSBbJ3RoZW4nLCAnY2F0Y2gnLCAnYWx3YXlzJ11cbiAgICB2YXIgcHJvbWlzZU1ldGhvZHMgPSByZXR1cm5NZXRob2RzLnJlZHVjZShmdW5jdGlvbihwcm9taXNlLCBtZXRob2QpIHtcbiAgICAgIHByb21pc2VbbWV0aG9kXSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHByb21pc2VbbWV0aG9kXSA9IGNhbGxiYWNrXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH0sIHt9KVxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHhoci5vcGVuKHR5cGUsIHVybCwgdHJ1ZSlcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnd2l0aENyZWRlbnRpYWxzJylcbiAgICBzZXRIZWFkZXJzKHhociwgb3B0aW9ucy5oZWFkZXJzKVxuICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgcmVhZHkocHJvbWlzZU1ldGhvZHMsIHhociksIGZhbHNlKVxuICAgIHhoci5zZW5kKG9iamVjdFRvUXVlcnlTdHJpbmcoZGF0YSkpXG4gICAgcHJvbWlzZU1ldGhvZHMuYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB4aHIuYWJvcnQoKVxuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZU1ldGhvZHNcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhlYWRlcnMoeGhyLCBoZWFkZXJzKSB7XG4gICAgaGVhZGVycyA9IGhlYWRlcnMgfHwge31cbiAgICBpZiAoIWhhc0NvbnRlbnRUeXBlKGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgfVxuICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgKGhlYWRlcnNbbmFtZV0gJiYgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgaGVhZGVyc1tuYW1lXSkpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc0NvbnRlbnRUeXBlKGhlYWRlcnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoaGVhZGVycykuc29tZShmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJ1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkeShwcm9taXNlTWV0aG9kcywgeGhyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZVJlYWR5KCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSB4aHIuRE9ORSkge1xuICAgICAgICB4aHIucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGhhbmRsZVJlYWR5LCBmYWxzZSlcbiAgICAgICAgcHJvbWlzZU1ldGhvZHMuYWx3YXlzLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpXG5cbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICBwcm9taXNlTWV0aG9kcy50aGVuLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvbWlzZU1ldGhvZHMuY2F0Y2guYXBwbHkocHJvbWlzZU1ldGhvZHMsIHBhcnNlUmVzcG9uc2UoeGhyKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UoeGhyKSB7XG4gICAgdmFyIHJlc3VsdFxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzdWx0ID0geGhyLnJlc3BvbnNlVGV4dFxuICAgIH1cbiAgICByZXR1cm4gW3Jlc3VsdCwgeGhyXVxuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0VG9RdWVyeVN0cmluZyhkYXRhKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGRhdGEpID8gZ2V0UXVlcnlTdHJpbmcoZGF0YSkgOiBkYXRhXG4gIH1cblxuICBmdW5jdGlvbiBpc09iamVjdChkYXRhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRhKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nKG9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLnJlZHVjZShmdW5jdGlvbihhY2MsIGl0ZW0pIHtcbiAgICAgIHZhciBwcmVmaXggPSAhYWNjID8gJycgOiBhY2MgKyAnJidcbiAgICAgIHJldHVybiBwcmVmaXggKyBlbmNvZGUoaXRlbSkgKyAnPScgKyBlbmNvZGUob2JqZWN0W2l0ZW1dKVxuICAgIH0sICcnKVxuICB9XG5cbiAgZnVuY3Rpb24gZW5jb2RlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSlcbiAgfVxuXG4gIHJldHVybiBhamF4XG59KSgpOyIsImltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQgeyBjYXBpdGFsaXplRmlyc3RMZXR0ZXIsIHNjYWxlRm9udCwgZGVib3VuY2UgfSBmcm9tICcuL2hlbHBlcnMvdXRpbHMnO1xuaW1wb3J0IGRvbSBmcm9tICcuL2hlbHBlcnMvZG9tJztcbmltcG9ydCBhdXRvRm9udCBmcm9tICcuL2NvcmUvYXV0b0ZvbnQnO1xuaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL2NvcmUvY29udGFpbmVyL2NvbnRhaW5lcic7XG5pbXBvcnQgTWVkaWEgZnJvbSAnLi9jb3JlL21lZGlhL2luZGV4JztcbmltcG9ydCBjb250YWluZXJCb3VuZHMgZnJvbSAnLi9oZWxwZXJzL2NvbnRhaW5lckJvdW5kcyc7XG5pbXBvcnQgcGFnZVZpc2liaWxpdHkgZnJvbSAnLi9oZWxwZXJzL3BhZ2VWaXNpYmlsaXR5JztcbmltcG9ydCBleHRlcm5hbENvbnRyb2xzIGZyb20gJy4vY29yZS9tZWRpYS9ldmVudHMvZXh0ZXJuYWxDb250cm9scyc7XG5pbXBvcnQgYWpheCBmcm9tICcuL2hlbHBlcnMvYWpheCc7XG5cbmNvbnN0IGZuX2NvbnRleHRtZW51ID0gZnVuY3Rpb24oZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgZGVmYXVsdHMgPSB7XG5cdGRlZmF1bHRXaWR0aDogOTIwLFxuXHRkZWZhdWx0SGVpZ2h0OiA1MjAsXG5cdGF1dG9wbGF5OiBmYWxzZSxcblx0bG9vcDogZmFsc2UsXG5cdGNvbnRyb2xzOiBmYWxzZSxcblx0Zm9udDoge1xuXHRcdHJhdGlvOiAxLFxuXHRcdG1pbjogLjUsXG5cdFx0dW5pdHM6IFwiZW1cIlxuXHR9XG59O1xuXG5jbGFzcyBrbWxQbGF5ZXIgZXh0ZW5kcyBNZWRpYSB7XG5cdGNvbnN0cnVjdG9yKGVsLCBzZXR0aW5ncywgX2V2ZW50cywgYXBwKSB7XG5cdFx0c3VwZXIoZWwpO1xuXHRcdHRoaXMuX19zZXR0aW5ncyA9IGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRcdGRvbS5hZGRDbGFzcyhlbCwgXCJrbWxcIiArIGNhcGl0YWxpemVGaXJzdExldHRlcihlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSk7XG5cdFx0dGhpcy53cmFwcGVyID0gZG9tLndyYXAodGhpcy5tZWRpYSwgZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdGNsYXNzOiAna21sUGxheWVyJ1xuXHRcdH0pKTtcblx0XHRkb20udHJpZ2dlcldlYmtpdEhhcmR3YXJlQWNjZWxlcmF0aW9uKHRoaXMud3JhcHBlcik7XG5cblx0XHQvL2luaXRTZXR0aW5nc1xuXHRcdGZvcih2YXIgayBpbiB0aGlzLl9fc2V0dGluZ3Mpe1xuXHRcdFx0aWYodGhpc1trXSl7XG5cdFx0XHRcdGlmKGs9PT0nYXV0b3BsYXknICYmIHRoaXMuX19zZXR0aW5nc1trXSkge1xuXHRcdFx0XHRcdHRoaXMucGxheSgpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXNba10odGhpcy5fX3NldHRpbmdzW2tdKTtcblx0XHRcdH1cblx0XHRcdGlmKGsgPT09ICdjb250cm9scycgJiYgdGhpcy5fX3NldHRpbmdzW2tdID09PSBcIm5hdGl2ZVwiKSB7XG5cdFx0XHRcdHRoaXMubmF0aXZlQ29udHJvbHModHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly9pbml0UGFnZVZpc2liaWxpdHlcblx0XHR0aGlzLnBhZ2VWaXNpYmlsaXR5ID0gbmV3IHBhZ2VWaXNpYmlsaXR5KGVsKTtcblxuXHRcdC8vaW5pdGV4dGVybmFsQ29udHJvbHNcblx0XHR0aGlzLmV4dGVybmFsQ29udHJvbHMgPSBuZXcgZXh0ZXJuYWxDb250cm9scyhlbCk7XG5cblx0XHQvL2luaXRDb250YWluZXJzXG5cdFx0dGhpcy5jb250YWluZXJzID0gbmV3IENvbnRhaW5lcih0aGlzKTtcblxuXHRcdC8vYXV0b0ZPTlRcblx0XHRpZih0eXBlb2YgdGhpcy5fX3NldHRpbmdzLmZvbnQgPT09IFwiYm9vbGVhblwiICYmIHRoaXMuX19zZXR0aW5ncy5mb250KSB0aGlzLl9fc2V0dGluZ3MuZm9udCA9IGRlZmF1bHRzLmZvbnQ7XG5cdFx0dGhpcy5hdXRvRm9udCA9IG5ldyBhdXRvRm9udCh0aGlzLndyYXBwZXIsIHRoaXMuX19zZXR0aW5ncy5mb250LCB0aGlzKTtcblx0XHRpZih0aGlzLl9fc2V0dGluZ3MuZm9udCkgdGhpcy5hdXRvRm9udC5lbmFibGVkKHRydWUpO1xuXG5cdFx0Ly9pbml0Q2FsbGJhY2tFdmVudHNcblx0XHRmb3IgKHZhciBldnQgaW4gX2V2ZW50cykge1xuXHRcdFx0dGhpcy5vbihldnQsIF9ldmVudHNbZXZ0XSwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5vbignbG9hZGVkbWV0YWRhdGEnLCAoKT0+e1xuXHRcdFx0aWYodGhpcy5tZWRpYS53aWR0aCAhPSB0aGlzLm1lZGlhLnZpZGVvV2lkdGggfHwgdGhpcy5tZWRpYS5oZWlnaHQgIT0gdGhpcy5tZWRpYS52aWRlb0hlaWdodCl7XG5cdFx0XHRcdHRoaXMuZGVmYXVsdFdpZHRoKCk7XG5cdFx0XHRcdHRoaXMuZGVmYXVsdEhlaWdodCgpO1xuXHRcdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpPT57IHRoaXMuZW1pdCgncmVzaXplJyk7IH0sIGZhbHNlKTtcblxuXHRcdGlmKHR5cGVvZiBhcHAgPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0YXBwLmJpbmQodGhpcykoKTtcblx0XHR9XG5cdH1cblxuXHRjb250ZXh0TWVudSh2KXtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0diA/IHRoaXMubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmbl9jb250ZXh0bWVudSkgOiB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUpO1xuXHRcdH1cblx0fVxuXG5cdGFqYXgob3B0aW9ucykge1xuXHRcdHJldHVybiBhamF4KG9wdGlvbnMpO1xuXHR9XG5cblx0ZGVmYXVsdFdpZHRoKHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb1dpZHRoKSB7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdGhpcy5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEud2lkdGg7XG5cdH1cblxuXHRkZWZhdWx0SGVpZ2h0KHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb0hlaWdodCkge1xuXHRcdFx0dGhpcy5tZWRpYS5oZWlnaHQgPSB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9IZWlnaHQ7XG5cdFx0fVxuXHRcdGlmICghaXNOYU4odikpIHtcblx0XHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdFx0dGhpcy5tZWRpYS5oZWlnaHQgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5oZWlnaHQ7XG5cdH1cblxuXHRzY2FsZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5kZWZhdWx0V2lkdGgoKSAvIHRoaXMuZGVmYXVsdEhlaWdodCgpO1xuXHR9XG5cblx0Ym91bmRzKHYpIHtcblx0XHRsZXQgZGF0YSA9IGNvbnRhaW5lckJvdW5kcyh0aGlzLm1lZGlhKTtcblx0XHRpZiAoZGF0YVt2XSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZGF0YVt2XTtcblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG5cdHdpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnd2lkdGgnKTtcblx0fVxuXG5cdGhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ2hlaWdodCcpO1xuXHR9XG5cblx0b2Zmc2V0WCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ29mZnNldFgnKTtcblx0fVxuXG5cdG9mZnNldFkoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRZJyk7XG5cdH1cblxuXHR3cmFwcGVySGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdHdyYXBwZXJXaWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRXaWR0aDtcblx0fVxuXG5cdHdyYXBwZXJTY2FsZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRXaWR0aCAvIHRoaXMubWVkaWEub2Zmc2V0SGVpZ2h0O1xuXHR9XG5cblx0YWRkQ2xhc3ModiwgZWwpIHtcblx0XHRpZihlbCAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdGRvbS5hZGRDbGFzcyhlbCwgdik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGRvbS5hZGRDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHR9XG5cdHJlbW92ZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYoZWwgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRkb20ucmVtb3ZlQ2xhc3MoZWwsIHYpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodiAhPT0gJ2ttbFBsYXllcicpIHtcblx0XHRcdGRvbS5yZW1vdmVDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHRcdH1cblx0fVxuXHR0b2dnbGVDbGFzcyh2LCBlbCkge1xuXHRcdGlmKGVsICE9PSB1bmRlZmluZWQpe1xuXHRcdFx0ZG9tLnRvZ2dsZUNsYXNzKGVsLCB2KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHYgIT09ICdrbWxQbGF5ZXInKSB7XG5cdFx0XHRkb20udG9nZ2xlQ2xhc3ModGhpcy53cmFwcGVyLCB2KTtcblx0XHR9XG5cdH1cbn07XG5cbndpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obWVzc2FnZSwgc2NyaXB0VXJsLCBsaW5lLCBjb2x1bW4pIHtcbiAgICBjb25zb2xlLmxvZyhsaW5lLCBjb2x1bW4sIG1lc3NhZ2UpO1xuICAgIGFsZXJ0KGxpbmUgKyBcIjpcIiArY29sdW1uICtcIi1cIisgbWVzc2FnZSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBrbWxQbGF5ZXI7Il0s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