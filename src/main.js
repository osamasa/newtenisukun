import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/base'
import vuetify from './plugins/vuetify';
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false

const firebaseConfig = {
    apiKey: "AIzaSyDSW9cH4jXyDdMpnyAvXJ_yoG6fo9PYJKs",
    authDomain: "mytenisransuuhyoukunv3.firebaseapp.com",
    databaseURL: "https://mytenisransuuhyoukunv3.firebaseio.com",
    projectId: "mytenisransuuhyoukunv3",
    storageBucket: "mytenisransuuhyoukunv3.appspot.com",
    messagingSenderId: "556741671747",
    appId: "1:556741671747:web:1e921cf2b0e247bb64cdf6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


new Vue({
    router,
    vuetify,
    store,
  render: function (h) { return h(App) }
}).$mount('#app')
