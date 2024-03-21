#!/bin/sh

DIRECTORY_DEFAULT="./"
DIRECTORY_BACKUP="./prj_backup/*.html"
DIRECTORY_BACKUP_P="./prj_backup"


if [ ! -d "$DIRECTORY_BACKUP_P" ]; then
    printf "FAILED! prj Backup Directory absent!" 
    exit 1
fi

printf "Restoring original prj dir files...\n"
cp -rf $DIRECTORY_BACKUP $DIRECTORY_DEFAULT
rm -rf $DIRECTORY_BACKUP_P
