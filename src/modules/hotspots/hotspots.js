/*! videojs-overlays - v0.1.0 - 2016-04-28
 * Copyright (c) 2016 Lacatusu Mihai Daniel; Licensed Apache-2.0 */
(function(window, videojs) {
    "use strict";

    var global = {},
        overlay = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            origin: "topLeft",
            start: 0,
            end: -1,
            className: null,
            onShow: null,
            onHide: null,
            onMouseEnter: null,
            onMouseMove: null,
            onMouseLeave: null,
            onClick: null,
            content: null,
            font: {
                min: 1,
                ratio: 1,
                lineHeight: "auto",
                units: "em"
            },
            path: false,
            visible: void 0
        },
        instances = {},
        lastIstance = {},
        classReg = function(className) {
            return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
        },
        getPrefixedStylePropName = function(propName) {
            var domPrefixes = "Webkit Moz ms O".split(" "),
                elStyle = document.documentElement.style;
            if (elStyle[propName] !== undefined) return propName; // Is supported unprefixed
            propName = propName.charAt(0).toUpperCase() + propName.substr(1);
            for (var i = 0; i < domPrefixes.length; i++) {
                if (elStyle[domPrefixes[i] + propName] !== undefined) {
                    return domPrefixes[i] + propName; // Is supported with prefix
                }
            }
        },
        triggerWebkitHardwareAcceleration = function(element) {
            if (stylePrefix.backfaceVisibility && stylePrefix.perspective) {
                element.style[stylePrefix.perspective] = "1000px";
                element.style[stylePrefix.backfaceVisibility] = "hidden";
            }
        },
        translate = function(x, y) {
            return 'translate(' + x + 'px,' + y + 'px)';
        },
        stylePrefix = {
            transform: getPrefixedStylePropName("transform"),
            perspective: getPrefixedStylePropName("perspective"),
            backfaceVisibility: getPrefixedStylePropName("backfaceVisibility"),
        };
    // optimise the availability of transalte3d before using it in production
    // (function() {
    //     var sTranslate3D = "translate3d(0px, 0px, 0px)";
    //     var eTemp = document.createElement("div");
    //     eTemp.style.cssText = stylePrefix.transform + ":" + sTranslate3D + ";"
    //     var rxTranslate = /translate3d\(0px, 0px, 0px\)/g;
    //     var asSupport = eTemp.style.cssText.match(rxTranslate);
    //     if (asSupport !== null && asSupport.length == 1) {
    //         translate = function(x, y) {
    //             return 'translate3d(' + x + 'px,' + y + 'px, 0)';
    //         };
    //     }
    // })();
    var setCenterPoint = function(x, y, w, h, origin) {
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
        },
        _overlay = function(options, player) {
            var o = videojs.mergeOptions(overlay, options),
                bind = function(fn, context) {
                    return function() {
                        return fn.apply(context, arguments);
                    };
                };

            function gId() {
                var id = lastIstance[player.id_].n + "_" + lastIstance[player.id_].i;
                lastIstance[player.id_].i += 1;
                return id;
            }
            if (o["id"] !== undefined) {
                this.id = o["id"];
                for (var k in instances[player.id_]) {
                    if (instances[player.id_][k].id == o["id"]) {
                        this.id = gId();
                        break;
                    }
                }
            } else {
                this.id = gId();
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


            if(o.width === "100%" || o.width === "full"){
                this.width = player.videoWidth();
            }
            if(o.height === "100%" || o.height === "full"){
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
                    for(var k in c)
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
                if (typeof this.content == "string"){
                    this.el_.innerHTML = this.content;
                }
                if (Object.prototype.toString.call(this.content) === "[object Array]"){
                    for(var k in this.content){
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
                for (var k in instances[player.id_]) {
                    if (instances[player.id_][k].id == this.id) {
                        delete instances[player.id_][k];
                        lastIstance[player.id_].i -= 1;
                        break;
                    }
                }
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
        },
        /**
         * Initialize the plugin.
         * @param options (optional) {object} configuration for the plugin
         */
        overlays = function(options) {
            var player = this,
                _wrapper = null,
                requestANFId;
            instances[player.id_] = {};
            lastIstance[player.id_] = {
                    n: "ov",
                    i: 0
            };
            var settings = videojs.mergeOptions(global, options),
                __overlays = {};

            function addOverlay(opts) {
                var ov = new _overlay(opts, player);
                _wrapper.appendChild(ov.el_);
                instances[player.id_][ov.id] = ov;
                return ov;
            };

            function resizeOverlays() {
                if (__overlays.visible) {
                    for (var k in instances[player.id_]) {
                        var ov = instances[player.id_][k];
                        if (!ov.path) {
                            ov.resize();
                        } else {
                            var t = player.currentTime();
                            if (t < ov._pathStart || t > ov._pathEnd) {
                                ov.resize();
                            }
                        }
                        ov.font();
                    }
                }
            };

            function processPaths() {
                if (__overlays.visible) {
                    for (var k in instances[player.id_]) {
                        var dMarker = instances[player.id_][k];
                        var current = player.currentTime();
                        if (current >= dMarker.start && (current <= dMarker.end || dMarker.end === -1)) {
                            if (dMarker.path) {
                                dMarker._show();
                                if (dMarker.visible) {
                                    for (var k = 0; k < dMarker.path.length; k += 1) {
                                        var path = dMarker.path[k];
                                        var start = parseFloat(path.start),
                                            end = parseFloat(path.end),
                                            x = parseFloat(path.x),
                                            y = parseFloat(path.y);
                                        if (current >= start && current <= end) {
                                            if (x && y) {
                                                dMarker.resize({
                                                    x: x,
                                                    y: y
                                                }, undefined);
                                            }
                                        } else {
                                            dMarker.checkRefresh(current);
                                        }
                                    }
                                }
                            } else {
                                dMarker._show();
                            }
                        } else {
                            dMarker._hide();
                        }
                    }
                }
                var animTriggerMarkers = function() {
                    processPaths();
                };
                requestANFId = requestAnimationFrame(animTriggerMarkers);
            };

            __overlays.add = function(opts) {
                var r = null;
                if (opts.constructor === Object) {
                    r = addOverlay(opts);
                }
                if (opts.constructor === Array) {
                    r = [];
                    for (var i in opts) {
                        r.push(addOverlay(opts[i]));
                    }
                }
                this.resumePaths();
                return r;
            };
            __overlays.visible = false;
            __overlays.show = function() {
                if (!this.visible) {
                    this.visible = true;
                    for (var k in instances[player.id_]) {
                        if (!instances[player.id_][k].visible) instances[player.id_][k].trigger('show');
                    }
                    _wrapper.style.display = "block";
                    resizeOverlays();
                }
            };
            __overlays.hide = function() {
                if (this.visible) {
                    this.visible = false;
                    for (var k in instances[player.id_]) {
                        if (instances[player.id_][k].visible) instances[player.id_][k].trigger('hide');
                    }
                    _wrapper.style.display = "none";
                }
            };
            __overlays.destroy = function(ovs) {
                if(ovs){
                    if(typeof ovs === "string"){
                        if(instances[player.id_][ovs]){
                            instances[player.id_][ovs].destroy();
                        }
                    }
                    if(typeof ovs === "object"){
                        for(var k in ovs){
                            if(instances[player.id_][ovs[k]]){
                                instances[player.id_][ovs[k]].destroy();
                            }
                        }
                    }
                }else{
                    while (_wrapper.firstChild) {
                        _wrapper.removeChild(_wrapper.firstChild);
                    }
                    window.removeEventListener("resize", resizeOverlays);
                    cancelAnimationFrame(requestANFId);
                    instances[player.id_] = {};
                    lastIstance[player.id_] = {
                        n: "ov",
                        i: 0
                    };
                }
            };
            __overlays.resumePaths = function() {
                this.suspendPaths();
                processPaths();
            };
            __overlays.suspendPaths = function() {
                cancelAnimationFrame(requestANFId);
            }
            __overlays.el = function() {
                return _wrapper;
            };
            __overlays.init = function() {
                if (_wrapper) {
                    __overlays.destroy();
                } else {
                    if (player.tech_) {
                        if (player.tech_.el_) {
                            _wrapper = document.createElement("div");
                            _wrapper.className = "vjs-overlays";
                            player.el_.insertBefore(_wrapper, player.tech_.el_.nextSibling);
                        }
                    }
                }
                this.show();
                window.addEventListener("resize", resizeOverlays);
            };
            __overlays.instances = function(id) {
                if (id === void 0) {
                    return instances[player.id_];
                } else {
                    return instances[player.id_][id];
                }
            }

            // INVESTIGATE A WAY TO TRIGGER THE AUTOHIDE ONLY WHEN FRAMES NOT CHANGES
            // player.on("waiting", function(){
            //     __overlays.hide();
            // });

            // player.on("playing", function(){
            //     __overlays.show();
            // });

            if (this.overlays.add === undefined) {
                __overlays.init();
                // this.on("loadedmetadata", function() {
                //     this.overlays.destroy();
                // });
                this.overlays = __overlays;
            }
            return __overlays;
        };
    // register the plugin
    videojs.plugin("overlays", overlays);
})(window, window.videojs);