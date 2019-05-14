import Vue from 'vue'
import App from './App'
import io from 'socket.io-client';

Vue.config.productionTip = false

Vue.prototype.$socket = io('localhost:3001');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
