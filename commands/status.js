
mcping = require('mc-ping');

const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
  let servers = [
    { server_ip: "localhost", name: "Pure Vanilla" },
  ];
  for(let i = 0; i<servers.length;i++) {
  servers[i] = {
    ...servers[i],
    ...(await getStatus(servers[i].server_ip)),
  };
  }
  
  let final = ""
  servers.forEach(server => {
    final =
      final +
      `${server.online ? ":green_circle:" : ":red_circle:"} ${server.name} is ${
        server.online ? "`online` with" : "`offline`."
      } ${server.online ? server.players + " players." : ""}\n`;
  })
  message.channel.send(final);

}
const getStatus = async (server) => {
  var status = { online: false, players: 0 };
  await new Promise((resolve, reject) => {
    mcping(
    
    `${server}`,
    25565,
    function (err, res) {
      if (err) {
        status.online = false
        status.players = 0
      } else {
        status.online = true;
        status.players = res["num_players"];
      }
      resolve (status);
    },
    1000
  );
  });
  
  return status
};
module.exports.help = {
  name: "status",
  aliases: ["online"]
}