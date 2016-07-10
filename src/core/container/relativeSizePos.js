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
	let parentWidth = ctx.defaultWidth() || ctx.width || 0;
	let parentHeight = ctx.defaultHeight() || ctx.height || 0;
	let o = deepmerge(defaults, settings);
	let _w = procentFromString(o.width);
	if (!_w) _w = o.width / parentWidth * 100;
	let _h = procentFromString(o.height);
	if (!_h) _h = o.height / parentHeight * 100;
	let _x = procentFromString(o.x);
	if (!_x) _x = o.x / parentWidth * 100;
	let _y = procentFromString(o.y);
	if (!_y) _y = o.y / parentHeight * 100;
	return {
		x: _x,
		y: _y,
		width: _w,
		height: _h 
	}
}
export default relativeSizePos;