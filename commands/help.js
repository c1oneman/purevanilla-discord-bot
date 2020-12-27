
const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
  if (!message.content.startsWith('/')) return;


  let embed = new Discord.MessageEmbed()
    .setTitle("PureVanilla Bot Help")
    .addField("Get IP Address [Alias: /connect]", "`/ip`")
    .addField("Get dynmap URL [Alias: /dynmap]", "`/map`")
    .addField("Get server status [Alias: /online]", "`/status`")
    .addField("Get list of online players [Alias: /playerlist]", "`/list`")
    .addField("Get weekly comp. scores [Alias: /comp]", "`/weekly`")
    .addField("Get discord invite link [Alias: /invite]", "`/discord`")
  if (isRole(message.member, "Staff")) {
    embed.addField("STAFF | Whitelist [Alias: /wl]", "`/whitelist [@Discord] [IGN]`")
    embed.addField("STAFF | Get reported TPS [Alias: /lag]", "`/tps`")
    embed.addField("STAFF | Get player UUID", "`/uuid`")
  }
  embed.setColor("#e64b0e")
  message.channel.send(embed)
}
function isRole(user, role) {
  return user.roles.cache.find(r => r.name === role)
}
module.exports.help = {
  name: "help",
  aliases: ["halp"]
}