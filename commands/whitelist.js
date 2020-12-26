const Discord = require('discord.js');
var unirest = require("unirest");
var key = process.env.API_KEY;
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'
var Creative_ServerTap_API = process.env.PUREVANILLA_CREATIVE_SERVER_ENDPOINT || 'localhost:25566'

module.exports.run = async (bot, message, args) => {
    if (!isRole(message.member, "Staff")) return;
    if (!(args.length == 2)) return;
    console.log(args)
    var survivalReq = unirest("POST", `${ServerTap_API}/v1/server/whitelist`);
    var creativeReq = unirest("POST", `${Creative_ServerTap_API}/v1/server/whitelist`);
    var headers = {
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json",
        "key": key
    };
    var form = {
        "name": args[1].toString()
    }
    survivalReq.headers(headers);
    creativeReq.headers(headers);

    survivalReq.form(form);
    creativeReq.form(form);
    let member = message.mentions.members.first();
    try {
        message.mentions.members.first().setNickname(args[1].toString());
    }
    catch {
        console.log('Failed to update nickname')
    }
    survivalReq.end(function (res) {
        if (res.status == 200) {
            if (member !== undefined) {
                let role = message.guild.roles.cache.find(r => r.name === "Member");
                member.roles.add(role).catch(console.error);
                var responseMsg = "User Whitelisted\n`IGN: " + args[1].toString() + "` \n`Discord: `" + args[0].toString() + " ` `\n`Nickname Updated to IGN`\n\n" + "**play.purevanilla.net**";
            } else {
                // member is undefined
                var responseMsg = "User not found in discord.";
            }
        } else {
            var responseMsg = "**Failed to Whitelist**\n`IGN: " + args[1].toString() + "`\n`Discord: `" + args[1].toString() + " ` `\n" + "Please check the players IGN";
        }
        message.channel.send(responseMsg);
    });
    creativeReq.end(function (res) {
        if (res.status == 200) {
            console.log('Creative whitelist success')
            responseMsg = "";
        } else {
            responseMsg = "**Creative failed to whitelist..** `/status`";
        }
        message.channel.send(responseMsg);
    });
}
function isRole(user, role) {
    return user.roles.cache.find(r => r.name === role)
}

module.exports.help = {
    name: "whitelist",
    aliases: ["relist"]
}