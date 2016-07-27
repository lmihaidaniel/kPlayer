let __section_width_in_time = 113.8 / 6;
export default {
	player: {
		video: document.querySelector('video'),
		autoplay: true,
		loop: false,
		externalControls: false,
		fullWindow: true,
		videoWidth: 1280,
		videoHeight: 720,
		font: {
			ratio: 1.2,
			min: .1
		}
	},
	delayAutoOpenQuizz: 4,
	cuepoints_show_btn_quiz: [{
		start: 2,
		end: 29.4,
		chapter: 0,
		quizNo: 1
	}, {
		start: 31.4,
		end: 44.7,
		chapter: 1,
		quizNo: 4,
	}, {
		start: 46.7,
		end: 65.5,
		chapter: 2,
		quizNo: 7
	}, {
		start: 67.5,
		end: 76.2,
		chapter: 3,
		quizNo: 10
	}, {
		start: 78.2,
		end: 102.4,
		chapter: 4,
		quizNo: 13
	}, {
		start: 104.4,
		end: 113,
		chapter: 5,
		quizNo: 17
	}],
	controlSeekBarSpeed: [{
		start: 0,
		end: 29.4,
		title: ["medical environment", "Gastrointestinal anatomy and physiology"],
		label: "Gastrointestinal anatomy and physiology"
	}, {
		start: 29.4,
		end: 44.7,
		title: ["medical environment", "Diarrhea"],
		label: "Diarrhea"
	}, {
		start: 44.7,
		end: 65.5,
		title: ["medical environment", "Treatment"],
		label: "Treatment"
	}, {
		start: 65.5,
		end: 76.2,
		title: ["", "probiotics review & Saccharimyces boulardii <br> CNCMI-745 identity"],
		label: "probiotics review & Saccharimyces boulardii <br> CNCMI-745 identity"
	}, {
		start: 76.2,
		end: 102.4,
		title: ["", "saccharomyces boulardii CNCM-745 <br> mode of action"],
		label: "saccharomyces boulardii <br>CNCM-745 mode of action",
	}, {
		start: 102.4,
		end: 113.8,
		title: ["", "Clinical evidence"],
		label: "Clinical evidence"
	}],
	chapters: [{
		start: 0,
		end: __section_width_in_time,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_1'
	}, {
		start: __section_width_in_time,
		end: __section_width_in_time * 2,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_2'
	}, {
		start: __section_width_in_time * 2,
		end: __section_width_in_time * 3,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_3'
	}, {
		start: __section_width_in_time * 3,
		end: __section_width_in_time * 4,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_4'
	}, {
		start: __section_width_in_time * 4,
		end: __section_width_in_time * 5,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_5'
	}, {
		start: __section_width_in_time * 5,
		end: __section_width_in_time * 6,
		width: true,
		content: true,
		className: 'kmlCuepoint chapter_6'
	}],
	quizData: [
		[{
			title: ["The intestinal microbiota", "Please tick the correct answer(s):"],
			type: "select",
			all: true,
			r: [0, 1, 2, 3, 4, 5]
		}, {
			title: ["&nbsp;", "Match each digestive process with its definition:"],
			type: "match",
			r: [1, 5, 4, 2, 0, 3]
		}, {
			title: ["Gut Microbiota", "Please tick the correct answer(s):"],
			type: "select",
			r: [1, 2]
		}],
		[{ //4
			title: ["&nbsp;", "Which of the following bacteria causes noninvasive diarrhea ?"],
			type: "select",
			r: [0]
		}, {
			title: ["&nbsp;", "What does the presence of blood in the stool indicate ?"],
			type: "select",
			r: [0]
		}, {
			title: ["&nbsp;", "What is the pathophysiology of viral diarrhea ?"],
			type: "select",
			r: [2]
		}],
		[{ //7
			title: ["&nbsp;", "Antibiotics are effective in the treatment of viral diarrheas."],
			type: "select",
			r: [1]
		}, {
			title: ["", "Which of the following probiotics has been recommended by European Society of Paediatric Gastroenterology, Hepatology, And Nutrition in the treatment of diarrhea ?"],
			type: "select",
			r: [2]
		}, {
			title: ["&nbsp;", "What is the mode of action of Saccharomyces boulardii CNCM I-745 against viral diarrhea ?"],
			type: "select",
			r: [2]
		}],
		[{ //10
			title: ["", "To which class of organisms/microorganisms does Saccharomyces boulardii CNCM I-745 belong ?"],
			type: "select",
			r: [2]
		}, {
			title: ["&nbsp;", "Which of the following properties is NOT exhibited by a probiotic ?"],
			type: "select",
			r: [0]
		}, {
			title: ["&nbsp;", "Surface area of bacteria is 10 times that of yeast"],
			type: "select",
			r: [1]
		}],
		[{ //13
			title: ["Antitoxinic effect", "Please tick the correct answer(s):"],
			type: "select",
			r: [0, 2, 4]
		}, {
			title: ["", "Modulation of intestinal microbiota. Saccharomyces boulardii CNCM I-745 in dysbiosis leads to faster reestablishment of the healthy microbiome"],
			type: "select",
			r: [0]
		}, {
			title: ["Trophic action", "Please tick the correct answer(s):"],
			type: "select",
			r: [0, 2]
		}, {
			title: ["Antimicrobial action", "Please tick the correct answer(s):"],
			type: "select",
			r: [1, 2, 3]
		}],
		[{ //17
			title: ["Clinical evidence", "Please tick the correct answer(s):"],
			type: "select",
			r: [0, 1]
		}, {
			title: ["Which of the following reasons accounts for the unmet needs in the management of acute diarrhea? ", "Please tick the correct answer(s):"],
			type: "select",
			r: [0]
		}, {
			title: ["The following are unmet medical need in the treatment of antibiotic-associated diarrhea.", "Please tick the correct answer(s):"],
			type: "select",
			r: [0, 1, 3]
		}, {
			title: ["Clinical evidence. Szajewska and al Meta-analysis 2007 – updated 2009.", "Please tick the correct answer(s):"],
			type: "select",
			all: true,
			r: [0, 1, 2]
		}, {
			title: ["Clinical evidence. Dinleyici E. and al Meta-analysis 2012. Part 1.", "Please tick the correct answer(s):"],
			type: "select",
			r: [0, 1, 4]
		}, {
			title: ["Clinical evidence. Dinleyici E. and al Meta-analysis 2012. Part 2.", "Please tick the correct answer(s):"],
			type: "select",
			r: [2, 3, 5]
		}, {
			title: ["Clinical evidence. Moré & Swidsinski Meta- analysis updated in 2015.", "Please tick the correct answer(s):"],
			type: "select",
			r: [0, 2, 3]
		}, {
			title: ["Clinical evidence. McFarland Meta-analysis:", "Please tick the correct answer(s):"],
			type: "select",
			r: [0, 1, 3, 4],
		}, {
			title: ["Clinical evidence. Swajewska Meta-analysis 2015:", "Please tick the correct answer(s):"],
			type: "select",
			r: [0, 1, 3]
		}]
	]
}