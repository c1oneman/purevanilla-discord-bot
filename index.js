require('dotenv').config();
mcping = require('mc-ping');
schedule = require('node-schedule');
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true });
var minutes = 1, interval = minutes * 60 * 1000;
var general = process.env.GENERAL_ID
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT || 'localhost:25566'
var key = process.env.API_KEY;

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
//758500997730664448
fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }


  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => {
      bot.aliases.set(alias, props.help.name);

    });
  });
})
bot.on("ready", async () => {
  setInterval(function () {
    ping();
  }, interval);
  console.log(`${bot.user.username} is online!`);
  bot.channels.cache.get('758500997730664448').send('Bot has rebooted.');
  bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let prefix = botconfig.prefix
    //let messageArray = message.content.split(" ");
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let commandfile;

    if (bot.commands.has(cmd)) {
      commandfile = bot.commands.get(cmd);
    } else if (bot.aliases.has(cmd)) {
      commandfile = bot.commands.get(bot.aliases.get(cmd));
    }

    if (!message.content.startsWith(prefix)) return;


    try {
      commandfile.run(bot, message, args);

    } catch (e) {
    }
  }
  )
})


// Logic/Helper functions

bot.on('message', message => {
  if (message.channel.type == "dm") {
    if (message.author.bot) return;
    let prefix = botconfig.prefix
    //let messageArray = message.content.split(" ");
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    if (!message.content.startsWith('/remark')) {
      message.channel.send("\nTo update an existing Dynmap marker, please run the command below this message. \n\`/remark ID X Y TEXT_HERE\`");
      return
    };
    
    console.log("args:", args)
    console.log(args.length)
    if (!(args.length == 5)) {
        message.channel.send('Invalid format. \n./remark **ID** x z TEXT_WITH_UNDERSCORE_SPACES\nYou can get the ID from a DM from us.')
        return
    };
    console.log(args)
    var buildReq = unirest("POST", `${ServerTap_API}/v1/server/exec`);
    var headers = {
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json",
        "key": key
    };
    
    args[4] = args[4].replace('_', " ");

    const command = `dmarker update id:${args[1]} newlabel:"${args[4].toString()}" world:world x:${args[2]} y:65 z:${args[3]}`
    var form = {
        "command": command,
        "time": 0
    }

    buildReq.headers(headers);
    buildReq.form(form);
    buildReq.end(function (res) {
        if (res.status == 200) {
            // 200
            console.log(res.body)
            if (res.body.includes('Updated marker')) {
                message.author.send(`We have updated that Dynmap marker for you! You can view it on the Dynmap at x:${args[2]} z:${args[3]} in the overworld.\n**IMPORTANT!** Take this \`ID\` for safekeeping!\n→ \`${args[1]}\` \nYou will use it to update your marker.\n\`/remark ${args[1]} ${args[2]} ${args[3]} My_Updated_Marker_Name\``)
            }
            else {
                message.author.send('Error! Contact staff..\n', res.body)
            }
        } else {
           // Failure
             message.author.send(res.status);
        }
       
    });
    return;
  }
});

function randomImage() {
  var unirest = require("unirest");

  var req = unirest("GET", `https://api.imgur.com/3/album/MwsesR2`);

  req.headers({
    "accept": "application/json",
    "authorization": "Client-ID 4cde16da264b293"
  });
  req.end(function (res) {
    if (!res.body.error) {
      if (res.body.data.images) {
        var imagesObject = res.body.data.images;
        var randomObject = imagesObject[Math.floor(Math.random() * imagesObject.length)];
        bot.channels.cache.get(general).send(randomObject.link);
      };
    }
    else {
      console.log(res.body.error);
    }
  });
}
function ping() {
  mcping(`play.purevanilla.net`, 25565, function (err, res) {

    if (err) {
      // Some kind of error
      console.error(err);
      bot.user.setActivity("Singleplayer");

    } else {
      // Success!
      //bot.user.setActivity('Under Maintenance');
      //bot.user.setActivity("with " + res['num_players'] + " players");
      bot.user.setActivity("with " + res['num_players'] + " players");
      //bot.user.setActivity("Under Maintenance");
      
    }

  });
}

bot.login(process.env.DISCORD_TOKEN);