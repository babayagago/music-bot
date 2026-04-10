const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joue une musique YouTube')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Lien YouTube')
        .setRequired(true)
    ),

  new SlashCommandBuilder().setName('skip').setDescription('Passer la musique'),
  new SlashCommandBuilder().setName('stop').setDescription('Arrêter la musique')
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("Commandes installées !");
  } catch (err) {
    console.error(err);
  }
})();
