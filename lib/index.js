import Player from './core/index';

class Kumullus {
	constructor(settings, Timeline, timelineOptions = {}){
		this.player = new Player(settings, this.init);
		this.player.initTimeline(Timeline, timelineOptions);
		//initApp
		this.init.bind(this.player)();
	}
	init(){
		console.log('init app not overwritten');
	}
}

export default Kumullus;