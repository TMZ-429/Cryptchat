#!/usr/bin/env node
const cryptDirectory = '/usr/local/bin/cryptchat.d';
const colours = require(cryptDirectory + '/colours.json');
const prompt = require('prompt-sync')({sigint: true});
const crypt = require(cryptDirectory + '/crypt.js');
const player = require('play-sound')(opts = {});
const notifier = require('node-notifier');
const config = require('./config.json');
const net = require('net');
const fs = require('fs');

const bgGreen = colours.background[2].code;
const yellow = colours.foreground[3].code;
const green = colours.foreground[2].code;
const white = colours.foreground[0].code;
const blue = colours.foreground[4].code;
const red = colours.foreground[1].code;
const clientColours = getTextColour('foreground') + getTextColour('background');

console.clear();
console.log(`${green}

    ▄▄▄▓▓▓▓▓▓▓▓▓▓▓▓▄▄▄    
█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▌
█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌
▐█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌
 █▓▓▓▓▓▓▓▓▓${colours.effects.reset + bgGreen}CRYPT${colours.effects.reset + green}▓▓▓▓▓▓▓▓▓▌
 ║█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
 ║█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
  ╙▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀
   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█
    █▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌
    ╙█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌
      ╙▓▓▓▓▓▓▓▓▓▓▓▓▀
        ╙▓▓▓▓▓▓▓▓▀
           ╙▀▀▀
`);

var IP, port;
IP = (process.argv[2] ? process.argv[2]: (prompt(`${blue}Host IP Address -> ${clientColours}`).trim()))
port = (process.argv[3] ? process.argv[3]: (prompt(`${blue}Port -> ${clientColours}`).trim()));
port = parseInt(port);

var encryption = prompt(`${blue}Encryption -> ${clientColours}`).trim();
if (encryption) {
  var encryptionKey = prompt(`${blue}Encryption Key -> ${clientColours}`).trim();
}

//I made the built-in encryption super basic but left it super open and easy for people to add new encryption methods.

console.log(`${blue}Checking host ${colours.effects.reset + colours.effects.blink}* ${colours.effects.reset}`);
try {
    connect();
} catch (error) {
    console.log(`${red}[ERROR]:${yellow} Could not connect to host ${colours.effects.reset}`);
    process.exit(1);
}

function connect() {
    var client = new net.Socket();
    client.connect({host: IP, port: port}, async () => {
       if (config.logMesssages) {
        fs.appendFile(config.logs, `Joined ${IP}:${port}`, (error) => {
          if (error) {
            console.log(`${red}[ERROR]:${yellow} Could not write to ${clientColours + config.logs + reset}`);
          }
        });
       }
       console.log(`${green}Connected to ${yellow + IP + white}:${yellow + port + clientColours}!${colours.effects.reset}`);
    });
    client.on('data', (data) => {
      var rawMSG = data.toString('utf-8'), msg;
      if (encryption === "typeA") {
        rawMSG = crypt.encrypt.typeA(rawMSG, 0);
      } else if (encryption) {
        crypt.encrypt[encryption](rawMSG, encryptionKey);
      } try {
        msg = JSON.parse(rawMSG);
      } catch (error) {
        msg = false;
      }
      //If the message is not valid JSON, it'll just send the whole thing instead of attempting to parse it
      let logMSG = (msg ? `${msg.author} : ${msg.content}` : rawMSG),
      notification = {
        'title': (msg ? msg.raw.author : "[Server Message]"),
        'message': (msg ? msg.raw.content : rawMSG)
      };
      console.log(logMSG);
      player.play(`${cryptDirectory}/notification.mp3`);
      notifier.notify({
          title: notification.title,
          message: notification.message,
          icon: `${cryptDirectory}/notification.png`
      });
      if (config.logMessages) {
        fs.appendFileSync(config.logs, `${notification.title} : ${notification.message}`);
      }
      //Special exception for receiving /exit to exit the program
      if (msg && msg.raw.content === "/exit" && msg.raw.author.trim() === config.username) {
        client.write(JSON.stringify({
            'raw': {'content': '/exit'}
          })
        );
      }
    });
    client.on('end', () => {
      process.exit();
    })
}

function getTextColour(type) {
  /*
  I had to have been maybe 13 when I made this function, along with the colours.json file which I just do not understand as of now.
  I could've just gone with a standard json file like
  {
    "foreground": {
      "green": "whatever colour code green is",
      "red": "colour code for red",
      "yellow": "yellow code"
    }
  }
  Then in this function, I could've just had it be:
 
  let userTextFG = config.textColour, userTextBG = (backgroundTextColour ? colours.background[backgroundTextColour] : "");
  return colours.foreground[userTextFG] + userTextBG;
  */
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