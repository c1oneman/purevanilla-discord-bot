const Discord = require("discord.js");
var unirest = require("unirest");
var ServerTap_API = process.env.PUREVANILLA_SERVER_ENDPOINT;
var key = process.env.API_KEY;

module.exports.run = async (interaction, client) => {
  const guild = client.guilds.cache.get(interaction.guild_id);
  let embed = new Discord.MessageEmbed();
  if (!isRole(interaction.member, guild, "Staff")) {
    reply(
      interaction,
      client,
      "Sorry, this command is currently reserved for Staff."
    );
  }
  var req = unirest("POST", `${ServerTap_API}/v1/server/exec`)
    .headers({
      key: `${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    })
    .send("command=tps")
    .send("time=0")
    .end(function (res) {
      {
        if (res.status == 200) {
          // Server pinged back
          console.log(res.body);
          const titles = ["1m", "5m", "15m"];

          let parse = res.body
            .replace("TPS from last 1m, 5m, 15m: ", " ")
            .split(", ");
          switch (parse[1]) {
            case "20.0":
              embed.setColor("#44eb63");
              break;
            default:
              embed.setColor("#e8901c");
          }
          for (let i = 0; i < parse.length; i++) {
            embed.addField(titles[i], parse[i], true);
          }
          embed
            .setTitle("Ticks Per Second")
            .setDescription("Current TPS on Pure Vanilla")
            .setURL("https://minecraft.fandom.com/wiki/Tick");
          console.log(parse);
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
  name: "tps",
};
