<template>
  <div>

    <q-bar>
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
    </q-bar>


    <div class="row">
      <div class="col-3 q-pa-xs">
          <q-card  class="height-100">
            <q-card-section>
              Channels:
            </q-card-section>
            <q-card-section>
              <q-list bordered separator>
                <q-item
                  clickable
                  v-ripple
                  v-for="(chan, index) in channels"
                  :key="chan.id"
                  :index="index"
                  @click="selectChannel(index)"
                  :active="index===selectedChannelIdx"
                  active-class="active-channel"
                >
                  <q-item-section>{{chan.name}}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>


      </div>

      <div class="col q-pa-xs">
          <q-card class="height-100">
            <q-card-section>
              Messages:
            </q-card-section>
            <q-card-section>
              <div>
              </div>
            </q-card-section>
            <div class="message-div q-pa-xs" >

              <q-input dense outlined v-model="messageText">
                <template v-slot:after>
                  <q-btn round dense flat icon="send" />
                </template>
              </q-input>
            </div>
          </q-card>
      </div>
      <div class="col-3 q-pa-xs">

          <q-card class="height-100">
            <q-card-section>
              Channel details:
            </q-card-section>
            <q-card-section>

            </q-card-section>
          </q-card>
        </div>
    </div>


  </div>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue'
import AuthService from "src/services/auth"
import ChannelsService from "src/services/channel"
import ChannelDialog from "components/ChannelDialog";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

export default defineComponent({
  name: 'MainPage',
  setup(){
    const $r = useRouter();
    const $q = useQuasar();
    const channels = ref(null);
    const username = ref(null);
    const selectedChannel = ref(null);
    const selectedChannelIdx = ref(0);
    const messageText = ref(null);

    onMounted(()=>{
      if(!AuthService.signedIn()){
        $r.push("signin");
      }
      username.value = AuthService.username();

      AuthService.applyTokenToHeaders();
      ChannelsService.getAll().then(
        response =>{
          channels.value = response.data.channels;
          if(!selectedChannel.value && channels.value.length>0){
            selectedChannel.value = channels.value[0];
          }
        },
        error =>{
          console.log(error);
        }
      );
    });

    return{
      channels,
      selectedChannel,
      selectedChannelIdx,
      username,
      messageText,
      prompt: ref(false),
      address: ref(''),

      signOut(){
        AuthService.signOut();
        $r.push("/signin");
      },
      addChannel(){
        $q.dialog({
          component : ChannelDialog,
          persistent : true,
          componentProps:{
            operation : "New"
          }
        });
      },
      selectChannel(idx){
        selectedChannelIdx.value=idx;
        console.log(channels.value[idx].name)
      },

    }
  },

})
</script>
<style scoped >
.active-channel{
  color: white;
  background: #156ede;
}

.message-div {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.height-100{
  height: 95vh;
}

</style>
