require('dotenv').config();
const config = require('./botconfig/config.json');
const ee = require('./botconfig/embed.json');
const {
    Client,
    Collection,
    Intents,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require("discord.js");
const colors = require("colors");
const Enmap = require("enmap");
const libsodium = require("libsodium-wrappers");
const voice = require("@discordjs/voice");
const express = require('express'); // ضروري جداً

const client = new Client({
    fetchAllMembers: false,
    restTimeOffset: 0,
    shards: 'auto',
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
    },
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    presence: {
        activities: [{
            name: `Ticket-System `,
            type: "PLAYING",
        }],
        status: "online"
    }
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.events = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.allEmojis = require("./botconfig/emojis.json");
client.owners = ["784649693363306518"];

client.setMaxListeners(0);
require('events').defaultMaxListeners = 0;

["extraEvents", "antiCrash", "eventHandler", "commandHandler"].forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

require("./handlers/mongoDBHandler")(client);
require("./modules/ticket-creation")(client);

// --- إعداد السيرفر للعمل على Railway ---
const app = express();
const port = process.env.PORT || 3000;

app.all('/', (req, res) => {
  res.send(`<a href="https://dsc.gg/grid"><img src="https://media.discordapp.net/attachments/945572599528841226/952223857438236732/standard_1.gif"></a>`);
});

app.listen(port, () => console.log(`Server is running on port ${port}`.bold.cyan));

// تسجيل الدخول
client.login(process.env.TOKEN || config.env.TOKEN);

// بنر التشغيل
const cfonts = require('cfonts');
const banner = cfonts.render((`Uo!`), {
		font: 'block',
		color: 'candy',
		align: 'left',
		gradient: ["red","magenta"],
		lineHeight: 3
	});

client.on("ready", () => {
    console.log(banner.string); 
    console.log("Join for help -> https://dsc.gg/grid".bold.bgGreen.white); 
});