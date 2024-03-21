#!/bin/sh

DIRECTORY_DEFAULT="./frameworks/cocos2d-html5"
DIRECTORY_BACKUP="./frameworks/cocos2d-html5_backup"

if [ ! -d "$DIRECTORY_BACKUP" ]; then
    printf "FAILED! Js Backup Directory absent!" 
    exit 1
fi

printf "Cocos aklia patch ...\n"
cp -rf ./ExternalGameAPI_Aklia/frameworks/cocos2d-html5/* ./frameworks/cocos2d-html5/

