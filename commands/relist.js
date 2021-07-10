const Discord = require('discord.js');
var unirest = require("unirest");
var key = process.env.API_KEY;
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'

module.exports.run = async (bot, message, args) => {
    if (isRole(message.member, "relist") && !isRole(message.member, "Staff")) return;
    if (!(args.length == 1)) return;
    console.log(args)
    var survivalReq = unirest("POST", `${ServerTap_API}/v1/server/whitelist`);
    var headers = {
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json",
        "key": key
    };
    var form = {
        "name": args[0].toString()
    }
    survivalReq.headers(headers);
    

    survivalReq.form(form);
   
    let member = message.member;
    try {
        message.member.setNickname(args[0].toString());
    }
    catch {
        console.log('Failed to update nickname')
    }
    survivalReq.end(function (res) {
        if (res.status == 200) {
            if (member !== undefined) {
                let role = message.guild.roles.cache.find(r => r.name === "relist");
                member.roles.add(role).catch(console.error);
                var responseMsg = "User Whitelisted\n`IGN: " + args[0].toString() + "`" + "\n`Nickname Updated to IGN`" + "";
            } else {
                // member is undefined
                var responseMsg = "User not found in discord.";
            }
        } else {
            var responseMsg = "**Failed to Whitelist**\n`IGN: " + args[0].toString() + "`\n`Discord: `" + args[1].toString() + "\n" + "Please check the players IGN";
        }
        message.channel.send(responseMsg);
    });
    
}
function isRole(user, role) {
    return user.roles.cache.find(r => r.name === role)
}

module.exports.help = {
    name: "relist",
    aliases: ["rl"]
}