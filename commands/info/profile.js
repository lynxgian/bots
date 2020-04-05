const Discord = require("discord.js");
module.exports = {
  name: "profile", //Command name, same as file name.
  description: "Check your profile info.", //Description
  aliases: ["p","rank","level","info","xp","exp","bal","balance","coins","money","cash"],
  category: "info", //Not useful but maybe in a future, so complete it anyways.
  run: async (bot, message, args) => {
    let removemessage = false;
    if(message.channel.name !== bot.canales.comandosbot){
      if(!message.member.roles.some(r=>bot.highstaff.includes(r.name)))return;
      message.delete(500).catch(e=>{});
      removemessage = true;
    }
    let targetmember = message.member;
    if(args[0]){
      let target = message.guild.members.find(m=>m.user.username === args[0]) ||  message.guild.members.find(m=>m.user.tag === args[0]) || message.guild.members.get(args[0].replace(/[^0-9]/g,""))
      if(target)targetmember = target;
    }
    let memberinfo = bot.database.prepare(`SELECT * FROM membersinfo WHERE userid=?`).get(targetmember.id);
    if(!memberinfo){
      return message.channel.send(`${bot.emoji.cross} **| ${message.author}, this member is not registered in database!**`).then(m=>m.delete(15000).catch(e=>{}));
    }
    let nextlevelexperience = bot.levelsmap.get(memberinfo.level+1);
    let displaynextlevel;
    if(typeof nextlevelexperience == "undefined"){
      displaynextlevel = "MAX LEVEL!";
    }else{
      let levelexp = memberinfo.experience-bot.levelsmap.get(memberinfo.level);
      let requiredexp = nextlevelexperience-bot.levelsmap.get(memberinfo.level);
      displaynextlevel = `To Level Up: ${levelexp}/${requiredexp}`
    }
    let description = [`**Nickname:** ${targetmember.displayName}`,
                       `**Level:** ${memberinfo.level}`,
                       `**XP:** ${memberinfo.experience} **(${displaynextlevel})**`,
                       `**Coins:** ${memberinfo.coins}`,
                       `**Daily Streak:** ${memberinfo.streak}`,
                       `**Warns:** ${memberinfo.warns}`,
                       `**Messages:** ${memberinfo.messagescount}`]
    let joindate = targetmember.joinedTimestamp == memberinfo.registerdate?`**Join Date:** ${new Date(memberinfo.registerdate).toLocaleString().split("GMT")[0]}`:`**First join date:** ${targetmember.joinedAt.toLocaleString().split("GMT")[0]}\n**Last join date:** ${targetmember.joinedAt.toLocaleString().split("GMT")[0]}`
    let accinfo = [`**Creation Date:** ${targetmember.user.createdAt.toLocaleString().split("GMT")[0]}`,
                   `${joindate}`]
    let embed = new Discord.RichEmbed()
    .setAuthor(`${targetmember.user.username}'s information`,targetmember.user.displayAvatarURL,null)
    .setThumbnail(targetmember.user.displayAvatarURL)
    .setDescription(description.join("\n"))
    .setColor(bot.colors.main)
    .addField(`Account Information`,accinfo.join("\n"))
    .setFooter(`${bot.footer} - Requested by ${message.author.tag}`)
    message.channel.send(embed).then(m=>m.delete(15000).catch(e=>{}));
  }
}