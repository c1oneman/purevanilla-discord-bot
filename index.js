require('dotenv').config();
mcping = require('mc-ping');
schedule = require('node-schedule');

const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true });
var minutes = 1, interval = minutes * 60 * 1000;
var general = process.env.GENERAL_ID

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
    let messageArray = message.content.split(" ");
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

// Restart schdule to run at server reboot times.
var restartNight = schedule.scheduleJob({ hour: 6, minute: 0 }, function () {
  randomImage();
});
var restartDay = schedule.scheduleJob({ hour: 18, minute: 0 }, function () {
  randomImage();
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
      bot.user.setActivity("with " + res['num_players'] + " players");

    }

  });
}

bot.login(process.env.DISCORD_TOKEN);