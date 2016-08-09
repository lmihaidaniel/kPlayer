import {toSeconds,trim} from './utils';
export default function(data) {
	if (!data) return [];
	var cache = data.split(/\r|\n|\r\n/);
	var ret = [],
		block = {};
	for (var i = 0, len = cache.length; i < len; i++) {
		var o = cache[i];
		if (block.start === undefined && block.end === undefined) {
			var m = o.split('-->');
			if (m.length > 1) {
				block.start = toSeconds(m[0]);
				block.end = toSeconds(m[1]);
			}
			continue;
		}
		var content = trim(o);
		if (content === '') {
			if (block.text) {
				block.text = block.text.join('<br/>');
				ret.push(block);
			}
			block = {};
		} else {
			if (!block.text) block.text = [];
			block.text.push(content);
		}
	}
	return ret;
};