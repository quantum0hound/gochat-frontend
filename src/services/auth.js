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

  signOut(){
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.setItem("loggedIn","false");
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

  username(){
    try{
      return localStorage.getItem("username");
    }
    catch (err){
      return "";
    }
  }

  nameFormatRules(len){
    if(!len || len<=0){
      len = 1;
    }
    return [
      val => (val && val.length > len) || `Password should have at least ${len} symbols length`,
      val => (val.match(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)!=null) || "Incorrect format"
    ]
  }
}



export default new AuthService();
