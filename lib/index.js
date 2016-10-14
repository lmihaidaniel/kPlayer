import __style__ from './index.sss';
import Player from './core/index';

class Kumullus {
	constructor(settings, Timeline, timelineOptions = {}){
		this.player = new Player(settings, this.init);
		this.player.initTimeline(Timeline, timelineOptions);
	}
}
export default Kumullus;