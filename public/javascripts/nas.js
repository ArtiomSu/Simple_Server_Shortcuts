window.onload=function (){

    var update_logs = (text) =>{
        logs_div.innerHTML = "<code>"+text+"</code>";
        logs_div.scrollTop = logs_div.scrollHeight;
    }

    var get_top = document.getElementById("get_top");
    var get_disk = document.getElementById("get_disk");
    var get_temp = document.getElementById("get_temp");
    var get_all = document.getElementById("get_all");

    var logs_div = document.getElementById("results");
    var header = document.getElementById("header_name");


    get_top.onclick = function (){
        httpGetAsync("/info/t",(text)=>{
            update_logs(JSON.parse(text).result);
        });
    }
    get_disk.onclick = function (){
        httpGetAsync("/info/d",(text)=>{
            update_logs(JSON.parse(text).result);
        });
    }
    get_temp.onclick = function (){
        httpGetAsync("/info/c",(text)=>{
            update_logs(JSON.parse(text).result);
        });
    }
    get_all.onclick = function (){
        httpGetAsync("/info/a",(text)=>{
            update_logs(JSON.parse(text).result);
        });
    }

    header.onclick = function (){
        window.location.href='/';
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