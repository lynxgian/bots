let userTickets = new Map();
const Discord = require('discord.js')
module.exports = {
    name: "close",
    description: "Closes a ticket",
    category: "other",
    run: async (bot, message, args) => {
        message.delete();
        let channel = message.guild.channels.find(x => x.name.endsWith("-ticket"));
        if (!channel) return message.channel.send("This channel isn't a ticket").then(x => x.delete(5000))
        if (channel ){

            message.channel.send('deleting ticket');
            channel.delete()

            console.log(userTickets);

        }

    }
};