import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeRoutes from './home';
import Login from '../views/login.vue';
import { baseUrl } from '../services/config';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: baseUrl,
  routes: [...routes, ...HomeRoutes],
});

export default router;
