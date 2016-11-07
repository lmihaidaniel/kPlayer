import Events from 'eventemitter3';
import scrollPosition from '../helpers/scrollPosition';
import {isFunction} from '../helpers/utils';
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
let eventChange = (prefixFS === '') ? 'fullscreenchange' : prefixFS + (prefixFS == 'ms' ? 'fullscreenchange' : 'fullscreenchange');
eventChange = eventChange.toLowerCase();
//supportsFullScreen = false;
export default class Fullscreen extends Events {
    constructor() {
        super();
        this.iframe = null;
        this.scrollPosition = new scrollPosition();
        this._fullscreenElement = null;
        this.fullscreenElementStyle = {};
        this.supportsFullScreen = supportsFullScreen;
        if (this.supportsFullScreen) {
            let fnFullscreenChange = ()=>{
                if(!this.isFullScreen()){
                    setTimeout(this.scrollPosition.restore,100);
                    this.emit('exitFullScreen');
                }else{
                    this.emit('enterFullScreen');
                }
            }
            document.addEventListener(eventChange, fnFullscreenChange, false);
        }
    }
    defualtFullScreenElement(element){
        let el = element;
        if (el == null) {
            if(this.iframe){
                el = this.iframe;
            }else{
                el = this.wrapper;    
            }
        }
        return el;
    }
    onFullscreenChange(evt){
        //investigate if native video fullscreen can be overwritten
        this.media.addEventListener(eventChange, function(e){
            e.preventDefault();
            e.stopPropagation;
            return false;
        }, true);
    }
    isFullWindow(){
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
        }else{
            return this.isFullWindow();
        }
    }
    requestFullWindow(element){
        if(this.__settings){
            if(this.__settings.fullWindow){
                return;
            }
        }
        if (this.isFullWindow()) return;
        this.emit('enterFullScreen');

        //if(this.supportsFullScreen && this.isFullScreen()) return;
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
        this.isFullWindow = function() {
            return true;
        };
    }
    requestFullScreen(element) {
       let el = this.defualtFullScreenElement(element);
        if (this.supportsFullScreen) {
            this.scrollPosition.save();
            let t = (prefixFS === '') ? "requestFullScreen" : prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen');
            if(isFunction(el[t])){
                this.emit('enterFullScreen');

                (prefixFS === '') ? el.requestFullScreen() : el[prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
            }else{
                this.supportsFullScreen = false;
                this.requestFullWindow(el);
            }
        } else {
            this.requestFullWindow(el);
        }
    }
    cancelFullWindow() {
        if(this.__settings){
            if(this.__settings.fullWindow){
                return;
            }
        }
        if (!this.isFullWindow()) return;
        this.emit('exitFullScreen');

        //if(this.supportsFullScreen && this.isFullScreen()) return;
        for (let k in this.fullscreenElementStyle) {
            this._fullscreenElement.style[k] = this.fullscreenElementStyle[k];
        }
        this._fullscreenElement = null;
        this.isFullWindow = function() {
            return false;
        };
        this.scrollPosition.restore();
    }
    cancelFullScreen() {
        if (this.supportsFullScreen) {
            let t = (prefixFS === '') ? "cancelFullScreen" : prefixFS + (prefixFS == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen');
            let el = document;
             if(window.parent || window.top){
                if(window.top) el = window.top.document;
                if(window.parent) el = window.parent.document;
             }
            if(isFunction(el[t])){
                console.log(el);
                this.emit('exitFullScreen');
                (prefixFS === '') ? el.cancelFullScreen() : el[prefixFS + (prefixFS == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
            }else{
                this.supportsFullScreen = false;
                this.cancelFullWindow();
            }

            // return (prefixFS === '') ? document.cancelFullScreen() : document[prefixFS + (prefixFS == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
        } else {
            this.cancelFullWindow();
        }
    }
    toggleFullWindow(element){
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
            return (prefixFS === '') ? document.fullscreenElement : document[prefixFS + 'FullscreenElement'];
        } else {
            return this._fullscreenElement;
        }
    }
};