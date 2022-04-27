import { useQuasar } from 'quasar';
export function nowTs(){
  return Date.now() / 1000 | 0;
}

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
