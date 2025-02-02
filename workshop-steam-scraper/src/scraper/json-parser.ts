import { existsSync, readFileSync, writeFileSync } from "fs";

const filePath = "./scraped-items.json";

const isFileExist = (): boolean => {
  if (!existsSync(filePath)) {
    return false;
  }
  return true;
};

const getDataFromFile = <T>(): T => {
  const data: T = JSON.parse(readFileSync(filePath, "utf-8"));
  return data;
};

const setData = <T>(item: T) => {
  writeFileSync(filePath, JSON.stringify(item, null, 2));
};

export { getDataFromFile, setData, isFileExist };
