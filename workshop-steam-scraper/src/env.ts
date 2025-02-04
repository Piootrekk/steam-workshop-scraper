import { config } from "dotenv";

config();

const getDiscordToken = (): string => {
  const { DC_BOT_TOKEN } = process.env;
  if (DC_BOT_TOKEN === undefined || DC_BOT_TOKEN === "") {
    throw new Error("ENV DC_BOT_TOKEN NOT EXIST");
  }
  return DC_BOT_TOKEN;
};

const getServerId = (): string => {
  const { SERVER_ID } = process.env;
  if (SERVER_ID === undefined || SERVER_ID === "")
    throw new Error("ENV SERVER_ID NOT EXIST ");
  return SERVER_ID;
};

const getProxy = (): string => {
  const { PROXY } = process.env;
  if (PROXY === undefined || PROXY === "") return "";
  return PROXY;
};

const getUrlToParse = (): string => {
  const { URL_TO_PARSE } = process.env;
  if (URL_TO_PARSE === undefined || URL_TO_PARSE === "")
    throw new Error("ENV URL_TO_PARSE NOT EXIST ");
  return URL_TO_PARSE;
};

const getTimeStamp = (): string => {
  const { TIME_STAMP } = process.env;
  if (TIME_STAMP === undefined || TIME_STAMP === "")
    throw new Error("ENV TIME_STAMP NOT EXIST ");
  return TIME_STAMP;
};

export { getDiscordToken, getServerId, getProxy, getUrlToParse, getTimeStamp };
