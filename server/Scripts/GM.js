const God = require('./God.js')

let GM = {
  TestWord:"gazebo",
  ConnectMessage: ()=>{
    return {Text:GM.TestWord};
  },
  HandleWS:(ctx,msg)=>{
    switch(msg.Type){
        case "Connection":{
            GM.SendWS(ctx,{Type:"Introduction",Info:GM.ConnectMessage()});
            break;
        }
        case "Introduction":{
            GM.SendWS(ctx,{Type:"Debug",Text:"Hi :)"});
            break;
        }
        default:{
            console.log("CASELESS WS MESSAGE: " + msg.Type);
            console.log(msg);
            break;
        }
    }
  },
  SendWS:(ctx,msg)=>{
    ctx.send(JSON.stringify(msg));
  }
}

God.GM = GM;

module.exports = GM;