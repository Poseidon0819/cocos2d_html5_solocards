#!/bin/sh

DIRECTORY_DEFAULT="./src/."
DIRECTORY_BACKUP="./src_backup"

DIRECTORY_RES_DEFAULT="./res/."
DIRECTORY_RES_BACKUP="./res_backup"

if [ -d "$DIRECTORY_BACKUP" ]; then
    printf "FAILED! JS Backup Directory exist!" 
    exit 1
fi

if [ -d "$DIRECTORY_RES_BACKUP" ]; then
    printf "FAILED! Res Backup Directory exist!" 
    exit 1
fi

printf "\nCopying to $DIRECTORY_BACKUP\n"
mkdir $DIRECTORY_BACKUP
cp -rf $DIRECTORY_DEFAULT $DIRECTORY_BACKUP

printf "\nCopying to $DIRECTORY_RES_BACKUP\n"
mkdir $DIRECTORY_RES_BACKUP
cp -rf $DIRECTORY_RES_DEFAULT $DIRECTORY_RES_BACKUP
