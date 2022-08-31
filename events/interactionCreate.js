const client = require("../index");

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    if (interaction.isButton()) {
        if (interaction.message.interaction.commandName == 'youtube'){
            const fullUrl = `https://www.youtube.com/watch?v=${interaction.customId}`;
            interaction.reply({ content: fullUrl });

            const messageId = interaction.message.id;
            const channelId = interaction.message.channelId;

            if (client.channels.cache.get(channelId) != undefined && 
                client.channels.cache.get(channelId) != null) {
                let channel = client.channels.cache.get(channelId).messages.fetch(messageId);
                channel.then(async msg => {
                    await msg.delete({ timeout: 5000 });
                }).catch((error) => console.log(error));
            }
            
        }
    }
});