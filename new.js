"use strict";

var peerCon;
var ch;
var anothername;
window.onload=function(){
   init()

   document.getElementById('idname').value=Math.floor(Math.random()*10000);

      document.getElementById("localbtn").addEventListener("click", function(){
        offerCreate();
        console.log("localbtn clicked")
     // document.getElementById("localbtn").setAttribute("disabled",true);
       // document.getElementById("remotebtn").setAttribute("disabled",true);
       //  document.getElementById("remotebtn2").removeAttribute("disabled",true);
        //document.getElementById("remotebtn2").setAttribute("disabled",true);
      });

 document.getElementById("remotebtn").addEventListener("click",function(){
   answerCreate(new RTCSessionDescription(JSON.parse(document.getElementById("remote").value)));
 //  document.getElementById("localbtn").setAttribute("disabled",true);
    // document.getElementById("remotebtn").setAttribute("disabled",true);
    //   document.getElementById("remotebtn2").setAttribute("disabled",true);
 });

 document.getElementById("remotebtn2").addEventListener("click",function(){
   answerGet(new RTCSessionDescription(JSON.parse(document.getElementById("remote").value)));
 //  document.getElementById("remotebtn2").setAttribute("disabled",true);
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
        $("#local").text(JSON.stringify(peerCon.localDescription));
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

    document.getElementById("onmsg").textContent+="Hey You Are connected with another peer , Lets  Chat!\n"

    };

  ch.onmessage = function(e)
    {
          if(e.data.includes("id is:") )
          {
            anothername=e.data;
            console.log(anothername);
          }else {

      document.getElementById("onmsg").textContent+=e.data+"\n";
      document.getElementById("onmsg").scrollTop=document.getElementById("onmsg").scrollHeight;


          }

    };

    ch.onclose = function(e)
    {
      document.getElementById("onmsg").textContent+="Connection Closed!\n"
    };
    ch.onerror = function(e)
    {
          document.getElementById("onmsg").textContent+="Something Went Wrong\n"
    };

};  ///inti function


function msgSend(msg)
{
    ch.send(document.getElementById('idname').value+" "+msg);
    console.log(msg)
    document.getElementById('onmsg').textContent +=document.getElementById('idname').value+" "+msg+ "\n";

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
  { //
      console.log(JSON.stringify(description));
      document.getElementById("onmsg").textContent+="local-remote-setDescriptions complete!\n";
  }, error);
}

function error(error){
  console.error(error());
}



setInterval(function(){
  if(anothername!=null)
  {

    document.getElementById('othername').value=anothername.substr(anothername.indexOf(":") + 1);;
  }
}, 2000);
