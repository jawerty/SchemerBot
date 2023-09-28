const { inference } = require('../utils');
const Prompt = require('../prompt');

const prompt = new Prompt();

function Business() {
	this.getBusinessPlan = async function(businessIdeas, research) {
		return await inference(prompt.businessPlanPrompt(businessIdeas, research))
	}

	this.businessApproval = async function(businessPlan, criticisms) {
		return await inference(prompt.businessApprovalPrompt(businessPlan, criticisms))
	}
}

module.exports = Business;