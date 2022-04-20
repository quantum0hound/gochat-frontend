import { useQuasar } from 'quasar';

export function ShowDialog(quasarInstance, title, message) {
  quasarInstance.dialog({
    title: title,
    message: message
  }).onOk(() => {
    // console.log('OK')
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
