export let video_duration = 60;
export default {
	player: {
		video: document.querySelector('video'),
		autoplay: true,
		loop: false,
		duration: video_duration,
		fullWindow: true,
		videoWidth: 1280,
		videoHeight: 720,
		font: {
			ratio: 1.2,
			min: .1
		}
	},
	logo: {
		x: 20,
		y: 20,
		width: 168.5,
		height: 125,
		visible: true
	}
}