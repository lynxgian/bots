const { RichEmbed } = require("discord.js")
const RadioBrowser = require('radio-browser')

module.exports = { 

        name: "radio",
        description: "Plays Live Radio",
        category: "music",
    run: async (bot, message, args) => { 

        const { voiceChannel } = message.member;
        if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music.").then(m => m.delete(5000));

        const permissions = voiceChannel.permissionsFor(bot.user);
        if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!").then(m => m.delete(5000));
        if (!permissions.has("SPEAK")) return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!").then(m => m.delete(5000));

	const query = args.join(" ")
        if (!args[0]) return message.channel.send("Please provide a song name or link to search.").then(m => m.delete(5000))

        const player = bot.music.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel
        });

        let filter = {
            limit: 1,
            by: 'name',
            searchterm: query
        }
        let str = "" 
        await RadioBrowser.getStations(filter)
        .then(data => {
            dat2a = data.forEach(item => {
                str = item.url
            })
        })
        if(str.length === 0) return message.channel.send(new RichEmbed().setDescription(`Invalid Radio Station`).setColor("GREEN")).then(m => m.delete(5000))
        await bot.music.search(str, message.author).then(async res => {
             switch (res.loadType) {
                 case "TRACK_LOADED":
                     player.queue.add(res.tracks[0]);
                     if(!player.playing){
                          player.play();
                          return message.channel.send(new RichEmbed().setDescription(`Now Playing ${res.tracks[0].title}`).setColor("GREEN")).then(m => m.delete(5000))
                     }else{
                         return message.channel.send(new RichEmbed().setDescription(`Queued ${res.tracks[0].title}`).setColor("GREEN")).then(m => m.delete(5000))
                     }
             }
         })
    }
}