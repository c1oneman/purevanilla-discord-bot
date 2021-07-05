const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
  const embed = {
    "title": "localhost"
  };
  message.channel.send({ embed });
}

module.exports.help = {
  name: "ip",
  aliases: ["connect"]
}