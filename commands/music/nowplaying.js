const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = { 
        name: "nowplaying",
        description: "Shows the current song playing.",
        category: "music",
        aliases: ["now", "np"],
    run: async (bot, message, args) => {
        const player = bot.music.players.get(message.guild.id);
      const { title, author, duration, uri, thumbnail } = player.queue[0];
      if (!player || !player.queue[0]) return message.channel.send("No song/s currently playing within this guild.");
        if (player.position > 5000){
          getnowplaying()
        }
        if (player.position < 5000){
          setTimeout(() => {
          getnowplaying()
          },3000)
        }
        
        function getnowplaying(){
        let { title, author, duration, thumbnail, requester } = player.queue[0];
        let amount = `00:${Utils.formatTime(player.position, true)}`
        const part = Math.floor((player.position / duration) * 10);
        const giveEmbed = new RichEmbed()
          .setColor("aqua")
          .setDescription(`${player.playing ? "▶️" : "⏸️"} [${title}](${uri})\n${"▬".repeat(part) + "🔘" + "▬".repeat(10 - part)}[${amount} / ${Utils.formatTime(duration, true)}]\nRequested By: ${requester.tag}`)

      message.channel.send({embed: giveEmbed}).then(m => {
        const counter = setInterval(() => {
          if(player.playing !== true){
            clearInterval(counter)
          }
        
        if(player.position < 60000){
          if(player.position>2000){
          if(player.playing === true){
          let { title, author, duration, thumbnail, requester } = player.queue[0];
          let amount = `00:${Utils.formatTime(player.position, true)}`
          const part = Math.floor((player.position / duration) * 10);
          giveEmbed.setDescription(`${player.playing ? "▶️" : "⏸️"} [${title}](${uri})\n${"▬".repeat(part) + "🔘" + "▬".repeat(10 - part)}[${amount} / ${Utils.formatTime(duration, true)}]\nRequested By: ${requester.tag}`)
          }
        }
        }else{
          if(player.playing === true){
          let { title, author, duration, thumbnail, requester } = player.queue[0];
          const amount = `${Utils.formatTime(player.position, true)}`
          const part = Math.floor((player.position / duration) * 10);
          giveEmbed.setDescription(`${player.playing ? "▶️" : "⏸️"} [${title}](${uri})\n${"▬".repeat(part) + "🔘" + "▬".repeat(9 - part)}[${amount} / ${Utils.formatTime(duration, true)}]\nRequested By: ${requester.tag}`)
        }
      }
        m.edit(giveEmbed)
        },4000)
    })
  }
}
}