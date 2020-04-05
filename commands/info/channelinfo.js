let {RichEmbed} = require("discord.js")

module.exports = {
  name: "channelinfo", //Command name, same as file name.
  description: "Shows channel info.", //Description
  aliases: ["cinfo"],
  category: "info", //Not useful but maybe in a future, so complete it anyways.
  run: async (client, message, args) => {
  // define our embed
  message.delete()

// define channel
let channel = message.guild.channels.find(c => c.name.includes(args.join(' '))) || message.mentions.channels.first() || message.guild.channels.get(args[0]) || message.channel;




// make an embed
let embed = new RichEmbed()
  .setColor('RANDOM')
  .setAuthor(`Channels | ${channel.name}`, message.guild.iconURL,null)
  .addField('Channel Name', `\`${message.channel.name}\``, true)
  .addField('Channel ID', `\`${channel.id}\``, true)
  .addField('Channel Catagory', `\`${message.channel.parent.name}\``)
  .addField('Channel Created At', `\`${new Date(channel.createdAt).toLocaleString('en-us', { dateStyle: 'full'})}\``)
  .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL)

// send the embed
message.channel.send(embed).then(m=> m.delete(10000));

}
}