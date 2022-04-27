import { boot } from 'quasar/wrappers'
import axios from "axios";
import AuthService from "src/services/auth"
import {nowTs} from "src/utils/utils"



export default boot( ({router}) => {
  axios.interceptors.request.use( async config =>{
    if(AuthService.expiresAt!==0 && config.url!=="/api/auth/refresh"){
      if(AuthService.expiresAt < nowTs()){
        console.log("refreshing access token");
        await AuthService.refresh(errMessage=>{
          console.log(errMessage);
        });
      }
    }

    return config;
  });

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }
      return AuthService.refresh(errMessage=>{
        console.log(errMessage);
      }).then( async () =>{
        if(!AuthService.signedIn()){
          await router.push("/signin");
        }
        error.config.headers['Authorization'] = 'Bearer ' + AuthService.accessToken;
        error.config.baseURL = undefined;
        return axios.request(error.config)
      })

    });
})
