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
                // let fnRestore = ()=>{
                //     console.log(this.isFullScreen());
                //     this.scrollPosition.restore();
                // }
                // let event = (prefixFS === '') ? 'fullscreenchange' : prefixFS + (prefixFS == 'ms' ? 'fullscreenchange' : 'fullscreenchange');
                // document.addEventListener(event.toLowerCase(), () => {
                //     if(this.isFullScreen()){
                //        this.scrollPosition.save();
                //     }else{
                //         setTimeout(fnRestore,100);
                //     };
                // });
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

        Fullscreen.prototype.toggleFullscreen = function toggleFullscreen(element) {
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

    var fn_contextmenu = function fn_contextmenu(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	return false;
    };
    function contextMenu(el) {
    	if (el) {
    		this.disable = function () {
    			el.addEventListener('contextmenu', fn_contextmenu);
    		};
    		this.enable = function () {
    			el.removeEventListener('contextmenu', fn_contextmenu);
    		};
    	}
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

    var defaults = {
    	width: 960,
    	height: 540
    };

    var kmlPlayer = function (_Media) {
    	inherits(kmlPlayer, _Media);

    	function kmlPlayer(el, settings, _events) {
    		classCallCheck(this, kmlPlayer);

    		var _this = possibleConstructorReturn(this, _Media.call(this, el));

    		_this[settings] = deepmerge(defaults, settings);
    		dom.class.add(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
    		_this.wrapper = dom.wrap(_this.media, dom.createElement('div', {
    			class: 'kmlPlayer'
    		}));
    		_this.defaultWidth(_this[settings].width);
    		_this.defaultHeight(_this[settings].height);

    		_this.pageVisibility = new pageVisibility(el, {
    			onHidden: function onHidden() {
    				console.log(_this.currentTime());
    			}
    		});
    		_this.contextMenu = new contextMenu(el);
    		_this.externalControls = new externalControls(el);

    		for (var evt in _events) {
    			_this.on(evt, _events[evt], _this);
    		}
    		return _this;
    	}

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

    return kmlPlayer;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzL2RlZXBtZXJnZS5qcyIsIi4uL3NyYy9oZWxwZXJzL3V0aWxzLmpzIiwiLi4vc3JjL2hlbHBlcnMvZG9tLmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvZXZlbnRzL2luZGV4LmpzIiwiLi4vc3JjL2hlbHBlcnMvc2Nyb2xsUG9zaXRpb24uanMiLCIuLi9zcmMvY29yZS9mdWxsc2NyZWVuLmpzIiwiLi4vc3JjL2hlbHBlcnMvY2FuY2VsVmlkZW9OZXR3b3JrUmVxdWVzdC5qcyIsIi4uL3NyYy9oZWxwZXJzL21pbWVUeXBlLmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvaW5kZXguanMiLCIuLi9zcmMvaGVscGVycy9jb250YWluZXJCb3VuZHMuanMiLCIuLi9zcmMvaGVscGVycy9wYWdlVmlzaWJpbGl0eS5qcyIsIi4uL3NyYy9oZWxwZXJzL2NvbnRleHRNZW51LmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvZXZlbnRzL2V4dGVybmFsQ29udHJvbHMuanMiLCIuLi9zcmMvaGVscGVycy9hamF4LmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpe1xuXHRsZXQgZGVlcG1lcmdlID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpIHtcblx0XHRpZihzcmMpe1xuXHRcdCAgICB2YXIgYXJyYXkgPSBBcnJheS5pc0FycmF5KHNyYyk7XG5cdFx0ICAgIHZhciBkc3QgPSBhcnJheSAmJiBbXSB8fCB7fTtcblxuXHRcdCAgICBpZiAoYXJyYXkpIHtcblx0XHQgICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBbXTtcblx0XHQgICAgICAgIGRzdCA9IGRzdC5jb25jYXQodGFyZ2V0KTtcblx0XHQgICAgICAgIHNyYy5mb3JFYWNoKGZ1bmN0aW9uKGUsIGkpIHtcblx0XHQgICAgICAgICAgICBpZiAodHlwZW9mIGRzdFtpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2ldID0gZTtcblx0XHQgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgICAgICBkc3RbaV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2ldLCBlKTtcblx0XHQgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmluZGV4T2YoZSkgPT09IC0xKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3QucHVzaChlKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgIE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gdGFyZ2V0W2tleV07XG5cdFx0ICAgICAgICAgICAgfSlcblx0XHQgICAgICAgIH1cblx0XHQgICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBzcmNba2V5XSAhPT0gJ29iamVjdCcgfHwgIXNyY1trZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG5cdFx0ICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFtrZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2tleV0sIHNyY1trZXldKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9XG5cdFx0ICAgIHJldHVybiBkc3Q7XG5cdCAgICB9ZWxzZXtcblx0ICAgIFx0cmV0dXJuIHRhcmdldCB8fMKgW107XG5cdCAgICB9XG5cdH1cblx0cmV0dXJuIGRlZXBtZXJnZTtcbn0pKCk7IiwiZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJpbShzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmbiwgZGVsYXkpIHtcblx0dmFyIHRcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFyVGltZW91dCh0KVxuXHRcdHQgPSBzZXRUaW1lb3V0KGZuLCBkZWxheSlcblx0fVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcmNlbnRhZ2UoY3VycmVudCwgbWF4KSB7XG5cdGlmIChjdXJyZW50ID09PSAwIHx8IG1heCA9PT0gMCB8fCBpc05hTihjdXJyZW50KSB8fCBpc05hTihtYXgpKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0cmV0dXJuICgoY3VycmVudCAvIG1heCkgKiAxMDApLnRvRml4ZWQoMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kQmluYXJ5ZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7fTsiLCIvKipcbiAqIEBtb2R1bGUgZG9tXG4gKiBNb2R1bGUgZm9yIGVhc2luZyB0aGUgbWFuaXB1bGF0aW9uIG9mIGRvbSBlbGVtZW50c1xuICovXG5cbmxldCBjbGFzc1JlZyA9IGZ1bmN0aW9uKGMpIHtcblx0cmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxccyspXCIgKyBjICsgXCIoXFxcXHMrfCQpXCIpO1xufTtcblxubGV0IGhhc0NsYXNzXG5sZXQgYWRkQ2xhc3NcbmxldCByZW1vdmVDbGFzcztcbmxldCB0b2dnbGVDbGFzcztcblxuaWYgKCdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRoYXNDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRyZXR1cm4gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoYyk7XG5cdH07XG5cdGFkZENsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGMgPSBjLnNwbGl0KCcgJyk7XG5cdFx0Zm9yICh2YXIgayBpbiBjKSBlbGVtLmNsYXNzTGlzdC5hZGQoY1trXSk7XG5cdH07XG5cdHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjKTtcblx0fTtcbn0gZWxzZSB7XG5cdGhhc0NsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdHJldHVybiBjbGFzc1JlZyhjKS50ZXN0KGVsZW0uY2xhc3NOYW1lKTtcblx0fTtcblx0YWRkQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0aWYgKCFoYXNDbGFzcyhlbGVtLCBjKSkge1xuXHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgJyArIGM7XG5cdFx0fVxuXHR9O1xuXHRyZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NSZWcoYyksICcgJyk7XG5cdH07XG59XG5cbnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHR2YXIgZm4gPSBoYXNDbGFzcyhlbGVtLCBjKSA/IHJlbW92ZUNsYXNzIDogYWRkQ2xhc3M7XG5cdGZuKGVsZW0sIGMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRjbGFzczoge1xuXHRcdGhhczogaGFzQ2xhc3MsXG5cdFx0YWRkOiBhZGRDbGFzcyxcblx0XHRyZW1vdmU6IHJlbW92ZUNsYXNzLFxuXHRcdHRvZ2dsZTogdG9nZ2xlQ2xhc3Ncblx0fSxcblx0Y3JlYXRlRWxlbWVudDogZnVuY3Rpb24obm9kZSwgcHJvcHMpIHtcblx0XHRsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUpO1xuXHRcdGZvciAobGV0IGsgaW4gcHJvcHMpIHtcblx0XHRcdGVsLnNldEF0dHJpYnV0ZShrLCBwcm9wc1trXSk7XG5cdFx0fVxuXHRcdHJldHVybiBlbDtcblx0fSxcblx0Ly8gUmVtb3ZlIGFuIGVsZW1lbnRcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIH0sXG5cdHdyYXA6IGZ1bmN0aW9uKGVsZW1lbnRzLCB3cmFwcGVyKSB7XG5cdFx0Ly8gQ29udmVydCBgZWxlbWVudHNgIHRvIGFuIGFycmF5LCBpZiBuZWNlc3NhcnkuXG5cdFx0aWYgKCFlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdGVsZW1lbnRzID0gW2VsZW1lbnRzXTtcblx0XHR9XG5cblx0XHQvLyBMb29wcyBiYWNrd2FyZHMgdG8gcHJldmVudCBoYXZpbmcgdG8gY2xvbmUgdGhlIHdyYXBwZXIgb24gdGhlXG5cdFx0Ly8gZmlyc3QgZWxlbWVudCAoc2VlIGBjaGlsZGAgYmVsb3cpLlxuXHRcdGZvciAodmFyIGkgPSBlbGVtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0dmFyIGNoaWxkID0gKGkgPiAwKSA/IHdyYXBwZXIuY2xvbmVOb2RlKHRydWUpIDogd3JhcHBlcjtcblx0XHRcdHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV07XG5cblx0XHRcdC8vIENhY2hlIHRoZSBjdXJyZW50IHBhcmVudCBhbmQgc2libGluZy5cblx0XHRcdHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR2YXIgc2libGluZyA9IGVsZW1lbnQubmV4dFNpYmxpbmc7XG5cblx0XHRcdC8vIFdyYXAgdGhlIGVsZW1lbnQgKGlzIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBjdXJyZW50XG5cdFx0XHQvLyBwYXJlbnQpLlxuXHRcdFx0Y2hpbGQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cblx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGhhZCBhIHNpYmxpbmcsIGluc2VydCB0aGUgd3JhcHBlciBiZWZvcmVcblx0XHRcdC8vIHRoZSBzaWJsaW5nIHRvIG1haW50YWluIHRoZSBIVE1MIHN0cnVjdHVyZTsgb3RoZXJ3aXNlLCBqdXN0XG5cdFx0XHQvLyBhcHBlbmQgaXQgdG8gdGhlIHBhcmVudC5cblx0XHRcdGlmIChzaWJsaW5nKSB7XG5cdFx0XHRcdHBhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHNpYmxpbmcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNoaWxkO1xuXHRcdH1cblx0fVxufSIsIi8vaHR0cHM6Ly9naXRodWIuY29tL3ByaW11cy9ldmVudGVtaXR0ZXIzXG4ndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gICwgcHJlZml4ID0gJ34nO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhIHN0b3JhZ2UgZm9yIG91ciBgRUVgIG9iamVjdHMuXG4gKiBBbiBgRXZlbnRzYCBpbnN0YW5jZSBpcyBhIHBsYWluIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIGFyZSBldmVudCBuYW1lcy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFdmVudHMoKSB7fVxuXG4vL1xuLy8gV2UgdHJ5IHRvIG5vdCBpbmhlcml0IGZyb20gYE9iamVjdC5wcm90b3R5cGVgLiBJbiBzb21lIGVuZ2luZXMgY3JlYXRpbmcgYW5cbi8vIGluc3RhbmNlIGluIHRoaXMgd2F5IGlzIGZhc3RlciB0aGFuIGNhbGxpbmcgYE9iamVjdC5jcmVhdGUobnVsbClgIGRpcmVjdGx5LlxuLy8gSWYgYE9iamVjdC5jcmVhdGUobnVsbClgIGlzIG5vdCBzdXBwb3J0ZWQgd2UgcHJlZml4IHRoZSBldmVudCBuYW1lcyB3aXRoIGFcbi8vIGNoYXJhY3RlciB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYnVpbHQtaW4gb2JqZWN0IHByb3BlcnRpZXMgYXJlIG5vdFxuLy8gb3ZlcnJpZGRlbiBvciB1c2VkIGFzIGFuIGF0dGFjayB2ZWN0b3IuXG4vL1xuaWYgKE9iamVjdC5jcmVhdGUpIHtcbiAgRXZlbnRzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgLy9cbiAgLy8gVGhpcyBoYWNrIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBgX19wcm90b19fYCBwcm9wZXJ0eSBpcyBzdGlsbCBpbmhlcml0ZWQgaW5cbiAgLy8gc29tZSBvbGQgYnJvd3NlcnMgbGlrZSBBbmRyb2lkIDQsIGlQaG9uZSA1LjEsIE9wZXJhIDExIGFuZCBTYWZhcmkgNS5cbiAgLy9cbiAgaWYgKCFuZXcgRXZlbnRzKCkuX19wcm90b19fKSBwcmVmaXggPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uY2U9ZmFsc2VdIFNwZWNpZnkgaWYgdGhlIGxpc3RlbmVyIGlzIGEgb25lLXRpbWUgbGlzdGVuZXIuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFRShmbiwgY29udGV4dCwgb25jZSkge1xuICB0aGlzLmZuID0gZm47XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMub25jZSA9IG9uY2UgfHwgZmFsc2U7XG59XG5cbi8qKlxuICogTWluaW1hbCBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UgdGhhdCBpcyBtb2xkZWQgYWdhaW5zdCB0aGUgTm9kZS5qc1xuICogYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYW4gYXJyYXkgbGlzdGluZyB0aGUgZXZlbnRzIGZvciB3aGljaCB0aGUgZW1pdHRlciBoYXMgcmVnaXN0ZXJlZFxuICogbGlzdGVuZXJzLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHZhciBuYW1lcyA9IFtdXG4gICAgLCBldmVudHNcbiAgICAsIG5hbWU7XG5cbiAgaWYgKHRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSByZXR1cm4gbmFtZXM7XG5cbiAgZm9yIChuYW1lIGluIChldmVudHMgPSB0aGlzLl9ldmVudHMpKSB7XG4gICAgaWYgKGhhcy5jYWxsKGV2ZW50cywgbmFtZSkpIG5hbWVzLnB1c2gocHJlZml4ID8gbmFtZS5zbGljZSgxKSA6IG5hbWUpO1xuICB9XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICByZXR1cm4gbmFtZXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZXZlbnRzKSk7XG4gIH1cblxuICByZXR1cm4gbmFtZXM7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXhpc3RzIE9ubHkgY2hlY2sgaWYgdGhlcmUgYXJlIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtBcnJheXxCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnMoZXZlbnQsIGV4aXN0cykge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudFxuICAgICwgYXZhaWxhYmxlID0gdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKGV4aXN0cykgcmV0dXJuICEhYXZhaWxhYmxlO1xuICBpZiAoIWF2YWlsYWJsZSkgcmV0dXJuIFtdO1xuICBpZiAoYXZhaWxhYmxlLmZuKSByZXR1cm4gW2F2YWlsYWJsZS5mbl07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdmFpbGFibGUubGVuZ3RoLCBlZSA9IG5ldyBBcnJheShsKTsgaSA8IGw7IGkrKykge1xuICAgIGVlW2ldID0gYXZhaWxhYmxlW2ldLmZuO1xuICB9XG5cbiAgcmV0dXJuIGVlO1xufTtcblxuLyoqXG4gKiBDYWxscyBlYWNoIG9mIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgZXZlbnQgaGFkIGxpc3RlbmVycywgZWxzZSBgZmFsc2VgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudCwgYTEsIGEyLCBhMywgYTQsIGE1KSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiBmYWxzZTtcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF1cbiAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGFyZ3NcbiAgICAsIGk7XG5cbiAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgIGlmIChsaXN0ZW5lcnMub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgc3dpdGNoIChsZW4pIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSksIHRydWU7XG4gICAgICBjYXNlIDM6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCksIHRydWU7XG4gICAgICBjYXNlIDY6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQsIGE1KSwgdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgbGlzdGVuZXJzLmZuLmFwcGx5KGxpc3RlbmVycy5jb250ZXh0LCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aFxuICAgICAgLCBqO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobGlzdGVuZXJzW2ldLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyc1tpXS5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgICAgc3dpdGNoIChsZW4pIHtcbiAgICAgICAgY2FzZSAxOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCk7IGJyZWFrO1xuICAgICAgICBjYXNlIDI6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSk7IGJyZWFrO1xuICAgICAgICBjYXNlIDM6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIpOyBicmVhaztcbiAgICAgICAgY2FzZSA0OiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyLCBhMyk7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghYXJncykgZm9yIChqID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaiAtIDFdID0gYXJndW1lbnRzW2pdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5hcHBseShsaXN0ZW5lcnNbaV0uY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIEFkZCBhIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCB0aGlzKVxuICAgICwgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGxpc3RlbmVyLCB0aGlzLl9ldmVudHNDb3VudCsrO1xuICBlbHNlIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlIHRoaXMuX2V2ZW50c1tldnRdID0gW3RoaXMuX2V2ZW50c1tldnRdLCBsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhIG9uZS10aW1lIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcywgdHJ1ZSlcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxpc3RlbmVycyBvZiBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBPbmx5IHJlbW92ZSB0aGUgbGlzdGVuZXJzIHRoYXQgbWF0Y2ggdGhpcyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IGhhdmUgdGhpcyBjb250ZXh0LlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgcmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIHRoaXM7XG4gIGlmICghZm4pIHtcbiAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAoXG4gICAgICAgICBsaXN0ZW5lcnMuZm4gPT09IGZuXG4gICAgICAmJiAoIW9uY2UgfHwgbGlzdGVuZXJzLm9uY2UpXG4gICAgICAmJiAoIWNvbnRleHQgfHwgbGlzdGVuZXJzLmNvbnRleHQgPT09IGNvbnRleHQpXG4gICAgKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwLCBldmVudHMgPSBbXSwgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbiAhPT0gZm5cbiAgICAgICAgfHwgKG9uY2UgJiYgIWxpc3RlbmVyc1tpXS5vbmNlKVxuICAgICAgICB8fCAoY29udGV4dCAmJiBsaXN0ZW5lcnNbaV0uY29udGV4dCAhPT0gY29udGV4dClcbiAgICAgICkge1xuICAgICAgICBldmVudHMucHVzaChsaXN0ZW5lcnNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vXG4gICAgLy8gUmVzZXQgdGhlIGFycmF5LCBvciByZW1vdmUgaXQgY29tcGxldGVseSBpZiB3ZSBoYXZlIG5vIG1vcmUgbGlzdGVuZXJzLlxuICAgIC8vXG4gICAgaWYgKGV2ZW50cy5sZW5ndGgpIHRoaXMuX2V2ZW50c1tldnRdID0gZXZlbnRzLmxlbmd0aCA9PT0gMSA/IGV2ZW50c1swXSA6IGV2ZW50cztcbiAgICBlbHNlIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMsIG9yIHRob3NlIG9mIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KSB7XG4gIHZhciBldnQ7XG5cbiAgaWYgKGV2ZW50KSB7XG4gICAgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcbiAgICBpZiAodGhpcy5fZXZlbnRzW2V2dF0pIHtcbiAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEFsaWFzIG1ldGhvZHMgbmFtZXMgYmVjYXVzZSBwZW9wbGUgcm9sbCBsaWtlIHRoYXQuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG5cbi8vXG4vLyBUaGlzIGZ1bmN0aW9uIGRvZXNuJ3QgYXBwbHkgYW55bW9yZS5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBwcmVmaXguXG4vL1xuRXZlbnRFbWl0dGVyLnByZWZpeGVkID0gcHJlZml4O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuZXhwb3J0IGRlZmF1bHQgRXZlbnRFbWl0dGVyOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXHRsZXQgeCA9IDA7XG5cdGxldCB5ID0gMDtcblx0dGhpcy5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0eCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCAwO1xuXHRcdHkgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgMDtcblx0fVxuXHR0aGlzLnJlc3RvcmUgPSBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cuc2Nyb2xsVG8oeCwgeSlcblx0fVxufSIsImltcG9ydCBFdmVudHMgZnJvbSAnLi9tZWRpYS9ldmVudHMvaW5kZXgnO1xuaW1wb3J0IHNjcm9sbFBvc2l0aW9uIGZyb20gJy4uL2hlbHBlcnMvc2Nyb2xsUG9zaXRpb24nO1xuLy8gRnVsbHNjcmVlbiBBUElcbmxldCBzdXBwb3J0c0Z1bGxTY3JlZW4gPSBmYWxzZTtcbmxldCBicm93c2VyUHJlZml4ZXMgPSAnd2Via2l0IG1veiBvIG1zIGtodG1sJy5zcGxpdCgnICcpO1xubGV0IHByZWZpeEZTID0gJyc7XG4vL0NoZWNrIGZvciBuYXRpdmUgc3VwcG9ydFxuaWYgKHR5cGVvZiBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuICE9PSAndW5kZWZpbmVkJykge1xuICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG59IGVsc2Uge1xuICAgIC8vIENoZWNrIGZvciBmdWxsc2NyZWVuIHN1cHBvcnQgYnkgdmVuZG9yIHByZWZpeFxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGJyb3dzZXJQcmVmaXhlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIHByZWZpeEZTID0gYnJvd3NlclByZWZpeGVzW2ldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnRbcHJlZml4RlMgKyAnQ2FuY2VsRnVsbFNjcmVlbiddICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc3VwcG9ydHNGdWxsU2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgTVMgKHdoZW4gaXNuJ3QgaXQ/KVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQubXNGdWxsc2NyZWVuRW5hYmxlZCkge1xuICAgICAgICAgICAgcHJlZml4RlMgPSAnbXMnO1xuICAgICAgICAgICAgc3VwcG9ydHNGdWxsU2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuLy9zdXBwb3J0c0Z1bGxTY3JlZW4gPSBmYWxzZTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1bGxzY3JlZW4gZXh0ZW5kcyBFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uID0gbmV3IHNjcm9sbFBvc2l0aW9uKCk7XG4gICAgICAgIGlmICghc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUgPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGxldCBmblJlc3RvcmUgPSAoKT0+e1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKHRoaXMuaXNGdWxsU2NyZWVuKCkpO1xuICAgICAgICAgICAgLy8gICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24ucmVzdG9yZSgpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gbGV0IGV2ZW50ID0gKHByZWZpeEZTID09PSAnJykgPyAnZnVsbHNjcmVlbmNoYW5nZScgOiBwcmVmaXhGUyArIChwcmVmaXhGUyA9PSAnbXMnID8gJ2Z1bGxzY3JlZW5jaGFuZ2UnIDogJ2Z1bGxzY3JlZW5jaGFuZ2UnKTtcbiAgICAgICAgICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQudG9Mb3dlckNhc2UoKSwgKCkgPT4ge1xuICAgICAgICAgICAgLy8gICAgIGlmKHRoaXMuaXNGdWxsU2NyZWVuKCkpe1xuICAgICAgICAgICAgLy8gICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24uc2F2ZSgpO1xuICAgICAgICAgICAgLy8gICAgIH1lbHNle1xuICAgICAgICAgICAgLy8gICAgICAgICBzZXRUaW1lb3V0KGZuUmVzdG9yZSwxMDApO1xuICAgICAgICAgICAgLy8gICAgIH07XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpc0Z1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMud3JhcHBlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAocHJlZml4RlMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICcnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgPT0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICBjYXNlICdtb3onOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgPT0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnRbcHJlZml4RlMgKyAnRnVsbHNjcmVlbkVsZW1lbnQnXSA9PSBlbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy53cmFwcGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4oKSA6IGVsZW1lbnRbcHJlZml4RlMgKyAocHJlZml4RlMgPT0gJ21zJyA/ICdSZXF1ZXN0RnVsbHNjcmVlbicgOiAnUmVxdWVzdEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0Z1bGxTY3JlZW4oKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24uc2F2ZSgpO1xuICAgICAgICAgICAgICAgIGxldCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsncG9zaXRpb24nXSA9IGVsZW1lbnQuc3R5bGUucG9zaXRpb24gfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ21hcmdpbiddID0gZWxlbWVudC5zdHlsZS5tYXJnaW4gfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3RvcCddID0gZWxlbWVudC5zdHlsZS50b3AgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ2xlZnQnXSA9IGVsZW1lbnQuc3R5bGUubGVmdCB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnd2lkdGgnXSA9IGVsZW1lbnQuc3R5bGUud2lkdGggfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ2hlaWdodCddID0gZWxlbWVudC5zdHlsZS5oZWlnaHQgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3pJbmRleCddID0gZWxlbWVudC5zdHlsZS56SW5kZXggfHwgXCJcIjtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBlbGVtZW50LnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luID0gMDtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IDIxNDc0ODM2NDc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Z1bGxTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjYW5jZWxGdWxsU2NyZWVuKCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKCkgOiBkb2N1bWVudFtwcmVmaXhGUyArIChwcmVmaXhGUyA9PSAnbXMnID8gJ0V4aXRGdWxsc2NyZWVuJyA6ICdDYW5jZWxGdWxsU2NyZWVuJyldKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0Z1bGxTY3JlZW4oKSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50LnN0eWxlW2tdID0gdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Z1bGxTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbi5yZXN0b3JlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdG9nZ2xlRnVsbHNjcmVlbihlbGVtZW50KSB7XG4gICAgICAgIGxldCBpc0Z1bGxzY3JlZW4gPSAhdGhpcy5pc0Z1bGxTY3JlZW4oKTtcbiAgICAgICAgaWYgKGlzRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RnVsbFNjcmVlbihlbGVtZW50KTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdWxsc2NyZWVuRWxlbWVudCgpIHtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgcmV0dXJuIChwcmVmaXhGUyA9PT0gJycpID8gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgOiBkb2N1bWVudFtwcmVmaXhGUyArICdGdWxsc2NyZWVuRWxlbWVudCddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50O1xuICAgICAgICB9XG4gICAgfVxufTsiLCJpbXBvcnQgZG9tIGZyb20gJy4vZG9tJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1lZGlhKSB7XG5cdC8vIFJlbW92ZSBjaGlsZCBzb3VyY2VzXG5cdHZhciBzb3VyY2VzID0gbWVkaWEucXVlcnlTZWxlY3RvckFsbCgnc291cmNlJyk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGRvbS5yZW1vdmUoc291cmNlc1tpXSk7XG5cdH1cblxuXHQvLyBTZXQgYmxhbmsgdmlkZW8gc3JjIGF0dHJpYnV0ZVxuXHQvLyBUaGlzIGlzIHRvIHByZXZlbnQgYSBNRURJQV9FUlJfU1JDX05PVF9TVVBQT1JURUQgZXJyb3Jcblx0Ly8gU21hbGwgbXA0OiBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9zbWFsbC9ibG9iL21hc3Rlci9tcDQubXA0XG5cdC8vIEluZm86IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzIyMzE1NzkvaG93LXRvLXByb3Blcmx5LWRpc3Bvc2Utb2YtYW4taHRtbDUtdmlkZW8tYW5kLWNsb3NlLXNvY2tldC1vci1jb25uZWN0aW9uXG5cdG1lZGlhLnNldEF0dHJpYnV0ZSgnc3JjJywgJ2RhdGE6dmlkZW8vbXA0O2Jhc2U2NCxBQUFBSEdaMGVYQnBjMjl0QUFBQ0FHbHpiMjFwYzI4eWJYQTBNUUFBQUFobWNtVmxBQUFBR20xa1lYUUFBQUd6QUJBSEFBQUJ0aEJnVVlJOXQrOEFBQU1OYlc5dmRnQUFBR3h0ZG1oa0FBQUFBTVhNdnZyRnpMNzZBQUFENkFBQUFDb0FBUUFBQVFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFnQUFBQmhwYjJSekFBQUFBQkNBZ0lBSEFFLy8vLy8rL3dBQUFpRjBjbUZyQUFBQVhIUnJhR1FBQUFBUHhjeSsrc1hNdnZvQUFBQUJBQUFBQUFBQUFDb0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBZ0FBQUFJQUFBQUFBRzliV1JwWVFBQUFDQnRaR2hrQUFBQUFNWE12dnJGekw3NkFBQUFHQUFBQUFFVnh3QUFBQUFBTFdoa2JISUFBQUFBQUFBQUFIWnBaR1VBQUFBQUFBQUFBQUFBQUFCV2FXUmxiMGhoYm1Sc1pYSUFBQUFCYUcxcGJtWUFBQUFVZG0xb1pBQUFBQUVBQUFBQUFBQUFBQUFBQUNSa2FXNW1BQUFBSEdSeVpXWUFBQUFBQUFBQUFRQUFBQXgxY213Z0FBQUFBUUFBQVNoemRHSnNBQUFBeEhOMGMyUUFBQUFBQUFBQUFRQUFBTFJ0Y0RSMkFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFnQUNBQklBQUFBU0FBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFHUC8vQUFBQVhtVnpaSE1BQUFBQUE0Q0FnRTBBQVFBRWdJQ0FQeUFSQUFBQUFBTU5RQUFBQUFBRmdJQ0FMUUFBQWJBQkFBQUJ0WWtUQUFBQkFBQUFBU0FBeEkySUFNVUFSQUVVUXdBQUFiSk1ZWFpqTlRNdU16VXVNQWFBZ0lBQkFnQUFBQmh6ZEhSekFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFCeHpkSE5qQUFBQUFBQUFBQUVBQUFBQkFBQUFBUUFBQUFFQUFBQVVjM1J6ZWdBQUFBQUFBQUFTQUFBQUFRQUFBQlJ6ZEdOdkFBQUFBQUFBQUFFQUFBQXNBQUFBWUhWa2RHRUFBQUJZYldWMFlRQUFBQUFBQUFBaGFHUnNjZ0FBQUFBQUFBQUFiV1JwY21Gd2NHd0FBQUFBQUFBQUFBQUFBQUFyYVd4emRBQUFBQ09wZEc5dkFBQUFHMlJoZEdFQUFBQUJBQUFBQUV4aGRtWTFNeTR5TVM0eCcpO1xuXG5cdC8vIExvYWQgdGhlIG5ldyBlbXB0eSBzb3VyY2Vcblx0Ly8gVGhpcyB3aWxsIGNhbmNlbCBleGlzdGluZyByZXF1ZXN0c1xuXHQvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1NlbHovcGx5ci9pc3N1ZXMvMTc0XG5cdG1lZGlhLmxvYWQoKTtcblxuXHQvLyBEZWJ1Z2dpbmdcblx0Y29uc29sZS5sb2coXCJDYW5jZWxsZWQgbmV0d29yayByZXF1ZXN0cyBmb3Igb2xkIG1lZGlhXCIpO1xufSIsImV4cG9ydCBmdW5jdGlvbiBtaW1lQXVkaW8obWVkaWEsIHR5cGUpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnYXVkaW8vbXA0JzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0OyBjb2RlY3M9XCJtcDRhLjQwLjVcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vbXBlZyc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICdhdWRpby9vZ2cnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICdhdWRpby93YXYnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby93YXY7IGNvZGVjcz1cIjFcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaW1lVmlkZW8obWVkaWEsIHR5cGUpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAndmlkZW8vd2VibSc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ3ZpZGVvL3dlYm07IGNvZGVjcz1cInZwOCwgdm9yYmlzXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL21wNCc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ3ZpZGVvL21wNDsgY29kZWNzPVwiYXZjMS40MkUwMUUsIG1wNGEuNDAuMlwiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICd2aWRlby9vZ2cnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby9vZ2c7IGNvZGVjcz1cInRoZW9yYVwiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge30iLCJpbXBvcnQgRnVsbHNjcmVlbiBmcm9tICcuLi9mdWxsc2NyZWVuJztcbmltcG9ydCBfY2FuY2VsUmVxdWVzdHMgZnJvbSAnLi4vLi4vaGVscGVycy9jYW5jZWxWaWRlb05ldHdvcmtSZXF1ZXN0JztcbmltcG9ydCB7bWltZVZpZGVvfSBmcm9tICcuLi8uLi9oZWxwZXJzL21pbWVUeXBlJztcblxuLy9odHRwczovL3d3dy53My5vcmcvMjAxMC8wNS92aWRlby9tZWRpYWV2ZW50cy5odG1sXG5sZXQgX2V2ZW50cyA9IFsnZW5kZWQnLCAncHJvZ3Jlc3MnLCAnc3RhbGxlZCcsICdwbGF5aW5nJywgJ3dhaXRpbmcnLCAnY2FucGxheScsICdjYW5wbGF5dGhyb3VnaCcsICdsb2Fkc3RhcnQnLCAnbG9hZGVkZGF0YScsICdsb2FkZWRtZXRhZGF0YScsICd0aW1ldXBkYXRlJywgJ3ZvbHVtZWNoYW5nZScsICdwbGF5JywgJ3BsYXlpbmcnLCAncGF1c2UnLCAnZXJyb3InLCAnc2Vla2luZycsICdlbXB0aWVkJywgJ3NlZWtlZCcsICdyYXRlY2hhbmdlJywgJ3N1c3BlbmQnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVkaWEgZXh0ZW5kcyBGdWxsc2NyZWVuIHtcblx0Y29uc3RydWN0b3IoZWwpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMubWVkaWEgPSBlbDtcblx0XHRfZXZlbnRzLmZvckVhY2goKGspID0+IHtcblx0XHRcdC8vIHRoaXMub24oaywgZnVuY3Rpb24oKXtcblx0XHRcdC8vIFx0Y29uc29sZS5sb2coayk7XG5cdFx0XHQvLyB9KTtcblx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoaywgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmVtaXQoayk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuY2FuUGxheSA9IHtcblx0XHRcdG1wNDogbWltZVZpZGVvKGVsLCd2aWRlby9tcDQnKSxcblx0XHRcdHdlYm06IG1pbWVWaWRlbyhlbCwndmlkZW8vd2VibScpLFxuXHRcdFx0b2dnOiBtaW1lVmlkZW8oZWwsJ3ZpZGVvL29nZycpXG5cdFx0fVxuXHR9XG5cblx0LyoqKiBHbG9iYWwgYXR0cmlidXRlcyAqL1xuXG5cdC8qIEEgQm9vbGVhbiBhdHRyaWJ1dGU7IGlmIHNwZWNpZmllZCwgdGhlIHZpZGVvIGF1dG9tYXRpY2FsbHkgYmVnaW5zIHRvIHBsYXkgYmFjayBhcyBzb29uIGFzIGl0IGNhbiBkbyBzbyB3aXRob3V0IHN0b3BwaW5nIHRvIGZpbmlzaCBsb2FkaW5nIHRoZSBkYXRhLiBJZiBub3QgcmV0dXJuIHRoZSBhdW9wbGF5IGF0dHJpYnV0ZS4gKi9cblx0YXV0b3BsYXkodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmF1dG9wbGF5ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuYXV0b3BsYXk7XG5cdH1cblxuXHQvKiBSZXR1cm5zIHRoZSB0aW1lIHJhbmdlcyBvZiB0aGUgYnVmZmVyZWQgbWVkaWEuIFRoaXMgYXR0cmlidXRlIGNvbnRhaW5zIGEgVGltZVJhbmdlcyBvYmplY3QgKi9cblx0YnVmZmVyZWQoKcKgIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5idWZmZXJlZDtcblx0fVxuXG5cdC8qIElmIHRoaXMgYXR0cmlidXRlIGlzIHByZXNlbnQsIHRoZSBicm93c2VyIHdpbGwgb2ZmZXIgY29udHJvbHMgdG8gYWxsb3cgdGhlIHVzZXIgdG8gY29udHJvbCB2aWRlbyBwbGF5YmFjaywgaW5jbHVkaW5nIHZvbHVtZSwgc2Vla2luZywgYW5kIHBhdXNlL3Jlc3VtZSBwbGF5YmFjay4gV2hlbiBub3Qgc2V0IHJldHVybnMgaWYgdGhlIGNvbnRyb2xzIGFyZSBwcmVzZW50ICovXG5cdGNvbnRyb2xzKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5jb250cm9scyA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNvbnRyb2xzO1xuXHR9XG5cblx0LyogYW5vbnltb3VzLCB1c2UtY3JlZGVudGlhbHMsIGZhbHNlICovXG5cdGNyb3Nzb3JpZ2luKHYpIHtcblx0XHRpZiAodiA9PT0gJ3VzZS1jcmVkZW50aWFscycpIHtcblx0XHRcdHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSAndXNlLWNyZWRlbnRpYWxzJztcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRpZiAodikge1xuXHRcdFx0dGhpcy5tZWRpYS5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuXHRcdFx0cmV0dXJuICdhbm9ueW1vdXMnO1xuXHRcdH1cblx0XHRpZiAodiA9PT0gZmFsc2UpIHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSBudWxsO1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNyb3NzT3JpZ2luO1xuXHR9XG5cblx0LyogQSBCb29sZWFuIGF0dHJpYnV0ZTsgaWYgc3BlY2lmaWVkLCB3ZSB3aWxsLCB1cG9uIHJlYWNoaW5nIHRoZSBlbmQgb2YgdGhlIHZpZGVvLCBhdXRvbWF0aWNhbGx5IHNlZWsgYmFjayB0byB0aGUgc3RhcnQuICovXG5cdGxvb3Aodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmxvb3AgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5sb29wO1xuXHR9XG5cblx0LypBIEJvb2xlYW4gYXR0cmlidXRlIHdoaWNoIGluZGljYXRlcyB0aGUgZGVmYXVsdCBzZXR0aW5nIG9mIHRoZSBhdWRpbyBjb250YWluZWQgaW4gdGhlIHZpZGVvLiBJZiBzZXQsIHRoZSBhdWRpbyB3aWxsIGJlIGluaXRpYWxseSBzaWxlbmNlZC4gSXRzIGRlZmF1bHQgdmFsdWUgaXMgZmFsc2UsIG1lYW5pbmcgdGhhdCB0aGUgYXVkaW8gd2lsbCBiZSBwbGF5ZWQgd2hlbiB0aGUgdmlkZW8gaXMgcGxheWVkKi9cblx0bXV0ZWQodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLm11dGVkID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEubXV0ZWQ7XG5cdH1cblxuXHQvKiBNdXRlIHRoZSB2aWRlbyAqL1xuXHRtdXRlKCkge1xuXHRcdHRoaXMubXV0ZWQodHJ1ZSk7XG5cdH1cblxuXHQvKiBVbk11dGUgdGhlIHZpZGVvICovXG5cdHVubXV0ZSgpIHtcblx0XHR0aGlzLm11dGVkKGZhbHNlKTtcblx0fVxuXG5cdC8qIFRvZ2dsZSB0aGUgbXV0ZWQgc3RhbmNlIG9mIHRoZSB2aWRlbyAqL1xuXHR0b2dnbGVNdXRlKCkge1xuXHRcdHJldHVybiB0aGlzLm11dGVkKCF0aGlzLm11dGVkKCkpO1xuXHR9XG5cblx0LyogUmV0dXJucyBBIFRpbWVSYW5nZXMgb2JqZWN0IGluZGljYXRpbmcgYWxsIHRoZSByYW5nZXMgb2YgdGhlIHZpZGVvIHRoYXQgaGF2ZSBiZWVuIHBsYXllZC4qL1xuXHRwbGF5ZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucGxheWVkO1xuXHR9XG5cblx0Lypcblx0VGhpcyBlbnVtZXJhdGVkIGF0dHJpYnV0ZSBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgaGludCB0byB0aGUgYnJvd3NlciBhYm91dCB3aGF0IHRoZSBhdXRob3IgdGhpbmtzIHdpbGwgbGVhZCB0byB0aGUgYmVzdCB1c2VyIGV4cGVyaWVuY2UuIEl0IG1heSBoYXZlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczpcblx0XHRub25lOiBpbmRpY2F0ZXMgdGhhdCB0aGUgdmlkZW8gc2hvdWxkIG5vdCBiZSBwcmVsb2FkZWQuXG5cdFx0bWV0YWRhdGE6IGluZGljYXRlcyB0aGF0IG9ubHkgdmlkZW8gbWV0YWRhdGEgKGUuZy4gbGVuZ3RoKSBpcyBmZXRjaGVkLlxuXHRcdGF1dG86IGluZGljYXRlcyB0aGF0IHRoZSB3aG9sZSB2aWRlbyBmaWxlIGNvdWxkIGJlIGRvd25sb2FkZWQsIGV2ZW4gaWYgdGhlIHVzZXIgaXMgbm90IGV4cGVjdGVkIHRvIHVzZSBpdC5cblx0dGhlIGVtcHR5IHN0cmluZzogc3lub255bSBvZiB0aGUgYXV0byB2YWx1ZS5cblx0Ki9cblx0cHJlbG9hZCh2KSB7XG5cdFx0aWYgKHYgPT09ICdtZXRhZGF0YScgfHwgdiA9PT0gXCJtZXRhXCIpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdtZXRhZGF0YSc7XG5cdFx0XHRyZXR1cm4gJ21ldGFkYXRhJztcblx0XHR9XG5cdFx0aWYgKHYpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdhdXRvJztcblx0XHRcdHJldHVybiAnYXV0byc7XG5cdFx0fVxuXHRcdGlmICh2ID09PSBmYWxzZSkge1xuXHRcdFx0dGhpcy5tZWRpYS5wcmVsb2FkID0gJ25vbmUnO1xuXHRcdFx0cmV0dXJuICdub25lJztcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucHJlbG9hZDtcblx0fVxuXG5cdC8qIEdpdmVzIG9yIHJldHVybnMgdGhlIGFkZHJlc3Mgb2YgYW4gaW1hZ2UgZmlsZSB0aGF0IHRoZSB1c2VyIGFnZW50IGNhbiBzaG93IHdoaWxlIG5vIHZpZGVvIGRhdGEgaXMgYXZhaWxhYmxlLiBUaGUgYXR0cmlidXRlLCBpZiBwcmVzZW50LCBtdXN0IGNvbnRhaW4gYSB2YWxpZCBub24tZW1wdHkgVVJMIHBvdGVudGlhbGx5IHN1cnJvdW5kZWQgYnkgc3BhY2VzICovXG5cdHBvc3Rlcih2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5tZWRpYS5wb3N0ZXIgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wb3N0ZXI7XG5cdH1cblxuXHQvKiBUaGUgc3JjIHByb3BlcnR5IHNldHMgb3IgcmV0dXJucyB0aGUgY3VycmVudCBzb3VyY2Ugb2YgdGhlIGF1ZGlvL3ZpZGVvLCBUaGUgc291cmNlIGlzIHRoZSBhY3R1YWwgbG9jYXRpb24gKFVSTCkgb2YgdGhlIGF1ZGlvL3ZpZGVvIGZpbGUgKi9cblx0c3JjKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRfY2FuY2VsUmVxdWVzdHModGhpcy5tZWRpYSk7XG5cdFx0XHRpZih2IGluc3RhbmNlb2YgQXJyYXkpe1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwLCBuID0gdi5sZW5ndGg7IGkrPTE7KXtcblx0XHRcdFx0XHRpZih2W2ldWyd0eXBlJ10gPT09IFwidmlkZW8vbXA0XCIgJiYgdGhpcy5jYW5QbGF5Lm1wNCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL3dlYm1cIiAmJiB0aGlzLmNhblBsYXkud2VibSl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL29nZ1wiICYmIHRoaXMuY2FuUGxheS5vZ2cpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZSBpZih2LnNyYyAmJiB2LnR5cGUpe1xuXHRcdFx0XHR0aGlzLm1lZGlhLnNyYyA9IHYuc3JjO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHRoaXMubWVkaWEuc3JjID0gdjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50U3JjO1xuXHR9XG5cblx0LyoqKiBHbG9iYWwgRXZlbnRzICovXG5cblx0LyogU3RhcnRzIHBsYXlpbmcgdGhlIGF1ZGlvL3ZpZGVvICovXG5cdHBsYXkoKSB7XG5cdFx0dGhpcy5tZWRpYS5wbGF5KCk7XG5cdH1cblxuXHQvKiBQYXVzZXMgdGhlIGN1cnJlbnRseSBwbGF5aW5nIGF1ZGlvL3ZpZGVvICovXG5cdHBhdXNlKCkge1xuXHRcdHRoaXMubWVkaWEucGF1c2UoKTtcblx0fVxuXG5cdC8qIFRvZ2dsZSBwbGF5L3BhdXNlIGZvciB0aGUgYXVkaW8vdmlkZW8gKi9cblx0dG9nZ2xlUGxheSgpIHtcblx0XHR0aGlzLm1lZGlhLnBhdXNlZCA/IHRoaXMucGxheSgpIDogdGhpcy5wYXVzZSgpO1xuXHR9XG5cblx0Y3VycmVudFRpbWUodikge1xuXHRcdGlmICh2ID09PSBudWxsIHx8IGlzTmFOKHYpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50VGltZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiB0aGlzLm1lZGlhLmR1cmF0aW9uKSB7XG5cdFx0XHR2ID0gdGhpcy5tZWRpYS5kdXJhdGlvbjtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS5jdXJyZW50VGltZSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH1cblxuXHRzZWVrKHYpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50VGltZSh2KTtcblx0fVxuXG5cblx0LyoqXG5cdCAqIFtSZS1sb2FkcyB0aGUgYXVkaW8vdmlkZW8gZWxlbWVudCwgdXBkYXRlIHRoZSBhdWRpby92aWRlbyBlbGVtZW50IGFmdGVyIGNoYW5naW5nIHRoZSBzb3VyY2Ugb3Igb3RoZXIgc2V0dGluZ3NdXG5cdCAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0bG9hZCh2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5zcmModik7XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEubG9hZCgpO1xuXHR9XG5cblx0ZHVyYXRpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuZHVyYXRpb247XG5cdH1cblxuXHR2b2x1bWUodikge1xuXHRcdC8vIFJldHVybiBjdXJyZW50IHZvbHVtZSBpZiB2YWx1ZSBcblx0XHRpZiAodiA9PT0gbnVsbCB8fCBpc05hTih2KSkge1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudm9sdW1lO1xuXHRcdH1cblx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRpZiAodiA+IDEpIHtcblx0XHRcdHYgPSAxO1xuXHRcdH1cblx0XHRpZiAodiA8IDApIHtcblx0XHRcdHYgPSAwO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhLnZvbHVtZSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH1cbn0iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKXtcblx0bGV0IHNjYWxlID0gMDtcblx0bGV0IGJvdW5kcyA9IGZ1bmN0aW9uKGVsLCB1cGRhdGVTY2FsZSkge1xuXHRcdGlmKCB1cGRhdGVTY2FsZSAhPT0gdW5kZWZpbmVkKSBzY2FsZSA9IHVwZGF0ZVNjYWxlO1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0d3JhcHBlcldpZHRoOiBlbC5vZmZzZXRXaWR0aCxcblx0XHRcdHdyYXBwZXJIZWlnaHQ6IGVsLm9mZnNldEhlaWdodCxcblx0XHRcdHNjYWxlOiBzY2FsZSB8fCAoZWwud2lkdGgvZWwuaGVpZ2h0KSxcblx0XHRcdHdpZHRoOiAwLFxuXHRcdFx0aGVpZ2h0OiAwLFxuXHRcdFx0b2Zmc2V0WDogMCxcblx0XHRcdG9mZnNldFk6IDBcblx0XHR9XG5cdFx0ZGF0YVsnd3JhcHBlclNjYWxlJ10gPSBkYXRhLndyYXBwZXJXaWR0aCAvIGRhdGEud3JhcHBlckhlaWdodDtcblx0XHRpZiAoZGF0YS53cmFwcGVyU2NhbGUgPiBkYXRhLnNjYWxlKSB7XG5cdFx0XHRkYXRhLmhlaWdodCA9IGRhdGEud3JhcHBlckhlaWdodDtcblx0XHRcdGRhdGEud2lkdGggPSBkYXRhLnNjYWxlICogZGF0YS5oZWlnaHQ7XG5cdFx0XHRkYXRhLm9mZnNldFggPSAoZGF0YS53cmFwcGVyV2lkdGggLSBkYXRhLndpZHRoKSAvIDI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRhdGEud2lkdGggPSBkYXRhLndyYXBwZXJXaWR0aDtcblx0XHRcdGRhdGEuaGVpZ2h0ID0gZGF0YS53aWR0aCAvIGRhdGEuc2NhbGU7XG5cdFx0XHRkYXRhLm9mZnNldFkgPSAoZGF0YS53cmFwcGVySGVpZ2h0IC0gZGF0YS5oZWlnaHQpIC8gMjtcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblx0cmV0dXJuIGJvdW5kcztcbn0pKCk7IiwidmFyIF9kb2MgPSBkb2N1bWVudCB8fCB7fTtcbi8vIFNldCB0aGUgbmFtZSBvZiB0aGUgaGlkZGVuIHByb3BlcnR5IGFuZCB0aGUgY2hhbmdlIGV2ZW50IGZvciB2aXNpYmlsaXR5XG52YXIgaGlkZGVuLCB2aXNpYmlsaXR5Q2hhbmdlO1xuaWYgKHR5cGVvZiBfZG9jLmhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyBPcGVyYSAxMi4xMCBhbmQgRmlyZWZveCAxOCBhbmQgbGF0ZXIgc3VwcG9ydCBcblx0aGlkZGVuID0gXCJoaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwidmlzaWJpbGl0eWNoYW5nZVwiO1xufSBlbHNlIGlmICh0eXBlb2YgX2RvYy5tb3pIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aGlkZGVuID0gXCJtb3pIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwibW96dmlzaWJpbGl0eWNoYW5nZVwiO1xufSBlbHNlIGlmICh0eXBlb2YgX2RvYy5tc0hpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIm1zSGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1zdmlzaWJpbGl0eWNoYW5nZVwiO1xufSBlbHNlIGlmICh0eXBlb2YgX2RvYy53ZWJraXRIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aGlkZGVuID0gXCJ3ZWJraXRIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiO1xufVxuXG5jb25zdCBpc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gISh0eXBlb2YgX2RvY1toaWRkZW5dID09PSBcInVuZGVmaW5lZFwiKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFnZVZpc2liaWxpdHkoX21lZGlhLCBzZXR0aW5ncyA9IHt9KSB7XG5cdGxldCBfYXZhaWxhYmxlID0gaXNBdmFpbGFibGUoKTtcblx0aWYgKF9hdmFpbGFibGUpIHtcblx0XHRsZXQgX2VuYWJsZWQgPSBmYWxzZTtcblx0XHRsZXQgX3BsYXlpbmcgPSBmYWxzZTtcblx0XHRsZXQgcGF1c2VkID0gZmFsc2U7XG5cdFx0bGV0IHNldEZsYWdQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRfcGxheWluZyA9IHRydWU7XG5cdFx0fTtcblx0XHRsZXQgZXZlbnRzID0ge1xuXHRcdFx0dmlzaWJsZTogZnVuY3Rpb24oKXt9LFxuXHRcdFx0aGlkZGVuOiBmdW5jdGlvbigpe31cblx0XHR9O1xuXHRcdGxldCBkZXN0cm95VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZXZlbnRzID0ge1xuXHRcdFx0XHR2aXNpYmxlOiBmdW5jdGlvbigpe30sXG5cdFx0XHRcdGhpZGRlbjogZnVuY3Rpb24oKXt9XG5cdFx0XHR9O1xuXHRcdFx0X2VuYWJsZWQgPSBmYWxzZTtcblx0XHRcdF9wbGF5aW5nID0gZmFsc2U7XG5cdFx0XHRfZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdFx0X21lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cdFx0fVxuXHRcdGxldCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoX2VuYWJsZWQpIHtcblx0XHRcdFx0aWYgKF9kb2NbaGlkZGVuXSkge1xuXHRcdFx0XHRcdGlmIChfcGxheWluZyAmJiAhX21lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0X21lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudHMuaGlkZGVuKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHBhdXNlZCAmJiBfbWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRfbWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50cy52aXNpYmxlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0bGV0IGluaXRWaXNpYmlsaXR5ID0gZnVuY3Rpb24gaW5pdFZpc2liaWxpdHkoc2V0dGluZ3MpIHtcblx0XHRcdGlmIChfYXZhaWxhYmxlKSB7XG5cdFx0XHRcdF9kb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRcdF9tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdFx0XHRcblx0XHRcdFx0ZXZlbnRzLnZpc2libGUgPSBzZXR0aW5ncy5vblZpc2libGUgfHwgZXZlbnRzLnZpc2libGU7XG5cdFx0XHRcdGV2ZW50cy5oaWRkZW4gPSBzZXR0aW5ncy5vbkhpZGRlbiB8fCBldmVudHMuaGlkZGVuO1xuXHRcdFx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdF9kb2MuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRcdF9tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRldmVudHMudmlzaWJsZSA9IHNldHRpbmdzLm9uVmlzaWJsZSB8fCBldmVudHMudmlzaWJsZTtcblx0XHRldmVudHMuaGlkZGVuID0gc2V0dGluZ3Mub25IaWRkZW4gfHwgZXZlbnRzLmhpZGRlbjtcblx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0X2RvYy5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRfbWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblxuXHRcdHRoaXMuaW5pdCA9IGluaXRWaXNpYmlsaXR5O1xuXHRcdHRoaXMuZGVzdHJveSA9IGRlc3Ryb3lWaXNpYmlsaXR5O1xuXHRcdHRoaXMub24gPSBmdW5jdGlvbihldmVudCxmbikge1xuXHRcdFx0aWYgKGV2ZW50IGluIGV2ZW50cykgZXZlbnRzW2V2ZW50XSA9IGZuO1xuXHRcdH07XG5cdFx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24odikge1xuXHRcdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIF9lbmFibGVkID0gdjtcblx0XHRcdHJldHVybiBfZW5hYmxlZDtcblx0XHR9XG5cdH07XG59OyIsImxldCBmbl9jb250ZXh0bWVudSA9IGZ1bmN0aW9uKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb250ZXh0TWVudShlbCkge1xuXHRpZiAoZWwpIHtcblx0XHR0aGlzLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUpO1xuXHRcdH1cblx0XHR0aGlzLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmbl9jb250ZXh0bWVudSk7XG5cdFx0fVxuXHR9XG59OyIsImxldCBfZG9jID0gZG9jdW1lbnQgfHwge307XG5sZXQgZXh0ZXJuYWxDb250cm9scyA9IGZ1bmN0aW9uKGVsKSB7XG5cdGxldCBfZW5hYmxlZCA9IHRydWU7XG5cdGxldCBfc2VlayA9IHRydWU7XG5cdGxldCBfdElkID0gbnVsbDtcblx0bGV0IG1lZGlhID0gZWw7XG5cdGxldCBrZXlkb3duID0gZnVuY3Rpb24oZSkge1xuXHRcdGlmIChfZW5hYmxlZCkge1xuXHRcdFx0Ly9ieXBhc3MgZGVmYXVsdCBuYXRpdmUgZXh0ZXJuYWwgY29udHJvbHMgd2hlbiBtZWRpYSBpcyBmb2N1c2VkXG5cdFx0XHRtZWRpYS5wYXJlbnROb2RlLmZvY3VzKCk7XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDMyKSB7IC8vc3BhY2Vcblx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoX3NlZWspIHtcblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzNykgeyAvL2xlZnRcblx0XHRcdFx0XHRtZWRpYS5jdXJyZW50VGltZSA9IG1lZGlhLmN1cnJlbnRUaW1lIC0gNTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOSkgeyAvL3JpZ2h0XG5cdFx0XHRcdFx0bWVkaWEuY3VycmVudFRpbWUgPSBtZWRpYS5jdXJyZW50VGltZSArIDU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDM4KSB7IC8vdXBcblx0XHRcdFx0bGV0IHYgPSBtZWRpYS52b2x1bWU7XG5cdFx0XHRcdHYgKz0gLjE7XG5cdFx0XHRcdGlmICh2ID4gMSkgdiA9IDE7XG5cdFx0XHRcdG1lZGlhLnZvbHVtZSA9IHY7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCkgeyAvL2Rvd25cblx0XHRcdFx0bGV0IHYgPSBtZWRpYS52b2x1bWU7XG5cdFx0XHRcdHYgLT0gLjE7XG5cdFx0XHRcdGlmICh2IDwgMCkgdiA9IDA7XG5cdFx0XHRcdG1lZGlhLnZvbHVtZSA9IHY7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8qaWYgKHNlbGYuY29udHJvbEJhcikge1xuXHRcdFx0XHRpZiAoc2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24pIHtcblx0XHRcdFx0XHRpZiAoZS5rZXlDb2RlID09IDQwIHx8IGUua2V5Q29kZSA9PSAzOCkge1xuXG5cdFx0XHRcdFx0XHRzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbi5tZW51Q29udGVudC5lbF8uY2xhc3NOYW1lID0gXCJ2anMtbWVudSBzaG93XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9Ki9cblx0XHR9XG5cdH07XG5cblx0Ly8gdGhpcy5vblNwYWNlID0gZnVuY3Rpb24oKSB7XG5cblx0Ly8gfTtcblxuXHRsZXQga2V5dXAgPSBmdW5jdGlvbihlKSB7XG5cdFx0aWYgKF9lbmFibGVkKSB7XHRcdFx0XG5cdFx0XHQvLyBpZiAoZS5rZXlDb2RlID09IDQwIHx8IGUua2V5Q29kZSA9PSAzOCkge1xuXHRcdFx0Ly8gXHRjbGVhckludGVydmFsKF90SWQpO1xuXHRcdFx0Ly8gXHRpZiAoc2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24pIHtcblx0XHRcdC8vIFx0XHRfdElkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdC8vIFx0XHRcdHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uLm1lbnVDb250ZW50LmVsXy5jbGFzc05hbWUgPSBcInZqcy1tZW51XCI7XG5cdFx0XHQvLyBcdFx0fSwgNTAwKTtcblx0XHRcdC8vIFx0fVxuXHRcdFx0Ly8gfVxuXHRcdH1cblx0fTtcblx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24oYikge1xuXHRcdGlmIChiID09PSB1bmRlZmluZWQpIHJldHVybiBfZW5hYmxlZDtcblx0XHRfZW5hYmxlZCA9IGI7XG5cblx0fTtcblx0dGhpcy5zZWVrRW5hYmxlZCA9IGZ1bmN0aW9uKGIpIHtcblx0XHRpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gX3NlZWs7XG5cdFx0X3NlZWsgPSBiO1xuXHR9O1xuXHR0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0X3RJZCA9IG51bGw7XG5cdFx0X3NlZWsgPSB0cnVlO1xuXHRcdF9kb2MuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bi5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdFx0X2RvYy5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXAuYmluZCh0aGlzKSwgZmFsc2UpO1xuXHR9O1xuXHR0aGlzLmRlc3Ryb3kgPSAgZnVuY3Rpb24oKSB7XG5cdFx0X2VuYWJsZWQgPSBmYWxzZTtcblx0XHRfdElkID0gbnVsbDtcblx0XHRfc2VlayA9IHRydWU7XG5cdFx0X2RvYy5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duKTtcblx0XHRfZG9jLmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cCk7XG5cdH1cblx0dGhpcy5pbml0KCk7XG59XG5leHBvcnQgZGVmYXVsdCBleHRlcm5hbENvbnRyb2xzOyIsIi8vaHR0cHM6Ly9naXRodWIuY29tL2ZkYWNpdWsvYWpheFxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIGFqYXgob3B0aW9ucykge1xuICAgIHZhciBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJ11cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIG9wdGlvbnMuYmFzZVVybCA9IG9wdGlvbnMuYmFzZVVybCB8fCAnJ1xuICAgIGlmIChvcHRpb25zLm1ldGhvZCAmJiBvcHRpb25zLnVybCkge1xuICAgICAgcmV0dXJuIHhockNvbm5lY3Rpb24oXG4gICAgICAgIG9wdGlvbnMubWV0aG9kLFxuICAgICAgICBvcHRpb25zLmJhc2VVcmwgKyBvcHRpb25zLnVybCxcbiAgICAgICAgbWF5YmVEYXRhKG9wdGlvbnMuZGF0YSksXG4gICAgICAgIG9wdGlvbnNcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKGFjYywgbWV0aG9kKSB7XG4gICAgICBhY2NbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSkge1xuICAgICAgICByZXR1cm4geGhyQ29ubmVjdGlvbihcbiAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgb3B0aW9ucy5iYXNlVXJsICsgdXJsLFxuICAgICAgICAgIG1heWJlRGF0YShkYXRhKSxcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCB7fSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG1heWJlRGF0YShkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEgfHwgbnVsbFxuICB9XG5cbiAgZnVuY3Rpb24geGhyQ29ubmVjdGlvbih0eXBlLCB1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICB2YXIgcmV0dXJuTWV0aG9kcyA9IFsndGhlbicsICdjYXRjaCcsICdhbHdheXMnXVxuICAgIHZhciBwcm9taXNlTWV0aG9kcyA9IHJldHVybk1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKHByb21pc2UsIG1ldGhvZCkge1xuICAgICAgcHJvbWlzZVttZXRob2RdID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgcHJvbWlzZVttZXRob2RdID0gY2FsbGJhY2tcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfSwge30pXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgeGhyLm9wZW4odHlwZSwgdXJsLCB0cnVlKVxuICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLmhhc093blByb3BlcnR5KCd3aXRoQ3JlZGVudGlhbHMnKVxuICAgIHNldEhlYWRlcnMoeGhyLCBvcHRpb25zLmhlYWRlcnMpXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCByZWFkeShwcm9taXNlTWV0aG9kcywgeGhyKSwgZmFsc2UpXG4gICAgeGhyLnNlbmQob2JqZWN0VG9RdWVyeVN0cmluZyhkYXRhKSlcbiAgICBwcm9taXNlTWV0aG9kcy5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHhoci5hYm9ydCgpXG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlTWV0aG9kc1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SGVhZGVycyh4aHIsIGhlYWRlcnMpIHtcbiAgICBoZWFkZXJzID0gaGVhZGVycyB8fCB7fVxuICAgIGlmICghaGFzQ29udGVudFR5cGUoaGVhZGVycykpIHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICB9XG4gICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAoaGVhZGVyc1tuYW1lXSAmJiB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCBoZWFkZXJzW25hbWVdKSlcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gaGFzQ29udGVudFR5cGUoaGVhZGVycykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhoZWFkZXJzKS5zb21lKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWR5KHByb21pc2VNZXRob2RzLCB4aHIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlUmVhZHkoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IHhoci5ET05FKSB7XG4gICAgICAgIHhoci5yZW1vdmVFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgaGFuZGxlUmVhZHksIGZhbHNlKVxuICAgICAgICBwcm9taXNlTWV0aG9kcy5hbHdheXMuYXBwbHkocHJvbWlzZU1ldGhvZHMsIHBhcnNlUmVzcG9uc2UoeGhyKSlcblxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgIHByb21pc2VNZXRob2RzLnRoZW4uYXBwbHkocHJvbWlzZU1ldGhvZHMsIHBhcnNlUmVzcG9uc2UoeGhyKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlTWV0aG9kcy5jYXRjaC5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VSZXNwb25zZSh4aHIpIHtcbiAgICB2YXIgcmVzdWx0XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSB4aHIucmVzcG9uc2VUZXh0XG4gICAgfVxuICAgIHJldHVybiBbcmVzdWx0LCB4aHJdXG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RUb1F1ZXJ5U3RyaW5nKGRhdGEpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoZGF0YSkgPyBnZXRRdWVyeVN0cmluZyhkYXRhKSA6IGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KGRhdGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGEpID09PSAnW29iamVjdCBPYmplY3RdJ1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmcob2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCkucmVkdWNlKGZ1bmN0aW9uKGFjYywgaXRlbSkge1xuICAgICAgdmFyIHByZWZpeCA9ICFhY2MgPyAnJyA6IGFjYyArICcmJ1xuICAgICAgcmV0dXJuIHByZWZpeCArIGVuY29kZShpdGVtKSArICc9JyArIGVuY29kZShvYmplY3RbaXRlbV0pXG4gICAgfSwgJycpXG4gIH1cblxuICBmdW5jdGlvbiBlbmNvZGUodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKVxuICB9XG5cbiAgcmV0dXJuIGFqYXhcbn0pKCk7IiwiaW1wb3J0IGNsYXNzTWl4aW4gZnJvbSAnLi9oZWxwZXJzL2NsYXNzTWl4aW4nO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuL2hlbHBlcnMvZGVlcG1lcmdlJztcbmltcG9ydCBleHRlbmQgZnJvbSAnLi9oZWxwZXJzL2V4dGVuZCc7XG5pbXBvcnQgeyBjYXBpdGFsaXplRmlyc3RMZXR0ZXIgfSBmcm9tICcuL2hlbHBlcnMvdXRpbHMnO1xuaW1wb3J0IGRvbSBmcm9tICcuL2hlbHBlcnMvZG9tJztcbmltcG9ydCBNZWRpYSBmcm9tICcuL2NvcmUvbWVkaWEvaW5kZXgnO1xuaW1wb3J0IGNvbnRhaW5lckJvdW5kcyBmcm9tICcuL2hlbHBlcnMvY29udGFpbmVyQm91bmRzJztcbmltcG9ydCBwYWdlVmlzaWJpbGl0eSBmcm9tICcuL2hlbHBlcnMvcGFnZVZpc2liaWxpdHknO1xuaW1wb3J0IGNvbnRleHRNZW51IGZyb20gJy4vaGVscGVycy9jb250ZXh0TWVudSc7XG5pbXBvcnQgZXh0ZXJuYWxDb250cm9scyBmcm9tICcuL2NvcmUvbWVkaWEvZXZlbnRzL2V4dGVybmFsQ29udHJvbHMnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi9oZWxwZXJzL2FqYXgnO1xuXG5jb25zdCBzZXR0aW5ncyA9IFN5bWJvbCgnc2V0dGluZ3MnKTtcbmNvbnN0IGRlZmF1bHRzID0ge1xuXHR3aWR0aDogOTYwLFxuXHRoZWlnaHQ6IDU0MFxufTtcblxuY2xhc3Mga21sUGxheWVyIGV4dGVuZHMgTWVkaWEge1xuXHRjb25zdHJ1Y3RvcihlbCwgc2V0dGluZ3MsIF9ldmVudHMpIHtcblx0XHRzdXBlcihlbCk7XG5cdFx0dGhpc1tzZXR0aW5nc10gPSBkZWVwbWVyZ2UoZGVmYXVsdHMsIHNldHRpbmdzKTtcblx0XHRkb20uY2xhc3MuYWRkKGVsLCBcImttbFwiICsgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpKTtcblx0XHR0aGlzLndyYXBwZXIgPSBkb20ud3JhcCh0aGlzLm1lZGlhLCBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdFx0Y2xhc3M6ICdrbWxQbGF5ZXInXG5cdFx0fSkpO1xuXHRcdHRoaXMuZGVmYXVsdFdpZHRoKHRoaXNbc2V0dGluZ3NdLndpZHRoKTtcblx0XHR0aGlzLmRlZmF1bHRIZWlnaHQodGhpc1tzZXR0aW5nc10uaGVpZ2h0KTtcblxuXHRcdHRoaXMucGFnZVZpc2liaWxpdHkgPSBuZXcgcGFnZVZpc2liaWxpdHkoZWwsIHtcblx0XHRcdG9uSGlkZGVuOiAoKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFRpbWUoKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5jb250ZXh0TWVudSA9IG5ldyBjb250ZXh0TWVudShlbCk7XG5cdFx0dGhpcy5leHRlcm5hbENvbnRyb2xzID0gbmV3IGV4dGVybmFsQ29udHJvbHMoZWwpO1xuXG5cdFx0Zm9yICh2YXIgZXZ0IGluIF9ldmVudHMpIHtcblx0XHRcdHRoaXMub24oZXZ0LCBfZXZlbnRzW2V2dF0sIHRoaXMpO1xuXHRcdH1cblx0fVxuXG5cdGFqYXgob3B0aW9ucykge1xuXHRcdHJldHVybiBhamF4KG9wdGlvbnMpO1xuXHR9XG5cblx0ZGVmYXVsdFdpZHRoKHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb1dpZHRoKSB7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdGhpcy5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEud2lkdGg7XG5cdH1cblxuXHRkZWZhdWx0SGVpZ2h0KHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb0hlaWdodCkge1xuXHRcdFx0dGhpcy5tZWRpYS5oZWlnaHQgPSB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9IZWlnaHQ7XG5cdFx0fVxuXHRcdGlmICghaXNOYU4odikpIHtcblx0XHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdFx0dGhpcy5tZWRpYS5oZWlnaHQgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5oZWlnaHQ7XG5cdH1cblxuXHRzY2FsZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5kZWZhdWx0V2lkdGgoKSAvIHRoaXMuZGVmYXVsdEhlaWdodCgpO1xuXHR9XG5cblx0Ym91bmRzKHYpIHtcblx0XHRsZXQgZGF0YSA9IGNvbnRhaW5lckJvdW5kcyh0aGlzLm1lZGlhKTtcblx0XHRpZiAoZGF0YVt2XSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZGF0YVt2XTtcblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG5cdHdpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnd2lkdGgnKTtcblx0fVxuXG5cdGhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ2hlaWdodCcpO1xuXHR9XG5cblx0b2Zmc2V0WCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ29mZnNldFgnKTtcblx0fVxuXG5cdG9mZnNldFkoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRZJyk7XG5cdH1cblxuXHR3cmFwcGVySGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdHdyYXBwZXJXaWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRXaWR0aDtcblx0fVxuXG5cdHdyYXBwZXJTY2FsZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRXaWR0aCAvIHRoaXMubWVkaWEub2Zmc2V0SGVpZ2h0O1xuXHR9XG5cblx0YWRkQ2xhc3Modikge1xuXHRcdGRvbS5jbGFzcy5hZGQodGhpcy53cmFwcGVyLCB2KTtcblx0fVxuXHRyZW1vdmVDbGFzcyh2KSB7XG5cdFx0aWYgKHYgIT09ICdrbWxQbGF5ZXInKSB7XG5cdFx0XHRkb20uY2xhc3MucmVtb3ZlKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG5cdHRvZ2dsZUNsYXNzKHYpIHtcblx0XHRpZiAodiAhPT0gJ2ttbFBsYXllcicpIHtcblx0XHRcdGRvbS5jbGFzcy50b2dnbGUodGhpcy53cmFwcGVyLCB2KTtcblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGttbFBsYXllcjsiXSwibmFtZXMiOlsiYmFiZWxIZWxwZXJzLnR5cGVvZiIsIkV2ZW50cyIsIl9kb2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQkFBZSxDQUFDLFlBQVU7QUFDekIsSUFBQSxLQUFJLFlBQVksU0FBWixTQUFZLENBQVMsTUFBVCxFQUFpQixHQUFqQixFQUFzQjtBQUNyQyxJQUFBLE1BQUcsR0FBSCxFQUFPO0FBQ0gsSUFBQSxPQUFJLFFBQVEsTUFBTSxPQUFOLENBQWMsR0FBZCxDQUFaO0FBQ0EsSUFBQSxPQUFJLE1BQU0sU0FBUyxFQUFULElBQWUsRUFBekI7O0FBRUEsSUFBQSxPQUFJLEtBQUosRUFBVztBQUNQLElBQUEsYUFBUyxVQUFVLEVBQW5CO0FBQ0EsSUFBQSxVQUFNLElBQUksTUFBSixDQUFXLE1BQVgsQ0FBTjtBQUNBLElBQUEsUUFBSSxPQUFKLENBQVksVUFBUyxDQUFULEVBQVks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