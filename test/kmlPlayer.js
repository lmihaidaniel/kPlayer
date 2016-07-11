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

    var device = {
      browser: function () {
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
      }(),
      isIE: function isIE() {
        if (this.browser[0] === 'IE') {
          return this.browser[1];
        }
        return false;
      },
      isFirefox: function isFirefox() {
        if (this.browser[0] === 'Firefox') {
          return this.browser[1];
        }
        return false;
      },
      isChrome: function isChrome() {
        if (this.browser[0] === 'Chrome') {
          return this.browser[1];
        }
        return false;
      },
      isSafari: function isSafari() {
        if (this.browser[0] === 'Safari') {
          return this.browser[1];
        }
        return false;
      },
      isTouch: 'ontouchstart' in document.documentElement,
      isIos: /(iPad|iPhone|iPod)/g.test(navigator.platform)
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
    	var parentWidth = ctx.videoWidth() || ctx.width || 0;
    	var parentHeight = ctx.videoHeight() || ctx.height || 0;
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
    			scale: ctx.width() / ctx.videoWidth(),
    			scaleY: ctx.width() / ctx.videoHeight()
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
    		ctx.on('videoResize', elDimension);
    	};
    };

    function ErrorFormatException(msg) {
    			try {
    						throw new Error(msg);
    			} catch (e) {
    						console.log(e.name + ': ' + e.message);
    						return;
    			}
    }

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

        Fullscreen.prototype.onFullscreenChange = function onFullscreenChange(evt) {
            console.log(this.wrapper);
            this.media.addEventListener(eventChange, function (e) {
                console.log(e);
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

        Fullscreen.prototype.requestFullWindow = function requestFullWindow(element) {
            if (this.isFullWindow() || this.isFullScreen()) {
                return;
            }
            if (typeof element === 'undefined') {
                element = this.wrapper;
            }
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
            this.isFullWindow = function () {
                return true;
            };
        };

        Fullscreen.prototype.requestFullScreen = function requestFullScreen(element) {
            if (typeof element === 'undefined') {
                element = this.wrapper;
            }
            if (supportsFullScreen) {
                this.scrollPosition.save();
                return prefixFS === '' ? element.requestFullScreen() : element[prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
            } else {
                this.requestFullWindow(element);
            }
        };

        Fullscreen.prototype.cancelFullWindow = function cancelFullWindow() {
            if (!this.isFullWindow() || this.isFullScreen()) {
                return;
            }
            for (var k in this.fullscreenElementStyle) {
                this._fullscreenElement.style[k] = this.fullscreenElementStyle[k];
            }
            this._fullscreenElement = null;
            this.isFullWindow = function () {
                return false;
            };
            this.emit('resize');
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

    		if (el == null) return possibleConstructorReturn(_this);
    		_this.device = device;
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
    				_this.videoWidth();
    				_this.videoHeight();
    				_this.emit('resize');
    				_this.emit('videoResize');
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
    		var data = containerBounds(this.media);
    		if (data[v] !== null) return data[v];
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
    		if (el != null) {
    			dom.addClass(el, v);
    			return;
    		}
    		dom.addClass(this.wrapper, v);
    	};

    	kmlPlayer.prototype.removeClass = function removeClass(v, el) {
    		if (el != null) {
    			dom.removeClass(el, v);
    			return;
    		}
    		if (v !== 'kmlPlayer') {
    			dom.removeClass(this.wrapper, v);
    		}
    	};

    	kmlPlayer.prototype.toggleClass = function toggleClass(v, el) {
    		if (el != null) {
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

    //disable on production
    if (device.isTouch) {
    	window.onerror = function (message, scriptUrl, line, column) {
    		console.log(line, column, message);
    		alert(line + ":" + column + "-" + message);
    	};
    }

    return kmlPlayer;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzL2RlZXBtZXJnZS5qcyIsIi4uL3NyYy9oZWxwZXJzL3V0aWxzLmpzIiwiLi4vc3JjL2hlbHBlcnMvZG9tLmpzIiwiLi4vc3JjL2hlbHBlcnMvZGV2aWNlLmpzIiwiLi4vc3JjL2NvcmUvYXV0b0ZvbnQuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvYWRhcHRpdmVTaXplUG9zLmpzIiwiLi4vc3JjL2NvcmUvY29udGFpbmVyL3JlbGF0aXZlU2l6ZVBvcy5qcyIsIi4uL3NyYy9jb3JlL2NvbnRhaW5lci9jb250YWluZXIuanMiLCIuLi9zcmMvaGVscGVycy9lcnJvci5qcyIsIi4uL3NyYy9jb3JlL21lZGlhL2V2ZW50cy9pbmRleC5qcyIsIi4uL3NyYy9oZWxwZXJzL3Njcm9sbFBvc2l0aW9uLmpzIiwiLi4vc3JjL2NvcmUvZnVsbHNjcmVlbi5qcyIsIi4uL3NyYy9oZWxwZXJzL2NhbmNlbFZpZGVvTmV0d29ya1JlcXVlc3QuanMiLCIuLi9zcmMvaGVscGVycy9taW1lVHlwZS5qcyIsIi4uL3NyYy9jb3JlL21lZGlhL2luZGV4LmpzIiwiLi4vc3JjL2hlbHBlcnMvY29udGFpbmVyQm91bmRzLmpzIiwiLi4vc3JjL2hlbHBlcnMvcGFnZVZpc2liaWxpdHkuanMiLCIuLi9zcmMvY29yZS9tZWRpYS9ldmVudHMvZXh0ZXJuYWxDb250cm9scy5qcyIsIi4uL3NyYy9oZWxwZXJzL2FqYXguanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCl7XG5cdGxldCBkZWVwbWVyZ2UgPSBmdW5jdGlvbih0YXJnZXQsIHNyYykge1xuXHRcdGlmKHNyYyl7XG5cdFx0ICAgIHZhciBhcnJheSA9IEFycmF5LmlzQXJyYXkoc3JjKTtcblx0XHQgICAgdmFyIGRzdCA9IGFycmF5ICYmIFtdIHx8IHt9O1xuXG5cdFx0ICAgIGlmIChhcnJheSkge1xuXHRcdCAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IFtdO1xuXHRcdCAgICAgICAgZHN0ID0gZHN0LmNvbmNhdCh0YXJnZXQpO1xuXHRcdCAgICAgICAgc3JjLmZvckVhY2goZnVuY3Rpb24oZSwgaSkge1xuXHRcdCAgICAgICAgICAgIGlmICh0eXBlb2YgZHN0W2ldID09PSAndW5kZWZpbmVkJykge1xuXHRcdCAgICAgICAgICAgICAgICBkc3RbaV0gPSBlO1xuXHRcdCAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGUgPT09ICdvYmplY3QnKSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtpXSA9IGRlZXBtZXJnZSh0YXJnZXRbaV0sIGUpO1xuXHRcdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdFx0ICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuaW5kZXhPZihlKSA9PT0gLTEpIHtcblx0XHQgICAgICAgICAgICAgICAgICAgIGRzdC5wdXNoKGUpO1xuXHRcdCAgICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgfSk7XG5cdFx0ICAgIH0gZWxzZSB7XG5cdFx0ICAgICAgICBpZiAodGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnKSB7XG5cdFx0ICAgICAgICAgICAgT2JqZWN0LmtleXModGFyZ2V0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2tleV0gPSB0YXJnZXRba2V5XTtcblx0XHQgICAgICAgICAgICB9KVxuXHRcdCAgICAgICAgfVxuXHRcdCAgICAgICAgT2JqZWN0LmtleXMoc3JjKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHQgICAgICAgICAgICBpZiAodHlwZW9mIHNyY1trZXldICE9PSAnb2JqZWN0JyB8fCAhc3JjW2tleV0pIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcblx0XHQgICAgICAgICAgICB9XG5cdFx0ICAgICAgICAgICAgZWxzZSB7XG5cdFx0ICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0W2tleV0pIHtcblx0XHQgICAgICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG5cdFx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IGRlZXBtZXJnZSh0YXJnZXRba2V5XSwgc3JjW2tleV0pO1xuXHRcdCAgICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgfSk7XG5cdFx0ICAgIH1cblx0XHQgICAgcmV0dXJuIGRzdDtcblx0ICAgIH1lbHNle1xuXHQgICAgXHRyZXR1cm4gdGFyZ2V0IHx8wqBbXTtcblx0ICAgIH1cblx0fVxuXHRyZXR1cm4gZGVlcG1lcmdlO1xufSkoKTsiLCJleHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHN0cmluZykge1xuXHRyZXR1cm4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmltKHN0cmluZykge1xuXHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoL15cXHMrfFxccyskL2dtLCAnJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2NlbnRGcm9tU3RyaW5nKHYpe1xuXHQgaWYodiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0bGV0IHQgPSBmYWxzZTtcblx0aWYodi5pbmRleE9mKXtcblx0XHRpZih2LmluZGV4T2YoJyUnKSA+IC0xKVxuXHRcdHtcblx0XHQgIHQgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKGZuLCBkZWxheSkge1xuXHR2YXIgdFxuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0Y2xlYXJUaW1lb3V0KHQpXG5cdFx0dCA9IHNldFRpbWVvdXQoZm4sIGRlbGF5KVxuXHR9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UGVyY2VudGFnZShjdXJyZW50LCBtYXgpIHtcblx0aWYgKGN1cnJlbnQgPT09IDAgfHwgbWF4ID09PSAwIHx8IGlzTmFOKGN1cnJlbnQpIHx8IGlzTmFOKG1heCkpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXHRyZXR1cm4gKChjdXJyZW50IC8gbWF4KSAqIDEwMCkudG9GaXhlZCgyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRCaW5hcnlmdW5jdGlvbigpIHtcblx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9TZWNvbmRzKHQpIHtcblx0dmFyIHMgPSAwLjA7XG5cdGlmICh0KSB7XG5cdFx0dmFyIHAgPSB0LnNwbGl0KCc6Jyk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKVxuXHRcdFx0cyA9IHMgKiA2MCArIHBhcnNlRmxvYXQocFtpXS5yZXBsYWNlKCcsJywgJy4nKSlcblx0fVxuXHRyZXR1cm4gcztcbn1cblxuLyoqXG4gKiBGYXN0ZXIgU3RyaW5nIHN0YXJ0c1dpdGggYWx0ZXJuYXRpdmVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc3JjIC0gc291cmNlIHN0cmluZ1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzdHIgLSB0ZXN0IHN0cmluZ1xuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRzV2l0aChzcmMsIHN0cikge1xuICByZXR1cm4gc3JjLnNsaWNlKDAsIHN0ci5sZW5ndGgpID09PSBzdHJcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIHN0cmluZ1xuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmcodikge1xuICByZXR1cm4gKHR5cGVvZiB2ID09PSAnc3RyaW5nJyk7XG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBudW1lcmljXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc051bWVyaWModil7XG4gIHJldHVybiAhaXNOYU4odik7XG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBzdHJpY3QgbnVtZXJpY1xuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpY3ROdW1lcmljKHYpe1xuICByZXR1cm4gKGlzTmFOKHYpICYmIHR5cGVvZiB2ID09PSAnbnVtYmVyJylcbn1cblxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgYm9vbGVhblxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNCb29sZWFuKHYpe1xuICByZXR1cm4gKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpO1xufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgZnVuY3Rpb25cbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09ICdmdW5jdGlvbicgfHwgZmFsc2UgICAvLyBhdm9pZCBJRSBwcm9ibGVtc1xufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGFuIG9iamVjdCwgZXhjbHVkZSBudWxsLlxuICogTk9URTogVXNlIGlzT2JqZWN0KHgpICYmICFpc0FycmF5KHgpIHRvIGV4Y2x1ZGVzIGFycmF5cy5cbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHYpIHtcbiAgcmV0dXJuIHYgJiYgdHlwZW9mIHYgPT09ICdvYmplY3QnICAgICAgICAgLy8gdHlwZW9mIG51bGwgaXMgJ29iamVjdCdcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIGtpbmQgb2YgYXJyYXlcbiAqIEBwYXJhbSAgIHsgKiB9IGEgLSBhbnl0aGluZ1xuICogQHJldHVybnMge0Jvb2xlYW59IGlzICdhJyBhbiBhcnJheT9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkoYSkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShhKSB8fCBhIGluc3RhbmNlb2YgQXJyYXkgfVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gYXJyYXkgY29udGFpbnMgYW4gaXRlbVxuICogQHBhcmFtICAgeyBBcnJheSB9IGFyciAtIHRhcmdldCBhcnJheVxuICogQHBhcmFtICAgeyAqIH0gaXRlbSAtIGl0ZW0gdG8gdGVzdFxuICogQHJldHVybnMgeyBCb29sZWFuIH0gRG9lcyAnYXJyJyBjb250YWluICdpdGVtJz9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zKGFyciwgaXRlbSkge1xuICByZXR1cm4gYXJyLmluZGV4T2YoaXRlbSkgPiAtMTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gc2V0IGFuIGltbXV0YWJsZSBwcm9wZXJ0eVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBlbCAtIG9iamVjdCB3aGVyZSB0aGUgbmV3IHByb3BlcnR5IHdpbGwgYmUgc2V0XG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IGtleSAtIG9iamVjdCBrZXkgd2hlcmUgdGhlIG5ldyBwcm9wZXJ0eSB3aWxsIGJlIHN0b3JlZFxuICogQHBhcmFtICAgeyAqIH0gdmFsdWUgLSB2YWx1ZSBvZiB0aGUgbmV3IHByb3BlcnR5XG4qIEBwYXJhbSAgIHsgT2JqZWN0IH0gb3B0aW9ucyAtIHNldCB0aGUgcHJvcGVyeSBvdmVycmlkaW5nIHRoZSBkZWZhdWx0IG9wdGlvbnNcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gLSB0aGUgaW5pdGlhbCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGVsLCBrZXksIHZhbHVlLCBvcHRpb25zKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbCwga2V5LCBleHRlbmQoe1xuICAgIHZhbHVlOiB2YWx1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0sIG9wdGlvbnMpKVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBEZXRlY3Qgd2hldGhlciBhIHByb3BlcnR5IG9mIGFuIG9iamVjdCBjb3VsZCBiZSBvdmVycmlkZGVuXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9ICBvYmogLSBzb3VyY2Ugb2JqZWN0XG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICBrZXkgLSBvYmplY3QgcHJvcGVydHlcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IGlzIHRoaXMgcHJvcGVydHkgd3JpdGFibGU/XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1dyaXRhYmxlKG9iaiwga2V5KSB7XG4gIHZhciBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpXG4gIHJldHVybiB0eXBlb2Ygb2JqW2tleV0gPT09IFRfVU5ERUYgfHwgcHJvcHMgJiYgcHJvcHMud3JpdGFibGVcbn1cblxuLyoqXG4gKiBFeHRlbmQgYW55IG9iamVjdCB3aXRoIG90aGVyIHByb3BlcnRpZXNcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gc3JjIC0gc291cmNlIG9iamVjdFxuICogQHJldHVybnMgeyBPYmplY3QgfSB0aGUgcmVzdWx0aW5nIGV4dGVuZGVkIG9iamVjdFxuICpcbiAqIHZhciBvYmogPSB7IGZvbzogJ2JheicgfVxuICogZXh0ZW5kKG9iaiwge2JhcjogJ2JhcicsIGZvbzogJ2Jhcid9KVxuICogY29uc29sZS5sb2cob2JqKSA9PiB7YmFyOiAnYmFyJywgZm9vOiAnYmFyJ31cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQoc3JjKSB7XG4gIHZhciBvYmosIGFyZ3MgPSBhcmd1bWVudHNcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG9iaiA9IGFyZ3NbaV0pIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhpcyBwcm9wZXJ0eSBvZiB0aGUgc291cmNlIG9iamVjdCBjb3VsZCBiZSBvdmVycmlkZGVuXG4gICAgICAgIGlmIChpc1dyaXRhYmxlKHNyYywga2V5KSlcbiAgICAgICAgICBzcmNba2V5XSA9IG9ialtrZXldXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzcmNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlRm9udChmLCB3aWR0aCwgZWwpIHtcblx0dmFyIHIgPSBmYWxzZSwgbCA9IGZhbHNlO1xuXHRpZihmLnVuaXRzICE9ICdweCcpIGYudW5pdHMgPSAnZW0nO1xuXHRpZiAoZi5taW4gIT09IGZhbHNlICYmIGYucmF0aW8gIT09IGZhbHNlKSB7XG5cdFx0ciA9IGYucmF0aW8gKiB3aWR0aCAvIDEwMDA7XG5cdFx0aWYgKHIgPCBmLm1pbikgciA9IGYubWluO1xuXHRcdGlmIChmLnVuaXRzID09ICdweCcpIHIgPSBNYXRoLmNlaWwocik7XG5cdFx0aWYgKCFpc05hTihmLmxpbmVIZWlnaHQpICYmIGYubGluZUhlaWdodCkge1xuXHRcdFx0bCA9IHIgKiBmLmxpbmVIZWlnaHQ7XG5cdFx0XHRpZiAobCA8IDEpIGwgPSAxO1xuXHRcdFx0bCA9ICtsLnRvRml4ZWQoMykgKyBmLnVuaXRzO1xuXHRcdH1cblx0XHRyID0gK3IudG9GaXhlZCgzKSArIGYudW5pdHM7XG5cdH1cblx0aWYoZWwpe1xuXHRcdGlmKHIpIGVsLnN0eWxlLmZvbnRTaXplID0gcjtcblx0XHRpZihsKSBlbC5zdHlsZS5saW5lSGVpZ2h0ID0gbDtcblx0fVxuXHRyZXR1cm4ge2ZvbnRTaXplOiByLCBsaW5lSGVpZ2h0OiBsfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHt9OyIsIi8qKlxuICogQG1vZHVsZSBkb21cbiAqIE1vZHVsZSBmb3IgZWFzaW5nIHRoZSBtYW5pcHVsYXRpb24gb2YgZG9tIGVsZW1lbnRzXG4gKi9cblxubGV0IGNsYXNzUmVnID0gZnVuY3Rpb24oYykge1xuXHRyZXR1cm4gbmV3IFJlZ0V4cChcIihefFxcXFxzKylcIiArIGMgKyBcIihcXFxccyt8JClcIik7XG59O1xuXG5sZXQgaGFzQ2xhc3NcbmxldCBhZGRDbGFzc1xubGV0IHJlbW92ZUNsYXNzO1xubGV0IHRvZ2dsZUNsYXNzO1xuXG5pZiAoJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG5cdGhhc0NsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdHJldHVybiBlbGVtLmNsYXNzTGlzdC5jb250YWlucyhjKTtcblx0fTtcblx0YWRkQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0YyA9IGMuc3BsaXQoJyAnKTtcblx0XHRmb3IgKHZhciBrIGluIGMpIGVsZW0uY2xhc3NMaXN0LmFkZChjW2tdKTtcblx0fTtcblx0cmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0ZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuXHR9O1xufSBlbHNlIHtcblx0aGFzQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0cmV0dXJuIGNsYXNzUmVnKGMpLnRlc3QoZWxlbS5jbGFzc05hbWUpO1xuXHR9O1xuXHRhZGRDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRpZiAoIWhhc0NsYXNzKGVsZW0sIGMpKSB7XG5cdFx0XHRlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lICsgJyAnICsgYztcblx0XHR9XG5cdH07XG5cdHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUucmVwbGFjZShjbGFzc1JlZyhjKSwgJyAnKTtcblx0fTtcbn1cblxudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdHZhciBmbiA9IGhhc0NsYXNzKGVsZW0sIGMpID8gcmVtb3ZlQ2xhc3MgOiBhZGRDbGFzcztcblx0Zm4oZWxlbSwgYyk7XG59O1xuXG5sZXQgZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lID0gZnVuY3Rpb24gZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKHByb3BOYW1lKSB7XG5cdHZhciBkb21QcmVmaXhlcyA9ICdXZWJraXQgTW96IG1zIE8nLnNwbGl0KCcgJyksXG5cdFx0ZWxTdHlsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZTtcblx0aWYgKGVsU3R5bGVbcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcm9wTmFtZTsgLy8gSXMgc3VwcG9ydGVkIHVucHJlZml4ZWRcblx0cHJvcE5hbWUgPSBwcm9wTmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BOYW1lLnN1YnN0cigxKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkb21QcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChlbFN0eWxlW2RvbVByZWZpeGVzW2ldICsgcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBkb21QcmVmaXhlc1tpXSArIHByb3BOYW1lOyAvLyBJcyBzdXBwb3J0ZWQgd2l0aCBwcmVmaXhcblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0c3R5bGVQcmVmaXg6IHtcblx0XHR0cmFuc2Zvcm06IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgndHJhbnNmb3JtJyksXG5cdFx0cGVyc3BlY3RpdmU6IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgncGVyc3BlY3RpdmUnKSxcblx0XHRiYWNrZmFjZVZpc2liaWxpdHk6IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgnYmFja2ZhY2VWaXNpYmlsaXR5Jylcblx0fSxcblx0dHJpZ2dlcldlYmtpdEhhcmR3YXJlQWNjZWxlcmF0aW9uOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0aWYgKHRoaXMuc3R5bGVQcmVmaXguYmFja2ZhY2VWaXNpYmlsaXR5ICYmIHRoaXMuc3R5bGVQcmVmaXgucGVyc3BlY3RpdmUpIHtcblx0XHRcdGVsZW1lbnQuc3R5bGVbdGhpcy5zdHlsZVByZWZpeC5wZXJzcGVjdGl2ZV0gPSAnMTAwMHB4Jztcblx0XHRcdGVsZW1lbnQuc3R5bGVbdGhpcy5zdHlsZVByZWZpeC5iYWNrZmFjZVZpc2liaWxpdHldID0gJ2hpZGRlbic7XG5cdFx0fVxuXHR9LFxuXHR0cmFuc2Zvcm06IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XG5cdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LnRyYW5zZm9ybV0gPSB2YWx1ZTtcblx0fSxcblx0LyoqXG5cdCAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBtdWx0aXBsZSBub2RlcyBpbiB0aGUgRE9NXG5cdCAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSBET00gc2VsZWN0b3Jcblx0ICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0cyBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuXHQgKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlcyBmb3VuZFxuXHQgKi9cblx0c2VsZWN0QWxsOiBmdW5jdGlvbihzZWxlY3RvciwgY3R4KSB7XG5cdFx0cmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG5cdH0sXG5cdC8qKlxuXHQgKiBTaG9ydGVyIGFuZCBmYXN0IHdheSB0byBzZWxlY3QgYSBzaW5nbGUgbm9kZSBpbiB0aGUgRE9NXG5cdCAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSB1bmlxdWUgZG9tIHNlbGVjdG9yXG5cdCAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY3R4IC0gRE9NIG5vZGUgd2hlcmUgdGhlIHRhcmdldCBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuXHQgKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlIGZvdW5kXG5cdCAqL1xuXHRzZWxlY3Q6IGZ1bmN0aW9uKHNlbGVjdG9yLCBjdHgpIHtcblx0XHRyZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcilcblx0fSxcblx0aGFzQ2xhc3M6IGhhc0NsYXNzLFxuXHRhZGRDbGFzczogYWRkQ2xhc3MsXG5cdHJlbW92ZUNsYXNzOiByZW1vdmVDbGFzcyxcblx0dG9nZ2xlQ2xhc3M6IHRvZ2dsZUNsYXNzLFxuXHRhdXRvTGluZUhlaWdodDogZnVuY3Rpb24oZWwpIHtcblx0XHRsZXQgbCA9IGVsLm9mZnNldEhlaWdodCArIFwicHhcIjtcblx0XHRlbC5zdHlsZS5saW5lSGVpZ2h0ID0gbDtcblx0XHRyZXR1cm4gbDtcblx0fSxcblx0Y3JlYXRlRWxlbWVudDogZnVuY3Rpb24oZWxtLCBwcm9wcykge1xuXHRcdGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxtKTtcblx0XHRmb3IgKGxldCBrIGluIHByb3BzKSB7XG5cdFx0XHRlbC5zZXRBdHRyaWJ1dGUoaywgcHJvcHNba10pO1xuXHRcdH1cblx0XHRyZXR1cm4gZWw7XG5cdH0sXG5cdGVtcHR5RWxlbWVudDogZnVuY3Rpb24oZWxtKSB7XG5cdFx0d2hpbGUgKGVsbS5maXJzdENoaWxkKSB7XG5cdFx0XHRlbG0ucmVtb3ZlQ2hpbGQoZWxtLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0fSxcblx0cmVwbGFjZUVsZW1lbnQ6IGZ1bmN0aW9uKHRhcmdldCwgZWxtKSB7XG5cdFx0dGFyZ2V0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGVsbSwgdGFyZ2V0KTtcblx0fSxcblx0cmVtb3ZlRWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcblx0fSxcblx0aW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uKGVsLCByZWZlcmVuY2VOb2RlKSB7XG5cdFx0cmVmZXJlbmNlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZyk7XG5cdH0sXG5cdGluc2VydEJlZm9yZTogZnVuY3Rpb24oZWwsIHJlZmVyZW5jZU5vZGUpIHtcblx0XHRyZWZlcmVuY2VOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VOb2RlKTtcblx0fSxcblx0Z2V0VGV4dENvbnRlbnQ6IGZ1bmN0aW9uKGVsKSB7XG5cdFx0cmV0dXJuIGVsLnRleHRDb250ZW50IHx8IGVsLmlubmVyVGV4dDtcblx0fSxcblx0d3JhcDogZnVuY3Rpb24oZWxlbWVudHMsIHdyYXBwZXIpIHtcblx0XHQvLyBDb252ZXJ0IGBlbGVtZW50c2AgdG8gYW4gYXJyYXksIGlmIG5lY2Vzc2FyeS5cblx0XHRpZiAoIWVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0ZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuXHRcdH1cblxuXHRcdC8vIExvb3BzIGJhY2t3YXJkcyB0byBwcmV2ZW50IGhhdmluZyB0byBjbG9uZSB0aGUgd3JhcHBlciBvbiB0aGVcblx0XHQvLyBmaXJzdCBlbGVtZW50IChzZWUgYGNoaWxkYCBiZWxvdykuXG5cdFx0Zm9yICh2YXIgaSA9IGVsZW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHR2YXIgY2hpbGQgPSAoaSA+IDApID8gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSkgOiB3cmFwcGVyO1xuXHRcdFx0dmFyIGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcblxuXHRcdFx0Ly8gQ2FjaGUgdGhlIGN1cnJlbnQgcGFyZW50IGFuZCBzaWJsaW5nLlxuXHRcdFx0dmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0XHRcdHZhciBzaWJsaW5nID0gZWxlbWVudC5uZXh0U2libGluZztcblxuXHRcdFx0Ly8gV3JhcCB0aGUgZWxlbWVudCAoaXMgYXV0b21hdGljYWxseSByZW1vdmVkIGZyb20gaXRzIGN1cnJlbnRcblx0XHRcdC8vIHBhcmVudCkuXG5cdFx0XHRjaGlsZC5hcHBlbmRDaGlsZChlbGVtZW50KTtcblxuXHRcdFx0Ly8gSWYgdGhlIGVsZW1lbnQgaGFkIGEgc2libGluZywgaW5zZXJ0IHRoZSB3cmFwcGVyIGJlZm9yZVxuXHRcdFx0Ly8gdGhlIHNpYmxpbmcgdG8gbWFpbnRhaW4gdGhlIEhUTUwgc3RydWN0dXJlOyBvdGhlcndpc2UsIGp1c3Rcblx0XHRcdC8vIGFwcGVuZCBpdCB0byB0aGUgcGFyZW50LlxuXHRcdFx0aWYgKHNpYmxpbmcpIHtcblx0XHRcdFx0cGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgc2libGluZyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY2hpbGQ7XG5cdFx0fVxuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICBicm93c2VyOiAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5WZXIgPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbixcbiAgICAgIG5BZ3QgPSBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgYnJvd3Nlck5hbWUgPSBuYXZpZ2F0b3IuYXBwTmFtZSxcbiAgICAgIGZ1bGxWZXJzaW9uID0gJycgKyBwYXJzZUZsb2F0KG5hdmlnYXRvci5hcHBWZXJzaW9uKSxcbiAgICAgIG1ham9yVmVyc2lvbiA9IHBhcnNlSW50KG5hdmlnYXRvci5hcHBWZXJzaW9uLCAxMCksXG4gICAgICBuYW1lT2Zmc2V0LFxuICAgICAgdmVyT2Zmc2V0LFxuICAgICAgaXg7XG5cbiAgICAvLyBFREdFXG4gICAgaWYgKGJyb3dzZXJOYW1lID09IFwiTmV0c2NhcGVcIiAmJiBuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKCdUcmlkZW50JykgPiAtMSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIklFXCI7XG4gICAgICB2YXIgZWRnZSA9IG5BZ3QuaW5kZXhPZignRWRnZS8nKTtcbiAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcoZWRnZSArIDUsIG5BZ3QuaW5kZXhPZignLicsIGVkZ2UpKTtcbiAgICB9XG4gICAgLy8gTVNJRSAxMVxuICAgIGVsc2UgaWYgKChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiV2luZG93cyBOVFwiKSAhPT0gLTEpICYmIChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwicnY6MTFcIikgIT09IC0xKSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIklFXCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IFwiMTE7XCI7XG4gICAgfVxuICAgIC8vIE1TSUVcbiAgICBlbHNlIGlmICgodmVyT2Zmc2V0ID0gbkFndC5pbmRleE9mKFwiTVNJRVwiKSkgIT09IC0xKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiSUVcIjtcbiAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG4gICAgfVxuICAgIC8vIENocm9tZVxuICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJDaHJvbWVcIikpICE9PSAtMSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIkNocm9tZVwiO1xuICAgICAgZnVsbFZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcbiAgICB9XG4gICAgLy8gU2FmYXJpXG4gICAgZWxzZSBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZihcIlNhZmFyaVwiKSkgIT09IC0xKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiU2FmYXJpXCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuICAgICAgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJWZXJzaW9uXCIpKSAhPT0gLTEpIHtcbiAgICAgICAgZnVsbFZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRmlyZWZveFxuICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJGaXJlZm94XCIpKSAhPT0gLTEpIHtcbiAgICAgIGJyb3dzZXJOYW1lID0gXCJGaXJlZm94XCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuICAgIH1cbiAgICAvLyBJbiBtb3N0IG90aGVyIGJyb3dzZXJzLCBcIm5hbWUvdmVyc2lvblwiIGlzIGF0IHRoZSBlbmQgb2YgdXNlckFnZW50XG4gICAgZWxzZSBpZiAoKG5hbWVPZmZzZXQgPSBuQWd0Lmxhc3RJbmRleE9mKCcgJykgKyAxKSA8ICh2ZXJPZmZzZXQgPSBuQWd0Lmxhc3RJbmRleE9mKCcvJykpKSB7XG4gICAgICBicm93c2VyTmFtZSA9IG5BZ3Quc3Vic3RyaW5nKG5hbWVPZmZzZXQsIHZlck9mZnNldCk7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDEpO1xuICAgICAgaWYgKGJyb3dzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT0gYnJvd3Nlck5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgICBicm93c2VyTmFtZSA9IG5hdmlnYXRvci5hcHBOYW1lO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUcmltIHRoZSBmdWxsVmVyc2lvbiBzdHJpbmcgYXQgc2VtaWNvbG9uL3NwYWNlIGlmIHByZXNlbnRcbiAgICBpZiAoKGl4ID0gZnVsbFZlcnNpb24uaW5kZXhPZihcIjtcIikpICE9PSAtMSkge1xuICAgICAgZnVsbFZlcnNpb24gPSBmdWxsVmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICAgIH1cbiAgICBpZiAoKGl4ID0gZnVsbFZlcnNpb24uaW5kZXhPZihcIiBcIikpICE9PSAtMSkge1xuICAgICAgZnVsbFZlcnNpb24gPSBmdWxsVmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICAgIH1cbiAgICAvLyBHZXQgbWFqb3IgdmVyc2lvblxuICAgIG1ham9yVmVyc2lvbiA9IHBhcnNlSW50KCcnICsgZnVsbFZlcnNpb24sIDEwKTtcbiAgICBpZiAoaXNOYU4obWFqb3JWZXJzaW9uKSkge1xuICAgICAgZnVsbFZlcnNpb24gPSAnJyArIHBhcnNlRmxvYXQobmF2aWdhdG9yLmFwcFZlcnNpb24pO1xuICAgICAgbWFqb3JWZXJzaW9uID0gcGFyc2VJbnQobmF2aWdhdG9yLmFwcFZlcnNpb24sIDEwKTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGRhdGFcbiAgICByZXR1cm4gW2Jyb3dzZXJOYW1lLCBtYWpvclZlcnNpb25dO1xuICB9KSgpLFxuICBpc0lFOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5icm93c2VyWzBdID09PSAnSUUnKSB7XG4gICAgICByZXR1cm4gdGhpcy5icm93c2VyWzFdO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGlzRmlyZWZveDogZnVuY3Rpb24oKXtcbiAgICBpZiAodGhpcy5icm93c2VyWzBdID09PSAnRmlyZWZveCcpIHtcbiAgICAgIHJldHVybiB0aGlzLmJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgaXNDaHJvbWU6IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMuYnJvd3NlclswXSA9PT0gJ0Nocm9tZScpIHtcbiAgICAgIHJldHVybiB0aGlzLmJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgaXNTYWZhcmk6IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMuYnJvd3NlclswXSA9PT0gJ1NhZmFyaScpIHtcbiAgICAgIHJldHVybiB0aGlzLmJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgaXNUb3VjaDogJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICBpc0lvczogLyhpUGFkfGlQaG9uZXxpUG9kKS9nLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKVxufSIsImltcG9ydCB7c2NhbGVGb250LCBkZWJvdW5jZX0gZnJvbSAnLi4vaGVscGVycy91dGlscyc7XG5pbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4uL2hlbHBlcnMvZGVlcG1lcmdlJztcbmxldCBhdXRvRm9udCA9IGZ1bmN0aW9uKGVsLCBmb250LCBwYXJlbnQpIHtcblx0bGV0IF9lbmFibGVkID0gZmFsc2U7XG5cdGxldCBfdXBkYXRlID0gZnVuY3Rpb24oKXtcblx0XHRkZWJvdW5jZShmdW5jdGlvbigpe1xuXHRcdFx0c2NhbGVGb250KGZvbnQsIHBhcmVudC53aWR0aCgpLCBlbCk7XG5cdFx0fSwxMDApKCk7XG5cdH1cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbih2KSB7XG5cdFx0aWYodiAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdGlmKCFmb250KXsgZm9udCA9IHtyYXRpbzogMSwgbWluOjEsIGxpbmVIZWlnaHQ6IGZhbHNlfSB9XG5cdFx0XHRmb250ID0gZGVlcG1lcmdlKGZvbnQsIHYpO1xuXHRcdFx0cmV0dXJuIHNjYWxlRm9udChmb250LCBwYXJlbnQud2lkdGgoKSwgZWwpO1xuXHRcdH1cblx0fTtcblx0dGhpcy5lbmFibGVkID0gIGZ1bmN0aW9uKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJyAmJiBmb250KSB7XG5cdFx0XHRfZW5hYmxlZCA9IHY7XG5cdFx0XHQvLyB2ID8gKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSksIHNjYWxlRm9udChmb250LCBfd2lkdGgoKSwgZWwpKSA6IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSk7XG5cdFx0fVxuXHRcdHJldHVybiBfZW5hYmxlZDs7XG5cdH07XG5cdGlmKHBhcmVudC5vbil7XG5cdFx0cGFyZW50Lm9uKCdyZXNpemUnLCBfdXBkYXRlKTtcblx0fTtcbn1cbmV4cG9ydCBkZWZhdWx0IGF1dG9Gb250OyIsImltcG9ydCB7XG5cdHByb2NlbnRGcm9tU3RyaW5nLFxuXHRkZWJvdW5jZVxufSBmcm9tICcuLi8uLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkb20gZnJvbSAnLi4vLi4vaGVscGVycy9kb20nO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi8uLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5cbmxldCBkZWZhdWx0cyA9IHtcblx0eDogMCxcblx0eTogMCxcblx0d2lkdGg6ICcxMDAlJyxcblx0aGVpZ2h0OiAnMTAwJScsXG5cdGZvbnRTaXplOiBudWxsLFxuXHRsaW5lSGVpZ2h0OiBudWxsLFxuXHRvZmZzZXRYOiAwLFxuXHRvZmZzZXRZOiAwLFxuXHRvcmlnaW5Qb2ludDogXCJ0b3BMZWZ0XCIsXG5cdHZpc2libGU6IGZhbHNlLFxuXHR0cmFuc2Zvcm06IHtcblx0XHR4OiBudWxsLFxuXHRcdHk6IG51bGxcblx0fSxcblx0dHJhbnNsYXRlOiB0cnVlXG59XG5cbmxldCBhZGFwdGl2ZVNpemVQb3MgPSBmdW5jdGlvbihib3VuZHMsIHNldHR0aW5ncywgcGFyZW50KSB7XG5cdGxldCB2YXVsdCA9IHtcblx0XHR4OiAwLFxuXHRcdHk6IDAsXG5cdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRoZWlnaHQ6ICcxMDAlJyxcblx0XHRmb250U2l6ZTogbnVsbCxcblx0XHRsaW5lSGVpZ2h0OiBudWxsXG5cdH07XG5cdGxldCBwYXJlbnRXaWR0aCA9IDA7XG5cdGxldCBwYXJlbnRIZWlnaHQgPSAwO1xuXHRsZXQgcGFyZW50WCA9IDA7XG5cdGxldCBwYXJlbnRZID0gMDtcblx0bGV0IGRvbUVsZW1lbnQgPSBudWxsO1xuXHRsZXQgc2V0dGluZ3MgPSBkZWVwbWVyZ2UoZGVmYXVsdHMsIHNldHR0aW5ncyk7XG5cdGxldCBfYWN0aXZlID0gZmFsc2U7XG5cblx0bGV0IHVwZGF0ZURvbUVsZW1lbnQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoX2FjdGl2ZSAmJiBkb21FbGVtZW50ICYmIGRvbUVsZW1lbnQubm9kZVR5cGUpIHtcblx0XHRcdGlmICh2YXVsdC53aWR0aCAhPT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9IHZhdWx0LndpZHRoICsgXCJweFwiO1xuXHRcdFx0aWYgKHZhdWx0LmhlaWdodCAhPT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB2YXVsdC5oZWlnaHQgKyBcInB4XCI7XG5cblx0XHRcdGlmIChkb20uc3R5bGVQcmVmaXgudHJhbnNmb3JtICYmIHNldHRpbmdzLnRyYW5zbGF0ZSkge1xuXHRcdFx0XHRsZXQgdHJhbnNmb3JtID0gJyc7XG5cdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwgJiYgdmF1bHQueSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0dHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnICsgdmF1bHQueCArICdweCwnICsgdmF1bHQueSArICdweCknO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUucmlnaHQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmJvdHRvbSA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUudG9wID0gXCJhdXRvXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnJpZ2h0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgdmF1bHQueCArICdweCknO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodmF1bHQueSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmJvdHRvbSA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS50b3AgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdHRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKCcgKyB2YXVsdC55ICsgJ3B4KSc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGRvbS50cmFuc2Zvcm0oZG9tRWxlbWVudCwgdHJhbnNmb3JtKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwgJiYgdmF1bHQueSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gdmF1bHQueCArIFwicHhcIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9IHZhdWx0LnkgKyBcInB4XCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gdmF1bHQueCArIFwicHhcIjtcblx0XHRcdFx0XHRpZiAodmF1bHQueSAhPSBudWxsKSBkb21FbGVtZW50LnN0eWxlLnRvcCA9IHZhdWx0LnkgKyBcInB4XCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHNldHRpbmdzLmZvbnRTaXplICE9PSB2YXVsdC5mb250U2l6ZSkge1xuXHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdmF1bHQuZm9udFNpemUgPSBzZXR0aW5ncy5mb250U2l6ZTtcblxuXHRcdFx0fVxuXHRcdFx0aWYgKHNldHRpbmdzLmxpbmVIZWlnaHQgIT09IHZhdWx0LmxpbmVIZWlnaHQpIHtcblx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5saW5lSGVpZ2h0ID0gdmF1bHQubGluZUhlaWdodCA9IHNldHRpbmdzLmxpbmVIZWlnaHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0bGV0IHVwZGF0ZVByb3BzID0gZnVuY3Rpb24oKSB7XG5cdFx0bGV0IF93ID0gcGFyZW50LndpZHRoKCk7XG5cdFx0bGV0IF9oID0gcGFyZW50LmhlaWdodCgpO1xuXHRcdGxldCBfeCA9IHBhcmVudC5vZmZzZXRYKCk7XG5cdFx0bGV0IF95ID0gcGFyZW50Lm9mZnNldFkoKTtcblx0XHRpZihwYXJlbnRXaWR0aCAhPSBfdyB8fCBwYXJlbnRIZWlnaHQgIT0gX2ggfHwgX3ggIT0gcGFyZW50WCB8fCBfeSAhPSBwYXJlbnRZKXtcblx0XHRcdHBhcmVudFdpZHRoID0gX3c7IHBhcmVudEhlaWdodCA9IF9oO1xuXHRcdFx0cGFyZW50WCA9IF94OyBwYXJlbnRZID0gX3k7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IGIgPSBib3VuZHMoKTtcblxuXHRcdGxldCBwcm9jZW50V2lkdGggPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy53aWR0aCk7XG5cdFx0aWYgKHByb2NlbnRXaWR0aCkge1xuXHRcdFx0dmF1bHQud2lkdGggPSBiLndpZHRoICogcHJvY2VudFdpZHRoIC8gMTAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoc2V0dGluZ3Mud2lkdGggIT0gbnVsbCkge1xuXHRcdFx0XHR2YXVsdC53aWR0aCA9IGIud2lkdGggKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBwcm9jZW50SGVpZ2h0ID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MuaGVpZ2h0KTtcblx0XHRpZiAocHJvY2VudEhlaWdodCkge1xuXHRcdFx0dmF1bHQuaGVpZ2h0ID0gYi5oZWlnaHQgKiBwcm9jZW50SGVpZ2h0IC8gMTAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoc2V0dGluZ3MuaGVpZ2h0ICE9IG51bGwpIHtcblx0XHRcdFx0dmF1bHQuaGVpZ2h0ID0gYi5oZWlnaHQgKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChzZXR0aW5ncy54ICE9IG51bGwpIHtcblx0XHRcdGxldCBwcm9jZW50WCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLngpO1xuXHRcdFx0aWYocHJvY2VudFgpe1xuXHRcdFx0XHR2YXVsdC54ID0gYi5vZmZzZXRYICsgYi53aWR0aCAqIHByb2NlbnRYIC8gMTAwO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHZhdWx0LnggPSBiLm9mZnNldFggKyBzZXR0aW5ncy54ICogYi5zY2FsZTtcdFxuXHRcdFx0fVxuXHRcdFx0bGV0IHRyYW5zZm9ybVggPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy50cmFuc2Zvcm0ueCk7XG5cdFx0XHRpZiAodHJhbnNmb3JtWCkgdmF1bHQueCArPSB0cmFuc2Zvcm1YICogdmF1bHQud2lkdGggLyAxMDA7XG5cdFx0XHRpZiAoc2V0dGluZ3Mub2Zmc2V0WCkgdmF1bHQueCArPSBzZXR0aW5ncy5vZmZzZXRYO1xuXHRcdH1cblxuXHRcdGlmIChzZXR0aW5ncy55ICE9IG51bGwpIHtcblx0XHRcdGxldCBwcm9jZW50WSA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLnkpO1xuXHRcdFx0aWYocHJvY2VudFkpe1xuXHRcdFx0XHR2YXVsdC55ID0gYi5vZmZzZXRZICsgYi5oZWlnaHQgKiBwcm9jZW50WSAvIDEwMDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR2YXVsdC55ID0gYi5vZmZzZXRZICsgc2V0dGluZ3MueSAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0XHRsZXQgdHJhbnNmb3JtWSA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLnRyYW5zZm9ybS55KTtcblx0XHRcdGlmICh0cmFuc2Zvcm1ZKSB2YXVsdC55ICs9IHRyYW5zZm9ybVkgKiB2YXVsdC53aWR0aCAvIDEwMDtcblx0XHRcdGlmIChzZXR0aW5ncy5vZmZzZXRZKSB2YXVsdC55ICs9IHNldHRpbmdzLm9mZnNldFk7XG5cdFx0fVxuXHRcdFxuXHRcdHVwZGF0ZURvbUVsZW1lbnQoKTtcblx0fVxuXG5cdHRoaXMuYXBwbHlUbyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRpZihlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUpe1xuXHRcdFx0ZG9tRWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0XHR1cGRhdGVQcm9wcygpO1xuXHRcdH1cblx0XHRyZXR1cm4gZG9tRWxlbWVudDtcblx0fVxuXG5cdGxldCBhcHBseU5ld1Byb3BzID0gZnVuY3Rpb24oKSB7XG5cdFx0dXBkYXRlUHJvcHMoKTtcblx0fVxuXG5cdHRoaXMuZGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB2YXVsdDtcblx0fVxuXG5cdHRoaXMuc2V0dGluZ3MgPSBmdW5jdGlvbihuZXdTZXR0aW5ncykge1xuXHRcdHNldHRpbmdzID0gZGVlcG1lcmdlKHNldHRpbmdzLCBuZXdTZXR0aW5ncyk7XG5cdFx0dXBkYXRlUHJvcHMoKTtcblx0XHRyZXR1cm4gc2V0dGluZ3M7XG5cdH1cblx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24odikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHRfYWN0aXZlID0gdjtcblx0XHRcdGlmKHYpIGFwcGx5TmV3UHJvcHMoKTtcblx0XHRcdC8vIHYgPyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgYXBwbHlOZXdQcm9wcywgZmFsc2UpIDogd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMsIGZhbHNlKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9hY3RpdmU7XG5cdH07XG5cblx0aWYocGFyZW50Lm9uKXtcblx0XHRwYXJlbnQub24oJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMpO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBhZGFwdGl2ZVNpemVQb3M7IiwiaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi8uLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQge1xuXHRwcm9jZW50RnJvbVN0cmluZ1xufSBmcm9tICcuLi8uLi9oZWxwZXJzL3V0aWxzJztcbmxldCBkZWZhdWx0cyA9IHtcblx0eDogMCxcblx0eTogMCxcblx0d2lkdGg6IDAsXG5cdGhlaWdodDogMFxufVxubGV0IHJlbGF0aXZlU2l6ZVBvcyA9IGZ1bmN0aW9uKGN0eCwgc2V0dGluZ3MpIHtcblx0bGV0IHBhcmVudFdpZHRoID0gY3R4LnZpZGVvV2lkdGgoKSB8fCBjdHgud2lkdGggfHwgMDtcblx0bGV0IHBhcmVudEhlaWdodCA9IGN0eC52aWRlb0hlaWdodCgpIHx8IGN0eC5oZWlnaHQgfHwgMDtcblx0bGV0IG8gPSBkZWVwbWVyZ2UoZGVmYXVsdHMsIHNldHRpbmdzKTtcblx0bGV0IF93ID0gcHJvY2VudEZyb21TdHJpbmcoby53aWR0aCk7XG5cdGlmICghX3cpIF93ID0gby53aWR0aCAvIHBhcmVudFdpZHRoICogMTAwO1xuXHRsZXQgX2ggPSBwcm9jZW50RnJvbVN0cmluZyhvLmhlaWdodCk7XG5cdGlmICghX2gpIF9oID0gby5oZWlnaHQgLyBwYXJlbnRIZWlnaHQgKiAxMDA7XG5cdGxldCBfeCA9IHByb2NlbnRGcm9tU3RyaW5nKG8ueCk7XG5cdGlmICghX3gpIF94ID0gby54IC8gcGFyZW50V2lkdGggKiAxMDA7XG5cdGxldCBfeSA9IHByb2NlbnRGcm9tU3RyaW5nKG8ueSk7XG5cdGlmICghX3kpIF95ID0gby55IC8gcGFyZW50SGVpZ2h0ICogMTAwO1xuXHRyZXR1cm4ge1xuXHRcdHg6IF94LFxuXHRcdHk6IF95LFxuXHRcdHdpZHRoOiBfdyxcblx0XHRoZWlnaHQ6IF9oIFxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCByZWxhdGl2ZVNpemVQb3M7IiwiaW1wb3J0IGRvbSBmcm9tICcuLi8uLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgYWRhcHRpdmVTaXplUG9zIGZyb20gJy4vYWRhcHRpdmVTaXplUG9zJztcbmltcG9ydCByZWxhdGl2ZVNpemVQb3MgZnJvbSAnLi9yZWxhdGl2ZVNpemVQb3MnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGFpbmVyIHtcblx0Y29uc3RydWN0b3IoY3R4KSB7XG5cdFx0dGhpcy5lbCA9IGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG5cdFx0XHRzdHlsZTogJ3Bvc2l0aW9uOmFic29sdXRlOyBwb2ludGVyLWV2ZW50czogbm9uZTsnXG5cdFx0fSk7XG5cdFx0bGV0IGFjID0gbmV3IGFkYXB0aXZlU2l6ZVBvcyhmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0b2Zmc2V0WDogY3R4Lm9mZnNldFgoKSxcblx0XHRcdFx0b2Zmc2V0WTogY3R4Lm9mZnNldFkoKSxcblx0XHRcdFx0d2lkdGg6IGN0eC53aWR0aCgpLFxuXHRcdFx0XHRoZWlnaHQ6IGN0eC5oZWlnaHQoKSxcblx0XHRcdFx0c2NhbGU6IGN0eC53aWR0aCgpIC8gY3R4LnZpZGVvV2lkdGgoKSxcblx0XHRcdFx0c2NhbGVZOiBjdHgud2lkdGgoKSAvIGN0eC52aWRlb0hlaWdodCgpXG5cdFx0XHR9O1xuXHRcdH0sIHt9LCBjdHgpO1xuXHRcdGFjLmFwcGx5VG8odGhpcy5lbCk7XG5cdFx0YWMuZW5hYmxlZCh0cnVlKTtcblxuXHRcdGN0eC53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuXG5cdFx0dGhpcy5hZGQgPSBmdW5jdGlvbihvcHRzLGVsID0ge30pIHtcblx0XHRcdGlmKCFlbC5ub2RlVHlwZSkgZWwgPSBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRkb20uYWRkQ2xhc3MoZWwsICdrbWxDb250YWluZXInKTtcblx0XHRcdGVsLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHRcdFx0ZWwuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYWxsXCI7XG5cdFx0XHRsZXQgZWxEaW1lbnNpb24gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0bGV0IGQgPSBuZXcgcmVsYXRpdmVTaXplUG9zKGN0eCxvcHRzKTtcblx0XHRcdFx0ZWwuc3R5bGUud2lkdGggPSBkLndpZHRoICsgXCIlXCI7XG5cdFx0XHRcdGVsLnN0eWxlLmhlaWdodCA9IGQuaGVpZ2h0ICsgXCIlXCI7XG5cdFx0XHRcdGlmIChkb20uc3R5bGVQcmVmaXgudHJhbnNmb3JtKSB7XG5cdFx0XHRcdFx0ZG9tLnRyYW5zZm9ybShlbCwgJ3RyYW5zbGF0ZSgnICsgMTAwL2Qud2lkdGgqZC54ICsgJyUsJyArIDEwMC9kLmhlaWdodCpkLnkgKyAnJSknKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbC5zdHlsZS50b3AgPSBkLnggKyBcIiVcIjtcblx0XHRcdFx0XHRlbC5zdHlsZS5sZWZ0ID0gZC55ICsgXCIlXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsRGltZW5zaW9uKCk7XG5cdFx0XHR0aGlzLmVsLmFwcGVuZENoaWxkKGVsKTtcblx0XHRcdGN0eC5vbigndmlkZW9SZXNpemUnLCBlbERpbWVuc2lvbik7XG5cdFx0fVxuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRXJyb3JGb3JtYXRFeGNlcHRpb24obXNnKSB7XG4gICB0cnkge1xuXHQgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuXHR9IGNhdGNoIChlKSB7XG5cdCAgY29uc29sZS5sb2coZS5uYW1lICsgJzogJyArIGUubWVzc2FnZSk7XG5cdCAgcmV0dXJuO1xuXHR9XG59XG4iLCIvL2h0dHBzOi8vZ2l0aHViLmNvbS9wcmltdXMvZXZlbnRlbWl0dGVyM1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHByZWZpeCA9ICd+JztcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgYSBzdG9yYWdlIGZvciBvdXIgYEVFYCBvYmplY3RzLlxuICogQW4gYEV2ZW50c2AgaW5zdGFuY2UgaXMgYSBwbGFpbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhcmUgZXZlbnQgbmFtZXMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRXZlbnRzKCkge31cblxuLy9cbi8vIFdlIHRyeSB0byBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYC4gSW4gc29tZSBlbmdpbmVzIGNyZWF0aW5nIGFuXG4vLyBpbnN0YW5jZSBpbiB0aGlzIHdheSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCBkaXJlY3RseS5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBjaGFyYWN0ZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Rcbi8vIG92ZXJyaWRkZW4gb3IgdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy9cbmlmIChPYmplY3QuY3JlYXRlKSB7XG4gIEV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vXG4gIC8vIFRoaXMgaGFjayBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgYF9fcHJvdG9fX2AgcHJvcGVydHkgaXMgc3RpbGwgaW5oZXJpdGVkIGluXG4gIC8vIHNvbWUgb2xkIGJyb3dzZXJzIGxpa2UgQW5kcm9pZCA0LCBpUGhvbmUgNS4xLCBPcGVyYSAxMSBhbmQgU2FmYXJpIDUuXG4gIC8vXG4gIGlmICghbmV3IEV2ZW50cygpLl9fcHJvdG9fXykgcHJlZml4ID0gZmFsc2U7XG59XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdGhpcy5mbiA9IGZuO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIE1pbmltYWwgYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlIHRoYXQgaXMgbW9sZGVkIGFnYWluc3QgdGhlIE5vZGUuanNcbiAqIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IGxpc3RpbmcgdGhlIGV2ZW50cyBmb3Igd2hpY2ggdGhlIGVtaXR0ZXIgaGFzIHJlZ2lzdGVyZWRcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICB2YXIgbmFtZXMgPSBbXVxuICAgICwgZXZlbnRzXG4gICAgLCBuYW1lO1xuXG4gIGlmICh0aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgcmV0dXJuIG5hbWVzO1xuXG4gIGZvciAobmFtZSBpbiAoZXZlbnRzID0gdGhpcy5fZXZlbnRzKSkge1xuICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgcmV0dXJuIG5hbWVzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGV2ZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGV4aXN0cyBPbmx5IGNoZWNrIGlmIHRoZXJlIGFyZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7QXJyYXl8Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKGV2ZW50LCBleGlzdHMpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnRcbiAgICAsIGF2YWlsYWJsZSA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChleGlzdHMpIHJldHVybiAhIWF2YWlsYWJsZTtcbiAgaWYgKCFhdmFpbGFibGUpIHJldHVybiBbXTtcbiAgaWYgKGF2YWlsYWJsZS5mbikgcmV0dXJuIFthdmFpbGFibGUuZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXZhaWxhYmxlLmxlbmd0aCwgZWUgPSBuZXcgQXJyYXkobCk7IGkgPCBsOyBpKyspIHtcbiAgICBlZVtpXSA9IGF2YWlsYWJsZVtpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogQ2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGV2ZW50IGhhZCBsaXN0ZW5lcnMsIGVsc2UgYGZhbHNlYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVycy5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgNDogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMiwgYTMpOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoIWFyZ3MpIGZvciAoaiA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBhcmdzW2ogLSAxXSA9IGFyZ3VtZW50c1tqXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uYXBwbHkobGlzdGVuZXJzW2ldLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcylcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBvbmUtdGltZSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMsIHRydWUpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIHRoaXMuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbdGhpcy5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsaXN0ZW5lcnMgb2YgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IG1hdGNoIHRoaXMgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBoYXZlIHRoaXMgY29udGV4dC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmUtdGltZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiB0aGlzO1xuICBpZiAoIWZuKSB7XG4gICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKFxuICAgICAgICAgbGlzdGVuZXJzLmZuID09PSBmblxuICAgICAgJiYgKCFvbmNlIHx8IGxpc3RlbmVycy5vbmNlKVxuICAgICAgJiYgKCFjb250ZXh0IHx8IGxpc3RlbmVycy5jb250ZXh0ID09PSBjb250ZXh0KVxuICAgICkge1xuICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgZXZlbnRzID0gW10sIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4gIT09IGZuXG4gICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSlcbiAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgICAvL1xuICAgIGlmIChldmVudHMubGVuZ3RoKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gICAgZWxzZSBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzLCBvciB0aG9zZSBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0O1xuXG4gIGlmIChldmVudCkge1xuICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG4gICAgaWYgKHRoaXMuX2V2ZW50c1tldnRdKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBBbGlhcyBtZXRob2RzIG5hbWVzIGJlY2F1c2UgcGVvcGxlIHJvbGwgbGlrZSB0aGF0LlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4vL1xuLy8gVGhpcyBmdW5jdGlvbiBkb2Vzbid0IGFwcGx5IGFueW1vcmUuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgcHJlZml4LlxuLy9cbkV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RW1pdHRlcjsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblx0bGV0IHggPSAwO1xuXHRsZXQgeSA9IDA7XG5cdHRoaXMuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHggPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgMDtcblx0XHR5ID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IDA7XG5cdH1cblx0dGhpcy5yZXN0b3JlID0gZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LnNjcm9sbFRvKHgsIHkpXG5cdH1cbn0iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4vbWVkaWEvZXZlbnRzL2luZGV4JztcbmltcG9ydCBzY3JvbGxQb3NpdGlvbiBmcm9tICcuLi9oZWxwZXJzL3Njcm9sbFBvc2l0aW9uJztcbi8vIEZ1bGxzY3JlZW4gQVBJXG5sZXQgc3VwcG9ydHNGdWxsU2NyZWVuID0gZmFsc2U7XG5sZXQgYnJvd3NlclByZWZpeGVzID0gJ3dlYmtpdCBtb3ogbyBtcyBraHRtbCcuc3BsaXQoJyAnKTtcbmxldCBwcmVmaXhGUyA9ICcnO1xuLy9DaGVjayBmb3IgbmF0aXZlIHN1cHBvcnRcbmlmICh0eXBlb2YgZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xufSBlbHNlIHtcbiAgICAvLyBDaGVjayBmb3IgZnVsbHNjcmVlbiBzdXBwb3J0IGJ5IHZlbmRvciBwcmVmaXhcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBicm93c2VyUHJlZml4ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBwcmVmaXhGUyA9IGJyb3dzZXJQcmVmaXhlc1tpXTtcblxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50W3ByZWZpeEZTICsgJ0NhbmNlbEZ1bGxTY3JlZW4nXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIE1TICh3aGVuIGlzbid0IGl0PylcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4gIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVuYWJsZWQpIHtcbiAgICAgICAgICAgIHByZWZpeEZTID0gJ21zJztcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbmxldCBldmVudENoYW5nZSA9IChwcmVmaXhGUyA9PT0gJycpID8gJ2Z1bGxzY3JlZW5jaGFuZ2UnIDogcHJlZml4RlMgKyAocHJlZml4RlMgPT0gJ21zJyA/ICdmdWxsc2NyZWVuY2hhbmdlJyA6ICdmdWxsc2NyZWVuY2hhbmdlJyk7XG5ldmVudENoYW5nZSA9IGV2ZW50Q2hhbmdlLnRvTG93ZXJDYXNlKCk7XG4vL3N1cHBvcnRzRnVsbFNjcmVlbiA9IGZhbHNlO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVsbHNjcmVlbiBleHRlbmRzIEV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24gPSBuZXcgc2Nyb2xsUG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUgPSB7fTtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGZuRnVsbHNjcmVlbkNoYW5nZSA9ICgpPT57XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNGdWxsU2NyZWVuKCkpe1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc2Nyb2xsUG9zaXRpb24ucmVzdG9yZSwxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRDaGFuZ2UsIGZuRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIG9uRnVsbHNjcmVlbkNoYW5nZShldnQpe1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLndyYXBwZXIpO1xuICAgICAgICB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRDaGFuZ2UsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbjtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9LCB0cnVlKTtcbiAgICB9XG4gICAgaXNGdWxsV2luZG93KCl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaXNGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLndyYXBwZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKHByZWZpeEZTKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ID09IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnbW96JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50ID09IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50W3ByZWZpeEZTICsgJ0Z1bGxzY3JlZW5FbGVtZW50J10gPT0gZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlcXVlc3RGdWxsV2luZG93KGVsZW1lbnQpe1xuICAgICAgICBpZiAodGhpcy5pc0Z1bGxXaW5kb3coKSB8fCB0aGlzLmlzRnVsbFNjcmVlbigpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMud3JhcHBlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uLnNhdmUoKTtcbiAgICAgICAgbGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsncG9zaXRpb24nXSA9IHN0eWxlLnBvc2l0aW9uIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWFyZ2luJ10gPSBzdHlsZS5tYXJnaW4gfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd0b3AnXSA9IHN0eWxlLnRvcCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ2xlZnQnXSA9IHN0eWxlLmxlZnQgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd3aWR0aCddID0gc3R5bGUud2lkdGggfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydoZWlnaHQnXSA9IHN0eWxlLmhlaWdodCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3pJbmRleCddID0gc3R5bGUuekluZGV4IHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWF4V2lkdGgnXSA9IHN0eWxlLm1heFdpZHRoIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWF4SGVpZ2h0J10gPSBzdHlsZS5tYXhIZWlnaHQgfHwgXCJcIjtcblxuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IGVsZW1lbnQuc3R5bGUubGVmdCA9IDA7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luID0gMDtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5tYXhXaWR0aCA9IGVsZW1lbnQuc3R5bGUubWF4SGVpZ2h0ID0gZWxlbWVudC5zdHlsZS53aWR0aCA9IGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuekluZGV4ID0gMjE0NzQ4MzY0NztcblxuICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuZW1pdCgncmVzaXplJyk7XG4gICAgICAgIHRoaXMuaXNGdWxsV2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy53cmFwcGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24uc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIChwcmVmaXhGUyA9PT0gJycpID8gZWxlbWVudC5yZXF1ZXN0RnVsbFNjcmVlbigpIDogZWxlbWVudFtwcmVmaXhGUyArIChwcmVmaXhGUyA9PSAnbXMnID8gJ1JlcXVlc3RGdWxsc2NyZWVuJyA6ICdSZXF1ZXN0RnVsbFNjcmVlbicpXSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RnVsbFdpbmRvdyhlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYW5jZWxGdWxsV2luZG93KCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNGdWxsV2luZG93KCkgfHwgdGhpcy5pc0Z1bGxTY3JlZW4oKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudC5zdHlsZVtrXSA9IHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVtrXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNGdWxsV2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZW1pdCgncmVzaXplJyk7XG4gICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24ucmVzdG9yZSgpO1xuICAgIH1cbiAgICBjYW5jZWxGdWxsU2NyZWVuKCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKCkgOiBkb2N1bWVudFtwcmVmaXhGUyArIChwcmVmaXhGUyA9PSAnbXMnID8gJ0V4aXRGdWxsc2NyZWVuJyA6ICdDYW5jZWxGdWxsU2NyZWVuJyldKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEZ1bGxXaW5kb3coKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2dnbGVGdWxsV2luZG93KGVsZW1lbnQpe1xuICAgICAgICBsZXQgaXNGdWxsc2NyZWVuID0gIXRoaXMuaXNGdWxsV2luZG93KCk7XG4gICAgICAgIGlmIChpc0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEZ1bGxXaW5kb3coZWxlbWVudCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRnVsbFdpbmRvdygpO1xuICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdG9nZ2xlRnVsbFNjcmVlbihlbGVtZW50KSB7XG4gICAgICAgIGxldCBpc0Z1bGxzY3JlZW4gPSAhdGhpcy5pc0Z1bGxTY3JlZW4oKTtcbiAgICAgICAgaWYgKGlzRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RnVsbFNjcmVlbihlbGVtZW50KTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdWxsc2NyZWVuRWxlbWVudCgpIHtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgcmV0dXJuIChwcmVmaXhGUyA9PT0gJycpID8gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgOiBkb2N1bWVudFtwcmVmaXhGUyArICdGdWxsc2NyZWVuRWxlbWVudCddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50O1xuICAgICAgICB9XG4gICAgfVxufTsiLCJpbXBvcnQgZG9tIGZyb20gJy4vZG9tJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1lZGlhKSB7XG5cdC8vIFJlbW92ZSBjaGlsZCBzb3VyY2VzXG5cdHZhciBzb3VyY2VzID0gZG9tLnNlbGVjdEFsbCgnc291cmNlJywgbWVkaWEpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZXMubGVuZ3RoOyBpKyspIHtcblx0XHRkb20ucmVtb3ZlRWxlbWVudChzb3VyY2VzW2ldKTtcblx0fVxuXG5cdC8vIFNldCBibGFuayB2aWRlbyBzcmMgYXR0cmlidXRlXG5cdC8vIFRoaXMgaXMgdG8gcHJldmVudCBhIE1FRElBX0VSUl9TUkNfTk9UX1NVUFBPUlRFRCBlcnJvclxuXHQvLyBTbWFsbCBtcDQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL3NtYWxsL2Jsb2IvbWFzdGVyL21wNC5tcDRcblx0Ly8gSW5mbzogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMjIzMTU3OS9ob3ctdG8tcHJvcGVybHktZGlzcG9zZS1vZi1hbi1odG1sNS12aWRlby1hbmQtY2xvc2Utc29ja2V0LW9yLWNvbm5lY3Rpb25cblx0bWVkaWEuc2V0QXR0cmlidXRlKCdzcmMnLCAnZGF0YTp2aWRlby9tcDQ7YmFzZTY0LEFBQUFIR1owZVhCcGMyOXRBQUFDQUdsemIyMXBjMjh5YlhBME1RQUFBQWhtY21WbEFBQUFHbTFrWVhRQUFBR3pBQkFIQUFBQnRoQmdVWUk5dCs4QUFBTU5iVzl2ZGdBQUFHeHRkbWhrQUFBQUFNWE12dnJGekw3NkFBQUQ2QUFBQUNvQUFRQUFBUUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWdBQUFCaHBiMlJ6QUFBQUFCQ0FnSUFIQUUvLy8vLysvd0FBQWlGMGNtRnJBQUFBWEhScmFHUUFBQUFQeGN5KytzWE12dm9BQUFBQkFBQUFBQUFBQUNvQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFnQUFBQUlBQUFBQUFHOWJXUnBZUUFBQUNCdFpHaGtBQUFBQU1YTXZ2ckZ6TDc2QUFBQUdBQUFBQUVWeHdBQUFBQUFMV2hrYkhJQUFBQUFBQUFBQUhacFpHVUFBQUFBQUFBQUFBQUFBQUJXYVdSbGIwaGhibVJzWlhJQUFBQUJhRzFwYm1ZQUFBQVVkbTFvWkFBQUFBRUFBQUFBQUFBQUFBQUFBQ1JrYVc1bUFBQUFIR1J5WldZQUFBQUFBQUFBQVFBQUFBeDFjbXdnQUFBQUFRQUFBU2h6ZEdKc0FBQUF4SE4wYzJRQUFBQUFBQUFBQVFBQUFMUnRjRFIyQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWdBQ0FCSUFBQUFTQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUdQLy9BQUFBWG1WelpITUFBQUFBQTRDQWdFMEFBUUFFZ0lDQVB5QVJBQUFBQUFNTlFBQUFBQUFGZ0lDQUxRQUFBYkFCQUFBQnRZa1RBQUFCQUFBQUFTQUF4STJJQU1VQVJBRVVRd0FBQWJKTVlYWmpOVE11TXpVdU1BYUFnSUFCQWdBQUFCaHpkSFJ6QUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUJ4emRITmpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQUVBQUFBVWMzUnplZ0FBQUFBQUFBQVNBQUFBQVFBQUFCUnpkR052QUFBQUFBQUFBQUVBQUFBc0FBQUFZSFZrZEdFQUFBQlliV1YwWVFBQUFBQUFBQUFoYUdSc2NnQUFBQUFBQUFBQWJXUnBjbUZ3Y0d3QUFBQUFBQUFBQUFBQUFBQXJhV3h6ZEFBQUFDT3BkRzl2QUFBQUcyUmhkR0VBQUFBQkFBQUFBRXhoZG1ZMU15NHlNUzR4Jyk7XG5cblx0Ly8gTG9hZCB0aGUgbmV3IGVtcHR5IHNvdXJjZVxuXHQvLyBUaGlzIHdpbGwgY2FuY2VsIGV4aXN0aW5nIHJlcXVlc3RzXG5cdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vU2Vsei9wbHlyL2lzc3Vlcy8xNzRcblx0bWVkaWEubG9hZCgpO1xuXG5cdC8vIERlYnVnZ2luZ1xuXHRjb25zb2xlLmxvZyhcIkNhbmNlbGxlZCBuZXR3b3JrIHJlcXVlc3RzIGZvciBvbGQgbWVkaWFcIik7XG59IiwiZXhwb3J0IGZ1bmN0aW9uIG1pbWVBdWRpbyhtZWRpYSwgdHlwZSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdhdWRpby9tcDQnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby9tcDQ7IGNvZGVjcz1cIm1wNGEuNDAuNVwiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICdhdWRpby9tcGVnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL29nZyc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL3dhdic6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdjsgY29kZWNzPVwiMVwiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pbWVWaWRlbyhtZWRpYSwgdHlwZSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICd2aWRlby93ZWJtJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA4LCB2b3JiaXNcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAndmlkZW8vbXA0JzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vbXA0OyBjb2RlY3M9XCJhdmMxLjQyRTAxRSwgbXA0YS40MC4yXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL29nZyc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ3ZpZGVvL29nZzsgY29kZWNzPVwidGhlb3JhXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7fSIsImltcG9ydCBlcnJvciBmcm9tICcuLi8uLi9oZWxwZXJzL2Vycm9yJztcbmltcG9ydCBGdWxsc2NyZWVuIGZyb20gJy4uL2Z1bGxzY3JlZW4nO1xuaW1wb3J0IF9jYW5jZWxSZXF1ZXN0cyBmcm9tICcuLi8uLi9oZWxwZXJzL2NhbmNlbFZpZGVvTmV0d29ya1JlcXVlc3QnO1xuaW1wb3J0IHttaW1lVmlkZW99IGZyb20gJy4uLy4uL2hlbHBlcnMvbWltZVR5cGUnO1xuXG4vL2h0dHBzOi8vd3d3LnczLm9yZy8yMDEwLzA1L3ZpZGVvL21lZGlhZXZlbnRzLmh0bWxcbmxldCBfZXZlbnRzID0gWydlbmRlZCcsICdwcm9ncmVzcycsICdzdGFsbGVkJywgJ3BsYXlpbmcnLCAnd2FpdGluZycsICdjYW5wbGF5JywgJ2NhbnBsYXl0aHJvdWdoJywgJ2xvYWRzdGFydCcsICdsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ3RpbWV1cGRhdGUnLCAndm9sdW1lY2hhbmdlJywgJ3BsYXknLCAncGxheWluZycsICdwYXVzZScsICdlcnJvcicsICdzZWVraW5nJywgJ2VtcHRpZWQnLCAnc2Vla2VkJywgJ3JhdGVjaGFuZ2UnLCAnc3VzcGVuZCddO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZWRpYSBleHRlbmRzIEZ1bGxzY3JlZW4ge1xuXHRjb25zdHJ1Y3RvcihlbCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0aWYoZWwgPT0gbnVsbCl7XG5cdFx0XHRlcnJvcihcIllvdSBuZWVkIHRvIHN1cHBseSBhIEhUTUxWaWRlb0VsZW1lbnQgdG8gaW5zdGFudGlhdGUgdGhlIHBsYXllclwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYSA9IGVsO1xuXHRcdF9ldmVudHMuZm9yRWFjaCgoaykgPT4ge1xuXHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcihrLCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZW1pdChrKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5jYW5QbGF5ID0ge1xuXHRcdFx0bXA0OiBtaW1lVmlkZW8oZWwsJ3ZpZGVvL21wNCcpLFxuXHRcdFx0d2VibTogbWltZVZpZGVvKGVsLCd2aWRlby93ZWJtJyksXG5cdFx0XHRvZ2c6IG1pbWVWaWRlbyhlbCwndmlkZW8vb2dnJylcblx0XHR9XG5cdH1cblxuXHQvKioqIEdsb2JhbCBhdHRyaWJ1dGVzICovXG5cblx0LyogQSBCb29sZWFuIGF0dHJpYnV0ZTsgaWYgc3BlY2lmaWVkLCB0aGUgdmlkZW8gYXV0b21hdGljYWxseSBiZWdpbnMgdG8gcGxheSBiYWNrIGFzIHNvb24gYXMgaXQgY2FuIGRvIHNvIHdpdGhvdXQgc3RvcHBpbmcgdG8gZmluaXNoIGxvYWRpbmcgdGhlIGRhdGEuIElmIG5vdCByZXR1cm4gdGhlIGF1b3BsYXkgYXR0cmlidXRlLiAqL1xuXHRhdXRvcGxheSh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEuYXV0b3BsYXkgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5hdXRvcGxheTtcblx0fVxuXG5cdC8qIFJldHVybnMgdGhlIHRpbWUgcmFuZ2VzIG9mIHRoZSBidWZmZXJlZCBtZWRpYS4gVGhpcyBhdHRyaWJ1dGUgY29udGFpbnMgYSBUaW1lUmFuZ2VzIG9iamVjdCAqL1xuXHRidWZmZXJlZCgpwqAge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmJ1ZmZlcmVkO1xuXHR9XG5cblx0LyogSWYgdGhpcyBhdHRyaWJ1dGUgaXMgcHJlc2VudCwgdGhlIGJyb3dzZXIgd2lsbCBvZmZlciBjb250cm9scyB0byBhbGxvdyB0aGUgdXNlciB0byBjb250cm9sIHZpZGVvIHBsYXliYWNrLCBpbmNsdWRpbmcgdm9sdW1lLCBzZWVraW5nLCBhbmQgcGF1c2UvcmVzdW1lIHBsYXliYWNrLiBXaGVuIG5vdCBzZXQgcmV0dXJucyBpZiB0aGUgY29udHJvbHMgYXJlIHByZXNlbnQgKi9cblx0bmF0aXZlQ29udHJvbHModikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmNvbnRyb2xzID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuY29udHJvbHM7XG5cdH1cblxuXHQvKiBhbm9ueW1vdXMsIHVzZS1jcmVkZW50aWFscywgZmFsc2UgKi9cblx0Y3Jvc3NvcmlnaW4odikge1xuXHRcdGlmICh2ID09PSAndXNlLWNyZWRlbnRpYWxzJykge1xuXHRcdFx0dGhpcy5tZWRpYS5jcm9zc09yaWdpbiA9ICd1c2UtY3JlZGVudGlhbHMnO1xuXHRcdFx0cmV0dXJuIHY7XG5cdFx0fVxuXHRcdGlmICh2KSB7XG5cdFx0XHR0aGlzLm1lZGlhLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG5cdFx0XHRyZXR1cm4gJ2Fub255bW91cyc7XG5cdFx0fVxuXHRcdGlmICh2ID09PSBmYWxzZSkgdGhpcy5tZWRpYS5jcm9zc09yaWdpbiA9IG51bGw7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuY3Jvc3NPcmlnaW47XG5cdH1cblxuXHQvKiBBIEJvb2xlYW4gYXR0cmlidXRlOyBpZiBzcGVjaWZpZWQsIHdlIHdpbGwsIHVwb24gcmVhY2hpbmcgdGhlIGVuZCBvZiB0aGUgdmlkZW8sIGF1dG9tYXRpY2FsbHkgc2VlayBiYWNrIHRvIHRoZSBzdGFydC4gKi9cblx0bG9vcCh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEubG9vcCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmxvb3A7XG5cdH1cblxuXHQvKkEgQm9vbGVhbiBhdHRyaWJ1dGUgd2hpY2ggaW5kaWNhdGVzIHRoZSBkZWZhdWx0IHNldHRpbmcgb2YgdGhlIGF1ZGlvIGNvbnRhaW5lZCBpbiB0aGUgdmlkZW8uIElmIHNldCwgdGhlIGF1ZGlvIHdpbGwgYmUgaW5pdGlhbGx5IHNpbGVuY2VkLiBJdHMgZGVmYXVsdCB2YWx1ZSBpcyBmYWxzZSwgbWVhbmluZyB0aGF0IHRoZSBhdWRpbyB3aWxsIGJlIHBsYXllZCB3aGVuIHRoZSB2aWRlbyBpcyBwbGF5ZWQqL1xuXHRtdXRlZCh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEubXV0ZWQgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5tdXRlZDtcblx0fVxuXG5cdC8qIE11dGUgdGhlIHZpZGVvICovXG5cdG11dGUoKSB7XG5cdFx0dGhpcy5tdXRlZCh0cnVlKTtcblx0fVxuXG5cdC8qIFVuTXV0ZSB0aGUgdmlkZW8gKi9cblx0dW5tdXRlKCkge1xuXHRcdHRoaXMubXV0ZWQoZmFsc2UpO1xuXHR9XG5cblx0LyogVG9nZ2xlIHRoZSBtdXRlZCBzdGFuY2Ugb2YgdGhlIHZpZGVvICovXG5cdHRvZ2dsZU11dGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubXV0ZWQoIXRoaXMubXV0ZWQoKSk7XG5cdH1cblxuXHQvKiBSZXR1cm5zIEEgVGltZVJhbmdlcyBvYmplY3QgaW5kaWNhdGluZyBhbGwgdGhlIHJhbmdlcyBvZiB0aGUgdmlkZW8gdGhhdCBoYXZlIGJlZW4gcGxheWVkLiovXG5cdHBsYXllZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wbGF5ZWQ7XG5cdH1cblxuXHQvKlxuXHRUaGlzIGVudW1lcmF0ZWQgYXR0cmlidXRlIGlzIGludGVuZGVkIHRvIHByb3ZpZGUgYSBoaW50IHRvIHRoZSBicm93c2VyIGFib3V0IHdoYXQgdGhlIGF1dGhvciB0aGlua3Mgd2lsbCBsZWFkIHRvIHRoZSBiZXN0IHVzZXIgZXhwZXJpZW5jZS4gSXQgbWF5IGhhdmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuXHRcdG5vbmU6IGluZGljYXRlcyB0aGF0IHRoZSB2aWRlbyBzaG91bGQgbm90IGJlIHByZWxvYWRlZC5cblx0XHRtZXRhZGF0YTogaW5kaWNhdGVzIHRoYXQgb25seSB2aWRlbyBtZXRhZGF0YSAoZS5nLiBsZW5ndGgpIGlzIGZldGNoZWQuXG5cdFx0YXV0bzogaW5kaWNhdGVzIHRoYXQgdGhlIHdob2xlIHZpZGVvIGZpbGUgY291bGQgYmUgZG93bmxvYWRlZCwgZXZlbiBpZiB0aGUgdXNlciBpcyBub3QgZXhwZWN0ZWQgdG8gdXNlIGl0LlxuXHR0aGUgZW1wdHkgc3RyaW5nOiBzeW5vbnltIG9mIHRoZSBhdXRvIHZhbHVlLlxuXHQqL1xuXHRwcmVsb2FkKHYpIHtcblx0XHRpZiAodiA9PT0gJ21ldGFkYXRhJyB8fCB2ID09PSBcIm1ldGFcIikge1xuXHRcdFx0dGhpcy5tZWRpYS5wcmVsb2FkID0gJ21ldGFkYXRhJztcblx0XHRcdHJldHVybiAnbWV0YWRhdGEnO1xuXHRcdH1cblx0XHRpZiAodikge1xuXHRcdFx0dGhpcy5tZWRpYS5wcmVsb2FkID0gJ2F1dG8nO1xuXHRcdFx0cmV0dXJuICdhdXRvJztcblx0XHR9XG5cdFx0aWYgKHYgPT09IGZhbHNlKSB7XG5cdFx0XHR0aGlzLm1lZGlhLnByZWxvYWQgPSAnbm9uZSc7XG5cdFx0XHRyZXR1cm4gJ25vbmUnO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wcmVsb2FkO1xuXHR9XG5cblx0LyogR2l2ZXMgb3IgcmV0dXJucyB0aGUgYWRkcmVzcyBvZiBhbiBpbWFnZSBmaWxlIHRoYXQgdGhlIHVzZXIgYWdlbnQgY2FuIHNob3cgd2hpbGUgbm8gdmlkZW8gZGF0YSBpcyBhdmFpbGFibGUuIFRoZSBhdHRyaWJ1dGUsIGlmIHByZXNlbnQsIG11c3QgY29udGFpbiBhIHZhbGlkIG5vbi1lbXB0eSBVUkwgcG90ZW50aWFsbHkgc3Vycm91bmRlZCBieSBzcGFjZXMgKi9cblx0cG9zdGVyKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLm1lZGlhLnBvc3RlciA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLnBvc3Rlcjtcblx0fVxuXG5cdC8qIFRoZSBzcmMgcHJvcGVydHkgc2V0cyBvciByZXR1cm5zIHRoZSBjdXJyZW50IHNvdXJjZSBvZiB0aGUgYXVkaW8vdmlkZW8sIFRoZSBzb3VyY2UgaXMgdGhlIGFjdHVhbCBsb2NhdGlvbiAoVVJMKSBvZiB0aGUgYXVkaW8vdmlkZW8gZmlsZSAqL1xuXHRzcmModikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdF9jYW5jZWxSZXF1ZXN0cyh0aGlzLm1lZGlhKTtcblx0XHRcdGlmKHYgaW5zdGFuY2VvZiBBcnJheSl7XG5cdFx0XHRcdGZvcih2YXIgaSA9IDAsIG4gPSB2Lmxlbmd0aDsgaSs9MTspe1xuXHRcdFx0XHRcdGlmKHZbaV1bJ3R5cGUnXSA9PT0gXCJ2aWRlby9tcDRcIiAmJiB0aGlzLmNhblBsYXkubXA0KXtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnNyYyA9IHZbaV1bJ3NyYyddO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih2W2ldWyd0eXBlJ10gPT09IFwidmlkZW8vd2VibVwiICYmIHRoaXMuY2FuUGxheS53ZWJtKXtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnNyYyA9IHZbaV1bJ3NyYyddO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih2W2ldWyd0eXBlJ10gPT09IFwidmlkZW8vb2dnXCIgJiYgdGhpcy5jYW5QbGF5Lm9nZyl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNlIGlmKHYuc3JjICYmIHYudHlwZSl7XG5cdFx0XHRcdHRoaXMubWVkaWEuc3JjID0gdi5zcmM7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGhpcy5tZWRpYS5zcmMgPSB2O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmN1cnJlbnRTcmM7XG5cdH1cblxuXHQvKioqIEdsb2JhbCBFdmVudHMgKi9cblxuXHQvKiBTdGFydHMgcGxheWluZyB0aGUgYXVkaW8vdmlkZW8gKi9cblx0cGxheSgpIHtcblx0XHR0aGlzLm1lZGlhLnBsYXkoKTtcblx0fVxuXG5cdC8qIFBhdXNlcyB0aGUgY3VycmVudGx5IHBsYXlpbmcgYXVkaW8vdmlkZW8gKi9cblx0cGF1c2UoKSB7XG5cdFx0dGhpcy5tZWRpYS5wYXVzZSgpO1xuXHR9XG5cblx0LyogVG9nZ2xlIHBsYXkvcGF1c2UgZm9yIHRoZSBhdWRpby92aWRlbyAqL1xuXHR0b2dnbGVQbGF5KCkge1xuXHRcdHRoaXMubWVkaWEucGF1c2VkID8gdGhpcy5wbGF5KCkgOiB0aGlzLnBhdXNlKCk7XG5cdH1cblxuXHRjdXJyZW50VGltZSh2KSB7XG5cdFx0aWYgKHYgPT09IG51bGwgfHwgaXNOYU4odikpIHtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLmN1cnJlbnRUaW1lO1xuXHRcdH1cblx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRpZiAodiA+IHRoaXMubWVkaWEuZHVyYXRpb24pIHtcblx0XHRcdHYgPSB0aGlzLm1lZGlhLmR1cmF0aW9uO1xuXHRcdH1cblx0XHRpZiAodiA8IDApIHtcblx0XHRcdHYgPSAwO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhLmN1cnJlbnRUaW1lID0gdjtcblx0XHRyZXR1cm4gdjtcblx0fVxuXG5cdHNlZWsodikge1xuXHRcdHJldHVybiB0aGlzLmN1cnJlbnRUaW1lKHYpO1xuXHR9XG5cblxuXHQvKipcblx0ICogW1JlLWxvYWRzIHRoZSBhdWRpby92aWRlbyBlbGVtZW50LCB1cGRhdGUgdGhlIGF1ZGlvL3ZpZGVvIGVsZW1lbnQgYWZ0ZXIgY2hhbmdpbmcgdGhlIHNvdXJjZSBvciBvdGhlciBzZXR0aW5nc11cblx0ICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXHRsb2FkKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLnNyYyh2KTtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS5sb2FkKCk7XG5cdH1cblxuXHRkdXJhdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5kdXJhdGlvbjtcblx0fVxuXG5cdHZvbHVtZSh2KSB7XG5cdFx0Ly8gUmV0dXJuIGN1cnJlbnQgdm9sdW1lIGlmIHZhbHVlIFxuXHRcdGlmICh2ID09PSBudWxsIHx8IGlzTmFOKHYpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS52b2x1bWU7XG5cdFx0fVxuXHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdGlmICh2ID4gMSkge1xuXHRcdFx0diA9IDE7XG5cdFx0fVxuXHRcdGlmICh2IDwgMCkge1xuXHRcdFx0diA9IDA7XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEudm9sdW1lID0gdjtcblx0XHRyZXR1cm4gdjtcblx0fVxufSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpe1xuXHRsZXQgc2NhbGUgPSAwO1xuXHRsZXQgYm91bmRzID0gZnVuY3Rpb24oZWwsIHVwZGF0ZVNjYWxlKSB7XG5cdFx0aWYoIHVwZGF0ZVNjYWxlICE9PSB1bmRlZmluZWQpIHNjYWxlID0gdXBkYXRlU2NhbGU7XG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHR3cmFwcGVyV2lkdGg6IGVsLm9mZnNldFdpZHRoLFxuXHRcdFx0d3JhcHBlckhlaWdodDogZWwub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0c2NhbGU6IHNjYWxlIHx8IChlbC53aWR0aC9lbC5oZWlnaHQpLFxuXHRcdFx0d2lkdGg6IDAsXG5cdFx0XHRoZWlnaHQ6IDAsXG5cdFx0XHRvZmZzZXRYOiAwLFxuXHRcdFx0b2Zmc2V0WTogMFxuXHRcdH1cblx0XHRkYXRhWyd3cmFwcGVyU2NhbGUnXSA9IGRhdGEud3JhcHBlcldpZHRoIC8gZGF0YS53cmFwcGVySGVpZ2h0O1xuXHRcdGlmIChkYXRhLndyYXBwZXJTY2FsZSA+IGRhdGEuc2NhbGUpIHtcblx0XHRcdGRhdGEuaGVpZ2h0ID0gZGF0YS53cmFwcGVySGVpZ2h0O1xuXHRcdFx0ZGF0YS53aWR0aCA9IGRhdGEuc2NhbGUgKiBkYXRhLmhlaWdodDtcblx0XHRcdGRhdGEub2Zmc2V0WCA9IChkYXRhLndyYXBwZXJXaWR0aCAtIGRhdGEud2lkdGgpIC8gMjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGF0YS53aWR0aCA9IGRhdGEud3JhcHBlcldpZHRoO1xuXHRcdFx0ZGF0YS5oZWlnaHQgPSBkYXRhLndpZHRoIC8gZGF0YS5zY2FsZTtcblx0XHRcdGRhdGEub2Zmc2V0WSA9IChkYXRhLndyYXBwZXJIZWlnaHQgLSBkYXRhLmhlaWdodCkgLyAyO1xuXHRcdH1cblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXHRyZXR1cm4gYm91bmRzO1xufSkoKTsiLCJ2YXIgX2RvYyA9IGRvY3VtZW50IHx8IHt9O1xuLy8gU2V0IHRoZSBuYW1lIG9mIHRoZSBoaWRkZW4gcHJvcGVydHkgYW5kIHRoZSBjaGFuZ2UgZXZlbnQgZm9yIHZpc2liaWxpdHlcbnZhciBoaWRkZW4sIHZpc2liaWxpdHlDaGFuZ2U7XG5pZiAodHlwZW9mIF9kb2MuaGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7IC8vIE9wZXJhIDEyLjEwIGFuZCBGaXJlZm94IDE4IGFuZCBsYXRlciBzdXBwb3J0IFxuXHRoaWRkZW4gPSBcImhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJ2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLm1vekhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIm1vekhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLm1zSGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwibXNIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwibXN2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLndlYmtpdEhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIndlYmtpdEhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCI7XG59XG5cbmNvbnN0IGlzQXZhaWxhYmxlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiAhKHR5cGVvZiBfZG9jW2hpZGRlbl0gPT09IFwidW5kZWZpbmVkXCIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYWdlVmlzaWJpbGl0eShfbWVkaWEsIHNldHRpbmdzID0ge30pIHtcblx0bGV0IF9hdmFpbGFibGUgPSBpc0F2YWlsYWJsZSgpO1xuXHRpZiAoX2F2YWlsYWJsZSkge1xuXHRcdGxldCBfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdGxldCBfcGxheWluZyA9IGZhbHNlO1xuXHRcdGxldCBwYXVzZWQgPSBmYWxzZTtcblx0XHRsZXQgc2V0RmxhZ1BsYXlpbmcgPSBmdW5jdGlvbigpIHtcblx0XHRcdF9wbGF5aW5nID0gdHJ1ZTtcblx0XHR9O1xuXHRcdGxldCBldmVudHMgPSB7XG5cdFx0XHR2aXNpYmxlOiBmdW5jdGlvbigpe30sXG5cdFx0XHRoaWRkZW46IGZ1bmN0aW9uKCl7fVxuXHRcdH07XG5cdFx0bGV0IGRlc3Ryb3lWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRldmVudHMgPSB7XG5cdFx0XHRcdHZpc2libGU6IGZ1bmN0aW9uKCl7fSxcblx0XHRcdFx0aGlkZGVuOiBmdW5jdGlvbigpe31cblx0XHRcdH07XG5cdFx0XHRfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0X3BsYXlpbmcgPSBmYWxzZTtcblx0XHRcdF9kb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRfbWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHR9XG5cdFx0bGV0IGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChfZW5hYmxlZCkge1xuXHRcdFx0XHRpZiAoX2RvY1toaWRkZW5dKSB7XG5cdFx0XHRcdFx0aWYgKF9wbGF5aW5nICYmICFfbWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRfbWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHRcdHBhdXNlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50cy5oaWRkZW4oKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAocGF1c2VkICYmIF9tZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdF9tZWRpYS5wbGF5KCk7XG5cdFx0XHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnRzLnZpc2libGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRsZXQgaW5pdFZpc2liaWxpdHkgPSBmdW5jdGlvbiBpbml0VmlzaWJpbGl0eShzZXR0aW5ncykge1xuXHRcdFx0aWYgKF9hdmFpbGFibGUpIHtcblx0XHRcdFx0X2RvYy5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdFx0X21lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRldmVudHMudmlzaWJsZSA9IHNldHRpbmdzLm9uVmlzaWJsZSB8fCBldmVudHMudmlzaWJsZTtcblx0XHRcdFx0ZXZlbnRzLmhpZGRlbiA9IHNldHRpbmdzLm9uSGlkZGVuIHx8IGV2ZW50cy5oaWRkZW47XG5cdFx0XHRcdF9lbmFibGVkID0gdHJ1ZTtcblx0XHRcdFx0X2RvYy5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdFx0X21lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGV2ZW50cy52aXNpYmxlID0gc2V0dGluZ3Mub25WaXNpYmxlIHx8IGV2ZW50cy52aXNpYmxlO1xuXHRcdGV2ZW50cy5oaWRkZW4gPSBzZXR0aW5ncy5vbkhpZGRlbiB8fCBldmVudHMuaGlkZGVuO1xuXHRcdF9lbmFibGVkID0gdHJ1ZTtcblx0XHRfZG9jLmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdF9tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXG5cdFx0dGhpcy5pbml0ID0gaW5pdFZpc2liaWxpdHk7XG5cdFx0dGhpcy5kZXN0cm95ID0gZGVzdHJveVZpc2liaWxpdHk7XG5cdFx0dGhpcy5vbiA9IGZ1bmN0aW9uKGV2ZW50LGZuKSB7XG5cdFx0XHRpZiAoZXZlbnQgaW4gZXZlbnRzKSBldmVudHNbZXZlbnRdID0gZm47XG5cdFx0fTtcblx0XHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykgX2VuYWJsZWQgPSB2O1xuXHRcdFx0cmV0dXJuIF9lbmFibGVkO1xuXHRcdH1cblx0fTtcbn07IiwibGV0IF9kb2MgPSBkb2N1bWVudCB8fCB7fTtcbmxldCBleHRlcm5hbENvbnRyb2xzID0gZnVuY3Rpb24oZWwpIHtcblx0bGV0IF9lbmFibGVkID0gdHJ1ZTtcblx0bGV0IF9zZWVrID0gdHJ1ZTtcblx0bGV0IF90SWQgPSBudWxsO1xuXHRsZXQgbWVkaWEgPSBlbDtcblx0bGV0IGtleWRvd24gPSBmdW5jdGlvbihlKSB7XG5cdFx0aWYgKF9lbmFibGVkKSB7XG5cdFx0XHQvL2J5cGFzcyBkZWZhdWx0IG5hdGl2ZSBleHRlcm5hbCBjb250cm9scyB3aGVuIG1lZGlhIGlzIGZvY3VzZWRcblx0XHRcdG1lZGlhLnBhcmVudE5vZGUuZm9jdXMoKTtcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzIpIHsgLy9zcGFjZVxuXHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChfc2Vlaykge1xuXHRcdFx0XHRpZiAoZS5rZXlDb2RlID09IDM3KSB7IC8vbGVmdFxuXHRcdFx0XHRcdG1lZGlhLmN1cnJlbnRUaW1lID0gbWVkaWEuY3VycmVudFRpbWUgLSA1O1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZS5rZXlDb2RlID09IDM5KSB7IC8vcmlnaHRcblx0XHRcdFx0XHRtZWRpYS5jdXJyZW50VGltZSA9IG1lZGlhLmN1cnJlbnRUaW1lICsgNTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzgpIHsgLy91cFxuXHRcdFx0XHRsZXQgdiA9IG1lZGlhLnZvbHVtZTtcblx0XHRcdFx0diArPSAuMTtcblx0XHRcdFx0aWYgKHYgPiAxKSB2ID0gMTtcblx0XHRcdFx0bWVkaWEudm9sdW1lID0gdjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDQwKSB7IC8vZG93blxuXHRcdFx0XHRsZXQgdiA9IG1lZGlhLnZvbHVtZTtcblx0XHRcdFx0diAtPSAuMTtcblx0XHRcdFx0aWYgKHYgPCAwKSB2ID0gMDtcblx0XHRcdFx0bWVkaWEudm9sdW1lID0gdjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0LyppZiAoc2VsZi5jb250cm9sQmFyKSB7XG5cdFx0XHRcdGlmIChzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbikge1xuXHRcdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gNDAgfHwgZS5rZXlDb2RlID09IDM4KSB7XG5cblx0XHRcdFx0XHRcdHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uLm1lbnVDb250ZW50LmVsXy5jbGFzc05hbWUgPSBcInZqcy1tZW51IHNob3dcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0qL1xuXHRcdH1cblx0fTtcblxuXHQvLyB0aGlzLm9uU3BhY2UgPSBmdW5jdGlvbigpIHtcblxuXHQvLyB9O1xuXG5cdGxldCBrZXl1cCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoX2VuYWJsZWQpIHtcdFx0XHRcblx0XHRcdC8vIGlmIChlLmtleUNvZGUgPT0gNDAgfHwgZS5rZXlDb2RlID09IDM4KSB7XG5cdFx0XHQvLyBcdGNsZWFySW50ZXJ2YWwoX3RJZCk7XG5cdFx0XHQvLyBcdGlmIChzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbikge1xuXHRcdFx0Ly8gXHRcdF90SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gXHRcdFx0c2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24ubWVudUNvbnRlbnQuZWxfLmNsYXNzTmFtZSA9IFwidmpzLW1lbnVcIjtcblx0XHRcdC8vIFx0XHR9LCA1MDApO1xuXHRcdFx0Ly8gXHR9XG5cdFx0XHQvLyB9XG5cdFx0fVxuXHR9O1xuXHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbihiKSB7XG5cdFx0aWYgKGIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIF9lbmFibGVkO1xuXHRcdF9lbmFibGVkID0gYjtcblxuXHR9O1xuXHR0aGlzLnNlZWtFbmFibGVkID0gZnVuY3Rpb24oYikge1xuXHRcdGlmIChiID09PSB1bmRlZmluZWQpIHJldHVybiBfc2Vlaztcblx0XHRfc2VlayA9IGI7XG5cdH07XG5cdHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdF9lbmFibGVkID0gdHJ1ZTtcblx0XHRfdElkID0gbnVsbDtcblx0XHRfc2VlayA9IHRydWU7XG5cdFx0X2RvYy5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duLmJpbmQodGhpcyksIGZhbHNlKTtcblx0XHRfZG9jLmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cC5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdH07XG5cdHRoaXMuZGVzdHJveSA9ICBmdW5jdGlvbigpIHtcblx0XHRfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdF90SWQgPSBudWxsO1xuXHRcdF9zZWVrID0gdHJ1ZTtcblx0XHRfZG9jLmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24pO1xuXHRcdF9kb2MuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwKTtcblx0fVxuXHR0aGlzLmluaXQoKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGV4dGVybmFsQ29udHJvbHM7IiwiLy9odHRwczovL2dpdGh1Yi5jb20vZmRhY2l1ay9hamF4XG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XG4gICAgdmFyIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnXVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgb3B0aW9ucy5iYXNlVXJsID0gb3B0aW9ucy5iYXNlVXJsIHx8ICcnXG4gICAgaWYgKG9wdGlvbnMubWV0aG9kICYmIG9wdGlvbnMudXJsKSB7XG4gICAgICByZXR1cm4geGhyQ29ubmVjdGlvbihcbiAgICAgICAgb3B0aW9ucy5tZXRob2QsXG4gICAgICAgIG9wdGlvbnMuYmFzZVVybCArIG9wdGlvbnMudXJsLFxuICAgICAgICBtYXliZURhdGEob3B0aW9ucy5kYXRhKSxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kcy5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBtZXRob2QpIHtcbiAgICAgIGFjY1ttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiB4aHJDb25uZWN0aW9uKFxuICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICBvcHRpb25zLmJhc2VVcmwgKyB1cmwsXG4gICAgICAgICAgbWF5YmVEYXRhKGRhdGEpLFxuICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY1xuICAgIH0sIHt9KVxuICB9XG5cbiAgZnVuY3Rpb24gbWF5YmVEYXRhKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YSB8fCBudWxsXG4gIH1cblxuICBmdW5jdGlvbiB4aHJDb25uZWN0aW9uKHR5cGUsIHVybCwgZGF0YSwgb3B0aW9ucykge1xuICAgIHZhciByZXR1cm5NZXRob2RzID0gWyd0aGVuJywgJ2NhdGNoJywgJ2Fsd2F5cyddXG4gICAgdmFyIHByb21pc2VNZXRob2RzID0gcmV0dXJuTWV0aG9kcy5yZWR1Y2UoZnVuY3Rpb24ocHJvbWlzZSwgbWV0aG9kKSB7XG4gICAgICBwcm9taXNlW21ldGhvZF0gPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBwcm9taXNlW21ldGhvZF0gPSBjYWxsYmFja1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9LCB7fSlcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICB4aHIub3Blbih0eXBlLCB1cmwsIHRydWUpXG4gICAgeGhyLndpdGhDcmVkZW50aWFscyA9IG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3dpdGhDcmVkZW50aWFscycpXG4gICAgc2V0SGVhZGVycyh4aHIsIG9wdGlvbnMuaGVhZGVycylcbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIHJlYWR5KHByb21pc2VNZXRob2RzLCB4aHIpLCBmYWxzZSlcbiAgICB4aHIuc2VuZChvYmplY3RUb1F1ZXJ5U3RyaW5nKGRhdGEpKVxuICAgIHByb21pc2VNZXRob2RzLmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geGhyLmFib3J0KClcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2VNZXRob2RzXG4gIH1cblxuICBmdW5jdGlvbiBzZXRIZWFkZXJzKHhociwgaGVhZGVycykge1xuICAgIGhlYWRlcnMgPSBoZWFkZXJzIHx8IHt9XG4gICAgaWYgKCFoYXNDb250ZW50VHlwZShoZWFkZXJzKSkge1xuICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIChoZWFkZXJzW25hbWVdICYmIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIGhlYWRlcnNbbmFtZV0pKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBoYXNDb250ZW50VHlwZShoZWFkZXJzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGhlYWRlcnMpLnNvbWUoZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZSdcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZHkocHJvbWlzZU1ldGhvZHMsIHhocikge1xuICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVSZWFkeSgpIHtcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0geGhyLkRPTkUpIHtcbiAgICAgICAgeGhyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBoYW5kbGVSZWFkeSwgZmFsc2UpXG4gICAgICAgIHByb21pc2VNZXRob2RzLmFsd2F5cy5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKVxuXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgcHJvbWlzZU1ldGhvZHMudGhlbi5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2VNZXRob2RzLmNhdGNoLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlKHhocikge1xuICAgIHZhciByZXN1bHRcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVRleHRcbiAgICB9XG4gICAgcmV0dXJuIFtyZXN1bHQsIHhocl1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9iamVjdFRvUXVlcnlTdHJpbmcoZGF0YSkge1xuICAgIHJldHVybiBpc09iamVjdChkYXRhKSA/IGdldFF1ZXJ5U3RyaW5nKGRhdGEpIDogZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gaXNPYmplY3QoZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgPT09ICdbb2JqZWN0IE9iamVjdF0nXG4gIH1cblxuICBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZyhvYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpdGVtKSB7XG4gICAgICB2YXIgcHJlZml4ID0gIWFjYyA/ICcnIDogYWNjICsgJyYnXG4gICAgICByZXR1cm4gcHJlZml4ICsgZW5jb2RlKGl0ZW0pICsgJz0nICsgZW5jb2RlKG9iamVjdFtpdGVtXSlcbiAgICB9LCAnJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuY29kZSh2YWx1ZSkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpXG4gIH1cblxuICByZXR1cm4gYWpheFxufSkoKTsiLCJpbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4vaGVscGVycy9kZWVwbWVyZ2UnO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyLCBzY2FsZUZvbnQsIGRlYm91bmNlIH0gZnJvbSAnLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkb20gZnJvbSAnLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgZGV2aWNlIGZyb20gJy4vaGVscGVycy9kZXZpY2UnO1xuaW1wb3J0IGF1dG9Gb250IGZyb20gJy4vY29yZS9hdXRvRm9udCc7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vY29yZS9jb250YWluZXIvY29udGFpbmVyJztcbmltcG9ydCBNZWRpYSBmcm9tICcuL2NvcmUvbWVkaWEvaW5kZXgnO1xuaW1wb3J0IGNvbnRhaW5lckJvdW5kcyBmcm9tICcuL2hlbHBlcnMvY29udGFpbmVyQm91bmRzJztcbmltcG9ydCBwYWdlVmlzaWJpbGl0eSBmcm9tICcuL2hlbHBlcnMvcGFnZVZpc2liaWxpdHknO1xuaW1wb3J0IGV4dGVybmFsQ29udHJvbHMgZnJvbSAnLi9jb3JlL21lZGlhL2V2ZW50cy9leHRlcm5hbENvbnRyb2xzJztcbmltcG9ydCBhamF4IGZyb20gJy4vaGVscGVycy9hamF4JztcblxuY29uc3QgZm5fY29udGV4dG1lbnUgPSBmdW5jdGlvbihlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0cmV0dXJuIGZhbHNlO1xufVxuXG5jb25zdCBkZWZhdWx0cyA9IHtcblx0dmlkZW9XaWR0aDogOTIwLFxuXHR2aWRlb0hlaWdodDogNTIwLFxuXHRhdXRvcGxheTogZmFsc2UsXG5cdGxvb3A6IGZhbHNlLFxuXHRjb250cm9sczogZmFsc2UsXG5cdGZvbnQ6IHtcblx0XHRyYXRpbzogMSxcblx0XHRtaW46IC41LFxuXHRcdHVuaXRzOiBcImVtXCJcblx0fVxufTtcblxuY2xhc3Mga21sUGxheWVyIGV4dGVuZHMgTWVkaWEge1xuXHRjb25zdHJ1Y3RvcihzZXR0aW5ncywgX2V2ZW50cywgYXBwKSB7XG5cdFx0bGV0IGVsID0gc2V0dGluZ3MudmlkZW87XG5cdFx0c3VwZXIoZWwpO1xuXHRcdGlmKGVsID09IG51bGwpIHJldHVybjtcblx0XHR0aGlzLmRldmljZSA9IGRldmljZTtcblx0XHR0aGlzLl9fc2V0dGluZ3MgPSBkZWVwbWVyZ2UoZGVmYXVsdHMsIHNldHRpbmdzKTtcblx0XHRkb20uYWRkQ2xhc3MoZWwsIFwia21sXCIgKyBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkpO1xuXHRcdHRoaXMud3JhcHBlciA9IGRvbS53cmFwKHRoaXMubWVkaWEsIGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG5cdFx0XHRjbGFzczogJ2ttbFBsYXllcidcblx0XHR9KSk7XG5cdFx0ZG9tLnRyaWdnZXJXZWJraXRIYXJkd2FyZUFjY2VsZXJhdGlvbih0aGlzLndyYXBwZXIpO1xuXG5cdFx0Ly9pbml0U2V0dGluZ3Ncblx0XHRmb3IodmFyIGsgaW4gdGhpcy5fX3NldHRpbmdzKXtcblx0XHRcdGlmKHRoaXNba10pe1xuXHRcdFx0XHRpZihrPT09J2F1dG9wbGF5JyAmJiB0aGlzLl9fc2V0dGluZ3Nba10pIHtcblx0XHRcdFx0XHR0aGlzLnBsYXkoKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzW2tdKHRoaXMuX19zZXR0aW5nc1trXSk7XG5cdFx0XHR9XG5cdFx0XHRpZihrID09PSAnY29udHJvbHMnICYmIHRoaXMuX19zZXR0aW5nc1trXSA9PT0gXCJuYXRpdmVcIikge1xuXHRcdFx0XHR0aGlzLm5hdGl2ZUNvbnRyb2xzKHRydWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vaW5pdFBhZ2VWaXNpYmlsaXR5XG5cdFx0dGhpcy5wYWdlVmlzaWJpbGl0eSA9IG5ldyBwYWdlVmlzaWJpbGl0eShlbCk7XG5cblx0XHQvL2luaXRleHRlcm5hbENvbnRyb2xzXG5cdFx0dGhpcy5leHRlcm5hbENvbnRyb2xzID0gbmV3IGV4dGVybmFsQ29udHJvbHMoZWwpO1xuXG5cdFx0Ly9pbml0Q29udGFpbmVyc1xuXHRcdHRoaXMuY29udGFpbmVycyA9IG5ldyBDb250YWluZXIodGhpcyk7XG5cblx0XHQvL2F1dG9GT05UXG5cdFx0aWYodHlwZW9mIHRoaXMuX19zZXR0aW5ncy5mb250ID09PSBcImJvb2xlYW5cIiAmJiB0aGlzLl9fc2V0dGluZ3MuZm9udCkgdGhpcy5fX3NldHRpbmdzLmZvbnQgPSBkZWZhdWx0cy5mb250O1xuXHRcdHRoaXMuYXV0b0ZvbnQgPSBuZXcgYXV0b0ZvbnQodGhpcy53cmFwcGVyLCB0aGlzLl9fc2V0dGluZ3MuZm9udCwgdGhpcyk7XG5cdFx0aWYodGhpcy5fX3NldHRpbmdzLmZvbnQpIHRoaXMuYXV0b0ZvbnQuZW5hYmxlZCh0cnVlKTtcblxuXHRcdC8vaW5pdENhbGxiYWNrRXZlbnRzXG5cdFx0Zm9yICh2YXIgZXZ0IGluIF9ldmVudHMpIHtcblx0XHRcdHRoaXMub24oZXZ0LCBfZXZlbnRzW2V2dF0sIHRoaXMpO1xuXHRcdH1cblxuXHRcdHRoaXMub24oJ2xvYWRlZG1ldGFkYXRhJywgKCk9Pntcblx0XHRcdGlmKHRoaXMubWVkaWEud2lkdGggIT0gdGhpcy5tZWRpYS52aWRlb1dpZHRoIHx8IHRoaXMubWVkaWEuaGVpZ2h0ICE9IHRoaXMubWVkaWEudmlkZW9IZWlnaHQpe1xuXHRcdFx0XHR0aGlzLnZpZGVvV2lkdGgoKTtcblx0XHRcdFx0dGhpcy52aWRlb0hlaWdodCgpO1xuXHRcdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdFx0XHR0aGlzLmVtaXQoJ3ZpZGVvUmVzaXplJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCk9PnsgdGhpcy5lbWl0KCdyZXNpemUnKTsgfSwgZmFsc2UpO1xuXG5cdFx0aWYodHlwZW9mIGFwcCA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRhcHAuYmluZCh0aGlzKSgpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnRleHRNZW51KHYpe1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR2ID8gdGhpcy5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZuX2NvbnRleHRtZW51KSA6IHRoaXMubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmbl9jb250ZXh0bWVudSk7XG5cdFx0fVxuXHR9XG5cblx0YWpheChvcHRpb25zKSB7XG5cdFx0cmV0dXJuIGFqYXgob3B0aW9ucyk7XG5cdH1cblxuXHR2aWRlb1dpZHRoKHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb1dpZHRoKSB7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdGhpcy5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEud2lkdGg7XG5cdH1cblxuXHR2aWRlb0hlaWdodCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9IZWlnaHQpIHtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdGhpcy5tZWRpYS52aWRlb0hlaWdodDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdH1cblx0XHRpZiAoIWlzTmFOKHYpKSB7XG5cdFx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuaGVpZ2h0O1xuXHR9XG5cblx0c2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMudmlkZW9XaWR0aCgpIC8gdGhpcy52aWRlb0hlaWdodCgpO1xuXHR9XG5cblx0Ym91bmRzKHYpIHtcblx0XHRsZXQgZGF0YSA9IGNvbnRhaW5lckJvdW5kcyh0aGlzLm1lZGlhKTtcblx0XHRpZiAoZGF0YVt2XSAhPT0gbnVsbCkgcmV0dXJuIGRhdGFbdl07XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHR3aWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ3dpZHRoJyk7XG5cdH1cblxuXHRoZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdoZWlnaHQnKTtcblx0fVxuXG5cdG9mZnNldFgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRYJyk7XG5cdH1cblxuXHRvZmZzZXRZKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnb2Zmc2V0WScpO1xuXHR9XG5cblx0d3JhcHBlckhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHR3cmFwcGVyV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGg7XG5cdH1cblxuXHR3cmFwcGVyU2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGggLyB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdGFkZENsYXNzKHYsIGVsKSB7XG5cdFx0aWYoZWwgIT0gbnVsbCl7XG5cdFx0XHRkb20uYWRkQ2xhc3MoZWwsIHYpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRkb20uYWRkQ2xhc3ModGhpcy53cmFwcGVyLCB2KTtcblx0fVxuXHRyZW1vdmVDbGFzcyh2LCBlbCkge1xuXHRcdGlmKGVsICE9IG51bGwpe1xuXHRcdFx0ZG9tLnJlbW92ZUNsYXNzKGVsLCB2KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHYgIT09ICdrbWxQbGF5ZXInKSB7XG5cdFx0XHRkb20ucmVtb3ZlQ2xhc3ModGhpcy53cmFwcGVyLCB2KTtcblx0XHR9XG5cdH1cblx0dG9nZ2xlQ2xhc3ModiwgZWwpIHtcblx0XHRpZihlbCAhPSBudWxsKXtcblx0XHRcdGRvbS50b2dnbGVDbGFzcyhlbCwgdik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLnRvZ2dsZUNsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG59O1xuXG4vL2Rpc2FibGUgb24gcHJvZHVjdGlvblxuaWYoZGV2aWNlLmlzVG91Y2gpe1xuXHR3aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHNjcmlwdFVybCwgbGluZSwgY29sdW1uKSB7XG5cdCAgICBjb25zb2xlLmxvZyhsaW5lLCBjb2x1bW4sIG1lc3NhZ2UpO1xuXHQgICAgYWxlcnQobGluZSArIFwiOlwiICtjb2x1bW4gK1wiLVwiKyBtZXNzYWdlKTtcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQga21sUGxheWVyOyJdLCJuYW1lcyI6WyJiYWJlbEhlbHBlcnMudHlwZW9mIiwiZGVmYXVsdHMiLCJFdmVudHMiLCJfZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0JBQWUsQ0FBQyxZQUFVO0FBQ3pCLElBQUEsS0FBSSxZQUFZLFNBQVosU0FBWSxDQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0I7QUFDckMsSUFBQSxNQUFHLEdBQUgsRUFBTztBQUNILElBQUEsT0FBSSxRQUFRLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBWjtBQUNBLElBQUEsT0FB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