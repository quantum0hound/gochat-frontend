<template>
  <div class="row q-mt-md">

    <div class="col"></div>
    <div class="col-3">
      <q-form @submit="onSubmit" >
        <q-input
          filled
          v-model="username"
          label="Username"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          type="password"
          filled
          v-model="password"
          label="Password"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          type="password"
          filled
          v-model="passwordConfirm"
          label="Password confirm"
          :rules="[
            val => val && val.length > 0 || 'Please type something',
            val => val ===password  || 'Passwords don\'t match'
          ]"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary"/>
        </div>
      </q-form>
    </div>
    <div class="col"></div>
  </div>

</template>

<script>
import {ref} from "vue";
import AuthService from "src/services/auth"
import {ShowDialog} from "src/utils/utils";


export default {
  name: "SignUp",

  setup(){
    return {
      username : ref(""),
      password: ref(""),
      passwordConfirm: ref("")
    };
  },
  methods:{
    onSubmit(){
      this.$q.loading.show({message: `Signing up...`});
      AuthService.signUp(this.username,this.password)
      .then(response =>{
        this.$q.loading.hide();
        ShowDialog(this.$q,"Success", `You were succesfully registered`);
      })
      .catch(error =>{
        this.$q.loading.hide();
        ShowDialog(this.$q,"Error", `Failed to create user : ${error.response.data.message}`);
      });
    }
  }
}
</script>

<style scoped>

</style>
