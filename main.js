require("dotenv").config();
const Discord = require('discord.js');
// ngl i'm not sure why i had to include the intents, gotta figure that out later
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

client.login(process.env.TOKEN);
//client.login("ODgxNTk3ODA1MTYzMDYxMjU4.YSvJ8A.cEAwyBD9h2s-4PozVgbU2U9bzPA");

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
        // let obj = {
        //     rank: 1,
        //     name: "Jeremy",
        //     series: "Real life",
        //     kakera: 1000
        // }
        // msg.reply(JSON.stringify(obj));
        msg.reply("pong");
        console.log(`Replied to message: "${msg.content}"`);
    }
    
    // fetching last 5 messages
    if (msg.content === cmdSymbol + "catch"){
        channel.messages.fetch({ limit: 7 }).then((messages) => {
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
                    console.log("Caught a message");
                }
                else{
                    console.log("found a message not from mudae");
                }
            });
        });
    }

    if (msg.content === cmdSymbol + "catch topk"){
        channel.messages.fetch({ limit: 7 }).then((messages) => {
            messages.forEach(message => {
                //console.log(message.embeds[0]);
                if (message.author.id === '432610292342587392'){
                    let uglyCatch = message.embeds[0].description.split("\n");
                    console.log(uglyCatch);
                    uglyCatch.forEach(caught => {
                        if(!(caught.includes('AVG') || caught.includes('Top 15') || caught.length < 5 || !caught)){
                            caught = caught.split('*');
                            let character = {
                                rank: parseInt(caught[2].substring(1, caught[2].length)),
                                name: caught[6],
                                series: caught[8].substring(3, caught[8].length - 3),
                                kakera: parseInt(caught[10])
                            }; 
                            //console.log(character);
                            catches.push(JSON.stringify(character));
                        }
                    });
                    console.log("Caught a message");
                }
                else{
                    console.log("Found a message not from mudae");
                }
            });
        });
    }

    if (msg.content === cmdSymbol + "release"){
        //console.log(catches.join("\n$"));
        //catches.forEach((caught) => console.log(caught));
        channel.send(catches.length != 0 ? catches.join("\n") : "catches is...not correct");
        catches = [];
    }
});

