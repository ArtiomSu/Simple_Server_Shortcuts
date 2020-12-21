window.onload=function (){

    var update_logs = (text) =>{
        logs_div.innerHTML += "<p>"+text+"</p>";
        logs_div.scrollTop = logs_div.scrollHeight;
    }

    var telegram_bot_restart_buttom = document.getElementById("refresh_telegram_bot");
    var logs_div = document.getElementById("log_results");
    var test_logs_button = document.getElementById("test_logs_button");
    var windowsmain_button = document.getElementById("shutdown_windows_laptop");
    var windows_amd_button = document.getElementById("shutdown_windows_bro");

    telegram_bot_restart_buttom.onclick = function (){
        httpGetAsync("http://10.0.0.69:19876/shutdown",(text)=>{
            update_logs("telegram bot restart: "+text);
        });
    }

    windowsmain_button.onclick = function (){
        httpGetAsync("http://10.0.0.2/shutdown",(text)=>{
            update_logs("Windows Main Turned off:"+text);
        });
        update_logs("Windows Main Turned off");
    }

    windows_amd_button.onclick = function (){
        httpGetAsync("http://10.0.0.11/shutdown",(text)=>{
            update_logs("Windows AMD Turned off:"+text);
        });
        update_logs("Windows AMD Turned off");
    }



    test_logs_button.onclick = function (){
        for(var i = 0; i< 10;i++){
            update_logs("test_logs "+i);
        }
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