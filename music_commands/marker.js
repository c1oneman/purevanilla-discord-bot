const {
  SlashCommand,
  ApplicationCommandPermissionType,
  CommandOptionType,
} = require("slash-create");
const { customAlphabet } = require("nanoid");

var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;
var unirest = require("unirest");

module.exports = class extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "marker",
      description: "Create a dynmap marker.",
      guildIDs: process.env.DISCORD_GUILD_ID
        ? [process.env.DISCORD_GUILD_ID]
        : undefined,
      options: [
        {
          type: CommandOptionType.STRING,
          name: "label",
          description: "Title of marker on map.",
          required: true,
        },
        {
          type: CommandOptionType.STRING,
          name: "icon",
          description: "Discord @ of member to whitelist.",
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
          type: CommandOptionType.INTEGER,
          name: "x",
          description: "X coordinate of marker.",
          required: true,
        },
        {
          type: CommandOptionType.INTEGER,
          name: "z",
          description: "z coordinate of marker.",
          required: true,
        },
        {
          name: "dimension",
          description: "What dimension/world will this marker be in?",
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
            "I adknowledge that I can not modify this marker until the next marker reset.",
          type: 3,
          required: true,
          choices: [
            {
              name: "Create marker!",
              value: "true",
            },
            {
              name: "No, cancel.",
              value: "false",
            },
          ],
        },
      ],
    });
  }

  async run(ctx) {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const { client } = require("..");
    const guild = await client.guilds.cache.get(ctx.guildID);
    console.log(`/marker ${ctx.options}`);
    const color = 0x42f57b;
    await ctx.defer();
    let fields = [];
    console.log("Check perms");
    const staffRole = guild.roles.cache.find((roles) => roles.name === "Staff");
    const markedRole = guild.roles.cache.find(
      (roles) => roles.name === "hasMarked"
    );
    if (
      ctx.member.roles.find((r) => r === markedRole.id) &&
      !ctx.member.roles.find((r) => r === staffRole.id)
    ) {
      console.log("User already has hasMarked role and is not staff!");
      return void ctx.sendFollowUp({
        embeds: [
          {
            title: "Uh oh!",
            description: `This command can only be run once.`,
            fields: [
              {
                name: "How to fix this?",
                value:
                  "Please contact staff to reset an existing marker under your name.",
              },
            ],
            color: 0xffcb00,
          },
        ],
      });
    }

    console.log(ctx);
    const guildMember = guild.members.cache.get(ctx.user.id);
    const uuid = nanoid();
    const id = `${uuid}`;
    await guildMember.roles.add(markedRole).catch((e) => {
      console.log(e);
    });
    fields.push({
      name: "Marker ID",
      value: `\`${id}\``,
    });
    fields.push({
      name: "Marker Label",
      value: `\`${ctx.options.label}\``,
    });
    await unirest
      .post(`${ServerTap_API}/v1/server/exec`)
      .headers({
        key: `${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .send(
        `command=dmarker add id:${id} "${ctx.options.label}" world:${ctx.options.dimension} x:${ctx.options.x} y:0 z:${ctx.options.z} icon:${ctx.options.icon} set:1`
      )
      .timeout(1000)
      .then(async (response) => {
        console.log(response.body);
        if (response.body.toLowerCase().includes("error")) {
          return void ctx.sendFollowUp({
            embeds: [
              {
                title: "Uh oh!",
                description: `There was an error processing this request.`,
                fields: [
                  {
                    name: "How to fix this?",
                    value: "Please try creating the marker again.",
                  },
                ],
                color: 0xffcb00,
              },
            ],
          });
        } else {
          return void ctx.sendFollowUp({
            embeds: [
              {
                title: "Marker Created",
                description: `Click the link to view it on the dynmap!`,
                fields: fields,
                color: color,
                url: `https://map.purevanilla.net?worldname=${
                  ctx.options.dimension
                }&mapname=surface&zoom=6&x=${ctx.options.x + 100}&y=64&z=${
                  ctx.options.z + 100
                }`,
                author: {
                  name: `Pure Vanilla Dynmap`,
                  icon_url: "https://i.imgur.com/y4gEvak.png",
                },
              },
            ],
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return void ctx.sendFollowUp({
          embeds: [
            {
              title: "Uh oh!",
              description: `There was an error processing this request.`,
              color: 0xffcb00,
            },
          ],
        });
      });
  }
};
