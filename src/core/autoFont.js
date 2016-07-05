import {scaleFont, debounce} from '../helpers/utils';
import deepmerge from '../helpers/deepmerge';
let autoFont = function(el, _width, font) {
	let data = null;
	let _enabled = false;
	let applyNewFont = function(){
		data = scaleFont(font, _width());
		if(data.fontSize) el.style.fontSize = data.fontSize;
		if(data.lineHeight) el.style.lineHeight = data.lineHeight;
	}
	let _update = function(){
		debounce(function(){
			applyNewFont();
		},100)();
	}
	this.update = function(v) {
		if(v !== undefined){
			font = deepmerge(font, v);
			console.log(font);
			applyNewFont();
		}
	};
	this.enabled =  function(v) {
		if (typeof v === 'boolean') {
			_enabled = v;
			v ? (window.addEventListener('resize', _update, false), applyNewFont()) : window.removeEventListener('resize', _update, false);
		}
		return _enabled;;
	};
}
export default autoFont;