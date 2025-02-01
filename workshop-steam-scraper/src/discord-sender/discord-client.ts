import { REST } from "@discordjs/rest";
import {
  APIChannel,
  APIEmbed,
  RESTPostAPIChannelMessageResult,
  RESTPostAPICurrentUserCreateDMChannelResult,
  Routes,
} from "discord-api-types/v10";

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

  public sendMessageOnChannel = async (
    embed: APIEmbed
  ): Promise<RESTPostAPIChannelMessageResult> => {
    if (this.channel === null) throw new Error("Use setChannel before");
    return (await this.rest.post(Routes.channelMessages(this.channel.id), {
      body: { embeds: [embed] },
    })) as RESTPostAPIChannelMessageResult;
  };
}

export default DiscordClient;
