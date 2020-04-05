module.exports = {
  name: "verificationComplete",
  run: async (bot,member) => {
    if(member.roles.some(r=>r.name===bot.defaultrole))return;
    let verificationRole = member.guild.roles.find(r=>r.name===bot.defaultrole);
    if(!verificationRole){
      console.log(`❌ WARNING: Default role '${bot.defaultrole}' couldn't be found! Create it ASAP!!!`)
      return;
    }
    member.addRole(verificationRole.id).catch(e=>{
      console.log(`❌ Couldn't add verification role to: ${member.user.tag}! Contact an administrator ASAP!`)
    })
    let memberinfo = bot.database.prepare(`SELECT * FROM membersinfo WHERE userid=?`).get(member.id)
    if(memberinfo){
      bot.updater.sendWelcomeEmbed(bot,member,false);
    }else{
      bot.updater.registerMember(bot,member);
      bot.updater.sendWelcomeEmbed(bot,member,true);
    }
    //can u fix my chat filter pls I just need it to block links idrc if u curse in my chat so thats all I need
  }
}