#!/usr/bin/env node
const cryptDir = '/usr/local/bin/cryptchat.d'
const prompt = require('prompt-sync')({sigint: true});
const colours = require(cryptDir + '/colours.json');
const config = require(cryptDir + '/config.json');
const crypt = require(cryptDir + '/crypt.js');
const net = require('net');
const clientColours = getTextColour('foreground') + getTextColour('background');
const white = colours.foreground[0].code;
const blue = colours.foreground[4].code;

IP = (process.argv[2] ? process.argv[2]: (prompt('Host IP Address -> ').trim()))
port = (process.argv[3] ? process.argv[3]: (prompt('Port -> ').trim()));
var encryption = prompt('Encryption -> ').trim();

const client = new net.Socket();

console.log(`Checking host ${colours.effects.blink}* ${colours.effects.reset}`);
try {
    client.connect({host: IP, port: port});
} catch (error) {
    process.exit(1);
}

client.on('connect', () => {
    console.log('Connected');
    client.write(formatMessage(`connected [${client.localAddress}]`));
    setInterval (() => {
        client.write(formatMessage(prompt('-> ')));
    }, 150); 
})

function getTextColour(type) {
  //See my notes on this function in the client.js file
    let foreColouring = String(config.textColour).trim().toLowerCase(),
      backgroundColouring = String(config.backgroundTextColour).trim().toLowerCase();
    var usercolour,
      textColor = (type === 'foreground' ? foreColouring: textColor = backgroundColouring),
      colors = (type === 'foreground' ? colours.foreground: colours.background);
    if (!textColor || String(textColor) === 'null') {
       usercolour = (type !== 'background' ? white: '');
    } else if (textColor === 'random') { 
        let randColour = colors[~~(colors.length * Math.random())];
        usercolour = randColour.code;
    } else { usercolour = colors.find(item => item.colour === textColor).code; };
   return usercolour;
}

function formatMessage(content) {
    let now = new Date(),
      militaryTime = config.militaryTime,
      hour = (now.getHours() > 12 && !militaryTime ? now.getHours() - 12 : now.getHours()),
      timeString = `${blue + hour + white}:${blue + now.getMinutes() + colours.effects.reset}`,
      authorString = `${timeString}| ${colours.effects.reset + colours.effects.bright + config.username}`;
      var msg = JSON.stringify({
            "author": authorString,
            "content": clientColours + content + colours.effects.reset,
            "raw": {
              "author": config.username,
              "content": content
            }
        });
      if (encryption) {
         msg = crypt.encrypt[encryption](msg, 1);
      }
   return msg;
}