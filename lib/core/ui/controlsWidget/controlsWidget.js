import deepmerge from '../../../helpers/deepmerge';
import {hasClass, addClass, removeClass, toggleClass} from '../../../helpers/dom';
let defaults = {
	visible: true,
	x: 860,
	y: 170,
	width: 200,
	height: 200
};
export default class controlsWidget{
	constructor(parentPlayer, options){
		let temp = deepmerge(defaults, {
			x: parentPlayer.videoWidth() - defaults.width/2,
			y: (parentPlayer.videoHeight() - defaults.height)/2
		});
		let widget = parentPlayer.widget(deepmerge(temp, options));
		let widget_template = document.getElementById('controls-widget');
		widget.content(widget_template);
		this.el = widget;

		let menu_languages = widget_template.querySelector('.languages');
		let close_languages = widget_template.querySelector('.close');
		let btn_languages = menu_languages.querySelectorAll('svg');
		let btn_volume = widget_template.querySelector('.vol');
		let icon_volume = btn_volume.querySelector('use');
		let btn_fullscreen = widget_template.querySelector('.fs');
		let icon_fullscreen = btn_fullscreen.querySelector('use');

		let fn_reset_btn_actives = function(){
			for(var i = 0, n = btn_languages.length; i<n; i+=1){
				removeClass(btn_languages[i], 'active');
			}	
		}

		close_languages.addEventListener('click', function(){
			removeClass(menu_languages, 'active');
			this.style.display = 'none';
		});

		//language related
		for(var i = 0, n = btn_languages.length; i<n; i+=1){
			let btn = btn_languages[i];
			btn.addEventListener('click', function(){
				if(!hasClass(menu_languages, 'active')){
					addClass(menu_languages, 'active');
					close_languages.style.display = 'block';
				}else{
					let lng = this.getAttribute('rel');
					parentPlayer.emit('language', lng);
					fn_reset_btn_actives();
					addClass(this, 'active');
					removeClass(menu_languages, 'active');
					close_languages.style.display = 'none';
				}
			});
		}

		//volume related
		parentPlayer.on('volumechange', function() {
			let v = this.volume();
			if (this.muted()) {
				icon_volume.setAttribute('href', '#volume-mute');
				icon_volume.setAttribute('xlink:href', '#volume-mute');
				return
			} else {
				icon_volume.setAttribute('href', '#volume-on');
				icon_volume.setAttribute('xlink:href', '#volume-on');
			}
			if (v < .5) {
				icon_volume.setAttribute('href', '#volume-middle');
				icon_volume.setAttribute('xlink:href', '#volume-middle');
			} else {
				icon_volume.setAttribute('href', '#volume-on');
				icon_volume.setAttribute('xlink:href', '#volume-on');
			}
			if (v == 0) {
				icon_volume.setAttribute('href', '#volume-off');
				icon_volume.setAttribute('xlink:href', '#volume-off');
			}
		});
		btn_volume.addEventListener('click', () => {
			parentPlayer.toggleMute();
			try {
				btn_volume.blur();
			} catch (e) {}
		});

		//fullscreen related
		parentPlayer.on('enterFullScreen', function() {
			icon_fullscreen.setAttribute('href', '#fullscreen-exit');
			icon_fullscreen.setAttribute('xlink:href', '#fullscreen-exit');
		});
		parentPlayer.on('exitFullScreen', function() {
			icon_fullscreen.setAttribute('href', '#fullscreen');
			icon_fullscreen.setAttribute('xlink:href', '#fullscreen');
		});
		btn_fullscreen.addEventListener('click', () => {
			parentPlayer.toggleFullScreen();
			try {
				btn_sullscreen.blur();
			} catch (e) {}
		})
	}
}