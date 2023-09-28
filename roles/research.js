const { inference, timeout } = require('../utils');
const Prompt = require('../prompt');

const prompt = new Prompt();


function Research(page) {
	this.page = page;

	this.topicRecentTweets = {} // topic => tweets
	this.topicNewsData = {} // topic => news feed

	this.getTweetsForTopics = async function(topics) {
		for (let topic in this.topicRecentTweets) {
			topics.splice(topics.indexOf(topic), 1)
		}
		const topThree = topics.slice(0, 3)
		for (let topic of topThree) {
			const tweetSearch = `https://www.google.com/search?q=${encodeURIComponent(topic)}%3Ahttps%3A%2F%2Ftwitter.com%2F*%2Fstatus%2F`
			await this.page.goto(tweetSearch) 

			const tweetSearchText = await this.page.evaluate(() => {
				return document.querySelector("#search").innerText
			})

			this.topicRecentTweets[topic] = tweetSearchText
			await timeout(3000)
		}
	}

	this.getNewsDataForTopics = async function(topics) {
		for (let topic in this.topicNewsData) {
			topics.splice(topics.indexOf(topic), 1)
		}
		const topThree = topics.slice(0, 3)

		for (let topic of topThree) {
			const newsSearch = `https://www.google.com/search?q=${encodeURIComponent(topic)}&sca_esv=569007408&biw=1306&bih=595&tbm=nws&sclient=gws-wiz-news`
			await this.page.goto(newsSearch) 

			const newsSearchText = await this.page.evaluate(() => {
				return document.querySelector("#search").innerText
			})

			this.topicNewsData[topic] = newsSearchText
			await timeout(3000)
		}
	}
}

module.exports = Research;