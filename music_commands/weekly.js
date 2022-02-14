const { SlashCommand, CommandOptionType } = require("slash-create");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;
var unirest = require("unirest");

module.exports = class extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "weekly",
      description: "View current server competition scores.",
      options: [
        {
          type: CommandOptionType.INTEGER,
          name: "week",
          description: "What competiton would you like to pull up?",
          required: false,
        },
      ],
      guildIDs: process.env.DISCORD_GUILD_ID
        ? [process.env.DISCORD_GUILD_ID]
        : undefined,
    });
  }

  async run(ctx) {
    //const { client } = require("..");
    const week = "" + weeksBetween();
    const week_id = ctx.options.week
      ? `week_${ctx.options.week}`
      : `week_${week}`;
    if(week_id == 'week_9') {
      week_id == 'ts_AnimalsBred'
    }
    console.log("/weekly");
    console.log(week, weeksBetween());
    await ctx.defer();
    await unirest
      .get(`${ServerTap_API}/v1/scoreboard/${week_id}`)
      .headers({
        key: `${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .timeout(1000)
      .then(function (res) {
        console.log(res.body);
        let color = 0x44eb63;
        var now = new Date();
        var scoreboard = res.body.scores;
        scoreboard = scoreboard.sort(compare);
        console.log(scoreboard);
        let fields = [];
        var finalMSG;
        const title = res.body.displayName;
        let i = 0;
        let firstPlaceIGN;
        for (let val of scoreboard) {
          i++;
          if (i < 6) {
            console.log(val.entry);

            let extra = "";
            switch (i) {
              case 1:
                firstPlaceIGN = val.entry;
                extra = "🥇";
                break;
              case 2:
                extra = "🥈";

                break;
              case 3:
                extra = "🥉";

                break;
              default:
                extra = "  " + i + ". ";
            }
            finalMSG = "\n" + extra + " " + val.entry;
            fields = [
              ...fields,
              {
                name: `${finalMSG} - \`${val.value.toLocaleString()}\``,
                value: "\u200B",
                inline: false,
              },
            ];
          }
        }
        return void ctx.sendFollowUp({
          embeds: [
            {
              title: title,
              description: `Weekly - Top Scores`,
              author: {
                name: "Pure Vanilla Weekly Competition",
                icon_url: "https://i.imgur.com/y4gEvak.png",
              },
              thumbnail: {
                url: `https://mc-heads.net/avatar/${firstPlaceIGN}/100`,
              },
              fields: fields,
              color: color,
              footer: {
                text: `via. /weekly week:${week}`,
              },
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
              description: `There was an error processing this request. :fire:`,
              color: 0xffcb00,
            },
          ],
        });
      });
  }
};
function weeksBetween() {
var d1 = new Date();
var d2 = new Date(2022,1,1);
d2.setHours(13);
return Math.round(((d1 - d2) / (7 * 24 * 60 * 60 * 1000)));
}
function compare(a, b) {
  if (a.value < b.value) {
    return 1;
  }
  if (a.value > b.value) {
    return -1;
  }
  return 0;
}
