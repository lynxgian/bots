const Discord = require('discord.js'),
    arraySort= require('array-sort'),
    table = require('table');
module.exports = {
    name: "invtop", //Command name, same as file name.
    description: "Check your profile info.", //Description
    aliases: ["inviteleaderboard"],
    category: "info", //Not useful but maybe in a future, so complete it anyways.
    run: async (client, message, args) => {
        message.delete();
        let invites = await message.guild.fetchInvites().catch(error => {
            return message.channel.send("Sorry I don't have enough perms to view invites!");
        });
        invites = invites.array();

        arraySort(invites, 'uses', {reverse: true});
        let possibleInvites = [['User', 'Uses']];
        invites.forEach(function (invite) {

            possibleInvites.push([invite.inviter.username, invite.uses])
        });

        const embed = new Discord.RichEmbed();
        embed.setColor(0x7289da);
        embed.setTitle('Server Invites');
        embed.addField('Leaderboard', `\`\`\`${table.table(possibleInvites)}\`\`\``);
            message.channel.send(embed);
        }
}
