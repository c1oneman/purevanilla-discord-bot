const Discord = require('discord.js');
var unirest = require("unirest");
var key = process.env.API_KEY;
const { nanoid, customAlphabet } = require('nanoid')
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'

module.exports.run = async (bot, message, args) => {
    if (!isRole(message.member, "Staff")) return;
    if (!isRole(message.member, "Member")) return;
    if (isRole(message.member, "hasCreatedMarker_1") && !isRole(message.member, "Staff")) {
        message.channel.send('Sorry! Members are currently allowed to create just one marker on the dynmap.\n`Contact staff for help on how to change an existing marker.`')
        return
    };;
    console.log("args:", args)
    console.log(args.length)
    if (!(args.length == 3)) {
        message.channel.send('Invalid format. \n./marker x z TEXT_WITH_UNDERSCORE_SPACES')
        return
    };
    console.log(args)
    var secret = customAlphabet('1234567890abcdef', 6)
    var keySecret = `${message.member.displayName}_${secret()}` 
    var buildReq = unirest("POST", `${ServerTap_API}/v1/server/exec`);
    var headers = {
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json",
        "key": key
    };
    
    args[2] = args[2].replace('_', " ");
    const command = `dmarker add id:${keySecret} "${args[2].toString()}" world:world x:${args[0]} y:65 z:${args[1]}`
    var form = {
        "command": command,
        "time": 0
    }

    buildReq.headers(headers);
    buildReq.form(form);
    buildReq.end(function (res) {
        if (res.status == 200) {
            // 200
            message.channel.send(':white_check_mark: Marker generated! Please check your discord DM for a confirmation.');
            if (res.body.includes('Added marker')) {
                console.log('success detected')
                console.log(res.body)
                let role = message.guild.roles.cache.find(r => r.name === "hasCreatedMarker_1");
                message.member.roles.add(role).catch(console.error);
                message.author.send(`---------------------------------------\n**Greetings from Pure Vanilla! :icecream:**\nWe have created a Dynmap marker for you! You can view it on the Dynmap at x:${args[0]} z:${args[1]} in the overworld.\n**IMPORTANT!!** Take this \`ID\` for safekeeping!\n→\`${keySecret}\` \nYou will use it to update your marker. Anyone can use this code. ex: /remark **${keySecret}** X Y NEW_TEXT\n---------------------------------------`)
            }
        } else {
           // Failure
             message.channel.send(res.status);
        }
       
    });
    
}
function isRole(user, role) {
    return user.roles.cache.find(r => r.name === role)
}

module.exports.help = {
    name: "marker",
    aliases: ["mark"]
}