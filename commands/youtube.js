const { SlashCommandBuilder } = require('discord.js');
const { google } = require("googleapis");
const config = require('../config/config.json')
const apiKey = config.youtubeApiToken;

const youtube = google.youtube({
version: "v3",
auth: apiKey,
});
let stringBuilder = '';

const searchYoutubeVideo = async(youtubeSearch) => {
    try {
        const response = await youtube.search.list({
            part: "snippet",
            q: youtubeSearch,
            type:'video'
        });
        const videos = response.data.items.map((video) => video);
        console.log(videos);
        // if (videos != null) stringBuilder = '';
        return videos;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('Procure um video no youtube')
        .addStringOption(option => option.setName('input').setDescription('Insira o texto para procura no youtube').setRequired(true)),
	async execute(interaction) {
        const searchInput = interaction.options.getString('input');
        const searchResult = await searchYoutubeVideo(searchInput);

        if (searchResult != null) {
            for (const [index, video] of searchResult.entries()) {
                let count = index + 1;
                var fullUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
                let fullElement = count + " - **" + video.snippet.title + '** - ' + fullUrl +  "\n";
                stringBuilder = stringBuilder + fullElement;
            }
        }

        console.log(stringBuilder);
        
		await interaction.reply(searchResult.length == 0 ? 'Não consegui achar nada :face_with_raised_eyebrow:, tente novamente!' : stringBuilder);
	},
};