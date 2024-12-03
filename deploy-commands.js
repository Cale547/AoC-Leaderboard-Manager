require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'senast',
        description: 'Visar vem som fick en stjärna senast och när',
    },
    {
        name: 'stjärnor',
        description: 'Visar vilka stjärnor alla har'
    },
    {
        name: 'topplista',
        description: 'Visar poäng, antal stjärnor, och tid för senaste stjärna'
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
