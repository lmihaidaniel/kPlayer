import __style__ from './controlsWidget.sss';
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
		let size = parentPlayer.videoHeight()/2.5;
		let temp = deepmerge(defaults, {
			x: parentPlayer.videoWidth() - size/2,
			y: (parentPlayer.videoHeight() - size)/2,
			width : size,
			height: size
		});
		let widget = parentPlayer.widget(deepmerge(temp, options));
		let widget_template = document.getElementById('controls-widget');
		widget.content(widget_template);
		this.el = widget;

		// let menu_languages = widget_template.querySelector('.languages');
		// let close_languages = widget_template.querySelector('.close');
		// let btn_languages = menu_languages.querySelectorAll('svg');
		// let fn_reset_btn_actives = function(){
		// 	for(var i = 0, n = btn_languages.length; i<n; i+=1){
		// 		removeClass(btn_languages[i], 'active');
		// 	}	
		// }

		// close_languages.addEventListener('click', function(){
		// 	removeClass(menu_languages, 'active');
		// 	this.style.display = 'none';
		// });

		//language related
		// for(var i = 0, n = btn_languages.length; i<n; i+=1){
		// 	let btn = btn_languages[i];
		// 	btn.addEventListener('click', function(){
		// 		if(!hasClass(menu_languages, 'active')){
		// 			addClass(menu_languages, 'active');
		// 			close_languages.style.display = 'block';
		// 		}else{
		// 			let lng = this.getAttribute('rel');
		// 			parentPlayer.emit('language', lng);
		// 			fn_reset_btn_actives();
		// 			addClass(this, 'active');
		// 			removeClass(menu_languages, 'active');
		// 			close_languages.style.display = 'none';
		// 		}
		// 	});
		// }
		
		let btn_subtitle = widget_template.querySelector('.subtitle');
		btn_subtitle = widget_template.querySelector('.subtitle');
		btn_subtitle.addEventListener('click', function(){
			let t = hasClass(this,'active');
			parentPlayer.emit('toggle_subtitle', !t);
		});
		parentPlayer.on('subtitle_visible', function(t){
			if(t){
				addClass(btn_subtitle,'active');
			}else{
				removeClass(btn_subtitle,'active');
			}
		});

		//volume related
		let btn_volume = widget_template.querySelector('.vol');
		let v = parentPlayer.volume();
		parentPlayer.on('volumechange', function() {
			let v = this.volume();
			removeClass(btn_volume,'default');
			removeClass(btn_volume,'mute');
			removeClass(btn_volume,'middle');
			removeClass(btn_volume,'off');
			if (this.muted()) {
				addClass(btn_volume,'mute');
				return;
			}
			if (v == 0) {
				addClass(btn_volume,'off');
				return;
			}
			if (v < .5) {
				addClass(btn_volume,'middle');
			} else {
				addClass(btn_volume,'default');
			}
		});
		if(!parentPlayer.device.isIos){
			btn_volume.addEventListener('click', function(){
				if(parentPlayer.volume() > 0) {
					v = parentPlayer.volume();
					parentPlayer.volume(0);
				}else{
					parentPlayer.volume(v);
				}
			});
		}

		//fullscreen related
		let btn_fullscreen = widget_template.querySelector('.fs');
		
		if(!parentPlayer.supportsFullScreen){
			btn_fullscreen.style.opacity = 0.2;
			btn_fullscreen.style.cursor = "not-allowed";
		}

		parentPlayer.on('enterFullScreen', function() {
			removeClass(btn_fullscreen, 'default');
			addClass(btn_fullscreen, 'active');
		});
		parentPlayer.on('exitFullScreen', function() {
			removeClass(btn_fullscreen, 'active');
			addClass(btn_fullscreen, 'default');
		});
		btn_fullscreen.addEventListener('click', () => {
			parentPlayer.toggleFullScreen();
		})
	}
}