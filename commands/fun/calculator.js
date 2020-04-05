const math = require('mathjs'); //define mathjs
const {RichEmbed} = require("discord.js") //define RichEmbed

module.exports = {
        name: "calculate",
        category: "fun",
        description: "calculates any equation for you",
    run: async (bot, message, args) => {
if (!args[0]) return message.channel.send('Please input a calculation');

let resp;
try {
    resp = math.evaluate(args.slice(1).join(' '));
} catch (e) {
    return message.channel.send('Sorry, please input a valid calculation');
}

let embed = new RichEmbed()
     .setColor('RANDOM')
     .setTitle('Math Calculation')
     .addField('Input', `\`\`\`js\n${args.join(' ')}\`\`\``)
     .addField('Output', `\`\`\`js\n${resp}\`\`\``)

message.channel.send(embed);

  }
}