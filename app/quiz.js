import dragSystem from './drag';
import dom from '../lib/helpers/dom';
import settings from './config';

let ui_title = document.querySelector('#quizTitle');
let ui_subtitle = document.querySelector('#quizSubTitle');
let ui_btn_next = document.querySelector('#btn_quiz_next');
let ui_no = document.querySelector('#no_quiz');
let ui_wrappers = document.querySelectorAll('ul.quiz');

let currentQuiz = 0;
let player = null;
let currentPoints = -1;

export default class Quiz {
	constructor(parentPlayer, api, callbacks) {
		player = parentPlayer;
		this.no = 0;
		this.chapter = 0;
		this.type = "select";
		this.currentAnswer = [];
		currentPoints = -1;
		let self = this;
		for (var k = 0; k < 25; k += 1) {
			let wrapper = ui_wrappers[k];
			var cls = ui_wrappers[k].className;
			if (dom.hasClass(wrapper, 'select')) {
				var lis = wrapper.querySelectorAll('li');
				for (var i = 0, n = lis.length; i < n; i += 1) {
					lis[i].index = i;
					lis[i].addEventListener('click', function(){
						if (this.className == "select") {
							this.className = "";
							var index = self.currentAnswer.indexOf(this.index);
							if (index > -1) {
								self.currentAnswer.splice(index, 1);
							}
						} else {
							if (self.currentAnswer.indexOf(this.index) == -1) {
								self.currentAnswer.push(this.index);
							}
							this.className = "select";
						}
						self.currentAnswer.sort();
						self.calculatePoints();
					});
				}
			} else {
				new dragSystem(this);
			}
		}

		ui_btn_next.addEventListener('click', ()=>{
			if (this.currentAnswer.length > 0 && currentPoints > -1) {
				
				//
				//SEND QUIZ DATA TO SERVER
				//get the question number and the points of it
				api.save(this.no, currentPoints);
				//
				//
				
				this.no += 1;
				this.currentAnswer = [];
				currentQuiz += 1;
				if (!settings.quizData[this.chapter][currentQuiz]) {
					currentQuiz = 0;
					this.chapter += 1;
					if (settings.cuepoints_show_btn_quiz[this.chapter]) {
						var t = settings.cuepoints_show_btn_quiz[this.chapter].start;
						player.currentTime(t - 2 - settings.delayAutoOpenQuizz);
					} else {
						player.currentTime(player.duration() - 0.2);
						callbacks.end();
					}
					callbacks.next();
				} else {
					var chapterTime = settings.cuepoints_show_btn_quiz[this.chapter].end - settings.cuepoints_show_btn_quiz[this.chapter].start - settings.delayAutoOpenQuizz;
					var chapterQuestions = settings.quizData[this.chapter].length;
					var timestamp = settings.cuepoints_show_btn_quiz[this.chapter].start + currentQuiz / chapterQuestions * chapterTime;
					player.currentTime(timestamp);
					this.show(currentQuiz);
				}
			}
		});

	}
	show(i) {
		dom.addClass(ui_btn_next, "disabled");
		player.currentTime(settings.quizData[this.chapter][currentQuiz].start);
		ui_title.innerHTML = settings.quizData[this.chapter][currentQuiz].title[0];
		ui_subtitle.innerHTML = settings.quizData[this.chapter][currentQuiz].title[1];
		ui_no.innerHTML = this.no;
		for (var k = 0; k < 25; k += 1) {
			if ((this.no - 1) != k) {
				ui_wrappers[k].style.display = 'none';
			} else {
				if (dom.hasClass(ui_wrappers[k], 'select')) this.type = 'select';
				if (dom.hasClass(ui_wrappers[k], 'match')) this.type = 'match';
				ui_wrappers[k].style.display = 'block';
			}
		}
	}
	disableBtnNext() {
		currentPoints = -1;
		dom.addClass(ui_btn_next, "disabled");
	}
	enableBtnNext() {
		dom.removeClass(ui_btn_next, "disabled");
	}
	calculatePoints() {
		currentPoints = -1;
		var r = settings.quizData[this.chapter][currentQuiz].r;
		var cr = this.currentAnswer;
		var n = r.length;
		var nc = cr.length;
		if (this.type === "match") {
			var no_correct = 0;
			if (nc != n) {
				this.disableBtnNext();
				return;
			}
			for (var i = 0; i < nc; i += 1) {
				if (cr[i] == -1 || cr[i] == undefined) {
					no_correct = 0;
					this.disableBtnNext();
					return;
				} else {
					if (cr[i] == r[i]) no_correct += 1;
					this.enableBtnNext();
				}
			}
			if (no_correct >= Math.round(n / 2)) {
				currentPoints = 0.5;
			} else {
				currentPoints = 0;
			}
			if (no_correct == n) currentPoints = 1;

		} else {
			var correct = [];
			currentPoints = 0;
			if (nc == n || settings.quizData[this.chapter][currentQuiz].all) {
				for (var i = 0; i < n; i += 1) {
					for (var j = 0; j < cr.length; j += 1) {
						if (r.indexOf(cr[j]) != -1) {
							correct[j] = 1;
						} else {
							correct[j] = 0;
						}
					}
				}
				var t = correct.reduce(function(a, b) {
					return a + b;
				}, 0);
				if (t >= Math.round(n / 2)) currentPoints = 0.5;
				if (t == n) currentPoints = 1;
			}
			if (nc < 1) {
				this.disableBtnNext();
			} else {
				this.enableBtnNext();
			}
		}
	}
}