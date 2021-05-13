import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes  = [
  {
    path: '/',
    component: () => import('@/pages/main'),
  },
  // {
  //   path: '/enter',
  //   component: () => import('@/view/enter/Index'),
  // },
  // {
  //   path: '/exit',
  //   component: () => import('@/view/exit/Index'),
  // },
  // {
  //   path: '/pay',
  //   component: () => import('@/view/pay/Index'),
  // },
  // {
  //   path: '/pay/result',
  //   component: () => import('@/view/pay/components/Result'),
  // },
  // {
  //   path: '/lbl/result',
  //   component: () => import('@/view/lbl-pay/Result'),
  // },
  // {
  //   path: '/lbl/pay',
  //   component: () => import('@/view/lbl-pay/Index'),
  // },
  // {
  //   path: '/video',
  //   component: () => import('@/view/video/Index'),
  // },
  // {
  //   path: '/img',
  //   component: () => import('@/view/img/Index'),
  // },
  // {
  //   path: '/loading',
  //   component: () => import('@/view/load/Index'),
  // },
  // {
  //   path: '/loading',
  //   component: () => import('@/view/load/Index'),
  // },
  // {
  //   path: '/config',
  //   component: () => import('@/pages/config'),
  // },
]

const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

export default router
