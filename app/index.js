import settings from './config';
import device from '../lib/helpers/device';
import dom from '../lib/helpers/dom';
import Kumullus from '../lib/index';
import Timeline from '../lib/core/timeline/timelineOne';
import Chapters from '../lib/core/chapters/chapters';
import controlsWidget from '../lib/core/ui/controlsWidget/controlsWidget';

export default class App extends Kumullus {
	constructor() {
		super(settings.player, Timeline);
	}
	init() {
		this.once('loadedmetadata', () => {
			this.emit('resize');
			this.chapters = new Chapters(this,[
				{start: 0, end: 20, label: 'Intro'}, 
				{start: 20, end: 50, label: 'Something'},
				{start: 50, end: this.duration(), label: 'Outro'}
			]);
			this.cwidget = new controlsWidget(this);
		});

		let logo = this.widget(settings.logo);
		logo.content(document.querySelector('#logo'));

		this.popup = this.popupContainer({className: null});


		//popupVideo
		let popupVideo = this.videoContainer({
			visible: false,
			headerBg: null,
			headerBgAlpha: 0,
			header: true
		});
		popupVideo.setFontSize(60);
		popupVideo.header.backgroundColor('#000', 0);
		popupVideo.body.backgroundColor('#000', 1);

		this.popupVideo = popupVideo;
		this.popupVideo.show();
		this.popupVideo.player.load('http://client.kumullus.com/biocodex/video.mp4');

		this.emit('resize');

		//testing onlgy
		window.app = this;
	}
}