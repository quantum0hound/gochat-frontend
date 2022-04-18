<template>
  <div class="bg-grey-10 text-white main-dark">
    <div class="row">
      <div class="col-3">
        <q-item-label header>Channels: <q-btn @click="prompt = true">add</q-btn></q-item-label>
        <q-list dark bordered separator>
          <q-item clickable v-ripple>
            <q-item-section>Single line item</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Item with caption</q-item-label>
              <q-item-label caption>Caption</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label overline>OVERLINE</q-item-label>
              <q-item-label>Item with caption</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col">

      </div>
      <div class="col-3">
        <div>User name: </div>
      </div>
    </div>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your address</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="address" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add address" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {defineComponent, ref} from 'vue'
import AuthService from "src/services/auth"
import ChannelsService from "src/services/channels"
import ChannelDialog from "components/ChannelDialog";

export default defineComponent({
  name: 'MainPage',
  setup(){
    return{
      prompt: ref(false),
      address: ref('')
    }
  },
  mounted() {

    if(!AuthService.signedIn()){
      this.$router.push("signin");
    }

    AuthService.applyTokenToHeaders();
    //ChannelsService.getAll();
  },
  methods:{
    async addChannel(){

      this.$q.dialog({
        component : ChannelDialog,
        persistent: true
      });
    }
  }

  // Id          int    `json:"id" db:"id"`
  // Name        string `json:"name" db:"name"`
  // Description string `json:"description" db:"description"`
  // Creator     int    `json:"creator" db:"creator"`
})
</script>
<style scoped>

</style>
