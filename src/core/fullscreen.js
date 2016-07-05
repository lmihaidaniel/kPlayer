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
//supportsFullScreen = false;
export default class Fullscreen extends Events {
    constructor() {
        super();
        this.scrollPosition = new scrollPosition();
        if (!supportsFullScreen) {
            this._fullscreenElement = null;
            this.fullscreenElementStyle = {};
        } else {
            let event = (prefixFS === '') ? 'fullscreenchange' : prefixFS + (prefixFS == 'ms' ? 'fullscreenchange' : 'fullscreenchange');
            let fnFullscreenChange = ()=>{
                if(!this.isFullScreen()){
                    setTimeout(this.scrollPosition.restore,100);
                }
            }
            document.addEventListener(event.toLowerCase(), fnFullscreenChange, false);
        }
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
    requestFullScreen(element) {
        if (typeof element === 'undefined') {
            element = this.wrapper;
        }
        if (supportsFullScreen) {
            this.scrollPosition.save();
            return (prefixFS === '') ? element.requestFullScreen() : element[prefixFS + (prefixFS == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
        } else {
            if (!this.isFullScreen()) {
                this.scrollPosition.save();
                let style = window.getComputedStyle(element);
                this.fullscreenElementStyle['position'] = element.style.position || "";
                this.fullscreenElementStyle['margin'] = element.style.margin || "";
                this.fullscreenElementStyle['top'] = element.style.top || "";
                this.fullscreenElementStyle['left'] = element.style.left || "";
                this.fullscreenElementStyle['width'] = element.style.width || "";
                this.fullscreenElementStyle['height'] = element.style.height || "";
                this.fullscreenElementStyle['zIndex'] = element.style.zIndex || "";

                element.style.position = "absolute";
                element.style.top = element.style.left = 0;
                element.style.margin = 0;
                element.style.width = element.style.height = "100%";
                element.style.zIndex = 2147483647;

                this._fullscreenElement = element;
                this.isFullScreen = function() {
                    return true;
                };
            }
        }
    }
    cancelFullScreen() {
        if (supportsFullScreen) {
            return (prefixFS === '') ? document.cancelFullScreen() : document[prefixFS + (prefixFS == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
        } else {
            if (this.isFullScreen()) {
                for (let k in this.fullscreenElementStyle) {
                    this._fullscreenElement.style[k] = this.fullscreenElementStyle[k];
                }
                this._fullscreenElement = null;
                this.isFullScreen = function() {
                    return false;
                };
                this.scrollPosition.restore();
            }
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