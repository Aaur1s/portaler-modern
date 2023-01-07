#!/bin/bash
DISCORD_BOT_ID=$(screen -ls | grep discord_bot | cut -d. -f1 | awk '{print $1}'); kill "$DISCORD_BOT_ID"
