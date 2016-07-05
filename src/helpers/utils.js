export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export function trim(string) {
	return string.replace(/^\s+|\s+$/gm, '')
}

export function debounce(fn, delay) {
	var t
	return function() {
		clearTimeout(t)
		t = setTimeout(fn, delay)
	}
}
export function getPercentage(current, max) {
	if (current === 0 || max === 0 || isNaN(current) || isNaN(max)) {
		return 0;
	}
	return ((current / max) * 100).toFixed(2);
}

export function getRandBinaryfunction() {
	return Math.floor(Math.random() * 2);
}

export function toSeconds(t) {
	var s = 0.0;
	if (t) {
		var p = t.split(':');
		for (var i = 0; i < p.length; i++)
			s = s * 60 + parseFloat(p[i].replace(',', '.'))
	}
	return s;
}

export function autoLineHeight(el){
	let l = el.offsetHeight + "px";
	el.style.lineHeight = l;
	return l;
}

export function scaleFont(f, width, el) {
	var r = false, l = false;
	if(f.units != 'px') f.units = 'em';
	if (f.min !== false && f.ratio !== false) {
		r = f.ratio * width / 1000;
		if (r < f.min) r = f.min;
		if (f.units == 'px') r = Math.ceil(r);
		if (!isNaN(f.lineHeight) && f.lineHeight) {
			l = r * f.lineHeight;
			if (l < 1) l = 1;
			l = +l.toFixed(3) + f.units;
		}
		r = +r.toFixed(3) + f.units;
	}
	if(el){
		if(r) el.style.fontSize = r;
		if(l) el.style.lineHeight = l;
	}
	return {fontSize: r, lineHeight: l};
};

export default {};