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

    if (commandName === 'senast') {
        const query = "SELECT (username,last_star_date,last_star_time) FROM player "+
            "ORDER BY last_star_date DESC,last_star_time DESC LIMIT 1;";
        console.log(query);
        const dbResponse = await queryDatabase(query);
        console.log(dbResponse);
        
        const response = dbResponse.map(idk => `${idk[0].padEnd(12)} | ${idk[1]} | ${idk[2]}`);
        await interaction.reply('```Användare    | Datum      | Tid \n'+response+'```');

    } else if (commandName === 'stjärnor') {
        //const dbResponse = await queryDatabase("SELECT (username, stars) FROM player ORDER BY stars DESC, username ASC;");
        const dbResponse = await queryDatabase("SELECT (player.username, calendar_day, part) FROM player JOIN days_completed ON player.user_id=days_completed.user_id ORDER BY player.local_score DESC, days_completed.user_id, calendar_day, part;");

        const playerProgress = {};

        dbResponse.forEach(row => {
            const username = row[0];
            const calendar_day = row[1];
            const part = row[2];

            if (!playerProgress[username]) {
                playerProgress[username] = Array(25).fill(' '); // 25 days, default to " " (no progress)
            }

            if (part == 1) {
                playerProgress[username][calendar_day - 1] = '-'; // Part 1 completed
            } else if (part == 2) {
                // If Part 2 is completed, override to "+"
                playerProgress[username][calendar_day - 1] = '+';
            } else {
                console.log("Couldn't add day ",calendar_day, " and part ", part);
            }
        });

        const response = Object.entries(playerProgress)
        .map(([player, progress]) => `${player.padEnd(12)} | ${progress.join('')}`)
        .join('\n');
        //console.log(playerProgress);

        
        const header = '```Användare    | Dagar    1111111111222222\n'
        + '             | 1234567890123456789012345\n'


        //await interaction.reply(header+response+'```');
        await interaction.reply(header+response+'```');


    }  else if (commandName === 'topplista') {
        const query = "SELECT (username, local_score, stars, last_star_date, last_star_time) FROM player WHERE stars != 0 "+
            "ORDER BY local_score DESC, username ASC;";
            console.log(query);
        const dbResponse = await queryDatabase(query);
        const response = dbResponse.map(row =>  `${row[0].padEnd(12)} | ${row[1].padEnd(12)} | ${row[2].padEnd(12)} | ${row[3].padEnd(12)} | ${row[4].padEnd(12)} `).join('\n');
        const header = '```Namn         | Poäng        | Stjärnor     | Datum        | Tid \n';
        await interaction.reply(header+response+'```');
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
