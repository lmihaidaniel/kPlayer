let __section_width_in_time = 113.8 / 6;
var settings = {
	player: {
		video: document.querySelector('video'),
		autoplay: false,
		loop: false,
		externalControls: false,
		fullWindow: true,
		videoWidth: 1280,
		videoHeight: 720,
		font: {
			ratio: 1.2,
			min: .1
		}
	},
	delayAutoOpenQuizz: 4,
	cuepoints_show_btn_quiz: [{
		start: 2,
		end: 29.4,
		chapter: 0,
		quizNo: 1
	}, {
		start: 31.4,
		end: 44.7,
		chapter: 1,
		quizNo: 4
	}, {
		start: 46.7,
		end: 65.5,
		chapter: 2,
		quizNo: 7
	}, {
		start: 67.5,
		end: 76.2,
		chapter: 3,
		quizNo: 10
	}, {
		start: 78.2,
		end: 102.4,
		chapter: 4,
		quizNo: 13
	}, {
		start: 104.4,
		end: 113,
		chapter: 5,
		quizNo: 17
	}],
	controlSeekBarSpeed: [{
		start: 0,
		end: 29.4,
		title: ["medical environment", "Gastrointestinal anatomy and physiology"],
		label: "Gastrointestinal anatomy and physiology"
	}, {
		start: 29.4,
		end: 44.7,
		title: ["medical environment", "Diarrhea"],
		label: "Diarrhea"
	}, {
		start: 44.7,
		end: 65.5,
		title: ["medical environment", "Treatment"],
		label: "Treatment"
	}, {
		start: 65.5,
		end: 76.2,
		title: ["", "probiotics review & Saccharimyces boulardii <br> CNCMI-745 identity"],
		label: "probiotics review & Saccharimyces boulardii <br> CNCMI-745 identity"
	}, {
		start: 76.2,
		end: 102.4,
		title: ["", "saccharomyces boulardii CNCM-745 <br> mode of action"],
		label: "saccharomyces boulardii <br>CNCM-745 mode of action"
	}, {
		start: 102.4,
		end: 113.8,
		title: ["", "Clinical evidence"],
		label: "Clinical evidence"
	}],
	chapters: [{
		start: 0,
		end: __section_width_in_time,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_1'
	}, {
		start: __section_width_in_time,
		end: __section_width_in_time * 2,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_2'
	}, {
		start: __section_width_in_time * 2,
		end: __section_width_in_time * 3,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_3'
	}, {
		start: __section_width_in_time * 3,
		end: __section_width_in_time * 4,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_4'
	}, {
		start: __section_width_in_time * 4,
		end: __section_width_in_time * 5,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_5'
	}, {
		start: __section_width_in_time * 5,
		end: __section_width_in_time * 6,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_6'
	}],
	quizData: [[{
		title: ["The intestinal microbiota", "Please tick the correct answer(s):"],
		type: "select",
		all: true,
		r: [0, 1, 2, 3, 4, 5]
	}, {
		title: ["&nbsp;", "Match each digestive process with its definition:"],
		type: "match",
		r: [1, 5, 4, 2, 0, 3]
	}, {
		title: ["Gut Microbiota", "Please tick the correct answer(s):"],
		type: "select",
		r: [1, 2]
	}], [{ //4
		title: ["&nbsp;", "Which of the following bacteria causes noninvasive diarrhea ?"],
		type: "select",
		r: [0]
	}, {
		title: ["&nbsp;", "What does the presence of blood in the stool indicate ?"],
		type: "select",
		r: [0]
	}, {
		title: ["&nbsp;", "What is the pathophysiology of viral diarrhea ?"],
		type: "select",
		r: [2]
	}], [{ //7
		title: ["&nbsp;", "Antibiotics are effective in the treatment of viral diarrheas."],
		type: "select",
		r: [1]
	}, {
		title: ["", "Which of the following probiotics has been recommended by European Society of Paediatric Gastroenterology, Hepatology, And Nutrition in the treatment of diarrhea ?"],
		type: "select",
		r: [2]
	}, {
		title: ["&nbsp;", "What is the mode of action of Saccharomyces boulardii CNCM I-745 against viral diarrhea ?"],
		type: "select",
		r: [2]
	}], [{ //10
		title: ["", "To which class of organisms/microorganisms does Saccharomyces boulardii CNCM I-745 belong ?"],
		type: "select",
		r: [2]
	}, {
		title: ["&nbsp;", "Which of the following properties is NOT exhibited by a probiotic ?"],
		type: "select",
		r: [0]
	}, {
		title: ["&nbsp;", "Surface area of bacteria is 10 times that of yeast"],
		type: "select",
		r: [1]
	}], [{ //13
		title: ["Antitoxinic effect", "Please tick the correct answer(s):"],
		type: "select",
		r: [0, 2, 4]
	}, {
		title: ["", "Modulation of intestinal microbiota. Saccharomyces boulardii CNCM I-745 in dysbiosis leads to faster reestablishment of the healthy microbiome"],
		type: "select",
		r: [0]
	}, {
		title: ["Trophic action", "Please tick the correct answer(s):"],
		type: "select",
		r: [0, 2]
	}, {
		title: ["Antimicrobial action", "Please tick the correct answer(s):"],
		type: "select",
		r: [1, 2, 3]
	}], [{ //17
		title: ["Clinical evidence", "Please tick the correct answer(s):"],
		type: "select",
		r: [0, 1]
	}, {
		title: ["Which of the following reasons accounts for the unmet needs in the management of acute diarrhea? ", "Please tick the correct answer(s):"],
		type: "select",
		r: [0]
	}, {
		title: ["The following are unmet medical need in the treatment of antibiotic-associated diarrhea.", "Please tick the correct answer(s):"],
		type: "select",
		r: [0, 1, 3]
	}, {
		title: ["Clinical evidence. Szajewska and al Meta-analysis 2007 – updated 2009.", "Please tick the correct answer(s):"],
		type: "select",
		all: true,
		r: [0, 1, 2]
	}, {
		title: ["Clinical evidence. Dinleyici E. and al Meta-analysis 2012. Part 1.", "Please tick the correct answer(s):"],
		type: "select",
		r: [0, 1, 4]
	}, {
		title: ["Clinical evidence. Dinleyici E. and al Meta-analysis 2012. Part 2.", "Please tick the correct answer(s):"],
		type: "select",
		r: [2, 3, 5]
	}, {
		title: ["Clinical evidence. Moré & Swidsinski Meta- analysis updated in 2015.", "Please tick the correct answer(s):"],
		type: "select",
		r: [0, 2, 3]
	}, {
		title: ["Clinical evidence. McFarland Meta-analysis:", "Please tick the correct answer(s):"],
		type: "select",
		r: [0, 1, 3, 4]
	}, {
		title: ["Clinical evidence. Swajewska Meta-analysis 2015:", "Please tick the correct answer(s):"],
		type: "select",
		r: [0, 1, 3]
	}]]
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
	if (c != null) {
		var fn = hasClass(elem, c) ? removeClass : addClass;
		fn(elem, c);
	}
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

/**
 * Offset Left
 * getBoundingClientRect technique from
 * John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
 *
 * @function findElPosition
 * @param {Element} el Element from which to get offset
 * @return {Object}
 */

let findElPosition = function (el) {
	let box;

	if (el.getBoundingClientRect && el.parentNode) {
		box = el.getBoundingClientRect();
	}

	if (!box) {
		return {
			left: 0,
			top: 0
		};
	}

	const docEl = document.documentElement;
	const body = document.body;

	const clientLeft = docEl.clientLeft || body.clientLeft || 0;
	const scrollLeft = window.pageXOffset || body.scrollLeft;
	const left = box.left + scrollLeft - clientLeft;

	const clientTop = docEl.clientTop || body.clientTop || 0;
	const scrollTop = window.pageYOffset || body.scrollTop;
	const top = box.top + scrollTop - clientTop;

	// Android sometimes returns slightly off decimal values, so need to round
	return {
		left: Math.round(left),
		top: Math.round(top)
	};
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
	/**
  * Determines, via duck typing, whether or not a value is a DOM element.
  *
  * @function isEl
  * @param    {Mixed} value
  * @return   {Boolean}
  */
	isEl: function (value) {
		return !!value && typeof value === 'object' && value.nodeType === 1;
	},
	/**
  * Determines, via duck typing, whether or not a value is a text node.
  *
  * @param  {Mixed} value
  * @return {Boolean}
  */
	isTextNode: function (value) {
		return !!value && typeof value === 'object' && value.nodeType === 3;
	},
	setElAttributes: function (el, attributes) {
		Object.getOwnPropertyNames(attributes).forEach(function (attrName) {
			let attrValue = attributes[attrName];

			if (attrValue === null || typeof attrValue === 'undefined' || attrValue === false) {
				el.removeAttribute(attrName);
			} else {
				el.setAttribute(attrName, attrValue === true ? '' : attrValue);
			}
		});
	},
	getElAttributes: function (tag) {
		var obj, knownBooleans, attrs, attrName, attrVal;

		obj = {};

		// known boolean attributes
		// we can check for matching boolean properties, but older browsers
		// won't know about HTML5 boolean attributes that we still read from
		knownBooleans = ',' + 'autoplay,controls,loop,muted,default' + ',';

		if (tag && tag.attributes && tag.attributes.length > 0) {
			attrs = tag.attributes;

			for (var i = attrs.length - 1; i >= 0; i--) {
				attrName = attrs[i].name;
				attrVal = attrs[i].value;

				// check for known booleans
				// the matching element property will return a value for typeof
				if (typeof tag[attrName] === 'boolean' || knownBooleans.indexOf(',' + attrName + ',') !== -1) {
					// the value of an included boolean attribute is typically an empty
					// string ('') which would equal false if we just check for a false value.
					// we also don't want support bad code like autoplay='false'
					attrVal = attrVal !== null ? true : false;
				}

				obj[attrName] = attrVal;
			}
		}

		return obj;
	},
	createElement: function (elm, props) {
		let el = document.createElement(elm);
		for (var k in props) {
			el.setAttribute(k, props[k]);
		};
		return el;
	},
	emptyElement: function (elm) {
		while (elm.firstChild) {
			elm.removeChild(elm.firstChild);
		}
		return elm;
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
	insertElAfter: function (el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
	},
	insertElBefore: function (el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode);
	},
	insertElFirst: function (el, referenceNode) {
		if (referenceNode.firstChild) {
			parent.insertBefore(el, referenceNode.firstChild);
		} else {
			referenceNode.appendChild(el);
		}
	},
	getTextContent: function (el) {
		return el.textContent || el.innerText;
	},
	/**
  * Offset Left
  * getBoundingClientRect technique from
  * John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
  *
  * @function findElPosition
  * @param {Element} el Element from which to get offset
  * @return {Object}
  */
	findElPosition: findElPosition,
	/**
  * Get pointer position in element
  * Returns an object with x and y coordinates.
  * The base on the coordinates are the bottom left of the element.
  *
  * @function getPointerPosition
  * @param {Element} el Element on which to get the pointer position on
  * @param {Event} event Event object
  * @return {Object} This object will have x and y coordinates corresponding to the mouse position
  */
	getPointerPosition: function (el, event) {
		let position = {};
		let box = findElPosition(el);
		let boxW = el.offsetWidth;
		let boxH = el.offsetHeight;

		let boxY = box.top;
		let boxX = box.left;
		let pageY = event.pageY;
		let pageX = event.pageX;

		if (event.changedTouches) {
			pageX = event.changedTouches[0].pageX;
			pageY = event.changedTouches[0].pageY;
		}

		position.y = Math.max(0, Math.min(1, (boxY - pageY + boxH) / boxH));
		position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));

		return position;
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

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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
		let color = null;
		if (c != null) {
			color = tinycolor$1(c);
			if (color.isValid()) {
				color.setAlpha(a);
				el.style.backgroundColor = color.toString();
			}
		} else {
			color = tinycolor$1(el.style.backgroundColor);
			if (color.isValid()) {
				color.setAlpha(a);
				el.style.backgroundColor = color.toString();
			}
		}
		return el.style.backgroundColor;
	};
}

const bigButton = '<svg x="0px" y="0px" width="98px" height="98px" viewBox="0 0 213.7 213.7" enable-background="new 0 0 213.7 213.7" xml:space="preserve"><polygon class="triangle" id="XMLID_18_" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="73.5,62.5 148.5,105.8 73.5,149.1 "></polygon><circle class="circle" id="XMLID_17_" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="106.8" cy="106.8" r="103.3"></circle></svg>';
function bigPlay (parentPlayer) {
	return function () {
		let bigPlayButton = function () {
			let isMobile = parentPlayer.device.isMobile;
			let autoplay = parentPlayer.__settings['autoplay'];
			let wrapper = dom.createElement('div', { class: "kmlBigPlay hidden" });
			let btn = dom.createElement('div', { class: 'kmlBigPlayButton' });
			btn.innerHTML = bigButton;
			let circle = dom.select('.triangle', btn);
			let triangle = dom.select('.circle', btn);
			wrapper.addEventListener('click', () => {
				parentPlayer.play();
			});
			wrapper.appendChild(btn);
			parentPlayer.wrapper.appendChild(wrapper);
			let hasExternalSeekEnabled = true;
			this.show = () => {
				hasExternalSeekEnabled = parentPlayer.externalControls.seekEnabled();
				parentPlayer.externalControls.seekEnabled(false);
				if (parentPlayer.containers) {
					parentPlayer.containers.hide();
				}
				parentPlayer.pause();
				wrapper.style.display = "block";
				dom.removeClass(wrapper, 'hidden');
			};
			this.hide = () => {
				parentPlayer.externalControls.seekEnabled(hasExternalSeekEnabled);
				dom.addClass(wrapper, 'hidden');
				setTimeout(() => {
					wrapper.style.display = "none";
					if (parentPlayer.containers) {
						parentPlayer.containers.show();
					}
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

			this.backgroundColor = backgroundColor(wrapper);
			this.color = c => {
				circle.style.stroke = triangle.style.stroke = c;
			};
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
 * Detect if the argument passed is a string
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isString(v) {
	return typeof v === 'string';
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

/**
 * Detect if the argument passed is an object, exclude null.
 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isObject(v) {
	return v && typeof v === 'object'; // typeof null is 'object'
}

/**
 * Check whether an object is a kind of array
 * @param   { * } a - anything
 * @returns {Boolean} is 'a' an array?
 */
function isArray(a) {
	return Array.isArray(a) || a instanceof Array;
}

/**
 * Detect if the argument passed is an Dom element, exclude null.
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isDomElement(v) {
	if (v != null) return v.nodeName;
	return false;
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
	return {
		fontSize: r,
		lineHeight: l
	};
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

var index$1 = createCommonjsModule(function (module) {
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

var Events = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

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

let defaults$4 = {
    once: null,
    start: 0,
    end: -1,
    on: {
        start: function () {},
        end: function () {},
        click: function () {},
        process: function () {}
    },
    className: 'kmlCuepoint',
    classActive: null,
    classInactive: null,
    label: null,
    width: null,
    content: null
};
class Cuepoint extends Events {
    constructor(parentPlayer, options, parentWrapper) {
        super();
        this.__settings = deepmerge(defaults$4, options);
        this.__fired = false;
        this.__onceStart = false;
        this.__onceEnd = false;

        this.el = false;
        this.parentPlayer = parentPlayer;
        this.parentWrapper = parentWrapper;
        for (var k in this.__settings['on']) {
            if (isFunction(this.__settings['on'][k])) {
                this.on(k, this.__settings['on'][k]);
            }
        }
        this.addVisual(this.__settings['content']);
        this.activate();
    }
    processHandler() {
        let d = this.parentPlayer.currentTime();
        this.__settings['on']['process'](d);
        //Check if current time is between start and end
        if (d >= this.__settings['start'] && (this.__settings['end'] < 0 || d < this.__settings['end'])) {
            if (this.__fired) {
                //Do nothing if start has already been called
                return;
            }
            if (!this.__onceStart) {
                this.emit('start'); //Call start function
                if (this.el) {
                    if (!dom.hasClass(this.el, this.__settings['classActive'])) {
                        dom.removeClass(this.el, this.__settings['classInactive']);
                        dom.addClass(this.el, this.__settings['classActive']);
                    }
                }
                if (this.__settings['once']) {
                    this.__onceStart = true;
                }
            }
            this.__fired = true;
        } else {
            if (!this.__onceEnd) {
                if (this.el) {
                    if (!dom.hasClass(this.el, this.__settings['classInactive'])) {
                        dom.removeClass(this.el, this.__settings['classActive']);
                        dom.addClass(this.el, this.__settings['classInactive']);
                    }
                }
            }
            if (!this.__fired) {
                //Do nothing if end has already been called
                return;
            }
            if (!this.__onceEnd) {
                this.emit('end');
                if (this.__settings['once']) {
                    this.__onceEnd = true;
                }
            }
            this.__fired = false;
        }
    }
    activate() {
        if (!this.__process) {
            this.__process = () => {
                this.processHandler();
            };
        }
        this.parentPlayer.on('timeupdate', this.__process);
        this.emit('activate');
    }
    suspend() {
        this.parentPlayer.off('timeupdate', this.__process);
        this.emit('suspend');
    }
    destroy() {
        if (this.el) {
            this.el.style.display = "none";
        }
        this.emit('destroy');
        this.__fired = false;
        if (this.el) {
            if (suspend) this.suspend();
            this.el.style.display = "none";
        }
    }
    addVisual(visual) {
        if (!this.el) {
            if (visual) {
                if (visual instanceof HTMLElement) {
                    this.el = visual;
                } else if (!!visual) {
                    this.el = document.createElement('div');
                    //add label only when visual is set to true - default
                    if (isString(this.__settings['label'])) {
                        this.label = document.createElement('span');
                        this.label.innerHTML = this.__settings['label'];
                        this.el.appendChild(this.label);
                    }
                } else {
                    return;
                }
                dom.addClass(this.el, this.__settings['className']);
                if (this.__settings['start'] > 0) {
                    dom.addClass(this.el, this.__settings['classInactive']);
                    this.el.style.left = Math.round(this.__settings['start'] / this.parentPlayer.duration() * 100) + '%';
                }
                if (this.__settings['width'] && this.__settings['end'] > 1) {
                    this.el.style.right = Math.round(100 - this.__settings['end'] / this.parentPlayer.duration() * 100) + '%';
                }

                this.el.addEventListener('click', () => {
                    this.emit('click');
                });
                if (this.parentWrapper) {
                    this.parentWrapper.appendChild(this.el);
                }
            }
        }
    }
    activateVisual(resume) {
        if (this.el) {
            if (resume) this.activate();
            this.el.style.display = "block";
        }
    }
    disableVisual(suspend) {
        if (this.el) {
            if (suspend) this.suspend();
            this.el.style.display = "none";
        }
    }
    addClass(cls) {
        if (this.el) {
            dom.addClass(this.el, cls);
        }
    }
    removeClass(cls) {
        if (this.el) {
            dom.removeClass(this.el, cls);
        }
    }
    toggleClass(cls) {
        if (this.el) {
            dom.toggleClass(this.el, cls);
        }
    }
}

let defaults$2 = {
	backgroundColor: '',
	on: {
		hide: function () {},
		show: function () {},
		click: function () {}
	},
	cuepoints: [],
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
		for (var k in this._settings['on']) {
			if (isFunction(this._settings['on'][k])) {
				this.on(k, this._settings['on'][k]);
			}
		}
		let cuepoints = [];
		this.cuepoint = options => {
			let cp = new Cuepoint(parentPlayer, options);
			//check if you keep them by default
			//cp.on('start', ()=>{console.log('logo show');this.show();});
			//cp.on('end', ()=>{console.log('logo hide');this.hide();});
			cuepoints.push(cp);
			return cp;
		};
		this.cuepoints = () => {
			return cuepoints;
		};
		for (var k in this._settings['cuepoints']) {
			this.cuepoint(this._settings['cuepoints'][k]);
		}
		this.wrapper.addEventListener('click', () => {
			this.emit('click');
		});
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

let defaults$5 = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	origin: "topLeft",
	start: 0,
	end: -1,
	className: "kmlHotspot",
	on: {
		show: function () {},
		hide: function () {},
		mouseEnter: function () {},
		mouseLeave: function () {},
		mouseMove: function () {},
		click: function () {}
	},
	content: null,
	font: 100,
	path: false,
	visible: void 0
};

// check if it is better to use babel-polyfill or write the module not as a es6 class
// const forceHide = Symbol('forceHide');
// const pathStart = Symbol('pathStart');
// const pathEnd = Symbol('pathEnd');
// const refreshEnd = Symbol('refreshEnd');
// const refreshStart = Symbol('refreshStart');

class Hotspot extends Events {
	constructor(parentPlayer, options) {
		super();
		//somewhat private variables
		this.__forceHide = false;
		this.__pathStart = void 0;
		this.__pathEnd = void 0;
		this.__refreshStart = 0;
		this.__refreshEnd = 0;
		//create hotspot wrapper
		this.wrapper = dom.createElement('div');
		this.wrapper.backgroundColor = backgroundColor(this.wrapper);

		//convert position and size to absolute values
		options = deepmerge(options, relativeSizePos(parentPlayer, options));

		this.__settings = deepmerge(defaults$5, options);
		this.parentPlayer = parentPlayer;
		this.x = this.__settings.x;
		this.y = this.__settings.y;
		this.width = this.__settings.width;
		this.height = this.__settings.height;
		this.origin = this.__settings.origin;
		this.start = this.__settings.start;
		this.end = this.__settings.end;
		this.path = this.__settings.path;
		this.visible = this.__settings.visible;
		if (isArray(this.path)) {
			if (this.path[0]['start']) this.__pathStart = this.path[0]['start'];
			if (this.path[this.path.length - 1]['end']) this.__pathEnd = this.path[this.path.length - 1]['end'];
		} else {
			this.path = false;
		}

		for (var k in this.__settings['on']) {
			let fn = this.__settings['on'][k];
			if (isFunction(fn)) {
				this.on(k, e => {
					fn(e);
				});
			}
		}

		this.init();
	}
	init() {
		this.addClass(this.__settings['className']);
		this.wrapper.style.position = "absolute";
		this.wrapper.style.top = (this.y || 0) + "%";
		this.wrapper.style.left = (this.x || 0) + "%";
		this.wrapper.style.width = (this.width || 0) + "%";
		this.wrapper.style.height = (this.height || 0) + "%";
		this.wrapper.addEventListener('click', e => {
			this.emit('click', e);
		});
		this.wrapper.addEventListener('mouseenter', e => {
			this.emit('mouseEnter', e);
		});
		this.wrapper.addEventListener('mouseleave', e => {
			this.emit('mouseLeave', e);
		});
		this.wrapper.addEventListener('mousemove', e => {
			this.emit('mouseMove', e);
		});

		if (this.start > 0) {
			this.visible = false;
			this.wrapper.style.display = "none";
		} else {
			this.visible = true;
			this.wrapper.style.display = "block";
		}
	}
	addClass(cls) {
		dom.addClass(this.wrapper, cls);
	}
	removeClass(cls) {
		dom.removeClass(this.wrapper, cls);
	}
	toggleClass(cls) {
		dom.toggleClass(this.wrapper, cls);
	}
	content(cnt) {
		if (cnt != null) {
			if (isFunction(cnt)) {
				cnt(this.wrapper).bind(this);
			}
			if (isDomElement(cnt)) {
				this.wrapper.appendChild(cnt);
			}
			if (isString(cnt)) {
				this.wrapper.innerHTML = cnt;
			}
			if (isObject(cnt)) {
				for (var k in cnt) {
					this.content(cnt[k]);
				}
			}
		}
		return this.wrapper;
	}
	font() {
		this.wrapper.fontSize = this.__settings['font'] + "%";
	}
	checkRefresh(t) {
		if (this.__pathStart != null && this.__pathEnd != null) {
			if (t >= this.__pathStart && t <= this.__pathEnd) {
				if (this.__refreshStart !== 0) this.__refreshStart = 0;
				if (this.__refreshEnd !== 0) this.__refreshEnd = 0;
			} else {
				if (t < this.__pathStart && this.__refreshStart !== 1) {
					this.resize();
					this.__refreshStart = 1;
				}
				if (t > this.__pathEnd && this.__refreshEnd !== 1) {
					this.resize();
					this.__refreshEnd = 1;
				}
			}
		}
	}
	resize(o, s) {
		if (this.visible) {
			// var p = player.bounds();
			// if (o === undefined) o = {
			// 	x: this.x,
			// 	y: this.y
			// };
			// if (s === undefined) s = {
			// 	width: this.width,
			// 	height: this.height
			// };

			// var oWidth = s.width * p.width / p.width_org,
			// 	oHeight = s.height * p.height / p.height_org,
			// 	posX = p.offset_x + o.x * p.width / p.width_org,
			// 	posY = p.offset_y + o.y * p.height / p.height_org,
			// 	c = setCenterPoint(posX, posY, oWidth, oHeight, this.origin),
			// 	transform = "";
			// posX = c.x;
			// posY = c.y;
			// this.el_.style.width = oWidth + "px";
			// this.el_.style.height = oHeight + "px";
			// this._width = oWidth;
			// this._height = oHeight;
			// if (stylePrefix.transform) {
			// 	transform += translate(posX, posY);
			// 	this.el_.style[stylePrefix.transform] = transform;
			// 	return
			// }
			// this.el_.style.left = posX + "px";
			// this.el_.style.top = posY + "px";
		}
	}
	destroy() {
		this.removeEventListeners();
		dom.removeElement(this.wrapper);
	}
	show() {
		this.__forceHide = false;
		this.visible = true;
		this.resize();
		this.font();
		this.wrapper.style.display = "block";
		this.emit('show');
	}
	_show() {
		if (!this.visible && !this.__forceHide) {
			this.visible = true;
			this.resize();
			this.font();
			this.wrapper.style.display = "block";
			this.emit('show');
		}
	}
	hide() {
		this.__forceHide = true;
		this._hide();
	}
	_hide() {
		if (this.visible) {
			this.visible = false;
			this.emit('hide');
			this.wrapper.style.display = "none";
		}
	}
	originPoint(origin) {
		if (origin != void 0) {
			this.origin = origin;
			this.resize();
		}
		return this.origin;
	}
}

let defaults$6 = {
	backgroundColor: '',
	on: {
		show: function () {},
		beforeShow: function () {},
		beforeHide: function () {},
		hide: function () {}
	},
	width: "60%",
	height: "60%",
	header: true,
	headerBg: "#23DB90",
	cuepoints: [],
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

		this._settings = deepmerge(defaults$6, opts);

		//header
		if (this._settings['header']) {
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
		} else {
			dom.removeClass(overlay, 'triggerClose');
		}
		this.body.backgroundColor = backgroundColor(this.body);
		this.overlay.backgroundColor = backgroundColor(this.overlay);
		//end header

		this._visible = false;
		this.parentPlayerPaused = false;
		if (this._settings['header']) {
			this.header.backgroundColor(this._settings.headerBg, 1);
			this.title(this._settings.title);
		}
		this._cache = {};
		this.backgroundColor = backgroundColor(overlay);
		this.parent = parent;
		this.parentPlayer = parentPlayer;

		this.setSize = function (s) {
			let d = this.settings({ x: (100 - s) / 2 + "%", y: (100 - s) / 2 + "%", width: s + "%", height: s + "%" });
			if (this._settings['header']) {
				if (d.y < 10) {
					header.style.transform = 'translateY(0)';
				} else {
					header.style.transform = 'translateY(-100%)';
				}
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

		for (var k in this._settings['on']) {
			if (isFunction(this._settings['on'][k])) {
				this.on(k, this._settings['on'][k]);
			}
		}

		let cuepoints = [];
		this.cuepoint = options => {
			let cp = new Cuepoint(parentPlayer, options);
			//check if you keep them by default
			//cp.on('start', ()=>{console.log('logo show');this.show();});
			//cp.on('end', ()=>{console.log('logo hide');this.hide();});
			cuepoints.push(cp);
			return cp;
		};
		this.cuepoints = () => {
			return cuepoints;
		};

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
		if (cls != 'kmlPopup') dom.addClass(this.body, cls);
	}
	removeClass(cls) {
		if (cls != 'kmlPopup') dom.removeClass(this.body, cls);
	}
	toggleClass(cls) {
		if (cls != 'kmlPopup') dom.toggleClass(this.body, cls);
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
				if (this._title) dom.autoLineHeight(this._title.parentNode);
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

let defaults$8 = {
	x: 0,
	width: '100%',
	height: '6%',
	minHeight: 32
};
function Timeline (parentPlayer) {
	return function () {
		let Timeline = function () {
			let fragment = document.createDocumentFragment();
			let playBtn = dom.createElement('button', {
				'class': 'play'
			});
			let pc = dom.createElement('div', {
				'class': 'kmlCuepoints'
			});
			let pl = dom.createElement('div', {
				'class': 'progressline'
			});
			//pl.appendChild(dom.createElement('div', {'class': 'progressBubble'}));
			fragment.appendChild(playBtn);
			fragment.appendChild(pc);
			this.cuepointsWrapper = pc;
			let wrapper = null;
			if (parentPlayer.timelineContainer != null) {
				this.wrapper = parentPlayer.timelineContainer(defaults$8);
				this.wrapper.content(fragment);
				wrapper = this.wrapper.wrapper;
			} else {
				this.wrapper = dom.createElement('div', {
					class: "kmlTimeline",
					style: "position: absolute; left: 0; width: " + defaults$8.width + "; height: " + defaults$8.height + "; top: auto; bottom: 0;"
				});
				parentPlayer.wrapper.appendChild(this.wrapper);
				wrapper = this.wrapper;
				this.wrapper.appendChild(fragment);
			}
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
				let sc = procentFromString(defaults$8.height) * parentPlayer.height() / 100;
				if (cache_sc != sc) {
					cache_sc = sc;
					if (sc < defaults$8.minHeight) {
						w = sc = defaults$8.minHeight;
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: defaults$8.minHeight + "px"
							});
						} else {
							wrapper.style.height = defaults$8.minHeight + "px";
						}
						playBtn.style.width = w + "px";
						pc.style.left = w + "px";
						pc.style.right = 0 + "px";
					} else {
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: defaults$8.height
							});
						} else {
							wrapper.style.height = defaults$8.height;
						}
						w = sc / parentPlayer.width() * 100;
						playBtn.style.width = w + "%";
						pc.style.left = w + "%";
						pc.style.right = 0 + "%";
					}
				}
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

let _doc = document || {};
//rewrite as a class that extends the events - for better modularity
let externalControls = function (parentPlayer) {
	let _enabled = true;
	let _seek = true;
	let _tId = null;
	let media = parentPlayer.media;
	let keydown = function (e) {
		if (_enabled) {
			//bypass default native external controls when media is focused
			parentPlayer.wrapper.focus();
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
					parentPlayer.emit('replay', 5);
					return;
				}
				if (e.keyCode == 39) {
					//right
					media.currentTime = media.currentTime + 5;
					parentPlayer.emit('forward', 5);
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
			if (_seek) {
				if (e.keyCode == 37) {
					//left
					parentPlayer.emit('replay', false);
					return;
				}
				if (e.keyCode == 39) {
					//right
					parentPlayer.emit('forward', false);
					return;
				}
			}
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
		_doc.body.addEventListener('keydown', keydown.bind(this), false);
		_doc.body.addEventListener('keyup', keyup.bind(this), false);
	};
	this.destroy = function () {
		_enabled = false;
		_tId = null;
		_seek = true;
		_doc.body.removeEventListener('keydown', keydown);
		_doc.body.removeEventListener('keyup', keyup);
	};
	this.init();
};

let defaults$9 = {
	wrapper: null,
	on: {
		show: function () {},
		hide: function () {}
	}
};
class Cuepoints extends Events {
	constructor(parentPlayer, options) {
		super();
		this.parentPlayer = parentPlayer;
		this.settings = deepmerge(defaults$9, options);
		this.instances = [];
		this.wrapper = null;
		for (var k in this.settings['on']) {
			if (isFunction(this.settings['on'][k])) {
				this.on(k, this.settings['on'][k]);
			}
		}
		let el = this.settings["wrapper"];
		if (typeof el === 'string') this.wrapper = document.querySelector(el);
		if (el instanceof HTMLElement) this.wrapper = el;
		if (this.wrapper != null) {
			if (parentPlayer.timeline) {
				if (parentPlayer.timeline.cuepointsWrapper) {
					this.wrapper = parentPlayer.timeline.cuepointsWrapper;
				}
			}
		}
	}
	add(options, wrapper) {
		if (wrapper != null) this.wrapper = wrapper;
		var cp = new Cuepoint(this.parentPlayer, options, this.wrapper);
		this.instances.push(cp);
		this.emit('add');
		return cp;
	}
	show() {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			if (cp.el) {
				cp.el.style.display = "block";
			}
		}
		this.emit('show');
	}
	hide() {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			if (cp.el) {
				cp.el.style.display = "none";
			}
		}
		this.emit('hide');
	}
	suspend() {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			cp.suspend();
		}
		this.emit('suspend');
	}
	activate() {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			cp.activate();
		}
		this.emit('activate');
	}
	destroy(keep) {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			if (cp.el) {
				cp.parentWrapper.removeChild(cp.el);
			}
			cp.destroy();
			if (keep == undefined) this.instances[i] = null;
		}
		if (keep == undefined) this.instances = [];
	}
	changeWrapper(el) {
		if (typeof el === 'string') this.wrapper = document.querySelector(el);
		if (el instanceof HTMLElement) this.wrapper = el;
		if (this.wrapper != null) {
			this.destroy(true);
			let j = this.instances.length;
			for (var i = 0; i < j; i++) {
				let cp = this.instances[i];
				if (cp.el) {
					cp.parentWrapper = this.wrapper;
					this.wrapper.appendChild(cp.el);
				}
				cp.activate();
			}
			this.emit('changeWrapper');
		}
	}
}

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
						parentPlayer.emit('user-idle', false);
					}
					clearTimeout(tid);
				}
				idle = false;
				tid = setTimeout(() => {
					idle = true;
					parentPlayer.emit('user-idle', true);
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
					parentPlayer.emit('user-idle', v);
					this.unwatch();
					idle = v;
				}
				return idle;
			};
			this.idle = v => {
				if (v != null) {
					v = !!v;
					parentPlayer.emit('user-idle', v);
					idle = v;
					tid = setTimeout(() => {
						idle = true;
						parentPlayer.emit('user-idle', true);
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

var _doc$1 = document || {};
// Set the name of the hidden property and the change event for visibility
var hidden;
var visibilityChange;
if (typeof _doc$1.hidden !== "undefined") {
	// Opera 12.10 and Firefox 18 and later support 
	hidden = "hidden";
	visibilityChange = "visibilitychange";
} else if (typeof _doc$1.mozHidden !== "undefined") {
	hidden = "mozHidden";
	visibilityChange = "mozvisibilitychange";
} else if (typeof _doc$1.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
} else if (typeof _doc$1.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
}

const isAvailable = function () {
	return !(typeof _doc$1[hidden] === "undefined");
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
			_doc$1.removeEventListener(visibilityChange, handleVisibilityChange, false);
			_media.removeEventListener('playing', setFlagPlaying);
		};
		let handleVisibilityChange = function () {
			if (_enabled) {
				if (_doc$1[hidden]) {
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
				_doc$1.removeEventListener(visibilityChange, handleVisibilityChange, false);
				_media.removeEventListener('playing', setFlagPlaying);

				events.visible = settings.onVisible || events.visible;
				events.hidden = settings.onHidden || events.hidden;
				_enabled = true;
				_doc$1.addEventListener(visibilityChange, handleVisibilityChange, false);
				_media.addEventListener('playing', setFlagPlaying);
			}
		};
		events.visible = settings.onVisible || events.visible;
		events.hidden = settings.onHidden || events.hidden;
		_enabled = true;
		_doc$1.addEventListener(visibilityChange, handleVisibilityChange, false);
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

const fn_contextmenu = function (e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
};

const defaults$7 = {
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
	constructor(settings) {
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

		this.settings(deepmerge(defaults$7, settings));

		//initPageVisibility
		this.pageVisibility = new pageVisibility(el);

		//initexternalControls
		this.externalControls = new externalControls(this);
		this.externalControls.enabled(this.__settings['externalControls']);

		//initUserActivity
		this.userActivity = new userActivity(this);

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

		this.cuepoint = function (options) {
			return new Cuepoint(this, options, null);
		};

		this.cuepoints = new Cuepoints(this);
	}

	initTimeline() {
		if (this.__settings['controls'] !== "native") {
			if (this.__settings['controls']) {
				this.timeline = new Timeline(this);
				if (!this.cuepoints.wrapper) {
					this.cuepoints.changeWrapper(this.timeline.cuepointsWrapper);
				}
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
		opts.size = opts.size || 80;
		let defaultSize = opts.size;
		this.setSize = function (s) {
			defaultSize = opts.size = s;
			this.emit('resize');
		};
		this.player.requestFullWindow = () => {
			opts.size = 100;
			this.overlay.backgroundColor("000000", 0.9);
			this.header.backgroundColor("000000", 0.6);
			this.emit('resize');
			this.player.emit('enterFullScreen');
			this.player.isFullWindow = function () {
				return true;
			};
		};
		this.player.cancelFullWindow = () => {
			this.overlay.backgroundColor("000000", 0.6);
			this.header.backgroundColor(this._settings.headerBg, 1);
			opts.size = defaultSize;
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
				fw = opts.size * (fw / w * 100) / 100;
				fh = opts.size;
			} else if (h > w / r) {
				fh = w / r;
				fw = w;
				hh = fh;
				headerHeight = h / 10 / fh * 100;
				fh = opts.size * (fh / h * 100) / 100;
				fw = opts.size;
			} else {
				fw = opts.size;
				fh = opts.size;
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

let defaults$10 = {
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
		this._settings = deepmerge(defaults$10, opts);
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
		let hotspots = dom.createElement('div', { class: 'hotspots' });
		let widgets = dom.createElement('div', { class: 'widgets' });
		let timelines = dom.createElement('div', { class: 'timelines' });

		this.wrapper.appendChild(hotspots);
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
				case 'hotspot':
					container = new Hotspot(parentPlayer, settings);
					hotspots.appendChild(container.wrapper);
					break;
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
		super(settings);

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

		//initBigPlay
		this.bigPlay = new bigPlay(this);

		//init timeline
		this.initTimeline();

		//initCallbackEvents
		if (isFunction(app)) {
			app.bind(this)();
		}

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

		checkVideoResize();
	}

	//overwrite bounds
	bounds(v) {
		if (this._bounds[v] != null) return this._bounds[v];
		return this._bounds;
	}

};

class Kumullus {
	constructor(settings) {
		this.player = new kmlPlayer(settings, this.init);
	}
	init() {
		console.log('init app');
	}
}

var interact = createCommonjsModule(function (module, exports) {
/**
 * interact.js v1.2.6
 *
 * Copyright (c) 2012-2015 Taye Adeyemi <dev@taye.me>
 * Open source under the MIT License.
 * https://raw.github.com/taye/interact.js/master/LICENSE
 */
(function (realWindow) {
    'use strict';

    // return early if there's no window to work with (eg. Node.js)
    if (!realWindow) { return; }

    var // get wrapped window if using Shadow DOM polyfill
        window = (function () {
            // create a TextNode
            var el = realWindow.document.createTextNode('');

            // check if it's wrapped by a polyfill
            if (el.ownerDocument !== realWindow.document
                && typeof realWindow.wrap === 'function'
                && realWindow.wrap(el) === el) {
                // return wrapped window
                return realWindow.wrap(realWindow);
            }

            // no Shadow DOM polyfil or native implementation
            return realWindow;
        }()),

        document           = window.document,
        DocumentFragment   = window.DocumentFragment   || blank,
        SVGElement         = window.SVGElement         || blank,
        SVGSVGElement      = window.SVGSVGElement      || blank,
        SVGElementInstance = window.SVGElementInstance || blank,
        HTMLElement        = window.HTMLElement        || window.Element,

        PointerEvent = (window.PointerEvent || window.MSPointerEvent),
        pEventTypes,

        hypot = Math.hypot || function (x, y) { return Math.sqrt(x * x + y * y); },

        tmpXY = {},     // reduce object creation in getXY()

        documents       = [],   // all documents being listened to

        interactables   = [],   // all set interactables
        interactions    = [],   // all interactions

        dynamicDrop     = false,

        // {
        //      type: {
        //          selectors: ['selector', ...],
        //          contexts : [document, ...],
        //          listeners: [[listener, useCapture], ...]
        //      }
        //  }
        delegatedEvents = {},

        defaultOptions = {
            base: {
                accept        : null,
                actionChecker : null,
                styleCursor   : true,
                preventDefault: 'auto',
                origin        : { x: 0, y: 0 },
                deltaSource   : 'page',
                allowFrom     : null,
                ignoreFrom    : null,
                _context      : document,
                dropChecker   : null
            },

            drag: {
                enabled: false,
                manualStart: true,
                max: Infinity,
                maxPerElement: 1,

                snap: null,
                restrict: null,
                inertia: null,
                autoScroll: null,

                axis: 'xy'
            },

            drop: {
                enabled: false,
                accept: null,
                overlap: 'pointer'
            },

            resize: {
                enabled: false,
                manualStart: false,
                max: Infinity,
                maxPerElement: 1,

                snap: null,
                restrict: null,
                inertia: null,
                autoScroll: null,

                square: false,
                preserveAspectRatio: false,
                axis: 'xy',

                // use default margin
                margin: NaN,

                // object with props left, right, top, bottom which are
                // true/false values to resize when the pointer is over that edge,
                // CSS selectors to match the handles for each direction
                // or the Elements for each handle
                edges: null,

                // a value of 'none' will limit the resize rect to a minimum of 0x0
                // 'negate' will alow the rect to have negative width/height
                // 'reposition' will keep the width/height positive by swapping
                // the top and bottom edges and/or swapping the left and right edges
                invert: 'none'
            },

            gesture: {
                manualStart: false,
                enabled: false,
                max: Infinity,
                maxPerElement: 1,

                restrict: null
            },

            perAction: {
                manualStart: false,
                max: Infinity,
                maxPerElement: 1,

                snap: {
                    enabled     : false,
                    endOnly     : false,
                    range       : Infinity,
                    targets     : null,
                    offsets     : null,

                    relativePoints: null
                },

                restrict: {
                    enabled: false,
                    endOnly: false
                },

                autoScroll: {
                    enabled     : false,
                    container   : null,     // the item that is scrolled (Window or HTMLElement)
                    margin      : 60,
                    speed       : 300       // the scroll speed in pixels per second
                },

                inertia: {
                    enabled          : false,
                    resistance       : 10,    // the lambda in exponential decay
                    minSpeed         : 100,   // target speed must be above this for inertia to start
                    endSpeed         : 10,    // the speed at which inertia is slow enough to stop
                    allowResume      : true,  // allow resuming an action in inertia phase
                    zeroResumeDelta  : true,  // if an action is resumed after launch, set dx/dy to 0
                    smoothEndDuration: 300    // animate to snap/restrict endOnly if there's no inertia
                }
            },

            _holdDuration: 600
        },

        // Things related to autoScroll
        autoScroll = {
            interaction: null,
            i: null,    // the handle returned by window.setInterval
            x: 0, y: 0, // Direction each pulse is to scroll in

            // scroll the window by the values in scroll.x/y
            scroll: function () {
                var options = autoScroll.interaction.target.options[autoScroll.interaction.prepared.name].autoScroll,
                    container = options.container || getWindow(autoScroll.interaction.element),
                    now = new Date().getTime(),
                    // change in time in seconds
                    dtx = (now - autoScroll.prevTimeX) / 1000,
                    dty = (now - autoScroll.prevTimeY) / 1000,
                    vx, vy, sx, sy;

                // displacement
                if (options.velocity) {
                  vx = options.velocity.x;
                  vy = options.velocity.y;
                }
                else {
                  vx = vy = options.speed
                }
 
                sx = vx * dtx;
                sy = vy * dty;

                if (sx >= 1 || sy >= 1) {
                    if (isWindow(container)) {
                        container.scrollBy(autoScroll.x * sx, autoScroll.y * sy);
                    }
                    else if (container) {
                        container.scrollLeft += autoScroll.x * sx;
                        container.scrollTop  += autoScroll.y * sy;
                    }

                    if (sx >=1) autoScroll.prevTimeX = now;
                    if (sy >= 1) autoScroll.prevTimeY = now;
                }

                if (autoScroll.isScrolling) {
                    cancelFrame(autoScroll.i);
                    autoScroll.i = reqFrame(autoScroll.scroll);
                }
            },

            isScrolling: false,
            prevTimeX: 0,
            prevTimeY: 0,

            start: function (interaction) {
                autoScroll.isScrolling = true;
                cancelFrame(autoScroll.i);

                autoScroll.interaction = interaction;
                autoScroll.prevTimeX = new Date().getTime();
                autoScroll.prevTimeY = new Date().getTime();
                autoScroll.i = reqFrame(autoScroll.scroll);
            },

            stop: function () {
                autoScroll.isScrolling = false;
                cancelFrame(autoScroll.i);
            }
        },

        // Does the browser support touch input?
        supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),

        // Does the browser support PointerEvents
        supportsPointerEvent = !!PointerEvent,

        // Less Precision with touch input
        margin = supportsTouch || supportsPointerEvent? 20: 10,

        pointerMoveTolerance = 1,

        // for ignoring browser's simulated mouse events
        prevTouchTime = 0,

        // Allow this many interactions to happen simultaneously
        maxInteractions = Infinity,

        // Check if is IE9 or older
        actionCursors = (document.all && !window.atob) ? {
            drag    : 'move',
            resizex : 'e-resize',
            resizey : 's-resize',
            resizexy: 'se-resize',

            resizetop        : 'n-resize',
            resizeleft       : 'w-resize',
            resizebottom     : 's-resize',
            resizeright      : 'e-resize',
            resizetopleft    : 'se-resize',
            resizebottomright: 'se-resize',
            resizetopright   : 'ne-resize',
            resizebottomleft : 'ne-resize',

            gesture : ''
        } : {
            drag    : 'move',
            resizex : 'ew-resize',
            resizey : 'ns-resize',
            resizexy: 'nwse-resize',

            resizetop        : 'ns-resize',
            resizeleft       : 'ew-resize',
            resizebottom     : 'ns-resize',
            resizeright      : 'ew-resize',
            resizetopleft    : 'nwse-resize',
            resizebottomright: 'nwse-resize',
            resizetopright   : 'nesw-resize',
            resizebottomleft : 'nesw-resize',

            gesture : ''
        },

        actionIsEnabled = {
            drag   : true,
            resize : true,
            gesture: true
        },

        // because Webkit and Opera still use 'mousewheel' event type
        wheelEvent = 'onmousewheel' in document? 'mousewheel': 'wheel',

        eventTypes = [
            'dragstart',
            'dragmove',
            'draginertiastart',
            'dragend',
            'dragenter',
            'dragleave',
            'dropactivate',
            'dropdeactivate',
            'dropmove',
            'drop',
            'resizestart',
            'resizemove',
            'resizeinertiastart',
            'resizeend',
            'gesturestart',
            'gesturemove',
            'gestureinertiastart',
            'gestureend',

            'down',
            'move',
            'up',
            'cancel',
            'tap',
            'doubletap',
            'hold'
        ],

        globalEvents = {},

        // Opera Mobile must be handled differently
        isOperaMobile = navigator.appName == 'Opera' &&
            supportsTouch &&
            navigator.userAgent.match('Presto'),

        // scrolling doesn't change the result of getClientRects on iOS 7
        isIOS7 = (/iP(hone|od|ad)/.test(navigator.platform)
                         && /OS 7[^\d]/.test(navigator.appVersion)),

        // prefix matchesSelector
        prefixedMatchesSelector = 'matches' in Element.prototype?
                'matches': 'webkitMatchesSelector' in Element.prototype?
                    'webkitMatchesSelector': 'mozMatchesSelector' in Element.prototype?
                        'mozMatchesSelector': 'oMatchesSelector' in Element.prototype?
                            'oMatchesSelector': 'msMatchesSelector',

        // will be polyfill function if browser is IE8
        ie8MatchesSelector,

        // native requestAnimationFrame or polyfill
        reqFrame = realWindow.requestAnimationFrame,
        cancelFrame = realWindow.cancelAnimationFrame,

        // Events wrapper
        events = (function () {
            var useAttachEvent = ('attachEvent' in window) && !('addEventListener' in window),
                addEvent       = useAttachEvent?  'attachEvent': 'addEventListener',
                removeEvent    = useAttachEvent?  'detachEvent': 'removeEventListener',
                on             = useAttachEvent? 'on': '',

                elements          = [],
                targets           = [],
                attachedListeners = [];

            function add (element, type, listener, useCapture) {
                var elementIndex = indexOf(elements, element),
                    target = targets[elementIndex];

                if (!target) {
                    target = {
                        events: {},
                        typeCount: 0
                    };

                    elementIndex = elements.push(element) - 1;
                    targets.push(target);

                    attachedListeners.push((useAttachEvent ? {
                            supplied: [],
                            wrapped : [],
                            useCount: []
                        } : null));
                }

                if (!target.events[type]) {
                    target.events[type] = [];
                    target.typeCount++;
                }

                if (!contains(target.events[type], listener)) {
                    var ret;

                    if (useAttachEvent) {
                        var listeners = attachedListeners[elementIndex],
                            listenerIndex = indexOf(listeners.supplied, listener);

                        var wrapped = listeners.wrapped[listenerIndex] || function (event) {
                            if (!event.immediatePropagationStopped) {
                                event.target = event.srcElement;
                                event.currentTarget = element;

                                event.preventDefault = event.preventDefault || preventDef;
                                event.stopPropagation = event.stopPropagation || stopProp;
                                event.stopImmediatePropagation = event.stopImmediatePropagation || stopImmProp;

                                if (/mouse|click/.test(event.type)) {
                                    event.pageX = event.clientX + getWindow(element).document.documentElement.scrollLeft;
                                    event.pageY = event.clientY + getWindow(element).document.documentElement.scrollTop;
                                }

                                listener(event);
                            }
                        };

                        ret = element[addEvent](on + type, wrapped, Boolean(useCapture));

                        if (listenerIndex === -1) {
                            listeners.supplied.push(listener);
                            listeners.wrapped.push(wrapped);
                            listeners.useCount.push(1);
                        }
                        else {
                            listeners.useCount[listenerIndex]++;
                        }
                    }
                    else {
                        ret = element[addEvent](type, listener, useCapture || false);
                    }
                    target.events[type].push(listener);

                    return ret;
                }
            }

            function remove (element, type, listener, useCapture) {
                var i,
                    elementIndex = indexOf(elements, element),
                    target = targets[elementIndex],
                    listeners,
                    listenerIndex,
                    wrapped = listener;

                if (!target || !target.events) {
                    return;
                }

                if (useAttachEvent) {
                    listeners = attachedListeners[elementIndex];
                    listenerIndex = indexOf(listeners.supplied, listener);
                    wrapped = listeners.wrapped[listenerIndex];
                }

                if (type === 'all') {
                    for (type in target.events) {
                        if (target.events.hasOwnProperty(type)) {
                            remove(element, type, 'all');
                        }
                    }
                    return;
                }

                if (target.events[type]) {
                    var len = target.events[type].length;

                    if (listener === 'all') {
                        for (i = 0; i < len; i++) {
                            remove(element, type, target.events[type][i], Boolean(useCapture));
                        }
                        return;
                    } else {
                        for (i = 0; i < len; i++) {
                            if (target.events[type][i] === listener) {
                                element[removeEvent](on + type, wrapped, useCapture || false);
                                target.events[type].splice(i, 1);

                                if (useAttachEvent && listeners) {
                                    listeners.useCount[listenerIndex]--;
                                    if (listeners.useCount[listenerIndex] === 0) {
                                        listeners.supplied.splice(listenerIndex, 1);
                                        listeners.wrapped.splice(listenerIndex, 1);
                                        listeners.useCount.splice(listenerIndex, 1);
                                    }
                                }

                                break;
                            }
                        }
                    }

                    if (target.events[type] && target.events[type].length === 0) {
                        target.events[type] = null;
                        target.typeCount--;
                    }
                }

                if (!target.typeCount) {
                    targets.splice(elementIndex, 1);
                    elements.splice(elementIndex, 1);
                    attachedListeners.splice(elementIndex, 1);
                }
            }

            function preventDef () {
                this.returnValue = false;
            }

            function stopProp () {
                this.cancelBubble = true;
            }

            function stopImmProp () {
                this.cancelBubble = true;
                this.immediatePropagationStopped = true;
            }

            return {
                add: add,
                remove: remove,
                useAttachEvent: useAttachEvent,

                _elements: elements,
                _targets: targets,
                _attachedListeners: attachedListeners
            };
        }());

    function blank () {}

    function isElement (o) {
        if (!o || (typeof o !== 'object')) { return false; }

        var _window = getWindow(o) || window;

        return (/object|function/.test(typeof _window.Element)
            ? o instanceof _window.Element //DOM2
            : o.nodeType === 1 && typeof o.nodeName === "string");
    }
    function isWindow (thing) { return thing === window || !!(thing && thing.Window) && (thing instanceof thing.Window); }
    function isDocFrag (thing) { return !!thing && thing instanceof DocumentFragment; }
    function isArray (thing) {
        return isObject(thing)
                && (typeof thing.length !== undefined)
                && isFunction(thing.splice);
    }
    function isObject   (thing) { return !!thing && (typeof thing === 'object'); }
    function isFunction (thing) { return typeof thing === 'function'; }
    function isNumber   (thing) { return typeof thing === 'number'  ; }
    function isBool     (thing) { return typeof thing === 'boolean' ; }
    function isString   (thing) { return typeof thing === 'string'  ; }

    function trySelector (value) {
        if (!isString(value)) { return false; }

        // an exception will be raised if it is invalid
        document.querySelector(value);
        return true;
    }

    function extend (dest, source) {
        for (var prop in source) {
            dest[prop] = source[prop];
        }
        return dest;
    }

    var prefixedPropREs = {
      webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/
    };

    function pointerExtend (dest, source) {
        for (var prop in source) {
          var deprecated = false;

          // skip deprecated prefixed properties
          for (var vendor in prefixedPropREs) {
            if (prop.indexOf(vendor) === 0 && prefixedPropREs[vendor].test(prop)) {
              deprecated = true;
              break;
            }
          }

          if (!deprecated) {
            dest[prop] = source[prop];
          }
        }
        return dest;
    }

    function copyCoords (dest, src) {
        dest.page = dest.page || {};
        dest.page.x = src.page.x;
        dest.page.y = src.page.y;

        dest.client = dest.client || {};
        dest.client.x = src.client.x;
        dest.client.y = src.client.y;

        dest.timeStamp = src.timeStamp;
    }

    function setEventXY (targetObj, pointers, interaction) {
        var pointer = (pointers.length > 1
                       ? pointerAverage(pointers)
                       : pointers[0]);

        getPageXY(pointer, tmpXY, interaction);
        targetObj.page.x = tmpXY.x;
        targetObj.page.y = tmpXY.y;

        getClientXY(pointer, tmpXY, interaction);
        targetObj.client.x = tmpXY.x;
        targetObj.client.y = tmpXY.y;

        targetObj.timeStamp = new Date().getTime();
    }

    function setEventDeltas (targetObj, prev, cur) {
        targetObj.page.x     = cur.page.x      - prev.page.x;
        targetObj.page.y     = cur.page.y      - prev.page.y;
        targetObj.client.x   = cur.client.x    - prev.client.x;
        targetObj.client.y   = cur.client.y    - prev.client.y;
        targetObj.timeStamp = new Date().getTime() - prev.timeStamp;

        // set pointer velocity
        var dt = Math.max(targetObj.timeStamp / 1000, 0.001);
        targetObj.page.speed   = hypot(targetObj.page.x, targetObj.page.y) / dt;
        targetObj.page.vx      = targetObj.page.x / dt;
        targetObj.page.vy      = targetObj.page.y / dt;

        targetObj.client.speed = hypot(targetObj.client.x, targetObj.page.y) / dt;
        targetObj.client.vx    = targetObj.client.x / dt;
        targetObj.client.vy    = targetObj.client.y / dt;
    }

    function isNativePointer (pointer) {
        return (pointer instanceof window.Event
            || (supportsTouch && window.Touch && pointer instanceof window.Touch));
    }

    // Get specified X/Y coords for mouse or event.touches[0]
    function getXY (type, pointer, xy) {
        xy = xy || {};
        type = type || 'page';

        xy.x = pointer[type + 'X'];
        xy.y = pointer[type + 'Y'];

        return xy;
    }

    function getPageXY (pointer, page) {
        page = page || {};

        // Opera Mobile handles the viewport and scrolling oddly
        if (isOperaMobile && isNativePointer(pointer)) {
            getXY('screen', pointer, page);

            page.x += window.scrollX;
            page.y += window.scrollY;
        }
        else {
            getXY('page', pointer, page);
        }

        return page;
    }

    function getClientXY (pointer, client) {
        client = client || {};

        if (isOperaMobile && isNativePointer(pointer)) {
            // Opera Mobile handles the viewport and scrolling oddly
            getXY('screen', pointer, client);
        }
        else {
          getXY('client', pointer, client);
        }

        return client;
    }

    function getScrollXY (win) {
        win = win || window;
        return {
            x: win.scrollX || win.document.documentElement.scrollLeft,
            y: win.scrollY || win.document.documentElement.scrollTop
        };
    }

    function getPointerId (pointer) {
        return isNumber(pointer.pointerId)? pointer.pointerId : pointer.identifier;
    }

    function getActualElement (element) {
        return (element instanceof SVGElementInstance
            ? element.correspondingUseElement
            : element);
    }

    function getWindow (node) {
        if (isWindow(node)) {
            return node;
        }

        var rootNode = (node.ownerDocument || node);

        return rootNode.defaultView || rootNode.parentWindow || window;
    }

    function getElementClientRect (element) {
        var clientRect = (element instanceof SVGElement
                            ? element.getBoundingClientRect()
                            : element.getClientRects()[0]);

        return clientRect && {
            left  : clientRect.left,
            right : clientRect.right,
            top   : clientRect.top,
            bottom: clientRect.bottom,
            width : clientRect.width || clientRect.right - clientRect.left,
            height: clientRect.height || clientRect.bottom - clientRect.top
        };
    }

    function getElementRect (element) {
        var clientRect = getElementClientRect(element);

        if (!isIOS7 && clientRect) {
            var scroll = getScrollXY(getWindow(element));

            clientRect.left   += scroll.x;
            clientRect.right  += scroll.x;
            clientRect.top    += scroll.y;
            clientRect.bottom += scroll.y;
        }

        return clientRect;
    }

    function getTouchPair (event) {
        var touches = [];

        // array of touches is supplied
        if (isArray(event)) {
            touches[0] = event[0];
            touches[1] = event[1];
        }
        // an event
        else {
            if (event.type === 'touchend') {
                if (event.touches.length === 1) {
                    touches[0] = event.touches[0];
                    touches[1] = event.changedTouches[0];
                }
                else if (event.touches.length === 0) {
                    touches[0] = event.changedTouches[0];
                    touches[1] = event.changedTouches[1];
                }
            }
            else {
                touches[0] = event.touches[0];
                touches[1] = event.touches[1];
            }
        }

        return touches;
    }

    function pointerAverage (pointers) {
        var average = {
            pageX  : 0,
            pageY  : 0,
            clientX: 0,
            clientY: 0,
            screenX: 0,
            screenY: 0
        };
        var prop;

        for (var i = 0; i < pointers.length; i++) {
            for (prop in average) {
                average[prop] += pointers[i][prop];
            }
        }
        for (prop in average) {
            average[prop] /= pointers.length;
        }

        return average;
    }

    function touchBBox (event) {
        if (!event.length && !(event.touches && event.touches.length > 1)) {
            return;
        }

        var touches = getTouchPair(event),
            minX = Math.min(touches[0].pageX, touches[1].pageX),
            minY = Math.min(touches[0].pageY, touches[1].pageY),
            maxX = Math.max(touches[0].pageX, touches[1].pageX),
            maxY = Math.max(touches[0].pageY, touches[1].pageY);

        return {
            x: minX,
            y: minY,
            left: minX,
            top: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    function touchDistance (event, deltaSource) {
        deltaSource = deltaSource || defaultOptions.deltaSource;

        var sourceX = deltaSource + 'X',
            sourceY = deltaSource + 'Y',
            touches = getTouchPair(event);


        var dx = touches[0][sourceX] - touches[1][sourceX],
            dy = touches[0][sourceY] - touches[1][sourceY];

        return hypot(dx, dy);
    }

    function touchAngle (event, prevAngle, deltaSource) {
        deltaSource = deltaSource || defaultOptions.deltaSource;

        var sourceX = deltaSource + 'X',
            sourceY = deltaSource + 'Y',
            touches = getTouchPair(event),
            dx = touches[0][sourceX] - touches[1][sourceX],
            dy = touches[0][sourceY] - touches[1][sourceY],
            angle = 180 * Math.atan(dy / dx) / Math.PI;

        if (isNumber(prevAngle)) {
            var dr = angle - prevAngle,
                drClamped = dr % 360;

            if (drClamped > 315) {
                angle -= 360 + (angle / 360)|0 * 360;
            }
            else if (drClamped > 135) {
                angle -= 180 + (angle / 360)|0 * 360;
            }
            else if (drClamped < -315) {
                angle += 360 + (angle / 360)|0 * 360;
            }
            else if (drClamped < -135) {
                angle += 180 + (angle / 360)|0 * 360;
            }
        }

        return  angle;
    }

    function getOriginXY (interactable, element) {
        var origin = interactable
                ? interactable.options.origin
                : defaultOptions.origin;

        if (origin === 'parent') {
            origin = parentElement(element);
        }
        else if (origin === 'self') {
            origin = interactable.getRect(element);
        }
        else if (trySelector(origin)) {
            origin = closest(element, origin) || { x: 0, y: 0 };
        }

        if (isFunction(origin)) {
            origin = origin(interactable && element);
        }

        if (isElement(origin))  {
            origin = getElementRect(origin);
        }

        origin.x = ('x' in origin)? origin.x : origin.left;
        origin.y = ('y' in origin)? origin.y : origin.top;

        return origin;
    }

    // http://stackoverflow.com/a/5634528/2280888
    function _getQBezierValue(t, p1, p2, p3) {
        var iT = 1 - t;
        return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
    }

    function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
        return {
            x:  _getQBezierValue(position, startX, cpX, endX),
            y:  _getQBezierValue(position, startY, cpY, endY)
        };
    }

    // http://gizma.com/easing/
    function easeOutQuad (t, b, c, d) {
        t /= d;
        return -c * t*(t-2) + b;
    }

    function nodeContains (parent, child) {
        while (child) {
            if (child === parent) {
                return true;
            }

            child = child.parentNode;
        }

        return false;
    }

    function closest (child, selector) {
        var parent = parentElement(child);

        while (isElement(parent)) {
            if (matchesSelector(parent, selector)) { return parent; }

            parent = parentElement(parent);
        }

        return null;
    }

    function parentElement (node) {
        var parent = node.parentNode;

        if (isDocFrag(parent)) {
            // skip past #shado-root fragments
            while ((parent = parent.host) && isDocFrag(parent)) {}

            return parent;
        }

        return parent;
    }

    function inContext (interactable, element) {
        return interactable._context === element.ownerDocument
                || nodeContains(interactable._context, element);
    }

    function testIgnore (interactable, interactableElement, element) {
        var ignoreFrom = interactable.options.ignoreFrom;

        if (!ignoreFrom || !isElement(element)) { return false; }

        if (isString(ignoreFrom)) {
            return matchesUpTo(element, ignoreFrom, interactableElement);
        }
        else if (isElement(ignoreFrom)) {
            return nodeContains(ignoreFrom, element);
        }

        return false;
    }

    function testAllow (interactable, interactableElement, element) {
        var allowFrom = interactable.options.allowFrom;

        if (!allowFrom) { return true; }

        if (!isElement(element)) { return false; }

        if (isString(allowFrom)) {
            return matchesUpTo(element, allowFrom, interactableElement);
        }
        else if (isElement(allowFrom)) {
            return nodeContains(allowFrom, element);
        }

        return false;
    }

    function checkAxis (axis, interactable) {
        if (!interactable) { return false; }

        var thisAxis = interactable.options.drag.axis;

        return (axis === 'xy' || thisAxis === 'xy' || thisAxis === axis);
    }

    function checkSnap (interactable, action) {
        var options = interactable.options;

        if (/^resize/.test(action)) {
            action = 'resize';
        }

        return options[action].snap && options[action].snap.enabled;
    }

    function checkRestrict (interactable, action) {
        var options = interactable.options;

        if (/^resize/.test(action)) {
            action = 'resize';
        }

        return  options[action].restrict && options[action].restrict.enabled;
    }

    function checkAutoScroll (interactable, action) {
        var options = interactable.options;

        if (/^resize/.test(action)) {
            action = 'resize';
        }

        return  options[action].autoScroll && options[action].autoScroll.enabled;
    }

    function withinInteractionLimit (interactable, element, action) {
        var options = interactable.options,
            maxActions = options[action.name].max,
            maxPerElement = options[action.name].maxPerElement,
            activeInteractions = 0,
            targetCount = 0,
            targetElementCount = 0;

        for (var i = 0, len = interactions.length; i < len; i++) {
            var interaction = interactions[i],
                otherAction = interaction.prepared.name,
                active = interaction.interacting();

            if (!active) { continue; }

            activeInteractions++;

            if (activeInteractions >= maxInteractions) {
                return false;
            }

            if (interaction.target !== interactable) { continue; }

            targetCount += (otherAction === action.name)|0;

            if (targetCount >= maxActions) {
                return false;
            }

            if (interaction.element === element) {
                targetElementCount++;

                if (otherAction !== action.name || targetElementCount >= maxPerElement) {
                    return false;
                }
            }
        }

        return maxInteractions > 0;
    }

    // Test for the element that's "above" all other qualifiers
    function indexOfDeepestElement (elements) {
        var dropzone,
            deepestZone = elements[0],
            index = deepestZone? 0: -1,
            parent,
            deepestZoneParents = [],
            dropzoneParents = [],
            child,
            i,
            n;

        for (i = 1; i < elements.length; i++) {
            dropzone = elements[i];

            // an element might belong to multiple selector dropzones
            if (!dropzone || dropzone === deepestZone) {
                continue;
            }

            if (!deepestZone) {
                deepestZone = dropzone;
                index = i;
                continue;
            }

            // check if the deepest or current are document.documentElement or document.rootElement
            // - if the current dropzone is, do nothing and continue
            if (dropzone.parentNode === dropzone.ownerDocument) {
                continue;
            }
            // - if deepest is, update with the current dropzone and continue to next
            else if (deepestZone.parentNode === dropzone.ownerDocument) {
                deepestZone = dropzone;
                index = i;
                continue;
            }

            if (!deepestZoneParents.length) {
                parent = deepestZone;
                while (parent.parentNode && parent.parentNode !== parent.ownerDocument) {
                    deepestZoneParents.unshift(parent);
                    parent = parent.parentNode;
                }
            }

            // if this element is an svg element and the current deepest is
            // an HTMLElement
            if (deepestZone instanceof HTMLElement
                && dropzone instanceof SVGElement
                && !(dropzone instanceof SVGSVGElement)) {

                if (dropzone === deepestZone.parentNode) {
                    continue;
                }

                parent = dropzone.ownerSVGElement;
            }
            else {
                parent = dropzone;
            }

            dropzoneParents = [];

            while (parent.parentNode !== parent.ownerDocument) {
                dropzoneParents.unshift(parent);
                parent = parent.parentNode;
            }

            n = 0;

            // get (position of last common ancestor) + 1
            while (dropzoneParents[n] && dropzoneParents[n] === deepestZoneParents[n]) {
                n++;
            }

            var parents = [
                dropzoneParents[n - 1],
                dropzoneParents[n],
                deepestZoneParents[n]
            ];

            child = parents[0].lastChild;

            while (child) {
                if (child === parents[1]) {
                    deepestZone = dropzone;
                    index = i;
                    deepestZoneParents = [];

                    break;
                }
                else if (child === parents[2]) {
                    break;
                }

                child = child.previousSibling;
            }
        }

        return index;
    }

    function Interaction () {
        this.target          = null; // current interactable being interacted with
        this.element         = null; // the target element of the interactable
        this.dropTarget      = null; // the dropzone a drag target might be dropped into
        this.dropElement     = null; // the element at the time of checking
        this.prevDropTarget  = null; // the dropzone that was recently dragged away from
        this.prevDropElement = null; // the element at the time of checking

        this.prepared        = {     // action that's ready to be fired on next move event
            name : null,
            axis : null,
            edges: null
        };

        this.matches         = [];   // all selectors that are matched by target element
        this.matchElements   = [];   // corresponding elements

        this.inertiaStatus = {
            active       : false,
            smoothEnd    : false,
            ending       : false,

            startEvent: null,
            upCoords: {},

            xe: 0, ye: 0,
            sx: 0, sy: 0,

            t0: 0,
            vx0: 0, vys: 0,
            duration: 0,

            resumeDx: 0,
            resumeDy: 0,

            lambda_v0: 0,
            one_ve_v0: 0,
            i  : null
        };

        if (isFunction(Function.prototype.bind)) {
            this.boundInertiaFrame = this.inertiaFrame.bind(this);
            this.boundSmoothEndFrame = this.smoothEndFrame.bind(this);
        }
        else {
            var that = this;

            this.boundInertiaFrame = function () { return that.inertiaFrame(); };
            this.boundSmoothEndFrame = function () { return that.smoothEndFrame(); };
        }

        this.activeDrops = {
            dropzones: [],      // the dropzones that are mentioned below
            elements : [],      // elements of dropzones that accept the target draggable
            rects    : []       // the rects of the elements mentioned above
        };

        // keep track of added pointers
        this.pointers    = [];
        this.pointerIds  = [];
        this.downTargets = [];
        this.downTimes   = [];
        this.holdTimers  = [];

        // Previous native pointer move event coordinates
        this.prevCoords = {
            page     : { x: 0, y: 0 },
            client   : { x: 0, y: 0 },
            timeStamp: 0
        };
        // current native pointer move event coordinates
        this.curCoords = {
            page     : { x: 0, y: 0 },
            client   : { x: 0, y: 0 },
            timeStamp: 0
        };

        // Starting InteractEvent pointer coordinates
        this.startCoords = {
            page     : { x: 0, y: 0 },
            client   : { x: 0, y: 0 },
            timeStamp: 0
        };

        // Change in coordinates and time of the pointer
        this.pointerDelta = {
            page     : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
            client   : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
            timeStamp: 0
        };

        this.downEvent   = null;    // pointerdown/mousedown/touchstart event
        this.downPointer = {};

        this._eventTarget    = null;
        this._curEventTarget = null;

        this.prevEvent = null;      // previous action event
        this.tapTime   = 0;         // time of the most recent tap event
        this.prevTap   = null;

        this.startOffset    = { left: 0, right: 0, top: 0, bottom: 0 };
        this.restrictOffset = { left: 0, right: 0, top: 0, bottom: 0 };
        this.snapOffsets    = [];

        this.gesture = {
            start: { x: 0, y: 0 },

            startDistance: 0,   // distance between two touches of touchStart
            prevDistance : 0,
            distance     : 0,

            scale: 1,           // gesture.distance / gesture.startDistance

            startAngle: 0,      // angle of line joining two touches
            prevAngle : 0       // angle of the previous gesture event
        };

        this.snapStatus = {
            x       : 0, y       : 0,
            dx      : 0, dy      : 0,
            realX   : 0, realY   : 0,
            snappedX: 0, snappedY: 0,
            targets : [],
            locked  : false,
            changed : false
        };

        this.restrictStatus = {
            dx         : 0, dy         : 0,
            restrictedX: 0, restrictedY: 0,
            snap       : null,
            restricted : false,
            changed    : false
        };

        this.restrictStatus.snap = this.snapStatus;

        this.pointerIsDown   = false;
        this.pointerWasMoved = false;
        this.gesturing       = false;
        this.dragging        = false;
        this.resizing        = false;
        this.resizeAxes      = 'xy';

        this.mouse = false;

        interactions.push(this);
    }

    Interaction.prototype = {
        getPageXY  : function (pointer, xy) { return   getPageXY(pointer, xy, this); },
        getClientXY: function (pointer, xy) { return getClientXY(pointer, xy, this); },
        setEventXY : function (target, ptr) { return  setEventXY(target, ptr, this); },

        pointerOver: function (pointer, event, eventTarget) {
            if (this.prepared.name || !this.mouse) { return; }

            var curMatches = [],
                curMatchElements = [],
                prevTargetElement = this.element;

            this.addPointer(pointer);

            if (this.target
                && (testIgnore(this.target, this.element, eventTarget)
                    || !testAllow(this.target, this.element, eventTarget))) {
                // if the eventTarget should be ignored or shouldn't be allowed
                // clear the previous target
                this.target = null;
                this.element = null;
                this.matches = [];
                this.matchElements = [];
            }

            var elementInteractable = interactables.get(eventTarget),
                elementAction = (elementInteractable
                                 && !testIgnore(elementInteractable, eventTarget, eventTarget)
                                 && testAllow(elementInteractable, eventTarget, eventTarget)
                                 && validateAction(
                                     elementInteractable.getAction(pointer, event, this, eventTarget),
                                     elementInteractable));

            if (elementAction && !withinInteractionLimit(elementInteractable, eventTarget, elementAction)) {
                 elementAction = null;
            }

            function pushCurMatches (interactable, selector) {
                if (interactable
                    && inContext(interactable, eventTarget)
                    && !testIgnore(interactable, eventTarget, eventTarget)
                    && testAllow(interactable, eventTarget, eventTarget)
                    && matchesSelector(eventTarget, selector)) {

                    curMatches.push(interactable);
                    curMatchElements.push(eventTarget);
                }
            }

            if (elementAction) {
                this.target = elementInteractable;
                this.element = eventTarget;
                this.matches = [];
                this.matchElements = [];
            }
            else {
                interactables.forEachSelector(pushCurMatches);

                if (this.validateSelector(pointer, event, curMatches, curMatchElements)) {
                    this.matches = curMatches;
                    this.matchElements = curMatchElements;

                    this.pointerHover(pointer, event, this.matches, this.matchElements);
                    events.add(eventTarget,
                                        PointerEvent? pEventTypes.move : 'mousemove',
                                        listeners.pointerHover);
                }
                else if (this.target) {
                    if (nodeContains(prevTargetElement, eventTarget)) {
                        this.pointerHover(pointer, event, this.matches, this.matchElements);
                        events.add(this.element,
                                            PointerEvent? pEventTypes.move : 'mousemove',
                                            listeners.pointerHover);
                    }
                    else {
                        this.target = null;
                        this.element = null;
                        this.matches = [];
                        this.matchElements = [];
                    }
                }
            }
        },

        // Check what action would be performed on pointerMove target if a mouse
        // button were pressed and change the cursor accordingly
        pointerHover: function (pointer, event, eventTarget, curEventTarget, matches, matchElements) {
            var target = this.target;

            if (!this.prepared.name && this.mouse) {

                var action;

                // update pointer coords for defaultActionChecker to use
                this.setEventXY(this.curCoords, [pointer]);

                if (matches) {
                    action = this.validateSelector(pointer, event, matches, matchElements);
                }
                else if (target) {
                    action = validateAction(target.getAction(this.pointers[0], event, this, this.element), this.target);
                }

                if (target && target.options.styleCursor) {
                    if (action) {
                        target._doc.documentElement.style.cursor = getActionCursor(action);
                    }
                    else {
                        target._doc.documentElement.style.cursor = '';
                    }
                }
            }
            else if (this.prepared.name) {
                this.checkAndPreventDefault(event, target, this.element);
            }
        },

        pointerOut: function (pointer, event, eventTarget) {
            if (this.prepared.name) { return; }

            // Remove temporary event listeners for selector Interactables
            if (!interactables.get(eventTarget)) {
                events.remove(eventTarget,
                                       PointerEvent? pEventTypes.move : 'mousemove',
                                       listeners.pointerHover);
            }

            if (this.target && this.target.options.styleCursor && !this.interacting()) {
                this.target._doc.documentElement.style.cursor = '';
            }
        },

        selectorDown: function (pointer, event, eventTarget, curEventTarget) {
            var that = this,
                // copy event to be used in timeout for IE8
                eventCopy = events.useAttachEvent? extend({}, event) : event,
                element = eventTarget,
                pointerIndex = this.addPointer(pointer),
                action;

            this.holdTimers[pointerIndex] = setTimeout(function () {
                that.pointerHold(events.useAttachEvent? eventCopy : pointer, eventCopy, eventTarget, curEventTarget);
            }, defaultOptions._holdDuration);

            this.pointerIsDown = true;

            // Check if the down event hits the current inertia target
            if (this.inertiaStatus.active && this.target.selector) {
                // climb up the DOM tree from the event target
                while (isElement(element)) {

                    // if this element is the current inertia target element
                    if (element === this.element
                        // and the prospective action is the same as the ongoing one
                        && validateAction(this.target.getAction(pointer, event, this, this.element), this.target).name === this.prepared.name) {

                        // stop inertia so that the next move will be a normal one
                        cancelFrame(this.inertiaStatus.i);
                        this.inertiaStatus.active = false;

                        this.collectEventTargets(pointer, event, eventTarget, 'down');
                        return;
                    }
                    element = parentElement(element);
                }
            }

            // do nothing if interacting
            if (this.interacting()) {
                this.collectEventTargets(pointer, event, eventTarget, 'down');
                return;
            }

            function pushMatches (interactable, selector, context) {
                var elements = ie8MatchesSelector
                    ? context.querySelectorAll(selector)
                    : undefined;

                if (inContext(interactable, element)
                    && !testIgnore(interactable, element, eventTarget)
                    && testAllow(interactable, element, eventTarget)
                    && matchesSelector(element, selector, elements)) {

                    that.matches.push(interactable);
                    that.matchElements.push(element);
                }
            }

            // update pointer coords for defaultActionChecker to use
            this.setEventXY(this.curCoords, [pointer]);
            this.downEvent = event;

            while (isElement(element) && !action) {
                this.matches = [];
                this.matchElements = [];

                interactables.forEachSelector(pushMatches);

                action = this.validateSelector(pointer, event, this.matches, this.matchElements);
                element = parentElement(element);
            }

            if (action) {
                this.prepared.name  = action.name;
                this.prepared.axis  = action.axis;
                this.prepared.edges = action.edges;

                this.collectEventTargets(pointer, event, eventTarget, 'down');

                return this.pointerDown(pointer, event, eventTarget, curEventTarget, action);
            }
            else {
                // do these now since pointerDown isn't being called from here
                this.downTimes[pointerIndex] = new Date().getTime();
                this.downTargets[pointerIndex] = eventTarget;
                pointerExtend(this.downPointer, pointer);

                copyCoords(this.prevCoords, this.curCoords);
                this.pointerWasMoved = false;
            }

            this.collectEventTargets(pointer, event, eventTarget, 'down');
        },

        // Determine action to be performed on next pointerMove and add appropriate
        // style and event Listeners
        pointerDown: function (pointer, event, eventTarget, curEventTarget, forceAction) {
            if (!forceAction && !this.inertiaStatus.active && this.pointerWasMoved && this.prepared.name) {
                this.checkAndPreventDefault(event, this.target, this.element);

                return;
            }

            this.pointerIsDown = true;
            this.downEvent = event;

            var pointerIndex = this.addPointer(pointer),
                action;

            // If it is the second touch of a multi-touch gesture, keep the
            // target the same and get a new action if a target was set by the
            // first touch
            if (this.pointerIds.length > 1 && this.target._element === this.element) {
                var newAction = validateAction(forceAction || this.target.getAction(pointer, event, this, this.element), this.target);

                if (withinInteractionLimit(this.target, this.element, newAction)) {
                    action = newAction;
                }

                this.prepared.name = null;
            }
            // Otherwise, set the target if there is no action prepared
            else if (!this.prepared.name) {
                var interactable = interactables.get(curEventTarget);

                if (interactable
                    && !testIgnore(interactable, curEventTarget, eventTarget)
                    && testAllow(interactable, curEventTarget, eventTarget)
                    && (action = validateAction(forceAction || interactable.getAction(pointer, event, this, curEventTarget), interactable, eventTarget))
                    && withinInteractionLimit(interactable, curEventTarget, action)) {
                    this.target = interactable;
                    this.element = curEventTarget;
                }
            }

            var target = this.target,
                options = target && target.options;

            if (target && (forceAction || !this.prepared.name)) {
                action = action || validateAction(forceAction || target.getAction(pointer, event, this, curEventTarget), target, this.element);

                this.setEventXY(this.startCoords, this.pointers);

                if (!action) { return; }

                if (options.styleCursor) {
                    target._doc.documentElement.style.cursor = getActionCursor(action);
                }

                this.resizeAxes = action.name === 'resize'? action.axis : null;

                if (action === 'gesture' && this.pointerIds.length < 2) {
                    action = null;
                }

                this.prepared.name  = action.name;
                this.prepared.axis  = action.axis;
                this.prepared.edges = action.edges;

                this.snapStatus.snappedX = this.snapStatus.snappedY =
                    this.restrictStatus.restrictedX = this.restrictStatus.restrictedY = NaN;

                this.downTimes[pointerIndex] = new Date().getTime();
                this.downTargets[pointerIndex] = eventTarget;
                pointerExtend(this.downPointer, pointer);

                copyCoords(this.prevCoords, this.startCoords);
                this.pointerWasMoved = false;

                this.checkAndPreventDefault(event, target, this.element);
            }
            // if inertia is active try to resume action
            else if (this.inertiaStatus.active
                && curEventTarget === this.element
                && validateAction(target.getAction(pointer, event, this, this.element), target).name === this.prepared.name) {

                cancelFrame(this.inertiaStatus.i);
                this.inertiaStatus.active = false;

                this.checkAndPreventDefault(event, target, this.element);
            }
        },

        setModifications: function (coords, preEnd) {
            var target         = this.target,
                shouldMove     = true,
                shouldSnap     = checkSnap(target, this.prepared.name)     && (!target.options[this.prepared.name].snap.endOnly     || preEnd),
                shouldRestrict = checkRestrict(target, this.prepared.name) && (!target.options[this.prepared.name].restrict.endOnly || preEnd);

            if (shouldSnap    ) { this.setSnapping   (coords); } else { this.snapStatus    .locked     = false; }
            if (shouldRestrict) { this.setRestriction(coords); } else { this.restrictStatus.restricted = false; }

            if (shouldSnap && this.snapStatus.locked && !this.snapStatus.changed) {
                shouldMove = shouldRestrict && this.restrictStatus.restricted && this.restrictStatus.changed;
            }
            else if (shouldRestrict && this.restrictStatus.restricted && !this.restrictStatus.changed) {
                shouldMove = false;
            }

            return shouldMove;
        },

        setStartOffsets: function (action, interactable, element) {
            var rect = interactable.getRect(element),
                origin = getOriginXY(interactable, element),
                snap = interactable.options[this.prepared.name].snap,
                restrict = interactable.options[this.prepared.name].restrict,
                width, height;

            if (rect) {
                this.startOffset.left = this.startCoords.page.x - rect.left;
                this.startOffset.top  = this.startCoords.page.y - rect.top;

                this.startOffset.right  = rect.right  - this.startCoords.page.x;
                this.startOffset.bottom = rect.bottom - this.startCoords.page.y;

                if ('width' in rect) { width = rect.width; }
                else { width = rect.right - rect.left; }
                if ('height' in rect) { height = rect.height; }
                else { height = rect.bottom - rect.top; }
            }
            else {
                this.startOffset.left = this.startOffset.top = this.startOffset.right = this.startOffset.bottom = 0;
            }

            this.snapOffsets.splice(0);

            var snapOffset = snap && snap.offset === 'startCoords'
                                ? {
                                    x: this.startCoords.page.x - origin.x,
                                    y: this.startCoords.page.y - origin.y
                                }
                                : snap && snap.offset || { x: 0, y: 0 };

            if (rect && snap && snap.relativePoints && snap.relativePoints.length) {
                for (var i = 0; i < snap.relativePoints.length; i++) {
                    this.snapOffsets.push({
                        x: this.startOffset.left - (width  * snap.relativePoints[i].x) + snapOffset.x,
                        y: this.startOffset.top  - (height * snap.relativePoints[i].y) + snapOffset.y
                    });
                }
            }
            else {
                this.snapOffsets.push(snapOffset);
            }

            if (rect && restrict.elementRect) {
                this.restrictOffset.left = this.startOffset.left - (width  * restrict.elementRect.left);
                this.restrictOffset.top  = this.startOffset.top  - (height * restrict.elementRect.top);

                this.restrictOffset.right  = this.startOffset.right  - (width  * (1 - restrict.elementRect.right));
                this.restrictOffset.bottom = this.startOffset.bottom - (height * (1 - restrict.elementRect.bottom));
            }
            else {
                this.restrictOffset.left = this.restrictOffset.top = this.restrictOffset.right = this.restrictOffset.bottom = 0;
            }
        },

        /*\
         * Interaction.start
         [ method ]
         *
         * Start an action with the given Interactable and Element as tartgets. The
         * action must be enabled for the target Interactable and an appropriate number
         * of pointers must be held down – 1 for drag/resize, 2 for gesture.
         *
         * Use it with `interactable.<action>able({ manualStart: false })` to always
         * [start actions manually](https://github.com/taye/interact.js/issues/114)
         *
         - action       (object)  The action to be performed - drag, resize, etc.
         - interactable (Interactable) The Interactable to target
         - element      (Element) The DOM Element to target
         = (object) interact
         **
         | interact(target)
         |   .draggable({
         |     // disable the default drag start by down->move
         |     manualStart: true
         |   })
         |   // start dragging after the user holds the pointer down
         |   .on('hold', function (event) {
         |     var interaction = event.interaction;
         |
         |     if (!interaction.interacting()) {
         |       interaction.start({ name: 'drag' },
         |                         event.interactable,
         |                         event.currentTarget);
         |     }
         | });
        \*/
        start: function (action, interactable, element) {
            if (this.interacting()
                || !this.pointerIsDown
                || this.pointerIds.length < (action.name === 'gesture'? 2 : 1)) {
                return;
            }

            // if this interaction had been removed after stopping
            // add it back
            if (indexOf(interactions, this) === -1) {
                interactions.push(this);
            }

            // set the startCoords if there was no prepared action
            if (!this.prepared.name) {
                this.setEventXY(this.startCoords);
            }

            this.prepared.name  = action.name;
            this.prepared.axis  = action.axis;
            this.prepared.edges = action.edges;
            this.target         = interactable;
            this.element        = element;

            this.setStartOffsets(action.name, interactable, element);
            this.setModifications(this.startCoords.page);

            this.prevEvent = this[this.prepared.name + 'Start'](this.downEvent);
        },

        pointerMove: function (pointer, event, eventTarget, curEventTarget, preEnd) {
            if (this.inertiaStatus.active) {
                var pageUp   = this.inertiaStatus.upCoords.page;
                var clientUp = this.inertiaStatus.upCoords.client;

                var inertiaPosition = {
                    pageX  : pageUp.x   + this.inertiaStatus.sx,
                    pageY  : pageUp.y   + this.inertiaStatus.sy,
                    clientX: clientUp.x + this.inertiaStatus.sx,
                    clientY: clientUp.y + this.inertiaStatus.sy
                };

                this.setEventXY(this.curCoords, [inertiaPosition]);
            }
            else {
                this.recordPointer(pointer);
                this.setEventXY(this.curCoords, this.pointers);
            }

            var duplicateMove = (this.curCoords.page.x === this.prevCoords.page.x
                                 && this.curCoords.page.y === this.prevCoords.page.y
                                 && this.curCoords.client.x === this.prevCoords.client.x
                                 && this.curCoords.client.y === this.prevCoords.client.y);

            var dx, dy,
                pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            // register movement greater than pointerMoveTolerance
            if (this.pointerIsDown && !this.pointerWasMoved) {
                dx = this.curCoords.client.x - this.startCoords.client.x;
                dy = this.curCoords.client.y - this.startCoords.client.y;

                this.pointerWasMoved = hypot(dx, dy) > pointerMoveTolerance;
            }

            if (!duplicateMove && (!this.pointerIsDown || this.pointerWasMoved)) {
                if (this.pointerIsDown) {
                    clearTimeout(this.holdTimers[pointerIndex]);
                }

                this.collectEventTargets(pointer, event, eventTarget, 'move');
            }

            if (!this.pointerIsDown) { return; }

            if (duplicateMove && this.pointerWasMoved && !preEnd) {
                this.checkAndPreventDefault(event, this.target, this.element);
                return;
            }

            // set pointer coordinate, time changes and speeds
            setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

            if (!this.prepared.name) { return; }

            if (this.pointerWasMoved
                // ignore movement while inertia is active
                && (!this.inertiaStatus.active || (pointer instanceof InteractEvent && /inertiastart/.test(pointer.type)))) {

                // if just starting an action, calculate the pointer speed now
                if (!this.interacting()) {
                    setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

                    // check if a drag is in the correct axis
                    if (this.prepared.name === 'drag') {
                        var absX = Math.abs(dx),
                            absY = Math.abs(dy),
                            targetAxis = this.target.options.drag.axis,
                            axis = (absX > absY ? 'x' : absX < absY ? 'y' : 'xy');

                        // if the movement isn't in the axis of the interactable
                        if (axis !== 'xy' && targetAxis !== 'xy' && targetAxis !== axis) {
                            // cancel the prepared action
                            this.prepared.name = null;

                            // then try to get a drag from another ineractable

                            var element = eventTarget;

                            // check element interactables
                            while (isElement(element)) {
                                var elementInteractable = interactables.get(element);

                                if (elementInteractable
                                    && elementInteractable !== this.target
                                    && !elementInteractable.options.drag.manualStart
                                    && elementInteractable.getAction(this.downPointer, this.downEvent, this, element).name === 'drag'
                                    && checkAxis(axis, elementInteractable)) {

                                    this.prepared.name = 'drag';
                                    this.target = elementInteractable;
                                    this.element = element;
                                    break;
                                }

                                element = parentElement(element);
                            }

                            // if there's no drag from element interactables,
                            // check the selector interactables
                            if (!this.prepared.name) {
                                var thisInteraction = this;

                                var getDraggable = function (interactable, selector, context) {
                                    var elements = ie8MatchesSelector
                                        ? context.querySelectorAll(selector)
                                        : undefined;

                                    if (interactable === thisInteraction.target) { return; }

                                    if (inContext(interactable, eventTarget)
                                        && !interactable.options.drag.manualStart
                                        && !testIgnore(interactable, element, eventTarget)
                                        && testAllow(interactable, element, eventTarget)
                                        && matchesSelector(element, selector, elements)
                                        && interactable.getAction(thisInteraction.downPointer, thisInteraction.downEvent, thisInteraction, element).name === 'drag'
                                        && checkAxis(axis, interactable)
                                        && withinInteractionLimit(interactable, element, 'drag')) {

                                        return interactable;
                                    }
                                };

                                element = eventTarget;

                                while (isElement(element)) {
                                    var selectorInteractable = interactables.forEachSelector(getDraggable);

                                    if (selectorInteractable) {
                                        this.prepared.name = 'drag';
                                        this.target = selectorInteractable;
                                        this.element = element;
                                        break;
                                    }

                                    element = parentElement(element);
                                }
                            }
                        }
                    }
                }

                var starting = !!this.prepared.name && !this.interacting();

                if (starting
                    && (this.target.options[this.prepared.name].manualStart
                        || !withinInteractionLimit(this.target, this.element, this.prepared))) {
                    this.stop(event);
                    return;
                }

                if (this.prepared.name && this.target) {
                    if (starting) {
                        this.start(this.prepared, this.target, this.element);
                    }

                    var shouldMove = this.setModifications(this.curCoords.page, preEnd);

                    // move if snapping or restriction doesn't prevent it
                    if (shouldMove || starting) {
                        this.prevEvent = this[this.prepared.name + 'Move'](event);
                    }

                    this.checkAndPreventDefault(event, this.target, this.element);
                }
            }

            copyCoords(this.prevCoords, this.curCoords);

            if (this.dragging || this.resizing) {
                this.autoScrollMove(pointer);
            }
        },

        dragStart: function (event) {
            var dragEvent = new InteractEvent(this, event, 'drag', 'start', this.element);

            this.dragging = true;
            this.target.fire(dragEvent);

            // reset active dropzones
            this.activeDrops.dropzones = [];
            this.activeDrops.elements  = [];
            this.activeDrops.rects     = [];

            if (!this.dynamicDrop) {
                this.setActiveDrops(this.element);
            }

            var dropEvents = this.getDropEvents(event, dragEvent);

            if (dropEvents.activate) {
                this.fireActiveDrops(dropEvents.activate);
            }

            return dragEvent;
        },

        dragMove: function (event) {
            var target = this.target,
                dragEvent  = new InteractEvent(this, event, 'drag', 'move', this.element),
                draggableElement = this.element,
                drop = this.getDrop(dragEvent, event, draggableElement);

            this.dropTarget = drop.dropzone;
            this.dropElement = drop.element;

            var dropEvents = this.getDropEvents(event, dragEvent);

            target.fire(dragEvent);

            if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
            if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
            if (dropEvents.move ) {     this.dropTarget.fire(dropEvents.move ); }

            this.prevDropTarget  = this.dropTarget;
            this.prevDropElement = this.dropElement;

            return dragEvent;
        },

        resizeStart: function (event) {
            var resizeEvent = new InteractEvent(this, event, 'resize', 'start', this.element);

            if (this.prepared.edges) {
                var startRect = this.target.getRect(this.element);

                /*
                 * When using the `resizable.square` or `resizable.preserveAspectRatio` options, resizing from one edge
                 * will affect another. E.g. with `resizable.square`, resizing to make the right edge larger will make
                 * the bottom edge larger by the same amount. We call these 'linked' edges. Any linked edges will depend
                 * on the active edges and the edge being interacted with.
                 */
                if (this.target.options.resize.square || this.target.options.resize.preserveAspectRatio) {
                    var linkedEdges = extend({}, this.prepared.edges);

                    linkedEdges.top    = linkedEdges.top    || (linkedEdges.left   && !linkedEdges.bottom);
                    linkedEdges.left   = linkedEdges.left   || (linkedEdges.top    && !linkedEdges.right );
                    linkedEdges.bottom = linkedEdges.bottom || (linkedEdges.right  && !linkedEdges.top   );
                    linkedEdges.right  = linkedEdges.right  || (linkedEdges.bottom && !linkedEdges.left  );

                    this.prepared._linkedEdges = linkedEdges;
                }
                else {
                    this.prepared._linkedEdges = null;
                }

                // if using `resizable.preserveAspectRatio` option, record aspect ratio at the start of the resize
                if (this.target.options.resize.preserveAspectRatio) {
                    this.resizeStartAspectRatio = startRect.width / startRect.height;
                }

                this.resizeRects = {
                    start     : startRect,
                    current   : extend({}, startRect),
                    restricted: extend({}, startRect),
                    previous  : extend({}, startRect),
                    delta     : {
                        left: 0, right : 0, width : 0,
                        top : 0, bottom: 0, height: 0
                    }
                };

                resizeEvent.rect = this.resizeRects.restricted;
                resizeEvent.deltaRect = this.resizeRects.delta;
            }

            this.target.fire(resizeEvent);

            this.resizing = true;

            return resizeEvent;
        },

        resizeMove: function (event) {
            var resizeEvent = new InteractEvent(this, event, 'resize', 'move', this.element);

            var edges = this.prepared.edges,
                invert = this.target.options.resize.invert,
                invertible = invert === 'reposition' || invert === 'negate';

            if (edges) {
                var dx = resizeEvent.dx,
                    dy = resizeEvent.dy,

                    start      = this.resizeRects.start,
                    current    = this.resizeRects.current,
                    restricted = this.resizeRects.restricted,
                    delta      = this.resizeRects.delta,
                    previous   = extend(this.resizeRects.previous, restricted),

                    originalEdges = edges;

                // `resize.preserveAspectRatio` takes precedence over `resize.square`
                if (this.target.options.resize.preserveAspectRatio) {
                    var resizeStartAspectRatio = this.resizeStartAspectRatio;

                    edges = this.prepared._linkedEdges;

                    if ((originalEdges.left && originalEdges.bottom)
                        || (originalEdges.right && originalEdges.top)) {
                        dy = -dx / resizeStartAspectRatio;
                    }
                    else if (originalEdges.left || originalEdges.right) { dy = dx / resizeStartAspectRatio; }
                    else if (originalEdges.top || originalEdges.bottom) { dx = dy * resizeStartAspectRatio; }
                }
                else if (this.target.options.resize.square) {
                    edges = this.prepared._linkedEdges;

                    if ((originalEdges.left && originalEdges.bottom)
                        || (originalEdges.right && originalEdges.top)) {
                        dy = -dx;
                    }
                    else if (originalEdges.left || originalEdges.right) { dy = dx; }
                    else if (originalEdges.top || originalEdges.bottom) { dx = dy; }
                }

                // update the 'current' rect without modifications
                if (edges.top   ) { current.top    += dy; }
                if (edges.bottom) { current.bottom += dy; }
                if (edges.left  ) { current.left   += dx; }
                if (edges.right ) { current.right  += dx; }

                if (invertible) {
                    // if invertible, copy the current rect
                    extend(restricted, current);

                    if (invert === 'reposition') {
                        // swap edge values if necessary to keep width/height positive
                        var swap;

                        if (restricted.top > restricted.bottom) {
                            swap = restricted.top;

                            restricted.top = restricted.bottom;
                            restricted.bottom = swap;
                        }
                        if (restricted.left > restricted.right) {
                            swap = restricted.left;

                            restricted.left = restricted.right;
                            restricted.right = swap;
                        }
                    }
                }
                else {
                    // if not invertible, restrict to minimum of 0x0 rect
                    restricted.top    = Math.min(current.top, start.bottom);
                    restricted.bottom = Math.max(current.bottom, start.top);
                    restricted.left   = Math.min(current.left, start.right);
                    restricted.right  = Math.max(current.right, start.left);
                }

                restricted.width  = restricted.right  - restricted.left;
                restricted.height = restricted.bottom - restricted.top ;

                for (var edge in restricted) {
                    delta[edge] = restricted[edge] - previous[edge];
                }

                resizeEvent.edges = this.prepared.edges;
                resizeEvent.rect = restricted;
                resizeEvent.deltaRect = delta;
            }

            this.target.fire(resizeEvent);

            return resizeEvent;
        },

        gestureStart: function (event) {
            var gestureEvent = new InteractEvent(this, event, 'gesture', 'start', this.element);

            gestureEvent.ds = 0;

            this.gesture.startDistance = this.gesture.prevDistance = gestureEvent.distance;
            this.gesture.startAngle = this.gesture.prevAngle = gestureEvent.angle;
            this.gesture.scale = 1;

            this.gesturing = true;

            this.target.fire(gestureEvent);

            return gestureEvent;
        },

        gestureMove: function (event) {
            if (!this.pointerIds.length) {
                return this.prevEvent;
            }

            var gestureEvent;

            gestureEvent = new InteractEvent(this, event, 'gesture', 'move', this.element);
            gestureEvent.ds = gestureEvent.scale - this.gesture.scale;

            this.target.fire(gestureEvent);

            this.gesture.prevAngle = gestureEvent.angle;
            this.gesture.prevDistance = gestureEvent.distance;

            if (gestureEvent.scale !== Infinity &&
                gestureEvent.scale !== null &&
                gestureEvent.scale !== undefined  &&
                !isNaN(gestureEvent.scale)) {

                this.gesture.scale = gestureEvent.scale;
            }

            return gestureEvent;
        },

        pointerHold: function (pointer, event, eventTarget) {
            this.collectEventTargets(pointer, event, eventTarget, 'hold');
        },

        pointerUp: function (pointer, event, eventTarget, curEventTarget) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            clearTimeout(this.holdTimers[pointerIndex]);

            this.collectEventTargets(pointer, event, eventTarget, 'up' );
            this.collectEventTargets(pointer, event, eventTarget, 'tap');

            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

            this.removePointer(pointer);
        },

        pointerCancel: function (pointer, event, eventTarget, curEventTarget) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            clearTimeout(this.holdTimers[pointerIndex]);

            this.collectEventTargets(pointer, event, eventTarget, 'cancel');
            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

            this.removePointer(pointer);
        },

        // http://www.quirksmode.org/dom/events/click.html
        // >Events leading to dblclick
        //
        // IE8 doesn't fire down event before dblclick.
        // This workaround tries to fire a tap and doubletap after dblclick
        ie8Dblclick: function (pointer, event, eventTarget) {
            if (this.prevTap
                && event.clientX === this.prevTap.clientX
                && event.clientY === this.prevTap.clientY
                && eventTarget   === this.prevTap.target) {

                this.downTargets[0] = eventTarget;
                this.downTimes[0] = new Date().getTime();
                this.collectEventTargets(pointer, event, eventTarget, 'tap');
            }
        },

        // End interact move events and stop auto-scroll unless inertia is enabled
        pointerEnd: function (pointer, event, eventTarget, curEventTarget) {
            var endEvent,
                target = this.target,
                options = target && target.options,
                inertiaOptions = options && this.prepared.name && options[this.prepared.name].inertia,
                inertiaStatus = this.inertiaStatus;

            if (this.interacting()) {

                if (inertiaStatus.active && !inertiaStatus.ending) { return; }

                var pointerSpeed,
                    now = new Date().getTime(),
                    inertiaPossible = false,
                    inertia = false,
                    smoothEnd = false,
                    endSnap = checkSnap(target, this.prepared.name) && options[this.prepared.name].snap.endOnly,
                    endRestrict = checkRestrict(target, this.prepared.name) && options[this.prepared.name].restrict.endOnly,
                    dx = 0,
                    dy = 0,
                    startEvent;

                if (this.dragging) {
                    if      (options.drag.axis === 'x' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vx); }
                    else if (options.drag.axis === 'y' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vy); }
                    else   /*options.drag.axis === 'xy'*/{ pointerSpeed = this.pointerDelta.client.speed; }
                }
                else {
                    pointerSpeed = this.pointerDelta.client.speed;
                }

                // check if inertia should be started
                inertiaPossible = (inertiaOptions && inertiaOptions.enabled
                                   && this.prepared.name !== 'gesture'
                                   && event !== inertiaStatus.startEvent);

                inertia = (inertiaPossible
                           && (now - this.curCoords.timeStamp) < 50
                           && pointerSpeed > inertiaOptions.minSpeed
                           && pointerSpeed > inertiaOptions.endSpeed);

                if (inertiaPossible && !inertia && (endSnap || endRestrict)) {

                    var snapRestrict = {};

                    snapRestrict.snap = snapRestrict.restrict = snapRestrict;

                    if (endSnap) {
                        this.setSnapping(this.curCoords.page, snapRestrict);
                        if (snapRestrict.locked) {
                            dx += snapRestrict.dx;
                            dy += snapRestrict.dy;
                        }
                    }

                    if (endRestrict) {
                        this.setRestriction(this.curCoords.page, snapRestrict);
                        if (snapRestrict.restricted) {
                            dx += snapRestrict.dx;
                            dy += snapRestrict.dy;
                        }
                    }

                    if (dx || dy) {
                        smoothEnd = true;
                    }
                }

                if (inertia || smoothEnd) {
                    copyCoords(inertiaStatus.upCoords, this.curCoords);

                    this.pointers[0] = inertiaStatus.startEvent = startEvent =
                        new InteractEvent(this, event, this.prepared.name, 'inertiastart', this.element);

                    inertiaStatus.t0 = now;

                    target.fire(inertiaStatus.startEvent);

                    if (inertia) {
                        inertiaStatus.vx0 = this.pointerDelta.client.vx;
                        inertiaStatus.vy0 = this.pointerDelta.client.vy;
                        inertiaStatus.v0 = pointerSpeed;

                        this.calcInertia(inertiaStatus);

                        var page = extend({}, this.curCoords.page),
                            origin = getOriginXY(target, this.element),
                            statusObject;

                        page.x = page.x + inertiaStatus.xe - origin.x;
                        page.y = page.y + inertiaStatus.ye - origin.y;

                        statusObject = {
                            useStatusXY: true,
                            x: page.x,
                            y: page.y,
                            dx: 0,
                            dy: 0,
                            snap: null
                        };

                        statusObject.snap = statusObject;

                        dx = dy = 0;

                        if (endSnap) {
                            var snap = this.setSnapping(this.curCoords.page, statusObject);

                            if (snap.locked) {
                                dx += snap.dx;
                                dy += snap.dy;
                            }
                        }

                        if (endRestrict) {
                            var restrict = this.setRestriction(this.curCoords.page, statusObject);

                            if (restrict.restricted) {
                                dx += restrict.dx;
                                dy += restrict.dy;
                            }
                        }

                        inertiaStatus.modifiedXe += dx;
                        inertiaStatus.modifiedYe += dy;

                        inertiaStatus.i = reqFrame(this.boundInertiaFrame);
                    }
                    else {
                        inertiaStatus.smoothEnd = true;
                        inertiaStatus.xe = dx;
                        inertiaStatus.ye = dy;

                        inertiaStatus.sx = inertiaStatus.sy = 0;

                        inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
                    }

                    inertiaStatus.active = true;
                    return;
                }

                if (endSnap || endRestrict) {
                    // fire a move event at the snapped coordinates
                    this.pointerMove(pointer, event, eventTarget, curEventTarget, true);
                }
            }

            if (this.dragging) {
                endEvent = new InteractEvent(this, event, 'drag', 'end', this.element);

                var draggableElement = this.element,
                    drop = this.getDrop(endEvent, event, draggableElement);

                this.dropTarget = drop.dropzone;
                this.dropElement = drop.element;

                var dropEvents = this.getDropEvents(event, endEvent);

                if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
                if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
                if (dropEvents.drop ) {     this.dropTarget.fire(dropEvents.drop ); }
                if (dropEvents.deactivate) {
                    this.fireActiveDrops(dropEvents.deactivate);
                }

                target.fire(endEvent);
            }
            else if (this.resizing) {
                endEvent = new InteractEvent(this, event, 'resize', 'end', this.element);
                target.fire(endEvent);
            }
            else if (this.gesturing) {
                endEvent = new InteractEvent(this, event, 'gesture', 'end', this.element);
                target.fire(endEvent);
            }

            this.stop(event);
        },

        collectDrops: function (element) {
            var drops = [],
                elements = [],
                i;

            element = element || this.element;

            // collect all dropzones and their elements which qualify for a drop
            for (i = 0; i < interactables.length; i++) {
                if (!interactables[i].options.drop.enabled) { continue; }

                var current = interactables[i],
                    accept = current.options.drop.accept;

                // test the draggable element against the dropzone's accept setting
                if ((isElement(accept) && accept !== element)
                    || (isString(accept)
                        && !matchesSelector(element, accept))) {

                    continue;
                }

                // query for new elements if necessary
                var dropElements = current.selector? current._context.querySelectorAll(current.selector) : [current._element];

                for (var j = 0, len = dropElements.length; j < len; j++) {
                    var currentElement = dropElements[j];

                    if (currentElement === element) {
                        continue;
                    }

                    drops.push(current);
                    elements.push(currentElement);
                }
            }

            return {
                dropzones: drops,
                elements: elements
            };
        },

        fireActiveDrops: function (event) {
            var i,
                current,
                currentElement,
                prevElement;

            // loop through all active dropzones and trigger event
            for (i = 0; i < this.activeDrops.dropzones.length; i++) {
                current = this.activeDrops.dropzones[i];
                currentElement = this.activeDrops.elements [i];

                // prevent trigger of duplicate events on same element
                if (currentElement !== prevElement) {
                    // set current element as event target
                    event.target = currentElement;
                    current.fire(event);
                }
                prevElement = currentElement;
            }
        },

        // Collect a new set of possible drops and save them in activeDrops.
        // setActiveDrops should always be called when a drag has just started or a
        // drag event happens while dynamicDrop is true
        setActiveDrops: function (dragElement) {
            // get dropzones and their elements that could receive the draggable
            var possibleDrops = this.collectDrops(dragElement, true);

            this.activeDrops.dropzones = possibleDrops.dropzones;
            this.activeDrops.elements  = possibleDrops.elements;
            this.activeDrops.rects     = [];

            for (var i = 0; i < this.activeDrops.dropzones.length; i++) {
                this.activeDrops.rects[i] = this.activeDrops.dropzones[i].getRect(this.activeDrops.elements[i]);
            }
        },

        getDrop: function (dragEvent, event, dragElement) {
            var validDrops = [];

            if (dynamicDrop) {
                this.setActiveDrops(dragElement);
            }

            // collect all dropzones and their elements which qualify for a drop
            for (var j = 0; j < this.activeDrops.dropzones.length; j++) {
                var current        = this.activeDrops.dropzones[j],
                    currentElement = this.activeDrops.elements [j],
                    rect           = this.activeDrops.rects    [j];

                validDrops.push(current.dropCheck(dragEvent, event, this.target, dragElement, currentElement, rect)
                                ? currentElement
                                : null);
            }

            // get the most appropriate dropzone based on DOM depth and order
            var dropIndex = indexOfDeepestElement(validDrops),
                dropzone  = this.activeDrops.dropzones[dropIndex] || null,
                element   = this.activeDrops.elements [dropIndex] || null;

            return {
                dropzone: dropzone,
                element: element
            };
        },

        getDropEvents: function (pointerEvent, dragEvent) {
            var dropEvents = {
                enter     : null,
                leave     : null,
                activate  : null,
                deactivate: null,
                move      : null,
                drop      : null
            };

            if (this.dropElement !== this.prevDropElement) {
                // if there was a prevDropTarget, create a dragleave event
                if (this.prevDropTarget) {
                    dropEvents.leave = {
                        target       : this.prevDropElement,
                        dropzone     : this.prevDropTarget,
                        relatedTarget: dragEvent.target,
                        draggable    : dragEvent.interactable,
                        dragEvent    : dragEvent,
                        interaction  : this,
                        timeStamp    : dragEvent.timeStamp,
                        type         : 'dragleave'
                    };

                    dragEvent.dragLeave = this.prevDropElement;
                    dragEvent.prevDropzone = this.prevDropTarget;
                }
                // if the dropTarget is not null, create a dragenter event
                if (this.dropTarget) {
                    dropEvents.enter = {
                        target       : this.dropElement,
                        dropzone     : this.dropTarget,
                        relatedTarget: dragEvent.target,
                        draggable    : dragEvent.interactable,
                        dragEvent    : dragEvent,
                        interaction  : this,
                        timeStamp    : dragEvent.timeStamp,
                        type         : 'dragenter'
                    };

                    dragEvent.dragEnter = this.dropElement;
                    dragEvent.dropzone = this.dropTarget;
                }
            }

            if (dragEvent.type === 'dragend' && this.dropTarget) {
                dropEvents.drop = {
                    target       : this.dropElement,
                    dropzone     : this.dropTarget,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'drop'
                };

                dragEvent.dropzone = this.dropTarget;
            }
            if (dragEvent.type === 'dragstart') {
                dropEvents.activate = {
                    target       : null,
                    dropzone     : null,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'dropactivate'
                };
            }
            if (dragEvent.type === 'dragend') {
                dropEvents.deactivate = {
                    target       : null,
                    dropzone     : null,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'dropdeactivate'
                };
            }
            if (dragEvent.type === 'dragmove' && this.dropTarget) {
                dropEvents.move = {
                    target       : this.dropElement,
                    dropzone     : this.dropTarget,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    dragmove     : dragEvent,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'dropmove'
                };
                dragEvent.dropzone = this.dropTarget;
            }

            return dropEvents;
        },

        currentAction: function () {
            return (this.dragging && 'drag') || (this.resizing && 'resize') || (this.gesturing && 'gesture') || null;
        },

        interacting: function () {
            return this.dragging || this.resizing || this.gesturing;
        },

        clearTargets: function () {
            this.target = this.element = null;

            this.dropTarget = this.dropElement = this.prevDropTarget = this.prevDropElement = null;
        },

        stop: function (event) {
            if (this.interacting()) {
                autoScroll.stop();
                this.matches = [];
                this.matchElements = [];

                var target = this.target;

                if (target.options.styleCursor) {
                    target._doc.documentElement.style.cursor = '';
                }

                // prevent Default only if were previously interacting
                if (event && isFunction(event.preventDefault)) {
                    this.checkAndPreventDefault(event, target, this.element);
                }

                if (this.dragging) {
                    this.activeDrops.dropzones = this.activeDrops.elements = this.activeDrops.rects = null;
                }
            }

            this.clearTargets();

            this.pointerIsDown = this.snapStatus.locked = this.dragging = this.resizing = this.gesturing = false;
            this.prepared.name = this.prevEvent = null;
            this.inertiaStatus.resumeDx = this.inertiaStatus.resumeDy = 0;

            // remove pointers if their ID isn't in this.pointerIds
            for (var i = 0; i < this.pointers.length; i++) {
                if (indexOf(this.pointerIds, getPointerId(this.pointers[i])) === -1) {
                    this.pointers.splice(i, 1);
                }
            }
        },

        inertiaFrame: function () {
            var inertiaStatus = this.inertiaStatus,
                options = this.target.options[this.prepared.name].inertia,
                lambda = options.resistance,
                t = new Date().getTime() / 1000 - inertiaStatus.t0;

            if (t < inertiaStatus.te) {

                var progress =  1 - (Math.exp(-lambda * t) - inertiaStatus.lambda_v0) / inertiaStatus.one_ve_v0;

                if (inertiaStatus.modifiedXe === inertiaStatus.xe && inertiaStatus.modifiedYe === inertiaStatus.ye) {
                    inertiaStatus.sx = inertiaStatus.xe * progress;
                    inertiaStatus.sy = inertiaStatus.ye * progress;
                }
                else {
                    var quadPoint = getQuadraticCurvePoint(
                            0, 0,
                            inertiaStatus.xe, inertiaStatus.ye,
                            inertiaStatus.modifiedXe, inertiaStatus.modifiedYe,
                            progress);

                    inertiaStatus.sx = quadPoint.x;
                    inertiaStatus.sy = quadPoint.y;
                }

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.i = reqFrame(this.boundInertiaFrame);
            }
            else {
                inertiaStatus.ending = true;

                inertiaStatus.sx = inertiaStatus.modifiedXe;
                inertiaStatus.sy = inertiaStatus.modifiedYe;

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.active = inertiaStatus.ending = false;
            }
        },

        smoothEndFrame: function () {
            var inertiaStatus = this.inertiaStatus,
                t = new Date().getTime() - inertiaStatus.t0,
                duration = this.target.options[this.prepared.name].inertia.smoothEndDuration;

            if (t < duration) {
                inertiaStatus.sx = easeOutQuad(t, 0, inertiaStatus.xe, duration);
                inertiaStatus.sy = easeOutQuad(t, 0, inertiaStatus.ye, duration);

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
            }
            else {
                inertiaStatus.ending = true;

                inertiaStatus.sx = inertiaStatus.xe;
                inertiaStatus.sy = inertiaStatus.ye;

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.smoothEnd =
                  inertiaStatus.active = inertiaStatus.ending = false;
            }
        },

        addPointer: function (pointer) {
            var id = getPointerId(pointer),
                index = this.mouse? 0 : indexOf(this.pointerIds, id);

            if (index === -1) {
                index = this.pointerIds.length;
            }

            this.pointerIds[index] = id;
            this.pointers[index] = pointer;

            return index;
        },

        removePointer: function (pointer) {
            var id = getPointerId(pointer),
                index = this.mouse? 0 : indexOf(this.pointerIds, id);

            if (index === -1) { return; }

            this.pointers   .splice(index, 1);
            this.pointerIds .splice(index, 1);
            this.downTargets.splice(index, 1);
            this.downTimes  .splice(index, 1);
            this.holdTimers .splice(index, 1);
        },

        recordPointer: function (pointer) {
            var index = this.mouse? 0: indexOf(this.pointerIds, getPointerId(pointer));

            if (index === -1) { return; }

            this.pointers[index] = pointer;
        },

        collectEventTargets: function (pointer, event, eventTarget, eventType) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            // do not fire a tap event if the pointer was moved before being lifted
            if (eventType === 'tap' && (this.pointerWasMoved
                // or if the pointerup target is different to the pointerdown target
                || !(this.downTargets[pointerIndex] && this.downTargets[pointerIndex] === eventTarget))) {
                return;
            }

            var targets = [],
                elements = [],
                element = eventTarget;

            function collectSelectors (interactable, selector, context) {
                var els = ie8MatchesSelector
                        ? context.querySelectorAll(selector)
                        : undefined;

                if (interactable._iEvents[eventType]
                    && isElement(element)
                    && inContext(interactable, element)
                    && !testIgnore(interactable, element, eventTarget)
                    && testAllow(interactable, element, eventTarget)
                    && matchesSelector(element, selector, els)) {

                    targets.push(interactable);
                    elements.push(element);
                }
            }

            while (element) {
                if (interact.isSet(element) && interact(element)._iEvents[eventType]) {
                    targets.push(interact(element));
                    elements.push(element);
                }

                interactables.forEachSelector(collectSelectors);

                element = parentElement(element);
            }

            // create the tap event even if there are no listeners so that
            // doubletap can still be created and fired
            if (targets.length || eventType === 'tap') {
                this.firePointers(pointer, event, eventTarget, targets, elements, eventType);
            }
        },

        firePointers: function (pointer, event, eventTarget, targets, elements, eventType) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer)),
                pointerEvent = {},
                i,
                // for tap events
                interval, createNewDoubleTap;

            // if it's a doubletap then the event properties would have been
            // copied from the tap event and provided as the pointer argument
            if (eventType === 'doubletap') {
                pointerEvent = pointer;
            }
            else {
                pointerExtend(pointerEvent, event);
                if (event !== pointer) {
                    pointerExtend(pointerEvent, pointer);
                }

                pointerEvent.preventDefault           = preventOriginalDefault;
                pointerEvent.stopPropagation          = InteractEvent.prototype.stopPropagation;
                pointerEvent.stopImmediatePropagation = InteractEvent.prototype.stopImmediatePropagation;
                pointerEvent.interaction              = this;

                pointerEvent.timeStamp       = new Date().getTime();
                pointerEvent.originalEvent   = event;
                pointerEvent.originalPointer = pointer;
                pointerEvent.type            = eventType;
                pointerEvent.pointerId       = getPointerId(pointer);
                pointerEvent.pointerType     = this.mouse? 'mouse' : !supportsPointerEvent? 'touch'
                                                    : isString(pointer.pointerType)
                                                        ? pointer.pointerType
                                                        : [,,'touch', 'pen', 'mouse'][pointer.pointerType];
            }

            if (eventType === 'tap') {
                pointerEvent.dt = pointerEvent.timeStamp - this.downTimes[pointerIndex];

                interval = pointerEvent.timeStamp - this.tapTime;
                createNewDoubleTap = !!(this.prevTap && this.prevTap.type !== 'doubletap'
                       && this.prevTap.target === pointerEvent.target
                       && interval < 500);

                pointerEvent.double = createNewDoubleTap;

                this.tapTime = pointerEvent.timeStamp;
            }

            for (i = 0; i < targets.length; i++) {
                pointerEvent.currentTarget = elements[i];
                pointerEvent.interactable = targets[i];
                targets[i].fire(pointerEvent);

                if (pointerEvent.immediatePropagationStopped
                    ||(pointerEvent.propagationStopped && elements[i + 1] !== pointerEvent.currentTarget)) {
                    break;
                }
            }

            if (createNewDoubleTap) {
                var doubleTap = {};

                extend(doubleTap, pointerEvent);

                doubleTap.dt   = interval;
                doubleTap.type = 'doubletap';

                this.collectEventTargets(doubleTap, event, eventTarget, 'doubletap');

                this.prevTap = doubleTap;
            }
            else if (eventType === 'tap') {
                this.prevTap = pointerEvent;
            }
        },

        validateSelector: function (pointer, event, matches, matchElements) {
            for (var i = 0, len = matches.length; i < len; i++) {
                var match = matches[i],
                    matchElement = matchElements[i],
                    action = validateAction(match.getAction(pointer, event, this, matchElement), match);

                if (action && withinInteractionLimit(match, matchElement, action)) {
                    this.target = match;
                    this.element = matchElement;

                    return action;
                }
            }
        },

        setSnapping: function (pageCoords, status) {
            var snap = this.target.options[this.prepared.name].snap,
                targets = [],
                target,
                page,
                i;

            status = status || this.snapStatus;

            if (status.useStatusXY) {
                page = { x: status.x, y: status.y };
            }
            else {
                var origin = getOriginXY(this.target, this.element);

                page = extend({}, pageCoords);

                page.x -= origin.x;
                page.y -= origin.y;
            }

            status.realX = page.x;
            status.realY = page.y;

            page.x = page.x - this.inertiaStatus.resumeDx;
            page.y = page.y - this.inertiaStatus.resumeDy;

            var len = snap.targets? snap.targets.length : 0;

            for (var relIndex = 0; relIndex < this.snapOffsets.length; relIndex++) {
                var relative = {
                    x: page.x - this.snapOffsets[relIndex].x,
                    y: page.y - this.snapOffsets[relIndex].y
                };

                for (i = 0; i < len; i++) {
                    if (isFunction(snap.targets[i])) {
                        target = snap.targets[i](relative.x, relative.y, this);
                    }
                    else {
                        target = snap.targets[i];
                    }

                    if (!target) { continue; }

                    targets.push({
                        x: isNumber(target.x) ? (target.x + this.snapOffsets[relIndex].x) : relative.x,
                        y: isNumber(target.y) ? (target.y + this.snapOffsets[relIndex].y) : relative.y,

                        range: isNumber(target.range)? target.range: snap.range
                    });
                }
            }

            var closest = {
                    target: null,
                    inRange: false,
                    distance: 0,
                    range: 0,
                    dx: 0,
                    dy: 0
                };

            for (i = 0, len = targets.length; i < len; i++) {
                target = targets[i];

                var range = target.range,
                    dx = target.x - page.x,
                    dy = target.y - page.y,
                    distance = hypot(dx, dy),
                    inRange = distance <= range;

                // Infinite targets count as being out of range
                // compared to non infinite ones that are in range
                if (range === Infinity && closest.inRange && closest.range !== Infinity) {
                    inRange = false;
                }

                if (!closest.target || (inRange
                    // is the closest target in range?
                    ? (closest.inRange && range !== Infinity
                        // the pointer is relatively deeper in this target
                        ? distance / range < closest.distance / closest.range
                        // this target has Infinite range and the closest doesn't
                        : (range === Infinity && closest.range !== Infinity)
                            // OR this target is closer that the previous closest
                            || distance < closest.distance)
                    // The other is not in range and the pointer is closer to this target
                    : (!closest.inRange && distance < closest.distance))) {

                    if (range === Infinity) {
                        inRange = true;
                    }

                    closest.target = target;
                    closest.distance = distance;
                    closest.range = range;
                    closest.inRange = inRange;
                    closest.dx = dx;
                    closest.dy = dy;

                    status.range = range;
                }
            }

            var snapChanged;

            if (closest.target) {
                snapChanged = (status.snappedX !== closest.target.x || status.snappedY !== closest.target.y);

                status.snappedX = closest.target.x;
                status.snappedY = closest.target.y;
            }
            else {
                snapChanged = true;

                status.snappedX = NaN;
                status.snappedY = NaN;
            }

            status.dx = closest.dx;
            status.dy = closest.dy;

            status.changed = (snapChanged || (closest.inRange && !status.locked));
            status.locked = closest.inRange;

            return status;
        },

        setRestriction: function (pageCoords, status) {
            var target = this.target,
                restrict = target && target.options[this.prepared.name].restrict,
                restriction = restrict && restrict.restriction,
                page;

            if (!restriction) {
                return status;
            }

            status = status || this.restrictStatus;

            page = status.useStatusXY
                    ? page = { x: status.x, y: status.y }
                    : page = extend({}, pageCoords);

            if (status.snap && status.snap.locked) {
                page.x += status.snap.dx || 0;
                page.y += status.snap.dy || 0;
            }

            page.x -= this.inertiaStatus.resumeDx;
            page.y -= this.inertiaStatus.resumeDy;

            status.dx = 0;
            status.dy = 0;
            status.restricted = false;

            var rect, restrictedX, restrictedY;

            if (isString(restriction)) {
                if (restriction === 'parent') {
                    restriction = parentElement(this.element);
                }
                else if (restriction === 'self') {
                    restriction = target.getRect(this.element);
                }
                else {
                    restriction = closest(this.element, restriction);
                }

                if (!restriction) { return status; }
            }

            if (isFunction(restriction)) {
                restriction = restriction(page.x, page.y, this.element);
            }

            if (isElement(restriction)) {
                restriction = getElementRect(restriction);
            }

            rect = restriction;

            if (!restriction) {
                restrictedX = page.x;
                restrictedY = page.y;
            }
            // object is assumed to have
            // x, y, width, height or
            // left, top, right, bottom
            else if ('x' in restriction && 'y' in restriction) {
                restrictedX = Math.max(Math.min(rect.x + rect.width  - this.restrictOffset.right , page.x), rect.x + this.restrictOffset.left);
                restrictedY = Math.max(Math.min(rect.y + rect.height - this.restrictOffset.bottom, page.y), rect.y + this.restrictOffset.top );
            }
            else {
                restrictedX = Math.max(Math.min(rect.right  - this.restrictOffset.right , page.x), rect.left + this.restrictOffset.left);
                restrictedY = Math.max(Math.min(rect.bottom - this.restrictOffset.bottom, page.y), rect.top  + this.restrictOffset.top );
            }

            status.dx = restrictedX - page.x;
            status.dy = restrictedY - page.y;

            status.changed = status.restrictedX !== restrictedX || status.restrictedY !== restrictedY;
            status.restricted = !!(status.dx || status.dy);

            status.restrictedX = restrictedX;
            status.restrictedY = restrictedY;

            return status;
        },

        checkAndPreventDefault: function (event, interactable, element) {
            if (!(interactable = interactable || this.target)) { return; }

            var options = interactable.options,
                prevent = options.preventDefault;

            if (prevent === 'auto' && element && !/^(input|select|textarea)$/i.test(event.target.nodeName)) {
                // do not preventDefault on pointerdown if the prepared action is a drag
                // and dragging can only start from a certain direction - this allows
                // a touch to pan the viewport if a drag isn't in the right direction
                if (/down|start/i.test(event.type)
                    && this.prepared.name === 'drag' && options.drag.axis !== 'xy') {

                    return;
                }

                // with manualStart, only preventDefault while interacting
                if (options[this.prepared.name] && options[this.prepared.name].manualStart
                    && !this.interacting()) {
                    return;
                }

                event.preventDefault();
                return;
            }

            if (prevent === 'always') {
                event.preventDefault();
                return;
            }
        },

        calcInertia: function (status) {
            var inertiaOptions = this.target.options[this.prepared.name].inertia,
                lambda = inertiaOptions.resistance,
                inertiaDur = -Math.log(inertiaOptions.endSpeed / status.v0) / lambda;

            status.x0 = this.prevEvent.pageX;
            status.y0 = this.prevEvent.pageY;
            status.t0 = status.startEvent.timeStamp / 1000;
            status.sx = status.sy = 0;

            status.modifiedXe = status.xe = (status.vx0 - inertiaDur) / lambda;
            status.modifiedYe = status.ye = (status.vy0 - inertiaDur) / lambda;
            status.te = inertiaDur;

            status.lambda_v0 = lambda / status.v0;
            status.one_ve_v0 = 1 - inertiaOptions.endSpeed / status.v0;
        },

        autoScrollMove: function (pointer) {
            if (!(this.interacting()
                && checkAutoScroll(this.target, this.prepared.name))) {
                return;
            }

            if (this.inertiaStatus.active) {
                autoScroll.x = autoScroll.y = 0;
                return;
            }

            var top,
                right,
                bottom,
                left,
                options = this.target.options[this.prepared.name].autoScroll,
                container = options.container || getWindow(this.element);

            if (isWindow(container)) {
                left   = pointer.clientX < autoScroll.margin;
                top    = pointer.clientY < autoScroll.margin;
                right  = pointer.clientX > container.innerWidth  - autoScroll.margin;
                bottom = pointer.clientY > container.innerHeight - autoScroll.margin;
            }
            else {
                var rect = getElementClientRect(container);

                left   = pointer.clientX < rect.left   + autoScroll.margin;
                top    = pointer.clientY < rect.top    + autoScroll.margin;
                right  = pointer.clientX > rect.right  - autoScroll.margin;
                bottom = pointer.clientY > rect.bottom - autoScroll.margin;
            }

            autoScroll.x = (right ? 1: left? -1: 0);
            autoScroll.y = (bottom? 1:  top? -1: 0);

            if (!autoScroll.isScrolling) {
                // set the autoScroll properties to those of the target
                autoScroll.margin = options.margin;
                autoScroll.speed  = options.speed;

                autoScroll.start(this);
            }
        },

        _updateEventTargets: function (target, currentTarget) {
            this._eventTarget    = target;
            this._curEventTarget = currentTarget;
        }

    };

    function getInteractionFromPointer (pointer, eventType, eventTarget) {
        var i = 0, len = interactions.length,
            mouseEvent = (/mouse/i.test(pointer.pointerType || eventType)
                          // MSPointerEvent.MSPOINTER_TYPE_MOUSE
                          || pointer.pointerType === 4),
            interaction;

        var id = getPointerId(pointer);

        // try to resume inertia with a new pointer
        if (/down|start/i.test(eventType)) {
            for (i = 0; i < len; i++) {
                interaction = interactions[i];

                var element = eventTarget;

                if (interaction.inertiaStatus.active && interaction.target.options[interaction.prepared.name].inertia.allowResume
                    && (interaction.mouse === mouseEvent)) {
                    while (element) {
                        // if the element is the interaction element
                        if (element === interaction.element) {
                            return interaction;
                        }
                        element = parentElement(element);
                    }
                }
            }
        }

        // if it's a mouse interaction
        if (mouseEvent || !(supportsTouch || supportsPointerEvent)) {

            // find a mouse interaction that's not in inertia phase
            for (i = 0; i < len; i++) {
                if (interactions[i].mouse && !interactions[i].inertiaStatus.active) {
                    return interactions[i];
                }
            }

            // find any interaction specifically for mouse.
            // if the eventType is a mousedown, and inertia is active
            // ignore the interaction
            for (i = 0; i < len; i++) {
                if (interactions[i].mouse && !(/down/.test(eventType) && interactions[i].inertiaStatus.active)) {
                    return interaction;
                }
            }

            // create a new interaction for mouse
            interaction = new Interaction();
            interaction.mouse = true;

            return interaction;
        }

        // get interaction that has this pointer
        for (i = 0; i < len; i++) {
            if (contains(interactions[i].pointerIds, id)) {
                return interactions[i];
            }
        }

        // at this stage, a pointerUp should not return an interaction
        if (/up|end|out/i.test(eventType)) {
            return null;
        }

        // get first idle interaction
        for (i = 0; i < len; i++) {
            interaction = interactions[i];

            if ((!interaction.prepared.name || (interaction.target.options.gesture.enabled))
                && !interaction.interacting()
                && !(!mouseEvent && interaction.mouse)) {

                return interaction;
            }
        }

        return new Interaction();
    }

    function doOnInteractions (method) {
        return (function (event) {
            var interaction,
                eventTarget = getActualElement(event.path
                                               ? event.path[0]
                                               : event.target),
                curEventTarget = getActualElement(event.currentTarget),
                i;

            if (supportsTouch && /touch/.test(event.type)) {
                prevTouchTime = new Date().getTime();

                for (i = 0; i < event.changedTouches.length; i++) {
                    var pointer = event.changedTouches[i];

                    interaction = getInteractionFromPointer(pointer, event.type, eventTarget);

                    if (!interaction) { continue; }

                    interaction._updateEventTargets(eventTarget, curEventTarget);

                    interaction[method](pointer, event, eventTarget, curEventTarget);
                }
            }
            else {
                if (!supportsPointerEvent && /mouse/.test(event.type)) {
                    // ignore mouse events while touch interactions are active
                    for (i = 0; i < interactions.length; i++) {
                        if (!interactions[i].mouse && interactions[i].pointerIsDown) {
                            return;
                        }
                    }

                    // try to ignore mouse events that are simulated by the browser
                    // after a touch event
                    if (new Date().getTime() - prevTouchTime < 500) {
                        return;
                    }
                }

                interaction = getInteractionFromPointer(event, event.type, eventTarget);

                if (!interaction) { return; }

                interaction._updateEventTargets(eventTarget, curEventTarget);

                interaction[method](event, event, eventTarget, curEventTarget);
            }
        });
    }

    function InteractEvent (interaction, event, action, phase, element, related) {
        var client,
            page,
            target      = interaction.target,
            snapStatus  = interaction.snapStatus,
            restrictStatus  = interaction.restrictStatus,
            pointers    = interaction.pointers,
            deltaSource = (target && target.options || defaultOptions).deltaSource,
            sourceX     = deltaSource + 'X',
            sourceY     = deltaSource + 'Y',
            options     = target? target.options: defaultOptions,
            origin      = getOriginXY(target, element),
            starting    = phase === 'start',
            ending      = phase === 'end',
            coords      = starting? interaction.startCoords : interaction.curCoords;

        element = element || interaction.element;

        page   = extend({}, coords.page);
        client = extend({}, coords.client);

        page.x -= origin.x;
        page.y -= origin.y;

        client.x -= origin.x;
        client.y -= origin.y;

        var relativePoints = options[action].snap && options[action].snap.relativePoints ;

        if (checkSnap(target, action) && !(starting && relativePoints && relativePoints.length)) {
            this.snap = {
                range  : snapStatus.range,
                locked : snapStatus.locked,
                x      : snapStatus.snappedX,
                y      : snapStatus.snappedY,
                realX  : snapStatus.realX,
                realY  : snapStatus.realY,
                dx     : snapStatus.dx,
                dy     : snapStatus.dy
            };

            if (snapStatus.locked) {
                page.x += snapStatus.dx;
                page.y += snapStatus.dy;
                client.x += snapStatus.dx;
                client.y += snapStatus.dy;
            }
        }

        if (checkRestrict(target, action) && !(starting && options[action].restrict.elementRect) && restrictStatus.restricted) {
            page.x += restrictStatus.dx;
            page.y += restrictStatus.dy;
            client.x += restrictStatus.dx;
            client.y += restrictStatus.dy;

            this.restrict = {
                dx: restrictStatus.dx,
                dy: restrictStatus.dy
            };
        }

        this.pageX     = page.x;
        this.pageY     = page.y;
        this.clientX   = client.x;
        this.clientY   = client.y;

        this.x0        = interaction.startCoords.page.x - origin.x;
        this.y0        = interaction.startCoords.page.y - origin.y;
        this.clientX0  = interaction.startCoords.client.x - origin.x;
        this.clientY0  = interaction.startCoords.client.y - origin.y;
        this.ctrlKey   = event.ctrlKey;
        this.altKey    = event.altKey;
        this.shiftKey  = event.shiftKey;
        this.metaKey   = event.metaKey;
        this.button    = event.button;
        this.buttons   = event.buttons;
        this.target    = element;
        this.t0        = interaction.downTimes[0];
        this.type      = action + (phase || '');

        this.interaction = interaction;
        this.interactable = target;

        var inertiaStatus = interaction.inertiaStatus;

        if (inertiaStatus.active) {
            this.detail = 'inertia';
        }

        if (related) {
            this.relatedTarget = related;
        }

        // end event dx, dy is difference between start and end points
        if (ending) {
            if (deltaSource === 'client') {
                this.dx = client.x - interaction.startCoords.client.x;
                this.dy = client.y - interaction.startCoords.client.y;
            }
            else {
                this.dx = page.x - interaction.startCoords.page.x;
                this.dy = page.y - interaction.startCoords.page.y;
            }
        }
        else if (starting) {
            this.dx = 0;
            this.dy = 0;
        }
        // copy properties from previousmove if starting inertia
        else if (phase === 'inertiastart') {
            this.dx = interaction.prevEvent.dx;
            this.dy = interaction.prevEvent.dy;
        }
        else {
            if (deltaSource === 'client') {
                this.dx = client.x - interaction.prevEvent.clientX;
                this.dy = client.y - interaction.prevEvent.clientY;
            }
            else {
                this.dx = page.x - interaction.prevEvent.pageX;
                this.dy = page.y - interaction.prevEvent.pageY;
            }
        }
        if (interaction.prevEvent && interaction.prevEvent.detail === 'inertia'
            && !inertiaStatus.active
            && options[action].inertia && options[action].inertia.zeroResumeDelta) {

            inertiaStatus.resumeDx += this.dx;
            inertiaStatus.resumeDy += this.dy;

            this.dx = this.dy = 0;
        }

        if (action === 'resize' && interaction.resizeAxes) {
            if (options.resize.square) {
                if (interaction.resizeAxes === 'y') {
                    this.dx = this.dy;
                }
                else {
                    this.dy = this.dx;
                }
                this.axes = 'xy';
            }
            else {
                this.axes = interaction.resizeAxes;

                if (interaction.resizeAxes === 'x') {
                    this.dy = 0;
                }
                else if (interaction.resizeAxes === 'y') {
                    this.dx = 0;
                }
            }
        }
        else if (action === 'gesture') {
            this.touches = [pointers[0], pointers[1]];

            if (starting) {
                this.distance = touchDistance(pointers, deltaSource);
                this.box      = touchBBox(pointers);
                this.scale    = 1;
                this.ds       = 0;
                this.angle    = touchAngle(pointers, undefined, deltaSource);
                this.da       = 0;
            }
            else if (ending || event instanceof InteractEvent) {
                this.distance = interaction.prevEvent.distance;
                this.box      = interaction.prevEvent.box;
                this.scale    = interaction.prevEvent.scale;
                this.ds       = this.scale - 1;
                this.angle    = interaction.prevEvent.angle;
                this.da       = this.angle - interaction.gesture.startAngle;
            }
            else {
                this.distance = touchDistance(pointers, deltaSource);
                this.box      = touchBBox(pointers);
                this.scale    = this.distance / interaction.gesture.startDistance;
                this.angle    = touchAngle(pointers, interaction.gesture.prevAngle, deltaSource);

                this.ds = this.scale - interaction.gesture.prevScale;
                this.da = this.angle - interaction.gesture.prevAngle;
            }
        }

        if (starting) {
            this.timeStamp = interaction.downTimes[0];
            this.dt        = 0;
            this.duration  = 0;
            this.speed     = 0;
            this.velocityX = 0;
            this.velocityY = 0;
        }
        else if (phase === 'inertiastart') {
            this.timeStamp = interaction.prevEvent.timeStamp;
            this.dt        = interaction.prevEvent.dt;
            this.duration  = interaction.prevEvent.duration;
            this.speed     = interaction.prevEvent.speed;
            this.velocityX = interaction.prevEvent.velocityX;
            this.velocityY = interaction.prevEvent.velocityY;
        }
        else {
            this.timeStamp = new Date().getTime();
            this.dt        = this.timeStamp - interaction.prevEvent.timeStamp;
            this.duration  = this.timeStamp - interaction.downTimes[0];

            if (event instanceof InteractEvent) {
                var dx = this[sourceX] - interaction.prevEvent[sourceX],
                    dy = this[sourceY] - interaction.prevEvent[sourceY],
                    dt = this.dt / 1000;

                this.speed = hypot(dx, dy) / dt;
                this.velocityX = dx / dt;
                this.velocityY = dy / dt;
            }
            // if normal move or end event, use previous user event coords
            else {
                // speed and velocity in pixels per second
                this.speed = interaction.pointerDelta[deltaSource].speed;
                this.velocityX = interaction.pointerDelta[deltaSource].vx;
                this.velocityY = interaction.pointerDelta[deltaSource].vy;
            }
        }

        if ((ending || phase === 'inertiastart')
            && interaction.prevEvent.speed > 600 && this.timeStamp - interaction.prevEvent.timeStamp < 150) {

            var angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI,
                overlap = 22.5;

            if (angle < 0) {
                angle += 360;
            }

            var left = 135 - overlap <= angle && angle < 225 + overlap,
                up   = 225 - overlap <= angle && angle < 315 + overlap,

                right = !left && (315 - overlap <= angle || angle <  45 + overlap),
                down  = !up   &&   45 - overlap <= angle && angle < 135 + overlap;

            this.swipe = {
                up   : up,
                down : down,
                left : left,
                right: right,
                angle: angle,
                speed: interaction.prevEvent.speed,
                velocity: {
                    x: interaction.prevEvent.velocityX,
                    y: interaction.prevEvent.velocityY
                }
            };
        }
    }

    InteractEvent.prototype = {
        preventDefault: blank,
        stopImmediatePropagation: function () {
            this.immediatePropagationStopped = this.propagationStopped = true;
        },
        stopPropagation: function () {
            this.propagationStopped = true;
        }
    };

    function preventOriginalDefault () {
        this.originalEvent.preventDefault();
    }

    function getActionCursor (action) {
        var cursor = '';

        if (action.name === 'drag') {
            cursor =  actionCursors.drag;
        }
        if (action.name === 'resize') {
            if (action.axis) {
                cursor =  actionCursors[action.name + action.axis];
            }
            else if (action.edges) {
                var cursorKey = 'resize',
                    edgeNames = ['top', 'bottom', 'left', 'right'];

                for (var i = 0; i < 4; i++) {
                    if (action.edges[edgeNames[i]]) {
                        cursorKey += edgeNames[i];
                    }
                }

                cursor = actionCursors[cursorKey];
            }
        }

        return cursor;
    }

    function checkResizeEdge (name, value, page, element, interactableElement, rect, margin) {
        // false, '', undefined, null
        if (!value) { return false; }

        // true value, use pointer coords and element rect
        if (value === true) {
            // if dimensions are negative, "switch" edges
            var width = isNumber(rect.width)? rect.width : rect.right - rect.left,
                height = isNumber(rect.height)? rect.height : rect.bottom - rect.top;

            if (width < 0) {
                if      (name === 'left' ) { name = 'right'; }
                else if (name === 'right') { name = 'left' ; }
            }
            if (height < 0) {
                if      (name === 'top'   ) { name = 'bottom'; }
                else if (name === 'bottom') { name = 'top'   ; }
            }

            if (name === 'left'  ) { return page.x < ((width  >= 0? rect.left: rect.right ) + margin); }
            if (name === 'top'   ) { return page.y < ((height >= 0? rect.top : rect.bottom) + margin); }

            if (name === 'right' ) { return page.x > ((width  >= 0? rect.right : rect.left) - margin); }
            if (name === 'bottom') { return page.y > ((height >= 0? rect.bottom: rect.top ) - margin); }
        }

        // the remaining checks require an element
        if (!isElement(element)) { return false; }

        return isElement(value)
                    // the value is an element to use as a resize handle
                    ? value === element
                    // otherwise check if element matches value as selector
                    : matchesUpTo(element, value, interactableElement);
    }

    function defaultActionChecker (pointer, interaction, element) {
        var rect = this.getRect(element),
            shouldResize = false,
            action = null,
            resizeAxes = null,
            resizeEdges,
            page = extend({}, interaction.curCoords.page),
            options = this.options;

        if (!rect) { return null; }

        if (actionIsEnabled.resize && options.resize.enabled) {
            var resizeOptions = options.resize;

            resizeEdges = {
                left: false, right: false, top: false, bottom: false
            };

            // if using resize.edges
            if (isObject(resizeOptions.edges)) {
                for (var edge in resizeEdges) {
                    resizeEdges[edge] = checkResizeEdge(edge,
                                                        resizeOptions.edges[edge],
                                                        page,
                                                        interaction._eventTarget,
                                                        element,
                                                        rect,
                                                        resizeOptions.margin || margin);
                }

                resizeEdges.left = resizeEdges.left && !resizeEdges.right;
                resizeEdges.top  = resizeEdges.top  && !resizeEdges.bottom;

                shouldResize = resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom;
            }
            else {
                var right  = options.resize.axis !== 'y' && page.x > (rect.right  - margin),
                    bottom = options.resize.axis !== 'x' && page.y > (rect.bottom - margin);

                shouldResize = right || bottom;
                resizeAxes = (right? 'x' : '') + (bottom? 'y' : '');
            }
        }

        action = shouldResize
            ? 'resize'
            : actionIsEnabled.drag && options.drag.enabled
                ? 'drag'
                : null;

        if (actionIsEnabled.gesture
            && interaction.pointerIds.length >=2
            && !(interaction.dragging || interaction.resizing)) {
            action = 'gesture';
        }

        if (action) {
            return {
                name: action,
                axis: resizeAxes,
                edges: resizeEdges
            };
        }

        return null;
    }

    // Check if action is enabled globally and the current target supports it
    // If so, return the validated action. Otherwise, return null
    function validateAction (action, interactable) {
        if (!isObject(action)) { return null; }

        var actionName = action.name,
            options = interactable.options;

        if ((  (actionName  === 'resize'   && options.resize.enabled )
            || (actionName      === 'drag'     && options.drag.enabled  )
            || (actionName      === 'gesture'  && options.gesture.enabled))
            && actionIsEnabled[actionName]) {

            if (actionName === 'resize' || actionName === 'resizeyx') {
                actionName = 'resizexy';
            }

            return action;
        }
        return null;
    }

    var listeners = {},
        interactionListeners = [
            'dragStart', 'dragMove', 'resizeStart', 'resizeMove', 'gestureStart', 'gestureMove',
            'pointerOver', 'pointerOut', 'pointerHover', 'selectorDown',
            'pointerDown', 'pointerMove', 'pointerUp', 'pointerCancel', 'pointerEnd',
            'addPointer', 'removePointer', 'recordPointer', 'autoScrollMove'
        ];

    for (var i = 0, len = interactionListeners.length; i < len; i++) {
        var name = interactionListeners[i];

        listeners[name] = doOnInteractions(name);
    }

    // bound to the interactable context when a DOM event
    // listener is added to a selector interactable
    function delegateListener (event, useCapture) {
        var fakeEvent = {},
            delegated = delegatedEvents[event.type],
            eventTarget = getActualElement(event.path
                                           ? event.path[0]
                                           : event.target),
            element = eventTarget;

        useCapture = useCapture? true: false;

        // duplicate the event so that currentTarget can be changed
        for (var prop in event) {
            fakeEvent[prop] = event[prop];
        }

        fakeEvent.originalEvent = event;
        fakeEvent.preventDefault = preventOriginalDefault;

        // climb up document tree looking for selector matches
        while (isElement(element)) {
            for (var i = 0; i < delegated.selectors.length; i++) {
                var selector = delegated.selectors[i],
                    context = delegated.contexts[i];

                if (matchesSelector(element, selector)
                    && nodeContains(context, eventTarget)
                    && nodeContains(context, element)) {

                    var listeners = delegated.listeners[i];

                    fakeEvent.currentTarget = element;

                    for (var j = 0; j < listeners.length; j++) {
                        if (listeners[j][1] === useCapture) {
                            listeners[j][0](fakeEvent);
                        }
                    }
                }
            }

            element = parentElement(element);
        }
    }

    function delegateUseCapture (event) {
        return delegateListener.call(this, event, true);
    }

    interactables.indexOfElement = function indexOfElement (element, context) {
        context = context || document;

        for (var i = 0; i < this.length; i++) {
            var interactable = this[i];

            if ((interactable.selector === element
                && (interactable._context === context))
                || (!interactable.selector && interactable._element === element)) {

                return i;
            }
        }
        return -1;
    };

    interactables.get = function interactableGet (element, options) {
        return this[this.indexOfElement(element, options && options.context)];
    };

    interactables.forEachSelector = function (callback) {
        for (var i = 0; i < this.length; i++) {
            var interactable = this[i];

            if (!interactable.selector) {
                continue;
            }

            var ret = callback(interactable, interactable.selector, interactable._context, i, this);

            if (ret !== undefined) {
                return ret;
            }
        }
    };

    /*\
     * interact
     [ method ]
     *
     * The methods of this variable can be used to set elements as
     * interactables and also to change various default settings.
     *
     * Calling it as a function and passing an element or a valid CSS selector
     * string returns an Interactable object which has various methods to
     * configure it.
     *
     - element (Element | string) The HTML or SVG Element to interact with or CSS selector
     = (object) An @Interactable
     *
     > Usage
     | interact(document.getElementById('draggable')).draggable(true);
     |
     | var rectables = interact('rect');
     | rectables
     |     .gesturable(true)
     |     .on('gesturemove', function (event) {
     |         // something cool...
     |     })
     |     .autoScroll(true);
    \*/
    function interact (element, options) {
        return interactables.get(element, options) || new Interactable(element, options);
    }

    /*\
     * Interactable
     [ property ]
     **
     * Object type returned by @interact
    \*/
    function Interactable (element, options) {
        this._element = element;
        this._iEvents = this._iEvents || {};

        var _window;

        if (trySelector(element)) {
            this.selector = element;

            var context = options && options.context;

            _window = context? getWindow(context) : window;

            if (context && (_window.Node
                    ? context instanceof _window.Node
                    : (isElement(context) || context === _window.document))) {

                this._context = context;
            }
        }
        else {
            _window = getWindow(element);

            if (isElement(element, _window)) {

                if (PointerEvent) {
                    events.add(this._element, pEventTypes.down, listeners.pointerDown );
                    events.add(this._element, pEventTypes.move, listeners.pointerHover);
                }
                else {
                    events.add(this._element, 'mousedown' , listeners.pointerDown );
                    events.add(this._element, 'mousemove' , listeners.pointerHover);
                    events.add(this._element, 'touchstart', listeners.pointerDown );
                    events.add(this._element, 'touchmove' , listeners.pointerHover);
                }
            }
        }

        this._doc = _window.document;

        if (!contains(documents, this._doc)) {
            listenToDocument(this._doc);
        }

        interactables.push(this);

        this.set(options);
    }

    Interactable.prototype = {
        setOnEvents: function (action, phases) {
            if (action === 'drop') {
                if (isFunction(phases.ondrop)          ) { this.ondrop           = phases.ondrop          ; }
                if (isFunction(phases.ondropactivate)  ) { this.ondropactivate   = phases.ondropactivate  ; }
                if (isFunction(phases.ondropdeactivate)) { this.ondropdeactivate = phases.ondropdeactivate; }
                if (isFunction(phases.ondragenter)     ) { this.ondragenter      = phases.ondragenter     ; }
                if (isFunction(phases.ondragleave)     ) { this.ondragleave      = phases.ondragleave     ; }
                if (isFunction(phases.ondropmove)      ) { this.ondropmove       = phases.ondropmove      ; }
            }
            else {
                action = 'on' + action;

                if (isFunction(phases.onstart)       ) { this[action + 'start'         ] = phases.onstart         ; }
                if (isFunction(phases.onmove)        ) { this[action + 'move'          ] = phases.onmove          ; }
                if (isFunction(phases.onend)         ) { this[action + 'end'           ] = phases.onend           ; }
                if (isFunction(phases.oninertiastart)) { this[action + 'inertiastart'  ] = phases.oninertiastart  ; }
            }

            return this;
        },

        /*\
         * Interactable.draggable
         [ method ]
         *
         * Gets or sets whether drag actions can be performed on the
         * Interactable
         *
         = (boolean) Indicates if this can be the target of drag events
         | var isDraggable = interact('ul li').draggable();
         * or
         - options (boolean | object) #optional true/false or An object with event listeners to be fired on drag events (object makes the Interactable draggable)
         = (object) This Interactable
         | interact(element).draggable({
         |     onstart: function (event) {},
         |     onmove : function (event) {},
         |     onend  : function (event) {},
         |
         |     // the axis in which the first movement must be
         |     // for the drag sequence to start
         |     // 'xy' by default - any direction
         |     axis: 'x' || 'y' || 'xy',
         |
         |     // max number of drags that can happen concurrently
         |     // with elements of this Interactable. Infinity by default
         |     max: Infinity,
         |
         |     // max number of drags that can target the same element+Interactable
         |     // 1 by default
         |     maxPerElement: 2
         | });
        \*/
        draggable: function (options) {
            if (isObject(options)) {
                this.options.drag.enabled = options.enabled === false? false: true;
                this.setPerAction('drag', options);
                this.setOnEvents('drag', options);

                if (/^x$|^y$|^xy$/.test(options.axis)) {
                    this.options.drag.axis = options.axis;
                }
                else if (options.axis === null) {
                    delete this.options.drag.axis;
                }

                return this;
            }

            if (isBool(options)) {
                this.options.drag.enabled = options;

                return this;
            }

            return this.options.drag;
        },

        setPerAction: function (action, options) {
            // for all the default per-action options
            for (var option in options) {
                // if this option exists for this action
                if (option in defaultOptions[action]) {
                    // if the option in the options arg is an object value
                    if (isObject(options[option])) {
                        // duplicate the object
                        this.options[action][option] = extend(this.options[action][option] || {}, options[option]);

                        if (isObject(defaultOptions.perAction[option]) && 'enabled' in defaultOptions.perAction[option]) {
                            this.options[action][option].enabled = options[option].enabled === false? false : true;
                        }
                    }
                    else if (isBool(options[option]) && isObject(defaultOptions.perAction[option])) {
                        this.options[action][option].enabled = options[option];
                    }
                    else if (options[option] !== undefined) {
                        // or if it's not undefined, do a plain assignment
                        this.options[action][option] = options[option];
                    }
                }
            }
        },

        /*\
         * Interactable.dropzone
         [ method ]
         *
         * Returns or sets whether elements can be dropped onto this
         * Interactable to trigger drop events
         *
         * Dropzones can receive the following events:
         *  - `dropactivate` and `dropdeactivate` when an acceptable drag starts and ends
         *  - `dragenter` and `dragleave` when a draggable enters and leaves the dropzone
         *  - `dragmove` when a draggable that has entered the dropzone is moved
         *  - `drop` when a draggable is dropped into this dropzone
         *
         *  Use the `accept` option to allow only elements that match the given CSS selector or element.
         *
         *  Use the `overlap` option to set how drops are checked for. The allowed values are:
         *   - `'pointer'`, the pointer must be over the dropzone (default)
         *   - `'center'`, the draggable element's center must be over the dropzone
         *   - a number from 0-1 which is the `(intersection area) / (draggable area)`.
         *       e.g. `0.5` for drop to happen when half of the area of the
         *       draggable is over the dropzone
         *
         - options (boolean | object | null) #optional The new value to be set.
         | interact('.drop').dropzone({
         |   accept: '.can-drop' || document.getElementById('single-drop'),
         |   overlap: 'pointer' || 'center' || zeroToOne
         | }
         = (boolean | object) The current setting or this Interactable
        \*/
        dropzone: function (options) {
            if (isObject(options)) {
                this.options.drop.enabled = options.enabled === false? false: true;
                this.setOnEvents('drop', options);

                if (/^(pointer|center)$/.test(options.overlap)) {
                    this.options.drop.overlap = options.overlap;
                }
                else if (isNumber(options.overlap)) {
                    this.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
                }
                if ('accept' in options) {
                  this.options.drop.accept = options.accept;
                }
                if ('checker' in options) {
                  this.options.drop.checker = options.checker;
                }

                return this;
            }

            if (isBool(options)) {
                this.options.drop.enabled = options;

                return this;
            }

            return this.options.drop;
        },

        dropCheck: function (dragEvent, event, draggable, draggableElement, dropElement, rect) {
            var dropped = false;

            // if the dropzone has no rect (eg. display: none)
            // call the custom dropChecker or just return false
            if (!(rect = rect || this.getRect(dropElement))) {
                return (this.options.drop.checker
                    ? this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement)
                    : false);
            }

            var dropOverlap = this.options.drop.overlap;

            if (dropOverlap === 'pointer') {
                var page = getPageXY(dragEvent),
                    origin = getOriginXY(draggable, draggableElement),
                    horizontal,
                    vertical;

                page.x += origin.x;
                page.y += origin.y;

                horizontal = (page.x > rect.left) && (page.x < rect.right);
                vertical   = (page.y > rect.top ) && (page.y < rect.bottom);

                dropped = horizontal && vertical;
            }

            var dragRect = draggable.getRect(draggableElement);

            if (dropOverlap === 'center') {
                var cx = dragRect.left + dragRect.width  / 2,
                    cy = dragRect.top  + dragRect.height / 2;

                dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
            }

            if (isNumber(dropOverlap)) {
                var overlapArea  = (Math.max(0, Math.min(rect.right , dragRect.right ) - Math.max(rect.left, dragRect.left))
                                  * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top , dragRect.top ))),
                    overlapRatio = overlapArea / (dragRect.width * dragRect.height);

                dropped = overlapRatio >= dropOverlap;
            }

            if (this.options.drop.checker) {
                dropped = this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement);
            }

            return dropped;
        },

        /*\
         * Interactable.dropChecker
         [ method ]
         *
         * DEPRECATED. Use interactable.dropzone({ checker: function... }) instead.
         *
         * Gets or sets the function used to check if a dragged element is
         * over this Interactable.
         *
         - checker (function) #optional The function that will be called when checking for a drop
         = (Function | Interactable) The checker function or this Interactable
         *
         * The checker function takes the following arguments:
         *
         - dragEvent (InteractEvent) The related dragmove or dragend event
         - event (TouchEvent | PointerEvent | MouseEvent) The user move/up/end Event related to the dragEvent
         - dropped (boolean) The value from the default drop checker
         - dropzone (Interactable) The dropzone interactable
         - dropElement (Element) The dropzone element
         - draggable (Interactable) The Interactable being dragged
         - draggableElement (Element) The actual element that's being dragged
         *
         > Usage:
         | interact(target)
         | .dropChecker(function(dragEvent,         // related dragmove or dragend event
         |                       event,             // TouchEvent/PointerEvent/MouseEvent
         |                       dropped,           // bool result of the default checker
         |                       dropzone,          // dropzone Interactable
         |                       dropElement,       // dropzone elemnt
         |                       draggable,         // draggable Interactable
         |                       draggableElement) {// draggable element
         |
         |   return dropped && event.target.hasAttribute('allow-drop');
         | }
        \*/
        dropChecker: function (checker) {
            if (isFunction(checker)) {
                this.options.drop.checker = checker;

                return this;
            }
            if (checker === null) {
                delete this.options.getRect;

                return this;
            }

            return this.options.drop.checker;
        },

        /*\
         * Interactable.accept
         [ method ]
         *
         * Deprecated. add an `accept` property to the options object passed to
         * @Interactable.dropzone instead.
         *
         * Gets or sets the Element or CSS selector match that this
         * Interactable accepts if it is a dropzone.
         *
         - newValue (Element | string | null) #optional
         * If it is an Element, then only that element can be dropped into this dropzone.
         * If it is a string, the element being dragged must match it as a selector.
         * If it is null, the accept options is cleared - it accepts any element.
         *
         = (string | Element | null | Interactable) The current accept option if given `undefined` or this Interactable
        \*/
        accept: function (newValue) {
            if (isElement(newValue)) {
                this.options.drop.accept = newValue;

                return this;
            }

            // test if it is a valid CSS selector
            if (trySelector(newValue)) {
                this.options.drop.accept = newValue;

                return this;
            }

            if (newValue === null) {
                delete this.options.drop.accept;

                return this;
            }

            return this.options.drop.accept;
        },

        /*\
         * Interactable.resizable
         [ method ]
         *
         * Gets or sets whether resize actions can be performed on the
         * Interactable
         *
         = (boolean) Indicates if this can be the target of resize elements
         | var isResizeable = interact('input[type=text]').resizable();
         * or
         - options (boolean | object) #optional true/false or An object with event listeners to be fired on resize events (object makes the Interactable resizable)
         = (object) This Interactable
         | interact(element).resizable({
         |     onstart: function (event) {},
         |     onmove : function (event) {},
         |     onend  : function (event) {},
         |
         |     edges: {
         |       top   : true,       // Use pointer coords to check for resize.
         |       left  : false,      // Disable resizing from left edge.
         |       bottom: '.resize-s',// Resize if pointer target matches selector
         |       right : handleEl    // Resize if pointer target is the given Element
         |     },
         |
         |     // Width and height can be adjusted independently. When `true`, width and
         |     // height are adjusted at a 1:1 ratio.
         |     square: false,
         |
         |     // Width and height can be adjusted independently. When `true`, width and
         |     // height maintain the aspect ratio they had when resizing started.
         |     preserveAspectRatio: false,
         |
         |     // a value of 'none' will limit the resize rect to a minimum of 0x0
         |     // 'negate' will allow the rect to have negative width/height
         |     // 'reposition' will keep the width/height positive by swapping
         |     // the top and bottom edges and/or swapping the left and right edges
         |     invert: 'none' || 'negate' || 'reposition'
         |
         |     // limit multiple resizes.
         |     // See the explanation in the @Interactable.draggable example
         |     max: Infinity,
         |     maxPerElement: 1,
         | });
        \*/
        resizable: function (options) {
            if (isObject(options)) {
                this.options.resize.enabled = options.enabled === false? false: true;
                this.setPerAction('resize', options);
                this.setOnEvents('resize', options);

                if (/^x$|^y$|^xy$/.test(options.axis)) {
                    this.options.resize.axis = options.axis;
                }
                else if (options.axis === null) {
                    this.options.resize.axis = defaultOptions.resize.axis;
                }

                if (isBool(options.preserveAspectRatio)) {
                    this.options.resize.preserveAspectRatio = options.preserveAspectRatio;
                }
                else if (isBool(options.square)) {
                    this.options.resize.square = options.square;
                }

                return this;
            }
            if (isBool(options)) {
                this.options.resize.enabled = options;

                return this;
            }
            return this.options.resize;
        },

        /*\
         * Interactable.squareResize
         [ method ]
         *
         * Deprecated. Add a `square: true || false` property to @Interactable.resizable instead
         *
         * Gets or sets whether resizing is forced 1:1 aspect
         *
         = (boolean) Current setting
         *
         * or
         *
         - newValue (boolean) #optional
         = (object) this Interactable
        \*/
        squareResize: function (newValue) {
            if (isBool(newValue)) {
                this.options.resize.square = newValue;

                return this;
            }

            if (newValue === null) {
                delete this.options.resize.square;

                return this;
            }

            return this.options.resize.square;
        },

        /*\
         * Interactable.gesturable
         [ method ]
         *
         * Gets or sets whether multitouch gestures can be performed on the
         * Interactable's element
         *
         = (boolean) Indicates if this can be the target of gesture events
         | var isGestureable = interact(element).gesturable();
         * or
         - options (boolean | object) #optional true/false or An object with event listeners to be fired on gesture events (makes the Interactable gesturable)
         = (object) this Interactable
         | interact(element).gesturable({
         |     onstart: function (event) {},
         |     onmove : function (event) {},
         |     onend  : function (event) {},
         |
         |     // limit multiple gestures.
         |     // See the explanation in @Interactable.draggable example
         |     max: Infinity,
         |     maxPerElement: 1,
         | });
        \*/
        gesturable: function (options) {
            if (isObject(options)) {
                this.options.gesture.enabled = options.enabled === false? false: true;
                this.setPerAction('gesture', options);
                this.setOnEvents('gesture', options);

                return this;
            }

            if (isBool(options)) {
                this.options.gesture.enabled = options;

                return this;
            }

            return this.options.gesture;
        },

        /*\
         * Interactable.autoScroll
         [ method ]
         **
         * Deprecated. Add an `autoscroll` property to the options object
         * passed to @Interactable.draggable or @Interactable.resizable instead.
         *
         * Returns or sets whether dragging and resizing near the edges of the
         * window/container trigger autoScroll for this Interactable
         *
         = (object) Object with autoScroll properties
         *
         * or
         *
         - options (object | boolean) #optional
         * options can be:
         * - an object with margin, distance and interval properties,
         * - true or false to enable or disable autoScroll or
         = (Interactable) this Interactable
        \*/
        autoScroll: function (options) {
            if (isObject(options)) {
                options = extend({ actions: ['drag', 'resize']}, options);
            }
            else if (isBool(options)) {
                options = { actions: ['drag', 'resize'], enabled: options };
            }

            return this.setOptions('autoScroll', options);
        },

        /*\
         * Interactable.snap
         [ method ]
         **
         * Deprecated. Add a `snap` property to the options object passed
         * to @Interactable.draggable or @Interactable.resizable instead.
         *
         * Returns or sets if and how action coordinates are snapped. By
         * default, snapping is relative to the pointer coordinates. You can
         * change this by setting the
         * [`elementOrigin`](https://github.com/taye/interact.js/pull/72).
         **
         = (boolean | object) `false` if snap is disabled; object with snap properties if snap is enabled
         **
         * or
         **
         - options (object | boolean | null) #optional
         = (Interactable) this Interactable
         > Usage
         | interact(document.querySelector('#thing')).snap({
         |     targets: [
         |         // snap to this specific point
         |         {
         |             x: 100,
         |             y: 100,
         |             range: 25
         |         },
         |         // give this function the x and y page coords and snap to the object returned
         |         function (x, y) {
         |             return {
         |                 x: x,
         |                 y: (75 + 50 * Math.sin(x * 0.04)),
         |                 range: 40
         |             };
         |         },
         |         // create a function that snaps to a grid
         |         interact.createSnapGrid({
         |             x: 50,
         |             y: 50,
         |             range: 10,              // optional
         |             offset: { x: 5, y: 10 } // optional
         |         })
         |     ],
         |     // do not snap during normal movement.
         |     // Instead, trigger only one snapped move event
         |     // immediately before the end event.
         |     endOnly: true,
         |
         |     relativePoints: [
         |         { x: 0, y: 0 },  // snap relative to the top left of the element
         |         { x: 1, y: 1 },  // and also to the bottom right
         |     ],  
         |
         |     // offset the snap target coordinates
         |     // can be an object with x/y or 'startCoords'
         |     offset: { x: 50, y: 50 }
         |   }
         | });
        \*/
        snap: function (options) {
            var ret = this.setOptions('snap', options);

            if (ret === this) { return this; }

            return ret.drag;
        },

        setOptions: function (option, options) {
            var actions = options && isArray(options.actions)
                    ? options.actions
                    : ['drag'];

            var i;

            if (isObject(options) || isBool(options)) {
                for (i = 0; i < actions.length; i++) {
                    var action = /resize/.test(actions[i])? 'resize' : actions[i];

                    if (!isObject(this.options[action])) { continue; }

                    var thisOption = this.options[action][option];

                    if (isObject(options)) {
                        extend(thisOption, options);
                        thisOption.enabled = options.enabled === false? false: true;

                        if (option === 'snap') {
                            if (thisOption.mode === 'grid') {
                                thisOption.targets = [
                                    interact.createSnapGrid(extend({
                                        offset: thisOption.gridOffset || { x: 0, y: 0 }
                                    }, thisOption.grid || {}))
                                ];
                            }
                            else if (thisOption.mode === 'anchor') {
                                thisOption.targets = thisOption.anchors;
                            }
                            else if (thisOption.mode === 'path') {
                                thisOption.targets = thisOption.paths;
                            }

                            if ('elementOrigin' in options) {
                                thisOption.relativePoints = [options.elementOrigin];
                            }
                        }
                    }
                    else if (isBool(options)) {
                        thisOption.enabled = options;
                    }
                }

                return this;
            }

            var ret = {},
                allActions = ['drag', 'resize', 'gesture'];

            for (i = 0; i < allActions.length; i++) {
                if (option in defaultOptions[allActions[i]]) {
                    ret[allActions[i]] = this.options[allActions[i]][option];
                }
            }

            return ret;
        },


        /*\
         * Interactable.inertia
         [ method ]
         **
         * Deprecated. Add an `inertia` property to the options object passed
         * to @Interactable.draggable or @Interactable.resizable instead.
         *
         * Returns or sets if and how events continue to run after the pointer is released
         **
         = (boolean | object) `false` if inertia is disabled; `object` with inertia properties if inertia is enabled
         **
         * or
         **
         - options (object | boolean | null) #optional
         = (Interactable) this Interactable
         > Usage
         | // enable and use default settings
         | interact(element).inertia(true);
         |
         | // enable and use custom settings
         | interact(element).inertia({
         |     // value greater than 0
         |     // high values slow the object down more quickly
         |     resistance     : 16,
         |
         |     // the minimum launch speed (pixels per second) that results in inertia start
         |     minSpeed       : 200,
         |
         |     // inertia will stop when the object slows down to this speed
         |     endSpeed       : 20,
         |
         |     // boolean; should actions be resumed when the pointer goes down during inertia
         |     allowResume    : true,
         |
         |     // boolean; should the jump when resuming from inertia be ignored in event.dx/dy
         |     zeroResumeDelta: false,
         |
         |     // if snap/restrict are set to be endOnly and inertia is enabled, releasing
         |     // the pointer without triggering inertia will animate from the release
         |     // point to the snaped/restricted point in the given amount of time (ms)
         |     smoothEndDuration: 300,
         |
         |     // an array of action types that can have inertia (no gesture)
         |     actions        : ['drag', 'resize']
         | });
         |
         | // reset custom settings and use all defaults
         | interact(element).inertia(null);
        \*/
        inertia: function (options) {
            var ret = this.setOptions('inertia', options);

            if (ret === this) { return this; }

            return ret.drag;
        },

        getAction: function (pointer, event, interaction, element) {
            var action = this.defaultActionChecker(pointer, interaction, element);

            if (this.options.actionChecker) {
                return this.options.actionChecker(pointer, event, action, this, element, interaction);
            }

            return action;
        },

        defaultActionChecker: defaultActionChecker,

        /*\
         * Interactable.actionChecker
         [ method ]
         *
         * Gets or sets the function used to check action to be performed on
         * pointerDown
         *
         - checker (function | null) #optional A function which takes a pointer event, defaultAction string, interactable, element and interaction as parameters and returns an object with name property 'drag' 'resize' or 'gesture' and optionally an `edges` object with boolean 'top', 'left', 'bottom' and right props.
         = (Function | Interactable) The checker function or this Interactable
         *
         | interact('.resize-drag')
         |   .resizable(true)
         |   .draggable(true)
         |   .actionChecker(function (pointer, event, action, interactable, element, interaction) {
         |
         |   if (interact.matchesSelector(event.target, '.drag-handle') {
         |     // force drag with handle target
         |     action.name = drag;
         |   }
         |   else {
         |     // resize from the top and right edges
         |     action.name  = 'resize';
         |     action.edges = { top: true, right: true };
         |   }
         |
         |   return action;
         | });
        \*/
        actionChecker: function (checker) {
            if (isFunction(checker)) {
                this.options.actionChecker = checker;

                return this;
            }

            if (checker === null) {
                delete this.options.actionChecker;

                return this;
            }

            return this.options.actionChecker;
        },

        /*\
         * Interactable.getRect
         [ method ]
         *
         * The default function to get an Interactables bounding rect. Can be
         * overridden using @Interactable.rectChecker.
         *
         - element (Element) #optional The element to measure.
         = (object) The object's bounding rectangle.
         o {
         o     top   : 0,
         o     left  : 0,
         o     bottom: 0,
         o     right : 0,
         o     width : 0,
         o     height: 0
         o }
        \*/
        getRect: function rectCheck (element) {
            element = element || this._element;

            if (this.selector && !(isElement(element))) {
                element = this._context.querySelector(this.selector);
            }

            return getElementRect(element);
        },

        /*\
         * Interactable.rectChecker
         [ method ]
         *
         * Returns or sets the function used to calculate the interactable's
         * element's rectangle
         *
         - checker (function) #optional A function which returns this Interactable's bounding rectangle. See @Interactable.getRect
         = (function | object) The checker function or this Interactable
        \*/
        rectChecker: function (checker) {
            if (isFunction(checker)) {
                this.getRect = checker;

                return this;
            }

            if (checker === null) {
                delete this.options.getRect;

                return this;
            }

            return this.getRect;
        },

        /*\
         * Interactable.styleCursor
         [ method ]
         *
         * Returns or sets whether the action that would be performed when the
         * mouse on the element are checked on `mousemove` so that the cursor
         * may be styled appropriately
         *
         - newValue (boolean) #optional
         = (boolean | Interactable) The current setting or this Interactable
        \*/
        styleCursor: function (newValue) {
            if (isBool(newValue)) {
                this.options.styleCursor = newValue;

                return this;
            }

            if (newValue === null) {
                delete this.options.styleCursor;

                return this;
            }

            return this.options.styleCursor;
        },

        /*\
         * Interactable.preventDefault
         [ method ]
         *
         * Returns or sets whether to prevent the browser's default behaviour
         * in response to pointer events. Can be set to:
         *  - `'always'` to always prevent
         *  - `'never'` to never prevent
         *  - `'auto'` to let interact.js try to determine what would be best
         *
         - newValue (string) #optional `true`, `false` or `'auto'`
         = (string | Interactable) The current setting or this Interactable
        \*/
        preventDefault: function (newValue) {
            if (/^(always|never|auto)$/.test(newValue)) {
                this.options.preventDefault = newValue;
                return this;
            }

            if (isBool(newValue)) {
                this.options.preventDefault = newValue? 'always' : 'never';
                return this;
            }

            return this.options.preventDefault;
        },

        /*\
         * Interactable.origin
         [ method ]
         *
         * Gets or sets the origin of the Interactable's element.  The x and y
         * of the origin will be subtracted from action event coordinates.
         *
         - origin (object | string) #optional An object eg. { x: 0, y: 0 } or string 'parent', 'self' or any CSS selector
         * OR
         - origin (Element) #optional An HTML or SVG Element whose rect will be used
         **
         = (object) The current origin or this Interactable
        \*/
        origin: function (newValue) {
            if (trySelector(newValue)) {
                this.options.origin = newValue;
                return this;
            }
            else if (isObject(newValue)) {
                this.options.origin = newValue;
                return this;
            }

            return this.options.origin;
        },

        /*\
         * Interactable.deltaSource
         [ method ]
         *
         * Returns or sets the mouse coordinate types used to calculate the
         * movement of the pointer.
         *
         - newValue (string) #optional Use 'client' if you will be scrolling while interacting; Use 'page' if you want autoScroll to work
         = (string | object) The current deltaSource or this Interactable
        \*/
        deltaSource: function (newValue) {
            if (newValue === 'page' || newValue === 'client') {
                this.options.deltaSource = newValue;

                return this;
            }

            return this.options.deltaSource;
        },

        /*\
         * Interactable.restrict
         [ method ]
         **
         * Deprecated. Add a `restrict` property to the options object passed to
         * @Interactable.draggable, @Interactable.resizable or @Interactable.gesturable instead.
         *
         * Returns or sets the rectangles within which actions on this
         * interactable (after snap calculations) are restricted. By default,
         * restricting is relative to the pointer coordinates. You can change
         * this by setting the
         * [`elementRect`](https://github.com/taye/interact.js/pull/72).
         **
         - options (object) #optional an object with keys drag, resize, and/or gesture whose values are rects, Elements, CSS selectors, or 'parent' or 'self'
         = (object) The current restrictions object or this Interactable
         **
         | interact(element).restrict({
         |     // the rect will be `interact.getElementRect(element.parentNode)`
         |     drag: element.parentNode,
         |
         |     // x and y are relative to the the interactable's origin
         |     resize: { x: 100, y: 100, width: 200, height: 200 }
         | })
         |
         | interact('.draggable').restrict({
         |     // the rect will be the selected element's parent
         |     drag: 'parent',
         |
         |     // do not restrict during normal movement.
         |     // Instead, trigger only one restricted move event
         |     // immediately before the end event.
         |     endOnly: true,
         |
         |     // https://github.com/taye/interact.js/pull/72#issue-41813493
         |     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
         | });
        \*/
        restrict: function (options) {
            if (!isObject(options)) {
                return this.setOptions('restrict', options);
            }

            var actions = ['drag', 'resize', 'gesture'],
                ret;

            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];

                if (action in options) {
                    var perAction = extend({
                            actions: [action],
                            restriction: options[action]
                        }, options);

                    ret = this.setOptions('restrict', perAction);
                }
            }

            return ret;
        },

        /*\
         * Interactable.context
         [ method ]
         *
         * Gets the selector context Node of the Interactable. The default is `window.document`.
         *
         = (Node) The context Node of this Interactable
         **
        \*/
        context: function () {
            return this._context;
        },

        _context: document,

        /*\
         * Interactable.ignoreFrom
         [ method ]
         *
         * If the target of the `mousedown`, `pointerdown` or `touchstart`
         * event or any of it's parents match the given CSS selector or
         * Element, no drag/resize/gesture is started.
         *
         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to not ignore any elements
         = (string | Element | object) The current ignoreFrom value or this Interactable
         **
         | interact(element, { ignoreFrom: document.getElementById('no-action') });
         | // or
         | interact(element).ignoreFrom('input, textarea, a');
        \*/
        ignoreFrom: function (newValue) {
            if (trySelector(newValue)) {            // CSS selector to match event.target
                this.options.ignoreFrom = newValue;
                return this;
            }

            if (isElement(newValue)) {              // specific element
                this.options.ignoreFrom = newValue;
                return this;
            }

            return this.options.ignoreFrom;
        },

        /*\
         * Interactable.allowFrom
         [ method ]
         *
         * A drag/resize/gesture is started only If the target of the
         * `mousedown`, `pointerdown` or `touchstart` event or any of it's
         * parents match the given CSS selector or Element.
         *
         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to allow from any element
         = (string | Element | object) The current allowFrom value or this Interactable
         **
         | interact(element, { allowFrom: document.getElementById('drag-handle') });
         | // or
         | interact(element).allowFrom('.handle');
        \*/
        allowFrom: function (newValue) {
            if (trySelector(newValue)) {            // CSS selector to match event.target
                this.options.allowFrom = newValue;
                return this;
            }

            if (isElement(newValue)) {              // specific element
                this.options.allowFrom = newValue;
                return this;
            }

            return this.options.allowFrom;
        },

        /*\
         * Interactable.element
         [ method ]
         *
         * If this is not a selector Interactable, it returns the element this
         * interactable represents
         *
         = (Element) HTML / SVG Element
        \*/
        element: function () {
            return this._element;
        },

        /*\
         * Interactable.fire
         [ method ]
         *
         * Calls listeners for the given InteractEvent type bound globally
         * and directly to this Interactable
         *
         - iEvent (InteractEvent) The InteractEvent object to be fired on this Interactable
         = (Interactable) this Interactable
        \*/
        fire: function (iEvent) {
            if (!(iEvent && iEvent.type) || !contains(eventTypes, iEvent.type)) {
                return this;
            }

            var listeners,
                i,
                len,
                onEvent = 'on' + iEvent.type,
                funcName = '';

            // Interactable#on() listeners
            if (iEvent.type in this._iEvents) {
                listeners = this._iEvents[iEvent.type];

                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
                    funcName = listeners[i].name;
                    listeners[i](iEvent);
                }
            }

            // interactable.onevent listener
            if (isFunction(this[onEvent])) {
                funcName = this[onEvent].name;
                this[onEvent](iEvent);
            }

            // interact.on() listeners
            if (iEvent.type in globalEvents && (listeners = globalEvents[iEvent.type]))  {

                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
                    funcName = listeners[i].name;
                    listeners[i](iEvent);
                }
            }

            return this;
        },

        /*\
         * Interactable.on
         [ method ]
         *
         * Binds a listener for an InteractEvent or DOM event.
         *
         - eventType  (string | array | object) The types of events to listen for
         - listener   (function) The function to be called on the given event(s)
         - useCapture (boolean) #optional useCapture flag for addEventListener
         = (object) This Interactable
        \*/
        on: function (eventType, listener, useCapture) {
            var i;

            if (isString(eventType) && eventType.search(' ') !== -1) {
                eventType = eventType.trim().split(/ +/);
            }

            if (isArray(eventType)) {
                for (i = 0; i < eventType.length; i++) {
                    this.on(eventType[i], listener, useCapture);
                }

                return this;
            }

            if (isObject(eventType)) {
                for (var prop in eventType) {
                    this.on(prop, eventType[prop], listener);
                }

                return this;
            }

            if (eventType === 'wheel') {
                eventType = wheelEvent;
            }

            // convert to boolean
            useCapture = useCapture? true: false;

            if (contains(eventTypes, eventType)) {
                // if this type of event was never bound to this Interactable
                if (!(eventType in this._iEvents)) {
                    this._iEvents[eventType] = [listener];
                }
                else {
                    this._iEvents[eventType].push(listener);
                }
            }
            // delegated event for selector
            else if (this.selector) {
                if (!delegatedEvents[eventType]) {
                    delegatedEvents[eventType] = {
                        selectors: [],
                        contexts : [],
                        listeners: []
                    };

                    // add delegate listener functions
                    for (i = 0; i < documents.length; i++) {
                        events.add(documents[i], eventType, delegateListener);
                        events.add(documents[i], eventType, delegateUseCapture, true);
                    }
                }

                var delegated = delegatedEvents[eventType],
                    index;

                for (index = delegated.selectors.length - 1; index >= 0; index--) {
                    if (delegated.selectors[index] === this.selector
                        && delegated.contexts[index] === this._context) {
                        break;
                    }
                }

                if (index === -1) {
                    index = delegated.selectors.length;

                    delegated.selectors.push(this.selector);
                    delegated.contexts .push(this._context);
                    delegated.listeners.push([]);
                }

                // keep listener and useCapture flag
                delegated.listeners[index].push([listener, useCapture]);
            }
            else {
                events.add(this._element, eventType, listener, useCapture);
            }

            return this;
        },

        /*\
         * Interactable.off
         [ method ]
         *
         * Removes an InteractEvent or DOM event listener
         *
         - eventType  (string | array | object) The types of events that were listened for
         - listener   (function) The listener function to be removed
         - useCapture (boolean) #optional useCapture flag for removeEventListener
         = (object) This Interactable
        \*/
        off: function (eventType, listener, useCapture) {
            var i;

            if (isString(eventType) && eventType.search(' ') !== -1) {
                eventType = eventType.trim().split(/ +/);
            }

            if (isArray(eventType)) {
                for (i = 0; i < eventType.length; i++) {
                    this.off(eventType[i], listener, useCapture);
                }

                return this;
            }

            if (isObject(eventType)) {
                for (var prop in eventType) {
                    this.off(prop, eventType[prop], listener);
                }

                return this;
            }

            var eventList,
                index = -1;

            // convert to boolean
            useCapture = useCapture? true: false;

            if (eventType === 'wheel') {
                eventType = wheelEvent;
            }

            // if it is an action event type
            if (contains(eventTypes, eventType)) {
                eventList = this._iEvents[eventType];

                if (eventList && (index = indexOf(eventList, listener)) !== -1) {
                    this._iEvents[eventType].splice(index, 1);
                }
            }
            // delegated event
            else if (this.selector) {
                var delegated = delegatedEvents[eventType],
                    matchFound = false;

                if (!delegated) { return this; }

                // count from last index of delegated to 0
                for (index = delegated.selectors.length - 1; index >= 0; index--) {
                    // look for matching selector and context Node
                    if (delegated.selectors[index] === this.selector
                        && delegated.contexts[index] === this._context) {

                        var listeners = delegated.listeners[index];

                        // each item of the listeners array is an array: [function, useCaptureFlag]
                        for (i = listeners.length - 1; i >= 0; i--) {
                            var fn = listeners[i][0],
                                useCap = listeners[i][1];

                            // check if the listener functions and useCapture flags match
                            if (fn === listener && useCap === useCapture) {
                                // remove the listener from the array of listeners
                                listeners.splice(i, 1);

                                // if all listeners for this interactable have been removed
                                // remove the interactable from the delegated arrays
                                if (!listeners.length) {
                                    delegated.selectors.splice(index, 1);
                                    delegated.contexts .splice(index, 1);
                                    delegated.listeners.splice(index, 1);

                                    // remove delegate function from context
                                    events.remove(this._context, eventType, delegateListener);
                                    events.remove(this._context, eventType, delegateUseCapture, true);

                                    // remove the arrays if they are empty
                                    if (!delegated.selectors.length) {
                                        delegatedEvents[eventType] = null;
                                    }
                                }

                                // only remove one listener
                                matchFound = true;
                                break;
                            }
                        }

                        if (matchFound) { break; }
                    }
                }
            }
            // remove listener from this Interatable's element
            else {
                events.remove(this._element, eventType, listener, useCapture);
            }

            return this;
        },

        /*\
         * Interactable.set
         [ method ]
         *
         * Reset the options of this Interactable
         - options (object) The new settings to apply
         = (object) This Interactable
        \*/
        set: function (options) {
            if (!isObject(options)) {
                options = {};
            }

            this.options = extend({}, defaultOptions.base);

            var i,
                actions = ['drag', 'drop', 'resize', 'gesture'],
                methods = ['draggable', 'dropzone', 'resizable', 'gesturable'],
                perActions = extend(extend({}, defaultOptions.perAction), options[action] || {});

            for (i = 0; i < actions.length; i++) {
                var action = actions[i];

                this.options[action] = extend({}, defaultOptions[action]);

                this.setPerAction(action, perActions);

                this[methods[i]](options[action]);
            }

            var settings = [
                    'accept', 'actionChecker', 'allowFrom', 'deltaSource',
                    'dropChecker', 'ignoreFrom', 'origin', 'preventDefault',
                    'rectChecker', 'styleCursor'
                ];

            for (i = 0, len = settings.length; i < len; i++) {
                var setting = settings[i];

                this.options[setting] = defaultOptions.base[setting];

                if (setting in options) {
                    this[setting](options[setting]);
                }
            }

            return this;
        },

        /*\
         * Interactable.unset
         [ method ]
         *
         * Remove this interactable from the list of interactables and remove
         * it's drag, drop, resize and gesture capabilities
         *
         = (object) @interact
        \*/
        unset: function () {
            events.remove(this._element, 'all');

            if (!isString(this.selector)) {
                events.remove(this, 'all');
                if (this.options.styleCursor) {
                    this._element.style.cursor = '';
                }
            }
            else {
                // remove delegated events
                for (var type in delegatedEvents) {
                    var delegated = delegatedEvents[type];

                    for (var i = 0; i < delegated.selectors.length; i++) {
                        if (delegated.selectors[i] === this.selector
                            && delegated.contexts[i] === this._context) {

                            delegated.selectors.splice(i, 1);
                            delegated.contexts .splice(i, 1);
                            delegated.listeners.splice(i, 1);

                            // remove the arrays if they are empty
                            if (!delegated.selectors.length) {
                                delegatedEvents[type] = null;
                            }
                        }

                        events.remove(this._context, type, delegateListener);
                        events.remove(this._context, type, delegateUseCapture, true);

                        break;
                    }
                }
            }

            this.dropzone(false);

            interactables.splice(indexOf(interactables, this), 1);

            return interact;
        }
    };

    function warnOnce (method, message) {
        var warned = false;

        return function () {
            if (!warned) {
                window.console.warn(message);
                warned = true;
            }

            return method.apply(this, arguments);
        };
    }

    Interactable.prototype.snap = warnOnce(Interactable.prototype.snap,
         'Interactable#snap is deprecated. See the new documentation for snapping at http://interactjs.io/docs/snapping');
    Interactable.prototype.restrict = warnOnce(Interactable.prototype.restrict,
         'Interactable#restrict is deprecated. See the new documentation for resticting at http://interactjs.io/docs/restriction');
    Interactable.prototype.inertia = warnOnce(Interactable.prototype.inertia,
         'Interactable#inertia is deprecated. See the new documentation for inertia at http://interactjs.io/docs/inertia');
    Interactable.prototype.autoScroll = warnOnce(Interactable.prototype.autoScroll,
         'Interactable#autoScroll is deprecated. See the new documentation for autoScroll at http://interactjs.io/docs/#autoscroll');
    Interactable.prototype.squareResize = warnOnce(Interactable.prototype.squareResize,
         'Interactable#squareResize is deprecated. See http://interactjs.io/docs/#resize-square');

    Interactable.prototype.accept = warnOnce(Interactable.prototype.accept,
         'Interactable#accept is deprecated. use Interactable#dropzone({ accept: target }) instead');
    Interactable.prototype.dropChecker = warnOnce(Interactable.prototype.dropChecker,
         'Interactable#dropChecker is deprecated. use Interactable#dropzone({ dropChecker: checkerFunction }) instead');
    Interactable.prototype.context = warnOnce(Interactable.prototype.context,
         'Interactable#context as a method is deprecated. It will soon be a DOM Node instead');

    /*\
     * interact.isSet
     [ method ]
     *
     * Check if an element has been set
     - element (Element) The Element being searched for
     = (boolean) Indicates if the element or CSS selector was previously passed to interact
    \*/
    interact.isSet = function(element, options) {
        return interactables.indexOfElement(element, options && options.context) !== -1;
    };

    /*\
     * interact.on
     [ method ]
     *
     * Adds a global listener for an InteractEvent or adds a DOM event to
     * `document`
     *
     - type       (string | array | object) The types of events to listen for
     - listener   (function) The function to be called on the given event(s)
     - useCapture (boolean) #optional useCapture flag for addEventListener
     = (object) interact
    \*/
    interact.on = function (type, listener, useCapture) {
        if (isString(type) && type.search(' ') !== -1) {
            type = type.trim().split(/ +/);
        }

        if (isArray(type)) {
            for (var i = 0; i < type.length; i++) {
                interact.on(type[i], listener, useCapture);
            }

            return interact;
        }

        if (isObject(type)) {
            for (var prop in type) {
                interact.on(prop, type[prop], listener);
            }

            return interact;
        }

        // if it is an InteractEvent type, add listener to globalEvents
        if (contains(eventTypes, type)) {
            // if this type of event was never bound
            if (!globalEvents[type]) {
                globalEvents[type] = [listener];
            }
            else {
                globalEvents[type].push(listener);
            }
        }
        // If non InteractEvent type, addEventListener to document
        else {
            events.add(document, type, listener, useCapture);
        }

        return interact;
    };

    /*\
     * interact.off
     [ method ]
     *
     * Removes a global InteractEvent listener or DOM event from `document`
     *
     - type       (string | array | object) The types of events that were listened for
     - listener   (function) The listener function to be removed
     - useCapture (boolean) #optional useCapture flag for removeEventListener
     = (object) interact
     \*/
    interact.off = function (type, listener, useCapture) {
        if (isString(type) && type.search(' ') !== -1) {
            type = type.trim().split(/ +/);
        }

        if (isArray(type)) {
            for (var i = 0; i < type.length; i++) {
                interact.off(type[i], listener, useCapture);
            }

            return interact;
        }

        if (isObject(type)) {
            for (var prop in type) {
                interact.off(prop, type[prop], listener);
            }

            return interact;
        }

        if (!contains(eventTypes, type)) {
            events.remove(document, type, listener, useCapture);
        }
        else {
            var index;

            if (type in globalEvents
                && (index = indexOf(globalEvents[type], listener)) !== -1) {
                globalEvents[type].splice(index, 1);
            }
        }

        return interact;
    };

    /*\
     * interact.enableDragging
     [ method ]
     *
     * Deprecated.
     *
     * Returns or sets whether dragging is enabled for any Interactables
     *
     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
     = (boolean | object) The current setting or interact
    \*/
    interact.enableDragging = warnOnce(function (newValue) {
        if (newValue !== null && newValue !== undefined) {
            actionIsEnabled.drag = newValue;

            return interact;
        }
        return actionIsEnabled.drag;
    }, 'interact.enableDragging is deprecated and will soon be removed.');

    /*\
     * interact.enableResizing
     [ method ]
     *
     * Deprecated.
     *
     * Returns or sets whether resizing is enabled for any Interactables
     *
     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
     = (boolean | object) The current setting or interact
    \*/
    interact.enableResizing = warnOnce(function (newValue) {
        if (newValue !== null && newValue !== undefined) {
            actionIsEnabled.resize = newValue;

            return interact;
        }
        return actionIsEnabled.resize;
    }, 'interact.enableResizing is deprecated and will soon be removed.');

    /*\
     * interact.enableGesturing
     [ method ]
     *
     * Deprecated.
     *
     * Returns or sets whether gesturing is enabled for any Interactables
     *
     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
     = (boolean | object) The current setting or interact
    \*/
    interact.enableGesturing = warnOnce(function (newValue) {
        if (newValue !== null && newValue !== undefined) {
            actionIsEnabled.gesture = newValue;

            return interact;
        }
        return actionIsEnabled.gesture;
    }, 'interact.enableGesturing is deprecated and will soon be removed.');

    interact.eventTypes = eventTypes;

    /*\
     * interact.debug
     [ method ]
     *
     * Returns debugging data
     = (object) An object with properties that outline the current state and expose internal functions and variables
    \*/
    interact.debug = function () {
        var interaction = interactions[0] || new Interaction();

        return {
            interactions          : interactions,
            target                : interaction.target,
            dragging              : interaction.dragging,
            resizing              : interaction.resizing,
            gesturing             : interaction.gesturing,
            prepared              : interaction.prepared,
            matches               : interaction.matches,
            matchElements         : interaction.matchElements,

            prevCoords            : interaction.prevCoords,
            startCoords           : interaction.startCoords,

            pointerIds            : interaction.pointerIds,
            pointers              : interaction.pointers,
            addPointer            : listeners.addPointer,
            removePointer         : listeners.removePointer,
            recordPointer        : listeners.recordPointer,

            snap                  : interaction.snapStatus,
            restrict              : interaction.restrictStatus,
            inertia               : interaction.inertiaStatus,

            downTime              : interaction.downTimes[0],
            downEvent             : interaction.downEvent,
            downPointer           : interaction.downPointer,
            prevEvent             : interaction.prevEvent,

            Interactable          : Interactable,
            interactables         : interactables,
            pointerIsDown         : interaction.pointerIsDown,
            defaultOptions        : defaultOptions,
            defaultActionChecker  : defaultActionChecker,

            actionCursors         : actionCursors,
            dragMove              : listeners.dragMove,
            resizeMove            : listeners.resizeMove,
            gestureMove           : listeners.gestureMove,
            pointerUp             : listeners.pointerUp,
            pointerDown           : listeners.pointerDown,
            pointerMove           : listeners.pointerMove,
            pointerHover          : listeners.pointerHover,

            eventTypes            : eventTypes,

            events                : events,
            globalEvents          : globalEvents,
            delegatedEvents       : delegatedEvents,

            prefixedPropREs       : prefixedPropREs
        };
    };

    // expose the functions used to calculate multi-touch properties
    interact.getPointerAverage = pointerAverage;
    interact.getTouchBBox     = touchBBox;
    interact.getTouchDistance = touchDistance;
    interact.getTouchAngle    = touchAngle;

    interact.getElementRect         = getElementRect;
    interact.getElementClientRect   = getElementClientRect;
    interact.matchesSelector        = matchesSelector;
    interact.closest                = closest;

    /*\
     * interact.margin
     [ method ]
     *
     * Deprecated. Use `interact(target).resizable({ margin: number });` instead.
     * Returns or sets the margin for autocheck resizing used in
     * @Interactable.getAction. That is the distance from the bottom and right
     * edges of an element clicking in which will start resizing
     *
     - newValue (number) #optional
     = (number | interact) The current margin value or interact
    \*/
    interact.margin = warnOnce(function (newvalue) {
        if (isNumber(newvalue)) {
            margin = newvalue;

            return interact;
        }
        return margin;
    },
    'interact.margin is deprecated. Use interact(target).resizable({ margin: number }); instead.') ;

    /*\
     * interact.supportsTouch
     [ method ]
     *
     = (boolean) Whether or not the browser supports touch input
    \*/
    interact.supportsTouch = function () {
        return supportsTouch;
    };

    /*\
     * interact.supportsPointerEvent
     [ method ]
     *
     = (boolean) Whether or not the browser supports PointerEvents
    \*/
    interact.supportsPointerEvent = function () {
        return supportsPointerEvent;
    };

    /*\
     * interact.stop
     [ method ]
     *
     * Cancels all interactions (end events are not fired)
     *
     - event (Event) An event on which to call preventDefault()
     = (object) interact
    \*/
    interact.stop = function (event) {
        for (var i = interactions.length - 1; i >= 0; i--) {
            interactions[i].stop(event);
        }

        return interact;
    };

    /*\
     * interact.dynamicDrop
     [ method ]
     *
     * Returns or sets whether the dimensions of dropzone elements are
     * calculated on every dragmove or only on dragstart for the default
     * dropChecker
     *
     - newValue (boolean) #optional True to check on each move. False to check only before start
     = (boolean | interact) The current setting or interact
    \*/
    interact.dynamicDrop = function (newValue) {
        if (isBool(newValue)) {
            //if (dragging && dynamicDrop !== newValue && !newValue) {
                //calcRects(dropzones);
            //}

            dynamicDrop = newValue;

            return interact;
        }
        return dynamicDrop;
    };

    /*\
     * interact.pointerMoveTolerance
     [ method ]
     * Returns or sets the distance the pointer must be moved before an action
     * sequence occurs. This also affects tolerance for tap events.
     *
     - newValue (number) #optional The movement from the start position must be greater than this value
     = (number | Interactable) The current setting or interact
    \*/
    interact.pointerMoveTolerance = function (newValue) {
        if (isNumber(newValue)) {
            pointerMoveTolerance = newValue;

            return this;
        }

        return pointerMoveTolerance;
    };

    /*\
     * interact.maxInteractions
     [ method ]
     **
     * Returns or sets the maximum number of concurrent interactions allowed.
     * By default only 1 interaction is allowed at a time (for backwards
     * compatibility). To allow multiple interactions on the same Interactables
     * and elements, you need to enable it in the draggable, resizable and
     * gesturable `'max'` and `'maxPerElement'` options.
     **
     - newValue (number) #optional Any number. newValue <= 0 means no interactions.
    \*/
    interact.maxInteractions = function (newValue) {
        if (isNumber(newValue)) {
            maxInteractions = newValue;

            return this;
        }

        return maxInteractions;
    };

    interact.createSnapGrid = function (grid) {
        return function (x, y) {
            var offsetX = 0,
                offsetY = 0;

            if (isObject(grid.offset)) {
                offsetX = grid.offset.x;
                offsetY = grid.offset.y;
            }

            var gridx = Math.round((x - offsetX) / grid.x),
                gridy = Math.round((y - offsetY) / grid.y),

                newX = gridx * grid.x + offsetX,
                newY = gridy * grid.y + offsetY;

            return {
                x: newX,
                y: newY,
                range: grid.range
            };
        };
    };

    function endAllInteractions (event) {
        for (var i = 0; i < interactions.length; i++) {
            interactions[i].pointerEnd(event, event);
        }
    }

    function listenToDocument (doc) {
        if (contains(documents, doc)) { return; }

        var win = doc.defaultView || doc.parentWindow;

        // add delegate event listener
        for (var eventType in delegatedEvents) {
            events.add(doc, eventType, delegateListener);
            events.add(doc, eventType, delegateUseCapture, true);
        }

        if (PointerEvent) {
            if (PointerEvent === win.MSPointerEvent) {
                pEventTypes = {
                    up: 'MSPointerUp', down: 'MSPointerDown', over: 'mouseover',
                    out: 'mouseout', move: 'MSPointerMove', cancel: 'MSPointerCancel' };
            }
            else {
                pEventTypes = {
                    up: 'pointerup', down: 'pointerdown', over: 'pointerover',
                    out: 'pointerout', move: 'pointermove', cancel: 'pointercancel' };
            }

            events.add(doc, pEventTypes.down  , listeners.selectorDown );
            events.add(doc, pEventTypes.move  , listeners.pointerMove  );
            events.add(doc, pEventTypes.over  , listeners.pointerOver  );
            events.add(doc, pEventTypes.out   , listeners.pointerOut   );
            events.add(doc, pEventTypes.up    , listeners.pointerUp    );
            events.add(doc, pEventTypes.cancel, listeners.pointerCancel);

            // autoscroll
            events.add(doc, pEventTypes.move, listeners.autoScrollMove);
        }
        else {
            events.add(doc, 'mousedown', listeners.selectorDown);
            events.add(doc, 'mousemove', listeners.pointerMove );
            events.add(doc, 'mouseup'  , listeners.pointerUp   );
            events.add(doc, 'mouseover', listeners.pointerOver );
            events.add(doc, 'mouseout' , listeners.pointerOut  );

            events.add(doc, 'touchstart' , listeners.selectorDown );
            events.add(doc, 'touchmove'  , listeners.pointerMove  );
            events.add(doc, 'touchend'   , listeners.pointerUp    );
            events.add(doc, 'touchcancel', listeners.pointerCancel);

            // autoscroll
            events.add(doc, 'mousemove', listeners.autoScrollMove);
            events.add(doc, 'touchmove', listeners.autoScrollMove);
        }

        events.add(win, 'blur', endAllInteractions);

        try {
            if (win.frameElement) {
                var parentDoc = win.frameElement.ownerDocument,
                    parentWindow = parentDoc.defaultView;

                events.add(parentDoc   , 'mouseup'      , listeners.pointerEnd);
                events.add(parentDoc   , 'touchend'     , listeners.pointerEnd);
                events.add(parentDoc   , 'touchcancel'  , listeners.pointerEnd);
                events.add(parentDoc   , 'pointerup'    , listeners.pointerEnd);
                events.add(parentDoc   , 'MSPointerUp'  , listeners.pointerEnd);
                events.add(parentWindow, 'blur'         , endAllInteractions );
            }
        }
        catch (error) {
            interact.windowParentError = error;
        }

        // prevent native HTML5 drag on interact.js target elements
        events.add(doc, 'dragstart', function (event) {
            for (var i = 0; i < interactions.length; i++) {
                var interaction = interactions[i];

                if (interaction.element
                    && (interaction.element === event.target
                        || nodeContains(interaction.element, event.target))) {

                    interaction.checkAndPreventDefault(event, interaction.target, interaction.element);
                    return;
                }
            }
        });

        if (events.useAttachEvent) {
            // For IE's lack of Event#preventDefault
            events.add(doc, 'selectstart', function (event) {
                var interaction = interactions[0];

                if (interaction.currentAction()) {
                    interaction.checkAndPreventDefault(event);
                }
            });

            // For IE's bad dblclick event sequence
            events.add(doc, 'dblclick', doOnInteractions('ie8Dblclick'));
        }

        documents.push(doc);
    }

    listenToDocument(document);

    function indexOf (array, target) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === target) {
                return i;
            }
        }

        return -1;
    }

    function contains (array, target) {
        return indexOf(array, target) !== -1;
    }

    function matchesSelector (element, selector, nodeList) {
        if (ie8MatchesSelector) {
            return ie8MatchesSelector(element, selector, nodeList);
        }

        // remove /deep/ from selectors if shadowDOM polyfill is used
        if (window !== realWindow) {
            selector = selector.replace(/\/deep\//g, ' ');
        }

        return element[prefixedMatchesSelector](selector);
    }

    function matchesUpTo (element, selector, limit) {
        while (isElement(element)) {
            if (matchesSelector(element, selector)) {
                return true;
            }

            element = parentElement(element);

            if (element === limit) {
                return matchesSelector(element, selector);
            }
        }

        return false;
    }

    // For IE8's lack of an Element#matchesSelector
    // taken from http://tanalin.com/en/blog/2012/12/matches-selector-ie8/ and modified
    if (!(prefixedMatchesSelector in Element.prototype) || !isFunction(Element.prototype[prefixedMatchesSelector])) {
        ie8MatchesSelector = function (element, selector, elems) {
            elems = elems || element.parentNode.querySelectorAll(selector);

            for (var i = 0, len = elems.length; i < len; i++) {
                if (elems[i] === element) {
                    return true;
                }
            }

            return false;
        };
    }

    // requestAnimationFrame polyfill
    (function() {
        var lastTime = 0,
            vendors = ['ms', 'moz', 'webkit', 'o'];

        for(var x = 0; x < vendors.length && !realWindow.requestAnimationFrame; ++x) {
            reqFrame = realWindow[vendors[x]+'RequestAnimationFrame'];
            cancelFrame = realWindow[vendors[x]+'CancelAnimationFrame'] || realWindow[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!reqFrame) {
            reqFrame = function(callback) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!cancelFrame) {
            cancelFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());

    /* global exports: true, module, define */

    // http://documentcloud.github.io/underscore/docs/underscore.html#section-11
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = interact;
        }
        exports.interact = interact;
    }
    // AMD
    else if (typeof define === 'function' && define.amd) {
        define('interact', function() {
            return interact;
        });
    }
    else {
        realWindow.interact = interact;
    }

} (typeof window === 'undefined'? undefined : window));
});

var interact$1 = (interact && typeof interact === 'object' && 'default' in interact ? interact['default'] : interact);
var interact = interact.interact;

function drag(Parent) {
  function dragMoveListener(event) {
    var target = event.target,

    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.msTransform = target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  };
  interact$1('.drop-target').dropzone({
    accept: '.draggable',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,
    ondrop: function (event) {
      let d = parseInt(event.relatedTarget.getAttribute('rel'));
      let t = parseInt(event.target.getAttribute('rel'));
      Parent.currentAnswer[d] = t;
    },
    ondragleave: function (event) {
      let d = parseInt(event.relatedTarget.getAttribute('rel'));
      Parent.currentAnswer[d] = -1;
    }
  });
  interact$1('.draggable').draggable({
    inertia: true,
    restrict: {
      restriction: document.getElementById('dragWrapper'),
      endOnly: true,
      elementRect: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
    },
    autoScroll: true,
    onmove: dragMoveListener,
    onend: function (event) {
      Parent.calculatePoints();
    }
  });
}

let ui_title = document.querySelector('#quizTitle');
let ui_subtitle = document.querySelector('#quizSubTitle');
let ui_btn_next = document.querySelector('#btn_quiz_next');
let ui_no = document.querySelector('#no_quiz');
let ui_wrappers = document.querySelectorAll('ul.quiz');

let currentQuiz = 0;
let player = null;
let currentPoints = -1;

class Quiz {
	constructor(parentPlayer, api, callbacks) {
		player = parentPlayer;
		this.no = 0;
		this.chapter = 0;
		this.type = "select";
		this.currentAnswer = [];
		currentPoints = -1;
		let self = this;
		for (var k = 0; k < 25; k += 1) {
			let wrapper = ui_wrappers[k];
			var cls = ui_wrappers[k].className;
			if (dom.hasClass(wrapper, 'select')) {
				var lis = wrapper.querySelectorAll('li');
				for (var i = 0, n = lis.length; i < n; i += 1) {
					lis[i].index = i;
					lis[i].addEventListener('click', function () {
						if (this.className == "select") {
							this.className = "";
							var index = self.currentAnswer.indexOf(this.index);
							if (index > -1) {
								self.currentAnswer.splice(index, 1);
							}
						} else {
							if (self.currentAnswer.indexOf(this.index) == -1) {
								self.currentAnswer.push(this.index);
							}
							this.className = "select";
						}
						self.currentAnswer.sort();
						self.calculatePoints();
					});
				}
			} else {
				new drag(this);
			}
		}

		ui_btn_next.addEventListener('click', () => {
			if (this.currentAnswer.length > 0 && currentPoints > -1) {

				//
				//SEND QUIZ DATA TO SERVER
				//get the question number and the points of it
				api.save(this.no, currentPoints);
				//
				//

				this.no += 1;
				this.currentAnswer = [];
				currentQuiz += 1;
				if (!settings.quizData[this.chapter][currentQuiz]) {
					currentQuiz = 0;
					this.chapter += 1;
					if (settings.cuepoints_show_btn_quiz[this.chapter]) {
						var t = settings.cuepoints_show_btn_quiz[this.chapter].start;
						player.currentTime(t - 2 - settings.delayAutoOpenQuizz);
					} else {
						player.currentTime(player.duration() - 0.2);
						callbacks.end();
					}
					callbacks.next();
				} else {
					var chapterTime = settings.cuepoints_show_btn_quiz[this.chapter].end - settings.cuepoints_show_btn_quiz[this.chapter].start - settings.delayAutoOpenQuizz;
					var chapterQuestions = settings.quizData[this.chapter].length;
					var timestamp = settings.cuepoints_show_btn_quiz[this.chapter].start + currentQuiz / chapterQuestions * chapterTime;
					player.currentTime(timestamp);
					this.show(currentQuiz);
				}
			}
		});
	}
	show(i) {
		dom.addClass(ui_btn_next, "disabled");
		player.currentTime(settings.quizData[this.chapter][currentQuiz].start);
		ui_title.innerHTML = settings.quizData[this.chapter][currentQuiz].title[0];
		ui_subtitle.innerHTML = settings.quizData[this.chapter][currentQuiz].title[1];
		ui_no.innerHTML = this.no;
		for (var k = 0; k < 25; k += 1) {
			if (this.no - 1 != k) {
				ui_wrappers[k].style.display = 'none';
			} else {
				if (dom.hasClass(ui_wrappers[k], 'select')) this.type = 'select';
				if (dom.hasClass(ui_wrappers[k], 'match')) this.type = 'match';
				ui_wrappers[k].style.display = 'block';
			}
		}
	}
	disableBtnNext() {
		currentPoints = -1;
		dom.addClass(ui_btn_next, "disabled");
	}
	enableBtnNext() {
		dom.removeClass(ui_btn_next, "disabled");
	}
	calculatePoints() {
		currentPoints = -1;
		var r = settings.quizData[this.chapter][currentQuiz].r;
		var cr = this.currentAnswer;
		var n = r.length;
		var nc = cr.length;
		if (this.type === "match") {
			var no_correct = 0;
			if (nc != n) {
				this.disableBtnNext();
				return;
			}
			for (var i = 0; i < nc; i += 1) {
				if (cr[i] == -1 || cr[i] == undefined) {
					no_correct = 0;
					this.disableBtnNext();
					return;
				} else {
					if (cr[i] == r[i]) no_correct += 1;
					this.enableBtnNext();
				}
			}
			if (no_correct >= Math.round(n / 2)) {
				currentPoints = 0.5;
			} else {
				currentPoints = 0;
			}
			if (no_correct == n) currentPoints = 1;
		} else {
			var correct = [];
			currentPoints = 0;
			if (nc == n || settings.quizData[this.chapter][currentQuiz].all) {
				for (var i = 0; i < n; i += 1) {
					for (var j = 0; j < cr.length; j += 1) {
						if (r.indexOf(cr[j]) != -1) {
							correct[j] = 1;
						} else {
							correct[j] = 0;
						}
					}
				}
				var t = correct.reduce(function (a, b) {
					return a + b;
				}, 0);
				if (t >= Math.round(n / 2)) currentPoints = 0.5;
				if (t == n) currentPoints = 1;
			}
			if (nc < 1) {
				this.disableBtnNext();
			} else {
				this.enableBtnNext();
			}
		}
	}
}

let initFullscreenBtn = function (pp) {
	if (device.isIos || !pp.supportsFullScreen) {
		return;
	}
	var fs = pp.widget({
		x: settings.player.videoWidth - 58,
		y: 10,
		width: 48,
		height: 48
	});
	var fullScreenBtn = document.getElementById('fullScreenBtn');
	fullScreenBtn.addEventListener('click', function () {
		try {
			fullScreenBtn.blur();
		} catch (e) {}
		pp.toggleFullScreen();
	});

	pp.on('enterFullScreen', function () {
		pp.addClass(fullScreenBtn, 'exit');
	});
	pp.on('exitFullScreen', function () {
		pp.removeClass(fullScreenBtn, 'exit');
	});
	fs.content(fullScreenBtn);
};

let btnQuiz = document.querySelector('#openQuiz');

class App extends Kumullus {
	constructor() {
		super(settings.player);
	}
	init() {
		// logo
		let logo = this.widget({
			x: 20,
			y: 20,
			width: 100,
			height: 100
		});
		logo.content(document.querySelector('#logo'));
		// header
		let _header = document.querySelector('#hero');
		let title = _header.querySelector('h1');
		let subtitle = _header.querySelector('h2');
		let header = this.widget({
			x: 20,
			y: 200,
			width: 1240,
			height: 200
		});
		header.content(_header);

		//fs button
		initFullscreenBtn(this);

		//popupQuiz
		let popup = this.popupContainer({
			width: "80%",
			height: "70%",
			visible: false,
			header: false
		});
		popup.setFontSize(60);
		popup.body.backgroundColor('#fff', 1);
		popup.content(document.getElementById('quizz'));
		popup.on('show', function () {
			header.hide();
		});
		popup.on('hide', function () {
			header.show();
		});

		//init quizSystem;
		let quiz = new Quiz(this, {
			//api
			save: function (quiz, points) {
				console.log(quiz, points);
			}
		}, {
			end: () => {
				setTimeout(function () {
					header.hide();
				}, 500);
				this.pause();
			},
			next: () => {
				popup.hide();
			}
		});

		//initChapters
		let progressDivs = [];

		this.once('loadedmetadata', function () {
			for (var k in settings.chapters) {
				var chapter = settings.chapters[k];
				chapter.content = document.createElement('div');
				var label = document.createElement('span');
				label.innerHTML = settings.controlSeekBarSpeed[k].label;
				var progress = document.createElement('div');
				progress.className = 'progress';
				chapter.content.appendChild(progress);
				chapter.content.appendChild(label);
				progressDivs.push(progress);
				var cp = this.cuepoints.add(chapter);
				cp.el.index = k;
			}
			for (var k in settings.controlSeekBarSpeed) {
				var sbs = settings.controlSeekBarSpeed[k];
				sbs.on = {
					start: function (t, l, current) {
						return function () {
							title.innerHTML = t;
							subtitle.innerHTML = l;
							for (var kk in progressDivs) {
								if (kk < current) progressDivs[kk].style.width = 100 + "%";
								if (kk > current) progressDivs[kk].style.width = 0;
							}
						};
					}(sbs.title[0], sbs.title[1], parseInt(k)),
					process: function (kk, start, end) {
						var pEl = progressDivs[kk];
						return function (t) {
							if (start <= t && t <= end) {
								var w = Math.round((t - start) / (end - start) * 100);
								if (w >= 99) w = 100;
								pEl.style.width = w + "%";
							}
						};
					}(parseInt(k), sbs.start, sbs.end)
				};
				this.cuepoints.add(sbs);
			}
			for (var k in settings.cuepoints_show_btn_quiz) {
				var cp_quiz_show = settings.cuepoints_show_btn_quiz[k];
				cp_quiz_show.on = {
					start: function (c, q) {
						return function () {
							quiz.chapter = c;
							quiz.no = q;
							dom.addClass(btnQuiz, 'show');
						};
					}(cp_quiz_show.chapter, cp_quiz_show.quizNo),
					end: function () {
						dom.removeClass(btnQuiz, 'show');
					}
				};
				this.cuepoints.add(cp_quiz_show);
				var autoShowQuizCpSettings = cp_quiz_show;
				autoShowQuizCpSettings.start += settings.delayAutoOpenQuizz;
				autoShowQuizCpSettings.on = {
					start: function () {
						if (!popup.visible()) {
							quiz.show(0);
							popup.show();
						}
					}
				};
				this.cuepoints.add(autoShowQuizCpSettings);
			}
			this.emit('resize');
		});

		btnQuiz.addEventListener('click', function () {
			if (this.className == 'btn show') {
				quiz.show(0);
				popup.show();
			}
		});
	}
}

var index = (function () {
	let app = new App();
})();

export default index;