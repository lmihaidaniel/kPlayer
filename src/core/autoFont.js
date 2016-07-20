import {scaleFont} from '../helpers/utils';
import deepmerge from '../helpers/deepmerge';
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