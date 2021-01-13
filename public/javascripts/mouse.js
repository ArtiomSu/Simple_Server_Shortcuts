

window.onload=function (){

    var update_logs = (text) =>{
        logs_div.innerHTML = "<code>"+text+"</code>";
        logs_div.scrollTop = logs_div.scrollHeight;
    };

    var logs_div = document.getElementById("results");
    var header = document.getElementById("header_name");

    var left_clicks = document.getElementById("left_clicks");
    var right_clicks = document.getElementById("right_clicks");
    var middle_clicks = document.getElementById("middle_clicks");

    var left_clicks_cps = document.getElementById("left_clicks_cps");
    var right_clicks_cps = document.getElementById("right_clicks_cps");
    var middle_clicks_cps = document.getElementById("middle_clicks_cps");

    var key_clicks = document.getElementById("key_clicks");
    var key_clicks_cps = document.getElementById("key_clicks_cps");


    var total_left_clicks = 0;
    var total_right_clicks = 0;
    var total_middle_clicks = 0;

    var total_keys_per_second = 0;



    header.onclick = function (){
        window.location.href='/';
    }

    window.oncontextmenu = function ()
    {
        return false;
    }

    document.body.onmousedown = function (e) {
        e = e || window.event;
        if ("button" in e){  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            if(e.button === 2){ //right mouse
                total_right_clicks++;
                right_clicks.innerText = total_right_clicks;
            }
            if(e.button === 0){ //left mouse
                total_left_clicks++;
                left_clicks.innerText = total_left_clicks;
            }
            if(e.button === 1){ //middle mouse
                total_middle_clicks++;
                middle_clicks.innerText = total_middle_clicks;
            }
        }
    }

    document.body.onkeydown = function (e) {
        e = e || window.event;
        if ("key" in e){  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            total_keys_per_second++;
            key_clicks.innerText = total_keys_per_second;
        }
    }

    var timeStart = new Date().getTime();

    function calcClicksps(){
        var timeNow = new Date().getTime();
        var milliSecondsPassed = timeNow - timeStart;

        left_clicks_cps.innerText = ""+ (total_left_clicks/(milliSecondsPassed/1000)).toFixed(4) + " Clicks Per Second";
        right_clicks_cps.innerText = ""+ (total_right_clicks/(milliSecondsPassed/1000)).toFixed(4) + " Clicks Per Second";
        middle_clicks_cps.innerText = ""+ (total_middle_clicks/(milliSecondsPassed/1000)).toFixed(4) + " Clicks Per Second";
        key_clicks_cps.innerText = ""+ (total_keys_per_second/(milliSecondsPassed/1000)).toFixed(4) + " Keys Per Second";
    }



    setInterval(function(){
        calcClicksps();
    }, 250)



};
