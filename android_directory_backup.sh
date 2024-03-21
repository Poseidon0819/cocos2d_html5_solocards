#!/bin/sh

DIRECTORY_DEFAULT="./frameworks/runtime-src/proj.android/."
DIRECTORY_BACKUP="./frameworks/runtime-src/proj.android_backup"

if [ -d "$DIRECTORY_BACKUP" ]; then
    printf "FAILED! Backup Directory exist!" 
    exit 1
fi

printf "\nCopying to $DIRECTORY_BACKUP\n"
mkdir $DIRECTORY_BACKUP
cp -rf $DIRECTORY_DEFAULT $DIRECTORY_BACKUP

./js_directory_backup.sh
./prj_files_backup.sh
./cocos_html5_backup.sh