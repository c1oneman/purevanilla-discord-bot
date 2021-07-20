const Discord = require("discord.js");

module.exports.run = async (interaction, client) => {
  let embed = new Discord.MessageEmbed()
    .setTitle("Pure Vanilla Vote Links")
    .addField(`MCSL`, "https://minecraft-server-list.com/server/457207/vote/")
    .addField(
      "PMC",
      "https://www.planetminecraft.com/server/purevanilla-4554187/vote/"
    )
    .addField("MMP", "https://minecraft-mp.com/server/252486/vote/");
  embed.setColor("#ffcb00");
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
  name: "vote",
};
