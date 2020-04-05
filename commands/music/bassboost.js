const Discord = require('discord.js')
module.exports = {
    name: "bassboost",
    description: "ups the bass of the audio",
    category: "music",
    run: async (client, message, args) => {
        message.delete()
    const player = client.music.players.get(message.guild.id);
    if(!player) return message.channel.send("No song/s currently playing").then(m => m.delete(5000))
    const embed = new Discord.RichEmbed()
    .setColor('RED')
    .setDescription("Please select from **low**, **medium**, **high**, **super**, or **off to disable bassboost**!")
    const bembed = new Discord.RichEmbed()
    .setColor('RED')
    .setDescription(`The bass has been set to **${args[0]}**!`)
       if(!args[0]) message.channel.send(embed).then(m => m.delete(5000))
       if(args[0] == 'off'){
        player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.0 })));
                message.channel.send(bembed).then(m => m.delete(5000));

       }
       if(args[0] == 'low'){
        player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.10 })));
                message.channel.send(bembed).then(m => m.delete(5000));

       }
        if(args[0] == 'medium'){
        player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.15 })));
                message.channel.send(bembed).then(m => m.delete(5000));

       }
       if(args[0] == 'high'){
        player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.25 })));
                message.channel.send(bembed).then(m => m.delete(5000));

       }
              if(args[0] == 'super'){
        player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.50 })));
                message.channel.send(bembed).then(m => m.delete(5000));

       }
        }
        }