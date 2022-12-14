#!/usr/bin/env node
const config = require('./server-config.json');
const net = require('net');
const fs = require('fs');
var sockets = [],
members = [];

//Custom command template. Each command is given the args (client, message) in that order.
const commands = [
    {
        'name': 'exit',
        'function': (client) => { client.destroy(); }
    },
    {
        'name': 'raw',
        'function': (client, msg) => {
            let content = `\n${msg.author} : ${msg.content.slice(config.commandPrefix.length + 3)}\n`;
            broadcast(content);
        }
    }
];

process.on('uncaughtException', (error) => {
    if (String(error).includes("destroyed")) {
        pruneConnections();
    }
});

const server = net.createServer((socket) => {
    //Whenever a new connection is received, add it to the connections array
    socket.setTimeout(1000);
    sockets.push(socket);
    members.push([socket, socket.remoteAddress]);
    console.log(socket.remoteAddress + " connected");
    checkUser(socket);
    socket.on('data', async (data) => {
        var message = data.toString('utf8'), msg, logMSG = `${message} | ${socket.remoteAddress} | \n`;
        console.log(logMSG);
        if (config.logging) {
            fs.appendFileSync(config.logs, logMSG);
        }
        broadcast(message);
        try {
            msg = JSON.parse(message).raw;
        } catch (error) {
            return;
        }
        if (!msg.content.startsWith(config.commandPrefix) && msg.content !== '/exit') { return; };
        let msgContent = msg.content.slice(config.commandPrefix.length);
        commands.forEach((command) => {
            if (msgContent.startsWith(command.name)) {
                command.function(socket, msg);
            }
        })
    })
    socket.on('end', () => {
        //When someone leaves, remove them from the sockets array and broadcast their leave
        let now = new Date(),
         militaryTime = config.militaryTime,
         hour = (now.getHours() > 12 && !militaryTime ? now.getHours() - 12 : now.getHours());
        let connection = sockets.indexOf(socket),
         messageString = `${hour}:${now.getMinutes()} | [SERVER]: ${members[connection][1]} left.`;
        console.log(messageString);
        if (connection > -1) {
            members.splice(connection, true);
            sockets.splice(connection, true);
        } if (config.logging) {
            fs.appendFileSync(config.logs, messageString);
        } if (config.broadcastLeaves && sockets.length) {
            sockets.forEach((socket) => {
                socket.write(messageString);
            });
        }
    })
})

function broadcast(message) {
    sockets.forEach((client) => {
        try {
            client.write(message);
        } catch (error) {
            //If the server can't send a message to any one person, it'll check each socket for a faulty connection and remove it
            pruneConnections();
            broadcast(message);
            return;
        }
    })
}

function pruneConnections() {
    sockets.forEach((client) => {
        try {
            client.write("Testing connection...\n");
        } catch (error) {
            let connection = sockets.indexOf(client);
            if (connection > -1) {
                members.splice(connection, true);
                sockets.splice(connection, true);
                //console.log(`${connection} | ${members.length}, ${sockets.length}`);
            }
        }
    })
}

function checkUser(socket) {
    //Check to see if a new user joining is IP banned, if they are then remove them
    fs.readFile(config.banList, (err, data) => {
        if (err) { throw err; }
        let content = data.toString('utf8').split('\n'),
        user = content.find(item => (item == "::ffff:" + socket.remoteAddress || item == socket.remoteAddress));
        if (user) {
            console.log(`Forcefully removed ${socket.remoteAddress}`);
            socket.destroy();
        }
    })
}

server.maxConnections = config.maxConnections;
server.listen(config.port);
