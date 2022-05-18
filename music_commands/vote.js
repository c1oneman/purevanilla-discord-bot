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
          description: `Vote sites are now disconnected in anticipation of closure.`,
          color: 0xffcb00,
        },
      ],
    });
  }
};
