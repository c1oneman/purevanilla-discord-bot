const { SlashCommand, CommandOptionType } = require("slash-create");
const { customAlphabet } = require("nanoid");

var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;
var unirest = require("unirest");

module.exports = class extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "delmarker",
      description: "Delete a dynmap marker.",
      guildIDs: process.env.DISCORD_GUILD_ID
        ? [process.env.DISCORD_GUILD_ID]
        : undefined,
      options: [
        {
          type: CommandOptionType.STRING,
          name: "id",
          description: "ID of marker on map to delete.",
          required: true,
        },
      ],
    });
  }

  async run(ctx) {
    const { client } = require("..");
    const guild = await client.guilds.cache.get(ctx.guildID);
    console.log(`/delmarker ${ctx.options.id}`);
    const color = 0x42f57b;
    await ctx.defer();
    let fields = [];
    console.log("Checking perms");
    const staffRole = guild.roles.cache.find((roles) => roles.name === "Staff");
    if (!ctx.member.roles.find((r) => r === staffRole.id)) {
      console.log("User is not staff!");
      return void ctx.sendFollowUp({
        embeds: [
          {
            title: "Uh oh!",
            description: `This command can only be run by staff.`,
            fields: [
              {
                name: "How to fix this?",
                value:
                  "Please contact staff to reset an existing marker under your name.",
              },
            ],
            color: 0xffcb00,
          },
        ],
      });
    }
    fields.push({
      name: "Marker ID",
      value: `\`${ctx.options.id}\``,
    });
    await unirest
      .post(`${ServerTap_API}/v1/server/exec`)
      .headers({
        key: `${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .send(`command=dmarker delete id:${ctx.options.id} set:1`)
      .timeout(1000)
      .then(async (response) => {
        console.log(response.body);
        if (response.body.toLowerCase().includes("error")) {
          return void ctx.sendFollowUp({
            embeds: [
              {
                title: "Uh oh!",
                description: `There was an error processing this request.`,
                fields: [
                  {
                    name: "How to fix this?",
                    value: "Please try deleting the marker again.",
                  },
                ],
                color: 0xffcb00,
              },
            ],
          });
        } else {
          return void ctx.sendFollowUp({
            embeds: [
              {
                title: "Marker Deleted",
                fields: fields,
                color: color,
                author: {
                  name: `Pure Vanilla Dynmap`,
                  icon_url: "https://i.imgur.com/y4gEvak.png",
                },
              },
            ],
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return void ctx.sendFollowUp({
          embeds: [
            {
              title: "Uh oh!",
              description: `There was an error processing this request.`,
              color: 0xffcb00,
            },
          ],
        });
      });
  }
};
