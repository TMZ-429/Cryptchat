#!/usr/bin/env node
const config = require ('/usr/local/bin/cryptchat.d/config.json');
const prompt = require('prompt-sync')({sigint: true});
const fs = require('fs');

const optionsA = [
    "username",
    "textColour",
    "backgroundTextColour",
    "logMessages",
    "logs",
    "militaryTime",
    "allowNotifications",
    "notificationSounds"
];

console.log("Leave values blank to keep them the same.\nClose terminal to not save changes.\n")

var changer = config;

for (var option of optionsA) {
    if (option == "allowNotifications") {
        changer = config.notifications;
    }
    console.log(`${option} : ${changer[option]}`);
    let change = prompt("Enter new value -> ").trim();
    if (change) {
        changer[option] = change;
    }
}

fs.truncate('./config.json', 0, ((error) => {
    if (error) {
        setTimeout(() => {
            console.log("Could not save changes, exiting");
        }, 1000);
        process.exit(1);
    }
    fs.appendFileSync('./config.json', JSON.stringify(config));
}));