const Discord = require("discord.js");

mcping = require("mc-ping");

module.exports.run = async (interaction, client) => {
  let servers = [{ server_ip: "play.purevanilla.net", name: "Pure Vanilla" }];
  for (let i = 0; i < servers.length; i++) {
    servers[i] = {
      ...servers[i],
      ...(await getStatus(servers[i].server_ip)),
    };
  }

  let final = "";
  servers.forEach((server) => {
    final =
      final +
      `${server.online ? ":green_circle:" : ":red_circle:"} ${server.name} is ${
        server.online ? "`online` with" : "`offline`."
      } ${server.online ? server.players + " players." : ""}\n`;
  });
  reply(interaction, client, final);
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
const getStatus = async (server) => {
  var status = { online: false, players: 0 };
  await new Promise((resolve, reject) => {
    mcping(
      `${server}`,
      25565,
      function (err, res) {
        if (err) {
          status.online = false;
          status.players = 0;
        } else {
          status.online = true;
          status.players = res["num_players"];
        }
        resolve(status);
      },
      1000
    );
  });

  return status;
};
module.exports.help = {
  name: "status",
};
