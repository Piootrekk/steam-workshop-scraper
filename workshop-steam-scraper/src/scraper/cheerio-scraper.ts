import { load } from "cheerio";
import { TWorkshopItem } from "./scraper-workshop.types";

const parseHtml = (
  html: string,
  itemPerPage = 0,
  currentPage = 0
): TWorkshopItem[] => {
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
      index: index + currentPage * itemPerPage,
      title: itemName,
      itemUrl: workshopUrl,
      imageUrl,
      authorName,
      authorWorkshopUrl: authorLink.replace(/\/myworkshopfiles.*/, ""),
    });
  });
  return scrapedData;
};

export { parseHtml };
