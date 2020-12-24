'use strict';
const tmi = require('tmi.js');

class TwitchBot{

    constructor(botConfig, callbacks){
        //Instance vars.
        this.client = new tmi.client(botConfig); //The client, i.e., the bot itself

        this.processMessage = callbacks.processChatMessage; //Callback that runs on chat messages

        //Bind methods
        this.start = this.start.bind(this);
    }

    //Start TwitchBot. Begins reading and responding to each chat message.
    start(){
        this.client.connect(); //Connect to the channels
        this.client.on("message", this._onMessage.bind(this)); //Attach message handler
    }

    //On worthy messages, print the details locally, run callback on message and post response to chat
    _onMessage(channel, userstate, message, self){
        //Ignore unworthy chat messages. Best to apply strong restrictions here. The fewer worthy messages => less to be processed elsewhere
        if(!this._isMessageWorthy(message) || self) return; 
        
        //Print to console
        this._printMessage(channel, userstate, message, self);

        //Run message-processing callback on message. 
        //Post response to chat by providing callback 
        //so that once message is processed, the response is posted
        this.processMessage(message, this._postResponseToChat.bind(this, channel))
    }

    //Returns true only if message is worthy enough for agent
    _isMessageWorthy(message){
        return (message     //message exists
            && message.trim().length > 0); //message isn't whitespace
    }

    _printMessage(channel, userstate, message, self){
        let senderUsername = this._getUser(userstate);
        console.log(`message '${message}' from ${senderUsername} on channel ${channel}`);
        console.log("sending to diaglogflow...");
    }

    //Gets username given userstate
    _getUser(userstate){
        return userstate['username'];
    }

    //Posts given responseText to channel's chat
    _postResponseToChat(channel, responseText){
        this.client.say(channel, responseText);
    }
}

//Export
module.exports = TwitchBot;