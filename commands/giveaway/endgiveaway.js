const ms = require("ms");
const fs = require("fs");
const randomColor = require("randomcolor");
const { RichEmbed } = require("discord.js");
let data = require("../../data/giveaways.json");
let embeds = require("../../data/giveawayembeds.json");

module.exports =
    {
        name: "endgiveaway",
        category: "giveaway",
        description: "ends a current giveaway",
        usage: " [ID]",
        config:
            {
                name: "endgiveaway",
                folder: "tools",
            },
        run: async (client, message, args) =>
        {
            if (!message.member.hasPermission("ADMINISTRATOR"))
            {
                message.delete();
                return message.channel.send("You don't have permission to do this!");
            }

            let guild = message.guild;

            let id = args[0];

            if (!id)
            {
                message.delete();
                return message.channel.send("Please specify the giveaway's ID!");
            }
            if (!data[id])
            {
                message.delete();
                return message.channel.send(`The giveaway with ID ${id} doesn't exist!`);
            }

            let info = data[id];

            if (info.ended)
            {
                message.delete();
                return message.channel.send(`The giveaway with ID ${id} doesn't exist!`);
            }

            let winners = new Array;
            let winnersTxt = "";
            let enoughEntry = true;

            if (info.entries.length > info.amount)
            {
                for (i = 0; i < info.amount; i++)
                {
                    let userID = info.entries[Math.floor(Math.random() * info.entries.length)];
                    while (winners.includes(userID)) userID = info.entries[Math.floor(Math.random() * info.entries.length)];

                    winnersTxt += `<@${userID}> \n`;
                    winnersTxt.trim();
                    await winners.push(userID);
                }
            }
            else
            {
                enoughEntry = false;
                for (i = 0; i < info.entries.length; i++)
                {
                    winnersTxt += `<@${info.entries[i]}> \n`;
                    winnersTxt.trim();
                    await winners.push(info.entries[i]);
                }
            }

            winners.forEach(w =>
            {
                let member = guild.members.get(w);

                if (!member)
                {
                    let userID = info.entries[Math.floor(Math.random() * info.entries.length)];
                    while (winners.includes(userID)) userID = info.entries[Math.floor(Math.random() * info.entries.length)];

                    member = guild.members.get(userID);
                    winnersTxt.replace(w, userID);
                }

                congratEmbed = new RichEmbed()
                    .setAuthor(client.user.username, client.user.avatarURL)
                    .setColor(randomColor())
                    .setTitle("Congratulations!");

                if (info.amount === 1) congratEmbed.setDescription(`You are the winner of the giveaway! You won: ${info.prizes}`);
                else congratEmbed.setDescription(`You are one of the ${info.amount} winners of the giveaway! You won: ${info.prizes}`);

                member.send(congratEmbed);
            });

            let embed;
            if (enoughEntry)
            {
                embed = new RichEmbed()
                    .setColor(randomColor())
                    .setAuthor(client.user.username, client.user.avatarURL)
                    .setTitle("Giveaway ended")
                    .setDescription(`This giveaway ended after ${ms(ms(info.length), { long: true})}`)
                    .addField("**ID**", id)
                    .addField("**Prizes:**", info.prizes)
                    .addField("**Winners:**", winnersTxt)
                    .setTimestamp();
            }
            else
            {
                if (info.entries.length === 0)
                {
                    embed = new RichEmbed()
                        .setColor(randomColor())
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setTitle("Giveaway ended")
                        .setDescription(`This giveaway ended after ${ms(ms(info.length), { long: true})}`)
                        .addField("**ID**", id)
                        .addField("**Prizes:**", info.prizes)
                        .addField("**Issue:**", "There were no entries to the giveaway.")
                        .setTimestamp();
                }
                else
                {
                    embed = new RichEmbed()
                        .setColor(randomColor())
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setTitle("Giveaway ended")
                        .setDescription(`This giveaway ended after ${ms(ms(info.length), { long: true})}`)
                        .addField("**ID**", id)
                        .addField("**Prizes:**", info.prizes)
                        .addField("**Winners:**", winnersTxt)
                        .addField("**Issue:**", "The entries weren't enough.")
                        .setTimestamp();
                }
            }

            let msgID;
            let ch = guild.channels.find(c => c.name === "giveaways");
            await ch.fetchMessage(embeds[parseInt(id)]).then(async msg =>
            {
                await ch.send(embed).then(msgB => msgID = msgB.id).catch(err => console.log(err));
                if (msg) msg.delete();
            }).catch(err => ch.send(embed).then(msgB => msgID = msgB.id).catch(err => console.log(err)));

            data[id].msgID = msgID;
            data[id].winners = winners;
            data[id].ended = true;
            data[id].embed = embed;
            fs.writeFileSync("./data/giveaways.json", JSON.stringify(data, null, 4));

            let listEmbed;

            winnersTxt = "";
            winners.forEach(w => winnersTxt += `${guild.members.get(w).user.tag}\n`);

            if (enoughEntry)
            {
                listEmbed = new RichEmbed()
                    .setColor(randomColor())
                    .setAuthor(client.user.username, client.user.avatarURL)
                    .setTitle("Your giveaway ended")
                    .addField("**ID**", id)
                    .addField("**Winners:**", winnersTxt)
                    .setTimestamp();
            }
            else
            {
                if (info.entries.length === 0)
                {
                    listEmbed = new RichEmbed()
                        .setColor(randomColor())
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setTitle("Your giveaway ended")
                        .addField("**ID**", id)
                        .addField("**Issue:**", "There were no entries to the giveaway.")
                        .setTimestamp();
                }
                else
                {
                    listEmbed = new RichEmbed()
                        .setColor(randomColor())
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setTitle("Your giveaway ended")
                        .addField("**ID**", id)
                        .addField("**Winners:**", winnersTxt)
                        .addField("**Issue:**", "The entries weren't enough.")
                        .setTimestamp();
                }
            }


            if (guild.members.get(info.authorID)) guild.members.get(info.authorID).send(listEmbed);

            setTimeout(() =>
            {
                delete data[id];
                fs.writeFileSync("./data/giveaways.json", JSON.stringify(data, null, 4));

            }, 1800000);

            message.delete();
        }
    }