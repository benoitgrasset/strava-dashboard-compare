import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { writeJSON } from "./utils.js";

const StravaURL = "https://www.strava.com/login/";

dotenv.config();

// ****************************************
// Fill with your infos (.env file)
const {
  ID: myId,
  NAME: myName,
  EMAIL: myEmail,
  PASSWORD: myPassword,
} = process.env;
// ****************************************

// const { id: myId, name: myName, email: myEmail, password: myPassword } = data;

const getNbPages = async (page) => {
  // get the number of pages of all athletes followed on strava
  const firstPageUrl = `https://www.strava.com/athletes/${myId}/follows?type=following`;
  await page.goto(firstPageUrl);
  await page.waitForTimeout(5000);
  const nbPages = await page.evaluate(async () => {
    return document.querySelector(
      "nav > ul[aria-label=Pagination] > li:nth-last-child(2)"
    ).innerText;
  });
  return Number(nbPages);
};

const getSportsFromAthletes = async (page) => {
  return page.evaluate(() => {
    const elements = document.querySelectorAll(
      "thead > tr > th > ul.switches > li > button.selected"
    );
    return [...elements].map((element) => element.title);
  });
};

const getAthletesWithScrapping = async (page) => {
  const nbPages = await getNbPages(page);
  console.log(`${nbPages} pages of athletes followed on Strava`);

  const urls = [...Array(nbPages)].map(
    (_e, index) =>
      `https://www.strava.com/athletes/${myId}/follows?type=following&page=${
        index + 1
      }`
  );

  const athletes = [];
  console.log("Get all athletes followed on Strava");
  for (const url of urls) {
    await page.goto(url);
    await page.waitForTimeout(5000);
    const athletesPage = await page.evaluate(() => {
      const elements = document.querySelectorAll("div.text-callout > a");
      // document.querySelectorAll returns a NodeList which must be converted to real Array before using map()
      return [...elements].map((element) => ({
        name: element.innerText,
        id: Number(element.href.split("/")[4]),
      }));
    });
    // push() -> mutable // concat() -> immutable
    athletes.push(...athletesPage);
  }
  // All athletes + ME
  // So, need Id + name in the form
  athletes.push({
    name: myName,
    id: Number(myId),
  });
  console.table(athletes);
  console.log(`${athletes.length} athletes followed on Strava`);
  return athletes;
};

const getStatsWithScrapping = async (page, athletes) => {
  const stats = [];
  const timeOut = 3.5; // seconds
  const minuts = ((athletes.length * timeOut) / 60).toFixed(3); // minuts
  console.log(`Veuillez patienter ${minuts} minutes`);
  await page.waitForTimeout(5000);
  // no await inside forEach() loop
  for (const athlete of athletes) {
    const { id, name } = athlete;
    const url = `https://www.strava.com/athletes/${id}`;
    await page.goto(url);
    await page.waitForTimeout(timeOut * 1000); // milliseconds
    console.log(`${name} ...`);

    const sports = await getSportsFromAthletes(page);
    console.log("Sports pratiqués:");
    console.table(sports);

    if (!sports || sports.length < 1) {
      continue;
    }

    // document variable is available within page.evaluate()
    // variable sports is not defined / accessible within evaluate()
    const data = await page.evaluate(async (sports) => {
      const roundNumber = (num) => Math.round(num * 100) / 100;

      /**
       * We keep only the number before the first letter "h" (number of hours) and convert it to number
       * @param {*} str
       * @returns
       */
      const formatTime = (string) => {
        if (string.includes("h")) {
          return Number(string.split(/\D/)[0]);
        } else {
          return roundNumber(Number(string.split(/\D/)[0]) / 60);
        }
      };

      const formatDistance = (str) =>
        Number(
          str
            .replace(",", ".") // replace "," by "."
            .replace(/\s+/g, "") // remove white spaces
            .replace(/[a-zA-Z]+/g, "") // remove letters
        );

      // running: activité, distance, temps, dénivelé
      // cycling, randonnée: activité, distance, dénivelé, temps
      // swimming: activité, distance, temps
      // entrainement: activité, temps, distance

      const sportsRowEquivalence = {
        "Course à pied": { activity: 1, distance: 2, time: 3, drop: 4 },
        Vélo: { activity: 1, distance: 2, time: 4, drop: 3 },
        Natation: { activity: 1, distance: 2, time: 3 },
        Entraînement: { activity: 1, distance: 3, time: 2 },
        Randonnée: { activity: 1, distance: 2, time: 4, drop: 3 },
        Marche: { activity: 1, distance: 2, time: 4, drop: 3 },
        "Vélo électrique": { activity: 1, distance: 2, time: 4, drop: 3 },
        "Sports nautiques": { activity: 1, distance: 3, time: 2 },
        Raquettes: { activity: 1, distance: 2, time: 4, drop: 3 },
        "Ski alpin": { activity: 1, distance: 2, time: 3 },
        "Ski nordique": { activity: 1, distance: 2, time: 3, drop: 4 },
      };

      const sportsKeyEquivalence = {
        "Course à pied": "running",
        Vélo: "cycling",
        Natation: "swimming",
        Entraînement: "training",
        Randonnée: "hiking",
        Marche: "walking",
        "Vélo électrique": "eCycling",
        "Sports nautiques": "waterSport",
        Raquettes: "snowshoes",
        "Ski alpin": "ski",
        "Ski nordique": "nordic_ski",
      };

      const activity = sports.reduce((acc, sport, index) => {
        if (sportsRowEquivalence[sport] === undefined) {
          console.error(`${sport} is not defined`);
        }
        const sportActivityStr =
          document.querySelector(
            `div.sport-${index} > table > tbody#sport-${index}-ytd > tr:nth-child(${sportsRowEquivalence[sport].activity}) > td:nth-child(2)`
          )?.innerText || "0";
        return {
          ...acc,
          [sportsKeyEquivalence[sport]]: Number(sportActivityStr),
        };
      }, {});

      const distance = sports.reduce((acc, sport, index) => {
        const sportDistanceStr =
          document.querySelector(
            `div.sport-${index} > table > tbody#sport-${index}-ytd > tr:nth-child(${sportsRowEquivalence[sport].distance}) > td:nth-child(2)`
          )?.innerText || "0";
        return {
          ...acc,
          [sportsKeyEquivalence[sport]]: formatDistance(sportDistanceStr),
        };
      }, {});

      const time = sports.reduce((acc, sport, index) => {
        const sportTimeStr =
          document.querySelector(
            `div.sport-${index} > table > tbody#sport-${index}-ytd > tr:nth-child(${sportsRowEquivalence[sport].time}) > td:nth-child(2)`
          )?.innerText || "0";
        return {
          ...acc,
          [sportsKeyEquivalence[sport]]: formatTime(sportTimeStr),
        };
      }, {});

      const drop = sports.reduce((acc, sport, index) => {
        const sportDropStr =
          (sportsRowEquivalence[sport].drop &&
            document.querySelector(
              `div.sport-${index} > table > tbody#sport-${index}-ytd > tr:nth-child(${sportsRowEquivalence[sport].drop}) > td:nth-child(2)`
            )?.innerText) ||
          "0";
        return {
          ...acc,
          [sportsKeyEquivalence[sport]]: formatDistance(sportDropStr),
        };
      }, {});

      return {
        activity,
        distance,
        time,
        drop,
      };
    }, sports);
    console.log({ name, id: Number(id), ...data });
    stats.push({ name, id: Number(id), ...data });
  }
  return stats;
};

const loginAndGetStats = async (fetchAthletes) => {
  const browser = await puppeteer.launch({
    headless: true,
    env: { LANGUAGE: "fr_FR" },
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(StravaURL);

  await page.type("#email", myEmail);
  await page.type("#password", myPassword);
  console.log("Inserting email and password");
  await page.click("#login-button");
  console.log("Logged");
  await page.waitForNavigation();

  const athletes = await getAthletesWithScrapping(page);

  const stats = await getStatsWithScrapping(page, athletes);

  await browser.close();

  return stats;
};

export const launchScrapping = async (fetchAthletes) => {
  await loginAndGetStats(fetchAthletes)
    .then((res) => {
      // save all stats to stats.json file
      const json = JSON.stringify(res);
      writeJSON("stats.json", json);
    })
    .catch((error) => {
      console.log(error);
    });
};
