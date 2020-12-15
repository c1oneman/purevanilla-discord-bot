else if ((msg.member.roles.cache.find(r => r.name === "Member") || msg.member.roles.cache.find(r => r.name === "Supporter") || msg.member.roles.cache.find(r => r.name === "Staff")) && !msg.member.roles.cache.find(r => r.name === "haswhitelist")) {
    if (msgCon.indexOf('/relist') === 0) {
      if (msgCon.length !== 2) {
        msg.channel.send("/relist **IGN**");
      }
      else {

        var unirest = require("unirest");

        var req = unirest("POST", `${entryPoint}:25566/v1/whitelist`);

        req.headers({
          "content-type": "application/x-www-form-urlencoded",
          "accept": "application/json"
        });

        req.form({
          "uuid": "",
          "name": msgCon[1].toString()
        });




        req.end(function (res) {

          let member = msg.member;
          //console.log(res.body);
          if (res.status == 200) {
            if (member !== undefined) {

              member.setNickname(msgCon[1].toString());
              var responseMsg = "User Whitelisted\n`IGN: " + msgCon[1].toString() + "`\n" + "**play.purevanilla.net**";
              let role = msg.guild.roles.cache.find(r => r.name === "haswhitelist");

              member.roles.add(role).catch(console.error);
            }
            else {
              var responseMsg = "User not found in discord.";
            }
          }
          else {
            var responseMsg = "**Failed to Whitelist**\n`IGN: " + msgCon[1].toString() + "";
          }
          msg.channel.send(responseMsg);
        });


      }
    }
  }