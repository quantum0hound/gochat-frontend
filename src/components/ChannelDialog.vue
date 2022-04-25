<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">{{ operation }} channel</div>
      </q-card-section>
      <q-card-section>
        <q-input
          autofocus
          ref="nameRef"
          dense
          v-model="name"
          label="Channel name"
          :rules="nameRules"
        />
      </q-card-section>
      <q-card-section>
        <q-input
          dense
          v-model="description"
          label="Channel description"
          v-on:keypress.enter="onOKClick"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {ref} from "vue";
import AuthService from "src/services/auth";
import {createChannel} from "src/services/channel";
import {ShowDialog} from "src/utils/utils";

export default {
  props: {
    operation : String
  },

  emits: [
    ...useDialogPluginComponent.emits
  ],

  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    const $q = useQuasar();
    const name = ref(null);
    const nameRef = ref(null);
    const description = ref(null);


    return {

      name,
      nameRef,
      nameRules: AuthService.nameFormatRules(5),

      description,

      dialogRef,
      onDialogHide,

      async onOKClick () {
        nameRef.value.validate();

        if (nameRef.value.hasError) {
          ShowDialog($q,"Error","Failed to validate channel data");
          return;
        }

        $q.loading.show({message: `Creating channel...`});
        await createChannel(name.value,
          description.value,
          (errMessage) =>{
            ShowDialog($q,"Error", `Failed to create channel : ${errMessage}`);
        });
        $q.loading.hide();
        onDialogOK();

      },
      onCancelClick: onDialogCancel
    }
  }
}
</script>
