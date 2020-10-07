#!/usr/bin/env bash
temps(){
    echo "CPU $(lscpu | grep "CPU MHz:" | sed "s/[ \t]*//g" | sed "s/CPUMHz://g") Mhz "
    sensors | grep °C | cut -f1 -d"("
    echo "-----------------------------------"
    nvidia-smi --query-gpu=name --format=csv,noheader | tr -d '\n'
    printf " Ver. "
    nvidia-smi --query-gpu=driver_version --format=csv,noheader
    printf "Core "
    nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader | tr -d '\n'
    printf "°C\nVRAM "
    nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits | tr -d '\n'
    printf "/"
    nvidia-smi --query-gpu=memory.total --format=csv,noheader

    nvidia-smi --query-gpu=clocks.video --format=csv,noheader | tr -d '\n'
    printf " "
    nvidia-smi --query-gpu=clocks.mem --format=csv,noheader

    nvidia-smi --query-gpu=power.draw --format=csv,noheader
}



if [[ "$1" == "-c" ]];then
temps
elif [[ "$1" == "-t" ]]; then
top -b -n 1 | head -n 50
elif [[ "$1" == "-d" ]]; then
df -h
else
temps
echo -e "\n\n"
top -b -n 1 | head -n 50
echo -e "\n\n"
df -h
fi