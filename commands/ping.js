module.exports.run = async (bot, message, args) => { 

    //Ping / Pong command
 
    
        message.channel.send({embed:{ 
            title:"Ping!",
            description:"Pong!",
            color: 0x5DADE2   
        }}) 

    }


module.exports.config = { 
    command: "ping"
}
