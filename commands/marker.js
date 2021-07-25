const Discord = require("discord.js");
var unirest = require("unirest");
const { customAlphabet } = require("nanoid");

var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;

module.exports.run = async (interaction, client) => {
  const nanoid = customAlphabet("1234567890abcdef", 10);

  const guild = client.guilds.cache.get(interaction.guild_id);
  let embed = new Discord.MessageEmbed();
  if (isRole(interaction.member, guild, "hasMarked")) {
    reply(interaction, client, "Sorry this command can only be run once!");
    return;
  }
  if (!isRole(interaction.member, guild, "Member")) {
    reply(
      interaction,
      client,
      "Sorry this command can only be run by members!"
    );
    return;
  }

  const { options } = interaction.data;
  let roleID = guild.roles.cache.find((role) => role.name === "hasMarked");
  let label = options[0].value;
  label = label.replaceAll("'", "");
  const icon = options[1].value;
  const x = options[2].value;
  const z = options[3].value;
  const world = options[4].value;
  const uuid = nanoid();
  const id = `${uuid}`;
  const confirm = options[5].value;
  console.log(confirm);
  if (confirm !== "true") {
    reply(
      interaction,
      client,
      "Sorry, you need to have `Yes!` in confirmation to confirm!"
    );
    return;
  }
  var req = unirest("POST", `${ServerTap_API}/v1/server/exec`)
    .headers({
      key: `${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    })
    .send(
      `command=dmarker add id:${id} "${label}" world:${world} x:${x} y:0 z:${z} icon:${icon} set:1`
    )
    .send("time=0")
    .end(async function (res) {
      {
        if (!res.body.toLowerCase().includes("error")) {
          var member = await guild.members.fetch(interaction.member.user.id);
          member.roles.add(roleID.id);
          // Server pinged back
          console.log(res.body);

          embed
            .setTitle("Marker Added")
            .setColor("#6ff542")
            .setDescription("Click the link to view it on the dynmap!")
            .setURL(
              `https://map.purevanilla.net?worldname=${world}&mapname=surface&zoom=6&x=${
                x + 100
              }&y=64&z=${z + 100}`
            )
            .setFooter(`${id}`)
            .setAuthor(
              "Pure Vanilla Dynmap",
              "https://i.imgur.com/y4gEvak.png"
            );

          reply(interaction, client, embed);
        } else {
          //reply(interaction, client, "Could not reach server.");
          console.log(res);
        }
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
  let roleID = guild.roles.cache.find((roles) => roles.name === role);
  return member.roles.find((r) => r === roleID.id);
}
module.exports.help = {
  name: "marker",
};
