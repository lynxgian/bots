const ms = require("ms");
const fs = require("fs");
const randomColor = require("randomcolor");
const { RichEmbed, Collection } = require("discord.js");
let data = require("../../data/giveaways.json");
let embeds = require("../../data/giveawayembeds.json");

module.exports =
    {
        name: "giveaway",
        category: "giveaway",
        description: "Starts a giveaway",
        usage: " [prize] ; [length]; (winnerAmount)",
        config:
            {
                name: "giveaway",
                folder: "tools",
            },
        run: async (client, message, args) =>
        {
            if (!message.member.hasPermission("ADMINISTRATOR"))
            {
                message.delete();
                return message.channel.send("You don't have permission to do this!");
            }

            sleep = (ms) =>
            {
                return new Promise((resolve) =>
                {
                    setTimeout(resolve, ms);
                });
            }

            let author = message.author;
            let guild = message.guild;

            for (i = 0; i < 100; i++)
            {
                if (!data[i]) break;
                if (data[i] && i === 99)
                {
                    message.delete();
                    return message.channel.send("You can only run 99 giveaways at one time!");
                }
            }
            let id = Math.floor(Math.random() * 100);
            while (data[id])
            {
                id = Math.floor(Math.random() * 100);
            }

            let prizes = "";
            let lengthIndex;
            if (args.length > 0)
            {
                for (i = 0; i < args.length; i++)
                {
                    let a = args[i];

                    if (a === ";")
                    {
                        lengthIndex = i + 1;
                        break;
                    }
                    if (a[a.length - 1] === ";")
                    {
                        prizes += ` ${a.slice(0, -1)}`;
                        lengthIndex = i + 1;
                        break;
                    }
                    prizes += ` ${a}`;
                }
            }

            let length = "";
            let amountIndex;
            if (args.length > lengthIndex)
            {
                for (i = lengthIndex; i < args.length; i++)
                {
                    let a = args[i];
                    console.log(a);
                    if (a === ";")
                    {
                        amountIndex = i + 1;
                        break;
                    }
                    if (a[a.length - 1] === ";")
                    {
                        length += ` ${a.slice(0, -1)}`;
                        amountIndex = i + 1;
                        break;
                    }
                    length += ` ${a}`;
                }
            }
            length = length.slice(1);



            let lengthCorrect = true;
            if (length) lengthCorrect = (ms(length)) ? true : false;

            let amount = args[amountIndex];
            let amountCorrect;
            if (!amount)
            {
                amountCorrect = true;
                amount = 1;
            }
            else amountCorrect = (isNaN(amount)) ? false : true;

            if (!prizes)
            {
                message.delete();
                return message.channel.send("Please specify the giveaway's prizes and the giveaway's length!");
            }
            if (!length)
            {
                message.delete();
                return message.channel.send("Please specify the giveaway's length!");
            }
            if (!lengthCorrect)
            {
                if (amountCorrect)
                {
                    message.delete();
                    return message.channel.send("The giveaway's length is incorrect! <number 1d/w/m");
                }
                else
                {
                    message.delete();
                    return message.channel.send("The giveaway's length and the winner amount is incorrect!");
                }
            }
            if (lengthCorrect && !amountCorrect)
            {
                message.delete();
                return message.channel.send("The winner amount is incorrect!");
            }
            if (ms(length) > 2147483647)
            {
                message.delete();
                return message.channel.send("The giveaway's length is too long!");
            }
            if (ms(length) < 10000)
            {
                message.delete();
                return message.channel.send("The giveaway's length needs to be at least 10 seconds!");
            }

            let remaining = "";
            if (Math.floor(ms(length) / 86400000) > 0)
            {
                if (Math.floor(ms(length) / 86400000) === 1)
                {
                    remaining += `${Math.floor(ms(length) / 86400000)} day `;
                }
                else
                {
                    remaining += `${Math.floor(ms(length) / 86400000)} days `;
                }
            }
            if (Math.floor(ms(length) % 86400000 / 3600000) > 0)
            {
                if (Math.floor(ms(length) % 86400000 / 3600000) === 1)
                {
                    remaining += `${Math.floor(ms(length) % 86400000 / 3600000)} hour `;
                }
                else
                {
                    remaining += `${Math.floor(ms(length) % 86400000 / 3600000)} hours `;
                }
            }
            if (Math.floor(ms(length) % 86400000 % 3600000 / 60000) > 0)
            {
                if (Math.floor(ms(length) % 86400000 % 3600000 / 60000) === 1)
                {
                    remaining += `${Math.floor(ms(length) % 86400000 % 3600000 / 60000)} minute `;
                }
                else
                {
                    remaining += `${Math.floor(ms(length) % 86400000 % 3600000 / 60000)} minutes `;
                }
            }
            if (Math.floor(ms(length) % 86400000 % 3600000 % 60000 / 1000) > 0) remaining += `${Math.floor(ms(length) % 86400000 % 3600000 % 60000 / 1000)} seconds `;
            remaining.trim();

            let embed = new RichEmbed()
                .setColor(randomColor())
                .setAuthor(client.user.username, client.user.avatarURL)
                .setTitle("Giveaway")
                .setDescription("To participate in this giveaway, react with  ✅")
                .addField("**ID:**", id)
                .addField("**Prizes:**", prizes)
                .addField("**Remaining time:**", remaining)
                .addField("**Winners:**", amount)
                .setTimestamp();

            let ch = guild.channels.find(c => c.name === "giveaways");
            ch.send(embed).then(msg =>
            {
                msg.react("✅");
                embeds[id] = msg.id;
                fs.writeFileSync("./data/giveawayembeds.json", JSON.stringify(embeds, null, 4));
            });

            data[id] =
                {
                    lastDraw: Date.now(),
                    authorID: author.id,
                    length: length,
                    remaining: ms(length) - 5000,
                    prizes: prizes,
                    entries: [],
                    winners: [],
                    amount: amount,
                    ended: false,
                }

            fs.writeFileSync("./data/giveaways.json", JSON.stringify(data, null, 4));

            client.on("messageReactionAdd", (reaction, user) =>
            {
                if (reaction.message.id !== embeds[id]) return;
                if (data[id].entries.includes(user.id)) return;
                if (reaction.emoji.name !== "✅") return;
                if (user === client.user) return;

                data[id].entries.push(user.id);
                fs.writeFileSync("./data/giveaways.json", JSON.stringify(data, null, 4));
            });

            let interval = setInterval(() =>
            {
                if (data[id].remaining < 5000) return clearInterval(interval);

                if (data[id].remaining % 5000 >= 1000)
                {
                    data[id].remaining -= data[id].remaining % 5000;
                    sleep(data[id].remaining % 5000);
                }

                remaining = "";
                if (Math.floor(data[id].remaining / 86400000) > 0)
                {
                    if (Math.floor(data[id].remaining / 86400000) === 1)
                    {
                        remaining += `${Math.floor(data[id].remaining / 86400000)} day `;
                    }
                    else
                    {
                        remaining += `${Math.floor(data[id].remaining / 86400000)} days `;
                    }
                }
                if (Math.floor(data[id].remaining % 86400000 / 3600000) > 0)
                {
                    if (Math.floor(data[id].remaining % 86400000 / 3600000) === 1)
                    {
                        remaining += `${Math.floor(data[id].remaining % 86400000 / 3600000)} hour `;
                    }
                    else
                    {
                        remaining += `${Math.floor(data[id].remaining % 86400000 / 3600000)} hours `;
                    }
                }
                if (Math.floor(data[id].remaining % 86400000 % 3600000 / 60000) > 0)
                {
                    if (Math.floor(data[id].remaining % 86400000 % 3600000 / 60000) === 1)
                    {
                        remaining += `${Math.floor(data[id].remaining % 86400000 % 3600000 / 60000)} minute `;
                    }
                    else
                    {
                        remaining += `${Math.floor(data[id].remaining % 86400000 % 3600000 / 60000)} minutes `;
                    }
                }
                if (Math.floor(data[id].remaining % 86400000 % 3600000 % 60000 / 1000) > 0) remaining += `${Math.floor(data[id].remaining % 86400000 % 3600000 % 60000 / 1000)} seconds `;
                remaining.trim();

                embed.fields.find(f => f.name === "**Remaining time:**").value = remaining;
                ch.fetchMessage(embeds[id]).then(msg =>
                {
                    if (msg) msg.edit(embed);
                }).catch(err => { return clearInterval(interval) });

                data[id].remaining -= 5000;

            }, 5000);

            setTimeout(async () =>
            {
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

                        winnersTxt += `<@${userID}>\n`;
                        winnersTxt.trim();
                        await winners.push(userID);
                    }
                }
                else
                {
                    enoughEntry = false;
                    for (i = 0; i < info.entries.length; i++)
                    {
                        winnersTxt += `<@${info.entries[i]}>\n`;
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

                    if (info.amount === 1) congratEmbed.setDescription(`You are the winner of the giveaway! You won: ${prizes}`);
                    else congratEmbed.setDescription(`You are one of the ${info.amount} winners of the giveaway! You won: ${prizes}`);

                    member.send(congratEmbed);
                });


                if (enoughEntry)
                {
                    embed = new RichEmbed()
                        .setColor(randomColor())
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .setTitle("Giveaway ended")
                        .setDescription(`This giveaway ended after ${ms(ms(length), { long: true})}`)
                        .addField("**ID**", id)
                        .addField("**Prizes:**", prizes)
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
                            .setDescription(`This giveaway ended after ${ms(ms(length), { long: true})}`)
                            .addField("**ID**", id)
                            .addField("**Prizes:**", prizes)
                            .addField("**Issue:**", "There were no entries to the giveaway.")
                            .setTimestamp();
                    }
                    else
                    {
                        embed = new RichEmbed()
                            .setColor(randomColor())
                            .setAuthor(client.user.username, client.user.avatarURL)
                            .setTitle("Giveaway ended")
                            .setDescription(`This giveaway ended after ${ms(ms(length), { long: true})}`)
                            .addField("**ID**", id)
                            .addField("**Prizes:**", prizes)
                            .addField("**Winners:**", winnersTxt)
                            .addField("**Issue:**", "The entries weren't enough.")
                            .setTimestamp();
                    }
                }

                let msgID;
                await ch.fetchMessage(embeds[id]).then(async msg =>
                {
                    await ch.send(embed).then(msgB => msgID = msgB.id);
                    msg.delete();
                }).catch(async err => await ch.send(embed).then(msgB => msgID = msgB.id));

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


                if (guild.members.get(author.id)) guild.members.get(author.id).send(listEmbed);

                setTimeout(() =>
                {
                    delete data[id];
                    fs.writeFileSync("./data/giveaways.json", JSON.stringify(data, null, 4));

                }, 86400000);

            }, ms(length));

            message.delete();
        }
    }