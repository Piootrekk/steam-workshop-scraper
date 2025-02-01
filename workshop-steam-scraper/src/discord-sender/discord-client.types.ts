type TGuildChannels = {
  id: string;
  type: number;
  last_message_id: string;
  flags: number;
  guild_id: string;
  name: string;
  rate_limit_per_user: number;
  topic: null | string;
  position: number;
  permission_overwrites: [];
  nsfw: boolean;
};

export type { TGuildChannels };
