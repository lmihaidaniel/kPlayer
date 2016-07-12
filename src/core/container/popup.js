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


		//foter
		let footer = document.createElement('div');
		dom.addClass(footer, 'footer');
		this._footer = document.createElement('span');
		footer.appendChild(this._footer);
		this.body.appendChild(footer);

		this.backgroundColor = function(v) {
			if (v != null) {
				overlay.style.backgroundColor = v;
			}
			return overlay.style.backgroundColor;
		}

		//EVENTS
		parentPlayer.on('resize', () => {
			this.emit('resize');
		});
		this.on('resize', () => {
			this.autoLineHeight();
		});
		this.on('show', () => {
			this.autoLineHeight();
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
	footer(v) {
		if (v != null) {
			this._footer.innerHTML = v;
			this.autoLineHeight();
			return v;
		}
		return this._footer.innerHTML;
	}
	autoLineHeight(el) {
		if (el) {
			dom.autoLineHeight(el);
		} else {
			dom.autoLineHeight(this._title.parentNode);
			dom.autoLineHeight(this._footer.parentNode);
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