const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")

module.exports = { 
        name: "play",
        description: "Play a song/playlist or search for a song from youtube",
        category: "music",
        aliases: ["p", "pplay"],
    run: async (bot, message, args) => {
        message.delete()
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            let vcEmbed = new RichEmbed()
            .setColor("#ff0000")
            .setDescription("You have to be in a voice channel before you can do that!");
            message.channel.send(vcEmbed);
        }

        const permissions = voiceChannel.permissionsFor(bot.user);
        if (!permissions.has("CONNECT")){
            let coEmbed = new RichEmbed()
            .setColor("#ff0000")
            .setDescription("I do not have permission to **connect** to your voice channel!");
            message.channel.send(coEmbed);
        }
        if (!permissions.has("SPEAK")){
            let spEmbed = new RichEmbed()
            .setColor("#ff0000")
            .setDescription("I do not have permission to **speak** in your voice channel!");
            message.channel.send(spEmbed);
        }

        if (!args[0]) return message.channel.send("Please provide a song name or link to search.");

        const player = bot.music.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel
        });

        bot.music.search(args.join(" "), message.author).then(async res => {
            switch (res.loadType) {
                case "TRACK_LOADED":
                    player.queue.add(res.tracks[0]);
                    message.channel.send(`Queued \`${res.tracks[0].title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``);
                    if (!player.playing) player.play()
                    break;
                
                case "SEARCH_RESULT":
                    let index = 1;
                    const tracks = res.tracks.slice(0, 5);
                    const embed = new RichEmbed()
                        .setAuthor("Song Selection.", message.author.displayAvatarURL)
                        .setDescription(tracks.map(video => `**${index++} -** ${video.title} ${Utils.formatTime(res.tracks[0].duration, true)}`))
                        .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection");

                    await message.channel.send(embed)

                    const collector = message.channel.createMessageCollector(m => {
                        return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                    }, { time: 30000, max: 1});

                    collector.on("collect", m => {
                        if (/cancel/i.test(m.content)) return collector.stop("cancelled")

                        const track = tracks[Number(m.content) - 1];
                        player.queue.add(track)
                        message.channel.send(`Queued \`${track.title}\` \`${Utils.formatTime(track.duration, true)}\``).then(m => m.delete(5000));
                        if(!player.playing) player.play();
                    });

                    collector.on("end", (_, reason) => {
                        if(["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled selection.").then(m => m.delete(5000));;
                    });
                    break;

                case "PLAYLIST_LOADED":
                    res.playlist.tracks.forEach(track => player.queue.add(track));
                    const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                    message.channel.send(`Queued \`${res.playlist.tracks.length}\` \`${duration}\` tracks in playlist \`${res.playlist.info.name}\``).then(m => m.delete(5000));
                    if(!player.playing) player.play()
                    break;
        
        bot.music.players.destroy(message.guild.id);
        return message.channel.send("Successfully stopped the music, and left the voice channel.").then(m=> m.delete(5000));

            }
        }).catch(err => message.channel.send(err.message))
    }
}