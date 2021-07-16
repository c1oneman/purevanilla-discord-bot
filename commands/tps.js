const Discord = require("discord.js");
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;

module.exports.run = async (interaction, client) => {
  const guild = client.guilds.cache.get(interaction.guild_id);

  if (!isRole(interaction.member, guild, "Staff")) {
    reply(
      interaction,
      client,
      "Sorry, this command is currently reserved for Staff."
    );
  }
  var req = unirest("GET", `${ServerTap_API}/v1/server`);

  req.headers({
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json",
    key: key,
  });
  req.end(function (res) {
    if (res.status == 200) {
      // Server pinged back
      reply(interaction, client, "Reported TPS: **" + res.body.tps + "**");
    } else {
      reply(interaction, client, "Could not reach server.");
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
function isRole(member, guild, role) {
  let roleID = guild.roles.cache.find((roles) => roles.name === role);
  return member.roles.find((r) => r === roleID.id);
}
module.exports.help = {
  name: "tps",
};
