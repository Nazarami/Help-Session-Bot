// import * as puppeteer from "puppeteer";
import puppeteer from "puppeteer";
import "dotenv/config";
const URL = "https://web.cse.unsw.edu.au/~apps/hopper/";

async function main() {
  const [details, tags] = validateInput();
  const browser = await puppeteer.launch();
  const page = (await browser.pages())[0];
  await page.goto(URL);

  console.log(
    `Attempting to find help session for ${details["courseCode"].toUpperCase()}`
  );
  await findSession(
    page,
    details["courseCode"].toLowerCase(),
    Number(details["interval"])
  );
  console.log(`Session found!`);

  console.log("Submitting login details.");
  // Submit Login Details
  await page.type("input[id=inputzID]", details["zID"]);
  await page.type("input[id=inputPass]", details["zPass"]);
  await page.click("button[id=submit_button]");
  await page.waitForNetworkIdle();

  // Check to see if login details are correct.
  if (page.url() === URL) {
    console.log(
      "The login credentials are incorrect. Please edit your .env file with the correct details."
    );
    await browser.close();
    return;
  }

  console.log("Successfully logged in!");

  console.log("Entering session details.");
  // Enter session details
  await page.type(
    "input[placeholder='What specifically are you working on?']",
    details["section"]
  );
  await page.type("textarea[id=desc_desc]", details["otherInfo"]);

  const data = await page.$$("input[class=form-check-input][type=checkbox]");
  let tagsSelected = false;
  for (let x of data) {
    const text = await page.evaluate((el) => el.value, x);
    if (text.toLowerCase() in tags) {
      console.log(`${text} has been selected.`);
      x.evaluate((y: any) => y.click());
      tagsSelected = true;
    }
  }
  // If none of the tags the user has given are found, selected the first tag.
  if (tagsSelected === false && !tags) {
    const text = await page.evaluate((el) => el.value, data[0]);
    console.log(
      `None of the tags entered were found, first tag, "${text}" is being selected as default.`
    );
    let temp = data[0];
    await temp.evaluate((x: any) => x.click());
  }

  // Submit session request
  const button = await page.$("button[type=submit]");
  if (!button) return;
  // await button.evaluate((x: any) => x.click());
  console.log("Help Session has been successfully booked!");

  await browser.close();
}
main();

async function findSession(
  page: puppeteer.Page,
  courseCode: string,
  interval: number
) {
  let count = 0;
  let sessionFound = false;
  while (sessionFound == false) {
    const sessions = await page.$$("div.list-group-item");
    for (let session of sessions) {
      const text = await session.evaluate((el) => el.textContent);
      const words = text.trim().split(" ");
      for (let i = 0; i < words.length && sessionFound == false; i++) {
        let word = words[i];
        if (word.toLowerCase() === courseCode) {
          sessionFound = true;
          await session.click();
          return session;
        }
      }
    }
    count++;
    if (interval == 0) {
      process.stdout.write("\tSession not found, retrying: " + count + "\r");
    } else {
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
      process.stdout.write(
        `\tSession not found, retrying after ${interval} seconds: ${count}\r`
      );
    }
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }
}


function validateInput() {
  const envVariables = [
    "courseCode",
    "zID",
    "zPass",
    "interval",
    "section",
    "otherInfo",
  ];

  let details: { [key: string]: string } = {};
  for (let x of envVariables) {
    const input = process.env[x];
    if (!input) {
      console.log(`You must give a valid input for ${x}. Please modify it within your .env file.`);
      process.exit();
    }
    details[x] = input;
  }

  let tags: { [key: string]: string } = {};
  if (process.env['tags']) {
    process.env['tags'].toLowerCase().split(", ").map((tag) => (tags[tag] = tag));
  } else {
    console.log("No tags supplied, will select first tag as default.");
  }
  return [details, tags];
}
