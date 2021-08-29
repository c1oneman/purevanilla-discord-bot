const DiscordJS = require("discord.js");
require("dotenv").config();

const client = new DiscordJS.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const getApp = (guildId) => {
  const app = client.api.applications(client.user.id);
  if (guildId) {
    app.guilds(guildId);
  }
  return app;
};
client.on("ready", async () => {
  // List commands
  // const commands = await client.api.applications.commands.get();
  // console.log(commands);

  // delete all commands
  //client.api
  // .applications(client.user.id)
  // .commands("command-id (interaction.data.id)")
  // .delete();
  getApp().commands.put({ data: [] });

  //client.api
  //     .applications(client.user.id)
  //     .guilds(guildId)
  //     .commands("command-id (interaction.data.id)")
  //     .delete();
});
console.log(process.env.DISCORD_CLIENT_TOKEN);
client.login(process.env.DISCORD_CLIENT_TOKEN);
