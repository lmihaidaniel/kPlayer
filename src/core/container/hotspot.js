import Events from 'eventemitter3';
let setCenterPoint = function(x, y, w, h, origin) {
	var pos = {
		x: x,
		y: y
	};
	switch (origin) {
		case "center":
			pos.x = x - w / 2;
			pos.y = y - h / 2;
			break;
		case "top":
			pos.x = x - w / 2;
			break;
		case "left":
			pos.y = y - h / 2;
			break;
		case "right":
			pos.x = x - w;
			pos.y = y - h / 2;
			break;
		case "topRight":
			pos.x = x - w;
			break;
		case "bottom":
			pos.x = x - w / 2;
			pos.y = y - h;
			break;
		case "bottomLeft":
			pos.y = y - h;
			break;
		case "bottomRight":
			pos.x = x - w;
			pos.y = y - h;
			break;
		default:
			break;
	}
	return pos;
};
let defaults = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	origin: "topLeft",
	start: 0,
	end: -1,
	className: null,
	on: {
		show: function() {},
		hide: function() {},
		mouseEnter: function() {},
		mouseLeave: function() {},
		mouseMove: function() {},
		click: function() {}
	}
	content: null,
	font: {
		size: 100,
		lineHeight: "auto",
		units: "em"
	},
	path: false,
	visible: void 0
}
export default class Hotspot extends Events {
	constructor() {
		super()
	}
}

var _overlay = function(options, player) {
	var o = videojs.mergeOptions(overlay, options),
		bind = function(fn, context) {
			return function() {
				return fn.apply(context, arguments);
			};
		};



	this.x = o.x;
	this.y = o.y;
	this.width = o.width;
	this._width = o.width;
	this.height = o.height;
	this._height = o.height;
	this.start = o.start;
	this.end = o.end;
	this.path = o.path;
	this.origin = o.origin;
	this._pathStart = void 0;
	this._pathEnd = void 0;
	this._refreshStart = 0;
	this._refreshEnd = 0;


	if (o.width === "100%" || o.width === "full") {
		this.width = player.videoWidth();
	}
	if (o.height === "100%" || o.height === "full") {
		this.height = player.videoHeight();
	}

	if (Object.prototype.toString.call(this.path) === "[object Array]") {
		if (this.path[0]['start']) this._pathStart = this.path[0]['start'];
		if (this.path[this.path.length - 1]['end']) this._pathEnd = this.path[this.path.length - 1]['end'];
	} else {
		this.path = false;
	}

	this.checkRefresh = function(t) {
		if (this._pathStart !== undefined && this._pathEnd !== undefined) {
			if (t >= this._pathStart && t <= this._pathEnd) {
				if (this._refreshStart !== 0) this._refreshStart = 0;
				if (this._refreshEnd !== 0) this._refreshEnd = 0;
			} else {
				if (t < this._pathStart && this._refreshStart !== 1) {
					this.resize();
					this._refreshStart = 1;
				}
				if (t > this._pathEnd && this._refreshEnd !== 1) {
					this.resize();
					this._refreshEnd = 1;
				}
			}
		}
	};

	if (o["className"] === Array) {
		o["className"] = "vjs-overlay " + o["className"].join(" ");
	} else if (o["className"] != undefined) {
		o["className"] = "vjs-overlay " + o["className"];
	} else {
		o["className"] = "vjs-overlay";
	}



	if ('classList' in document.documentElement) {
		this.hasClass = function(c) {
			return this.el_.classList.contains(c);
		};
		this.addClass = function(c) {
			c = c.split(' ');
			for (var k in c)
				this.el_.classList.add(c[k]);
		};
		this.removeClass = function(c) {
			this.el_.classList.remove(c);
		};
	} else {
		this.hasClass = function(c) {
			return classReg(c).test(this.el_.className);
		};
		this.addClass = function(c) {
			if (!this.hasClass(c)) {
				this.el_.className = this.el_.className + ' ' + c;
			}
		};
		this.removeClass = function(c) {
			this.el_.className = this.el_.className.replace(classReg(c), ' ');
		};
	}

	this.toggleClass = function(c) {
		if (this.hasClass(c)) {
			this.removeClass(c);
		} else {
			this.addClass(c);
		}
	}

	this.el = function() {
		if (!this.el_) {
			this.el_ = document.createElement("div");
			this.el_.className = o["className"];
			this.el_.style.position = "absolute";
			this.el_.style.top = this.y || 0;
			this.el_.style.left = this.x || 0;
			this.el_.style.width = (this.width || 0) + "px";
			this.el_.style.height = (this.height || 0) + "px";
			if (typeof o["onClick"] == "function") {
				this.el_.addEventListener("click", bind(o["onClick"], this));
			}
		}
		var self = this;
		if (typeof o["onMouseEnter"] === "function") this.el_.addEventListener('mouseenter', function(e) {
			bind(o["onMouseEnter"], self)(e)
		});
		if (typeof o["onMouseLeave"] === "function") this.el_.addEventListener('mouseleave', function(e) {
			bind(o["onMouseLeave"], self)(e)
		});
		if (typeof o["onMouseMove"] === "function") this.el_.addEventListener('mousemove', function(e) {
			bind(o["onMouseMove"], self)(e)
		});
		return this.el_;
	};
	this.el();
	this.content = o["content"];
	if (this.content) {
		if (typeof this.content == "function") {
			var fn = bind(this.content, this);
			this.content = this.content();
			this.el_.appendChild(this.content);
		}
		if (this.content.nodeName) {
			this.el_.appendChild(this.content);
		}
		if (typeof this.content == "string") {
			this.el_.innerHTML = this.content;
		}
		if (Object.prototype.toString.call(this.content) === "[object Array]") {
			for (var k in this.content) {
				if (this.content[k].nodeName) {
					this.el_.appendChild(this.content[k]);
				}
			}
		}
	}

	this.font = function(font) {
		o.font = font || o.font;
		if (o.font && this.visible && player) {
			var p = player.bounds();
			o.font.ratio = o.font.ratio || 1;
			o.font.min = o.font.min || 1;
			var f = o.font.ratio * p.width / 1000;
			if (f < o.font.min) f = o.font.min;
			this.el_.style.fontSize = f + o.font.units;
			if (o.font.lineHeight == null || o.font.lineHeight == undefined || o.font.lineHeight == "auto") {
				this.el_.style.lineHeight = this._height + "px";
			} else {
				if (o.font.lineHeight !== false && !isNaN(o.font.lineHeight)) {
					var l = f * o.font.lineHeight;
					if (l < 1) l = 1;
					this.el_.style.lineHeight = l + o.font.units;
				}
			}
		}
	};

	this.resize = function(o, s) {
		if (this.visible) {
			var p = player.bounds();
			if (o === undefined) o = {
				x: this.x,
				y: this.y
			};
			if (s === undefined) s = {
				width: this.width,
				height: this.height
			};

			var oWidth = s.width * p.width / p.width_org,
				oHeight = s.height * p.height / p.height_org,
				posX = p.offset_x + o.x * p.width / p.width_org,
				posY = p.offset_y + o.y * p.height / p.height_org,
				c = setCenterPoint(posX, posY, oWidth, oHeight, this.origin),
				transform = "";
			posX = c.x;
			posY = c.y;
			this.el_.style.width = oWidth + "px";
			this.el_.style.height = oHeight + "px";
			this._width = oWidth;
			this._height = oHeight;
			if (stylePrefix.transform) {
				transform += translate(posX, posY);
				this.el_.style[stylePrefix.transform] = transform;
				return
			}
			this.el_.style.left = posX + "px";
			this.el_.style.top = posY + "px";
		}
	};

	this.originPoint = function(origin) {
		if (origin != void 0) {
			this.origin = origin;
			this.resize();
		}
		return this.origin;
	};

	var forceHide = false;
	this.hide = function() {
		forceHide = true;
		this._hide();
	};
	this._hide = function() {
		if (this.visible) {
			this.visible = false;
			this.trigger('hide');
			this.el_.style.display = "none";
		}
	};
	this.show = function() {
		forceHide = false;
		this.visible = true;
		this.resize();
		this.font();
		this.el_.style.display = "block";
		this.trigger('show');
	};
	this._show = function() {
		if (!this.visible && !forceHide) {
			this.visible = true;
			this.resize();
			this.font();
			this.el_.style.display = "block";
			this.trigger('show');
		}
	}
	this.trigger = function(a) {
		switch (a) {
			case 'show':
				if (typeof o["onShow"] == "function") bind(o["onShow"], this)();
				break;
			case 'hide':
				if (typeof o["onHide"] == "function") bind(o["onHide"], this)();
				break;
			case 'click':
				if (typeof o["onClick"] == "function") bind(o["onClick"], this)();
				break;
			default:
				return;
		}
	}
	this.destroy = function() {
		this.el_.parentNode.removeChild(this.el_);
		//remove from parent ?
	};
	if (o.start > 0) {
		this.visible = false;
		this.el_.style.display = "none";
	} else {
		this.visible = true;
		this.el_.style.display = "block";
	}
	if (o['visible'] !== void 0) this.visible = o['visible'];
	this.resize();
	this.font();
}