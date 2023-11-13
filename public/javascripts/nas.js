window.onload=function (){

    var update_logs = (text) =>{
        logs_div.innerHTML = "<code>"+text+"</code>";
        logs_div.scrollTop = logs_div.scrollHeight;
    };

    var get_info = (type) =>{
        if(type){
            last_gotten = type;
        }
        if(last_gotten === null){
            last_gotten = "t";
        }
        let token = getCookie("token");
        httpGetAsyncTokenised("/info/"+last_gotten,token,(text)=>{
            update_logs(JSON.parse(text).result);
            if(loop_duration !== 0){
                setTimeout(get_info,loop_duration*1000);
            }
        });
    };

    var set_system = (type) =>{
        let token = getCookie("token");
        httpGetAsyncTokenised("/system/"+type,token,(text)=>{
            update_logs(JSON.parse(text).result);
        });
    };

    var get_top = document.getElementById("get_top");
    var get_disk = document.getElementById("get_disk");
    var get_temp = document.getElementById("get_temp");
    var get_all = document.getElementById("get_all");

    var logs_div = document.getElementById("results");
    var header = document.getElementById("header_name");

    var loop_one = document.getElementById("loop_one");
    var loop_five = document.getElementById("loop_five");

    var sys_v_status = document.getElementById("sys_v_status");
    var sys_v_up = document.getElementById("sys_v_up");
    var sys_v_down = document.getElementById("sys_v_down");
    var sys_ip = document.getElementById("sys_ip");
    var sys_ip_public = document.getElementById("sys_ip_public");


    var sys_shut = document.getElementById("sys_shut");
    var sys_smb_status = document.getElementById("sys_smb_status");
    var sys_smb = document.getElementById("sys_smb");
    var sys_nfs_status = document.getElementById("sys_nfs_status");
    var sys_nfs = document.getElementById("sys_nfs");

    var loop_duration = 0;
    var last_gotten = null;



    get_top.onclick = function (){
        get_info("t");
    }
    get_disk.onclick = function (){
        get_info("d");
    }
    get_temp.onclick = function (){
        get_info("c");
    }
    get_all.onclick = function (){
        get_info("a");
    }
    sys_v_status.onclick = function (){
        set_system("v_status");
    }
    sys_v_up.onclick = function (){
        set_system("v_connect");
    }
    sys_v_down.onclick = function (){
        set_system("v_disconnect");
    }
    sys_ip.onclick = function (){
        set_system("ip");
    }
    sys_ip_public.onclick = function (){
        set_system("ip_public");
    }
    sys_shut.onclick = function (){
        set_system("shut");
    }
    sys_smb_status.onclick = function (){
        set_system("smb_status");
    }
    sys_smb.onclick = function (){
        set_system("smb");
    }
    sys_nfs_status.onclick = function (){
        set_system("nfs_status");
    }
    sys_nfs.onclick = function (){
        set_system("nfs");
    }

    header.onclick = function (){
        window.location.href='/';
    }

    loop_one.onclick = function (){
        if(loop_duration === 1){
            loop_duration = 0;
            loop_one.style.backgroundColor = "darkred";
        }else{
            loop_duration = 1;
            loop_one.style.backgroundColor = "lawngreen";
            loop_five.style.backgroundColor = "darkred";
        }
        get_info();
    }

    loop_five.onclick = function (){
        if(loop_duration === 5){
            loop_duration = 0;
            loop_five.style.backgroundColor = "darkred";
        }else{
            loop_duration = 5;
            loop_one.style.backgroundColor = "darkred";
            loop_five.style.backgroundColor = "lawngreen";
        }
        get_info()
    }

};




function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function httpGetAsyncTokenised(theUrl,token,callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("Get", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("authorization", "Bearer "+ token);
    xmlHttp.send(null);
}