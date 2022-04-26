<template>
  <q-card class="height-100" v-if="currentChannel">
    <q-card-section>
      <q-avatar color="primary" text-color="white">{{ currentChannel.name[0].toUpperCase() }}</q-avatar>
      {{currentChannel.name}}
    </q-card-section>
    <q-card-section v-if="currentChannel.description">
      <q-separator></q-separator>
      {{currentChannel.description}}
    </q-card-section>
    <q-card-actions class="align-bottom">
      <q-btn @click="leave">Leave</q-btn>
      <q-btn v-if="showDeleteButton" @click="del">Delete</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import {channelsInfo, deleteChannel, leaveChannel} from "src/services/channel";
import AuthService from "src/services/auth";
import {toRefs,computed} from "vue";
import {ShowDialog} from "src/utils/utils";
import {useQuasar} from "quasar";

export default {
  name: "ChannelDetails",
  setup(){
    const {currentChannel, channels} =toRefs(channelsInfo);
    const $q = useQuasar();
    const showDeleteButton = computed(()=>{
      return (currentChannel && (currentChannel.value.creator === AuthService.userId));
    });

    return{
      currentChannel,
      showDeleteButton,

      async leave(){
        console.log(currentChannel.value);
        $q.loading.show({message: `Leaving channel...`});
        await leaveChannel(currentChannel.value.id,
          (errMessage) =>{
            ShowDialog($q,"Error", `Failed to leave channel : ${errMessage}`);
          });
        $q.loading.hide();
      },

      async del(){
        $q.loading.show({message: `Deleting channel...`});
        await deleteChannel(currentChannel.value.id,
          (errMessage) =>{
            ShowDialog($q,"Error", `Failed to delete channel : ${errMessage}`);
          });
        $q.loading.hide();
      }
    }
  }
}
</script>

<style scoped>

</style>
