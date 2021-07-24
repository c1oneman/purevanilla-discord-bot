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
  console.log("ready");
  // marker

  await getApp(guildId).commands.post({
    data: {
      name: "marker",
      description: "Create a dynmap marker!",
      options: [
        {
          name: "label",
          description: "Title of marker on map.",
          type: 3,
          required: true,
        },
        {
          name: "icon",
          description: "Pick an icon for the marker.",
          type: 3,
          required: true,
          choices: [
            {
              name: "House",
              value: "house",
            },
            {
              name: "Light House",
              value: "lighthouse",
            },
            {
              name: "Shopping Basket",
              value: "basket",
            },
            {
              name: "Temple",
              value: "temple",
            },
            {
              name: "Portal",
              value: "portal",
            },
            {
              name: "Skull",
              value: "skull",
            },
            {
              name: "Heart",
              value: "heart",
            },
            {
              name: "Flower",
              value: "flower",
            },
            {
              name: "Bookshelf",
              value: "bookshelf",
            },
            {
              name: "Sign",
              value: "sign",
            },
            {
              name: "Globe",
              value: "world",
            },
            {
              name: "Minecart",
              value: "minecart",
            },
            {
              name: "Coins",
              value: "coins",
            },
            {
              name: "Chest",
              value: "chest",
            },
            {
              name: "Building",
              value: "building",
            },
            {
              name: "Anchor",
              value: "anchor",
            },
            {
              name: "Beer",
              value: "beer",
            },
            {
              name: "Gear",
              value: "gear",
            },
            {
              name: "Cultry",
              value: "cultry",
            },
          ],
        },
        {
          name: "x",
          description: "X coordinate of marker?",
          type: 4,
          required: true,
        },
        {
          name: "y",
          description: "Y coordinate of marker?",
          type: 4,
          required: true,
        },
        {
          name: "world",
          description: "What world will this be in?",
          type: 3,
          required: true,
          choices: [
            {
              name: "Overworld",
              value: "world",
            },
            {
              name: "Nether",
              value: "world_nether",
            },
            {
              name: "End",
              value: "world_the_end",
            },
          ],
        },
        {
          name: "confirm",
          description:
            "I adknowledge that I can not modify this marker, and I can not create until the next marker reset.",
          type: 3,
          required: true,
          choices: [
            {
              name: "Yes!",
              value: "true",
            },
            {
              name: "No, cancel.",
              value: "false",
            },
          ],
        },
      ],
    },
  });
  // map
  // await getApp(guildId).commands.post({
  //   data: {
  //     name: "vote",
  //     description: "Display current vote links.",
  //   },
  // });
  //weekly
  // await getApp(guildId).commands.post({
  //   data: {
  //     name: "weekly",
  //     description: "Display current weekly challenge scores.",
  //     options: [
  //       {
  //         name: "week",
  //         description: "Week of competition",
  //         type: 4,
  //       },
  //     ],
  //   },
  // });
  // // whitelist
  // await getApp(guildId).commands.post({
  //   data: {
  //     name: "whitelist",
  //     description: "Whitelist a new member.",
  //     options: [
  //       {
  //         name: "discord",
  //         description: "New member Disord @",
  //         required: true,
  //         type: 6, // user
  //       },
  //       {
  //         name: "ign",
  //         description: "New member IGN",
  //         required: true,
  //         type: 3, // String
  //       },
  //     ],
  //   },
  // });
  // // help
  // await getApp(guildId).commands.post({
  //   data: {
  //     name: "help",
  //     description: "List of commands.",
  //   },
  // });
  // //list
  // await getApp(guildId).commands.post({
  //   data: {
  //     name: "list",
  //     description: "Display current online players.",
  //   },
  // });
  // // status
  // await getApp(guildId).commands.post({
  //   data: {
  //     name: "status",
  //     description: "Display current server status.",
  //   },
  // });

  // //tps - Staff
  // await getApp(guildId).commands.post({
  //   data: {
  //     name: "tps",
  //     description: "Display current server ticks per second.",
  //   },
  // });
});
client.login(process.env.TOKEN);
