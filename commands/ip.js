const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
  const embed = {
    "title": "play.purevanilla.net"
  };
  message.channel.send({ embed });
}

module.exports.help = {
  name: "ip",
  aliases: ["connect"]
}