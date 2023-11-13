#include <unistd.h>
#include <string.h>
#include <stdio.h>

/*
Note for these functions, the last arguement is a pointer to the environment. here I use NULL so that no environment is used.
*/

int main(int argc, char *argv[]){
	char* command = argv[1];
	setuid(0);
    setgid(0);
	if(strcmp(command, "smb_status") == 0){
		execle("/usr/bin/systemctl","systemctl","status","smbd.service",(char*) NULL, (char*) NULL);
	}else if(strcmp(command, "smb_restart") == 0){
		execle("/usr/bin/systemctl","systemctl","restart","smbd.service",(char*) NULL, (char*) NULL);
	}else if(strcmp(command, "nfs_status") == 0){
		execle("/usr/bin/systemctl","systemctl","status","nfs-server.service",(char*) NULL, (char*) NULL);
		//execle("/usr/bin/ping","/usr/bin/ping","-c","1","10.0.0.1",(char*) NULL);
	}else if(strcmp(command, "nfs_restart") == 0){
		execle("/usr/bin/systemctl","systemctl","restart","nfs-server.service",(char*) NULL, (char*) NULL);
	}else if(strcmp(command, "shut") == 0){
		execle("/usr/bin/shutdown","shutdown","now",(char*) NULL,(char*) NULL);
	}else{
		printf("Invalid command\n");
	}
}

/*
gcc sys_actions.c -o sys_actions
doas chown root:root sys_actions
doas chmod u+s sys_actions
doas chmod o+x sys_actions
*/