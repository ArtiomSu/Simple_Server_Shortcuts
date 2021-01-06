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


    //speak
    var speak_text_send = document.getElementById("speak_text_send");
    var speak_language = document.getElementById("speak_language");
    var speak_use_slow_button = document.getElementById("speak_use_slow");
    var send_speak_text = document.getElementById("send_speak_text");
    var speak_slow_mode = false;

    var screenshot = document.getElementById("screenshot");
    var screenshot_save = document.getElementById("screenshot_save");
    var img_screenshot = document.getElementById("img_screenshot");
    var screenshot_hide = document.getElementById("screenshot_hide");
    var screenshot_img_div = document.getElementById("screenshot_img_div");
    screenshot_img_div.style.display = 'none';
    var screenshot_img = null;
    var screenshot_hidden = false;


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

    speak_use_slow_button.onclick = function (){
        speak_slow_mode = !speak_slow_mode;
        if(speak_slow_mode){
            speak_use_slow_button.textContent = "Slow Mode";
        }else{
            speak_use_slow_button.textContent = "Normal Mode";
        }
    }

    send_speak_text.onclick = function(){
        if(speak_text_send.value.length >0){
            var data = new FormData();
            data.append('text', speak_text_send.value);
            data.append('language', speak_language.options[speak_language.selectedIndex].value);
            data.append('slow', speak_slow_mode);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', server_url+"speak", true);
            xhr.onload = function () {
                // do something to response
                update_logs(this.responseText)
            };
            xhr.send(data);
        }else{
            update_logs("enter something to say");
        }
        
    }

    screenshot.onclick = function(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            var blb = new Blob([xhr.response], {type: 'image/png'});
            var url = (window.URL || window.webkitURL).createObjectURL(blb);
            img_screenshot.src = url;
            screenshot_img = url;
            screenshot_img_div.style.display = 'block';
            update_logs("got image");
        }
        xhr.open('GET', server_url+"/screenshot");
        xhr.send();
    }

    screenshot_save.onclick = function(){
        if(screenshot_img !== null){
            var win = window.open(screenshot_img, '_blank');
            win.focus();
        }
    }

    screenshot_hide.onclick = function(){
        screenshot_hidden = !screenshot_hidden;
        if(screenshot_hidden){
            screenshot_img_div.style.display = 'none';
            screenshot_hide.textContent = "Show Screenshot";
        }else{
            screenshot_img_div.style.display = 'block';
            screenshot_hide.textContent = "Hide Screenshot";
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