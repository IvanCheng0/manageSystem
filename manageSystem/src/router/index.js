import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login'
import Home from '../components/home'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      component: Login
    }, {
      path: '/home',
      component: Home
    },

  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  } else {
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
  }
})

export default router
