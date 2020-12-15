
require('dotenv').config();
mcping = require('mc-ping');
schedule = require('node-schedule');
const Discord = require('discord.js');

const client = new Discord.Client();

var minutes = 1, interval = minutes * 60 * 1000;

var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'
var Creative_ServerTap_API = process.env.PUREVANILLA_CREATIVE_SERVER_ENDPOINT || 'localhost:25566'
var ServerIP = process.env.SERVER_IP || 'play.purevanilla.net'
var Creative_ServerIP = process.env.CREATIVE_SERVER_IP || 'creative.purevanilla.net'
var Current_Competition = "dec2";
var maintenanceEnabled = false;
var key = process.env.API_KEY;
var generalChatID = process.env.GENERAL_ID
// Logic/Helper functions
var autoNight = schedule.scheduleJob({hour: 6, minute: 0}, function(){
  randomImage();
});
var autoDay = schedule.scheduleJob({hour: 20, minute: 12}, function(){
  randomImage();
});

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function compare(a, b) {
  if (a.value < b.value) {
    return 1;
  }
  if (a.value > b.value) {
    return -1;
  }
  return 0;
}
function isStaff(user) {
  return user.roles.cache.find(r => r.name === "Staff") 
}

function isRole(user, role) {
  return user.roles.cache.find(r => r.name === role)
}

//Bot is running, start the timer for the ping check every 'minutes'

client.on('ready', () => {
  console.log(`Bot is now running as ${client.user.tag}!`);
  setInterval(function () {
    console.log("Pingback");
    ping();
  }, interval);
});



function whitelistCreative(ign, msg) {
  var unirest = require("unirest");

  console.log('calling creative whitelist');
  var req = unirest("POST", `${Creative_ServerTap_API}/v1/server/whitelist`);

  req.headers({
    "content-type": "application/x-www-form-urlencoded",
    "accept": "application/json",
    "key": key
  });

  req.form({
    "name": ign
  });

  req.end(function (res) {
    if (res.status == 200) {
      var responseMsg = "";
    }
    else {
      var responseMsg = "**Failed to whitelist on creative server.**";
    }
    msg.channel.send(responseMsg);
  });


}

function getUUID(ign) {
  var unirest = require("unirest");

  var req = unirest("GET", `https://playerdb.co/api/player/minecraft/${ign}`);

  req.headers({
    "accept": "application/json",
    "key": key
  });

  req.end(function (res) {
    console.log(res.body.data.player.id);
    const id = res.body.data.player.id
    if (id) {
      req = unirest("GET", `https://crafatar.com/avatars/${id}?size=32&default=MHF_Steve&overlay`);
      req.end(function (res) {
        console.log(res.body);
      });
    }
  }

  )
}
function randomImage() {
  var unirest = require("unirest");

    var req = unirest("GET", `https://api.imgur.com/3/album/MwsesR2`);

    req.headers({
      "accept": "application/json",
      "authorization": "Client-ID 4cde16da264b293"
    });
    req.end(function (res) {
      if (!res.body.error) {
        if(res.body.data.images) {
          var imagesObject = res.body.data.images;
          var randomObject = imagesObject[Math.floor(Math.random() * imagesObject.length)];
          console.log(randomObject.link);
          client.channels.cache.get(generalChatID).send(randomObject.link);
        };
      }
      else {
        console.log(res.body.error);
      }
    });
}
function ping() {
  if (maintenanceEnabled) {
    client.user.setActivity("Maintenance");
    return
  }
  mcping(`play.purevanilla.net`, 25565, function (err, res) {

    console.log(res)
    if (err) {
      // Some kind of error
      console.error(err);
      client.user.setActivity("Singleplayer");

    } else {
      // Success!
      console.log(res);

      client.user.setActivity("with " + res['num_players'] + " players");

    }

  });
}


client.on('message', msg => {
  var msgCon = msg.content

  msgCon = msgCon.split(" ");

  var govtAuctionChannelID = '759860958435737632'
  if (msg.channel.id == govtAuctionChannelID) {
    if(isStaff(msg.member)) {
      console.log("Message was from staff and in auction");
    }
    else {
      if (isNumeric(msg.content)) {
        console.log("Message may stay");
      }
      else {
        console.log("deleted:" + msg.content);
        msg.delete();
      }
      console.log("Message was not from staff in auction");

    }
    console.log('message was in govt. auction')
  }
  if (msg.content.toLowerCase() === '/ip') {
    msg.channel.send("**play.purevanilla.net**");
  }
  // status command
  if (msg.content.toLowerCase() === '/status') {
    if (maintenanceEnabled) {
      msg.channel.send(":red_circle: Pure Vanilla is currently under maintenance.");
      return
    }
    mcping(`${ServerIP}`, 25565, function (err, res) {
      if (err) {
        console.log(err);
        msg.channel.send(":red_circle: Pure Vanilla is `offline`");
      } else {
        console.log(res);
        msg.channel.send(":green_circle: Pure Vanilla is `online` with " + res['num_players'] + " players.");
      }
    }, 3000);
  }
  if (msg.content.toLowerCase() === '/help') {
    msg.channel.send("**Pure Vanilla Bot**\n/status - displays server status\n/weekly - displays weekly competition scores\n/vote - displays vote link\n/map - displays map link\n/invite - sends the discord invite link");
  }
  // link commands
  if (msg.content.toLowerCase() === '/map') {
    const embed = {
      "title": "map.purevanilla.net",
      "url": "http://map.purevanilla.net"
    };
    msg.channel.send({ embed });
  }
  if (msg.content.toLowerCase() === '/invite') {
    const embed = {
      "title": "discord.purevanilla.net",
      "url": "http://discord.purevanilla.net"
    };
    msg.channel.send({ embed });
  }
  if (msg.content.toLowerCase() === '/random') {
    randomImage();
  }
  if (msg.member.roles !== undefined && isStaff(msg.member)) {
    if ((msgCon.indexOf('/emoji') === 0)) {

      if (msgCon.length !== 2) {
        msg.channel.send("/emoji IGN");
      }
      else {
        var unirest = require("unirest");

        var req = unirest("GET", `https://playerdb.co/api/player/minecraft/${msgCon[1]}`);

        req.headers({
          "accept": "application/json",
        });


        req.end(function (res) {
          if (!res.body.error) {
            const id = res.body.data.player.id
            if (id) {

              const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Emoji generated')
                .setURL(`https://crafatar.com/avatars/${id}?size=32`)
                .setDescription(`${msgCon[1]}'s Emoji`)
                .setThumbnail(`https://crafatar.com/avatars/${id}?size=32`)
                .setFooter(`:${msgCon[1]}:`);
              msg.channel.send(exampleEmbed);
            }
          }


        }

        )
      }
    }
    if ((msgCon.indexOf('/status') === 0)) {
      mcping(`${Creative_ServerIP}`, 25565, function (err, res) {
        if (err) {
          console.log(err);
          msg.channel.send(":red_circle: Pure Vanilla Creative is `offline`");
        } else {
          console.log(res);
          msg.channel.send(":green_circle: Pure Vanilla Creative is `online` with " + res['num_players'] + " players.");
          let date_ob = new Date();
          let hours = date_ob.getHours();
  
  // current minutes
          let minutes = date_ob.getMinutes();
  
  // current seconds
        
        
          msg.channel.send(hours + ":" + minutes )
        }
      }, 3000);
    }
  }
  // challenge command
  if (msg.content.toLowerCase() === '/weekly') {
    
    var active = true;
    if (active) {
      var unirest = require("unirest");
      var req = unirest("GET", `${ServerTap_API}/v1/scoreboard/` + Current_Competition);

      req.headers({
        "postman-token": "d1067570-2314-7676-b2ad-7e4e81eac688",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json",
        "key": key
      });

      req.end(function (res) {
        if (res.error) {
          console.log(`Error getting /v1/scoreboard/:, ${res.error}`);
          msg.channel.send('Could not reach server.');
        }
        else if (res.status == 200) {
          var scoreboard = res.body.scores
          scoreboard = scoreboard.sort(compare);
          console.log(scoreboard);

          var finalMSG = "**Weekly Competition Scores**  \n\n*" + res.body.displayName + "*";
          var i = 0;
          for (let val of scoreboard) {
            i++;
            if (i < 11) {
              console.log(val.entry)
              var extra = "";

              if (i == 1) {
                extra = "🥇";
              }
              else if (i == 2) {
                extra = "🥈";
              }

              else if (i == 3) {
                extra = "🥉";
              }
              else {
                extra = "  " + i + ". "
              }
              finalMSG = finalMSG + "\n" + extra + " " + val.entry + "  `" + val.value + '`';
            }
          }

        }
        msg.channel.send(finalMSG);
      });

    }
  }
  if (msg.member.roles !== undefined) {
    if (isStaff(msg.member)) {
      if (msgCon.indexOf('/whitelist') === 0) {

        if (msgCon.length !== 3) {
          msg.channel.send("/whitelist @Discord IGN");
        }
        else {
          var unirest = require("unirest");
          var req = unirest("POST", `${ServerTap_API}/v1/server/whitelist`);

          req.headers({
            "content-type": "application/x-www-form-urlencoded",
            "accept": "application/json",
            "key": key
          });

          req.form({
            "name": msgCon[2].toString()
          });

          let member = msg.mentions.members.first();
          msg.mentions.members.first().setNickname(msgCon[2].toString());

          req.end(function (res) {
            if (res.status == 200) {
              if (member !== undefined) {
                let role = msg.guild.roles.cache.find(r => r.name === "Member");
                member.roles.add(role).catch(console.error);
                var responseMsg = "User Whitelisted\n`IGN: " + msgCon[2].toString() + "` \n`Discord: `" + msgCon[1].toString() + " ` `\n`Nickname Updated to IGN`\n\n" + "**play.purevanilla.net**";
                whitelistCreative(msgCon[2].toString(), msg);
              }
              else {
                // member is undefined
                var responseMsg = "User not found in discord.";
              }
            }
            else {
              var responseMsg = "**Failed to Whitelist**\n`IGN: " + msgCon[2].toString() + "`\n`Discord: `" + msgCon[1].toString() + " ` `\n" + "Please check the players IGN";
            }
            msg.channel.send(responseMsg);
          });
        }
      }
      else if (msgCon.indexOf('/tps') === 0) {
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
            msg.channel.send("Reported TPS: **" + res.body.tps + "**");
          }
          else {
            msg.channel.send('Could not reach server.');
          }
        });

      }

    }
  }
}

);

client.login(process.env.DISCORD_TOKEN);