import axios from "axios";
import {ApiUrl} from "src/config/config";
import {reactive} from "vue"
import {handleAxiosErrors} from "src/services/axios_error_handler";

class ChannelService{

  async getAll(onError){

    try {
      let res = await axios.get(ApiUrl+"api/channel");
      if(!res.data && !res.data.channels){
        onError("incorrect data is supplied instead of channels");
        return null;
      }
      return res.data.channels;
    }
    catch (err){
      handleAxiosErrors(err,onError);
      return null;
    }
  }

  async create(name,description){
    return axios.post(ApiUrl+"api/channel",{
      name:name,
      description:description
    });
  }

}



export default new ChannelService();
