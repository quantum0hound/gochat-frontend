<template>
  <div>

    <div class="row">
      <div class="col-3 q-pa-xs">
          <q-card  class="height-100">
            <div class="row q-pa-sm">
              <div class="col">
                <MainMenu/>
              </div>
              <div class="col-10">

              </div>
            </div>

            <q-card-section>
              Channels:
            </q-card-section>
            <q-card-section>
              <q-list bordered separator>
                <q-item
                  clickable
                  v-ripple
                  v-for="[id, channel] in channels" :key="id"
                  @click="selectChannel(id)"
                  :active="currentChannel && id===currentChannel.id"
                  active-class="active-channel"
                >
                  <q-item-section>{{channel.name}}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions class="align-bottom" >
              <ChannelSearchInput style="width: 100%"/>
            </q-card-actions>
          </q-card>


      </div>

      <div class="col q-pa-xs">
          <q-card class="height-100">
            <q-card-section>
              Messages:
            </q-card-section>
            <q-card-section>
              <div>
                <q-chat-message
                  v-for="message in messages"
                  :key="message.id"
                  :text="[message.content]"
                />
              </div>
            </q-card-section>
            <div class="align-bottom q-pa-xs" >

              <q-input
                autofocus
                dense
                outlined
                v-model="messageText"
                @keypress.enter="sendMessage(messageText)"
              >
                <template v-slot:after>
                  <q-btn round dense flat icon="send"  @click="sendMessage(messageText)"/>
                </template>
              </q-input>
            </div>
          </q-card>
      </div>
      <div class="col-3 q-pa-xs">
        <ChannelDetails/>
      </div>
    </div>


  </div>
</template>

<script>
import {defineComponent, ref,toRefs, onMounted} from 'vue'
import AuthService from "src/services/auth"
import WebSocketService from "src/services/websocket"
import {channelsInfo,getUserChannels} from "src/services/channel"
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {ShowDialog} from "src/utils/utils";
import MainMenu from "components/MainMenu";
import ChannelSearchInput from "components/ChannelSearchInput";
import ChannelDetails from "components/ChannelDetails";


export default defineComponent({
  name: 'MainPage',
  components: {ChannelDetails, ChannelSearchInput, MainMenu},
  setup(){
    const $r = useRouter();
    const $q = useQuasar();
    const username = ref(null);
    const messageText = ref(null);
    const messages = ref([]);

    const {currentChannel, channels} =toRefs(channelsInfo);
    onMounted(async ()=>{
      await AuthService.refresh(errMessage=>{
        console.log(errMessage);
      });

      WebSocketService.connect()
      username.value = AuthService.username;

      await getUserChannels(
        (errMessage) =>{
          ShowDialog($q,"Error", `Failed to get channels : ${errMessage}`);
        }
      )

    });

    return{
      channelSearchText : ref(""),
      channels,
      currentChannel,
      username,
      messageText,
      messages,
      prompt: ref(false),
      address: ref(''),

      selectChannel(idx){
        console.log("selecting" + idx)
        currentChannel.value = channels.value.get(idx);

        // console.log(channels.value[idx].name);
        // WebSocketService.connectToChannel(
        //   channels.value[idx].id,
        //   (event)=>{
        //     try{
        //       let message = JSON.parse(event.data);
        //       messages.value.push(message);
        //     }
        //     catch (err){
        //       console.error(`Failed to parse websocket data: ${event.data}, ${err}`);
        //     }
        //   }
        // );
        // messages.value=[];
      },

      sendMessage(content){
        let message = {
          content : content,
          userId : AuthService.userId
        }
        WebSocketService.sendMessage(JSON.stringify(message));
      }

    }
  },

})
</script>
<style scoped >
.active-channel{
  color: white;
  background: #156ede;
}

</style>
