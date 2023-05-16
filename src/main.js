import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'

import { store } from './store';
import { router } from './routes.js';

import { apolloProvider } from './apollo.js'

new Vue({
    el: '#app',
    store,
    router,
    vuetify,
    apolloProvider,
    render: h => h(App),
});

