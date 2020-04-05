const Discord = require("discord.js");
const needreason = ["You were told. You need to specify a reason..",
                    "You need to specify a reason..",
                    "You already know i need you to enter a reason.."]
module.exports = {
  name: "purge",
  aliases: ["clear","clearchat"],
  description: "Clear messages",
  category: "moderation",
  run: async (bot, message, args) => {
    if(!message.member.roles.some(r=>bot.staffroles.includes(r.name)))return;
    try{
      await message.delete(100).catch(e=>{});
    }catch(e){}
    if(!args[0]) return message.channel.send(`${bot.emoji.cross} **| Enter a valid number of messages!**`).then(m=>m.delete(5000).catch(e=>{}));
    if(isNaN(args[0])){
      let targetid = args[0].replace(/(u|s|e|r|<|>|@|!)/ig,"")
      if(!args[1])return message.channel.send(`${bot.emoji.cross} **| Enter a valid number of messages!**`).then(m=>m.delete(5000).catch(e=>{}));
      let membertarget = message.guild.members.get(targetid)
      if(!membertarget)return message.channel.send(`${bot.emoji.cross} **| Member is not valid!**`).then(m=>m.delete(5000).catch(e=>{}));
      if(isNaN[1])return message.channel.send(`${bot.emoji.cross} **| Enter a valid number of messages!**`).then(m=>m.delete(5000).catch(e=>{}));
      let amount = parseInt(args[1])
      if(amount > 100){
        return message.channel.send(`${bot.emoji.cross} **| Enter a number lower than \`100\`!**`).then(m=>m.delete(5000).catch(e=>{}));
      }
      let reason = args.slice(2).join(" ")
      if(!reason && !message.member.roles.some(r=>bot.highstaff.includes(r.name))){
         return message.channel.send(`${bot.emoji.cross} **| ${needreason[Math.floor(Math.random()*needreason.length)]}**`).then(m=>m.delete(5000).catch(e=>{}));
      }
      reason = reason?reason:"Not specified";
      let todelete
      try{
        todelete = await message.channel.fetchMessages({limit:100})
        let frommember = todelete.filter(m=>m.author.id===targetid && !m.pinned)
        if(frommember.size<=0)return message.channel.send(`${bot.emoji.cross} **| Couldn't find any message from this member in the last 100!**`).then(m=>m.delete(5000).catch(e=>{}));
        let messagesmap = frommember.map(m=>m).sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        let finaltodelete = messagesmap.slice(amount*-1)
        console.log(`From member cachec: ${frommember.size} | Original amount: ${amount} | Amount to delete: ${finaltodelete.length}`)
        if(finaltodelete.length<=0){
          return message.channel.send(`${bot.emoji.cross} **| Couldn't find any message from this member in the last 100!**`).then(m=>m.delete(5000).catch(e=>{}));
        }
        todelete = await message.channel.bulkDelete(finaltodelete)
        message.channel.send(`${bot.emoji.check} **| \`${todelete.size}\` messages deleted.**`).then(m=>m.delete(5000).catch(e=>{}));
      }catch(e){
        console.log(e.message)
        return message.channel.send(`${bot.emoji.cross} **| I can't delete messages older than 2 weeks!**`).then(m=>m.delete(5000).catch(e=>{}));
      }
      let incidentlog = message.guild.channels.find(c=>c.name==="logs");
      if(incidentlog){
        let usermessagestext = todelete.size>0?todelete.map(m=>`[${m.author.tag}]: ${m.content?m.content:m.attachments.size>0?m.attachments.map(m2=>`[Link](${m2.proxyURL})`).join(", "):`*Empty message*`}`).reverse().join("\n"):undefined
        let descriptionarray = [`**Cleared by:** ${message.author} (${message.author.id})`,`**Cleared channel:** ${message.channel} (${message.channel.id})`,
                                `**Deleted messages:** ${todelete.size}`,`**Author:** ${membertarget.user} (${membertarget.user.id})`,`**Reason:** ${reason}`,
                                `**Messages:**`,!usermessagestext?"Not available":usermessagestext]
        let finaldescription = joinArray(descriptionarray)
        let cut = finaldescription.length>2040
        finaldescription = cut?finaldescription.substring(0,2040):finaldescription
        let lastlinebreakcomma = finaldescription.lastIndexOf("\n")
        finaldescription = cut?finaldescription.substring(0,lastlinebreakcomma)+" y más..":finaldescription
        //console.log(finaldescription.length)
        
        let incidentembed = new Discord.RichEmbed()
        .setAuthor(`Clear | ${message.author.tag}`,message.author.displayAvatarURL,null)
        .setDescription(finaldescription)
        .setFooter(`${bot.footer}`)
        .setColor(bot.colors.moderation.clear)
        .setTimestamp()
        incidentlog.send(incidentembed);
      }
      return;
    }
    let amount = parseInt(args[0])
    if(amount > 100){
      let todelete
      try{
        todelete = await message.channel.fetchMessage(args[0])
        let reason = args.slice(1).join(" ")
        if(!reason && !message.member.roles.some(r=>bot.highstaff.includes(r.name))){
           return message.channel.send(`${bot.emoji.cross} **| ${needreason[Math.floor(Math.random()*needreason.length)]}**`).then(m=>m.delete(5000).catch(e=>{}));
        }
        reason = reason?reason:"Not specified";
        if(todelete.pinned){
          return message.channel.send(`${bot.emoji.cross} **| You cannot delete pinned messages..**`).then(m=>m.delete(5000).catch(e=>{}));
        }else{
          try{
            await todelete.delete(500)
            message.channel.send(`${bot.emoji.check} **| Message deleted.**`).then(m=>m.delete(5000).catch(e=>{}));
            let incidentlog = message.guild.channels.find(c=>c.name==="logs");
            if(incidentlog){
              let descriptionarray = [`**Deleted by:** ${message.author} (${message.author.id})`,`**Author:** ${todelete.author} (${todelete.author.id}}`,
                                      `**Channel:** ${message.channel} (${message.channel.id})`,`**Deleted message:** ${todelete.content?todelete.content:"*Empty message*"}`,
                                      `**Reason:** ${reason}`,`**Attachments:** ${message.attachments.size>0?message.attachments.map(a=>`[Link](${a.proxyURL})`).join(", "):"*No attachments*"}`]
              let finaldescription = joinArray(descriptionarray)
              let cut = finaldescription.length>2038
              finaldescription = cut?finaldescription.substring(0,2038):finaldescription
              let lastlinebreakcomma = finaldescription.lastIndexOf("\n")
              finaldescription = cut?finaldescription.substring(0,lastlinebreakcomma)+" and more..":finaldescription
              //console.log(finaldescription.length)
              let incidentembed = new Discord.RichEmbed()
              .setAuthor(`Clear | ${message.author.tag}`,message.author.displayAvatarURL,null)
              .setDescription(finaldescription)
              .setFooter(`${bot.footer}`)
              .setColor(bot.colors.moderation.clear)
              .setTimestamp()
              incidentlog.send(incidentembed);
            }
            return;
          }catch(e){
            console.log(e.message)
            return message.channel.send(`${bot.emoji.cross} **| Cannot delete messages older than 2 weeks!**`).then(m=>m.delete(5000).catch(e=>{}));
          }
        }
      }catch(e){
        return message.channel.send(`${bot.emoji.cross} **| Enter a number lower than \`100\`!**`).then(m=>m.delete(5000).catch(e=>{}));
      }
    }
    let reason = args.slice(1).join(" ")
    if(!reason && !message.member.roles.some(r=>bot.highstaff.includes(r.name))){
       return message.channel.send(`${bot.emoji.cross} **| ${needreason[Math.floor(Math.random()*needreason.length)]}**`).then(m=>m.delete(5000).catch(e=>{}));
    }
    reason = reason?reason:"Not specified";
    if(amount < 1) return message.channel.send(`${bot.emoji.cross} **| Enter a number greater than \`0\`!**`).then(m=>m.delete(5000).catch(e=>{}));
    let deleted;
    try{
      let fetched = await message.channel.fetchMessages({ limit: amount })
      let filtered = fetched.filter(m=>!m.pinned)
      deleted = await message.channel.bulkDelete(filtered,true)
    }catch(e){
      console.log(`❌ No se pudieron borrar ${amount} mensajes del canal #${message.channel.name} por: ${e.message}`)
      return message.channel.send(`${bot.emoji.cross} **| Unexpected error. Contact an administrator.**`).then(m=>m.delete(5000).catch(e=>{}));
    }
    message.channel.send(`${bot.emoji.check} **| \`${deleted.size}\` messages deleted.**`).then(m=>m.delete(3000).catch(e=>{}));
    
    let usermessages = deleted.filter(m=>!m.author.bot)
    let usermessagestext = usermessages.size>0?usermessages.map(m=>`[${m.author.tag}]: ${m.content?m.content:m.attachments.size>0?m.attachments.map(m2=>`[Link](${m2.proxyURL})`).join(", "):`*Mensaje vacio*`}`).reverse().join("\n"):undefined
    
    
    let incidentlog = message.guild.channels.find(c=>c.name==="logs");
    if(incidentlog){
      let descriptionarray = [`**Cleared by:** ${message.author} (${message.author.id})`,`**Cleared channel:** ${message.channel} (${message.channel.id})`,
                                `**Deleted messages:** ${deleted.size}`,`**Reason:** ${reason}`,`**Messages:**`,!usermessagestext?"Not available":usermessagestext]
      let finaldescription = joinArray(descriptionarray)
      let cut = finaldescription.length>2040
      finaldescription = cut?finaldescription.substring(0,2040):finaldescription
      let lastlinebreakcomma = finaldescription.lastIndexOf("\n")
      finaldescription = cut?finaldescription.substring(0,lastlinebreakcomma)+" y más..":finaldescription
      //console.log(finaldescription.length)
      
      let incidentembed = new Discord.RichEmbed()
      .setAuthor(`Clear | ${message.author.tag}`,message.author.displayAvatarURL,null)
      .setDescription(finaldescription)
      .setFooter(`${bot.footer}`)
      .setColor(bot.colors.moderation.clear)
      .setTimestamp()
      incidentlog.send(incidentembed);
    }
  }
}
function joinArray(array){
  return array.join("\n")
}