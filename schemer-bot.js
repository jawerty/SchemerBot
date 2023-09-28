const fs = require('fs');
const puppeteer = require('puppeteer');
const { setupBrowser, timeout, inference } = require('./utils');

const Idea = require('./roles/idea');
const Research = require('./roles/research');
const Business = require('./roles/business');
const Engineer = require('./roles/engineer');

const Prompt = require('./prompt');

const prompt = new Prompt()

let research, idea, business, engineer;
async function schemeLoop() {
	// refresh the trendy topics each hours
	await idea.getTopics();
	
	// pass this up to the LLM and gather the target market + the industries
	const targetMarketIndustrySummary = await idea.getTargetMarketIndustrySummary(idea.topics);
	console.log("\n\n\n\n----------TARGET MARKET----------\n\n\n\n", targetMarketIndustrySummary)
	// use the target market and the industries to get a list of SaaS business ideas 
	const businessIdeas = await idea.getBusinessIdeas(targetMarketIndustrySummary)
	console.log("\n\n\n\n----------BUSINESS IDEA----------\n\n\n\n", businessIdeas)

	async function researchAndPlan() {
		try {	
			research.topicRecentTweets = JSON.parse(fs.readFileSync("./data-tweets.json"))
			research.topicNewsData = JSON.parse(fs.readFileSync("./data-news.json"))
		} catch(e) {

		}
		if (Object.keys(research.topicRecentTweets).length === 0) {
			await research.getTweetsForTopics(idea.topics)
			fs.writeFileSync("./data-tweets.json", JSON.stringify(research.topicRecentTweets))
		}
		if (Object.keys(research.topicNewsData).length === 0) {
			await research.getNewsDataForTopics(idea.topics)
			fs.writeFileSync("./data-news.json", JSON.stringify(research.topicNewsData))
		}

		const businessPlan = await business.getBusinessPlan(businessIdeas, research)	
		console.log("\n\n\n\n----------BUSINESS PLAN----------\n\n\n\n", businessPlan)
		const businessApprovedSummary = await business.businessApproval(businessPlan)
		console.log("\n\n\n\n----------BUSINESS APPROVAL----------\n\n\n\n", businessApprovedSummary)

		// needs to have a token that says we need more research or a token that says it's just a bad idea
		// if (businessApprovedSummary.indexOf("MORE-RESEARCH") > -1){
		// 	// get more research and 
		// 	return researchAndPlan();
		// } else if (businessApprovedSummary.indexOf("BUSINESS-NOT-APPROVED") > -1) {
		// 	return true;
		// } else {
		// 	console.log("BUSINESS IS APPROVED");
			// run 10x-React-Engineer
			const productDescription = await engineer.getProductIdea(businessPlan)
			console.log("\n\n\n\n----------PRODUCT DESCRIPTION----------\n\n\n\n", productDescription)
			await engineer.generateCodeBase(productDescription)
			console.log("\n\n\n\n----------CODEBASE GENERATED----------\n\n\n\n")

			// save business plan
			// save the final code
			return true;
		// }
	}	
	
	await researchAndPlan()

	return schemeLoop();
}

async function run() {
	const [browser, page] = await setupBrowser()

	research = new Research(page);
	idea = new Idea(page)
	business = new Business()
	engineer = new Engineer()

	// start the loop 
	return schemeLoop(page)
}

run()