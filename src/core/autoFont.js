import {scaleFont, debounce} from '../helpers/utils';
import deepmerge from '../helpers/deepmerge';
let autoFont = function(el, _width, font) {
	let _enabled = false;
	let _update = function(){
		debounce(function(){
			scaleFont(font, _width(), el);
		},100)();
	}
	this.update = function(v) {
		if(v !== undefined){
			if(!font){ font = {ratio: 1, min:1, lineHeight: false} }
			font = deepmerge(font, v);
			return scaleFont(font, _width(), el);
		}
	};
	this.enabled =  function(v) {
		if (typeof v === 'boolean' && font) {
			_enabled = v;
			v ? (window.addEventListener('resize', _update, false), scaleFont(font, _width(), el)) : window.removeEventListener('resize', _update, false);
		}
		return _enabled;;
	};
}
export default autoFont;