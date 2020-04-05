const { RichEmbed } = require("discord.js")


module.exports = {
        name: "shutdown",
        description: "shuts  down the bot",
        category: "other",        
    run: async (bot, message, args) => {
        message.delete()
        let ids = ["595543765540798474", "312735373769965568"];

        if (!ids.includes(message.author.id)) return message.reply("you don't have Permission").then(m => m.delete(5000))
      let embed = new RichEmbed()
            .setColor("RED")
            .setAuthor(`${message.guild.name} logs`, message.guild.iconURL)
            .addField("**command**:", "restart")
            .addField("**used by**:", message.author)
            .addField('**in:**', message.channel)
            .addField("**date**:", message.createdAt.toLocaleString())
            .setFooter(`Xiri's Assistent | Made By: LynX Gian`);

        let sChannel = message.guild.channels.find(c => c.id === "689569630477352970");
        sChannel.send(embed)

            message.channel.send("Bot is shutting down...").then(m => m.delete(5000));
            process.exit();

        //log
        console.log(`**(${message.author.username}) shutdown the bot**`)
        
    }
}