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

export default {};