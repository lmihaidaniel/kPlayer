/**
 * @module dom
 * Module for easing the manipulation of dom elements
 */

let classReg = function (c) {
	return new RegExp("(^|\\s+)" + c + "(\\s+|$)");
};

let hasClass;
let addClass;
let removeClass;
let toggleClass;

if ('classList' in document.documentElement) {
	hasClass = function (elem, c) {
		return elem.classList.contains(c);
	};
	addClass = function (elem, c) {
		if (c != null) {
			c = c.split(' ');
			for (var k in c) {
				if (c[k] != '') elem.classList.add(c[k]);
			}
		}
	};
	removeClass = function (elem, c) {
		if (c != null) {
			c = c.split(' ');
			for (var k in c) {
				if (c[k] != '') elem.classList.remove(c[k]);
			}
		}
	};
} else {
	hasClass = function (elem, c) {
		return classReg(c).test(elem.className);
	};
	addClass = function (elem, c) {
		if (!hasClass(elem, c)) {
			elem.className = elem.className + ' ' + c;
		}
	};
	removeClass = function (elem, c) {
		elem.className = elem.className.replace(classReg(c), ' ');
	};
}

toggleClass = function (elem, c) {
	var fn = hasClass(elem, c) ? removeClass : addClass;
	fn(elem, c);
};

let getPrefixedStylePropName = function getPrefixedStylePropName(propName) {
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
	triggerWebkitHardwareAcceleration: function (element) {
		if (this.stylePrefix.backfaceVisibility && this.stylePrefix.perspective) {
			element.style[this.stylePrefix.perspective] = '1000px';
			element.style[this.stylePrefix.backfaceVisibility] = 'hidden';
		}
	},
	transform: function (element, value) {
		element.style[this.stylePrefix.transform] = value;
	},
	/**
  * Shorter and fast way to select multiple nodes in the DOM
  * @param   { String } selector - DOM selector
  * @param   { Object } ctx - DOM node where the targets of our search will is located
  * @returns { Object } dom nodes found
  */
	selectAll: function (selector, ctx) {
		return (ctx || document).querySelectorAll(selector);
	},
	/**
  * Shorter and fast way to select a single node in the DOM
  * @param   { String } selector - unique dom selector
  * @param   { Object } ctx - DOM node where the target of our search will is located
  * @returns { Object } dom node found
  */
	select: function (selector, ctx) {
		return (ctx || document).querySelector(selector);
	},
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	toggleClass: toggleClass,
	autoLineHeight: function (el) {
		let l = el.offsetHeight + "px";
		el.style.lineHeight = l;
		return l;
	},
	createElement: function (elm, props) {
		let el = document.createElement(elm);
		for (let k in props) {
			el.setAttribute(k, props[k]);
		}
		return el;
	},
	emptyElement: function (elm) {
		while (elm.firstChild) {
			elm.removeChild(elm.firstChild);
		}
	},
	replaceElement: function (target, elm) {
		target.parentNode.replaceChild(elm, target);
	},
	addElement: function (target, elm) {
		target.appendChild(elm);
	},
	removeElement: function (element) {
		element.parentNode.removeChild(element);
	},
	insertAfter: function (el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
	},
	insertBefore: function (el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode);
	},
	getTextContent: function (el) {
		return el.textContent || el.innerText;
	},
	wrap: function (elements, wrapper) {
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

const bigButton = '<svg x="0px" y="0px" width="98px" height="98px" viewBox="0 0 213.7 213.7" enable-background="new 0 0 213.7 213.7" xml:space="preserve"><polygon class="triangle" id="XMLID_18_" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="73.5,62.5 148.5,105.8 73.5,149.1 "></polygon><circle class="circle" id="XMLID_17_" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="106.8" cy="106.8" r="103.3"></circle></svg>';
function bigPlay (parentPlayer) {
	return function () {
		let bigPlayButton = function () {
			let isMobile = parentPlayer.device.isMobile;
			let autoplay = parentPlayer.__settings['autoplay'];
			let wrapper = dom.createElement('div', { class: "kmlBigPlay hidden" });
			let btn = dom.createElement('div', { class: 'kmlBigPlayButton' });
			btn.innerHTML = bigButton;
			wrapper.addEventListener('click', () => {
				parentPlayer.play();
			});
			wrapper.appendChild(btn);
			parentPlayer.wrapper.appendChild(wrapper);

			this.show = () => {
				if (parentPlayer.containers) {
					parentPlayer.containers.hide();
				}
				parentPlayer.pause();
				wrapper.style.display = "block";
				dom.removeClass(wrapper, 'hidden');
			};
			this.hide = () => {
				if (parentPlayer.containers) {
					parentPlayer.containers.show();
				}
				dom.addClass(wrapper, 'hidden');
				setTimeout(() => {
					wrapper.style.display = "none";
					//parentPlayer.play();
				}, 200);
			};

			if (!autoplay || isMobile) {
				this.show();
			} else {
				wrapper.style.display = "none";
			}

			parentPlayer.on('play', () => {
				this.hide();
			});
		};
		return new bigPlayButton();
	}();
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function procentFromString(v) {
  if (v === undefined || v === null) return false;
  let t = false;
  if (v.indexOf) {
    if (v.indexOf('%') > -1) {
      t = parseFloat(v);
    }
  }
  return t;
}

/**
 * Detect if the argument passed is a strict numeric
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isStrictNumeric(v) {
  return !isNaN(v) && typeof v === 'number';
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

let isMobile = false;
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;
let browser = function () {
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
  isIos: /(iPad|iPhone|iPod)/g.test(navigator.platform),
  isMobile: isMobile
};

var deepmerge = (function () {
	let deepmerge = function (target, src) {
		if (src) {
			var array = Array.isArray(src);
			var dst = array && [] || {};

			if (array) {
				target = target || [];
				dst = dst.concat(target);
				src.forEach(function (e, i) {
					if (typeof dst[i] === 'undefined') {
						dst[i] = e;
					} else if (typeof e === 'object') {
						dst[i] = deepmerge(target[i], e);
					} else {
						if (target.indexOf(e) === -1) {
							dst.push(e);
						}
					}
				});
			} else {
				if (target && typeof target === 'object') {
					Object.keys(target).forEach(function (key) {
						dst[key] = target[key];
					});
				}
				Object.keys(src).forEach(function (key) {
					if (typeof src[key] !== 'object' || !src[key]) {
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

let autoFont = function (el, font, parent) {
	let _enabled = false;
	let _cache = 0;
	let _font = {};
	let _update = function () {
		if (_enabled) {
			let w = parent.width();
			if (_cache != w) {
				_font = scaleFont(font, parent.width(), el);
			}
			return _font;
		}
	};
	this.update = function (v) {
		if (v !== undefined) {
			if (!font) {
				font = { ratio: 1, min: 1, lineHeight: false };
			}
			font = deepmerge(font, v);
			return _update();
		}
	};
	this.enabled = function (v) {
		if (typeof v === 'boolean' && font) {
			_enabled = v;
		}
		return _enabled;
	};
	if (parent.on) {
		parent.on('resize', _update);
	};
};

let defaults$1 = {
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

let adaptiveSizePos = function (setttings, parent) {
	let bounds = function () {
		return {
			offsetX: parent.offsetX(),
			offsetY: parent.offsetY(),
			width: parent.width(),
			height: parent.height(),
			scale: parent.width() / parent.videoWidth(),
			scaleY: parent.width() / parent.videoHeight()
		};
	};
	let vault = {
		x: 0,
		y: 0,
		width: '100%',
		height: '100%',
		fontSize: null,
		lineHeight: null
	};
	let parentWidth = 0;
	let parentHeight = 0;
	let parentX = 0;
	let parentY = 0;
	let domElement = null;
	let settings = deepmerge(defaults$1, setttings);
	let _active = false;

	let updateDomElement = function () {
		if (_active && domElement && domElement.nodeType) {
			if (vault.width != null) domElement.style.width = vault.width + "px";
			if (vault.height != null) domElement.style.height = vault.height + "px";

			// if (dom.stylePrefix.transform && settings.translate) {
			if (settings.translate) {
				let transform = '';
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

	let updateProps = function () {
		let _w = parent.width();
		let _h = parent.height();
		let _x = parent.offsetX();
		let _y = parent.offsetY();
		if (parentWidth != _w || parentHeight != _h || _x != parentX || _y != parentY) {
			parentWidth = _w;
			parentHeight = _h;
			parentX = _x;
			parentY = _y;
		} else {
			return;
		}

		let b = bounds();

		let procentWidth = procentFromString(settings.width);
		if (procentWidth) {
			vault.width = b.width * procentWidth / 100;
		} else {
			if (settings.width != null) {
				vault.width = b.width * b.scale;
			}
		}
		vault.width = Math.ceil(vault.width);

		let procentHeight = procentFromString(settings.height);
		if (procentHeight) {
			vault.height = b.height * procentHeight / 100;
		} else {
			if (settings.height != null) {
				vault.height = b.height * b.scale;
			}
		}
		vault.height = Math.ceil(vault.height);

		if (settings.x != null) {
			let procentX = procentFromString(settings.x);
			if (procentX) {
				vault.x = b.offsetX + b.width * procentX / 100;
			} else {
				vault.x = b.offsetX + settings.x * b.scale;
			}
			vault.x = Math.floor(vault.x);
			let transformX = procentFromString(settings.transform.x);
			if (transformX) vault.x += transformX * vault.width / 100;
			if (settings.offsetX) vault.x += settings.offsetX;
		}

		if (settings.y != null) {
			let procentY = procentFromString(settings.y);
			if (procentY) {
				vault.y = b.offsetY + b.height * procentY / 100;
			} else {
				vault.y = b.offsetY + settings.y * b.scale;
			}
			vault.y = Math.floor(vault.y);
			let transformY = procentFromString(settings.transform.y);
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

	let applyNewProps = function () {
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
function EventEmitter() { /* Nothing to set */ }

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
  var events = this._events
    , names = []
    , name;

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
  var evt = prefix ? prefix + event : event
    , available = this._events && this._events[evt];

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

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
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
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
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
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
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

  var listeners = this._events[evt]
    , events = [];

  if (fn) {
    if (listeners.fn) {
      if (
           listeners.fn !== fn
        || (once && !listeners.once)
        || (context && listeners.context !== context)
      ) {
        events.push(listeners);
      }
    } else {
      for (var i = 0, length = listeners.length; i < length; i++) {
        if (
             listeners[i].fn !== fn
          || (once && !listeners[i].once)
          || (context && listeners[i].context !== context)
        ) {
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

  if (event) delete this._events[prefix ? prefix + event : event];
  else this._events = prefix ? {} : Object.create(null);

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

var Events = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

var tinycolor = createCommonjsModule(function (module) {
// TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})(Math);
});

var tinycolor$1 = (tinycolor && typeof tinycolor === 'object' && 'default' in tinycolor ? tinycolor['default'] : tinycolor);

function backgroundColor(el) {
	var el = el || this;
	if (!el.style) el.style = {};
	return function (c, a = 0.6) {
		var color = tinycolor$1(c);
		if (color.isValid()) {
			color.setAlpha(a);
			el.style.backgroundColor = color.toString();
		}
		return el.style.backgroundColor;
	};
}

let defaults$3 = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
};
let relativeSizePos = function (ctx, settings) {
	let parentWidth = ctx.videoWidth() || ctx.width || 1;
	let parentHeight = ctx.videoHeight() || ctx.height || 1;
	let o = deepmerge(defaults$3, settings);
	let _w = procentFromString(o.width);
	if (_w === false) _w = o.width / parentWidth * 100;
	let _h = procentFromString(o.height);
	if (_h === false) _h = o.height / parentHeight * 100;
	let _x = procentFromString(o.x);
	if (_x === false) _x = o.x / parentWidth * 100;
	let _y = procentFromString(o.y);
	if (_y === false) _y = o.y / parentHeight * 100;
	return {
		x: _x,
		y: _y,
		width: _w,
		height: _h
	};
};

let defaults$2 = {
	backgroundColor: '',
	onHide: null,
	onShow: null,
	externalControls: true,
	visible: true,
	pauseVideo: false
};

class Widget extends Events {
	constructor(el, opts, parent, parentPlayer) {
		super();
		this.wrapper = el;
		this._visible = false;
		this.parentPlayerPaused = false;
		this._settings = deepmerge(defaults$2, opts);
		this._cache = {};
		this.backgroundColor = backgroundColor(el);
		this.parent = parent;
		this.parentPlayer = parentPlayer;
		this.onClick = () => {};
		this.init();
		el.addEventListener('click', () => {
			this.onClick();
		});
	}
	click(fn) {
		if (fn != null) {
			if (isFunction(fn)) {
				this.onClick = fn;
			} else {
				this.onClick = () => {};
			}
			return;
		}
		this.onClick();
	}
	settings(fopts) {
		if (fopts) {
			this._settings = deepmerge(this._settings, fopts);
			this.resize();
		}
		return this._settings;
	}
	init() {
		this.parentPlayer.on('resize', () => {
			this.resize();
		});
		if (this._settings.visible) {
			this.show();
		} else {
			this.wrapper.style.display = "none";
		}
		this.resize();
	}
	visible(v) {
		if (typeof v === 'boolean') this._visible = v;
		return this._visible;
	}
	hide() {
		if (this.visible()) {
			this.visible(false);
			this.emit('beforeHide');
			dom.addClass(this.wrapper, 'hidden');
			if (this._settings.pauseVideo) {
				if (!this.parentPlayerPaused) {
					this.parentPlayer.play();
				}
			}
			setTimeout(() => {
				this.wrapper.style.display = "none";
				if (isFunction(this._settings.onHide)) this._settings.onHide();
				this.parent.checkVisibleElements();
				this.emit('hide');
			}, 250);
		}
	}
	show() {
		if (!this.visible()) {
			this.visible(true);
			this.emit('beforeShow');
			this.parent.enabled(true);
			this.wrapper.style.display = "block";
			setTimeout(() => {
				dom.removeClass(this.wrapper, 'hidden');
				if (isFunction(this._settings.onHide)) this._settings.onShow();
				this.emit('show');
			}, 50);
			if (this._settings.pauseVideo) {
				if (!this.parentPlayer.paused()) {
					this.parentPlayerPaused = false;
					this.parentPlayer.pause();
				} else {
					this.parentPlayerPaused = true;
				}
			}
		}
	}
	resize() {
		if (this._cache.width != this._settings.width || this._cache.height != this._settings.height || this._cache.x != this._settings.x || this._cache.y != this._settings.y) {
			let d = new relativeSizePos(this.parentPlayer, this._settings);
			this.wrapper.style.width = d.width + "%";
			this.wrapper.style.height = d.height + "%";
			//dom.transform(this.wrapper, 'translate(' + 100 / d.width * d.x + '%,' + 100 / d.height * d.y + '%)');
			this.wrapper.style.left = d.x + '%';
			this.wrapper.style.top = d.y + '%';
			this._cache.width = this._settings.width;
			this._cache.height = this._settings.height;
			this._cache.x = this._settings.x;
			this._cache.y = this._settings.y;
		}
		this.emit('resize');
	}
	addClass(cls) {
		if (cls != 'kmlWidget') dom.addClass(this.wrapper, cls);
	}
	removeClass(cls) {
		if (cls != 'kmlWidget') dom.removeClass(this.wrapper, cls);
	}
	toggleClass(cls) {
		if (cls != 'kmlWidget') dom.toggleClass(this.wrapper, cls);
	}
	content(el) {
		if (el != null) {
			if (el.nodeName) {
				this.wrapper.appendChild(el);
			} else {
				this.wrapper.innerHTML = el;
			}
		}
	}
	setFontSize(v) {
		this.wrapper.style.fontSize = v + "%";
	}
	destroy() {
		this.removeAllListeners();
		this.parent.remove(this.wrapper);
		dom.removeElement(this.wrapper);
	}
}

let defaults$4 = {
	backgroundColor: '',
	onHide: null,
	onShow: null,
	externalControls: false,
	visible: false,
	pauseVideo: true,
	single: false
};

class Popup extends Events {
	constructor(el, opts, parent, parentPlayer) {
		super();
		this.wrapper = el;
		let body = dom.createElement('div', { 'class': 'body' });
		let overlay = dom.createElement('div');
		dom.addClass(overlay, 'overlay triggerClose');
		this.wrapper.appendChild(overlay);
		this.wrapper.appendChild(body);
		this.body = body;
		this.overlay = overlay;

		this._content = dom.createElement('div', { 'class': 'content' });
		this.body.appendChild(this._content);

		//header
		let header = document.createElement('h1');
		dom.addClass(header, 'header');
		this._title = document.createElement('span');
		header.appendChild(this._title);
		this._closeBtn = document.createElement('a');
		this._closeBtn.innerHTML = "<img src='svg/ic_close.svg'/>";
		dom.addClass(this._closeBtn, 'closeBtn triggerClose');
		header.appendChild(this._closeBtn);
		this.body.appendChild(header);
		this.header = header;
		this.header.backgroundColor = backgroundColor(this.header);
		this.body.backgroundColor = backgroundColor(this.body);
		this.overlay.backgroundColor = backgroundColor(this.overlay);
		//end header

		this._visible = false;
		this.parentPlayerPaused = false;
		this._settings = deepmerge(defaults$4, opts);
		this._cache = {};
		this.backgroundColor = backgroundColor(overlay);
		this.parent = parent;
		this.parentPlayer = parentPlayer;

		this.setSize = function (s) {
			let d = this.settings({ x: (100 - s) / 2 + "%", y: (100 - s) / 2 + "%", width: s + "%", height: s + "%" });
			if (d.y < 10) {
				header.style.transform = 'translateY(0)';
			} else {
				header.style.transform = 'translateY(-100%)';
			}
		};

		//EVENTS
		let events = ['resize', 'show'];
		events.map(evt => {
			this.on(evt, () => {
				this.resize();
				this.autoLineHeight();
			});
		});

		let clsElements = dom.selectAll('.triggerClose', el);
		for (var i = 0, n = clsElements.length; i < n; i += 1) {
			clsElements[i].addEventListener('click', () => {
				this.hide();
			});
		}

		let externalControls = parentPlayer.externalControls.enabled();

		this.on('beforeShow', () => {
			if (this._settings.externalControls != null) {
				externalControls = parentPlayer.externalControls.enabled();
				parentPlayer.externalControls.enabled(this._settings.externalControls);
			}
		});

		this.on('beforeHide', () => {
			if (this._settings.pauseVideo) {
				parentPlayer.externalControls.enabled(externalControls);
			}
		});

		this.init();
	}
	settings(fopts) {
		if (fopts) {
			this._settings = deepmerge(this._settings, fopts);
			this.resize();
		}
		return this._settings;
	}
	init() {
		this.parentPlayer.on('resize', () => {
			this.emit('resize');
		});
		if (this._settings.visible) {
			this.show();
		} else {
			this.wrapper.style.display = "none";
		}
		this.resize();
	}
	visible(v) {
		if (typeof v === 'boolean') this._visible = v;
		return this._visible;
	}
	hide() {
		if (this._visible) {
			this._visible = false;
			this.emit('beforeHide');
			dom.addClass(this.wrapper, 'hidden');
			if (this._settings.pauseVideo) {
				if (!this.parentPlayerPaused) {
					this.parentPlayer.play();
				}
			}
			setTimeout(() => {
				this.wrapper.style.display = "none";
				if (isFunction(this._settings.onHide)) this._settings.onHide();
				this.parent.checkVisibleElements();
				this.emit('hide');
			}, 250);
		}
	}
	show() {
		if (!this._visible) {
			this._visible = true;
			this.emit('beforeShow');
			this.parent.enabled(true);
			this.wrapper.style.display = "block";
			setTimeout(() => {
				dom.removeClass(this.wrapper, 'hidden');
				if (isFunction(this._settings.onHide)) this._settings.onShow();
				this.emit('show');
			}, 50);
			if (this._settings.pauseVideo) {
				if (!this.parentPlayer.paused()) {
					this.parentPlayerPaused = false;
					this.parentPlayer.pause();
				} else {
					this.parentPlayerPaused = true;
				}
			}
		}
	}
	resize() {
		if (this._cache.width != this._settings.width || this._cache.height != this._settings.height || this._cache.x != this._settings.x || this._cache.y != this._settings.y) {
			let d = new relativeSizePos(this.parentPlayer, this._settings);
			this.body.style.width = d.width + "%";
			this.body.style.height = d.height + "%";
			//dom.transform(this.body, 'translate(' + 100 / d.width * d.x + '%,' + 100 / d.height * d.y + '%)');
			this.body.style.left = (100 - d.width) / 2 + '%';
			this.body.style.top = (100 - d.height) / 2 + '%';
			this._cache.width = this._settings.width;
			this._cache.height = this._settings.height;
			this._cache.x = this._settings.x;
			this._cache.y = this._settings.y;
		}
	}
	addClass(cls) {
		if (cls != 'kmlWidget') dom.addClass(this.body, cls);
	}
	removeClass(cls) {
		if (cls != 'kmlWidget') dom.removeClass(this.body, cls);
	}
	toggleClass(cls) {
		if (cls != 'kmlWidget') dom.toggleClass(this.body, cls);
	}
	content(el) {
		if (el != null) {
			if (el.nodeName) {
				this._content.appendChild(el);
			} else {
				this._content.innerHTML = el;
			}
		}
	}
	setFontSize(v) {
		this.body.style.fontSize = v + "%";
	}
	autoLineHeight(el) {
		if (this.visible()) {
			if (el) {
				dom.autoLineHeight(el);
			} else {
				dom.autoLineHeight(this._title.parentNode);
			}
		}
	}
	title(v) {
		if (v != null) {
			this._title.innerHTML = v;
			this.autoLineHeight();
			return v;
		}
		return this._title.innerHTML;
	}
	destroy() {
		this.removeAllListeners();
		this.parent.remove(this.wrapper);
		dom.removeElement(this.wrapper);
	}
}

let defaults$6 = {
	x: 0,
	width: '100%',
	height: '8%',
	minHeight: 32
};
function Timeline (parentPlayer) {
	return function () {
		let Timeline = function () {
			let fragment = document.createDocumentFragment();
			let playBtn = dom.createElement('button', {
				'class': 'play'
			});
			let volumeBtn = dom.createElement('button', {
				'class': 'volume'
			});
			let fullScreenBtn = dom.createElement('button', {
				'class': 'fullscreen'
			});
			let pw = dom.createElement('div', {
				'class': 'kmlProgress'
			});
			let pl = dom.createElement('div', {
				'class': 'progressline'
			});
			pw.appendChild(pl);
			fragment.appendChild(playBtn);
			fragment.appendChild(pw);
			fragment.appendChild(volumeBtn);
			fragment.appendChild(fullScreenBtn);
			let wrapper = null;
			if (parentPlayer.timelineContainer != null) {
				this.wrapper = parentPlayer.timelineContainer(defaults$6);
				this.wrapper.content(fragment);
				wrapper = this.wrapper.wrapper;
			} else {
				this.wrapper = dom.createElement('div', {
					class: "kmlTimeline",
					style: "position: absolute; left: 0; width: " + defaults$6.width + "; height: " + defaults$6.height + "; top: auto; bottom: 0;"
				});
				parentPlayer.wrapper.appendChild(this.wrapper);
				wrapper = this.wrapper;
				this.wrapper.appendChild(fragment);
			}
			let pwFlag = 0;
			let pwVFlag = 0;
			let caclPw = function (el, e) {
				let dim = el.getBoundingClientRect();
				let x = e.clientX - dim.left;
				let t = x / dim.width * 100;
				let d = t * parentPlayer.duration() / 100;
				pl.style.width = t + "%";
				parentPlayer.seek(d);
			};
			pw.addEventListener('mousedown', e => {
				pwFlag = 1;
				pwVFlag = parentPlayer.paused();
				dom.addClass(parentPlayer.wrapper, 'disableSelect');
				parentPlayer.pause();
				caclPw(pw, e);
			});
			pw.addEventListener('mouseup', e => {
				pwFlag = 0;
				dom.removeClass(parentPlayer.wrapper, 'disableSelect');
				if (!pwVFlag) {
					parentPlayer.play();
				}
				caclPw(pw, e);
			});
			pw.addEventListener('mousemove', e => {
				if (pwFlag) {
					caclPw(pw, e);
				}
			});
			playBtn.addEventListener('click', () => {
				try {
					playBtn.blur();
				} catch (e) {}
				parentPlayer.togglePlay();
			});
			volumeBtn.addEventListener('click', () => {
				try {
					volumeBtn.blur();
				} catch (e) {}
				parentPlayer.toggleMute();
			});
			fullScreenBtn.addEventListener('click', () => {
				try {
					fullScreenBtn.blur();
				} catch (e) {}
				parentPlayer.toggleFullScreen();
			});
			parentPlayer.on('timeupdate', function () {
				pl.style.width = this.currentTime() / this.duration() * 100 + "%";
			});
			parentPlayer.on('volumechange', function () {
				let v = this.volume();
				if (this.muted()) {
					dom.addClass(volumeBtn, 'mute');
					return;
				} else {
					dom.removeClass(volumeBtn, 'mute');
				}
				dom.removeClass(volumeBtn, 'down up off mute');
				if (v < .5) {
					dom.addClass(volumeBtn, 'down');
				} else {
					dom.addClass(volumeBtn, 'up');
				}
				if (v == 0) {
					dom.addClass(volumeBtn, 'off');
				}
			});
			parentPlayer.on('enterFullScreen', function () {
				dom.addClass(fullScreenBtn, 'exit');
			});
			parentPlayer.on('exitFullScreen', function () {
				dom.removeClass(fullScreenBtn, 'exit');
			});
			parentPlayer.on('play', () => {
				dom.removeClass(playBtn, 'play');
				dom.addClass(playBtn, 'pause');
			});
			parentPlayer.on('pause', () => {
				dom.removeClass(playBtn, 'pause');
				dom.addClass(playBtn, 'play');
			});
			parentPlayer.on('resize', () => {
				this.resize();
			});
			let w = 0;
			let cache_sc = 0;
			this.resize = () => {
				let sc = procentFromString(defaults$6.height) * parentPlayer.height() / 100;
				if (cache_sc != sc) {
					cache_sc = sc;
					if (sc < defaults$6.minHeight) {
						w = sc = defaults$6.minHeight;
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: defaults$6.minHeight + "px"
							});
						} else {
							wrapper.style.height = defaults$6.minHeight + "px";
						}
						playBtn.style.width = w + "px";
						pw.style.left = w + "px";
						pw.style.right = 2 * w + "px";

						volumeBtn.style.width = w + "px";
						volumeBtn.style.right = w + "px";

						fullScreenBtn.style.width = w + "px";
						fullScreenBtn.style.right = 0;
					} else {
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: defaults$6.height
							});
						} else {
							wrapper.style.height = defaults$6.height;
						}
						w = sc / parentPlayer.width() * 100;
						playBtn.style.width = w + "%";
						pw.style.left = w + "%";
						pw.style.right = 2 * w + "%";

						volumeBtn.style.width = w + "%";
						volumeBtn.style.right = w + "%";

						fullScreenBtn.style.width = w + "%";
						fullScreenBtn.style.right = 0;
					}
				}
			};
			let _closed = false;
			this.closed = v => {
				if (typeof v === 'boolean') {
					if (v) {
						dom.addClass(wrapper, 'closed');
					} else {
						dom.removeClass(wrapper, 'closed');
					}
					_closed = v;
				}
				return _closed;
			};

			parentPlayer.on('user-is-idle', () => {
				if (!parentPlayer.paused()) this.closed(true);
			});
			parentPlayer.on('user-not-idle', () => {
				this.closed(false);
			});

			parentPlayer.on('pause', () => {
				if (this.closed()) {
					this.closed(false);
				}
			});

			this.addClass = cls => {
				if (cls != 'kmlTimeline') dom.addClass(wrapper, cls);
			};
			this.removeClass = cls => {
				if (cls != 'kmlTimeline') dom.removeClass(wrapper, cls);
			};
			this.toggleClass = cls => {
				if (cls != 'kmlTimeline') dom.toggleClass(wrapper, cls);
			};
		};
		return new Timeline();
	}();
};

function inIframe() {
	try {
		let is = window.self !== window.top;
		if (is) {
			var arrFrames = parent.document.getElementsByTagName("IFRAME");
			for (var i = 0; i < arrFrames.length; i++) {
				let frame = arrFrames[i];
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

function ErrorFormatException(msg) {
			try {
						throw new Error(msg);
			} catch (e) {
						console.log(e.name + ': ' + e.message);
						return;
			}
}

function scrollPosition () {
	let x = 0;
	let y = 0;
	this.save = function () {
		x = window.pageXOffset || 0;
		y = window.pageYOffset || 0;
	};
	this.restore = function () {
		window.scrollTo(x, y);
	};
}

// Fullscreen API
let supportsFullScreen = false;
let browserPrefixes = 'webkit moz o ms khtml'.split(' ');
let prefixFS = '';
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
let eventChange = prefixFS === '' ? 'fullscreenchange' : prefixFS + (prefixFS == 'ms' ? 'fullscreenchange' : 'fullscreenchange');
eventChange = eventChange.toLowerCase();
//supportsFullScreen = false;
class Fullscreen extends Events {
    constructor() {
        super();
        this.iframe = null;
        this.scrollPosition = new scrollPosition();
        this._fullscreenElement = null;
        this.fullscreenElementStyle = {};
        this.supportsFullScreen = supportsFullScreen;
        if (this.supportsFullScreen) {
            let fnFullscreenChange = () => {
                if (!this.isFullScreen()) {
                    setTimeout(this.scrollPosition.restore, 100);
                    this.emit('exitFullScreen');
                } else {
                    this.emit('enterFullScreen');
                }
            };
            document.addEventListener(eventChange, fnFullscreenChange, false);
        }
    }
    defualtFullScreenElement(element) {
        let el = element;
        if (el == null) {
            if (this.iframe) {
                el = this.iframe;
            } else {
                el = this.wrapper;
            }
        }
        return el;
    }
    onFullscreenChange(evt) {
        //investigate if native video fullscreen can be overwritten
        this.media.addEventListener(eventChange, function (e) {
            e.preventDefault();
            e.stopPropagation;
            return false;
        }, true);
    }
    isFullWindow() {
        return false;
    }
    isFullScreen(element) {
        if (this.supportsFullScreen) {
            let el = this.defualtFullScreenElement(element);
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
    }
    requestFullWindow(element) {
        if (this.__settings) {
            if (this.__settings.fullWindow) {
                return;
            }
        }
        if (this.isFullWindow()) return;
        this.emit('enterFullScreen');
        if (this.supportsFullScreen && this.isFullScreen()) return;
        let el = this.defualtFullScreenElement(element);
        this.scrollPosition.save();
        // let style = window.getComputedStyle(element);
        let style = el.style;
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
    }
    requestFullScreen(element) {
        let el = this.defualtFullScreenElement(element);
        if (this.supportsFullScreen) {
            this.scrollPosition.save();
            return prefixFS === '' ? el.requestFullScreen() : el[prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
        } else {
            this.requestFullWindow(el);
        }
    }
    cancelFullWindow() {
        if (this.__settings) {
            if (this.__settings.fullWindow) {
                return;
            }
        }
        if (!this.isFullWindow()) return;
        this.emit('exitFullScreen');
        if (this.supportsFullScreen && this.isFullScreen()) return;
        for (let k in this.fullscreenElementStyle) {
            this._fullscreenElement.style[k] = this.fullscreenElementStyle[k];
        }
        this._fullscreenElement = null;
        this.isFullWindow = function () {
            return false;
        };
        this.scrollPosition.restore();
    }
    cancelFullScreen() {
        if (this.supportsFullScreen) {
            return prefixFS === '' ? document.cancelFullScreen() : document[prefixFS + (prefixFS == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
        } else {
            this.cancelFullWindow();
        }
    }
    toggleFullWindow(element) {
        let isFullscreen = !this.isFullWindow();
        if (isFullscreen) {
            this.requestFullWindow(element);
            //document.body.style.overflow = 'hidden';
        } else {
            this.cancelFullWindow();
            //document.body.style.overflow = '';
        }
    }
    toggleFullScreen(element) {
        let isFullscreen = this.isFullScreen();
        if (!isFullscreen) {
            this.requestFullScreen(element);
            //document.body.style.overflow = 'hidden';
        } else {
            this.cancelFullScreen();
            //document.body.style.overflow = '';
        }
    }
    fullscreenElement() {
        if (this.supportsFullScreen) {
            return prefixFS === '' ? document.fullscreenElement : document[prefixFS + 'FullscreenElement'];
        } else {
            return this._fullscreenElement;
        }
    }
};

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
let _events = ['ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'playing', 'pause', 'error', 'seeking', 'emptied', 'seeked', 'ratechange', 'suspend'];

class Media extends Fullscreen {
	constructor(el) {
		super();
		if (el == null) {
			ErrorFormatException("You need to supply a HTMLVideoElement to instantiate the player");
			return;
		}
		this.media = el;
		_events.forEach(k => {
			el.addEventListener(k, () => {
				this.emit(k);
			});
		});

		this.canPlay = {
			mp4: mimeVideo(el, 'video/mp4'),
			webm: mimeVideo(el, 'video/webm'),
			ogg: mimeVideo(el, 'video/ogg')
		};
	}

	/*** Global attributes */

	/* A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data. If not return the auoplay attribute. */
	autoplay(v) {
		if (typeof v === 'boolean') {
			this.media.autoplay = v;
		}
		return this.media.autoplay;
	}

	/* Returns the time ranges of the buffered media. This attribute contains a TimeRanges object */
	buffered() {
		return this.media.buffered;
	}

	/* If this attribute is present, the browser will offer controls to allow the user to control video playback, including volume, seeking, and pause/resume playback. When not set returns if the controls are present */
	nativeControls(v) {
		if (typeof v === 'boolean') {
			this.media.controls = v;
		}
		return this.media.controls;
	}

	/* anonymous, use-credentials, false */
	crossorigin(v) {
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
	}

	/* A Boolean attribute; if specified, we will, upon reaching the end of the video, automatically seek back to the start. */
	loop(v) {
		if (typeof v === 'boolean') {
			this.media.loop = v;
		}
		return this.media.loop;
	}

	/*A Boolean attribute which indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced. Its default value is false, meaning that the audio will be played when the video is played*/
	muted(v) {
		if (typeof v === 'boolean') {
			this.media.muted = v;
		}
		return !!this.media.muted;
	}

	/* Mute the video */
	mute() {
		this.muted(true);
	}

	/* UnMute the video */
	unmute() {
		this.muted(false);
	}

	/* Toggle the muted stance of the video */
	toggleMute() {
		return this.muted(!this.muted());
	}

	/* Returns A TimeRanges object indicating all the ranges of the video that have been played.*/
	played() {
		return this.media.played;
	}

	/*
 This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:
 	none: indicates that the video should not be preloaded.
 	metadata: indicates that only video metadata (e.g. length) is fetched.
 	auto: indicates that the whole video file could be downloaded, even if the user is not expected to use it.
 the empty string: synonym of the auto value.
 */
	preload(v) {
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
	}

	/* Gives or returns the address of an image file that the user agent can show while no video data is available. The attribute, if present, must contain a valid non-empty URL potentially surrounded by spaces */
	poster(v) {
		if (v !== undefined) {
			this.media.poster = v;
		}
		return this.media.poster;
	}

	/* The src property sets or returns the current source of the audio/video, The source is the actual location (URL) of the audio/video file */
	src(v) {
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
	}

	/*** Global Events */

	/* Starts playing the audio/video */
	play() {
		this.media.play();
	}

	/* Pauses the currently playing audio/video */
	pause() {
		this.media.pause();
	}

	/* Return the currently playing status of audio/video */
	paused() {
		return this.media.paused;
	}

	/* Return the currently playing status of audio/video */
	playing() {
		return this.media.paused;
	}

	/* Toggle play/pause for the audio/video */
	togglePlay() {
		this.media.paused ? this.play() : this.pause();
	}

	currentTime(v) {
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
	}

	seek(v) {
		return this.currentTime(v);
	}

	/**
  * [Re-loads the audio/video element, update the audio/video element after changing the source or other settings]
  * @return {[type]} [description]
  */
	load(v) {
		if (v !== undefined) {
			this.src(v);
		}
		this.media.load();
	}

	duration() {
		return this.media.duration;
	}

	volume(v) {
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
	}
}

var containerBounds = (function () {
	let scale = 0;
	let bounds = function (el, updateScale) {
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

const isAvailable = function () {
	return !(typeof _doc[hidden] === "undefined");
};

function pageVisibility(_media, settings = {}) {
	let _available = isAvailable();
	if (_available) {
		let _enabled = false;
		let _playing = false;
		let paused = false;
		let setFlagPlaying = function () {
			_playing = true;
		};
		let events = {
			visible: function () {},
			hidden: function () {}
		};
		let destroyVisibility = function () {
			events = {
				visible: function () {},
				hidden: function () {}
			};
			_enabled = false;
			_playing = false;
			_doc.removeEventListener(visibilityChange, handleVisibilityChange, false);
			_media.removeEventListener('playing', setFlagPlaying);
		};
		let handleVisibilityChange = function () {
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
		let initVisibility = function initVisibility(settings) {
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

		this.init = initVisibility;
		this.destroy = destroyVisibility;
		this.on = function (event, fn) {
			if (event in events) events[event] = fn;
		};
		this.enabled = function (v) {
			if (typeof v === 'boolean') _enabled = v;
			return _enabled;
		};
	};
};

let _doc$1 = document || {};
let externalControls = function (el) {
	let _enabled = true;
	let _seek = true;
	let _tId = null;
	let media = el;
	let keydown = function (e) {
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
				let v = media.volume;
				v += .1;
				if (v > 1) v = 1;
				media.volume = v;
				return;
			}

			if (e.keyCode == 40) {
				//down
				let v = media.volume;
				v -= .1;
				if (v < 0) v = 0;
				media.volume = v;
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

	let keyup = function (e) {
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
var ajax = (function () {

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

function userActivity (parentPlayer, settings = { timeout: 2000 }) {
	return function () {
		let userActivity = function () {
			let isMobile = parentPlayer.device.isMobile;
			let timer = 0;
			let tid = null;
			let idle = true;
			let player = parentPlayer.wrapper;
			let timeoutDefault = settings.timeout;
			let check = () => {
				if (tid) {
					if (idle) {
						parentPlayer.emit('user-not-idle');
					}
					clearTimeout(tid);
				}
				idle = false;
				tid = setTimeout(() => {
					idle = true;
					parentPlayer.emit('user-is-idle');
				}, settings.timeout);
			};
			this.watch = () => {
				if (isMobile) {
					player.addEventListener('touchstart', check);
					player.addEventListener('touchmove', check);
				} else {
					player.addEventListener('mousemove', check);
					window.addEventListener('keyup', check);
				}
			};
			this.unwatch = () => {
				if (isMobile) {
					player.removeEventListener('touchstart', check);
					player.removeEventListener('touchmove', check);
				} else {
					player.removeEventListener('mousemove', check);
					window.removeEventListener('keyup', check);
				}
				clearTimeout(tid);
			};
			this.watch();
			this.suspend = v => {
				if (v != null) {
					v = !!v;
					if (v) {
						parentPlayer.emit('user-is-idle');
					} else {
						parentPlayer.emit('user-not-idle');
					}
					this.unwatch();
					idle = v;
				}
				return idle;
			};
			this.idle = v => {
				if (v != null) {
					v = !!v;
					if (v) {
						parentPlayer.emit('user-is-idle');
					} else {
						parentPlayer.emit('user-not-idle');
					}
					idle = v;
					tid = setTimeout(() => {
						idle = true;
						parentPlayer.emit('user-is-idle');
					}, settings.timeout);
				}
				return idle;
			};
			this.resume = () => {
				idle = true;
				this.watch();
			};
			this.timeout = v => {
				if (isStrictNumeric(v)) {
					settings.timeout = v;
				} else {
					settings.timeout = timeoutDefault;
				}
				return settings.timeout;
			};
		};
		return new userActivity();
	}();
};

const fn_contextmenu = function (e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
};

const defaults$5 = {
	videoWidth: 960,
	videoHeight: 540,
	autoplay: false,
	loop: false,
	controls: true,
	font: {
		ratio: 1,
		min: .5,
		units: "em"
	},
	externalControls: true,
	contextMenu: false,
	fullWindow: false
};

class Player extends Media {
	constructor(settings, app) {
		let el = settings.video;
		super(el);
		if (el == null) return;
		//initSettings
		this.__settings = {};
		this._controls = true;
		//setup Player
		this.device = device;
		this.iframe = inIframe();
		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
		this.wrapper = dom.wrap(this.media, dom.createElement('div', {
			class: 'kmlPlayer'
		}));
		dom.triggerWebkitHardwareAcceleration(this.wrapper);
		if (this.inIframe) {
			dom.addClass(this.wrapper, "inFrame");
		}

		//initPageVisibility
		this.pageVisibility = new pageVisibility(el);

		//initexternalControls
		this.externalControls = new externalControls(el);

		//initUserActivity
		this.userActivity = new userActivity(this);

		//initCallbackEvents
		if (isFunction(app)) {
			app.bind(this)();
		}

		this.settings(deepmerge(defaults$5, settings));

		this.on('loadedmetadata', () => {
			if (this.media.width != this.media.videoWidth || this.media.height != this.media.videoHeight) {
				this.videoWidth();
				this.videoHeight();
				this.emit('resize');
			}
		});
		if (this.__settings['autoplay'] != null) {
			if (this.__settings['autoplay']) {
				this.play();
			} else {
				this.autoplay(false);
			}
		}

		if (this.__settings['fullWindow'] != null) {
			if (this.__settings['fullWindow']) {
				this.requestFullWindow();
			}
		}
	}

	initTimeline() {
		if (this.__settings['controls'] !== "native") {
			if (this.__settings['controls']) {
				this.timeline = new Timeline(this);
			}
		}
	}

	timeline() {}

	settings(settings) {
		if (settings == null) return this.__settings;
		this.__settings = deepmerge(this.__settings, settings);
		//initSettings
		for (var k in this.__settings) {
			if (this[k] != null) {
				if (isFunction(this[k])) this[k](this.__settings[k]);
			}
			if (k === 'controls' && this.__settings[k] === "native") {
				this.nativeControls(true);
			}
		}
		return this.__settings;
	}

	controls(v) {
		if (typeof v === 'boolean') {
			if (v) {
				if (this.__settings['controls'] === "native") this.nativeControls(true);
				if (this.__settings['externalControls']) this.externalControls.enabled(true);
				this._controls = true;
			} else {
				this.externalControls.enabled(false);
				this.nativeControls(false);
				this._controls = false;
			}
		}
		return this._controls;
	}

	contextMenu(v) {
		if (typeof v === 'boolean') {
			v ? this.media.removeEventListener('contextmenu', fn_contextmenu) : this.media.addEventListener('contextmenu', fn_contextmenu);
		}
	}

	ajax(options) {
		return ajax(options);
	}

	videoWidth(v) {
		if (this.media.videoWidth) {
			this.media.width = this.media.videoWidth;
			return this.media.videoWidth;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.width = v;
		}
		return this.media.width;
	}

	videoHeight(v) {
		if (this.media.videoHeight) {
			this.media.height = this.media.videoHeight;
			return this.media.videoHeight;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.height = v;
		}
		return this.media.height;
	}

	scale() {
		return this.videoWidth() / this.videoHeight();
	}

	bounds(v) {
		let data = containerBounds(this.media);
		if (data[v] != null) return data[v];
		return data;
	}

	width() {
		return this.bounds('width');
	}

	height() {
		return this.bounds('height');
	}

	offsetX() {
		return this.bounds('offsetX');
	}

	offsetY() {
		return this.bounds('offsetY');
	}

	wrapperHeight() {
		return this.media.offsetHeight;
	}

	wrapperWidth() {
		return this.media.offsetWidth;
	}

	wrapperScale() {
		return this.media.offsetWidth / this.media.offsetHeight;
	}

	addClass(v, el) {
		if (el != null) {
			dom.addClass(v, el);
			return;
		}
		dom.addClass(this.wrapper, v);
	}
	removeClass(v, el) {
		if (el != null) {
			dom.removeClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			dom.removeClass(this.wrapper, v);
		}
	}
	toggleClass(v, el) {
		if (el != null) {
			dom.toggleClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			dom.toggleClass(this.wrapper, v);
		}
	}
};

class videoPopup extends Popup {
	constructor(el, opts, parent, parentPlayer) {
		super(el, opts, parent, parentPlayer);
		let domVideo = document.createElement('video');
		dom.replaceElement(this._content, domVideo);
		//this.body.appendChild(domVideo);
		this.player = new Player({ video: domVideo });
		this.player.supportsFullScreen = false;
		this.player.initTimeline();
		this.player.media.addEventListener('click', () => {
			if (!this.player.userActivity.idle()) {
				this.player.togglePlay();
			} else {
				this.player.userActivity.idle(false);
			}
		});
		let paused = false;
		this.player.externalControls.enabled(false);
		this.on('beforeHide', () => {
			paused = this.player.paused();
			this.player.pause();
			this.player.externalControls.enabled(false);
		});
		this.on('show', () => {
			if (!paused) {
				this.player.play();
			}
			this.player.timeline.resize();
			this.player.externalControls.enabled(true);
		});
		this.on('ended', () => {
			if (isFunction(opts.onEnded)) opts.onEnded();
		});
		opts.sizeRatio = opts.sizeRatio || 80;
		let defaultSize = opts.sizeRatio;
		this.setSize = function (s) {
			defaultSize = opts.sizeRatio = s;
			this.emit('resize');
		};
		this.player.requestFullWindow = () => {
			opts.sizeRatio = 100;
			this.overlay.backgroundColor("000000", 0.9);
			this.emit('resize');
			this.player.emit('enterFullScreen');
			this.player.isFullWindow = function () {
				return true;
			};
		};
		this.player.cancelFullWindow = () => {
			this.overlay.backgroundColor("000000", 0.6);
			opts.sizeRatio = defaultSize;
			this.emit('resize');
			this.player.emit('exitFullScreen');
			this.player.isFullWindow = function () {
				return false;
			};
		};
		this.player.on('ended', () => {
			this.emit('ended');
		});
		this.on('resize', () => {
			let y = 0;
			let x = 0;
			let w = parentPlayer.width();
			let h = parentPlayer.height();
			let r = this.player.scale();
			let fw = w;let fh = h;
			let ww = w;let hh = h;
			let headerHeight = 10;
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
			this._title.parentNode.style.height = headerHeight + '%';
			// let d = this.settings({
			// 	// x: x/w*ww+'%',
			// 	// y: y/h*hh+'%',
			// 	x: (100-fw)/2+'%',
			// 	y: (100-fh)/2+'%',
			// 	width : fw+"%",
			// 	height: fh+"%"
			// });
			let d = {
				// x: x/w*ww+'%',
				// y: y/h*hh+'%',
				x: (100 - fw) / 2,
				y: (100 - fh) / 2,
				width: fw,
				height: fh
			};
			if (headerHeight <= d.y) {
				this._title.parentNode.style.transform = 'translateY(-100%)';
				this.body.style.top = d.y + headerHeight / 2 + '%';
			} else {
				this._title.parentNode.style.transform = 'translateY(0)';
				this.body.style.top = d.y + '%';
			}
			this.body.style.width = d.width + "%";
			this.body.style.height = d.height + "%";
			this.body.style.left = d.x + '%';
			this.autoLineHeight();
		});

		parentPlayer.on('loadedmetadata', () => {
			this.emit('resize');
		});
		this.player.on('loadedmetadata', () => {
			this.emit('resize');
		});
		this.player.load(opts.url);
	}
	content() {
		return this.player;
	}
}

let defaults$7 = {
	backgroundColor: '',
	onHide: null,
	onShow: null,
	externalControls: true,
	visible: true,
	width: "100%",
	height: null,
	x: 0,
	y: null
};

class TimelineContainer extends Events {
	constructor(el, opts, parent, parentPlayer) {
		super();
		this.wrapper = el;
		this._visible = false;
		this._settings = deepmerge(defaults$7, opts);
		this._cache = {};
		this.backgroundColor = backgroundColor(el);
		this.parent = parent;
		this.parentPlayer = parentPlayer;
		this.init();
	}
	settings(fopts) {
		if (fopts) {
			this._settings = deepmerge(this._settings, fopts);
		}
		return this._settings;
	}
	init() {
		if (this._settings.visible) {
			this.show();
		} else {
			this.wrapper.style.display = "none";
		}
		this.parentPlayer.on('resize', () => {
			this.resize();
		});
	}
	visible(v) {
		if (typeof v === 'boolean') this._visible = v;
		return this._visible;
	}
	hide() {
		if (this.visible()) {
			this.visible(false);
			this.emit('beforeHide');
			dom.addClass(this.wrapper, 'hidden');
			setTimeout(() => {
				this.wrapper.style.display = "none";
				if (isFunction(this._settings.onHide)) this._settings.onHide();
				this.parent.checkVisibleElements();
				this.emit('hide');
			}, 250);
		}
	}
	show() {
		if (!this.visible()) {
			this.visible(true);
			this.emit('beforeShow');
			this.parent.enabled(true);
			this.wrapper.style.display = "block";
			setTimeout(() => {
				dom.removeClass(this.wrapper, 'hidden');
				if (isFunction(this._settings.onHide)) this._settings.onShow();
				this.emit('show');
			}, 50);
		}
	}
	resize() {
		if (this._cache.width != this._settings.width || this._cache.height != this._settings.height || this._cache.x != this._settings.x || this._cache.y != this._settings.y) {
			if (this._settings.width != null) this._cache.width = this.wrapper.style.width = this._settings.width;
			if (this._settings.height != null) this._cache.height = this.wrapper.style.height = this._settings.height;
			if (this._settings.x != null) this._cache.x = this.wrapper.style.left = this._settings.x;
			if (this._settings.y != null) this._cache.y = this.wrapper.style.top = this._settings.y;
		}
	}
	addClass(cls) {
		if (cls != 'kmlTimeline') dom.addClass(this.wrapper, cls);
	}
	removeClass(cls) {
		if (cls != 'kmlTimeline') dom.removeClass(this.wrapper, cls);
	}
	toggleClass(cls) {
		if (cls != 'kmlTimeline') dom.toggleClass(this.wrapper, cls);
	}
	content(el) {
		if (el != null) {
			if (el.nodeName) {
				this.wrapper.appendChild(el);
			} else {
				this.wrapper.innerHTML = el;
			}
		}
	}
	setFontSize(v) {
		this.wrapper.style.fontSize = v + "%";
	}
	destroy() {
		this.removeAllListeners();
		this.parent.remove(this.wrapper);
		dom.removeElement(this.wrapper);
	}
}

class Containers {
	constructor(parentPlayer) {
		this.wrapper = dom.createElement('div', {
			class: 'kmlContainers'
		});

		let popups = dom.createElement('div', { class: 'popups' });
		let widgets = dom.createElement('div', { class: 'widgets' });
		let timelines = dom.createElement('div', { class: 'timelines' });

		this.wrapper.appendChild(widgets);
		this.wrapper.appendChild(timelines);
		this.wrapper.appendChild(popups);
		this._els = [];
		let ac = new adaptiveSizePos({}, parentPlayer);
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
			let no = 0;
			for (var k in this._els) {
				if (this._els[k].visible()) {
					no += 1;
				}
			}
			this.enabled(no);
		};

		parentPlayer.wrapper.appendChild(this.wrapper);

		let currentVisibles = [];
		this.hide = function (current) {
			for (var k in this._els) {
				let currentContainer = this._els[k];
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

		this.add = function (settings, el = {}, type) {
			let cls = settings.className || '';
			let containerBody = dom.createElement('div');
			if (el) {
				if (!el.nodeType) {
					el = containerBody;
				}
			} else {
				el = containerBody;
			}

			let container = null;
			switch (type) {
				case 'video':
					dom.addClass(containerBody, 'kmlPopup isVideo hidden ' + cls);
					container = new videoPopup(containerBody, settings, this, parentPlayer);
					popups.appendChild(container.wrapper);
					break;
				case 'popup':
					dom.addClass(containerBody, 'kmlPopup hidden ' + cls);
					container = new Popup(containerBody, settings, this, parentPlayer);
					popups.appendChild(container.wrapper);
					break;
				case 'timeline':
					dom.addClass(containerBody, 'kmlTimeline ' + cls);
					container = new TimelineContainer(containerBody, settings, this, parentPlayer);
					timelines.appendChild(container.wrapper);
					break;
				default:
					dom.addClass(containerBody, 'kmlWidget ' + cls);
					container = new Widget(containerBody, settings, this, parentPlayer);
					widgets.appendChild(container.wrapper);
					break;
			}

			this._els.push(container);
			return container;
		};

		this.remove = container => {
			for (var i = 0, n = this._els.length; i < n; i += 1) {
				let c = this._els[i];
				if (c.wrapper === container) {
					this._els.splice(i, 1);
					if (this._els.length == 0) this.enabled(false);
					break;
				}
			}
		};
	}
	addClass(cls) {
		if (cls != 'kmlContainers') dom.addClass(this.wrapper, cls);
	}
	removeClass(cls) {
		if (cls != 'kmlContainers') dom.removeClass(this.wrapper, cls);
	}
	toggleClass(cls) {
		if (cls != 'kmlContainers') dom.toggleClass(this.wrapper, cls);
	}
	els(id) {
		return this._els[id] || this._els;
	}
}

class kmlPlayer extends Player {
	constructor(settings, app) {
		super(settings, app);

		this._bounds = {};

		//initContainers
		this.containers = new Containers(this);

		this.widget = function (sttg, el) {
			return this.containers.add(sttg, el, 'widget');
		};

		this.timelineContainer = function (sttg, el) {
			return this.containers.add(sttg, el, 'timeline');
		};

		this.videoContainer = function (sttg) {
			return this.containers.add(sttg, null, 'video');
		};

		this.popupContainer = function (sttg) {
			return this.containers.add(sttg, null, 'popup');
		};

		//autoFONT
		if (typeof this.__settings.font === "boolean" && this.__settings.font) this.__settings.font = defaults.font;
		this.autoFont = new autoFont(this.wrapper, this.__settings.font, this);
		if (this.__settings.font) this.autoFont.enabled(true);

		let videoSizeCache = {
			w: this.width(),
			x: this.offsetX(),
			y: this.offsetY(),
			h: this.height()
		};
		let checkVideoResize = () => {
			this._bounds = containerBounds(this.media);
			let w = this.width();
			let h = this.width();
			let x = this.offsetX();
			let y = this.offsetY();
			if (videoSizeCache.w != w || videoSizeCache.h != h || videoSizeCache.x != x || videoSizeCache.y != y) {
				videoSizeCache.w = w;
				videoSizeCache.h = h;
				videoSizeCache.x = x;
				videoSizeCache.y = y;
				this.emit('resize');
			}
			window.requestAnimationFrame(checkVideoResize);
		};

		this.bigPlay = new bigPlay(this);

		this.initTimeline();

		checkVideoResize();
	}

	//overwrite bounds
	bounds(v) {
		if (this._bounds[v] != null) return this._bounds[v];
		return this._bounds;
	}

};

//disable on production
if (device.isTouch) {
	window.onerror = function (message, scriptUrl, line, column) {
		console.log(line, column, message);
		alert(line + ":" + column + "-" + message);
	};
}

export default kmlPlayer;