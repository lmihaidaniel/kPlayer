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

    var defaults$4 = {
    	x: 0,
    	y: 0,
    	width: 0,
    	height: 0
    };
    var relativeSizePos = function relativeSizePos(ctx, settings) {
    	var parentWidth = ctx.videoWidth() || ctx.width || 0;
    	var parentHeight = ctx.videoHeight() || ctx.height || 0;
    	var o = deepmerge(defaults$4, settings);
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

    var Container = function Container(el, opts, ctx, player) {
    	var _this = this;

    	classCallCheck(this, Container);

    	var playerPaused = false;
    	var isVisible = false;
    	var externalControls = false;
    	var body = dom.select('.body', el);
    	this.body = body;
    	var elDimension = function elDimension(fopts) {
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
    	};
    	elDimension();
    	player.on('videoResize', elDimension);

    	this.updateSizePos = function (data) {
    		elDimension(data);
    	};

    	var events = {};
    	this.on = function (event, fn) {
    		if (!events[event]) events[event] = [];
    		events[event].push(fn);
    	};

    	this.triggerEvent = function (name) {
    		if (events[name]) {
    			for (var k in events[name]) {
    				var fn = events[name][k];
    				if (isFunction(fn)) {
    					fn();
    				};
    			}
    		}
    	};

    	this.hide = function () {
    		if (isVisible) {
    			dom.addClass(el, 'hidden');
    			if (opts.pause) {
    				if (!playerPaused) {
    					player.play();
    				}
    				isVisible = false;
    				if (externalControls && opts.externalControls) {
    					player.externalControls.enabled(true);
    				}
    			}
    			setTimeout(function () {
    				el.style.display = "none";
    				if (isFunction(opts.onHide)) opts.onHide();
    				ctx.checkVisibleElements();
    				_this.triggerEvent('hide');
    			}, 250);
    		}
    	};
    	this.show = function () {
    		if (!isVisible) {
    			ctx.enabled(true);
    			el.style.display = "block";
    			setTimeout(function () {
    				dom.removeClass(el, 'hidden');
    				if (isFunction(opts.onHide)) opts.onShow();
    				_this.triggerEvent('show');
    			}, 50);
    			if (opts.pause) {
    				if (!player.paused()) {
    					playerPaused = false;
    					player.pause();
    				} else {
    					playerPaused = true;
    				}
    			}
    			isVisible = true;
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

    	var overlay = dom.select('.overlay', el);

    	this.backgroundColor = function (v) {
    		if (v != null) {
    			overlay.style.backgroundColor = v;
    		} else {
    			overlay.style.backgroundColor;
    		}
    	};

    	this.backgroundColor();

    	var clsElements = dom.selectAll('.triggerClose', el);
    	for (var i = 0, n = clsElements.length; i < n; i += 1) {
    		clsElements[i].addEventListener('click', this.hide);
    	}

    	if (opts.visible) {
    		this.show();
    	}

    	this.visible = function (v) {
    		if (typeof v === 'boolean') isVisible = v;
    		return isVisible;
    	};
    };

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

    var containerExtended = function (_Container) {
    	inherits(containerExtended, _Container);

    	function containerExtended(el, opts, ctx, player) {
    		classCallCheck(this, containerExtended);

    		var _this = possibleConstructorReturn(this, _Container.call(this, el, opts, ctx, player));

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
    		player.on('resize', function () {
    			dom.autoLineHeight(header);
    		});
    		return _this;
    	}

    	containerExtended.prototype.title = function title(v) {
    		if (v != null) {
    			this._title.innerHTML = v;
    			dom.autoLineHeight(this._title.parentNode);
    			return v;
    		}
    		return this._title.innerHTML;
    	};

    	return containerExtended;
    }(Container);

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

        function Fullscreen(inIframe) {
            classCallCheck(this, Fullscreen);

            var _this = possibleConstructorReturn(this, _Events.call(this));

            _this.iframe = inIframe;
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
            }
            return false;
        };

        Fullscreen.prototype.requestFullWindow = function requestFullWindow(element) {
            if (this.isFullWindow() || this.isFullScreen()) {
                return;
            }
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

    	function Media(el, inIframe) {
    		classCallCheck(this, Media);

    		var _this = possibleConstructorReturn(this, _Fullscreen.call(this, inIframe));

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
    	}
    };

    var Player = function (_Media) {
    	inherits(Player, _Media);

    	function Player(settings, _events, app) {
    		classCallCheck(this, Player);

    		var el = settings.video;
    		var inIframe$$ = inIframe();

    		var _this = possibleConstructorReturn(this, _Media.call(this, el, inIframe$$));

    		if (el == null) return possibleConstructorReturn(_this);
    		_this._bounds = {};
    		_this.device = device;
    		_this.__settings = deepmerge(defaults$5, settings);
    		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
    		_this.wrapper = dom.wrap(_this.media, dom.createElement('div', {
    			class: 'kmlPlayer'
    		}));
    		dom.triggerWebkitHardwareAcceleration(_this.wrapper);
    		if (inIframe$$) {
    			dom.addClass(_this.wrapper, "inFrame");
    		}
    		//initSettings
    		for (var k in _this.__settings) {
    			if (_this[k]) {
    				if (k === 'autoplay' && _this.__settings[k] && !inIframe$$) {
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

    		_this.videoContainer = function (vs) {
    			return this.containers.add(vs, null, 'video');
    		};

    		//autoFONT
    		if (typeof _this.__settings.font === "boolean" && _this.__settings.font) _this.__settings.font = defaults$5.font;
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
    				_this.emit('videoResize');
    			}
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

    		if (typeof app === 'function') {
    			app.bind(_this)();
    		}
    		return _this;
    	}

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
    		if (this._bounds[v] !== null) return this._bounds[v];
    		return this._bounds;
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

    var videoContainer = function (_containerExtended) {
    	inherits(videoContainer, _containerExtended);

    	function videoContainer(el, opts, ctx, player) {
    		classCallCheck(this, videoContainer);

    		var _this = possibleConstructorReturn(this, _containerExtended.call(this, el, opts, ctx, player));

    		var domVideo = document.createElement('video');
    		var videoHolder = document.createElement('div');
    		dom.addClass(videoHolder, 'videoHolder');
    		videoHolder.appendChild(domVideo);
    		_this.player = new Player({ video: domVideo });
    		_this.body.appendChild(videoHolder);
    		var paused = false;
    		_this.on('hide', function () {
    			paused = _this.player.paused();
    			_this.player.pause();
    		});
    		_this.on('show', function () {
    			if (!paused) {
    				_this.player.play();
    			}
    		});
    		_this.on('ended', function () {
    			// this.hide();
    		});
    		_this.player.on('ended', function () {
    			_this.triggerEvent('ended');
    		});
    		_this.player.on('loadedmetadata', function () {
    			var headerHeight = 0;
    			var h = 0;
    			var y = 0;
    			var x = 0;
    			var w = 0;
    			var sc = _this.player.scale();
    			sc = 1;
    			if (sc >= 1) {
    				h = 80 * (player.videoWidth() / sc) / player.videoHeight();
    			} else {
    				h = 80 * (player.videoWidth() * sc) / player.videoHeight();
    			}
    			headerHeight = 8 * 80 / h;
    			y = Math.round((100 - h + headerHeight / 2) / 2);
    			_this.updateSizePos({ x: '10%', y: y + '%', width: '80%', height: h + '%' });
    			// }else{
    			// 	w = 80*(player.videoHeight()*sc)/player.videoWidth();
    			// 	x = Math.round((100 - w)/2);
    			// 	headerHeight =  8*w/80;
    			// 	y = Math.round((10 + headerHeight/4));
    			// 	this.updateSizePos({x: x+'%', y: y+'%', width: w+'%', height: '80%'});
    			// }
    			_this._title.parentNode.style.height = headerHeight + '%';
    			_this._title.parentNode.style.top = -headerHeight + '%';
    		});
    		_this.load(opts.url);
    		return _this;
    	}

    	videoContainer.prototype.load = function load(url) {
    		this.player.load(url);
    	};

    	return videoContainer;
    }(containerExtended);

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

    			var settings = deepmerge(defaults$2, opts);
    			var kmlContainer = dom.createElement('div');
    			ctx.addClass(kmlContainer, 'kmlContainer hidden');
    			var kmlOverlay = dom.createElement('div');
    			ctx.addClass(kmlOverlay, 'overlay triggerClose');
    			var kmlContainerBody = dom.createElement('div');
    			if (el) {
    				if (!el.nodeType) {
    					el = kmlContainerBody;
    				}
    			} else {
    				el = kmlContainerBody;
    			}
    			dom.addClass(el, 'body');
    			kmlContainer.appendChild(kmlOverlay);
    			kmlContainer.appendChild(el);
    			var container = null;
    			switch (type) {
    				case 'video':
    					container = new videoContainer(kmlContainer, settings, this, ctx);
    					break;
    				default:
    					container = new Container(kmlContainer, settings, this, ctx);
    					break;
    			}

    			this._els.push(container);
    			this.wrapper.appendChild(kmlContainer);
    			return container;
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
    		var inIframe$$ = inIframe();

    		var _this = possibleConstructorReturn(this, _Media.call(this, el, inIframe$$));

    		if (el == null) return possibleConstructorReturn(_this);
    		_this._bounds = {};
    		_this.device = device;
    		_this.__settings = deepmerge(defaults, settings);
    		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
    		_this.wrapper = dom.wrap(_this.media, dom.createElement('div', {
    			class: 'kmlPlayer'
    		}));
    		dom.triggerWebkitHardwareAcceleration(_this.wrapper);
    		if (inIframe$$) {
    			dom.addClass(_this.wrapper, "inFrame");
    		}
    		//initSettings
    		for (var k in _this.__settings) {
    			if (_this[k]) {
    				if (k === 'autoplay' && _this.__settings[k] && !inIframe$$) {
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

    		_this.videoContainer = function (vs) {
    			return this.containers.add(vs, null, 'video');
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
    				_this.emit('videoResize');
    			}
    			app.bind(_this)();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy9wb2x5ZmlsbHMvcmVxdWVzdEFuaW1hdGlvbkZyYW1lLmpzIiwiLi4vc3JjL2hlbHBlcnMvaW5GcmFtZS5qcyIsIi4uL3NyYy9oZWxwZXJzL2RlZXBtZXJnZS5qcyIsIi4uL3NyYy9oZWxwZXJzL3V0aWxzLmpzIiwiLi4vc3JjL2hlbHBlcnMvZG9tLmpzIiwiLi4vc3JjL2hlbHBlcnMvZGV2aWNlLmpzIiwiLi4vc3JjL2NvcmUvYXV0b0ZvbnQuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvYWRhcHRpdmVTaXplUG9zLmpzIiwiLi4vc3JjL2NvcmUvY29udGFpbmVyL3JlbGF0aXZlU2l6ZVBvcy5qcyIsIi4uL3NyYy9jb3JlL2NvbnRhaW5lci9jb250YWluZXIuanMiLCIuLi9zcmMvaGVscGVycy9jb250YWluZXJCb3VuZHMuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvY29udGFpbmVyRXh0ZW5kZWQuanMiLCIuLi9zcmMvaGVscGVycy9lcnJvci5qcyIsIi4uL3NyYy9jb3JlL21lZGlhL2V2ZW50cy9pbmRleC5qcyIsIi4uL3NyYy9oZWxwZXJzL3Njcm9sbFBvc2l0aW9uLmpzIiwiLi4vc3JjL2NvcmUvZnVsbHNjcmVlbi5qcyIsIi4uL3NyYy9oZWxwZXJzL2NhbmNlbFZpZGVvTmV0d29ya1JlcXVlc3QuanMiLCIuLi9zcmMvaGVscGVycy9taW1lVHlwZS5qcyIsIi4uL3NyYy9jb3JlL21lZGlhL2luZGV4LmpzIiwiLi4vc3JjL2hlbHBlcnMvcGFnZVZpc2liaWxpdHkuanMiLCIuLi9zcmMvY29yZS9tZWRpYS9ldmVudHMvZXh0ZXJuYWxDb250cm9scy5qcyIsIi4uL3NyYy9oZWxwZXJzL2FqYXguanMiLCIuLi9zcmMvY29yZS9pbmRleC5qcyIsIi4uL3NyYy9jb3JlL2NvbnRhaW5lci92aWRlb0NvbnRhaW5lci5qcyIsIi4uL3NyYy9jb3JlL2NvbnRhaW5lci9jb250YWluZXJzLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgICBmb3IodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cbiBcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgL2lQKGFkfGhvbmV8b2QpLipPUyA2Ly50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSlcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7IH0sIFxuICAgICAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9O1xuIFxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgICAgfTtcbn0oKSk7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5JZnJhbWUoKSB7XG5cdHRyeSB7XG5cdFx0bGV0IGlzID0gKHdpbmRvdy5zZWxmICE9PSB3aW5kb3cudG9wKTtcblx0XHRpZiAoaXMpIHtcblx0XHRcdHZhciBhcnJGcmFtZXMgPSBwYXJlbnQuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJJRlJBTUVcIik7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyckZyYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRsZXQgZnJhbWUgPSBhcnJGcmFtZXNbaV07XG5cdFx0XHRcdGlmIChmcmFtZS5jb250ZW50V2luZG93ID09PSB3aW5kb3cpIHtcblx0XHRcdFx0XHRpcyA9IGZyYW1lO1xuXHRcdFx0XHRcdGZyYW1lLnNldEF0dHJpYnV0ZSgnYWxsb3dmdWxsc2NyZWVuJywgJ3RydWUnKTtcblx0XHRcdFx0XHRmcmFtZS5zZXRBdHRyaWJ1dGUoJ21vemFsbG93ZnVsbHNjcmVlbicsICd0cnVlJyk7XG5cdFx0XHRcdFx0ZnJhbWUuc2V0QXR0cmlidXRlKCd3ZWJraXRhbGxvd2Z1bGxzY3JlZW4nLCAndHJ1ZScpO1xuXHRcdFx0XHRcdGZyYW1lLnNldEF0dHJpYnV0ZSgnZnJhbWVib3JkZXInLCAnMCcpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gaXM7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpe1xuXHRsZXQgZGVlcG1lcmdlID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpIHtcblx0XHRpZihzcmMpe1xuXHRcdCAgICB2YXIgYXJyYXkgPSBBcnJheS5pc0FycmF5KHNyYyk7XG5cdFx0ICAgIHZhciBkc3QgPSBhcnJheSAmJiBbXSB8fCB7fTtcblxuXHRcdCAgICBpZiAoYXJyYXkpIHtcblx0XHQgICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBbXTtcblx0XHQgICAgICAgIGRzdCA9IGRzdC5jb25jYXQodGFyZ2V0KTtcblx0XHQgICAgICAgIHNyYy5mb3JFYWNoKGZ1bmN0aW9uKGUsIGkpIHtcblx0XHQgICAgICAgICAgICBpZiAodHlwZW9mIGRzdFtpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2ldID0gZTtcblx0XHQgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgICAgICBkc3RbaV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2ldLCBlKTtcblx0XHQgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmluZGV4T2YoZSkgPT09IC0xKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3QucHVzaChlKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgICAgICAgIE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gdGFyZ2V0W2tleV07XG5cdFx0ICAgICAgICAgICAgfSlcblx0XHQgICAgICAgIH1cblx0XHQgICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBzcmNba2V5XSAhPT0gJ29iamVjdCcgfHwgIXNyY1trZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG5cdFx0ICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFtrZXldKSB7XG5cdFx0ICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBkZWVwbWVyZ2UodGFyZ2V0W2tleV0sIHNyY1trZXldKTtcblx0XHQgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICB9XG5cdFx0ICAgIHJldHVybiBkc3Q7XG5cdCAgICB9ZWxzZXtcblx0ICAgIFx0cmV0dXJuIHRhcmdldCB8fMKgW107XG5cdCAgICB9XG5cdH1cblx0cmV0dXJuIGRlZXBtZXJnZTtcbn0pKCk7IiwiZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJpbShzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZW50RnJvbVN0cmluZyh2KXtcblx0IGlmKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdGxldCB0ID0gZmFsc2U7XG5cdGlmKHYuaW5kZXhPZil7XG5cdFx0aWYodi5pbmRleE9mKCclJykgPiAtMSlcblx0XHR7XG5cdFx0ICB0ID0gcGFyc2VGbG9hdCh2KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmbiwgZGVsYXkpIHtcblx0dmFyIHRcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFyVGltZW91dCh0KVxuXHRcdHQgPSBzZXRUaW1lb3V0KGZuLCBkZWxheSlcblx0fVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcmNlbnRhZ2UoY3VycmVudCwgbWF4KSB7XG5cdGlmIChjdXJyZW50ID09PSAwIHx8IG1heCA9PT0gMCB8fCBpc05hTihjdXJyZW50KSB8fCBpc05hTihtYXgpKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0cmV0dXJuICgoY3VycmVudCAvIG1heCkgKiAxMDApLnRvRml4ZWQoMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kQmluYXJ5ZnVuY3Rpb24oKSB7XG5cdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvU2Vjb25kcyh0KSB7XG5cdHZhciBzID0gMC4wO1xuXHRpZiAodCkge1xuXHRcdHZhciBwID0gdC5zcGxpdCgnOicpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKylcblx0XHRcdHMgPSBzICogNjAgKyBwYXJzZUZsb2F0KHBbaV0ucmVwbGFjZSgnLCcsICcuJykpXG5cdH1cblx0cmV0dXJuIHM7XG59XG5cbi8qKlxuICogRmFzdGVyIFN0cmluZyBzdGFydHNXaXRoIGFsdGVybmF0aXZlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHNyYyAtIHNvdXJjZSBzdHJpbmdcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc3RyIC0gdGVzdCBzdHJpbmdcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc3JjLCBzdHIpIHtcbiAgcmV0dXJuIHNyYy5zbGljZSgwLCBzdHIubGVuZ3RoKSA9PT0gc3RyXG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBzdHJpbmdcbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHYpIHtcbiAgcmV0dXJuICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpO1xufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgbnVtZXJpY1xuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljKHYpe1xuICByZXR1cm4gIWlzTmFOKHYpO1xufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgc3RyaWN0IG51bWVyaWNcbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaWN0TnVtZXJpYyh2KXtcbiAgcmV0dXJuIChpc05hTih2KSAmJiB0eXBlb2YgdiA9PT0gJ251bWJlcicpXG59XG5cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIGJvb2xlYW5cbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQm9vbGVhbih2KXtcbiAgcmV0dXJuICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIGZ1bmN0aW9uXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nIHx8IGZhbHNlICAgLy8gYXZvaWQgSUUgcHJvYmxlbXNcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhbiBvYmplY3QsIGV4Y2x1ZGUgbnVsbC5cbiAqIE5PVEU6IFVzZSBpc09iamVjdCh4KSAmJiAhaXNBcnJheSh4KSB0byBleGNsdWRlcyBhcnJheXMuXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2KSB7XG4gIHJldHVybiB2ICYmIHR5cGVvZiB2ID09PSAnb2JqZWN0JyAgICAgICAgIC8vIHR5cGVvZiBudWxsIGlzICdvYmplY3QnXG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBvYmplY3QgaXMgYSBraW5kIG9mIGFycmF5XG4gKiBAcGFyYW0gICB7ICogfSBhIC0gYW55dGhpbmdcbiAqIEByZXR1cm5zIHtCb29sZWFufSBpcyAnYScgYW4gYXJyYXk/XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KGEpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgfHwgYSBpbnN0YW5jZW9mIEFycmF5IH1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIGFycmF5IGNvbnRhaW5zIGFuIGl0ZW1cbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSBhcnIgLSB0YXJnZXQgYXJyYXlcbiAqIEBwYXJhbSAgIHsgKiB9IGl0ZW0gLSBpdGVtIHRvIHRlc3RcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IERvZXMgJ2FycicgY29udGFpbiAnaXRlbSc/XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb250YWlucyhhcnIsIGl0ZW0pIHtcbiAgcmV0dXJuIGFyci5pbmRleE9mKGl0ZW0pID4gLTE7XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIHNldCBhbiBpbW11dGFibGUgcHJvcGVydHlcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZWwgLSBvYmplY3Qgd2hlcmUgdGhlIG5ldyBwcm9wZXJ0eSB3aWxsIGJlIHNldFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBrZXkgLSBvYmplY3Qga2V5IHdoZXJlIHRoZSBuZXcgcHJvcGVydHkgd2lsbCBiZSBzdG9yZWRcbiAqIEBwYXJhbSAgIHsgKiB9IHZhbHVlIC0gdmFsdWUgb2YgdGhlIG5ldyBwcm9wZXJ0eVxuKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdGlvbnMgLSBzZXQgdGhlIHByb3Blcnkgb3ZlcnJpZGluZyB0aGUgZGVmYXVsdCBvcHRpb25zXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IC0gdGhlIGluaXRpYWwgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShlbCwga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsIGtleSwgZXh0ZW5kKHtcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LCBvcHRpb25zKSlcbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogRGV0ZWN0IHdoZXRoZXIgYSBwcm9wZXJ0eSBvZiBhbiBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxuICogQHBhcmFtICAgeyBPYmplY3QgfSAgb2JqIC0gc291cmNlIG9iamVjdFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAga2V5IC0gb2JqZWN0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSBpcyB0aGlzIHByb3BlcnR5IHdyaXRhYmxlP1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXcml0YWJsZShvYmosIGtleSkge1xuICB2YXIgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KVxuICByZXR1cm4gdHlwZW9mIG9ialtrZXldID09PSBUX1VOREVGIHx8IHByb3BzICYmIHByb3BzLndyaXRhYmxlXG59XG5cbi8qKlxuICogRXh0ZW5kIGFueSBvYmplY3Qgd2l0aCBvdGhlciBwcm9wZXJ0aWVzXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHNyYyAtIHNvdXJjZSBvYmplY3RcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gdGhlIHJlc3VsdGluZyBleHRlbmRlZCBvYmplY3RcbiAqXG4gKiB2YXIgb2JqID0geyBmb286ICdiYXonIH1cbiAqIGV4dGVuZChvYmosIHtiYXI6ICdiYXInLCBmb286ICdiYXInfSlcbiAqIGNvbnNvbGUubG9nKG9iaikgPT4ge2JhcjogJ2JhcicsIGZvbzogJ2Jhcid9XG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHNyYykge1xuICB2YXIgb2JqLCBhcmdzID0gYXJndW1lbnRzXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgIGlmIChvYmogPSBhcmdzW2ldKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgcHJvcGVydHkgb2YgdGhlIHNvdXJjZSBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxuICAgICAgICBpZiAoaXNXcml0YWJsZShzcmMsIGtleSkpXG4gICAgICAgICAgc3JjW2tleV0gPSBvYmpba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3JjXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZUZvbnQoZiwgd2lkdGgsIGVsKSB7XG5cdHZhciByID0gZmFsc2UsIGwgPSBmYWxzZTtcblx0aWYoZi51bml0cyAhPSAncHgnKSBmLnVuaXRzID0gJ2VtJztcblx0aWYgKGYubWluICE9PSBmYWxzZSAmJiBmLnJhdGlvICE9PSBmYWxzZSkge1xuXHRcdHIgPSBmLnJhdGlvICogd2lkdGggLyAxMDAwO1xuXHRcdGlmIChyIDwgZi5taW4pIHIgPSBmLm1pbjtcblx0XHRpZiAoZi51bml0cyA9PSAncHgnKSByID0gTWF0aC5jZWlsKHIpO1xuXHRcdGlmICghaXNOYU4oZi5saW5lSGVpZ2h0KSAmJiBmLmxpbmVIZWlnaHQpIHtcblx0XHRcdGwgPSByICogZi5saW5lSGVpZ2h0O1xuXHRcdFx0aWYgKGwgPCAxKSBsID0gMTtcblx0XHRcdGwgPSArbC50b0ZpeGVkKDMpICsgZi51bml0cztcblx0XHR9XG5cdFx0ciA9ICtyLnRvRml4ZWQoMykgKyBmLnVuaXRzO1xuXHR9XG5cdGlmKGVsKXtcblx0XHRpZihyKSBlbC5zdHlsZS5mb250U2l6ZSA9IHI7XG5cdFx0aWYobCkgZWwuc3R5bGUubGluZUhlaWdodCA9IGw7XG5cdH1cblx0cmV0dXJuIHtmb250U2l6ZTogciwgbGluZUhlaWdodDogbH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7fTsiLCIvKipcbiAqIEBtb2R1bGUgZG9tXG4gKiBNb2R1bGUgZm9yIGVhc2luZyB0aGUgbWFuaXB1bGF0aW9uIG9mIGRvbSBlbGVtZW50c1xuICovXG5cbmxldCBjbGFzc1JlZyA9IGZ1bmN0aW9uKGMpIHtcblx0cmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxccyspXCIgKyBjICsgXCIoXFxcXHMrfCQpXCIpO1xufTtcblxubGV0IGhhc0NsYXNzXG5sZXQgYWRkQ2xhc3NcbmxldCByZW1vdmVDbGFzcztcbmxldCB0b2dnbGVDbGFzcztcblxuaWYgKCdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuXHRoYXNDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRyZXR1cm4gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoYyk7XG5cdH07XG5cdGFkZENsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGlmKGMgIT0gbnVsbCl7XG5cdFx0XHRjID0gYy5zcGxpdCgnICcpO1xuXHRcdFx0Zm9yICh2YXIgayBpbiBjKSBlbGVtLmNsYXNzTGlzdC5hZGQoY1trXSk7XG5cdFx0fVxuXHR9O1xuXHRyZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRlbGVtLmNsYXNzTGlzdC5yZW1vdmUoYyk7XG5cdH07XG59IGVsc2Uge1xuXHRoYXNDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRyZXR1cm4gY2xhc3NSZWcoYykudGVzdChlbGVtLmNsYXNzTmFtZSk7XG5cdH07XG5cdGFkZENsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGlmICghaGFzQ2xhc3MoZWxlbSwgYykpIHtcblx0XHRcdGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUgKyAnICcgKyBjO1xuXHRcdH1cblx0fTtcblx0cmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0ZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzUmVnKGMpLCAnICcpO1xuXHR9O1xufVxuXG50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0dmFyIGZuID0gaGFzQ2xhc3MoZWxlbSwgYykgPyByZW1vdmVDbGFzcyA6IGFkZENsYXNzO1xuXHRmbihlbGVtLCBjKTtcbn07XG5cbmxldCBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUgPSBmdW5jdGlvbiBnZXRQcmVmaXhlZFN0eWxlUHJvcE5hbWUocHJvcE5hbWUpIHtcblx0dmFyIGRvbVByZWZpeGVzID0gJ1dlYmtpdCBNb3ogbXMgTycuc3BsaXQoJyAnKSxcblx0XHRlbFN0eWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlO1xuXHRpZiAoZWxTdHlsZVtwcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHByb3BOYW1lOyAvLyBJcyBzdXBwb3J0ZWQgdW5wcmVmaXhlZFxuXHRwcm9wTmFtZSA9IHByb3BOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcE5hbWUuc3Vic3RyKDEpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRvbVByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKGVsU3R5bGVbZG9tUHJlZml4ZXNbaV0gKyBwcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIGRvbVByZWZpeGVzW2ldICsgcHJvcE5hbWU7IC8vIElzIHN1cHBvcnRlZCB3aXRoIHByZWZpeFxuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRzdHlsZVByZWZpeDoge1xuXHRcdHRyYW5zZm9ybTogZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKCd0cmFuc2Zvcm0nKSxcblx0XHRwZXJzcGVjdGl2ZTogZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKCdwZXJzcGVjdGl2ZScpLFxuXHRcdGJhY2tmYWNlVmlzaWJpbGl0eTogZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKCdiYWNrZmFjZVZpc2liaWxpdHknKVxuXHR9LFxuXHR0cmlnZ2VyV2Via2l0SGFyZHdhcmVBY2NlbGVyYXRpb246IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRpZiAodGhpcy5zdHlsZVByZWZpeC5iYWNrZmFjZVZpc2liaWxpdHkgJiYgdGhpcy5zdHlsZVByZWZpeC5wZXJzcGVjdGl2ZSkge1xuXHRcdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LnBlcnNwZWN0aXZlXSA9ICcxMDAwcHgnO1xuXHRcdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LmJhY2tmYWNlVmlzaWJpbGl0eV0gPSAnaGlkZGVuJztcblx0XHR9XG5cdH0sXG5cdHRyYW5zZm9ybTogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWUpIHtcblx0XHRlbGVtZW50LnN0eWxlW3RoaXMuc3R5bGVQcmVmaXgudHJhbnNmb3JtXSA9IHZhbHVlO1xuXHR9LFxuXHQvKipcblx0ICogU2hvcnRlciBhbmQgZmFzdCB3YXkgdG8gc2VsZWN0IG11bHRpcGxlIG5vZGVzIGluIHRoZSBET01cblx0ICogQHBhcmFtICAgeyBTdHJpbmcgfSBzZWxlY3RvciAtIERPTSBzZWxlY3RvclxuXHQgKiBAcGFyYW0gICB7IE9iamVjdCB9IGN0eCAtIERPTSBub2RlIHdoZXJlIHRoZSB0YXJnZXRzIG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXG5cdCAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZG9tIG5vZGVzIGZvdW5kXG5cdCAqL1xuXHRzZWxlY3RBbGw6IGZ1bmN0aW9uKHNlbGVjdG9yLCBjdHgpIHtcblx0XHRyZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcilcblx0fSxcblx0LyoqXG5cdCAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBhIHNpbmdsZSBub2RlIGluIHRoZSBET01cblx0ICogQHBhcmFtICAgeyBTdHJpbmcgfSBzZWxlY3RvciAtIHVuaXF1ZSBkb20gc2VsZWN0b3Jcblx0ICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0IG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXG5cdCAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZG9tIG5vZGUgZm91bmRcblx0ICovXG5cdHNlbGVjdDogZnVuY3Rpb24oc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuXHR9LFxuXHRoYXNDbGFzczogaGFzQ2xhc3MsXG5cdGFkZENsYXNzOiBhZGRDbGFzcyxcblx0cmVtb3ZlQ2xhc3M6IHJlbW92ZUNsYXNzLFxuXHR0b2dnbGVDbGFzczogdG9nZ2xlQ2xhc3MsXG5cdGF1dG9MaW5lSGVpZ2h0OiBmdW5jdGlvbihlbCkge1xuXHRcdGxldCBsID0gZWwub2Zmc2V0SGVpZ2h0ICsgXCJweFwiO1xuXHRcdGVsLnN0eWxlLmxpbmVIZWlnaHQgPSBsO1xuXHRcdHJldHVybiBsO1xuXHR9LFxuXHRjcmVhdGVFbGVtZW50OiBmdW5jdGlvbihlbG0sIHByb3BzKSB7XG5cdFx0bGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbG0pO1xuXHRcdGZvciAobGV0IGsgaW4gcHJvcHMpIHtcblx0XHRcdGVsLnNldEF0dHJpYnV0ZShrLCBwcm9wc1trXSk7XG5cdFx0fVxuXHRcdHJldHVybiBlbDtcblx0fSxcblx0ZW1wdHlFbGVtZW50OiBmdW5jdGlvbihlbG0pIHtcblx0XHR3aGlsZSAoZWxtLmZpcnN0Q2hpbGQpIHtcblx0XHRcdGVsbS5yZW1vdmVDaGlsZChlbG0uZmlyc3RDaGlsZCk7XG5cdFx0fVxuXHR9LFxuXHRyZXBsYWNlRWxlbWVudDogZnVuY3Rpb24odGFyZ2V0LCBlbG0pIHtcblx0XHR0YXJnZXQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoZWxtLCB0YXJnZXQpO1xuXHR9LFxuXHRyZW1vdmVFbGVtZW50OiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0ZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuXHR9LFxuXHRpbnNlcnRBZnRlcjogZnVuY3Rpb24oZWwsIHJlZmVyZW5jZU5vZGUpIHtcblx0XHRyZWZlcmVuY2VOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VOb2RlLm5leHRTaWJsaW5nKTtcblx0fSxcblx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihlbCwgcmVmZXJlbmNlTm9kZSkge1xuXHRcdHJlZmVyZW5jZU5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHJlZmVyZW5jZU5vZGUpO1xuXHR9LFxuXHRnZXRUZXh0Q29udGVudDogZnVuY3Rpb24oZWwpIHtcblx0XHRyZXR1cm4gZWwudGV4dENvbnRlbnQgfHwgZWwuaW5uZXJUZXh0O1xuXHR9LFxuXHR3cmFwOiBmdW5jdGlvbihlbGVtZW50cywgd3JhcHBlcikge1xuXHRcdC8vIENvbnZlcnQgYGVsZW1lbnRzYCB0byBhbiBhcnJheSwgaWYgbmVjZXNzYXJ5LlxuXHRcdGlmICghZWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRlbGVtZW50cyA9IFtlbGVtZW50c107XG5cdFx0fVxuXG5cdFx0Ly8gTG9vcHMgYmFja3dhcmRzIHRvIHByZXZlbnQgaGF2aW5nIHRvIGNsb25lIHRoZSB3cmFwcGVyIG9uIHRoZVxuXHRcdC8vIGZpcnN0IGVsZW1lbnQgKHNlZSBgY2hpbGRgIGJlbG93KS5cblx0XHRmb3IgKHZhciBpID0gZWxlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdHZhciBjaGlsZCA9IChpID4gMCkgPyB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKSA6IHdyYXBwZXI7XG5cdFx0XHR2YXIgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuXG5cdFx0XHQvLyBDYWNoZSB0aGUgY3VycmVudCBwYXJlbnQgYW5kIHNpYmxpbmcuXG5cdFx0XHR2YXIgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdFx0dmFyIHNpYmxpbmcgPSBlbGVtZW50Lm5leHRTaWJsaW5nO1xuXG5cdFx0XHQvLyBXcmFwIHRoZSBlbGVtZW50IChpcyBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgZnJvbSBpdHMgY3VycmVudFxuXHRcdFx0Ly8gcGFyZW50KS5cblx0XHRcdGNoaWxkLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuXG5cdFx0XHQvLyBJZiB0aGUgZWxlbWVudCBoYWQgYSBzaWJsaW5nLCBpbnNlcnQgdGhlIHdyYXBwZXIgYmVmb3JlXG5cdFx0XHQvLyB0aGUgc2libGluZyB0byBtYWludGFpbiB0aGUgSFRNTCBzdHJ1Y3R1cmU7IG90aGVyd2lzZSwganVzdFxuXHRcdFx0Ly8gYXBwZW5kIGl0IHRvIHRoZSBwYXJlbnQuXG5cdFx0XHRpZiAoc2libGluZykge1xuXHRcdFx0XHRwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBzaWJsaW5nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjaGlsZDtcblx0XHR9XG5cdH1cbn0iLCJsZXQgYnJvd3NlciA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgblZlciA9IG5hdmlnYXRvci5hcHBWZXJzaW9uLFxuICAgICAgbkFndCA9IG5hdmlnYXRvci51c2VyQWdlbnQsXG4gICAgICBicm93c2VyTmFtZSA9IG5hdmlnYXRvci5hcHBOYW1lLFxuICAgICAgZnVsbFZlcnNpb24gPSAnJyArIHBhcnNlRmxvYXQobmF2aWdhdG9yLmFwcFZlcnNpb24pLFxuICAgICAgbWFqb3JWZXJzaW9uID0gcGFyc2VJbnQobmF2aWdhdG9yLmFwcFZlcnNpb24sIDEwKSxcbiAgICAgIG5hbWVPZmZzZXQsXG4gICAgICB2ZXJPZmZzZXQsXG4gICAgICBpeDtcblxuICAgIC8vIEVER0VcbiAgICBpZiAoYnJvd3Nlck5hbWUgPT0gXCJOZXRzY2FwZVwiICYmIG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiSUVcIjtcbiAgICAgIHZhciBlZGdlID0gbkFndC5pbmRleE9mKCdFZGdlLycpO1xuICAgICAgZnVsbFZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyhlZGdlICsgNSwgbkFndC5pbmRleE9mKCcuJywgZWRnZSkpO1xuICAgIH1cbiAgICAvLyBNU0lFIDExXG4gICAgZWxzZSBpZiAoKG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJXaW5kb3dzIE5UXCIpICE9PSAtMSkgJiYgKG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJydjoxMVwiKSAhPT0gLTEpKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiSUVcIjtcbiAgICAgIGZ1bGxWZXJzaW9uID0gXCIxMTtcIjtcbiAgICB9XG4gICAgLy8gTVNJRVxuICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJNU0lFXCIpKSAhPT0gLTEpIHtcbiAgICAgIGJyb3dzZXJOYW1lID0gXCJJRVwiO1xuICAgICAgZnVsbFZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcbiAgICB9XG4gICAgLy8gQ2hyb21lXG4gICAgZWxzZSBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZihcIkNocm9tZVwiKSkgIT09IC0xKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiQ2hyb21lXCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuICAgIH1cbiAgICAvLyBTYWZhcmlcbiAgICBlbHNlIGlmICgodmVyT2Zmc2V0ID0gbkFndC5pbmRleE9mKFwiU2FmYXJpXCIpKSAhPT0gLTEpIHtcbiAgICAgIGJyb3dzZXJOYW1lID0gXCJTYWZhcmlcIjtcbiAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNyk7XG4gICAgICBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZihcIlZlcnNpb25cIikpICE9PSAtMSkge1xuICAgICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBGaXJlZm94XG4gICAgZWxzZSBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZihcIkZpcmVmb3hcIikpICE9PSAtMSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIkZpcmVmb3hcIjtcbiAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG4gICAgfVxuICAgIC8vIEluIG1vc3Qgb3RoZXIgYnJvd3NlcnMsIFwibmFtZS92ZXJzaW9uXCIgaXMgYXQgdGhlIGVuZCBvZiB1c2VyQWdlbnRcbiAgICBlbHNlIGlmICgobmFtZU9mZnNldCA9IG5BZ3QubGFzdEluZGV4T2YoJyAnKSArIDEpIDwgKHZlck9mZnNldCA9IG5BZ3QubGFzdEluZGV4T2YoJy8nKSkpIHtcbiAgICAgIGJyb3dzZXJOYW1lID0gbkFndC5zdWJzdHJpbmcobmFtZU9mZnNldCwgdmVyT2Zmc2V0KTtcbiAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgMSk7XG4gICAgICBpZiAoYnJvd3Nlck5hbWUudG9Mb3dlckNhc2UoKSA9PSBicm93c2VyTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgIGJyb3dzZXJOYW1lID0gbmF2aWdhdG9yLmFwcE5hbWU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRyaW0gdGhlIGZ1bGxWZXJzaW9uIHN0cmluZyBhdCBzZW1pY29sb24vc3BhY2UgaWYgcHJlc2VudFxuICAgIGlmICgoaXggPSBmdWxsVmVyc2lvbi5pbmRleE9mKFwiO1wiKSkgIT09IC0xKSB7XG4gICAgICBmdWxsVmVyc2lvbiA9IGZ1bGxWZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG4gICAgfVxuICAgIGlmICgoaXggPSBmdWxsVmVyc2lvbi5pbmRleE9mKFwiIFwiKSkgIT09IC0xKSB7XG4gICAgICBmdWxsVmVyc2lvbiA9IGZ1bGxWZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG4gICAgfVxuICAgIC8vIEdldCBtYWpvciB2ZXJzaW9uXG4gICAgbWFqb3JWZXJzaW9uID0gcGFyc2VJbnQoJycgKyBmdWxsVmVyc2lvbiwgMTApO1xuICAgIGlmIChpc05hTihtYWpvclZlcnNpb24pKSB7XG4gICAgICBmdWxsVmVyc2lvbiA9ICcnICsgcGFyc2VGbG9hdChuYXZpZ2F0b3IuYXBwVmVyc2lvbik7XG4gICAgICBtYWpvclZlcnNpb24gPSBwYXJzZUludChuYXZpZ2F0b3IuYXBwVmVyc2lvbiwgMTApO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gZGF0YVxuICAgIHJldHVybiBbYnJvd3Nlck5hbWUsIG1ham9yVmVyc2lvbl07XG4gIH0pKCk7XG5leHBvcnQgZGVmYXVsdCB7XG4gIGJyb3dzZXI6IGJyb3dzZXIsXG4gIGlzSUU6IChmdW5jdGlvbigpIHtcbiAgICBpZiAoYnJvd3NlclswXSA9PT0gJ0lFJykge1xuICAgICAgcmV0dXJuIGJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKSxcbiAgaXNGaXJlZm94OiAoZnVuY3Rpb24oKXtcbiAgICBpZiAoYnJvd3NlclswXSA9PT0gJ0ZpcmVmb3gnKSB7XG4gICAgICByZXR1cm4gYnJvd3NlclsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KSgpLFxuICBpc0Nocm9tZTogKGZ1bmN0aW9uKCl7XG4gICAgaWYgKGJyb3dzZXJbMF0gPT09ICdDaHJvbWUnKSB7XG4gICAgICByZXR1cm4gYnJvd3NlclsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KSgpLFxuICBpc1NhZmFyaTogKGZ1bmN0aW9uKCl7XG4gICAgaWYgKGJyb3dzZXJbMF0gPT09ICdTYWZhcmknKSB7XG4gICAgICByZXR1cm4gYnJvd3NlclsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KSgpLFxuICBpc1RvdWNoOiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gIGlzSW9zOiAvKGlQYWR8aVBob25lfGlQb2QpL2cudGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pXG59IiwiaW1wb3J0IHtzY2FsZUZvbnR9IGZyb20gJy4uL2hlbHBlcnMvdXRpbHMnO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5sZXQgYXV0b0ZvbnQgPSBmdW5jdGlvbihlbCwgZm9udCwgcGFyZW50KSB7XG5cdGxldCBfZW5hYmxlZCA9IGZhbHNlO1xuXHRsZXQgX3VwZGF0ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0c2NhbGVGb250KGZvbnQsIHBhcmVudC53aWR0aCgpLCBlbCk7XG5cdH1cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbih2KSB7XG5cdFx0aWYodiAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdGlmKCFmb250KXsgZm9udCA9IHtyYXRpbzogMSwgbWluOjEsIGxpbmVIZWlnaHQ6IGZhbHNlfSB9XG5cdFx0XHRmb250ID0gZGVlcG1lcmdlKGZvbnQsIHYpO1xuXHRcdFx0cmV0dXJuIHNjYWxlRm9udChmb250LCBwYXJlbnQud2lkdGgoKSwgZWwpO1xuXHRcdH1cblx0fTtcblx0dGhpcy5lbmFibGVkID0gIGZ1bmN0aW9uKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJyAmJiBmb250KSB7XG5cdFx0XHRfZW5hYmxlZCA9IHY7XG5cdFx0XHQvLyB2ID8gKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSksIHNjYWxlRm9udChmb250LCBfd2lkdGgoKSwgZWwpKSA6IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdXBkYXRlLCBmYWxzZSk7XG5cdFx0fVxuXHRcdHJldHVybiBfZW5hYmxlZDs7XG5cdH07XG5cdGlmKHBhcmVudC5vbil7XG5cdFx0cGFyZW50Lm9uKCdyZXNpemUnLCBfdXBkYXRlKTtcblx0fTtcbn1cbmV4cG9ydCBkZWZhdWx0IGF1dG9Gb250OyIsImltcG9ydCB7XG5cdHByb2NlbnRGcm9tU3RyaW5nLFxuXHRkZWJvdW5jZVxufSBmcm9tICcuLi8uLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkb20gZnJvbSAnLi4vLi4vaGVscGVycy9kb20nO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi8uLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5cbmxldCBkZWZhdWx0cyA9IHtcblx0eDogMCxcblx0eTogMCxcblx0d2lkdGg6ICcxMDAlJyxcblx0aGVpZ2h0OiAnMTAwJScsXG5cdGZvbnRTaXplOiBudWxsLFxuXHRsaW5lSGVpZ2h0OiBudWxsLFxuXHRvZmZzZXRYOiAwLFxuXHRvZmZzZXRZOiAwLFxuXHRvcmlnaW5Qb2ludDogXCJ0b3BMZWZ0XCIsXG5cdHZpc2libGU6IGZhbHNlLFxuXHR0cmFuc2Zvcm06IHtcblx0XHR4OiBudWxsLFxuXHRcdHk6IG51bGxcblx0fSxcblx0dHJhbnNsYXRlOiB0cnVlXG59XG5cbmxldCBhZGFwdGl2ZVNpemVQb3MgPSBmdW5jdGlvbihzZXR0dGluZ3MsIHBhcmVudCkge1xuXHRsZXQgYm91bmRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG9mZnNldFg6IHBhcmVudC5vZmZzZXRYKCksXG5cdFx0XHRvZmZzZXRZOiBwYXJlbnQub2Zmc2V0WSgpLFxuXHRcdFx0d2lkdGg6IHBhcmVudC53aWR0aCgpLFxuXHRcdFx0aGVpZ2h0OiBwYXJlbnQuaGVpZ2h0KCksXG5cdFx0XHRzY2FsZTogcGFyZW50LndpZHRoKCkgLyBwYXJlbnQudmlkZW9XaWR0aCgpLFxuXHRcdFx0c2NhbGVZOiBwYXJlbnQud2lkdGgoKSAvIHBhcmVudC52aWRlb0hlaWdodCgpXG5cdFx0fVxuXHR9O1xuXHRsZXQgdmF1bHQgPSB7XG5cdFx0eDogMCxcblx0XHR5OiAwLFxuXHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0aGVpZ2h0OiAnMTAwJScsXG5cdFx0Zm9udFNpemU6IG51bGwsXG5cdFx0bGluZUhlaWdodDogbnVsbFxuXHR9O1xuXHRsZXQgcGFyZW50V2lkdGggPSAwO1xuXHRsZXQgcGFyZW50SGVpZ2h0ID0gMDtcblx0bGV0IHBhcmVudFggPSAwO1xuXHRsZXQgcGFyZW50WSA9IDA7XG5cdGxldCBkb21FbGVtZW50ID0gbnVsbDtcblx0bGV0IHNldHRpbmdzID0gZGVlcG1lcmdlKGRlZmF1bHRzLCBzZXR0dGluZ3MpO1xuXHRsZXQgX2FjdGl2ZSA9IGZhbHNlO1xuXG5cdGxldCB1cGRhdGVEb21FbGVtZW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKF9hY3RpdmUgJiYgZG9tRWxlbWVudCAmJiBkb21FbGVtZW50Lm5vZGVUeXBlKSB7XG5cdFx0XHRpZiAodmF1bHQud2lkdGggIT09IG51bGwpIGRvbUVsZW1lbnQuc3R5bGUud2lkdGggPSB2YXVsdC53aWR0aCArIFwicHhcIjtcblx0XHRcdGlmICh2YXVsdC5oZWlnaHQgIT09IG51bGwpIGRvbUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdmF1bHQuaGVpZ2h0ICsgXCJweFwiO1xuXG5cdFx0XHRpZiAoZG9tLnN0eWxlUHJlZml4LnRyYW5zZm9ybSAmJiBzZXR0aW5ncy50cmFuc2xhdGUpIHtcblx0XHRcdFx0bGV0IHRyYW5zZm9ybSA9ICcnO1xuXHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsICYmIHZhdWx0LnkgIT0gbnVsbCkge1xuXHRcdFx0XHRcdHRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoJyArIHZhdWx0LnggKyAncHgsJyArIHZhdWx0LnkgKyAncHgpJztcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxlZnQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnJpZ2h0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5ib3R0b20gPSBcImF1dG9cIjtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9IFwiYXV0b1wiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5yaWdodCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0dHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHZhdWx0LnggKyAncHgpJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnkgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5ib3R0b20gPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUudG9wID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgnICsgdmF1bHQueSArICdweCknO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRkb20udHJhbnNmb3JtKGRvbUVsZW1lbnQsIHRyYW5zZm9ybSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsICYmIHZhdWx0LnkgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IHZhdWx0LnggKyBcInB4XCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS50b3AgPSB2YXVsdC55ICsgXCJweFwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh2YXVsdC54ICE9IG51bGwpIGRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IHZhdWx0LnggKyBcInB4XCI7XG5cdFx0XHRcdFx0aWYgKHZhdWx0LnkgIT0gbnVsbCkgZG9tRWxlbWVudC5zdHlsZS50b3AgPSB2YXVsdC55ICsgXCJweFwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzZXR0aW5ncy5mb250U2l6ZSAhPT0gdmF1bHQuZm9udFNpemUpIHtcblx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IHZhdWx0LmZvbnRTaXplID0gc2V0dGluZ3MuZm9udFNpemU7XG5cblx0XHRcdH1cblx0XHRcdGlmIChzZXR0aW5ncy5saW5lSGVpZ2h0ICE9PSB2YXVsdC5saW5lSGVpZ2h0KSB7XG5cdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubGluZUhlaWdodCA9IHZhdWx0LmxpbmVIZWlnaHQgPSBzZXR0aW5ncy5saW5lSGVpZ2h0O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGxldCB1cGRhdGVQcm9wcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCBfdyA9IHBhcmVudC53aWR0aCgpO1xuXHRcdGxldCBfaCA9IHBhcmVudC5oZWlnaHQoKTtcblx0XHRsZXQgX3ggPSBwYXJlbnQub2Zmc2V0WCgpO1xuXHRcdGxldCBfeSA9IHBhcmVudC5vZmZzZXRZKCk7XG5cdFx0aWYgKHBhcmVudFdpZHRoICE9IF93IHx8IHBhcmVudEhlaWdodCAhPSBfaCB8fCBfeCAhPSBwYXJlbnRYIHx8IF95ICE9IHBhcmVudFkpIHtcblx0XHRcdHBhcmVudFdpZHRoID0gX3c7XG5cdFx0XHRwYXJlbnRIZWlnaHQgPSBfaDtcblx0XHRcdHBhcmVudFggPSBfeDtcblx0XHRcdHBhcmVudFkgPSBfeTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBiID0gYm91bmRzKCk7XG5cblx0XHRsZXQgcHJvY2VudFdpZHRoID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3Mud2lkdGgpO1xuXHRcdGlmIChwcm9jZW50V2lkdGgpIHtcblx0XHRcdHZhdWx0LndpZHRoID0gYi53aWR0aCAqIHByb2NlbnRXaWR0aCAvIDEwMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHNldHRpbmdzLndpZHRoICE9IG51bGwpIHtcblx0XHRcdFx0dmF1bHQud2lkdGggPSBiLndpZHRoICogYi5zY2FsZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmF1bHQud2lkdGggPSBNYXRoLmNlaWwodmF1bHQud2lkdGgpO1xuXG5cdFx0bGV0IHByb2NlbnRIZWlnaHQgPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy5oZWlnaHQpO1xuXHRcdGlmIChwcm9jZW50SGVpZ2h0KSB7XG5cdFx0XHR2YXVsdC5oZWlnaHQgPSBiLmhlaWdodCAqIHByb2NlbnRIZWlnaHQgLyAxMDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChzZXR0aW5ncy5oZWlnaHQgIT0gbnVsbCkge1xuXHRcdFx0XHR2YXVsdC5oZWlnaHQgPSBiLmhlaWdodCAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhdWx0LmhlaWdodCA9IE1hdGguY2VpbCh2YXVsdC5oZWlnaHQpO1xuXG5cdFx0aWYgKHNldHRpbmdzLnggIT0gbnVsbCkge1xuXHRcdFx0bGV0IHByb2NlbnRYID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MueCk7XG5cdFx0XHRpZiAocHJvY2VudFgpIHtcblx0XHRcdFx0dmF1bHQueCA9IGIub2Zmc2V0WCArIGIud2lkdGggKiBwcm9jZW50WCAvIDEwMDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhdWx0LnggPSBiLm9mZnNldFggKyBzZXR0aW5ncy54ICogYi5zY2FsZTtcblx0XHRcdH1cblx0XHRcdHZhdWx0LnggPSBNYXRoLmZsb29yKHZhdWx0LngpO1xuXHRcdFx0bGV0IHRyYW5zZm9ybVggPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy50cmFuc2Zvcm0ueCk7XG5cdFx0XHRpZiAodHJhbnNmb3JtWCkgdmF1bHQueCArPSB0cmFuc2Zvcm1YICogdmF1bHQud2lkdGggLyAxMDA7XG5cdFx0XHRpZiAoc2V0dGluZ3Mub2Zmc2V0WCkgdmF1bHQueCArPSBzZXR0aW5ncy5vZmZzZXRYO1xuXHRcdH1cblxuXHRcdGlmIChzZXR0aW5ncy55ICE9IG51bGwpIHtcblx0XHRcdGxldCBwcm9jZW50WSA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLnkpO1xuXHRcdFx0aWYgKHByb2NlbnRZKSB7XG5cdFx0XHRcdHZhdWx0LnkgPSBiLm9mZnNldFkgKyBiLmhlaWdodCAqIHByb2NlbnRZIC8gMTAwO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmF1bHQueSA9IGIub2Zmc2V0WSArIHNldHRpbmdzLnkgKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdFx0dmF1bHQueSA9IE1hdGguZmxvb3IodmF1bHQueSk7XG5cdFx0XHRsZXQgdHJhbnNmb3JtWSA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLnRyYW5zZm9ybS55KTtcblx0XHRcdGlmICh0cmFuc2Zvcm1ZKSB2YXVsdC55ICs9IHRyYW5zZm9ybVkgKiB2YXVsdC53aWR0aCAvIDEwMDtcblx0XHRcdGlmIChzZXR0aW5ncy5vZmZzZXRZKSB2YXVsdC55ICs9IHNldHRpbmdzLm9mZnNldFk7XG5cdFx0fVxuXG5cdFx0dXBkYXRlRG9tRWxlbWVudCgpO1xuXHR9XG5cblx0dGhpcy5hcHBseVRvID0gZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdGlmIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUpIHtcblx0XHRcdGRvbUVsZW1lbnQgPSBlbGVtZW50O1xuXHRcdFx0dXBkYXRlUHJvcHMoKTtcblx0XHR9XG5cdFx0cmV0dXJuIGRvbUVsZW1lbnQ7XG5cdH1cblxuXHRsZXQgYXBwbHlOZXdQcm9wcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKF9hY3RpdmUpe1xuXHRcdFx0dXBkYXRlUHJvcHMoKTtcblx0XHR9XG5cdH1cblxuXHR0aGlzLmRhdGEgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdmF1bHQ7XG5cdH1cblxuXHR0aGlzLnNldHRpbmdzID0gZnVuY3Rpb24obmV3U2V0dGluZ3MpIHtcblx0XHRzZXR0aW5ncyA9IGRlZXBtZXJnZShzZXR0aW5ncywgbmV3U2V0dGluZ3MpO1xuXHRcdHVwZGF0ZVByb3BzKCk7XG5cdFx0cmV0dXJuIHNldHRpbmdzO1xuXHR9XG5cdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0X2FjdGl2ZSA9IHY7XG5cdFx0XHRpZiAodikgYXBwbHlOZXdQcm9wcygpO1xuXHRcdFx0Ly8gdiA/IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBhcHBseU5ld1Byb3BzLCBmYWxzZSkgOiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgYXBwbHlOZXdQcm9wcywgZmFsc2UpO1xuXHRcdH1cblx0XHRyZXR1cm4gX2FjdGl2ZTtcblx0fTtcblxuXHRpZiAocGFyZW50Lm9uKSB7XG5cdFx0cGFyZW50Lm9uKCdyZXNpemUnLCBhcHBseU5ld1Byb3BzKTtcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgYWRhcHRpdmVTaXplUG9zOyIsImltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi4vLi4vaGVscGVycy9kZWVwbWVyZ2UnO1xuaW1wb3J0IHtcblx0cHJvY2VudEZyb21TdHJpbmdcbn0gZnJvbSAnLi4vLi4vaGVscGVycy91dGlscyc7XG5sZXQgZGVmYXVsdHMgPSB7XG5cdHg6IDAsXG5cdHk6IDAsXG5cdHdpZHRoOiAwLFxuXHRoZWlnaHQ6IDBcbn1cbmxldCByZWxhdGl2ZVNpemVQb3MgPSBmdW5jdGlvbihjdHgsIHNldHRpbmdzKSB7XG5cdGxldCBwYXJlbnRXaWR0aCA9IGN0eC52aWRlb1dpZHRoKCkgfHwgY3R4LndpZHRoIHx8IDA7XG5cdGxldCBwYXJlbnRIZWlnaHQgPSBjdHgudmlkZW9IZWlnaHQoKSB8fCBjdHguaGVpZ2h0IHx8IDA7XG5cdGxldCBvID0gZGVlcG1lcmdlKGRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cdGxldCBfdyA9IHByb2NlbnRGcm9tU3RyaW5nKG8ud2lkdGgpO1xuXHRpZiAoIV93KSBfdyA9IG8ud2lkdGggLyBwYXJlbnRXaWR0aCAqIDEwMDtcblx0bGV0IF9oID0gcHJvY2VudEZyb21TdHJpbmcoby5oZWlnaHQpO1xuXHRpZiAoIV9oKSBfaCA9IG8uaGVpZ2h0IC8gcGFyZW50SGVpZ2h0ICogMTAwO1xuXHRsZXQgX3ggPSBwcm9jZW50RnJvbVN0cmluZyhvLngpO1xuXHRpZiAoIV94KSBfeCA9IG8ueCAvIHBhcmVudFdpZHRoICogMTAwO1xuXHRsZXQgX3kgPSBwcm9jZW50RnJvbVN0cmluZyhvLnkpO1xuXHRpZiAoIV95KSBfeSA9IG8ueSAvIHBhcmVudEhlaWdodCAqIDEwMDtcblx0cmV0dXJuIHtcblx0XHR4OiBfeCxcblx0XHR5OiBfeSxcblx0XHR3aWR0aDogX3csXG5cdFx0aGVpZ2h0OiBfaCBcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgcmVsYXRpdmVTaXplUG9zOyIsImltcG9ydCBkb20gZnJvbSAnLi4vLi4vaGVscGVycy9kb20nO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi8uLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQgcmVsYXRpdmVTaXplUG9zIGZyb20gJy4vcmVsYXRpdmVTaXplUG9zJztcbmltcG9ydCB7XG5cdGlzRnVuY3Rpb25cbn0gZnJvbSAnLi4vLi4vaGVscGVycy91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRhaW5lciB7XG5cdGNvbnN0cnVjdG9yKGVsLCBvcHRzLCBjdHgsIHBsYXllcikge1xuXHRcdGxldCBwbGF5ZXJQYXVzZWQgPSBmYWxzZTtcblx0XHRsZXQgaXNWaXNpYmxlID0gZmFsc2U7XG5cdFx0bGV0IGV4dGVybmFsQ29udHJvbHMgPSBmYWxzZTtcblx0XHRsZXQgYm9keSA9IGRvbS5zZWxlY3QoJy5ib2R5JywgZWwpO1xuXHRcdHRoaXMuYm9keSA9IGJvZHk7XG5cdFx0bGV0IGVsRGltZW5zaW9uID0gZnVuY3Rpb24oZm9wdHMpIHtcblx0XHRcdGlmKGZvcHRzKSBvcHRzID0gZGVlcG1lcmdlKG9wdHMsIGZvcHRzKTtcblx0XHRcdGxldCBkID0gbmV3IHJlbGF0aXZlU2l6ZVBvcyhwbGF5ZXIsIG9wdHMpO1xuXHRcdFx0Ym9keS5zdHlsZS53aWR0aCA9IGQud2lkdGggKyBcIiVcIjtcblx0XHRcdGJvZHkuc3R5bGUuaGVpZ2h0ID0gZC5oZWlnaHQgKyBcIiVcIjtcblx0XHRcdGlmIChkb20uc3R5bGVQcmVmaXgudHJhbnNmb3JtKSB7XG5cdFx0XHRcdGRvbS50cmFuc2Zvcm0oYm9keSwgJ3RyYW5zbGF0ZSgnICsgMTAwIC8gZC53aWR0aCAqIGQueCArICclLCcgKyAxMDAgLyBkLmhlaWdodCAqIGQueSArICclKScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ym9keS5zdHlsZS50b3AgPSBkLnggKyBcIiVcIjtcblx0XHRcdFx0Ym9keS5zdHlsZS5sZWZ0ID0gZC55ICsgXCIlXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsRGltZW5zaW9uKCk7XG5cdFx0cGxheWVyLm9uKCd2aWRlb1Jlc2l6ZScsIGVsRGltZW5zaW9uKTtcblxuXG5cdFx0dGhpcy51cGRhdGVTaXplUG9zID0gZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRlbERpbWVuc2lvbihkYXRhKTtcblx0XHR9XG5cblx0XHRsZXQgZXZlbnRzID0ge307XG5cdFx0dGhpcy5vbiA9IGZ1bmN0aW9uKGV2ZW50LCBmbikge1xuXHRcdFx0aWYgKCFldmVudHNbZXZlbnRdKSBldmVudHNbZXZlbnRdID0gW107XG5cdFx0XHRldmVudHNbZXZlbnRdLnB1c2goZm4pO1xuXHRcdH1cblxuXHRcdHRoaXMudHJpZ2dlckV2ZW50ID0gZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0aWYgKGV2ZW50c1tuYW1lXSkge1xuXHRcdFx0XHRmb3IgKHZhciBrIGluIGV2ZW50c1tuYW1lXSkge1xuXHRcdFx0XHRcdGxldCBmbiA9IGV2ZW50c1tuYW1lXVtrXTtcblx0XHRcdFx0XHRpZiAoaXNGdW5jdGlvbihmbikpIHtcblx0XHRcdFx0XHRcdGZuKCk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuaGlkZSA9ICgpPT57XG5cdFx0XHRpZiAoaXNWaXNpYmxlKSB7XG5cdFx0XHRcdGRvbS5hZGRDbGFzcyhlbCwgJ2hpZGRlbicpO1xuXHRcdFx0XHRpZiAob3B0cy5wYXVzZSkge1xuXHRcdFx0XHRcdGlmICghcGxheWVyUGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIucGxheSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpc1Zpc2libGUgPSBmYWxzZTtcblx0XHRcdFx0XHRpZiAoZXh0ZXJuYWxDb250cm9scyAmJiBvcHRzLmV4dGVybmFsQ29udHJvbHMpIHtcblx0XHRcdFx0XHRcdHBsYXllci5leHRlcm5hbENvbnRyb2xzLmVuYWJsZWQodHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0XHRpZiAoaXNGdW5jdGlvbihvcHRzLm9uSGlkZSkpIG9wdHMub25IaWRlKCk7XG5cdFx0XHRcdFx0Y3R4LmNoZWNrVmlzaWJsZUVsZW1lbnRzKCk7XG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyRXZlbnQoJ2hpZGUnKTtcblx0XHRcdFx0fSwgMjUwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5zaG93ID0gKCk9Pntcblx0XHRcdGlmICghaXNWaXNpYmxlKSB7XG5cdFx0XHRcdGN0eC5lbmFibGVkKHRydWUpO1xuXHRcdFx0XHRlbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3MoZWwsICdoaWRkZW4nKTtcblx0XHRcdFx0XHRpZiAoaXNGdW5jdGlvbihvcHRzLm9uSGlkZSkpIG9wdHMub25TaG93KCk7XG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyRXZlbnQoJ3Nob3cnKTtcblx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRpZiAob3B0cy5wYXVzZSkge1xuXHRcdFx0XHRcdGlmICghcGxheWVyLnBhdXNlZCgpKSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXJQYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHBsYXllci5wYXVzZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXJQYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpc1Zpc2libGUgPSB0cnVlO1xuXHRcdFx0XHRpZiAob3B0cy5leHRlcm5hbENvbnRyb2xzKSB7XG5cdFx0XHRcdFx0aWYgKHBsYXllci5leHRlcm5hbENvbnRyb2xzLmVuYWJsZWQoKSkge1xuXHRcdFx0XHRcdFx0ZXh0ZXJuYWxDb250cm9scyA9IHRydWU7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuZXh0ZXJuYWxDb250cm9scy5lbmFibGVkKGZhbHNlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZXh0ZXJuYWxDb250cm9scyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IG92ZXJsYXkgPSBkb20uc2VsZWN0KCcub3ZlcmxheScsIGVsKTtcblxuXHRcdHRoaXMuYmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24odikge1xuXHRcdFx0aWYgKHYgIT0gbnVsbCkge1xuXHRcdFx0XHRvdmVybGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHY7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdmVybGF5LnN0eWxlLmJhY2tncm91bmRDb2xvclxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuYmFja2dyb3VuZENvbG9yKCk7XG5cblx0XHRsZXQgY2xzRWxlbWVudHMgPSBkb20uc2VsZWN0QWxsKCcudHJpZ2dlckNsb3NlJywgZWwpO1xuXHRcdGZvciAodmFyIGkgPSAwLCBuID0gY2xzRWxlbWVudHMubGVuZ3RoOyBpIDwgbjsgaSArPSAxKSB7XG5cdFx0XHRjbHNFbGVtZW50c1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZSk7XG5cdFx0fVxuXG5cblx0XHRpZiAob3B0cy52aXNpYmxlKSB7XG5cdFx0XHR0aGlzLnNob3coKTtcblx0XHR9XG5cblx0XHR0aGlzLnZpc2libGUgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykgaXNWaXNpYmxlID0gdjtcblx0XHRcdHJldHVybiBpc1Zpc2libGU7XG5cdFx0fVxuXG5cdH1cbn0iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKXtcblx0bGV0IHNjYWxlID0gMDtcblx0bGV0IGJvdW5kcyA9IGZ1bmN0aW9uKGVsLCB1cGRhdGVTY2FsZSkge1xuXHRcdGlmKCB1cGRhdGVTY2FsZSAhPT0gdW5kZWZpbmVkKSBzY2FsZSA9IHVwZGF0ZVNjYWxlO1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0d3JhcHBlcldpZHRoOiBlbC5vZmZzZXRXaWR0aCxcblx0XHRcdHdyYXBwZXJIZWlnaHQ6IGVsLm9mZnNldEhlaWdodCxcblx0XHRcdHNjYWxlOiBzY2FsZSB8fCAoZWwud2lkdGgvZWwuaGVpZ2h0KSxcblx0XHRcdHdpZHRoOiAwLFxuXHRcdFx0aGVpZ2h0OiAwLFxuXHRcdFx0b2Zmc2V0WDogMCxcblx0XHRcdG9mZnNldFk6IDBcblx0XHR9XG5cdFx0ZGF0YVsnd3JhcHBlclNjYWxlJ10gPSBkYXRhLndyYXBwZXJXaWR0aCAvIGRhdGEud3JhcHBlckhlaWdodDtcblx0XHRpZiAoZGF0YS53cmFwcGVyU2NhbGUgPiBkYXRhLnNjYWxlKSB7XG5cdFx0XHRkYXRhLmhlaWdodCA9IGRhdGEud3JhcHBlckhlaWdodDtcblx0XHRcdGRhdGEud2lkdGggPSBkYXRhLnNjYWxlICogZGF0YS5oZWlnaHQ7XG5cdFx0XHRkYXRhLm9mZnNldFggPSAoZGF0YS53cmFwcGVyV2lkdGggLSBkYXRhLndpZHRoKSAvIDI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRhdGEud2lkdGggPSBkYXRhLndyYXBwZXJXaWR0aDtcblx0XHRcdGRhdGEuaGVpZ2h0ID0gZGF0YS53aWR0aCAvIGRhdGEuc2NhbGU7XG5cdFx0XHRkYXRhLm9mZnNldFkgPSAoZGF0YS53cmFwcGVySGVpZ2h0IC0gZGF0YS5oZWlnaHQpIC8gMjtcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblx0cmV0dXJuIGJvdW5kcztcbn0pKCk7IiwiaW1wb3J0IGRvbSBmcm9tICcuLi8uLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vY29udGFpbmVyJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGNvbnRhaW5lckV4dGVuZGVkIGV4dGVuZHMgQ29udGFpbmVye1xuXHRjb25zdHJ1Y3RvcihlbCwgb3B0cywgY3R4LCBwbGF5ZXIpe1xuXHRcdHN1cGVyKGVsLCBvcHRzLCBjdHgsIHBsYXllcik7XG5cdFx0bGV0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG5cdFx0ZG9tLmFkZENsYXNzKGhlYWRlciwgJ2hlYWRlcicpO1xuXHRcdHRoaXMuX3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdGhlYWRlci5hcHBlbmRDaGlsZCh0aGlzLl90aXRsZSk7XG5cdFx0dGhpcy5fY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0dGhpcy5fY2xvc2VCdG4uaW5uZXJIVE1MID0gXCI8aW1nIHNyYz0nc3ZnL2ljX2Nsb3NlLnN2ZycvPlwiO1xuXHRcdGRvbS5hZGRDbGFzcyh0aGlzLl9jbG9zZUJ0biwnY2xvc2VCdG4nKTtcblx0XHR0aGlzLl9jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZSk7XG5cdFx0aGVhZGVyLmFwcGVuZENoaWxkKHRoaXMuX2Nsb3NlQnRuKTtcblx0XHR0aGlzLmJvZHkuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcblx0XHRwbGF5ZXIub24oJ3Jlc2l6ZScsICgpPT57XG5cdFx0XHRkb20uYXV0b0xpbmVIZWlnaHQoaGVhZGVyKTtcblx0XHR9KTtcblx0fVxuXHR0aXRsZSh2KXtcblx0XHRpZih2ICE9IG51bGwpe1xuXHRcdFx0dGhpcy5fdGl0bGUuaW5uZXJIVE1MID0gdjtcblx0XHRcdGRvbS5hdXRvTGluZUhlaWdodCh0aGlzLl90aXRsZS5wYXJlbnROb2RlKTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fdGl0bGUuaW5uZXJIVE1MO1xuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRXJyb3JGb3JtYXRFeGNlcHRpb24obXNnKSB7XG4gICB0cnkge1xuXHQgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuXHR9IGNhdGNoIChlKSB7XG5cdCAgY29uc29sZS5sb2coZS5uYW1lICsgJzogJyArIGUubWVzc2FnZSk7XG5cdCAgcmV0dXJuO1xuXHR9XG59XG4iLCIvL2h0dHBzOi8vZ2l0aHViLmNvbS9wcmltdXMvZXZlbnRlbWl0dGVyM1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHByZWZpeCA9ICd+JztcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgYSBzdG9yYWdlIGZvciBvdXIgYEVFYCBvYmplY3RzLlxuICogQW4gYEV2ZW50c2AgaW5zdGFuY2UgaXMgYSBwbGFpbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhcmUgZXZlbnQgbmFtZXMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRXZlbnRzKCkge31cblxuLy9cbi8vIFdlIHRyeSB0byBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYC4gSW4gc29tZSBlbmdpbmVzIGNyZWF0aW5nIGFuXG4vLyBpbnN0YW5jZSBpbiB0aGlzIHdheSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCBkaXJlY3RseS5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBjaGFyYWN0ZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Rcbi8vIG92ZXJyaWRkZW4gb3IgdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy9cbmlmIChPYmplY3QuY3JlYXRlKSB7XG4gIEV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vXG4gIC8vIFRoaXMgaGFjayBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgYF9fcHJvdG9fX2AgcHJvcGVydHkgaXMgc3RpbGwgaW5oZXJpdGVkIGluXG4gIC8vIHNvbWUgb2xkIGJyb3dzZXJzIGxpa2UgQW5kcm9pZCA0LCBpUGhvbmUgNS4xLCBPcGVyYSAxMSBhbmQgU2FmYXJpIDUuXG4gIC8vXG4gIGlmICghbmV3IEV2ZW50cygpLl9fcHJvdG9fXykgcHJlZml4ID0gZmFsc2U7XG59XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdGhpcy5mbiA9IGZuO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIE1pbmltYWwgYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlIHRoYXQgaXMgbW9sZGVkIGFnYWluc3QgdGhlIE5vZGUuanNcbiAqIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IGxpc3RpbmcgdGhlIGV2ZW50cyBmb3Igd2hpY2ggdGhlIGVtaXR0ZXIgaGFzIHJlZ2lzdGVyZWRcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICB2YXIgbmFtZXMgPSBbXVxuICAgICwgZXZlbnRzXG4gICAgLCBuYW1lO1xuXG4gIGlmICh0aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgcmV0dXJuIG5hbWVzO1xuXG4gIGZvciAobmFtZSBpbiAoZXZlbnRzID0gdGhpcy5fZXZlbnRzKSkge1xuICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgcmV0dXJuIG5hbWVzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGV2ZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGV4aXN0cyBPbmx5IGNoZWNrIGlmIHRoZXJlIGFyZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7QXJyYXl8Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKGV2ZW50LCBleGlzdHMpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnRcbiAgICAsIGF2YWlsYWJsZSA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChleGlzdHMpIHJldHVybiAhIWF2YWlsYWJsZTtcbiAgaWYgKCFhdmFpbGFibGUpIHJldHVybiBbXTtcbiAgaWYgKGF2YWlsYWJsZS5mbikgcmV0dXJuIFthdmFpbGFibGUuZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXZhaWxhYmxlLmxlbmd0aCwgZWUgPSBuZXcgQXJyYXkobCk7IGkgPCBsOyBpKyspIHtcbiAgICBlZVtpXSA9IGF2YWlsYWJsZVtpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogQ2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGV2ZW50IGhhZCBsaXN0ZW5lcnMsIGVsc2UgYGZhbHNlYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVycy5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgNDogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMiwgYTMpOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoIWFyZ3MpIGZvciAoaiA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBhcmdzW2ogLSAxXSA9IGFyZ3VtZW50c1tqXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uYXBwbHkobGlzdGVuZXJzW2ldLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcylcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBvbmUtdGltZSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMsIHRydWUpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIHRoaXMuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbdGhpcy5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsaXN0ZW5lcnMgb2YgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IG1hdGNoIHRoaXMgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBoYXZlIHRoaXMgY29udGV4dC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmUtdGltZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiB0aGlzO1xuICBpZiAoIWZuKSB7XG4gICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKFxuICAgICAgICAgbGlzdGVuZXJzLmZuID09PSBmblxuICAgICAgJiYgKCFvbmNlIHx8IGxpc3RlbmVycy5vbmNlKVxuICAgICAgJiYgKCFjb250ZXh0IHx8IGxpc3RlbmVycy5jb250ZXh0ID09PSBjb250ZXh0KVxuICAgICkge1xuICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgZXZlbnRzID0gW10sIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4gIT09IGZuXG4gICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSlcbiAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgICAvL1xuICAgIGlmIChldmVudHMubGVuZ3RoKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gICAgZWxzZSBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzLCBvciB0aG9zZSBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0O1xuXG4gIGlmIChldmVudCkge1xuICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG4gICAgaWYgKHRoaXMuX2V2ZW50c1tldnRdKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBBbGlhcyBtZXRob2RzIG5hbWVzIGJlY2F1c2UgcGVvcGxlIHJvbGwgbGlrZSB0aGF0LlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4vL1xuLy8gVGhpcyBmdW5jdGlvbiBkb2Vzbid0IGFwcGx5IGFueW1vcmUuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgcHJlZml4LlxuLy9cbkV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RW1pdHRlcjsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblx0bGV0IHggPSAwO1xuXHRsZXQgeSA9IDA7XG5cdHRoaXMuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHggPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgMDtcblx0XHR5ID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IDA7XG5cdH1cblx0dGhpcy5yZXN0b3JlID0gZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LnNjcm9sbFRvKHgsIHkpXG5cdH1cbn0iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4vbWVkaWEvZXZlbnRzL2luZGV4JztcbmltcG9ydCBzY3JvbGxQb3NpdGlvbiBmcm9tICcuLi9oZWxwZXJzL3Njcm9sbFBvc2l0aW9uJztcbi8vIEZ1bGxzY3JlZW4gQVBJXG5sZXQgc3VwcG9ydHNGdWxsU2NyZWVuID0gZmFsc2U7XG5sZXQgYnJvd3NlclByZWZpeGVzID0gJ3dlYmtpdCBtb3ogbyBtcyBraHRtbCcuc3BsaXQoJyAnKTtcbmxldCBwcmVmaXhGUyA9ICcnO1xuLy9DaGVjayBmb3IgbmF0aXZlIHN1cHBvcnRcbmlmICh0eXBlb2YgZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xufSBlbHNlIHtcbiAgICAvLyBDaGVjayBmb3IgZnVsbHNjcmVlbiBzdXBwb3J0IGJ5IHZlbmRvciBwcmVmaXhcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBicm93c2VyUHJlZml4ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBwcmVmaXhGUyA9IGJyb3dzZXJQcmVmaXhlc1tpXTtcblxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50W3ByZWZpeEZTICsgJ0NhbmNlbEZ1bGxTY3JlZW4nXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIE1TICh3aGVuIGlzbid0IGl0PylcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4gIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVuYWJsZWQpIHtcbiAgICAgICAgICAgIHByZWZpeEZTID0gJ21zJztcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbmxldCBldmVudENoYW5nZSA9IChwcmVmaXhGUyA9PT0gJycpID8gJ2Z1bGxzY3JlZW5jaGFuZ2UnIDogcHJlZml4RlMgKyAocHJlZml4RlMgPT0gJ21zJyA/ICdmdWxsc2NyZWVuY2hhbmdlJyA6ICdmdWxsc2NyZWVuY2hhbmdlJyk7XG5ldmVudENoYW5nZSA9IGV2ZW50Q2hhbmdlLnRvTG93ZXJDYXNlKCk7XG4vL3N1cHBvcnRzRnVsbFNjcmVlbiA9IGZhbHNlO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVsbHNjcmVlbiBleHRlbmRzIEV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoaW5JZnJhbWUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZnJhbWUgPSBpbklmcmFtZTtcbiAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbiA9IG5ldyBzY3JvbGxQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZSA9IHt9O1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgZm5GdWxsc2NyZWVuQ2hhbmdlID0gKCk9PntcbiAgICAgICAgICAgICAgICBpZighdGhpcy5pc0Z1bGxTY3JlZW4oKSl7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5zY3JvbGxQb3NpdGlvbi5yZXN0b3JlLDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudENoYW5nZSwgZm5GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGVmdWFsdEZ1bGxTY3JlZW5FbGVtZW50KGVsZW1lbnQpe1xuICAgICAgICBsZXQgZWwgPSBlbGVtZW50O1xuICAgICAgICBpZiAoZWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYodGhpcy5pZnJhbWUpe1xuICAgICAgICAgICAgICAgIGVsID0gdGhpcy5pZnJhbWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMud3JhcHBlcjsgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH1cbiAgICBvbkZ1bGxzY3JlZW5DaGFuZ2UoZXZ0KXtcbiAgICAgICAgLy9pbnZlc3RpZ2F0ZSBpZiBuYXRpdmUgdmlkZW8gZnVsbHNjcmVlbiBjYW4gYmUgb3ZlcndyaXR0ZW5cbiAgICAgICAgdGhpcy5tZWRpYS5hZGRFdmVudExpc3RlbmVyKGV2ZW50Q2hhbmdlLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LCB0cnVlKTtcbiAgICB9XG4gICAgaXNGdWxsV2luZG93KCl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaXNGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGVsID0gdGhpcy5kZWZ1YWx0RnVsbFNjcmVlbkVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICBzd2l0Y2ggKHByZWZpeEZTKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ID09IGVsO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21veic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCA9PSBlbDtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnRbcHJlZml4RlMgKyAnRnVsbHNjcmVlbkVsZW1lbnQnXSA9PSBlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlcXVlc3RGdWxsV2luZG93KGVsZW1lbnQpe1xuICAgICAgICBpZiAodGhpcy5pc0Z1bGxXaW5kb3coKSB8fCB0aGlzLmlzRnVsbFNjcmVlbigpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVsID0gdGhpcy5kZWZ1YWx0RnVsbFNjcmVlbkVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24uc2F2ZSgpO1xuICAgICAgICAvLyBsZXQgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbiAgICAgICAgbGV0IHN0eWxlID0gZWwuc3R5bGU7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsncG9zaXRpb24nXSA9IHN0eWxlLnBvc2l0aW9uIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWFyZ2luJ10gPSBzdHlsZS5tYXJnaW4gfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd0b3AnXSA9IHN0eWxlLnRvcCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ2xlZnQnXSA9IHN0eWxlLmxlZnQgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd3aWR0aCddID0gc3R5bGUud2lkdGggfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydoZWlnaHQnXSA9IHN0eWxlLmhlaWdodCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3pJbmRleCddID0gc3R5bGUuekluZGV4IHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWF4V2lkdGgnXSA9IHN0eWxlLm1heFdpZHRoIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWF4SGVpZ2h0J10gPSBzdHlsZS5tYXhIZWlnaHQgfHwgXCJcIjtcblxuICAgICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgZWwuc3R5bGUudG9wID0gZWwuc3R5bGUubGVmdCA9IDA7XG4gICAgICAgIGVsLnN0eWxlLm1hcmdpbiA9IDA7XG4gICAgICAgIGVsLnN0eWxlLm1heFdpZHRoID0gZWwuc3R5bGUubWF4SGVpZ2h0ID0gZWwuc3R5bGUud2lkdGggPSBlbC5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gMjE0NzQ4MzY0NztcblxuICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IGVsO1xuICAgICAgICB0aGlzLmlzRnVsbFdpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICBsZXQgZWwgPSB0aGlzLmRlZnVhbHRGdWxsU2NyZWVuRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbi5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBlbC5yZXF1ZXN0RnVsbFNjcmVlbigpIDogZWxbcHJlZml4RlMgKyAocHJlZml4RlMgPT0gJ21zJyA/ICdSZXF1ZXN0RnVsbHNjcmVlbicgOiAnUmVxdWVzdEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEZ1bGxXaW5kb3coZWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhbmNlbEZ1bGxXaW5kb3coKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Z1bGxXaW5kb3coKSB8fCB0aGlzLmlzRnVsbFNjcmVlbigpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50LnN0eWxlW2tdID0gdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlW2tdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc0Z1bGxXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbi5yZXN0b3JlKCk7XG4gICAgfVxuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKSA6IGRvY3VtZW50W3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnRXhpdEZ1bGxzY3JlZW4nIDogJ0NhbmNlbEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRnVsbFdpbmRvdygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZ2dsZUZ1bGxXaW5kb3coZWxlbWVudCl7XG4gICAgICAgIGxldCBpc0Z1bGxzY3JlZW4gPSAhdGhpcy5pc0Z1bGxXaW5kb3coKTtcbiAgICAgICAgaWYgKGlzRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RnVsbFdpbmRvdyhlbGVtZW50KTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWxGdWxsV2luZG93KCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2dnbGVGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGlzRnVsbHNjcmVlbiA9ICF0aGlzLmlzRnVsbFNjcmVlbigpO1xuICAgICAgICBpZiAoaXNGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQpO1xuICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bGxzY3JlZW5FbGVtZW50KCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA6IGRvY3VtZW50W3ByZWZpeEZTICsgJ0Z1bGxzY3JlZW5FbGVtZW50J107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG59OyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWVkaWEpIHtcblx0Ly8gUmVtb3ZlIGNoaWxkIHNvdXJjZXNcblx0dmFyIHNvdXJjZXMgPSBkb20uc2VsZWN0QWxsKCdzb3VyY2UnLCBtZWRpYSk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGRvbS5yZW1vdmVFbGVtZW50KHNvdXJjZXNbaV0pO1xuXHR9XG5cblx0Ly8gU2V0IGJsYW5rIHZpZGVvIHNyYyBhdHRyaWJ1dGVcblx0Ly8gVGhpcyBpcyB0byBwcmV2ZW50IGEgTUVESUFfRVJSX1NSQ19OT1RfU1VQUE9SVEVEIGVycm9yXG5cdC8vIFNtYWxsIG1wNDogaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvc21hbGwvYmxvYi9tYXN0ZXIvbXA0Lm1wNFxuXHQvLyBJbmZvOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyMjMxNTc5L2hvdy10by1wcm9wZXJseS1kaXNwb3NlLW9mLWFuLWh0bWw1LXZpZGVvLWFuZC1jbG9zZS1zb2NrZXQtb3ItY29ubmVjdGlvblxuXHRtZWRpYS5zZXRBdHRyaWJ1dGUoJ3NyYycsICdkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUhHWjBlWEJwYzI5dEFBQUNBR2x6YjIxcGMyOHliWEEwTVFBQUFBaG1jbVZsQUFBQUdtMWtZWFFBQUFHekFCQUhBQUFCdGhCZ1VZSTl0KzhBQUFNTmJXOXZkZ0FBQUd4dGRtaGtBQUFBQU1YTXZ2ckZ6TDc2QUFBRDZBQUFBQ29BQVFBQUFRQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FBQUJocGIyUnpBQUFBQUJDQWdJQUhBRS8vLy8vKy93QUFBaUYwY21GckFBQUFYSFJyYUdRQUFBQVB4Y3krK3NYTXZ2b0FBQUFCQUFBQUFBQUFBQ29BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQWdBQUFBSUFBQUFBQUc5YldScFlRQUFBQ0J0Wkdoa0FBQUFBTVhNdnZyRnpMNzZBQUFBR0FBQUFBRVZ4d0FBQUFBQUxXaGtiSElBQUFBQUFBQUFBSFpwWkdVQUFBQUFBQUFBQUFBQUFBQldhV1JsYjBoaGJtUnNaWElBQUFBQmFHMXBibVlBQUFBVWRtMW9aQUFBQUFFQUFBQUFBQUFBQUFBQUFDUmthVzVtQUFBQUhHUnlaV1lBQUFBQUFBQUFBUUFBQUF4MWNtd2dBQUFBQVFBQUFTaHpkR0pzQUFBQXhITjBjMlFBQUFBQUFBQUFBUUFBQUxSdGNEUjJBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FDQUJJQUFBQVNBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR1AvL0FBQUFYbVZ6WkhNQUFBQUFBNENBZ0UwQUFRQUVnSUNBUHlBUkFBQUFBQU1OUUFBQUFBQUZnSUNBTFFBQUFiQUJBQUFCdFlrVEFBQUJBQUFBQVNBQXhJMklBTVVBUkFFVVF3QUFBYkpNWVhaak5UTXVNelV1TUFhQWdJQUJBZ0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUFVYzNSemVnQUFBQUFBQUFBU0FBQUFBUUFBQUJSemRHTnZBQUFBQUFBQUFBRUFBQUFzQUFBQVlIVmtkR0VBQUFCWWJXVjBZUUFBQUFBQUFBQWhhR1JzY2dBQUFBQUFBQUFBYldScGNtRndjR3dBQUFBQUFBQUFBQUFBQUFBcmFXeHpkQUFBQUNPcGRHOXZBQUFBRzJSaGRHRUFBQUFCQUFBQUFFeGhkbVkxTXk0eU1TNHgnKTtcblxuXHQvLyBMb2FkIHRoZSBuZXcgZW1wdHkgc291cmNlXG5cdC8vIFRoaXMgd2lsbCBjYW5jZWwgZXhpc3RpbmcgcmVxdWVzdHNcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TZWx6L3BseXIvaXNzdWVzLzE3NFxuXHRtZWRpYS5sb2FkKCk7XG5cblx0Ly8gRGVidWdnaW5nXG5cdGNvbnNvbGUubG9nKFwiQ2FuY2VsbGVkIG5ldHdvcmsgcmVxdWVzdHMgZm9yIG9sZCBtZWRpYVwiKTtcbn0iLCJleHBvcnQgZnVuY3Rpb24gbWltZUF1ZGlvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wNCc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wZWcnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vd2F2JzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2OyBjb2RlY3M9XCIxXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWltZVZpZGVvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL3dlYm0nOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby93ZWJtOyBjb2RlY3M9XCJ2cDgsIHZvcmJpc1wiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICd2aWRlby9tcDQnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFLCBtcDRhLjQwLjJcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAndmlkZW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHt9IiwiaW1wb3J0IGVycm9yIGZyb20gJy4uLy4uL2hlbHBlcnMvZXJyb3InO1xuaW1wb3J0IEZ1bGxzY3JlZW4gZnJvbSAnLi4vZnVsbHNjcmVlbic7XG5pbXBvcnQgX2NhbmNlbFJlcXVlc3RzIGZyb20gJy4uLy4uL2hlbHBlcnMvY2FuY2VsVmlkZW9OZXR3b3JrUmVxdWVzdCc7XG5pbXBvcnQge21pbWVWaWRlb30gZnJvbSAnLi4vLi4vaGVscGVycy9taW1lVHlwZSc7XG5cbi8vaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxubGV0IF9ldmVudHMgPSBbJ2VuZGVkJywgJ3Byb2dyZXNzJywgJ3N0YWxsZWQnLCAncGxheWluZycsICd3YWl0aW5nJywgJ2NhbnBsYXknLCAnY2FucGxheXRocm91Z2gnLCAnbG9hZHN0YXJ0JywgJ2xvYWRlZGRhdGEnLCAnbG9hZGVkbWV0YWRhdGEnLCAndGltZXVwZGF0ZScsICd2b2x1bWVjaGFuZ2UnLCAncGxheScsICdwbGF5aW5nJywgJ3BhdXNlJywgJ2Vycm9yJywgJ3NlZWtpbmcnLCAnZW1wdGllZCcsICdzZWVrZWQnLCAncmF0ZWNoYW5nZScsICdzdXNwZW5kJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lZGlhIGV4dGVuZHMgRnVsbHNjcmVlbiB7XG5cdGNvbnN0cnVjdG9yKGVsLGluSWZyYW1lKSB7XG5cdFx0c3VwZXIoaW5JZnJhbWUpO1xuXHRcdGlmKGVsID09IG51bGwpe1xuXHRcdFx0ZXJyb3IoXCJZb3UgbmVlZCB0byBzdXBwbHkgYSBIVE1MVmlkZW9FbGVtZW50IHRvIGluc3RhbnRpYXRlIHRoZSBwbGF5ZXJcIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEgPSBlbDtcblx0XHRfZXZlbnRzLmZvckVhY2goKGspID0+IHtcblx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoaywgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmVtaXQoayk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuY2FuUGxheSA9IHtcblx0XHRcdG1wNDogbWltZVZpZGVvKGVsLCd2aWRlby9tcDQnKSxcblx0XHRcdHdlYm06IG1pbWVWaWRlbyhlbCwndmlkZW8vd2VibScpLFxuXHRcdFx0b2dnOiBtaW1lVmlkZW8oZWwsJ3ZpZGVvL29nZycpXG5cdFx0fVxuXHR9XG5cblx0LyoqKiBHbG9iYWwgYXR0cmlidXRlcyAqL1xuXG5cdC8qIEEgQm9vbGVhbiBhdHRyaWJ1dGU7IGlmIHNwZWNpZmllZCwgdGhlIHZpZGVvIGF1dG9tYXRpY2FsbHkgYmVnaW5zIHRvIHBsYXkgYmFjayBhcyBzb29uIGFzIGl0IGNhbiBkbyBzbyB3aXRob3V0IHN0b3BwaW5nIHRvIGZpbmlzaCBsb2FkaW5nIHRoZSBkYXRhLiBJZiBub3QgcmV0dXJuIHRoZSBhdW9wbGF5IGF0dHJpYnV0ZS4gKi9cblx0YXV0b3BsYXkodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmF1dG9wbGF5ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuYXV0b3BsYXk7XG5cdH1cblxuXHQvKiBSZXR1cm5zIHRoZSB0aW1lIHJhbmdlcyBvZiB0aGUgYnVmZmVyZWQgbWVkaWEuIFRoaXMgYXR0cmlidXRlIGNvbnRhaW5zIGEgVGltZVJhbmdlcyBvYmplY3QgKi9cblx0YnVmZmVyZWQoKcKgIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5idWZmZXJlZDtcblx0fVxuXG5cdC8qIElmIHRoaXMgYXR0cmlidXRlIGlzIHByZXNlbnQsIHRoZSBicm93c2VyIHdpbGwgb2ZmZXIgY29udHJvbHMgdG8gYWxsb3cgdGhlIHVzZXIgdG8gY29udHJvbCB2aWRlbyBwbGF5YmFjaywgaW5jbHVkaW5nIHZvbHVtZSwgc2Vla2luZywgYW5kIHBhdXNlL3Jlc3VtZSBwbGF5YmFjay4gV2hlbiBub3Qgc2V0IHJldHVybnMgaWYgdGhlIGNvbnRyb2xzIGFyZSBwcmVzZW50ICovXG5cdG5hdGl2ZUNvbnRyb2xzKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5jb250cm9scyA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNvbnRyb2xzO1xuXHR9XG5cblx0LyogYW5vbnltb3VzLCB1c2UtY3JlZGVudGlhbHMsIGZhbHNlICovXG5cdGNyb3Nzb3JpZ2luKHYpIHtcblx0XHRpZiAodiA9PT0gJ3VzZS1jcmVkZW50aWFscycpIHtcblx0XHRcdHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSAndXNlLWNyZWRlbnRpYWxzJztcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRpZiAodikge1xuXHRcdFx0dGhpcy5tZWRpYS5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuXHRcdFx0cmV0dXJuICdhbm9ueW1vdXMnO1xuXHRcdH1cblx0XHRpZiAodiA9PT0gZmFsc2UpIHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSBudWxsO1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNyb3NzT3JpZ2luO1xuXHR9XG5cblx0LyogQSBCb29sZWFuIGF0dHJpYnV0ZTsgaWYgc3BlY2lmaWVkLCB3ZSB3aWxsLCB1cG9uIHJlYWNoaW5nIHRoZSBlbmQgb2YgdGhlIHZpZGVvLCBhdXRvbWF0aWNhbGx5IHNlZWsgYmFjayB0byB0aGUgc3RhcnQuICovXG5cdGxvb3Aodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmxvb3AgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5sb29wO1xuXHR9XG5cblx0LypBIEJvb2xlYW4gYXR0cmlidXRlIHdoaWNoIGluZGljYXRlcyB0aGUgZGVmYXVsdCBzZXR0aW5nIG9mIHRoZSBhdWRpbyBjb250YWluZWQgaW4gdGhlIHZpZGVvLiBJZiBzZXQsIHRoZSBhdWRpbyB3aWxsIGJlIGluaXRpYWxseSBzaWxlbmNlZC4gSXRzIGRlZmF1bHQgdmFsdWUgaXMgZmFsc2UsIG1lYW5pbmcgdGhhdCB0aGUgYXVkaW8gd2lsbCBiZSBwbGF5ZWQgd2hlbiB0aGUgdmlkZW8gaXMgcGxheWVkKi9cblx0bXV0ZWQodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLm11dGVkID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEubXV0ZWQ7XG5cdH1cblxuXHQvKiBNdXRlIHRoZSB2aWRlbyAqL1xuXHRtdXRlKCkge1xuXHRcdHRoaXMubXV0ZWQodHJ1ZSk7XG5cdH1cblxuXHQvKiBVbk11dGUgdGhlIHZpZGVvICovXG5cdHVubXV0ZSgpIHtcblx0XHR0aGlzLm11dGVkKGZhbHNlKTtcblx0fVxuXG5cdC8qIFRvZ2dsZSB0aGUgbXV0ZWQgc3RhbmNlIG9mIHRoZSB2aWRlbyAqL1xuXHR0b2dnbGVNdXRlKCkge1xuXHRcdHJldHVybiB0aGlzLm11dGVkKCF0aGlzLm11dGVkKCkpO1xuXHR9XG5cblx0LyogUmV0dXJucyBBIFRpbWVSYW5nZXMgb2JqZWN0IGluZGljYXRpbmcgYWxsIHRoZSByYW5nZXMgb2YgdGhlIHZpZGVvIHRoYXQgaGF2ZSBiZWVuIHBsYXllZC4qL1xuXHRwbGF5ZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucGxheWVkO1xuXHR9XG5cblx0Lypcblx0VGhpcyBlbnVtZXJhdGVkIGF0dHJpYnV0ZSBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgaGludCB0byB0aGUgYnJvd3NlciBhYm91dCB3aGF0IHRoZSBhdXRob3IgdGhpbmtzIHdpbGwgbGVhZCB0byB0aGUgYmVzdCB1c2VyIGV4cGVyaWVuY2UuIEl0IG1heSBoYXZlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczpcblx0XHRub25lOiBpbmRpY2F0ZXMgdGhhdCB0aGUgdmlkZW8gc2hvdWxkIG5vdCBiZSBwcmVsb2FkZWQuXG5cdFx0bWV0YWRhdGE6IGluZGljYXRlcyB0aGF0IG9ubHkgdmlkZW8gbWV0YWRhdGEgKGUuZy4gbGVuZ3RoKSBpcyBmZXRjaGVkLlxuXHRcdGF1dG86IGluZGljYXRlcyB0aGF0IHRoZSB3aG9sZSB2aWRlbyBmaWxlIGNvdWxkIGJlIGRvd25sb2FkZWQsIGV2ZW4gaWYgdGhlIHVzZXIgaXMgbm90IGV4cGVjdGVkIHRvIHVzZSBpdC5cblx0dGhlIGVtcHR5IHN0cmluZzogc3lub255bSBvZiB0aGUgYXV0byB2YWx1ZS5cblx0Ki9cblx0cHJlbG9hZCh2KSB7XG5cdFx0aWYgKHYgPT09ICdtZXRhZGF0YScgfHwgdiA9PT0gXCJtZXRhXCIpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdtZXRhZGF0YSc7XG5cdFx0XHRyZXR1cm4gJ21ldGFkYXRhJztcblx0XHR9XG5cdFx0aWYgKHYpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdhdXRvJztcblx0XHRcdHJldHVybiAnYXV0byc7XG5cdFx0fVxuXHRcdGlmICh2ID09PSBmYWxzZSkge1xuXHRcdFx0dGhpcy5tZWRpYS5wcmVsb2FkID0gJ25vbmUnO1xuXHRcdFx0cmV0dXJuICdub25lJztcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucHJlbG9hZDtcblx0fVxuXG5cdC8qIEdpdmVzIG9yIHJldHVybnMgdGhlIGFkZHJlc3Mgb2YgYW4gaW1hZ2UgZmlsZSB0aGF0IHRoZSB1c2VyIGFnZW50IGNhbiBzaG93IHdoaWxlIG5vIHZpZGVvIGRhdGEgaXMgYXZhaWxhYmxlLiBUaGUgYXR0cmlidXRlLCBpZiBwcmVzZW50LCBtdXN0IGNvbnRhaW4gYSB2YWxpZCBub24tZW1wdHkgVVJMIHBvdGVudGlhbGx5IHN1cnJvdW5kZWQgYnkgc3BhY2VzICovXG5cdHBvc3Rlcih2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5tZWRpYS5wb3N0ZXIgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wb3N0ZXI7XG5cdH1cblxuXHQvKiBUaGUgc3JjIHByb3BlcnR5IHNldHMgb3IgcmV0dXJucyB0aGUgY3VycmVudCBzb3VyY2Ugb2YgdGhlIGF1ZGlvL3ZpZGVvLCBUaGUgc291cmNlIGlzIHRoZSBhY3R1YWwgbG9jYXRpb24gKFVSTCkgb2YgdGhlIGF1ZGlvL3ZpZGVvIGZpbGUgKi9cblx0c3JjKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRfY2FuY2VsUmVxdWVzdHModGhpcy5tZWRpYSk7XG5cdFx0XHRpZih2IGluc3RhbmNlb2YgQXJyYXkpe1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwLCBuID0gdi5sZW5ndGg7IGkrPTE7KXtcblx0XHRcdFx0XHRpZih2W2ldWyd0eXBlJ10gPT09IFwidmlkZW8vbXA0XCIgJiYgdGhpcy5jYW5QbGF5Lm1wNCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL3dlYm1cIiAmJiB0aGlzLmNhblBsYXkud2VibSl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL29nZ1wiICYmIHRoaXMuY2FuUGxheS5vZ2cpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZSBpZih2LnNyYyAmJiB2LnR5cGUpe1xuXHRcdFx0XHR0aGlzLm1lZGlhLnNyYyA9IHYuc3JjO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHRoaXMubWVkaWEuc3JjID0gdjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50U3JjO1xuXHR9XG5cblx0LyoqKiBHbG9iYWwgRXZlbnRzICovXG5cblx0LyogU3RhcnRzIHBsYXlpbmcgdGhlIGF1ZGlvL3ZpZGVvICovXG5cdHBsYXkoKSB7XG5cdFx0dGhpcy5tZWRpYS5wbGF5KCk7XG5cdH1cblxuXHQvKiBQYXVzZXMgdGhlIGN1cnJlbnRseSBwbGF5aW5nIGF1ZGlvL3ZpZGVvICovXG5cdHBhdXNlKCkge1xuXHRcdHRoaXMubWVkaWEucGF1c2UoKTtcblx0fVxuXG5cdC8qIFJldHVybiB0aGUgY3VycmVudGx5IHBsYXlpbmcgc3RhdHVzIG9mIGF1ZGlvL3ZpZGVvICovXG5cdHBhdXNlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wYXVzZWQ7XG5cdH1cblxuXHQvKiBSZXR1cm4gdGhlIGN1cnJlbnRseSBwbGF5aW5nIHN0YXR1cyBvZiBhdWRpby92aWRlbyAqL1xuXHRwbGF5aW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLnBhdXNlZDtcblx0fVxuXG5cdC8qIFRvZ2dsZSBwbGF5L3BhdXNlIGZvciB0aGUgYXVkaW8vdmlkZW8gKi9cblx0dG9nZ2xlUGxheSgpIHtcblx0XHR0aGlzLm1lZGlhLnBhdXNlZCA/IHRoaXMucGxheSgpIDogdGhpcy5wYXVzZSgpO1xuXHR9XG5cblx0Y3VycmVudFRpbWUodikge1xuXHRcdGlmICh2ID09PSBudWxsIHx8IGlzTmFOKHYpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50VGltZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiB0aGlzLm1lZGlhLmR1cmF0aW9uKSB7XG5cdFx0XHR2ID0gdGhpcy5tZWRpYS5kdXJhdGlvbjtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS5jdXJyZW50VGltZSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH1cblxuXHRzZWVrKHYpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50VGltZSh2KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBbUmUtbG9hZHMgdGhlIGF1ZGlvL3ZpZGVvIGVsZW1lbnQsIHVwZGF0ZSB0aGUgYXVkaW8vdmlkZW8gZWxlbWVudCBhZnRlciBjaGFuZ2luZyB0aGUgc291cmNlIG9yIG90aGVyIHNldHRpbmdzXVxuXHQgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGxvYWQodikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuc3JjKHYpO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhLmxvYWQoKTtcblx0fVxuXG5cdGR1cmF0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmR1cmF0aW9uO1xuXHR9XG5cblx0dm9sdW1lKHYpIHtcblx0XHQvLyBSZXR1cm4gY3VycmVudCB2b2x1bWUgaWYgdmFsdWUgXG5cdFx0aWYgKHYgPT09IG51bGwgfHwgaXNOYU4odikpIHtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZvbHVtZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiAxKSB7XG5cdFx0XHR2ID0gMTtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS52b2x1bWUgPSB2O1xuXHRcdHJldHVybiB2O1xuXHR9XG59IiwidmFyIF9kb2MgPSBkb2N1bWVudCB8fCB7fTtcbi8vIFNldCB0aGUgbmFtZSBvZiB0aGUgaGlkZGVuIHByb3BlcnR5IGFuZCB0aGUgY2hhbmdlIGV2ZW50IGZvciB2aXNpYmlsaXR5XG52YXIgaGlkZGVuLCB2aXNpYmlsaXR5Q2hhbmdlO1xuaWYgKHR5cGVvZiBfZG9jLmhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyBPcGVyYSAxMi4xMCBhbmQgRmlyZWZveCAxOCBhbmQgbGF0ZXIgc3VwcG9ydCBcblx0aGlkZGVuID0gXCJoaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwidmlzaWJpbGl0eWNoYW5nZVwiO1xufSBlbHNlIGlmICh0eXBlb2YgX2RvYy5tb3pIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aGlkZGVuID0gXCJtb3pIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwibW96dmlzaWJpbGl0eWNoYW5nZVwiO1xufSBlbHNlIGlmICh0eXBlb2YgX2RvYy5tc0hpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRoaWRkZW4gPSBcIm1zSGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1zdmlzaWJpbGl0eWNoYW5nZVwiO1xufSBlbHNlIGlmICh0eXBlb2YgX2RvYy53ZWJraXRIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aGlkZGVuID0gXCJ3ZWJraXRIaWRkZW5cIjtcblx0dmlzaWJpbGl0eUNoYW5nZSA9IFwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiO1xufVxuXG5jb25zdCBpc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gISh0eXBlb2YgX2RvY1toaWRkZW5dID09PSBcInVuZGVmaW5lZFwiKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFnZVZpc2liaWxpdHkoX21lZGlhLCBzZXR0aW5ncyA9IHt9KSB7XG5cdGxldCBfYXZhaWxhYmxlID0gaXNBdmFpbGFibGUoKTtcblx0aWYgKF9hdmFpbGFibGUpIHtcblx0XHRsZXQgX2VuYWJsZWQgPSBmYWxzZTtcblx0XHRsZXQgX3BsYXlpbmcgPSBmYWxzZTtcblx0XHRsZXQgcGF1c2VkID0gZmFsc2U7XG5cdFx0bGV0IHNldEZsYWdQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRfcGxheWluZyA9IHRydWU7XG5cdFx0fTtcblx0XHRsZXQgZXZlbnRzID0ge1xuXHRcdFx0dmlzaWJsZTogZnVuY3Rpb24oKXt9LFxuXHRcdFx0aGlkZGVuOiBmdW5jdGlvbigpe31cblx0XHR9O1xuXHRcdGxldCBkZXN0cm95VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZXZlbnRzID0ge1xuXHRcdFx0XHR2aXNpYmxlOiBmdW5jdGlvbigpe30sXG5cdFx0XHRcdGhpZGRlbjogZnVuY3Rpb24oKXt9XG5cdFx0XHR9O1xuXHRcdFx0X2VuYWJsZWQgPSBmYWxzZTtcblx0XHRcdF9wbGF5aW5nID0gZmFsc2U7XG5cdFx0XHRfZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdFx0X21lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cdFx0fVxuXHRcdGxldCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoX2VuYWJsZWQpIHtcblx0XHRcdFx0aWYgKF9kb2NbaGlkZGVuXSkge1xuXHRcdFx0XHRcdGlmIChfcGxheWluZyAmJiAhX21lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0X21lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudHMuaGlkZGVuKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHBhdXNlZCAmJiBfbWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRfbWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50cy52aXNpYmxlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0bGV0IGluaXRWaXNpYmlsaXR5ID0gZnVuY3Rpb24gaW5pdFZpc2liaWxpdHkoc2V0dGluZ3MpIHtcblx0XHRcdGlmIChfYXZhaWxhYmxlKSB7XG5cdFx0XHRcdF9kb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRcdF9tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdFx0XHRcblx0XHRcdFx0ZXZlbnRzLnZpc2libGUgPSBzZXR0aW5ncy5vblZpc2libGUgfHwgZXZlbnRzLnZpc2libGU7XG5cdFx0XHRcdGV2ZW50cy5oaWRkZW4gPSBzZXR0aW5ncy5vbkhpZGRlbiB8fCBldmVudHMuaGlkZGVuO1xuXHRcdFx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdF9kb2MuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0XHRcdF9tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRldmVudHMudmlzaWJsZSA9IHNldHRpbmdzLm9uVmlzaWJsZSB8fCBldmVudHMudmlzaWJsZTtcblx0XHRldmVudHMuaGlkZGVuID0gc2V0dGluZ3Mub25IaWRkZW4gfHwgZXZlbnRzLmhpZGRlbjtcblx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0X2RvYy5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRfbWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblxuXHRcdHRoaXMuaW5pdCA9IGluaXRWaXNpYmlsaXR5O1xuXHRcdHRoaXMuZGVzdHJveSA9IGRlc3Ryb3lWaXNpYmlsaXR5O1xuXHRcdHRoaXMub24gPSBmdW5jdGlvbihldmVudCxmbikge1xuXHRcdFx0aWYgKGV2ZW50IGluIGV2ZW50cykgZXZlbnRzW2V2ZW50XSA9IGZuO1xuXHRcdH07XG5cdFx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24odikge1xuXHRcdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIF9lbmFibGVkID0gdjtcblx0XHRcdHJldHVybiBfZW5hYmxlZDtcblx0XHR9XG5cdH07XG59OyIsImxldCBfZG9jID0gZG9jdW1lbnQgfHwge307XG5sZXQgZXh0ZXJuYWxDb250cm9scyA9IGZ1bmN0aW9uKGVsKSB7XG5cdGxldCBfZW5hYmxlZCA9IHRydWU7XG5cdGxldCBfc2VlayA9IHRydWU7XG5cdGxldCBfdElkID0gbnVsbDtcblx0bGV0IG1lZGlhID0gZWw7XG5cdGxldCBrZXlkb3duID0gZnVuY3Rpb24oZSkge1xuXHRcdGlmIChfZW5hYmxlZCkge1xuXHRcdFx0Ly9ieXBhc3MgZGVmYXVsdCBuYXRpdmUgZXh0ZXJuYWwgY29udHJvbHMgd2hlbiBtZWRpYSBpcyBmb2N1c2VkXG5cdFx0XHRtZWRpYS5wYXJlbnROb2RlLmZvY3VzKCk7XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDMyKSB7IC8vc3BhY2Vcblx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoX3NlZWspIHtcblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzNykgeyAvL2xlZnRcblx0XHRcdFx0XHRtZWRpYS5jdXJyZW50VGltZSA9IG1lZGlhLmN1cnJlbnRUaW1lIC0gNTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOSkgeyAvL3JpZ2h0XG5cdFx0XHRcdFx0bWVkaWEuY3VycmVudFRpbWUgPSBtZWRpYS5jdXJyZW50VGltZSArIDU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDM4KSB7IC8vdXBcblx0XHRcdFx0bGV0IHYgPSBtZWRpYS52b2x1bWU7XG5cdFx0XHRcdHYgKz0gLjE7XG5cdFx0XHRcdGlmICh2ID4gMSkgdiA9IDE7XG5cdFx0XHRcdG1lZGlhLnZvbHVtZSA9IHY7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCkgeyAvL2Rvd25cblx0XHRcdFx0bGV0IHYgPSBtZWRpYS52b2x1bWU7XG5cdFx0XHRcdHYgLT0gLjE7XG5cdFx0XHRcdGlmICh2IDwgMCkgdiA9IDA7XG5cdFx0XHRcdG1lZGlhLnZvbHVtZSA9IHY7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8qaWYgKHNlbGYuY29udHJvbEJhcikge1xuXHRcdFx0XHRpZiAoc2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24pIHtcblx0XHRcdFx0XHRpZiAoZS5rZXlDb2RlID09IDQwIHx8IGUua2V5Q29kZSA9PSAzOCkge1xuXG5cdFx0XHRcdFx0XHRzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbi5tZW51Q29udGVudC5lbF8uY2xhc3NOYW1lID0gXCJ2anMtbWVudSBzaG93XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9Ki9cblx0XHR9XG5cdH07XG5cblx0Ly8gdGhpcy5vblNwYWNlID0gZnVuY3Rpb24oKSB7XG5cblx0Ly8gfTtcblxuXHRsZXQga2V5dXAgPSBmdW5jdGlvbihlKSB7XG5cdFx0aWYgKF9lbmFibGVkKSB7XHRcdFx0XG5cdFx0XHQvLyBpZiAoZS5rZXlDb2RlID09IDQwIHx8IGUua2V5Q29kZSA9PSAzOCkge1xuXHRcdFx0Ly8gXHRjbGVhckludGVydmFsKF90SWQpO1xuXHRcdFx0Ly8gXHRpZiAoc2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24pIHtcblx0XHRcdC8vIFx0XHRfdElkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdC8vIFx0XHRcdHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uLm1lbnVDb250ZW50LmVsXy5jbGFzc05hbWUgPSBcInZqcy1tZW51XCI7XG5cdFx0XHQvLyBcdFx0fSwgNTAwKTtcblx0XHRcdC8vIFx0fVxuXHRcdFx0Ly8gfVxuXHRcdH1cblx0fTtcblx0dGhpcy5lbmFibGVkID0gZnVuY3Rpb24oYikge1xuXHRcdGlmIChiID09PSB1bmRlZmluZWQpIHJldHVybiBfZW5hYmxlZDtcblx0XHRfZW5hYmxlZCA9IGI7XG5cblx0fTtcblx0dGhpcy5zZWVrRW5hYmxlZCA9IGZ1bmN0aW9uKGIpIHtcblx0XHRpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gX3NlZWs7XG5cdFx0X3NlZWsgPSBiO1xuXHR9O1xuXHR0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRfZW5hYmxlZCA9IHRydWU7XG5cdFx0X3RJZCA9IG51bGw7XG5cdFx0X3NlZWsgPSB0cnVlO1xuXHRcdF9kb2MuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bi5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdFx0X2RvYy5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXAuYmluZCh0aGlzKSwgZmFsc2UpO1xuXHR9O1xuXHR0aGlzLmRlc3Ryb3kgPSAgZnVuY3Rpb24oKSB7XG5cdFx0X2VuYWJsZWQgPSBmYWxzZTtcblx0XHRfdElkID0gbnVsbDtcblx0XHRfc2VlayA9IHRydWU7XG5cdFx0X2RvYy5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duKTtcblx0XHRfZG9jLmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cCk7XG5cdH1cblx0dGhpcy5pbml0KCk7XG59XG5leHBvcnQgZGVmYXVsdCBleHRlcm5hbENvbnRyb2xzOyIsIi8vaHR0cHM6Ly9naXRodWIuY29tL2ZkYWNpdWsvYWpheFxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIGFqYXgob3B0aW9ucykge1xuICAgIHZhciBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJ11cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIG9wdGlvbnMuYmFzZVVybCA9IG9wdGlvbnMuYmFzZVVybCB8fCAnJ1xuICAgIGlmIChvcHRpb25zLm1ldGhvZCAmJiBvcHRpb25zLnVybCkge1xuICAgICAgcmV0dXJuIHhockNvbm5lY3Rpb24oXG4gICAgICAgIG9wdGlvbnMubWV0aG9kLFxuICAgICAgICBvcHRpb25zLmJhc2VVcmwgKyBvcHRpb25zLnVybCxcbiAgICAgICAgbWF5YmVEYXRhKG9wdGlvbnMuZGF0YSksXG4gICAgICAgIG9wdGlvbnNcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKGFjYywgbWV0aG9kKSB7XG4gICAgICBhY2NbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSkge1xuICAgICAgICByZXR1cm4geGhyQ29ubmVjdGlvbihcbiAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgb3B0aW9ucy5iYXNlVXJsICsgdXJsLFxuICAgICAgICAgIG1heWJlRGF0YShkYXRhKSxcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCB7fSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG1heWJlRGF0YShkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEgfHwgbnVsbFxuICB9XG5cbiAgZnVuY3Rpb24geGhyQ29ubmVjdGlvbih0eXBlLCB1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICB2YXIgcmV0dXJuTWV0aG9kcyA9IFsndGhlbicsICdjYXRjaCcsICdhbHdheXMnXVxuICAgIHZhciBwcm9taXNlTWV0aG9kcyA9IHJldHVybk1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKHByb21pc2UsIG1ldGhvZCkge1xuICAgICAgcHJvbWlzZVttZXRob2RdID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgcHJvbWlzZVttZXRob2RdID0gY2FsbGJhY2tcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfSwge30pXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgeGhyLm9wZW4odHlwZSwgdXJsLCB0cnVlKVxuICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLmhhc093blByb3BlcnR5KCd3aXRoQ3JlZGVudGlhbHMnKVxuICAgIHNldEhlYWRlcnMoeGhyLCBvcHRpb25zLmhlYWRlcnMpXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCByZWFkeShwcm9taXNlTWV0aG9kcywgeGhyKSwgZmFsc2UpXG4gICAgeGhyLnNlbmQob2JqZWN0VG9RdWVyeVN0cmluZyhkYXRhKSlcbiAgICBwcm9taXNlTWV0aG9kcy5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHhoci5hYm9ydCgpXG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlTWV0aG9kc1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SGVhZGVycyh4aHIsIGhlYWRlcnMpIHtcbiAgICBoZWFkZXJzID0gaGVhZGVycyB8fCB7fVxuICAgIGlmICghaGFzQ29udGVudFR5cGUoaGVhZGVycykpIHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICB9XG4gICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAoaGVhZGVyc1tuYW1lXSAmJiB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCBoZWFkZXJzW25hbWVdKSlcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gaGFzQ29udGVudFR5cGUoaGVhZGVycykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhoZWFkZXJzKS5zb21lKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWR5KHByb21pc2VNZXRob2RzLCB4aHIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlUmVhZHkoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IHhoci5ET05FKSB7XG4gICAgICAgIHhoci5yZW1vdmVFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgaGFuZGxlUmVhZHksIGZhbHNlKVxuICAgICAgICBwcm9taXNlTWV0aG9kcy5hbHdheXMuYXBwbHkocHJvbWlzZU1ldGhvZHMsIHBhcnNlUmVzcG9uc2UoeGhyKSlcblxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgIHByb21pc2VNZXRob2RzLnRoZW4uYXBwbHkocHJvbWlzZU1ldGhvZHMsIHBhcnNlUmVzcG9uc2UoeGhyKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlTWV0aG9kcy5jYXRjaC5hcHBseShwcm9taXNlTWV0aG9kcywgcGFyc2VSZXNwb25zZSh4aHIpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VSZXNwb25zZSh4aHIpIHtcbiAgICB2YXIgcmVzdWx0XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSB4aHIucmVzcG9uc2VUZXh0XG4gICAgfVxuICAgIHJldHVybiBbcmVzdWx0LCB4aHJdXG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RUb1F1ZXJ5U3RyaW5nKGRhdGEpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoZGF0YSkgPyBnZXRRdWVyeVN0cmluZyhkYXRhKSA6IGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KGRhdGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGEpID09PSAnW29iamVjdCBPYmplY3RdJ1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmcob2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCkucmVkdWNlKGZ1bmN0aW9uKGFjYywgaXRlbSkge1xuICAgICAgdmFyIHByZWZpeCA9ICFhY2MgPyAnJyA6IGFjYyArICcmJ1xuICAgICAgcmV0dXJuIHByZWZpeCArIGVuY29kZShpdGVtKSArICc9JyArIGVuY29kZShvYmplY3RbaXRlbV0pXG4gICAgfSwgJycpXG4gIH1cblxuICBmdW5jdGlvbiBlbmNvZGUodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKVxuICB9XG5cbiAgcmV0dXJuIGFqYXhcbn0pKCk7IiwiaW1wb3J0IHJlcXVlc3RBbmltYXRpb25GcmFtZSBmcm9tICcuLi9wb2x5ZmlsbHMvcmVxdWVzdEFuaW1hdGlvbkZyYW1lJztcbmltcG9ydCBpbkZyYW1lIGZyb20gJy4uL2hlbHBlcnMvaW5GcmFtZSc7XG5pbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4uL2hlbHBlcnMvZGVlcG1lcmdlJztcbmltcG9ydCB7XG5cdGNhcGl0YWxpemVGaXJzdExldHRlcixcblx0c2NhbGVGb250LFxuXHRkZWJvdW5jZVxufSBmcm9tICcuLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkb20gZnJvbSAnLi4vaGVscGVycy9kb20nO1xuaW1wb3J0IGRldmljZSBmcm9tICcuLi9oZWxwZXJzL2RldmljZSc7XG5pbXBvcnQgYXV0b0ZvbnQgZnJvbSAnLi9hdXRvRm9udCc7XG5pbXBvcnQgQ29udGFpbmVycyBmcm9tICcuL2NvbnRhaW5lci9jb250YWluZXJzJztcbmltcG9ydCBNZWRpYSBmcm9tICcuL21lZGlhL2luZGV4JztcbmltcG9ydCBjb250YWluZXJCb3VuZHMgZnJvbSAnLi4vaGVscGVycy9jb250YWluZXJCb3VuZHMnO1xuaW1wb3J0IHBhZ2VWaXNpYmlsaXR5IGZyb20gJy4uL2hlbHBlcnMvcGFnZVZpc2liaWxpdHknO1xuaW1wb3J0IGV4dGVybmFsQ29udHJvbHMgZnJvbSAnLi9tZWRpYS9ldmVudHMvZXh0ZXJuYWxDb250cm9scyc7XG5pbXBvcnQgYWpheCBmcm9tICcuLi9oZWxwZXJzL2FqYXgnO1xuXG5jb25zdCBmbl9jb250ZXh0bWVudSA9IGZ1bmN0aW9uKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuXHR2aWRlb1dpZHRoOiA5MjAsXG5cdHZpZGVvSGVpZ2h0OiA1MjAsXG5cdGF1dG9wbGF5OiBmYWxzZSxcblx0bG9vcDogZmFsc2UsXG5cdGNvbnRyb2xzOiBmYWxzZSxcblx0Zm9udDoge1xuXHRcdHJhdGlvOiAxLFxuXHRcdG1pbjogLjUsXG5cdFx0dW5pdHM6IFwiZW1cIlxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBNZWRpYSB7XG5cdGNvbnN0cnVjdG9yKHNldHRpbmdzLCBfZXZlbnRzLCBhcHApIHtcblx0XHRsZXQgZWwgPSBzZXR0aW5ncy52aWRlbztcblx0XHRsZXQgaW5JZnJhbWUgPSBpbkZyYW1lKCk7XG5cdFx0c3VwZXIoZWwsIGluSWZyYW1lKTtcblx0XHRpZiAoZWwgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdHRoaXMuX2JvdW5kcyA9IHt9O1xuXHRcdHRoaXMuZGV2aWNlID0gZGV2aWNlO1xuXHRcdHRoaXMuX19zZXR0aW5ncyA9IGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRcdGRvbS5hZGRDbGFzcyhlbCwgXCJrbWxcIiArIGNhcGl0YWxpemVGaXJzdExldHRlcihlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSk7XG5cdFx0dGhpcy53cmFwcGVyID0gZG9tLndyYXAodGhpcy5tZWRpYSwgZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdGNsYXNzOiAna21sUGxheWVyJ1xuXHRcdH0pKTtcblx0XHRkb20udHJpZ2dlcldlYmtpdEhhcmR3YXJlQWNjZWxlcmF0aW9uKHRoaXMud3JhcHBlcik7XG5cdFx0aWYgKGluSWZyYW1lKSB7XG5cdFx0XHRkb20uYWRkQ2xhc3ModGhpcy53cmFwcGVyLCBcImluRnJhbWVcIik7XG5cdFx0fVxuXHRcdC8vaW5pdFNldHRpbmdzXG5cdFx0Zm9yICh2YXIgayBpbiB0aGlzLl9fc2V0dGluZ3MpIHtcblx0XHRcdGlmICh0aGlzW2tdKSB7XG5cdFx0XHRcdGlmIChrID09PSAnYXV0b3BsYXknICYmIHRoaXMuX19zZXR0aW5nc1trXSAmJiAhaW5JZnJhbWUpIHtcblx0XHRcdFx0XHR0aGlzLnBsYXkoKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzW2tdKHRoaXMuX19zZXR0aW5nc1trXSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoayA9PT0gJ2NvbnRyb2xzJyAmJiB0aGlzLl9fc2V0dGluZ3Nba10gPT09IFwibmF0aXZlXCIpIHtcblx0XHRcdFx0dGhpcy5uYXRpdmVDb250cm9scyh0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL2luaXRQYWdlVmlzaWJpbGl0eVxuXHRcdHRoaXMucGFnZVZpc2liaWxpdHkgPSBuZXcgcGFnZVZpc2liaWxpdHkoZWwpO1xuXG5cdFx0Ly9pbml0ZXh0ZXJuYWxDb250cm9sc1xuXHRcdHRoaXMuZXh0ZXJuYWxDb250cm9scyA9IG5ldyBleHRlcm5hbENvbnRyb2xzKGVsKTtcblxuXHRcdC8vaW5pdENvbnRhaW5lcnNcblx0XHR0aGlzLmNvbnRhaW5lcnMgPSBuZXcgQ29udGFpbmVycyh0aGlzKTtcblxuXHRcdHRoaXMudmlkZW9Db250YWluZXIgPSBmdW5jdGlvbih2cyl7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb250YWluZXJzLmFkZCh2cywgbnVsbCwgJ3ZpZGVvJyk7XG5cdFx0fVxuXG5cdFx0Ly9hdXRvRk9OVFxuXHRcdGlmICh0eXBlb2YgdGhpcy5fX3NldHRpbmdzLmZvbnQgPT09IFwiYm9vbGVhblwiICYmIHRoaXMuX19zZXR0aW5ncy5mb250KSB0aGlzLl9fc2V0dGluZ3MuZm9udCA9IGRlZmF1bHRzLmZvbnQ7XG5cdFx0dGhpcy5hdXRvRm9udCA9IG5ldyBhdXRvRm9udCh0aGlzLndyYXBwZXIsIHRoaXMuX19zZXR0aW5ncy5mb250LCB0aGlzKTtcblx0XHRpZiAodGhpcy5fX3NldHRpbmdzLmZvbnQpIHRoaXMuYXV0b0ZvbnQuZW5hYmxlZCh0cnVlKTtcblxuXHRcdC8vaW5pdENhbGxiYWNrRXZlbnRzXG5cdFx0Zm9yICh2YXIgZXZ0IGluIF9ldmVudHMpIHtcblx0XHRcdHRoaXMub24oZXZ0LCBfZXZlbnRzW2V2dF0sIHRoaXMpO1xuXHRcdH1cblxuXHRcdHRoaXMub24oJ2xvYWRlZG1ldGFkYXRhJywgKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMubWVkaWEud2lkdGggIT0gdGhpcy5tZWRpYS52aWRlb1dpZHRoIHx8IHRoaXMubWVkaWEuaGVpZ2h0ICE9IHRoaXMubWVkaWEudmlkZW9IZWlnaHQpIHtcblx0XHRcdFx0dGhpcy52aWRlb1dpZHRoKCk7XG5cdFx0XHRcdHRoaXMudmlkZW9IZWlnaHQoKTtcblx0XHRcdFx0dGhpcy5lbWl0KCd2aWRlb1Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0bGV0IHZpZGVvU2l6ZUNhY2hlID0ge1xuXHRcdFx0dzogdGhpcy53aWR0aCgpLFxuXHRcdFx0eDogdGhpcy5vZmZzZXRYKCksXG5cdFx0XHR5OiB0aGlzLm9mZnNldFkoKSxcblx0XHRcdGg6IHRoaXMuaGVpZ2h0KClcblx0XHR9XG5cdFx0bGV0IGNoZWNrVmlkZW9SZXNpemUgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLl9ib3VuZHMgPSBjb250YWluZXJCb3VuZHModGhpcy5tZWRpYSk7XG5cdFx0XHRsZXQgdyA9IHRoaXMud2lkdGgoKTtcblx0XHRcdGxldCBoID0gdGhpcy53aWR0aCgpO1xuXHRcdFx0bGV0IHggPSB0aGlzLm9mZnNldFgoKTtcblx0XHRcdGxldCB5ID0gdGhpcy5vZmZzZXRZKCk7XG5cdFx0XHRpZiAodmlkZW9TaXplQ2FjaGUudyAhPSB3IHx8IHZpZGVvU2l6ZUNhY2hlLmggIT0gaCB8fCB2aWRlb1NpemVDYWNoZS54ICE9IHggfHwgdmlkZW9TaXplQ2FjaGUueSAhPSB5KSB7XG5cdFx0XHRcdHZpZGVvU2l6ZUNhY2hlLncgPSB3O1xuXHRcdFx0XHR2aWRlb1NpemVDYWNoZS5oID0gaDtcblx0XHRcdFx0dmlkZW9TaXplQ2FjaGUueCA9IHg7XG5cdFx0XHRcdHZpZGVvU2l6ZUNhY2hlLnkgPSB5O1xuXHRcdFx0XHR0aGlzLmVtaXQoJ3Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjaGVja1ZpZGVvUmVzaXplKTtcblx0XHR9XG5cblx0XHRjaGVja1ZpZGVvUmVzaXplKCk7XG5cblx0XHRpZiAodHlwZW9mIGFwcCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0YXBwLmJpbmQodGhpcykoKTtcblx0XHR9XG5cdH1cblxuXHRjb250ZXh0TWVudSh2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHYgPyB0aGlzLm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZm5fY29udGV4dG1lbnUpIDogdGhpcy5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZuX2NvbnRleHRtZW51KTtcblx0XHR9XG5cdH1cblxuXHRhamF4KG9wdGlvbnMpIHtcblx0XHRyZXR1cm4gYWpheChvcHRpb25zKTtcblx0fVxuXG5cdHZpZGVvV2lkdGgodikge1xuXHRcdGlmICh0aGlzLm1lZGlhLnZpZGVvV2lkdGgpIHtcblx0XHRcdHRoaXMubWVkaWEud2lkdGggPSB0aGlzLm1lZGlhLnZpZGVvV2lkdGg7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdH1cblx0XHRpZiAoIWlzTmFOKHYpKSB7XG5cdFx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRcdHRoaXMubWVkaWEud2lkdGggPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS53aWR0aDtcblx0fVxuXG5cdHZpZGVvSGVpZ2h0KHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb0hlaWdodCkge1xuXHRcdFx0dGhpcy5tZWRpYS5oZWlnaHQgPSB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9IZWlnaHQ7XG5cdFx0fVxuXHRcdGlmICghaXNOYU4odikpIHtcblx0XHRcdHYgPSBwYXJzZUZsb2F0KHYpO1xuXHRcdFx0dGhpcy5tZWRpYS5oZWlnaHQgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5oZWlnaHQ7XG5cdH1cblxuXHRzY2FsZSgpIHtcblx0XHRyZXR1cm4gdGhpcy52aWRlb1dpZHRoKCkgLyB0aGlzLnZpZGVvSGVpZ2h0KCk7XG5cdH1cblxuXHRib3VuZHModikge1xuXHRcdGlmICh0aGlzLl9ib3VuZHNbdl0gIT09IG51bGwpIHJldHVybiB0aGlzLl9ib3VuZHNbdl07XG5cdFx0cmV0dXJuIHRoaXMuX2JvdW5kcztcblx0fVxuXG5cdHdpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnd2lkdGgnKTtcblx0fVxuXG5cdGhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ2hlaWdodCcpO1xuXHR9XG5cblx0b2Zmc2V0WCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ29mZnNldFgnKTtcblx0fVxuXG5cdG9mZnNldFkoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRZJyk7XG5cdH1cblxuXHR3cmFwcGVySGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdHdyYXBwZXJXaWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRXaWR0aDtcblx0fVxuXG5cdHdyYXBwZXJTY2FsZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRXaWR0aCAvIHRoaXMubWVkaWEub2Zmc2V0SGVpZ2h0O1xuXHR9XG5cblx0YWRkQ2xhc3ModiwgZWwpIHtcblx0XHRpZiAoZWwgIT0gbnVsbCkge1xuXHRcdFx0ZG9tLmFkZENsYXNzKHYsIGVsKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZG9tLmFkZENsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdH1cblx0cmVtb3ZlQ2xhc3ModiwgZWwpIHtcblx0XHRpZiAoZWwgIT0gbnVsbCkge1xuXHRcdFx0ZG9tLnJlbW92ZUNsYXNzKHYsIGVsKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHYgIT09ICdrbWxQbGF5ZXInKSB7XG5cdFx0XHRkb20ucmVtb3ZlQ2xhc3ModGhpcy53cmFwcGVyLCB2KTtcblx0XHR9XG5cdH1cblx0dG9nZ2xlQ2xhc3ModiwgZWwpIHtcblx0XHRpZiAoZWwgIT0gbnVsbCkge1xuXHRcdFx0ZG9tLnRvZ2dsZUNsYXNzKHYsIGVsKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHYgIT09ICdrbWxQbGF5ZXInKSB7XG5cdFx0XHRkb20udG9nZ2xlQ2xhc3ModGhpcy53cmFwcGVyLCB2KTtcblx0XHR9XG5cdH1cbn07IiwiaW1wb3J0IGRvbSBmcm9tICcuLi8uLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgYm91bmRzIGZyb20gJy4uLy4uL2hlbHBlcnMvY29udGFpbmVyQm91bmRzJztcbmltcG9ydCBjb250YWluZXJFeHRlbmRlZCBmcm9tICcuL2NvbnRhaW5lckV4dGVuZGVkJztcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi4vaW5kZXgnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgdmlkZW9Db250YWluZXIgZXh0ZW5kcyBjb250YWluZXJFeHRlbmRlZHtcblx0Y29uc3RydWN0b3IoZWwsIG9wdHMsIGN0eCwgcGxheWVyKXtcblx0XHRzdXBlcihlbCwgb3B0cywgY3R4LCBwbGF5ZXIpO1xuXHRcdGxldCBkb21WaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG5cdFx0bGV0IHZpZGVvSG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0ZG9tLmFkZENsYXNzKHZpZGVvSG9sZGVyLCAndmlkZW9Ib2xkZXInKTtcblx0XHR2aWRlb0hvbGRlci5hcHBlbmRDaGlsZChkb21WaWRlbyk7XG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHt2aWRlbzpkb21WaWRlb30pO1xuXHRcdHRoaXMuYm9keS5hcHBlbmRDaGlsZCh2aWRlb0hvbGRlcik7XG5cdFx0bGV0IHBhdXNlZCA9IGZhbHNlO1xuXHRcdHRoaXMub24oJ2hpZGUnLCAoKT0+e1xuXHRcdFx0cGF1c2VkID0gdGhpcy5wbGF5ZXIucGF1c2VkKCk7XG5cdFx0XHR0aGlzLnBsYXllci5wYXVzZSgpO1xuXHRcdH0pO1xuXHRcdHRoaXMub24oJ3Nob3cnLCAoKT0+e1xuXHRcdFx0aWYoIXBhdXNlZCl7XG5cdFx0XHRcdHRoaXMucGxheWVyLnBsYXkoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR0aGlzLm9uKCdlbmRlZCcsICgpPT57XG5cdFx0XHQvLyB0aGlzLmhpZGUoKTtcblx0XHR9KTtcblx0XHR0aGlzLnBsYXllci5vbignZW5kZWQnLCAoKT0+e3RoaXMudHJpZ2dlckV2ZW50KCdlbmRlZCcpO30pO1xuXHRcdHRoaXMucGxheWVyLm9uKCdsb2FkZWRtZXRhZGF0YScsICgpPT57XG5cdFx0XHRsZXQgaGVhZGVySGVpZ2h0ID0gMDtcblx0XHRcdGxldCBoID0gMDtcblx0XHRcdGxldCB5ID0gMDtcblx0XHRcdGxldCB4ID0gMDtcblx0XHRcdGxldCB3ID0gMDtcblx0XHRcdGxldCBzYyA9IHRoaXMucGxheWVyLnNjYWxlKCk7XG5cdFx0XHRzYyA9IDE7XG5cdFx0XHRpZihzYyA+PSAxKXtcblx0XHRcdFx0aCA9IDgwKihwbGF5ZXIudmlkZW9XaWR0aCgpL3NjKS9wbGF5ZXIudmlkZW9IZWlnaHQoKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRoID0gODAqKHBsYXllci52aWRlb1dpZHRoKCkqc2MpL3BsYXllci52aWRlb0hlaWdodCgpO1xuXHRcdFx0fVxuXHRcdFx0aGVhZGVySGVpZ2h0ID0gIDgqODAvaDtcblx0XHRcdHkgPSBNYXRoLnJvdW5kKCgxMDAgLSBoICsgaGVhZGVySGVpZ2h0LzIpLzIpO1xuXHRcdFx0dGhpcy51cGRhdGVTaXplUG9zKHt4OiAnMTAlJywgeTogeSsnJScsIHdpZHRoOiAnODAlJywgaGVpZ2h0OiBoKyclJ30pO1xuXHRcdFx0Ly8gfWVsc2V7XG5cdFx0XHQvLyBcdHcgPSA4MCoocGxheWVyLnZpZGVvSGVpZ2h0KCkqc2MpL3BsYXllci52aWRlb1dpZHRoKCk7XG5cdFx0XHQvLyBcdHggPSBNYXRoLnJvdW5kKCgxMDAgLSB3KS8yKTtcblx0XHRcdC8vIFx0aGVhZGVySGVpZ2h0ID0gIDgqdy84MDtcblx0XHRcdC8vIFx0eSA9IE1hdGgucm91bmQoKDEwICsgaGVhZGVySGVpZ2h0LzQpKTtcblx0XHRcdC8vIFx0dGhpcy51cGRhdGVTaXplUG9zKHt4OiB4KyclJywgeTogeSsnJScsIHdpZHRoOiB3KyclJywgaGVpZ2h0OiAnODAlJ30pO1xuXHRcdFx0Ly8gfVxuXHRcdFx0dGhpcy5fdGl0bGUucGFyZW50Tm9kZS5zdHlsZS5oZWlnaHQgPSBoZWFkZXJIZWlnaHQrJyUnO1xuXHRcdFx0dGhpcy5fdGl0bGUucGFyZW50Tm9kZS5zdHlsZS50b3AgPSAtaGVhZGVySGVpZ2h0KyclJztcblx0XHR9KTtcblx0XHR0aGlzLmxvYWQob3B0cy51cmwpO1xuXHR9XG5cdGxvYWQodXJsKXtcblx0XHR0aGlzLnBsYXllci5sb2FkKHVybCk7XG5cdH1cbn0iLCJpbXBvcnQgZG9tIGZyb20gJy4uLy4uL2hlbHBlcnMvZG9tJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi4vLi4vaGVscGVycy9kZWVwbWVyZ2UnO1xuaW1wb3J0IGFkYXB0aXZlU2l6ZVBvcyBmcm9tICcuL2FkYXB0aXZlU2l6ZVBvcyc7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vY29udGFpbmVyJ1xuaW1wb3J0IHZpZGVvQ29udGFpbmVyIGZyb20gJy4vdmlkZW9Db250YWluZXInXG5cbmxldCBkZWZhdWx0cyA9IHtcblx0YmFja2dyb3VuZENvbG9yOiAnJyxcblx0b25IaWRlOiBudWxsLFxuXHRvblNob3c6IG51bGwsXG5cdGV4dGVybmFsQ29udHJvbHM6IHRydWUsXG5cdHZpc2libGU6IGZhbHNlLFxuXHRwYXVzZTogdHJ1ZVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWluZXJzIHtcblx0Y29uc3RydWN0b3IoY3R4KSB7XG5cdFx0dGhpcy53cmFwcGVyID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdGNsYXNzOiAna21sQ29udGFpbmVycydcblx0XHR9KTtcblx0XHR0aGlzLl9lbHMgPSBbXTtcblx0XHRsZXQgYWMgPSBuZXcgYWRhcHRpdmVTaXplUG9zKHt9LCBjdHgpO1xuXHRcdGFjLmFwcGx5VG8odGhpcy53cmFwcGVyKTtcblxuXHRcdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdGlmICh2ICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKHYgPT0gMCkge1xuXHRcdFx0XHRcdHYgPSBmYWxzZTtcblx0XHRcdFx0XHR0aGlzLndyYXBwZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHYpe1xuXHRcdFx0XHRcdHRoaXMud3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFjLmVuYWJsZWQodik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYWMuZW5hYmxlZCgpO1xuXHRcdH1cblxuXHRcdHRoaXMuY2hlY2tWaXNpYmxlRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGxldCBubyA9IDA7XG5cdFx0XHRmb3IgKHZhciBrIGluIHRoaXMuX2Vscykge1xuXHRcdFx0XHRpZiAodGhpcy5fZWxzW2tdLnZpc2libGUoKSkge1xuXHRcdFx0XHRcdG5vICs9IDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuZW5hYmxlZChubyk7XG5cdFx0fVxuXG5cdFx0Y3R4LndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy53cmFwcGVyKTtcblxuXG5cdFx0bGV0IGN1cnJlbnRWaXNpYmxlcyA9IFtdO1xuXHRcdHRoaXMuaGlkZSA9IGZ1bmN0aW9uKGN1cnJlbnQpIHtcblx0XHRcdGZvciAodmFyIGsgaW4gdGhpcy5fZWxzKSB7XG5cdFx0XHRcdGxldCBjdXJyZW50Q29udGFpbmVyID0gdGhpcy5fZWxzW2tdO1xuXHRcdFx0XHRpZiAodGhpcy5fZWxzW2tdICE9PSBjdXJyZW50KSB7XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRDb250YWluZXIudmlzaWJsZSgpKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50Q29udGFpbmVyLmhpZGUoKTtcblx0XHRcdFx0XHRcdGN1cnJlbnRWaXNpYmxlcy5wdXNoKGN1cnJlbnRDb250YWluZXIpO1xuXHRcdFx0XHRcdFx0Y3VycmVudENvbnRhaW5lci52aXNpYmxlKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRcdGZvciAodmFyIGsgaW4gY3VycmVudFZpc2libGVzKSB7XG5cdFx0XHRcdGN1cnJlbnRWaXNpYmxlc1trXS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHRjdXJyZW50VmlzaWJsZXMgPSBbXTtcblx0XHR9XG5cblx0XHR0aGlzLmFkZCA9IGZ1bmN0aW9uKG9wdHMsIGVsID0ge30sIHR5cGUpIHtcblx0XHRcdGxldCBzZXR0aW5ncyA9IGRlZXBtZXJnZShkZWZhdWx0cywgb3B0cyk7XG5cdFx0XHRsZXQga21sQ29udGFpbmVyID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Y3R4LmFkZENsYXNzKGttbENvbnRhaW5lciwgJ2ttbENvbnRhaW5lciBoaWRkZW4nKTtcblx0XHRcdGxldCBrbWxPdmVybGF5ID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Y3R4LmFkZENsYXNzKGttbE92ZXJsYXksICdvdmVybGF5IHRyaWdnZXJDbG9zZScpO1xuXHRcdFx0bGV0IGttbENvbnRhaW5lckJvZHkgPSBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRpZiAoZWwpIHtcblx0XHRcdFx0aWYgKCFlbC5ub2RlVHlwZSkge1xuXHRcdFx0XHRcdGVsID0ga21sQ29udGFpbmVyQm9keTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWwgPSBrbWxDb250YWluZXJCb2R5O1xuXHRcdFx0fVxuXHRcdFx0ZG9tLmFkZENsYXNzKGVsLCAnYm9keScpO1xuXHRcdFx0a21sQ29udGFpbmVyLmFwcGVuZENoaWxkKGttbE92ZXJsYXkpO1xuXHRcdFx0a21sQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsKTtcblx0XHRcdGxldCBjb250YWluZXIgPSBudWxsO1xuXHRcdFx0c3dpdGNoKHR5cGUpe1xuXHRcdFx0XHRjYXNlICd2aWRlbyc6XG5cdFx0XHRcdFx0Y29udGFpbmVyID0gbmV3IHZpZGVvQ29udGFpbmVyKGttbENvbnRhaW5lciwgc2V0dGluZ3MsIHRoaXMsIGN0eCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Y29udGFpbmVyID0gbmV3IENvbnRhaW5lcihrbWxDb250YWluZXIsIHNldHRpbmdzLCB0aGlzLCBjdHgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dGhpcy5fZWxzLnB1c2goY29udGFpbmVyKTtcblx0XHRcdHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZChrbWxDb250YWluZXIpO1xuXHRcdFx0cmV0dXJuIGNvbnRhaW5lcjtcblx0XHR9XG5cdH1cblx0ZWxzKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2Vsc1tpZF0gfHwgdGhpcy5fZWxzO1xuXHR9XG59IiwiaW1wb3J0IHJlcXVlc3RBbmltYXRpb25GcmFtZSBmcm9tICcuL3BvbHlmaWxscy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUnO1xuaW1wb3J0IGluRnJhbWUgZnJvbSAnLi9oZWxwZXJzL2luRnJhbWUnO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuL2hlbHBlcnMvZGVlcG1lcmdlJztcbmltcG9ydCB7XG5cdGNhcGl0YWxpemVGaXJzdExldHRlcixcblx0c2NhbGVGb250LFxuXHRkZWJvdW5jZVxufSBmcm9tICcuL2hlbHBlcnMvdXRpbHMnO1xuaW1wb3J0IGRvbSBmcm9tICcuL2hlbHBlcnMvZG9tJztcbmltcG9ydCBkZXZpY2UgZnJvbSAnLi9oZWxwZXJzL2RldmljZSc7XG5pbXBvcnQgYXV0b0ZvbnQgZnJvbSAnLi9jb3JlL2F1dG9Gb250JztcbmltcG9ydCBDb250YWluZXJzIGZyb20gJy4vY29yZS9jb250YWluZXIvY29udGFpbmVycyc7XG5pbXBvcnQgTWVkaWEgZnJvbSAnLi9jb3JlL21lZGlhL2luZGV4JztcbmltcG9ydCBjb250YWluZXJCb3VuZHMgZnJvbSAnLi9oZWxwZXJzL2NvbnRhaW5lckJvdW5kcyc7XG5pbXBvcnQgcGFnZVZpc2liaWxpdHkgZnJvbSAnLi9oZWxwZXJzL3BhZ2VWaXNpYmlsaXR5JztcbmltcG9ydCBleHRlcm5hbENvbnRyb2xzIGZyb20gJy4vY29yZS9tZWRpYS9ldmVudHMvZXh0ZXJuYWxDb250cm9scyc7XG5pbXBvcnQgYWpheCBmcm9tICcuL2hlbHBlcnMvYWpheCc7XG5cbmNvbnN0IGZuX2NvbnRleHRtZW51ID0gZnVuY3Rpb24oZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgZGVmYXVsdHMgPSB7XG5cdHZpZGVvV2lkdGg6IDkyMCxcblx0dmlkZW9IZWlnaHQ6IDUyMCxcblx0YXV0b3BsYXk6IGZhbHNlLFxuXHRsb29wOiBmYWxzZSxcblx0Y29udHJvbHM6IGZhbHNlLFxuXHRmb250OiB7XG5cdFx0cmF0aW86IDEsXG5cdFx0bWluOiAuNSxcblx0XHR1bml0czogXCJlbVwiXG5cdH1cbn07XG5cbmNsYXNzIGttbFBsYXllciBleHRlbmRzIE1lZGlhIHtcblx0Y29uc3RydWN0b3Ioc2V0dGluZ3MsIF9ldmVudHMsIGFwcCkge1xuXHRcdGxldCBlbCA9IHNldHRpbmdzLnZpZGVvO1xuXHRcdGxldCBpbklmcmFtZSA9IGluRnJhbWUoKTtcblx0XHRzdXBlcihlbCwgaW5JZnJhbWUpO1xuXHRcdGlmIChlbCA9PSBudWxsKSByZXR1cm47XG5cdFx0dGhpcy5fYm91bmRzID0ge307XG5cdFx0dGhpcy5kZXZpY2UgPSBkZXZpY2U7XG5cdFx0dGhpcy5fX3NldHRpbmdzID0gZGVlcG1lcmdlKGRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cdFx0ZG9tLmFkZENsYXNzKGVsLCBcImttbFwiICsgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpKTtcblx0XHR0aGlzLndyYXBwZXIgPSBkb20ud3JhcCh0aGlzLm1lZGlhLCBkb20uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdFx0Y2xhc3M6ICdrbWxQbGF5ZXInXG5cdFx0fSkpO1xuXHRcdGRvbS50cmlnZ2VyV2Via2l0SGFyZHdhcmVBY2NlbGVyYXRpb24odGhpcy53cmFwcGVyKTtcblx0XHRpZiAoaW5JZnJhbWUpIHtcblx0XHRcdGRvbS5hZGRDbGFzcyh0aGlzLndyYXBwZXIsIFwiaW5GcmFtZVwiKTtcblx0XHR9XG5cdFx0Ly9pbml0U2V0dGluZ3Ncblx0XHRmb3IgKHZhciBrIGluIHRoaXMuX19zZXR0aW5ncykge1xuXHRcdFx0aWYgKHRoaXNba10pIHtcblx0XHRcdFx0aWYgKGsgPT09ICdhdXRvcGxheScgJiYgdGhpcy5fX3NldHRpbmdzW2tdICYmICFpbklmcmFtZSkge1xuXHRcdFx0XHRcdHRoaXMucGxheSgpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXNba10odGhpcy5fX3NldHRpbmdzW2tdKTtcblx0XHRcdH1cblx0XHRcdGlmIChrID09PSAnY29udHJvbHMnICYmIHRoaXMuX19zZXR0aW5nc1trXSA9PT0gXCJuYXRpdmVcIikge1xuXHRcdFx0XHR0aGlzLm5hdGl2ZUNvbnRyb2xzKHRydWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vaW5pdFBhZ2VWaXNpYmlsaXR5XG5cdFx0dGhpcy5wYWdlVmlzaWJpbGl0eSA9IG5ldyBwYWdlVmlzaWJpbGl0eShlbCk7XG5cblx0XHQvL2luaXRleHRlcm5hbENvbnRyb2xzXG5cdFx0dGhpcy5leHRlcm5hbENvbnRyb2xzID0gbmV3IGV4dGVybmFsQ29udHJvbHMoZWwpO1xuXG5cdFx0Ly9pbml0Q29udGFpbmVyc1xuXHRcdHRoaXMuY29udGFpbmVycyA9IG5ldyBDb250YWluZXJzKHRoaXMpO1xuXG5cdFx0dGhpcy52aWRlb0NvbnRhaW5lciA9IGZ1bmN0aW9uKHZzKXtcblx0XHRcdHJldHVybiB0aGlzLmNvbnRhaW5lcnMuYWRkKHZzLCBudWxsLCAndmlkZW8nKTtcblx0XHR9XG5cblx0XHQvL2F1dG9GT05UXG5cdFx0aWYgKHR5cGVvZiB0aGlzLl9fc2V0dGluZ3MuZm9udCA9PT0gXCJib29sZWFuXCIgJiYgdGhpcy5fX3NldHRpbmdzLmZvbnQpIHRoaXMuX19zZXR0aW5ncy5mb250ID0gZGVmYXVsdHMuZm9udDtcblx0XHR0aGlzLmF1dG9Gb250ID0gbmV3IGF1dG9Gb250KHRoaXMud3JhcHBlciwgdGhpcy5fX3NldHRpbmdzLmZvbnQsIHRoaXMpO1xuXHRcdGlmICh0aGlzLl9fc2V0dGluZ3MuZm9udCkgdGhpcy5hdXRvRm9udC5lbmFibGVkKHRydWUpO1xuXG5cdFx0Ly9pbml0Q2FsbGJhY2tFdmVudHNcblx0XHRmb3IgKHZhciBldnQgaW4gX2V2ZW50cykge1xuXHRcdFx0dGhpcy5vbihldnQsIF9ldmVudHNbZXZ0XSwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBhcHAgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGFwcC5iaW5kKHRoaXMpO1xuXHRcdH1cblxuXHRcdHRoaXMub24oJ2xvYWRlZG1ldGFkYXRhJywgKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMubWVkaWEud2lkdGggIT0gdGhpcy5tZWRpYS52aWRlb1dpZHRoIHx8IHRoaXMubWVkaWEuaGVpZ2h0ICE9IHRoaXMubWVkaWEudmlkZW9IZWlnaHQpIHtcblx0XHRcdFx0dGhpcy52aWRlb1dpZHRoKCk7XG5cdFx0XHRcdHRoaXMudmlkZW9IZWlnaHQoKTtcblx0XHRcdFx0dGhpcy5lbWl0KCd2aWRlb1Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdFx0YXBwLmJpbmQodGhpcykoKTtcblx0XHR9KTtcblxuXHRcdGxldCB2aWRlb1NpemVDYWNoZSA9IHtcblx0XHRcdHc6IHRoaXMud2lkdGgoKSxcblx0XHRcdHg6IHRoaXMub2Zmc2V0WCgpLFxuXHRcdFx0eTogdGhpcy5vZmZzZXRZKCksXG5cdFx0XHRoOiB0aGlzLmhlaWdodCgpXG5cdFx0fVxuXHRcdGxldCBjaGVja1ZpZGVvUmVzaXplID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5fYm91bmRzID0gY29udGFpbmVyQm91bmRzKHRoaXMubWVkaWEpO1xuXHRcdFx0bGV0IHcgPSB0aGlzLndpZHRoKCk7XG5cdFx0XHRsZXQgaCA9IHRoaXMud2lkdGgoKTtcblx0XHRcdGxldCB4ID0gdGhpcy5vZmZzZXRYKCk7XG5cdFx0XHRsZXQgeSA9IHRoaXMub2Zmc2V0WSgpO1xuXHRcdFx0aWYgKHZpZGVvU2l6ZUNhY2hlLncgIT0gdyB8fCB2aWRlb1NpemVDYWNoZS5oICE9IGggfHwgdmlkZW9TaXplQ2FjaGUueCAhPSB4IHx8IHZpZGVvU2l6ZUNhY2hlLnkgIT0geSkge1xuXHRcdFx0XHR2aWRlb1NpemVDYWNoZS53ID0gdztcblx0XHRcdFx0dmlkZW9TaXplQ2FjaGUuaCA9IGg7XG5cdFx0XHRcdHZpZGVvU2l6ZUNhY2hlLnggPSB4O1xuXHRcdFx0XHR2aWRlb1NpemVDYWNoZS55ID0geTtcblx0XHRcdFx0dGhpcy5lbWl0KCdyZXNpemUnKTtcblx0XHRcdH1cblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2hlY2tWaWRlb1Jlc2l6ZSk7XG5cdFx0fVxuXG5cdFx0Y2hlY2tWaWRlb1Jlc2l6ZSgpO1xuXHR9XG5cblx0Y29udGV4dE1lbnUodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR2ID8gdGhpcy5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZuX2NvbnRleHRtZW51KSA6IHRoaXMubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmbl9jb250ZXh0bWVudSk7XG5cdFx0fVxuXHR9XG5cblx0YWpheChvcHRpb25zKSB7XG5cdFx0cmV0dXJuIGFqYXgob3B0aW9ucyk7XG5cdH1cblxuXHR2aWRlb1dpZHRoKHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb1dpZHRoKSB7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdGhpcy5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEud2lkdGg7XG5cdH1cblxuXHR2aWRlb0hlaWdodCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9IZWlnaHQpIHtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdGhpcy5tZWRpYS52aWRlb0hlaWdodDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdH1cblx0XHRpZiAoIWlzTmFOKHYpKSB7XG5cdFx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuaGVpZ2h0O1xuXHR9XG5cblx0c2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMudmlkZW9XaWR0aCgpIC8gdGhpcy52aWRlb0hlaWdodCgpO1xuXHR9XG5cblx0Ym91bmRzKHYpIHtcblx0XHRpZiAodGhpcy5fYm91bmRzW3ZdICE9PSBudWxsKSByZXR1cm4gdGhpcy5fYm91bmRzW3ZdO1xuXHRcdHJldHVybiB0aGlzLl9ib3VuZHM7XG5cdH1cblxuXHR3aWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ3dpZHRoJyk7XG5cdH1cblxuXHRoZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdoZWlnaHQnKTtcblx0fVxuXG5cdG9mZnNldFgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRYJyk7XG5cdH1cblxuXHRvZmZzZXRZKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnb2Zmc2V0WScpO1xuXHR9XG5cblx0d3JhcHBlckhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHR3cmFwcGVyV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGg7XG5cdH1cblxuXHR3cmFwcGVyU2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGggLyB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdGFkZENsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS5hZGRDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGRvbS5hZGRDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHR9XG5cdHJlbW92ZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS5yZW1vdmVDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLnJlbW92ZUNsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG5cdHRvZ2dsZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS50b2dnbGVDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLnRvZ2dsZUNsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG59O1xuXG4vL2Rpc2FibGUgb24gcHJvZHVjdGlvblxuaWYgKGRldmljZS5pc1RvdWNoKSB7XG5cdHdpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obWVzc2FnZSwgc2NyaXB0VXJsLCBsaW5lLCBjb2x1bW4pIHtcblx0XHRjb25zb2xlLmxvZyhsaW5lLCBjb2x1bW4sIG1lc3NhZ2UpO1xuXHRcdGFsZXJ0KGxpbmUgKyBcIjpcIiArIGNvbHVtbiArIFwiLVwiICsgbWVzc2FnZSk7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGttbFBsYXllcjsiXSwibmFtZXMiOlsiYmFiZWxIZWxwZXJzLnR5cGVvZiIsImRlZmF1bHRzIiwiRXZlbnRzIiwiX2RvYyIsImZuX2NvbnRleHRtZW51IiwiaW5JZnJhbWUiLCJpbkZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7O0lBQWdCLGFBQVc7QUFDdkIsSUFBQSxRQUFJLFdBQVcsQ0FBZjtBQUNBLElBQUEs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