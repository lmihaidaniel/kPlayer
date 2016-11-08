import __style__ from './index.sss';
import kmlPlayer from '../lib/index';
import controlsWidget from '../lib/core/ui/ControlsWidget/index';
import Timeline from '../lib/core/timeline/index';

let player = new kmlPlayer({
	video: "https://kumullus.com/wp-content/themes/kumullus-official-theme/assets/videos/kumullus.mp4"
}, function() {
	
	//Player logo widget
	this.logo = this.widget({
		x: 35,
		y: 10,
		width: 40,
		height: 80
	}, document.getElementById('logo'));

	//Player control widget
	this.controlsWidget = player.addComponent(controlsWidget);

	//Player timeline
	this.timeline = player.addComponent(Timeline, {
		chapters: [{
			start: 0,
			end: 26,
			label: 'Intro'
		}, {
			start: 26,
			end: 52,
			label: 'Middle'
		}, {
			start: 52,
			label: 'Outro'
		}]
	});

});
if (process.env.NODE_ENV === "development") {
	window.player = player;
}