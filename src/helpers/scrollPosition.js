export default function() {
	let x = 0;
	let y = 0;
	this.save = function() {
		x = window.pageXOffset || 0;
		y = window.pageYOffset || 0;
	}
	this.restore = function() {
		window.scrollTo(x, y)
	}
}