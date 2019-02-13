module.exports.run = async (bot, message, args) => { // This is what will run when the command is called.

    var fs = require("fs"); 
    var commandsList = fs.readFileSync("Storage/commands.txt", "utf8"); 

        message.channel.send(commandsList) // We want to make sure everything is defined when you put it here.
    }

module.exports.config = { // This is the config for the command, you can add things to this such as proper usage, ect.
    command: "help"
}

// Make sure you delete the IF statements...