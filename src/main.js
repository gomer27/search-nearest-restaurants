import Vue from 'vue'
import App from './App.vue'
import { appAxios } from './utils/appAxios';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
})

Vue.prototype.$appAxios = appAxios;
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
