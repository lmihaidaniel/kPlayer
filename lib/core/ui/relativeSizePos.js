import deepmerge from '../../helpers/deepmerge';
import {
	procentFromString
} from '../../helpers/utils';
let defaults = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
}
let relativeSizePos = function(ctx, settings) {
	let parentWidth = ctx.videoWidth() || ctx.width || 1;
	let parentHeight = ctx.videoHeight() || ctx.height || 1;
	let o = deepmerge(defaults, settings);
	let _w = procentFromString(o.width);
	if (_w === false) _w = o.width / parentWidth * 100;
	let _h = procentFromString(o.height);
	if (_h === false) _h = o.height / parentHeight * 100;
	let _x = procentFromString(o.x);
	if (_x === false) _x = o.x / parentWidth * 100;
	let _y = procentFromString(o.y);
	if (_y === false) _y = o.y / parentHeight * 100;
	return {
		x: _x,
		y: _y,
		width: _w,
		height: _h 
	}
}
export default relativeSizePos;