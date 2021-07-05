const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  message.delete()
  message.author.send("./remark command can only be sent to me directly!")
}


module.exports.help = {
  name: "remark",
  aliases: ["remarker"]
}