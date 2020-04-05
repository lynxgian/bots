const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = { 
        name: "loop",
        description: "Loops the current song playing.",
        category: "music",
        aliases: ["repeat"],
    run: async (bot, message, args) => {
        message.delete()
        const player = bot.music.players.get(message.guild.id);
        if (!player || !player.queue[0]) return message.channel.send("No song/s currently playing within this guild.").then(m => m.delete(15000));
        const { title, author, duration, uri, thumbnail } = player.queue[0];
        
        if(player.trackRepeat === false){
            player.setTrackRepeat(true);
            const embed = new RichEmbed()
            .setAuthor("Repeating:")
            .setThumbnail(thumbnail)
            .setDescription(stripIndents`
            ${player.playing ? "▶️" : "⏸️"} **[${title}](${uri})** \`${Utils.formatTime(duration, true)}\` by ${author}
            `)
            return message.channel.send(embed).then(m => m.delete(15000));
        }else{
            player.setTrackRepeat(false);
            const embed = new RichEmbed()
            .setAuthor("Stopped Repeating:")
            .setThumbnail(thumbnail)
            .setDescription(stripIndents`
            ${player.playing ? "▶️" : "⏸️"} **[${title}](${uri})** \`${Utils.formatTime(duration, true)}\` by ${author}
            `)
            return message.channel.send(embed).then(m => m.delete(15000));
        }
    }
}