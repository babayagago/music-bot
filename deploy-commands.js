const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joue une musique')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Lien YouTube')
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName('skip').setDescription('Skip'),
  new SlashCommandBuilder().setName('stop').setDescription('Stop')
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );
  console.log('Commandes installées');
})();
