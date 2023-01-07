#!/bin/bash
trap './kill_bot.sh && ./kill_api.sh && ./kill_etl.sh; screen -wipe && exit 0' SIGTERM
screen -wipe
sudo service redis-server restart
sudo npm install --global yarn
screen -L -Logfile discord_bot.log -dmS discord_bot sh -c 'cd /home; yarn start:bot'
screen -L -Logfile api_server.log -dmS api_server sh -c 'cd /home; yarn start:api'
screen -L -Logfile bin_etl.log -dmS bin_etl sh -c 'cd /home; yarn start:binetl'
sleep 5
./restart_etl.sh
sleep 5
./restart_api.sh
sleep infinity
