// Initialize dotenv
require('dotenv').config();
const { translate } = require('@vitalets/google-translate-api');
// const HttpProxyAgent = require('http-proxy-agent');
const {ban} = require('./words.js')
// console.log('ban', ban)

// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, GatewayIntentBits, Interaction, SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
// console.log(Intents)
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildModeration] });

const r4 = '1093128717544468561'
const gen = '1093099947831865460'
const LI = '1093478633324150784'

// module.exports = {
// 	cooldown: 5,
// 	data: new SlashCommandBuilder()
// 		.setName('hello')
// 		.setDescription('Select a member and kick them (but not really).')
// 		.addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true)),
// 	async execute(interaction) {
// 		const member = interaction.options.getMember('target');
// 		return interaction.reply({ content: `You wanted to kick: ${member.user.username}`, ephemeral: true });
// 	},
// };

// const slasher = new SlashCommandBuilder().setName('heya')

client.on('ready', (msg) => {
 console.log(`Logged in as ${client.user.tag}!`);
//  return msg.emit( '@Arashi, I am here now');
});

// Log In our bot
client.login(process.env.CLIENT_TOKEN);

client.on('messageCreate', async msg => {
    const member = msg.guild.members.cache.find(x => x.user.username == msg.author.username);
    const xembed= (word) => {return new EmbedBuilder().setColor('Red').setTitle('Bad language alert').setDescription(`:thumbsdown::skin-tone-4: ${msg.author.username}, please refrain from using words like ${word} in this channel`)}
    const embed = new EmbedBuilder().setColor('Blue').setDescription(`:white_check_mark: ${msg.author.username} has been **timed out** for 2 minutes`);
    const dmEmbed = new EmbedBuilder().setColor('Red').setDescription(`:white_check_mark: You have been **timed out** in ${msg.channel.name} for 2 minutes for sexy talk :grin::grin:`)
    let msgString = msg.content.toLowerCase().split(' ')
    // console.log(msg)
     if ((msgString[0].toLowerCase() === 'hello' || msgString[0].toLowerCase() === 'hi') && msg.author.username !== 'Elisa') {
       return msg.reply(`Hello ${msg.author.username}`);
     }

     msgString.forEach(word => {
        if(ban.includes(word) && msg.author.username !== 'Elisa' && msg.channelId === r4){
            
            // const member = msg.guild.members.cache.find(x => x.user.username == 'Elisa');
            console.log('member', word)
            
            member.timeout(120_000)
            msg.reply(`Please refrain from using words like ${word} here ${msg.author.username}`)
            msg.channel.send({embeds: [embed]})
            member.send({embeds: [dmEmbed]})
        }

        if(ban.includes(word) && msg.author.username !== 'Elisa' && msg.channelId === LI){
            member.timeout(120_000)
            msg.reply(`@${msg.author.username} this channel is reserved for LI discussions. Please take all other convos elsewhere. Thank you!! :grin::grin: `)
            msg.channel.send({embeds: [embed]})
            member.send({embeds: [dmEmbed]})
        }

        else {
            if(msg.author.username !== 'Elisa' && ban.includes(word)){
                msg.channel.send({embeds: [xembed(word)]})
            }
        }
     })

	

	const prefix = '!';
    const args = msg.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
 
    if (!msg.author.bot || msg.content.startsWith(prefix)){
    if (command === 'translate') {
        const targetLanguage = args.shift();
        const text = args.join(' ');

        try {
            const translation = await translate(text, { to: targetLanguage });
            msg.channel.send(`Translation: ${translation.text}`);
        } catch (error) {
            console.error('Translation error:', error);
            msg.channel.send('An error occurred while translating the text.');
        }
    } else {
        // Automatically translate non-command msgs
        try {
            // const detectedLanguage = franc(msg.content);
			// const agent = new HttpProxyAgent('http://103.152.112.162:80');
            // if (detectedLanguage !== 'eng') {
                const translation = await translate(msg.content, { to: 'en' }); // Translate to English
                msg.channel.send(`Original: ${msg.content}\nTranslation: ${translation.text}`);
            // }
        } catch (error) {
            console.error('Translation error:', error);
        }
    }
}

    //  if (ban.includes(msg.content.toLowerCase())) {
    //     msg.reply(`no sex talk please ${msg.author.username}`)
    //  }
    });

// client.on('interactionCreate', async interaction => {
//     console.log('int', interaction)
//     if(!interaction.isChatInputCommand()) return;

//     if(interaction.commandName === 'Hello') {
//         await interaction.reply(`Hi`)
//     }
// })


