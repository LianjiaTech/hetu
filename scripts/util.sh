#!/bin/bash

ConfigFile="./system_config.ini"

function ReadINIfile()  
{   
	Key=$1
	Section=$2
	ReadINI=`awk -F '=' '/\['$Section'\]/{a=1}a==1&&$1~/'$Key'/{gsub(/ /,"",$2);print $2;exit}' $ConfigFile`  
 	echo "$ReadINI"  
}

for key in "ssh_user" "ssh_ip"
do
	val=`ReadINIfile "$key" "ssh"`
	if [ -z "$val" ]; then
		echo "[ssh] $key 配置不存在"
		exit 1
	fi
done

USER=`ReadINIfile "ssh_user" "ssh"`
IP=`ReadINIfile "ssh_ip" "ssh"`

ACCOUNT=$USER"@"$IP

echo "ssh账号为"$ACCOUNT


