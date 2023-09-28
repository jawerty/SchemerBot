const puppeteer = require('puppeteer');
const fs = require('fs');

function timeout(miliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {resolve()}, miliseconds)
  })
}

async function setupBrowser() {
  const viewportHeight = 800;
  const viewportWidth = 1080;
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0); 
  await page.setViewport({width: viewportWidth, height: viewportHeight});
  
  page.on('console', async (msg) => {
	const msgArgs = msg.args();
	for (let i = 0; i < msgArgs.length; ++i) {
	  try {
		console.log(await msgArgs[i].jsonValue());
	  } catch(e) {
	  	console.log(e);
	  }
    }
  });

  return [browser, page]
}

async function inference(prompt) {
  const apiUrl = "http://daf6-34-124-155-70.ngrok.io"
  const response = await fetch(apiUrl + "/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "prompt": prompt
    })
  });
  const result = await response.json();
  return result["output"];
}

module.exports = {
  setupBrowser,
  timeout,
  inference
}