import DiscordClient from "./discord-sender/discord-client";
import { getDiscordToken, getProxy, getServerId } from "./env";
import ScraperWorkshop from "./scraper/scraper-workshop";

const main = async () => {
  //   console.log("server started");

  //   const dcToken = getDiscordToken();
  //   const serverId = getServerId();

  //   const discordClinet = new DiscordClient(dcToken, serverId);
  //   await discordClinet.setChannel("testy-na-produkcji");

  //   const feedback = await discordClinet.sendMessageOnChannel({
  //     title: "DUPA",
  //     color: 5,
  //     description: "asdasd",
  //     footer: {
  //       text: "asdasd",
  //     },
  //   });
  //   console.log(feedback);
  const url =
    "https://steamcommunity.com/workshop/browse/?appid=252490&browsesort=accepted&section=mtxitems&actualsort=accepted";
  const proxy = getProxy();
  const scrapper = new ScraperWorkshop(url, proxy);
  await scrapper.dataSynchronizer();
  process.exit(0);
};

main();
