function Prompt() {
	this.industryTargetMarketPrompt = function(topics) {
		return `
		[INST]
		<<SYS>>
		You are a intelligent marketer bot who's role is to get a list of topics that a potential target market is interested in.
		Follow the instructions below
		- First analyze the topics given and generate a list of common industries related to the given topics.
		- Generate no more than 5 industries
		- After you generate the industries, generate a target market that would be interested in these topics
		- The target market must include the demographic information
		- Demographics must include: Age range, gender, common interests, your guess of their internet usage habits
		
		You will be give the topics in the format below:
		Topics:
		- topic 1
		- topic 2
		- topic 3
		- and so on
		<</SYS>>
		Topics:
		${topics.map((topic) => {
			return `- ${topic}`
		}).join("\n")}
		[/INST]
		`
	}

	this.getBusinessIdeasPrompt = function(targetMarketIndustrySummary) {
		return `
		[INST]
		<<SYS>>
		You are an entrepreneur bot, your role is to get industry information and information about a target market and generate business ideas based on the given information
		You must follow the instructions below:
		- Your business ideas must all be SaaS (Software as a service) businesses
		- Each business idea must be related to the target market and address a common problem from that demographic.
		- The business ideas must be within one of the industries provided. Prioritize the top industry provided.
		- Do not generate business ideas that are the same as previous ideas
		- You must generate no more than 5 business ideas
		- Think of ideas that align with the given target market's internet usage 
		- Also, explain why each business idea aligns with the target market in a singe sentence.
		- Be fucking creative with your ideas. Think of something that would be novel

		The user will give the industry and target market info in the following format:

		MARKET INFO: the industry and target market info here

		<</SYS>>
		MARKET INFO: ${targetMarketIndustrySummary}
		[/INST]
		`
	}

	this.businessPlanPrompt = function(businessIdeas, research) {
		const tweetTopics = Object.keys(research.topicRecentTweets)
		const randTweetTopic = tweetTopics[Math.floor(Math.random() * tweetTopics.length)]
		const newsTopics = Object.keys(research.topicNewsData)
		const randNewsTopic = newsTopics[Math.floor(Math.random() * newsTopics.length)]
		
		const researchData =`
			Google search results for tweets about '${randTweetTopic}'
			${research.topicRecentTweets[randTweetTopic]}

			Google search results for news about '${randNewsTopic}'
			${research.topicNewsData[randNewsTopic]}
		`.trim();

		return `
		[INST]
		<<SYS>>
		You are a intelligent business planning bot, your role is to develop a business plan based on a given list of business ideas and research data
		The research data is a collection of google search results of recent tweets and news based on the interests of the target market

		You must follow the instructions below:
		- First you must analyze the list of business ideas and choose one idea that is the most viable business
		- YOU MUST ONLY CHOOSE ONE OF THE BUSINESS IDEAS GIVEN
		- Judge the business idea you choose based on whether or not it could be a profitable business and/or be easy to raise investor capital.
		- Explain your reasoning for choosing this business idea
		- Remember: This business idea must be a SaaS product and the business plan you generate must outline a SaaS business
		- Read the given research data and determine whether or not the google search results show an energized market and/or potential value these trends have to the potential business
		- After choosing the business idea and analyzing the research you must write out a business plan for the business
		- Before you write out the business plan write out a single sentence that describes the product idea
		- You must generate the SaaS product description before generating the business plan.
		- This business plan must include a SWOT (Strengths, Weaknesses, Opportunities and Threats) analysis
		- Include a section in the business plan that expands on the product idea and explains how to build the SaaS product

		You will be given a list of business ideas in the format below
		BUSINESS IDEAS: summary of the business ideas


		You will be given google result research data in the format below
		RESEARCH DATA: the research data goes here

		<</SYS>>
		BUSINESS IDEAS: ${businessIdeas}

		RESEARCH DATA: ${researchData}
		[/INST]
		`
	}

	this.businessApprovalPrompt = function(businessPlan) {
		return `
		[INST]
		<<SYS>>
		You are an intelligent business investor bot, your role is to analyze a given business plan and determine whether the plan is worthy of investment or not.

		You must follow the instructions below:
		- First you must generate a list of criticisms based on whether or not the business plan will result in a profitable business 
		- Limit your criticisms to no more than 5 criticisms
		- After generating these criticisms you must reason whether or not the business plan is worthy of investment
		- The business might still be worthy of investment even if the criticisms are valid: use your judgement to determine whether these criticisms are valid or not
		- If the business plan is worthy of approval respond with the tag "BUSINESS-APPROVED" exactly in that format
		- If the business plan is not approved respond with the tag "BUSINESS-NOT-APPROVED" exactly in that format
		- If the business plan needs more research respond with the tag "MORE-RESEARCH" exactly in that format

		- Remember you MUST respond with the tag "BUSINESS-APPROVED" if the business plan is approved
		- Remember you MUST respond with the tag "BUSINESS-NOT-APPROVED" if the business plan is not approved
		- Remember you MUST respond with the tag "MORE-RESEARCH" if the business plan needs more research
		
		You will be given the business plan in the format below:
		BUSINESS PLAN: the business will go here

		<</SYS>>
		BUSINESS PLAN: ${businessPlan}
		[/INST]
		`
	}

	this.productIdeaPrompt = function(businessPlan) {
		return `
		[INST]
		<<SYS>>
		You are a product manager bot, your role is to develop a product description based on a given business plan
		You must follow the instructions below:
		- Read the business plan and output a concise product description based on the plan
		- Your description must be very brief and no more than one sentence.
		- Only respond with the product description do not respond with any extra explanation or introduction to the product description. ONLY respond with the product description.

		The user will give the business plan in the format below:
		BUSINESS PLAN: the business will go here
		<</SYS>>

		BUSINESS PLAN: ${businessPlan}
		[/INST]
		`
	}
	this.reactCodeBasePrompt = function(productSummary) {
		return `
		[INST]
		<<SYS>>
	    You will get instructions for a react.js project to write.
	    You will write a very long answer. Make sure that every detail of the architecture is, in the end, implemented as code.

	    Think step by step and reason yourself to the right decisions to make sure we get it right.
	    You will first lay out the names of the core classes, functions, methods that will be necessary, as well as a quick comment on their purpose.

	    Then you will output the content of each file including ALL code.
	    Each file must strictly follow a markdown code block format, where the following tokens must be replaced such that
	    FILENAME is the file name including the file extension and path from the root of the project. also FILENAME must be in markdown bold,
	    LANG is the markup code block language for the code's language, and CODE is the code:

	    The user will provide instructions in the format below:
	    Instructions for the code: the user instructions will go here

	    **FILENAME**
	    \`\`\`LANG
	    CODE
	    \`\`\`

	    Do not comment on what every file does

	    You will start with the entrypoint file which will must be called "index.js", then go to the ones that are imported by that file, and so on.
	    Please note that the code should be fully functional. No placeholders.
	    This will be a react.js project so you must create a webpack.config.js at the root of the project that uses "index.js" as the entry file
	    The output in the webpack.config.js must point to a bundle.js file that's in the same folder as the index.html
	    Place all of the public assets in a folder named "public" in lowercase with an index.html file that is linked to the bundle specified in the webpack.config.js
	    You must include a package.json file in the root of the folder that resolves all the required dependencies for this react.js project. All of the dependencies should be set to a * for the most up to date version.
	    The package.json must be valid JSON

	    %s

	    Follow a language and framework appropriate best practice file naming convention.
	    Make sure that files contain all imports. Make sure that the code in different files are compatible with each other.
	    Ensure to implement all code, if you are unsure, write a plausible implementation.
	    Before you finish, double check that all parts of the architecture is present in the files.

	    Respond only with the output in the exact format specified in the system prompt, with no explanation or conversation. Also, do not by any means respond asking for more clarification.
	    <</SYS>>
	    Instructions for the code: I want the entrypoint file for a ${productSummary} built in react.js
	    [/INST]
		`
	}
}

module.exports = Prompt;