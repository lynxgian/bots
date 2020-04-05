const Discord = require("discord.js")

module.exports = { 
        name: "volume",
        description: "Sets the volume of the bot",
        category: "music",
    run: async (bot, message, args) => {
        message.delete()
    const player = bot.music.players.get(message.guild.id)
    const embed = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription("There are currently no song/s playing")
    .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL)
    if(!player) return message.channel.send(embed).then(m => m.delete(5000))
     const embeds = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription(`Current Volume ${player.volume}`)
    .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL)
    if(!args[0]) return message.channel.send(embeds).then(m => m.delete(5000))
    const em = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription(`You may only set the volume to 1-100`)
    .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL)
    if(Number(args[0]) <= 0 || Number(args[0]) > 100) return message.channel.send(em).then(m => m.delete(5000))
    const emd = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription(`Successfuly set the volume to: ${args[0]}`)
    .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL)
    
    player.setVolume(Number(args[0]));
    return message.channel.send(emd).then(m => m.delete(5000))
    
    }
    }