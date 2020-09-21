import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/login/login.vue')
  },
  {
    path: '/home',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/home/Home.vue'),
    redirect:'/homemain',
    children: [
      {
        path: '/homemain',
        name:'homemain',
        component:()=>import('../components/homeMai.vue')
      },
      {
        path: '/users',
        name:'users',
        component:()=>import('../components/user/users.vue')
      },
      {
        path:"/roles",
        name:'roles',
        component:()=>import('../components/power/roles.vue')
      },
      {
        path:'/rights',
        name:'rights',
        component:()=>import('../components/power/rights.vue')
      },
      {
        path:'/goods',
        name:'goods',
        component:()=>import('../components/goods/goods.vue'),
        
      },
      {
        path:'/goods/add',
        name:'goodsadd',
        component:()=>import('../components/goods/add.vue'),
        
      },
      {
        path:'/params',
        name:'params',
        component:()=>import('../components/goods/params.vue')
      },
      {
        path:'/categories',
        name:'categories',
        component:()=>import('../components/goods/categories.vue')
      },
      {
        path:'/orders',
        name:'orders',
        component:()=>import('../components/user/orders.vue')
      },
      {
        path:'/reports',
        name:'reports',
        component:()=>import('../components/user/reports.vue')
      }
     
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const took = window.sessionStorage.getItem('took')
  if (!took) return next('/login')
  next()


})

export default router
