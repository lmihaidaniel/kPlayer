import Player from './core/index';

class Kumullus {
	constructor(settings){
		this.player = new Player(settings, this.init);
	}
	init(){
		console.log('init app');
	}
}

export default Kumullus;