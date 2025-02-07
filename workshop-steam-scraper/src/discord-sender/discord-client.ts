import { REST } from "@discordjs/rest";
import {
  APIChannel,
  APIEmbed,
  APIEmbedField,
  RESTPostAPIChannelMessageResult,
  Routes,
} from "discord-api-types/v10";
import { TWorkshopItem } from "../scraper/scraper-workshop.types";

enum DcLimits {
  TITLE_LIMIT = 256,
  DESCRIPTION_LIMIT = 4096,
  FIELDS_LIMIT = 25,
  FIELD_NAME_LIMIT = 256,
  FIELD_VALUE_LIMIT = 1024,
  TOTAL_WORDS_LIMIT = 6000,
}

class DiscordClient {
  private rest: REST;
  private channel: APIChannel | null = null;
  private serverId: string;

  public constructor(token: string, serverId: string) {
    this.rest = new REST({ version: "10" }).setToken(token);
    this.serverId = serverId;
  }

  public get getChannel() {
    return this.channel;
  }

  private findCorrectChannel = (
    name: string,
    channels: APIChannel[]
  ): APIChannel => {
    if (channels.length === 0) throw new Error("No server found");
    const channel = channels.find((channel) => channel.name === name);
    if (channel) return channel;
    return channels[0];
  };

  private getAllServerChattableChannels = async (
    guildId: string
  ): Promise<APIChannel[]> => {
    const channels = (await this.rest.get(
      Routes.guildChannels(guildId)
    )) as APIChannel[];
    return channels.filter((channel) => channel.type === 0);
  };

  public setChannel = async (name: string) => {
    const allServrChannels = await this.getAllServerChattableChannels(
      this.serverId
    );
    this.channel = this.findCorrectChannel(name, allServrChannels);
  };

  private truncateLimits = (str: string, maxLength: number) =>
    str.length > maxLength ? str.substring(0, maxLength - 3) + "..." : str;

  private truncateFields = (fields: APIEmbedField[]): APIEmbedField[] => {
    if (fields.length > DcLimits.FIELDS_LIMIT) {
      const trimmedFields = fields.slice(0, DcLimits.FIELDS_LIMIT - 1);
      const newField: APIEmbedField = {
        name: "Others",
        value: "...",
      };
      trimmedFields.push(newField);
      return trimmedFields;
    }
    return fields;
  };

  private sendMessageOnChannel = async (
    embeds: APIEmbed[]
  ): Promise<RESTPostAPIChannelMessageResult> => {
    if (this.channel === null) throw new Error("Use setChannel before");
    const message = (await this.rest.post(
      Routes.channelMessages(this.channel.id),
      {
        body: {
          content: `@everyone`,
          embeds: embeds,
        },
      }
    )) as RESTPostAPIChannelMessageResult;
    return message;
  };

  public sendNotificationItemsRotation = async (
    items: TWorkshopItem[],
    workshopUrl?: string
  ) => {
    const embed: APIEmbed = {
      title: `New Workshop Rotation - ${new Date().toLocaleString()} `,
      description: `${items.length} new item(s) have been added to workshop`,
      color: 0x00ff00,
      url: workshopUrl,
      thumbnail: {
        url: "https://community.fastly.steamstatic.com/public/shared/images/responsive/header_logo.png",
      },
      fields: this.truncateFields(
        items.map((item) => {
          return {
            name: item.title,
            value: `[${item.authorName}](${item.authorWorkshopUrl})`,
          };
        })
      ),
    };
    await this.sendMessageOnChannel([embed]);
  };
}

export default DiscordClient;
