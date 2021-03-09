import { RouteConfig } from 'vue-router';

const Home = () => import('@/views/home.vue');

const homeRoute: RouteConfig[] = [{
  path: '/home',
  name: 'home',
  component: Home,
},
];

export default homeRoute;
