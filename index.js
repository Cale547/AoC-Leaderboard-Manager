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
        const query = "SELECT (username,last_star_date,last_star_time) FROM player "+
            "ORDER BY last_star_date DESC,last_star_time DESC LIMIT 1;";
        console.log(query);
        const dbResponse = await queryDatabase(query);
        console.log(dbResponse);
        
        const response = dbResponse.map(idk => `${idk[0].padEnd(12)} | ${idk[1]} | ${idk[2]}`);
        await interaction.reply('```Användare    | Datum      | Tid \n'+response+'```');

    } else if (commandName === 'stjärnor') {
        const dbResponse = await queryDatabase("SELECT (username, stars) FROM player ORDER BY stars DESC, username ASC;");
        const response = dbResponse.map(row =>  `${row[0].padEnd(12)} | ${row[1]}`).join('\n');
        await interaction.reply('```Användare    | Stjärnor\n'+response+'```');
    } else if (commandName === 'input') {
        await interaction.reply('+30 extraliv');
    } else if (commandName === 'topplista') {

        


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
