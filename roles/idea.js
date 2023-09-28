const { inference } = require('../utils');
const Prompt = require('../prompt');

const prompt = new Prompt();

function Idea(page) {
	const self = this;
	
	this.page = page;
	this.topics = []; 

	this.getTopics = async function() {
		// await this.page.goto('https://trends.google.com/trends/trendingsearches/daily?geo=US&hl=en-US')
	
		// const topics = await this.page.evaluate(() => {
		// 	const topicElements = document.querySelectorAll(".details .details-top");
		// 	return Array.from(topicElements).map((topicEl) => {
		// 		return topicEl.innerText.trim()
		// 	});
		// });

		// this.topics = topics;
		this.topics = [
		  'Damian Lillard',
		  'Trump',
		  'Colin Kaepernick',
		  'Deep sea dumbo octopus',
		  'Man City',
		  'Bruce Springsteen',
		  'Survivor',
		  'Chelsea',
		  'Deandre Ayton',
		  'Liverpool',
		  'Marlins',
		  'Target stores closing theft',
		  'Real Madrid vs Las Palmas',
		  'Travis King',
		  'Counter-Strike 2',
		  'DWTS',
		  'Rudy Gay',
		  'Meta Quest 3',
		  'Crystal Rogers',
		  'Cher'
		]
	}

	this.getTargetMarketIndustrySummary = async function(topics) {
		return await inference(prompt.industryTargetMarketPrompt(topics))
	}


	this.getBusinessIdeas = async function(targetMarketIndustrySummary) {
		return await inference(prompt.getBusinessIdeasPrompt(targetMarketIndustrySummary))
	}
}

module.exports = Idea;