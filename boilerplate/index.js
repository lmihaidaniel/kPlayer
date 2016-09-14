import Kumullus from '../lib/index';
import Timeline from '../lib/core/timeline/timeline';

export default class App extends Kumullus {
  constructor() {
    super({
    	video: document.querySelector('video')
    }, Timeline);
  }
  init() {
  	window.player = this;
  }
}