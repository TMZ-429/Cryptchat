#!/usr/bin/env python3
from tkinter.messagebox import showwarning
import subprocess, sys, os
import tkinter as tk

PROGRAMS = ['/usr/local/bin/cryptchat.d/client.js', '/usr/local/bin/cryptchat.d/messager.js']
TERMINALS = []

window = tk.Tk()
window.geometry("480x700")

window.title("Cryptchat")
label = tk.Label(window, text = "Cryptchat GUI")
label.pack(fill = tk.X)

def create_terminals():
    for i in range(2):
        xterm_frame = tk.Frame(window)
        xterm_frame.pack(fill = tk.BOTH, expand = True)
        xterm_frame_id = xterm_frame.winfo_id()
        TERMINALS.append(xterm_frame)
        try:
            terminal = subprocess.Popen(
                ["xterm", "-into", str(xterm_frame_id), "-geometry", "80x25", PROGRAMS[i]],
                stdin = subprocess.PIPE, stdout = subprocess.PIPE
            )
        except FileNotFoundError:
            tkinter.messagebox.showwarning("Error", "xterm is not installed, please install it")
            sys.exit(1)
    window.mainloop()

def reset():
    for terminal in TERMINALS:
        terminal.destroy()
    create_terminals()

def config():
    os.system("xterm /usr/local/bin/cryptchat.d/cryptchat-options.js")

reset_button = tk.Button(
        window,
        text = "Reset",
        command = reset
)

config_button = tk.Button(
        window,
        text = "Settings",
        command = config
)

config_button.place(x = 395, y = 0)
reset_button.place(x = 0, y = 0)

create_terminals()