export default (function(){
	let scale = 0;
	let bounds = function(el, updateScale) {
		if( updateScale !== undefined) scale = updateScale;
		var data = {
			wrapperWidth: el.offsetWidth,
			wrapperHeight: el.offsetHeight,
			scale: scale || (el.width/el.height),
			width: 0,
			height: 0,
			offsetX: 0,
			offsetY: 0
		}
		data['wrapperScale'] = data.wrapperWidth / data.wrapperHeight;
		if (data.wrapperScale > data.scale) {
			data.height = data.wrapperHeight;
			data.width = data.scale * data.height;
			data.offsetX = (data.wrapperWidth - data.width) / 2;
		} else {
			data.width = data.wrapperWidth;
			data.height = data.width / data.scale;
			data.offsetY = (data.wrapperHeight - data.height) / 2;
		}
		return data;
	}
	return bounds;
})();