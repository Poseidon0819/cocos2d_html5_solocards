#!/bin/sh

DIRECTORY_DEFAULT="./frameworks/cocos2d-html5/."
DIRECTORY_BACKUP="./frameworks/cocos2d-html5_backup/"

if [ -d "$DIRECTORY_BACKUP" ]; then
    printf "FAILED! JS Backup Directory exist!" 
    exit 1
fi

printf "\nCopying to $DIRECTORY_BACKUP\n"
mkdir $DIRECTORY_BACKUP
cp -rf $DIRECTORY_DEFAULT $DIRECTORY_BACKUP

