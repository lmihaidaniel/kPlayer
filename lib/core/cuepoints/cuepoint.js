import __style__ from './cuepoints.sss';
import Events from 'eventemitter3';
import {
    isString,
    isFunction,
    textSelection
} from '../../helpers/utils';
import deepmerge from '../../helpers/deepmerge';
import {
    addClass,
    removeClass,
    hasClass,
    toggleClass
} from '../../helpers/dom';
let defaults = {
    once: null,
    start: 0,
    end: -1,
    on: {
        start: function() {},
        end: function() {},
        click: function() {},
        process: function() {},
        touchstart: false,
        touchend: false,
        touchmove: false,
        touchleave: false
    },
    className: 'kmlCuepoint',
    classActive: null,
    classInactive: null,
    label: null,
    width: null,
    content: null
}
export default class Cuepoint extends Events {
    constructor(parentPlayer, options, parentWrapper) {
        super();
        this.__settings = deepmerge(defaults, options);
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
    processHandler(d) {
        //Check if current time is between start and end
        if (d >= this.__settings['start'] && (this.__settings['end'] < 0 || d < this.__settings['end'])) {
            if (this.__fired) { //Do nothing if start has already been called
                return;
            }
            this.__fired = true;
            if (!this.__onceStart) {
                this.emit('start'); //Call start function
                if (this.el) {
                    if (!hasClass(this.el, this.__settings['classActive'])) {
                        removeClass(this.el, this.__settings['classInactive']);
                        addClass(this.el, this.__settings['classActive']);
                    }
                }
                if (this.__settings['once']) {
                    this.__onceStart = true;
                }
            }
        } else {
            if (!this.__fired) { //Do nothing if end has already been called
                return;
            }
            this.__fired = false;
            if (!this.__onceEnd) {
                if (this.el) {
                    if (!hasClass(this.el, this.__settings['classInactive'])) {
                        removeClass(this.el, this.__settings['classActive']);
                        addClass(this.el, this.__settings['classInactive']);
                    }
                }
            }
            if (!this.__onceEnd) {
                this.emit('end');
                if (this.__settings['once']) {
                    this.__onceEnd = true;
                }
            }
        }
    }
    activate() {
        this.__tId = true;
        if (!this.__process) {
            this.__process = () => {
                if(this.__tId){ 
                    let t = parseFloat(this.parentPlayer.media.currentTime);
                    this.processHandler(t);
                    this.__settings['on']['process'](t);
                    this.__tIf = requestAnimationFrame(this.__process);
                }
            };
        }
        this.__process();
        //this.parentPlayer.on('timeupdate', this.__process);
        this.emit('activate');
    }
    suspend() {
        this.__tId = false;
        if(this.__tIf) cancelAnimationFrame(this.__tIf);
        //this.parentPlayer.off('timeupdate', this.__process);
        this.emit('suspend');
    }
    destroy() {
        this.suspend();
        if (this.el) {
            this.el.parentNode.removeChild(this.el);
            this.el = null;
        }
        this.emit('destroy');
        this.__fired = false;
    }
    addVisual(visual) {
        if (!this.el) {
            if (visual) {
                if (visual instanceof HTMLElement) {
                    this.el = visual;
                } else if (visual === true) {
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
                let parentPlayer = this.parentPlayer;
                let duration = parentPlayer.duration();
                addClass(this.el, this.__settings['className']);
                if (this.__settings['start'] >= 0) {
                    addClass(this.el, this.__settings['classInactive']);
                    this.el.style.left = Math.ceil((this.__settings['start'] / duration * 100)) + '%';
                }
                if (this.__settings['width']) {
                    if (this.__settings['end'] > -1) {
                        this.el.style.right = Math.floor((100 - this.__settings['end'] / duration * 100)) + '%';
                    } else {
                        this.el.style.right = 0;
                    }
                }
                let insideFlag = 0;
                this.el.addEventListener('click', (e) => {
                    insideFlag = 0;
                    this.emit('click', e);
                });

                //REFACTOR AS A GENERIC MODULE TO CONTROL AND UNIFY TOUCH/MOUSE EVENTS
                this.el.addEventListener('mousedown', (e) => {
                    insideFlag = 1;
                    textSelection.lock();
                    this.emit('touchstart', e);
                });
                this.el.addEventListener('mouseup', (e) => {
                    if (insideFlag) {
                        insideFlag = 0;
                        textSelection.unlock();
                        this.emit('touchend', e);
                    }
                });
                this.el.addEventListener('mousemove', (e) => {
                    if (insideFlag) {
                        this.emit('touchmove', e);
                    } else {
                        return;
                    }
                });
                this.el.addEventListener('mouseout', (e) => {
                    if (insideFlag) {
                        insideFlag = 0;
                        textSelection.unlock();
                        this.emit('touchleave', e);
                    }
                });
                //touch events
                this.el.addEventListener('touchstart', (e) => {
                    insideFlag = 1;
                    textSelection.lock();
                    this.emit('touchstart', e);
                });
                this.el.addEventListener('touchmove', (e) => {
                    if (insideFlag) {
                        this.emit('touchmove', e);
                    } else {
                        insideFlag = 0;
                        return;
                    }
                });
                this.el.addEventListener('touchleave', (e) => {
                    if (insideFlag) {
                        insideFlag = 0;
                        textSelection.unlock();
                        this.emit('touchleave', e);
                    }
                });
                this.el.addEventListener('touchend', (e) => {
                    if (insideFlag) {
                        insideFlag = 0;
                        textSelection.unlock();
                        this.emit('touchend', e);
                    }
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
            addClass(this.el, cls);
        }
    }
    removeClass(cls) {
        if (this.el) {
            removeClass(this.el, cls);
        }
    }
    toggleClass(cls) {
        if (this.el) {
            toggleClass(this.el, cls);
        }
    }
}
