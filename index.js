//Calling the Package
var Discord = require('discord.js');
var bot = new Discord.Client();
var fs = require("fs"); // We need to require fs (No need to install it since it's already in node)
var profanities = require('profanities'); // `npm i profanities`

var userData = JSON.parse(fs.readFileSync("Storage/userData.json", "utf8"));
var commandsList = fs.readFileSync("Storage/commands.txt", "utf8"); 
bot.commands = new Discord.Collection(); 

function loadCmds () {
    fs.readdir("./commands/", (err, files) => { 
        if(err) console.error(err); 

        var jsfiles = files.filter(f => f.split(".").pop() === "js"); 
        if (jsfiles.length <= 0) { return console.log("No commands found...")} 
        else { console.log(jsfiles.length + " commands found...") } 

        jsfiles.forEach((f, i) => {
            delete require.cache[require.resolve(`./commands/${f}`)]; 
            var cmds = require(`./commands/${f}`); 
            console.log(`Command ${f} loading...`); 
            bot.commands.set(cmds.config.command, cmds); 
        })


    })

}

function userInfo(user, guild) {
    var finalString = ""; 

    // Name
    finalString += "**" + user.username + "**, with the **ID** of **" + user.id + "**"; 
    
    var userCreated = user.createdAt.toString().split(" "); 
    finalString += ", was **created on " + userCreated[1] + ", " + userCreated[2] + " " + userCreated[3] + "**."

    // Message Sent
    finalString += " Since then, they have **sent " + userData[user.id + guild.id].messagesSent + "messages** to this discord."

    

    return finalString; 
}

loadCmds(); 

//Listener Event: Message Received
bot.on("message", message => {

    //Variables 
    var sender = message.author;
    var msg = message.content.toUpperCase(); 
    var prefix = ">" 
    var cont = message.content.slice(prefix.length).split(" "); 
    var args = cont.slice(1); 

    if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {
        messagesSent: 0
    } 

     userData[sender.id + message.guild.id].messagesSent++; 

    if (!message.content.startsWith(prefix)) return; 

    var cmd = bot.commands.get(cont[0]) 
    if (cmd) cmd.run(bot, message, args); 

    if (msg === prefix + "RELOAD") {
        message.channel.send({embed:{description:"All Commands Reloaded"}}) 
        message.channel.send("All Commands Reloaded") 
        loadCmds()
    }

    // Profanity
    for (x = 0; x < profanities.length; x++) { 
        if (message.content.toUpperCase() == profanities[x].toUpperCase()) {
            message.channel.send("Hey! Don't say that!") 
            message.delete();
            return; 
        }
    }

    if (sender.id === "BOT ID") { 
        return; 
    }
    
    // Deleting Specific Messages 
    if (message.channel.id === "533731777592688695") {
        if (isNaN(message.content)) {
            message.delete() 
            message.author.send("Please only post the number, and not any other text in this channel, thank you!") 

        }

    }

    if (msg.includes("LETTUCE")) {
        message.delete(); 
        message.author.send("The word **Lettuce** is banned, please don't use it!") 
    }

    fs.writeFile("Storage/userData.json", JSON.stringify(userData), (err) => {
        if (err) console.error(err); 
    });

    if (msg.startsWith(prefix + "USERINFO")) { 
        if (msg === prefix + "USERINFO") {
            message.channel.send(userInfo(sender, message.guild)); 
        }
    }

});

//Listener Event: Bot Launched
bot.on("ready", () => {
    console.log("Bot Launched...") // Runs when the bot is Launched

    // You can put any code you want here, it will run when you turn on your bot.

   // status
   bot.user.setStatus("Online") // It can be "Online", "Idle", "Invisible", or "dnd".

   // game & watching 
   bot.user.setActivity("Hello!", {type: "PLAYING"}); 
    
   // To set watching, add another option like this:
   bot.user.setActivity("Hello!", {type: "WATCHING"}); // You can change the string to whatever you want.

});

// Listener Event: User joining the discord server.
bot.on("guildMemberAdd", member => {

    console.log("User ", + member.user.username + " has joined the server!")  

    var role = member.guild.roles.find("name", "User");

    member.addRole(role)

    member.guild.channels.get("534399455995101184").send("** " + member.user.username + "**, has joined the server!"); 


});

// Listener Event: User leaving the discord server.
bot.on("guildMemberRemove", member => {

    member.guild.channels.get("CHANNEL ID").send("** " + member.user.username + "**, has left the server!"); 

});

// Login 
bot.login(process.env.TOKEN) 
