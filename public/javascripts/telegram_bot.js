window.onload=function (){
    var server_url = "http://10.0.0.69:19876/";

    var update_logs = (text) =>{
        logs_div.innerHTML += "<code>"+text+"</code>";
        logs_div.scrollTop = logs_div.scrollHeight;
    };

    var telegram_bot_restart_buttom = document.getElementById("refresh_telegram_bot");

    var message_text = document.getElementById("message_text");
    var channel = document.getElementById("channel");
    var send_message = document.getElementById("send_message");

    var logs_div = document.getElementById("results");
    var header = document.getElementById("header_name");

    telegram_bot_restart_buttom.onclick = function (){
        httpGetAsync(server_url+"shutdown",(text)=>{
            update_logs("telegram bot restart: "+text);
        });
    }

    send_message.onclick = function(){
        if(message_text.value.length >0){
            var xhr = new XMLHttpRequest();
            xhr.open('POST', server_url+"send", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // Print received data from server
                    update_logs(this.responseText)
                }
            };
            var data = JSON.stringify({
                "text": message_text.value,
                "channel": channel.options[channel.selectedIndex].value
            });
            xhr.send(data);
        }else{
            update_logs("enter something to send");
        }
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