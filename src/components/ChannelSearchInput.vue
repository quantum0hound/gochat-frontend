<template>
  <q-input dense v-model="pattern" @keyup="search(pattern)"></q-input>
</template>

<script>
import {ref} from "vue"
import {searchForChannels} from "src/services/channel";

export default {
name: "ChannelSearchInput",

  setup(){
    return {
      pattern : ref(""),

      async search(pattern){
        console.log("searching with "+ pattern);
        let channels = await searchForChannels(pattern);
        if(channels){
          console.log(channels);
        }
        return true;
      }
    }
  }
}
</script>

<style scoped>

</style>
