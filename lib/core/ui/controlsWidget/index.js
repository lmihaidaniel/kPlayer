import __style__ from './controlsWidget.sss';
import deepmerge from '../../../helpers/deepmerge';
import {hasClass, addClass, removeClass, toggleClass} from '../../../helpers/dom';
let defaults = {
	visible: true,
	x: 860,
	y: 170,
	width: 200,
	height: 200,
	url: ""
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