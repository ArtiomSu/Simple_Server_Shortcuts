#include <unistd.h>
//#include <stdlib.h>
#include <string.h>
#include <stdio.h>

int main(int argc, char *argv[]){
//	setuid(0);
	char start[] = "/dev/sd";

	strcat(start,argv[1]);
	//system("whoami");
	//execle("/usr/bin/whoami","/usr/bin/whoami",(char*) NULL,(char*) NULL);
	//system("for i in /dev/sd[a-z]; do hddtemp \"$i\"; done");
	execle("/usr/sbin/hddtemp","/usr/sbin/hddtemp",start,(char*) NULL,(char*) NULL);
}

/*
gcc hdd_temperature.c -o hdd_temperature
doas chown root:root hdd_temperature
doas chmod u+s hdd_temperature
doas chmod o+x hdd_temperature
*/