import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import tasklist from './tasklist';

Vue.use(Vuex);

export const store = new Vuex.Store({	
	//состояние хранилища сохраняется в localStorage
	plugins: [createPersistedState({
		storage: window.localStorage
	})], 
    modules: {
        tasklist
    }
	//strict: process.env.NODE_ENV !== 'production'
});