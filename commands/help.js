const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'La liste de toutes commandes ou les info spécifiques d\'une seule',
	aliases: ['commands'],
	usage: '[Nom de la commande]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Voici la liste de toutes mes commandes:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nVous pouvez faire \`${prefix}help [command name]\` pour avoir les informations spécifiques de la commande!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('Je t\'ai envoyé la liste de mes commandes en message privé!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('Je ne peux pas vous envoyer de messages privés !');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('Ce n\'est pas une commande valide !');
		}

		data.push(`**Nom:** ${command.name}`);

		if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Utilisation:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**temps de recharge:** ${command.cooldown || 3} seconde(s)`);

		message.channel.send(data, { split: true });
	},
};
