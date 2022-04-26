import { boot } from 'quasar/wrappers'
import axios from "axios";
import AuthService from "src/services/auth"


export default boot( (/* { app, router, ... } */) => {
  axios.interceptors.request.use( async config =>{
    if(AuthService.expiresAt!==0){
      let now = Date.now() / 1000 | 0;
      if(AuthService.expiresAt < now){
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
      }).then( () =>{
        error.config.headers['Authorization'] = 'Bearer ' + AuthService.accessToken;
        error.config.baseURL = undefined;
        return axios.request(error.config)
      })

    });
})
