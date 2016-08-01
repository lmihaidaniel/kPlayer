import Events from 'eventemitter3';
import {isString, isFunction} from '../../helpers/utils';
import deepmerge from '../../helpers/deepmerge';
import dom from '../../helpers/dom';
let defaults = {
    once: null,
    start: 0,
    end: -1,
    on: {
        start: function(){},
        end: function(){},
        click: function(){},
        process: function(){}
    },
    className: 'kmlCuepoint',
    classActive: null,
    classInactive: null,
    label: null,
    width: null,
    content: null
}
export default class Cuepoint extends Events{
    constructor(parentPlayer, options, parentWrapper){
        super();
        this.__settings = deepmerge(defaults, options);
        this.__fired = false;
        this.__onceStart = false;
        this.__onceEnd = false;

        this.el = false;
        this.parentPlayer = parentPlayer;
        this.parentWrapper = parentWrapper;
        for(var k in this.__settings['on']){
            if(isFunction(this.__settings['on'][k])){
                this.on(k, this.__settings['on'][k]);
            }
        }
        this.addVisual(this.__settings['content']);
        this.activate();
    }
    processHandler(){
        let d = this.parentPlayer.currentTime();
        this.__settings['on']['process'](d);
        //Check if current time is between start and end
        if (d >= this.__settings['start'] && (this.__settings['end'] < 0 || d < this.__settings['end'])) {
            if (this.__fired) { //Do nothing if start has already been called
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
            if (!this.__fired) { //Do nothing if end has already been called
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
    activate(){
        if(!this.__process){
            this.__process = ()=>{this.processHandler();};
        }
        this.parentPlayer.on('timeupdate', this.__process);
        this.emit('activate');
    }
    suspend(){
        this.parentPlayer.off('timeupdate', this.__process);
        this.emit('suspend');
    }
    destroy(){
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
    addVisual(visual){
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
                dom.addClass(this.el, this.__settings['className']);
                if (this.__settings['start'] > 0) {
                    dom.addClass(this.el, this.__settings['classInactive']);
                    this.el.style.left = Math.round((this.__settings['start'] / this.parentPlayer.duration() * 100)) + '%';
                }
                if (this.__settings['width'] && this.__settings['end'] > 1) {
                    this.el.style.right = Math.round((100 - this.__settings['end'] / this.parentPlayer.duration() * 100)) + '%';
                }

                this.el.addEventListener('click', ()=>{
                    this.emit('click');
                });
                if (this.parentWrapper) {
                    this.parentWrapper.appendChild(this.el);
                }
            }
        }
    }
    activateVisual(resume){
        if (this.el) {
            if (resume) this.activate();
            this.el.style.display = "block";
        }
    }
    disableVisual(suspend){
        if (this.el) {
            if (suspend) this.suspend();
            this.el.style.display = "none";
        }
    }
    addClass(cls){
        if(this.el){
            dom.addClass(this.el, cls);
        }
    }
    removeClass(cls){
       if(this.el){
            dom.removeClass(this.el, cls);
        } 
    }
    toggleClass(cls){
        if(this.el){
            dom.toggleClass(this.el, cls);
        } 
    }
}