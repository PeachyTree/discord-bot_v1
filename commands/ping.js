module.exports.run = async (bot, message, args) => { // This is what will run when the command is called.

    //Ping / Pong command

    // We can delete the IF statement since the command handler does that.
 
    
        message.channel.send({embed:{ // The start of the embed is usually the same, and it looks like this.
            title:"Ping!",
            description:"Pong!",
            color: 0x5DADE2   // The colors can be found in the description, remember to put a 0x before all of the numbers.
        }}) // A link of the objects you can put in the embed will be in the description.

    }


module.exports.config = { // This is the config for the command, you can add things to this such as proper usage, ect.
    command: "ping"
}