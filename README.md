Cryptchat, By SD

CryptChat is an optionally end-to-end encrypted chatting app meant for secure conversations between multiple parties.
Features:
Chatting completely secure (even if someone taps you they'll see complete garbage text).

CONFIGURATION:
All the configuration is in the attached config.json file.
There you can configure your username, your text colour/background text colour and if you log messages or not (You'll have to change what directory the logs are sent to).
*Setting it as null or blank will equate to white foreground text & no background*
Here's a list of all the avaliable colours (this applies to both background and text):
Black
Red
Green
Yellow
Blue
Magenta
Cyan
White

If you ever want to update the configuration, just update the config.json file and use `sudo make update`

INSTALLATION:
```
sudo make
sudo make update
```

USAGE:
Use the following terminal command:
`cryptchat`
