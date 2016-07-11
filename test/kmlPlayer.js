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
    	classCallCheck(this, Container);

    	var playerPaused = false;
    	var isVisible = false;
    	var externalControls = false;
    	var body = dom.select('.body', el);
    	var elDimension = function elDimension() {
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

    	this.hide = function () {
    		if (isVisible) {
    			dom.addClass(el, 'hidden');
    			setTimeout(function () {
    				el.style.display = "none";
    				if (isFunction(opts.onHide)) opts.onHide();
    			}, 250);
    			if (opts.pause) {
    				if (!playerPaused) {
    					player.play();
    				}
    				isVisible = false;
    				if (externalControls && opts.externalControls) {
    					player.externalControls.enabled(true);
    				}
    			}
    			ctx.checkVisibleElements();
    		}
    	};
    	this.show = function () {
    		if (!isVisible) {
    			ctx.enabled(true);
    			el.style.display = "block";
    			setTimeout(function () {
    				dom.removeClass(el, 'hidden');
    				if (isFunction(opts.onHide)) opts.onShow();
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
    				if (v == 0) v = false;
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
    			var container = new Container(kmlContainer, settings, this, ctx);
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
                if (typeof element === 'undefined') {
                    if (this.iframe) {
                        element = this.iframe;
                    } else {
                        element = this.wrapper;
                    }
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
                if (this.iframe) {
                    element = this.iframe;
                } else {
                    element = this.wrapper;
                }
            }
            this.scrollPosition.save();
            // let style = window.getComputedStyle(element);
            var style = element.style;
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
            this.isFullWindow = function () {
                return true;
            };
        };

        Fullscreen.prototype.requestFullScreen = function requestFullScreen(element) {
            if (typeof element === 'undefined') {
                if (this.iframe) {
                    element = this.iframe;
                } else {
                    element = this.wrapper;
                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy9wb2x5ZmlsbHMvcmVxdWVzdEFuaW1hdGlvbkZyYW1lLmpzIiwiLi4vc3JjL2hlbHBlcnMvaW5GcmFtZS5qcyIsIi4uL3NyYy9oZWxwZXJzL2RlZXBtZXJnZS5qcyIsIi4uL3NyYy9oZWxwZXJzL3V0aWxzLmpzIiwiLi4vc3JjL2hlbHBlcnMvZG9tLmpzIiwiLi4vc3JjL2hlbHBlcnMvZGV2aWNlLmpzIiwiLi4vc3JjL2NvcmUvYXV0b0ZvbnQuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvYWRhcHRpdmVTaXplUG9zLmpzIiwiLi4vc3JjL2NvcmUvY29udGFpbmVyL3JlbGF0aXZlU2l6ZVBvcy5qcyIsIi4uL3NyYy9jb3JlL2NvbnRhaW5lci9jb250YWluZXIuanMiLCIuLi9zcmMvY29yZS9jb250YWluZXIvY29udGFpbmVycy5qcyIsIi4uL3NyYy9oZWxwZXJzL2Vycm9yLmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvZXZlbnRzL2luZGV4LmpzIiwiLi4vc3JjL2hlbHBlcnMvc2Nyb2xsUG9zaXRpb24uanMiLCIuLi9zcmMvY29yZS9mdWxsc2NyZWVuLmpzIiwiLi4vc3JjL2hlbHBlcnMvY2FuY2VsVmlkZW9OZXR3b3JrUmVxdWVzdC5qcyIsIi4uL3NyYy9oZWxwZXJzL21pbWVUeXBlLmpzIiwiLi4vc3JjL2NvcmUvbWVkaWEvaW5kZXguanMiLCIuLi9zcmMvaGVscGVycy9jb250YWluZXJCb3VuZHMuanMiLCIuLi9zcmMvaGVscGVycy9wYWdlVmlzaWJpbGl0eS5qcyIsIi4uL3NyYy9jb3JlL21lZGlhL2V2ZW50cy9leHRlcm5hbENvbnRyb2xzLmpzIiwiLi4vc3JjL2hlbHBlcnMvYWpheC5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG4gICAgZm9yKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG4gXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IC9pUChhZHxob25lfG9kKS4qT1MgNi8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpOyB9LCBcbiAgICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfTtcbiBcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH07XG59KCkpOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluSWZyYW1lKCkge1xuXHR0cnkge1xuXHRcdGxldCBpcyA9ICh3aW5kb3cuc2VsZiAhPT0gd2luZG93LnRvcCk7XG5cdFx0aWYgKGlzKSB7XG5cdFx0XHR2YXIgYXJyRnJhbWVzID0gcGFyZW50LmRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiSUZSQU1FXCIpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJGcmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGV0IGZyYW1lID0gYXJyRnJhbWVzW2ldO1xuXHRcdFx0XHRpZiAoZnJhbWUuY29udGVudFdpbmRvdyA9PT0gd2luZG93KSB7XG5cdFx0XHRcdFx0aXMgPSBmcmFtZTtcblx0XHRcdFx0XHRmcmFtZS5zZXRBdHRyaWJ1dGUoJ2FsbG93ZnVsbHNjcmVlbicsICd0cnVlJyk7XG5cdFx0XHRcdFx0ZnJhbWUuc2V0QXR0cmlidXRlKCdtb3phbGxvd2Z1bGxzY3JlZW4nLCAndHJ1ZScpO1xuXHRcdFx0XHRcdGZyYW1lLnNldEF0dHJpYnV0ZSgnd2Via2l0YWxsb3dmdWxsc2NyZWVuJywgJ3RydWUnKTtcblx0XHRcdFx0XHRmcmFtZS5zZXRBdHRyaWJ1dGUoJ2ZyYW1lYm9yZGVyJywgJzAnKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGlzO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24oKXtcblx0bGV0IGRlZXBtZXJnZSA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjKSB7XG5cdFx0aWYoc3JjKXtcblx0XHQgICAgdmFyIGFycmF5ID0gQXJyYXkuaXNBcnJheShzcmMpO1xuXHRcdCAgICB2YXIgZHN0ID0gYXJyYXkgJiYgW10gfHwge307XG5cblx0XHQgICAgaWYgKGFycmF5KSB7XG5cdFx0ICAgICAgICB0YXJnZXQgPSB0YXJnZXQgfHwgW107XG5cdFx0ICAgICAgICBkc3QgPSBkc3QuY29uY2F0KHRhcmdldCk7XG5cdFx0ICAgICAgICBzcmMuZm9yRWFjaChmdW5jdGlvbihlLCBpKSB7XG5cdFx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBkc3RbaV0gPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0ICAgICAgICAgICAgICAgIGRzdFtpXSA9IGU7XG5cdFx0ICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZSA9PT0gJ29iamVjdCcpIHtcblx0XHQgICAgICAgICAgICAgICAgZHN0W2ldID0gZGVlcG1lcmdlKHRhcmdldFtpXSwgZSk7XG5cdFx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0XHQgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5pbmRleE9mKGUpID09PSAtMSkge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0LnB1c2goZSk7XG5cdFx0ICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICB9XG5cdFx0ICAgICAgICB9KTtcblx0XHQgICAgfSBlbHNlIHtcblx0XHQgICAgICAgIGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpIHtcblx0XHQgICAgICAgICAgICBPYmplY3Qua2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHRhcmdldFtrZXldO1xuXHRcdCAgICAgICAgICAgIH0pXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgICBPYmplY3Qua2V5cyhzcmMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICAgICAgICAgIGlmICh0eXBlb2Ygc3JjW2tleV0gIT09ICdvYmplY3QnIHx8ICFzcmNba2V5XSkge1xuXHRcdCAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdCAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICBlbHNlIHtcblx0XHQgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRba2V5XSkge1xuXHRcdCAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcblx0XHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0XHQgICAgICAgICAgICAgICAgICAgIGRzdFtrZXldID0gZGVlcG1lcmdlKHRhcmdldFtrZXldLCBzcmNba2V5XSk7XG5cdFx0ICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICB9XG5cdFx0ICAgICAgICB9KTtcblx0XHQgICAgfVxuXHRcdCAgICByZXR1cm4gZHN0O1xuXHQgICAgfWVsc2V7XG5cdCAgICBcdHJldHVybiB0YXJnZXQgfHzCoFtdO1xuXHQgICAgfVxuXHR9XG5cdHJldHVybiBkZWVwbWVyZ2U7XG59KSgpOyIsImV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW0oc3RyaW5nKSB7XG5cdHJldHVybiBzdHJpbmcucmVwbGFjZSgvXlxccyt8XFxzKyQvZ20sICcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2VudEZyb21TdHJpbmcodil7XG5cdCBpZih2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRsZXQgdCA9IGZhbHNlO1xuXHRpZih2LmluZGV4T2Ype1xuXHRcdGlmKHYuaW5kZXhPZignJScpID4gLTEpXG5cdFx0e1xuXHRcdCAgdCA9IHBhcnNlRmxvYXQodik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZm4sIGRlbGF5KSB7XG5cdHZhciB0XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRjbGVhclRpbWVvdXQodClcblx0XHR0ID0gc2V0VGltZW91dChmbiwgZGVsYXkpXG5cdH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXJjZW50YWdlKGN1cnJlbnQsIG1heCkge1xuXHRpZiAoY3VycmVudCA9PT0gMCB8fCBtYXggPT09IDAgfHwgaXNOYU4oY3VycmVudCkgfHwgaXNOYU4obWF4KSkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cdHJldHVybiAoKGN1cnJlbnQgLyBtYXgpICogMTAwKS50b0ZpeGVkKDIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZEJpbmFyeWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1NlY29uZHModCkge1xuXHR2YXIgcyA9IDAuMDtcblx0aWYgKHQpIHtcblx0XHR2YXIgcCA9IHQuc3BsaXQoJzonKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspXG5cdFx0XHRzID0gcyAqIDYwICsgcGFyc2VGbG9hdChwW2ldLnJlcGxhY2UoJywnLCAnLicpKVxuXHR9XG5cdHJldHVybiBzO1xufVxuXG4vKipcbiAqIEZhc3RlciBTdHJpbmcgc3RhcnRzV2l0aCBhbHRlcm5hdGl2ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzcmMgLSBzb3VyY2Ugc3RyaW5nXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHN0ciAtIHRlc3Qgc3RyaW5nXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFydHNXaXRoKHNyYywgc3RyKSB7XG4gIHJldHVybiBzcmMuc2xpY2UoMCwgc3RyLmxlbmd0aCkgPT09IHN0clxufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgc3RyaW5nXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyh2KSB7XG4gIHJldHVybiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIG51bWVyaWNcbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyh2KXtcbiAgcmV0dXJuICFpc05hTih2KTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIHN0cmljdCBudW1lcmljXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmljdE51bWVyaWModil7XG4gIHJldHVybiAoaXNOYU4odikgJiYgdHlwZW9mIHYgPT09ICdudW1iZXInKVxufVxuXG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBib29sZWFuXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Jvb2xlYW4odil7XG4gIHJldHVybiAodHlwZW9mIHYgPT09ICdib29sZWFuJyk7XG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBmdW5jdGlvblxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZSAgIC8vIGF2b2lkIElFIHByb2JsZW1zXG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYW4gb2JqZWN0LCBleGNsdWRlIG51bGwuXG4gKiBOT1RFOiBVc2UgaXNPYmplY3QoeCkgJiYgIWlzQXJyYXkoeCkgdG8gZXhjbHVkZXMgYXJyYXlzLlxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qodikge1xuICByZXR1cm4gdiAmJiB0eXBlb2YgdiA9PT0gJ29iamVjdCcgICAgICAgICAvLyB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0J1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEga2luZCBvZiBhcnJheVxuICogQHBhcmFtICAgeyAqIH0gYSAtIGFueXRoaW5nXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaXMgJ2EnIGFuIGFycmF5P1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShhKSB7IHJldHVybiBBcnJheS5pc0FycmF5KGEpIHx8IGEgaW5zdGFuY2VvZiBBcnJheSB9XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBhcnJheSBjb250YWlucyBhbiBpdGVtXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gYXJyIC0gdGFyZ2V0IGFycmF5XG4gKiBAcGFyYW0gICB7ICogfSBpdGVtIC0gaXRlbSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSBEb2VzICdhcnInIGNvbnRhaW4gJ2l0ZW0nP1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnMoYXJyLCBpdGVtKSB7XG4gIHJldHVybiBhcnIuaW5kZXhPZihpdGVtKSA+IC0xO1xufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBzZXQgYW4gaW1tdXRhYmxlIHByb3BlcnR5XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGVsIC0gb2JqZWN0IHdoZXJlIHRoZSBuZXcgcHJvcGVydHkgd2lsbCBiZSBzZXRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0ga2V5IC0gb2JqZWN0IGtleSB3aGVyZSB0aGUgbmV3IHByb3BlcnR5IHdpbGwgYmUgc3RvcmVkXG4gKiBAcGFyYW0gICB7ICogfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBuZXcgcHJvcGVydHlcbiogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRpb25zIC0gc2V0IHRoZSBwcm9wZXJ5IG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgb3B0aW9uc1xuICogQHJldHVybnMgeyBPYmplY3QgfSAtIHRoZSBpbml0aWFsIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoZWwsIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsLCBrZXksIGV4dGVuZCh7XG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSwgb3B0aW9ucykpXG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIERldGVjdCB3aGV0aGVyIGEgcHJvcGVydHkgb2YgYW4gb2JqZWN0IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gIG9iaiAtIHNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gIGtleSAtIG9iamVjdCBwcm9wZXJ0eVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gaXMgdGhpcyBwcm9wZXJ0eSB3cml0YWJsZT9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV3JpdGFibGUob2JqLCBrZXkpIHtcbiAgdmFyIHByb3BzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSlcbiAgcmV0dXJuIHR5cGVvZiBvYmpba2V5XSA9PT0gVF9VTkRFRiB8fCBwcm9wcyAmJiBwcm9wcy53cml0YWJsZVxufVxuXG4vKipcbiAqIEV4dGVuZCBhbnkgb2JqZWN0IHdpdGggb3RoZXIgcHJvcGVydGllc1xuICogQHBhcmFtICAgeyBPYmplY3QgfSBzcmMgLSBzb3VyY2Ugb2JqZWN0XG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IHRoZSByZXN1bHRpbmcgZXh0ZW5kZWQgb2JqZWN0XG4gKlxuICogdmFyIG9iaiA9IHsgZm9vOiAnYmF6JyB9XG4gKiBleHRlbmQob2JqLCB7YmFyOiAnYmFyJywgZm9vOiAnYmFyJ30pXG4gKiBjb25zb2xlLmxvZyhvYmopID0+IHtiYXI6ICdiYXInLCBmb286ICdiYXInfVxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChzcmMpIHtcbiAgdmFyIG9iaiwgYXJncyA9IGFyZ3VtZW50c1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAob2JqID0gYXJnc1tpXSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGlzIHByb3BlcnR5IG9mIHRoZSBzb3VyY2Ugb2JqZWN0IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAgICAgICAgaWYgKGlzV3JpdGFibGUoc3JjLCBrZXkpKVxuICAgICAgICAgIHNyY1trZXldID0gb2JqW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNyY1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVGb250KGYsIHdpZHRoLCBlbCkge1xuXHR2YXIgciA9IGZhbHNlLCBsID0gZmFsc2U7XG5cdGlmKGYudW5pdHMgIT0gJ3B4JykgZi51bml0cyA9ICdlbSc7XG5cdGlmIChmLm1pbiAhPT0gZmFsc2UgJiYgZi5yYXRpbyAhPT0gZmFsc2UpIHtcblx0XHRyID0gZi5yYXRpbyAqIHdpZHRoIC8gMTAwMDtcblx0XHRpZiAociA8IGYubWluKSByID0gZi5taW47XG5cdFx0aWYgKGYudW5pdHMgPT0gJ3B4JykgciA9IE1hdGguY2VpbChyKTtcblx0XHRpZiAoIWlzTmFOKGYubGluZUhlaWdodCkgJiYgZi5saW5lSGVpZ2h0KSB7XG5cdFx0XHRsID0gciAqIGYubGluZUhlaWdodDtcblx0XHRcdGlmIChsIDwgMSkgbCA9IDE7XG5cdFx0XHRsID0gK2wudG9GaXhlZCgzKSArIGYudW5pdHM7XG5cdFx0fVxuXHRcdHIgPSArci50b0ZpeGVkKDMpICsgZi51bml0cztcblx0fVxuXHRpZihlbCl7XG5cdFx0aWYocikgZWwuc3R5bGUuZm9udFNpemUgPSByO1xuXHRcdGlmKGwpIGVsLnN0eWxlLmxpbmVIZWlnaHQgPSBsO1xuXHR9XG5cdHJldHVybiB7Zm9udFNpemU6IHIsIGxpbmVIZWlnaHQ6IGx9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQge307IiwiLyoqXG4gKiBAbW9kdWxlIGRvbVxuICogTW9kdWxlIGZvciBlYXNpbmcgdGhlIG1hbmlwdWxhdGlvbiBvZiBkb20gZWxlbWVudHNcbiAqL1xuXG5sZXQgY2xhc3NSZWcgPSBmdW5jdGlvbihjKSB7XG5cdHJldHVybiBuZXcgUmVnRXhwKFwiKF58XFxcXHMrKVwiICsgYyArIFwiKFxcXFxzK3wkKVwiKTtcbn07XG5cbmxldCBoYXNDbGFzc1xubGV0IGFkZENsYXNzXG5sZXQgcmVtb3ZlQ2xhc3M7XG5sZXQgdG9nZ2xlQ2xhc3M7XG5cbmlmICgnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcblx0aGFzQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0cmV0dXJuIGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGMpO1xuXHR9O1xuXHRhZGRDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRpZihjICE9IG51bGwpe1xuXHRcdFx0YyA9IGMuc3BsaXQoJyAnKTtcblx0XHRcdGZvciAodmFyIGsgaW4gYykgZWxlbS5jbGFzc0xpc3QuYWRkKGNba10pO1xuXHRcdH1cblx0fTtcblx0cmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0ZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuXHR9O1xufSBlbHNlIHtcblx0aGFzQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdFx0cmV0dXJuIGNsYXNzUmVnKGMpLnRlc3QoZWxlbS5jbGFzc05hbWUpO1xuXHR9O1xuXHRhZGRDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGMpIHtcblx0XHRpZiAoIWhhc0NsYXNzKGVsZW0sIGMpKSB7XG5cdFx0XHRlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lICsgJyAnICsgYztcblx0XHR9XG5cdH07XG5cdHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbSwgYykge1xuXHRcdGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUucmVwbGFjZShjbGFzc1JlZyhjKSwgJyAnKTtcblx0fTtcbn1cblxudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjKSB7XG5cdHZhciBmbiA9IGhhc0NsYXNzKGVsZW0sIGMpID8gcmVtb3ZlQ2xhc3MgOiBhZGRDbGFzcztcblx0Zm4oZWxlbSwgYyk7XG59O1xuXG5sZXQgZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lID0gZnVuY3Rpb24gZ2V0UHJlZml4ZWRTdHlsZVByb3BOYW1lKHByb3BOYW1lKSB7XG5cdHZhciBkb21QcmVmaXhlcyA9ICdXZWJraXQgTW96IG1zIE8nLnNwbGl0KCcgJyksXG5cdFx0ZWxTdHlsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZTtcblx0aWYgKGVsU3R5bGVbcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcm9wTmFtZTsgLy8gSXMgc3VwcG9ydGVkIHVucHJlZml4ZWRcblx0cHJvcE5hbWUgPSBwcm9wTmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BOYW1lLnN1YnN0cigxKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkb21QcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChlbFN0eWxlW2RvbVByZWZpeGVzW2ldICsgcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBkb21QcmVmaXhlc1tpXSArIHByb3BOYW1lOyAvLyBJcyBzdXBwb3J0ZWQgd2l0aCBwcmVmaXhcblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0c3R5bGVQcmVmaXg6IHtcblx0XHR0cmFuc2Zvcm06IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgndHJhbnNmb3JtJyksXG5cdFx0cGVyc3BlY3RpdmU6IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgncGVyc3BlY3RpdmUnKSxcblx0XHRiYWNrZmFjZVZpc2liaWxpdHk6IGdldFByZWZpeGVkU3R5bGVQcm9wTmFtZSgnYmFja2ZhY2VWaXNpYmlsaXR5Jylcblx0fSxcblx0dHJpZ2dlcldlYmtpdEhhcmR3YXJlQWNjZWxlcmF0aW9uOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0aWYgKHRoaXMuc3R5bGVQcmVmaXguYmFja2ZhY2VWaXNpYmlsaXR5ICYmIHRoaXMuc3R5bGVQcmVmaXgucGVyc3BlY3RpdmUpIHtcblx0XHRcdGVsZW1lbnQuc3R5bGVbdGhpcy5zdHlsZVByZWZpeC5wZXJzcGVjdGl2ZV0gPSAnMTAwMHB4Jztcblx0XHRcdGVsZW1lbnQuc3R5bGVbdGhpcy5zdHlsZVByZWZpeC5iYWNrZmFjZVZpc2liaWxpdHldID0gJ2hpZGRlbic7XG5cdFx0fVxuXHR9LFxuXHR0cmFuc2Zvcm06IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XG5cdFx0ZWxlbWVudC5zdHlsZVt0aGlzLnN0eWxlUHJlZml4LnRyYW5zZm9ybV0gPSB2YWx1ZTtcblx0fSxcblx0LyoqXG5cdCAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBtdWx0aXBsZSBub2RlcyBpbiB0aGUgRE9NXG5cdCAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSBET00gc2VsZWN0b3Jcblx0ICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0cyBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuXHQgKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlcyBmb3VuZFxuXHQgKi9cblx0c2VsZWN0QWxsOiBmdW5jdGlvbihzZWxlY3RvciwgY3R4KSB7XG5cdFx0cmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG5cdH0sXG5cdC8qKlxuXHQgKiBTaG9ydGVyIGFuZCBmYXN0IHdheSB0byBzZWxlY3QgYSBzaW5nbGUgbm9kZSBpbiB0aGUgRE9NXG5cdCAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSB1bmlxdWUgZG9tIHNlbGVjdG9yXG5cdCAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY3R4IC0gRE9NIG5vZGUgd2hlcmUgdGhlIHRhcmdldCBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuXHQgKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlIGZvdW5kXG5cdCAqL1xuXHRzZWxlY3Q6IGZ1bmN0aW9uKHNlbGVjdG9yLCBjdHgpIHtcblx0XHRyZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcilcblx0fSxcblx0aGFzQ2xhc3M6IGhhc0NsYXNzLFxuXHRhZGRDbGFzczogYWRkQ2xhc3MsXG5cdHJlbW92ZUNsYXNzOiByZW1vdmVDbGFzcyxcblx0dG9nZ2xlQ2xhc3M6IHRvZ2dsZUNsYXNzLFxuXHRhdXRvTGluZUhlaWdodDogZnVuY3Rpb24oZWwpIHtcblx0XHRsZXQgbCA9IGVsLm9mZnNldEhlaWdodCArIFwicHhcIjtcblx0XHRlbC5zdHlsZS5saW5lSGVpZ2h0ID0gbDtcblx0XHRyZXR1cm4gbDtcblx0fSxcblx0Y3JlYXRlRWxlbWVudDogZnVuY3Rpb24oZWxtLCBwcm9wcykge1xuXHRcdGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxtKTtcblx0XHRmb3IgKGxldCBrIGluIHByb3BzKSB7XG5cdFx0XHRlbC5zZXRBdHRyaWJ1dGUoaywgcHJvcHNba10pO1xuXHRcdH1cblx0XHRyZXR1cm4gZWw7XG5cdH0sXG5cdGVtcHR5RWxlbWVudDogZnVuY3Rpb24oZWxtKSB7XG5cdFx0d2hpbGUgKGVsbS5maXJzdENoaWxkKSB7XG5cdFx0XHRlbG0ucmVtb3ZlQ2hpbGQoZWxtLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0fSxcblx0cmVwbGFjZUVsZW1lbnQ6IGZ1bmN0aW9uKHRhcmdldCwgZWxtKSB7XG5cdFx0dGFyZ2V0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGVsbSwgdGFyZ2V0KTtcblx0fSxcblx0cmVtb3ZlRWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcblx0fSxcblx0aW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uKGVsLCByZWZlcmVuY2VOb2RlKSB7XG5cdFx0cmVmZXJlbmNlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZyk7XG5cdH0sXG5cdGluc2VydEJlZm9yZTogZnVuY3Rpb24oZWwsIHJlZmVyZW5jZU5vZGUpIHtcblx0XHRyZWZlcmVuY2VOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZlcmVuY2VOb2RlKTtcblx0fSxcblx0Z2V0VGV4dENvbnRlbnQ6IGZ1bmN0aW9uKGVsKSB7XG5cdFx0cmV0dXJuIGVsLnRleHRDb250ZW50IHx8IGVsLmlubmVyVGV4dDtcblx0fSxcblx0d3JhcDogZnVuY3Rpb24oZWxlbWVudHMsIHdyYXBwZXIpIHtcblx0XHQvLyBDb252ZXJ0IGBlbGVtZW50c2AgdG8gYW4gYXJyYXksIGlmIG5lY2Vzc2FyeS5cblx0XHRpZiAoIWVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0ZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuXHRcdH1cblxuXHRcdC8vIExvb3BzIGJhY2t3YXJkcyB0byBwcmV2ZW50IGhhdmluZyB0byBjbG9uZSB0aGUgd3JhcHBlciBvbiB0aGVcblx0XHQvLyBmaXJzdCBlbGVtZW50IChzZWUgYGNoaWxkYCBiZWxvdykuXG5cdFx0Zm9yICh2YXIgaSA9IGVsZW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHR2YXIgY2hpbGQgPSAoaSA+IDApID8gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSkgOiB3cmFwcGVyO1xuXHRcdFx0dmFyIGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcblxuXHRcdFx0Ly8gQ2FjaGUgdGhlIGN1cnJlbnQgcGFyZW50IGFuZCBzaWJsaW5nLlxuXHRcdFx0dmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0XHRcdHZhciBzaWJsaW5nID0gZWxlbWVudC5uZXh0U2libGluZztcblxuXHRcdFx0Ly8gV3JhcCB0aGUgZWxlbWVudCAoaXMgYXV0b21hdGljYWxseSByZW1vdmVkIGZyb20gaXRzIGN1cnJlbnRcblx0XHRcdC8vIHBhcmVudCkuXG5cdFx0XHRjaGlsZC5hcHBlbmRDaGlsZChlbGVtZW50KTtcblxuXHRcdFx0Ly8gSWYgdGhlIGVsZW1lbnQgaGFkIGEgc2libGluZywgaW5zZXJ0IHRoZSB3cmFwcGVyIGJlZm9yZVxuXHRcdFx0Ly8gdGhlIHNpYmxpbmcgdG8gbWFpbnRhaW4gdGhlIEhUTUwgc3RydWN0dXJlOyBvdGhlcndpc2UsIGp1c3Rcblx0XHRcdC8vIGFwcGVuZCBpdCB0byB0aGUgcGFyZW50LlxuXHRcdFx0aWYgKHNpYmxpbmcpIHtcblx0XHRcdFx0cGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgc2libGluZyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY2hpbGQ7XG5cdFx0fVxuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICBicm93c2VyOiAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5WZXIgPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbixcbiAgICAgIG5BZ3QgPSBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgYnJvd3Nlck5hbWUgPSBuYXZpZ2F0b3IuYXBwTmFtZSxcbiAgICAgIGZ1bGxWZXJzaW9uID0gJycgKyBwYXJzZUZsb2F0KG5hdmlnYXRvci5hcHBWZXJzaW9uKSxcbiAgICAgIG1ham9yVmVyc2lvbiA9IHBhcnNlSW50KG5hdmlnYXRvci5hcHBWZXJzaW9uLCAxMCksXG4gICAgICBuYW1lT2Zmc2V0LFxuICAgICAgdmVyT2Zmc2V0LFxuICAgICAgaXg7XG5cbiAgICAvLyBFREdFXG4gICAgaWYgKGJyb3dzZXJOYW1lID09IFwiTmV0c2NhcGVcIiAmJiBuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKCdUcmlkZW50JykgPiAtMSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIklFXCI7XG4gICAgICB2YXIgZWRnZSA9IG5BZ3QuaW5kZXhPZignRWRnZS8nKTtcbiAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcoZWRnZSArIDUsIG5BZ3QuaW5kZXhPZignLicsIGVkZ2UpKTtcbiAgICB9XG4gICAgLy8gTVNJRSAxMVxuICAgIGVsc2UgaWYgKChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiV2luZG93cyBOVFwiKSAhPT0gLTEpICYmIChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwicnY6MTFcIikgIT09IC0xKSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIklFXCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IFwiMTE7XCI7XG4gICAgfVxuICAgIC8vIE1TSUVcbiAgICBlbHNlIGlmICgodmVyT2Zmc2V0ID0gbkFndC5pbmRleE9mKFwiTVNJRVwiKSkgIT09IC0xKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiSUVcIjtcbiAgICAgIGZ1bGxWZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNSk7XG4gICAgfVxuICAgIC8vIENocm9tZVxuICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJDaHJvbWVcIikpICE9PSAtMSkge1xuICAgICAgYnJvd3Nlck5hbWUgPSBcIkNocm9tZVwiO1xuICAgICAgZnVsbFZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcbiAgICB9XG4gICAgLy8gU2FmYXJpXG4gICAgZWxzZSBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZihcIlNhZmFyaVwiKSkgIT09IC0xKSB7XG4gICAgICBicm93c2VyTmFtZSA9IFwiU2FmYXJpXCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuICAgICAgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJWZXJzaW9uXCIpKSAhPT0gLTEpIHtcbiAgICAgICAgZnVsbFZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRmlyZWZveFxuICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoXCJGaXJlZm94XCIpKSAhPT0gLTEpIHtcbiAgICAgIGJyb3dzZXJOYW1lID0gXCJGaXJlZm94XCI7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuICAgIH1cbiAgICAvLyBJbiBtb3N0IG90aGVyIGJyb3dzZXJzLCBcIm5hbWUvdmVyc2lvblwiIGlzIGF0IHRoZSBlbmQgb2YgdXNlckFnZW50XG4gICAgZWxzZSBpZiAoKG5hbWVPZmZzZXQgPSBuQWd0Lmxhc3RJbmRleE9mKCcgJykgKyAxKSA8ICh2ZXJPZmZzZXQgPSBuQWd0Lmxhc3RJbmRleE9mKCcvJykpKSB7XG4gICAgICBicm93c2VyTmFtZSA9IG5BZ3Quc3Vic3RyaW5nKG5hbWVPZmZzZXQsIHZlck9mZnNldCk7XG4gICAgICBmdWxsVmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDEpO1xuICAgICAgaWYgKGJyb3dzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT0gYnJvd3Nlck5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgICBicm93c2VyTmFtZSA9IG5hdmlnYXRvci5hcHBOYW1lO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUcmltIHRoZSBmdWxsVmVyc2lvbiBzdHJpbmcgYXQgc2VtaWNvbG9uL3NwYWNlIGlmIHByZXNlbnRcbiAgICBpZiAoKGl4ID0gZnVsbFZlcnNpb24uaW5kZXhPZihcIjtcIikpICE9PSAtMSkge1xuICAgICAgZnVsbFZlcnNpb24gPSBmdWxsVmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICAgIH1cbiAgICBpZiAoKGl4ID0gZnVsbFZlcnNpb24uaW5kZXhPZihcIiBcIikpICE9PSAtMSkge1xuICAgICAgZnVsbFZlcnNpb24gPSBmdWxsVmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICAgIH1cbiAgICAvLyBHZXQgbWFqb3IgdmVyc2lvblxuICAgIG1ham9yVmVyc2lvbiA9IHBhcnNlSW50KCcnICsgZnVsbFZlcnNpb24sIDEwKTtcbiAgICBpZiAoaXNOYU4obWFqb3JWZXJzaW9uKSkge1xuICAgICAgZnVsbFZlcnNpb24gPSAnJyArIHBhcnNlRmxvYXQobmF2aWdhdG9yLmFwcFZlcnNpb24pO1xuICAgICAgbWFqb3JWZXJzaW9uID0gcGFyc2VJbnQobmF2aWdhdG9yLmFwcFZlcnNpb24sIDEwKTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGRhdGFcbiAgICByZXR1cm4gW2Jyb3dzZXJOYW1lLCBtYWpvclZlcnNpb25dO1xuICB9KSgpLFxuICBpc0lFOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5icm93c2VyWzBdID09PSAnSUUnKSB7XG4gICAgICByZXR1cm4gdGhpcy5icm93c2VyWzFdO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGlzRmlyZWZveDogZnVuY3Rpb24oKXtcbiAgICBpZiAodGhpcy5icm93c2VyWzBdID09PSAnRmlyZWZveCcpIHtcbiAgICAgIHJldHVybiB0aGlzLmJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgaXNDaHJvbWU6IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMuYnJvd3NlclswXSA9PT0gJ0Nocm9tZScpIHtcbiAgICAgIHJldHVybiB0aGlzLmJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgaXNTYWZhcmk6IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMuYnJvd3NlclswXSA9PT0gJ1NhZmFyaScpIHtcbiAgICAgIHJldHVybiB0aGlzLmJyb3dzZXJbMV07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgaXNUb3VjaDogJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICBpc0lvczogLyhpUGFkfGlQaG9uZXxpUG9kKS9nLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKVxufSIsImltcG9ydCB7c2NhbGVGb250fSBmcm9tICcuLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi4vaGVscGVycy9kZWVwbWVyZ2UnO1xubGV0IGF1dG9Gb250ID0gZnVuY3Rpb24oZWwsIGZvbnQsIHBhcmVudCkge1xuXHRsZXQgX2VuYWJsZWQgPSBmYWxzZTtcblx0bGV0IF91cGRhdGUgPSBmdW5jdGlvbigpe1xuXHRcdHNjYWxlRm9udChmb250LCBwYXJlbnQud2lkdGgoKSwgZWwpO1xuXHR9XG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24odikge1xuXHRcdGlmKHYgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRpZighZm9udCl7IGZvbnQgPSB7cmF0aW86IDEsIG1pbjoxLCBsaW5lSGVpZ2h0OiBmYWxzZX0gfVxuXHRcdFx0Zm9udCA9IGRlZXBtZXJnZShmb250LCB2KTtcblx0XHRcdHJldHVybiBzY2FsZUZvbnQoZm9udCwgcGFyZW50LndpZHRoKCksIGVsKTtcblx0XHR9XG5cdH07XG5cdHRoaXMuZW5hYmxlZCA9ICBmdW5jdGlvbih2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicgJiYgZm9udCkge1xuXHRcdFx0X2VuYWJsZWQgPSB2O1xuXHRcdFx0Ly8gdiA/ICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgX3VwZGF0ZSwgZmFsc2UpLCBzY2FsZUZvbnQoZm9udCwgX3dpZHRoKCksIGVsKSkgOiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgX3VwZGF0ZSwgZmFsc2UpO1xuXHRcdH1cblx0XHRyZXR1cm4gX2VuYWJsZWQ7O1xuXHR9O1xuXHRpZihwYXJlbnQub24pe1xuXHRcdHBhcmVudC5vbigncmVzaXplJywgX3VwZGF0ZSk7XG5cdH07XG59XG5leHBvcnQgZGVmYXVsdCBhdXRvRm9udDsiLCJpbXBvcnQge1xuXHRwcm9jZW50RnJvbVN0cmluZyxcblx0ZGVib3VuY2Vcbn0gZnJvbSAnLi4vLi4vaGVscGVycy91dGlscyc7XG5pbXBvcnQgZG9tIGZyb20gJy4uLy4uL2hlbHBlcnMvZG9tJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi4vLi4vaGVscGVycy9kZWVwbWVyZ2UnO1xuXG5sZXQgZGVmYXVsdHMgPSB7XG5cdHg6IDAsXG5cdHk6IDAsXG5cdHdpZHRoOiAnMTAwJScsXG5cdGhlaWdodDogJzEwMCUnLFxuXHRmb250U2l6ZTogbnVsbCxcblx0bGluZUhlaWdodDogbnVsbCxcblx0b2Zmc2V0WDogMCxcblx0b2Zmc2V0WTogMCxcblx0b3JpZ2luUG9pbnQ6IFwidG9wTGVmdFwiLFxuXHR2aXNpYmxlOiBmYWxzZSxcblx0dHJhbnNmb3JtOiB7XG5cdFx0eDogbnVsbCxcblx0XHR5OiBudWxsXG5cdH0sXG5cdHRyYW5zbGF0ZTogdHJ1ZVxufVxuXG5sZXQgYWRhcHRpdmVTaXplUG9zID0gZnVuY3Rpb24oc2V0dHRpbmdzLCBwYXJlbnQpIHtcblx0bGV0IGJvdW5kcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRvZmZzZXRYOiBwYXJlbnQub2Zmc2V0WCgpLFxuXHRcdFx0b2Zmc2V0WTogcGFyZW50Lm9mZnNldFkoKSxcblx0XHRcdHdpZHRoOiBwYXJlbnQud2lkdGgoKSxcblx0XHRcdGhlaWdodDogcGFyZW50LmhlaWdodCgpLFxuXHRcdFx0c2NhbGU6IHBhcmVudC53aWR0aCgpIC8gcGFyZW50LnZpZGVvV2lkdGgoKSxcblx0XHRcdHNjYWxlWTogcGFyZW50LndpZHRoKCkgLyBwYXJlbnQudmlkZW9IZWlnaHQoKVxuXHRcdH1cblx0fTtcblx0bGV0IHZhdWx0ID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMCxcblx0XHR3aWR0aDogJzEwMCUnLFxuXHRcdGhlaWdodDogJzEwMCUnLFxuXHRcdGZvbnRTaXplOiBudWxsLFxuXHRcdGxpbmVIZWlnaHQ6IG51bGxcblx0fTtcblx0bGV0IHBhcmVudFdpZHRoID0gMDtcblx0bGV0IHBhcmVudEhlaWdodCA9IDA7XG5cdGxldCBwYXJlbnRYID0gMDtcblx0bGV0IHBhcmVudFkgPSAwO1xuXHRsZXQgZG9tRWxlbWVudCA9IG51bGw7XG5cdGxldCBzZXR0aW5ncyA9IGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dHRpbmdzKTtcblx0bGV0IF9hY3RpdmUgPSBmYWxzZTtcblxuXHRsZXQgdXBkYXRlRG9tRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChfYWN0aXZlICYmIGRvbUVsZW1lbnQgJiYgZG9tRWxlbWVudC5ub2RlVHlwZSkge1xuXHRcdFx0aWYgKHZhdWx0LndpZHRoICE9PSBudWxsKSBkb21FbGVtZW50LnN0eWxlLndpZHRoID0gdmF1bHQud2lkdGggKyBcInB4XCI7XG5cdFx0XHRpZiAodmF1bHQuaGVpZ2h0ICE9PSBudWxsKSBkb21FbGVtZW50LnN0eWxlLmhlaWdodCA9IHZhdWx0LmhlaWdodCArIFwicHhcIjtcblxuXHRcdFx0aWYgKGRvbS5zdHlsZVByZWZpeC50cmFuc2Zvcm0gJiYgc2V0dGluZ3MudHJhbnNsYXRlKSB7XG5cdFx0XHRcdGxldCB0cmFuc2Zvcm0gPSAnJztcblx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCAmJiB2YXVsdC55ICE9IG51bGwpIHtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCcgKyB2YXVsdC54ICsgJ3B4LCcgKyB2YXVsdC55ICsgJ3B4KSc7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5yaWdodCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudC5zdHlsZS50b3AgPSBcImF1dG9cIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxlZnQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUucmlnaHQgPSBcImF1dG9cIjtcblx0XHRcdFx0XHRcdHRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyB2YXVsdC54ICsgJ3B4KSc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh2YXVsdC55ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCJhdXRvXCI7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9IFwiYXV0b1wiO1xuXHRcdFx0XHRcdFx0dHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoJyArIHZhdWx0LnkgKyAncHgpJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZG9tLnRyYW5zZm9ybShkb21FbGVtZW50LCB0cmFuc2Zvcm0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHZhdWx0LnggIT0gbnVsbCAmJiB2YXVsdC55ICE9IG51bGwpIHtcblx0XHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxlZnQgPSB2YXVsdC54ICsgXCJweFwiO1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUudG9wID0gdmF1bHQueSArIFwicHhcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAodmF1bHQueCAhPSBudWxsKSBkb21FbGVtZW50LnN0eWxlLmxlZnQgPSB2YXVsdC54ICsgXCJweFwiO1xuXHRcdFx0XHRcdGlmICh2YXVsdC55ICE9IG51bGwpIGRvbUVsZW1lbnQuc3R5bGUudG9wID0gdmF1bHQueSArIFwicHhcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2V0dGluZ3MuZm9udFNpemUgIT09IHZhdWx0LmZvbnRTaXplKSB7XG5cdFx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB2YXVsdC5mb250U2l6ZSA9IHNldHRpbmdzLmZvbnRTaXplO1xuXG5cdFx0XHR9XG5cdFx0XHRpZiAoc2V0dGluZ3MubGluZUhlaWdodCAhPT0gdmF1bHQubGluZUhlaWdodCkge1xuXHRcdFx0XHRkb21FbGVtZW50LnN0eWxlLmxpbmVIZWlnaHQgPSB2YXVsdC5saW5lSGVpZ2h0ID0gc2V0dGluZ3MubGluZUhlaWdodDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRsZXQgdXBkYXRlUHJvcHMgPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgX3cgPSBwYXJlbnQud2lkdGgoKTtcblx0XHRsZXQgX2ggPSBwYXJlbnQuaGVpZ2h0KCk7XG5cdFx0bGV0IF94ID0gcGFyZW50Lm9mZnNldFgoKTtcblx0XHRsZXQgX3kgPSBwYXJlbnQub2Zmc2V0WSgpO1xuXHRcdGlmIChwYXJlbnRXaWR0aCAhPSBfdyB8fCBwYXJlbnRIZWlnaHQgIT0gX2ggfHwgX3ggIT0gcGFyZW50WCB8fCBfeSAhPSBwYXJlbnRZKSB7XG5cdFx0XHRwYXJlbnRXaWR0aCA9IF93O1xuXHRcdFx0cGFyZW50SGVpZ2h0ID0gX2g7XG5cdFx0XHRwYXJlbnRYID0gX3g7XG5cdFx0XHRwYXJlbnRZID0gX3k7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgYiA9IGJvdW5kcygpO1xuXG5cdFx0bGV0IHByb2NlbnRXaWR0aCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLndpZHRoKTtcblx0XHRpZiAocHJvY2VudFdpZHRoKSB7XG5cdFx0XHR2YXVsdC53aWR0aCA9IGIud2lkdGggKiBwcm9jZW50V2lkdGggLyAxMDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChzZXR0aW5ncy53aWR0aCAhPSBudWxsKSB7XG5cdFx0XHRcdHZhdWx0LndpZHRoID0gYi53aWR0aCAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhdWx0LndpZHRoID0gTWF0aC5jZWlsKHZhdWx0LndpZHRoKTtcblxuXHRcdGxldCBwcm9jZW50SGVpZ2h0ID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MuaGVpZ2h0KTtcblx0XHRpZiAocHJvY2VudEhlaWdodCkge1xuXHRcdFx0dmF1bHQuaGVpZ2h0ID0gYi5oZWlnaHQgKiBwcm9jZW50SGVpZ2h0IC8gMTAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoc2V0dGluZ3MuaGVpZ2h0ICE9IG51bGwpIHtcblx0XHRcdFx0dmF1bHQuaGVpZ2h0ID0gYi5oZWlnaHQgKiBiLnNjYWxlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXVsdC5oZWlnaHQgPSBNYXRoLmNlaWwodmF1bHQuaGVpZ2h0KTtcblxuXHRcdGlmIChzZXR0aW5ncy54ICE9IG51bGwpIHtcblx0XHRcdGxldCBwcm9jZW50WCA9IHByb2NlbnRGcm9tU3RyaW5nKHNldHRpbmdzLngpO1xuXHRcdFx0aWYgKHByb2NlbnRYKSB7XG5cdFx0XHRcdHZhdWx0LnggPSBiLm9mZnNldFggKyBiLndpZHRoICogcHJvY2VudFggLyAxMDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXVsdC54ID0gYi5vZmZzZXRYICsgc2V0dGluZ3MueCAqIGIuc2NhbGU7XG5cdFx0XHR9XG5cdFx0XHR2YXVsdC54ID0gTWF0aC5mbG9vcih2YXVsdC54KTtcblx0XHRcdGxldCB0cmFuc2Zvcm1YID0gcHJvY2VudEZyb21TdHJpbmcoc2V0dGluZ3MudHJhbnNmb3JtLngpO1xuXHRcdFx0aWYgKHRyYW5zZm9ybVgpIHZhdWx0LnggKz0gdHJhbnNmb3JtWCAqIHZhdWx0LndpZHRoIC8gMTAwO1xuXHRcdFx0aWYgKHNldHRpbmdzLm9mZnNldFgpIHZhdWx0LnggKz0gc2V0dGluZ3Mub2Zmc2V0WDtcblx0XHR9XG5cblx0XHRpZiAoc2V0dGluZ3MueSAhPSBudWxsKSB7XG5cdFx0XHRsZXQgcHJvY2VudFkgPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy55KTtcblx0XHRcdGlmIChwcm9jZW50WSkge1xuXHRcdFx0XHR2YXVsdC55ID0gYi5vZmZzZXRZICsgYi5oZWlnaHQgKiBwcm9jZW50WSAvIDEwMDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhdWx0LnkgPSBiLm9mZnNldFkgKyBzZXR0aW5ncy55ICogYi5zY2FsZTtcblx0XHRcdH1cblx0XHRcdHZhdWx0LnkgPSBNYXRoLmZsb29yKHZhdWx0LnkpO1xuXHRcdFx0bGV0IHRyYW5zZm9ybVkgPSBwcm9jZW50RnJvbVN0cmluZyhzZXR0aW5ncy50cmFuc2Zvcm0ueSk7XG5cdFx0XHRpZiAodHJhbnNmb3JtWSkgdmF1bHQueSArPSB0cmFuc2Zvcm1ZICogdmF1bHQud2lkdGggLyAxMDA7XG5cdFx0XHRpZiAoc2V0dGluZ3Mub2Zmc2V0WSkgdmF1bHQueSArPSBzZXR0aW5ncy5vZmZzZXRZO1xuXHRcdH1cblxuXHRcdHVwZGF0ZURvbUVsZW1lbnQoKTtcblx0fVxuXG5cdHRoaXMuYXBwbHlUbyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRpZiAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlKSB7XG5cdFx0XHRkb21FbGVtZW50ID0gZWxlbWVudDtcblx0XHRcdHVwZGF0ZVByb3BzKCk7XG5cdFx0fVxuXHRcdHJldHVybiBkb21FbGVtZW50O1xuXHR9XG5cblx0bGV0IGFwcGx5TmV3UHJvcHMgPSBmdW5jdGlvbigpIHtcblx0XHRpZihfYWN0aXZlKXtcblx0XHRcdHVwZGF0ZVByb3BzKCk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5kYXRhID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHZhdWx0O1xuXHR9XG5cblx0dGhpcy5zZXR0aW5ncyA9IGZ1bmN0aW9uKG5ld1NldHRpbmdzKSB7XG5cdFx0c2V0dGluZ3MgPSBkZWVwbWVyZ2Uoc2V0dGluZ3MsIG5ld1NldHRpbmdzKTtcblx0XHR1cGRhdGVQcm9wcygpO1xuXHRcdHJldHVybiBzZXR0aW5ncztcblx0fVxuXHR0aGlzLmVuYWJsZWQgPSBmdW5jdGlvbih2KSB7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcblx0XHRcdF9hY3RpdmUgPSB2O1xuXHRcdFx0aWYgKHYpIGFwcGx5TmV3UHJvcHMoKTtcblx0XHRcdC8vIHYgPyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgYXBwbHlOZXdQcm9wcywgZmFsc2UpIDogd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGFwcGx5TmV3UHJvcHMsIGZhbHNlKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9hY3RpdmU7XG5cdH07XG5cblx0aWYgKHBhcmVudC5vbikge1xuXHRcdHBhcmVudC5vbigncmVzaXplJywgYXBwbHlOZXdQcm9wcyk7XG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGFkYXB0aXZlU2l6ZVBvczsiLCJpbXBvcnQgZGVlcG1lcmdlIGZyb20gJy4uLy4uL2hlbHBlcnMvZGVlcG1lcmdlJztcbmltcG9ydCB7XG5cdHByb2NlbnRGcm9tU3RyaW5nXG59IGZyb20gJy4uLy4uL2hlbHBlcnMvdXRpbHMnO1xubGV0IGRlZmF1bHRzID0ge1xuXHR4OiAwLFxuXHR5OiAwLFxuXHR3aWR0aDogMCxcblx0aGVpZ2h0OiAwXG59XG5sZXQgcmVsYXRpdmVTaXplUG9zID0gZnVuY3Rpb24oY3R4LCBzZXR0aW5ncykge1xuXHRsZXQgcGFyZW50V2lkdGggPSBjdHgudmlkZW9XaWR0aCgpIHx8IGN0eC53aWR0aCB8fCAwO1xuXHRsZXQgcGFyZW50SGVpZ2h0ID0gY3R4LnZpZGVvSGVpZ2h0KCkgfHwgY3R4LmhlaWdodCB8fCAwO1xuXHRsZXQgbyA9IGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRsZXQgX3cgPSBwcm9jZW50RnJvbVN0cmluZyhvLndpZHRoKTtcblx0aWYgKCFfdykgX3cgPSBvLndpZHRoIC8gcGFyZW50V2lkdGggKiAxMDA7XG5cdGxldCBfaCA9IHByb2NlbnRGcm9tU3RyaW5nKG8uaGVpZ2h0KTtcblx0aWYgKCFfaCkgX2ggPSBvLmhlaWdodCAvIHBhcmVudEhlaWdodCAqIDEwMDtcblx0bGV0IF94ID0gcHJvY2VudEZyb21TdHJpbmcoby54KTtcblx0aWYgKCFfeCkgX3ggPSBvLnggLyBwYXJlbnRXaWR0aCAqIDEwMDtcblx0bGV0IF95ID0gcHJvY2VudEZyb21TdHJpbmcoby55KTtcblx0aWYgKCFfeSkgX3kgPSBvLnkgLyBwYXJlbnRIZWlnaHQgKiAxMDA7XG5cdHJldHVybiB7XG5cdFx0eDogX3gsXG5cdFx0eTogX3ksXG5cdFx0d2lkdGg6IF93LFxuXHRcdGhlaWdodDogX2ggXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IHJlbGF0aXZlU2l6ZVBvczsiLCJpbXBvcnQgZG9tIGZyb20gJy4uLy4uL2hlbHBlcnMvZG9tJztcbmltcG9ydCByZWxhdGl2ZVNpemVQb3MgZnJvbSAnLi9yZWxhdGl2ZVNpemVQb3MnO1xuaW1wb3J0IHtcblx0aXNGdW5jdGlvblxufSBmcm9tICcuLi8uLi9oZWxwZXJzL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGFpbmVyIHtcblx0Y29uc3RydWN0b3IoZWwsIG9wdHMsIGN0eCwgcGxheWVyKSB7XG5cdFx0bGV0IHBsYXllclBhdXNlZCA9IGZhbHNlO1xuXHRcdGxldCBpc1Zpc2libGUgPSBmYWxzZTtcblx0XHRsZXQgZXh0ZXJuYWxDb250cm9scyA9IGZhbHNlO1xuXHRcdGxldCBib2R5ID0gZG9tLnNlbGVjdCgnLmJvZHknLCBlbCk7XG5cdFx0bGV0IGVsRGltZW5zaW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRsZXQgZCA9IG5ldyByZWxhdGl2ZVNpemVQb3MocGxheWVyLCBvcHRzKTtcblx0XHRcdGJvZHkuc3R5bGUud2lkdGggPSBkLndpZHRoICsgXCIlXCI7XG5cdFx0XHRib2R5LnN0eWxlLmhlaWdodCA9IGQuaGVpZ2h0ICsgXCIlXCI7XG5cdFx0XHRpZiAoZG9tLnN0eWxlUHJlZml4LnRyYW5zZm9ybSkge1xuXHRcdFx0XHRkb20udHJhbnNmb3JtKGJvZHksICd0cmFuc2xhdGUoJyArIDEwMCAvIGQud2lkdGggKiBkLnggKyAnJSwnICsgMTAwIC8gZC5oZWlnaHQgKiBkLnkgKyAnJSknKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGJvZHkuc3R5bGUudG9wID0gZC54ICsgXCIlXCI7XG5cdFx0XHRcdGJvZHkuc3R5bGUubGVmdCA9IGQueSArIFwiJVwiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbERpbWVuc2lvbigpO1xuXHRcdHBsYXllci5vbigndmlkZW9SZXNpemUnLCBlbERpbWVuc2lvbik7XG5cblx0XHR0aGlzLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChpc1Zpc2libGUpIHtcblx0XHRcdFx0ZG9tLmFkZENsYXNzKGVsLCAnaGlkZGVuJyk7XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0XHRpZiAoaXNGdW5jdGlvbihvcHRzLm9uSGlkZSkpIG9wdHMub25IaWRlKCk7XG5cdFx0XHRcdH0sIDI1MCk7XG5cdFx0XHRcdGlmKG9wdHMucGF1c2Upe1xuXHRcdFx0XHRcdGlmICghcGxheWVyUGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIucGxheSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpc1Zpc2libGUgPSBmYWxzZTtcblx0XHRcdFx0XHRpZiAoZXh0ZXJuYWxDb250cm9scyAmJiBvcHRzLmV4dGVybmFsQ29udHJvbHMpIHtcblx0XHRcdFx0XHRcdHBsYXllci5leHRlcm5hbENvbnRyb2xzLmVuYWJsZWQodHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGN0eC5jaGVja1Zpc2libGVFbGVtZW50cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICghaXNWaXNpYmxlKSB7XG5cdFx0XHRcdGN0eC5lbmFibGVkKHRydWUpO1xuXHRcdFx0XHRlbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3MoZWwsICdoaWRkZW4nKTtcblx0XHRcdFx0XHRpZiAoaXNGdW5jdGlvbihvcHRzLm9uSGlkZSkpIG9wdHMub25TaG93KCk7XG5cdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0aWYob3B0cy5wYXVzZSl7XG5cdFx0XHRcdFx0aWYgKCFwbGF5ZXIucGF1c2VkKCkpIHtcblx0XHRcdFx0XHRcdHBsYXllclBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cGxheWVyLnBhdXNlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllclBhdXNlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlzVmlzaWJsZSA9IHRydWU7XG5cdFx0XHRcdGlmKG9wdHMuZXh0ZXJuYWxDb250cm9scyl7XG5cdFx0XHRcdFx0aWYgKHBsYXllci5leHRlcm5hbENvbnRyb2xzLmVuYWJsZWQoKSkge1xuXHRcdFx0XHRcdFx0ZXh0ZXJuYWxDb250cm9scyA9IHRydWU7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuZXh0ZXJuYWxDb250cm9scy5lbmFibGVkKGZhbHNlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZXh0ZXJuYWxDb250cm9scyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IG92ZXJsYXkgPSBkb20uc2VsZWN0KCcub3ZlcmxheScsIGVsKTtcblxuXHRcdHRoaXMuYmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24odikge1xuXHRcdFx0aWYgKHYgIT0gbnVsbCkge1xuXHRcdFx0XHRvdmVybGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHY7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdmVybGF5LnN0eWxlLmJhY2tncm91bmRDb2xvclxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuYmFja2dyb3VuZENvbG9yKCk7XG5cblx0XHRsZXQgY2xzRWxlbWVudHMgPSBkb20uc2VsZWN0QWxsKCcudHJpZ2dlckNsb3NlJywgZWwpO1xuXHRcdGZvciAodmFyIGkgPSAwLCBuID0gY2xzRWxlbWVudHMubGVuZ3RoOyBpIDwgbjsgaSArPSAxKSB7XG5cdFx0XHRjbHNFbGVtZW50c1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZSk7XG5cdFx0fVxuXG5cblx0XHRpZihvcHRzLnZpc2libGUpe1xuXHRcdFx0dGhpcy5zaG93KCk7XG5cdFx0fVxuXG5cdFx0dGhpcy52aXNpYmxlID0gZnVuY3Rpb24odil7XG5cdFx0XHRpZih0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSBpc1Zpc2libGUgPSB2O1xuXHRcdFx0cmV0dXJuIGlzVmlzaWJsZTtcblx0XHR9XG5cblx0fVxufSIsImltcG9ydCBkb20gZnJvbSAnLi4vLi4vaGVscGVycy9kb20nO1xuaW1wb3J0IGRlZXBtZXJnZSBmcm9tICcuLi8uLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQgYWRhcHRpdmVTaXplUG9zIGZyb20gJy4vYWRhcHRpdmVTaXplUG9zJztcbmltcG9ydCBDb250YWluZXIgZnJvbSAnLi9jb250YWluZXInXG5cbmxldCBkZWZhdWx0cyA9IHtcblx0YmFja2dyb3VuZENvbG9yOiAnJyxcblx0b25IaWRlOiBudWxsLFxuXHRvblNob3c6IG51bGwsXG5cdGV4dGVybmFsQ29udHJvbHM6IHRydWUsXG5cdHZpc2libGU6IGZhbHNlLFxuXHRwYXVzZTogdHJ1ZVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWluZXJzIHtcblx0Y29uc3RydWN0b3IoY3R4KSB7XG5cdFx0dGhpcy53cmFwcGVyID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdGNsYXNzOiAna21sQ29udGFpbmVycydcblx0XHR9KTtcblx0XHR0aGlzLl9lbHMgPSBbXTtcblx0XHRsZXQgYWMgPSBuZXcgYWRhcHRpdmVTaXplUG9zKHt9LCBjdHgpO1xuXHRcdGFjLmFwcGx5VG8odGhpcy53cmFwcGVyKTtcblxuXHRcdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKHYpe1xuXHRcdFx0aWYodiAhPSBudWxsKSB7XG5cdFx0XHRcdGlmKHYgPT0gMCkgdiA9IGZhbHNlO1xuXHRcdFx0XHRhYy5lbmFibGVkKHYpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFjLmVuYWJsZWQoKTtcblx0XHR9XG5cblx0XHR0aGlzLmNoZWNrVmlzaWJsZUVsZW1lbnRzID0gZnVuY3Rpb24oKXtcblx0XHRcdGxldCBubyA9IDA7XG5cdFx0XHRmb3IgKHZhciBrIGluIHRoaXMuX2Vscykge1xuXHRcdFx0XHRpZiAodGhpcy5fZWxzW2tdLnZpc2libGUoKSkge1xuXHRcdFx0XHRcdG5vKz0xO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmVuYWJsZWQobm8pO1xuXHRcdH1cblxuXHRcdGN0eC53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMud3JhcHBlcik7XG5cblxuXHRcdGxldCBjdXJyZW50VmlzaWJsZXMgPSBbXTtcblx0XHR0aGlzLmhpZGUgPSBmdW5jdGlvbihjdXJyZW50KSB7XG5cdFx0XHRmb3IgKHZhciBrIGluIHRoaXMuX2Vscykge1xuXHRcdFx0XHRsZXQgY3VycmVudENvbnRhaW5lciA9IHRoaXMuX2Vsc1trXTtcblx0XHRcdFx0aWYgKHRoaXMuX2Vsc1trXSAhPT0gY3VycmVudCkge1xuXHRcdFx0XHRcdGlmKGN1cnJlbnRDb250YWluZXIudmlzaWJsZSgpKXtcblx0XHRcdFx0XHRcdGN1cnJlbnRDb250YWluZXIuaGlkZSgpO1xuXHRcdFx0XHRcdFx0Y3VycmVudFZpc2libGVzLnB1c2goY3VycmVudENvbnRhaW5lcik7XG5cdFx0XHRcdFx0XHRjdXJyZW50Q29udGFpbmVyLnZpc2libGUoZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRmb3IgKHZhciBrIGluIGN1cnJlbnRWaXNpYmxlcykge1xuXHRcdFx0XHRjdXJyZW50VmlzaWJsZXNba10uc2hvdygpO1xuXHRcdFx0fVxuXHRcdFx0Y3VycmVudFZpc2libGVzID0gW107XG5cdFx0fVxuXG5cdFx0dGhpcy5hZGQgPSBmdW5jdGlvbihvcHRzLCBlbCA9IHt9KSB7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSBkZWVwbWVyZ2UoZGVmYXVsdHMsIG9wdHMpO1xuXHRcdFx0bGV0IGttbENvbnRhaW5lciA9IGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGN0eC5hZGRDbGFzcyhrbWxDb250YWluZXIsICdrbWxDb250YWluZXIgaGlkZGVuJyk7XG5cdFx0XHRsZXQga21sT3ZlcmxheSA9IGRvbS5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGN0eC5hZGRDbGFzcyhrbWxPdmVybGF5LCAnb3ZlcmxheSB0cmlnZ2VyQ2xvc2UnKTtcblx0XHRcdGxldCBrbWxDb250YWluZXJCb2R5ID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0aWYoZWwpe1xuXHRcdFx0XHRpZighZWwubm9kZVR5cGUpIHtcblx0XHRcdFx0XHRlbCA9IGttbENvbnRhaW5lckJvZHk7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGVsID0ga21sQ29udGFpbmVyQm9keTtcblx0XHRcdH1cblx0XHRcdGRvbS5hZGRDbGFzcyhlbCwgJ2JvZHknKTtcblx0XHRcdGttbENvbnRhaW5lci5hcHBlbmRDaGlsZChrbWxPdmVybGF5KTtcblx0XHRcdGttbENvbnRhaW5lci5hcHBlbmRDaGlsZChlbCk7XG5cdFx0XHRsZXQgY29udGFpbmVyID0gbmV3IENvbnRhaW5lcihrbWxDb250YWluZXIsIHNldHRpbmdzLCB0aGlzLCBjdHgpO1xuXHRcdFx0dGhpcy5fZWxzLnB1c2goY29udGFpbmVyKTtcblx0XHRcdHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZChrbWxDb250YWluZXIpO1xuXHRcdFx0cmV0dXJuIGNvbnRhaW5lcjtcblx0XHR9XG5cdH1cblx0ZWxzKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2Vsc1tpZF0gfHwgdGhpcy5fZWxzO1xuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRXJyb3JGb3JtYXRFeGNlcHRpb24obXNnKSB7XG4gICB0cnkge1xuXHQgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuXHR9IGNhdGNoIChlKSB7XG5cdCAgY29uc29sZS5sb2coZS5uYW1lICsgJzogJyArIGUubWVzc2FnZSk7XG5cdCAgcmV0dXJuO1xuXHR9XG59XG4iLCIvL2h0dHBzOi8vZ2l0aHViLmNvbS9wcmltdXMvZXZlbnRlbWl0dGVyM1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHByZWZpeCA9ICd+JztcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgYSBzdG9yYWdlIGZvciBvdXIgYEVFYCBvYmplY3RzLlxuICogQW4gYEV2ZW50c2AgaW5zdGFuY2UgaXMgYSBwbGFpbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhcmUgZXZlbnQgbmFtZXMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRXZlbnRzKCkge31cblxuLy9cbi8vIFdlIHRyeSB0byBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYC4gSW4gc29tZSBlbmdpbmVzIGNyZWF0aW5nIGFuXG4vLyBpbnN0YW5jZSBpbiB0aGlzIHdheSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCBkaXJlY3RseS5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBjaGFyYWN0ZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Rcbi8vIG92ZXJyaWRkZW4gb3IgdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy9cbmlmIChPYmplY3QuY3JlYXRlKSB7XG4gIEV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vXG4gIC8vIFRoaXMgaGFjayBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgYF9fcHJvdG9fX2AgcHJvcGVydHkgaXMgc3RpbGwgaW5oZXJpdGVkIGluXG4gIC8vIHNvbWUgb2xkIGJyb3dzZXJzIGxpa2UgQW5kcm9pZCA0LCBpUGhvbmUgNS4xLCBPcGVyYSAxMSBhbmQgU2FmYXJpIDUuXG4gIC8vXG4gIGlmICghbmV3IEV2ZW50cygpLl9fcHJvdG9fXykgcHJlZml4ID0gZmFsc2U7XG59XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdGhpcy5mbiA9IGZuO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIE1pbmltYWwgYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlIHRoYXQgaXMgbW9sZGVkIGFnYWluc3QgdGhlIE5vZGUuanNcbiAqIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IGxpc3RpbmcgdGhlIGV2ZW50cyBmb3Igd2hpY2ggdGhlIGVtaXR0ZXIgaGFzIHJlZ2lzdGVyZWRcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICB2YXIgbmFtZXMgPSBbXVxuICAgICwgZXZlbnRzXG4gICAgLCBuYW1lO1xuXG4gIGlmICh0aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgcmV0dXJuIG5hbWVzO1xuXG4gIGZvciAobmFtZSBpbiAoZXZlbnRzID0gdGhpcy5fZXZlbnRzKSkge1xuICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgcmV0dXJuIG5hbWVzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGV2ZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGV4aXN0cyBPbmx5IGNoZWNrIGlmIHRoZXJlIGFyZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7QXJyYXl8Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKGV2ZW50LCBleGlzdHMpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnRcbiAgICAsIGF2YWlsYWJsZSA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChleGlzdHMpIHJldHVybiAhIWF2YWlsYWJsZTtcbiAgaWYgKCFhdmFpbGFibGUpIHJldHVybiBbXTtcbiAgaWYgKGF2YWlsYWJsZS5mbikgcmV0dXJuIFthdmFpbGFibGUuZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXZhaWxhYmxlLmxlbmd0aCwgZWUgPSBuZXcgQXJyYXkobCk7IGkgPCBsOyBpKyspIHtcbiAgICBlZVtpXSA9IGF2YWlsYWJsZVtpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogQ2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGV2ZW50IGhhZCBsaXN0ZW5lcnMsIGVsc2UgYGZhbHNlYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVycy5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgNDogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMiwgYTMpOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoIWFyZ3MpIGZvciAoaiA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBhcmdzW2ogLSAxXSA9IGFyZ3VtZW50c1tqXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uYXBwbHkobGlzdGVuZXJzW2ldLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcylcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBvbmUtdGltZSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMsIHRydWUpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIHRoaXMuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbdGhpcy5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsaXN0ZW5lcnMgb2YgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IG1hdGNoIHRoaXMgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBoYXZlIHRoaXMgY29udGV4dC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmUtdGltZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiB0aGlzO1xuICBpZiAoIWZuKSB7XG4gICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKFxuICAgICAgICAgbGlzdGVuZXJzLmZuID09PSBmblxuICAgICAgJiYgKCFvbmNlIHx8IGxpc3RlbmVycy5vbmNlKVxuICAgICAgJiYgKCFjb250ZXh0IHx8IGxpc3RlbmVycy5jb250ZXh0ID09PSBjb250ZXh0KVxuICAgICkge1xuICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgZXZlbnRzID0gW10sIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4gIT09IGZuXG4gICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSlcbiAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgICAvL1xuICAgIGlmIChldmVudHMubGVuZ3RoKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gICAgZWxzZSBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzLCBvciB0aG9zZSBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0O1xuXG4gIGlmIChldmVudCkge1xuICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG4gICAgaWYgKHRoaXMuX2V2ZW50c1tldnRdKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBBbGlhcyBtZXRob2RzIG5hbWVzIGJlY2F1c2UgcGVvcGxlIHJvbGwgbGlrZSB0aGF0LlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4vL1xuLy8gVGhpcyBmdW5jdGlvbiBkb2Vzbid0IGFwcGx5IGFueW1vcmUuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgcHJlZml4LlxuLy9cbkV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RW1pdHRlcjsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblx0bGV0IHggPSAwO1xuXHRsZXQgeSA9IDA7XG5cdHRoaXMuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHggPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgMDtcblx0XHR5ID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IDA7XG5cdH1cblx0dGhpcy5yZXN0b3JlID0gZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LnNjcm9sbFRvKHgsIHkpXG5cdH1cbn0iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4vbWVkaWEvZXZlbnRzL2luZGV4JztcbmltcG9ydCBzY3JvbGxQb3NpdGlvbiBmcm9tICcuLi9oZWxwZXJzL3Njcm9sbFBvc2l0aW9uJztcbi8vIEZ1bGxzY3JlZW4gQVBJXG5sZXQgc3VwcG9ydHNGdWxsU2NyZWVuID0gZmFsc2U7XG5sZXQgYnJvd3NlclByZWZpeGVzID0gJ3dlYmtpdCBtb3ogbyBtcyBraHRtbCcuc3BsaXQoJyAnKTtcbmxldCBwcmVmaXhGUyA9ICcnO1xuLy9DaGVjayBmb3IgbmF0aXZlIHN1cHBvcnRcbmlmICh0eXBlb2YgZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzdXBwb3J0c0Z1bGxTY3JlZW4gPSB0cnVlO1xufSBlbHNlIHtcbiAgICAvLyBDaGVjayBmb3IgZnVsbHNjcmVlbiBzdXBwb3J0IGJ5IHZlbmRvciBwcmVmaXhcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBicm93c2VyUHJlZml4ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBwcmVmaXhGUyA9IGJyb3dzZXJQcmVmaXhlc1tpXTtcblxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50W3ByZWZpeEZTICsgJ0NhbmNlbEZ1bGxTY3JlZW4nXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIE1TICh3aGVuIGlzbid0IGl0PylcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4gIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVuYWJsZWQpIHtcbiAgICAgICAgICAgIHByZWZpeEZTID0gJ21zJztcbiAgICAgICAgICAgIHN1cHBvcnRzRnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbmxldCBldmVudENoYW5nZSA9IChwcmVmaXhGUyA9PT0gJycpID8gJ2Z1bGxzY3JlZW5jaGFuZ2UnIDogcHJlZml4RlMgKyAocHJlZml4RlMgPT0gJ21zJyA/ICdmdWxsc2NyZWVuY2hhbmdlJyA6ICdmdWxsc2NyZWVuY2hhbmdlJyk7XG5ldmVudENoYW5nZSA9IGV2ZW50Q2hhbmdlLnRvTG93ZXJDYXNlKCk7XG4vL3N1cHBvcnRzRnVsbFNjcmVlbiA9IGZhbHNlO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVsbHNjcmVlbiBleHRlbmRzIEV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoaW5JZnJhbWUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZnJhbWUgPSBpbklmcmFtZTtcbiAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbiA9IG5ldyBzY3JvbGxQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZSA9IHt9O1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgZm5GdWxsc2NyZWVuQ2hhbmdlID0gKCk9PntcbiAgICAgICAgICAgICAgICBpZighdGhpcy5pc0Z1bGxTY3JlZW4oKSl7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5zY3JvbGxQb3NpdGlvbi5yZXN0b3JlLDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudENoYW5nZSwgZm5GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25GdWxsc2NyZWVuQ2hhbmdlKGV2dCl7XG4gICAgICAgIC8vaW52ZXN0aWdhdGUgaWYgbmF0aXZlIHZpZGVvIGZ1bGxzY3JlZW4gY2FuIGJlIG92ZXJ3cml0dGVuXG4gICAgICAgIHRoaXMubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcihldmVudENoYW5nZSwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbjtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgfVxuICAgIGlzRnVsbFdpbmRvdygpe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlzRnVsbFNjcmVlbihlbGVtZW50KSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlmcmFtZSl7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmlmcmFtZTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMud3JhcHBlcjsgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChwcmVmaXhGUykge1xuICAgICAgICAgICAgICAgIGNhc2UgJyc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA9PSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGNhc2UgJ21veic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCA9PSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudFtwcmVmaXhGUyArICdGdWxsc2NyZWVuRWxlbWVudCddID09IGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXF1ZXN0RnVsbFdpbmRvdyhlbGVtZW50KXtcbiAgICAgICAgaWYgKHRoaXMuaXNGdWxsV2luZG93KCkgfHwgdGhpcy5pc0Z1bGxTY3JlZW4oKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaWZyYW1lKXtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5pZnJhbWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGhpcy53cmFwcGVyOyAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uLnNhdmUoKTtcbiAgICAgICAgLy8gbGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgICAgIGxldCBzdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsncG9zaXRpb24nXSA9IHN0eWxlLnBvc2l0aW9uIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWFyZ2luJ10gPSBzdHlsZS5tYXJnaW4gfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd0b3AnXSA9IHN0eWxlLnRvcCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ2xlZnQnXSA9IHN0eWxlLmxlZnQgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWyd3aWR0aCddID0gc3R5bGUud2lkdGggfHwgXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlWydoZWlnaHQnXSA9IHN0eWxlLmhlaWdodCB8fCBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGVbJ3pJbmRleCddID0gc3R5bGUuekluZGV4IHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWF4V2lkdGgnXSA9IHN0eWxlLm1heFdpZHRoIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbkVsZW1lbnRTdHlsZVsnbWF4SGVpZ2h0J10gPSBzdHlsZS5tYXhIZWlnaHQgfHwgXCJcIjtcblxuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IGVsZW1lbnQuc3R5bGUubGVmdCA9IDA7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luID0gMDtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5tYXhXaWR0aCA9IGVsZW1lbnQuc3R5bGUubWF4SGVpZ2h0ID0gZWxlbWVudC5zdHlsZS53aWR0aCA9IGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuekluZGV4ID0gMjE0NzQ4MzY0NztcblxuICAgICAgICB0aGlzLl9mdWxsc2NyZWVuRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuaXNGdWxsV2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZih0aGlzLmlmcmFtZSl7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuaWZyYW1lO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMud3JhcHBlcjsgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN1cHBvcnRzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbi5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKCkgOiBlbGVtZW50W3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnUmVxdWVzdEZ1bGxzY3JlZW4nIDogJ1JlcXVlc3RGdWxsU2NyZWVuJyldKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RGdWxsV2luZG93KGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhbmNlbEZ1bGxXaW5kb3coKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Z1bGxXaW5kb3coKSB8fCB0aGlzLmlzRnVsbFNjcmVlbigpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLmZ1bGxzY3JlZW5FbGVtZW50U3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50LnN0eWxlW2tdID0gdGhpcy5mdWxsc2NyZWVuRWxlbWVudFN0eWxlW2tdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Z1bGxzY3JlZW5FbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc0Z1bGxXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbi5yZXN0b3JlKCk7XG4gICAgfVxuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKSB7XG4gICAgICAgIGlmIChzdXBwb3J0c0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4RlMgPT09ICcnKSA/IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKSA6IGRvY3VtZW50W3ByZWZpeEZTICsgKHByZWZpeEZTID09ICdtcycgPyAnRXhpdEZ1bGxzY3JlZW4nIDogJ0NhbmNlbEZ1bGxTY3JlZW4nKV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRnVsbFdpbmRvdygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZ2dsZUZ1bGxXaW5kb3coZWxlbWVudCl7XG4gICAgICAgIGxldCBpc0Z1bGxzY3JlZW4gPSAhdGhpcy5pc0Z1bGxXaW5kb3coKTtcbiAgICAgICAgaWYgKGlzRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0RnVsbFdpbmRvdyhlbGVtZW50KTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWxGdWxsV2luZG93KCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2dnbGVGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGlzRnVsbHNjcmVlbiA9ICF0aGlzLmlzRnVsbFNjcmVlbigpO1xuICAgICAgICBpZiAoaXNGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQpO1xuICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bGxzY3JlZW5FbGVtZW50KCkge1xuICAgICAgICBpZiAoc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeEZTID09PSAnJykgPyBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA6IGRvY3VtZW50W3ByZWZpeEZTICsgJ0Z1bGxzY3JlZW5FbGVtZW50J107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnVsbHNjcmVlbkVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG59OyIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWVkaWEpIHtcblx0Ly8gUmVtb3ZlIGNoaWxkIHNvdXJjZXNcblx0dmFyIHNvdXJjZXMgPSBkb20uc2VsZWN0QWxsKCdzb3VyY2UnLCBtZWRpYSk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGRvbS5yZW1vdmVFbGVtZW50KHNvdXJjZXNbaV0pO1xuXHR9XG5cblx0Ly8gU2V0IGJsYW5rIHZpZGVvIHNyYyBhdHRyaWJ1dGVcblx0Ly8gVGhpcyBpcyB0byBwcmV2ZW50IGEgTUVESUFfRVJSX1NSQ19OT1RfU1VQUE9SVEVEIGVycm9yXG5cdC8vIFNtYWxsIG1wNDogaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvc21hbGwvYmxvYi9tYXN0ZXIvbXA0Lm1wNFxuXHQvLyBJbmZvOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyMjMxNTc5L2hvdy10by1wcm9wZXJseS1kaXNwb3NlLW9mLWFuLWh0bWw1LXZpZGVvLWFuZC1jbG9zZS1zb2NrZXQtb3ItY29ubmVjdGlvblxuXHRtZWRpYS5zZXRBdHRyaWJ1dGUoJ3NyYycsICdkYXRhOnZpZGVvL21wNDtiYXNlNjQsQUFBQUhHWjBlWEJwYzI5dEFBQUNBR2x6YjIxcGMyOHliWEEwTVFBQUFBaG1jbVZsQUFBQUdtMWtZWFFBQUFHekFCQUhBQUFCdGhCZ1VZSTl0KzhBQUFNTmJXOXZkZ0FBQUd4dGRtaGtBQUFBQU1YTXZ2ckZ6TDc2QUFBRDZBQUFBQ29BQVFBQUFRQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FBQUJocGIyUnpBQUFBQUJDQWdJQUhBRS8vLy8vKy93QUFBaUYwY21GckFBQUFYSFJyYUdRQUFBQVB4Y3krK3NYTXZ2b0FBQUFCQUFBQUFBQUFBQ29BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFCQUFBQUFBQWdBQUFBSUFBQUFBQUc5YldScFlRQUFBQ0J0Wkdoa0FBQUFBTVhNdnZyRnpMNzZBQUFBR0FBQUFBRVZ4d0FBQUFBQUxXaGtiSElBQUFBQUFBQUFBSFpwWkdVQUFBQUFBQUFBQUFBQUFBQldhV1JsYjBoaGJtUnNaWElBQUFBQmFHMXBibVlBQUFBVWRtMW9aQUFBQUFFQUFBQUFBQUFBQUFBQUFDUmthVzVtQUFBQUhHUnlaV1lBQUFBQUFBQUFBUUFBQUF4MWNtd2dBQUFBQVFBQUFTaHpkR0pzQUFBQXhITjBjMlFBQUFBQUFBQUFBUUFBQUxSdGNEUjJBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FDQUJJQUFBQVNBQUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR1AvL0FBQUFYbVZ6WkhNQUFBQUFBNENBZ0UwQUFRQUVnSUNBUHlBUkFBQUFBQU1OUUFBQUFBQUZnSUNBTFFBQUFiQUJBQUFCdFlrVEFBQUJBQUFBQVNBQXhJMklBTVVBUkFFVVF3QUFBYkpNWVhaak5UTXVNelV1TUFhQWdJQUJBZ0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUFCQUFBQUFRQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUFVYzNSemVnQUFBQUFBQUFBU0FBQUFBUUFBQUJSemRHTnZBQUFBQUFBQUFBRUFBQUFzQUFBQVlIVmtkR0VBQUFCWWJXVjBZUUFBQUFBQUFBQWhhR1JzY2dBQUFBQUFBQUFBYldScGNtRndjR3dBQUFBQUFBQUFBQUFBQUFBcmFXeHpkQUFBQUNPcGRHOXZBQUFBRzJSaGRHRUFBQUFCQUFBQUFFeGhkbVkxTXk0eU1TNHgnKTtcblxuXHQvLyBMb2FkIHRoZSBuZXcgZW1wdHkgc291cmNlXG5cdC8vIFRoaXMgd2lsbCBjYW5jZWwgZXhpc3RpbmcgcmVxdWVzdHNcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TZWx6L3BseXIvaXNzdWVzLzE3NFxuXHRtZWRpYS5sb2FkKCk7XG5cblx0Ly8gRGVidWdnaW5nXG5cdGNvbnNvbGUubG9nKFwiQ2FuY2VsbGVkIG5ldHdvcmsgcmVxdWVzdHMgZm9yIG9sZCBtZWRpYVwiKTtcbn0iLCJleHBvcnQgZnVuY3Rpb24gbWltZUF1ZGlvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wNCc6XG4gICAgICAgICAgICByZXR1cm4gISEobWVkaWEuY2FuUGxheVR5cGUgJiYgbWVkaWEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgICAgIGNhc2UgJ2F1ZGlvL21wZWcnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAnYXVkaW8vd2F2JzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2OyBjb2RlY3M9XCIxXCInKS5yZXBsYWNlKC9uby8sICcnKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWltZVZpZGVvKG1lZGlhLCB0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ3ZpZGVvL3dlYm0nOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby93ZWJtOyBjb2RlY3M9XCJ2cDgsIHZvcmJpc1wiJykucmVwbGFjZSgvbm8vLCAnJykpO1xuICAgICAgICBjYXNlICd2aWRlby9tcDQnOlxuICAgICAgICAgICAgcmV0dXJuICEhKG1lZGlhLmNhblBsYXlUeXBlICYmIG1lZGlhLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFLCBtcDRhLjQwLjJcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICAgICAgY2FzZSAndmlkZW8vb2dnJzpcbiAgICAgICAgICAgIHJldHVybiAhIShtZWRpYS5jYW5QbGF5VHlwZSAmJiBtZWRpYS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL25vLywgJycpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHt9IiwiaW1wb3J0IGVycm9yIGZyb20gJy4uLy4uL2hlbHBlcnMvZXJyb3InO1xuaW1wb3J0IEZ1bGxzY3JlZW4gZnJvbSAnLi4vZnVsbHNjcmVlbic7XG5pbXBvcnQgX2NhbmNlbFJlcXVlc3RzIGZyb20gJy4uLy4uL2hlbHBlcnMvY2FuY2VsVmlkZW9OZXR3b3JrUmVxdWVzdCc7XG5pbXBvcnQge21pbWVWaWRlb30gZnJvbSAnLi4vLi4vaGVscGVycy9taW1lVHlwZSc7XG5cbi8vaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxubGV0IF9ldmVudHMgPSBbJ2VuZGVkJywgJ3Byb2dyZXNzJywgJ3N0YWxsZWQnLCAncGxheWluZycsICd3YWl0aW5nJywgJ2NhbnBsYXknLCAnY2FucGxheXRocm91Z2gnLCAnbG9hZHN0YXJ0JywgJ2xvYWRlZGRhdGEnLCAnbG9hZGVkbWV0YWRhdGEnLCAndGltZXVwZGF0ZScsICd2b2x1bWVjaGFuZ2UnLCAncGxheScsICdwbGF5aW5nJywgJ3BhdXNlJywgJ2Vycm9yJywgJ3NlZWtpbmcnLCAnZW1wdGllZCcsICdzZWVrZWQnLCAncmF0ZWNoYW5nZScsICdzdXNwZW5kJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lZGlhIGV4dGVuZHMgRnVsbHNjcmVlbiB7XG5cdGNvbnN0cnVjdG9yKGVsLGluSWZyYW1lKSB7XG5cdFx0c3VwZXIoaW5JZnJhbWUpO1xuXHRcdGlmKGVsID09IG51bGwpe1xuXHRcdFx0ZXJyb3IoXCJZb3UgbmVlZCB0byBzdXBwbHkgYSBIVE1MVmlkZW9FbGVtZW50IHRvIGluc3RhbnRpYXRlIHRoZSBwbGF5ZXJcIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMubWVkaWEgPSBlbDtcblx0XHRfZXZlbnRzLmZvckVhY2goKGspID0+IHtcblx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoaywgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmVtaXQoayk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuY2FuUGxheSA9IHtcblx0XHRcdG1wNDogbWltZVZpZGVvKGVsLCd2aWRlby9tcDQnKSxcblx0XHRcdHdlYm06IG1pbWVWaWRlbyhlbCwndmlkZW8vd2VibScpLFxuXHRcdFx0b2dnOiBtaW1lVmlkZW8oZWwsJ3ZpZGVvL29nZycpXG5cdFx0fVxuXHR9XG5cblx0LyoqKiBHbG9iYWwgYXR0cmlidXRlcyAqL1xuXG5cdC8qIEEgQm9vbGVhbiBhdHRyaWJ1dGU7IGlmIHNwZWNpZmllZCwgdGhlIHZpZGVvIGF1dG9tYXRpY2FsbHkgYmVnaW5zIHRvIHBsYXkgYmFjayBhcyBzb29uIGFzIGl0IGNhbiBkbyBzbyB3aXRob3V0IHN0b3BwaW5nIHRvIGZpbmlzaCBsb2FkaW5nIHRoZSBkYXRhLiBJZiBub3QgcmV0dXJuIHRoZSBhdW9wbGF5IGF0dHJpYnV0ZS4gKi9cblx0YXV0b3BsYXkodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmF1dG9wbGF5ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuYXV0b3BsYXk7XG5cdH1cblxuXHQvKiBSZXR1cm5zIHRoZSB0aW1lIHJhbmdlcyBvZiB0aGUgYnVmZmVyZWQgbWVkaWEuIFRoaXMgYXR0cmlidXRlIGNvbnRhaW5zIGEgVGltZVJhbmdlcyBvYmplY3QgKi9cblx0YnVmZmVyZWQoKcKgIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5idWZmZXJlZDtcblx0fVxuXG5cdC8qIElmIHRoaXMgYXR0cmlidXRlIGlzIHByZXNlbnQsIHRoZSBicm93c2VyIHdpbGwgb2ZmZXIgY29udHJvbHMgdG8gYWxsb3cgdGhlIHVzZXIgdG8gY29udHJvbCB2aWRlbyBwbGF5YmFjaywgaW5jbHVkaW5nIHZvbHVtZSwgc2Vla2luZywgYW5kIHBhdXNlL3Jlc3VtZSBwbGF5YmFjay4gV2hlbiBub3Qgc2V0IHJldHVybnMgaWYgdGhlIGNvbnRyb2xzIGFyZSBwcmVzZW50ICovXG5cdG5hdGl2ZUNvbnRyb2xzKHYpIHtcblx0XHRpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuXHRcdFx0dGhpcy5tZWRpYS5jb250cm9scyA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNvbnRyb2xzO1xuXHR9XG5cblx0LyogYW5vbnltb3VzLCB1c2UtY3JlZGVudGlhbHMsIGZhbHNlICovXG5cdGNyb3Nzb3JpZ2luKHYpIHtcblx0XHRpZiAodiA9PT0gJ3VzZS1jcmVkZW50aWFscycpIHtcblx0XHRcdHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSAndXNlLWNyZWRlbnRpYWxzJztcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRpZiAodikge1xuXHRcdFx0dGhpcy5tZWRpYS5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuXHRcdFx0cmV0dXJuICdhbm9ueW1vdXMnO1xuXHRcdH1cblx0XHRpZiAodiA9PT0gZmFsc2UpIHRoaXMubWVkaWEuY3Jvc3NPcmlnaW4gPSBudWxsO1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmNyb3NzT3JpZ2luO1xuXHR9XG5cblx0LyogQSBCb29sZWFuIGF0dHJpYnV0ZTsgaWYgc3BlY2lmaWVkLCB3ZSB3aWxsLCB1cG9uIHJlYWNoaW5nIHRoZSBlbmQgb2YgdGhlIHZpZGVvLCBhdXRvbWF0aWNhbGx5IHNlZWsgYmFjayB0byB0aGUgc3RhcnQuICovXG5cdGxvb3Aodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLmxvb3AgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5sb29wO1xuXHR9XG5cblx0LypBIEJvb2xlYW4gYXR0cmlidXRlIHdoaWNoIGluZGljYXRlcyB0aGUgZGVmYXVsdCBzZXR0aW5nIG9mIHRoZSBhdWRpbyBjb250YWluZWQgaW4gdGhlIHZpZGVvLiBJZiBzZXQsIHRoZSBhdWRpbyB3aWxsIGJlIGluaXRpYWxseSBzaWxlbmNlZC4gSXRzIGRlZmF1bHQgdmFsdWUgaXMgZmFsc2UsIG1lYW5pbmcgdGhhdCB0aGUgYXVkaW8gd2lsbCBiZSBwbGF5ZWQgd2hlbiB0aGUgdmlkZW8gaXMgcGxheWVkKi9cblx0bXV0ZWQodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR0aGlzLm1lZGlhLm11dGVkID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEubXV0ZWQ7XG5cdH1cblxuXHQvKiBNdXRlIHRoZSB2aWRlbyAqL1xuXHRtdXRlKCkge1xuXHRcdHRoaXMubXV0ZWQodHJ1ZSk7XG5cdH1cblxuXHQvKiBVbk11dGUgdGhlIHZpZGVvICovXG5cdHVubXV0ZSgpIHtcblx0XHR0aGlzLm11dGVkKGZhbHNlKTtcblx0fVxuXG5cdC8qIFRvZ2dsZSB0aGUgbXV0ZWQgc3RhbmNlIG9mIHRoZSB2aWRlbyAqL1xuXHR0b2dnbGVNdXRlKCkge1xuXHRcdHJldHVybiB0aGlzLm11dGVkKCF0aGlzLm11dGVkKCkpO1xuXHR9XG5cblx0LyogUmV0dXJucyBBIFRpbWVSYW5nZXMgb2JqZWN0IGluZGljYXRpbmcgYWxsIHRoZSByYW5nZXMgb2YgdGhlIHZpZGVvIHRoYXQgaGF2ZSBiZWVuIHBsYXllZC4qL1xuXHRwbGF5ZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucGxheWVkO1xuXHR9XG5cblx0Lypcblx0VGhpcyBlbnVtZXJhdGVkIGF0dHJpYnV0ZSBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgaGludCB0byB0aGUgYnJvd3NlciBhYm91dCB3aGF0IHRoZSBhdXRob3IgdGhpbmtzIHdpbGwgbGVhZCB0byB0aGUgYmVzdCB1c2VyIGV4cGVyaWVuY2UuIEl0IG1heSBoYXZlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczpcblx0XHRub25lOiBpbmRpY2F0ZXMgdGhhdCB0aGUgdmlkZW8gc2hvdWxkIG5vdCBiZSBwcmVsb2FkZWQuXG5cdFx0bWV0YWRhdGE6IGluZGljYXRlcyB0aGF0IG9ubHkgdmlkZW8gbWV0YWRhdGEgKGUuZy4gbGVuZ3RoKSBpcyBmZXRjaGVkLlxuXHRcdGF1dG86IGluZGljYXRlcyB0aGF0IHRoZSB3aG9sZSB2aWRlbyBmaWxlIGNvdWxkIGJlIGRvd25sb2FkZWQsIGV2ZW4gaWYgdGhlIHVzZXIgaXMgbm90IGV4cGVjdGVkIHRvIHVzZSBpdC5cblx0dGhlIGVtcHR5IHN0cmluZzogc3lub255bSBvZiB0aGUgYXV0byB2YWx1ZS5cblx0Ki9cblx0cHJlbG9hZCh2KSB7XG5cdFx0aWYgKHYgPT09ICdtZXRhZGF0YScgfHwgdiA9PT0gXCJtZXRhXCIpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdtZXRhZGF0YSc7XG5cdFx0XHRyZXR1cm4gJ21ldGFkYXRhJztcblx0XHR9XG5cdFx0aWYgKHYpIHtcblx0XHRcdHRoaXMubWVkaWEucHJlbG9hZCA9ICdhdXRvJztcblx0XHRcdHJldHVybiAnYXV0byc7XG5cdFx0fVxuXHRcdGlmICh2ID09PSBmYWxzZSkge1xuXHRcdFx0dGhpcy5tZWRpYS5wcmVsb2FkID0gJ25vbmUnO1xuXHRcdFx0cmV0dXJuICdub25lJztcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEucHJlbG9hZDtcblx0fVxuXG5cdC8qIEdpdmVzIG9yIHJldHVybnMgdGhlIGFkZHJlc3Mgb2YgYW4gaW1hZ2UgZmlsZSB0aGF0IHRoZSB1c2VyIGFnZW50IGNhbiBzaG93IHdoaWxlIG5vIHZpZGVvIGRhdGEgaXMgYXZhaWxhYmxlLiBUaGUgYXR0cmlidXRlLCBpZiBwcmVzZW50LCBtdXN0IGNvbnRhaW4gYSB2YWxpZCBub24tZW1wdHkgVVJMIHBvdGVudGlhbGx5IHN1cnJvdW5kZWQgYnkgc3BhY2VzICovXG5cdHBvc3Rlcih2KSB7XG5cdFx0aWYgKHYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5tZWRpYS5wb3N0ZXIgPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wb3N0ZXI7XG5cdH1cblxuXHQvKiBUaGUgc3JjIHByb3BlcnR5IHNldHMgb3IgcmV0dXJucyB0aGUgY3VycmVudCBzb3VyY2Ugb2YgdGhlIGF1ZGlvL3ZpZGVvLCBUaGUgc291cmNlIGlzIHRoZSBhY3R1YWwgbG9jYXRpb24gKFVSTCkgb2YgdGhlIGF1ZGlvL3ZpZGVvIGZpbGUgKi9cblx0c3JjKHYpIHtcblx0XHRpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRfY2FuY2VsUmVxdWVzdHModGhpcy5tZWRpYSk7XG5cdFx0XHRpZih2IGluc3RhbmNlb2YgQXJyYXkpe1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwLCBuID0gdi5sZW5ndGg7IGkrPTE7KXtcblx0XHRcdFx0XHRpZih2W2ldWyd0eXBlJ10gPT09IFwidmlkZW8vbXA0XCIgJiYgdGhpcy5jYW5QbGF5Lm1wNCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL3dlYm1cIiAmJiB0aGlzLmNhblBsYXkud2VibSl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5zcmMgPSB2W2ldWydzcmMnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodltpXVsndHlwZSddID09PSBcInZpZGVvL29nZ1wiICYmIHRoaXMuY2FuUGxheS5vZ2cpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubWVkaWEuc3JjID0gdltpXVsnc3JjJ107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZSBpZih2LnNyYyAmJiB2LnR5cGUpe1xuXHRcdFx0XHR0aGlzLm1lZGlhLnNyYyA9IHYuc3JjO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHRoaXMubWVkaWEuc3JjID0gdjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50U3JjO1xuXHR9XG5cblx0LyoqKiBHbG9iYWwgRXZlbnRzICovXG5cblx0LyogU3RhcnRzIHBsYXlpbmcgdGhlIGF1ZGlvL3ZpZGVvICovXG5cdHBsYXkoKSB7XG5cdFx0dGhpcy5tZWRpYS5wbGF5KCk7XG5cdH1cblxuXHQvKiBQYXVzZXMgdGhlIGN1cnJlbnRseSBwbGF5aW5nIGF1ZGlvL3ZpZGVvICovXG5cdHBhdXNlKCkge1xuXHRcdHRoaXMubWVkaWEucGF1c2UoKTtcblx0fVxuXG5cdC8qIFJldHVybiB0aGUgY3VycmVudGx5IHBsYXlpbmcgc3RhdHVzIG9mIGF1ZGlvL3ZpZGVvICovXG5cdHBhdXNlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5wYXVzZWQ7XG5cdH1cblxuXHQvKiBSZXR1cm4gdGhlIGN1cnJlbnRseSBwbGF5aW5nIHN0YXR1cyBvZiBhdWRpby92aWRlbyAqL1xuXHRwbGF5aW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLnBhdXNlZDtcblx0fVxuXG5cdC8qIFRvZ2dsZSBwbGF5L3BhdXNlIGZvciB0aGUgYXVkaW8vdmlkZW8gKi9cblx0dG9nZ2xlUGxheSgpIHtcblx0XHR0aGlzLm1lZGlhLnBhdXNlZCA/IHRoaXMucGxheSgpIDogdGhpcy5wYXVzZSgpO1xuXHR9XG5cblx0Y3VycmVudFRpbWUodikge1xuXHRcdGlmICh2ID09PSBudWxsIHx8IGlzTmFOKHYpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50VGltZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiB0aGlzLm1lZGlhLmR1cmF0aW9uKSB7XG5cdFx0XHR2ID0gdGhpcy5tZWRpYS5kdXJhdGlvbjtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS5jdXJyZW50VGltZSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH1cblxuXHRzZWVrKHYpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50VGltZSh2KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBbUmUtbG9hZHMgdGhlIGF1ZGlvL3ZpZGVvIGVsZW1lbnQsIHVwZGF0ZSB0aGUgYXVkaW8vdmlkZW8gZWxlbWVudCBhZnRlciBjaGFuZ2luZyB0aGUgc291cmNlIG9yIG90aGVyIHNldHRpbmdzXVxuXHQgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cblx0ICovXG5cdGxvYWQodikge1xuXHRcdGlmICh2ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuc3JjKHYpO1xuXHRcdH1cblx0XHR0aGlzLm1lZGlhLmxvYWQoKTtcblx0fVxuXG5cdGR1cmF0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmR1cmF0aW9uO1xuXHR9XG5cblx0dm9sdW1lKHYpIHtcblx0XHQvLyBSZXR1cm4gY3VycmVudCB2b2x1bWUgaWYgdmFsdWUgXG5cdFx0aWYgKHYgPT09IG51bGwgfHwgaXNOYU4odikpIHtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZvbHVtZTtcblx0XHR9XG5cdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0aWYgKHYgPiAxKSB7XG5cdFx0XHR2ID0gMTtcblx0XHR9XG5cdFx0aWYgKHYgPCAwKSB7XG5cdFx0XHR2ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5tZWRpYS52b2x1bWUgPSB2O1xuXHRcdHJldHVybiB2O1xuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCl7XG5cdGxldCBzY2FsZSA9IDA7XG5cdGxldCBib3VuZHMgPSBmdW5jdGlvbihlbCwgdXBkYXRlU2NhbGUpIHtcblx0XHRpZiggdXBkYXRlU2NhbGUgIT09IHVuZGVmaW5lZCkgc2NhbGUgPSB1cGRhdGVTY2FsZTtcblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdHdyYXBwZXJXaWR0aDogZWwub2Zmc2V0V2lkdGgsXG5cdFx0XHR3cmFwcGVySGVpZ2h0OiBlbC5vZmZzZXRIZWlnaHQsXG5cdFx0XHRzY2FsZTogc2NhbGUgfHwgKGVsLndpZHRoL2VsLmhlaWdodCksXG5cdFx0XHR3aWR0aDogMCxcblx0XHRcdGhlaWdodDogMCxcblx0XHRcdG9mZnNldFg6IDAsXG5cdFx0XHRvZmZzZXRZOiAwXG5cdFx0fVxuXHRcdGRhdGFbJ3dyYXBwZXJTY2FsZSddID0gZGF0YS53cmFwcGVyV2lkdGggLyBkYXRhLndyYXBwZXJIZWlnaHQ7XG5cdFx0aWYgKGRhdGEud3JhcHBlclNjYWxlID4gZGF0YS5zY2FsZSkge1xuXHRcdFx0ZGF0YS5oZWlnaHQgPSBkYXRhLndyYXBwZXJIZWlnaHQ7XG5cdFx0XHRkYXRhLndpZHRoID0gZGF0YS5zY2FsZSAqIGRhdGEuaGVpZ2h0O1xuXHRcdFx0ZGF0YS5vZmZzZXRYID0gKGRhdGEud3JhcHBlcldpZHRoIC0gZGF0YS53aWR0aCkgLyAyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkYXRhLndpZHRoID0gZGF0YS53cmFwcGVyV2lkdGg7XG5cdFx0XHRkYXRhLmhlaWdodCA9IGRhdGEud2lkdGggLyBkYXRhLnNjYWxlO1xuXHRcdFx0ZGF0YS5vZmZzZXRZID0gKGRhdGEud3JhcHBlckhlaWdodCAtIGRhdGEuaGVpZ2h0KSAvIDI7XG5cdFx0fVxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cdHJldHVybiBib3VuZHM7XG59KSgpOyIsInZhciBfZG9jID0gZG9jdW1lbnQgfHwge307XG4vLyBTZXQgdGhlIG5hbWUgb2YgdGhlIGhpZGRlbiBwcm9wZXJ0eSBhbmQgdGhlIGNoYW5nZSBldmVudCBmb3IgdmlzaWJpbGl0eVxudmFyIGhpZGRlbiwgdmlzaWJpbGl0eUNoYW5nZTtcbmlmICh0eXBlb2YgX2RvYy5oaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gT3BlcmEgMTIuMTAgYW5kIEZpcmVmb3ggMTggYW5kIGxhdGVyIHN1cHBvcnQgXG5cdGhpZGRlbiA9IFwiaGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcInZpc2liaWxpdHljaGFuZ2VcIjtcbn0gZWxzZSBpZiAodHlwZW9mIF9kb2MubW96SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwibW96SGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1venZpc2liaWxpdHljaGFuZ2VcIjtcbn0gZWxzZSBpZiAodHlwZW9mIF9kb2MubXNIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aGlkZGVuID0gXCJtc0hpZGRlblwiO1xuXHR2aXNpYmlsaXR5Q2hhbmdlID0gXCJtc3Zpc2liaWxpdHljaGFuZ2VcIjtcbn0gZWxzZSBpZiAodHlwZW9mIF9kb2Mud2Via2l0SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGhpZGRlbiA9IFwid2Via2l0SGlkZGVuXCI7XG5cdHZpc2liaWxpdHlDaGFuZ2UgPSBcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIjtcbn1cblxuY29uc3QgaXNBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICEodHlwZW9mIF9kb2NbaGlkZGVuXSA9PT0gXCJ1bmRlZmluZWRcIik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhZ2VWaXNpYmlsaXR5KF9tZWRpYSwgc2V0dGluZ3MgPSB7fSkge1xuXHRsZXQgX2F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlKCk7XG5cdGlmIChfYXZhaWxhYmxlKSB7XG5cdFx0bGV0IF9lbmFibGVkID0gZmFsc2U7XG5cdFx0bGV0IF9wbGF5aW5nID0gZmFsc2U7XG5cdFx0bGV0IHBhdXNlZCA9IGZhbHNlO1xuXHRcdGxldCBzZXRGbGFnUGxheWluZyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0X3BsYXlpbmcgPSB0cnVlO1xuXHRcdH07XG5cdFx0bGV0IGV2ZW50cyA9IHtcblx0XHRcdHZpc2libGU6IGZ1bmN0aW9uKCl7fSxcblx0XHRcdGhpZGRlbjogZnVuY3Rpb24oKXt9XG5cdFx0fTtcblx0XHRsZXQgZGVzdHJveVZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcblx0XHRcdGV2ZW50cyA9IHtcblx0XHRcdFx0dmlzaWJsZTogZnVuY3Rpb24oKXt9LFxuXHRcdFx0XHRoaWRkZW46IGZ1bmN0aW9uKCl7fVxuXHRcdFx0fTtcblx0XHRcdF9lbmFibGVkID0gZmFsc2U7XG5cdFx0XHRfcGxheWluZyA9IGZhbHNlO1xuXHRcdFx0X2RvYy5yZW1vdmVFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcblx0XHRcdF9tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgc2V0RmxhZ1BsYXlpbmcpO1xuXHRcdH1cblx0XHRsZXQgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKF9lbmFibGVkKSB7XG5cdFx0XHRcdGlmIChfZG9jW2hpZGRlbl0pIHtcblx0XHRcdFx0XHRpZiAoX3BsYXlpbmcgJiYgIV9tZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdF9tZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnRzLmhpZGRlbigpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChwYXVzZWQgJiYgX21lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0X21lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudHMudmlzaWJsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBpbml0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uIGluaXRWaXNpYmlsaXR5KHNldHRpbmdzKSB7XG5cdFx0XHRpZiAoX2F2YWlsYWJsZSkge1xuXHRcdFx0XHRfZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdFx0XHRfbWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHRcdFx0XG5cdFx0XHRcdGV2ZW50cy52aXNpYmxlID0gc2V0dGluZ3Mub25WaXNpYmxlIHx8IGV2ZW50cy52aXNpYmxlO1xuXHRcdFx0XHRldmVudHMuaGlkZGVuID0gc2V0dGluZ3Mub25IaWRkZW4gfHwgZXZlbnRzLmhpZGRlbjtcblx0XHRcdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHRfZG9jLmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xuXHRcdFx0XHRfbWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHNldEZsYWdQbGF5aW5nKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZXZlbnRzLnZpc2libGUgPSBzZXR0aW5ncy5vblZpc2libGUgfHwgZXZlbnRzLnZpc2libGU7XG5cdFx0ZXZlbnRzLmhpZGRlbiA9IHNldHRpbmdzLm9uSGlkZGVuIHx8IGV2ZW50cy5oaWRkZW47XG5cdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdF9kb2MuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG5cdFx0X21lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBzZXRGbGFnUGxheWluZyk7XG5cblx0XHR0aGlzLmluaXQgPSBpbml0VmlzaWJpbGl0eTtcblx0XHR0aGlzLmRlc3Ryb3kgPSBkZXN0cm95VmlzaWJpbGl0eTtcblx0XHR0aGlzLm9uID0gZnVuY3Rpb24oZXZlbnQsZm4pIHtcblx0XHRcdGlmIChldmVudCBpbiBldmVudHMpIGV2ZW50c1tldmVudF0gPSBmbjtcblx0XHR9O1xuXHRcdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSBfZW5hYmxlZCA9IHY7XG5cdFx0XHRyZXR1cm4gX2VuYWJsZWQ7XG5cdFx0fVxuXHR9O1xufTsiLCJsZXQgX2RvYyA9IGRvY3VtZW50IHx8IHt9O1xubGV0IGV4dGVybmFsQ29udHJvbHMgPSBmdW5jdGlvbihlbCkge1xuXHRsZXQgX2VuYWJsZWQgPSB0cnVlO1xuXHRsZXQgX3NlZWsgPSB0cnVlO1xuXHRsZXQgX3RJZCA9IG51bGw7XG5cdGxldCBtZWRpYSA9IGVsO1xuXHRsZXQga2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoX2VuYWJsZWQpIHtcblx0XHRcdC8vYnlwYXNzIGRlZmF1bHQgbmF0aXZlIGV4dGVybmFsIGNvbnRyb2xzIHdoZW4gbWVkaWEgaXMgZm9jdXNlZFxuXHRcdFx0bWVkaWEucGFyZW50Tm9kZS5mb2N1cygpO1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzMikgeyAvL3NwYWNlXG5cdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKF9zZWVrKSB7XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzcpIHsgLy9sZWZ0XG5cdFx0XHRcdFx0bWVkaWEuY3VycmVudFRpbWUgPSBtZWRpYS5jdXJyZW50VGltZSAtIDU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzkpIHsgLy9yaWdodFxuXHRcdFx0XHRcdG1lZGlhLmN1cnJlbnRUaW1lID0gbWVkaWEuY3VycmVudFRpbWUgKyA1O1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOCkgeyAvL3VwXG5cdFx0XHRcdGxldCB2ID0gbWVkaWEudm9sdW1lO1xuXHRcdFx0XHR2ICs9IC4xO1xuXHRcdFx0XHRpZiAodiA+IDEpIHYgPSAxO1xuXHRcdFx0XHRtZWRpYS52b2x1bWUgPSB2O1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNDApIHsgLy9kb3duXG5cdFx0XHRcdGxldCB2ID0gbWVkaWEudm9sdW1lO1xuXHRcdFx0XHR2IC09IC4xO1xuXHRcdFx0XHRpZiAodiA8IDApIHYgPSAwO1xuXHRcdFx0XHRtZWRpYS52b2x1bWUgPSB2O1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvKmlmIChzZWxmLmNvbnRyb2xCYXIpIHtcblx0XHRcdFx0aWYgKHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uKSB7XG5cdFx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzgpIHtcblxuXHRcdFx0XHRcdFx0c2VsZi5jb250cm9sQmFyLnZvbHVtZU1lbnVCdXR0b24ubWVudUNvbnRlbnQuZWxfLmNsYXNzTmFtZSA9IFwidmpzLW1lbnUgc2hvd1wiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSovXG5cdFx0fVxuXHR9O1xuXG5cdC8vIHRoaXMub25TcGFjZSA9IGZ1bmN0aW9uKCkge1xuXG5cdC8vIH07XG5cblx0bGV0IGtleXVwID0gZnVuY3Rpb24oZSkge1xuXHRcdGlmIChfZW5hYmxlZCkge1x0XHRcdFxuXHRcdFx0Ly8gaWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzgpIHtcblx0XHRcdC8vIFx0Y2xlYXJJbnRlcnZhbChfdElkKTtcblx0XHRcdC8vIFx0aWYgKHNlbGYuY29udHJvbEJhci52b2x1bWVNZW51QnV0dG9uKSB7XG5cdFx0XHQvLyBcdFx0X3RJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBcdFx0XHRzZWxmLmNvbnRyb2xCYXIudm9sdW1lTWVudUJ1dHRvbi5tZW51Q29udGVudC5lbF8uY2xhc3NOYW1lID0gXCJ2anMtbWVudVwiO1xuXHRcdFx0Ly8gXHRcdH0sIDUwMCk7XG5cdFx0XHQvLyBcdH1cblx0XHRcdC8vIH1cblx0XHR9XG5cdH07XG5cdHRoaXMuZW5hYmxlZCA9IGZ1bmN0aW9uKGIpIHtcblx0XHRpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gX2VuYWJsZWQ7XG5cdFx0X2VuYWJsZWQgPSBiO1xuXG5cdH07XG5cdHRoaXMuc2Vla0VuYWJsZWQgPSBmdW5jdGlvbihiKSB7XG5cdFx0aWYgKGIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIF9zZWVrO1xuXHRcdF9zZWVrID0gYjtcblx0fTtcblx0dGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0X2VuYWJsZWQgPSB0cnVlO1xuXHRcdF90SWQgPSBudWxsO1xuXHRcdF9zZWVrID0gdHJ1ZTtcblx0XHRfZG9jLmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdF9kb2MuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwLmJpbmQodGhpcyksIGZhbHNlKTtcblx0fTtcblx0dGhpcy5kZXN0cm95ID0gIGZ1bmN0aW9uKCkge1xuXHRcdF9lbmFibGVkID0gZmFsc2U7XG5cdFx0X3RJZCA9IG51bGw7XG5cdFx0X3NlZWsgPSB0cnVlO1xuXHRcdF9kb2MuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bik7XG5cdFx0X2RvYy5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXApO1xuXHR9XG5cdHRoaXMuaW5pdCgpO1xufVxuZXhwb3J0IGRlZmF1bHQgZXh0ZXJuYWxDb250cm9sczsiLCIvL2h0dHBzOi8vZ2l0aHViLmNvbS9mZGFjaXVrL2FqYXhcbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcbiAgICB2YXIgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZSddXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBvcHRpb25zLmJhc2VVcmwgPSBvcHRpb25zLmJhc2VVcmwgfHwgJydcbiAgICBpZiAob3B0aW9ucy5tZXRob2QgJiYgb3B0aW9ucy51cmwpIHtcbiAgICAgIHJldHVybiB4aHJDb25uZWN0aW9uKFxuICAgICAgICBvcHRpb25zLm1ldGhvZCxcbiAgICAgICAgb3B0aW9ucy5iYXNlVXJsICsgb3B0aW9ucy51cmwsXG4gICAgICAgIG1heWJlRGF0YShvcHRpb25zLmRhdGEpLFxuICAgICAgICBvcHRpb25zXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBtZXRob2RzLnJlZHVjZShmdW5jdGlvbihhY2MsIG1ldGhvZCkge1xuICAgICAgYWNjW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHhockNvbm5lY3Rpb24oXG4gICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgIG9wdGlvbnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICBtYXliZURhdGEoZGF0YSksXG4gICAgICAgICAgb3B0aW9uc1xuICAgICAgICApXG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwge30pXG4gIH1cblxuICBmdW5jdGlvbiBtYXliZURhdGEoZGF0YSkge1xuICAgIHJldHVybiBkYXRhIHx8IG51bGxcbiAgfVxuXG4gIGZ1bmN0aW9uIHhockNvbm5lY3Rpb24odHlwZSwgdXJsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgdmFyIHJldHVybk1ldGhvZHMgPSBbJ3RoZW4nLCAnY2F0Y2gnLCAnYWx3YXlzJ11cbiAgICB2YXIgcHJvbWlzZU1ldGhvZHMgPSByZXR1cm5NZXRob2RzLnJlZHVjZShmdW5jdGlvbihwcm9taXNlLCBtZXRob2QpIHtcbiAgICAgIHByb21pc2VbbWV0aG9kXSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHByb21pc2VbbWV0aG9kXSA9IGNhbGxiYWNrXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH0sIHt9KVxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHhoci5vcGVuKHR5cGUsIHVybCwgdHJ1ZSlcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnd2l0aENyZWRlbnRpYWxzJylcbiAgICBzZXRIZWFkZXJzKHhociwgb3B0aW9ucy5oZWFkZXJzKVxuICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgcmVhZHkocHJvbWlzZU1ldGhvZHMsIHhociksIGZhbHNlKVxuICAgIHhoci5zZW5kKG9iamVjdFRvUXVlcnlTdHJpbmcoZGF0YSkpXG4gICAgcHJvbWlzZU1ldGhvZHMuYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB4aHIuYWJvcnQoKVxuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZU1ldGhvZHNcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhlYWRlcnMoeGhyLCBoZWFkZXJzKSB7XG4gICAgaGVhZGVycyA9IGhlYWRlcnMgfHwge31cbiAgICBpZiAoIWhhc0NvbnRlbnRUeXBlKGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgfVxuICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgKGhlYWRlcnNbbmFtZV0gJiYgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgaGVhZGVyc1tuYW1lXSkpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc0NvbnRlbnRUeXBlKGhlYWRlcnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoaGVhZGVycykuc29tZShmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJ1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkeShwcm9taXNlTWV0aG9kcywgeGhyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZVJlYWR5KCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSB4aHIuRE9ORSkge1xuICAgICAgICB4aHIucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGhhbmRsZVJlYWR5LCBmYWxzZSlcbiAgICAgICAgcHJvbWlzZU1ldGhvZHMuYWx3YXlzLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpXG5cbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICBwcm9taXNlTWV0aG9kcy50aGVuLmFwcGx5KHByb21pc2VNZXRob2RzLCBwYXJzZVJlc3BvbnNlKHhocikpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvbWlzZU1ldGhvZHMuY2F0Y2guYXBwbHkocHJvbWlzZU1ldGhvZHMsIHBhcnNlUmVzcG9uc2UoeGhyKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UoeGhyKSB7XG4gICAgdmFyIHJlc3VsdFxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzdWx0ID0geGhyLnJlc3BvbnNlVGV4dFxuICAgIH1cbiAgICByZXR1cm4gW3Jlc3VsdCwgeGhyXVxuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0VG9RdWVyeVN0cmluZyhkYXRhKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGRhdGEpID8gZ2V0UXVlcnlTdHJpbmcoZGF0YSkgOiBkYXRhXG4gIH1cblxuICBmdW5jdGlvbiBpc09iamVjdChkYXRhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRhKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nKG9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLnJlZHVjZShmdW5jdGlvbihhY2MsIGl0ZW0pIHtcbiAgICAgIHZhciBwcmVmaXggPSAhYWNjID8gJycgOiBhY2MgKyAnJidcbiAgICAgIHJldHVybiBwcmVmaXggKyBlbmNvZGUoaXRlbSkgKyAnPScgKyBlbmNvZGUob2JqZWN0W2l0ZW1dKVxuICAgIH0sICcnKVxuICB9XG5cbiAgZnVuY3Rpb24gZW5jb2RlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSlcbiAgfVxuXG4gIHJldHVybiBhamF4XG59KSgpOyIsImltcG9ydCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZnJvbSAnLi9wb2x5ZmlsbHMvcmVxdWVzdEFuaW1hdGlvbkZyYW1lJztcbmltcG9ydCBpbkZyYW1lIGZyb20gJy4vaGVscGVycy9pbkZyYW1lJztcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSAnLi9oZWxwZXJzL2RlZXBtZXJnZSc7XG5pbXBvcnQge1xuXHRjYXBpdGFsaXplRmlyc3RMZXR0ZXIsXG5cdHNjYWxlRm9udCxcblx0ZGVib3VuY2Vcbn0gZnJvbSAnLi9oZWxwZXJzL3V0aWxzJztcbmltcG9ydCBkb20gZnJvbSAnLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgZGV2aWNlIGZyb20gJy4vaGVscGVycy9kZXZpY2UnO1xuaW1wb3J0IGF1dG9Gb250IGZyb20gJy4vY29yZS9hdXRvRm9udCc7XG5pbXBvcnQgQ29udGFpbmVycyBmcm9tICcuL2NvcmUvY29udGFpbmVyL2NvbnRhaW5lcnMnO1xuaW1wb3J0IE1lZGlhIGZyb20gJy4vY29yZS9tZWRpYS9pbmRleCc7XG5pbXBvcnQgY29udGFpbmVyQm91bmRzIGZyb20gJy4vaGVscGVycy9jb250YWluZXJCb3VuZHMnO1xuaW1wb3J0IHBhZ2VWaXNpYmlsaXR5IGZyb20gJy4vaGVscGVycy9wYWdlVmlzaWJpbGl0eSc7XG5pbXBvcnQgZXh0ZXJuYWxDb250cm9scyBmcm9tICcuL2NvcmUvbWVkaWEvZXZlbnRzL2V4dGVybmFsQ29udHJvbHMnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi9oZWxwZXJzL2FqYXgnO1xuXG5jb25zdCBmbl9jb250ZXh0bWVudSA9IGZ1bmN0aW9uKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuXHR2aWRlb1dpZHRoOiA5MjAsXG5cdHZpZGVvSGVpZ2h0OiA1MjAsXG5cdGF1dG9wbGF5OiBmYWxzZSxcblx0bG9vcDogZmFsc2UsXG5cdGNvbnRyb2xzOiBmYWxzZSxcblx0Zm9udDoge1xuXHRcdHJhdGlvOiAxLFxuXHRcdG1pbjogLjUsXG5cdFx0dW5pdHM6IFwiZW1cIlxuXHR9XG59O1xuXG5jbGFzcyBrbWxQbGF5ZXIgZXh0ZW5kcyBNZWRpYSB7XG5cdGNvbnN0cnVjdG9yKHNldHRpbmdzLCBfZXZlbnRzLCBhcHApIHtcblx0XHRsZXQgZWwgPSBzZXR0aW5ncy52aWRlbztcblx0XHRsZXQgaW5JZnJhbWUgPSBpbkZyYW1lKCk7XG5cdFx0c3VwZXIoZWwsIGluSWZyYW1lKTtcblx0XHRpZiAoZWwgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdHRoaXMuX2JvdW5kcyA9IHt9O1xuXHRcdHRoaXMuZGV2aWNlID0gZGV2aWNlO1xuXHRcdHRoaXMuX19zZXR0aW5ncyA9IGRlZXBtZXJnZShkZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRcdGRvbS5hZGRDbGFzcyhlbCwgXCJrbWxcIiArIGNhcGl0YWxpemVGaXJzdExldHRlcihlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSk7XG5cdFx0dGhpcy53cmFwcGVyID0gZG9tLndyYXAodGhpcy5tZWRpYSwgZG9tLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdGNsYXNzOiAna21sUGxheWVyJ1xuXHRcdH0pKTtcblx0XHRkb20udHJpZ2dlcldlYmtpdEhhcmR3YXJlQWNjZWxlcmF0aW9uKHRoaXMud3JhcHBlcik7XG5cdFx0aWYgKGluSWZyYW1lKSB7XG5cdFx0XHRkb20uYWRkQ2xhc3ModGhpcy53cmFwcGVyLCBcImluRnJhbWVcIik7XG5cdFx0fVxuXHRcdC8vaW5pdFNldHRpbmdzXG5cdFx0Zm9yICh2YXIgayBpbiB0aGlzLl9fc2V0dGluZ3MpIHtcblx0XHRcdGlmICh0aGlzW2tdKSB7XG5cdFx0XHRcdGlmIChrID09PSAnYXV0b3BsYXknICYmIHRoaXMuX19zZXR0aW5nc1trXSAmJiAhaW5JZnJhbWUpIHtcblx0XHRcdFx0XHR0aGlzLnBsYXkoKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzW2tdKHRoaXMuX19zZXR0aW5nc1trXSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoayA9PT0gJ2NvbnRyb2xzJyAmJiB0aGlzLl9fc2V0dGluZ3Nba10gPT09IFwibmF0aXZlXCIpIHtcblx0XHRcdFx0dGhpcy5uYXRpdmVDb250cm9scyh0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL2luaXRQYWdlVmlzaWJpbGl0eVxuXHRcdHRoaXMucGFnZVZpc2liaWxpdHkgPSBuZXcgcGFnZVZpc2liaWxpdHkoZWwpO1xuXG5cdFx0Ly9pbml0ZXh0ZXJuYWxDb250cm9sc1xuXHRcdHRoaXMuZXh0ZXJuYWxDb250cm9scyA9IG5ldyBleHRlcm5hbENvbnRyb2xzKGVsKTtcblxuXHRcdC8vaW5pdENvbnRhaW5lcnNcblx0XHR0aGlzLmNvbnRhaW5lcnMgPSBuZXcgQ29udGFpbmVycyh0aGlzKTtcblxuXHRcdC8vYXV0b0ZPTlRcblx0XHRpZiAodHlwZW9mIHRoaXMuX19zZXR0aW5ncy5mb250ID09PSBcImJvb2xlYW5cIiAmJiB0aGlzLl9fc2V0dGluZ3MuZm9udCkgdGhpcy5fX3NldHRpbmdzLmZvbnQgPSBkZWZhdWx0cy5mb250O1xuXHRcdHRoaXMuYXV0b0ZvbnQgPSBuZXcgYXV0b0ZvbnQodGhpcy53cmFwcGVyLCB0aGlzLl9fc2V0dGluZ3MuZm9udCwgdGhpcyk7XG5cdFx0aWYgKHRoaXMuX19zZXR0aW5ncy5mb250KSB0aGlzLmF1dG9Gb250LmVuYWJsZWQodHJ1ZSk7XG5cblx0XHQvL2luaXRDYWxsYmFja0V2ZW50c1xuXHRcdGZvciAodmFyIGV2dCBpbiBfZXZlbnRzKSB7XG5cdFx0XHR0aGlzLm9uKGV2dCwgX2V2ZW50c1tldnRdLCB0aGlzKTtcblx0XHR9XG5cblx0XHR0aGlzLm9uKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcblx0XHRcdGlmICh0aGlzLm1lZGlhLndpZHRoICE9IHRoaXMubWVkaWEudmlkZW9XaWR0aCB8fCB0aGlzLm1lZGlhLmhlaWdodCAhPSB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0KSB7XG5cdFx0XHRcdHRoaXMudmlkZW9XaWR0aCgpO1xuXHRcdFx0XHR0aGlzLnZpZGVvSGVpZ2h0KCk7XG5cdFx0XHRcdHRoaXMuZW1pdCgndmlkZW9SZXNpemUnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGxldCB2aWRlb1NpemVDYWNoZSA9IHtcblx0XHRcdHc6IHRoaXMud2lkdGgoKSxcblx0XHRcdHg6IHRoaXMub2Zmc2V0WCgpLFxuXHRcdFx0eTogdGhpcy5vZmZzZXRZKCksXG5cdFx0XHRoOiB0aGlzLmhlaWdodCgpXG5cdFx0fVxuXHRcdGxldCBjaGVja1ZpZGVvUmVzaXplID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5fYm91bmRzID0gY29udGFpbmVyQm91bmRzKHRoaXMubWVkaWEpO1xuXHRcdFx0bGV0IHcgPSB0aGlzLndpZHRoKCk7XG5cdFx0XHRsZXQgaCA9IHRoaXMud2lkdGgoKTtcblx0XHRcdGxldCB4ID0gdGhpcy5vZmZzZXRYKCk7XG5cdFx0XHRsZXQgeSA9IHRoaXMub2Zmc2V0WSgpO1xuXHRcdFx0aWYgKHZpZGVvU2l6ZUNhY2hlLncgIT0gdyB8fCB2aWRlb1NpemVDYWNoZS5oICE9IGggfHwgdmlkZW9TaXplQ2FjaGUueCAhPSB4IHx8IHZpZGVvU2l6ZUNhY2hlLnkgIT0geSkge1xuXHRcdFx0XHR2aWRlb1NpemVDYWNoZS53ID0gdztcblx0XHRcdFx0dmlkZW9TaXplQ2FjaGUuaCA9IGg7XG5cdFx0XHRcdHZpZGVvU2l6ZUNhY2hlLnggPSB4O1xuXHRcdFx0XHR2aWRlb1NpemVDYWNoZS55ID0geTtcblx0XHRcdFx0dGhpcy5lbWl0KCdyZXNpemUnKTtcblx0XHRcdH1cblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2hlY2tWaWRlb1Jlc2l6ZSk7XG5cdFx0fVxuXG5cdFx0Y2hlY2tWaWRlb1Jlc2l6ZSgpO1xuXG5cdFx0aWYgKHR5cGVvZiBhcHAgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGFwcC5iaW5kKHRoaXMpKCk7XG5cdFx0fVxuXHR9XG5cblx0Y29udGV4dE1lbnUodikge1xuXHRcdGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHR2ID8gdGhpcy5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZuX2NvbnRleHRtZW51KSA6IHRoaXMubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmbl9jb250ZXh0bWVudSk7XG5cdFx0fVxuXHR9XG5cblx0YWpheChvcHRpb25zKSB7XG5cdFx0cmV0dXJuIGFqYXgob3B0aW9ucyk7XG5cdH1cblxuXHR2aWRlb1dpZHRoKHYpIHtcblx0XHRpZiAodGhpcy5tZWRpYS52aWRlb1dpZHRoKSB7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdGhpcy5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0cmV0dXJuIHRoaXMubWVkaWEudmlkZW9XaWR0aDtcblx0XHR9XG5cdFx0aWYgKCFpc05hTih2KSkge1xuXHRcdFx0diA9IHBhcnNlRmxvYXQodik7XG5cdFx0XHR0aGlzLm1lZGlhLndpZHRoID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEud2lkdGg7XG5cdH1cblxuXHR2aWRlb0hlaWdodCh2KSB7XG5cdFx0aWYgKHRoaXMubWVkaWEudmlkZW9IZWlnaHQpIHtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdGhpcy5tZWRpYS52aWRlb0hlaWdodDtcblx0XHRcdHJldHVybiB0aGlzLm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdH1cblx0XHRpZiAoIWlzTmFOKHYpKSB7XG5cdFx0XHR2ID0gcGFyc2VGbG9hdCh2KTtcblx0XHRcdHRoaXMubWVkaWEuaGVpZ2h0ID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuaGVpZ2h0O1xuXHR9XG5cblx0c2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMudmlkZW9XaWR0aCgpIC8gdGhpcy52aWRlb0hlaWdodCgpO1xuXHR9XG5cblx0Ym91bmRzKHYpIHtcblx0XHRpZiAodGhpcy5fYm91bmRzW3ZdICE9PSBudWxsKSByZXR1cm4gdGhpcy5fYm91bmRzW3ZdO1xuXHRcdHJldHVybiB0aGlzLl9ib3VuZHM7XG5cdH1cblxuXHR3aWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5ib3VuZHMoJ3dpZHRoJyk7XG5cdH1cblxuXHRoZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdoZWlnaHQnKTtcblx0fVxuXG5cdG9mZnNldFgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm91bmRzKCdvZmZzZXRYJyk7XG5cdH1cblxuXHRvZmZzZXRZKCkge1xuXHRcdHJldHVybiB0aGlzLmJvdW5kcygnb2Zmc2V0WScpO1xuXHR9XG5cblx0d3JhcHBlckhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHR3cmFwcGVyV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGg7XG5cdH1cblxuXHR3cmFwcGVyU2NhbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEub2Zmc2V0V2lkdGggLyB0aGlzLm1lZGlhLm9mZnNldEhlaWdodDtcblx0fVxuXG5cdGFkZENsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS5hZGRDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGRvbS5hZGRDbGFzcyh0aGlzLndyYXBwZXIsIHYpO1xuXHR9XG5cdHJlbW92ZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS5yZW1vdmVDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLnJlbW92ZUNsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG5cdHRvZ2dsZUNsYXNzKHYsIGVsKSB7XG5cdFx0aWYgKGVsICE9IG51bGwpIHtcblx0XHRcdGRvbS50b2dnbGVDbGFzcyh2LCBlbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh2ICE9PSAna21sUGxheWVyJykge1xuXHRcdFx0ZG9tLnRvZ2dsZUNsYXNzKHRoaXMud3JhcHBlciwgdik7XG5cdFx0fVxuXHR9XG59O1xuXG4vL2Rpc2FibGUgb24gcHJvZHVjdGlvblxuaWYgKGRldmljZS5pc1RvdWNoKSB7XG5cdHdpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obWVzc2FnZSwgc2NyaXB0VXJsLCBsaW5lLCBjb2x1bW4pIHtcblx0XHRjb25zb2xlLmxvZyhsaW5lLCBjb2x1bW4sIG1lc3NhZ2UpO1xuXHRcdGFsZXJ0KGxpbmUgKyBcIjpcIiArIGNvbHVtbiArIFwiLVwiICsgbWVzc2FnZSk7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGttbFBsYXllcjsiXSwibmFtZXMiOlsiYmFiZWxIZWxwZXJzLnR5cGVvZiIsImRlZmF1bHRzIiwiRXZlbnRzIiwiX2RvYyIsImluSWZyYW1lIiwiaW5GcmFtZSJdLCJtYXBwaW5ncyI6Ijs7OztJQUFnQixhQUFXO0FBQ3ZCLElBQUEsUUFBSSxXQUFXLENBQWY7QUFDQSxJQUFBLFFBQUksVUFBVSxDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsUUFBZCxFQUF3QixHQUF4QixDQUFkO0FBQ0EsSUFBQSxTQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxRQUFRLE1BQVosSUFBc0IsQ0FBQyxPQUFPLHFCQUE3QyxFQUFvRSxFQUFFLENBQXRFLEVBQXlFO0FBQ3JFLElBQUEsZUFBTyxxQkFBUCxHQUErQixPQUFPLFFBQVEsQ0FBUixJQUFXLHVCQUFsQixDQUEvQjtBQUNBLElBQUEsZUFBTyxvQkFBUCxHQUE4QixPQUFPLFFBQVEsQ0FBUixJQUFXLHNCQUFsQixLQUNBLE9BQU8sUUFBUSxDQUFSLElBQVcsNkJBQWxCLENBRDlCO0FBRUgsSUFBQTs7QUFFRCxJQUFBLFFBQUksQ0FBQyxPQUFPLHFCQUFSLElBQWlDLHVCQUF1QixJQUF2QixDQUE0QixPQUFPLFNBQVAsQ0FBaUIsU0FBN0MsQ0FBckMsRUFDSSxPQUFPLHFCQUFQLEdBQStCLFVBQVMsUUFBVCxFQUFtQixPQUFuQixFQUE0QjtBQUN2RCxJQUFBLFlBQUksV0FBVyxJQUFJLElBQUosR0FBVyxPQUFYLEVBQWY7QUFDQSxJQUFBLFlBQUksYUFBYSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBTSxXQUFXLFFBQWpCLENBQVosQ0FBakI7QUFDQSxJQUFBLFlBQUksS0FBSyxPQUFPLFVBQVAsQ0FBa0IsWUFBVztBQUFFLElBQUEscUJBQVMsV0FBVyxVQUFwQjtBQUFrQyxJQUFBLFNBQWpFLEVB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