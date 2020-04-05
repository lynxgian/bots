const {RichEmbed} = require("discord.js");
module.exports = {
    name: "ping",
    description: "Returns latency and API ping",
    category: "info",
    run: async (client, message, args) => {
        let removemessage = false;
        if(message.channel.name !== client.canales.comandosbot){
            if(!message.member.roles.some(r=>client.highstaff.includes(r.name)))return;
            message.delete(500).catch(e=>{});
            removemessage = true;
        }
        const msg = await message.channel.send(`🏓 Pinging....`);
        const embed = new RichEmbed()
            .setColor("GREEN")
            .setTitle("🏓 Pong!")
            .setDescription(`:hourglass: ${message.createdTimestamp - Date.now()} \n\n :stopwatch: ${Math.round(msg.createdTimestamp- message.createdTimestamp)} \n\n :heartbeat: ${Math.round(client.ping)}` )
        msg.edit(embed)

    },
}