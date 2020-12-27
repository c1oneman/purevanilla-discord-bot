const Discord = require('discord.js');
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'
var key = process.env.API_KEY;
module.exports.run = async (bot, message, args) => {
    if (!isRole(message.member, "Staff")) return;
    var unirest = require("unirest");
    var username = args[0];
    var req = unirest("GET", `https://api.mojang.com/users/profiles/minecraft/${username}`);
    req.headers({
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json",
    });
    req.end(function (res) {
        if (res.status == 200) {
            // Mojang pinged back
            message.channel.send("Name: `" + res.body.name + "`\nUUID: `" + res.body.id + "`\n");
        }
        else {
            message.channel.send('Could not reach Mojang API.');
        }
    });
}
function isRole(user, role) {
    return user.roles.cache.find(r => r.name === role)
}

module.exports.help = {
    name: "uuid",
    aliases: []
}