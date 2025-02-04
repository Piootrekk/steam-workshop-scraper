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
let iteration = 0;

const main = async (): Promise<void> => {
  console.log("server started");

  const urlToParse = getUrlToParse();
  const proxy = getProxy();
  iteration++;
  console.log("Cron iteration: ",iteration);
  const scrapper = new ScraperWorkshop(urlToParse, proxy);
  await scrapper.dataSynchronizer();
  const items = scrapper.getItems;
  if (items.length === 0) {
    console.log("Nothing to change");
    return;
  }
  const dcToken = getDiscordToken();
  const serverId = getServerId();
  const discordClinet = new DiscordClient(dcToken, serverId);
  await discordClinet.setChannel("testy-na-produkcji");
  await discordClinet.sendNotificationItemsRotation(items, urlToParse);
  console.log("Sent notification, ending process");
  process.exit(0);
};

const cronjob = initCronjob(main, timeStampCronJob);
cronjob.start();
