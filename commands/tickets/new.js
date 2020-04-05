let userTickets = new Map();
const Discord = require('discord.js')
module.exports = {
    name: "new",
    description: "Creates a ticket",
    category: "other",
    run: async (bot, message, args) => {
        message.delete();
        let server = message.guild;
        let name = message.author.username.toLowerCase() + "-ticket";
        let srole = message.guild.roles.find(r => r.name === "Staff");
        let reason = args.slice(0).join(" ");
        if (message.author.bot) return;
        let channelss = await message.guild.channels.find(x => x.name === "create-tickets");
        const ch = new Discord.RichEmbed()
            .setColor("RED")
            .setTitle("Wrong channel")
            .setDescription(`Please create a ticket in ${channelss}`);
        if (!message.channel.equals(channelss)) return message.channel.send(ch).then(m => m.delete(10000));

            const sts = new Discord.RichEmbed()
                .setColor("RED")
                .setTitle('Error')
                .setDescription(`You already have a ticket open`);
            if(!reason) reason = "No reason given";
            if (!message.guild.channels.some(channel => channel.name.endsWith("ticket"))){
            }
            if (message.guild.channels.some(channel => channel.name.endsWith("ticket"))) {
                message.author.send("You already have a ticket open");
                message.channel.send(sts).then(m => m.delete(10000))
            } else {
                const channel = await server.createChannel(name, {

                    topic: name,
                    parent: "694359448218501200",
                    type: "text",
                    permissionOverwrites: [{

                        id: message.guild.defaultRole,
                        deny: ['VIEW_CHANNEL']

                    },
                        {

                            id: message.author.id,
                            allow: ['VIEW_CHANNEL']

                        },
                        {
                            id: srole,
                            allow: ["VIEW_CHANNEL"]
                        },
                    ]}
                );

                const st = new Discord.RichEmbed()
                    .setColor("GREEN")
                    .setTitle('Success!')
                    .setDescription(`Your ticket has been created in ${channel}`)
                    .setTimestamp();
                 message.channel.send(st);

                userTickets.set(message.author.id, channel.id);
                console.log(userTickets);
                 channel.send(srole).then(m => m.delete(1000));
                channel.send("<@" + message.author.id + ">").then(m => m.delete(1000));
                const embed = new Discord.RichEmbed()
                    .setTitle("New Ticket.")
                    .setColor('BLUE')
                    .setDescription(`<@${message.author.id}> welcome to your new ticket a staff member will be with you shortly`)
                    .addField("Issue:", reason)
                    .setFooter(`DeadPool's Assistant || ticket created at: ${message.channel.createdAt.toLocaleString()}`);
                channel.send(embed);

            }
        }


};