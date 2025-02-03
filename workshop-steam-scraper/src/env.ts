import { config } from "dotenv";
import { URL } from "url";

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

export { getDiscordToken, getServerId, getProxy };
