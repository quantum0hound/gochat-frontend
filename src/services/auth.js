import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {handleAxiosErrors} from "src/services/axios_error_handler";
import {ref} from "vue"

class AuthService{

  accessToken="";
  username= ref("");
  userId=0;
  expiresAt=0;

  async signUp(username,password, onError){
    try {
      await axios
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
      if(!this.processJWT(res.data.accessToken)){
        onError("Unable to process access token!");
        return false;
      }
      this.applyTokenToHeaders();

    }
    catch (err){
     handleAxiosErrors(err,onError);
     return false;
    }
    return true;
  }

  signOut(){
    this.accessToken="";
    this.userId=0;
    this.username.value="";
    this.expiresAt=0;
  }

  async refresh(onError){
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
        "/api/auth/refresh",
        {
          fingerprint : fingerprint
        });
      if(!res.data || !res.data.accessToken){
        onError("Incorrect response format, missing access token!");
        return false;
      }
      if(!this.processJWT(res.data.accessToken)){
        onError("Unable to process access token!");
        return false;
      }
      this.applyTokenToHeaders();

    }
    catch (err){
      handleAxiosErrors(err,onError);
      return false;
    }
    return true;
  }

  applyTokenToHeaders(){
    let at = this.accessToken;
    if(this.signedIn() && at!==""){
      axios.defaults.headers.common['Authorization'] = `Bearer ${at}`;
    }

  }

  signedIn(){
    try{
      return this.accessToken!=="";
    }
    catch (err){
      return false;
    }
  }

  processJWT(accessToken){
    try{
      let base64Url = accessToken.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''));
      let tokenData = JSON.parse(jsonPayload);
      if(!tokenData){
        return false;
      }

      this.accessToken=accessToken;
      this.userId=tokenData.user_id;
      this.username.value=tokenData.username;
      this.expiresAt=tokenData.exp;
      return true;
    }
    catch (err){
      console.error(`Failed to parse JWT token : ${err}`);
      return false;
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
