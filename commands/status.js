
mcping = require('mc-ping');

var ServerIP = process.env.SERVER_IP || 'play.purevanilla.net'
var CreativeServerIP = 'creative.purevanilla.net'

const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
  mcping(`${ServerIP}`, 25565, function (err, res) {
    var final = '';
    if (err) {
      console.log(err);
      final = ":red_circle: Pure Vanilla is `offline`";
    } else {
      console.log(res);
      final = ":green_circle: Pure Vanilla is `online` with " + res['num_players'] + " players.\n";
      mcping(`${CreativeServerIP}`, 25565, function (err, res) {
        if (err) {
          console.log(err);
          final = final + ":red_circle: Pure Vanilla Creative is `offline`";
        } else {
          console.log(res);
          final = final + ":green_circle: Pure Vanilla Creative is `online` with " + res['num_players'] + " players.";
        }
        message.channel.send(final)
      }, 3000);


    }
  }, 3000);

}

module.exports.help = {
  name: "status",
  aliases: ["online"]
}