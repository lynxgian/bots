const Discord = require("discord.js");
module.exports = {
    name: "dm",
    category: "moderation",
    description: "dms a user",
    run: async (client, message, args) => {
        message.delete()
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have enough permission").then(m => m.delete(5000));
    let ruser = message.mentions.members.first() || message.guild.members.get(args[0]);
    let dm = args.slice(1).join(" ");
    
    if(!ruser) return message.channel.send("Please mention a user for me to dm").then(m => m.delete(5000));
    if(!dm) return message.channel.send("Please write a message for me to send").then(m => m.delete(5000));
    let dembed = new Discord.RichEmbed()
    .setColor("PURPLE")
    .setTitle(message.guild.name)
    .setDescription(dm)
    .setFooter(message.author.tag, message.author.displayAvatarURL);
    ruser.send(dembed);
    const embed = new Discord.RichEmbed()
    .setColor("GREEN")
    .addField('You have sucessfully dmed:', ruser);
    message.channel.send(embed).then(m => m.delete(15000))
    
    }
}