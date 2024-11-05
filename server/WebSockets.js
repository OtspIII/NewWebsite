const WebSocket = require("ws");
const God = require("./Scripts/God");

var WS = {
  S:null,
  Setup(server) {
    WS.S = new WebSocket.Server({ noServer: true });
    // handle upgrade of the request
    server.on("upgrade", function upgrade(request, socket, head) {
      try {
        // authentication and some other steps will come here
        // we can choose whether to upgrade or not

        WS.S.handleUpgrade(request, socket, head, function done(ws) {
          WS.S.emit("connection", ws, request);
        });
      } catch (err) {
        console.log("upgrade exception", err);
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return; 
      }
    });

    // what to do after a connection is established
    WS.S.on("connection", (ctx) => {
      // print number of active connections
      // console.log("connected", WS.S.clients.size); 
      God.GM.HandleWS(ctx,{Type:"Connection",Who:ctx})
      ctx.isAlive = true;
      // const interval = WS.individualPipeline(ctx);

      // handle message events
      // receive a message and echo it back
      ctx.on("message", (message) => {
        WS.HandleMessage(ctx,message);
      });

      // handle close event
      ctx.on("close", () => {
        ctx.isAlive = false;
        // console.log("closed", WS.S.clients.size);
        
      });
    });
  },
  TryParseJSON (jsonString){
      try {
          var o = JSON.parse(jsonString);
          if (o && typeof o === "object") {
              return o;
          }
      }
      catch (e) { }

      return false;
  },
  HandleMessage(ctx,msg){
    msg = WS.TryParseJSON(msg); 
    if (!msg)
      return;
    God.GM.HandleWS(ctx,msg);
  },
  Broadcast(msg){
    if (!WS.S)
      return;
    msg.Connections = WS.S.clients.size;
    msg = JSON.stringify(msg);
    for (let c of WS.S.clients.values()) {
      c.send(msg);
    }
  }
}

module.exports = WS;