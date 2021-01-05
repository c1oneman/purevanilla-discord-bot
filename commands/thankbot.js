const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    var responses = ['no', 'np', 'ur welcome', 'just doin my job', 'lmao', 'thanks doesnt pay the bills', 'ok'];
    var randomIndex = Math.floor(Math.random() * responses.length);
    var randomElement = responses[randomIndex];
    message.channel.send(randomElement);
}

module.exports.help = {
    name: "thankbot",
    aliases: ["thank"]
}