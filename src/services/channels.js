import axios from "axios";
import {ApiUrl} from "src/config/config";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {accessToken} from "src/store/auth/getters";

class ChannelsService{
  async getAll(){
    return await axios.get(ApiUrl+"api/channels");
  }

}



export default new ChannelsService();
