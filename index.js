//Calling the Package
var Discord = require("discord.js");
var bot = new Discord.Client();
var fs = require("fs"); // First, we need to require fs, it is packaged with node.js so no need to download it // Make sure you have this required.
var profanities = require("profanities"); // We need to require all the packages after we install them.

// Second, let call the file we just created using fs
var userData = JSON.parse(fs.readFileSync("Storage/userData.json", "utf8"));
var commandsList = fs.readFileSync("Storage/commands.txt", "utf8"); // We need to call the file, we can just copy the line above and replace them.
bot.commands = new Discord.Collection(); // First, we need to make a collection for the bot.

function loadCmds () {
    fs.readdir("./commands/", (err, files) => { // This reads the directory of the commands folder.
        if(err) console.error(err); // This, sends an error message to the console.

        var jsfiles = files.filter(f => f.split(".").pop() === "js"); // This checks if the file extension is "js"
        if (jsfiles.length <= 0) { return console.log("No commands found...")} // This returns & sends the console that no commands were found.
        else { console.log(jsfiles.length + " commands found...") } // This tells how many commands it found.

        jsfiles.forEach((f, i) => { // This, loops through each file and runs the folliwing code.
            delete require.cache[require.resolve(`./commands/${f}`)]; // This deletes the cached file that you specify.
            var cmds = require(`./commands/${f}`); // This gets every js file in the chosen folder.
            console.log(`Command ${f} loading...`); // This logs to the console that the command <name> is loading.
            bot.commands.set(cmds.config.command, cmds); // This gets the name of the channel, as well as the modules in the file.
        })


    })

}

function userInfo(user, guild) { // If you have the userdata function, you need to call the guild so you can add it to the userData.
    var finalString = ""; // This is the beginning of the final string, but we need to add things to it.

    // Name
    finalString += "**" + user.username + "**, with the **ID** of **" + user.id + "**"; // This gets the name of the user, and the ID, and adds it to the final string.

    // Now lets add the created At date.  This doesn't look good, so lets split it and recreate it the createdAt message.
    var userCreated = user.createdAt.toString().split(" "); 
    finalString += ", was **created on " + userCreated[1] + ", " + userCreated[2] + " " + userCreated[3] + "**."

    // Message Sent
    finalString += " Since then, they have **sent " + userData[user.id + guild.id].messagesSent + "messages** to this discord."

    

    return finalString; 
}

loadCmds(); // We also want to make sure that we call it when the script starts, so it loads.
//Listener Event: Message Received ( This will run every time a message is received)
bot.on("message", message => {

    //Variables 
    var sender = message.author; // The person who sent this message
    var msg = message.content.toUpperCase(); // Takes the message, and makes it all uppercase
    var prefix = ">" // The text before commands, you can set this to what ever you want
    var cont = message.content.slice(prefix.length).split(" "); // This slices off the prefix, then puts it an array.
    var args = cont.slice(1); // This is everything after the command is an array.

    // Now, lets make sure their username is there before writing to the file.
    if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {
        messagesSent: 0
    } // We also want to change the rest of the userData callings in this file.

     // Now, lets increase messagesSent and write to the final file.
     userData[sender.id + message.guild.id].messagesSent++; // This adds one to "messagesSent", under the user.
     // Make sure you are actually counting it before closing the script.
     // This should only apply if you added the command handler from 2 episodes ago.

    if (!message.content.startsWith(prefix)) return; // This returns if the prefix of the command is not the one yet.

    var cmd = bot.commands.get(cont[0]) // This tries to grab the command that you called in chat.
    if (cmd) cmd.run(bot, message, args); // This checks if it exists, and if it does runs the command.

    if (msg === prefix + "RELOAD") {
        message.channel.send({embed:{description:"All Commands Reloaded"}}) // This sends an embed letting you know you reloaded the commands.
        message.channel.send("All Commands Reloaded") // This does the same thing but not as an embed, ill show both right now so you can see the difference.
        loadCmds()
    }

    // Profanity
    for (x = 0; x < profanities.length; x++) { // This loops every word of the profanities list you downloaded.
        if (message.content.toUpperCase() == profanities[x].toUpperCase()) {
            message.channel.send("Hey! Don't say that!") // Tells them that they can't say that.
            message.delete(); // Deletes the message.
            return; // Stops the rest of the commands from running.
        }
    }

    // First, we need to make sure that it isn't reading it's own message that the bot is sending
    if (sender.id === "533756962374942750") { // Checks if the ID of the sender is the same ID as the bot
        return; // Cancels the rest of thr Listener Event.
    }

    // Be sure to delete the command from your index.js so it doesn't respond multiple times!

    // Deleting Specific Messages ( Messages that are not an ID for me)
    if (message.channel.id === "533731777592688695") { // Checks if the message is in the specific channel
        if (isNaN(message.content)) { // Checks if the message is not a number, if it's not the following code will run 
            message.delete() // This deletes the message
            message.author.send("Please only post the number, and not any other text in this channel, thank you!") // This private messages the author that what they posted was invalid

        }

    }

    // You can also do this for other words, in all of the channels
    if (msg.includes("LETTUCE")) { // Checks if the word Lettuce is included in the message
        message.delete(); // Deletes the message
        message.author.send("The word **Lettuce** is banned, please don't use it!") // This private messages the user that the word Lettuce is banned and that the message got deleted.
    }

    // To save the file we have to write this:
    fs.writeFile("Storage/userData.json", JSON.stringify(userData), (err) => {
        if (err) console.error(err); // We just want it to log if their is an error.
    });

    // Lets delete that so we can recreate it using a better command.
    if (msg.startsWith(prefix + "USERINFO")) { // This checks if the message starts with the command, since they will be adding things to the end of it.
        // We should assume that if they are not adding a name to the end of the command, they want info on themselves.
        if (msg === prefix + "USERINFO") {
            message.channel.send(userInfo(sender, message.guild)); // This will return the message about info on themselves.  // We should make a function so we don't have to write it multiple times
        }
    }

});

//Listener Event: Bot Launched
bot.on("ready", () => {
    console.log("Bot Launched...") // Runs when the bot is Launched

    // You can put any code you want here, it will run when you turn on your bot.

   // We will be going over setting "game playing", "status", and "watching"

   // status
   bot.user.setStatus("Online") // Your status goes here; It can be "Online", "Idle", "Invisible", or "dnd".

   // game & watching 
   //bot.user.setActivity("Hello!", {type: "PLAYING"}); 
   // To set watching, add another option like this:
   bot.user.setActivity("Hello!", {type: "WATCHING"}); // You can change the string to whatever you want.

});

// Listener Event: User joining the discord server.
bot.on("guildMemberAdd", member => {

    console.log("User ", + member.user.username + " has joined the server!")  // Sends a message in console that someone joined the discord server

    // Now, let's add a role when they join.  First, we need to get the role we want.
    var role = member.guild.roles.find("name", "User"); // This looks for the role in the server(guild), it searches by name, meaning you can change "User" to the role you want.

    // Secondly, we will add the role
    member.addRole(role)

    // Sending a message to a channel when a user joined the server
    member.guild.channels.get("534399455995101184").send("** " + member.user.username + "**, has joined the server!"); // The first part gets the channel, the second send it to the channel


});

// Now, let's make it so that when someone leaves, code runs.
// Listener Event: User leaving the discord server.
bot.on("guildMemberRemove", member => {

    // The code can simply be copied from the line you made before
    member.guild.channels.get("534399455995101184").send("** " + member.user.username + "**, has left the server!"); // The first part gets the channel, the second sends the message to the channel
    // You can change the channel ID to whatever you want, aswell as the message.

});

// Login 
//#region Token (Ignore this, all it does is hide my Token. Line: bot.login("Token"))
    bot.login("NTMzNzU2OTYyMzc0OTQyNzUw.DxyY2A.ssQTkCtvoW3j2wW2slbMMjG4SGk") 
    //#endregion Token
// Don't let people see this code, people can control your bot, including the server your bot has admin on.