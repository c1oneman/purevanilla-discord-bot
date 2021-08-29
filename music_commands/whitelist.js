const {
  SlashCommand,
  ApplicationCommandPermissionType,
  CommandOptionType,
} = require("slash-create");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;
var unirest = require("unirest");

module.exports = class extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "whitelist",
      description: "Whitelist a member.",
      guildIDs: process.env.DISCORD_GUILD_ID
        ? [process.env.DISCORD_GUILD_ID]
        : undefined,
      permissionMessage: "You do not have permission to use this command.",
      requiredPermissions: ["MANAGE_ROLES"],
      options: [
        {
          type: CommandOptionType.STRING,
          name: "ign",
          description: "IGN of player to whitelist.",
          required: true,
        },
        {
          type: CommandOptionType.USER,
          name: "user",
          description: "Discord @ of member to whitelist.",
          required: false,
        },
      ],
    });
  }

  async run(ctx) {
    console.log("else");
    const { client } = require("..");
    const ign = ctx.options.ign;
    const hasMemberAttached = ctx.options.user ? true : false;
    const hasIGNAttached = ctx.options.ign ? true : false;
    const color = 0x00ff00;
    await ctx.defer();
    let fields = [
      {
        name: "IP",
        value: `\`play.purevanilla.net\``,
      },
    ];

    if (hasMemberAttached) {
      const guild = await client.guilds.cache.get(ctx.guildID);
      console.log(guild);
      const guildMember = guild.members.cache.get(ctx.options.user);
      console.log(guildMember);
      await guildMember.setNickname(ign).catch((e) => {
        console.log(e);
      });
      let roleID = guild.roles.cache.find((role) => role.name === "Member");
      console.log(roleID);
      await guildMember.roles.add(roleID).catch((e) => {
        console.log(e);
      });
      fields.push({
        name: "Discord",
        value: `:white_check_mark: Role/Nickname Added`,
      });
    }
    await unirest
      .post(`${ServerTap_API}/v1/server/whitelist`)
      .headers({
        key: `${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .form({ name: ign })
      .timeout(1000)
      .then(async (response) => {
        console.log(response.body);
        if (response.body == "Error: duplicate entry") {
          fields.push({
            name: "Survival Server",
            value: `:negative_squared_cross_mark: Err: Already Whitelisted`,
          });
        } else {
          console.log("else");
          fields.push({
            name: "Survival Server",
            value: `:white_check_mark: Whitelisted`,
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
    await unirest
      .post(`http://creative.purevanilla.net:25567/v1/server/whitelist`)
      .headers({
        key: `${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .form({ name: ign })
      .timeout(1000)
      .then(async (response) => {
        console.log(response.body);
        if (response.body == "Error: duplicate entry") {
          fields.push({
            name: "Creative Server",
            value: `:negative_squared_cross_mark: Err: Already Whitelisted`,
          });
        } else {
          console.log("else");
          fields.push({
            name: "Creative Server",
            value: `:white_check_mark: Whitelisted`,
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
    return void ctx.sendFollowUp({
      embeds: [
        {
          title: "Pure Vanilla",
          description: `Welcome to Pure Vanilla, ${ign}!`,
          thumbnail: {
            url: `https://mc-heads.net/avatar/${ign}/100`,
          },
          fields: fields,
          color: color,
          footer: {
            text: `You may join at the IP above.`,
            icon_url: "https://i.imgur.com/y4gEvak.png",
          },
        },
      ],
    });
  }
};
