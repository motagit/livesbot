const path = require('node:path');
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const chalk = require('chalk');
const config = require('./config/config.json')

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

client.commands = new Enmap();
client.config = config;

// read Events
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const eventPath = path.join(eventsPath, file);
    const event = require(eventPath);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
});
  
// read Commands
client.commands = new Enmap();
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  const commands = [];

  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const commandPath = path.join(commandsPath, file);
	  const command = require(commandPath);
    console.log(chalk.green(`[-] ${command.data.name}`));
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  });

  // deploy commands
  const rest = new Discord.REST({ version: '10' }).setToken(config.token);
  rest.put(Discord.Routes.applicationCommands(config.clientId), { body: commands.map(command => command) })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
});

// listen deployed commands via interaction
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(config.token)