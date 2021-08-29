const { SlashCommand } = require("slash-create");

module.exports = class extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "vote",
      description: "View current vote sites.",

      guildIDs: process.env.DISCORD_GUILD_ID
        ? [process.env.DISCORD_GUILD_ID]
        : undefined,
    });
  }

  async run(ctx) {
    //const { client } = require("..");

    await ctx.defer();

    return void ctx.sendFollowUp({
      embeds: [
        {
          title: "Pure Vanilla Vote Links",
          description: `You may vote up to 1 time per day!`,
          fields: [
            {
              name: "MCSL",
              value: "https://minecraft-server-list.com/server/457207/vote/",
            },
            {
              name: "PMC",
              value:
                "https://www.planetminecraft.com/server/purevanilla-4554187/vote/",
            },
            {
              name: "MMP",
              value: "https://minecraft-mp.com/server/252486/vote/",
            },
          ],
          color: 0xffcb00,
        },
      ],
    });
  }
};
