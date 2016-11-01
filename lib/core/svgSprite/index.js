import __style__ from './index.sss';
import {addClass, isEl} from '../../helpers/dom';
import ajax from '../../helpers/ajax';
const svgns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";
export default class svgSprite{
	constructor(){
		this.check();
	}
	create(namespace, parent){
		// Create a <svg> wrapper element
		var ws = document.createElementNS(svgns, "svg");
		// Create a <use> element
		let use = document.createElementNS(svgns, "use");
		// Add an 'href' attribute (using the "xlink" namespace)
		use.setAttributeNS(xlinkns, "href", "#"+namespace);
		ws.appendChild(use);
		if(isEl(parent)){
			addClass(parent,'kml-icon '+namespace);
			parent.appendChild(ws);
		}
		return use;
	}
	check(){
		//check if "#svg-icons" exists. If not use ajax to inject it into the body
		if(document.getElementById('svg-icons') != null){
			return;
		}else{
			ajax().get('assets/kmlPlayer.svg').then(function(r){
				if(document.getElementById('svg-icons') != null) return;
				var c = document.createElement('div');
	            c.setAttribute('hidden', '');
	            c.setAttribute('style', 'display: none;');
	            c.innerHTML = r;
	            document.body.insertBefore(c, document.body.childNodes[0]);
			});
		}
		
	}
}