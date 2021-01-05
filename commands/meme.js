const Discord = require('discord.js');
var request = require('request');
var Random = require('random-js');
var url = 'https://www.reddit.com/r/MinecraftMemes.json';
var engine = Random.engines.mt19937().autoSeed();
module.exports.run = async (bot, message, args) => {

    request(url, function (err, res, body) {
        if (err) {
            callback(false);
            return;
        }
        var json = JSON.parse(body);
        var posts = json.data.children;
        var randomPosts = Random.shuffle(engine, posts);

        // Go through each post returned by JSON
        var validImage = false;
        for (var i = 0; i < randomPosts.length; i++) {
            var post = randomPosts[i];

            // If post is text, skip
            if (typeof post.data.preview === 'undefined') continue;

            // Get image data
            var imageData = post.data.url_overridden_by_dest
            console.log(imageData);
            message.channel.send(imageData);

            // TODO: Check for image resolution/ratio and skip to next one if requirements aren't met
            break;
        }
        // If not valid image, return false

    });

}

module.exports.help = {
    name: "meme",
    aliases: ["gif"]
}