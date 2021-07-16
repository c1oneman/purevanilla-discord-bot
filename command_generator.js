const DiscordJS = require("discord.js");
require("dotenv").config();

const guildId = "700185866932584498";
const client = new DiscordJS.Client();
const getApp = (guildId) => {
  const app = client.api.applications(client.user.id);
  if (guildId) {
    app.guilds(guildId);
  }
  return app;
};

client.on("ready", async () => {
  //weekly
  await getApp(guildId).commands.post({
    data: {
      name: "weekly",
      description: "Display current weekly challenge scores.",
      options: [
        {
          name: "week",
          description: "Week of competition",
          type: 4,
        },
      ],
    },
  });
  // whitelist
  await getApp(guildId).commands.post({
    data: {
      name: "whitelist",
      description: "Whitelist a new member.",
      options: [
        {
          name: "discord",
          description: "New member Disord @",
          required: true,
          type: 6, // user
        },
        {
          name: "ign",
          description: "New member IGN",
          required: true,
          type: 3, // String
        },
      ],
    },
  });
  // help
  await getApp(guildId).commands.post({
    data: {
      name: "help",
      description: "List of commands.",
    },
  });
  //list
  await getApp(guildId).commands.post({
    data: {
      name: "list",
      description: "Display current online players.",
    },
  });
  // status
  await getApp(guildId).commands.post({
    data: {
      name: "status",
      description: "Display current server status.",
    },
  });

  //tps - Staff
  await getApp(guildId).commands.post({
    data: {
      name: "tps",
      description: "Display current server ticks per second.",
    },
  });
});
client.login(process.env.TOKEN);
