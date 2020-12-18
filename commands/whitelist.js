const Discord = require('discord.js');
var unirest = require("unirest");
var key = process.env.API_KEY;
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'
var Creative_ServerTap_API = process.env.PUREVANILLA_CREATIVE_SERVER_ENDPOINT || 'localhost:25566'

module.exports.run =  (bot, interaction) => {
    const guild = bot.guilds.cache.get(interaction.guild_id);
    var staffRole = guild.roles.cache.find(role => role.name === "Staff");
    if(!isRole(interaction, staffRole))return;

    var memberRole = guild.roles.cache.find(role => role.name === "Member");
    var options = interaction.data.options

    var member = guild.members.fetch(options[0].value)
    member.then(member => {
        if(!isRole(interaction, memberRole)) {
            member.roles.add(memberRole);
            member.setNickname(options[1].value)
            //console.log(member.user.username);
        }
    }) 
    
    


    var survivalReq = unirest("POST", `${ServerTap_API}/v1/server/whitelist`);
    var creativeReq = unirest("POST", `${Creative_ServerTap_API}/v1/server/whitelist`);
    var headers = {
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json",
        "key": key
    };
    var form = {
        "name": options[1].value
    }
    survivalReq.headers(headers);
    creativeReq.headers(headers);

    survivalReq.form(form);
    creativeReq.form(form);
    var responseMsg = '';
   
    survivalReq.end(function (res) {
        if (res.status == 200) {
             //interaction.member.roles.set
             responseMsg = "User Whitelisted\n`IGN: " + options[1].value + "` \n`Discord: `" + options[0].value + " ` `\n`Nickname Updated to IGN`\n\n" + "**play.purevanilla.net**";
        
        } else {
             responseMsg = "**Failed to Whitelist**\n`IGN: " + options[1].value + "`\n`Discord: `" + options[0].value + " ` `\n" + "Please check the players IGN";
        }
    });
    creativeReq.end(function (res) {
        if (res.status == 200) {
            console.log('Creative whitelist success')
            
        } else {
            responseMsg = responseMsg +  "\n**Creative failed to whitelist..** `/status`";
        }
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
              content: `${responseMsg}`
              }
            }
        })
    });
}
function isRole(interaction, role) {
    return interaction.member.roles.includes(role.id)
}

module.exports.help = {
    name: "whitelist",
    aliases: ["relist"]
}