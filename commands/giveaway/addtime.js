const ms = require("ms");
const fs = require("fs");
let data = require("../../data/giveaways.json");

module.exports =
    {
        name: "addtime",
        category: "giveaway",
        description: "adds time to a giveaway",
        usage: " [ID] [length]",
        config:
            {
                name: "addtime",
                folder: "tools",
            },
        run: (client, message, args) =>
        {
            if (!message.member.hasPermission("ADMINISTRATOR"))
            {
                message.delete();
                return message.channel.send("You don't have permission to do this!");
            }

            let id = args[0];
            let length = args[1];

            if (!id)
            {
                message.delete();
                return message.channel.send("Please specify the giveaway's ID and the time you want to add!");
            }
            if (!length)
            {
                if (data[id])
                {
                    message.delete();
                    return message.channel.send("Please specify the time you want to add!");
                }
                else
                {
                    message.delete();
                    return message.channel.send("Please specify the time you want to add and specify correctly the giveaway's ID!");
                }
            }
            if (!ms(length))
            {
                if (data[id])
                {
                    message.delete();
                    return message.channel.send("The time you want to add is incorrect!");
                }
                else
                {
                    message.delete();
                    return message.channel.send("The time you want to add and the giveaway's ID is incorrect!");
                }
            }
            if (ms(length) && !data[id])
            {
                message.delete();
                return message.channel.send("The giveaway's ID is incorrect!");
            }
            if (data[id].remaining + ms(length) > 2147483647)
            {
                message.delete();
                return message.channel.send("The time you want to add is too much!");
            }
            if (data[id].ended)
            {
                message.delete();
                return message.channel.send("The giveaway has been ended!");
            }

            data[id].remaining += ms(length);
            fs.writeFileSync("./data/giveaways.json", JSON.stringify(data, null, 4));
            message.channel.send(`Succesfully added ${ms(ms(length), { long: true })} to the giveaway with ID ${id}!`).then(msg => setTimeout(() => msg.delete(), 5000) );
            message.delete();
        }
    }