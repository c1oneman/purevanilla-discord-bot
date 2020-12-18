const Discord = require('discord.js')

module.exports.run = async (bot, interaction) => {
    const embed = {
        "title": "discord.purevanilla.net",
        "url": "http://discord.purevanilla.net"
    };
    bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        content: "Access the discord:",
        embeds: [
          embed
        ]

        }
      }
  })
}

module.exports.help = {
  name:"discord",
  aliases: ["invite"]
}