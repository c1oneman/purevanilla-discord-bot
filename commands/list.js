const Discord = require("discord.js");
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;

module.exports.run = async (interaction, client) => {
  var req = unirest("GET", `${ServerTap_API}/v1/players`);

  req.headers({
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json",
    key: key,
  });

  req.end(function (res) {
    if (res.status == 200) {
      var response = res.body;
      var final = [];
      var regex = /\u00A7[0-9A-Z]/gi;
      response.forEach((player) => {
        final.push("`" + player.displayName.replace(regex, "") + "`");
      });
      // Server pinged back
      console.log(final);
      reply(
        interaction,
        client,
        `Server online with **${final.length}** players.\n${final.join(", ")}`
      );
    } else {
      reply(interaction, client, `Something went wrong.`);
    }
  });
};
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
  name: "list",
};
