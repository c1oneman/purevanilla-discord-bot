const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { SlashCreator, GatewayServer } = require("slash-create");
const Discord = require("discord.js");
const { Player } = require("discord-player");
const { registerPlayerEvents } = require("./events");
// const { generateDocs } = require("./docs");
const mcping = require("mc-ping");
dotenv.config();
var minutes = 1,
  interval = minutes * 60 * 1000;
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_VOICE_STATES"],
});

client.player = new Player(client);
registerPlayerEvents(client.player);

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_CLIENT_ID,
  token: process.env.DISCORD_CLIENT_TOKEN,
});

client.on("ready", async () => {
  const guildId = "700185866932584498";

  const commands = await getApp(guildId).commands.get();
  console.log(commands);
  ping();
  setInterval(function () {
    ping();
  }, interval);
  console.log(`Logged in as ${client.user.tag}!`);

  // console.log("Generating docs...");
  // generateDocs(creator.commands);
  // client.ws.on("INTERACTION_CREATE", async (interaction) => {
  //   const { name } = interaction.data;

  //   const command = name.toLowerCase();

  //   let commandfile;
  //   commandfile = client.commands.get(command);
  //   await commandfile.run(interaction, client);
  // });
});
const getApp = (guildId) => {
  const app = client.api.applications(client.user.id);
  if (guildId) {
    app.guilds(guildId);
  }
  return app;
};
creator
  .withServer(
    new GatewayServer((handler) => client.ws.on("INTERACTION_CREATE", handler))
  )
  .registerCommandsIn(path.join(__dirname, "music_commands"));

if (process.env.DISCORD_GUILD_ID)
  creator.syncCommandsIn(process.env.DISCORD_GUILD_ID);
else creator.syncCommands();

client.login(process.env.DISCORD_CLIENT_TOKEN);

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

module.exports.client = client;
module.exports.creator = creator;
