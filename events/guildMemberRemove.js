module.exports = {
  name: "guildMemberRemove",
  run: async (bot,member) => {
    if(member.user.bot){
      return;
    }
    bot.updater.updateMembersChannel(bot);
    bot.updater.sendByeEmbed(bot,member,true);
  }
}