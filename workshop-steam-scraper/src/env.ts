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

const getProxies = (): string => {
  const { PROXIE } = process.env;
  if (PROXIE === undefined || PROXIE === "") return "";
  return PROXIE;
};

export { getDiscordToken, getServerId, getProxies };
