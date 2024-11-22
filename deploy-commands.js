require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'input',
        description: 'hmm...',
    },
    {
        name: 'recent',
        description: 'Visar vem som fick en stjärna senast och när',
    },
    {
        name: 'stars',
        description: 'Visar hur många stjärnor alla har'
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
