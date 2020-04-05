const Discord = require("discord.js");
module.exports = {
  name: "messageReactionAdd",
  run: async (bot,messageReaction,user) => {
    console.log(`Reaction add called ${messageReaction.emoji.name}`)
    if(!user.bot){
      if(messageReaction.message.channel.name===bot.canales.tickets){
        let member = messageReaction.message.guild.members.get(user.id);
        if(!member){
          console.log(`❌ Impossible error!`)
        }
        if(!member.roles.some(r=>bot.highstaff.includes(r.name)))messageReaction.remove(user);
        if(messageReaction.emoji.name==="🎟"){
          console.log(`Reaction emoji is tickets`)
          let ticketname = `ticket-${member.id}`;
          let ticket = member.guild.channels.find(c=>c.name===ticketname)
          if(ticket){
            ticket.send(`:tickets: **¡${member.user} use this ticket before opening a new one!**`);
            member.send(`${bot.emoji.cross} **You already have an opened ticket!**`).then(m=>{
            }).catch(e=>{
            })
            return;
          }
          bot.emit("newTicket",member)
        }
      }else if(messageReaction.message.channel.name===bot.canales.verification){
        let member = messageReaction.message.guild.members.get(user.id);
        if(!member){
          console.log(`❌ Impossible error!`)
        }
        if(!member.roles.some(r=>bot.highstaff.includes(r.name)))messageReaction.remove(user);
        if(messageReaction.emoji.name==="squiddance"){
          bot.emit("verificationComplete",member)
        }
      }
    }
  }
}