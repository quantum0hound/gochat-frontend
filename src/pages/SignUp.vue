<template>
  <div class="row q-pt-md" >

    <div class="col"></div>
    <div class="col-3">
      <q-card>
        <q-card-section>
          <div class="text-h6">Sign up</div>
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
        <q-card-section>
          <q-input
            ref="passwordConfirmRef"
            type="password"
            dense
            v-model="passwordConfirm"
            lazy-rules
            :rules="passwordConfirmRules"
            label="Confirm password"
            @keypress.enter="signUp"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Sign up"  color="primary" @click="signUp"/>
        </q-card-actions>
      </q-card>

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
  name: "SignUp",

  setup(){
    const $q = useQuasar();
    const $r = useRouter();
    const username = ref(null);
    const usernameRef = ref(null);

    const password = ref(null);
    const passwordRef = ref(null);

    const passwordConfirm = ref(null);
    const passwordConfirmRef = ref(null);

    return {
      username,
      usernameRef,
      usernameRules:AuthService.nameFormatRules(5),

      password,
      passwordRef,
      passwordRules:AuthService.nameFormatRules(5),

      passwordConfirm,
      passwordConfirmRef,
      passwordConfirmRules:[
        val => (val === password.value) || 'Passwords do not match',
      ],

      async signUp(){
        usernameRef.value.validate();
        passwordRef.value.validate();
        if (
          usernameRef.value.hasError ||
          passwordRef.value.hasError ||
          passwordConfirmRef.value.hasError
        ) {
          alert("validation failure");
          return;
        }
        let res = await AuthService.signUp(
          username.value,
          password.value,
          (errMessage) =>{
            ShowDialog($q,"Error", `Failed to create user : ${errMessage}`);
          }
        );
        $q.loading.hide();
        if(res===true){
          ShowDialog($q,"Success", `You were succesfully registered`);
          await $r.push("/signin");
        }

      }
    };
  },

}
</script>

<style scoped>

</style>
