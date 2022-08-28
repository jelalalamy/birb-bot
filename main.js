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
        if (args.length != 1){
            msg.reply("Usage: ~catch <topk>");
            return;
        }
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
                        // Catch mmr?
                        // else{
                        //    if(!(caught.includes('AVG') || caught.includes('Top 15') || caught.length < 5 || !caught)){
                        //        catches.push(caught.substring(caught.indexOf('-') + 2,caught.length));
                        //    }
                        //}
                    });
                    console.log("Caught a message");
                }
                else{
                    console.log("found a message not from mudae");
                }
            });
        });
    }

    if (command === "release"){
        //console.log(catches.join("\n$"));
        //catches.forEach((caught) => console.log(caught));
        channel.send(catches.length != 0 ? catches.join("\n") : "catches is...not correct");
        catches = [];
        rawCatches = [];
    }

    if (command === "upload"){
        if (args.length != 1){
            msg.reply("Usage: ~upload <date>");
            return;
        }
        let date = args[0];
        if (rawCatches.length == 0){
            console.log("Nothing is in the catches array.");
        } else {
            rawCatches.forEach((caught) => {
                const path = doc(firestore, `${date}/${caught.name.toLowerCase()}`);
                setDoc(path, caught);
                console.log(`Uploaded ${caught.name}`);
            });
        }
        catches = [];
        rawCatches = [];
    }

    if (command === "readdate"){
        if (args.length != 1){
            msg.reply("Usage: ~readdate <date>");
            return;
        }
        let date = args[0];
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
    
    if (command === "readchar"){
        if (args.length != 2){
            msg.reply("Usage: ~catch <date> <character name>");
            return;
        }
        let date = args[0];
        // Handle characters with spaces in the name
        let char = args.slice(1, args.length).join(' ').toLowerCase();
        console.log(`readchar => ${date}/${char}`);
        const read = async () => {
            const mySnapshot = await getDoc(doc(firestore, `${date}/${char}`));
                if (mySnapshot.exists()){
                    const docData = mySnapshot.data();
                    channel.send(`Data is => ${JSON.stringify(docData)}`);
                } else {
                    channel.send(`Could not find "${char}"`);
                }
            }
        read();
    }

    if (command === "compare"){
        if (args.length != 2){
            msg.reply("Usage: ~catch <first date> <second date>");
            return;
        }

        // Retrieving and parsing dates
        let firstDate = new Date(args[0].split('-')[0], args[0].split('-')[1]-1, args[0].split('-')[2]);
        let secondDate = new Date(args[1].split('-')[0], args[1].split('-')[1]-1, args[1].split('-')[2]);
        if (firstDate < secondDate) [firstDate, secondDate] = [secondDate, firstDate];
        console.log(`Comparing dates ${firstDate.toISOString().substring(0,10)} and ${secondDate.toISOString().substring(0,10)}`);

        let arr1 = new Map();
        let arr2 = new Map();

        const read = async () => {
            const querySnapshot1 = await getDocs(query(collection(firestore, firstDate.toISOString().substring(0,10)), orderBy("rank")));
            querySnapshot1.forEach((doc) => {
                arr1.set(doc.data().name, doc.data());
            });
            const querySnapshot2 = await getDocs(query(collection(firestore, secondDate.toISOString().substring(0,10)), orderBy("rank")));
            querySnapshot2.forEach((doc) => {
                arr2.set(doc.data().name, doc.data());
            });
            const largestGain = {val: 0};
            const largestLoss = {val: 0};
            arr1.forEach((char, key) => {
                console.log(`${key} => ${char.rank} to ${arr2.get(key).rank}`);
                let change = char.rank - arr2.get(key).rank;
                if (change < largestGain.val){
                    largestGain.val = change;
                    largestGain.name = key;
                } else if (change > largestLoss.val){
                    largestLoss.val = change;
                    largestLoss.name = key;
                }
            });
            channel.send(`Largest gain: ${largestGain.name}, ${largestGain.val}\n`+
                        `Largest loss: ${largestLoss.name}, ${largestLoss.val}`);
        };
        read();
    }
});
