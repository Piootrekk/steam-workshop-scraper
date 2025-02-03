import { existsSync, readFileSync, writeFileSync } from "fs";

const filePath = "./scraped-items.json";

const isExistLocalJSON = (): boolean => {
  if (!existsSync(filePath)) {
    return false;
  }
  return true;
};

const getDataFromJSON = <T>(): T => {
  const data: T = JSON.parse(readFileSync(filePath, "utf-8"));
  return data;
};

const setDataToJSON = <T>(item: T): void => {
  writeFileSync(filePath, JSON.stringify(item, null, 2));
};

export { isExistLocalJSON, getDataFromJSON, setDataToJSON };
