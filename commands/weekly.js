const Discord = require("discord.js");
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;
module.exports.run = async (interaction, client) => {
  let embed = new Discord.MessageEmbed();

  let Current_Competition_Week = "3";
  let Current_Competition = "";
  const { options } = interaction.data;
  if (options != undefined) {
    Current_Competition = `week_${options[0].value}`;
    Current_Competition_Week = options[0].value;
  } else {
    Current_Competition = `week_${Current_Competition_Week}`;
  }

  var req = unirest(
    "GET",
    `${ServerTap_API}/v1/scoreboard/` + Current_Competition
  );

  req.headers({
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json",
    key: key,
  });

  req.end(function (res) {
    if (res.error) {
      console.log(`Error getting /v1/scoreboard/:, ${res.error}`);
      reply(
        interaction,
        client,
        "Error grabbing data, that week might not exist."
      );
    } else if (res.status == 200) {
      var scoreboard = res.body.scores;
      scoreboard = scoreboard.sort(compare);
      console.log(scoreboard);

      var finalMSG;
      embed.setTitle(res.body.displayName);
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
          embed.addField(
            `${finalMSG} - \`${val.value.toLocaleString()}\``,
            "\u200B",
            false
          );
        }
      }
      var now = new Date();
      embed
        .setAuthor(
          "Pure Vanilla Weekly Competition",
          "https://i.imgur.com/y4gEvak.png"
        )
        .setDescription(`Week ${Current_Competition_Week} - Top Scores`)
        .setFooter(`via. /weekly ${Current_Competition_Week}`)
        .setTimestamp(now)
        .setURL("https://minecraft.fandom.com/wiki/Cake")
        .setThumbnail(`https://mc-heads.net/avatar/${firstPlaceIGN}/100`)
        .setColor("#ffffff");
      reply(interaction, client, embed);
    }
  });
};
function compare(a, b) {
  if (a.value < b.value) {
    return 1;
  }
  if (a.value > b.value) {
    return -1;
  }
  return 0;
}

const reply = async (interaction, client, response) => {
  let data = {
    content: response,
  };

  // Check for embeds
  if (typeof response === "object") {
    data = await createAPIMessage(interaction, client, response);
  }

  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data,
    },
  });
};
const createAPIMessage = async (interaction, client, content) => {
  const { data, files } = await Discord.APIMessage.create(
    client.channels.resolve(interaction.channel_id),
    content
  )
    .resolveData()
    .resolveFiles();

  return { ...data, files };
};
module.exports.help = {
  name: "weekly",
};
