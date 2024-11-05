
import God from "./God.js";

var DB = {
  Addr(addr){
    return isLocalhost ? 'http://localhost:5010/' + addr : 'https://website.url:5010/' + addr;
  },
  SendGet(type,payload,backup,expectJSON){
    let add = DB.Addr(type);
    fetch(add, {credentials: "include",headers: {"Content-Type": "application/json","Access-Control-Allow-Credentials": true}})
      .then(r => {
        if (!r || r.status != 200){
          if (backup) backup(r);
        }
        else if (expectJSON != false){
          return r.json();
        }
      })  
      .then((r)=>{
        console.log(r)
        if (payload) payload(r);
      })
  },
  SendPost(type,msg,payload,backup){
    let add = DB.Addr(type);
    msg = JSON.stringify(msg);
    fetch(add, {credentials: "include",headers: {"Content-Type": "application/json","Access-Control-Allow-Credentials": true},method: 'post',body: msg})
      .then(r => {
        if (!r || r.status != 200){
          if (backup) backup(r);
        }
        else
          return r.json();
      })  
      .then((r)=>{
        if (payload) payload(r);
      })
  },

  //Websocket Stuff
  WS: null,
  SendWS(msg){
    if (!msg) return;
    DB.WS.send(msg);
  },
  
}

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

God.IsLocal = isLocalhost;
God.DB = DB;

export default DB;