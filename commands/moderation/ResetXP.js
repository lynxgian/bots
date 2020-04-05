const {RichEmbed} = require('discord.js');
module.exports = {
    name: "resetxp",
    category: "moderation",
    aliases: ["rxp"],
    description: "resets  the users XP",
    run: async (bot, message, args) => {
        message.delete();
        if (message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Nice Try").then(m=> m.delete(5000))
        let target = message.guild.members.find(m=>m.user.username === args[0]) ||  message.guild.members.find(m=>m.user.tag === args[0]) || message.guild.members.get(args[0].replace(/[^0-9]/g,""));    if(!target){
            return message.channel.send(`${bot.emoji.cross} **| You need to specify a valid member.**`).then(m=>m.delete(15000).catch(e=>{}));
        }
        let memberinfo = bot.database.prepare(`SELECT * FROM membersinfo WHERE userid=?`).get(target.id);
        if(!memberinfo){
            return message.channel.send(`${bot.emoji.cross} **| ${message.author}, this member is not registered in database!**`).then(m=>m.delete(15000).catch(e=>{}));
        }
    let xp = 0;
        let reason = args.slice(1).join(" ");
        let delivered = false;
    bot.database.prepare(`UPDATE membersinfo SET experience=? WHERE userid=?`).run(xp,target.id);
        bot.database.prepare(`UPDATE membersinfo SET level=? WHERE userid=?`).run(xp,target.id);
        bot.database.prepare(`UPDATE membersinfo SET coins=? WHERE userid=?`).run(xp,target.id);

        message.channel.send(`${bot.emoji.check} **| You have cleared all of the XP from ${target.user.tag}${reason?` for: '${reason}'`:""}. Actual XP: ${xp}**`).then(m=>{
            m.react(delivered?"✅":"❌").catch(e=>{})
            m.delete(15000).catch(e=>{})
        });
    }
}