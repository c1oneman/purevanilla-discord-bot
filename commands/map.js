const Discord = require('discord.js')

module.exports.run = async (bot, interaction) => {
    const embed = {
        "title": "map.purevanilla.net",
        "url": "http://map.purevanilla.net"
    };
    bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        content: "Access the dynmap:",
        embeds: [
          embed
        ]

        }
      }
  })
}

module.exports.help = {
  name:"map",
  aliases: ["dynmap"]
}