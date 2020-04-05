const Discord = require("discord.js")
const request = require('request');
const requestpromise = require('request-promise')
const thisclass = this;
const byemessages = ["{USERNAME} has left.",
                     "{USERNAME} abandoned us.",
                     "It's dangerous to go alone, but {USERNAME} left.",
                     "{USERNAME} was ALT + F4.",
                     "{USERNAME} left! Only {MEMBERS} left."]
module.exports.registerMember = (bot,member) =>{
  bot.database.prepare(`INSERT INTO membersinfo (userid,username,registerdate) VALUES (?,?,?)`).run(member.user.id,member.user.username,member.joinedAt.getTime());
}
//HI
module.exports.sendByeEmbed = async (bot,member,isRegistered) =>{
  if(!isRegistered)return;
  let welcomechannel = member.guild.channels.find(c=>c.name===bot.canales.despedidas)
  if(welcomechannel){
    let embed = new Discord.RichEmbed()
    embed.setDescription(byemessages[Math.floor(Math.random()*byemessages.length)].replace("{USERNAME}",member.user.username).replace("{USER}",member.user).replace("{MEMBERS}",member.guild.members.filter(m=>!m.bot).size))
    .setColor(bot.colors.bye)
    welcomechannel.send(embed).catch(e=>{})
  }
}
module.exports.sendWelcomeEmbed = async (bot,member,isNew) =>{
  let welcomechannel = member.guild.channels.find(c=>c.name===bot.canales.bienvenidas)
  if(welcomechannel){
    welcomechannel.send(`${member.user}`).then(m=>m.delete(500).catch(e=>{}))
    let crules = member.guild.channels.find(c=>c.name===bot.canales.reglas)
    let cannouncements = member.guild.channels.find(c=>c.name===bot.canales.anuncios)
    let cbotcommands = member.guild.channels.find(c=>c.name===bot.canales.comandosbot)
    let name = isNew?`Welcome to the server ${member.user.username}!`:`Welcome back to the server ${member.user.username}!`
    let finalmessage = bot.welcomemessage.join("\n").replace("{USER}",member.user).replace("{USERNAME}",member.user.username).replace("{MEMBERS}",member.guild.members.filter(m=>!m.bot).size)
                    .replace("{COMANDOSBOT}",cbotcommands).replace("{ANUNCIOS}",cannouncements).replace("{REGLAS}",crules);
    let embed = new Discord.RichEmbed()
    embed.setAuthor(name,member.user.displayAvatarURL,null)
    .setThumbnail(member.user.displayAvatarURL)
    .setDescription(finalmessage)
    .setColor(bot.colors.welcome)
    welcomechannel.send(embed).catch(e=>{})
  }
}
module.exports.updateMembersChannel = async (bot) =>{
  let memberscountchannel = bot.guilds.first().channels.get(bot.statistics.memberscount.channelid)
  if(memberscountchannel){
    let memberscount = bot.guilds.first().members.filter(m=>!m.user.bot).size
    let newName = bot.statistics.memberscount.format.replace(/{COUNT}/,memberscount)
    if(memberscountchannel.name!==newName){
      memberscountchannel.setName(newName)
    }
  }
}
module.exports.startPluginsCheck = (bot) =>{
  thisclass.updatePlugins(bot);
  setTimeout(()=>{
    thisclass.updatePlugins(bot);
  },60000);
  setInterval(()=>{
    thisclass.updatePlugins(bot);
  },3600000)
}
module.exports.updatePlugins = (bot) =>{
  for(let cat in bot.plugins){
    let link = bot.versionurlbase.replace(/{ID}/,bot.plugins[cat].id)
    request(link,(err,res,body)=>{
      bot.plugins[cat].version = body
    })
  }
}
module.exports.registerMembersForGuild = (bot,guild,registeredlist) => {
  let nobotrole = guild.roles.find(r=>r.name===bot.defaultrole)
  let memberslist = nobotrole.members.filter(m=>!m.user.bot)//.map(m=> m.user.id);
  let botslist = guild.members.filter(m=>m.user.bot).map(m=> m.user.id);
  registeredlist = registeredlist.map(re=>re.userid)
  console.log(`👥 Real members in the server: ${memberslist.size} | 🤖 Bots list: ${botslist.length}`)
  console.log(`👥 Members registered in the database: ${registeredlist.length}`)
  memberslist.filter(m=>!registeredlist.includes(m.id)).forEach(member=>{
    console.log(`Attemping to register ${member.user.tag} (${member.id})`)
    thisclass.registerMember(bot,member)
  })
}
module.exports.plusMessage = (bot,member) => {
  let memberinfo = bot.database.prepare(`SELECT * FROM membersinfo WHERE userid=?`).get(member.id);
  if(!memberinfo){
    thisclass.registerMember(bot,member);
    return;
  }
  bot.database.prepare(`UPDATE membersinfo SET messagescount=? WHERE userid=?`).run(memberinfo.messagescount+1,member.id);
}
let samechannel = true;
module.exports.addExperience = (bot,message) => {
  let minexp = 50;
  let maxexp = 150;
  let randomexp = Math.floor(Math.random()*maxexp-minexp) + minexp
  let member = message.member;
  let memberinfo = bot.database.prepare(`SELECT * FROM membersinfo WHERE userid=?`).get(member.id);
  if(!memberinfo){
    thisclass.registerMember(bot,member);
    return;
  }
  let newexp = memberinfo.experience + randomexp;
  let newlevel = memberinfo.level;
  
  let nextlevelexperience = bot.levelsmap.get(memberinfo.level+1);
  let maxlevel;
  if(typeof nextlevelexperience == "undefined"){
    maxlevel = true;
  }else{
    if(newexp>nextlevelexperience){
      let levelupchannel;
      if(samechannel){
            levelupchannel = message.guild.channels.find(c=>c.name==="level-up");

      }else{
        levelupchannel = message.channel;
      }
      if(levelupchannel){
        levelupchannel.send(`:up: **| Congratulations ${message.author}! You leveled up to ${newlevel} level!**`)
      }
      newlevel++;
    }
  }
  bot.database.prepare(`UPDATE membersinfo SET experience=?,level=? WHERE userid=?`).run(newexp,newlevel,member.id);
}
module.exports.addCoins = (bot,member) => {
  let mincoins = 50;
  let maxcoins = 150;
  let randomcoins = Math.floor(Math.random()*maxcoins-mincoins) + mincoins
  
  let memberinfo = bot.database.prepare(`SELECT * FROM membersinfo WHERE userid=?`).get(member.id);
  if(!memberinfo){
    thisclass.registerMember(bot,member);
    return;
  }
  bot.database.prepare(`UPDATE membersinfo SET coins=? WHERE userid=?`).run(memberinfo.coins+randomcoins,member.id);
}