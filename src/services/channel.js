import axios from "axios";
import {ApiUrl} from "src/config/config";
import {reactive} from "vue"
import {handleAxiosErrors} from "src/services/axios_error_handler";


export const channelsInfo = reactive({
  currentChannel: null,
  channels : new Map()
});

export async function getUserChannels(onError){
  try {
    let res = await axios.get(ApiUrl+"api/channel");
    if(!res.data && !res.data.channels){
      onError("incorrect data is supplied instead of channels");
      return false;
    }
    let channels = res.data.channels;

    if(channels.length>0){
      channels.forEach(function (item){
        channelsInfo.channels.set(item.id,item);
      });
      channelsInfo.currentChannel = channels[0];
    }


  }
  catch (err){
    handleAxiosErrors(err,onError);
    return false;
  }
  return true;
}


export async function createChannel(name,description,onError){

  try {
    let channel = {
      name:name,
      description:description
    }
    let res = await axios.post(ApiUrl+"api/channel",channel);
    if(!res.data && !res.data.id){
      onError("incorrect data is supplied channel id");
      return false;
    }
    channel.id = res.data.id;
    channelsInfo.channels.set(channel.id, channel);
    return true;
  }
  catch (err){
    handleAxiosErrors(err,onError);
    return false;
  }
}



