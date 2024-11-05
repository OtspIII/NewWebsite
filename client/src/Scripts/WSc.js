import { useState, useEffect } from "react";
import DB from "./DB.js";

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

function WS(p){
  let {GetMsg} = p;

  DB.WS = WebSockets({socketUrl: (isLocalhost ? "ws://localhost" : "wss://website.url")+':5010'});
  
  useEffect(() => {
    if (DB.WS.data) {
      const { message } = DB.WS.data;
      GetMsg(message);
    }
  }, [DB.WS.data]);

  // send messages
  const sendData = (message) => {
    if (message) {
      DB.WS.send(message);
    }
  };
  return null;
}

function WebSockets({
  socketUrl,
  retry: defaultRetry = 3,
  retryInterval = 1500
}) {
  // message and timestamp
  const [data, setData] = useState();
  // send function
  const [send, setSend] = useState(() => () => undefined);
  // state of our connection
  const [retry, setRetry] = useState(defaultRetry);
  // retry counter
  const [readyState, setReadyState] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(socketUrl);
    ws.onopen = () => {
      console.log('Connected to socket');
      setReadyState(true);

      // function to send messages
      setSend(() => {
        return (data) => {
          try {
            const d = JSON.stringify(data);
            ws.send(d);
            return true;
          } catch (err) {
            return false;
          }
        };
      });

      // receive messages
      ws.onmessage = (event) => {
        const msg = formatMessage(event.data);
        setData({ message: msg, timestamp: getTimestamp() });
      };
    };

    // on close we should update connection state
    // and retry connection
    ws.onclose = () => {
      setReadyState(false);
      // retry logic
      if (retry > 0) {
        setTimeout(() => {
          setRetry((retry) => retry - 1);
        }, retryInterval);
      }
    };
     // terminate connection on unmount
    return () => {
      ws.close();
    };
  // retry dependency here triggers the connection attempt
  }, [retry]); 

  return { send, data, readyState };
}

// small utilities that we need
// handle json messages
function formatMessage(data) {
  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch (err) {
    return data;
  }
};

// get epoch timestamp
function getTimestamp() {
  return new Date().getTime();
}


export default WS;