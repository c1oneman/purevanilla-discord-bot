
mcping = require('mc-ping');

var ServerIP = process.env.SERVER_IP || 'play.purevanilla.net'

const Discord = require('discord.js')

  module.exports.run = async (bot, interaction) => {
    mcping(`${ServerIP}`, 25565, function (err, res) {
        if (err) {
          console.log(err);
          bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
              content: ":red_circle: Pure Vanilla is `offline`"
              }
            }
        })
        } else {
          console.log(res);
         
          bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
              content: ":green_circle: Pure Vanilla is `online` with " + res['num_players'] + " players."
              }
            }
        })
        }
      }, 3000);
  }
  
  module.exports.help = {
    name:"status",
    aliases: ["online"]
  }