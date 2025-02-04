import DiscordClient from "./discord-sender/discord-client";
import { getDiscordToken, getProxy, getServerId } from "./env";
import ScraperWorkshop from "./scraper/scraper-workshop";

const main = async () => {
  console.log("server started");

  const url =
    "https://steamcommunity.com/workshop/browse/?appid=252490&browsesort=accepted&section=mtxitems&actualsort=accepted";

  const proxy = getProxy();
  const scrapper = new ScraperWorkshop(url, proxy);
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
  await discordClinet.sendNotificationItemsRotation(items, url);
  process.exit(0);
};

main();
