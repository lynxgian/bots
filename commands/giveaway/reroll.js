const fs = require("fs");
const randomColor = require("randomcolor");
const { RichEmbed } = require("discord.js");
let data = require("../../data/giveaways.json");

module.exports =
    {
        name: "reroll",
        category: "giveaway",
        description: "rerolls a giveaway",
        usage: " [ID] (@member)",
        config:
            {
                name: "reroll",
                folder: "tools",
            },
        run: async (client, message, args) =>
        {
            if (!message.member.hasPermission("ADMINISTRATOR"))
            {
                message.delete();
                return message.channel.send("You don't have permission to do this!");
            }

            let id = args[0];
            let mention = args[1];
            let member = message.mentions.members.first();

            if (!id)
            {
                message.delete();
                return message.channel.send("Please specify the giveaway's ID!");
            }
            if (!data[id])
            {
                message.delete();
                return message.channel.send("The giveaway's ID is incorrect!");
            }
            if (!data[id].ended)
            {
                message.delete();
                return message.channel.send(`The giveaway with ID ${id} haven't ended yet!`);
            }
            if (member && mention && !member.id === mention.slice(3).slice(0, -1))
            {
                message.delete();
                return message.channel.send("The mention is incorrect!");
            }
            if (member && await !data[id].winners.includes(member.user.id))
            {
                message.delete();
                return message.channel.send("The mentioned member isn't a winner!");
            }

            console.log(Date.now());
            console.log("-");
            console.log(parseInt(data[id].lastDraw));
            console.log("=");
            console.log(Date.now() - parseInt(data[id].lastDraw));
            console.log(Date.now() - parseInt(data[id].lastDraw) < 30000);

            if (Date.now() - parseInt(data[id].lastDraw) < 30000)
            {
                message.delete();
                return message.channel.send("You can reroll only in every 30 seconds!");
            }

            let winnersTxt = "";
            if (member)
            {
                let newID = data[id].entries[Math.floor(Math.random() * data[id].entries.length)];
                let newWinner = message.guild.members.get(newID);
                while (newWinner === member) newWinner = message.guild.members.get(data[id].entries[Math.floor(Math.random() * data[id].entries.length)]);

                data[id].winners.push(newID);

                let congratEmbed = new RichEmbed()
                    .setAuthor(client.user.username, client.user.avatarURL)
                    .setColor(randomColor())
                    .setTitle("Congratulations!");

                if (data[id].amount === 1) congratEmbed.setDescription(`The giveaway has been drawn again and you are the winner of the giveaway!\nYou won: ${data[id].prizes}`);
                else congratEmbed.setDescription(`The giveaway has been drawn again and you are one of the ${data[id].amount} winners of the giveaway!\nYou won: ${data[id].prizes}`);

                newWinner.send(congratEmbed);

                data[id].winners.splice(data[id].winners.indexOf(member.user.id), 1);

                let sorryEmbed = new RichEmbed()
                    .setAuthor(client.user.username, client.user.avatarURL)
                    .setColor(randomColor())
                    .setTitle("Sorry!")
                    .setDescription("The giveaway has been drawn again and you haven't won!");

                member.send(sorryEmbed);

                data[id].lastDraw = Date.now();
                fs.writeFileSync("./data/giveaways.json", JSON.stringify(data, null, 4));

                data[id].winners.forEach(w =>
                {
                    winnersTxt += `<@${w}>\n`;
                });

                let embed = new RichEmbed(data[id].embed);
                embed.fields.find(f => f.name === "**Winners:**").value = winnersTxt;

                let ch = await message.guild.channels.find(c => c.name === "giveaways");
                await ch.fetchMessage(data[id].msgID).then(async msg =>
                {
                    msg.edit(embed);
                }).catch(err => {});
            }
            else
            {
                let oldWinners = data[id].winners;

                oldWinners.forEach(w =>
                {
                    let oldWinner = message.guild.members.get(w);

                    if (oldWinner)
                    {
                        let sorryEmbed = new RichEmbed()
                            .setAuthor(client.user.username, client.user.avatarURL)
                            .setColor(randomColor())
                            .setTitle("Sorry!")
                            .setDescription("The giveaway has been drawn again and you haven't won!");

                        oldWinner.send(sorryEmbed);
                    }
                });

                data[id].winners = new Array;

                for (i = 0; i < data[id].amount; i++)
                {
                    let entries = data[id].entries;
                    entries = entries.filter(x =>
                    {
                        return oldWinners.indexOf(x) < 0;
                    });
                    let newID = entries[Math.floor(Math.random() * entries.length)];
                    let newWinner = message.guild.members.get(newID);

                    data[id].winners.push(newID);

                    let congratEmbed = new RichEmbed()
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setColor(randomColor())
                        .setTitle("Congratulations!");

                    if (data[id].amount === 1) congratEmbed.setDescription(`The giveaway has been drawn again and you are the winner of the giveaway!\nYou won: ${data[id].prizes}`);
                    else congratEmbed.setDescription(`The giveaway has been drawn again and you are one of the ${data[id].amount} winners of the giveaway!\nYou won: ${data[id].prizes}`);

                    newWinner.send(congratEmbed);
                }

                data[id].lastDraw = Date.now();
                fs.writeFileSync("./data/giveaways.json", JSON.stringify(data, null, 4));

                data[id].winners.forEach(w =>
                {
                    winnersTxt += `<@${w}>\n`;
                });

                let embed = new RichEmbed(data[id].embed);
                embed.fields.find(f => f.name === "**Winners:**").value = winnersTxt;

                let ch = await message.guild.channels.find(c => c.name === "giveaways");
                await ch.fetchMessage(data[id].msgID).then(async msg =>
                {
                    msg.edit(embed);
                }).catch(err => {});

            }

            message.delete();
        }
    }