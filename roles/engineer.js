const fs = require('fs');

const { inference } = require('../utils');
const Prompt = require('../prompt');

const prompt = new Prompt();

function Engineer() {
	this.getProductIdea = async function(businessPlan) {
		return await inference(prompt.productIdeaPrompt(businessPlan))
	}

	this.generateCodeBase = async function(productDescription) {
		const output = await inference(prompt.reactCodeBasePrompt(productDescription))

		const folderName = `scheme_${fs.readdirSync("./schemes").length}`

		fs.mkdirSync(`./schemes/${folderName}`, { recursive: true });

		let fileNames = output.match(/\*\*[^`]*\*\*/gmi)
		console.log("fileNames", fileNames)
		fileNames = fileNames.map((fileName) => {
			return fileName.replaceAll('**', '').trim()
		})
		

		let codeBlocks = output.match(/```[^`]*```/gmi)
		console.log("codeBlocks", codeBlocks)
		codeBlocks = codeBlocks.map((codeBlock) => {
			return codeBlock.replaceAll('```', '').trim().split("\n").slice(1).join("\n")
		})

		console.log("codeBlocks", codeBlocks)



		for (let [i, fileName] of fileNames.entries()) {
			if (codeBlocks[i]) {
				fs.writeFileSync(`./schemes/${folderName}/${fileName}`, codeBlocks[i]);
			}
		}

	}
}

module.exports = Engineer;