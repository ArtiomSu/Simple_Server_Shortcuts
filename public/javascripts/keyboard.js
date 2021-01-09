window.onload=function (){

    var update_logs = (text) =>{
        logs_div.innerHTML = "<code>"+text+"</code>";
        logs_div.scrollTop = logs_div.scrollHeight;
    };

    var logs_div = document.getElementById("results");
    var header = document.getElementById("header_name");

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