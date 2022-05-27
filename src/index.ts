// import * as puppeteer from "puppeteer";
import puppeteer from "puppeteer";
import "dotenv/config";
const URL = "https://web.cse.unsw.edu.au/~apps/hopper/";

async function main() {
  const envVariables = [
    "courseCode",
    "zID",
    "zPass",
    "interval",
    "section",
    "otherInfo",
    "tags",
    "leaveOpen",
  ];
  let details: { [key: string]: string } = {};
  for (let x of envVariables) {
    const input = process.env[x];
    if (!input) return;
    details[x] = input;
  }

  let tags: { [key: string]: string } = {};
  const x = details["tags"]
    .toLowerCase()
    .split(", ")
    .map((tag) => (tags[tag] = tag));

  const browser = await puppeteer.launch({ headless: true });
  const page = (await browser.pages())[0];
  await page.goto(URL);
  await findSession(
    page,
    details["courseCode"].toLowerCase(),
    Number(details["interval"])
  );

  // Submit Login Details
  await page.type("input[id=inputzID]", details["zID"]);
  await page.type("input[id=inputPass]", details["zPass"]);
  await page.click("button[id=submit_button]");
  await page.waitForNetworkIdle();

  // Check to see if login details are correct.
  if (page.url() === URL) {
    console.log("The login credentials are incorrect.");
    await browser.close();
    return;
  }

  console.log("Successfully logged in!");

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
      x.evaluate((y: any) => y.click());
      tagsSelected = true;
    }
  }
  // If none of the tags the user has given are found, selected the first tag.
  if (tagsSelected === false) {
    let temp = data[0];
    await temp.evaluate((x: any) => x.click());
  }

  // Submit session request
  const button = await page.$("button[type=submit]");
  if (!button) return;
  await button.evaluate((x: any) => x.click());
  console.log("Help Session has been booked!");

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
    // Maybe get a set interval to refresh the page from the user?
    if (interval != 0) {
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    }
    count++;
    process.stdout.write("\tRetrying: " + count + "\r");
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }
}
