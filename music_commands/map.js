const { SlashCommand } = require("slash-create");

module.exports = class extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "map",
      description: "View dynmap links.",

      guildIDs: process.env.DISCORD_GUILD_ID
        ? [process.env.DISCORD_GUILD_ID]
        : undefined,
    });
  }

  async run(ctx) {
    const { client } = require("..");

    await ctx.defer();

    return void ctx.sendFollowUp({
      embeds: [
        {
          title: "Pure Vanilla Dynmap",
          description: `Click to open the dynamp!`,
          url: "https://map.purevanilla.net/",
          author: {
            name: "Pure Vanilla Dynmap",
          },
          footer: {
            text: "Run discord command /marker to add a marker.",
          },
          fields: [
            {
              name: "Overworld",
              value: "https://map.purevanilla.net/",
            },
            {
              name: "Overworld 3D",
              value:
                "https://map.purevanilla.net/?worldname=world&mapname=surface&zoom=0&x=240&y=64&z=189",
            },
            {
              name: "End",
              value:
                "https://map.purevanilla.net/?worldname=world_the_end&mapname=flat&zoom=1&x=2&y=64&z=0",
            },
            {
              name: "Nether Tunnels",
              value:
                "https://map.purevanilla.net/?worldname=world_nether&mapname=flat&zoom=2&x=41&y=64&z=76",
            },
            {
              name: "Nether Roof",
              value:
                "https://map.purevanilla.net/?worldname=world_nether&mapname=roof&zoom=1&x=-574&y=64&z=180",
            },
          ],
          color: 0xffcb00,
        },
      ],
    });
  }
};
