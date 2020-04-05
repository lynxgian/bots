const Discord = require("discord.js");
module.exports = {
  name: "clearwarns", //Command name, same as file name.
  description: "Remove all warns from a member", //Description
  category: "moderation", //Not useful but maybe in a future, so complete it anyways.
  run: async (bot, message, args) => {
    if(!message.member.roles.some(r=>bot.staffroles.includes(r.name)))return;
    message.delete(500).catch(e=>{});
    if(!args[0]){
      return message.channel.send(`${bot.emoji.cross} **| You need to specify a valid member.**`).then(m=>m.delete(15000).catch(e=>{}));
    }
    let target = message.guild.members.find(m=>m.user.username === args[0]) ||  message.guild.members.find(m=>m.user.tag === args[0]) || message.guild.members.get(args[0].replace(/[^0-9]/g,""));
    if(!target){
      return message.channel.send(`${bot.emoji.cross} **| You need to specify a valid member.**`).then(m=>m.delete(15000).catch(e=>{}));
    }
    let memberinfo = bot.database.prepare(`SELECT * FROM membersinfo WHERE userid=?`).get(target.id);
    if(!memberinfo){
      return message.channel.send(`${bot.emoji.cross} **| ${message.author}, this member is not registered in database!**`).then(m=>m.delete(15000).catch(e=>{}));
    }
    let warns = 0;
    let reason = args.slice(1).join(" ")
    let delivered = false;
    try{
      await target.send(`:no_entry_sign: **| Your warns have been cleared by ${message.author}${reason?` for: '${reason}'`:""}. Actual warnings: ${warns}****`);
      delivered = true;
    }catch(e){
      delivered = false
    }
    bot.database.prepare(`UPDATE membersinfo SET warns=? WHERE userid=?`).run(warns,target.id)
    message.channel.send(`${bot.emoji.check} **| You have cleared all warns from ${target.user.tag}${reason?` for: '${reason}'`:""}. Actual warnings: ${warns}**`).then(m=>{
      m.react(delivered?"✅":"❌").catch(e=>{})
      m.delete(15000).catch(e=>{})
    });
  }
}