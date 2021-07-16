const Discord = require("discord.js");
var unirest = require("unirest");
var key = process.env.API_KEY;
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
module.exports.run = async (interaction, client) => {
  let embed = new Discord.MessageEmbed();
  const guild = client.guilds.cache.get(interaction.guild_id);
  if (!isRole(interaction.member, guild, "Staff")) {
    embed.addField("Error", "`Please check your permissions.`");
    embed.setColor("#d#e6270e");

    reply(interaction, client, embed);
    return;
  }
  const { options } = interaction.data;

  const discordUserID = options[0].value;
  const ign = options[1].value;

  // Unirest
  var survivalReq = unirest("POST", `${ServerTap_API}/v1/server/whitelist`);
  var headers = {
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json",
    key: key,
  };
  var form = {
    name: ign,
  };
  survivalReq.headers(headers);

  survivalReq.form(form);

  survivalReq.end(async function (res) {
    console.log(res);
    if (res.status == 200) {
      let roleID = guild.roles.cache.find((role) => role.name === "Member");

      var member = await guild.members.fetch(discordUserID);

      member.setNickname(ign).catch(() => {
        console.log("e");
      });

      try {
        member.roles.add(roleID);
      } catch {
        console.log("Failed to set role");
      }

      embed
        .setTitle("Pure Vanilla")
        .setDescription("Welcome to Pure Vanilla, NotClay!")
        .addField("Nickname Updated", ":white_check_mark:", false)
        .addField("IGN", `\`${ign}\``, true)
        .addField("Discord", `\`@${ign}\``, true)
        .addField("IP", "`play.purevanilla.net`", false)
        .setFooter(
          "You may join at the IP above.",
          "https://i.imgur.com/y4gEvak.png"
        );

      embed.setColor("#64e60e");
      reply(interaction, client, embed);
    } else {
      reply(interaction, client, "Could not reach server.");
    }
  });
};
const reply = async (interaction, client, response) => {
  let data = {
    content: response,
  };

  // Check for embeds
  if (typeof response === "object") {
    data = await createAPIMessage(interaction, client, response);
  }

  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data,
    },
  });
};
const createAPIMessage = async (interaction, client, content) => {
  const { data, files } = await Discord.APIMessage.create(
    client.channels.resolve(interaction.channel_id),
    content
  )
    .resolveData()
    .resolveFiles();

  return { ...data, files };
};
function isRole(member, guild, role) {
  let roleID = guild.roles.cache.find((role) => role.name === "Staff");
  return member.roles.find((r) => r === roleID.id);
}
module.exports.help = {
  name: "whitelist",
};
