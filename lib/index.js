import Player from './core/index';

class Kumullus {
	constructor(settings, Timeline){
		this.player = new Player(settings, this.init);
		this.player.initTimeline(Timeline);
		//initApp
		this.init.bind(this.player)();
	}
	init(){
		console.log('init app');
	}
}

export default Kumullus;