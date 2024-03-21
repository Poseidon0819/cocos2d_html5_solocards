#!/bin/sh

DIRECTORY_DEFAULT="./src"
DIRECTORY_BACKUP="./src_backup"

DIRECTORY_RES_DEFAULT="./res"
DIRECTORY_RES_BACKUP="./res_backup"

if [ ! -d "$DIRECTORY_BACKUP" ]; then
    printf "FAILED! Js Backup Directory absent!" 
    exit 1
fi

if [ ! -d "$DIRECTORY_RES_BACKUP" ]; then
    printf "FAILED! Res Backup Directory absent!" 
    exit 1
fi

printf "Restoring original Js dir...\n"
rm -rf $DIRECTORY_DEFAULT
mv $DIRECTORY_BACKUP $DIRECTORY_DEFAULT

printf "Restoring original Resouces dir...\n"
rm -rf $DIRECTORY_RES_DEFAULT
mv $DIRECTORY_RES_BACKUP $DIRECTORY_RES_DEFAULT