import settings from './config';
import device from '../lib/helpers/device';
import dom from '../lib/helpers/dom';
import Kumullus from '../lib/index';
import Timeline from '../lib/core/timeline/timeline';
import Chapters from '../lib/core/chapters/chapters';

export default class App extends Kumullus {
	constructor() {
		super(settings.player, Timeline);
	}
	init() {
		this.once('loadedmetadata', () => {
			this.emit('resize');
			new Chapters(this,[
				{start: 0, end: 20, label: 'Intro'}, 
				{start: 20, end: 50, label: 'Something'},
				{start: 50, end: this.duration(), label: 'Outro'}
			]);
		});
		let logo = this.widget(settings.logo);
		logo.content(document.querySelector('#logo'));

		this.emit('resize');

		//testing onlgy
		window.app = this;
	}
}