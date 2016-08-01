import settings from './config';
import device from '../lib/helpers/device';
import dom from '../lib/helpers/dom';
import Kumullus from '../lib/index';
import Timeline from '../lib/core/timeline/timeline';

export default class App extends Kumullus {
	constructor() {
		super(settings.player, Timeline);
	}
	init() {
		this.once('loadedmetadata', () => {
			this.emit('resize');
		});
		let logo = this.widget(settings.logo);
		logo.content(document.querySelector('#logo'));

		this.emit('resize');

		//testing onlgy
		window.app = this;
	}
}