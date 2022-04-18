import { createStore } from 'vuex'
import auth from './auth'

export default function () {
  const Store = createStore({
    modules: {
      auth
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
}
