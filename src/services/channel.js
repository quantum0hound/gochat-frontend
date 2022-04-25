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
    channelsInfo.channels.clear();
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


export async function searchForChannels(pattern,onError){
  try {
    let res = await axios.post("api/api/channel/search",{"pattern":pattern});
    if(!res.data || !res.data.channels){
      onError("incorrect data is supplied instead of channels");
      return null;
    }
    let channelNames = [];

    res.data.channels.forEach(function(val){
      channelNames.push({
        value: val.name,
        label: val.name,
        id : val.id
      });
    });
    return channelNames;
  }
  catch (err){
    handleAxiosErrors(err,onError);
    return null;
  }
}

export async function createChannel(name,description,onError){
  try {
    let channel = {
      name:name,
      description:description
    }
    let res = await axios.post(ApiUrl+"api/channel",channel);
    if(!res.data || !res.data.channel){
      onError("incorrect data is supplied instead of channel info");
      return false;
    }
    channel = res.data.channel;
    channelsInfo.channels.set(channel.id, channel);
    return true;
  }
  catch (err){
    handleAxiosErrors(err,onError);
    return false;
  }
}

export async function joinChannel(channelId,onError){
  try {

    let res = await axios.get(`/api/api/channel/${channelId}/join`);
    if(!res.data || !res.data.channel){
      onError("incorrect data is supplied for channel");
      return false;
    }
    let channel = res.data.channel;
    channelsInfo.channels.set(channel.id, channel);
    return true;
  }
  catch (err){
    handleAxiosErrors(err,onError);
    return false;
  }
}

export async function leaveChannel(channelId,onError){
  try {
    let res = await axios.get(`/api/api/channel/${channelId}/leave`);
    if(!res.data || res.data.status!=="ok"){
      return false;
    }
    if(channelsInfo.currentChannel && channelsInfo.currentChannel.id===channelId && channelsInfo.channels){
      channelsInfo.currentChannel=null;
    }
    channelsInfo.channels.delete(channelId);

    return true;
  }
  catch (err){
    handleAxiosErrors(err,onError);
    return false;
  }
}

export async function deleteChannel(channelId,onError){
  try {
    let res = await axios.delete(`/api/api/channel/${channelId}`);
    if(!res.data || res.data.status!=="ok"){
      return false;
    }
    if(channelsInfo.currentChannel && channelsInfo.currentChannel.id===channelId){
      channelsInfo.currentChannel=null;
    }
    channelsInfo.channels.delete(channelId);
    return true;
  }
  catch (err){
    handleAxiosErrors(err,onError);
    return false;
  }
}



