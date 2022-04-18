<template>
  <div class="row q-pt-md bg-grey-10 text-white main-dark" >

    <div class="col"></div>
    <div class="col-3">
      <q-form @submit="onSubmit" >
        <q-input
          dark
          filled
          v-model="username"
          label="Username"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          dark
          type="password"
          filled
          v-model="password"
          label="Password"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <div>
          <q-btn label="SIGN IN" type="submit" color="primary"/>
        </div>
        <div class="q-pt-md">Not registered? <a href="/signup">Register...</a></div>
      </q-form>


    </div>
    <div class="col"></div>
  </div>

</template>

<script>
import {ref} from "vue";
import AuthService from "src/services/auth"
import {ShowDialog} from "src/utils/utils";
import FingerprintJS from '@fingerprintjs/fingerprintjs'


export default {
  name: "SignIn",

  setup(){
    return {
      username : ref(""),
      password : ref(""),
    };
  },
  methods:{
    onSubmit(){
      this.$q.loading.show({message: `Signing in...`});
      let username = this.username;
      console.log(this.$store.state.auth.loggedIn)

      AuthService.signIn(this.username,this.password).then(
          response =>{
            console.log(response);
            let accessToken = response.data.accessToken;

            localStorage.setItem("accessToken",accessToken);
            localStorage.setItem("username",username);
            localStorage.setItem("loggedIn","true");

            AuthService.applyTokenToHeaders();

            this.$store.commit("auth/signInSuccess",{username,accessToken});
            this.$router.push("/");
          },

          error =>{
            localStorage.setItem("accessToken","");
            localStorage.setItem("username","");
            localStorage.setItem("loggedIn","false");

            let errorMessage = "";
            if(error.response.data.message){
              errorMessage = error.response.data.message;
            }
            else {
              errorMessage = error;
            }
            ShowDialog(this.$q,"Error", `Failed to sign in : ${errorMessage}`);
          }
      )
      .finally(()=>{
        this.$q.loading.hide();
      })
    }
  }
}
</script>

<style scoped>

</style>
