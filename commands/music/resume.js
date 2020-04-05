module.exports = { 
        name: "resume",
        description: "resumes a song",
        category: "music",
    run: async (bot, message, args) => {


const { voiceChannel } = message.member;
        const player = bot.music.players.get(message.guild.id);

        if(voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in a voice channel to pause music.").then(m => m.delete(15000));
        if(!player) return message.channel.send("No song/s currently playing in this channel.").then(m => m.delete(15000));

        player.pause(false);
        if(!player.pause(false)){
            await message.react("▶️".then(m=> m.delete(15000)));
        }
    }
}