import axios from "axios";
import {ApiUrl} from "src/config/config";
import {reactive} from "vue"

class ChannelService{

  async getAll(){
    return axios.get(ApiUrl+"api/channel");
  }

  async create(name,description){
    return axios.post(ApiUrl+"api/channel",{
      name:name,
      description:description
    });
  }

}



export default new ChannelService();
