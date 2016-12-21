import './loader.sss';
import {addClass, removeClass, toggleClass, createElement, isEl} from '../../../helpers/dom';

export class Spinner{
	constructor(options = {}){
		this.wrapper = createElement('div', {class: 'spinner'}, createElement('div', {class:'spinner'}));
		if(isEl(options.parent)){
			options.parent.appendChild(this.wrapper);
		}
	}
	show(){
		addClass(this.wrapper, 'show');
	}
	hide(){
		removeClass(this.wrapper, 'show');
	}
}

export default null;