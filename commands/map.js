const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    const embed = {
        "title": "map.purevanilla.net",
        "url": "http://map.purevanilla.net"
    };
    message.channel.send({ embed });
}

module.exports.help = {
  name:"map",
  aliases: ["dynmap"]
}