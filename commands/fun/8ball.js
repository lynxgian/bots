const Discord = require("discord.js");
const fs = require("fs");
let list = ["It is certain.","It is decidedly so.","Without a doubt","Yes - definitely.","You may rely on it.","As I see it, yes.","Most likely.","Outlook good.",
            "Yes.","Signs point to yes.","Reply hazy, try again","Ask again later.","Better not tell you now.","Cannot predict now.",
            "Concentrate and ask again.","Don't count on it.","My reply is no.","My sources say no.","Outlook not so good.","Very doubtful."]
module.exports = {
    name: "8ball",
    aliases: ["eightball"],
    usage: "(command)",
    category: "fun",
    description: "Try it yourself.",
    run: async (bot, message, args) => {
      let removemessage = false;
      if(message.channel.name !== bot.canales.comandosbot){
        if(!message.member.roles.some(r=>bot.highstaff.includes(r.name)))return;
        message.delete(500).catch(e=>{});
        removemessage = true;
      }
      if(!args[0])return message.channel.send(`${bot.emoji.cross} **| Hey ${message.author}, you need to ask something!**`).then(m=>m.delete(7000).catch());
      let question = args.join(" ")
      let answer = list[Math.floor(Math.random()* list.length)]
      let descriptionstring = "**Question:**\n"+
          `${question}\n`+
          "**Answer:**\n"+
          `${answer}`
      let embed = new Discord.RichEmbed()
      .setAuthor(message.author.tag,"https://www.horoscope.com/images-US/games/game-magic-8-ball-no-text.png",null)
      .setDescription(descriptionstring)
      .setThumbnail("https://www.horoscope.com/images-US/games/game-magic-8-ball-no-text.png")
      .setFooter(bot.footer)
      .setColor(bot.colors.eightball)
      .setTimestamp()
      message.channel.send(embed).then(m=>{
        if(removemessage)m.delete(60000).catch(e=>{})
      });
    }
}