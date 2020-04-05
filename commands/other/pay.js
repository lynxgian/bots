const {RichEmbed} = require('discord.js')
module.exports = {
    name: "donate",
    category: "other",
    description: "pay",
    run: async (client, message, args) => {
message.delete()

let user = "XiriBE";
let amount = args[0];
if (!/\d+(\.\d+)?/.test(amount)) amount = 1;
message.channel.send(makeLink(user, amount));

function makeLink(user, amount) {
  const embed = new RichEmbed()
  .setColor("GREEN")
  .setTitle("Donate Link Created")
  .setDescription(`<https://paypal.me/${user}/${amount}>`)
    return message.channel.send(embed)
}
}
}