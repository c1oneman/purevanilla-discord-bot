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
          title: "Pure Vanilla Vote",
          description: `Please visit the following URL to vote for Pure Vanilla!`,
          fields: [
            {
              name: "purevanilla.net/vote",
              value: "https://purevanilla.net/vote",
            }
          ],
          color: 0xffcb00,
        },
      ],
    });
  }
};
