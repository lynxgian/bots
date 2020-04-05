const Discord = require("discord.js");
module.exports = {
  name: "message",
  run: async (client,message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if(message.webhookID)return;
    if(message.type!=="DEFAULT")return;
    console.log(`(#${message.channel?message.channel.name:"Private"}) ${message.author.tag}: ${message.content}`)
    if(!message.member.roles.some(r=>client.swearignoreroles.includes(r.name))){
      let badWords = hasBadWord(client,message)
      if(badWords){
        message.delete(500).catch(e=>{})
        message.channel.send(`${client.emoji.cross} **| ${client.bannedWordsReason[badWords[0]].replace("{USER}",message.author)}**`).then(m=>m.delete(7500).catch(e=>{})).catch(e=>{})
        let incidentlog = message.guild.channels.find(c=>c.name===client.canales.incidentlogs);
        if(incidentlog){// for some reason it doesn't log the tickets
          let descriptionarray = [`**Infractor:** ${message.author} (${message.author.id})`,
                                  `**Channel:** ${message.channel} (${message.channel.id})`,
                                  `**Words used:** ${badWords.join(", ")} (${badWords.length})`,
                                  `**Message:** ${message.content}`]
          let badembed = new Discord.RichEmbed()
          .setAuthor(`Swearing | ${message.author.tag}`,message.author.displayAvatarURL,null)
          .setDescription(descriptionarray.join("\n"))
          .setFooter(`${client.footer}`)
          .setColor(client.colors.moderation.swearing)//did u fix chatfilter and sorry for bothering u//no i didnt//k
          .setTimestamp()
          incidentlog.send(badembed);
        }
        return;
      }
    }
    client.updater.plusMessage(client,message.member);
    if(message.content && message.content.length>5){
      if(Math.random()*100>85){
         client.updater.addExperience(client,message);
      }
      if(Math.random()*100>85){
         client.updater.addCoins(client,message.member);
      }
    }
    if (!message.content.startsWith(client.prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    if(message.channel.type == "dm"){
        return;
    }
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args);
  }
}
function hasBadWord(bot,message){
  let wordsCatched = bot.bannedWords.filter(bannedWord=>message.content.toLowerCase().includes(bannedWord))
  return wordsCatched.length>0?wordsCatched:undefined
}