import React from 'react';
import God from "./God.js";
import DB from "./DB.js";
import WS from "./WSc.js";

class MainScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        TestWord:""
    };
    this.Set = this.Set.bind(this);
    this.HandleEvent = this.HandleEvent.bind(this);
    God.MS = this;
  }

  Set(p,v){
    let upd = {};
    upd[p] = v;
    this.setState(upd);
  }

  componentDidMount(){    
    God.DB.SendGet("TestWord",(r)=>{this.Set("TestWord",r.Text)});
  }

  HandleEvent(m){
    switch(m.Type){
      case "Introduction":{
        //Any logic needed upon connection goes here
        DB.SendWS({Type:"Introduction",Text:"Hi"})
        break;
      }
      case "Debug":{
        console.log(m)
        break;
      }
      default:{
        console.log("v UNHANDLED EVENT v");
        console.log(m);
        break;
      }
    }
  }

  render() {
    
    return <div className="MainScreen">
      hi: {this.state.TestWord}
      <WS GetMsg={m=>{this.HandleEvent(m)}}/>
    </div>;
  }
}

export default MainScreen;