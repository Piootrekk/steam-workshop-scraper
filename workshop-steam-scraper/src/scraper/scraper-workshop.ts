import { parseHtml } from "./cheerio-scraper";
import {
  getDataFromJSON,
  isExistLocalJSON,
  setDataToJSON,
} from "./json-parser";
import type { TWorkshopItem } from "./scraper-workshop.types";

enum FindState {
  NOT_EXIST = -1,
  NOT_CHANGE = 0,
}

class ScraperWorkshop {
  private url: URL;
  private proxy: string;
  private items: TWorkshopItem[] = [];
  protected maxItemPerPage = 30;

  public constructor(url: string | URL, proxy: string) {
    this.url = new URL(url);
    this.proxy = proxy;
  }

  public get getUrl() {
    return this.url;
  }

  private set setItems(items: TWorkshopItem[]) {
    this.items = items;
  }

  public get getItems() {
    return this.items;
  }

  private saveFileIfNotExist = async (): Promise<void> => {
    const rawHtml = await this.fetcherHtml(this.url);
    const parsedItems = parseHtml(rawHtml);
    this.setItems = parsedItems;
    setDataToJSON(parsedItems);
  };

  private fetcherHtml = async (url: URL): Promise<string> => {
    const urlFetch = this.proxy ? this.proxy + url.href : url.href;
    const res = await fetch(urlFetch);
    if (!res.ok) throw new Error("Invalid fetch");
    return res.text();
  };

  private getItemsPerPage = async (page: number): Promise<TWorkshopItem[]> => {
    const newUrl = new URL(this.url);
    newUrl.searchParams.set("p", page.toString());
    const rawHtml = await this.fetcherHtml(newUrl);
    const parsedItems = parseHtml(rawHtml, page);
    if (parsedItems.length === 0) throw new Error("No item to load");
    return parsedItems;
  };

  public dataSynchronizer = async (): Promise<void> => {
    if (!isExistLocalJSON()) {
      await this.saveFileIfNotExist();
      return;
    }
    const jsonItems = getDataFromJSON<TWorkshopItem[]>();
    let borderItem = FindState.NOT_EXIST;
    let currentPage = 1;
    let parsedItems: TWorkshopItem[] = [];
    while (borderItem === FindState.NOT_EXIST) {
      parsedItems = await this.getItemsPerPage(currentPage);
      borderItem = parsedItems.findIndex(
        (val) => val.title === jsonItems[0].title
      );
      if (borderItem === FindState.NOT_CHANGE) {
        return;
      }
      currentPage++;
    }
    const trimmedData = parsedItems.slice(0, borderItem);
    console.log(trimmedData);
    this.setItems = trimmedData;
    setDataToJSON(trimmedData);
  };
}

export default ScraperWorkshop;
