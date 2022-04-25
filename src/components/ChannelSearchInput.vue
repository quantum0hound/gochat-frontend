<template>
<!--  <q-input dense v-model="pattern" @keyup="search(pattern)"></q-input>-->
  <q-select
    v-model="model"
    dense
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :options="channels"
    label="Type channel name"
    @filter="filterFn"
    @update:model-value="join(model.id)"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
    <template v-slot:no-option>

      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import {ref} from "vue"
import {searchForChannels, joinChannel, channelsInfo} from "src/services/channel";
import {ShowDialog} from "src/utils/utils";
import {useQuasar} from "quasar";

export default {
name: "ChannelSearchInput",

  setup(){
  const $q = useQuasar();
    const channels = ref(null);
    const model = ref(null);
    return {
      channels,
      model,
      pattern : ref(""),

      async join(id){
        await joinChannel(
          id,
          (errMessage) =>{
            ShowDialog($q,"Error",`Failed to join channel: ` + errMessage)
          }
        );
        model.value="";

      },

      filterFn (val, update, abort) {

        update(async () => {
          console.log("filter called with " +val)
          channels.value = await searchForChannels(
            val,
            (errMessage) =>{
              ShowDialog($q,"Error",`Failed to get channels data: ` + errMessage)
            }
          );

        })
      }
    }
  }
}
</script>

<style scoped>

</style>
