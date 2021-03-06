import Vue from 'vue'
import VueRouter from 'vue-router'
import $ from 'jquery'

Vue.use(VueRouter)

const checkToken = (to, from, next) => {
  let token = localStorage.getItem('token');
  if (token === 'undefined' || token === null || token === '') {
    next('/login');
  } else {
    next();
  }
};

const tokenActive = (to, from, next) => {
  let token = localStorage.getItem('token');
  if (token === 'undefined' || token === null || token === '') {
    next();
  } else {
    next('/');
  }
};

const routes = [
  {
    path: '/', component: () => import('../views/products/products'),
    redirect: '/products',
    children: [
      // dashboard
      { path: '/products', component: () => import('../views/products/products') },
    ],
    beforeEnter(to, from, next) {
      checkToken(to, from, next);
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/Login.vue'),
    beforeEnter(to, from, next) {
      tokenActive(to, from, next);
    }
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.afterEach(() => {
  $('#preloader').hide();
});

export default router
