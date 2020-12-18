const Discord = require('discord.js');
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'
var key = process.env.API_KEY;
module.exports.run = (bot, interaction) => {
    const guild = bot.guilds.cache.get(interaction.guild_id);
    var staffRole = guild.roles.cache.find(role => role.name === "Staff");
    if(!isRole(interaction, staffRole))return;
    
    
    
    var unirest = require("unirest");
    var req = unirest("GET", `${ServerTap_API}/v1/server`);

          req.headers({
            "content-type": "application/x-www-form-urlencoded",
            "accept": "application/json",
            "key": key
          });
          req.end(function (res) {
            if (res.status == 200) {
         
            // Server pinged back
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                  content: `Reported TPS: **${res.body.tps}**`
                  }
                }
            })
           
          }
          else {
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                  content: 'Could not reach server.'
                  }
                }
            })
          }
        });
}
function isRole(interaction, role) {
    return interaction.member.roles.includes(role.id)
}

module.exports.help = {
    name: "tps",
    aliases: ["lag"]
}