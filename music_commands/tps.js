const { SlashCommand } = require("slash-create");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;
var unirest = require("unirest");

module.exports = class extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "tps",
      description: "View current server tps.",

      guildIDs: process.env.DISCORD_GUILD_ID
        ? [process.env.DISCORD_GUILD_ID]
        : undefined,
    });
  }

  async run(ctx) {
    const { client } = require("..");
    console.log("finding tps");
    await ctx.defer();
    await unirest
      .post(`${ServerTap_API}/v1/server/exec`)
      .headers({
        key: `${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .send({
        command: "tps",
        time: 0,
      })
      .timeout(1000)
      .then(function (response) {
        console.log(response.body);
        let color = 0x44eb63;
        const titles = ["5 seconds","1 minute", "5 minutes", "15 minutes"];
        let fields = [];
        let parse = response.body
          .replace("TPS from last 5s, 1m, 5m, 15m: ", " ")
          .split(", ");
        switch (parse[2]) {
          case "20.0":
            color = 0x44eb63;
            break;
          default:
            color = 0xe8901c;
        }
        for (let i = 0; i < parse.length; i++) {
          fields = [
            ...fields,
            { name: titles[i], value: parse[i], inline: true },
          ];
          console.log("found tps");
        }

        return void ctx.sendFollowUp({
          embeds: [
            {
              title: "Ticks Per Second",
              description: `Average TPS from last:`,
              url: "https://minecraft.fandom.com/wiki/Tick",
              author: {
                name: "Pure Vanilla Status",
                icon_url: "https://i.imgur.com/y4gEvak.png",
              },
              fields: fields,
              color: color,
            },
          ],
        });
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
