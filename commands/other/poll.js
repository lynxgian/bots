const {RichEmbed} = require('discord.js')
module.exports = {
    name: "poll",
    description: "Creates a poll",
    category: "other",
    run: async (client, message, args) => {
        message.delete();
        let poll = args.slice(0).join(" ");
        let pc = message.guild.channels.find(x=> x.name === "『📋』polls");
            pc.send('@everyone').then(m=> m.delete(1000));

const embed = new RichEmbed()
    .setColor("BLUE")
    .setTitle(message.author.username + "'s poll")
    .setDescription(poll);
    pc.send(embed).then(m=> m.react('✅') + m.react('❌'));
      message.channel.send("Your poll has been sent").then(m=> m.delete(10000))
    }
};