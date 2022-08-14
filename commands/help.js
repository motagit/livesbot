const { SlashCommandBuilder, EmbedBuilder, bold, underscore, strikethrough } = require('discord.js');

const commandList = {
	ping: bold("/ping:") + " " + "pong" + "\n",
	help: bold("/help:") + " " + "lista de comandos do bot" + "\n",
	youtube: bold("/youtube:") + " " + "pesquise algum vídeo no youtube" + "\n",
};

let commands = '';
for (const [index, value] of Object.entries(commandList)) {
	commands += value;
}

const help = {
	color: 0xf2f2f2,
	title: 'LivesBot',
	url: 'https://github.com/motagit/livesbot',
	description: '**É de fato um bot**',
    fields: [
		{ name: underscore("COMANDOS:"), value: commands},
    ],
    data: [
        'teste'
    ],
	thumbnail: {
		url: 'https://i.imgur.com/5K3HFb1.jpg',
	},
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with bot information and commands'),
	async execute(interaction) {
		await interaction.reply({ embeds: [help]} );
	},
};