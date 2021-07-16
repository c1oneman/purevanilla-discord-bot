const Discord = require("discord.js");

module.exports.run = async (interaction, client) => {
  const guild = client.guilds.cache.get(interaction.guild_id);
  let embed = new Discord.MessageEmbed()
    .setTitle("Pure Vanilla Bot Help")
    //.addField("Get IP Address", "`/ip`")
    //.addField("Get dynmap URL", "`/map`")
    .addField("Get server status", "`/status`")
    .addField("Get list of online players", "`/list`")
    .addField("Get weekly comp. scores", "`/weekly`");
  //.addField("Get discord invite link", "`/discord`");

  if (isRole(interaction.member, guild, "Staff")) {
    embed.addField("STAFF | Whitelist", "`/whitelist <@Discord> <IGN>`");
    embed.addField("STAFF | Get reported TPS", "`/tps`");
    // embed.addField("STAFF | Get player UUID", "`/uuid`");
  }
  embed.setColor("#d8e60e");
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
function isRole(member, guild, role) {
  let roleID = guild.roles.cache.find((role) => role.name === "Staff");
  return member.roles.find((r) => r === roleID.id);
}
module.exports.help = {
  name: "help",
};
