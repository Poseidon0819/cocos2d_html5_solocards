#!/bin/sh

DIRECTORY_DEFAULT="./frameworks/cocos2d-html5"
DIRECTORY_BACKUP="./frameworks/cocos2d-html5_backup"

if [ ! -d "$DIRECTORY_BACKUP" ]; then
    printf "FAILED! Js Backup Directory absent!" 
    exit 1
fi

printf "Restoring original ./frameworks/cocos2d-html5 dir...\n"
rm -rf $DIRECTORY_DEFAULT
mv $DIRECTORY_BACKUP $DIRECTORY_DEFAULT

