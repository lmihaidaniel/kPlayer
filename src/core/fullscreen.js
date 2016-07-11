import Events from './media/events/index';
import scrollPosition from '../helpers/scrollPosition';
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
        this.scrollPosition = new scrollPosition();
        this._fullscreenElement = null;
        this.fullscreenElementStyle = {};
        if (supportsFullScreen) {
            let fnFullscreenChange = ()=>{
                if(!this.isFullScreen()){
                    setTimeout(this.scrollPosition.restore,100);
                }
            }
            document.addEventListener(eventChange, fnFullscreenChange, false);
        }
    }
    onFullscreenChange(evt){
        console.log(this.wrapper);
        this.media.addEventListener(eventChange, function(e){
            console.log(e);
            e.preventDefault();
            e.stopPropagation;
            return false;

        }, true);
    }
    isFullWindow(){
        return false;
    }
    isFullScreen(element) {
        if (supportsFullScreen) {
            if (typeof element === 'undefined') {
                element = this.wrapper;
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
    }
    requestFullWindow(element){
        if (this.isFullWindow() || this.isFullScreen()) {
            return;
        }
        if (typeof element === 'undefined') {
            element = this.wrapper;
        }
        this.scrollPosition.save();
        let style = window.getComputedStyle(element);
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
        this.emit('resize');
        this.isFullWindow = function() {
            return true;
        };
    }
    requestFullScreen(element) {
        if (typeof element === 'undefined') {
            element = this.wrapper;
        }
        if (supportsFullScreen) {
            this.scrollPosition.save();
            return (prefixFS === '') ? element.requestFullScreen() : element[prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
        } else {
            this.requestFullWindow(element);
        }
    }
    cancelFullWindow() {
        if (!this.isFullWindow() || this.isFullScreen()) {
            return;
        }
        for (let k in this.fullscreenElementStyle) {
            this._fullscreenElement.style[k] = this.fullscreenElementStyle[k];
        }
        this._fullscreenElement = null;
        this.isFullWindow = function() {
            return false;
        };
        this.emit('resize');
        this.scrollPosition.restore();
    }
    cancelFullScreen() {
        if (supportsFullScreen) {
            return (prefixFS === '') ? document.cancelFullScreen() : document[prefixFS + (prefixFS == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
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
        let isFullscreen = !this.isFullScreen();
        if (isFullscreen) {
            this.requestFullScreen(element);
            //document.body.style.overflow = 'hidden';
        } else {
            this.cancelFullScreen();
            //document.body.style.overflow = '';
        }
    }
    fullscreenElement() {
        if (supportsFullScreen) {
            return (prefixFS === '') ? document.fullscreenElement : document[prefixFS + 'FullscreenElement'];
        } else {
            return this._fullscreenElement;
        }
    }
};