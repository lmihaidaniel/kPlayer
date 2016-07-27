import settings from './config';
import device from '../lib/helpers/device';
import dom from '../lib/helpers/dom';
import Kumullus from '../lib/index';
import Quiz from './quiz.js';


let initFullscreenBtn = function(pp) {
	if (device.isIos || !pp.supportsFullScreen) {
		return;
	}
	var fs = pp.widget({
		x: settings.player.videoWidth - 58,
		y: 10,
		width: 48,
		height: 48
	});
	var fullScreenBtn = document.getElementById('fullScreenBtn');
	fullScreenBtn.addEventListener('click', function() {
		try {
			fullScreenBtn.blur();
		} catch (e) {}
		pp.toggleFullScreen();
	});

	pp.on('enterFullScreen', function() {
		pp.addClass(fullScreenBtn, 'exit');
	});
	pp.on('exitFullScreen', function() {
		pp.removeClass(fullScreenBtn, 'exit');
	});
	fs.content(fullScreenBtn);
}

let btnQuiz = document.querySelector('#openQuiz');

export default class App extends Kumullus {
	constructor() {
		super(settings.player);
	}
	init() {
		// logo
		let logo = this.widget({
			x: 20,
			y: 20,
			width: 100,
			height: 100
		});
		logo.content(document.querySelector('#logo'));
		// header
		let _header = document.querySelector('#hero');
		let title = _header.querySelector('h1');
		let subtitle = _header.querySelector('h2');
		let header = this.widget({
			x: 20,
			y: 200,
			width: 1240,
			height: 200
		});
		header.content(_header);

		//fs button
		initFullscreenBtn(this);

		//popupQuiz
		let popup = this.popupContainer({
			width: "80%",
			height: "70%",
			visible: false,
			header: false
		});
		popup.setFontSize(60);
		popup.body.backgroundColor('#fff', 1);
		popup.content(document.getElementById('quizz'));
		popup.on('show', function() {
			header.hide();
		});
		popup.on('hide', function() {
			header.show();
		});

		//init quizSystem;
		let quiz = new Quiz(this,
			{	
				//api
				save: function(quiz, points) {
					console.log(quiz, points);
				}
			}, {
				end: () => {
					setTimeout(function() {
						header.hide();
					}, 500);
					this.pause();
				},
				next: () => {
					popup.hide();
				}
			});

		//initChapters
		let progressDivs = [];

		this.once('loadedmetadata', function() {
			for (var k in settings.chapters) {
				var chapter = settings.chapters[k];
				chapter.content = document.createElement('div');
				var label = document.createElement('span');
				label.innerHTML = settings.controlSeekBarSpeed[k].label;
				var progress = document.createElement('div');
				progress.className = 'progress';
				chapter.content.appendChild(progress);
				chapter.content.appendChild(label);
				progressDivs.push(progress);
				var cp = this.cuepoints.add(chapter);
				cp.el.index = k;
			}
			for (var k in settings.controlSeekBarSpeed) {
				var sbs = settings.controlSeekBarSpeed[k];
				sbs.on = {
					start: (function(t, l, current) {
						return function() {
							title.innerHTML = t;
							subtitle.innerHTML = l;
							for (var kk in progressDivs) {
								if (kk < current) progressDivs[kk].style.width = 100 + "%";
								if (kk > current) progressDivs[kk].style.width = 0;
							}
						}
					})(sbs.title[0], sbs.title[1], parseInt(k)),
					process: (function(kk, start, end) {
						var pEl = progressDivs[kk];
						return function(t) {
							if (start <= t && t <= end) {
								var w = Math.round((t - start) / (end - start) * 100);
								if (w >= 99) w = 100;
								pEl.style.width = w + "%";
							}
						}
					})(parseInt(k), sbs.start, sbs.end),
				}
				this.cuepoints.add(sbs);
			}
			for (var k in settings.cuepoints_show_btn_quiz) {
				var cp_quiz_show = settings.cuepoints_show_btn_quiz[k];
				cp_quiz_show.on = {
					start: (function(c, q) {
						return function() {
							quiz.chapter = c;
							quiz.no = q;
							dom.addClass(btnQuiz, 'show');
						}
					})(cp_quiz_show.chapter, cp_quiz_show.quizNo),
					end: function() {
						dom.removeClass(btnQuiz, 'show');
					}
				};
				this.cuepoints.add(cp_quiz_show);
				var autoShowQuizCpSettings = cp_quiz_show;
				autoShowQuizCpSettings.start += settings.delayAutoOpenQuizz;
				autoShowQuizCpSettings.on = {
					start: function() {
						if (!popup.visible()) {
							quiz.show(0);
							popup.show();
						}
					}
				}
				this.cuepoints.add(autoShowQuizCpSettings);
			}
			this.emit('resize');
		})

		btnQuiz.addEventListener('click', function() {
			if (this.className == 'btn show') {
				quiz.show(0);
				popup.show();
			}
		});
	}
}