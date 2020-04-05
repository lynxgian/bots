const http = require("http");
const antispam = require('better-discord-antispam-with-good-grammar'); // Requiring this module.



const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const client = new Client({
  disableEveryone: false,
  fetchAllMembers: true,
  disabledEvents: ["TYPING_START"]
});

const Database = require("better-sqlite3");
client.database = new Database("./data/membersdata.db");

if (true) {
  //
  client.database
    .prepare(
      `CREATE TABLE IF NOT EXISTS membersinfo (userid TEXT PRIMARY KEY,username TEXT DEFAULT n,coins INTEGER DEFAULT 0,experience INTEGER DEFAULT 0,level INTEGER DEFAULT 1,dailyendtime INTEGER DEFAULT ${Date.now()},streak INTEGER DEFAULT 0,messagescount INTEGER DEFAULT 0,registerdate INTEGER DEFAULT 0,warns INTEGER DEFAULT 0,muted INTEGER DEFAULT 0,endmute INTEGER DEFAULT 0,tempmute INTEGER DEFAULT 0,banned INTEGER DEFAULT 0,endban INTEGER DEFAULT 0,tempban INTEGER DEFAULT 0)`
    )
    .run();
}
//there is an error with clear //

client.commands = new Collection();
client.events = new Collection();
client.aliases = new Collection();
client.categorychars = new Collection();
client.loadchannels = new Collection();
client.levelsmap = new Collection();
client.developerstr = "LynX Gian#0001";
client.developer;
//whats left to do

client.leaderboard = {
  messages: {
    column: "messagescount",
    names: ["mensajes", "mensaje", "messages", "message"],
    legend: "Messages",
    title: "Messages sent"
  },
  coins: {
    column: "coins",
    names: ["monedas", "moneda", "coin", "coins", "creditos", "credits"],
    legend: "Coins",
    title: "Coins"
  }
};
let guild = client.guilds.first();
config({
  path: __dirname + "/.env"
});

["command", "event"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
client.updater = require(`./functions/updater.js`);

client.versionurlbase =
  "https://api.spigotmc.org/legacy/update.php?resource={ID}";
client.pluginurlbase = "https://www.spigotmc.org/resources/{ID}/";
//CHANGE PREFIX HERE!!
let defaultreason = "{USER}, please keep swearing at minimun.";
//To add words you just add a comma and add the word like this. If i want to block "asshole"
client.bannedWordsReason = {
  pornhub: "{USER}, nsfw content is not allowed here!",
  "discord.gg/":
    "{USER}, don't try to share links to other discord servers please!",
  "discord.me":
    "{USER}, don't try to share links to other discord servers please!",
  "twitter.com/": "{USER}, do not advertise social media here",
  "twitch.tv/": "{USER}, do not advertise another streamer here",
  fuck: defaultreason,
  shit: defaultreason,
  pussy: defaultreason,
  penis: defaultreason,
  ass: defaultreason
};
client.bannedWords = Object.keys(client.bannedWordsReason);
console.log(`🔇 Banned words: ${client.bannedWords.join(", ")}`);

client.prefix = "!";
client.defaultrole = "Member";
client.footer = "Deadpool's Assistant";

client.highstaff = ["High Staff"];
client.staffroles = ["Staff"].concat(client.highstaff);
client.supportroles = ["Applications"].concat(client.highstaff);
client.swearignoreroles = ["#$%&"].concat(client.highstaff);
//Add new plugins here when you create more.

client.emoji = {
  check: ":white_check_mark:",
  cross: ":x:",
  server: ":trophy:"
};

client.welcomemessage = [`Welcome **{USER}** to **DeadpoolBTD's World**!`,
                  `Check {ANUNCIOS} to be up to date! `,
                  `There are currently **({MEMBERS}** members in the server)`,
                      `Read our {REGLAS} before posting!`,
                  `And Remember to have fun`,
                      ` `,
                      `_Deadpool's Assistant \\🖤_`]
client.statistics = {memberscount:{format:"👤 Members: {COUNT}",
                                channelid:"689566828619759703"}
				}
client.canales = {
  verification: "verification", //x
  bienvenidas: "welcome-leaves",
  despedidas: "welcome-leaves",
  reglas: "rules",
  anuncios: "announcements",
  comandosbot: "bot-commands",
  privadosalbot: "bot-privates",
  tickets: "tickets",
  ticketslog: "tickets-log",
  ticketscategory: "❓| Tickets",
  logs: "logs", //x
  incidentlogs: "logs",
  levelup: "level-up"
};
client.colors = {
  red: "#e6381e",
  green: "#28ba18",
  online: "#47E510",
  main: "#4269f5",
  mainerror: "#ba1809",
  eightball: "#00000",
  welcome: "#4269f5",
  bye: "#1e386b",
  fun: { eightball: "#00000" },
  tickets: { open: "#47E510", close: "#6FD106", solve: "E5B410" },
  moderation: {
    kick: "#3160f9",
    ban: "#ba1809",
    mute: "#ffbf00",
    warn: "#ff7b00",
    clear: "#e569bc",
    unban: "#e05757",
    unmute: "#fcdb79",
    swearing: "#b642f4",
    vetado: "#f44242",
    perdonado: "#41f443"
  },
  gamble: {
    error: "#ba1809",
    cooldown: "#E5B410",
    lose: "#ba1809",
    win: "#47E510"
  },
  dm: { sent: "#E5B410", log: "#00ffe9" },
  ping: { good: "#47E510", medium: "#E5B410", bad: "#ba1809" },
  shop: { error: "#ba1809", shop: "#E5B410", sent: "#47E510" },
  banner: { new: "#E5B410" },
  trivia: { start: "#2562C6" }
};

//JUST EDIT UNTIL HERE!!!

console.log("Loading levels..");
for (let i = 1; i < 500; i++) {
  let reqexp = 25 * (i * i) + 175 * i - 200;
  //console.log(`Level ${i} requires ${reqexp} Exp`)
  client.levelsmap.set(i, reqexp);
}

function startActivities(client) {
  client.user.setStatus("online");
  let time = 0;
  return;
  setInterval(() => {
    if (time === 0) {
      client.user.setActivity(`${client.prefix}help`, { type: "PLAYING" });
      time++;
    } else if (time === 1) {
      client.user.setActivity(
        `${
          client.guilds.first().members.filter(m => !m.user.bot).size
        } members`,
        { type: "WATCHING" }
      );
      time++;
    } else if (time === 2) {
      client.user.setActivity(`Spigot: Spedsquad20`, { type: "PLAYING" });
      time = 0;
    }
  }, 10000);
}

client.loadchannels.set(client.canales.tickets, 50);
client.loadchannels.set(client.canales.verification, 50);

client.on("error", err => {
  console.log(`Error event fired:`);
  console.log(err);
});
const { ErelaClient } = require("erela.js");

const nodes = [{
  host: "69.123.153.47",
 port: 25566,
 password: "youshallnotpasses",
}]
client.on("ready", () => {
 client.music = new ErelaClient(client, nodes);
  client.music.on("nodeConnect", node => console.log("New node connected"));
  client.music.on("nodeError", (node, error) => console.log(`Node error: ${error.message}`));
  client.music.on("trackStart", (player, track) => player.textChannel.send(`Now playing: ${track.title}`))
  client.music.on("queueEnd", player => {
    player.textChannel.send("Queue has ended.")
    client.music.players.destroy(player.guild.id);
 });
client.music.on("socketClosed", player => {
   client.music.players.destroy(player.guild.id);
  })
  let event = client.events.get("ready");
  if (event) event.run(client);
     antispam(client, {
        limitUntilWarn: 3, // The amount of messages allowed to send within the interval(time) before getting a warn.
        limitUntilMuted: 7, // The amount of messages allowed to send within the interval(time) before getting a muted.
        interval: 2000, // The interval(time) where the messages are sent. Practically if member X sent 5+ messages within 2 seconds, he get muted. (1000 milliseconds = 1 second, 2000 milliseconds = 2 seconds etc etc)
        warningMessage: "if you don't stop from spamming, I'm going to punish you!", // Message you get when you are warned!
        muteMessage: "was muted since you didn't listen to me!", // Message sent after member X was punished(muted).
        maxDuplicatesWarning: 7,// When people are spamming the same message, this will trigger when member X sent over 7+ messages.
        maxDuplicatesMute: 10, // The limit where member X get muted after sending too many messages(10+).
        ignoredRoles: ["High Staff"], // The members with this role(or roles) will be ignored if they have it. Suggest to not add this to any random guys. Also it's case sensitive.
        ignoredMembers: ["DeadpoolBTD#0001"], // These members are directly affected and they do not require to have the role above. Good for undercover pranks.
        mutedRole: "Muted", // Here you put the name of the role that should not let people write/speak or anything else in your server. If there is no role set, by default, the module will attempt to create the role for you & set it correctly for every channel in your server. It will be named "muted".
        timeMuted: 1000 * 600, // This is how much time member X will be muted. if not set, default would be 10 min.
        logChannel: "logs" // This is the channel where every report about spamming goes to. If it's not set up, it will attempt to create the channel.
      });
});
client.on("message", async message => {
    client.emit('checkMessage', message); // This runs the filter on any message bot receives in any guilds.
  let event = client.events.get("message");
  if (event) event.run(client, message);

});
client.on("messageReactionAdd", (messageReaction, user) => {
  let event = client.events.get("messageReactionAdd");
  if (event) event.run(client, messageReaction, user);
});
client.on("guildMemberAdd", member => {
  let event = client.events.get("guildMemberAdd");
  if (event) event.run(client, member);
});

client.on("guildMemberRemove", member => {
  let event = client.events.get("guildMemberRemove");
  if (event) event.run(client, member);
});
client.on("presenceUpdate", (oldMember, newMember) => {
  let event = client.events.get("presenceUpdate");
  if (event) event.run(client, oldMember, newMember);
});
client.on("newTicket", member => {
  let event = client.events.get("newTicket");
  if (event) event.run(client, member);
});
client.on("verificationComplete", member => {
  let event = client.events.get("verificationComplete");
  if (event) event.run(client, member);
});

client.categorychars.set("info", "📚");
client.categorychars.set("moderation", "🕵️");
client.categorychars.set("fun", "🎲");
client.categorychars.set("other", "💊");
client.categorychars.set("giveaway", "🎉");
client.categorychars.set("music","🎵");

let start = true;
console.log(`⏳ Iniciando Lynx's Assistant Bot. Conectando..`);
if (!start) {
  console.log(`❌ No iniciando..`);
} else {
  client
    .login(process.env.TOKEN)
    .then(l => {
      console.log(
        `✅ Xiri's Assistant Bot online! Watching  ${
          client.guilds.first().members.size
        } total members and ${client.users.size} user.`
      );
    })
    .catch(e => {
      console.log(
        `❌ Xiri's Assistant Bot coudn't connect! Error: ${e.message}`
      );
    });
}