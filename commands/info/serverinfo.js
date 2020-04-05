const Discord = require("discord.js");
const prettyMs = require("pretty-ms");
module.exports = {
  name: "serverinfo",
  description: "Shows server information.",
  category: "info",
  run: async (client, message, args) => {
    let removemessage = false;
    if(message.channel.name !== client.canales.comandosbot){
      if(!message.member.roles.some(r=>client.highstaff.includes(r.name)))return;
      message.delete(500).catch(e=>{});
      removemessage = true;
    }
    let array = [`**Owner:** ${message.guild.owner.user}`,`**Created on:** ${message.guild.createdAt.toLocaleString().split("GMT")[0].trim()}`,`**Roles:** ${message.guild.roles.size}`,
                 `**Voice channels:** ${message.guild.channels.filter(c=>c.type==="voice").size}`,`**Channels:** ${message.guild.channels.filter(c=>c.type==="text").size}`,
                 `**Total members:** ${message.guild.members.size}`]
    let plugins = []
    for(let cat in client.plugins){
      let pluginobject = client.plugins[cat];
      let pluginlink = client.pluginurlbase.replace(/{ID}/,pluginobject.id);
      plugins.push(`**[${pluginobject.name}](${pluginlink})** ${pluginobject.version} (${pluginobject.server} | ${pluginobject.support})\n${pluginobject.description}`)
    }
    let embed = new Discord.RichEmbed()
    .setAuthor(`'${message.guild.name}' Server info`,message.guild.iconURL,null)
    .setDescription(array.join("\n"))
    .setColor("#037bfc")
    .addField(`**Bot info:** `,[`**Uptime:** ${prettyMs(client.uptime)}`,`**Creator:** ${client.developer?client.developer:client.developerstr}`].join("\n"))
    .setThumbnail(message.guild.iconURL)
    .setFooter(`Requested by ${message.author.tag}`)
    message.channel.send(embed).then(m=>{
      if(removemessage)m.delete(25000).catch(e=>{});
    })
  },
}