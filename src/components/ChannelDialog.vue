<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-form @submit="onSubmit" >
      <q-input
        dark
        filled
        v-model="name"
        label="Channel name"
        :rules="[ val => val && val.length > 5 || 'Please type something']"
      />

      <q-input
        dark
        filled
        v-model="description"
        label="Description"
      />
      <div>
        <q-btn label="Create" type="submit" color="primary"/>
      </div>
    </q-form>
  </q-dialog>
</template>

<script>

import {ref} from "vue";

export default {
  name: "ChannelDialog",
  setup(){
    const name = ref("");
    const description = ref("");

    return {
      name,
      description,
    };
  },

  props: {
  },
  emits: [
    'ok', 'hide'
  ],
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onSubmit () {
      alert("Hi")
      this.$emit('ok')
      this.hide()
    }
  }
}
</script>

<style scoped>
</style>
