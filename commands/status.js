
mcping = require('mc-ping');

var ServerIP = process.env.SERVER_IP || 'play.purevanilla.net'

const Discord = require('discord.js')

  module.exports.run = async (bot, message, args) => {
    mcping(`${ServerIP}`, 25565, function (err, res) {
        if (err) {
          console.log(err);
          message.channel.send(":red_circle: Pure Vanilla is `offline`");
        } else {
          console.log(res);
          message.channel.send(":green_circle: Pure Vanilla is `online` with " + res['num_players'] + " players.");
        }
      }, 3000);
  }
  
  module.exports.help = {
    name:"status",
    aliases: ["online"]
  }