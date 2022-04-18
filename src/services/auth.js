import axios from "axios";
import {ApiUrl} from "src/config/config";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

class AuthService{
  async signUp(username,password){
    return axios
    .post(
      ApiUrl+"auth/signup",
      {
        username : username,
        password : password
      });
  }

  async signIn(username,password){
    let fingerprint = null;
    try{
      let fp = await FingerprintJS.load();
      let result = await fp.get();
      fingerprint=result.visitorId;
    }
    catch (err){
      console.log("Failed to get an fingerprint");
      return;
    }

    return axios.post(
      ApiUrl+"auth/signin",
      {
          username : username,
          password : password,
          fingerprint : fingerprint
    });
  }

  applyTokenToHeaders(){
    let at = this.accessToken();
    if(this.signedIn() && at!==""){
      axios.defaults.headers.common['Authorization'] = `Bearer ${at}`;
    }

  }

  signedIn(){
    try{
      return localStorage.getItem("signedIn")!=="true";
    }
    catch (err){
      return false;
    }
  }

  accessToken(){
    try{
      return localStorage.getItem("accessToken");
    }
    catch (err){
      return "";
    }
  }

}



export default new AuthService();
