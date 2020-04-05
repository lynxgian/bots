const Discord = require("discord.js")
module.exports = {
  name:"ready",
  run: async (bot) => {

    console.log(`📚 Loading messages:`)
    startActivities(bot);
    bot.loadchannels.forEach((number,channel)=>loadChannel(bot.guilds.first(),channel,number))
    console.log(`💚 ${bot.user.tag} is online in ${bot.guilds.size} servers!`)
    let registeredlist = bot.database.prepare(`SELECT userid FROM membersinfo`).all()
    bot.updater.registerMembersForGuild(bot,bot.guilds.first(),registeredlist);
    try{
      bot.developer = await bot.fetchUser("312735373769965568");
    }catch(e){}
  }
}

function startActivities(bot){
  bot.user.setStatus("online")
  let time = 0
  setInterval(() => {
      if(time===0){
          bot.user.setActivity(`${bot.prefix}help`,{type: 'PLAYING'});
          time++
      }else if(time===1){
          bot.user.setActivity(`${bot.guilds.first().members.filter(m=>!m.user.bot).size} members`,{type: 'WATCHING'});
          time++
      }else if(time===2){
          bot.user.setActivity(`This discord`,{type: 'WATCHING'});
          time = 0
      }
  },10000);
}
function loadChannel(guild,channel,number){
  let targetChannel = guild.channels.find(c=>c.name===channel)
  if(targetChannel){
    targetChannel.fetchMessages({limit:number}).then(m=>{
      console.log(`✔️ ${channel}: ${m.size} mensajes.`)
    }).catch(e=>{
      console.log(`❌ ${channel}: Error => ${e.message}`)
    })
  }else{
    console.log(`❌ ${channel}: No encontrado!`)
  }
}