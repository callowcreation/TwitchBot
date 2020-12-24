const messages = document.getElementById ('messages');
const commands = document.getElementById ('commands');
const variables = document.getElementById ('variables');
const alertArea = document.getElementById ('alert-area');
const commandField = document.getElementById ("command");
const commandDescriptionField = document.getElementById ("commandtext");
const botText = document.getElementById ("bottext");
const disconnectBotButton = document.getElementById ("disconnectbot");

let ws = new WebSocket ('wss://' + window.location.host + '/ws');
if (location.protocol !== 'https:') {
    ws = new WebSocket ('ws://' + window.location.host + '/ws');
}
ws.addEventListener ('message', function (e) {
    let msg = JSON.parse (e.data);
    if (msg.key === "message" | msg.key === "notice") {
        messageReceive (msg.private_message);
    } else if (msg.key === "channel") {
        if (msg.bot_name !== undefined) {
            channelBotReceive (msg.channel, msg.bot_name);
        } else {
            channelReceive (msg.channel);
        }
    } else if (msg.key === "endchannel") {
        channelEndReceive (msg.value);
    } else if (msg.key === "state") {
        userStateHandler (msg.state);
    } else if (msg.key === "alert") {
        alertHandler (msg.text, msg.alert_type);
    } else if (msg.key === "botdisconnected") {
        botDisconnected ()
    } else if (msg.key === "botconnected") {
        botConnected ()
    } else if (msg.key === "logout") {
        console.log ("Logout received")
        // Session is terminated, go to index page
        window.location = "/"
    } else {
        console.log ("message not processed: ")
        console.log (msg)
    }
});

ws.addEventListener ('open', function (e) {
    console.log ("socket open")
});

ws.addEventListener ('close', function (e) {
    console.log ("socket closed")
});

document.getElementById ("createcommand").addEventListener ('click', function (e) {
    e.preventDefault ();
    let jsonmsg = JSON.stringify ({
        key: "createcommand",
        command: commandField.value,
        text: commandDescriptionField.value
    })
    ws.send (jsonmsg);
});

if (disconnectBotButton) {
    disconnectBotButton.addEventListener ('click', disconnectBot);
}

function disconnectBot(e) {
    e.preventDefault ();
    let jsonmsg = JSON.stringify ({
        key: "disconnectbot",
    });
    ws.send (jsonmsg);
}

function botConnected() {
    // reload the page
    console.log ("Bot connected")
    window.location = "/admin"
}

function botDisconnected() {
    // reload the page
    console.log ("Bot disconnected")
    window.location = "/admin"
}

document.getElementById ("logout").addEventListener ('click', logout);

function logout(e) {
    e.preventDefault ();
    console.log ("logout clicked")
    let jsonmsg = JSON.stringify ({
        key: "logout",
    });
    ws.send (jsonmsg);
}

function removeCommandClicked(e) {
    e.preventDefault ();
    let cmd = e.currentTarget.parentNode.querySelector ('p').innerText;
    let msg = {key: "removecommand", text: cmd};
    console.log (msg);
    ws.send (JSON.stringify (msg));
}

function appendMessage(m, c) {
    var message = document.createElement ('div');
    message.className = c;
    message.innerHTML = m;
    messages.appendChild (message);
}

function receiveMessage(message, className) {
    // Prior to getting your messages.
    let shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
    /*
     * Get your messages, we'll just simulate it by appending a new one syncronously.
     */
    appendMessage (message, className);
    // After getting your messages.
    if (!shouldScroll) {
        scrollToBottom ();
    }
}

function messageReceive(obj) {
    if (obj.User.Color !== "") {
        receiveMessage ("<b><span style=\"color:" + obj.User.Color + "\">" + obj.User.DisplayName + ":</span></b> " + obj.Message, 'message')
    } else {
        receiveMessage ("<b>" + obj.User.DisplayName + ":</b> " + obj.Message, 'message')
    }
}

function channelReceive(message) {
    receiveMessage ("Connected to channel " + message, 'channel')
}

function channelBotReceive(message, botName) {
    receiveMessage (botName + " connected to channel " + message, 'channel')
}

function channelEndReceive(message) {
    receiveMessage ("Disconnected from channel " + message, 'channel')
}

function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}

function appendCommand(command) {
    var p = document.createElement ('p');
    var b = document.createElement ('b');
    b.innerText = command["input"];
    p.appendChild (b);
    var c = document.createElement ('div');
    c.className = "cmd";
    commands.appendChild (c);
    c.appendChild (p);
    var p2 = document.createElement ('p');
    p2.innerText = command["output"];
    c.appendChild (p2);
    var button = document.createElement ('button');
    button.type = "submit";
    button.className = "btn btn-danger";
    button.id = "removecommand";
    button.innerText = "Remove";
    c.appendChild (button);
    console.log("event listener registered");
    button.addEventListener ('click', removeCommandClicked);
    commandField.value = "";
    commandDescriptionField.value = "";
}

function appendVariable(variable) {
    var p = document.createElement ('p');
    var b = document.createElement ('b');
    b.innerText = variable["name"];
    var span = document.createElement ('span');
    span.innerHTML = " - " + variable["description"];
    p.appendChild (b);
    p.appendChild (span);
    variables.appendChild (p);
}

function clearCommands() {
    commands.innerHTML = "";
}

function clearVariables() {
    variables.innerHTML = "";
}

function userStateHandler(state) {
    console.log ("User state received");
    console.log (state);
    if (state["commands"] !== undefined) {
        clearCommands ();
        state["commands"].forEach (function (value, index, array) {
            appendCommand (value);
        });
    }
    if (state["variables"] !== undefined) {
        clearVariables ();
        state["variables"].forEach (function (value, index, array) {
            appendVariable (value);
        });
    }
}

function alertHandler(text, type) {
    alertArea.innerHTML = "<div class=\"alert alert-" + type + "\" role=\"alert\">" + text + "</div>";
    setTimeout (function () {
        alertArea.innerHTML = "";
    }, 5000);
}

scrollToBottom ();