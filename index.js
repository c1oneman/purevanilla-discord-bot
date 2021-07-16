const DiscordJS = require("discord.js");
require("dotenv").config();
schedule = require("node-schedule");

const fs = require("fs");
var minutes = 1,
  interval = minutes * 60 * 1000;
const guildId = "700185866932584498";
const client = new DiscordJS.Client();
client.commands = new DiscordJS.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter((f) => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    client.commands.set(props.help.name, props);
  });
});
const getApp = (guildId) => {
  const app = client.api.applications(client.user.id);
  if (guildId) {
    app.guilds(guildId);
  }
  return app;
};

client.on("ready", async () => {
  setInterval(function () {
    ping();
  }, interval);
  console.log("online");

  const commands = await getApp(guildId).commands.get();
  console.log(commands);

  // await getApp(guildId).commands('817740792533090314').delete()

  client.ws.on("INTERACTION_CREATE", async (interaction) => {
    const { name } = interaction.data;

    const command = name.toLowerCase();

    let commandfile;
    commandfile = client.commands.get(command);
    await commandfile.run(interaction, client);
  });
});
function ping() {
  mcping(`play.purevanilla.net`, 25565, function (err, res) {
    if (err) {
      // Some kind of error
      console.error(err);
      client.user.setActivity("Offline");
    } else {
      // Success!
      client.user.setActivity("with " + res["num_players"] + " players");
    }
  });
}
function randomImage() {
  var unirest = require("unirest");

  var req = unirest("GET", `https://api.imgur.com/3/album/MwsesR2`);

  req.headers({
    accept: "application/json",
    authorization: "Client-ID 4cde16da264b293",
  });
  req.end(function (res) {
    if (!res.body.error) {
      if (res.body.data.images) {
        var imagesObject = res.body.data.images;
        var randomObject =
          imagesObject[Math.floor(Math.random() * imagesObject.length)];
        bot.channels.cache.get(general).send(randomObject.link);
      }
    } else {
      console.log(res.body.error);
    }
  });
}
client.login(process.env.TOKEN);
