(function(window, videojs) {
    'use strict';
    //toDo isolate global values so they are bounded independently to each parent _player instance
    //fix:: check _player variable that is overwritten by a global variable with the same name
    var defaults = {
            wrapper: false
        },
        defaultsCuepoints = {
            once: false,
            start: 0,
            end: -1,
            onStart: function() {},
            onEnd: function() {},
            onClick: function() {},
            params: {},
            active: 'active',
            inactive: 'inactive',
            className: 'vjs-cuepoint',
            label: false,
            visual: false,
            width: null
        },
        cuepoints,
        classReg = function(c) {
            return new RegExp("(^|\\s+)" + c + "(\\s+|$)");
        };

    // classList support for class management
    // altho to be fair, the api sucks because it won't accept multiple classes at once
    var hasClass, addClass, removeClass;

    if ('classList' in document.documentElement) {
        hasClass = function(elem, c) {
            return elem.classList.contains(c);
        };
        addClass = function(elem, c) {
            c = c.split(' ');
            for(var k in c) elem.classList.add(c[k]);
        };
        removeClass = function(elem, c) {
            elem.classList.remove(c);
        };
    } else {
        hasClass = function(elem, c) {
            return classReg(c).test(elem.className);
        };
        addClass = function(elem, c) {
            if (!hasClass(elem, c)) {
                elem.className = elem.className + ' ' + c;
            }
        };
        removeClass = function(elem, c) {
            elem.className = elem.className.replace(classReg(c), ' ');
        };
    }

    function toggleClass(elem, c) {
        var fn = hasClass(elem, c) ? removeClass : addClass;
        fn(elem, c);
    }

    function Cuepoint(p, o, w) {
        var opts = videojs.mergeOptions(defaultsCuepoints, o);
        this._player = p;
        this.parentWrapper = w;
        this.once = opts['once'];
        this.onceStart = false;
        this.onceEnd = false;
        this.start = opts['start'];
        this.end = opts['end'];
        this.startFn = opts['onStart'];
        this.endFn = opts['onEnd'];
        this.clickFn = opts['onClick'];
        this.params = opts['params'];
        this.fired = false;
        this.active = opts['active'];
        this.inactive = opts['inactive'];
        this.label = opts.label;
        this.className = opts['className'],
            this._vc = false;
        this._width = opts['width'],
            this.addVisual(opts['visual']);
        this.activate();
    }
    Cuepoint.prototype.addVisual = function(visual) {
        var self = this;
        if (!this._vc) {
            if (visual) {
                if (visual instanceof HTMLElement) {
                    this._vc = visual;
                } else if (!!visual) {
                    this._vc = document.createElement('div');
                } else {
                    return;
                }

                if (typeof this.label === 'string') {
                    this._label = document.createElement('span');
                    this._label.innerHTML = this.label;
                    this._vc.appendChild(this._label);
                }

                addClass(this._vc, this.className);
                if (this.start > 0) addClass(this._vc, this.inactive);
                this._vc.style.left = (this.start / this._player.duration() * 100) + '%';
                if (this._width && this.end > 1) this._vc.style.right = (100 - this.end / this._player.duration() * 100) + '%';

                this._vc.addEventListener('click', function() {
                    //self._player.currentTime(self.start);
                    self.clickFn.call(self, self.params);
                });
                if (this.parentWrapper) {
                    this.parentWrapper.appendChild(this._vc);
                }
            }
        }
    }
    Cuepoint.prototype.activateVisual = function(resume) {
        var self = this;
        if (this._vc) {
            if (resume) this.activate();
            this._vc.style.display = "block";
        }
    }
    Cuepoint.prototype.disableVisual = function(suspend) {
        if (this._vc) {
            if (suspend) this.suspend();
            this._vc.style.display = "none";
        }
    }
    Cuepoint.prototype._process = function() {
        var d = this._player.currentTime();

        //Check if current time is between start and end
        if (d >= this.start && (this.end < 0 || d < this.end)) {
            if (this.fired) { //Do nothing if start has already been called
                return;
            }
            if (!this.onceStart) {
                this._start(); //Call start function
                if (this._vc) {
                    if (!hasClass(this._vc, this.active)) {
                        removeClass(this._vc, this.inactive);
                        addClass(this._vc, this.active);
                    }
                }
                if (this.once) {
                    this.onceStart = true;
                }
            }
            this.fired = true;
        } else {
            if (!this.onceEnd) {
                if (this._vc) {
                    if (!hasClass(this._vc, this.inactive)) {
                        removeClass(this._vc, this.active);
                        addClass(this._vc, this.inactive);
                    }
                }
            }
            if (!this.fired) { //Do nothing if end has already been called
                return;
            }
            if (!this.onceEnd) {
                this._end();
                if (this.once) {
                    this.onceEnd = true;
                }
            }
            this.fired = false;
        }
    };
    Cuepoint.prototype.start = 0;
    Cuepoint.prototype.end = -1;
    Cuepoint.prototype._start = function() {
        this.startFn.call(this, this.params);
    };
    Cuepoint.prototype._end = function() {
        this.endFn.call(this, this.params);
    };
    Cuepoint.prototype.activate = function() {
        var self = this;
        if (this.processHandler === undefined) {
            this.processHandler = function() {
                self._process();
            };
        }
        this._player.on('timeupdate', this.processHandler);
    };
    Cuepoint.prototype.suspend = function() {
        this._player.off('timeupdate', this.processHandler);
    };
    Cuepoint.prototype.destroy = function() {
        this._player.off('timeupdate', this.processHandler);
    };

    /**
     * Initialize the plugin.
     * @param options (optional) {object} configuration for the plugin
     */
    cuepoints = function(options) {
        var settings = videojs.mergeOptions(defaults, options),
            _player = this,
            instances = [],
            _wrapper = null;
        var _cuepoints = {};
        _cuepoints.add = function(options) {
            var cp = new Cuepoint(_player, options, _wrapper);
            instances.push(cp);
            return cp;
        };
        _cuepoints.show = function() {
            for (var i = instances.length - 1; i >= 0; i--) {
                if (instances[i]._vc) {
                    instances[i]._vc.style.display = "block";
                }
            };
        };
        _cuepoints.hide = function() {
            for (var i = instances.length - 1; i >= 0; i--) {
                if (instances[i]._vc) {
                    instances[i]._vc.style.display = "none";
                }
            };
        };
        _cuepoints.suspend = function(i) {
            for (var i = instances.length - 1; i >= 0; i--) {
                instances[i].suspend();
            };
        };
        _cuepoints.resume = function(i) {
            //todo fix the state of resume/activate
            for (var i = instances.length - 1; i >= 0; i--) {
                instances[i].activate();
            };
        };
        _cuepoints.destroy = function() {
            for (var i = 0, j = instances.length; i < j; i++) {
                if (instances[i]._vc) {
                    if (_wrapper) _wrapper.removeChild(instances[i]._vc);
                }
                instances[i].destroy();
                instances[i] = null;
            }
            instances = [];
        };
        _cuepoints.wrapper = function(el) {
            var j = instances.length;
            if (_wrapper) {
                for (var i = 0; i < j; i++) {
                    if (instances[i]._vc) {
                        if (_wrapper) _wrapper.removeChild(instances[i]._vc);
                    }
                    instances[i].destroy();
                }
            }
            if (typeof el === 'string') _wrapper = document.querySelector(el);
            if (el instanceof HTMLElement) _wrapper = el;
            if (_wrapper) {
                for (var i = 0; i < j; i++) {
                    if (instances[i]._vc) {
                        if (_wrapper) _wrapper.appendChild(instances[i]._vc);
                    }
                    instances[i].activate();
                }
            }
        };
        _cuepoints.init = function() {
            if (_wrapper) {
                this.destroy();
            } else {
                if (settings.wrapper) {
                    _wrapper = document.querySelector(settings.wrapper);
                } else {
                    if (_player.controlBar) {
                        if (_player.controlBar.el_)
                            _wrapper = _player.controlBar.el_.querySelector('.vjs-progress-control');
                    }
                }
            }
        }

        if (this.cuepoints.add === undefined) {
            _cuepoints.init();
            // this.on('loadedmetadata', function() {
            //     this.cuepoints.destroy();
            // });
            this.cuepoints = _cuepoints;
        }
    };

    // register the plugin
    videojs.plugin('cuepoints', cuepoints);
})(window, window.videojs);