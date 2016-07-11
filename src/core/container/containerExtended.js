import dom from '../../helpers/dom';
import Container from './container';
export default class containerExtended extends Container{
	constructor(el, opts, ctx, player){
		super(el, opts, ctx, player);
		let header = document.createElement('h1');
		dom.addClass(header, 'header');
		this._title = document.createElement('span');
		header.appendChild(this._title);
		this._closeBtn = document.createElement('a');
		this._closeBtn.innerHTML = "<img src='svg/ic_close.svg'/>";
		dom.addClass(this._closeBtn,'closeBtn');
		this._closeBtn.addEventListener('click', this.hide);
		header.appendChild(this._closeBtn);
		this.body.appendChild(header);
		player.on('resize', ()=>{
			dom.autoLineHeight(header);
		});
	}
	title(v){
		if(v != null){
			this._title.innerHTML = v;
			dom.autoLineHeight(this._title.parentNode);
			return v;
		}
		return this._title.innerHTML;
	}
}