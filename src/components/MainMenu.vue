<template>
  <div>
    <q-btn color="primary" icon="menu" flat>
      <q-menu>
        <q-list style="min-width: 100px">
          <q-item v-close-popup>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">{{ username[0].toUpperCase() }}</q-avatar>
            </q-item-section>
            <q-item-section>{{ username }}</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="addChannel">
            <q-item-section avatar> <q-icon name="add"></q-icon> </q-item-section>
            <q-item-section>Create channel</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="signOut">
            <q-item-section avatar> <q-icon name="logout"></q-icon></q-item-section>
            <q-item-section>Sign out</q-item-section>
          </q-item>

        </q-list>
      </q-menu>
    </q-btn>
  </div>

</template>

<script>
import ChannelDialog from "components/ChannelDialog";
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import AuthService from "src/services/auth";

export default {
  name: "MainMenu",
  props:{
    username : String
  },
  setup(){

    const $q = useQuasar();
    const $r = useRouter();

    return{
      addChannel(){
        $q.dialog({
          component : ChannelDialog,
          persistent : true,
          componentProps:{
            operation : "New"
          }
        });
      },
      signOut(){
        AuthService.signOut();
        $r.push("/signin");
      },
    }

  }
}
</script>

<style scoped>

</style>
