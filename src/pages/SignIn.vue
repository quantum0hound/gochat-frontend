<template>
  <div class="row q-pt-md" >

    <div class="col"></div>
    <div class="col-3">
      <q-card>
        <q-card-section>
          <div class="text-h6">Sign in</div>
        </q-card-section>
        <q-card-section>
          <q-input
            ref="usernameRef"
            label="Username"
            dense
            v-model="username"
            lazy-rules
            :rules="usernameRules"
          />
        </q-card-section>
        <q-card-section>
          <q-input
            ref="passwordRef"
            type="password"
            dense
            v-model="password"
            lazy-rules
            :rules="passwordRules"
            label="Password"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Sign in"  color="primary" @click="signIn"/>
        </q-card-actions>

      </q-card>

      <div class="q-pt-md">Not registered? <a href="/signup">Register...</a></div>
    </div>
    <div class="col"></div>
  </div>

</template>

<script>
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import {ref} from "vue";
import AuthService from "src/services/auth"
import {ShowDialog} from "src/utils/utils";


export default {
  name: "SignIn",

  setup(){
    const $q = useQuasar();
    const $r = useRouter();
    const username = ref(null);
    const usernameRef = ref(null);

    const password = ref(null);
    const passwordRef = ref(null);

    return {
      username,
      usernameRef,
      usernameRules: AuthService.nameFormatRules(5),

      password,
      passwordRef,
      passwordRules:AuthService.nameFormatRules(5),

      async signIn(){
        usernameRef.value.validate();
        passwordRef.value.validate();
        if (usernameRef.value.hasError || passwordRef.value.hasError) {
          alert("validation failure");
          return;
        }

        $q.loading.show({message: `Signing in...`});

        AuthService.signIn(username.value,password.value).then(
          response =>{
            console.log(response);
            let accessToken = response.data.accessToken;

            localStorage.setItem("accessToken",accessToken);
            localStorage.setItem("username",username.value);
            localStorage.setItem("loggedIn","true");

            AuthService.applyTokenToHeaders();

            $r.push("/");
          },

          error =>{
            localStorage.setItem("accessToken","");
            localStorage.setItem("username","");
            localStorage.setItem("loggedIn","false");

            let errorMessage;
            if(error.response && error.response.data && error.response.data.message){
              errorMessage = error.response.data.message;
            }
            else {
              errorMessage = error;
            }
            ShowDialog($q,"Error", `Failed to sign in : ${errorMessage}`);
          }
        ).finally(()=>{
          $q.loading.hide();
        });
      }
    };
  },

}
</script>

<style scoped>

</style>
