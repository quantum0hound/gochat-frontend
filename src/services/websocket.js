import {WsUrl} from "src/config/config"
export class WebsocketService{

  connectToChannel(channelId, onMessageReceived) {
    let ws = new WebSocket(`${WsUrl}api/channel/${channelId}/join`);
    ws.onopen = function() {
      console.log(`Connected to channel: ${channelId}`);
    };

    ws.onclose = function(event) {
      if (event.wasClean) {
        console.log('Connection closed in a clean way');
      } else {
        console.error('Connection rejected'); // например, "убит" процесс сервера
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };

    ws.onmessage = onMessageReceived;

    ws.onerror = function(error) {
      console.error("Error " + error.message);
    };
    this.ws = ws;
  }

  sendMessage(message){
   this.ws.send(message);
  }
}

export default new WebsocketService();

