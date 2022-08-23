require("dotenv").config();
const Discord = require('discord.js');
const {doc, getDoc, onSnapshot, setDoc, getDocs, collection, orderBy, query} = require('firebase/firestore');
const { firestore } = require('./config.js');

// Discord Client set up
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
client.login(process.env.TOKEN);

// Global variables
const cmdSymbol = "~";
var catches = [];
var rawCatches = [];

// Client interaction
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", msg => {
    let server = msg.guild;
    let channel = msg.channel;
    
    // Ignore message if it does not begin with cmdSymbol (~)
    if (!msg.content.startsWith(cmdSymbol) || msg.author.bot) return;

    // Parsing command and arguments from message content
    const args = msg.content.slice(cmdSymbol.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    // Reply to "ping" with "pong"
    if (command === "ping"){
        msg.reply(`pong ${args.length > 0 ? args[0] : "-1"}`);
        console.log(`Replied to message: "${msg.content}"`);
    }
    
    // fetching last 7 messages
    if (command === "catch"){
        channel.messages.fetch({ limit: 7 }).then((messages) => {
            messages.forEach(message => {
                //console.log(message.embeds[0]);
                if (message.author.id === '432610292342587392'){
                    let uglyCatch = message.embeds[0].description.split("\n");
                    //console.log(uglyCatch);
                    uglyCatch.forEach(caught => {
                        // Catch topk
                        if (args[0] === "topk"){
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
                                rawCatches.push(character);
                            }
                        }
                        else{
                            if(!(caught.includes('AVG') || caught.includes('Top 15') || caught.length < 5 || !caught)){
                                catches.push(caught.substring(caught.indexOf('-') + 2,caught.length));
                            }
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

    // if (msg.content === cmdSymbol + "catch topk"){
    //     channel.messages.fetch({ limit: 7 }).then((messages) => {
    //         messages.forEach(message => {
    //             //console.log(message.embeds[0]);
    //             if (message.author.id === '432610292342587392'){
    //                 let uglyCatch = message.embeds[0].description.split("\n");
    //                 console.log(uglyCatch);
    //                 uglyCatch.forEach(caught => {
    //                     if(!(caught.includes('AVG') || caught.includes('Top 15') || caught.length < 5 || !caught)){
    //                         caught = caught.split('*');
    //                         let character = {
    //                             rank: parseInt(caught[2].substring(1, caught[2].length)),
    //                             name: caught[6],
    //                             series: caught[8].substring(3, caught[8].length - 3),
    //                             kakera: parseInt(caught[10])
    //                         }; 
    //                         //console.log(character);
    //                         catches.push(JSON.stringify(character));
    //                         rawCatches.push(character);
    //                     }
    //                 });
    //                 console.log("Caught a message");
    //             }
    //             else{
    //                 console.log("Found a message not from mudae");
    //             }
    //         });
    //     });
    // }

    if (command === "release"){
        //console.log(catches.join("\n$"));
        //catches.forEach((caught) => console.log(caught));
        channel.send(catches.length != 0 ? catches.join("\n") : "catches is...not correct");
        catches = [];
        rawCatches = [];
    }

    if (command === "upload"){
        if (rawCatches.length == 0){
            console.log("Nothing is in the catches array.");
        } else {
            rawCatches.forEach((caught) => {
                const path = doc(firestore, `2021-08-22/${caught.name}`);
                setDoc(path, caught);
                console.log(`Uploaded ${caught.name}`);
            });
        }
    }

    if (command === "read"){
        let date = args[0];
        console.log(date);
        const read = async () => {
            const ref = collection(firestore, date);
            const q = query(ref, orderBy("rank"));
            const querySnapshot = await getDocs(q);
            let result = "";
            querySnapshot.forEach((doc) => {
                result = result.concat(`${doc.id} => ${JSON.stringify(doc.data())}`, "\n");
            });
            channel.send(result);
        };
        read();
    }
    
});

