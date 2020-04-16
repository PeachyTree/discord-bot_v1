// Copyright (c) 2020 Azura Apple. All rights reserved. MIT license.

module.exports.run = async (bot, message, args) => { 

    var fs = require("fs"); 
    var commandsList = fs.readFileSync("Storage/commands.txt", "utf8"); 

        message.channel.send(commandsList) 
    }
    
module.exports.config = { 
    command: "commands"
}
