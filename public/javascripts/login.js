
window.onload=function (){

    let username = document.getElementById("username");
    let id = document.getElementById("id");
    let password = document.getElementById("password");
    let login_submit = document.getElementById("login_submit");

    var header = document.getElementById("header_name");
    header.onclick = function (){
        window.location.href='/';
    }

    let url = window.location.href;
    let token_rand;
    let token_salt;


    let token = getCookie("token");

    httpGetAsyncTokenised(url, token,  (html)=>{
        if(html.status === 403){
            token_rand = html.getResponseHeader("token_rand");
            token_salt = html.getResponseHeader("token_salt");
        }else{
            document.open();
            document.write(html.responseText);
            document.close();
        }
    });



    login_submit.onclick = function (){
      if(username.value.length > 0 && id.value.length > 0 && password.value.length > 0 ){
          let bcrypt = dcodeIO.bcrypt;

          let hash =  bcrypt.hashSync(id.value.toString()+password.value.toString()+token_rand.toString(),token_salt);
          let body = {
              "username": username.value,
              "hash": hash
          }
          httpPostAsync("/login",body,(text)=>{
              if(text && text.length !== 0){
                  if(text === "\"error\""){
                      header.textContent = "Invalid Login";
                  }else{
                      httpGetAsyncTokenised(url, text,  (html)=>{
                          setCookie("token", text, 0.04);
                          document.open();
                          document.write(html.responseText);
                          document.close();
                      });
                  }
              }
          });
      }
    };

};

function httpPostAsync(theUrl,body, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify(body));
}

function httpPostAsyncTokenised(theUrl,body,token,callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("authorization", 'Bearer '+ token);
    xmlHttp.send(body);
}

function httpGetAsyncTokenised(theUrl,token,callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
    }
    xmlHttp.open("Get", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("authorization", "Bearer "+ token);
    xmlHttp.send(null);
}