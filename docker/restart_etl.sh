#!/bin/bash
BIN_ETL_ID=$(screen -ls | grep bin_etl | cut -d. -f1 | awk '{print $1}'); kill "$BIN_ETL_ID"; screen -dmS bin_etl sh -c 'cd /home; yarn start:binetl'
