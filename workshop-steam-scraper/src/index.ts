import { initCronjob } from "./cronjob/cronjob";
import DiscordClient from "./discord-sender/discord-client";
import {
  getDiscordToken,
  getProxy,
  getServerId,
  getTimeStamp,
  getUrlToParse,
} from "./env";
import ScraperWorkshop from "./scraper/scraper-workshop";

const timeStampCronJob = getTimeStamp();
const urlToParse = getUrlToParse();
const proxy = getProxy();
let iteration = 0;
console.log("server started");

const cronExecute = async (): Promise<boolean> => {
  console.log("Cron iteration: ", iteration);
  iteration++;
  const scrapper = new ScraperWorkshop(urlToParse, proxy);
  await scrapper.dataSynchronizer();
  const items = scrapper.getItems;
  if (items.length === 0) {
    console.log("Nothing to change");
    return false;
  }
  const dcToken = getDiscordToken();
  const serverId = getServerId();
  const discordClinet = new DiscordClient(dcToken, serverId);
  await discordClinet.setChannel("testy-na-produkcji");
  await discordClinet.sendNotificationItemsRotation(items, urlToParse);
  console.log("Sending notification, ending process");
  return true;
};

const main = async () => {
  const cronjob = initCronjob(cronExecute, timeStampCronJob);
  cronjob.start();
};

main();
