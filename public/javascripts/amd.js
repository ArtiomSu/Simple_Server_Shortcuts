window.onload=function (){

    var server_url = "http://10.0.0.11/";

    var update_logs = (text) =>{
        logs_div.innerHTML += "<code>"+text+"</code>";
        logs_div.scrollTop = logs_div.scrollHeight;
    };

    var get_info = (type) =>{
        httpGetAsync(server_url+type,(text)=>{
            update_logs(text);
        });
    };

    var send_text_func = (enter,use_input) =>{
            var data = new FormData();
            if(use_input){
                data.append('text', text_input_send.value);
            }else{
                data.append('text', "");
            }
            
            data.append('use_enter', enter);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', server_url+"text", true);
            xhr.onload = function () {
                // do something to response
                update_logs(this.responseText)
            };
            xhr.send(data);
    }

    var up = document.getElementById("up");
    var shutdown = document.getElementById("shutdown");
    var restart = document.getElementById("restart");
    var altfour = document.getElementById("altfour");
    var movemouse = document.getElementById("movemouse");
    var mousespaz = document.getElementById("mousespaz");
    var spamerror = document.getElementById("spamerror");


    var title_input = document.getElementById("title_input");
    var title_message = document.getElementById("title_message");
    var send_error = document.getElementById("send_error");

    var text_input_send = document.getElementById("text_input_send");
    var send_text = document.getElementById("send_text");
    var send_text_enter = document.getElementById("send_text_enter");

    var press_enter = document.getElementById("press_enter");



    var logs_div = document.getElementById("results");
    var header = document.getElementById("header_name");



    up.onclick = function (){
        get_info("");
    }
    movemouse.onclick = function (){
        get_info("move_mouse");
    }
    altfour.onclick = function (){
        get_info("alt_f4");
    }
    shutdown.onclick = function (){
        get_info("shutdown");
    }
    mousespaz.onclick = function (){
        get_info("mouse_spaz");
    }
    spamerror.onclick = function (){
        get_info("showerror_spam");
    }
    restart.onclick = function (){
        get_info("restart");
    }

    send_text.onclick = function (){
        send_text_func(false,true);
    }

    send_text_enter.onclick = function (){
        send_text_func(true,true);
    }

    press_enter.onclick = function () {
        send_text_func(true,false)
    }

    send_error.onclick = function (){
        if(title_input.value.length >0 && title_message.value.length >0){
            var data = new FormData();
            data.append('title', title_input.value);
            data.append('message', title_message.value);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', server_url+"showerror", true);
            xhr.onload = function () {
                // do something to response
                update_logs(this.responseText)
            };
            xhr.send(data);
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