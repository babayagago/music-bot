const ytSearch = require('yt-search');
const { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } = require('discord.js');
const {
 const connection = joinVoiceChannel({
  channelId: voiceChannel.id,
  guildId: interaction.guildId,
  adapterCreator: interaction.guild.voiceAdapterCreator,
  selfDeaf: false
}); ,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');
const play = require('play-dl');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const queues = new Map();

// Slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joue une musique YouTube')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Lien YouTube')
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName('skip').setDescription('Skip musique'),
  new SlashCommandBuilder().setName('stop').setDescription('Stop musique')
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function deployCommands() {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("Commandes installées !");
  } catch (err) {
    console.log(err);
  }
}

client.once(Events.ClientReady, async () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  await deployCommands();
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const guildId = interaction.guildId;

  if (!queues.has(guildId)) queues.set(guildId, []);
  const queue = queues.get(guildId);
if (interaction.commandName === 'play') {
  const query = interaction.options.getString('url');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: "Rejoins un vocal", ephemeral: true });
  }

  let url = query;

  // Si ce n'est pas un lien YouTube → recherche
  if (!query.includes("http")) {
    const result = await ytSearch(query);

    if (!result.videos.length) {
      return interaction.reply("Aucune musique trouvée ❌");
    }

    url = result.videos[0].url;
  }

  queue.push(url);
  await interaction.reply("Ajouté 🎵");

  if (queue.length === 1) {
    playMusic(interaction, voiceChannel);
  }
}
  }

  if (interaction.commandName === 'skip') {
    queue.shift();
    playMusic(interaction, interaction.member.voice.channel);
    interaction.reply("Skip");
  }

  if (interaction.commandName === 'stop') {
    queues.set(guildId, []);
    interaction.reply("Stop");
  }
});

async function playMusic(interaction, voiceChannel) {
  const queue = queues.get(interaction.guildId);
  if (!queue || queue.length === 0) return;

  const url = queue[0];

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator
  });

  
  const stream = await play.stream(url, {
  discordPlayerCompatibility: true
});
  const resource = createAudioResource(stream.stream, {
  inputType: stream.type
});

player.play(resource);
connection.subscribe(player);
  });

  const player = createAudioPlayer();
  player.play(resource);
  connection.subscribe(player);

  interaction.channel.send(`▶️ Lecture: ${url}`);

  player.on(AudioPlayerStatus.Idle, () => {
    queue.shift();
    playMusic(interaction, voiceChannel);
  });
}

client.login(process.env.TOKEN);
