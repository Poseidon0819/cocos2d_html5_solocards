#!/bin/sh

DIRECTORY_JS_DEFAULT="./src"
DIRECTORY_JS_BACKUP="./src_backup"

if [ ! -d "$DIRECTORY_JS_BACKUP" ]; then
    printf "FAILED! Backup Directory absent!\n" 
    exit 1
fi

#todo : copy cocos modified files here

printf "\nCopy aklia api js...\n"

cp -rf ./ExternalGameAPI_Aklia/src/* ./src
