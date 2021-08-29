const { SlashCommand } = require("slash-create");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;
var unirest = require("unirest");

module.exports = class extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "list",
      description: "View current online (survival) players.",

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
      .get(`${ServerTap_API}/v1/players`)
      .headers({
        key: `${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .then(async (res) => {
        let response = res.body;
        let final = [];
        console.log(res.body);
        let regex = /\u00A7[0-9A-Z]/gi;
        response.forEach((player) => {
          final.push("`" + player.displayName.replace(regex, "") + "`");
        });
        // Server pinged back
        console.log(final);

        let playerlist = await final.join(", ");
        return void ctx.sendFollowUp({
          embeds: [
            {
              title: `Server online with **${final.length}** players.`,
              description: `${playerlist}`,
              author: {
                name: "Pure Vanilla Status",
                icon_url: "https://i.imgur.com/y4gEvak.png",
              },
              color: 0x42f57b,
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
