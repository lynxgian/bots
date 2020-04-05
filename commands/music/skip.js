module.exports = { 
        name: "skip",
        description: "skips the current song playing.",
        category: "music",
        aliases: ["skip"],
    run: async (bot, message, args) => {
        message.delete()
        const { voiceChannel } = message.member;
        const player = bot.music.players.get(message.guild.id);

        if(!player) return message.channel.send("No song/s currently playing in this guild.").then(m => m.delete(15000));
        if(!voiceChannel || voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in a voice channel to use the leave command.").then(m => m.delete(15000));

        player.stop();
        return message.channel.send("Successfully skipped the song.").then(m => m.delete(15000));
    }    
}