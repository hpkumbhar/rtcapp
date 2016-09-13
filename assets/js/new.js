"use strict";

var peerCon;
var ch;
var anothername;
var anothernametime;
var myid=Math.floor(Math.random()*10000);
window.onload=function(){
   init()

   document.getElementById('idname').value=myid;
     document.getElementById('yourname').innerHTML=myid;
     document.getElementById('mytime').innerHTML= new Date().toLocaleString();

      document.getElementById("localbtn").addEventListener("click", function(){
        offerCreate();
        console.log("localbtn clicked")
      document.getElementById("localbtn").setAttribute("disabled",true);
      });

 document.getElementById("remotebtn2").addEventListener("click",function(){
   ans(new RTCSessionDescription(JSON.parse(document.getElementById("remote").value)));
   document.getElementById("remotebtn2").setAttribute("disabled",true);
 });
 document.getElementById("msgbtn").addEventListener("click",function(){
       msgSend(document.getElementById("msg").value);
       document.getElementById('msg').value="";
     document.getElementById("onmsg").scrollTop=document.getElementById("onmsg").scrollHeight;
 });
 }


function init()
{
    //offer------
    peerCon =
        new RTCPeerConnection(
        {
            "iceServers": [
            {
                "url": "stun:stun.l.google.com:19302"
            }]
        },
        {
            "optional": []
        });

    var localDescriptionOut = function()
    {
        console.log(JSON.stringify(peerCon.localDescription));
    //    $("#local").text(JSON.stringify(peerCon.localDescription));
        document.getElementById("local").value=JSON.stringify(peerCon.localDescription);

    };

  peerCon.ondatachannel = function (event) {
        ch = event.channel;
          ch.send("id is:"+ document.getElementById('idname').value)
    };

    peerCon.onicecandidate = function(e)
    {
        console.log(e);

        if (e.candidate === null)
        {
            console.log("candidate empty!");
            localDescriptionOut();
        }
    };

    ch = peerCon.createDataChannel(
        "ch1",
        {
            reliable: false
        });
  ch.onopen = function()
    {
    addMsg("Hey You Are connected with another peer , Lets  Chat!");
  document.getElementById('dialog').style.display = 'none';
  document.getElementById('container').style.display = 'block';
    };

  ch.onmessage = function(e)
    {
          if(e.data.includes("id is:") )
          {
            anothername=e.data;
            console.log(anothername);
            anothernametime=new Date().toLocaleString();
              anothername=anothername.substr(anothername.indexOf(":") + 1);

          }
          else {
            addOnReciveMsg(e.data);
      document.getElementById("onmsg").scrollTop=document.getElementById("onmsg").scrollHeight;
          }

    };

    ch.onclose = function(e)
    {
      addMsg("Connection Closed!");
    };
    ch.onerror = function(e)
    {
        addMsg("Something Went Wrong");
    };

};


function msgSend(msg)
{
  if(document.getElementById('msg').value!=''){
    ch.send(" "+msg)
    console.log(msg)
          addMsg(" "+msg);
      }
    else{
        console.log("msg is empty")
    }

}

function offerCreate(){

      peerCon
          .createOffer(function(description)
          {
              peerCon
                  .setLocalDescription(description, function()
                  {
                      //wait for complete of peerCon.onicecandidate
                  }, error);
          }, error);
}

function answerCreate(descreption){
  peerCon.setRemoteDescription(descreption, function()
      {
          peerCon.createAnswer(function(description)
                  {
                      peerCon.setLocalDescription(description, function()
                          {
                              //wait for complete of peerCon.onicecandidate
                          }, error);
                  }, error);
      }, error);

}

function answerGet(description){
  peerCon.setRemoteDescription(description, function()
  {
      console.log(JSON.stringify(description));
    addMsg("local-remote-setDescriptions complete!")
  }, error);
}

function error(error){
  console.error(error());
}



setInterval(function(){
  if(anothername!=null)
  {
    document.getElementById('othername').innerHTML=anothername;
    document.getElementById('othertime').innerHTML=anothernametime;
  }
}, 1000);

function ans(descreption){

  if(document.getElementById('local').value!=''){
    peerCon.setRemoteDescription(descreption, function()
    {
        console.log(JSON.stringify(descreption));
      addMsg("local & remote Descriptions completed!");

    }, error);

  }else {
    peerCon.setRemoteDescription(descreption, function()
        {
            peerCon.createAnswer(function(descreption)
                    {
                        peerCon.setLocalDescription(descreption, function()
                            {
                                //wait for complete of peerCon.onicecandidate
                            }, error);
                    }, error);
        }, error);

    }

}

function addMsg(txt) {
    var div = document.createElement('ul');
  div.className = 'media-list';
div.innerHTML ='<li class="media"><div class="media-body"><div class="media"><a class="pull-left"> <img height="64px" width="64px" class="media-object img-circle" src="assets/img/user.png" /></a>\
 <div class="media-body" style="word-wrap: break-word" rows="6" >'
 + txt +'<br><br>\
 <small class="text-muted">'+myid+ ' | '
  +new Date().toDateString() + ' ' + new Date().toLocaleTimeString() +'</small>  <hr /> \
  </div></div>  </div></li></ul>';
     document.getElementById('onmsg').appendChild(div);
}

function addOnReciveMsg(txt){
  var div = document.createElement('ul');
div.className = 'media-list';
div.innerHTML ='<li class="media"><div class="media-body"><div class="media"><a class="pull-left"> <img height="64px" width="64px" class="media-object img-circle" src="assets/img/user.png" /></a>\
<div class="media-body" style="word-wrap: break-word" rows="6" >'
+ txt +'<br><br>\
<small class="text-muted">'+anothername+ ' | '
+new Date().toDateString() + ' ' + new Date().toLocaleTimeString() +'</small>  <hr /> \
</div></div>  </div></li></ul>';
   document.getElementById('onmsg').appendChild(div);

}
