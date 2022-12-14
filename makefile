#!/bin/make

CRYPT_DIR = ./crypt-dependencies
CRYPT_DEST = /usr/local/bin/cryptchat.d

#make update is being screwy, probably should change to an install.sh

make:
	mkdir $(CRYPT_DEST)
	chmod +x $(CRYPT_DIR)/cryptchat-options.js
	chmod +x messager.js
	chmod +x client.js
	chmod +x gui.py
	chmod 755 gui.py
	cd /usr/local/bin
	npm i prompt-sync
	npm i net
	npm i play-sound
	npm i node-notifier

make update:
	cp $(CRYPT_DIR)/notification.png $(CRYPT_DEST)/notification.png
	cp $(CRYPT_DIR)/notification.mp3 $(CRYPT_DEST)/notification.mp3
	cp $(CRYPT_DIR)/cryptchat-options.js $(CRYPT_DEST)/cryptchat-options.js
	cp $(CRYPT_DIR)/colours.json $(CRYPT_DEST)/colours.json
	cp $(CRYPT_DIR)/crypt.js $(CRYPT_DEST)/crypt.js
	cp config.json $(CRYPT_DEST)/config.json
	cp client.js $(CRYPT_DEST)/client.js
	cp messager.js $(CRYPT_DEST)/messager.js
	cp gui.py $(CRYPT_DEST)/gui.py
	ln -s $(CRYPT_DEST)/gui.py /usr/local/bin/cryptchat
