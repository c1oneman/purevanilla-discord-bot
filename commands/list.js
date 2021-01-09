const Discord = require('discord.js');
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'
var key = process.env.API_KEY;
module.exports.run = async (bot, message, args) => {
    message.channel.send(' :loading: ');
    //if (!isRole(message.member, "Staff")) return;
    var unirest = require("unirest");
    var req = unirest("GET", `${ServerTap_API}/v1/players`);

    req.headers({
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json",
        "key": key
    });
    req.end(function (res) {
        if (res.status == 200) {
            var response = res.body
            var final = []
            var regex = /\u00A7[0-9A-Z]/ig;
            response.forEach(player => {
                final.push('`' + player.displayName.replace(regex, '') + '`')
            });
            // Server pinged back
            message.channel.send(`Server online with **${final.length}** players.\n${final.join(', ')}`);
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
    name: "list",
    aliases: ["playerlist"]
}