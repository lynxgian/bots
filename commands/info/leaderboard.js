const Discord = require("discord.js");
var langobject = {announce: "ICON **| GUILDNAME's CATEGORYleaderboard. Page (ACTUAL/MAX)**",
                              legend: "Position > Name",
                               entry: "\n[POSITION]     > TAG\n      LEGENDLevel: LEVEL Experience: EXPERIENCE Coins: COINS",
                              entry1: "\n[POSITION]    > TAG\n      LEGENDLevel: LEVEL Experience: EXPERIENCE Coins: COINS",
                              entry2: "\n[POSITION]   > TAG\n      LEGENDLevel: LEVEL Experience: EXPERIENCE Coins: COINS",
                              entry3: "\n[POSITION]  > TAG\n      LEGENDLevel: LEVEL Experience: EXPERIENCE Coins: COINS",
                              entry4: "\n[POSITION] > TAG\n      LEGENDLevel: LEVEL Experience: EXPERIENCE Coins: COINS",
                              actualposition: "Your position in the server MEMBER:"}
module.exports = {
  name: "leaderboard", //Command name, same as file name.
  description: "Show server leaderboard.", //Description
  aliases: ["top","lb","lbtop"],
  category: "info", //Not useful but maybe in a future, so complete it anyways.
  run: async (bot, message, args) => {
    let removemessage = false;
    if(message.channel.name !== bot.canales.comandosbot){
      if(!message.member.roles.some(r=>bot.highstaff.includes(r.name)))return;
      message.delete(500).catch(e=>{});
      removemessage = true;
    }
    let page = 1
    let memberinforankinglist;
    let column;
    let title = " "
    let legend = ""
    let formula = `ORDER BY experience DESC,coins DESC,messagescount DESC,userid DESC`
    if(args[0]){
      if(isNaN(args[0])){
        let category = Object.keys(bot.leaderboard).find(c=>bot.leaderboard[c].names.includes(args[0].toLowerCase()))
        if(category){
          column = bot.leaderboard[category].column
          title = ` ${bot.leaderboard[category].title} `
          legend = `${bot.leaderboard[category].legend}: CV`
          formula = `ORDER BY ${column} DESC,experience DESC,coins DESC,messagescount DESC,userid DESC`
        }else{
          return message.channel.send(`${bot.crossemoji} **| ${message.author}, that's not a valid number or category.**`).then(m=>{
            if(removemessage){
              m.delete(10000).catch(e=>{})
            }
          });
        }
        if(args[1]){
          if(isNaN(args[1])){
            return message.channel.send(`${bot.crossemoji} **| ${message.author}, that's not a valid number or category.**`).then(m=>{
              if(removemessage){
                m.delete(10000).catch(e=>{})
              }
            });
          }else{
            page = Math.round(parseInt(args[1]))
          }
        }
      }else{
        page = Math.round(parseInt(args[0]))
      }
      if(page<=0){
        return message.channel.send(`${bot.crossemoji} **| ${message.author}, sorry but there isn't a page number ${page} in leaderboard.**`).then(m=>{
          if(removemessage){
            m.delete(10000).catch(e=>{})
          }
        });
      }
      memberinforankinglist = bot.database.prepare(`SELECT *,RANK() OVER (${formula}) AS ranking FROM membersinfo`).all()
      if(page>Math.ceil(memberinforankinglist.length/10)){
        return message.channel.send(`${bot.crossemoji} **| ${message.author}, sorry but there isn't a page number ${page} in leaderboard.**`).then(m=>{
          if(removemessage){
            m.delete(10000).catch(e=>{})
          }
        });
      }
    }else{
      memberinforankinglist = bot.database.prepare(`SELECT *,RANK() OVER (${formula}) AS ranking FROM membersinfo`).all()
    }
    console.log(`${message.author.tag} is checking page ${page} of ${title===" "?`Top member`:`Top ${title}`}`)
    //let topteninfo = bot.database.prepare(`SELECT * FROM membersinfo ORDER BY experience DESC,coins DESC,userid ASC LIMIT 10`).all()//REAL
    let topteninfolist = bot.database.prepare(`SELECT * FROM membersinfo b ${formula}`).all()
    let maxpages = Math.ceil(memberinforankinglist.length/10)
    let minpage = ((page-1)*10)+1
    let maxpage = page*10
    let topteninfo = memberinforankinglist.filter(o=>o.ranking>=minpage && o.ranking<=maxpage)
    let memberinforanking = memberinforankinglist.find(o=>o.userid===message.author.id)
    //REAL
    //let memberinforanking = bot.database.prepare(`SELECT *, (SELECT COUNT(*) FROM membersinfo b ORDER BY experience DESC,coins DESC,messagescount DESC) AS ranking FROM membersinfo a WHERE userid=? ORDER BY experience,coins DESC,messagescount DESC`).get(message.author.id)
    let description = `${langobject.announce.replace(/ICON/,bot.emoji.server).replace(/CATEGORY/,title).replace(/GUILDNAME/,message.guild.name).replace(/ACTUAL/,page).replace(/MAX/,maxpages)}\n\`\`\`cs\n${langobject.legend}\n`
    let rank = minpage;
    //let custom = column?`${legend}: CUSTOMCATEGORYVALUE`:""
    topteninfo.forEach(row => {
      let selectedentry = langobject[`entry${getDigits(rank)}`] //rank>9?langobject[`entry${getDigits(rank)}`]:langobject.entry
      let rankmember = message.guild.members.get(row.userid)
      let membershow = rankmember?rankmember.user.tag.replace(/'/g,"").replace(/"/g,''):`${row.username} (${row.userid})`
      let customlegend = legend.replace(/CV/,row[column])
      description+= selectedentry.replace(/LEGEND/,`${customlegend} `).replace(/POSITION/,rank).replace(/EXPERIENCE/,row.experience).replace(/LEVEL/,row.level).replace(/COINS/,row.coins).replace(/TAG/,membershow)
      rank++;
    })
    let selectedentry = langobject[`entry${getDigits(memberinforanking.ranking)}`]//memberinforanking.ranking>9?langobject.entry2:langobject.entry
    description+= `\n-----------------------------------------------------\n${langobject.actualposition.replace(/MEMBER/,message.author.username.replace(/'/g,"\'").replace(/"/g,"\""))}`
    let customlegend = legend.replace(/CV/,memberinforanking[column])
    description+= selectedentry.replace(/LEGEND/,`${customlegend} `).replace(/POSITION/,memberinforanking.ranking).replace(/EXPERIENCE/,memberinforanking.experience).replace(/LEVEL/,memberinforanking.level).replace(/COINS/,memberinforanking.coins).replace(/TAG/,message.author.tag)
    description += "```"
    //console.log(`Tu puesto: ${memberinforanking.ranking} | Número de digitos: ${getDigits(memberinforanking.ranking)}`)
    message.channel.send(description).then(m=>{
      if(removemessage){
        m.delete(30000).catch(e=>{})
      }
    });
  }
}
function getDigits(number){
  return (Math.log10((number ^ (number >> 31)) - (number >> 31)) | 0) + 1
}