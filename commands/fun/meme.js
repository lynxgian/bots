const { RichEmbed } = require("discord.js");

const request = require("request");

module.exports = {
        name: "meme",
        category: "fun",
        description: "Pulls a meme from r/memes",
    run: async (bot, message, args) => {
message.delete();
        request("https://reddit.com/r/meme/random.json", (error, response, body) => {
            body = JSON.parse(body)
            let bod = body[0]
            let data = bod["data"]
            let children = data["children"]
            let childre = children[0]
            let data2 = childre["data"]
            if (data2["url"].match(".jpg") || data2["url"].match(".png")) {
                var embed = new RichEmbed()
                    .setColor("RANDOM")
                    .setAuthor("Facilities")
                    .setTitle("r/meme")
                    .setURL(`https://reddit.com${data2["permalink"]}`)
                    .setFooter(`Meme by ${data2["author"]}`)
                    .setImage(data2["url"])

                message.channel.send({ embed });
            }
        })
    }
}