const Discord = require('discord.js')

module.exports.run = async (bot, interaction) => {
  const embed1 = {
        "title": "play.purevanilla.net"
    };
  const embed2 = {
      "title": "creative.purevanilla.net"
  };
    bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        content: "Minecraft -> Multiplayer -> Add Server -> IP:",
        embeds: [
          embed1,embed2
        ]

        }
      }
  })}

module.exports.help = {
  name:"connect",
  aliases: ["ip"]
}