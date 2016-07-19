import tinycolor from "tinycolor2";

export default function backgroundColor(el) {
	var el = el || this;
	if(!el.style) el.style = {};
	return function(c, a = 0.6){
		var color = tinycolor(c);
		if(color.isValid()){
			color.setAlpha(a);
			el.style.backgroundColor = color.toString();
		}
		return el.style.backgroundColor;
	}
}