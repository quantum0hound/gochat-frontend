import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {handleAxiosErrors} from "src/services/axios_error_handler";


class AuthService{

  parseJwt (token) {
    try{
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''));
      return JSON.parse(jsonPayload);
    }
    catch (err){
      console.error(`Failed to parse JWT token : ${err}`);
      return null;
    }

  };

  async signUp(username,password, onError){
    try {
      let res = await axios
        .post(
          "api/auth/signup",
          {
            username: username,
            password: password
          });
      return true;
    }
    catch (err){
      handleAxiosErrors(err,onError);
      return false;
    }
  }

  async signIn(username,password, onError){
    let fingerprint = null;
    try{
      let fp = await FingerprintJS.load();
      let result = await fp.get();
      fingerprint=result.visitorId;
    }
    catch (err){
      onError("Failed to get an fingerprint");
      return false;
    }
    try{
      let res = await axios.post(
        "/api/auth/signin",
        {
          username : username,
          password : password,
          fingerprint : fingerprint
        });
      if(!res.data || !res.data.accessToken){
        onError("Incorrect response format, missing access token!");
        return false;
      }
      let tokenData = this.parseJwt(res.data.accessToken);
      if(!tokenData){
        return false;
      }

      localStorage.setItem("accessToken",res.data.accessToken);
      localStorage.setItem("username",tokenData.username);
      localStorage.setItem("userId",tokenData.user_id);
    }
    catch (err){
     handleAxiosErrors(err,onError);
     return false;
    }
    return true;
  }

  signOut(){
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  }

  applyTokenToHeaders(){
    let at = this.accessToken();
    if(this.signedIn() && at!==""){
      axios.defaults.headers.common['Authorization'] = `Bearer ${at}`;
    }

  }

  signedIn(){
    try{
      return localStorage.getItem("username");
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

  userId(){
    try{
      return Number(localStorage.getItem("userId"));
    }
    catch (err){
      return 0;
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
