// Initialize dotenv
require('dotenv').config();
const { translate } = require('@vitalets/google-translate-api');
// const HttpProxyAgent = require('http-proxy-agent');
const {franc} = require('franc-cjs');
const {detectAll} = require('tinyld')
const {ban} = require('./words.js')
// console.log('ban', ban)

// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, GatewayIntentBits, Interaction, SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Events } = require('discord.js');
// console.log(Intents)
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMessageReactions] });

const r4 = '1093128717544468561'
const gen = '1093099947831865460'
const LI = '1093478633324150784'
const generalChannelId = '1141000015897182240'

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
 const generalChannel = client.channels.cache.get(generalChannelId);
    
 if (generalChannel) {
     // Send a message to the general channel
     generalChannel.send("Hi all, I'm here to translate all your messages into English. May not work all the time but please give me a chance 😏😏 ");
 } else {
     console.log('General channel not found.');
 }
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
            const detectedLanguage = detectAll(msg.content);
            console.log(detectedLanguage[0].lang)
			// const agent = new HttpProxyAgent('http://103.152.112.162:80');
            if (detectedLanguage[0].lang !== 'en') {
                const translation = await translate(msg.content, { to: 'en' }); // Translate to English
                msg.channel.send(`Original: ${msg.content}\nTranslation: ${translation.text}`);
            }
        } catch (error) {
            console.error('Translation error:', error);
        }
    }
}

    //  if (ban.includes(msg.content.toLowerCase())) {
    //     msg.reply(`no sex talk please ${msg.author.username}`)
    //  }
    });


client.on(Events.MessageReactionAdd, async (reaction, user) => {
    // Check if the reaction is from the bot or the original message author
    if (user.bot || user.id === reaction.message.author.id) return;
    // Check if the reaction is on a message you want to trigger translation for
    // if (reaction.message.content.toLowerCase().includes('translate me')) {
        const targetLanguage = getTargetLanguageFromReaction(reaction.emoji.name); // Implement this function
        const originalText = reaction.message.content

        if (targetLanguage) {
            try {
                const translation = await translate(originalText, { to: targetLanguage });
                reaction.message.channel.send(`Translation to ${targetLanguage}: ${translation.text}`);
            } catch (error) {
                console.error('Translation error:', error);
                reaction.message.channel.send('An error occurred while translating the text.');
            }
        }
    // }
});



// Helper function to map emoji to languages
function getTargetLanguageFromReaction(emoji) {
    const emojiToLanguage = {
        '🇦🇫': 'ps', // Afghanistan
        '🇿🇦': 'en', // South Africa
        '🇦🇷': 'es', // Argentina
        '🇦🇺': 'en', // Australia
        '🇦🇪': 'ar', // United Arab Emirates
        '🇧🇩': 'bn', // Bangladesh
        '🇧🇷': 'pt', // Brazil
        '🇨🇦': 'en', // Canada
        '🇨🇳': 'zh-CN', // China
        '🇨🇴': 'es', // Colombia
        '🇩🇪': 'de', // Germany
        '🇪🇬': 'ar', // Egypt
        '🇪🇹': 'am', // Ethiopia
        '🇫🇷': 'fr', // France
        '🇬🇧': 'en', // United Kingdom
        '🇬🇭': 'en', // Ghana
        '🇮🇳': 'hi', // India
        '🇮🇶': 'ar', // Iraq
        '🇮🇹': 'it', // Italy
        '🇯🇵': 'ja', // Japan
        '🇰🇪': 'sw', // Kenya
        '🇰🇷': 'ko', // South Korea
        '🇲🇦': 'ar', // Morocco
        '🇲🇽': 'es', // Mexico
        '🇲🇾': 'ms', // Malaysia
        '🇲🇲': 'my', // Myanmar
        '🇳🇬': 'en', // Nigeria
        '🇳🇵': 'ne', // Nepal
        '🇵🇪': 'es', // Peru
        '🇵🇭': 'tl', // Philippines
        '🇵🇰': 'ur', // Pakistan
        '🇷🇺': 'ru', // Russia
        '🇸🇦': 'ar', // Saudi Arabia
        '🇸🇩': 'ar', // Sudan
        '🇹🇭': 'th', // Thailand
        '🇹🇷': 'tr', // Turkey
        '🇺🇦': 'uk', // Ukraine
        '🇺🇬': 'en', // Uganda
        '🇺🇸': 'en', // United States
        '🇺🇿': 'uz', // Uzbekistan
        '🇻🇪': 'es', // Venezuela
        '🇻🇳': 'vi', // Vietnam
        '🇾🇪': 'ar', // Yemen
        // Add more mappings as needed
    };
    return emojiToLanguage[emoji] || null;
}

    
    
    
    
    
    

// client.on('interactionCreate', async interaction => {
//     console.log('int', interaction)
//     if(!interaction.isChatInputCommand()) return;

//     if(interaction.commandName === 'Hello') {
//         await interaction.reply(`Hi`)
//     }
// })


