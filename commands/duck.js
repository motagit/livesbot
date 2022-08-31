const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('duck')
		.setDescription('Foto de pato aleatória'),
	async execute(interaction) {
        let imageUrl;

        axios.get('https://random-d.uk/api/quack')
        .then(async response => {
            imageUrl = response.data.url;
            await interaction.reply({ content: imageUrl });
        })
        .catch(error => {
            console.log(error);
        });
	},
};