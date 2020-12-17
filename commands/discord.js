const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    const embed = {
        "title": "discord.purevanilla.net",
        "url": "http://discord.purevanilla.net"
    };
    message.channel.send({ embed });
}

module.exports.help = {
  name:"discord",
  aliases: ["invite"]
}