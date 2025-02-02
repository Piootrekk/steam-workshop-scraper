import DiscordClient from "./discord-sender/discord-client";
import { getDiscordToken, getServerId } from "./env";
import { fetcherHtml, parseHtml } from "./scraper/scraper-workshop";

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
  const rawHtml = await fetcherHtml();
  const items = parseHtml(rawHtml);
  console.log(JSON.stringify(items, null, 2));
};

main();
