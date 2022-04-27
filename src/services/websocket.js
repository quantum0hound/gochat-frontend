import {WsUrl} from "src/config/config"
import AuthService from "/src/services/auth"
import {nowTs} from "/src/utils/utils"
export class WebsocketService{
  socket=null;

  connect(onMessageReceived) {
    let ws = new WebSocket(`${WsUrl}api/connect`);
    ws.onopen = function() {
      console.log(`Connected to server by websocket`);
      ws.send(JSON.stringify({accessToken: AuthService.accessToken}));
    };

    ws.onclose = function(event) {
      if (event.wasClean) {
        console.log('Connection closed in a clean way');
      } else {
        console.error('Connection rejected');
      }
      console.log('Code: ' + event.code + ' reason: ' + event.reason);
    };

    ws.onmessage = onMessageReceived;

    ws.onerror = function(error) {
      console.error("Error " + error.message);
    };
    this.socket = ws;
  }

  sendMessage(channelId,content){

    let data = JSON.stringify({
      content : content,
      channelId : channelId,
      userId : AuthService.userId,
      posted : nowTs()
    });
   this.socket.send(data);
  }
}

export default new WebsocketService();

