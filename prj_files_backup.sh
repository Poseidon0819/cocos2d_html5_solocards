#!/bin/sh

DIRECTORY_DEFAULT="./*.html"
DIRECTORY_BACKUP="./prj_backup"

if [ -d "$DIRECTORY_BACKUP" ]; then
    printf "FAILED! Prj Backup Directory exist!" 
    exit 1
fi

printf "\nCopying to $DIRECTORY_BACKUP\n"
mkdir $DIRECTORY_BACKUP
cp -rf $DIRECTORY_DEFAULT $DIRECTORY_BACKUP

