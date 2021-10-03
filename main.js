require("dotenv").config();
const Discord = require('discord.js');
// ngl i'm not sure why i had to include the intents, gotta figure that out later
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

client.login(process.env.TOKEN);

const cmdSymbol = "~";
var catches = [];

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", msg => {
    let server = msg.guild;
    let channel = msg.channel;

    // if you send ping, then you get pong
    if (msg.content === cmdSymbol + "ping"){
        msg.reply("pong");
        console.log(`Replied to message: "${msg.content}"`);
    }
    
    // fetching last 5 messages
    if (msg.content === cmdSymbol + "catch"){
        channel.messages.fetch({ limit: 8 }).then((messages) => {
            messages.forEach(message => {
                //console.log(message.embeds[0]);
                if (message.author.id === '432610292342587392'){
                    let uglyCatch = message.embeds[0].description.split("\n");
                    //console.log(uglyCatch);
                    uglyCatch.forEach(caught => {
                        if(!(caught.includes('AVG') || caught.includes('Top 15') || caught.length < 5 || !caught)){
                            catches.push(caught.substring(caught.indexOf('-') + 2,caught.length));
                        }
                    });
                    //console.log(catches);
                }
            });
        });
    }

    if (msg.content === cmdSymbol + "release"){
        //console.log(catches.join("\n$"));
        //catches.forEach((caught) => console.log(caught));
        channel.send(catches.join("\n$"))
        catches = [];
    }
});

