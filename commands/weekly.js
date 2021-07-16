const Discord = require("discord.js");
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;
module.exports.run = async (interaction, client) => {
  let embed = new Discord.MessageEmbed().setTitle("Weekly Competition");
  const Current_Competition = "week_1";
  embed.setColor("#d8e60e");
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
      reply(interaction, client, "Error grabbing data.");
    } else if (res.status == 200) {
      var scoreboard = res.body.scores;
      scoreboard = scoreboard.sort(compare);
      console.log(scoreboard);

      var finalMSG =
        "**Weekly Competition Scores:**  \n*" + res.body.displayName + "*";
      var i = 0;
      for (let val of scoreboard) {
        i++;
        if (i < 11) {
          console.log(val.entry);
          var extra = "";
          switch (i) {
            case 1:
              extra = "🥇";
            case 2:
              extra = "🥈";
            case 3:
              extra = "🥉";
            default:
              extra = "  " + i + ". ";
          }
          finalMSG =
            finalMSG + "\n" + extra + " " + val.entry + "  `" + val.value + "`";
        }
      }
    }
    reply(interaction, client, finalMSG);
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
