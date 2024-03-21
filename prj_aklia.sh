#!/bin/sh

DIRECTORY_BACKUP_P="./prj_backup"

if [ ! -d "$DIRECTORY_BACKUP_P" ]; then
    printf "FAILED! prj Backup Directory absent!" 
    exit 1
fi

printf "prj aklia files...\n"

cp -rf ./ExternalGameAPI_Aklia/index.html ./index.html
