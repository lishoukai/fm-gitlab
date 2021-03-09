import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import App from './app.vue';
import router from './router';
import store from './store';
import './plugins/index';

import 'normalize.css';
import './assets/styles/style.scss';

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
