module.exports = { 
        name: "leave",
        description: "Leaves the voice channel.",
        category: "music",
        aliases: ["fuckoff", "stop"],
    run: async (bot, message, args) => {
        message.delete(1000)
        const { voiceChannel } = message.member;
        const player = bot.music.players.get(message.guild.id);

        if(!player) return message.channel.send("No song/s currently playing in this guild.").then(m => m.delete(15000));
        if(!voiceChannel || voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in a voice channel to use the leave command.").then(m => m.delete(15000));

        bot.music.players.destroy(message.guild.id);
        return message.channel.send("Successfully stopped the music, and left the voice channel.").then(m => m.delete(15000));
    }
}