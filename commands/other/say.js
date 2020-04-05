const { RichEmbed } = require("discord.js");
module.exports = {
  name: "say", //Command name, same as file name.
  description: "copies a message you say", //Description
  category: "other", //Not useful but maybe in a future, so complete it anyways.
  run: async (client, message, args) => {
    message.delete();
    if (args.length < 0)
      return message.reply(`Nothing to say?`).then(m => m.delete(5000));

    // If the first argument is embed, send an embed,
    // otherwise, send a normal message
    if (args[0].toLowerCase() === "embed") {
      const embed = new RichEmbed()
        .setDescription(args.slice(1).join(" "))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(message.author.username, message.author.displayAvatarURL);

      message.channel.send(embed);
    } else {
      message.channel.send(args.join(" "));
    }
  }
};
