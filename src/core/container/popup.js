import dom from '../../helpers/dom';
import Container from './container';
export default class Popup extends Container {
	constructor(el, opts, ctx, parentPlayer) {
		super(el, opts, ctx, parentPlayer);
		let overlay = dom.createElement('div');
		dom.addClass(overlay, 'overlay triggerClose');
		dom.insertBefore(overlay, this.body);
		//header
		let header = document.createElement('h1');
		dom.addClass(header, 'header');
		this._title = document.createElement('span');
		header.appendChild(this._title);
		this._closeBtn = document.createElement('a');
		this._closeBtn.innerHTML = "<img src='svg/ic_close.svg'/>";
		dom.addClass(this._closeBtn, 'closeBtn');
		this._closeBtn.addEventListener('click', this.hide);
		header.appendChild(this._closeBtn);
		this.body.appendChild(header);
		//end header


		this.backgroundColor = function(v) {
			if (v != null) {
				overlay.style.backgroundColor = v;
			}
			return overlay.style.backgroundColor;
		}

		this.scaleSize = function(s){
			this.config({x: (100-s)/2+"%", y: (100-s)/2+"%", width: s+"%", height: s+"%"});
		}

		//EVENTS
		parentPlayer.on('resize', () => {
			this.emit('resize');
		});

		['resize','config', 'beforeShow'].map((evt)=>{
			this.on(evt, () => {
				console.log(evt);
				this.autoLineHeight();
			});
		});

		let clsElements = dom.selectAll('.triggerClose', el);
		for (var i = 0, n = clsElements.length; i < n; i += 1) {
			clsElements[i].addEventListener('click', this.hide);
		}
	}
	destroy(){
		console.log('popup');
		this.removeAllListeners();
		this.ctx.remove(this.body);
		dom.removeElement(this.body.parentNode);
	}
	
	autoLineHeight(el) {
		if(this.visible()){
			if (el) {
				dom.autoLineHeight(el);
			} else {
				dom.autoLineHeight(this._title.parentNode);
			}
		}
	}
	title(v) {
		if (v != null) {
			this._title.innerHTML = v;
			this.autoLineHeight();
			return v;
		}
		return this._title.innerHTML;
	}
}