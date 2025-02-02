const url = new URL("https://steamcommunity.com/workshop/browse/");
import type { TWorkshopItem } from "./scraper-workshop.types";
import { load } from "cheerio";
const params = new URLSearchParams({
  appid: "252490",
  browsesort: "accepted",
  section: "mtxitems",
  actualsort: "actualsort",
});

url.search = params.toString();

const fetcherHtml = async (proxy?: string): Promise<string> => {
  const urlFetch = proxy ? proxy + url.href : url.href;
  const res = await fetch(urlFetch);
  if (!res.ok) throw new Error("Invalid fetch");
  return res.text();
};

const parseHtml = (html: string): TWorkshopItem[] => {
  const scrapedData: TWorkshopItem[] = [];
  const $ = load(html);
  
  $("div.workshopItem").each((index, element) => {
    const elementDOMTree = $(element);
    const workshopUrl = elementDOMTree.find("a.ugc").attr("href") || "";
    const itemName = elementDOMTree.find("div.workshopItemTitle").text().trim();
    const imageUrl =
      elementDOMTree.find("img.workshopItemPreviewImage").attr("src") || "";
    const authorElement = elementDOMTree.find("div.workshopItemAuthorName a");
    const authorName = authorElement.text().trim();
    const authorLink = authorElement.attr("href") || "";
    scrapedData.push({
      index,
      title: itemName,
      itemUrl: workshopUrl,
      imageUrl,
      authorName,
      authorWorkshopUrl: authorLink.replace(/\/myworkshopfiles.*/, ""),
    });
  });
  return scrapedData;
};

export { fetcherHtml, parseHtml };
