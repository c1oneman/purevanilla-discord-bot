const Discord = require("discord.js");

module.exports.run = async (interaction, client) => {
  let embed = new Discord.MessageEmbed()
    .setTitle("Pure Vanilla Dynmap")
    .setURL("https://map.purevanilla.net/");
  embed.setColor("#fff");
  reply(interaction, client, embed);
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
  name: "map",
};
