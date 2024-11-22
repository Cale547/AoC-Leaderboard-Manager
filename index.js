require('dotenv').config();
const { Client, GatewayIntentBits, User } = require('discord.js');
const { queryDatabase } = require('./database');
const client = new Client({ intents: [GatewayIntentBits.Guilds] }); // Listen for guild interactions

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
   /* const { user } = interaction;
    console.log(user.globalName, "sa det"); */

    if (commandName === 'recent') {
        await interaction.reply('Pong!');


    } else if (commandName === 'stars') {
        let rowArray = await queryDatabase("SELECT (username, stars) FROM player ORDER BY stars DESC, username ASC;");
        //let nameLengths = rowArray.map(rowArray[0])
        let nameLengths = rowArray.map(row => row[0].length);
        let maxlength = Math.max(nameLengths);
        console.log(nameLengths);
        console.log(maxlength);

        console.log(Object.entries(rowArray));
        await interaction.reply('```Användare | Stjärnor\n'+rowArray+'```');
    } else if (commandName === 'input') {
        await interaction.reply('+30 extraliv');
    }
        /* console.log(data[0]);
        let response = "";
        data.forEach(element => {
            response += data[];
        });
        //console.log(Object.entries(data));
        //const response = data.map(val => `Player ${val[0]}: ${val[1]} points`).join('\n');
        await interaction.reply(response); */




});

client.login(process.env.BOT_TOKEN);
