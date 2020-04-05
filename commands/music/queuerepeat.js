const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")

module.exports = { 
        name: "queuerepeat",
        description: "Repeats the whole queue.",
        category: "music",
        aliases: ["qr"],
    run: async (bot, message, args) => {
        message.delete();
        const player = bot.music.players.get(message.guild.id);
        if (!player || !player.queue[0]) return message.channel.send("No song/s currently playing within this guild.").then(m => m.delete(15000));
        const { title, author, duration, uri, thumbnail } = player.queue[0];
        
        if(player.queueRepeat === false){
            player.setQueueRepeat(true);
            const embed = new RichEmbed()
            .setAuthor("Repeating The Queue")
            return message.channel.send(embed).then(m => m.delete(15000));
        }else{
            player.setTrackRepeat(false);
            const embed = new RichEmbed()
            .setAuthor("Stopped Repeating The Queue")
            return message.channel.send(embed).then(m => m.delete(15000));
        }

    }
}