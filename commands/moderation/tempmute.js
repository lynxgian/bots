const Discord = require("discord.js");
const ms = require("ms")
module.exports = {
  name: "tempmute",
  category: "moderation",
  description: "Description",
  usage: "(command)",
  run: async ( client, message, args) => {
    
  //!tempmute @user 1s/m/h/d
    
    let tomute = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!tomute) return message.reply("couldn't find that user.")
    if(tomute.hasPermission("ADMINISTRATOR")) return message.reply("Sorry you can mute that person")
    let muterole = message.guild.roles.find(x => x.name === `muted`);
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "Muted",
          color: "#000000	",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            SPEAK: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    
    let mutetime = args[1];
    if(!mutetime) return message.reply("Please add the time!");
    
    
    await(tomute.addRole(muterole.id));
    message.reply(`<@${tomute.id}> has been muted for ${ms(mutetime)}`);
    
    setTimeout(function(){
      tomute.removeRole(muterole.id);
      message.channel.send(`<@${tomute.id}> has been umuted!`);                    
    }, ms(mutetime));
    
    
    
  
  }
}