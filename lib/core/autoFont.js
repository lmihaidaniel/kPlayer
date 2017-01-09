import {scaleFont} from '../helpers/utils';
import deepmerge from '../helpers/deepmerge';

// var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
// var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

let supportsViewPort = false;

(()=>{
	let elem = document.createElement('div');
	elem.style.width = "50vw";
	document.body.appendChild(elem);
	supportsViewPort = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) :elem.currentStyle).width, 10) == parseInt(window.innerWidth / 2, 10);
	document.body.removeChild(elem);
})();

/**
 * TODO replace javascript calculations when viewPort units supported by the browser
 * convert units given in pixels, em, rem to vw 
 * convert units given in vw or vh to em/rem/pixels when viewPort units not supported
 */



let autoFont = function(el, font, parent) {
	let _enabled = false;
	let _cache = 0;
	let _font = {};
	let _update = function(){
		if(_enabled) {
			let w = parent.width();
			if(_cache != w){
				_font = scaleFont(font, parent.width(), el); 
			}
			return _font;
		}
	}
	this.update = function(v) {
		if(v !== undefined){
			if(!font){ font = {ratio: 1, min:1, lineHeight: false} }
			font = deepmerge(font, v);
			return _update();
		}
	};
	this.enabled =  function(v) {
		if (typeof v === 'boolean' && font) {
			_enabled = v;
		}
		return _enabled;
	};
	if(parent.on){
		parent.on('resize', _update);
	};
}
export default autoFont;