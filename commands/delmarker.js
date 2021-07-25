const Discord = require("discord.js");
var unirest = require("unirest");

var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;

module.exports.run = async (interaction, client) => {
  const guild = client.guilds.cache.get(interaction.guild_id);
  let embed = new Discord.MessageEmbed();
  if (!isRole(interaction.member, guild, "Staff")) {
    reply(interaction, client, "Sorry this command can only be run by Staff!");
    return;
  }
  const { options } = interaction.data;
  const id = options[1].value;

  var req = unirest("POST", `${ServerTap_API}/v1/server/exec`)
    .headers({
      key: `${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    })
    .send(`command=dmarker delete id:${id} set:1`)
    .send("time=0")
    .end(async function (res) {
      {
        if (!res.body.toLowerCase().includes("error")) {
          console.log(res.body);

          embed
            .setTitle("Marker Removed")
            .setColor("#6ff542")
            .setDescription(id)
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
  name: "delmarker",
};
