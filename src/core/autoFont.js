import {scaleFont} from '../helpers/utils';
import deepmerge from '../helpers/deepmerge';
let autoFont = function(el, font, parent) {
	let _enabled = false;
	let _update = function(){
		scaleFont(font, parent.width(), el);
	}
	this.update = function(v) {
		if(v !== undefined){
			if(!font){ font = {ratio: 1, min:1, lineHeight: false} }
			font = deepmerge(font, v);
			return scaleFont(font, parent.width(), el);
		}
	};
	this.enabled =  function(v) {
		if (typeof v === 'boolean' && font) {
			_enabled = v;
			// v ? (window.addEventListener('resize', _update, false), scaleFont(font, _width(), el)) : window.removeEventListener('resize', _update, false);
		}
		return _enabled;;
	};
	if(parent.on){
		parent.on('resize', _update);
	};
}
export default autoFont;