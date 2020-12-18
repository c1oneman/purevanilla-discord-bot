const Discord = require('discord.js')

module.exports.run = async (bot, interaction) => {
    const guild = bot.guilds.cache.get(interaction.guild_id);
    var staffRole = guild.roles.cache.find(role => role.name === "Staff");


    let embed = new Discord.MessageEmbed()
    //.setTitle("PureVanilla Bot Help")
    .addField("Get IP Address", "`/ip`")
    .addField("Get dynmap URL", "`/map`")
    .addField("Get server status", "`/status`")
    .addField("Get weekly comp. scores [COMP_ID is Optional]", "`/weekly (COMP_ID)`")
    .addField("Get discord invite link", "`/discord`")
    if(isRoleInteraction(interaction, staffRole)) {
        embed.addField("STAFF | Whitelist", "`/whitelist [@Discord] [IGN]`")
        embed.addField("STAFF | Get reported TPS", "`/tps`")
    }
    embed.setColor("#e64b0e")
    bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          content: "PureVanilla Bot Help",
          embeds: [
            embed
          ]
  
          }
        }
    })
}
function isRoleInteraction(interaction, role) {
    return interaction.member.roles.includes(role.id)
}
module.exports.help = {
  name:"help",
  aliases: ["halp"]
}