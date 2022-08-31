const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { google } = require("googleapis");
const config = require('../config/config.json')
const apiKey = config.youtubeApiToken;

const youtube = google.youtube({
version: "v3",
auth: apiKey,
});
let interactionReply = {};
let selectVideoEmbed;
let buttons;

const searchYoutubeVideo = async(youtubeSearch) => {
    try {
        const response = await youtube.search.list({
            part: "snippet",
            q: youtubeSearch,
            type:'video'
        });
        const videos = response.data.items.map((video) => video);
        return videos;
    } catch (err) {
        interactionReply.content = 'Ocorreu um erro ao processar sua pesquisa. Tente novamente mais tarde.';
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
        let searchResult;
        let stringBuilder = '';
        try {
            searchResult = await searchYoutubeVideo(searchInput);
        } catch (error) {
            interactionReply.content = 'Ocorreu um erro ao processar sua pesquisa. Tente novamente mais tarde.';
        }

        if (searchResult != null && Object.keys(searchResult).length !== 0) {
            buttons = new ActionRowBuilder();

            for (const [index, video] of searchResult.entries()) {
                let label = index + 1;
                buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(video.id.videoId)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(label + '\uFE0F\u20E3')
                    
                );
            }

            for (const [index, video] of searchResult.entries()) {
                
                let count = index + 1;
                let fullElement = count + " - **" + video.snippet.title + '**' +  "\n";
                stringBuilder = stringBuilder + fullElement;
            }

            selectVideoEmbed = {
                color: 0xf2f2f2,
                title: 'Selecione um Video',
                fields: [
                    { name: 'Titulos', value: stringBuilder},
                ],
                data: [
                    'teste'
                ],
            };

            if (buttons.components.lenght != 0) interactionReply.components = [buttons];
            interactionReply.embeds = [selectVideoEmbed];
        } else if (searchResult == null || Object.keys(searchResult).length === 0) {
            interactionReply.content = 'Não consegui achar nada :face_with_raised_eyebrow:, tente novamente!';
            delete interactionReply.embeds;
            delete interactionReply.components;
        }

		await interaction.reply(interactionReply);
	},
};