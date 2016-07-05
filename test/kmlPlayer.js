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

    function debounce(fn, delay) {
    	var t;
    	return function () {
    		clearTimeout(t);
    		t = setTimeout(fn, delay);
    	};
    }
    function scaleFont(f, width) {
    	var r = false,
    	    l = false;
    	if (f.min !== false && f.ratio !== false) {
    		r = f.ratio * width / 1000;
    		if (r < f.min) r = f.min;
    		if (f.units == 'px') r = Math.ceil(r);
    		r = r + f.units;
    		if (!isNaN(f.lineHeight) && f.lineHeight) {
    			l = r * f.lineHeight;
    			if (l < 1) l = 1;
    			l = l + f.units;
    		}
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

    var dom = {
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

    var autoFont = function autoFont(el, _width, font) {
    	var data = null;
    	var _enabled = false;
    	var applyNewFont = function applyNewFont() {
    		data = scaleFont(font, _width());
    		if (data.fontSize) el.style.fontSize = data.fontSize;
    		if (data.lineHeight) el.style.lineHeight = data.lineHeight;
    	};
    	var _update = function _update() {
    		debounce(function () {
    			applyNewFont();
    		}, 100)();
    	};
    	this.update = function (v) {
    		if (v !== undefined) {
    			font = deepmerge(font, v);
    			console.log(font);
    			applyNewFont();
    		}
    	};
    	this.enabled = function (v) {
    		if (typeof v === 'boolean') {
    			_enabled = v;
    			v ? (window.addEventListener('resize', _update, false), applyNewFont()) : window.removeEventListener('resize', _update, false);
    		}
    		return _enabled;;
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
    	defaultWidth: 960,
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

    	function kmlPlayer(el, settings, _events) {
    		classCallCheck(this, kmlPlayer);

    		var _this = possibleConstructorReturn(this, _Media.call(this, el));

    		_this.__settings = deepmerge(defaults, settings);
    		dom.class.add(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
    		_this.wrapper = dom.wrap(_this.media, dom.createElement('div', {
    			class: 'kmlPlayer'
    		}));

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

    		//autoFONT
    		var _width = function _width() {
    			return _this.width();
    		};
    		_this.autoFont = new autoFont(_this.wrapper, _width, _this.__settings.font);
    		if (_this.__settings.font) _this.autoFont.enabled(true);

    		//initCallbackEvents
    		for (var evt in _events) {
    			_this.on(evt, _events[evt], _this);
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

    	kmlPlayer.prototype.addClass = function addClass(v) {
    		dom.class.add(this.wrapper, v);
    	};

    	kmlPlayer.prototype.removeClass = function removeClass(v) {
    		if (v !== 'kmlPlayer') {
    			dom.class.remove(this.wrapper, v);
    		}
    	};

    	kmlPlayer.prototype.toggleClass = function toggleClass(v) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzL2RlZXBtZXJnZS5qcyIsIi4uL3NyYy9oZWxwZXJzL3V0aWxzLmpzIiwiLi4vc3JjL2hlbHBlcnMvZG9tLmpzIiwiLi4vc3JjL2NvcmUvYXV0b0ZvbnQuanMiLCIuLi9zcmMvY29yZS9tZWRpYS9ldmVudHMvaW5kZXguanMiLCIuLi9zcmMvaGVscGVycy9zY3JvbGxQb3NpdGlvbi5qcyIsIi4uL3NyYy9jb3JlL2Z1bGxzY3JlZW4uanMiLCIuLi9zcmMvaGVscGVycy9jYW5jZWxWaWRlb05ldHdvcmtSZXF1ZXN0LmpzIiwiLi4vc3JjL2hlbHBlcnMvbWltZVR5cGUuanMiLCIuLi9zcmMvY29yZS9tZWRpYS9pbmRleC5qcyIsIi4uL3NyYy9oZWxwZXJzL2NvbnRhaW5lckJvdW5kcy5qcyIsIi4uL3NyYy9oZWxwZXJzL3BhZ2VWaXNpYmlsaXR5LmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvZXZlbnRzL2V4dGVybmFsQ29udHJvbHMuanMiLCIuLi9zcmMvaGVscGVycy9hamF4LmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpe1xuXHRsZXQgZGVlcG1lcmdlID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpIHtcblx0XHRpZihzcmMpe1xuXHRcdCAgICB2YXIgYXJyYXkgPSBBcnJheS5pc0FycmF5KHNyYyk7XG5cdFx0ICAgIHZhciBkc3QgPSBhcnJheSAmJiBbXSB8fCB7fTtcblxuXHRcdCAgICBpZiAoYXJyYXkpIHtcblx0XHQgICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBbXTtcblx0XHQgICAgICAgIGRzdCA9IGRzdC5jb25jYXQodGFyZ2V0KTtcblx0XHQgICAgICAgIHNyYy5mb3JFYWNoKGZ1bmN0aW9uKGUsIGkpIHtcblx0XHQgICAgICAgICAgICBpZiAodHlwZW9mIGRzdFtpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2ldID0gZTtcblx0XHQgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgICAgICBkc3RbaV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2ldLCBlKTtcblx0XHQgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmluZGV4T2YoZSkgPT09IC0xKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3QucHVzaChlKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgIE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gdGFyZ2V0W2tleV07XG5cdFx0ICAgICAgICAgICAgfSlcblx0XHQgICAgICAgIH1cblx0XHQgICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBzcmNba2V5XSAhPT0gJ29iamVjdCcgfHwgIXNyY1trZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG5cdFx0ICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFtrZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2tleV0sIHNyY1trZXldKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9XG5cdFx0ICAgIHJldHVybiBkc3Q7XG5cdCAgICB9ZWxzZXtcblx0ICAgIFx0cmV0dXJuIHRhcmdldCB8fMKgW107XG5cdCAgICB9XG5cdH1cblx0cmV0dXJuIGRlZXBtZXJnZTtcbn0pKCk7IiwiZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJpbShzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmbiwgZGVsYXkpIHtcblx0dmFyIHRcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFyVGltZW91dCh0KVxuXHRcdHQgPSBzZXRUaW1lb3V0KGZuLCBkZWxheSlcblx0fVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcmNlbnRhZ2UoY3VycmVudCwgbWF4KSB7XG5cdGlmIChjdXJyZW50ID09PSAwIHx8IG1heCA9PT0gMCB8fCBpc05hTihjdXJyZW50KSB8fCBpc05hTihtYXgpKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0cmV0dXJuICgoY3VycmVudCAvIG1heCkgKiAxMDApLnRvRml4ZWQoMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kQmluYXJ5ZnVuY3Rpb24oKSB7XG5cdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvU2Vjb25kcyh0KSB7XG5cdHZhciBzID0gMC4wO1xuXHRpZiAodCkge1xuXHRcdHZhciBwID0gdC5zcGxpdCgnOicpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKylcblx0XHRcdHMgPSBzICogNjAgKyBwYXJzZUZsb2F0KHBbaV0ucmVwbGFjZSgnLCcsICcuJykpXG5cdH1cblx0cmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvTGluZUhlaWdodChlbCl7XG5cdGxldCBsID0gZWwub2Zmc2V0SGVpZ2h0ICsgXCJweFwiO1xuXHRlbC5zdHlsZS5saW5lSGVpZ2h0ID0gbDtcblx0cmV0dXJuIGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZUZvbnQoZiwgd2lkdGgpIHtcblx0dmFyIHIgPSBmYWxzZSwgbCA9IGZhbHNlO1xuXHRpZiAoZi5taW4gIT09IGZhbHNlICYmIGYucmF0aW8gIT09IGZhbHNlKSB7XG5cdFx0ciA9IGYucmF0aW8gKiB3aWR0aCAvIDEwMDA7XG5cdFx0aWYgKHIgPCBmLm1pbikgciA9IGYubWluO1xuXHRcdGlmIChmLnVuaXRzID09ICdweCcpIHIgPSBNYXRoLmNlaWwocik7XG5cdFx0ciA9IHIgKyBmLnVuaXRzO1xuXHRcdGlmICghaXNOYU4oZi5saW5lSGVpZ2h0KSAmJiBmLmxpbmVIZWlnaHQpIHtcblx0XHRcdGwgPSByICogZi5saW5lSGVpZ2h0O1xuXHRcdFx0aWYgKGwgPCAxKSBsID0gMTtcblx0XHRcdGwgPSBsICsgZi51bml0cztcblx0XHR9XG5cdH1cblx0cmV0dXJuIHtmb250U2l6ZTogciwgbGluZUhlaWdodDogbH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7fTsiLCIvKipcbiAqIEBtb2R1bGUgZG9tXG4gKiBNb2R1bGUgZm9yIGVhc2luZyB0aGUgbWFuaXB1bGF0aW9uIG9mIGRvbSBlbGVtZW50c1xuICovXG5cbmxldCBjbGFzc1JlZyA9IGZ1bmN0aW9uKGMpIHtcblx0cmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxccyspXCIgKyBjICsgXCIoXFxcXHMrfCQpXCIpO1xufTtcblxubGV0IGhhc0NsYXNzXG5sZXQgYWRkQ2xhc3NcbmxldCByZW1vdmVDbGFzcztcbmxldCB0b2dnbGVDbGFzcztcblxuaWYgKCdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRoYXNDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRyZXR1cm4gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoYyk7XG5cdH07XG5cdGFkZENsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGMgPSBjLnNwbGl0KCcgJyk7XG5cdFx0Zm9yICh2YXIgayBpbiBjKSBlbGVtLmNsYXNzTGlzdC5hZGQoY1trXSk7XG5cdH07XG5cdHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjKTtcblx0fTtcbn0gZWxzZSB7XG5cdGhhc0NsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdHJldHVybiBjbGFzc1JlZyhjKS50ZXN0KGVsZW0uY2xhc3NOYW1lKTtcblx0fTtcblx0YWRkQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0aWYgKCFoYXNDbGFzcyhlbGVtLCBjKSkge1xuXHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgJyArIGM7XG5cdFx0fVxuXHR9O1xuXHRyZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NSZWcoYyksICcgJyk7XG5cdH07XG59XG5cbnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHR2YXIgZm4gPSBoYXNDbGFzcyhlbGVtLCBjKSA/IHJlbW92ZUNsYXNzIDogYWRkQ2xhc3M7XG5cdGZuKGVsZW0sIGMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRjbGFzczoge1xuXHRcdGhhczogaGFzQ2xhc3MsXG5cdFx0YWRkOiBhZGRDbGFzcyxcblx0XHRyZW1vdmU6IHJlbW92ZUNsYXNzLFxuXHRcdHRvZ2dsZTogdG9nZ2xlQ2xhc3Ncblx0fSxcblx0Y3JlYXRlRWxlbWVudDogZnVuY3Rpb24obm9kZSwgcHJvcHMpIHtcblx0XHRsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUpO1xuXHRcdGZvciAobGV0IGsgaW4gcHJvcHMpIHtcblx0XHRcdGVsLnNldEF0dHJpYnV0ZShrLCBwcm9wc1trXSk7XG5cdFx0fVxuXHRcdHJldHVybiBlbDtcblx0fSxcblx0Ly8gUmVtb3ZlIGFuIGVsZW1lbnRcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIH0sXG5cdHdyYXA6IGZ1bmN0aW9uKGVsZW1lbnRzLCB3cmFwcGVyKSB7XG5cdFx0Ly8gQ29udmVydCBgZWxlbWVudHNgIHRvIGFuIGFycmF5LCBpZiBuZWNlc3NhcnkuXG5cdFx0aWYgKCFlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdGVsZW1lbnRzID0gW2VsZW1lbnRzXTtcblx0XHR9XG5cblx0XHQvLyBMb29wcyBiYWNrd2FyZHMgdG8gcHJldmVudCBoYXZpbmcgdG8gY2xvbmUgdGhlIHdyYXBwZXIgb24gdGhlXG5cdFx0Ly8gZmlyc3QgZWxlbWVudCAoc2VlIGBjaGlsZGAgYmVsb3cpLlxuXHRcdGZvciAodmFyIGkgPSBlbGVtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0dmFyIGNoaWxkID0gKGkgPiAwKSA/IHdyYXBwZXIuY2xvbmVOb2RlKHRydWUpIDogd3JhcHBlcjtcblx0XHRcdHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV07XG5cblx0XHRcdC8vIENhY2hlIHRoZSBjdXJyZW50IHBhcmVudCBhbmQgc2libGluZy5cblx0XHRcdHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR2YXIgc2libGluZyA9IGVsZW1lbnQubmV4dFNpYmxpbmc7XG5cblx0XHRcdC8vIFdyYXAgdGhlIGVsZW1lbnQgKGlzIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBjdXJyZW50XG5cdFx0XHQvLyBwYXJlbnQpLlxuXHRcdFx0Y2hpbGQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cblx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGhhZCBhIHNpYmxpbmcsIGluc2VydCB0aGUgd3JhcHBlciBiZWZvcmVcblx0XHRcdC8vIHRoZSBzaWJsaW5nIHRvIG1haW50YWluIHRoZSBIVE1MIHN0cnVjdHVyZTsgb3RoZXJ3aXNlLCBqdXN0XG5cdFx0XHQvLyBhcHBlbmQgaXQgdG8gdGhlIHBhcmVudC5cblx0XHRcdGlmIChzaWJsaW5nKSB7XG5cdFx0XHRcdHBhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHNpYmxpbmcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNoaWxkO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7c2NhbGVGb250LCBkZWJvdW5jZX0gZnJvbSAnLi4vaGVscGVycy91dGlscyc7XG5pbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4uL2hlbHBlcnMvZGVlcG1lcmdlJztcbmxldCBhdXRvRm9udCA9IGZ1bmN0aW9uKGVsLCBfd2lkdGgsIGZvbnQpIHtcblx0bGV0IGRhdGEgPSBudWxsO1xuXHRsZXQgX2VuYWJsZWQgPSBmYWxzZTtcblx0bGV0IGFwcGx5TmV3Rm9udCA9IGZ1bmN0aW9uKCl7XG5cdFx0ZGF0YSA9IHNjYWxlRm9udChmb250LCBfd2lkdGgoKSk7XG5cdFx0aWYoZGF0YS5mb250U2l6ZSkgZWwuc3R5bGUuZm9udFNpemUgPSBkYXRhLmZvbnRTaXplO1xuXHRcdGlmKGRhdGEubGluZUhlaWdodCkgZWwuc3R5bGUubGluZUhlaWdodCA9IGRhdGEubGluZUhlaWdodDtcblx0fVxuXHRsZXQgX3VwZGF0ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0ZGVib3VuY2UoZnVuY3Rpb24oKXtcblx0XHRcdGFwcGx5TmV3Rm9udCgpO1xuXHRcdH0sMTAwKSgpO1xuXHR9XG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24odikge1xuXHRcdGlmKHYgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRmb250ID0gZGVlcG1lcmdlKGZvbnQsIHYpO1xuXHRcdFx0Y29uc29sZS5sb2coZm9udCk7XG5cdFx0XHRhcHBseU5ld0ZvbnQoKTtcblx0XHR9XG5cdH07XG5cdHRoaXMuZW5hYmxlZCA9ICBmdW5jdGlvbih2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdF9lbmFibGVkID0gdjtcblx0XHRcdHYgPyAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF91cGRhdGUsIGZhbHNlKSwgYXBwbHlOZXdGb250KCkpIDogd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF91cGRhdGUsIGZhbHNlKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9lbmFibGVkOztcblx0fTtcbn1cbmV4cG9ydCBkZWZhdWx0IGF1dG9Gb250OyIsIi8vaHR0cHM6Ly9naXRodWIuY29tL3ByaW11cy9ldmVudGVtaXR0ZXIzXG4ndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gICwgcHJlZml4ID0gJ34nO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhIHN0b3JhZ2UgZm9yIG91ciBgRUVgIG9iamVjdHMuXG4gKiBBbiBgRXZlbnRzYCBpbnN0YW5jZSBpcyBhIHBsYWluIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIGFyZSBldmVudCBuYW1lcy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFdmVudHMoKSB7fVxuXG4vL1xuLy8gV2UgdHJ5IHRvIG5vdCBpbmhlcml0IGZyb20gYE9iamVjdC5wcm90b3R5cGVgLiBJbiBzb21lIGVuZ2luZXMgY3JlYXRpbmcgYW5cbi8vIGluc3RhbmNlIGluIHRoaXMgd2F5IGlzIGZhc3RlciB0aGFuIGNhbGxpbmcgYE9iamVjdC5jcmVhdGUobnVsbClgIGRpcmVjdGx5LlxuLy8gSWYgYE9iamVjdC5jcmVhdGUobnVsbClgIGlzIG5vdCBzdXBwb3J0ZWQgd2UgcHJlZml4IHRoZSBldmVudCBuYW1lcyB3aXRoIGFcbi8vIGNoYXJhY3RlciB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYnVpbHQtaW4gb2JqZWN0IHByb3BlcnRpZXMgYXJlIG5vdFxuLy8gb3ZlcnJpZGRlbiBvciB1c2VkIGFzIGFuIGF0dGFjayB2ZWN0b3IuXG4vL1xuaWYgKE9iamVjdC5jcmVhdGUpIHtcbiAgRXZlbnRzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgLy9cbiAgLy8gVGhpcyBoYWNrIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBgX19wcm90b19fYCBwcm9wZXJ0eSBpcyBzdGlsbCBpbmhlcml0ZWQgaW5cbiAgLy8gc29tZSBvbGQgYnJvd3NlcnMgbGlrZSBBbmRyb2lkIDQsIGlQaG9uZSA1LjEsIE9wZXJhIDExIGFuZCBTYWZhcmkgNS5cbiAgLy9cbiAgaWYgKCFuZXcgRXZlbnRzKCkuX19wcm90b19fKSBwcmVmaXggPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uY2U9ZmFsc2VdIFNwZWNpZnkgaWYgdGhlIGxpc3RlbmVyIGlzIGEgb25lLXRpbWUgbGlzdGVuZXIuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFRShmbiwgY29udGV4dCwgb25jZSkge1xuICB0aGlzLmZuID0gZm47XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMub25jZSA9IG9uY2UgfHwgZmFsc2U7XG59XG5cbi8qKlxuICogTWluaW1hbCBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UgdGhhdCBpcyBtb2xkZWQgYWdhaW5zdCB0aGUgTm9kZS5qc1xuICogYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYW4gYXJyYXkgbGlzdGluZyB0aGUgZXZlbnRzIGZvciB3aGljaCB0aGUgZW1pdHRlciBoYXMgcmVnaXN0ZXJlZFxuICogbGlzdGVuZXJzLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHZhciBuYW1lcyA9IFtdXG4gICAgLCBldmVudHNcbiAgICAsIG5hbWU7XG5cbiAgaWYgKHRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSByZXR1cm4gbmFtZXM7XG5cbiAgZm9yIChuYW1lIGluIChldmVudHMgPSB0aGlzLl9ldmVudHMpKSB7XG4gICAgaWYgKGhhcy5jYWxsKGV2ZW50cywgbmFtZSkpIG5hbWVzLnB1c2gocHJlZml4ID8gbmFtZS5zbGljZSgxKSA6IG5hbWUpO1xuICB9XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICByZXR1cm4gbmFtZXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZXZlbnRzKSk7XG4gIH1cblxuICByZXR1cm4gbmFtZXM7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXhpc3RzIE9ubHkgY2hlY2sgaWYgdGhlcmUgYXJlIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtBcnJheXxCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnMoZXZlbnQsIGV4aXN0cykge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudFxuICAgICwgYXZhaWxhYmxlID0gdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKGV4aXN0cykgcmV0dXJuICEhYXZhaWxhYmxlO1xuICBpZiAoIWF2YWlsYWJsZSkgcmV0dXJuIFtdO1xuICBpZiAoYXZhaWxhYmxlLmZuKSByZXR1cm4gW2F2YWlsYWJsZS5mbl07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdmFpbGFibGUubGVuZ3RoLCBlZSA9IG5ldyBBcnJheShsKTsgaSA8IGw7IGkrKykge1xuICAgIGVlW2ldID0gYXZhaWxhYmxlW2ldLmZuO1xuICB9XG5cbiAgcmV0dXJuIGVlO1xufTtcblxuLyoqXG4gKiBDYWxscyBlYWNoIG9mIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgZXZlbnQgaGFkIGxpc3RlbmVycywgZWxzZSBgZmFsc2VgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudCwgYTEsIGEyLCBhMywgYTQsIGE1KSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiBmYWxzZTtcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF1cbiAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGFyZ3NcbiAgICAsIGk7XG5cbiAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgIGlmIChsaXN0ZW5lcnMub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgc3dpdGNoIChsZW4pIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSksIHRydWU7XG4gICAgICBjYXNlIDM6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCksIHRydWU7XG4gICAgICBjYXNlIDY6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQsIGE1KSwgdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgbGlzdGVuZXJzLmZuLmFwcGx5KGxpc3RlbmVycy5jb250ZXh0LCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aFxuICAgICAgLCBqO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobGlzdGVuZXJzW2ldLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyc1tpXS5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgICAgc3dpdGNoIChsZW4pIHtcbiAgICAgICAgY2FzZSAxOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCk7IGJyZWFrO1xuICAgICAgICBjYXNlIDI6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSk7IGJyZWFrO1xuICAgICAgICBjYXNlIDM6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIpOyBicmVhaztcbiAgICAgICAgY2FzZSA0OiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyLCBhMyk7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghYXJncykgZm9yIChqID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaiAtIDFdID0gYXJndW1lbnRzW2pdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5hcHBseShsaXN0ZW5lcnNbaV0uY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIEFkZCBhIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCB0aGlzKVxuICAgICwgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGxpc3RlbmVyLCB0aGlzLl9ldmVudHNDb3VudCsrO1xuICBlbHNlIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlIHRoaXMuX2V2ZW50c1tldnRdID0gW3RoaXMuX2V2ZW50c1tldnRdLCBsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhIG9uZS10aW1lIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcywgdHJ1ZSlcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxpc3RlbmVycyBvZiBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBPbmx5IHJlbW92ZSB0aGUgbGlzdGVuZXJzIHRoYXQgbWF0Y2ggdGhpcyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IGhhdmUgdGhpcyBjb250ZXh0LlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgcmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIHRoaXM7XG4gIGlmICghZm4pIHtcbiAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAoXG4gICAgICAgICBsaXN0ZW5lcnMuZm4gPT09IGZuXG4gICAgICAmJiAoIW9uY2UgfHwgbGlzdGVuZXJzLm9uY2UpXG4gICAgICAmJiAoIWNvbnRleHQgfHwgbGlzdGVuZXJzLmNvbnRleHQgPT09IGNvbnRleHQpXG4gICAgKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwLCBldmVudHMgPSBbXSwgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbiAhPT0gZm5cbiAgICAgICAgfHwgKG9uY2UgJiYgIWxpc3RlbmVyc1tpXS5vbmNlKVxuICAgICAgICB8fCAoY29udGV4dCAmJiBsaXN0ZW5lcnNbaV0uY29udGV4dCAhPT0gY29udGV4dClcbiAgICAgICkge1xuICAgICAgICBldmVudHMucHVzaChsaXN0ZW5lcnNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vXG4gICAgLy8gUmVzZXQgdGhlIGFycmF5LCBvciByZW1vdmUgaXQgY29tcGxldGVseSBpZiB3ZSBoYXZlIG5vIG1vcmUgbGlzdGVuZXJzLlxuICAgIC8vXG4gICAgaWYgKGV2ZW50cy5sZW5ndGgpIHRoaXMuX2V2ZW50c1tldnRdID0gZXZlbnRzLmxlbmd0aCA9PT0gMSA/IGV2ZW50c1swXSA6IGV2ZW50cztcbiAgICBlbHNlIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMsIG9yIHRob3NlIG9mIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KSB7XG4gIHZhciBldnQ7XG5cbiAgaWYgKGV2ZW50KSB7XG4gICAgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcbiAgICBpZiAodGhpcy5fZXZlbnRzW2V2dF0pIHtcbiAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEFsaWFzIG1ldGhvZHMgbmFtZXMgYmVjYXVzZSBwZW9wbGUgcm9sbCBsaWtlIHRoYXQuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG5cbi8vXG4vLyBUaGlzIGZ1bmN0aW9uIGRvZXNuJ3QgYXBwbHkgYW55bW9yZS5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBwcmVmaXguXG4vL1xuRXZlbnRFbWl0dGVyLnByZWZpeGVkID0gcHJlZml4O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuZXhwb3J0IGRlZmF1bHQgRXZlbnRFbWl0dGVyOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXHRsZXQgeCA9IDA7XG5cdGxldCB5ID0gMDtcblx0dGhpcy5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0eCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCAwO1xuXHRcdHkgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgMDtcblx0fVxuXHR0aGlzLnJlc3RvcmUgPSBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cuc2Nyb2xsVG8oeCwgeSlcblx0fVxufSIsImltcG9ydCBFdmVudHMgZnJvbSAnLi9tZWRpYS9ldmVudHMvaW5kZXgnO1xuaW1wb3J0IHNjcm9sbFBvc2l0aW9uIGZyb20gJy4uL2hlbHBlcnMvc2Nyb2xsUG9zaXRpb24nO1xuLy8gRnVsbHNjcmVlbiBBUElcbmxldCBzdXBwb3J0c0Z1bGxTY3JlZW4gPSBmYWxzZTtcbmxldCBicm93c2VyUHJlZml4ZXMgPSAnd2Via2l0IG1veiBvIG1zIGtodG1sJy5zcGxpdCgnICcpO1xubGV0IHByZWZpeEZTID0gJyc7XG4vL0NoZWNrIGZvciBuYXRpdmUgc3VwcG9ydFxuaWYgKHR5cGVvZiBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuICE9PSAndW5kZWZpbmVkJykge1xuICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG59IGVsc2Uge1xuICAgIC8vIENoZWNrIGZvciBmdWxsc2NyZWVuIHN1cHBvcnQgYnkgdmVuZG9yIHByZWZpeFxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGJyb3dzZXJQcmVmaXhlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIHByZWZpeEZTID0gYnJvd3NlclByZWZpeGVzW2ldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnRbcHJlZml4RlMgKyAnQ2FuY2VsRnVsbFNjcmVlbiddICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc3VwcG9ydHNGdWxsU2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgTVMgKHdoZW4gaXNuJ3QgaXQ/KVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQubXNGdWxsc2NyZWVuRW5hYmxlZCkge1xuICAgICAgICAgICAgcHJlZml4RlMgPSAnbXMnO1xuICAgICAgICAgICAgc3VwcG9ydHNGdWxsU2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuLy9zdXBwb3J0c0Z1bGxTY3JlZW4gPSBmYWxzZTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1bGxzY3JlZW4gZXh0ZW5kcyBFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uID0gbmV3IHNjcm9sbFBvc2l0aW9uKCk7XG4gICAgICAgIGlmICghc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUgPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBldmVudCA9IChwcmVmaXhGUyA9PT0gJycpID8gJ2Z1bGxzY3JlZW5jaGFuZ2UnIDogcHJlZml4RlMgKyAocHJlZml4RlMgPT0gJ21zJyA/ICdmdWxsc2NyZWVuY2hhbmdlJyA6ICdmdWxsc2NyZWVuY2hhbmdlJyk7XG4gICAgICAgICAgICBsZXQgZm5GdWxsc2NyZWVuQ2hhbmdlID0gKCk9PntcbiAgICAgICAgICAgICAgICBpZighdGhpcy5pc0Z1bGxTY3JlZW4oKSl7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5zY3JvbGxQb3NpdGlvbi5yZXN0b3JlLDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudC50b0xvd2VyQ2FzZSgpLCBmbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpc0Z1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMud3JhcHBlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAocHJlZml4RlMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICcnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgPT0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICBjYXNlICdtb3onOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgPT0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnRbcHJlZml4RlMgKyAnRnVsbHNjcmVlbkVsZW1lbnQnXSA9PSBlbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy53cmFwcGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24uc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIChwcmVmaXhGUyA9PT0gJycpID8gZWxlbWVudC5yZXF1ZXN0RnVsbFNjcmVlbigpIDogZWxlbWVudFtwcmVmaXhGUyArIChwcmVmaXhGUyA9PSAnbXMnID8gJ1JlcXVlc3RGdWxsc2NyZWVuJyA6ICdSZXF1ZXN0RnVsbFNjcmVlbicpXSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzRnVsbFNjcmVlbigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbi5zYXZlKCk7XG4gICAgICAgICAgICAgICAgbGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydwb3NpdGlvbiddID0gZWxlbWVudC5zdHlsZS5wb3NpdGlvbiB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWFyZ2luJ10gPSBlbGVtZW50LnN0eWxlLm1hcmdpbiB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsndG9wJ10gPSBlbGVtZW50LnN0eWxlLnRvcCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbGVmdCddID0gZWxlbWVudC5zdHlsZS5sZWZ0IHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd3aWR0aCddID0gZWxlbWVudC5zdHlsZS53aWR0aCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnaGVpZ2h0J10gPSBlbGVtZW50LnN0eWxlLmhlaWdodCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnekluZGV4J10gPSBlbGVtZW50LnN0eWxlLnpJbmRleCB8fCBcIlwiO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IGVsZW1lbnQuc3R5bGUubGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5tYXJnaW4gPSAwO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPSBlbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuekluZGV4ID0gMjE0NzQ4MzY0NztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLmlzRnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKSA6IGRvY3VtZW50W3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnRXhpdEZ1bGxzY3JlZW4nIDogJ0NhbmNlbEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRnVsbFNjcmVlbigpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQuc3R5bGVba10gPSB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVba107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmlzRnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uLnJlc3RvcmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2dnbGVGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGlzRnVsbHNjcmVlbiA9ICF0aGlzLmlzRnVsbFNjcmVlbigpO1xuICAgICAgICBpZiAoaXNGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQpO1xuICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bGxzY3JlZW5FbGVtZW50KCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA6IGRvY3VtZW50W3ByZWZpeEZTICsgJ0Z1bGxzY3JlZW5FbGVtZW50J107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG59OyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWVkaWEpIHtcblx0Ly8gUmVtb3ZlIGNoaWxkIHNvdXJjZXNcblx0dmFyIHNvdXJjZXMgPSBtZWRpYS5xdWVyeVNlbGVjdG9yQWxsKCdzb3VyY2UnKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0ZG9tLnJlbW92ZShzb3VyY2VzW2ldKTtcblx0fVxuXG5cdC8vIFNldCBibGFuayB2aWRlbyBzcmMgYXR0cmlidXRlXG5cdC8vIFRoaXMgaXMgdG8gcHJldmVudCBhIE1FRElBX0VSUl9TUkNfTk9UX1NVUFBPUlRFRCBlcnJvclxuXHQvLyBTbWFsbCBtcDQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL3NtYWxsL2Jsb2IvbWFzdGVyL21wNC5tcDRcblx0Ly8gSW5mbzogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMjIzMTU3OS9ob3ctdG8tcHJvcGVybHktZGlzcG9zZS1vZi1hbi1odG1sNS12aWRlby1hbmQtY2xvc2Utc29ja2V0LW9yLWNvbm5lY3Rpb25cblx0bWVkaWEuc2V0QXR0cmlidXRlKCdzcmMnLCAnZGF0YTp2aWRlby9tcDQ7YmFzZTY0LEFBQUFIR1owZVhCcGMyOXRBQUFDQUdsemIyMXBjMjh5YlhBME1RQUFBQWhtY21WbEFBQUFHbTFrWVhRQUFBR3pBQkFIQUFBQnRoQmdVWUk5dCs4QUFBTU5iVzl2ZGdBQUFHeHRkbWhrQUFBQUFNWE12dnJGekw3NkFBQUQ2QUFBQUNvQUFRQUFBUUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWdBQUFCaHBiMlJ6QUFBQUFCQ0FnSUFIQUUvLy8vLysvd0FBQWlGMGNtRnJBQUFBWEhScmFHUUFBQUFQeGN5KytzWE12dm9BQUFBQkFBQUFBQUFBQUNvQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFnQUFBQUlBQUFBQUFHOWJXUnBZUUFBQUNCdFpHaGtBQUFBQU1YTXZ2ckZ6TDc2QUFBQUdBQUFBQUVWeHdBQUFBQUFMV2hrYkhJQUFBQUFBQUFBQUhacFpHVUFBQUFBQUFBQUFBQUFBQUJXYVdSbGIwaGhibVJzWlhJQUFBQUJhRzFwYm1ZQUFBQVVkbTFvWkFBQUFBRUFBQUFBQUFBQUFBQUFBQ1JrYVc1bUFBQUFIR1J5WldZQUFBQUFBQUFBQVFBQUFBeDFjbXdnQUFBQUFRQUFBU2h6ZEdKc0FBQUF4SE4wYzJRQUFBQUFBQUFBQVFBQUFMUnRjRFIyQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWdBQ0FCSUFBQUFTQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUdQLy9BQUFBWG1WelpITUFBQUFBQTRDQWdFMEFBUUFFZ0lDQVB5QVJBQUFBQUFNTlFBQUFBQUFGZ0lDQUxRQUFBYkFCQUFBQnRZa1RBQUFCQUFBQUFTQUF4STJJQU1VQVJBRVVRd0FBQWJKTVlYWmpOVE11TXpVdU1BYUFnSUFCQWdBQUFCaHpkSFJ6QUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUJ4emRITmpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQUVBQUFBVWMzUnplZ0FBQUFBQUFBQVNBQUFBQVFBQUFCUnpkR052QUFBQUFBQUFBQUVBQUFBc0FBQUFZSFZrZEdFQUFBQlliV1YwWVFBQUFBQUFBQUFoYUdSc2NnQUFBQUFBQUFBQWJXUnBjbUZ3Y0d3QUFBQUFBQUFBQUFBQUFBQXJhV3h6ZEFBQUFDT3BkRzl2QUFBQUcyUmhkR0VBQUFBQkFBQUFBRXhoZG1ZMU15NHlNUzR4Jyk7XG5cblx0Ly8gTG9hZCB0aGUgbmV3IGVtcHR5IHNvdXJjZVxuXHQvLyBUaGlzIHdpbGwgY2FuY2VsIGV4aXN0aW5nIHJlcXVlc3RzXG5cdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vU2Vsei9wbHlyL2lzc3Vlcy8xNzRcblx0bWVkaWEubG9hZCgpO1xuXG5cdC8vIERlYnVnZ2luZ1xuXHRjb25zb2xlLmxvZyhcIkNhbmNlbGxlZCBuZXR3b3JrIHJlcXVlc3RzIGZvciBvbGQgbWVkaWFcIik7XG59IiwiZXhwb3J0IGZ1bmN0aW9uIG1pbWVBdWRpbyhtZWRpYSwgdHlwZSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdhdWRpby9tcDQnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby9tcDQ7IGNvZGVjcz1cIm1wNGEuNDAuNVwiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICdhdWRpby9tcGVnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL29nZyc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL3dhdic6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdjsgY29kZWNzPVwiMVwiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pbWVWaWRlbyhtZWRpYSwgdHlwZSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICd2aWRlby93ZWJtJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA4LCB2b3JiaXNcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAndmlkZW8vbXA0JzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vbXA0OyBjb2RlY3M9XCJhdmMxLjQyRTAxRSwgbXA0YS40MC4yXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL29nZyc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ3ZpZGVvL29nZzsgY29kZWNzPVwidGhlb3JhXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7fSIsImltcG9ydCBGdWxsc2NyZWVuIGZyb20gJy4uL2Z1bGxzY3JlZW4nO1xuaW1wb3J0IF9jYW5jZWxSZXF1ZXN0cyBmcm9tICcuLi8uLi9oZWxwZXJzL2NhbmNlbFZpZGVvTmV0d29ya1JlcXVlc3QnO1xuaW1wb3J0IHttaW1lVmlkZW99IGZyb20gJy4uLy4uL2hlbHBlcnMvbWltZVR5cGUnO1xuXG4vL2h0dHBzOi8vd3d3LnczLm9yZy8yMDEwLzA1L3ZpZGVvL21lZGlhZXZlbnRzLmh0bWxcbmxldCBfZXZlbnRzID0gWydlbmRlZCcsICdwcm9ncmVzcycsICdzdGFsbGVkJywgJ3BsYXlpbmcnLCAnd2FpdGluZycsICdjYW5wbGF5JywgJ2NhbnBsYXl0aHJvdWdoJywgJ2xvYWRzdGFydCcsICdsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ3RpbWV1cGRhdGUnLCAndm9sdW1lY2hhbmdlJywgJ3BsYXknLCAncGxheWluZycsICdwYXVzZScsICdlcnJvcicsICdzZWVraW5nJywgJ2VtcHRpZWQnLCAnc2Vla2VkJywgJ3JhdGVjaGFuZ2UnLCAnc3VzcGVuZCddO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZWRpYSBleHRlbmRzIEZ1bGxzY3JlZW4ge1xuXHRjb25zdHJ1Y3RvcihlbCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5tZWRpYSA9IGVsO1xuXHRcdF9ldmVudHMuZm9yRWFjaCgoaykgPT4ge1xuXHRcdFx0Ly8gdGhpcy5vbihrLCBmdW5jdGlvbigpe1xuXHRcdFx0Ly8gXHRjb25zb2xlLmxvZyhrKTtcblx0XHRcdC8vIH0pO1xuXHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcihrLCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZW1pdChrKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5jYW5QbGF5ID0ge1xuXHRcdFx0bXA0OiBtaW1lVmlkZW8oZWwsJ3ZpZGVvL21wNCcpLFxuXHRcdFx0d2VibTogbWltZVZpZGVvKGVsLCd2aWRlby93ZWJtJyksXG5cdFx0XHRvZ2c6IG1pbWVWaWRlbyhlbCwndmlkZW8vb2dnJylcblx0XHR9XG5cdH1cblxuXHQvKioqIEdsb2JhbCBhdHRyaWJ1dGVzICovXG5cblx0LyogQSBCb29sZWFuIGF0dHJpYnV0ZTsgaWYgc3BlY2lmaWVkLCB0aGUgdmlkZW8gYXV0b21hdGljYWxseSBiZWdpbnMgdG8gcGxheSBiYWNrIGFzIHNvb24gYXMgaXQgY2FuIGRvIHNvIHdpdGhvdXQgc3RvcHBpbmcgdG8gZmluaXNoIGxvYWRpbmcgdGhlIGRhdGEuIElmIG5vdCByZXR1cm4gdGhlIGF1b3BsYXkgYXR0cmlidXRlLiAqL1xuXHRhdXRvcGxheSh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEuYXV0b3BsYXkgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5hdXRvcGxheTtcblx0fVxuXG5cdC8qIFJldHVybnMgdGhlIHRpbWUgcmFuZ2VzIG9mIHRoZSBidWZmZXJlZCBtZWRpYS4gVGhpcyBhdHRyaWJ1dGUgY29udGFpbnMgYSBUaW1lUmFuZ2VzIG9iamVjdCAqL1xuXHRidWZmZXJlZCgpwqAge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmJ1ZmZlcmVkO1xuXHR9XG5cblx0LyogSWYgdGhpcyBhdHRyaWJ1dGUgaXMgcHJlc2VudCwgdGhlIGJyb3dzZXIgd2lsbCBvZmZlciBjb250cm9scyB0byBhbGxvdyB0aGUgdXNlciB0byBjb250cm9sIHZpZGVvIHBsYXliYWNrLCBpbmNsdWRpbmcgdm9sdW1lLCBzZWVraW5nLCBhbmQgcGF1c2UvcmVzdW1lIHBsYXliYWNrLiBXaGVuIG5vdCBzZXQgcmV0dXJucyBpZiB0aGUgY29udHJvbHMgYXJlIHByZXNlbnQgKi9cblx0Y29udHJvbHModikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmNvbnRyb2xzID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuY29udHJvbHM7XG5cdH1cblxuXHQvKiBhbm9ueW1vdXMsIHVzZS1jcmVkZW50aWFscywgZmFsc2UgKi9cblx0Y3Jvc3NvcmlnaW4odikge1xuXHRcdGlmICh2ID09PSAndXNlLWNyZWRlbnRpYWxzJykge1xuXHRcdFx0dGhpcy5tZWRpYS5jcm9zc09yaWdpbiA9ICd1c2UtY3JlZGVudGlhbHMnO1xuXHRcdFx0cmV0dXJuIHY7XG5cdFx0fVxuXHRcdGlmICh2KSB7XG5cdFx0XHR0aGlzLm1lZGlhLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG5cdFx0XHRyZXR1cm4gJ2Fub255bW91cyc7XG5cdFx0fVxuXHRcdGlmICh2ID09PSBmYWxzZSkgdGhpcy5tZWRpYS5jcm9zc09yaWdpbiA9IG51bGw7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuY3Jvc3NPcmlnaW47XG5cdH1cblxuXHQvKiBBIEJvb2xlYW4gYXR0cmlidXRlOyBpZiBzcGVjaWZpZWQsIHdlIHdpbGwsIHVwb24gcmVhY2hpbmcgdGhlIGVuZCBvZiB0aGUgdmlkZW8sIGF1dG9tYXRpY2FsbHkgc2VlayBiYWNrIHRvIHRoZSBzdGFydC4gKi9cblx0bG9vcCh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEubG9vcCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmxvb3A7XG5cdH1cblxuXHQvKkEgQm9vbGVhbiBhdHRyaWJ1dGUgd2hpY2ggaW5kaWNhdGVzIHRoZSBkZWZhdWx0IHNldHRpbmcgb2YgdGhlIGF1ZGlvIGNvbnRhaW5lZCBpbiB0aGUgdmlkZW8uIElmIHNldCwgdGhlIGF1ZGlvIHdpbGwgYmUgaW5pdGlhbGx5IHNpbGVuY2VkLiBJdHMgZGVmYXVsdCB2YWx1ZSBpcyBmYWxzZSwgbWVhbmluZyB0aGF0IHRoZSBhdWRpbyB3aWxsIGJlIHBsYXllZCB3aGVuIHRoZSB2aWRlbyBpcyBwbGF5ZWQqL1xuXHRtdXRlZCh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHRoaXMubWVkaWEubXV0ZWQgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5tdXRlZDtcblx0fVxuXG5cdC8qIE11dGUgdGhlIHZpZGVvICovXG5cdG11dGUoKSB7XG5cdFx0dGhpcy5tdXRlZCh0cnVlKTtcblx0fVxuXG5cdC8qIFVuTXV0ZSB0aGUgdmlkZW8gKi9cblx0dW5tdXRlKCkge1xuXHRcdHRoaXMubXV0ZWQoZmFsc2UpO1xuXHR9XG5cblx0LyogVG9nZ2xlIHRoZSBtdXRlZCBzdGFuY2Ugb2YgdGhlIHZpZGVvICovXG5cdHRvZ2dsZU11dGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubXV0ZWQoIXRoaXMubXV0ZWQoKSk7XG5cdH1cblxuXHQvKiBSZXR1cm5zIEEgVGltZVJhbmdlcyBvYmplY3QgaW5kaWNhdGluZyBhbGwgdGhlIHJhbmdlcyBvZiB0aGUgdmlkZW8gdGhhdCBoYXZlIGJlZW4gcGxheWVkLiovXG5cdHBsYXllZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wbGF5ZWQ7XG5cdH1cblxuXHQvKlxuXHRUaGlzIGVudW1lcmF0ZWQgYXR0cmlidXRlIGlzIGludGVuZGVkIHRvIHByb3ZpZGUgYSBoaW50IHRvIHRoZSBicm93c2VyIGFib3V0IHdoYXQgdGhlIGF1dGhvciB0aGlua3Mgd2lsbCBsZWFkIHRvIHRoZSBiZXN0IHVzZXIgZXhwZXJpZW5jZS4gSXQgbWF5IGhhdmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuXHRcdG5vbmU6IGluZGljYXRlcyB0aGF0IHRoZSB2aWRlbyBzaG91bGQgbm90IGJlIHByZWxvYWRlZC5cblx0XHRtZXRhZGF0YTogaW5kaWNhdGVzIHRoYXQgb25seSB2aWRlbyBtZXRhZGF0YSAoZS5nLiBsZW5ndGgpIGlzIGZldGNoZWQuXG5cdFx0YXV0bzogaW5kaWNhdGVzIHRoYXQgdGhlIHdob2xlIHZpZGVvIGZpbGUgY291bGQgYmUgZG93bmxvYWRlZCwgZXZlbiBpZiB0aGUgdXNlciBpcyBub3QgZXhwZWN0ZWQgdG8gdXNlIGl0LlxuXHR0aGUgZW1wdHkgc3RyaW5nOiBzeW5vbnltIG9mIHRoZSBhdXRvIHZhbHVlLlxuXHQqL1xuXHRwcmVsb2FkKHYpIHtcblx0XHRpZiAodiA9PT0gJ21ldGFkYXRhJyB8fCB2ID09PSBcIm1ldGFcIikge1xuXHRcdFx0dGhpcy5tZWRpYS5wcmVsb2FkID0gJ21ldGFkYXRhJztcblx0XHRcdHJldHVybiAnbWV0YWRhdGEnO1xuXHRcdH1cblx0XHRpZiAodikge1xuXHRcdFx0dGhpcy5tZWRpYS5wcmVsb2FkID0gJ2F1dG8nO1xuXHRcdFx0cmV0dXJuICdhdXRvJztcblx0XHR9XG5cdFx0aWYgKHYgPT09IGZhbHNlKSB7XG5cdFx0XHR0aGlzLm1lZGlhLnByZWxvYWQgPSAnbm9uZSc7XG5cdFx0XHRyZXR1cm4gJ25vbmUnO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wcmVsb2FkO1xuXHR9XG5cblx0LyogR2l2ZXMgb3IgcmV0dXJucyB0aGUgYWRkcmVzcyBvZiBhbiBpbWFnZSBmaWxlIHRoYXQgdGhlIHVzZXIgYWdlbnQgY2FuIHNob3cgd2hpbGUgbm8gdmlkZW8gZGF0YSBpcyBhdmFpbGFibGUuIFRoZSBhdHRyaWJ1dGUsIGlmIHByZXNlbnQsIG11c3QgY29udGFpbiBhIHZhbGlkIG5vbi1lbXB0eSBVUkwgcG90ZW50aWFsbHkgc3Vycm91bmRlZCBieSBzcGFjZXMgKi9cblx0cG9zdGVyKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLm1lZGlhLnBvc3RlciA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLnBvc3Rlcjtcblx0fVxuXG5cdC8qIFRoZSBzcmMgcHJvcGVydHkgc2V0cyBvciByZXR1cm5zIHRoZSBjdXJyZW50IHNvdXJjZSBvZiB0aGUgYXVkaW8vdmlkZW8sIFRoZSBzb3VyY2UgaXMgdGhlIGFjdHVhbCBsb2NhdGlvbiAoVVJMKSBvZiB0aGUgYXVkaW8vdmlkZW8gZmlsZSAqL1xuXHRzcmModikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdF9jYW5jZWxSZXF1ZXN0cyh0aGlzLm1lZGlhKTtcblx0XHRcdGlmKHYgaW5zdGFuY2VvZiBBcnJheSl7XG5cdFx0XHRcdGZvcih2YXIgaSA9IDAsIG4gPSB2Lmxlbmd0aDsgaSs9MTspe1xuXHRcdFx0XHRcdGlmKHZbaV1bJ3R5cGUnXSA9PT0gXCJ2aWRlby9tcDRcIiAmJiB0aGlzLmNhblBsYXkubXA0KXtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnNyYyA9IHZbaV1bJ3NyYyddO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih2W2ldWyd0eXBlJ10gPT09IFwidmlkZW8vd2VibVwiICYmIHRoaXMuY2FuUGxheS53ZWJtKXtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnNyYyA9IHZbaV1bJ3NyYyddO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih2W2ldWyd0eXBlJ10gPT09IFwidmlkZW8vb2dnXCIgJiYgdGhpcy5jYW5QbGF5Lm9nZyl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNlIGlmKHYuc3JjICYmIHYudHlwZSl7XG5cdFx0XHRcdHRoaXMubWVkaWEuc3JjID0gdi5zcmM7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGhpcy5tZWRpYS5zcmMgPSB2O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmN1cnJlbnRTcmM7XG5cdH1cblxuXHQvKioqIEdsb2JhbCBFdmVudHMgKi9cblxuXHQvKiBTdGFydHMgcGxheWluZyB0aGUgYXVkaW8vdmlkZW8gKi9cblx0cGxheSgpIHtcblx0XHR0aGlzLm1lZGlhLnBsYXkoKTtcblx0fVxuXG5cdC8qIFBhdXNlcyB0aGUgY3VycmVudGx5IHBsYXlpbmcgYXVkaW8vdmlkZW8gKi9cblx0cGF1c2UoKSB7XG5cdFx0dGhpcy5tZWRpYS5wYXVzZSgpO1xuXHR9XG5cblx0LyogVG9nZ2xlIHBsYXkvcGF1c2UgZm9yIHRoZSBhdWRpby92aWRlbyAqL1xuXHR0b2dnbGVQbGF5KCkge1xuXHRcdHRoaXMubWVkaWEucGF1c2VkID8gdGhpcy5wbGF5KCkgOiB0aGlzLnBhdXNlKCk7XG5cdH1cblxuXHRjdXJyZW50VGltZSh2KSB7XG5cdFx0aWYgKHYgPT09IG51bGwgfHwgaXNOYU4odikpIHtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLmN1cnJlbnRUaW1lO1xuXHRcdH1cblx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRpZiAodiA+IHRoaXMubWVkaWEuZHVyYXRpb24pIHtcblx0XHRcdHYgPSB0aGlzLm1lZGlhLmR1cmF0aW9uO1xuXHRcdH1cblx0XHRpZiAodiA8IDApIHtcblx0XHRcdHYgPSAwO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhLmN1cnJlbnRUaW1lID0gdjtcblx0XHRyZXR1cm4gdjtcblx0fVxuXG5cdHNlZWsodikge1xuXHRcdHJldHVybiB0aGlzLmN1cnJlbnRUaW1lKHYpO1xuXHR9XG5cblxuXHQvKipcblx0ICogW1JlLWxvYWRzIHRoZSBhdWRpby92aWRlbyBlbGVtZW50LCB1cGRhdGUgdGhlIGF1ZGlvL3ZpZGVvIGVsZW1lbnQgYWZ0ZXIgY2hhbmdpbmcgdGhlIHNvdXJjZSBvciBvdGhlciBzZXR0aW5nc11cblx0ICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXHRsb2FkKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLnNyYyh2KTtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS5sb2FkKCk7XG5cdH1cblxuXHRkdXJhdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5kdXJhdGlvbjtcblx0fVxuXG5cdHZvbHVtZSh2KSB7XG5cdFx0Ly8gUmV0dXJuIGN1cnJlbnQgdm9sdW1lIGlmIHZhbHVlIFxuXHRcdGlmICh2ID09PSBudWxsIHx8IGlzTmFOKHYpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS52b2x1bWU7XG5cdFx0fVxuXHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdGlmICh2ID4gMSkge1xuXHRcdFx0diA9IDE7XG5cdFx0fVxuXHRcdGlmICh2IDwgMCkge1xuXHRcdFx0diA9IDA7XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEudm9sdW1lID0gdjtcblx0XHRyZXR1cm4gdjtcblx0fVxufSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpe1xuXHRsZXQgc2NhbGUgPSAwO1xuXHRsZXQgYm91bmRzID0gZnVuY3Rpb24oZWwsIHVwZGF0ZVNjYWxlKSB7XG5cdFx0aWYoIHVwZGF0ZVNjYWxlICE9PSB1bmRlZmluZWQpIHNjYWxlID0gdXBkYXRlU2NhbGU7XG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHR3cmFwcGVyV2lkdGg6IGVsLm9mZnNldFdpZHRoLFxuXHRcdFx0d3JhcHBlckhlaWdodDogZWwub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0c2NhbGU6IHNjYWxlIHx8IChlbC53aWR0aC9lbC5oZWlnaHQpLFxuXHRcdFx0d2lkdGg6IDAsXG5cdFx0XHRoZWlnaHQ6IDAsXG5cdFx0XHRvZmZzZXRYOiAwLFxuXHRcdFx0b2Zmc2V0WTogMFxuXHRcdH1cblx0XHRkYXRhWyd3cmFwcGVyU2NhbGUnXSA9IGRhdGEud3JhcHBlcldpZHRoIC8gZGF0YS53cmFwcGVySGVpZ2h0O1xuXHRcdGlmIChkYXRhLndyYXBwZXJTY2FsZSA+IGRhdGEuc2NhbGUpIHtcblx0XHRcdGRhdGEuaGVpZ2h0ID0gZGF0YS53cmFwcGVySGVpZ2h0O1xuXHRcdFx0ZGF0YS53aWR0aCA9IGRhdGEuc2NhbGUgKiBkYXRhLmhlaWdodDtcblx0XHRcdGRhdGEub2Zmc2V0WCA9IChkYXRhLndyYXBwZXJXaWR0aCAtIGRhdGEud2lkdGgpIC8gMjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGF0YS53aWR0aCA9IGRhdGEud3JhcHBlcldpZHRoO1xuXHRcdFx0ZGF0YS5oZWlnaHQgPSBkYXRhLndpZHRoIC8gZGF0YS5zY2FsZTtcblx0XHRcdGRhdGEub2Zmc2V0WSA9IChkYXRhLndyYXBwZXJIZWlnaHQgLSBkYXRhLmhlaWdodCkgLyAyO1xuXHRcdH1cblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXHRyZXR1cm4gYm91bmRzO1xufSkoKTsiLCJ2YXIgX2RvYyA9IGRvY3VtZW50IHx8IHt9O1xuLy8gU2V0IHRoZSBuYW1lIG9mIHRoZSBoaWRkZW4gcHJvcGVydHkgYW5kIHRoZSBjaGFuZ2UgZXZlbnQgZm9yIHZpc2liaWxpdHlcbnZhciBoaWRkZW4sIHZpc2liaWxpdHlDaGFuZ2U7XG5pZiAodHlwZW9mIF9kb2MuaGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7IC8vIE9wZXJhIDEyLjEwIGFuZCBGaXJlZm94IDE4IGFuZCBsYXRlciBzdXBwb3J0IFxuXHRoaWRkZW4gPSBcImhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJ2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLm1vekhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIm1vekhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLm1zSGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwibXNIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwibXN2aXNpYmlsaXR5Y2hhbmdlXCI7XG59IGVsc2UgaWYgKHR5cGVvZiBfZG9jLndlYmtpdEhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIndlYmtpdEhpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCI7XG59XG5cbmNvbnN0IGlzQXZhaWxhYmxlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiAhKHR5cGVvZiBfZG9jW2hpZGRlbl0gPT09IFwidW5kZWZpbmVkXCIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYWdlVmlzaWJpbGl0eShfbWVkaWEsIHNldHRpbmdzID0ge30pIHtcblx0bGV0IF9hdmFpbGFibGUgPSBpc0F2YWlsYWJsZSgpO1xuXHRpZiAoX2F2YWlsYWJsZSkge1xuXHRcdGxldCBfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdGxldCBfcGxheWluZyA9IGZhbHNlO1xuXHRcdGxldCBwYXVzZWQgPSBmYWxzZTtcblx0XHRsZXQgc2V0RmxhZ1BsYXlpbmcgPSBmdW5jdGlvbigpIHtcblx0XHRcdF9wbGF5aW5nID0gdHJ1ZTtcblx0XHR9O1xuXHRcdGxldCBldmVudHMgPSB7XG5cdFx0XHR2aXNpYmxlOiBmdW5jdGlvbigpe30sXG5cdFx0XHRoaWRkZW46IGZ1bmN0aW9uKCl7fVxuXHRcdH07XG5cdFx0bGV0IGRlc3Ryb3lWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRldmVudHMgPSB7XG5cdFx0XHRcdHZpc2libGU6IGZ1bmN0aW9uKCl7fSxcblx0XHRcdFx0aGlkZGVuOiBmdW5jdGlvbigpe31cblx0XHRcdH07XG5cdFx0XHRfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0X3BsYXlpbmcgPSBmYWxzZTtcblx0XHRcdF9kb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRfbWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHR9XG5cdFx0bGV0IGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChfZW5hYmxlZCkge1xuXHRcdFx0XHRpZiAoX2RvY1toaWRkZW5dKSB7XG5cdFx0XHRcdFx0aWYgKF9wbGF5aW5nICYmICFfbWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRfbWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHRcdHBhdXNlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50cy5oaWRkZW4oKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAocGF1c2VkICYmIF9tZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdF9tZWRpYS5wbGF5KCk7XG5cdFx0XHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnRzLnZpc2libGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRsZXQgaW5pdFZpc2liaWxpdHkgPSBmdW5jdGlvbiBpbml0VmlzaWJpbGl0eShzZXR0aW5ncykge1xuXHRcdFx0aWYgKF9hdmFpbGFibGUpIHtcblx0XHRcdFx0X2RvYy5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdFx0X21lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRldmVudHMudmlzaWJsZSA9IHNldHRpbmdzLm9uVmlzaWJsZSB8fCBldmVudHMudmlzaWJsZTtcblx0XHRcdFx0ZXZlbnRzLmhpZGRlbiA9IHNldHRpbmdzLm9uSGlkZGVuIHx8IGV2ZW50cy5oaWRkZW47XG5cdFx0XHRcdF9lbmFibGVkID0gdHJ1ZTtcblx0XHRcdFx0X2RvYy5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdFx0X21lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGV2ZW50cy52aXNpYmxlID0gc2V0dGluZ3Mub25WaXNpYmxlIHx8IGV2ZW50cy52aXNpYmxlO1xuXHRcdGV2ZW50cy5oaWRkZW4gPSBzZXR0aW5ncy5vbkhpZGRlbiB8fCBldmVudHMuaGlkZGVuO1xuXHRcdF9lbmFibGVkID0gdHJ1ZTtcblx0XHRfZG9jLmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdF9tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXG5cdFx0dGhpcy5pbml0ID0gaW5pdFZpc2liaWxpdHk7XG5cdFx0dGhpcy5kZXN0cm95ID0gZGVzdHJveVZpc2liaWxpdHk7XG5cdFx0dGhpcy5vbiA9IGZ1bmN0aW9uKGV2ZW50LGZuKSB7XG5cdFx0XHRpZiAoZXZlbnQgaW4gZXZlbnRzKSBldmVudHNbZXZlbnRdID0gZm47XG5cdFx0fTtcblx0XHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykgX2VuYWJsZWQgPSB2O1xuXHRcdFx0cmV0dXJuIF9lbmFibGVkO1xuXHRcdH1cblx0fTtcbn07IiwibGV0IF9kb2MgPSBkb2N1bWVudCB8fCB7fTtcbmxldCBleHRlcm5hbENvbnRyb2xzID0gZnVuY3Rpb24oZWwpIHtcblx0bGV0IF9lbmFibGVkID0gdHJ1ZTtcblx0bGV0IF9zZWVrID0gdHJ1ZTtcblx0bGV0IF90SWQgPSBudWxsO1xuXHRsZXQgbWVkaWEgPSBlbDtcblx0bGV0IGtleWRvd24gPSBmdW5jdGlvbihlKSB7XG5cdFx0aWYgKF9lbmFibGVkKSB7XG5cdFx0XHQvL2J5cGFzcyBkZWZhdWx0IG5hdGl2ZSBleHRlcm5hbCBjb250cm9scyB3aGVuIG1lZGlhIGlzIGZvY3VzZWRcblx0XHRcdG1lZGlhLnBhcmVudE5vZGUuZm9jdXMoKTtcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzIpIHsgLy9zcGFjZVxuXHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChfc2Vlaykge1xuXHRcdFx0XHRpZiAoZS5rZXlDb2RlID09IDM3KSB7IC8vbGVmdFxuXHRcdFx0XHRcdG1lZGlhLmN1cnJlbnRUaW1lID0gbWVkaWEuY3VycmVudFRpbWUgLSA1O1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZS5rZXlDb2RlID09IDM5KSB7IC8vcmlnaHRcblx0XHRcdFx0XHRtZWRpYS5jdXJyZW50VGltZSA9IG1lZGlhLmN1cnJlbnRUaW1lICsgNTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzgpIHsgLy91cFxuXHRcdFx0XHRsZXQgdiA9IG1lZGlhLnZvbHVtZTtcblx0XHRcdFx0diArPSAuMTtcblx0XHRcdFx0aWYgKHYgPiAxKSB2ID0gMTtcblx0XHRcdFx0bWVkaWEudm9sdW1lID0gdjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDQwKSB7IC8vZG93blxuXHRcdFx0XHRsZXQgdiA9IG1lZGlhLnZvbHVtZTtcblx0XHRcdFx0diAtPSAuMTtcblx0XHRcdFx0aWYgKHYgPCAwKSB2ID0gMDtcblx0XHRcdFx0bWVkaWEudm9sdW1lID0gdjtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0LyppZiAoc2VsZi5jb250cm9sQmFyKSB7XG5cdFx0XHRcdGlmIChzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbikge1xuXHRcdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gNDAgfHwgZS5rZXlDb2RlID09IDM4KSB7XG5cblx0XHRcdFx0XHRcdHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uLm1lbnVDb250ZW50LmVsXy5jbGFzc05hbWUgPSBcInZqcy1tZW51IHNob3dcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0qL1xuXHRcdH1cblx0fTtcblxuXHQvLyB0aGlzLm9uU3BhY2UgPSBmdW5jdGlvbigpIHtcblxuXHQvLyB9O1xuXG5cdGxldCBrZXl1cCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoX2VuYWJsZWQpIHtcdFx0XHRcblx0XHRcdC8vIGlmIChlLmtleUNvZGUgPT0gNDAgfHwgZS5rZXlDb2RlID09IDM4KSB7XG5cdFx0XHQvLyBcdGNsZWFySW50ZXJ2YWwoX3RJZCk7XG5cdFx0XHQvLyBcdGlmIChzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbikge1xuXHRcdFx0Ly8gXHRcdF90SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gXHRcdFx0c2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24ubWVudUNvbnRlbnQuZWxfLmNsYXNzTmFtZSA9IFwidmpzLW1lbnVcIjtcblx0XHRcdC8vIFx0XHR9LCA1MDApO1xuXHRcdFx0Ly8gXHR9XG5cdFx0XHQvLyB9XG5cdFx0fVxuXHR9O1xuXHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbihiKSB7XG5cdFx0aWYgKGIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIF9lbmFibGVkO1xuXHRcdF9lbmFibGVkID0gYjtcblxuXHR9O1xuXHR0aGlzLnNlZWtFbmFibGVkID0gZnVuY3Rpb24oYikge1xuXHRcdGlmIChiID09PSB1bmRlZmluZWQpIHJldHVybiBfc2Vlaztcblx0XHRfc2VlayA9IGI7XG5cdH07XG5cdHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdF9lbmFibGVkID0gdHJ1ZTtcblx0XHRfdElkID0gbnVsbDtcblx0XHRfc2VlayA9IHRydWU7XG5cdFx0X2RvYy5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duLmJpbmQodGhpcyksIGZhbHNlKTtcblx0XHRfZG9jLmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cC5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdH07XG5cdHRoaXMuZGVzdHJveSA9ICBmdW5jdGlvbigpIHtcblx0XHRfZW5hYmxlZCA9IGZhbHNlO1xuXHRcdF90SWQgPSBudWxsO1xuXHRcdF9zZWVrID0gdHJ1ZTtcblx0XHRfZG9jLmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24pO1xuXHRcdF9kb2MuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwKTtcblx0fVxuXHR0aGlzLmluaXQoKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGV4dGVybmFsQ29udHJvbHM7IiwiLy9odHRwczovL2dpdGh1Yi5jb20vZmRhY2l1ay9hamF4XG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XG4gICAgdmFyIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnXVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgb3B0aW9ucy5iYXNlVXJsID0gb3B0aW9ucy5iYXNlVXJsIHx8ICcnXG4gICAgaWYgKG9wdGlvbnMubWV0aG9kICYmIG9wdGlvbnMudXJsKSB7XG4gICAgICByZXR1cm4geGhyQ29ubmVjdGlvbihcbiAgICAgICAgb3B0aW9ucy5tZXRob2QsXG4gICAgICAgIG9wdGlvbnMuYmFzZVVybCArIG9wdGlvbnMudXJsLFxuICAgICAgICBtYXliZURhdGEob3B0aW9ucy5kYXRhKSxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kcy5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBtZXRob2QpIHtcbiAgICAgIGFjY1ttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiB4aHJDb25uZWN0aW9uKFxuICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICBvcHRpb25zLmJhc2VVcmwgKyB1cmwsXG4gICAgICAgICAgbWF5YmVEYXRhKGRhdGEpLFxuICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY1xuICAgIH0sIHt9KVxuICB9XG5cbiAgZnVuY3Rpb24gbWF5YmVEYXRhKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YSB8fCBudWxsXG4gIH1cblxuICBmdW5jdGlvbiB4aHJDb25uZWN0aW9uKHR5cGUsIHVybCwgZGF0YSwgb3B0aW9ucykge1xuICAgIHZhciByZXR1cm5NZXRob2RzID0gWyd0aGVuJywgJ2NhdGNoJywgJ2Fsd2F5cyddXG4gICAgdmFyIHByb21pc2VNZXRob2RzID0gcmV0dXJuTWV0aG9kcy5yZWR1Y2UoZnVuY3Rpb24ocHJvbWlzZSwgbWV0aG9kKSB7XG4gICAgICBwcm9taXNlW21ldGhvZF0gPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBwcm9taXNlW21ldGhvZF0gPSBjYWxsYmFja1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9LCB7fSlcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICB4aHIub3Blbih0eXBlLCB1cmwsIHRydWUpXG4gICAgeGhyLndpdGhDcmVkZW50aWFscyA9IG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3dpdGhDcmVkZW50aWFscycpXG4gICAgc2V0SGVhZGVycyh4aHIsIG9wdGlvbnMuaGVhZGVycylcbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIHJlYWR5KHByb21pc2VNZXRob2RzLCB4aHIpLCBmYWxzZSlcbiAgICB4aHIuc2VuZChvYmplY3RUb1F1ZXJ5U3RyaW5nKGRhdGEpKVxuICAgIHByb21pc2VNZXRob2RzLmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geGhyLmFib3J0KClcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2VNZXRob2RzXG4gIH1cblxuICBmdW5jdGlvbiBzZXRIZWFkZXJzKHhociwgaGVhZGVycykge1xuICAgIGhlYWRlcnMgPSBoZWFkZXJzIHx8IHt9XG4gICAgaWYgKCFoYXNDb250ZW50VHlwZShoZWFkZXJzKSkge1xuICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIChoZWFkZXJzW25hbWVdICYmIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIGhlYWRlcnNbbmFtZV0pKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBoYXNDb250ZW50VHlwZShoZWFkZXJzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGhlYWRlcnMpLnNvbWUoZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZSdcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZHkocHJvbWlzZU1ldGhvZHMsIHhocikge1xuICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVSZWFkeSgpIHtcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0geGhyLkRPTkUpIHtcbiAgICAgICAgeGhyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBoYW5kbGVSZWFkeSwgZmFsc2UpXG4gICAgICAgIHByb21pc2VNZXRob2RzLmFsd2F5cy5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKVxuXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgcHJvbWlzZU1ldGhvZHMudGhlbi5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2VNZXRob2RzLmNhdGNoLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlKHhocikge1xuICAgIHZhciByZXN1bHRcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVRleHRcbiAgICB9XG4gICAgcmV0dXJuIFtyZXN1bHQsIHhocl1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9iamVjdFRvUXVlcnlTdHJpbmcoZGF0YSkge1xuICAgIHJldHVybiBpc09iamVjdChkYXRhKSA/IGdldFF1ZXJ5U3RyaW5nKGRhdGEpIDogZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gaXNPYmplY3QoZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgPT09ICdbb2JqZWN0IE9iamVjdF0nXG4gIH1cblxuICBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZyhvYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpdGVtKSB7XG4gICAgICB2YXIgcHJlZml4ID0gIWFjYyA/ICcnIDogYWNjICsgJyYnXG4gICAgICByZXR1cm4gcHJlZml4ICsgZW5jb2RlKGl0ZW0pICsgJz0nICsgZW5jb2RlKG9iamVjdFtpdGVtXSlcbiAgICB9LCAnJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuY29kZSh2YWx1ZSkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpXG4gIH1cblxuICByZXR1cm4gYWpheFxufSkoKTsiLCJpbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4vaGVscGVycy9kZWVwbWVyZ2UnO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyLCBzY2FsZUZvbnQsIGRlYm91bmNlIH0gZnJvbSAnLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkb20gZnJvbSAnLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgYXV0b0ZvbnQgZnJvbSAnLi9jb3JlL2F1dG9Gb250JztcbmltcG9ydCBNZWRpYSBmcm9tICcuL2NvcmUvbWVkaWEvaW5kZXgnO1xuaW1wb3J0IGNvbnRhaW5lckJvdW5kcyBmcm9tICcuL2hlbHBlcnMvY29udGFpbmVyQm91bmRzJztcbmltcG9ydCBwYWdlVmlzaWJpbGl0eSBmcm9tICcuL2hlbHBlcnMvcGFnZVZpc2liaWxpdHknO1xuaW1wb3J0IGV4dGVybmFsQ29udHJvbHMgZnJvbSAnLi9jb3JlL21lZGlhL2V2ZW50cy9leHRlcm5hbENvbnRyb2xzJztcbmltcG9ydCBhamF4IGZyb20gJy4vaGVscGVycy9hamF4JztcblxuY29uc3QgZm5fY29udGV4dG1lbnUgPSBmdW5jdGlvbihlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0cmV0dXJuIGZhbHNlO1xufVxuXG5jb25zdCBkZWZhdWx0cyA9IHtcblx0ZGVmYXVsdFdpZHRoOiA5NjAsXG5cdGRlZmF1bHRIZWlnaHQ6IDU0MCxcblx0YXV0b3BsYXk6IGZhbHNlLFxuXHRsb29wOiBmYWxzZSxcblx0Y29udHJvbHM6IGZhbHNlLFxuXHRmb250OiB7XG5cdFx0cmF0aW86IDEsXG5cdFx0bWluOiAuNSxcblx0XHR1bml0czogXCJlbVwiXG5cdH1cbn07XG5cbmNsYXNzIGttbFBsYXllciBleHRlbmRzIE1lZGlhIHtcblx0Y29uc3RydWN0b3IoZWwsIHNldHRpbmdzLCBfZXZlbnRzKSB7XG5cdFx0c3VwZXIoZWwpO1xuXHRcdHRoaXMuX19zZXR0aW5ncyA9IGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRcdGRvbS5jbGFzcy5hZGQoZWwsIFwia21sXCIgKyBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkpO1xuXHRcdHRoaXMud3JhcHBlciA9IGRvbS53cmFwKHRoaXMubWVkaWEsIGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG5cdFx0XHRjbGFzczogJ2ttbFBsYXllcidcblx0XHR9KSk7XG5cblx0XHQvL2luaXRTZXR0aW5nc1xuXHRcdGZvcih2YXIgayBpbiB0aGlzLl9fc2V0dGluZ3Mpe1xuXHRcdFx0aWYodGhpc1trXSl7XG5cdFx0XHRcdHRoaXNba10odGhpcy5fX3NldHRpbmdzW2tdKTtcblx0XHRcdFx0aWYoaz09PSdhdXRvcGxheScgJiYgdGhpcy5fX3NldHRpbmdzW2tdKSB0aGlzLnBsYXkoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL2luaXRQYWdlVmlzaWJpbGl0eVxuXHRcdHRoaXMucGFnZVZpc2liaWxpdHkgPSBuZXcgcGFnZVZpc2liaWxpdHkoZWwpO1xuXG5cdFx0Ly9pbml0ZXh0ZXJuYWxDb250cm9sc1xuXHRcdHRoaXMuZXh0ZXJuYWxDb250cm9scyA9IG5ldyBleHRlcm5hbENvbnRyb2xzKGVsKTtcblxuXHRcdC8vYXV0b0ZPTlRcblx0XHRsZXQgX3dpZHRoID0gKCk9PnsgcmV0dXJuIHRoaXMud2lkdGgoKSB9O1xuXHRcdHRoaXMuYXV0b0ZvbnQgPSBuZXcgYXV0b0ZvbnQodGhpcy53cmFwcGVyLCBfd2lkdGgsIHRoaXMuX19zZXR0aW5ncy5mb250KTtcblx0XHRpZih0aGlzLl9fc2V0dGluZ3MuZm9udCkgdGhpcy5hdXRvRm9udC5lbmFibGVkKHRydWUpO1xuXG5cdFx0Ly9pbml0Q2FsbGJhY2tFdmVudHNcblx0XHRmb3IgKHZhciBldnQgaW4gX2V2ZW50cykge1xuXHRcdFx0dGhpcy5vbihldnQsIF9ldmVudHNbZXZ0XSwgdGhpcyk7XG5cdFx0fVxuXHR9XG5cblx0Y29udGV4dE1lbnUodil7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHYgPyB0aGlzLm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUpIDogdGhpcy5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZuX2NvbnRleHRtZW51KTtcblx0XHR9XG5cdH1cblxuXHRhamF4KG9wdGlvbnMpIHtcblx0XHRyZXR1cm4gYWpheChvcHRpb25zKTtcblx0fVxuXG5cdGRlZmF1bHRXaWR0aCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9XaWR0aCkge1xuXHRcdFx0dGhpcy5tZWRpYS53aWR0aCA9IHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvV2lkdGg7XG5cdFx0fVxuXHRcdGlmICghaXNOYU4odikpIHtcblx0XHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdFx0dGhpcy5tZWRpYS53aWR0aCA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLndpZHRoO1xuXHR9XG5cblx0ZGVmYXVsdEhlaWdodCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9IZWlnaHQpIHtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdGhpcy5tZWRpYS52aWRlb0hlaWdodDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdH1cblx0XHRpZiAoIWlzTmFOKHYpKSB7XG5cdFx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuaGVpZ2h0O1xuXHR9XG5cblx0c2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGVmYXVsdFdpZHRoKCkgLyB0aGlzLmRlZmF1bHRIZWlnaHQoKTtcblx0fVxuXG5cdGJvdW5kcyh2KSB7XG5cdFx0bGV0IGRhdGEgPSBjb250YWluZXJCb3VuZHModGhpcy5tZWRpYSk7XG5cdFx0aWYgKGRhdGFbdl0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGRhdGFbdl07XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHR3aWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ3dpZHRoJyk7XG5cdH1cblxuXHRoZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdoZWlnaHQnKTtcblx0fVxuXG5cdG9mZnNldFgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRYJyk7XG5cdH1cblxuXHRvZmZzZXRZKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnb2Zmc2V0WScpO1xuXHR9XG5cblx0d3JhcHBlckhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHR3cmFwcGVyV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGg7XG5cdH1cblxuXHR3cmFwcGVyU2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGggLyB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdGFkZENsYXNzKHYpIHtcblx0XHRkb20uY2xhc3MuYWRkKHRoaXMud3JhcHBlciwgdik7XG5cdH1cblx0cmVtb3ZlQ2xhc3Modikge1xuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLmNsYXNzLnJlbW92ZSh0aGlzLndyYXBwZXIsIHYpO1xuXHRcdH1cblx0fVxuXHR0b2dnbGVDbGFzcyh2KSB7XG5cdFx0aWYgKHYgIT09ICdrbWxQbGF5ZXInKSB7XG5cdFx0XHRkb20uY2xhc3MudG9nZ2xlKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG59O1xuXG53aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHNjcmlwdFVybCwgbGluZSwgY29sdW1uKSB7XG4gICAgY29uc29sZS5sb2cobGluZSwgY29sdW1uLCBtZXNzYWdlKTtcbiAgICBhbGVydChsaW5lICsgXCI6XCIgK2NvbHVtbiArXCItXCIrIG1lc3NhZ2UpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQga21sUGxheWVyOyJdLCJuYW1lcyI6WyJiYWJlbEhlbHBlcnMudHlwZW9mIiwiRXZlbnRzIiwiX2RvYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9CQUFlLENBQUMsWUFBVTtBQUN6QixJQUFBLEtBQUksWUFBWSxTQUFaLFNBQVksQ0FBUyxNQUFULEVBQWlCLEdBQWpCLEVBQXNCO0FBQ3JDLElBQUEsTUFBRyxHQUFILEVBQU87QUFDSCxJQUFBLE9BQUksUUFBUSxNQUFNLE9BQU4sQ0FBYyxHQUFkLENBQVo7QUFDQSxJQUFBLE9BQUksTUFBTSxTQUFTLEVBQVQsSUFBZSxFQUF6Qjs7QUFFQSxJQUFB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