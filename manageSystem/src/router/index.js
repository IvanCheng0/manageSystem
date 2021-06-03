import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login'
import Home from '../components/home'
import Welcome from '../components/welcome'
import UserList from '../components/user/userList'
import Rights from '../components/power/rights'
import Roles from '../components/power/roles'
import Cate from '../components/goods/cate'
import Params from '../components/goods/params'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home, redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome, },
        { path: '/users', component: UserList, },
        { path: '/rights', component: Rights, },
        { path: '/roles', component: Roles, },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
      ]

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
