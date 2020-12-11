import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BootstrapVue } from 'bootstrap-vue'

import '@popperjs/core'
import 'firebase/firestore'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
library.add(faSpinner, fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

const firebaseConfig = {
  apiKey: 'AIzaSyAKsRDj_JUvt4fN9GsgaHh8qgA8FSHmNRY',
  authDomain: 'resto-eli-tom.firebaseapp.com',
  databaseURL: 'https://resto-eli-tom.firebaseio.com',
  projectId: 'resto-eli-tom',
  storageBucket: 'resto-eli-tom.appspot.com',
  messagingSenderId: '464935441025',
  appId: '1:464935441025:web:20d26cf45735270dbcb380'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()
export const fv = firebase.firestore.FieldValue

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
