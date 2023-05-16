import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import TaskList from './components/TaskList';
import E404 from './components/E404';

const routes = [
	{
		path: '',
		redirect: {name: 'tasklist'}
	},
	{
		name: 'tasklist',
		path: '/tasklist',
		component: TaskList,
	},
	{
		path: '/:pathMatch(.*)*',
		component: E404
	},
];

export const router = new VueRouter({
	routes,
	mode: 'history',
});