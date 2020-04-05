const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Events");
table.setHeading("Event", "Load status");
module.exports = (client) => {
    const commands = readdirSync(`./events/`).filter(file => file.endsWith(".js"));
    for (let file of commands) {
    let pull = require((`../events/${file}`));
        if (pull.name) {
            client.events.set(pull.name, pull);
            table.addRow(file, '✅');
        } else {
            table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
            continue;
        }
    }
    console.log(table.toString());
}