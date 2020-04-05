
module.exports = {
  name: "guildMemberAdd",
  run: async (bot,member) => {
    if(member.user.bot){
      return;
    }
    bot.updater.updateMembersChannel(bot);
  }
}