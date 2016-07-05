import {
	autoLineHeight,
	procentFromString,
	debounce
} from '../../helpers/utils';
import dom from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';

let defaults = {
	x: 0,
	y: 0,
	width: '100%',
	height: '100%',
	fontSize: null,
	lineHeight: null,
	offsetX: 0,
	offsetY: 0,
	originPoint: "topLeft",
	visible: false,
	transform: {
		x: null,
		y: null
	},
	translate: true
}

let adaptiveContainer = function(bounds, setttings, parent) {
	let vault = {
		x: 0,
		y: 0,
		width: '100%',
		height: '100%',
		fontSize: null,
		lineHeight: null
	};
	let domElement = null;
	let settings = deepmerge(defaults, setttings);
	let _active = false;

	let updateDomElement = function() {
		if (_active && domElement) {
			if (vault.width !== null) domElement.style.width = vault.width + "px";
			if (vault.height !== null) domElement.style.height = vault.height + "px";

			if (dom.stylePrefix.transform && settings.translate) {
				let transform = '';
				if (vault.x != null && vault.y != null) {
					transform = 'translate(' + vault.x + 'px,' + vault.y + 'px)';
					domElement.style.left = "auto";
					domElement.style.right = "auto";
					domElement.style.bottom = "auto";
					domElement.style.top = "auto";
				} else {
					if (vault.x != null) {
						domElement.style.left = "auto";
						domElement.style.right = "auto";
						transform = 'translateX(' + vault.x + 'px)';
					}
					if (vault.y != null) {
						domElement.style.bottom = "auto";
						domElement.style.top = "auto";
						transform = 'translateY(' + vault.y + 'px)';
					}
				}
				dom.transform(domElement, transform);
			} else {
				if (vault.x != null && vault.y != null) {
					domElement.style.left = vault.x + "px";
					domElement.style.top = vault.y + "px";
				} else {
					if (vault.x != null) domElement.style.left = vault.x + "px";
					if (vault.y != null) domElement.style.top = vault.y + "px";
				}
			}

			if (settings.fontSize !== vault.fontSize) {
				domElement.style.fontSize = vault.fontSize = settings.fontSize;

			}
			if (settings.lineHeight !== vault.lineHeight) {
				domElement.style.lineHeight = vault.lineHeight = settings.lineHeight;
			}
		}
	}

	let updateProps = function() {
		let b = bounds();

		let procentWidth = procentFromString(settings.width);
		if (procentWidth) {
			vault.width = b.width * procentWidth / 100;
		} else {
			if (settings.width != null) {
				vault.width = b.width * b.scale;
			}
		}

		let procentHeight = procentFromString(settings.height);
		if (procentHeight) {
			vault.height = b.height * procentHeight / 100;
		} else {
			if (settings.height != null) {
				vault.height = b.height * b.scale;
			}
		}

		if (settings.x != null) {
			let procentX = procentFromString(settings.x);
			if(procentX){
				vault.x = b.width * procentX / 100;
			}else{
				vault.x = b.offsetX + settings.x * b.scale;	
			}
			let transformX = procentFromString(settings.transform.x);
			if (transformX) vault.x += transformX * vault.width / 100;
			if (settings.offsetX) vault.x += settings.offsetX;
		}

		if (settings.y != null) {
			let procentY = procentFromString(settings.y);
			if(procentY){
				vault.y = b.height * procentY / 100;
			}else{
				vault.y = b.offsetY + settings.y * b.scale;
			}
			let transformY = procentFromString(settings.transform.y);
			if (transformY) vault.y += transformY * vault.width / 100;
			if (settings.offsetY) vault.y += settings.offsetY;
		}
		
		updateDomElement();
	}

	this.domElement = function(element) {
		if(element){
			domElement = element;
			updateProps();
		}
		return domElement;
	}

	let applyNewProps = function() {
		debounce(function() {
			updateProps();
		}, 100)();
	}

	this.data = function() {
		return vault;
	}

	this.update = function(newSettings) {
		settings = deepmerge(settings, newSettings);
		updateProps();
		return vault;
	}
	this.active = function(v) {
		if (typeof v === 'boolean') {
			_active = v;
			if(v) applyNewProps();
			// v ? window.addEventListener('resize', applyNewProps, false) : window.removeEventListener('resize', applyNewProps, false);
		}
		return _active;
	};

	if(parent.on){
		parent.on('resize', applyNewProps);
	}
}
export default adaptiveContainer;