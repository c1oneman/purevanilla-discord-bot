const Discord = require('discord.js');
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'
var key = process.env.API_KEY;
module.exports.run = async (bot, message, args) => {
    if(!isRole(message.member, "Staff"))return;  
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
            message.channel.send("Reported TPS: **" + res.body.tps + "**");
          }
          else {
            message.channel.send('Could not reach server.');
          }
        });
}
function isRole(user, role) {
    return user.roles.cache.find(r => r.name === role) 
}

module.exports.help = {
    name: "tps",
    aliases: ["lag"]
}