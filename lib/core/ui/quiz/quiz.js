import __style__ from './quiz.sss';
import {
	hasClass,
	addClass,
	removeClass,
	toggleClass,
	createElement,
	emptyElement
} from '../../../helpers/dom';
import deepmerge from '../../../helpers/deepmerge';
import {isFunction} from '../../../helpers/utils';
let noOp = function() {};
let defaults = {
	fontSize: 60,
	overlayColor: 'rgba(0,0,0)',
	backgroundColor: 'rgba(255,255,255)',
	labelBtn: {
		validate: 'validate',
		close: 'close'
	},
	closeBtn: false
}
let answered = false;
let hasFeedback = false;
let feedback = noOp;
let onValidate = noOp;
let onNext = noOp;
let onClose = noOp;
export default class Quiz {
	constructor(parentPlayer, options) {
		this.settings = deepmerge(defaults, options);
		let quiz_template = document.getElementById('quizz');
		this.player = parentPlayer;
		let popup = parentPlayer.popupContainer({
			visible: false,
			width: "90%",
			height: "80%",
			header: false
		});
		popup.setFontSize(this.settings.fontSize || 60);
		popup.backgroundColor(this.settings.overlayColor || 'rgba(0,0,0)', .8);
		popup.body.backgroundColor(this.settings.backgroundColor || "rgba(255,255,255)", 1);
		popup.content(quiz_template);
		popup.closeBtn = popup.body.querySelector('.closePopupBtn');
		if(popup.closeBtn){
			popup.closeBtn.addEventListener('click', ()=>{
				let fn = onClose.bind(this);
				fn(this.data, this.btn);
				this.hide();
			});
			if(options.closeBtn){
				popup.closeBtn.style.display = 'block';
			}else{
				popup.closeBtn.style.display = 'none';
			}
		}

		this.popup = popup;
		this._title = quiz_template.querySelector('.head h1');
		this._no = quiz_template.querySelector('.no .quiz_no');
		this._body = quiz_template.querySelector('.quiz_holder');
		this.btn = quiz_template.querySelector('.btn_validate');
		let btn_label = this.btn.querySelector('span');
		this.btn.label = (v) => {
			if (v) {
				btn_label.innerHTML = v;
			}
		}
		this.btn.label(this.settings.labelBtn.validate);
		this.data = [];

		this.btn.addEventListener('click', () => {
			if (hasClass(this.btn, 'disabled')) {
				return;
			}
			if (answered) {
				let fn = onNext.bind(this);
				fn(this.data, this.btn);
			}else{
				answered = true;
				addClass(this._body, 'checked');
				if(hasFeedback){
					feedback();
					onValidate.bind(this)(this.data, this.btn);
				}else{
					onValidate.bind(this)(this.data, this.btn);
					onNext.bind(this)(this.data, this.btn);
				}
			}
		})
	}
	reset() {
		answered = false;
		hasFeedback = false;
		this._body.className = "quiz_holder";
		this.data = [];
		// onValidate = noOp;
		// onNext = noOp;
		// onClose = noOp;
		emptyElement(this._body);
		addClass(this.btn, 'disabled');
		this.btn.label(this.settings.labelBtn.validate);
	}
	load(settings = {}) {
		this.reset();
		this.title(settings.q);
		let answers = settings.a;
		let unique = settings.r.length;
		let body = createElement('ul', {
			class: "quiz select"
		});
		if (unique > 1) {
			addClass(body, 'multiple');
		}
		let n = answers.length;
		let _lis = [];

		function resetLis(el) {
			for (var k in _lis) {
				let k_el = _lis[k];
				if (k_el !== el) {
					removeClass(k_el, 'select');
				}
			}
		}
		for (let k = 0; k < n; k += 1) {
			let answer = answers[k];
			let li = createElement('li');
			_lis.push(li);
			if (answer.img) {
				addClass(body, 'images');
				let img = createElement('img');
				img.src = answer.img;
				li.appendChild(img);
			} else {
				let label = createElement('span');
				if (answer.label) {
					label.innerHTML = answer.label;
				} else {
					label.innerHTML = (k + 1);
				}
				li.appendChild(label);
			}
			let text = createElement('span', {
				class: "text"
			});
			text.innerHTML = answer.text;
			li.appendChild(text);
			li.rel = k;
			li.addEventListener('click', () => {
				if (answered) {
					return;
				}
				let index = li.rel;
				if (unique === 1) {
					toggleClass(li, 'select');
					resetLis(li);
					this.data[0] = index;
				} else {
					if (hasClass(li, 'select')) {
						var cindex = this.data.indexOf(index);
						if (cindex > -1) {
							this.data.splice(cindex, 1);
						}
						removeClass(li, 'select');
					} else {
						if (this.data.indexOf(index) == -1) {
							this.data.push(index);
						}
						addClass(li, 'select');
					}
				}
				this.data.sort();
				this.toggleValidBtn();
			});
			body.appendChild(li);
		}
		if (settings.f) {
			let p = createElement('p', {
				class: "feedback"
			});
			p.innerHTML = settings.f;
			body.appendChild(p);

			feedback = () => {
				let r = settings.r;
				for (var i = 0, n = _lis.length; i < n; i += 1) {
					for (let k = 0, kk = r.length; k < kk; k += 1) {
						if (r[k] == i) {
							addClass(_lis[i], 'ok');
						} else {
							if (hasClass(_lis[i], 'select')) {
								addClass(_lis[i], 'bad');
							}
						}
					}
				}
				return true;
			};
			hasFeedback = true;
		} else {
			hasFeedback = false;
		}
		this._body.appendChild(body);
		return this;
	}
	validate(fn){
		if(isFunction(fn)) {
			onValidate = fn;
		}else{
			onValidate = noOp;
		}
		return this;
	}
	next(fn){
		if(isFunction(fn)) {
			onNext = fn;
		}else{
			onNext = noOp;
		}
		return this;
	}
	close(fn){
		if(isFunction(fn)) {
			onClose = fn;
		}else{
			onClose = noOp;
		}
		return;
	}
	toggleValidBtn() {
		if (this.data.length > 0) {
			removeClass(this.btn, 'disabled');
		} else {
			addClass(this.btn, 'disabled');
			this.btn.label(this.settings.labelBtn.validate);
		}
	}
	title(v = "") {
		this._title.innerHTML = v;
	}
	no(v = "") {
		this._no.innerHTML = v;
	}
	show() {
		this.player.pause();
		this.popup.show();
	}
	hide() {
		this.popup.hide();
		this.player.play();
	}
}